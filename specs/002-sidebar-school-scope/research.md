# Research: 002-sidebar-school-scope

Consolidated decisions for school-scoped shell, initialization priority, and client persistence. Technical Context items are resolved without remaining NEEDS CLARIFICATION.

## 1. Last accessed and recent schools persistence

- **Decision**: Persist **last accessed school id** and **recent schools** (ordered, max **10**) in **`localStorage`** under **versioned keys** documented in [contracts/client-scope-state.md](./contracts/client-scope-state.md). Update **last accessed** when the user confirms an active school (initialization resolution, scope menu selection, or successful navigation to a school-scoped shell). Maintain **recents** as most-recent-first with deduplication by `schoolId`.
- **Rationale**: Spec assumes **per browser profile** storage until auth provides server-side preferences (**Assumption — Recent schools**). `localStorage` is sufficient, synchronous, and matches device-scoped continuity for staff on a shared machine profile.
- **Alternatives considered**: `sessionStorage` — loses continuity across tabs/restarts; IndexedDB — heavier for simple strings; server-only — out of scope without auth.

## 2. “Last created” school without new API

- **Decision**: Use **`GET /api/schools`** (existing list) which returns **`createdAt`** per school. Compute **last created** as the school with the maximum **`createdAt`**; on **tie** (same timestamp), use **lexicographic descending `id`** (UUID) as a deterministic tie-breaker so tests and support can reproduce behavior (Edge Cases).
- **Rationale**: Current backend `ListSchoolsHandler` (see `sitio-backend` module `school.query-handlers`) orders by `title` for display, but the response still includes **`createdAt`**, so the client can derive latest creation without schema changes.
- **Alternatives considered**: New **`GET /schools?sort=createdAtDesc&limit=1`** — preferable at very large scale; rejected as unnecessary until list size or payload cost forces it. **SQL-only ordering in a thin endpoint** — optional follow-up in `sitio-backend` if profiling demands it.

## 3. Initialization sequence vs FR-019 / FR-020

- **Decision**: On load, distinguish **(A)** normal init (**FR-001**) from **(B)** route carries a **school id** that must be validated (**FR-020**). For **(A)**, after **successful** fetch of the **minimum** school list (or equivalent) needed to evaluate priority, apply **last accessed → last created → redirect to school creation**; the **`/`** route uses the **same** logic (no standalone **visible root landing**). For **(B)**, resolve **`GET /schools/{id}`** (or validate membership in list); on **404**, show **blocking error** with **retry** in **main content only**; keep **sidebar** and **scope menu** so staff can pick **another school** or **add a school**—**do not** apply **FR-001** to substitute another school. For **(A)**, if the minimum fetch **fails**, show **blocking error** (**FR-019**) in **main content** with shell visible; do not mount **school-scoped main** content from guesses.
- **Rationale**: Matches clarifications and prevents silent wrong-school operations; recovery via **scope menu**, not a **neutral root** page.
- **Alternatives considered**: Fallback to **FR-001** when deep link invalid — explicitly rejected by spec. Dedicated **`/`** marketing or recovery page — rejected; **`/`** must run **FR-001** or **FR-019** only.

## 4. Routing shape for school-scoped dashboard

- **Decision**: Use **school id in the URL** for school-scoped areas (e.g. `/schools/$schoolId/...`) consistent with existing routes like `../sitio-dashboard/src/routes/schools/$schoolId/trips/`. Add or adjust **index** routes for **Home** and the **trip list** hub under the same `$schoolId` segment so breadcrumbs and links stay stable; further trip drill-down follows **001**.
- **Rationale**: File-based router already encodes school scope; scope control and **FR-013** require URLs and sidebar to reflect the active school.
- **Alternatives considered**: Global query param `?school=` only — weaker deep linking and harder to align with existing trip routes.

## 5. Favicon and display name

- **Decision**: Use **School** fields from API: **`title`** as primary label (per **001** data model — no separate `name`); **`faviconUrl`** when present, else a **consistent** initials/avatar fallback component in the scope row.
- **Rationale**: Aligns with persisted school metadata from **001**; **FR-003**–**FR-004** satisfied without new backend if `faviconUrl` is already returned.
- **Alternatives considered**: Client-only favicon fetch from `url` — duplicates metadata responsibilities; optional enhancement only.

## 6. Search matching

- **Decision**: **Case-insensitive substring** match on **`title`** (and optionally other list fields already returned) in the client over the fetched school list for this release (**Assumption — Search**).
- **Rationale**: Matches spec; staff-scale list assumptions keep client-side filtering acceptable.
- **Alternatives considered**: Server search endpoint — defer until list size or security policy requires it.

## 7. Placeholder secondary line

- **Decision**: Single **non-authoritative** placeholder string for layout (copy in **pt-BR** during implementation); not derived from API; replaced later when auth binds real identity (**FR-005**, **FR-007**).
- **Rationale**: Spec mandates placeholder until auth exists.
- **Alternatives considered**: Hide secondary line — fails **FR-005** minimum.

## 8. Accessibility

- **Decision**: Use the same **shadcn/Base UI** primitives and patterns as the existing shell; ensure **icon-only** controls expose **`aria-label`** in **pt-BR**; keyboard support via menu/popover patterns already in the design system (**FR-021**).
- **Rationale**: Spec does not add a new WCAG tier; inherit project baseline.
- **Alternatives considered**: Custom widget without labels — rejected.
