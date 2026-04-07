# Implementation Plan: School-Scoped Sidebar & Scope Control

**Branch**: `002-sidebar-school-scope` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-sidebar-school-scope/spec.md`

## Summary

The dashboard shell gains a **school-scoped** navigation model: a **scope control** at the top of the sidebar (favicon, school **title**, placeholder secondary line, icon-only school edit), **initialization rules** (last accessed → last created → school creation when empty), **recent schools** (max 10) and **search** in a scope menu, and sidebar links for **Home** and **Trips** under the active school. **Primary implementation** is in `../sitio-dashboard` (TanStack Start SPA, existing shadcn shell). **Backend** work is **conditional**: reuse `GET /schools` and `GET /schools/{schoolId}` from `001-school-trip-payments` for list, existence checks, and **last created** resolution (client-side max `createdAt` with deterministic **id** tie-break); add API surface only if product later requires server-optimized listing or ordering.

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js LTS (align with TanStack Start and NestJS supported ranges at implementation time)

**Primary Dependencies**: Dashboard — TanStack Start (SPA), TanStack Router, TanStack Query, shadcn/ui (Base UI), Zod, Zustand, Vite. Backend (when touched) — NestJS, `@nestjs/cqrs`, Prisma (unchanged stack).

**Storage**: PostgreSQL 14+ via existing Prisma models (**School** entity per `001`); **browser** `localStorage` (or equivalent) for **last accessed** and **recent schools** until auth-backed preferences exist.

**Testing**: Dashboard — Vitest + Testing Library for shell routing, initialization branches, FR-019/FR-020 error states, scope menu behavior. Backend — extend Jest e2e only if new HTTP behavior is added.

**Target Platform**: Browser (CSR dashboard); HTTP JSON API for school list/detail.

**Project Type**: Web SPA (dashboard) with optional small REST deltas (backend).

**Target Repository/Repos**: `../sitio-dashboard` (primary); `../sitio-backend` (only if contract gaps require new endpoints or query parameters)

**Performance Goals**: Scope search and initialization align with spec success criteria (e.g. switch under ~30s with &lt;50 schools); full school list fetch acceptable for current staff-scale assumptions; revisit if list endpoints paginate.

**Constraints**: **pt-BR** UI strings; specs and code in English; **FR-020** forbids silent rescope when URL school id is invalid; **FR-019** blocking error when minimum init data cannot load; accessibility matches existing dashboard baseline (**FR-021**).

**Scale/Scope**: Single deployment, global school list for product; no per-user permission layer in this spec.

## Constitution Check

*GATE: Passed before Phase 0 — no unresolved NEEDS CLARIFICATION in Technical Context.*

- **Code Quality Gate**: ESLint/Prettier (or repo defaults) in `sitio-dashboard`; scope logic centralized (e.g. dedicated hooks/store) to avoid duplicated priority rules; colocate tests with shell and route modules.
- **Testing Gate**: Automated tests for **FR-001** branches (last accessed valid, fall through to last created, empty → creation path), **FR-019** (blocking error + retry), **FR-020** (invalid route school id), navigation to Home / Trips / school edit icon; regression tests if route tree changes.
- **UX Consistency Gate**: Reuse existing **DashboardShell**, **Sidebar**, **ScrollArea**, **dropdown-menu** / **popover** patterns; **pt-BR** copy in `messages/pt-BR.ts`; placeholder username is non-authoritative per **FR-005**; long school names: truncate + tooltip per spec edge cases.
- **Language Gate**: Feature artifacts in English; all new UI strings in **pt-BR**.
- **Repository Boundary Gate**: `sitio-design-notes` holds specs and plans only; implementation tasks target `../sitio-dashboard` and optionally `../sitio-backend`.
- **Incremental Delivery Gate**: User stories P1 (init + scope display) and P2 (scope menu + sidebar nav) map to independently testable slices.
- **Documentation Sync Gate**: Update this feature’s `data-model.md` / `contracts/` if client persistence shape or REST usage changes; keep alignment with `001` domain spec for trip list and drill-down entry points.

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
└── tasks.md   # Phase 2 — /speckit.tasks (not created by /speckit.plan)
```

### Implementation Repositories (sibling repositories)

```text
../sitio-dashboard/
├── src/
│   ├── routes/              # School-scoped layout routes; index/home under /schools/$schoolId/…
│   ├── components/layout/ # dashboard-shell.tsx — scope control, nav links
│   ├── stores/              # Zustand: optional scope + persistence helpers
│   ├── lib/                 # api-client, query-keys, scope persistence keys
│   └── messages/pt-BR.ts
└── src/test/

../sitio-backend/            # Optional: only if new list ordering or fields are required
├── src/modules/school/
└── prisma/
```

**Structure Decision**: Implement scope UI and client state in `../sitio-dashboard` under `components/layout` and `routes`; persist **last accessed** and **recents** via small typed helpers under `src/lib/` (see [contracts/client-scope-state.md](./contracts/client-scope-state.md)). Touch `../sitio-backend` only if product requires server-side “latest created” or list semantics that cannot be derived from existing `GET /schools` payloads.

## Complexity Tracking

No constitution violations requiring justification.

## Phase 0 & Phase 1 Status

- **Phase 0**: [research.md](./research.md) resolves initialization, persistence, routing, and API reuse decisions.
- **Phase 1**: [data-model.md](./data-model.md), [contracts/](./contracts/), and [quickstart.md](./quickstart.md) define client scope state, REST usage relative to `001`, and local dev steps.

**Post-design constitution check**: Passing — repository boundaries, language rules, and test expectations are explicit; no unjustified gate violations.
