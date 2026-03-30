---
description: "Task list for School Trip Payment and Passenger Status (multi-repo)"
---

# Tasks: School Trip Payment and Passenger Status

**Input**: Design documents from `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/`

**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `research.md`, `quickstart.md`, `contracts/backend-api.openapi.yaml`, `contracts/share-link-auth-header.md`

**Tests**: Automated test tasks are **not** included; the specification defines mandatory acceptance scenarios but not a TDD requirement. Add Vitest/Jest tasks in-repo if you adopt TDD later.

**Organization**: Tasks follow user stories P1–P3 from `spec.md`, across `sitio-dashboard` and `sitio-backend`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no ordering dependency within the same phase)
- **[Story]**: User story label for phase tasks ([US1], [US2], [US3])
- Paths are absolute to the two implementation repos and this spec folder

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap both repositories per `plan.md` and `quickstart.md`.

- [ ] T001 Install and align frontend dependencies in `/Users/arturwebber/Documents/sitio/sitio-dashboard/package.json` (Vite React TS, TanStack Router, TanStack Query, Zustand, Mantine, TanStack Form, Zod per `plan.md`)
- [ ] T002 Bootstrap NestJS app with Prisma in `/Users/arturwebber/Documents/sitio/sitio-backend/` (Nest CLI layout, PostgreSQL datasource, `@nestjs/cqrs` per `plan.md`)
- [ ] T003 [P] Add ARM64 Docker build workflow at `/Users/arturwebber/Documents/sitio/sitio-dashboard/.github/workflows/docker-arm64.yml` per `quickstart.md` (checkout, qemu, buildx, build-push `linux/arm64`)
- [ ] T004 [P] Add ARM64 Docker build workflow at `/Users/arturwebber/Documents/sitio/sitio-backend/.github/workflows/docker-arm64.yml` per `quickstart.md`
- [ ] T005 [P] Create Bruno collection directory `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/` with environment/base config for API base URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database model, auth boundaries, app shell, and API client so user stories can attach to real endpoints.

**⚠️ CRITICAL**: No user story phase work should start until this phase is complete.

- [ ] T006 Model `School`, `Trip`, `Passenger`, `PaymentRecord`, `PaymentAuditEvent`, `ShareLink`, `Flag` with enums and relations in `/Users/arturwebber/Documents/sitio/sitio-backend/prisma/schema.prisma` per `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/data-model.md`
- [ ] T007 Create and apply initial Prisma migration from `schema.prisma` in `sitio-backend` (run `pnpm exec prisma migrate dev` or equivalent per repo policy; user must have `DATABASE_URL` set)
- [ ] T008 Create module folder layout under `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/` (`schools/`, `trips/`, `passengers/`, `payments/`, `reconciliation/`, `share-links/`) with empty module classes wired in `app.module.ts`
- [ ] T009 Implement `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/auth-proxy/auth-proxy.guard.ts` to require forwarded proxy user headers on internal routes per `research.md`
- [ ] T010 Implement `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/auth-proxy/share-link.middleware.ts` (or equivalent) validating `x-share-link-authenticated`, Bearer token, and scope per `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/share-link-auth-header.md`
- [ ] T011 Register global validation pipe and production-safe exception filter in `/Users/arturwebber/Documents/sitio/sitio-backend/src/main.ts` and `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/filters/` (no stack traces or secrets in client responses)
- [ ] T012 Add `GET /v1/schools` to `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/backend-api.openapi.yaml` and implement list handler in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/schools/` (supports FR-001 navigation; contract currently only had nested trips path)
- [ ] T013 Configure Mantine + TanStack Query providers and pt-BR locale defaults in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/app/` (or `src/main.tsx` entry per existing structure)
- [ ] T014 Define TanStack Router route tree with separate branches for internal staff vs share-link screens in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/routes/` per `plan.md`
- [ ] T015 Add typed HTTP/API client using `import.meta.env.VITE_*` only in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/api/client.ts` (no secrets in bundle)

**Checkpoint**: Foundation ready — internal and share-link routing boundaries exist; schema matches `data-model.md`.

---

## Phase 3: User Story 1 — View trips by school and passenger payment status (Priority: P1) 🎯 MVP

**Goal**: Staff navigate schools → trips → trip detail with passenger payment and document pending indicators.

