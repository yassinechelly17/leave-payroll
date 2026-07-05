# LeavePayroll microservice

Spring Boot API and Next.js admin UI for leave requests and payroll. Owned by your team; version-pinned in [attendance-platform](https://github.com/xWess/attendance-platform) as `services/leave-payroll/`.

## Quick start (standalone, no platform Docker)

```bash
docker compose up -d          # Postgres only (host port 5433)
cd backend && mvn spring-boot:run
cd frontend && cp .env.local.example .env.local && npm install && npm run dev
```

- API: http://localhost:8082
- UI: http://localhost:3001
- Health: http://localhost:8082/actuator/health

Frontend dev uses `DEV_BYPASS_AUTH=true` (see `frontend/.env.local.example`) so no Keycloak is required while backend runs with the `local` profile.

## UI pages

| Route | Purpose |
|-------|---------|
| `/dashboard` | Overview stats and shortcuts |
| `/leave-requests` | List, filter, create, approve/reject leave |
| `/payroll` | Select period, run payroll, list records |
| `/payroll/records/[id]` | Payslip detail |

Money amounts are formatted in **EUR** (`en-IE` locale). Platform sidebar can link directly to `http://localhost:3001/dashboard` or `/leave-requests`.

## Environment (local)

| Variable | Default |
|----------|---------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5433/leave_payroll` |
| `BACKEND_URL` (frontend BFF) | `http://127.0.0.1:8082/api/v1` (standalone) or `http://localhost:8090/api/leave` (via gateway) |
| `LEAVE_PAYROLL_FRONTEND_URL` | `http://localhost:3001` |

## Pre-push checklist

- Do **not** commit `frontend/.next/`, `node_modules/`, or `frontend/.env.local`
- Run `cd frontend && npm run lint && npm run build`
- Run `cd backend && mvn test`

## Platform integration

```bash
cd attendance-platform
make up-platform   # COMPOSE_PROFILES=infra,leave-payroll
```

Spring profiles:

| Profile | Use | Auth | CORS |
|---------|-----|------|------|
| `local` | Standalone dev | permitAll | backend `WebConfig` |
| `platform` | Full compose stack | permitAll | gateway only | punch-clock **stub** (no OAuth2 yet) |
| `docker` | Keycloak handoff (later) | JWT roles | backend `WebConfig` | real Feign + OAuth2 |

In Docker, the frontend BFF proxies through the API Gateway (`http://api-gateway:8090/api/leave/**`). Standalone local dev can hit the backend directly via `BACKEND_URL=http://127.0.0.1:8082/api/v1`.

Gateway routes:

- `/api/leave/**` → leave-payroll-backend (`/api/v1/**`)
- `/api/punch-clock/**` → attendance-backend

After you push to `main`, bump the platform pin:

```bash
cd attendance-platform
make update-submodules
git add services/leave-payroll
git commit -m "Bump leave-payroll"
```

## Auth notes

- **Local dev:** `DEV_BYPASS_AUTH=true` — no login required; backend `local` profile permits all API calls.
- **Platform compose:** `platform` profile — permit-all, config-server + Eureka, Feign static URL to punch-clock.
- **Docker / production:** Keycloak JWT validation on backend (`docker` profile). Role-based UI and employee scoping deferred until platform Keycloak is ready.

## Team workflow

```bash
cd services/leave-payroll
git checkout main && git pull
git checkout -b feature/my-work
git push -u origin feature/my-work
# merge via PR in this service repo
```
