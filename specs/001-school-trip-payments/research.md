# Research: 001-school-trip-payments

Consolidated decisions for stack and architecture choices. All prior Technical Context items are resolved without remaining NEEDS CLARIFICATION.

## 1. TanStack Start in SPA mode (CSR)

- **Decision**: Use TanStack Start with **SPA** configuration so the app is delivered as a client-rendered single-page application (Vite-powered client bundle, no SSR/SSG requirement for v1).
- **Rationale**: Spec targets a staff dashboard with auth out of scope; CSR simplifies hosting and matches “dashboard in the browser” assumptions. TanStack Start still provides file-based routing, type-safe routing, and first-class TanStack Query integration patterns.
- **Alternatives considered**: Full-stack Start with SSR — rejected as unnecessary operational complexity for v1. Plain Vite + TanStack Router — viable but Start template aligns with user-requested `shadcn` Start preset.

## 2. shadcn + Base UI + Start template

- **Decision**: Bootstrap UI with  
  `pnpm dlx shadcn@latest init --preset b1Fk0lmym --base base --template start`  
  using **base** as the component base (Base UI primitives).
- **Rationale**: Locks design system to the chosen preset and keeps components copy-paste maintainable in-repo per shadcn workflow.
- **Alternatives considered**: Radix-only shadcn preset — rejected per product direction (Base UI). Manual component library — higher maintenance.

## 3. TanStack Query, TanStack Form, Zustand, Zod

- **Decision**: **TanStack Query** for all server-backed data (schools, trips, passengers, payments, aggregates). **TanStack Form** with **Zod** validators for create/update forms. **Zustand** for cross-cutting client state (e.g. theme mode, sidebar, “include inactive/removed” toggles, draft UI flags) that must not be server cache.
- **Rationale**: Clear separation: Query = server state; Zustand = client-only global state; Form + Zod = type-safe validation aligned with API DTOs.
- **Alternatives considered**: React Hook Form only — still compatible with Zod but user asked for TanStack Form. Redux — heavier than needed.

## 4. Light and dark mode

- **Decision**: Implement with **CSS variables** + **class** (or `data-theme`) on `document.documentElement`, persisted via `localStorage`, toggled from shell UI; shadcn/theme tokens follow the initialized theme.
- **Rationale**: Standard pattern for shadcn/Tailwind setups; Zustand can hold `theme` and sync to DOM.
- **Alternatives considered**: System-only preference — optional enhancement; spec does not forbid respecting `prefers-color-scheme` as default.

## 5. NestJS + Prisma + PostgreSQL (localhost:5432)

- **Decision**: **NestJS** HTTP API; **Prisma** ORM; **PostgreSQL** with `DATABASE_URL` pointing to `postgresql://...@localhost:5432/...` in local `.env`.
- **Rationale**: Prisma fits relational model (school → trip → passenger → payment); migrations are team-standard for schema evolution.
- **Alternatives considered**: TypeORM — acceptable but user specified Prisma. Raw SQL — more boilerplate for little gain.

## 6. CQRS on the backend

- **Decision**: Use **`@nestjs/cqrs`** with **Commands** for mutations (create/update/deactivate/soft-remove/restore/toggle manual tag, payment CRUD) and **Queries** for reads (lists, detail, passenger table with filters for inactive/removed, payment history). Handlers use **PrismaService** (or repositories) inside **one** physical database; no separate event-sourced read models in v1 unless needed for performance.
- **Rationale**: Satisfies requested pattern, keeps mutation side-effects (e.g. status recalculation) localized in handlers or domain services; tests target handlers.
- **Alternatives considered**: Anemic CRUD controllers only — simpler but does not meet CQRS requirement. Full event sourcing — out of scope and unnecessary for v1.

## 7. Money and dates

- **Decision**: Store monetary amounts as **integer minor units (centavos)** in the database via Prisma `Int` or `BigInt` (choose per scale); API exposes decimal strings or number + scale discipline documented in OpenAPI. **Payment date** as **date-only** (`@db.Date` or ISO date string) with business logic assuming **America/Sao_Paulo** for interpretation and ordering.
- **Rationale**: Matches FR-034 and FR-037; avoids float errors.
- **Alternatives considered**: `Decimal` type (Prisma Decimal) — acceptable if team prefers; document rounding (half-up) consistently.

## 8. Landing page metadata (FR-005–FR-007)

- **Decision**: Backend endpoint accepts URL, performs server-side fetch with strict timeouts, size limits, and SSRF protections (allowlist schemes, no internal IPs), returns title/description/image/favicon fields; dashboard shows non-blocking errors and keeps fields editable.
- **Rationale**: Metadata fetch must not rely on browser CORS; security belongs on server.
- **Alternatives considered**: Client-only fetch — often blocked by CORS and leaks staff IPs less critically but still inconsistent; server-side preferred.
