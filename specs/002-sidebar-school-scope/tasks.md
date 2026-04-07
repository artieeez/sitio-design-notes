# Tasks: School scope selector (002)

**Input**: Design documents from `/specs/002-sidebar-school-scope/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required per [spec.md](./spec.md) **SC-5** and [plan.md](./plan.md) testing gate — Vitest + Testing Library in `../sitio-dashboard`.

**Scope note**: [spec.md](./spec.md) covers **initialization** (**INIT-1**–**INIT-3**) and the **sidebar-top scope selector** only. **Sidebar nav** (Home, Trips, …), **top bar**, **breadcrumbs**, **edit/add** as separate rows are **out of spec** — Phase 6 below records that; tasks T033–T038 were written for a **wider** plan and are **not** required for 002 traceability.

**Organization**: Phases follow priority — **US1**/**US2** = P1 (init + visible scope), **US3** = P2 (expand/search/recents).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no ordering dependency within the same phase)
- **[USn]**: User story aligned with spec scenarios (P1 cold start / P1 see school / P2 change school)
- Paths use sibling repos: `../sitio-dashboard/`, `../sitio-backend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm environment and contracts before implementation.

- [X] T001 Confirm target repositories and scope split per [plan.md](./plan.md) (`../sitio-dashboard` primary; `../sitio-backend` conditional only)
- [X] T002 Review client persistence contract in `specs/002-sidebar-school-scope/contracts/client-scope-state.md` and align key names before coding `../sitio-dashboard/src/lib/scope-persistence.ts`
- [X] T003 [P] Verify `../sitio-dashboard` installs and `pnpm lint` / `pnpm test` pass on current `main` baseline before feature edits
- [X] T004 [P] Confirm `../sitio-dashboard` API base URL env (`VITE_API_URL` or project equivalent) matches [quickstart.md](./quickstart.md) for local NestJS

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared **last accessed** / **recents** persistence, **INIT-1** resolution helpers, and school list access — **required before** selector UI work.

**⚠️ CRITICAL**: No user story phase should start until core persistence + resolution utilities exist (or are stubbed with failing tests only if using strict TDD).

- [X] T005 Implement read/write/migration for `localStorage` keys per `specs/002-sidebar-school-scope/contracts/client-scope-state.md` in `../sitio-dashboard/src/lib/scope-persistence.ts` (versioned keys, max **10** recents, dedupe)
- [X] T006 [P] Add Zod types/schemas for recent-schools JSON payload in `../sitio-dashboard/src/lib/schemas/scope.ts` (export types used by persistence and UI)
- [X] T007 Implement pure functions for **last created** selection (`createdAt` max, **id** lexicographic tie-break) and **last accessed** validation against server list in `../sitio-dashboard/src/lib/resolve-initial-school.ts` (English comments; unit-testable)
- [X] T008 Extend `../sitio-dashboard/src/lib/query-keys.ts` with any keys needed for schools list + school detail reuse for scope (avoid cache collisions with existing `queryKeys.school`)
- [X] T009 Ensure `../sitio-dashboard/src/lib/api-client.ts` / existing list calls can fetch **`GET /schools`** for initialization (reuse patterns from `../sitio-dashboard/src/routes/schools/index.tsx`); add a small `fetchSchoolsList` helper if it reduces duplication in `../sitio-dashboard/src/lib/schools-api.ts` (new file) or colocate in `../sitio-dashboard/src/lib/`
- [X] T010 Add `../sitio-dashboard/src/hooks/use-schools-for-scope.ts` (or equivalent) wrapping TanStack Query for **schools list** used by init + selector (shared loading/error semantics for **INIT-2**)
- [X] T011 Create shared UI primitives for **blocking error + retry** in the **main content area** only (`../sitio-dashboard/src/components/layout/scope-blocking-error.tsx`) reusing existing Button/Typography patterns; **sidebar** stays visible with **scope selector** usable (**INIT-2** / **INIT-3**); copy in `../sitio-dashboard/src/messages/pt-BR.ts`
- [X] T012 Document in-code where **INIT-3** is enforced (route school id invalid → **no** INIT-1 substitution) in `../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` or a dedicated layout route file — implement navigation guard or equivalent **before** relying on shell content

