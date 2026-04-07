# Quickstart: 002-sidebar-school-scope

Local development orientation for **school-scoped shell** work. Paths are relative to the **parent** of `sitio-design-notes` unless noted.

## Prerequisites

- Same as **001**: Node.js LTS, **pnpm**, PostgreSQL on `localhost:5432`, backend running for API calls
- Dashboard env: `VITE_API_URL` (or project equivalent) pointing at the NestJS base (e.g. `http://localhost:3000/api`)

## Dashboard (`../sitio-dashboard`)

1. **Pull latest** `sitio-backend` and `sitio-dashboard` so `GET /schools` and `GET /schools/{id}` match [001 contracts](../001-school-trip-payments/contracts/openapi.yaml).
2. Implement **scope state**:
   - Read/write **last accessed** and **recents** per [contracts/client-scope-state.md](./contracts/client-scope-state.md).
   - On app entry, run **initialization** per [research.md](./research.md) and **FR-001** / **FR-019** / **FR-020**; **`/`** redirects per **FR-001** (no visible root landing).
3. Extend **`DashboardShell`** (`src/components/layout/dashboard-shell.tsx`):
   - Replace or augment the header **brand** row with the **scope control** (**FR-002**–**FR-006**, **FR-010**).
   - Sidebar links: **Home**, **Trips** (**FR-008**, **FR-009**, **FR-011**); remove duplicate “edit school” nav if present (**FR-010**).
4. **Routes**: Ensure school-scoped **Home** and **trip list** under `/schools/$schoolId/...` align with trip routes from **001**.
5. **Copy**: Add **pt-BR** strings to `src/messages/pt-BR.ts` (placeholder username, errors, `aria-label`s for icon buttons).

### Tests

- Add/update Vitest tests under `src/test/` for initialization branches, **FR-019**/**FR-020** UI, and scope menu behavior (see **plan.md** Testing Gate).

## Backend (`../sitio-backend`)

- **Default**: **No** schema change required for **002** if `GET /schools` remains the source of truth for list + `createdAt`.
- **Optional**: Add query parameters or a dedicated endpoint only if performance or correctness requires server-side “latest created” selection (document in OpenAPI and link from this feature’s `contracts/`).

## Sanity checklist

- [ ] Cold start: last accessed valid → lands on that school.
- [ ] Cold start: last accessed stale → falls through to last created or creation flow.
- [ ] Cold start: API failure before minimum data → blocking error + retry (**FR-019**) in **main content**; **sidebar** / **scope** remain usable where data allows.
- [ ] Deep link with unknown `schoolId` → blocking error in **main content**; **no** silent rescope (**FR-020**); **scope menu** can switch school or **Add school**.
- [ ] Visit **`/`** → no standalone landing page; **FR-001** (scoped route or school creation) or **FR-019** in content.
- [ ] Scope menu: recents ≤ 10, search filters, Add school → creation route.
- [ ] Sidebar: Home / Trips; school edit **only** via scope row icon.
- [ ] New UI strings **pt-BR**; tests green; lint clean.
