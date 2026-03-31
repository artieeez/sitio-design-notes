---
description: "Task list for School Trip Payment and Passenger Status (multi-repo)"
---

# Tasks: School Trip Payment and Passenger Status

**Input**: Design documents from `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/`

**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `research.md`, `quickstart.md`, `contracts/backend-api.openapi.yaml`, `contracts/share-link-auth-header.md`

**Tests**: **Required.** `spec.md` mandates automated verification; this file lists Vitest/RTL and Jest/Supertest tasks per phase. Bruno remains supplementary. Story checkpoints are not met until the corresponding test tasks pass.

**Organization**: Tasks follow user stories P1–P3 from `spec.md`, across `sitio-dashboard` and `sitio-backend`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no ordering dependency within the same phase)
- **[Story]**: User story label for phase tasks ([US1], [US2], [US3])
- Paths are absolute to the two implementation repos and this spec folder

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap both repositories per `plan.md` and `quickstart.md`.

- [X] T001 Install and align frontend dependencies in `/Users/arturwebber/Documents/sitio/sitio-dashboard/package.json` (Vite React TS, TanStack Router, TanStack Query, Zustand, Mantine, TanStack Form, Zod per `plan.md`)
- [X] T002 Bootstrap NestJS app with Prisma in `/Users/arturwebber/Documents/sitio/sitio-backend/` (Nest CLI layout, PostgreSQL datasource, `@nestjs/cqrs` per `plan.md`)
- [X] T003 [P] Add ARM64 Docker build workflow at `/Users/arturwebber/Documents/sitio/sitio-dashboard/.github/workflows/docker-arm64.yml` per `quickstart.md` (checkout, qemu, buildx, build-push `linux/arm64`)
- [X] T004 [P] Add ARM64 Docker build workflow at `/Users/arturwebber/Documents/sitio/sitio-backend/.github/workflows/docker-arm64.yml` per `quickstart.md`
- [X] T005 [P] Create Bruno collection directory `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/` with environment/base config for API base URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database model, auth boundaries, app shell, and API client so user stories can attach to real endpoints.

**⚠️ CRITICAL**: No user story phase work should start until this phase is complete.

- [X] T006 Model `School`, `Trip`, `Passenger`, `PaymentRecord`, `PaymentAuditEvent`, `ShareLink`, `Flag` with enums and relations in `/Users/arturwebber/Documents/sitio/sitio-backend/prisma/schema.prisma` per `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/data-model.md` (including `PaymentRecord.entrySource`, `Passenger.createdVia`, and extended `PaymentAuditEvent` event types where applicable)
- [ ] T007 Create and apply initial Prisma migration from `schema.prisma` in `sitio-backend` (run `pnpm exec prisma migrate dev` or equivalent per repo policy; user must have `DATABASE_URL` set)
- [X] T008 Create module folder layout under `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/` (`schools/`, `trips/`, `passengers/`, `payments/`, `reconciliation/`, `share-links/`) with empty module classes wired in `app.module.ts`
- [X] T009 Implement `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/auth-proxy/auth-proxy.guard.ts` to require forwarded proxy user headers on internal routes per `research.md`
- [X] T010 Implement `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/auth-proxy/share-link.middleware.ts` (or equivalent) validating `x-share-link-authenticated`, Bearer token, and scope per `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/share-link-auth-header.md`
- [X] T011 Register global validation pipe and production-safe exception filter in `/Users/arturwebber/Documents/sitio/sitio-backend/src/main.ts` and `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/filters/` (no stack traces or secrets in client responses)
- [X] T012 Add `GET /v1/schools` to `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/backend-api.openapi.yaml` and implement list handler in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/schools/` (supports FR-001 navigation; contract currently only had nested trips path)
- [X] T013 Configure Mantine + TanStack Query providers and pt-BR locale defaults in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/app/` (or `src/main.tsx` entry per existing structure)
- [X] T014 Define TanStack Router route tree with separate branches for internal staff vs share-link screens in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/routes/` per `plan.md`
- [X] T015 Add typed HTTP/API client using `import.meta.env.VITE_*` only in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/api/client.ts` (no secrets in bundle)
- [X] T046 [P] Configure Vitest + React Testing Library in `/Users/arturwebber/Documents/sitio/sitio-dashboard/` (`vitest.config`, test setup, `pnpm test` script) and add a minimal smoke test (e.g. app shell or providers mount) per `plan.md`
- [X] T047 [P] Configure Jest + Supertest in `/Users/arturwebber/Documents/sitio/sitio-backend/` for HTTP integration tests (`pnpm test` script), with a minimal app bootstrap or guard/middleware test per `plan.md`

