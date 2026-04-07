# Tasks: Dashboard breadcrumbs (school-scoped)

**Input**: Design documents from `/specs/003-dashboard-breadcrumbs/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/breadcrumb-trail.md](./contracts/breadcrumb-trail.md), [quickstart.md](./quickstart.md)

**Tests**: Required per constitution and spec (FR-009, SC-005): Vitest + Testing Library in `../sitio-dashboard`.

**Organization**: Phases follow user story priority (P1 → P2). Implementation target: **`../sitio-dashboard`** only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story label [US1], [US2], [US3] (spec.md)
- Paths: sibling repo `../sitio-dashboard/...`

---

## Phase 1: Setup (shared)

**Purpose**: Confirm scope and baseline quality before edits.

- [ ] T001 Confirm implementation lives in `../sitio-dashboard` only and review [contracts/breadcrumb-trail.md](./contracts/breadcrumb-trail.md) and [research.md](./research.md) for trail rules
- [ ] T002 [P] Run `pnpm lint` and `pnpm test` in `../sitio-dashboard` and record baseline (all green before feature edits)

---

## Phase 2: Foundational (blocking)

**Purpose**: Shared types and pure trail-building surface so all user stories share one source of truth.

**⚠️** Complete before user story implementation work.

- [ ] T003 Add `../sitio-dashboard/src/lib/breadcrumb-trail.ts` exporting `BreadcrumbSegment` types and pure helpers (pathname parsing + segment list shape) aligned with [data-model.md](./data-model.md); keep React and `useQuery` out of this module

**Checkpoint**: Foundation module exists — user story work can proceed.

---

## Phase 3: User Story 1 — See where I am (Priority: P1) — MVP

**Goal**: Breadcrumb trail reflects school-scoped sidebar (Início, Viagens, …), nested human-readable segments, **no school name** and no misleading “Escolas” + school title path for scoped routes.

**Independent test**: Open `/schools/{schoolId}/home`, `/schools/{schoolId}/trips`, and a nested school-scoped or `/trips/{tripId}/…` route; trail matches [spec.md](./spec.md) acceptance scenarios 1–4.

### Tests for User Story 1 (required)

- [ ] T004 [P] [US1] Add failing Vitest tests in `../sitio-dashboard/src/lib/breadcrumb-trail.test.ts` for representative paths: `/schools/$schoolId/home`, `/schools/$schoolId/trips`, nested trip routes, and `/trips/$tripId/…` — assert **no** segment equals school title, **no** “Escolas” crumb inside scoped story, first segments align with `ptBR.nav.home` / `ptBR.entities.trips` per [research.md](./research.md)

### Implementation for User Story 1

- [ ] T005 [US1] Implement `buildBreadcrumbTrail` (and helpers) in `../sitio-dashboard/src/lib/breadcrumb-trail.ts` to satisfy tests and [contracts/breadcrumb-trail.md](./contracts/breadcrumb-trail.md) (minimal honest trail for `/schools` and `/schools/new` per research §7)
- [ ] T006 [US1] Refactor `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.tsx` to use the pure builder; keep TanStack Query lookups for trip/passenger/school **ids** only; use **neutral placeholders** for loading segment labels per [research.md](./research.md) §5
- [ ] T007 [US1] Make `../sitio-dashboard/src/lib/breadcrumb-trail.test.ts` pass; add `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.test.tsx` if component-level coverage is needed for queries + labels

**Checkpoint**: US1 acceptance scenarios hold; MVP demo possible.

---

## Phase 4: User Story 2 — Move up the hierarchy (Priority: P2)

**Goal**: Parent segments navigate via `BreadcrumbLink`; current segment is non-link and visually distinct (FR-007).

**Independent test**: On a nested page, click a parent crumb and land on the matching route; deepest segment is current page.

### Tests for User Story 2 (required)

- [ ] T008 [P] [US2] Add failing tests in `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.test.tsx` (or extend `../sitio-dashboard/src/lib/breadcrumb-trail.test.ts`) asserting parent segments include `to`/`params` where applicable and the last segment is not a link

### Implementation for User Story 2

- [ ] T009 [US2] Ensure `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.tsx` renders `BreadcrumbLink` + TanStack `Link` for parents and `BreadcrumbPage` for the current segment only; align with [contracts/breadcrumb-trail.md](./contracts/breadcrumb-trail.md)
- [ ] T010 [US2] Stabilize current-segment styling using existing shadcn `BreadcrumbPage` / muted styles; fix US2 tests

**Checkpoint**: US2 acceptance scenarios pass.

---

## Phase 5: User Story 3 — Responsive placement and overflow (Priority: P2)

**Goal**: Overflow scroll defaults to **trailing/current** segment visible (FR-006); shell keeps desktop breadcrumbs after `SidebarTrigger` and mobile breadcrumbs below school row (FR-004–FR-005).

**Independent test**: Narrow viewport: school title row vs breadcrumb row; wide: toggle then breadcrumbs; long trail: last segment visible without user scroll after load.

### Tests for User Story 3 (required)

- [ ] T011 [P] [US3] Add failing test in `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.test.tsx` (or suitable DOM test) that overflow container’s initial `scrollLeft` shows the end of the trail for LTR after render

### Implementation for User Story 3

- [ ] T012 [US3] Add scroll container `ref` and `useLayoutEffect` (or equivalent) in `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.tsx` to set initial horizontal scroll to **maximum** when `pathname` or trail labels change, per [research.md](./research.md) §3
- [ ] T013 [US3] Re-verify `../sitio-dashboard/src/components/layout/dashboard-shell.tsx` header structure (`md:hidden` school row + `md:block` breadcrumb strip vs mobile second row); adjust classes only if US3 tests or manual check fail

**Checkpoint**: US3 acceptance scenarios pass.

---

## Phase 6: Polish and cross-cutting

**Purpose**: Single breadcrumb landmark, no duplicate page nav, CI green.

- [ ] T014 Remove duplicate page-level `<nav aria-label="Breadcrumb">` block from `../sitio-dashboard/src/routes/trips/$tripId/index.tsx` once shell trail is complete; preserve non-breadcrumb content (headings, back links only if product still needs them)
- [ ] T015 [P] Remove duplicate breadcrumb `<nav>` from `../sitio-dashboard/src/routes/trips/$tripId/passengers/index.tsx` for the same reason
- [ ] T016 [P] Update mocks/stubs in `../sitio-dashboard/src/test/dashboard-shell-and-routing.test.tsx` and `../sitio-dashboard/src/test/school-scope-sidebar-nav.test.tsx` if imports or behavior of `../sitio-dashboard/src/components/layout/dashboard-breadcrumbs.tsx` changed
- [ ] T017 Run `pnpm lint` and `pnpm test` in `../sitio-dashboard` and fix regressions
- [ ] T018 Execute manual validation steps in [quickstart.md](./quickstart.md)

---

## Dependencies and execution order

### Phase dependencies

- **Phase 1** → **Phase 2** → **Phases 3–5 (US1 → US2 → US3)** → **Phase 6**
- **US2** depends on **US1** trail data (`to`/`params`) being correct
- **US3** depends on **US1** rendering the full list to scroll

### User story dependencies

| Story | Depends on |
|-------|------------|
| US1 | Phase 2 complete |
| US2 | US1 trail segments + labels |
| US3 | US1 list rendering in `dashboard-breadcrumbs.tsx` |

### Parallel opportunities

- **T002** parallel with documentation-only **T001** (different activities)
- **T004** [P] after **T003** skeleton
- **T008** [P] after **T006** exposes link API
- **T011** [P] after scroll container exists (**T012** implements fix)
- **T015** [P] with **T014** (different route files)
- **T016** [P] test file updates after component stabilizes

### Parallel example: User Story 1

```text
# After T003:
Task T004: Vitest tests in ../sitio-dashboard/src/lib/breadcrumb-trail.test.ts