**Independent Test**: With seeded schools, trips, and passengers, confirm lists and statuses match data without share links or reconciliation actions (`spec.md` US1).

### Implementation for User Story 1

- [ ] T016 [US1] Implement `GET /v1/schools/{schoolId}/trips` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/trips/` per OpenAPI `Trips` tag
- [ ] T017 [US1] Implement `GET /v1/trips/{tripId}/passengers/status` returning `Trip` + `InternalPassengerStatus[]` per `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/backend-api.openapi.yaml` (`TripPassengerStatusView` in `data-model.md`)
- [ ] T018 [P] [US1] Add TanStack Query hooks for schools, trips, and passenger status in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/api/` (or `features/*/api/`)
- [ ] T019 [P] [US1] Implement staff UI: school list / selector in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/trips/` (or `routes/`) with pt-BR copy in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/i18n/`
- [ ] T020 [US1] Implement trip list for selected school and trip detail page with Mantine passenger table showing `paymentStatus`, `documentStatus`, and flagged state in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/trips/`
- [ ] T021 [P] [US1] Add Zustand store for selected school/trip UI context only in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/stores/`
- [ ] T022 [US1] Add Bruno requests for `GET /v1/schools`, `GET /v1/schools/{schoolId}/trips`, `GET /v1/trips/{tripId}/passengers/status` under `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/`

**Checkpoint**: US1 acceptance scenarios 1–3 from `spec.md` are demonstrable.

---

## Phase 4: User Story 2 — Share links for school staff (Priority: P2)

**Goal**: Create trip-scoped and school-scoped share links; school-facing read-only status-only views with expiration/revocation and trip-first school scope.

**Independent Test**: Create trip- and school-scoped links; open in isolated session; verify scope, status-only payloads, and error handling for invalid/expired/revoked links (`spec.md` US2).

### Implementation for User Story 2

- [ ] T023 [US2] Implement secure token generation and `tokenHash` storage for `ShareLink` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/` (never return raw token after creation except in `ShareLinkCreated` response)
- [ ] T024 [US2] Implement `POST /v1/share-links` with `scopeType` TRIP|SCHOOL, policy-driven `expiresAt`, and validation rules from `data-model.md` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [ ] T025 [US2] Implement `POST /v1/share-links/{linkId}/revoke` in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [ ] T026 [US2] Implement `GET /v1/share-links/access/trip` returning status-only `SharePassengerStatus` per OpenAPI; enforce share-link middleware and map internal fields to status-only DTOs in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [ ] T027 [US2] Implement `GET /v1/share-links/access/school` with trip-first grouped payload per FR-013 in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/share-links/`
- [ ] T028 [US2] Return `401`/`410` for invalid, expired, or revoked links without leaking passenger data per FR-010 in share-link handlers
- [ ] T029 [P] [US2] Build share-link creation form with TanStack Form + Zod (expiration choices, scope, trip/school fields) in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/share-links/` with pt-BR strings
- [ ] T030 [P] [US2] Implement public CSR routes that set `Authorization: Bearer` and `x-share-link-authenticated: true` on API calls and render read-only views in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/routes/` (trip flow and school trip-first navigation)
- [ ] T031 [US2] Add Bruno requests for share-link create, revoke, access trip/school, and negative cases in `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/`

**Checkpoint**: US2 acceptance scenarios 1–6 from `spec.md` are demonstrable.

---

## Phase 5: User Story 3 — Verify integration payments and reconcile to passengers (Priority: P3)

**Goal**: Reconciliation queue, match, verify, reassign with immutable audit, flags, and duplicate/conflict handling.

**Independent Test**: With fixture or mocked integration payments, run merge, verify, flag, and reassignment flows; passenger list and audit trail reflect outcomes (`spec.md` US3).

### Implementation for User Story 3

