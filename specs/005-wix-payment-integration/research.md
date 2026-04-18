# Research: Wix Payment Gateway Event Console

**Feature**: `005-wix-payment-integration`  
**Date**: 2026-04-18

## R1 — Route and navigation scope

- **Decision**: Add a **school-scoped** Wix Integration route under the existing dashboard shell (for example `/schools/$schoolId/integrations/wix`), and register a **sidebar link** next to Trips/Home patterns, **disabled when no school is selected** (same rule as Trips in `dashboard-shell.tsx`).
- **Rationale**: The product already scopes operational lists by school; payment reconciliation will likely be school-specific. Reusing shell and scope rules avoids a second navigation model.
- **Alternatives considered**:
  - **Global route** (`/integrations/wix`): Rejected because it bypasses established school scope and would duplicate scope-selection UX.
  - **Nested only under Trips**: Rejected because integration setup is a cross-cutting concern, not a trip sub-resource.

## R2 — List–detail structure

- **Decision**: Implement the page with **`ListDetailLayout`** (same primitive as `src/routes/schools/$schoolId/trips/route.tsx`): **list pane** = key fields + filter chips + sortable/paginated table; **detail pane** = read-only field list for the selected mock event (full payload shape from design notes sample).
- **Rationale**: Satisfies Constitution Principle VI and user expectation of “same behaviour as other lists.”
- **Alternatives considered**:
  - **Modal drawer for details**: Rejected; spec calls for right-pane expansion consistent with existing lists.
  - **Separate full-page detail route**: Possible later; for UX iteration, inline list-detail matches spec and reduces navigation noise.

## R3 — Mock data and state

- **Decision**: Use a **static in-repo fixture module** (TypeScript array) with **mixed orphan and matched** events; **client-only state** for sort column/direction, page index, page size, orphan filter chip, and selected row key. **No network** and **no persistence** for keys or events in this slice.
- **Rationale**: Spec explicitly scopes to mocked data for UX iteration; avoids backend contract lock-in while still allowing realistic table volume for pagination tests.
- **Alternatives considered**:
  - **MSW / fake HTTP**: Deferred; adds setup cost without user-visible benefit for this milestone.
  - **localStorage persistence for keys**: Deferred to a later security-sensitive spec to avoid implying safe storage without requirements.

## R4 — Integration key inputs

- **Decision**: Two controlled text fields above the table — **“Chave pública”** and **“Chave da API (privada)”** — with the private field using **`type="password"`** by default and an optional **reveal toggle** (common pattern; reduces shoulder-surfing in ops contexts).
- **Rationale**: Aligns with user story (register keys in UI) while respecting basic operational hygiene; still in-memory only for this phase.
- **Alternatives considered**:
  - **Plain text for both keys**: Rejected for private key usability in shared-screen settings.

## R5 — Sorting, pagination, and filtering

- **Decision**: **Client-side** sort on all five table columns; **client-side** pagination with sizes 10 / 25 / 100; **orphan filter** as a toggle chip that filters the in-memory collection before sort/pagination.
- **Rationale**: Mock-only dataset; predictable and testable without backend paging semantics.
- **Alternatives considered**:
  - **URL-serialized sort/filter**: Optional polish; not required for UX-first milestone unless it improves shareability — default **omit** to keep slice small.

## R6 — Formatting and i18n

- **Decision**: Display **currency** as BRL (e.g. `R$ 156,00`) from mocked numeric or string amounts; **dates** in `pt-BR` locale; all **new UI strings** in `src/messages/pt-BR.ts` (or equivalent central message module).
- **Rationale**: Constitution language gate; consistent with dashboard conventions.

## R7 — Testing approach (dashboard repo)

- **Decision**: **Vitest + React Testing Library** for: column header sort behaviour, pagination size changes, orphan chip filtering, row selection showing detail fields, and empty state when orphan filter matches nothing.
- **Rationale**: Constitution testing gate; matches existing `sitio-dashboard` scripts (`pnpm test`, `pnpm lint` via Biome).