# After T005–T006:
Task T007: Green tests + optional component test file
```

---

## Implementation strategy

### MVP (User Story 1 only)

1. Complete Phases 1–2  
2. Complete Phase 3 (US1) through **T007**  
3. Stop and validate spec acceptance for orientation + no school in trail  

### Incremental delivery

1. **US1** → demo / merge slice  
2. **US2** → parent navigation  
3. **US3** → scroll-end + shell verification  
4. **Phase 6** → remove duplicate nav + CI  

---

## Notes

- **TDD**: Write **T004** (and later story test tasks) so tests fail before behavior exists; tighten assertions when implementation lands.  
- **Repository boundary**: No application code in `sitio-design-notes`; all edits under `../sitio-dashboard`.  
- Traceability: [US1] = spec User Story 1 (P1), [US2] = User Story 2 (P2), [US3] = User Story 3 (P2).

---

## Task summary

| Metric | Value |
|--------|--------|
| **Total tasks** | 18 (T001–T018) |
| **US1** | 7 tasks (T004–T007 + tests/impl split) |
| **US2** | 3 tasks (T008–T010) |
| **US3** | 3 tasks (T011–T013) |
| **Setup + foundation + polish** | 8 tasks (T001–T003, T014–T018) |

**Suggested MVP scope**: Complete through **T007** (Phase 3).
