# Tasks: Dashboard list–detail layout overhaul (M3)

**Input**: Design documents from `/specs/004-m3-list-detail-overhaul/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required per constitution / SC-006: add or extend Vitest + Testing Library coverage for layout, dialog, and navigation behavior in `../sitio-dashboard/src/test/`.

**Organization**: Phases follow user story priorities (P1 → P2 → P3); implementation target is **`../sitio-dashboard`** only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no ordering dependency within the same checkpoint)
- **[Story]**: `[US1]`, `[US2]`, `[US3]` for user-story phases only
- Paths use the sibling repo: `../sitio-dashboard/...`

---

## Phase 1: Setup (shared)

**Purpose**: Confirm scope, baseline, and tooling before code changes.

- [ ] T001 Confirm implementation is limited to `../sitio-dashboard` per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md` (no backend scope unless newly discovered gap)
- [ ] T002 [P] Capture baseline: run `pnpm lint`, `pnpm typecheck`, and `pnpm test` in `../sitio-dashboard` and record pass state before feature edits

---

## Phase 2: Foundational (blocking)

**Purpose**: Shared **list–detail shell**, **shadcn Alert Dialog**, and **unsaved-changes guard** — **no user story route migration** should start before this checkpoint.

**⚠️ CRITICAL**: Complete Phase 2 before Phase 3–5.

