# Quickstart: 002-sidebar-school-scope

Local development orientation for **school scope selector** and **initialization**. Paths are relative to the **parent** of `sitio-design-notes` unless noted.

## Prerequisites

- Same as **001**: Node.js LTS, **pnpm**, PostgreSQL on `localhost:5432`, backend running for API calls
- Dashboard env: `VITE_API_URL` (or project equivalent) pointing at the NestJS base (e.g. `http://localhost:3000/api`)

## Dashboard (`../sitio-dashboard`)

1. **Pull latest** `sitio-backend` and `sitio-dashboard` so `GET /schools` and `GET /schools/{id}` match [001 contracts](../001-school-trip-payments/contracts/openapi.yaml).
2. **Scope state**: Read/write **last accessed** and **recents** per [contracts/client-scope-state.md](./contracts/client-scope-state.md).
3. **Initialization**: On app entry, run **INIT-1** / **INIT-2** / **INIT-3** per [research.md](./research.md) and [spec.md](./spec.md); **`/`** redirects per **INIT-1** (no standalone marketing landing).
4. **Shell**: Implement the **scope selector** at the **top of the sidebar** — **title**, **favicon**/fallback, **chevron**, **placeholder** secondary line; **expand** shows **search**, **results**, **recents** (≤**10**). Do **not** treat this doc as requiring **Home/Trips** nav, **breadcrumbs**, or **top bar** content — those are **out of spec** for **002** unless product tracks them separately.
5. **Copy**: **pt-BR** strings in `src/messages/pt-BR.ts` (errors, `aria-label`s, placeholder user).

### Tests

- Vitest / Testing Library: init branches, **INIT-2**/**INIT-3** UI, selector open/search/select, recents cap (see [plan.md](./plan.md) testing gate).

## Backend (`../sitio-backend`)

- **Default**: No schema change if `GET /schools` remains the source of truth for list + `createdAt`.
- **Optional**: Query params or a dedicated endpoint only if server-side “latest created” or list semantics cannot be derived client-side — document in OpenAPI.

## Sanity checklist

- [ ] Cold start: last accessed valid → lands on that school.
- [ ] Cold start: last accessed stale → falls through to last created or creation flow.
- [ ] Cold start: API failure before minimum data → **INIT-2** in **main content**; sidebar/selector usable where data allows.
- [ ] Deep link with unknown `schoolId` → **INIT-3** in **main content**; **no** silent rescope; recover via selector/search when possible.
- [ ] Visit **`/`** → **INIT-1** or **INIT-2** (no visible standalone root landing).
- [ ] Selector: recents ≤ 10, search filters by **title** (case-insensitive substring).
- [ ] New UI strings **pt-BR**; tests green; lint clean.
