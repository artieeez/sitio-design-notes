# Implementation Plan: School Trip Pending Payments Dashboard

**Branch**: `001-school-trip-payments` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-school-trip-payments/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Staff-facing dashboard for a tourism company to manage schools, school-scoped trips, trip passengers, and trip-scoped manual payments, with derived pending/settled/unavailable status per passenger (BRL, two decimals, America/Sao_Paulo date semantics, CPF rules, soft-remove, manual “paid without info” tag). **School** and **trip** records persist an optional **landing page URL** (`url`) for the link used to fetch prefill metadata and for staff-facing navigation (e.g. open landing page) per **FR-043**. **Passenger** records support optional **parent/guardian** `parentName`, `parentPhoneNumber`, and `parentEmail` per **FR-044**. **Frontend** (`../sitio-dashboard`): TanStack Start in **SPA mode** (client-rendered app), UI via **shadcn** (Base UI `base` + preset `b1Fk0lmym`, Start template), **TanStack Query** for server state, **TanStack Form** + **Zod** for forms, **Zustand** for global client state, and **light/dark** theming. **Backend** (`../sitio-backend`): **NestJS** with **CQRS** (**@nestjs/cqrs**), **Prisma** on **PostgreSQL** (`localhost:5432` for local dev), REST (or future GraphQL) as the HTTP surface the SPA calls.

## Technical Context

**Language/Version**: TypeScript 5.x (dashboard and backend), Node.js LTS (align with TanStack Start and NestJS supported ranges at implementation time)  
**Primary Dependencies**: Dashboard: TanStack Start (SPA), TanStack Router, TanStack Query, TanStack Form, shadcn/ui (Base UI preset), Zod, Zustand, Vite tooling as provided by the Start template. Backend: NestJS, @nestjs/cqrs, Prisma, class-validator/class-transformer or Zod at boundary as chosen per module, pg driver via Prisma  
**Storage**: PostgreSQL 14+; local dev assumed at `localhost:5432`; schema and migrations via Prisma  
**Testing**: Dashboard: **Vitest** (Start template default unless explicitly changed), Testing Library for components, MSW or similar for API mocks; **required** per-user-story UI tests are listed in [tasks.md](./tasks.md) (**T054** for US5 shell/navigation; **T053** for cross-story US1–US4 flows in Phase 8 polish). Backend: Jest (Nest default), supertest/e2e for HTTP, Prisma with test DB or sqlite-only if team standard allows (prefer Postgres parity)  
**Target Platform**: Modern evergreen browsers; staff web dashboard (not mobile-first). NestJS HTTP API on Node server  
**Project Type**: Web SPA + HTTP API (two sibling repositories)  
**Target Repository/Repos**: `../sitio-dashboard` (UI and client), `../sitio-backend` (API, domain, persistence)  
**Performance Goals**: v1 loads **full in-context** school/trip/passenger datasets per screen (per **FR-041**); **no** required server-side pagination or chunking in v1. “Fast” or “responsive” is **not** a numeric SLA here—operational tuning and optional server paging are **follow-on** work if real data volume requires it.  
**Constraints**: Auth and payment gateways out of scope; no stale-save concurrency UX (FR-033); UI copy pt-BR, code/specs English (FR-024/025); CPF visible in UI but omitted from routine logs (FR-039); BRL two-decimal money and date-only in America/Sao_Paulo (FR-034, FR-037)  
**Cross-origin (CORS)**: The SPA calls the API on a different origin/port in local dev and typically in production. **Non-production** (e.g. `NODE_ENV` not `production`): the API MUST allow browser requests from **any** origin by reflecting the request `Origin` (so any localhost port or dev tunnel works). **Production** (`NODE_ENV=production`): the API MUST allow only origins listed in **`CORS_ORIGINS`** (comma-separated full origins, e.g. `https://dashboard.example.com`); omitting `CORS_ORIGINS` in production MUST NOT fall back to permissive CORS. See **FR-045** and [quickstart.md](./quickstart.md).  
**Scale/Scope**: **Five** user stories (**US1–US5**) across priority bands **P1** (US1), **P2** (US2, US3, US5), **P3** (US4)—including **US5** (dashboard shell, breadcrumbs, route recovery); screens for schools, school trips, trip passengers, per-passenger payments; no CSV/export/print reports in v1 (FR-042)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality Gate**: Biome in both repos; TypeScript strict; NestJS module boundaries; dashboard components colocated with routes/features; CQRS keeps write/read paths explicit; Prisma schema as single persistence contract; complexity controlled via feature modules and shared libs (Zod schemas shared optionally via package or duplication with tests).
- **Testing Gate**: P1: integration tests for school/trip/passenger CRUD + navigation constraints; P2: payment CRUD + status recalculation + manual tag; P3: aggregates default vs include-removed; regression tests for CPF duplicate/block, name warning flow, soft-remove payment rules; API contract tests against OpenAPI where practical. **Dashboard**: US5 shell/navigation/deep-link recovery covered by Vitest (**T054** in [tasks.md](./tasks.md)), with US1–US4 flow tests in **T053** as documented there.
- **UX Consistency Gate**: shadcn/Base UI patterns, tables with kebab actions, contextual forms without school/passenger pickers where spec forbids; pt-BR strings centralized (e.g. messages map); light/dark via theme provider and design tokens; best-effort a11y per FR-040.
- **Language Gate**: Confirmed: specs and code English; all user-visible strings pt-BR.
- **Repository Boundary Gate**: Confirmed: `sitio-design-notes` holds only specs/plans/contracts; implementation in `../sitio-dashboard` and `../sitio-backend` only.
- **Incremental Delivery Gate**: Deliver by **priority band** (P1 first, then P2, then P3): **US1** (P1) is the MVP slice; **US2**, **US3**, and **US5** (all P2) are independently testable after US1 foundation; **US4** (P3) builds on US2–US3 for full aggregate scenarios. **Rollout order** in [tasks.md](./tasks.md) may place **US5** (P2) **after** **US4** (P3) so shell polish, breadcrumbs, and deep-link recovery run against **complete** school→trip→passenger→payment→aggregate routes—that is intentional and **not** strict “all P2 before any P3” sequencing.
- **Documentation Sync Gate**: Keep `spec.md` as source of truth for behavior; update `data-model.md` / `contracts/openapi.yaml` / `quickstart.md` when API or schema changes; each repo README should document env vars (`DATABASE_URL`, `CORS_ORIGINS` for production API, API base URL / `VITE_API_URL`, theme).

