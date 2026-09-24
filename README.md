# CookBook

Recipe book and weekly menu planner. `backend` is a Quarkus REST service over
MySQL, `frontend` is the React app, and `modeling` holds the original design
sketches.

## Web development

Run the complete local quality suite from this directory:

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
http://localhost:9092 (Swagger UI at http://localhost:9092/api/docs), with the
remote debug port on 5007. These are offset by two from the Trading web project
(and by one from Accountant web) so all three stacks can run at the same time.

Plain development mode activates the backend Maven `dev` profile: an in-memory H2
database in MySQL mode, seeded with sample recipes from
`backend/src/dev/resources/createDevDb.sql`.

Run development mode against the production database:

```sh
(cd backend && ./build_dev.sh --db-prod)
```

The `--db-prod` flag skips the Maven `dev` profile and exports the production
database configuration from `deploy/.env.prod` instead. Plain development mode
deliberately does not read that file, because environment variables outrank
`application-dev.properties`.

## Deployment

Everything deployment-related lives in `deploy/`. A single command runs the
checks, builds both images for `linux/amd64`, streams them to the NAS over SSH
and updates the remote stack with Docker Compose:

```sh
./deploy/build_deploy.sh
```

The backend is built as a native image by default; `--jvm` builds the JVM image
from `backend/Dockerfile` instead, which is far quicker and needs no native
toolchain. `--skip-tests` and `--skip-builds` are also available.

Configuration values live in two files:

- `deploy/.env.build` - where the NAS is (host, user, target directory)
- `deploy/.env.prod` - everything else: version, image names, ports, database
  credentials, origins, memory limits. Encrypted with git-crypt.

`backend/src/main/resources/application.properties` contains only `${...}`
placeholders, so it stays readable in git and carries no secrets.

Bump every version in one step:

```sh
./deploy/bump_version.sh 2.2
```

Release notes are in `deploy/about_version.md`.

## How the frontend reaches the backend

The React app calls a same-origin `/api` prefix. In production nginx proxies it
to the backend container (`deploy/nginx.conf`); in development `setupProxy.js`
does the same. No host or port is baked into the bundle.
