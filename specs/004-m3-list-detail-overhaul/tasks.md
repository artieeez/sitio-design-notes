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

### Phase 1 baseline (recorded 2026-04-08; refreshed after Phase 2)

| Check | Result |
|-------|--------|
| `pnpm lint` (`sitio-dashboard`) | Exit 0; Biome prints **info** that `$schema` is 2.1.2 while CLI is 2.4.10 (suggests `biome migrate`) |
| `pnpm typecheck` | **Pass** — `School` mocks include `description` / `imageUrl` where required |
| `pnpm test` | **Pass** — 35 tests in 14 files; Vitest skips TanStack Start / Nitro / devtools plugins when `VITEST` is set (see `vite.config.ts`) to avoid duplicate React under the test runner |

- [x] T001 Confirm implementation is limited to `../sitio-dashboard` per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md` (no backend scope unless newly discovered gap)
- [x] T002 [P] Capture baseline: run `pnpm lint`, `pnpm typecheck`, and `pnpm test` in `../sitio-dashboard` and record pass state before feature edits

---

## Phase 2: Foundational (blocking)

**Purpose**: Shared **list–detail shell**, **shadcn Alert Dialog**, and **unsaved-changes guard** — **no user story route migration** should start before this checkpoint.

**⚠️ CRITICAL**: Complete Phase 2 before Phase 3–5.

- [x] T003 [P] Add shadcn **Alert Dialog** primitive to `../sitio-dashboard/src/components/ui/alert-dialog.tsx` (see `../sitio-design-notes/specs/004-m3-list-detail-overhaul/quickstart.md`)
- [x] T004 [P] Add `pt-BR` copy keys for unsaved-changes dialog (title, description, continue, discard, optional save) in `../sitio-dashboard/src/messages/pt-BR.ts`
- [x] T005 [P] Add **failing-first** tests for `list-detail-layout` shell (list/detail regions, stable `data-testid` / roles contract) in `../sitio-dashboard/src/test/list-detail-layout-shell.test.tsx` — drive **T009** to green
- [x] T006 [P] Add **failing-first** tests for `unsaved-changes-dialog` (open, continue editing, discard) in `../sitio-dashboard/src/test/unsaved-changes-dialog-shell.test.tsx` — drive **T008** to green
- [x] T007 Implement dirty/pending-intent state API in `../sitio-dashboard/src/hooks/use-unsaved-changes-guard.ts` per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/data-model.md`
- [x] T008 Implement `../sitio-dashboard/src/components/layout/unsaved-changes-dialog.tsx` composing shadcn `alert-dialog` + `pt-BR` strings + actions per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/contracts/unsaved-changes-dialog.md`
- [x] T009 Implement `../sitio-dashboard/src/components/layout/list-detail-layout.tsx` (list pane, detail pane, expanded vs compact behavior, stable `data-testid` / roles for tests) per `../sitio-design-notes/specs/004-m3-list-detail-overhaul/contracts/list-detail-layout.md`
- [x] T010 Wire list selection changes and detail “exit” intents to the guard + dialog from `../sitio-dashboard/src/hooks/use-unsaved-changes-guard.ts` via `../sitio-dashboard/src/components/layout/list-detail-layout.tsx`; follow **TanStack Router** strategy in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/research.md` §4 and record the **chosen** API (blocker vs wrapper) in an English comment at top of `../sitio-dashboard/src/hooks/use-unsaved-changes-guard.ts`

**Checkpoint**: **T005–T006** tests green; layout + dialog + guard usable from route code; proceed to User Story 1.

---

## Phase 3: User Story 1 — Coordinated list + detail (Priority: P1) MVP

**Goal**: Wide layouts show **coordinated list and detail**; **selection** drives detail; **keyboard** order is sane; **unsaved** edits block row change / navigation with **Alert Dialog**; **deep links** to missing entities show **detail-region** not-found where applicable (**FR-012**, **FR-013**, **FR-014**). Each migrated route must satisfy **FR-005** (empty, loading, error) in **both** panes without collapsing the pattern.

**Independent test**: On migrated screens, select rows, use keyboard, trigger invalid deep link, dirty a form and attempt to switch selection — behaviors match [spec.md](./spec.md) User Story 1.

### Tests for User Story 1 (write first; expect red until implementation lands)