**Checkpoint**: Foundation ready — internal and share-link routing boundaries exist; schema matches `data-model.md`; automated test harness runs in both repos (T046–T047).

---

## Phase 3: User Story 1 — View trips by school and passenger payment status (Priority: P1) 🎯 MVP

**Goal**: Staff navigate schools → trips → trip detail with passenger payment and document pending indicators; staff **import rosters** (CSV/Excel) and **add single passengers** per `spec.md` FR-016–FR-017.

**Independent Test**: With seeded schools, trips, and passengers (including at least one import and one manual add), confirm lists and statuses match data without share links or reconciliation actions (`spec.md` US1).

### Implementation for User Story 1

- [X] T016 [US1] Implement `GET /v1/schools/{schoolId}/trips` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/trips/` per OpenAPI `Trips` tag
- [X] T017 [US1] Implement `GET /v1/trips/{tripId}/passengers/status` returning `Trip` + `InternalPassengerStatus[]` per `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/backend-api.openapi.yaml` (`TripPassengerStatusView` in `data-model.md`)
- [X] T018 [P] [US1] Add TanStack Query hooks for schools, trips, and passenger status in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/api/` (or `features/*/api/`)
- [X] T019 [P] [US1] Implement staff UI: school list / selector in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/trips/` (or `routes/`) with pt-BR copy in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/i18n/`
- [X] T020 [US1] Implement trip list for selected school and trip detail page with Mantine passenger table showing `paymentStatus`, `documentStatus`, and flagged state in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/trips/`
- [X] T058 [US1] Implement **CSV/Excel passenger import** for a trip (FR-016): upload, validation, preview, **all-or-nothing commit** (any invalid row aborts persist), API responses with **per-row and summary errors**; **in-app help** (pt-BR) on the import screen: column template, examples, **common mistakes**; backend in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/passengers/` (or `trips/`); extend `contracts/backend-api.openapi.yaml` as needed; staff UI on trip detail in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/trips/` (help copy may live in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/i18n/`)
- [X] T059 [US1] Implement **manual single-passenger registration** for a trip (FR-017): `POST` (or equivalent) + form in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/trips/`; OpenAPI + Bruno requests
- [X] T021 [P] [US1] Add Zustand store for selected school/trip UI context only in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/stores/`
- [X] T022 [US1] Add Bruno requests for `GET /v1/schools`, `GET /v1/schools/{schoolId}/trips`, `GET /v1/trips/{tripId}/passengers/status` under `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/`
- [X] T048 [US1] Add Supertest integration tests in `/Users/arturwebber/Documents/sitio/sitio-backend/test/` (or `src/**/*.spec.ts`) for `GET /v1/schools`, `GET /v1/schools/{schoolId}/trips`, and `GET /v1/trips/{tripId}/passengers/status` (use test DB or approved mocks per repo conventions); **extend** with import and manual-passenger endpoints once T058–T059 exist (assert **no DB writes** on validation failure and error payload shape for FR-016)
- [ ] T049 [P] [US1] Add React Testing Library tests in `/Users/arturwebber/Documents/sitio/sitio-dashboard/tests/` (or colocated `*.test.tsx`) for staff school → trip → passenger status flow with mocked API clients / TanStack Query; **extend** with import and manual-add flows when T058–T059 exist (include **blocked import** + error summary and **help panel** visibility for FR-016)

**Checkpoint**: US1 acceptance scenarios 1–5 from `spec.md` are demonstrable; T048–T049 pass; **T058–T059** complete.

---

## Phase 4: User Story 2 — Share links for school staff (Priority: P2)

**Goal**: Create trip-scoped and school-scoped share links; school-facing read-only status-only views with expiration/revocation and trip-first school scope.

**Independent Test**: Create trip- and school-scoped links; open in isolated session; verify scope, status-only payloads, and error handling for invalid/expired/revoked links (`spec.md` US2).

### Implementation for User Story 2

