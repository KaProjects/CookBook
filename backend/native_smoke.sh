#!/usr/bin/env bash
#
# Checks that the native binary answers the way the JVM build does.
#
# A native image keeps only what it was told to keep, and resolves at build time whatever is done
# during static initialisation, so it can fail in ways no JVM test sees: a response type missing
# its reflection registration serialises as an empty object, image processing needs the AWT
# support compiled in, and sorting needs the Slovak locale built in. This builds the native binary
# in a container, runs it against MariaDB loaded with the same tables and fixtures the tests use,
# compares every endpoint pinned by ResponseSnapshotTest with its recorded snapshot, uploads and
# updates a recipe with a transparent PNG, and checks that errors are answered as problem details.
#
# Needs Docker and python3. Everything it starts is removed when it ends.
#
#   ./native_smoke.sh               build the binary, then check it
#   ./native_smoke.sh --skip-build  check the binary already in target/

set -euo pipefail

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_ID="cookbook-native-smoke-$$"
WORK_DIR="$(mktemp -d)"
HOST_PORT="${NATIVE_SMOKE_PORT:-18082}"
RUNNER_IMAGE="$RUN_ID-runtime"

cleanup() {
  docker rm -f "$RUN_ID-app" "$RUN_ID-db" >/dev/null 2>&1 || true
  docker network rm "$RUN_ID" >/dev/null 2>&1 || true
  docker image rm "$RUNNER_IMAGE" >/dev/null 2>&1 || true
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

cd "$BACKEND_DIR"

if [[ "${1:-}" != "--skip-build" ]]; then
  ./mvnw -B -q package -Pnative -DskipTests -Dquarkus.native.container-build=true
fi

RUNNER="$(ls target/*-runner 2>/dev/null | head -1)"
if [[ -z "$RUNNER" ]]; then
  printf 'No native binary in target/ - run without --skip-build.\n' >&2
  exit 1
fi

# The production image's runtime stage, so the binary is checked on what it will run on.
docker build -q --target runtime-base -t "$RUNNER_IMAGE" -f src/main/docker/Dockerfile.native-multistage . >/dev/null

python3 -c 'import secrets; print(secrets.token_hex(12))' > "$WORK_DIR/dbpw"
cp sql/createTables.sql "$WORK_DIR/1-tables.sql"
cp src/test/resources/createTestDb.sql "$WORK_DIR/2-fixtures.sql"
cp src/test/resources/users.json "$WORK_DIR/users.json"

docker network create "$RUN_ID" >/dev/null
docker run -d --name "$RUN_ID-db" --network "$RUN_ID" \
  -e MARIADB_ROOT_PASSWORD="$(cat "$WORK_DIR/dbpw")" -e MARIADB_DATABASE=cookbook \
  -v "$WORK_DIR/1-tables.sql:/docker-entrypoint-initdb.d/1-tables.sql:ro" \
  -v "$WORK_DIR/2-fixtures.sql:/docker-entrypoint-initdb.d/2-fixtures.sql:ro" \
  mariadb:11 >/dev/null

printf 'Waiting for the database'
for _ in $(seq 1 60); do
  if docker exec "$RUN_ID-db" mariadb -uroot -p"$(cat "$WORK_DIR/dbpw")" cookbook \
      -e 'SELECT COUNT(*) FROM Step' >/dev/null 2>&1; then
    break
  fi
  printf '.'
  sleep 2
done
printf '\n'

# The binary runs from its build directory, where the JDK libraries java.awt loads were built next
# to it - the production image copies them beside the binary the same way.
# The fixtures belong to the test users, not to the ones in the encrypted production file the
# binary embeds, so the binary is pointed at a mounted copy of the test users instead.
docker run -d --name "$RUN_ID-app" --network "$RUN_ID" -p "127.0.0.1:$HOST_PORT:8080" \
  -v "$BACKEND_DIR/target:/work/target:ro" \
  -v "$WORK_DIR/users.json:/work/config/users.json:ro" \
  -e JDBC_URL="jdbc:mariadb://$RUN_ID-db:3306/cookbook" -e DB_KIND=mariadb \
  -e DB_USERNAME=root -e DB_PASSWORD="$(cat "$WORK_DIR/dbpw")" \
  -e HTTP_PORT=8080 -e FRONTEND_ORIGIN=http://smoke.test \
  --entrypoint "/work/$RUNNER" \
  "$RUNNER_IMAGE" -Dquarkus.http.host=0.0.0.0 -Dusers.resource=file:/work/config/users.json >/dev/null

for _ in $(seq 1 30); do
  curl -s -o /dev/null "http://localhost:$HOST_PORT/user" && break
  sleep 1
done

if BASE_URL="http://localhost:$HOST_PORT" python3 - <<'PYTHON'
import base64, json, os, re, struct, sys, urllib.error, urllib.request, zlib

base = os.environ["BASE_URL"]

def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(base + path, data=data, method=method,
                                     headers={"Content-Type": "application/json"} if data else {})
    try:
        with urllib.request.urlopen(request) as response:
            return response.status, response.headers.get("Content-Type", ""), response.read().decode()
    except urllib.error.HTTPError as error:
        return error.code, error.headers.get("Content-Type", ""), error.read().decode()

failures = []

paths = re.findall(r'^\s*"(/[^"]+)",', open("src/test/java/org/kaleta/rest/ResponseSnapshotTest.java").read(), re.M)
for path in paths:
    status, _, body = call("GET", path)
    snapshot = json.load(open("src/test/resources/snapshots/" + path[1:].replace("/", "_") + ".json"))
    if status != 200 or json.loads(body) != snapshot:
        failures.append(f"{path}: {status} {body[:200]}")
print(f"{len(paths) - len(failures)}/{len(paths)} endpoints answer as the JVM build does")

def transparent_png(width, height):
    rows = b"".join(b"\x00" + b"".join(struct.pack("BBBB", x % 256, y % 256, 90, (x * y) % 256) for x in range(width))
                    for y in range(height))
    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xffffffff)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(rows)) + chunk(b"IEND", b""))

