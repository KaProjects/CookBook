# CookBook

Recipe book and menu planner: recipes per cook, filterable by category and
ingredient, with pictures and PDF export. `backend` is Quarkus, `frontend` is React.

## Development

```sh
./verify.sh                      # backend tests, frontend lint and tests
(cd backend && ./build_dev.sh)   # http://localhost:9092, Swagger at /docs
(cd frontend && ./build_dev.sh)  # http://localhost:3002
```

Development runs on an in-memory database with sample recipes.

## Tests

- `backend`: `./mvnw test` - coverage in `target/jacoco-report/`. Response
  snapshots are re-recorded with `-Dtest=ResponseSnapshotTest -Dsnapshots.update=true`.
- `backend/native_smoke.sh` - checks the native build (needs Docker).
- `frontend`: `npm test`.

## API

Errors are RFC 9457 problem details (`application/problem+json`).

| Method | Path | |
|---|---|---|
| GET | `/user` | users |
| GET | `/user/{user}/config` | user's layout settings |
| GET | `/user/{user}/menu` | user's categories and ingredients |
| GET | `/user/{user}/recipes?category=&ingredient=` | user's recipes by category |
| GET | `/recipe/{id}` | recipe |
| POST | `/recipe` | create recipe |
| PUT | `/recipe/{id}` | update recipe |
| DELETE | `/recipe/{id}` | delete recipe |