- [X] T023 [US2] Implement secure token generation and `tokenHash` storage for `ShareLink` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/` (never return raw token after creation except in `ShareLinkCreated` response)
- [X] T024 [US2] Implement `POST /v1/share-links` with `scopeType` TRIP|SCHOOL, policy-driven `expiresAt`, and validation rules from `data-model.md` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [X] T025 [US2] Implement `POST /v1/share-links/{linkId}/revoke` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [X] T026 [US2] Implement `GET /v1/share-links/access/trip` returning status-only `SharePassengerStatus` per OpenAPI; enforce share-link middleware and map internal fields to status-only DTOs in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [X] T027 [US2] Implement `GET /v1/share-links/access/school` with trip-first grouped payload per FR-013 in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [X] T028 [US2] Return `401`/`410` for invalid, expired, or revoked links without leaking passenger data per FR-010 in share-link handlers
- [X] T029 [P] [US2] Build share-link creation form with TanStack Form + Zod (expiration choices, scope, trip/school fields) in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/share-links/` with pt-BR strings
- [X] T030 [P] [US2] Implement public CSR routes that set `Authorization: Bearer` and `x-share-link-authenticated: true` on API calls and render read-only views in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/routes/` (trip flow and school trip-first navigation)
- [X] T031 [US2] Add Bruno requests for share-link create, revoke, access trip/school, and negative cases in `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/`
- [ ] T050 [US2] Add Supertest tests for share-link create, revoke, `GET` access (trip + school), and negative cases (`401`/`410` without leaking passenger bodies) in `/Users/arturwebber/Documents/sitio/sitio-backend/test/`
- [ ] T051 [P] [US2] Add RTL tests for share-link creation UI and public read-only routes in `/Users/arturwebber/Documents/sitio/sitio-dashboard/tests/` (mock API; assert headers or route behavior per `share-link-auth-header.md`)

**Checkpoint**: US2 acceptance scenarios 1–6 from `spec.md` are demonstrable; T050–T051 pass.

---

## Phase 5: User Story 3 — Verify integration payments and reconcile to passengers (Priority: P3)

**Goal**: Reconciliation queue, match, verify, reassign with immutable audit, flags, and duplicate/conflict handling.

**Independent Test**: With fixture or mocked integration payments, run merge, verify, flag, and reassignment flows; passenger list and audit trail reflect outcomes (`spec.md` US3).

### Implementation for User Story 3

- [X] T032 [US3] Register CQRS module and define commands/queries for reconciliation in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [X] T033 [US3] Implement `GET /v1/reconciliation/payments` with optional `status` filter per OpenAPI in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [X] T034 [US3] Implement `POST /v1/reconciliation/payments/{paymentId}/match` with conflict detection (no double-count paid status) and `409` on inconsistency per FR-009 in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [X] T035 [US3] Implement `POST /v1/reconciliation/payments/{paymentId}/reassign` requiring `reason`, emit immutable `PaymentAuditEvent` type `REASSIGNED` with from/to passenger IDs per FR-015 in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [X] T036 [US3] Implement `POST /v1/reconciliation/payments/{paymentId}/verify` and audit `VERIFIED` event in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [X] T060 [US3] Implement **manual single-payment registration** (FR-018): API + reconciliation UI so staff can create a `PaymentRecord` marked as manual in audit/metadata; extend Prisma/OpenAPI/`data-model.md` if a source/origin field is required
- [X] T061 [US3] Implement **create passenger from payment** while verifying or accepting a payment (FR-019): one flow that creates `Passenger` on the selected trip from payment-derived fields, links the payment, and writes audit events; backend in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/` (and `passengers/` as needed); UI in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/reconciliation/`
- [X] T037 [US3] Implement `POST /v1/flags` for `PASSENGER` and `PAYMENT_RECORD` targets per OpenAPI in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/` (or dedicated `flags` handler)
- [X] T038 [US3] Append `PaymentAuditEvent` rows for `MATCHED`, `VERIFIED`, `FLAGGED`, etc., with immutability enforced at repository layer in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/payments/` or `reconciliation/`
- [X] T039 [US3] Build staff reconciliation UI (queue list, match/reassign/verify/flag actions) in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/reconciliation/` consuming internal APIs; pt-BR copy
- [X] T040 [US3] Add Bruno requests for reconciliation list, match, reassign, verify, flags, and conflict responses in `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/`
- [X] T041 [US3] Provide dev seed or admin script to insert sample `PaymentRecord` rows for `integrationSource`/`externalPaymentId` in `/Users/arturwebber/Documents/sitio/sitio-backend/` (supports FR-005 demo without live integration)
- [ ] T052 [US3] Add Supertest tests for reconciliation list, match, reassign, verify, flags, and `409` conflict path in `/Users/arturwebber/Documents/sitio/sitio-backend/test/` (assert audit events where applicable); **extend** with manual payment (T060) and create-passenger-from-payment (T061) when implemented
- [ ] T053 [P] [US3] Add RTL tests for reconciliation staff UI (queue, primary actions) in `/Users/arturwebber/Documents/sitio/sitio-dashboard/tests/` with mocked internal APIs
- [ ] T055 [US3] **Duplicate integration payments** (spec edge case): In `payments` / `reconciliation`, surface suspected duplicate rows for the same logical payment (e.g. same `externalPaymentId` or integration-defined key), block match flows that would double-count paid status, and show staff a clear duplicate/conflict state in the reconciliation UI; extend `contracts/backend-api.openapi.yaml` and `data-model.md` if new fields or query filters are required. Add Supertest cases for duplicate scenarios.
- [ ] T056 [US3] **Payment before passenger exists** (spec edge case): Ensure `GET /v1/reconciliation/payments` (and staff UI) always lists unmatched `PaymentRecord` when no passenger exists on the trip yet; support match after the roster is updated and **create-passenger-from-payment**. **Dismiss/archive is out of scope for v1** per `spec.md` (optional follow-up with audit if product adds it). Add Supertest + seed fixtures for “unmatched, no passenger” rows.
- [ ] T057 [US3] **Cancelled trip or passenger** (spec edge case): Extend Prisma schema (see `data-model.md`), internal trip/passenger APIs, and staff UIs so cancelled or removed trips/passengers still show understandable status and payment linkage (no unexplained orphans); reconciliation views must remain coherent. Add RTL/Supertest coverage for at least one cancelled-entity path.