image = "data:image/png;base64," + base64.b64encode(transparent_png(1800, 300)).decode()
recipe = {"cook": "writer", "name": "Šalát", "category": "Šaláty", "image": image,
          "steps": [{"number": 2, "text": "mix", "optional": False}, {"number": 1, "text": "chop", "optional": True}],
          "ingredients": [{"name": "Uhorka", "quantity": "1 ks", "optional": False}]}
status, _, body = call("POST", "/recipe", recipe)
if status != 201:
    failures.append(f"POST /recipe: {status} {body[:300]}")
else:
    created = json.loads(body)
    stored = json.loads(call("GET", "/recipe/" + created["id"])[2])
    jpeg = base64.b64decode(stored["image"].split(",", 1)[1])
    if not stored["image"].startswith("data:image/jpeg;base64,") or jpeg[:2] != b"\xff\xd8":
        failures.append("the uploaded image was not stored as a JPEG")
    if [step["text"] for step in stored["steps"]] != ["chop", "mix"] or stored["name"] != "Šalát":
        failures.append(f"the created recipe reads back differently: {stored}")
    update = {key: stored[key] for key in ("name", "category", "image", "steps", "ingredients")}
    update["name"] = "Uhorkový šalát"
    status, _, body = call("PUT", "/recipe/" + created["id"], update)
    if status != 200 or json.loads(body)["image"] != stored["image"]:
        failures.append(f"PUT /recipe: {status} {body[:300]}")
    listing = json.loads(call("GET", "/user/writer/recipes")[2])
    if listing != {"categories": [{"name": "Šaláty", "recipes": [
            {"id": created["id"], "name": "Uhorkový šalát", "hasImage": True, "hasSteps": True}]}]}:
        failures.append(f"GET /user/writer/recipes: {listing}")
print("recipe create, image upload and update checked")

def expect_problem(method, path, status, body=None):
    actual, content_type, text = call(method, path, body)
    problem = json.loads(text) if text.startswith("{") else {}
    if actual != status or "application/problem+json" not in content_type or problem.get("status") != status:
        failures.append(f"{method} {path}: expected a {status} problem, got {actual} {content_type} {text[:200]}")

expect_problem("GET", "/recipe/missing", 404)
expect_problem("GET", "/user/nobody/menu", 404)
expect_problem("GET", "/nothing/here", 404)
expect_problem("POST", "/recipe", 400, {"cook": "nobody", "name": "", "category": "x", "steps": [], "ingredients": []})
expect_problem("POST", "/recipe", 400, {**recipe, "image": "data:image/png;base64,aGVsbG8="})

for failure in failures:
    print("FAILED " + failure)
sys.exit(1 if failures else 0)
PYTHON
then
  exit 0
else
  printf -- '--- native application, errors and their causes ---\n' >&2
  docker logs "$RUN_ID-app" 2>&1 | grep -E 'ERROR|Caused by|Exception' >&2 || true
  exit 1
fi
