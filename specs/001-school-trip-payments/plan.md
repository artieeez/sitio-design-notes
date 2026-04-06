# Implementation Plan: School Trip Pending Payments Dashboard

**Branch**: `001-school-trip-payments` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-school-trip-payments/spec.md`

## Summary

Staff dashboard for a tourism company to register schools, school-scoped trips, trip passengers, and trip-context manual payments—with landing-page URL metadata prefill, CPF/name duplicate rules, soft-remove, payment status derivation, and a consistent shell (sidebar, breadcrumbs, tables, empty states). Implementation spans `../sitio-dashboard` (TanStack Start SPA, shadcn) and `../sitio-backend` (NestJS CQRS, Prisma, PostgreSQL).

**Design update (2026-04-06)**: **School** uses **`title` only** as the human-facing label (no separate `name` field), matching **Trip**—`title` is autofilled from pasted landing URL metadata (FR-005–FR-007) and remains editable; see [data-model.md](./data-model.md) and [contracts/openapi.yaml](./contracts/openapi.yaml).

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js LTS (align with TanStack Start and NestJS supported ranges)

**Primary Dependencies**: Dashboard — TanStack Start (SPA), TanStack Router, TanStack Query, TanStack Form, shadcn/ui (Base UI), Zod, Zustand, Vite. Backend — NestJS, `@nestjs/cqrs`, Prisma, class-validator/class-transformer or Zod at boundaries.

**Storage**: PostgreSQL 14+; Prisma migrations; `DATABASE_URL` to `localhost:5432` in local dev.

**Testing**: Dashboard — Vitest + Testing Library; Backend — Jest + Supertest e2e; contract alignment with OpenAPI.

**Target Platform**: Browser (CSR dashboard); Linux/macOS dev; API HTTP JSON.

**Project Type**: Web SPA + REST API (two sibling repos).

**Target Repository/Repos**: `../sitio-dashboard`, `../sitio-backend`

**Performance Goals**: Staff-scale CRUD; no strict SLA in spec—responsive UI, bounded metadata fetch (timeouts/limits per research).

**Constraints**: Payment integrations out of scope; auth out of scope v1; `pt-BR` UI; specs and code comments in English.

**Scale/Scope**: Single-tenant staff tool; client-side pagination acceptable v1 (FR-041).

## Constitution Check

*GATE: Passed — design aligns with Sitio Design Notes Constitution v1.2.0.*

- **Code Quality Gate**: ESLint/Prettier (or project defaults) in both repos; CQRS handlers keep mutations readable; OpenAPI as contract source of truth.
- **Testing Gate**: E2e coverage for API behaviors; Vitest for UI shell/routing where specified in tasks; regressions for contract changes (e.g. School `title`-only).
- **UX Consistency Gate**: Reuse shadcn Dashboard / Data Table / Card patterns; `pt-BR` copy per FR-024; breadcrumbs use **school/trip title** from stored `title` field (UI-FR-010).
- **Language Gate**: Specs and technical artifacts in English; UI strings in `pt-BR`.
- **Repository Boundary Gate**: This repo holds specs only; implementation paths reference `../sitio-dashboard` and `../sitio-backend`.
- **Incremental Delivery Gate**: User stories P1–P5 map to independent test slices in spec and tasks.
- **Documentation Sync Gate**: Changes to School shape require OpenAPI, data-model, Prisma, DTOs, and dashboard Zod/forms in sibling repos.

## Project Structure

### Documentation (this feature)

```text
specs/001-school-trip-payments/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Implementation Repositories (sibling repositories)

```text
../sitio-dashboard/
├── src/
│   ├── routes/
│   ├── components/
│   └── lib/
└── src/test/   # Vitest

../sitio-backend/
├── src/modules/
├── prisma/
└── test/       # Jest e2e
```

**Structure Decision**: Feature modules under `src/modules/*` in backend; file-based routes and colocated components in dashboard per TanStack Start.

## Complexity Tracking

No constitution violations requiring justification.

## Phase 0 & Phase 1 Status

- **Phase 0**: [research.md](./research.md) documents stack and domain decisions (including School **`title` only**, parity with Trip).
- **Phase 1**: [data-model.md](./data-model.md), [contracts/openapi.yaml](./contracts/openapi.yaml), [quickstart.md](./quickstart.md) are the authoritative design artifacts for implementation.

**Post-design constitution check**: Passing — School/Trip label model is consistent and traceable in spec and OpenAPI.
