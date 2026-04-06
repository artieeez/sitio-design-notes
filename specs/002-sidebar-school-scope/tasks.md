# Tasks: School-Scoped Sidebar & Scope Control

**Input**: Design documents from `/specs/002-sidebar-school-scope/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required per [spec.md](./spec.md) success criteria **SC-005** / **SC-006** and [plan.md](./plan.md) testing gate — Vitest + Testing Library in `../sitio-dashboard`.

**Organization**: Phases follow user story priority (**US1**/**US2** = P1, **US3**/**US4** = P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no ordering dependency within the same phase)
- **[USn]**: User story from [spec.md](./spec.md)
- Paths use sibling repos: `../sitio-dashboard/`, `../sitio-backend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm environment and contracts before implementation.

- [ ] T001 Confirm target repositories and scope split per [plan.md](./plan.md) (`../sitio-dashboard` primary; `../sitio-backend` conditional only)
- [ ] T002 Review client persistence contract in `specs/002-sidebar-school-scope/contracts/client-scope-state.md` and align key names before coding `../sitio-dashboard/src/lib/scope-persistence.ts`
- [ ] T003 [P] Verify `../sitio-dashboard` installs and `pnpm lint` / `pnpm test` pass on current `main` baseline before feature edits
- [ ] T004 [P] Confirm `../sitio-dashboard` API base URL env (`VITE_API_URL` or project equivalent) matches [quickstart.md](./quickstart.md) for local NestJS

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared **last accessed** / **recents** persistence, **FR-001** resolution helpers, and school list access — **required before** user story UI work.

**⚠️ CRITICAL**: No user story phase should start until core persistence + resolution utilities exist (or are stubbed with failing tests only if using strict TDD).

- [ ] T005 Implement read/write/migration for `localStorage` keys per `specs/002-sidebar-school-scope/contracts/client-scope-state.md` in `../sitio-dashboard/src/lib/scope-persistence.ts` (versioned keys, max **10** recents, dedupe)
- [ ] T006 [P] Add Zod types/schemas for recent-schools JSON payload in `../sitio-dashboard/src/lib/schemas/scope.ts` (export types used by persistence and UI)
- [ ] T007 Implement pure functions for **last created** selection (`createdAt` max, **id** lexicographic tie-break) and **last accessed** validation against server list in `../sitio-dashboard/src/lib/resolve-initial-school.ts` (English comments; unit-testable)
- [ ] T008 Extend `../sitio-dashboard/src/lib/query-keys.ts` with any keys needed for schools list + school detail reuse for scope (avoid cache collisions with existing `queryKeys.school`)
- [ ] T009 Ensure `../sitio-dashboard/src/lib/api-client.ts` / existing list calls can fetch **`GET /schools`** for initialization (reuse patterns from `../sitio-dashboard/src/routes/schools/index.tsx`); add a small `fetchSchoolsList` helper if it reduces duplication in `../sitio-dashboard/src/lib/schools-api.ts` (new file) or colocate in `../sitio-dashboard/src/lib/`
- [ ] T010 Add `../sitio-dashboard/src/hooks/use-schools-for-scope.ts` (or equivalent) wrapping TanStack Query for **schools list** used by init + scope menu (shared loading/error semantics for **FR-019**)
- [ ] T011 Create shared UI primitives for **blocking error + retry** (`../sitio-dashboard/src/components/layout/scope-blocking-error.tsx`) reusing existing Button/Typography patterns; copy in `../sitio-dashboard/src/messages/pt-BR.ts` (**FR-019** / **FR-020**)
- [ ] T012 Document in-code where **FR-020** is enforced (route school id invalid → **no** FR-001 substitution) in `../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` or a dedicated layout route file — implement navigation guard or equivalent **before** relying on shell content

**Checkpoint**: Persistence + resolution helpers compile; schools list query available; blocking error component ready for US1/US2.

---

## Phase 3: User Story 1 — Land with the correct school on app start (Priority: P1) 🎯 MVP

**Goal**: **FR-001**, **FR-019**, **FR-020** — cold start picks **last accessed** → **last created** → **school creation**; blocking error on init failure; invalid deep-linked school id shows recovery (**no** silent rescope).

