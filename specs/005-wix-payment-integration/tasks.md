---
description: "Task list for Wix Payment Gateway Event Console (005)"
---

# Tasks: Wix Payment Gateway Event Console

**Input**: Design documents from `/specs/005-wix-payment-integration/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: REQUIRED per user story (Vitest + Testing Library), aligned with `plan.md` constitution gates and `tasks-template.md`.

**Organization**: Phases follow spec priorities (US1 → US2 → US3). Implementation targets **`../sitio-dashboard` only**; `../sitio-backend` is out of scope.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies within the same phase).
- **[Story]**: `US1`, `US2`, or `US3` for user-story phases only.
- Paths use the sibling repo prefix `../sitio-dashboard/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm environment, boundaries, and baseline quality before feature edits.

- [x] T001 Confirm all implementation tasks target `../sitio-dashboard` only and `../sitio-backend` remains out of scope per [spec.md](./spec.md) FR-011 and [plan.md](./plan.md).
- [x] T002 Run `pnpm lint` and `pnpm typecheck` in `../sitio-dashboard/` and record a clean baseline before adding Wix files.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, validation, and mock data consumed by every user story.

**⚠️ CRITICAL**: Complete this phase before starting User Story phases.

- [x] T003 Add Zod schemas and inferred TypeScript types for `WixPaymentEvent` and `WixPaymentEventListItem` matching [contracts/wix-payment-event.ui.schema.json](./contracts/wix-payment-event.ui.schema.json) and [contracts/wix-payment-event-list-item.ui.schema.json](./contracts/wix-payment-event-list-item.ui.schema.json) in `../sitio-dashboard/src/lib/wix-payment-event-schemas.ts`.
- [x] T004 Add exported mock fixture list (sufficient rows for multi-page pagination; mix of `isOrphan: true` and `false`) parsed through T003 in `../sitio-dashboard/src/lib/wix-payment-events.fixtures.ts`.

**Checkpoint**: Schemas and fixtures compile; no runtime network calls.

---

## Phase 3: User Story 1 — Access and inspect Wix payment events (Priority: P1) 🎯 MVP

**Goal**: School-scoped sidebar entry, `ListDetailLayout` route shell, mocked event table, row selection opens detail pane with full payload fields.

**Independent Test**: With an active school, open Wix from the sidebar; see mock rows; click a row → detail pane shows all fields from the design payload ([spec.md](./spec.md) US1).

### Tests for User Story 1 (REQUIRED) ✅

> Write these tests first; they MUST fail before route/UI wiring exists, then pass after implementation.

- [x] T005 [P] [US1] Add Vitest + RTL coverage for school-scoped Wix navigation and list–detail shell (sidebar link enabled with school, disabled without; route renders table + detail outlet/placeholder) in `../sitio-dashboard/src/test/wix-integration-route.test.tsx`.

### Implementation for User Story 1

- [x] T006 [US1] Add Brazilian Portuguese UI strings for Wix integration (nav label, page title, empty prompts) in `../sitio-dashboard/src/messages/pt-BR.ts`.
- [x] T007 [US1] Register the Wix Integration `SidebarMenuButton` + `Link` (same school-gated pattern as Trips) in `../sitio-dashboard/src/components/layout/dashboard-shell.tsx`.
- [x] T008 [US1] Create TanStack Router file routes under `../sitio-dashboard/src/routes/schools/$schoolId/integrations/wix/` (`route.tsx` using `ListDetailLayout` from `../sitio-dashboard/src/components/layout/list-detail-layout.tsx`, child routes for list-only vs selected event per existing trips pattern in `../sitio-dashboard/src/routes/schools/$schoolId/trips/route.tsx`).
- [x] T009 [P] [US1] Implement `WixPaymentEventsListPane` (table with Trip, Value, Buyer Name, Email, Date; loads rows from T004) in `../sitio-dashboard/src/components/wix/wix-payment-events-list-pane.tsx`.
- [x] T010 [P] [US1] Implement `WixPaymentEventDetailPane` (read-only field list for every key in the payload contract) in `../sitio-dashboard/src/components/wix/wix-payment-event-detail-pane.tsx`.
- [x] T011 [US1] Wire list selection navigation and `<Outlet>` detail rendering so behaviour matches existing list–detail flows; update generated `../sitio-dashboard/src/routeTree.gen.ts` via the project’s router dev/codegen workflow.