### Constitution Check (post–Phase 1)

Design artifacts (`research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`) align with constitution: English technical docs, explicit repo split, test and quality gates called out, no implementation in design-notes. Persisted `url` on school/trip (FR-043), optional parent contact fields on passenger (FR-044), and trip-level **passenger-status aggregates** (FR-036) are reflected in data model and OpenAPI.

## Project Structure

### Documentation (this feature)

```text
specs/001-school-trip-payments/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Implementation Repositories (sibling repositories)

```text
# Greenfield / to be created: ../sitio-dashboard
../sitio-dashboard/
├── app/ or src/             # TanStack Start SPA entry (per template)
├── components/              # shadcn + feature UI
├── lib/                     # api client, zod schemas (or shared pkg), query keys
├── stores/                  # zustand stores (theme, UI shell, etc.)
├── package.json
└── (tests alongside or tests/)

# Greenfield / to be created: ../sitio-backend
../sitio-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── prisma/              # optional prisma.service
│   └── modules/
│       ├── school/
│       ├── trip/
│       ├── passenger/
│       ├── payment/
│       └── metadata/        # landing URL fetch for FR-005–FR-007
│   # Each bounded context: *.module.ts, commands/, queries/, handlers/, dto/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
└── package.json
```

**Structure Decision**: **Dashboard**: Initialize with `pnpm dlx shadcn@latest init --preset b1Fk0lmym --base base --template start`, configure TanStack Start for **SPA mode** (client-side rendering only; no SSR requirement for v1). Organize routes by school → trips → trip detail (passengers). **Backend**: NestJS feature modules per aggregate (school, trip, passenger, payment) with CQRS command/query handlers, Prisma as the write/read model backing store unless later read-model split is needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations requiring justification. CQRS adds structure but is explicitly requested and keeps payment/status rules testable in handlers.