**Independent Test**: Clear `localStorage` keys, seed schools with known `createdAt` order, cold-load each branch; verify navigation target and **no** scoped shell on **FR-019**/**FR-020**.

### Tests for User Story 1 (REQUIRED)

- [ ] T013 [P] [US1] Add unit tests for `../sitio-dashboard/src/lib/resolve-initial-school.ts` covering priority branches, stale last accessed, **last created** tie-break in `../sitio-dashboard/src/lib/resolve-initial-school.test.ts`
- [ ] T014 [P] [US1] Add Vitest tests for `../sitio-dashboard/src/lib/scope-persistence.ts` (dedupe, cap **10**, migration/no-crash on bad JSON) in `../sitio-dashboard/src/lib/scope-persistence.test.ts`
- [ ] T015 [US1] Add route/init integration tests for default landing redirect and **FR-020** invalid id using TanStack Router test utilities in `../sitio-dashboard/src/test/school-scope-init.test.tsx` (may mock `fetch` / QueryClient)

### Implementation for User Story 1

- [ ] T016 [US1] Implement app entry resolution: after **successful** schools list load, `navigate` from `../sitio-dashboard/src/routes/index.tsx` (and/or `../sitio-dashboard/src/routes/__root.tsx` child logic) to `/schools/$schoolId`, `/schools/new`, or stay on error UI per **FR-001**/**FR-019** — **do not** render school-scoped main content until resolution completes
- [ ] T017 [US1] On successful scope resolution, persist **last accessed** in `../sitio-dashboard/src/lib/scope-persistence.ts` when user lands on a valid school route
- [ ] T018 [US1] Handle **FR-019** in entry flow when `use-schools-for-scope` / list query fails: render `../sitio-dashboard/src/components/layout/scope-blocking-error.tsx` with **retry**; clear or avoid setting active school in client state
- [ ] T019 [US1] Handle **FR-020** when `schoolId` in URL is non-existent: extend `../sitio-dashboard/src/components/layout/route-invalid-recovery.tsx` usage or dedicated scope error in `../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` — **must not** run **FR-001** fallback to pick another school
- [ ] T020 [US1] Ensure **last accessed** removed school falls through to **last created** or creation flow (`../sitio-dashboard/src/lib/resolve-initial-school.ts` + entry navigation)
- [ ] T021 [US1] Update `../sitio-dashboard/src/messages/pt-BR.ts` with any new user-visible init/error strings (**pt-BR**)