- [ ] T003 [P] Add shadcn **Alert Dialog** primitive to `../sitio-dashboard/src/components/ui/alert-dialog.tsx` (see `../sitio-design-notes/specs/004-m3-list-detail-overhaul/quickstart.md`)
- [ ] T004 [P] Add `pt-BR` copy keys for unsaved-changes dialog (title, description, continue, discard, optional save) in `../sitio-dashboard/src/messages/pt-BR.ts`
- [ ] T005 Implement dirty/pending-intent state API in `../sitio-dashboard/src/hooks/use-unsaved-changes-guard.ts` per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/data-model.md`
- [ ] T006 Implement `../sitio-dashboard/src/components/layout/unsaved-changes-dialog.tsx` composing shadcn `alert-dialog` + `pt-BR` strings + actions per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/contracts/unsaved-changes-dialog.md`
- [ ] T007 Implement `../sitio-dashboard/src/components/layout/list-detail-layout.tsx` (list pane, detail pane, expanded vs compact behavior, stable `data-testid` / roles for tests) per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/contracts/list-detail-layout.md`
- [ ] T008 Wire list selection changes and detail “exit” intents to the guard + dialog from `../sitio-dashboard/src/hooks/use-unsaved-changes-guard.ts` via `../sitio-dashboard/src/components/layout/list-detail-layout.tsx` (and document router interception approach in code comments in English)

**Checkpoint**: Layout + dialog + guard are usable from route code; proceed to User Story 1.

---

## Phase 3: User Story 1 — Coordinated list + detail (Priority: P1) MVP

**Goal**: Wide layouts show **coordinated list and detail**; **selection** drives detail; **keyboard** order is sane; **unsaved** edits block row change / navigation with **Alert Dialog**; **deep links** to missing entities show **detail-region** not-found where applicable (**FR-012**, **FR-013**, **FR-014**).

**Independent test**: On migrated screens, select rows, use keyboard, trigger invalid deep link, dirty a form and attempt to switch selection — behaviors match [spec.md](./spec.md) User Story 1.

### Tests for User Story 1 (write first; expect red until implementation lands)

- [ ] T009 [P] [US1] Add tests for list/detail regions and selection behavior in `../sitio-dashboard/src/test/list-detail-layout.test.tsx`
- [ ] T010 [P] [US1] Add tests for unsaved-changes **Alert Dialog** open/continue/discard in `../sitio-dashboard/src/test/unsaved-changes-dialog.test.tsx`

### Implementation for User Story 1

- [ ] T011 [US1] Add schools **parent layout** (TanStack Router layout + `Outlet`) co-located under `../sitio-dashboard/src/routes/schools/` wrapping `list-detail-layout`
- [ ] T012 [US1] Refactor `../sitio-dashboard/src/routes/schools/index.tsx` to render the **list pane** + empty/detail placeholder consistent with M3 list–detail
- [ ] T013 [US1] Refactor `../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` so school hub content renders in the **detail pane** without breaking school scope and breadcrumbs
- [ ] T014 [US1] Refactor `../sitio-dashboard/src/routes/schools/$schoolId/trips/index.tsx` to M3 list–detail (trips collection + trip detail entry)
- [ ] T015 [US1] Refactor `../sitio-dashboard/src/routes/trips/$tripId/index.tsx` into list–detail context (trip summary/edit as **detail**; preserve navigation to passengers)
- [ ] T016 [US1] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/index.tsx` for M3 list–detail using `../sitio-dashboard/src/components/trips/PassengerTable.tsx` inside the **list pane**
- [ ] T017 [US1] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/index.tsx` and related payment child routes under `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/` for M3 list–detail
- [ ] T018 [US1] Integrate `../sitio-dashboard/src/components/trips/TripForm.tsx` with dirty tracking + unsaved dialog (FR-012)
- [ ] T019 [US1] Integrate `../sitio-dashboard/src/components/schools/SchoolForm.tsx`, `../sitio-dashboard/src/components/trips/PassengerCreateForm.tsx`, and `../sitio-dashboard/src/components/trips/PaymentForm.tsx` with dirty tracking + dialog where fields are editable
- [ ] T020 [US1] Align FR-014 **not-found** behavior on migrated deep-linked routes (reuse or extend `../sitio-dashboard/src/components/layout/route-invalid-recovery.tsx`) so **detail pane** shows `pt-BR` unavailable state and list remains usable when both panes are visible

**Checkpoint**: User Story 1 acceptance scenarios 1–6 are demonstrable on migrated flows; tests T009–T010 green.

---

## Phase 4: User Story 2 — Compact viewports (Priority: P2)

**Goal**: Narrow widths use M3-appropriate **stacked** list/detail with **back**; **no dead ends**; **unsaved** blocks **back** (spec scenario 3).

**Independent test**: Repeat Story 1 flows at compact width per [spec.md](./spec.md) User Story 2.

### Tests for User Story 2

- [ ] T021 [P] [US2] Add tests for compact list↔detail navigation (including back affordance) in `../sitio-dashboard/src/test/list-detail-compact.test.tsx`

### Implementation for User Story 2

- [ ] T022 [US2] Finish compact/stacked behavior and visible **back** control in `../sitio-dashboard/src/components/layout/list-detail-layout.tsx` (integrate `../sitio-dashboard/src/hooks/use-mobile.ts` or existing breakpoint utilities)
- [ ] T023 [US2] Ensure compact **back** from detail runs through the same unsaved guard + `../sitio-dashboard/src/components/layout/unsaved-changes-dialog.tsx` path as row/navigation changes

**Checkpoint**: SC-002 walkthrough passes on migrated screens; T021 green.

---

## Phase 5: User Story 3 — Create/edit in detail role (Priority: P3)

**Goal**: **Create** and **edit** routes render as **detail-pane** experiences (or documented equivalent) consistent with browse mode (**FR-004**).

**Independent test**: Create and edit flows per [spec.md](./spec.md) User Story 3 without a disconnected full-page layout.

### Tests for User Story 3

- [ ] T024 [P] [US3] Add tests asserting create/edit surfaces render within the list–detail **detail** region (or approved equivalent) in `../sitio-dashboard/src/test/list-detail-create.test.tsx`

### Implementation for User Story 3

- [ ] T025 [US3] Refactor `../sitio-dashboard/src/routes/schools/new.tsx` into **detail create** mode under the schools list–detail shell (or document exemption in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md` with acceptance criteria)
- [ ] T026 [US3] Refactor `../sitio-dashboard/src/routes/schools/$schoolId/trips/new.tsx` into **detail create** mode under the trips list–detail shell
- [ ] T027 [US3] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/new.tsx` into **detail create** mode under passengers list–detail
- [ ] T028 [US3] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/new.tsx` and `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/$paymentId/edit.tsx` into **detail** pattern under payments list–detail

