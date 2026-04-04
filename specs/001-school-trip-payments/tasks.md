# Tasks: School Trip Pending Payments Dashboard

**Input**: Design documents from `/specs/001-school-trip-payments/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/openapi.yaml](./contracts/openapi.yaml), [quickstart.md](./quickstart.md)

**Tests**: Included per [plan.md](./plan.md) constitution (integration/e2e per story; contract alignment with OpenAPI where practical). **Dashboard**: Vitest + Testing Library tests are **required** per story slice (see T053)—not optional—so UI behavior has automated proof alongside Nest e2e.

**Constitution traceability**: **§I** quality via lint/TS strict (Phases 1–2); **§II** tests per US + T053; **§III** pt-BR in T020 and feature components; **§IV** phased US1→US4; **§V** paths below target `../sitio-dashboard` / `../sitio-backend` only.

**Organization**: Tasks are grouped by user story ([spec.md](./spec.md) US1–US4) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no ordering dependency on incomplete sibling tasks)
- **[Story]**: `US1` … `US4` maps to user stories in [spec.md](./spec.md)
- Paths use sibling repos: `../sitio-dashboard/`, `../sitio-backend/`

## Path conventions

- **Specs**: this repo — no application code here
- **Frontend**: `../sitio-dashboard/` (TanStack Start SPA + shadcn; routes under `src/routes/` or template default)
- **Backend**: `../sitio-backend/` (NestJS + CQRS + Prisma)

---

## Phase 1: Setup (shared infrastructure)

**Purpose**: Repository baselines, tooling, and env documentation.

- [ ] T001 Document feature scope, `DATABASE_URL`, and `VITE_API_URL` in `../sitio-backend/README.md` and `../sitio-dashboard/README.md` per [quickstart.md](./quickstart.md)
- [ ] T002 [P] Initialize NestJS project structure with strict TypeScript in `../sitio-backend/package.json` and `../sitio-backend/tsconfig.json`
- [ ] T003 [P] Scaffold TanStack Start **SPA** + shadcn (`--preset b1Fk0lmym --base base --template start`) in `../sitio-dashboard/` per [research.md](./research.md)
- [ ] T004 [P] Configure Biome for linting and formatting with TypeScript strict mode in `../sitio-backend/`
- [ ] T005 [P] Configure Biome for linting and formatting with TypeScript strict mode in `../sitio-dashboard/`
- [ ] T006 Add `@nestjs/cqrs`, Prisma, and runtime config dependencies in `../sitio-backend/package.json` per [plan.md](./plan.md)

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: Database contract, Nest bootstrap, metadata endpoint, dashboard app shell — **no user story is complete until this phase is done**.

**⚠️ CRITICAL**: User story phases must not start until Prisma schema + Nest `AppModule` + dashboard `QueryClientProvider` exist.

- [ ] T007 Define `School`, `Trip`, `Passenger`, `Payment` models, indexes (including `tripId` + `cpfNormalized` uniqueness including soft-removed per FR-031), and money/date field types in `../sitio-backend/prisma/schema.prisma` per [data-model.md](./data-model.md)
- [ ] T008 Document human-run `pnpm exec prisma migrate dev` workflow after schema changes in `../sitio-backend/README.md` (agents do not commit migration SQL)
- [ ] T009 Add `../sitio-backend/src/prisma/prisma.module.ts` and `../sitio-backend/src/prisma/prisma.service.ts` with `enableShutdownHooks`
- [ ] T010 Register `CqrsModule`, `PrismaModule`, and `ConfigModule` in `../sitio-backend/src/app.module.ts`
- [ ] T011 Configure global validation pipe and consistent JSON error shape in `../sitio-backend/src/main.ts`
- [ ] T012 Implement structured logging / interceptors that **omit or redact passenger CPF** from request and error logs per FR-039 in `../sitio-backend/src/common/` (or equivalent)
- [ ] T013 Implement `POST /metadata/fetch-page` with timeouts, size limits, and SSRF protections per [contracts/openapi.yaml](./contracts/openapi.yaml) in `../sitio-backend/src/modules/metadata/`
- [ ] T014 Configure Vite SPA mode and `VITE_API_URL` in `../sitio-dashboard/vite.config.ts` and `../sitio-dashboard/.env.example`
- [ ] T015 Wrap the dashboard root with `QueryClientProvider` (and optional devtools) in `../sitio-dashboard/src/routes/__root.tsx` or the template root entry file
- [ ] T016 [P] Add Zustand theme store (light/dark, `localStorage`, DOM class sync) in `../sitio-dashboard/src/stores/theme-store.ts`
- [ ] T017 [P] Add Zustand store for `includeInactiveSchools`, `includeInactiveTrips`, `includeRemovedPassengers` toggles in `../sitio-dashboard/src/stores/ui-preferences-store.ts`
- [ ] T018 Add typed JSON API client (base URL, headers, error parsing) in `../sitio-dashboard/src/lib/api-client.ts`
- [ ] T019 [P] Add Zod schemas for request/response DTOs aligned with [contracts/openapi.yaml](./contracts/openapi.yaml) in `../sitio-dashboard/src/lib/schemas/`
- [ ] T020 [P] Centralize **pt-BR** UI strings (school/trip/passenger/payment labels) in `../sitio-dashboard/src/messages/pt-BR.ts` per FR-024

**Checkpoint**: Schema documented, API shell runnable, dashboard loads with theme and query client.

---

## Phase 3: User Story 1 — Register core trip data (Priority: P1) — MVP

**Goal**: Schools, contextual trips, passengers, landing `url` + metadata prefill, inactive rules, CPF + name duplicate rules, soft-remove/restore, parent contact fields — per US1 in [spec.md](./spec.md).

**Independent test**: Create a school, a trip from that school’s list (no school picker), passengers with overrides and metadata behavior; verify inactive school/trip rules and duplicate behaviors.

### Tests for User Story 1

- [ ] T021 [P] [US1] Add Nest e2e tests for `GET/POST /schools`, `PATCH /schools/{id}`, `includeInactive` list behavior, and block new trips on inactive school in `../sitio-backend/test/school.e2e-spec.ts`
- [ ] T022 [P] [US1] Add Nest e2e tests for trips under school, no cross-school binding, inactive trip blocks new passengers in `../sitio-backend/test/trip.e2e-spec.ts`
- [ ] T023 [P] [US1] Add Nest e2e tests for passengers: CPF validation, duplicate CPF block, name warning + confirm flag, soft-remove/restore, parent email/phone rules in `../sitio-backend/test/passenger.e2e-spec.ts`

### Implementation for User Story 1

**Order**: **T025** (shared payment-status logic) before **T026–T027** so trip FR-019 recalculation and passenger list queries use the same implementation.

- [ ] T024 [US1] Implement School CQRS commands/queries and REST `/schools`, `/schools/{schoolId}` matching OpenAPI in `../sitio-backend/src/modules/school/`
- [ ] T025 [US1] Extract or implement shared **payment status** calculation (BRL minor units, effective expected amount) in `../sitio-backend/src/modules/passenger/payment-status.util.ts` (or `domain/`) for use in **T026** (trip update / FR-019) and **T027** (passenger queries)
- [ ] T026 [US1] Implement Trip CQRS and REST `/schools/{schoolId}/trips`, `/trips/{tripId}` with `defaultExpectedAmountMinor`, `url`, and FR-029/FR-030 rules in `../sitio-backend/src/modules/trip/`; on **trip update**, when `defaultExpectedAmountMinor` changes, **recompute derived `paymentStatus` (FR-019)** for all passengers on that trip using **T025**
- [ ] T027 [US1] Implement Passenger CQRS and REST `/trips/{tripId}/passengers`, `/passengers/{passengerId}` with FR-031/FR-032/FR-038/FR-044 and `paymentStatus` derivation per FR-018 **via T025** in `../sitio-backend/src/modules/passenger/`
- [ ] T028 [P] [US1] Implement school list and create/edit forms with optional `url`, metadata prefetch via `/metadata/fetch-page`, and “open landing page” when `url` present in `../sitio-dashboard/src/routes/` and feature components under `../sitio-dashboard/src/components/schools/`
- [ ] T029 [US1] Implement **school trips** list and **trip create** opened only from that list (no school selector) in `../sitio-dashboard/src/routes/` per FR-004
- [ ] T030 [US1] Implement trip edit with `url`, metadata prefill, and default expected amount fields in `../sitio-dashboard/src/components/trips/`
- [ ] T031 [US1] Implement trip detail **passenger table** with status column, kebab placeholder for later stories, soft-remove/restore, **include removed passengers** toggle, and pt-BR copy in `../sitio-dashboard/src/components/trips/PassengerTable.tsx` (or colocated route file)

**Checkpoint**: US1 acceptance scenarios in [spec.md](./spec.md) hold end-to-end.

---

## Phase 4: User Story 2 — Record manual payments (Priority: P2)

**Goal**: Payment CRUD only from passenger row context; required fields; amount prefill; date-only America/Sao_Paulo; block create for removed passengers — per US2 and FR-010–FR-015, FR-035.

**Independent test**: From a passenger kebab, create payment with prefilled amount, then view/edit/delete in same trip context; status updates.

### Tests for User Story 2

- [ ] T032 [P] [US2] Add Nest e2e tests for `POST/GET /passengers/{passengerId}/payments`, `PATCH/DELETE /payments/{paymentId}`, sort order by `paidOn`, block payment create when passenger removed in `../sitio-backend/test/payment.e2e-spec.ts`

### Implementation for User Story 2

- [ ] T033 [US2] Implement Payment CQRS handlers and REST for `/passengers/{passengerId}/payments` and `/payments/{paymentId}` with immutable `passengerId` on update per OpenAPI in `../sitio-backend/src/modules/payment/`
- [ ] T034 [US2] Enforce FR-035 (no new payments for soft-removed passengers) and FR-034 (minor units, rounding) in `../sitio-backend/src/modules/payment/payment.command-handlers.ts` (or equivalent)
- [ ] T035 [US2] Ensure passenger `paymentStatus` reflects payment totals after every payment CUD in `../sitio-backend/src/modules/payment/` (invalidate/recalculate per FR-020)
- [ ] T036 [P] [US2] Add passenger row **kebab**: open **payment history** UI (list + edit + delete) scoped to trip in `../sitio-dashboard/src/components/trips/PassengerPaymentHistory.tsx`
- [ ] T037 [US2] Add **create payment** flow from kebab with TanStack Form + Zod, no passenger picker, amount prefilled from effective expected amount when present in `../sitio-dashboard/src/components/trips/PaymentForm.tsx`
- [ ] T038 [US2] Wire TanStack Query mutations and query invalidation for passenger list and payment history in `../sitio-dashboard/src/lib/query-keys.ts` and consuming components

**Checkpoint**: US2 scenarios in [spec.md](./spec.md) pass.

---

## Phase 5: User Story 3 — Mark passenger paid without payment record (Priority: P2)

**Goal**: Toggle manual paid-without-info; pt-BR labeling; recalculation when cleared — per US3 and FR-016/FR-017.

**Independent test**: Toggle manual tag on/off and observe status vs payment-only settlement.

### Tests for User Story 3

- [ ] T039 [P] [US3] Add Nest e2e tests for `PUT /passengers/{passengerId}/manual-paid-without-info` (per OpenAPI) and interaction with payment-derived status in `../sitio-backend/test/manual-paid-without-info.e2e-spec.ts`

### Implementation for User Story 3

- [ ] T040 [US3] Implement manual paid-without-info command handler and REST endpoint per OpenAPI in `../sitio-backend/src/modules/passenger/manual-paid-without-info.handler.ts` (or colocated with passenger module)
- [ ] T041 [US3] Add passenger row action to set/clear manual tag with pt-BR wording equivalent to FR-016 in `../sitio-dashboard/src/components/trips/PassengerRowActions.tsx`
- [ ] T042 [US3] Visually distinguish **settled via payments** vs **settled via manual tag** in `../sitio-dashboard/src/components/trips/PassengerTable.tsx` per FR-009/FR-018

**Checkpoint**: US3 scenarios in [spec.md](./spec.md) pass.

---

## Phase 6: User Story 4 — Monitor pending payment status (Priority: P3)

**Goal**: Clear pending/settled/unavailable display; default vs **include removed** for roster and **trip-level aggregates** — per US4 and FR-036.

**Independent test**: Mix payments and manual tags; verify default list and aggregates exclude soft-removed; with toggle, include them and match status rules.

### Tests for User Story 4

- [ ] T043 [P] [US4] Add Nest e2e or integration tests asserting passenger list filters (`includeRemoved`), `GET /trips/{tripId}/passenger-status-aggregates` counts vs list expectations, trip default amount change recalculating statuses (FR-019), and computed `paymentStatus` edge cases (no expected amount, partial payments, tag + payments) in `../sitio-backend/test/passenger-status.e2e-spec.ts`

### Implementation for User Story 4

- [ ] T044 [US4] Ensure list queries apply **default vs includeRemoved** consistently for roster responses per FR-036 in `../sitio-backend/src/modules/passenger/queries/`
- [ ] T045 [US4] Implement **backend-only** trip-level status aggregates — `GET /trips/{tripId}/passenger-status-aggregates?includeRemoved=` per [contracts/openapi.yaml](./contracts/openapi.yaml) — in `../sitio-backend/src/modules/trip/queries/trip-aggregates.query.ts` (or handler colocated with trip module); reuse the same status derivation as passenger list (FR-018, FR-036). **Do not** duplicate counting logic on the client except for display formatting. Add matching Zod types in `../sitio-dashboard/src/lib/schemas/` when wiring the dashboard.
- [ ] T046 [US4] Implement **TripStatusSummary** (or route section) with pt-BR labels, fetching aggregates from T045’s endpoint and passing `includeRemoved` from `../sitio-dashboard/src/stores/ui-preferences-store.ts` in `../sitio-dashboard/src/components/trips/TripStatusSummary.tsx`
- [ ] T047 [US4] When viewing payment history for a **removed** passenger, show removed indicator per FR-021 in `../sitio-dashboard/src/components/trips/PassengerPaymentHistory.tsx`

**Checkpoint**: US4 scenarios and SC-006 in [spec.md](./spec.md) satisfied.

---

## Phase 7: Polish and cross-cutting concerns

**Purpose**: Contract sync, quickstart validation, a11y and logging pass.

- [ ] T048 [P] Export or document OpenAPI from Nest (e.g. `@nestjs/swagger`) or add contract check script comparing routes to `../sitio-design-notes/specs/001-school-trip-payments/contracts/openapi.yaml` in `../sitio-backend/package.json`
- [ ] T049 [P] Update `../sitio-backend/README.md` and `../sitio-dashboard/README.md` with final scripts (`start:dev`, `test`, `lint`) and env vars
- [ ] T050 Walk through [quickstart.md](./quickstart.md) sanity checklist and fix gaps in `../sitio-dashboard/` and `../sitio-backend/`
- [ ] T051 [P] Best-effort a11y pass: labels, focus order, keyboard operable menus for kebab actions per FR-040 in `../sitio-dashboard/src/components/trips/`
- [ ] T052 Verify no CPF in logs or stack traces in error paths; add tests if needed in `../sitio-backend/test/logging-redaction.spec.ts`
- [ ] T053 [P] Add **required** Vitest + Testing Library tests in `../sitio-dashboard/src/test/` (one file or colocated `*.test.tsx`) covering at least **US1** school→trip→passenger navigation, **US2** payment history + create payment from row context (MSW or mocked client), **US3** manual paid-without-info control, and **US4** TripStatusSummary rendering from aggregate API response (mocked)—constitution §II applies to dashboard code as well as API

---

## Dependencies and execution order

### Phase dependencies

- **Phase 1** → **Phase 2** → **User story phases (3–6)** → **Phase 7**
- **Phase 2** blocks all of US1–US4

### User story dependencies

```text
Foundational (Phase 2)
        │
        ▼
       US1 (P1) ──┬──► US2 (P2) ──► (completes payment flows)
                 │
                 ├──► US3 (P2) ──► (manual tag; can parallel US2 after US1)
                 │
                 └──► US4 (P3) ──► (depends on US1–US3 behavior for full acceptance)
