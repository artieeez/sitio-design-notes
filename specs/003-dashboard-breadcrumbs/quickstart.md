# Quickstart: 003-dashboard-breadcrumbs

Implementation work happens in **`../sitio-dashboard`**, not in this repository.

## Verify locally

1. Install dependencies: `pnpm install` (in `sitio-dashboard`).
2. Run the app: `pnpm dev`.
3. **Manual checks** (see [spec.md](./spec.md) success criteria):
   - Open **`/schools/{validUuid}/home`** — first segment **Início**; **no** school name in the trail.
   - Open **`/schools/{validUuid}/trips`** — trail is **Viagens** only (same as the sidebar **Viagens** item as root); **not** “Início → Viagens”.
   - Open a **nested** trip route — **Viagens / [trip] / …** (no **Início** before **Viagens**); last segment visible without horizontal scroll on first paint when overflow exists.
   - **Narrow viewport**: school title in **top row**; breadcrumbs **below** (not same row).
   - **Wide viewport**: **Sidebar toggle** then breadcrumbs in the **header** row.

## Automated tests

From `sitio-dashboard`:

```bash
pnpm test
pnpm lint
```

Add or extend tests under `src/test/` for shell/breadcrumb behavior per [plan.md](./plan.md).

## API

Ensure local backend or mock provides **`GET /trips/{id}`** and related endpoints so labels resolve (unchanged from **001**).