**Checkpoint**: Cold-start branches match **FR-001**; **FR-019**/**FR-020** covered by tests; MVP demo can stop here.

---

## Phase 4: User Story 2 — See and understand the active school (Priority: P1)

**Goal**: **FR-002**–**FR-005**, **FR-021** — scope control shows **title**, favicon or **consistent** fallback, secondary **placeholder** line (non-authoritative); long name truncation/tooltip.

**Independent Test**: With a scoped school, open any school route; verify labels, fallback when `faviconUrl` null, placeholder secondary line, **aria** on icon controls.

### Tests for User Story 2 (REQUIRED)

- [ ] T022 [P] [US2] Add component tests for scope header rendering and fallback (mock school DTO) in `../sitio-dashboard/src/test/school-scope-control.test.tsx`

### Implementation for User Story 2

- [ ] T023 [US2] Implement `../sitio-dashboard/src/components/layout/school-scope-header.tsx` (or split files) showing favicon/`img` with fallback avatar/initials, **title** as primary line, **placeholder username** secondary line per **FR-005** (**pt-BR** copy from `../sitio-dashboard/src/messages/pt-BR.ts`)
- [ ] T024 [US2] Integrate scope header into `../sitio-dashboard/src/components/layout/dashboard-shell.tsx` **SidebarHeader** area; pass active school summary from route context or small Zustand store in `../sitio-dashboard/src/stores/active-school-store.ts` (new) if needed for shell
- [ ] T025 [US2] Add tooltip or `title` attribute for truncated long school **title** in `../sitio-dashboard/src/components/layout/school-scope-header.tsx` (edge case: very long names)
- [ ] T026 [US2] Verify **icon-only** affordances use **`aria-label`** (**pt-BR**) for school edit button (implemented fully in US4) — stub disabled if needed until **T036**

**Checkpoint**: Scoped shell always shows **which school**; accessibility baseline preserved (**FR-021**).

---

## Phase 5: User Story 3 — Switch or find a school without leaving the shell pattern (Priority: P2)

**Goal**: **FR-006** — scope control opens menu with **recents** (≤**10**), **search** (case-insensitive substring on **title**), **Add school** → `/schools/new`; selecting a school navigates and updates scope (**FR-013**).

**Independent Test**: From scoped dashboard, open menu — recents order, search filters, add school navigation, select switches `schoolId` in URL and persistence.

### Tests for User Story 3 (REQUIRED)

- [ ] T027 [P] [US3] Add tests for recent list cap/dedupe and search filter helper in `../sitio-dashboard/src/lib/scope-search.test.ts` (new) or extend existing lib tests
- [ ] T028 [US3] Add interaction tests for scope menu (open, select, add school) in `../sitio-dashboard/src/test/school-scope-menu.test.tsx`

### Implementation for User Story 3

- [ ] T029 [US3] Implement `../sitio-dashboard/src/components/layout/school-scope-menu.tsx` using **DropdownMenu** / **Popover** from `../sitio-dashboard/src/components/ui/*` — list **recent** schools, **Command** or filtered list for search, **Add school** `Link` to `/schools/new`
- [ ] T030 [US3] Wire menu to schools list query; filter client-side per [research.md](./research.md); empty states for no recents / no search results (**pt-BR** in `../sitio-dashboard/src/messages/pt-BR.ts`)
- [ ] T031 [US3] On school select: `navigate` to `/schools/$schoolId` (or default child), update **last accessed** + **recents** via `../sitio-dashboard/src/lib/scope-persistence.ts`, invalidate TanStack Query where needed (`../sitio-dashboard/src/lib/query-keys.ts`)
- [ ] T032 [US3] Make `../sitio-dashboard/src/components/layout/school-scope-header.tsx` open the menu on activate (full row or chevron — product choice) without breaking **FR-010** edit icon hit area

**Checkpoint**: Multi-school switching works; **FR-006** satisfied.

---

## Phase 6: User Story 4 — Navigate core school-scoped areas from the sidebar (Priority: P2)

**Goal**: **FR-008**–**FR-013** — sidebar **Home**, **Passengers**, **Payments** under scope; **no** sidebar “edit school” link; **FR-010** school edit via **icon-only** on scope row; links stay within `/schools/$schoolId/...` graph.

**Independent Test**: From scoped shell, click each nav target + edit icon; URLs and active school stay consistent; Passengers/Payments land on **001**-aligned entry routes.

### Tests for User Story 4 (REQUIRED)

- [ ] T033 [P] [US4] Add route tests asserting sidebar `Link` `to` props include current `$schoolId` in `../sitio-dashboard/src/test/school-scope-sidebar-nav.test.tsx`

### Implementation for User Story 4

- [ ] T034 [US4] Replace generic home/schools nav in `../sitio-dashboard/src/components/layout/dashboard-shell.tsx` with school-scoped items: **Home** → `/schools/$schoolId/` (or dedicated home child), **Passengers** → `/schools/$schoolId/trips` (trip list hub per **FR-011**), **Payments** → trip hub with query or first-step pattern per **FR-012** (document chosen entry in code comment referencing `specs/001-school-trip-payments/spec.md`)
- [ ] T035 [US4] Remove duplicate **school list** sidebar entry if it conflicts with **FR-009** (keep **scope menu** for discovery); adjust `../sitio-dashboard/src/messages/pt-BR.ts` labels (**pt-BR**)
- [ ] T036 [US4] Implement **school edit** navigation from **icon-only** button in `../sitio-dashboard/src/components/layout/school-scope-header.tsx` targeting existing school edit UI (`../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` or dedicated edit route if present)
- [ ] T037 [US4] Add **Home** placeholder content route if needed under `../sitio-dashboard/src/routes/schools/$schoolId/home.tsx` or reuse `../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` per **FR-008** (empty/minimal OK)
- [ ] T038 [US4] Ensure **FR-013**: after scope change from US3, `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.tsx` and sidebar links reflect new `$schoolId` (`../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.tsx`)

**Checkpoint**: Full **IA** per spec; **FR-010**/**FR-012** traceable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Lint, CI, docs, optional backend follow-up.

