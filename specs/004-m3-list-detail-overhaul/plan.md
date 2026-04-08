# Implementation Plan: Dashboard list–detail layout overhaul (M3)

**Branch**: `004-m3-list-detail-overhaul` | **Date**: 2026-04-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-m3-list-detail-overhaul/spec.md`, plus planning notes: use **shadcn/ui** for UI primitives; use **shadcn Alert Dialog** when closing or navigating away from a form with **unsaved changes** (FR-012).

## Summary

Refactor dashboard **collection + detail/form** experiences to follow **Material Design 3 [List–detail canonical layout](https://m3.material.io/foundations/layout/canonical-layouts/list-detail)**: coordinated **list** and **detail** regions, clear **selection**, **compact** behavior (stacked list/detail with back navigation), and **create/edit** in the **detail role** where applicable. **Unsaved changes** must block selection changes and detail exit until **save** or **explicit discard**, using a **shadcn Alert Dialog** (`pt-BR` copy). **No backend scope** by default; **pagination/virtualization** remain **out of spec** (per clarifications).

**Primary implementation**: `../sitio-dashboard` — introduce shared layout/shell building blocks (shadcn: `ScrollArea`, `Separator`, `Sheet` where useful, new **`alert-dialog`**), route-level composition, dirty-state guards, and tests. **shadcn** is the default source for new interactive primitives; align styling with existing `src/components/ui/*` (Base UI preset).

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js LTS (align with TanStack Start / Vite in `sitio-dashboard`).

**Primary Dependencies**: React 19, TanStack Router (file routes, nested layouts, navigation APIs), TanStack Query (existing data fetching), **shadcn/ui** (add **`alert-dialog`**; reuse `button`, `scroll-area`, `separator`, `sheet`, `skeleton`, etc.), Tailwind CSS 4, Zod (schemas unchanged).

**Storage**: N/A for layout; entity data continues via existing REST + React Query.

**Testing**: Vitest + Testing Library — layout regions (roles/test ids), selection sync, compact navigation, **unsaved-changes dialog** (open/confirm/cancel), keyboard focus smoke paths where feasible; extend existing `src/test/dashboard-flows.test.tsx` patterns as appropriate.

**Target Platform**: Browser (CSR dashboard); responsive breakpoints per M3 list–detail (implement with CSS + `useMobile` / media queries already in repo).

**Project Type**: Web SPA (staff dashboard).

**Target Repository/Repos**: `../sitio-dashboard` **only** unless a hard API gap appears (then document in a follow-up spec).

**Performance Goals**: No regression vs current list render; avoid extra full-list refetches solely for layout (reuse queries). Pagination/virtualization **not** in this feature’s scope.

**Constraints**: UI strings **`pt-BR`** (`src/messages/pt-BR.ts`); specs/plans **English**; **WCAG 2.1 AA** for keyboard + visible focus (FR-013); M3 list–detail compliance unless a **documented exemption** with acceptance criteria (FR-001, FR-011).

**Scale/Scope**: All **list–detail** areas enumerated below; full-page routes that are **create-only** may use detail-pane **mode** or documented equivalent (FR-004).

## FR-013 verification (spec compliance)

Per **FR-013**, this plan defines **how** accessibility is verified (normative detail is maintained in **[quickstart.md](./quickstart.md)** after task **T031** lands):

1. **Manual checklist** (required before release): keyboard-only pass through **LIST** and **DETAIL** on expanded and compact layouts; **visible focus** on list items, primary actions, and form fields; **focus order** matches visual reading order; **Alert Dialog** traps focus and returns focus on close.
2. **Automated coverage** (required where feasible): Vitest + Testing Library asserts for regions/`data-testid`, dialog open/close, and compact **back** (see `tasks.md` Phase 2–4 test tasks).
3. **Exemptions**: Any screen exempt from full FR-013 must appear in the **Exemptions** table with acceptance criteria (same pass as SC-008).

## FR-007 UX consistency (reviewer artifacts)

Reviewers verify **FR-007** using:

- [contracts/list-detail-layout.md](./contracts/list-detail-layout.md) (regions, selection, compact behavior)
- [contracts/unsaved-changes-dialog.md](./contracts/unsaved-changes-dialog.md) (blocking dialog)
- **quickstart.md** UX consistency bullets added under **T031** (shared terminology, selection affordances, motion/focus notes)

## Concurrent data changes (spec edge case)

**Spec**: If data changes while the user views an item, the UI recovers with clear messaging or refresh without breaking list–detail structure.

**Plan for this feature**:

- **Minimum**: Reuse **TanStack Query** invalidation/refetch after successful mutations; **never silently replace** a **dirty** form with server data without user acknowledgment (aligns with FR-012).
- **Stretch** (optional in same epic): Non-blocking **banner** or “Dados atualizados” with refresh when stale — add during route migration if low effort; otherwise document **deferral** in this section and track as a follow-up.

## Constitution Check

*GATE: Passed — aligns with [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md). Re-checked after Phase 1 design.*

- **Code quality**: Centralize **list–detail frame** (shared component or layout route) to avoid copy-paste; keep route files thin; Biome lint + `tsc` clean; extract **dirty guard + alert dialog** into a reusable hook/component pair.
- **Testing**: Per user story — **P1** selection + two-pane coordination; **P2** compact list↔detail; **P3** create/edit in detail role; **cross-cutting** FR-012 dialog + FR-013 keyboard/focus smoke; regression for FR-014 invalid deep links.
- **UX consistency**: Reuse dashboard shell, breadcrumbs (003), school scope (002); **shadcn** patterns for dialogs/buttons; **pt-BR** for all new dialog copy.
- **List–Detail layout gate**: **Comply** with M3 list–detail for all in-scope routes; any screen that **cannot** adopt the pattern must be listed under **Exemptions** with rationale + measurable acceptance criteria (none assumed at plan time).
- **Language gate**: Code/comments **English**; UI **pt-BR**.
- **Repository boundary**: Specs in `sitio-design-notes`; implementation under **`../sitio-dashboard`**.
- **Incremental delivery**: Land **shared primitives** first (layout shell + alert-dialog + dirty guard), then migrate **one vertical** (e.g. schools or trips) end-to-end, then remaining routes.
- **Documentation sync**: Keep **research.md**, **data-model.md**, **contracts/**, **quickstart.md** aligned when behavior locks; update **tasks.md** via `/speckit.tasks`.

## Inventory: in-scope list–detail (FR-010)

These **feature areas** currently present a **collection + navigation to per-item tasks** and MUST be refactored to M3 list–detail (or documented exemption):

| Area | Route patterns (file routes) | Notes |
|------|------------------------------|--------|
| Schools directory | `/schools/` | List of schools; detail may show school summary + actions or embed school hub context. |
| School hub | `/schools/$schoolId/` | School landing; align with list–detail if combined with sub-lists (see trips). |
| Trips (school-scoped) | `/schools/$schoolId/trips/` | Trip collection; **detail** targets trip summary/edit (`/trips/$tripId/`). |
| Trip detail / edit | `/trips/$tripId/` | **Detail surface** for trip + `TripForm` / `TripStatusSummary`. |
| Passengers | `/trips/$tripId/passengers/` | `PassengerTable` + links; **detail** for passenger context (row selection / nested payments). |
| Passenger create | `/trips/$tripId/passengers/new` | **Create** in detail role or equivalent transition (FR-004). |
| Payments | `/trips/$tripId/passengers/$passengerId/payments/` | Payment list; **detail** for payment row + edit. |
| Payment create/edit | `.../payments/new`, `.../payments/$paymentId/edit` | Forms in detail role or documented stack transition. |
| School create | `/schools/new` | Full-page create today — fold into **detail-pane create mode** or exemption with criteria. |
| Trip create | `/schools/$schoolId/trips/new` | Same as above. |

**Deep linking (FR-014, SC-010)**: All routes with **`$schoolId`**, **`$tripId`**, **`$passengerId`**, **`$paymentId`** MUST implement **missing/unavailable** detail states per spec (reuse/extend `RouteInvalidRecovery` patterns where appropriate).

**Likely exemptions (confirm during implementation)**:

- **`/`** (`src/routes/index.tsx`) — not a list–detail pattern; **exempt**.
- **`/schools/$schoolId/home`** — if single-panel dashboard tile view only; **exempt** unless it gains a paired collection list.

## Project Structure

### Documentation (this feature)

```text
specs/004-m3-list-detail-overhaul/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (UI state / layout concepts)
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
└── tasks.md             # /speckit.tasks (not created by /speckit.plan)
```

### Implementation (`../sitio-dashboard`)

```text
src/components/
├── layout/
│   ├── list-detail-layout.tsx      # NEW: M3-oriented split/stack shell (list pane + detail pane)
│   └── unsaved-changes-dialog.tsx  # NEW: shadcn AlertDialog + pt-BR copy (FR-012)
├── ui/
│   └── alert-dialog.tsx            # NEW via `pnpm dlx shadcn@latest add alert-dialog` (or project equivalent)
├── trips/                          # EXISTING forms/tables — compose inside layout
└── schools/                        # EXISTING forms — compose inside layout

src/hooks/
└── use-unsaved-changes-guard.ts    # NEW: dirty tracking + pending action + dialog open state

src/routes/
├── schools/...
└── trips/...                       # Refactor to nested layout + outlet or shared wrapper per vertical

src/messages/pt-BR.ts               # Dialog strings + any new labels
src/test/                         # Layout, dialog, navigation tests
```

**Structure decision**: Add **layout primitives** under `src/components/layout/` and **shadcn** pieces under `src/components/ui/`. Migrate routes incrementally so each PR stays reviewable (constitution IV).

## Phase 0 & Phase 1 Outputs

- **research.md**: M3 breakpoints, TanStack Router integration options, shadcn alert-dialog pattern, a11y notes.
- **data-model.md**: UI state for selection, layout mode, dirty guard, dialog.
- **contracts/**: Machine-readable expectations for list–detail + unsaved dialog (see `contracts/README.md`).
- **quickstart.md**: Commands to add shadcn component, run tests, manual verification checklist.

## Complexity Tracking

> No constitution violations requiring exemption tables. List–detail **compliance** is the default; per-screen **exemptions** (home, etc.) are **documented** in the inventory above, not violations.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
