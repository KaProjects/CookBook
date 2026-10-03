# CookBook

Recipe book and menu planner for the household. Each user is a cook with recipes
of their own, filterable by category and ingredient, with a picture and a PDF
export. `backend` is a Quarkus REST service over MariaDB, `frontend` is the React
app, and `modeling` holds the original design sketches.

It follows the same structure, tooling and conventions as the Trading and
Accountant web projects.

## Web development

Run the complete local quality suite from this directory - backend tests,
frontend lint and component tests. CI runs the same script on every push and
pull request (`.github/workflows/verify.yml`):

```sh
./verify.sh
```

Run the backend and frontend in separate terminals:

```sh
(cd backend && ./build_dev.sh)
(cd frontend && ./build_dev.sh)
```

Or run both in one container:

```sh
./deploy/build_dev.sh
```

The frontend is served on http://localhost:3002 and the backend on
http://localhost:9092 (Swagger UI at http://localhost:9092/docs), with the remote
debug port on 5007. These are offset by two from the Trading web project and by
one from Accountant web, so all three stacks can run at the same time. Every port
is bound to this machine's loopback only: the API has no authentication.

Plain development mode activates the backend Maven `dev` profile: an in-memory H2
database in MySQL mode, built on every start from the production table script
`backend/sql/createTables.sql` and filled with sample recipes from
`backend/src/dev/resources/createDevDb.sql`. The users come from
`dev-users.json` (Stanley and Anna), so a clone that cannot decrypt the real
`users.json` runs as well.

Run development mode against the production database:

```sh
(cd backend && ./build_dev.sh --db-prod)
```

The `--db-prod` flag skips the Maven `dev` profile and exports the production
database configuration from `deploy/.env.prod` instead. Plain development mode
deliberately does not read that file, because environment variables outrank
`application-dev.properties`.

## Tests

- **Backend** (`./mvnw test`): REST endpoints, the error contract, response
  snapshots, services with mocked persistence, the DAO against H2, image
  processing, validators and error mappers, and `NativeReflectionTest`, the
  guard that every type crossing the REST boundary is registered for
  reflection. The coverage of the whole suite is written to
  `backend/target/jacoco-report/index.html`.
- **Response snapshots**: `ResponseSnapshotTest` pins the JSON of every read
  endpoint on the test fixtures. After an intended change, record them again with
  `./mvnw test -Dtest=ResponseSnapshotTest -Dsnapshots.update=true` and review
  the diff of `src/test/resources/snapshots/`.
- **Native image** (`backend/native_smoke.sh`): builds the native binary that
  production runs, starts it on the production runtime image against MariaDB 11
  with the test fixtures, and checks every snapshot endpoint, an image upload and
  update, and the error answers. It catches what no JVM test can - a class
  missing its reflection registration, a native library missing from the image.
  Run it after changing dependencies, DTOs or the Dockerfile; it needs Docker.
- **Frontend** (`npm test`): services, the data hook, the shared state, every
  component and view, and the routing.

## API

Every error is answered as RFC 9457 problem details
(`application/problem+json`): `title`, `status`, `detail`, the `violations` of an
invalid request (one per field, such as `steps[1].text`), and the `errorId` an
unexpected failure was logged under.

| Method | Path | |
|---|---|---|
| GET | `/user` | the users |
| GET | `/user/{user}/config` | how the frontend is laid out for the user |
| GET | `/user/{user}/menu` | the user's categories and ingredients, sorted |
| GET | `/user/{user}/recipes?category=&ingredient=` | the user's recipes by category, optionally filtered (exact matches) |
| GET | `/recipe/{id}` | a recipe with its steps and ingredients |
| POST | `/recipe` | creates a recipe, `201` with the stored recipe |
| PUT | `/recipe/{id}` | replaces a recipe's name, category, picture, steps and ingredients |

Pictures travel as base64 data URLs. The backend stores them as JPEG, scaled
down to 1600 px at most; a picture sent back unchanged is not re-encoded.

## Structure

```
backend/src/main/java/org/kaleta/
  persistence/{api,impl,entity}   DAO interfaces, their JPA implementations, entities
  rest/                           resources
  rest/{dto,error,validation}     request and response bodies, problem details, constraints
  service/                        recipes, users, image processing
frontend/src/
  fetch.js                        useData: a backend path, answered for that path only
  services/                       API paths and writes, error messages, recipe form logic
  state/                          the user, their layout and the PDF target, shared by context
  components/, views/             the main bar and editor parts; one view per route
```

The frontend keeps what it shows in the address - `/recipe/:id`,
`/recipe/:id/edit`, `/create`, `/?category=`, `/?ingredient=` - so a reload, a
bookmark and the back button keep it.

## Deployment

Everything deployment-related lives in `deploy/`. A single command runs the
checks, builds both images for `linux/amd64`, streams them to the NAS over SSH,
updates the remote stack with Docker Compose, waits for it to serve traffic and
rolls back to the previous deployment if it does not:

```sh
./deploy/build_deploy.sh
```

The backend is built as a native image by default; `--jvm` builds the JVM image
from `backend/Dockerfile` instead, which is far quicker and needs no native
toolchain. `--skip-tests`, `--skip-builds` and `--no-rollback` are also
available. Only nginx is published on the NAS; the backend is reached through it.

Configuration values live in two files:

- `deploy/.env.build` - where the NAS is (host, user, target directory)
- `deploy/.env.prod` - everything else: version, image names, ports, database
  credentials, origins, memory limits. Encrypted with git-crypt.

`backend/src/main/resources/application.properties` contains only `${...}`
placeholders, so it stays readable in git and carries no secrets. The users are
`backend/src/main/resources/users.json`, also encrypted; `users.resource` can
point at a `file:` path instead, to change them without a new build.

Bump every version in one step:

```sh
./deploy/bump_version.sh 2.2
```

Release notes are in `deploy/about_version.md`.

## How the frontend reaches the backend

The React app calls a same-origin `/api` prefix. In production nginx proxies it
to the backend container (`deploy/nginx.conf`); in development `setupProxy.js`
does the same. No host or port is baked into the bundle.