**Checkpoint**: US1 acceptance scenarios pass; T005 green.

---

## Phase 4: User Story 2 — Register integration keys (Priority: P2)

**Goal**: Two inputs (public key + private/API key) above the table; values persist for the browser session; private field masked with optional reveal per [research.md](./research.md).

**Independent Test**: Keys visible above table; typing and blur retains values; private key not plain by default ([spec.md](./spec.md) US2).

### Tests for User Story 2 (REQUIRED) ✅

- [x] T012 [P] [US2] Add Vitest + RTL tests asserting both inputs render above the table, private input is masked by default, and values remain after blur in `../sitio-dashboard/src/test/wix-integration-keys.test.tsx`.

### Implementation for User Story 2

- [x] T013 [US2] Implement `WixIntegrationKeyFields` (controlled inputs, `type="password"` for private/API key, optional reveal toggle, `pt-BR` labels/placeholders) in `../sitio-dashboard/src/components/wix/wix-integration-key-fields.tsx`.
- [x] T014 [US2] Compose key fields above the events table inside the Wix list shell (`../sitio-dashboard/src/components/wix/wix-payment-events-list-pane.tsx` or the parent layout component used by `../sitio-dashboard/src/routes/schools/$schoolId/integrations/wix/route.tsx`).

**Checkpoint**: US2 acceptance scenarios pass; T012 green.

---

## Phase 5: User Story 3 — Sort, paginate, and filter orphan events (Priority: P3)

**Goal**: Sortable columns (all five), page sizes 10 / 25 / 100, orphan `BooleanFilterChip` (reuse `../sitio-dashboard/src/components/ui/boolean-filter-chip.tsx` like `../sitio-dashboard/src/components/schools/school-trips-list-pane.tsx`), visible orphan tags on rows.

**Independent Test**: Sort each column; change page size; toggle chip → only orphans; empty state when no orphans ([spec.md](./spec.md) US3).

### Tests for User Story 3 (REQUIRED) ✅

- [x] T015 [P] [US3] Add Vitest + RTL tests for column sort direction, pagination boundaries, orphan chip filtering, and orphan-only empty state in `../sitio-dashboard/src/test/wix-payment-events-table.test.tsx`.

### Implementation for User Story 3

- [x] T016 [US3] Extend `../sitio-dashboard/src/components/wix/wix-payment-events-list-pane.tsx` with client-side sort state for Trip, Value, Name, Email, and Date columns (toggle asc/desc per header).
- [x] T017 [P] [US3] Add toolbar UI for page size select (10 / 25 / 100) and pagination controls in `../sitio-dashboard/src/components/wix/wix-payment-events-table-toolbar.tsx` (or co-located section in `wix-payment-events-list-pane.tsx` if a separate file is unnecessary).
- [x] T018 [US3] Integrate `BooleanFilterChip` for orphan-only filtering and row-level orphan badges consistent with `../sitio-dashboard/src/components/schools/school-trips-list-pane.tsx` chip usage.
- [x] T019 [US3] Reset `pageIndex` when `pageSize`, sort, or orphan filter changes; align selected row / detail behaviour with spec edge cases (selection hidden after filter) in `../sitio-dashboard/src/routes/schools/$schoolId/integrations/wix/route.tsx` and/or `../sitio-dashboard/src/components/wix/wix-payment-events-list-pane.tsx`.

**Checkpoint**: US3 acceptance scenarios pass; T015 green.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, manual verification, documentation.