```

- **US1**: No dependency on other stories (after Phase 2)
- **US2**, **US3**: Require US1 data model and passenger UI shell
- **US4**: Validates aggregates and display; implement after US2+US3 for full scenario coverage (partial UI can start after US1)

### Parallel opportunities

- **Phase 1**: T002, T003, T004, T005 in parallel
- **Phase 2**: T016, T017, T019, T020 in parallel after T015
- **US1**: T021–T023 tests in parallel; T028 parallel with backend work once API stubs exist
- **US2 / US3**: After US1, different developers can split payment module vs manual-tag work
- **Phase 7**: T048, T049, T051, T053 in parallel

### Parallel example: User Story 1

```bash
# Run in parallel once Phase 2 is done:
T021 ../sitio-backend/test/school.e2e-spec.ts
T022 ../sitio-backend/test/trip.e2e-spec.ts
T023 ../sitio-backend/test/passenger.e2e-spec.ts

# Then backend modules: T024, then T025→T026→T027 (util before trip/passenger),
# while T028 starts when school REST is stable.
```

---

## Implementation strategy

### MVP first (User Story 1 only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1)
3. **Stop and validate** against US1 **Independent Test** in [spec.md](./spec.md)
4. Demo MVP (schools → trips → passengers)

### Incremental delivery

1. US1 → deploy/demo (operational roster without payments)
2. +US2 → full payment ledger
3. +US3 → manual tag shortcut
4. +US4 → operational monitoring and aggregates

### Format validation

All tasks use: `- [ ] Tnnn [P?] [USn?] Description with explicit file path`

---

## Notes

- **Migrations**: Only `schema.prisma` and docs from agents; humans run `prisma migrate` per [AGENTS.md](../../.cursor/rules) in implementation repos.
- **OpenAPI**: `specs/001-school-trip-payments/contracts/openapi.yaml` is the contract reference; keep DTOs aligned.
- **CPF**: Full display in UI; never in routine logs (FR-039).
- **Success criteria (non-automated)**: [spec.md](./spec.md) **SC-001–SC-005**, **SC-007**, and **SC-008** are usability or pilot/business metrics—validate during human demos or pilot runs; no substitute for automated tests in T021–T023, T032, T039, T043, T053.