**Checkpoint**: US3 acceptance scenarios 1–7 from `spec.md` are demonstrable; T052–T053 pass; **T060–T061** complete; edge-case tasks **T055–T057** complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, i18n consistency, and quickstart validation across repos.

- [ ] T042 [P] Sweep new dashboard strings into `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/i18n/` (pt-BR for all user-visible text)
- [ ] T043 [P] Align error message shapes with OpenAPI `401`/`400`/`409` and optional `410` for share links in `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/filters/`
- [ ] T044 Run manual checklist in `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/quickstart.md` (bootstrap, Bruno flows, ARM workflows), **including Pre-release validation** (`quickstart.md` §Pre-release validation) for **SC-002** and **SC-004** once **T062** has filled in the scripted steps and fixtures; confirm full automated suites pass locally or in CI
- [ ] T045 Verify API implementation against `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/backend-api.openapi.yaml` and update the YAML if implementation discovers necessary additive fields (document deltas in spec folder)
- [X] T054 [P] Wire automated test runs into CI for both repos: extend or add GitHub Actions workflow(s) so `pnpm test` (or each repo’s test script) runs on pull requests for `/Users/arturwebber/Documents/sitio/sitio-dashboard/` and `/Users/arturwebber/Documents/sitio/sitio-backend/`
- [X] T062 [P] **Pre-release validation (requirements, not automated suites)**: Document in `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/quickstart.md` (Pre-release validation) the **scripted school-staff task** for **SC-002** (steps, expected outcome, ≥90% target or documented pilot threshold) and the **flagged-item findability** procedure for **SC-004** (entry screen, labeled test data IDs, ≤1 minute criterion). Record pass/fail notes for release sign-off; does not replace Vitest/Jest suites.

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends on | Notes |
|--------|------------|--------|
| Phase 1 Setup | — | Can start immediately |
| Phase 2 Foundational | Phase 1 | Blocks all user stories; includes T046–T047 test harness |
| Phase 3 US1 | Phase 2 | MVP slice; T048–T049 after T016–T017 (and T020 for full UI assertions on T049) |
| Phase 4 US2 | Phase 2 | Uses `ShareLink` + passengers/trips from schema; functionally stacks on US1 data model |
| Phase 5 US3 | Phase 2 | Uses `PaymentRecord`, passengers, audit; overlaps US1 passenger display when matched; **T060–T061** (FR-018–FR-019) after core match/verify paths; **T055–T057** close spec edge cases after core US3 work |
| Phase 6 Polish | Phases 3–5 as needed | Can run partial polish after each story; T054 can follow once test scripts exist; **T062** before final **T044** sign-off for SC-002/SC-004 |

