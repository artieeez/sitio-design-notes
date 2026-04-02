# Quickstart: 001-school-trip-payments

Local development orientation for the two implementation repositories. Paths are relative to the **parent** of `sitio-design-notes` unless noted.

## Prerequisites

- Node.js LTS + **pnpm**
- PostgreSQL listening on **`localhost:5432`** with a database and user (e.g. `sitio_dev`)
- Optional: `curl` or REST client for API smoke tests

## Backend (`../sitio-backend`)

1. Create the NestJS project if greenfield: `nest new sitio-backend` (or team scaffold).
2. Add dependencies: `@nestjs/cqrs`, `@prisma/client`, `prisma`, `zod` (optional at boundary), configuration module.
3. Set environment:

   ```bash
   export DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sitio_dev"
   ```

4. Define `prisma/schema.prisma` to match [data-model.md](./data-model.md); run migrations (human/CI):  
   `pnpm exec prisma migrate dev`
5. Register **CQRS** module and feature modules (`School`, `Trip`, `Passenger`, `Payment`, `Metadata`).
6. Start API: `pnpm run start:dev` (or project default). Note base URL and port for the dashboard proxy/env.

### CQRS layout (suggested)

- **Commands**: `CreateSchoolCommand`, `UpdateSchoolCommand`, `DeactivateSchoolCommand`, … same pattern for trips, passengers, payments, `ToggleManualPaidCommand`, `SoftRemovePassengerCommand`, etc.
- **Queries**: `ListSchoolsQuery` (with `includeInactive`), `ListTripsForSchoolQuery`, `GetTripPassengersQuery` (with `includeRemoved`), `ListPaymentsForPassengerQuery`, etc.
- Handlers call **PrismaService**; enforce FR-029/030/035 invariants in command handlers.

## Dashboard (`../sitio-dashboard`)

1. Scaffold TanStack Start + shadcn:

   ```bash
   pnpm dlx shadcn@latest init --preset b1Fk0lmym --base base --template start
   ```

2. Configure **SPA mode** per TanStack Start docs (disable SSR for routes or use SPA deployment target) so the app runs as CSR.
3. Install and wire:

   - `@tanstack/react-query` (and devtools optional)
   - `@tanstack/react-form`
   - `zod`
   - `zustand`

4. Add API base URL (e.g. `VITE_API_URL=http://localhost:3000`) and a small fetch client; wrap app with `QueryClientProvider`.
5. Implement **theme** store (Zustand) + toggle; apply `light`/`dark` class and persist preference.
6. Implement routes: **School list** → **School trips** → **Trip detail** (passenger table with kebab actions). No global payment list (FR-010).

## Contract-driven development

- Use [contracts/openapi.yaml](./contracts/openapi.yaml) as the working REST contract; regenerate or diff when endpoints change.
- Align Zod schemas on the client with DTOs on the server (manual sync or codegen in a later iteration).

## Sanity checklist

- [ ] Create school → create trip from that school’s list only (no school picker on trip form).
- [ ] Add passengers; CPF duplicate blocked; invalid CPF blocked; name warning flow with confirm.
- [ ] Payment only from passenger row; amount prefilled when effective expected exists.
- [ ] Manual paid-without-info tag toggles; status and aggregates respect soft-remove and “include removed” (FR-036).
- [ ] PostgreSQL on `localhost:5432` with migrations applied.
