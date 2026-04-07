# Data Model: 002-sidebar-school-scope

English technical artifact. User-facing labels are specified in `spec.md` (**pt-BR**).

This feature **does not** introduce new PostgreSQL tables. It adds **client-side** scope concepts and ties UI to the existing **School** aggregate from [001-school-trip-payments](../001-school-trip-payments/data-model.md).

## Entity overview

| Concept | Description |
|--------|---------------|
| **School** (server) | Unchanged from **001**: `id`, `title`, `faviconUrl`, `createdAt`, … — authoritative for existence, ordering, and labels. |
| **Active school scope** | The **School** whose `id` is currently driving routes and sidebar; must match URL for school-scoped pages (**FR-013**). |
| **Last accessed school id** (client) | Single `schoolId` string persisted per browser profile; drives **FR-001** step (1) when still valid on server. |
| **Recent schools** (client) | Ordered list (most recent first), **max 10** entries (**FR-006**); each entry references a `schoolId` and may store a cached **title** / **faviconUrl** for display (optional optimization; may refetch from server). |

## Client persistence shapes

See [contracts/client-scope-state.md](./contracts/client-scope-state.md) for JSON field names and key versioning.

### Validation rules (client)

- **Last accessed**: Must be a string that matches **UUID** format the API uses; before trusting, **verify** via `GET /schools/{id}` or membership in **`GET /schools`** result. If missing → fall through **FR-001**.
- **Recents**: Drop unknown `schoolId`s when syncing with server list or detail; cap length **10**; dedupe by `schoolId` keeping most recent position.

## Initialization evaluation (FR-001)

Given successful load of **minimum** data (typically full active school list from `GET /schools` with default `includeInactive=false`, unless product needs inactive visibility — not required by this spec):

1. If **route** implies a specific school **and** that id is **invalid** → **FR-020** (stop; do not substitute).
2. Else if **last accessed** is set **and** school exists → scope to it.
3. Else if **any** school exists → scope to **last created** = max(`createdAt`), tie-break **max(`id`)** lexicographically.
4. Else → navigate to **school creation** flow (`/schools/new` or as implemented).

When **minimum** data cannot load → **FR-019** (blocking error in **main content** only; **sidebar** / **scope** remain per spec; no guessed scope).

## Relationships to 001 routes

- **Trips** (**FR-011**): School-scoped **trip list** under `/schools/{schoolId}/trips` (or equivalent) per existing dashboard and **001**. Drill-down to trip detail follows **001**; **002** does not define additional sidebar targets beyond **Home** and **Trips**.

## State transitions (scope menu)

- **Select school** → update active scope, URL, **last accessed**, **recents**, invalidate TanStack Query keys scoped by `schoolId` as needed.
- **Add school** → navigate to creation; after successful create, scope to new school and update **last accessed** / **recents**.