- [ ] T039 [P] Run `pnpm lint` and `pnpm test` in `../sitio-dashboard` and fix regressions introduced by this feature
- [ ] T040 [P] Update `../sitio-dashboard/src/test/dashboard-shell-and-routing.test.tsx` if shell structure changes broke assumptions
- [ ] T041 Verify **pt-BR** coverage for all new strings in `../sitio-dashboard/src/messages/pt-BR.ts` (no English user-visible regressions)
- [ ] T042 [P] If `GET /schools` becomes too large in practice, open follow-up: optional `sort`/`limit` support in `../sitio-backend/src/modules/school/school.controller.ts` — **only** if profiling requires (else skip)
- [ ] T043 Run manual sanity checklist in `specs/002-sidebar-school-scope/quickstart.md` and note gaps in `specs/002-sidebar-school-scope/tasks.md` (append “Verification notes” subsection when executing)

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1** → no prerequisites
- **Phase 2** → depends on Phase 1 — **blocks** all user stories
- **Phase 3 (US1)** → depends on Phase 2
- **Phase 4 (US2)** → depends on Phase 3 (needs valid scoped route + shell integration target; scope header can use store from US1)
- **Phase 5 (US3)** → depends on Phase 4 (menu needs scope header affordance)
- **Phase 6 (US4)** → depends on Phase 4 minimum (sidebar links need `$schoolId`; can parallelize with Phase 5 **after** `school-scope-header.tsx` exists — if staffed, coordinate file ownership)
- **Phase 7** → depends on desired user stories complete

### User story dependencies

| Story | Depends on | Notes |
|-------|------------|--------|
| **US1** | Foundational | No other stories |
| **US2** | US1 + Foundational | Needs navigation + school context |
| **US3** | US2 | Scope header UI |
| **US4** | US2 (links need active school); US3 optional for switching but not for static links | Prefer **US4** after **US2** so `$schoolId` is stable |

### Parallel opportunities

- **Phase 1**: T003 and T004 in parallel
- **Phase 2**: T006 parallel with T005 after contract review; T011 parallel with T007–T010 once API patterns known
- **US1 tests**: T013 and T014 in parallel
- **US2** test T022 can run parallel to small US1 fixes if files differ
- **US3** T027 parallel with menu implementation prep
- **US4** T033 parallel with T034–T037 if tests mock shell separately
- **Phase 7**: T039, T040, T041, T042 in parallel

### Parallel example: User Story 1

```bash
# Run unit tests together (after helpers exist):
../sitio-dashboard/src/lib/resolve-initial-school.test.ts
../sitio-dashboard/src/lib/scope-persistence.test.ts
```

### Parallel example: User Story 3

```bash
# Filter helper tests + menu component file:
../sitio-dashboard/src/lib/scope-search.test.ts
../sitio-dashboard/src/components/layout/school-scope-menu.tsx
```

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Complete Phase 1 + Phase 2  
2. Complete Phase 3 (**US1**) — init + **FR-019**/**FR-020** + tests  
3. **Stop and validate** cold-start matrix independently  

### Incremental delivery

1. Add **US2** — visible scope + placeholder + a11y  
2. Add **US3** — menu + recents + search  
3. Add **US4** — sidebar IA + edit icon  
4. Polish (Phase 7)

### Suggested MVP scope

- **MVP = US1** (Phase 3) after Foundational — delivers **FR-001**/**FR-019**/**FR-020**; staff always land in correct school context or explicit error/create flow.

---

## Notes

- **Repository boundary**: No application code in `sitio-design-notes`; all implementation tasks target `../sitio-dashboard` unless **T042** explicitly opens backend work.
- **001 alignment**: Trip/passenger/payment entry routes **must** stay consistent with `specs/001-school-trip-payments/spec.md` — cite in PR when choosing Payments hub.
- **Tests before implementation** where feasible: write **T013**–**T015** red, then implement **T016**–**T021**.

---

## Task summary

| Phase | Task IDs | Count |
|-------|-----------|-------|
| Setup | T001–T004 | 4 |
| Foundational | T005–T012 | 8 |
| US1 | T013–T021 | 9 |
| US2 | T022–T026 | 5 |
| US3 | T027–T032 | 6 |
| US4 | T033–T038 | 6 |
| Polish | T039–T043 | 5 |
| **Total** | **T001–T043** | **43** |

| User story | Task count (incl. tests) |
|------------|-------------------------|
| US1 | 9 |
| US2 | 5 |
| US3 | 6 |
| US4 | 6 |

**Format validation**: All tasks use `- [ ]`, sequential **T###** IDs, **[USn]** on user-story-phase tasks only, and **file paths** in descriptions.