**Checkpoint**: Persistence + resolution helpers compile; schools list query available; blocking error component ready for US1/US2.

---

## Phase 3: User Story 1 — Land with the correct school on app start (Priority: P1) 🎯 MVP

**Goal**: **INIT-1**, **INIT-2**, **INIT-3** — cold start picks **last accessed** → **last created** → **school creation**; blocking error on init failure; invalid deep-linked school id shows recovery (**no** silent rescope).

**Independent Test**: Clear `localStorage` keys, seed schools with known `createdAt` order, cold-load each branch; verify navigation target, **`/`** resolves via **INIT-1** (no visible root landing), and on **INIT-2**/**INIT-3** the error is **main-content-only** with **sidebar** / **selector** still available for recovery.

### Tests for User Story 1 (REQUIRED)

- [X] T013 [P] [US1] Add unit tests for `../sitio-dashboard/src/lib/resolve-initial-school.ts` covering priority branches, stale last accessed, **last created** tie-break in `../sitio-dashboard/src/lib/resolve-initial-school.test.ts`
- [X] T014 [P] [US1] Add Vitest tests for `../sitio-dashboard/src/lib/scope-persistence.ts` (dedupe, cap **10**, migration/no-crash on bad JSON) in `../sitio-dashboard/src/lib/scope-persistence.test.ts`
- [ ] T015 [US1] Add route/init integration tests for default landing redirect and **INIT-3** invalid id using TanStack Router test utilities in `../sitio-dashboard/src/test/school-scope-init.test.tsx` (may mock `fetch` / QueryClient)

### Implementation for User Story 1

- [X] T016 [US1] Implement app entry resolution on **`/`** (`../sitio-dashboard/src/routes/index.tsx` and/or `../sitio-dashboard/src/routes/__root.tsx`): after **successful** schools list load, `navigate` to `/schools/$schoolId` or `/schools/new`, or show **INIT-2** in **main content** only—**no** standalone visible root landing; **do not** render **school-scoped main** content until resolution completes
- [X] T017 [US1] On successful scope resolution, persist **last accessed** in `../sitio-dashboard/src/lib/scope-persistence.ts` when user lands on a valid school route
- [X] T018 [US1] Handle **INIT-2** in entry flow when `use-schools-for-scope` / list query fails: render `../sitio-dashboard/src/components/layout/scope-blocking-error.tsx` in **main content** with **retry**; keep **DashboardShell** / **sidebar** visible; clear or avoid setting active school in client state
- [X] T019 [US1] Handle **INIT-3** when `schoolId` in URL is non-existent: show error in **main content** in `../sitio-dashboard/src/routes/schools/$schoolId/index.tsx` (or layout) via `../sitio-dashboard/src/components/layout/route-invalid-recovery.tsx` or dedicated inline UI—**must not** run **INIT-1** fallback to pick another school; **must not** offer a **visible `/` recovery** page; staff recover via **selector** / **search** / **retry**
- [X] T020 [US1] Ensure **last accessed** removed school falls through to **last created** or creation flow (`../sitio-dashboard/src/lib/resolve-initial-school.ts` + entry navigation)
- [X] T021 [US1] Update `../sitio-dashboard/src/messages/pt-BR.ts` with any new user-visible init/error strings (**pt-BR**)

**Checkpoint**: Cold-start branches match **INIT-1**; **INIT-2**/**INIT-3** covered by tests; MVP demo can stop here.

---

## Phase 4: User Story 2 — See and understand the active school (Priority: P1)

**Goal**: **SEL-1**–**SEL-5**, **SEL-8**, **Q-2** — selector shows **title**, favicon or **consistent** fallback, **chevron**, secondary **placeholder** line; long name truncation/tooltip if needed.

**Independent Test**: With a scoped school, open any school route; verify labels, fallback when `faviconUrl` null, placeholder secondary line, **aria** on interactive controls.

### Tests for User Story 2 (REQUIRED)