**Checkpoint**: User Story 3 acceptance scenarios hold; T024 green.

---

## Phase 6: Polish & cross-cutting

**Purpose**: Accessibility verification, documentation, exemptions, CI gates.

- [ ] T029 [P] Append **FR-013** manual verification steps (keyboard, focus visibility, dialog focus trap) to `../sitio-design-notes/specs/004-m3-list-detail-overhaul/quickstart.md`
- [ ] T030 Run the manual checklist in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/quickstart.md` and fix issues in `../sitio-dashboard`
- [ ] T031 [P] Record any **M3 exemptions** (e.g. `/`, `/schools/$schoolId/home`) with rationale + acceptance criteria in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md`
- [ ] T032 [P] Final verification: `pnpm lint`, `pnpm typecheck`, `pnpm test` in `../sitio-dashboard`

---

## Dependencies & execution order

### Phase dependencies

- **Phase 1** → **Phase 2** → **Phases 3–5** (user stories) → **Phase 6**
- **Phase 3** depends on Phase 2 completion
- **Phase 4** depends on Phase 3** layout + guard** being in place (can start layout tweaks after T007–T008 even if T011+ incomplete — in practice finish **Phase 3** list–detail shell usage first for one vertical to avoid thrash)

### User story dependencies

- **US1**: After Phase 2; no dependency on US2/US3
- **US2**: After US1 **shared** `list-detail-layout` exists (T007+); compact tests assume at least one migrated route — complete **T011–T013** minimum before deep compact testing
- **US3**: After US1 (create flows need stable list–detail shell)

### Parallel opportunities

- **T003** + **T004** (different files)
- **T009** + **T010** (different test files)
- **T021** can be authored in parallel with late US1 tasks once `data-testid`/roles exist
- **T024** in parallel prep with **T021** if file names differ
- **T029**, **T031**, **T032** parallelizable with distinct artifacts (docs vs CI)

---

## Parallel example: User Story 1

```bash
# After Phase 2, start tests in parallel:
../sitio-dashboard/src/test/list-detail-layout.test.tsx
../sitio-dashboard/src/test/unsaved-changes-dialog.test.tsx
```

---

## Implementation strategy

### MVP first (User Story 1 only)

1. Complete Phase 1–2 (T001–T008)
2. Complete Phase 3 through at least **schools** vertical (T011–T013) + tests T009–T010, then expand T014–T020
3. **Stop and validate** against spec User Story 1 independent test
4. Proceed to US2 (compact) and US3 (create/edit), then Phase 6

### Incremental delivery

- Merge **Phase 2** as a stack PR if routes are not yet migrated (feature flag or unused exports acceptable only if tree-shaken and lint-clean — prefer **first route** using the shell in the same PR as Phase 2 if policy requires no dead code)

### Task counts

| Scope | Tasks |
|-------|-------|
| Phase 1 | 2 |
| Phase 2 | 6 |
| Phase 3 (US1) | 12 |
| Phase 4 (US2) | 3 |
| Phase 5 (US3) | 5 |
| Phase 6 | 4 |
| **Total** | **32** |

| User story | Task IDs |
|------------|----------|
| US1 | T009–T020 |
| US2 | T021–T023 |
| US3 | T024–T028 |

---

## Notes

- **Pagination / virtualization**: out of scope per spec clarifications — do not add as part of these tasks.
- **Backend**: no tasks in `../sitio-backend` unless a blocking API issue is filed as a separate spec.
- All user-visible strings: **`pt-BR`**; code/comments: **English**.
