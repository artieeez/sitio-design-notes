# Quickstart: School Trip Payment and Passenger Status

## Repositories

- Planning/spec artifacts: `/Users/arturwebber/Documents/sitio/sitio-design-notes`
- Frontend implementation: `/Users/arturwebber/Documents/sitio/sitio-dashboard`
- Backend implementation: `/Users/arturwebber/Documents/sitio/sitio-backend`

## 1) Frontend bootstrap (`sitio-dashboard`)

1. Initialize a Vite React TypeScript app and install:
   - `@tanstack/react-router`
   - `@tanstack/react-query`
   - `zustand`
   - `@mantine/core` + peers
   - `@tanstack/react-form`
   - `zod`
2. Configure app shell:
   - Router provider and route tree for internal staff and share-link screens
   - Query client provider
   - Mantine provider with pt-BR locale defaults
3. Add global state with Zustand:
   - UI filters, selected school/trip context, non-server UI state only
4. Add forms:
   - Share-link creation form with TanStack Form + Zod validation
5. Client env policy:
   - Only `VITE_` variables in browser code
   - Keep API secrets in backend/proxy only

## 2) Backend bootstrap (`sitio-backend`)

1. Create Nest.js app with Prisma and PostgreSQL.
2. Configure Prisma datasource for local development:
   - `DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/<db>`
3. Implement modules:
   - `schools`, `trips`, `passengers`, `payments`, `reconciliation`, `share-links`
4. Add CQRS for reconciliation:
   - Commands: match, reassign, verify, flag
   - Queries: trip passenger status, school trip-first status, reconciliation queue
5. Implement auth-proxy and share-link middleware:
   - Validate forwarded internal user headers for internal routes
   - Validate `x-share-link-authenticated: true` and share-link token for share-link routes

## 3) API contracts and endpoint testing

1. Use `/contracts/backend-api.openapi.yaml` as implementation contract.
2. Create Bruno collection under `sitio-backend/bruno/school-trip-payments`.
3. Add Bruno requests for:
   - internal trip/passenger status endpoints
   - reconciliation match/reassign/verify/flag flows
   - share-link create/revoke/access flows
   - invalid/expired link behavior (`401` or `410`)

## 4) Deployment workflows (ARM / Oracle OKE)

Add GitHub Actions workflows in both implementation repositories:

- Build Docker image with Buildx for `linux/arm64`
- Optionally push to OCI-compatible registry
- Trigger on `main` and pull requests

Minimal required steps per workflow:

1. `actions/checkout`
2. `docker/setup-qemu-action`
3. `docker/setup-buildx-action`
4. `docker/login-action` (if pushing)
5. `docker/build-push-action` with `platforms: linux/arm64`

## 5) Done criteria for first implementation slice

- P1: internal staff can navigate school -> trip -> passenger statuses.
- P2: share links created and read-only status-only views enforced per scope.
- P3: reconciliation flows support match/reassign/verify/flag with immutable audit records.
