# Research: 002-sidebar-school-scope

Consolidated decisions for school scope **initialization**, **client persistence**, **selector** behavior, and REST reuse. Resolves technical choices without leaving open **NEEDS CLARIFICATION** items for this feature.

## 1. Last accessed and recent schools persistence

- **Decision**: Persist **last accessed school id** and **recent schools** (ordered, max **10**) in **`localStorage`** under **versioned keys** in [contracts/client-scope-state.md](./contracts/client-scope-state.md). Update **last accessed** when the user lands on a confirmed active school (initialization resolution or selector selection). Maintain **recents** as most-recent-first with deduplication by `schoolId`.
- **Rationale**: Spec assumes **per browser profile** storage until auth provides server-side preferences. `localStorage` is sufficient for strings and matches staff continuity on a shared machine profile.
- **Alternatives considered**: `sessionStorage` — loses continuity across sessions; IndexedDB — heavier for this use case; server-only — out of scope without auth.

## 2. “Last created” school without new API

- **Decision**: Use **`GET /api/schools`** (existing list) with **`createdAt`** per school. **Last created** = maximum `createdAt`; on tie, use **lexicographic descending `id`** (UUID) as deterministic tie-breaker.
- **Rationale**: Backend list responses include **`createdAt`**; client can derive latest creation without schema changes.
- **Alternatives considered**: Dedicated `sort=createdAtDesc&limit=1` — defer until list size forces it.

## 3. Initialization vs INIT-2 / INIT-3

- **Decision**: On load, distinguish **(A)** normal init (**INIT-1**) from **(B)** route names a **`schoolId` that must be validated** (**INIT-3**). For **(A)**, after a **successful** fetch of **minimum** school data, apply **last accessed → last created → school creation**; **`/`** uses the **same** logic (no standalone marketing-style landing). For **(B)**, validate with **`GET /schools/{id}`** (or list membership); on **404** / unknown id, show **blocking error + retry** in **main content only**; **do not** apply **INIT-1** to substitute another school. Keep **sidebar** and **scope selector** usable so staff can **search and pick another school** when possible. For **(A)**, if the minimum fetch **fails**, show **INIT-2** in **main content**; do not mount guessed school-scoped main content from local state alone.
- **Rationale**: Prevents silent wrong-school operations; recovery via selector, not a neutral “fake” scope.
- **Alternatives considered**: Fallback to **INIT-1** when deep link invalid — rejected by spec.

## 4. Routing shape

- **Decision**: Active school is reflected in the URL as **`/schools/{schoolId}/...`** consistent with the existing file-based router. **002** does **not** prescribe which child routes exist beyond what **001** and product need; it requires **scope** and **init** behavior to align with the URL.
- **Rationale**: Deep links and refresh should preserve school context; trip or other modules stay under **001**.
- **Alternatives considered**: Query-only `?school=` — weaker deep linking.

## 5. Favicon and display name

- **Decision**: Use **School** fields from API: **`title`** as label; **`faviconUrl`** when present, else a **consistent** initials/avatar fallback in the selector row.
- **Rationale**: Aligns with **001** persisted metadata without new backend if fields are already returned.

## 6. Search matching

- **Decision**: **Case-insensitive substring** on **`title`** over the client-held school list for this release.
- **Rationale**: Matches spec; staff-scale list assumptions keep client-side filtering acceptable.

## 7. Placeholder secondary line

- **Decision**: Single **non-authoritative** placeholder string for layout (**pt-BR** in product); not from API; replaced when auth binds identity (**SEL-8**).

## 8. Accessibility

- **Decision**: Reuse **shadcn/Base UI** primitives; **expand** affordance (chevron) and search field have clear labels; keyboard support via existing menu/popover patterns (**Q-2**).
