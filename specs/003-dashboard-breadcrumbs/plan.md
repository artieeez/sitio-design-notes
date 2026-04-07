# Implementation Plan: Dashboard breadcrumbs (school-scoped)

**Branch**: `003-dashboard-breadcrumbs` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-dashboard-breadcrumbs/spec.md`

## Summary

Deliver **school-scoped breadcrumbs** in the dashboard shell that **omit the school name** (already shown in the school selector), start from **sidebar-aligned** destinations (e.g. Início, Viagens), continue with **nested** human-readable segments, and meet **responsive placement** (desktop: top bar after sidebar toggle; mobile: breadcrumbs **below** the school title row) and **overflow** behavior (horizontal scroll with **initial view showing the trailing/current** segment).

**Current state**: `../sitio-dashboard` already has `DashboardBreadcrumbs` in `dashboard-shell.tsx` with **mobile/desktop placement** matching the spec, and `overflow-x-auto` on the list. Gaps: trail logic still injects **Escolas**, **school title**, and a **global** “home” root that does not match **school-scoped** IA; **no guaranteed scroll-to-end** on overflow; some **trip** pages duplicate an inline breadcrumb **nav** that overlaps the shell responsibility.

**Primary implementation**: `../sitio-dashboard` only. **Backend**: unchanged unless a future story requires new title fields (out of scope per spec).

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js LTS (align with TanStack Start / Vite toolchain in `sitio-dashboard`).

**Primary Dependencies**: TanStack Router (file routes, `Link`, `useRouterState`), TanStack Query (entity labels for trips/passengers/school when needed), shadcn/ui **Breadcrumb** primitives (`@/components/ui/breadcrumb`), existing dashboard shell (`dashboard-shell.tsx`).

**Storage**: N/A (presentation + route-derived data). Entity titles continue to come from existing REST + React Query caches.

**Testing**: Vitest + Testing Library — shell/breadcrumb behavior (layout classes or test ids), trail composition for representative paths, scroll-end behavior where assertable, regression when removing duplicate page-level breadcrumbs.

**Target Platform**: Browser (CSR dashboard).

**Project Type**: Web SPA (dashboard).

**Target repositories**: `../sitio-dashboard` (only).

**Performance goals**: Breadcrumb rendering must not block main content; reuse existing queries where possible; avoid redundant fetches solely for breadcrumbs.

**Constraints**: User-facing strings **pt-BR** (`messages/pt-BR.ts`); plans/specs in **English**; breadcrumb **must not** show school name when scoped; **WCAG-aligned** semantics via existing `nav` + list patterns (see research).

**Scale/Scope**: Staff-scale; trail depth bounded by product routes (trips, passengers, payments).

## Constitution Check

*GATE: Passed — aligns with [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md). Re-checked after Phase 1 design.*

- **Code quality**: Reuse a **single** trail builder module for `DashboardBreadcrumbs`; avoid duplicating path parsing across routes; remove dead inline breadcrumb markup from pages once the shell is authoritative.
- **Testing**: Cover **P1** trail content for `/schools/$schoolId/*` and key nested URLs; **P2** parent links where applicable; **P3** overflow scroll-end (unit or integration as feasible); regression tests when deleting page-level breadcrumbs.
- **UX consistency**: Match **002** sidebar labels (`ptBR.nav.home`, `ptBR.entities.trips`, …); keep shell layout: **SidebarTrigger** → separator (md) → breadcrumbs (desktop) / school row + breadcrumb row (mobile).
- **Language**: UI **pt-BR**; engineering docs **English**.
- **Repository boundary**: This repo holds specs/plans; code changes under **`../sitio-dashboard`** only.
- **Incremental delivery**: (1) Refactor trail IA + queries for school-scoped routes; (2) scroll-end + polish; (3) remove duplicate in-page breadcrumbs and align `aria` — each slice testable.
- **Documentation sync**: Update this feature’s **research.md** / **contracts** when behavior is locked; dashboard **README** only if a developer workflow changes.

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboard-breadcrumbs/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── README.md
│   └── breadcrumb-trail.md
└── tasks.md              # /speckit.tasks — not created by /speckit.plan
```

### Implementation (`../sitio-dashboard`)

```text
src/components/layout/
├── dashboard-shell.tsx       # Already hosts SidebarTrigger + breadcrumb placement
├── dashboard-breadcrumbs.tsx # Refactor: school-scoped trail, scroll-end, labels
└── school-scope-header.tsx   # Unchanged (avatar/summary — not for breadcrumb row)

src/routes/trips/$tripId/
├── index.tsx                 # Remove duplicate breadcrumb nav when shell is canonical
└── passengers/index.tsx      # Idem if duplicate exists

src/messages/pt-BR.ts         # Labels reused for segment titles
src/test/                     # Shell / breadcrumb tests
```

**Structure decision**: All breadcrumb **composition** lives in **`dashboard-breadcrumbs.tsx`** (or a colocated `lib/breadcrumb-trail.ts` if the file grows). Route files **must not** declare a second global breadcrumb for the same view.

## Complexity Tracking

No unjustified constitution violations.

## Phase 0 & Phase 1 Status

- **Phase 0**: [research.md](./research.md) — trail IA, scroll-end, duplicate nav removal, loading labels.
- **Phase 1**: [data-model.md](./data-model.md), [contracts/breadcrumb-trail.md](./contracts/breadcrumb-trail.md), [quickstart.md](./quickstart.md).

**Post-design constitution check**: Still **passed**; no backend contract change required.