- [x] T011 [P] [US1] Add integration-level tests for list/detail regions and selection behavior with real or stubbed routes in `../sitio-dashboard/src/test/list-detail-layout.test.tsx`
- [x] T012 [P] [US1] Add integration-level tests for unsaved-changes **Alert Dialog** with route/navigation context in `../sitio-dashboard/src/test/unsaved-changes-dialog.test.tsx`

### Implementation for User Story 1

- [x] T013 [US1] Add schools **parent layout** (TanStack Router layout + `Outlet`) co-located under `../sitio-dashboard/src/routes/schools/` wrapping `list-detail-layout`
- [x] T014 [US1] Refactor `../sitio-dashboard/src/routes/schools/index.tsx` to render the **list pane** + empty/detail placeholder consistent with M3 list–detail; ensure **FR-005** empty/loading/error for list and detail regions
- [x] T015 [US1] Refactor `../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` so school hub content renders in the **detail pane** without breaking school scope and breadcrumbs; ensure **FR-005** in both panes
- [x] T016 [US1] Refactor `../sitio-dashboard/src/routes/schools/$schoolId/trips/index.tsx` to M3 list–detail (trips collection + trip detail entry); ensure **FR-005** in both panes
- [x] T017 [US1] Refactor `../sitio-dashboard/src/routes/trips/$tripId/index.tsx` into list–detail context (trip summary/edit as **detail**; preserve navigation to passengers); ensure **FR-005** in both panes
- [x] T018 [US1] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/index.tsx` for M3 list–detail using `../sitio-dashboard/src/components/trips/PassengerTable.tsx` inside the **list pane**; ensure **FR-005** in both panes
- [x] T019 [US1] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/index.tsx` and related payment child routes under `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/` for M3 list–detail; ensure **FR-005** in both panes
- [ ] T020 [US1] Integrate `../sitio-dashboard/src/components/trips/TripForm.tsx` with dirty tracking + unsaved dialog (FR-012)
- [ ] T021 [US1] Integrate `../sitio-dashboard/src/components/schools/SchoolForm.tsx`, `../sitio-dashboard/src/components/trips/PassengerCreateForm.tsx`, and `../sitio-dashboard/src/components/trips/PaymentForm.tsx` with dirty tracking + dialog where fields are editable
- [x] T022 [US1] Align FR-014 **not-found** behavior on migrated deep-linked routes (reuse or extend `../sitio-dashboard/src/components/layout/route-invalid-recovery.tsx`) so **detail pane** shows `pt-BR` unavailable state and list remains usable when both panes are visible

**Checkpoint**: User Story 1 acceptance scenarios 1–6 are demonstrable on migrated flows; tests **T011–T012** green.

---

## Phase 4: User Story 2 — Compact viewports (Priority: P2)

**Goal**: Narrow widths use M3-appropriate **stacked** list/detail with **back**; **no dead ends**; **unsaved** blocks **back** (spec scenario 3).

**Independent test**: Repeat Story 1 flows at compact width per [spec.md](./spec.md) User Story 2.

### Tests for User Story 2

- [ ] T023 [P] [US2] Add tests for compact list↔detail navigation (including back affordance) in `../sitio-dashboard/src/test/list-detail-compact.test.tsx`

### Implementation for User Story 2

- [ ] T024 [US2] Finish compact/stacked behavior and visible **back** control in `../sitio-dashboard/src/components/layout/list-detail-layout.tsx` (integrate `../sitio-dashboard/src/hooks/use-mobile.ts` or existing breakpoint utilities)
- [ ] T025 [US2] Ensure compact **back** from detail runs through the same unsaved guard + `../sitio-dashboard/src/components/layout/unsaved-changes-dialog.tsx` path as row/navigation changes

**Checkpoint**: SC-002 walkthrough passes on migrated screens; **T023** green.

---

## Phase 5: User Story 3 — Create/edit in detail role (Priority: P3)

**Goal**: **Create** and **edit** routes render as **detail-pane** experiences (or documented equivalent) consistent with browse mode (**FR-004**).

**Independent test**: Create and edit flows per [spec.md](./spec.md) User Story 3 without a disconnected full-page layout.

### Tests for User Story 3

- [ ] T026 [P] [US3] Add tests asserting create/edit surfaces render within the list–detail **detail** region (or approved equivalent) in `../sitio-dashboard/src/test/list-detail-create.test.tsx`

### Implementation for User Story 3