- [x] T020 Run `pnpm lint`, `pnpm test`, and `pnpm typecheck` in `../sitio-dashboard/` and fix any regressions introduced by this feature.
- [x] T021 [P] Execute manual verification steps from [quickstart.md](./quickstart.md) against a local `pnpm dev` session.
- [x] T022 [P] Confirm list–detail layout matches Material Design 3 [List–detail canonical layout](https://m3.material.io/foundations/layout/canonical-layouts/list-detail) (narrow/detail behaviour vs trips) or document a justified exemption in `../sitio-dashboard/readme.MD` if product requires deviation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)** → no prerequisites.
- **Phase 2 (Foundational)** → depends on Phase 1; **blocks all user stories**.
- **Phase 3 (US1)** → depends on Phase 2; delivers MVP.
- **Phase 4 (US2)** → depends on Phase 3 list shell (`WixPaymentEventsListPane` / route exists).
- **Phase 5 (US3)** → depends on Phase 3 table baseline; may proceed in parallel with Phase 4 after US1 if staffing allows (coordinate on `wix-payment-events-list-pane.tsx` to avoid merge conflicts).
- **Phase 6 (Polish)** → after US1–US3 tasks intended for this release are complete.

### User Story Dependencies

| Story | Depends on | Notes |
|-------|------------|--------|
| US1 | Phase 2 | No dependency on US2/US3 |
| US2 | US1 | Needs route + list container |
| US3 | US1 | Extends table; optional parallel with US2 |

### Parallel Opportunities

- **Phase 2**: None between T003 and T004 (T004 imports T003).
- **Phase 3**: T005 [P] vs early message work blocked? T005 is tests only — [P] with T006 if tests do not need T006 strings (use inline literals in test first). Prefer sequential: T005 then T006–T011, or run T005 after T008 minimal stub — **Practical order**: T006–T008 first minimal route, then T005, then T009–T011, then iterate until T005 passes.
- **Phase 4**: T012 [P] can be drafted alongside T013 if test targets a standalone `WixIntegrationKeyFields` mount.
- **Phase 5**: T015 [P] vs T016–T019: write T015 first (failing), then implement T016–T019.
- **Phase 6**: T021 and T022 marked [P] can run in parallel.

---

## Parallel Example: User Story 3

```bash
# After list pane exposes sort/page/chip hooks or pure helpers:
# Implementer A: T016 + T019 (list pane behaviour)
# Implementer B: T017 toolbar component + tests T015 assertions for pagination
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) including T005.
3. **STOP and VALIDATE** against [quickstart.md](./quickstart.md) US1 slice.

### Incremental Delivery

1. Add US2 (keys) → run T012 + manual check.
2. Add US3 (sort/page/chip) → run T015 + manual check.
3. Phase 6 quality gates before merge.

### Parallel Team Strategy

- Developer A: US1 route + layout (T008, T011).
- Developer B: US1 components (T009, T010) after T004 fixtures exist.
- Merge order: Foundational → US1 shell → US1 components → tests green → US2/US3.

---

## Notes

- Do **not** add backend routes, webhooks, or persistence for keys/events in this feature.
- Keep code/comments in English; all new user-visible strings in `pt-BR`.
- Prefer reusing `ListDetailLayout`, `BooleanFilterChip`, and `dashboard-shell.tsx` patterns over new primitives.

---

## Task summary

| Phase | Task IDs | Count |
|-------|-----------|-------|
| Setup | T001–T002 | 2 |
| Foundational | T003–T004 | 2 |
| US1 | T005–T011 | 7 |
| US2 | T012–T014 | 3 |
| US3 | T015–T019 | 5 |
| Polish | T020–T022 | 3 |
| **Total** | **T001–T022** | **22** |

**Parallel-friendly tasks**: T005 [P], T009 [P], T010 [P], T012 [P], T015 [P], T017 [P], T021 [P], T022 [P] (where dependencies allow).

**Suggested MVP scope**: Phase 1 + Phase 2 + Phase 3 (US1), tasks **T001–T011** and green **T005**.