- [ ] T032 [US3] Register CQRS module and define commands/queries for reconciliation in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [ ] T033 [US3] Implement `GET /v1/reconciliation/payments` with optional `status` filter per OpenAPI in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [ ] T034 [US3] Implement `POST /v1/reconciliation/payments/{paymentId}/match` with conflict detection (no double-count paid status) and `409` on inconsistency per FR-009 in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [ ] T035 [US3] Implement `POST /v1/reconciliation/payments/{paymentId}/reassign` requiring `reason`, emit immutable `PaymentAuditEvent` type `REASSIGNED` with from/to passenger IDs per FR-015 in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [ ] T036 [US3] Implement `POST /v1/reconciliation/payments/{paymentId}/verify` and audit `VERIFIED` event in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/`
- [ ] T037 [US3] Implement `POST /v1/flags` for `PASSENGER` and `PAYMENT_RECORD` targets per OpenAPI in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/reconciliation/` (or dedicated `flags` handler)
- [ ] T038 [US3] Append `PaymentAuditEvent` rows for `MATCHED`, `VERIFIED`, `FLAGGED`, etc., with immutability enforced at repository layer in `/Users/arturwebber/Documents/sitio/sitio-backend/src/modules/payments/` or `reconciliation/`
- [ ] T039 [US3] Build staff reconciliation UI (queue list, match/reassign/verify/flag actions) in `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/features/reconciliation/` consuming internal APIs; pt-BR copy
- [ ] T040 [US3] Add Bruno requests for reconciliation list, match, reassign, verify, flags, and conflict responses in `/Users/arturwebber/Documents/sitio/sitio-backend/bruno/school-trip-payments/`
- [ ] T041 [US3] Provide dev seed or admin script to insert sample `PaymentRecord` rows for `integrationSource`/`externalPaymentId` in `/Users/arturwebber/Documents/sitio/sitio-backend/` (supports FR-005 demo without live integration)

**Checkpoint**: US3 acceptance scenarios 1–5 from `spec.md` are demonstrable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, i18n consistency, and quickstart validation across repos.

- [ ] T042 [P] Sweep new dashboard strings into `/Users/arturwebber/Documents/sitio/sitio-dashboard/src/i18n/` (pt-BR for all user-visible text)
- [ ] T043 [P] Align error message shapes with OpenAPI `401`/`400`/`409` and optional `410` for share links in `/Users/arturwebber/Documents/sitio/sitio-backend/src/common/filters/`
- [ ] T044 Run manual checklist in `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/quickstart.md` (bootstrap, Bruno flows, ARM workflows)
- [ ] T045 Verify API implementation against `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/contracts/backend-api.openapi.yaml` and update the YAML if implementation discovers necessary additive fields (document deltas in spec folder)

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends on | Notes |
|--------|------------|--------|
| Phase 1 Setup | — | Can start immediately |
| Phase 2 Foundational | Phase 1 | Blocks all user stories |
| Phase 3 US1 | Phase 2 | MVP slice |
| Phase 4 US2 | Phase 2 | Uses `ShareLink` + passengers/trips from schema; functionally stacks on US1 data model |
| Phase 5 US3 | Phase 2 | Uses `PaymentRecord`, passengers, audit; overlaps US1 passenger display when matched |
| Phase 6 Polish | Phases 3–5 as needed | Can run partial polish after each story |

### User Story Dependencies

- **US1**: After Foundational only.
- **US2**: After Foundational; independently testable with seeded data (does not require reconciliation UI).
- **US3**: After Foundational; independently testable with seeded/mocked payments (does not require share-link UI).

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 in parallel.
- **Phase 2**: T009 and T010 in parallel after T008; T013 and T014 parallel with backend tasks if staffed separately.
- **Phase 3**: T018, T019, T021 in parallel after T016–T017 exist.
- **Phase 4**: T029 and T030 in parallel after backend share endpoints exist.
- **Phase 6**: T042 and T043 in parallel.

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

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Stop and validate `spec.md` US1 independent test and SC-001.

### Incremental Delivery

1. Setup + Foundational → stable schema and auth boundaries.
2. US1 → staff trip/passenger visibility (core operations).
3. US2 → school transparency via links (status-only, scoped).
4. US3 → reconciliation trust and auditability.

### Multi-Developer Parallelism

After Foundational: one developer on `sitio-dashboard` US1 routes/UI, another on `sitio-backend` US1 endpoints; merge when API contracts stabilize.

---

## Notes

- **Prisma migrations**: If `sitio-backend` follows a “human runs migrate” policy, T007 remains a human-gated step; do not hand-edit SQL migrations unless your repo allows it.
- **Contract source of truth**: `contracts/backend-api.openapi.yaml` lives under `sitio-design-notes`; implementation tasks reference both repos—keep OpenAPI in sync when endpoints change (T045).
- **[P]** tasks must not edit the same file concurrently.