- [X] T022 [P] [US2] Add component tests for scope header rendering and fallback (mock school DTO) in `../sitio-dashboard/src/test/school-scope-control.test.tsx`

### Implementation for User Story 2

- [X] T023 [US2] Implement `../sitio-dashboard/src/components/layout/school-scope-header.tsx` (or split files) showing favicon/`img` with fallback avatar/initials, **title** as primary line, **placeholder username** secondary line per **SEL-8** (**pt-BR** copy from `../sitio-dashboard/src/messages/pt-BR.ts`)
- [X] T024 [US2] Integrate scope header into `../sitio-dashboard/src/components/layout/dashboard-shell.tsx` **SidebarHeader** area; pass active school summary from route context or small Zustand store in `../sitio-dashboard/src/stores/active-school-store.ts` (new) if needed for shell
- [X] T025 [US2] Add tooltip or `title` attribute for truncated long school **title** in `../sitio-dashboard/src/components/layout/school-scope-header.tsx` (edge case: very long names)
- [X] T026 [US2] Ensure **chevron** (or equivalent) indicates expandability per **SEL-5**; if separate **edit** control exists in code, it is **out of spec** for 002 — hide or track under product backlog

**Checkpoint**: Scoped shell shows **which school** via selector; accessibility baseline preserved (**Q-2**).

---

## Phase 5: User Story 3 — Open selector, search, recents, switch school (Priority: P2)

**Goal**: **SEL-6**, **SEL-7** — expand in sidebar: **search**, **results**, **recents** (≤**10**); selecting navigates to `/schools/$schoolId` and updates scope.

**Spec**: Expanded panel lists **search**, **search results**, and **recents** only — **no** requirement for **Add school** inside the panel ([spec.md](./spec.md) **Out of scope** for add/edit as separate rows). If the codebase still has an “Add school” action in the menu, treat it as **optional product** outside 002.

**Independent Test**: From scoped dashboard, expand selector — recents order, search filters, select switches `schoolId` in URL and persistence.

### Tests for User Story 3 (REQUIRED)

- [X] T027 [P] [US3] Add tests for recent list cap/dedupe and search filter helper in `../sitio-dashboard/src/lib/scope-search.test.ts` (new) or extend existing lib tests
- [ ] T028 [US3] Add interaction tests for scope menu (open, select) in `../sitio-dashboard/src/test/school-scope-menu.test.tsx` — **optional**: assert “Add school” only if product keeps it

### Implementation for User Story 3

- [X] T029 [US3] Implement `../sitio-dashboard/src/components/layout/school-scope-menu.tsx` using **DropdownMenu** / **Popover** / **Collapsible** from `../sitio-dashboard/src/components/ui/*` — list **recent** schools, **Command** or filtered list for search; **Add school** `Link` to `/schools/new` is **optional** (not required by narrowed **002** spec)
- [X] T030 [US3] Wire menu to schools list query; filter client-side per [research.md](./research.md); empty states for no recents / no search results (**pt-BR** in `../sitio-dashboard/src/messages/pt-BR.ts`)
- [X] T031 [US3] On school select: `navigate` to `/schools/$schoolId` (or default child), update **last accessed** + **recents** via `../sitio-dashboard/src/lib/scope-persistence.ts`, invalidate TanStack Query where needed (`../sitio-dashboard/src/lib/query-keys.ts`)
- [X] T032 [US3] Make `../sitio-dashboard/src/components/layout/school-scope-header.tsx` open the expanded panel on activate (row or chevron)

