# Implementation Plan: School scope selector (sidebar)

**Branch**: `002-sidebar-school-scope` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-sidebar-school-scope/spec.md`

## Summary

The dashboard shell implements a **school scope selector** at the **top of the sidebar**: school **title**, **favicon** (or fallback), **chevron**, **placeholder** secondary line for a future signed-in user, and an **expandable** panel with **search**, **search results**, and **recent schools** (max **10**). **Initialization** follows **INIT-1**–**INIT-3** (last accessed → last created → school creation; blocking error + retry when minimum data fails; invalid `schoolId` in URL without silent rescope). Selecting a school navigates to **`/schools/{schoolId}`** and sets **application-wide** scope.

**Primary implementation**: `../sitio-dashboard`. **Backend** changes are **conditional** only if existing `GET /schools` / `GET /schools/{id}` from **001** are insufficient.

**Explicitly not covered by this plan** (per spec): other sidebar links, top bar, breadcrumbs, main-area content beyond init/error states, real auth on the secondary line, **add-school** or **edit-school** affordances as separate nav rows (product may still ship them outside this spec).

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js LTS (align with TanStack Start and NestJS supported ranges at implementation time).

**Primary Dependencies**: Dashboard — TanStack Start (SPA), TanStack Router, TanStack Query, shadcn/ui (Base UI), Zod, Zustand, Vite. Backend (when touched) — NestJS, `@nestjs/cqrs`, Prisma (unchanged stack).

**Storage**: PostgreSQL 14+ via existing Prisma **School** model (**001**); browser `localStorage` for **last accessed** and **recent schools** until server-backed preferences exist.

**Testing**: Vitest + Testing Library — initialization branches (**INIT-1**–**INIT-3**), blocking-error UI, invalid-route handling, selector expand/search/select/recents cap. Backend — Jest e2e only if new HTTP behavior is added.

**Target Platform**: Browser (CSR dashboard); HTTP JSON API for school list/detail.

**Project Type**: Web SPA (dashboard) with optional small REST deltas (backend).

**Target repositories**: `../sitio-dashboard` (primary); `../sitio-backend` (only if contract gaps require new endpoints).

**Performance goals**: Align with spec success criteria (e.g. typical switch under ~30s with a moderate list); full list fetch acceptable at current staff-scale assumptions.

**Constraints**: **pt-BR** user-facing strings; spec/plan artifacts in English; **INIT-3** forbids silent rescope when URL `schoolId` is invalid; **INIT-2** blocking error when minimum init data cannot load; accessibility matches existing dashboard baseline (**Q-2**).

**Scale/Scope**: Single deployment; global school list for the product; no per-user permission layer in this spec.

## Constitution Check

*No separate `.specify/constitution.md` in this repo — gates below are plan-level.*

- **Code quality**: ESLint/Biome (repo defaults); init/scope rules centralized (e.g. `resolve-initial-school`, persistence helpers) to avoid duplicated priority logic; tests colocated with shell/routes/lib.
- **Testing**: Automated tests for **INIT-1** branches, **INIT-2**, **INIT-3**, selector behavior (open, search, select, recents ≤ 10).
- **UX consistency**: Reuse **DashboardShell**, **Sidebar**, popover/dropdown patterns; **pt-BR** in `messages/pt-BR.ts`; placeholder user line is non-authoritative (**SEL-8**); long school names: truncate + tooltip as needed.
- **Language**: Artifacts in English; UI strings **pt-BR**.
- **Repository boundary**: `sitio-design-notes` holds specs/plans only; code lives under sibling repos.
- **Incremental delivery**: **P1** init + visible selector; **P2** expandable search + recents + switch — independently testable slices.

## Project Structure

### Documentation (this feature)

```text
specs/002-sidebar-school-scope/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── README.md
│   └── client-scope-state.md
└── tasks.md
```

### Implementation (`../sitio-dashboard`)

```text
src/
├── routes/                    # /, /schools/$schoolId/* — init + invalid-id handling
├── components/layout/         # dashboard shell, scope header + expanded panel
├── lib/                       # scope persistence, resolve-initial-school, scope-search, API helpers
├── messages/pt-BR.ts
└── src/test/
```

**Structure decision**: Scope UI and client state live under `components/layout` and `lib/`; persist **last accessed** / **recents** per [contracts/client-scope-state.md](./contracts/client-scope-state.md). Touch `../sitio-backend` only if list/detail semantics cannot be satisfied from existing **001** endpoints.

## Complexity Tracking

No unjustified violations; scope is intentionally smaller than earlier drafts (no sidebar IA beyond the selector).

## Phase 0 & Phase 1 Status

- **Phase 0**: [research.md](./research.md) — persistence, init vs invalid URL, routing shape, search, placeholder line.
- **Phase 1**: [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md) — client state shapes and REST reuse relative to **001**.

**Post-design check**: Aligned with narrowed **spec.md**; sidebar nav / chrome beyond the selector are **out of scope** for traceability here.
