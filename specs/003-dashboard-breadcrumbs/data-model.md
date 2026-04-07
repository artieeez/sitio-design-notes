# Data model: 003-dashboard-breadcrumbs

This feature introduces **no new persisted entities**. The dashboard constructs an **ephemeral breadcrumb trail** from the **current route** and **optional** TanStack Query results (trip, passenger, school for id resolution only — **not** for displaying the school name in the trail).

## Conceptual types (client)

### `BreadcrumbSegment`

| Field | Description |
|--------|-------------|
| `key` | Stable React key (string), unique within the trail |
| `label` | User-visible **pt-BR** title for the segment |
| `to` | Optional TanStack Router `to` string when the segment is a **parent** link |
| `params` | Optional route params for `to` |

### `BreadcrumbTrail`

Ordered list of `BreadcrumbSegment` from **root of the feature IA** (sidebar-aligned) to **current page**. For **trips**, the root segment is **Viagens** (not **Início** → **Viagens**). For **school home**, the root can be **Início** only.

### Derived inputs (existing APIs)

| Source | Use |
|--------|-----|
| `GET /trips/{tripId}` | `title`, `schoolId` for trip segments and school resolution |
| `GET /passengers/{id}` | Passenger display name when needed |
| `GET /schools/{id}` | **Resolve ids only** when trail must build links; **do not** emit school **title** as a crumb |

## Validation rules

- **No school title segment** when `schoolId` is in scope (spec FR-002).
- **Current segment** is never a link to itself as a “parent” (FR-007).
- **Labels** prefer human-readable titles from API or **`pt-BR`** message keys; placeholders only during loading (see [research.md](./research.md)).
