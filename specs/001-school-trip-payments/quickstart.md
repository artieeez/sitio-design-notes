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

## 3) Automated test suites *(required)*

1. **Frontend** (`sitio-dashboard`): run `pnpm test` (Vitest + React Testing Library) after `tasks.md` T046 and story tests (e.g. T049, T051, T053) exist; keep green before merging feature work.
2. **Backend** (`sitio-backend`): run `pnpm test` (Jest + Supertest) after T047 and story integration tests (e.g. T048, T050, T052) exist; use a test database or mocks as documented in the backend repo.
3. **CI**: enable PR workflows that execute the same test commands (`tasks.md` T054).

## 4) API contracts and endpoint testing

1. Use `/contracts/backend-api.openapi.yaml` as implementation contract.
2. Create Bruno collection under `sitio-backend/bruno/school-trip-payments`.
3. Add Bruno requests for:
   - internal trip/passenger status endpoints
   - reconciliation match/reassign/verify/flag flows
   - share-link create/revoke/access flows
   - invalid/expired link behavior (`401` or `410`)

Bruno does **not** replace automated suites; it complements them.

## 5) Deployment workflows (ARM / Oracle OKE)

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

## 6) Done criteria for first implementation slice

- P1: internal staff can navigate school -> trip -> passenger statuses; corresponding automated tests (T048–T049) pass.
- P2: share links created and read-only status-only views enforced per scope; T050–T051 pass.
- P3: reconciliation flows support match/reassign/verify/flag with immutable audit records; T052–T053 pass.
- Automated test runs are wired in CI (T054) or explicitly scheduled as a follow-up with Complexity Tracking.

## 7) Pre-release validation *(SC-002 / SC-004)*

This section documents **human-in-the-loop** checks for success criteria that are **not** fully replaced by automated suites. Fill in placeholders during implementation (`tasks.md` **T062**); execute before release candidate and tick off via **T044**.

### SC-002 — School staff share-link usability (scripted task)

| Field | Record here |
|-------|-------------|
| Scripted steps (school staff persona, status-only link) | Open issued `/share/trip?token=…` or `/share/school?token=…` → identify one passenger row that still shows pending payment or document status vs completed rows. |
| Pass/fail definition | Participant names the correct passenger (pending) from the status-only list without internal fields. |
| Target | ≥90% success across **n** ≥ 5 participants, or document pilot sample size and outcome. |
| Date / participants / outcome | *Record at release sign-off.* |

### SC-004 — Flagged-item findability (≤1 minute)

| Field | Record here |
|-------|-------------|
| **Entry screen** (where the timer starts) | `/staff/reconciliation` (queue list) after landing from `/staff/schools`. |
| **Labeled test data** (flag IDs or names in seed/fixtures) | Use seed flag labels from `pnpm exec prisma db seed` fixtures (e.g. payment `externalPaymentId` / passenger `fullName` documented in runbook). |
| Success | Staff locates the flagged payment or passenger within 60 seconds from entry. |
| Date / runner / outcome | *Record at release sign-off.* |