### User Story Dependencies

- **US1**: After Foundational only.
- **US2**: After Foundational; independently testable with seeded data (does not require reconciliation UI).
- **US3**: After Foundational; independently testable with seeded/mocked payments (does not require share-link UI).

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 in parallel.
- **Phase 2**: T009 and T010 in parallel after T008; T013 and T014 parallel with backend tasks if staffed separately; **T046 and T047 in parallel** after T001–T002 (tooling present).
- **Phase 3**: T018, T019, T021 in parallel after T016–T017 exist; **T058–T059 after T016–T017** (import/manual need passenger APIs); **T048 after T016–T017**; **T049 in parallel** with T018–T021 once trip UI exists (typically after T020).
- **Phase 4**: T029 and T030 in parallel after backend share endpoints exist; **T051 in parallel** with T029–T030 after routes exist.
- **Phase 5**: **T053 in parallel** with T039 after reconciliation UI skeleton exists; **T055–T057** after core reconciliation (T033–T039) and schema clarity—**T057** may require Prisma migration after T006/T007 follow-ups.
- **Phase 6**: T042, T043, **T054**, and **T062 in parallel** (T044/T062 ordering: complete T062 content before final T044 run).

---

## Parallel Example: User Story 1

```bash
# After T016 and T017 are merged, frontend can parallelize:

Task T018: TanStack Query hooks in sitio-dashboard/src/api/
Task T019: School/trip UI + i18n in sitio-dashboard/src/features/trips/ and src/i18n/
Task T021: Zustand store in sitio-dashboard/src/stores/
```

---

## Parallel Example: User Story 2

```bash
# After T023–T027 are merged:

Task T029: Share-link creation form in sitio-dashboard/src/features/share-links/
Task T030: Public share routes in sitio-dashboard/src/routes/
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2 (including T046–T047).
2. Complete **all of Phase 3 (US1)** through the Phase 3 **checkpoint**: implementation tasks **T016–T022, T058–T059** (navigation, trip/passenger UI, **CSV/Excel import**, **manual single passenger**) plus automated tests **T048–T049** with extensions described in those tasks (import failure, help UI, manual add).
3. Stop and validate `spec.md` US1 independent test (**including** at least one successful import and one manual add per scenarios 4–5), **SC-001**, and green automated suites for US1.

**Note**: **Confirmed** — MVP is **full US1** per `spec.md`: **T016–T022, T058–T059** and tests **T048–T049** (covers FR-001–FR-002, FR-016–FR-017). Deferring import/manual would require revising `spec.md` and **Complexity Tracking** in `plan.md`.

### Incremental Delivery

1. Setup + Foundational → stable schema and auth boundaries.
2. US1 → staff trip/passenger visibility, **roster import (FR-016)**, and **manual passenger (FR-017)** (core operations).
3. US2 → school transparency via links (status-only, scoped).
4. US3 → reconciliation trust and auditability.

### Multi-Developer Parallelism

After Foundational: one developer on `sitio-dashboard` US1 routes/UI, another on `sitio-backend` US1 endpoints; merge when API contracts stabilize.

---

## Notes

- **Prisma migrations**: If `sitio-backend` follows a “human runs migrate” policy, T007 remains a human-gated step; do not hand-edit SQL migrations unless your repo allows it.
- **Contract source of truth**: `contracts/backend-api.openapi.yaml` lives under `sitio-design-notes`; implementation tasks reference both repos—keep OpenAPI in sync when endpoints change (T045).
- **[P]** tasks must not edit the same file concurrently.
- **Task count**: T001–T062 (62 tasks), including mandatory automated test harness and story tests **T046–T053**, CI **T054**, edge-case work **T055–T057**, roster/payment intake **T058–T061** (FR-016–FR-019), and pre-release validation **T062** (SC-002 / SC-004).