**Checkpoint**: Multi-school switching works; **SEL-6**/**SEL-7** satisfied.

---

## Phase 6: Out of spec — sidebar IA beyond the selector

**Not part of narrowed [spec.md](./spec.md)**: dedicated **sidebar** nav items (**Home**, **Trips**), **top bar**, **breadcrumbs**, **school edit** icon on the scope row, **add school** as a **separate** sidebar entry.

The following tasks were written for an earlier, broader plan. They may match **product** work or **001** integration but are **not** required to claim **002** spec completion:

- T033–T038 (sidebar links, breadcrumbs, edit icon, home placeholder route) — **backlog / product** unless a separate spec owns them.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Lint, CI, docs, optional backend follow-up.

- [X] T039 [P] Run `pnpm lint` and `pnpm test` in `../sitio-dashboard` and fix regressions introduced by this feature
- [X] T040 [P] Update `../sitio-dashboard/src/test/dashboard-shell-and-routing.test.tsx` if shell structure changes broke assumptions
- [X] T041 Verify **pt-BR** coverage for all new strings in `../sitio-dashboard/src/messages/pt-BR.ts` (no English user-visible regressions)
- [X] T042 [P] If `GET /schools` becomes too large in practice, open follow-up: optional `sort`/`limit` support in `../sitio-backend/src/modules/school/school.controller.ts` — **only** if profiling requires (else skip)
- [ ] T043 Run manual sanity checklist in `specs/002-sidebar-school-scope/quickstart.md` and note gaps below (append “Verification notes”)

### Verification notes

- 2026-04-07: `pnpm lint` passes after implementation changes (Biome emits schema-version info only).
- 2026-04-07: `pnpm test` passes (`8` files, `14` tests).
- 2026-04-07: Manual quickstart checklist (full browser walkthrough) not executed yet.
- 2026-04-07: T042 intentionally skipped (no profiling evidence of `GET /schools` size bottleneck).

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1** → no prerequisites
- **Phase 2** → depends on Phase 1 — **blocks** all user stories
- **Phase 3 (US1)** → depends on Phase 2
- **Phase 4 (US2)** → depends on Phase 3 (needs valid scoped route + shell integration target; scope header can use store from US1)
- **Phase 5 (US3)** → depends on Phase 4 (expanded panel needs header affordance)
- **Phase 7** → depends on desired user stories complete

### User story dependencies

| Story | Depends on | Notes |
|-------|------------|--------|
| **US1** | Foundational | No other stories |
| **US2** | US1 + Foundational | Needs navigation + school context |
| **US3** | US2 | Scope header UI |

### Parallel opportunities

- **Phase 1**: T003 and T004 in parallel
- **Phase 2**: T006 parallel with T005 after contract review; T011 parallel with T007–T010 once API patterns known
- **US1 tests**: T013 and T014 in parallel
- **US2** test T022 can run parallel to small US1 fixes if files differ
- **US3** T027 parallel with menu implementation prep
- **Phase 7**: T039, T040, T041, T042 in parallel

---

## Implementation Strategy

### MVP first (User Story 1 only)

1. Complete Phase 1 + Phase 2  
2. Complete Phase 3 (**US1**) — init + **INIT-2**/**INIT-3** + tests  
3. **Stop and validate** cold-start matrix independently  

### Incremental delivery

1. Add **US2** — visible selector + placeholder + a11y  
2. Add **US3** — expand + search + recents + switch  
3. Polish (Phase 7)

### Suggested MVP scope

- **MVP = US1** (Phase 3) after Foundational — delivers **INIT-1**/**INIT-2**/**INIT-3**; staff land in correct school context or explicit error/create flow.

---

## Notes

- **Repository boundary**: No application code in `sitio-design-notes`; all implementation tasks target `../sitio-dashboard` unless **T042** explicitly opens backend work.
- **001 alignment**: Trip routes and domain rules stay with **001**; **002** does not require sidebar trip/home links for spec compliance.

---

## Task summary

| Phase | Task IDs | Count |
|-------|-----------|-------|
| Setup | T001–T004 | 4 |
| Foundational | T005–T012 | 8 |
| US1 | T013–T021 | 9 |
| US2 | T022–T026 | 5 |
| US3 | T027–T032 | 6 |
| Polish | T039–T043 | 5 |
| **Total (002-scoped)** | **T001–T032, T039–T043** | **37** |

| User story | Task count (incl. tests) |
|------------|-------------------------|
| US1 | 9 |
| US2 | 5 |
| US3 | 6 |

**Format validation**: Tasks use `- [ ]` / `- [X]`, sequential **T###** IDs, **[USn]** on user-story-phase tasks, and **file paths** in descriptions.