- [ ] T027 [US3] Refactor `../sitio-dashboard/src/routes/schools/new.tsx` into **detail create** mode under the schools list–detail shell (or document exemption in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md` with acceptance criteria)
- [ ] T028 [US3] Refactor `../sitio-dashboard/src/routes/schools/$schoolId/trips/new.tsx` into **detail create** mode under the trips list–detail shell
- [ ] T029 [US3] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/new.tsx` into **detail create** mode under passengers list–detail
- [ ] T030 [US3] Refactor `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/new.tsx` and `../sitio-dashboard/src/routes/trips/$tripId/passengers/$passengerId/payments/$paymentId/edit.tsx` into **detail** pattern under payments list–detail

**Checkpoint**: User Story 3 acceptance scenarios hold; **T026** green.

---

## Phase 6: Polish & cross-cutting

**Purpose**: Accessibility verification, UX consistency documentation, concurrent-change minimum, exemptions, CI gates.

- [ ] T031 [P] Append **FR-013** manual verification steps **and** **FR-007** UX consistency bullets (terminology, selection affordances, motion/focus) to `../sitio-design-notes/specs/004-m3-list-detail-overhaul/quickstart.md` (see [plan.md](./plan.md) §FR-013 verification and §FR-007)
- [ ] T032 Run the manual checklist in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/quickstart.md` and fix issues in `../sitio-dashboard`
- [ ] T033 [P] Record any **M3 exemptions** (e.g. `/`, `/schools/$schoolId/home`) with rationale + acceptance criteria in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md`
- [ ] T034 [P] Implement **plan** minimum for **concurrent data changes** (`../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md` §Concurrent data changes): ensure mutations invalidate/refetch via React Query and **do not** silently overwrite **dirty** forms; optional banner deferred — if deferred, add one-line **deferral** note in `../sitio-design-notes/specs/004-m3-list-detail-overhaul/plan.md`
- [ ] T035 [P] Final verification: `pnpm lint`, `pnpm typecheck`, `pnpm test` in `../sitio-dashboard`

---

## Dependencies & execution order

### Phase dependencies

- **Phase 1** → **Phase 2** → **Phases 3–5** (user stories) → **Phase 6**
- **Phase 3** depends on Phase 2 completion (**T005–T010** green)
- **Phase 4** depends on Phase 3 **layout + guard** in use (complete **T013–T015** minimum before relying on compact tests against real routes)

### User story dependencies

- **US1**: After Phase 2; no dependency on US2/US3
- **US2**: After US1 **shared** `list-detail-layout` exists (**T009+**); compact tests need migrated routes — finish **T013–T015** minimum first
- **US3**: After US1 (create flows need stable list–detail shell)

### Parallel opportunities

- **T003** + **T004** + **T005** + **T006** (different files)
- **T011** + **T012** (different test files)
- **T023** can be drafted once `data-testid`/roles from **T009** are stable
- **T026** parallel prep with **T023** if files differ
- **T031**, **T033**, **T034**, **T035** parallelizable where artifacts do not conflict

---

## Parallel example: Phase 2 (foundational)

```bash
# After T004, start failing-first shell tests in parallel:
../sitio-dashboard/src/test/list-detail-layout-shell.test.tsx
../sitio-dashboard/src/test/unsaved-changes-dialog-shell.test.tsx
```

---

## Implementation strategy

### MVP first (User Story 1 only)

1. Complete Phase 1–2 (**T001–T010**), including **T005–T006** red→green with **T008–T009**
2. Complete Phase 3 through at least **schools** vertical (**T013–T015**) + **T011–T012**, then expand **T016–T022**
3. **Stop and validate** against spec User Story 1 independent test
4. Proceed to US2, US3, then Phase 6

### Incremental delivery

- Prefer **no** long-lived unused layout exports: land **T013** in the same slice as **T009–T010** when policy forbids dead code

### Task counts

| Scope | Tasks |
|-------|-------|
| Phase 1 | 2 |
| Phase 2 | 8 |
| Phase 3 (US1) | 12 |
| Phase 4 (US2) | 3 |
| Phase 5 (US3) | 5 |
| Phase 6 | 5 |
| **Total** | **35** |

| User story | Task IDs |
|------------|----------|
| US1 | T011–T022 |
| US2 | T023–T025 |
| US3 | T026–T030 |

---

## Notes

- **Pagination / virtualization**: out of scope per spec clarifications — do not add as part of these tasks.
- **Backend**: no tasks in `../sitio-backend` unless a blocking API issue is filed as a separate spec.
- All user-visible strings: **`pt-BR`**; code/comments: **English**.
