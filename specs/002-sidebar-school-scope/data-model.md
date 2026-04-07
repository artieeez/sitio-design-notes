# Data Model: 002-sidebar-school-scope

English technical artifact. User-facing labels are in **pt-BR** per [spec.md](./spec.md).

This feature **does not** introduce new PostgreSQL tables. It adds **client-side** scope concepts and ties UI to the existing **School** aggregate from [001-school-trip-payments](../001-school-trip-payments/data-model.md).

## Entity overview

| Concept | Description |
|--------|-------------|
| **School** (server) | Unchanged from **001**: `id`, `title`, `faviconUrl`, `createdAt`, … — authoritative for existence, ordering, and labels. |
| **Active school scope** | The **School** whose `id` drives routes and selector labels; for school-scoped URLs, must match the route’s `schoolId` when valid. |
| **Last accessed school id** (client) | Single `schoolId` string persisted per browser profile; drives **INIT-1** step (1) when still valid on server. |
| **Recent schools** (client) | Ordered list (most recent first), **max 10**; each entry references `schoolId` and may cache **title** / **faviconUrl** for display (optional). |

## Client persistence shapes

See [contracts/client-scope-state.md](./contracts/client-scope-state.md) for JSON field names and key versioning.

### Validation rules (client)

- **Last accessed**: Must match UUID format the API uses; verify via `GET /schools/{id}` or membership in **`GET /schools`**. If missing → fall through **INIT-1**.
- **Recents**: Drop unknown `schoolId`s when syncing with server; cap length **10**; dedupe by `schoolId` keeping most recent position.

## Initialization evaluation (INIT-1)

Given successful load of **minimum** data (typically full school list from `GET /schools` with default visibility rules from **001**):

1. If **route** implies a specific school **and** that id is **invalid** → **INIT-3** (stop; do not substitute via step 2–4).
2. Else if **last accessed** is set **and** school exists → scope to it.
3. Else if **any** school exists → scope to **last created** = max(`createdAt`), tie-break **max(`id`)** lexicographically.
4. Else → navigate to **school creation** flow (existing product route, e.g. `/schools/new`).

When **minimum** data cannot load → **INIT-2** (blocking error in **main content** only; **sidebar** / **selector** remain when data allows).

## Relationships to other specs

- **001** defines trip and payment domain rules; **002** only ensures **scope** and **selector** behavior do not contradict school list/detail usage.
- **002** does **not** define additional sidebar destinations (Home, Trips, edit, etc.) — see spec **Out of scope**.

## State transitions (selector)

- **Select school** (from expanded panel) → update URL to `/schools/{schoolId}`, **last accessed**, **recents**, invalidate TanStack Query keys scoped by `schoolId` as needed.
- **School creation** from **INIT-1** when no schools exist follows the product’s existing creation flow; **002** does not require a dedicated row in the expanded panel for “add school” (see spec **Out of scope**).
