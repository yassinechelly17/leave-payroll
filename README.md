# LeavePayroll microservice

Spring Boot API and optional Next.js admin UI. Owned by your team; version-pinned in [attendance-platform](https://github.com/xWess/attendance-platform) as `services/leave-payroll/`.

## Quick start (standalone, no platform Docker)

```bash
docker compose up -d          # Postgres only
cd backend && mvn spring-boot:run
cd frontend && npm install && npm run dev   # skip if API-only service
```

- API: http://localhost:8082
- Health: http://localhost:8082/actuator/health
- UI: http://localhost:3001 (if frontend included)

## Environment (local)

| Variable | Default |
|----------|---------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/leave_payroll` |
| `FRONTEND_URL` | `http://localhost:3001` |
| `BACKEND_URL` (frontend) | `http://127.0.0.1:8082` |

## Platform integration

This repo is a git submodule. After you push to `main`, open a PR in attendance-platform (or ask platform maintainers) to bump the pinned commit:

```bash
cd attendance-platform
make update-submodules
git add services/leave-payroll
git commit -m "Bump leave-payroll"
```

## Team workflow

```bash
cd services/leave-payroll    # inside a platform clone
git checkout main && git pull
git checkout -b feature/my-work
# ... commit ...
git push -u origin feature/my-work
# merge via PR in this service repo
```

You need **write access to this repository**. Clone the platform with submodules to get this directory populated.
