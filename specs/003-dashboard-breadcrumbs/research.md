# Research: 003-dashboard-breadcrumbs

Consolidated decisions for **breadcrumb information architecture**, **overflow scrolling**, **duplicate navigation removal**, and **loading labels**. Resolves planning unknowns without leaving **NEEDS CLARIFICATION** items for implementation.

## 1. Trail root: school-scoped sidebar, not “Escolas” / school name

- **Decision**: For routes under **`/schools/{schoolId}/...`**, the breadcrumb trail **starts at sidebar-aligned segments** (e.g. **Início** → `/schools/$schoolId/home`, **Viagens** → `/schools/$schoolId/trips`) and **never** includes **Escolas**, a **school list** crumb, or the **active school’s title** as a segment. For **`/trips/{tripId}/...`** deep links, resolve **`schoolId`** from the trip (existing pattern), then build the same **Viagens → …** hierarchy **without** a school-named segment.
- **Rationale**: Matches [spec.md](./spec.md) FR-001–FR-003 and **002** (school context is visible in the selector).
- **Alternatives considered**: Keep **Escolas** + school name for orientation — **rejected** by spec.

## 2. Global vs school-scoped home label

- **Decision**: Inside a school-scoped shell, the first segment uses the **same label as the sidebar Home item** (**`ptBR.nav.home`** / Início) and links to **`/schools/$schoolId/home`** when not on that page. The **unscoped** `/` experience (if any) remains outside this trail’s scope.
- **Rationale**: Spec examples (“Início”, “Viagens/…”) and FR-001 alignment with sidebar destinations.

## 3. Initial horizontal scroll shows the current (trailing) segment

- **Decision**: When the `BreadcrumbList` overflows, set **initial scroll position** so the **end** of the trail is visible (for LTR, **`scrollLeft` maximum**). Implement with a **`ref`** on the scroll container and a **`useLayoutEffect`** (or equivalent) when `pathname` or resolved labels change; avoid visible flicker where possible.
- **Rationale**: FR-006 / User Story 3 — users must see the current context without manual scrolling first.
- **Alternatives considered**: CSS-only `flex-row-reverse` — harms reading order and accessibility; **rejected**.

## 4. Single source of breadcrumb UI in the shell

- **Decision**: **Remove** redundant **page-level** `<nav aria-label="Breadcrumb">`** blocks** (e.g. on **`/trips/$tripId`**) that duplicate shell breadcrumbs once the shell trail is correct and complete. Keep page-internal **back links** only if the spec explicitly requires them (not part of 003).
- **Rationale**: One canonical trail prevents conflicting IA and duplicate `aria-label="Breadcrumb"` regions.
- **Alternatives considered**: Hide shell on certain routes — **rejected**; shell should stay consistent.

## 5. Loading and missing entity titles

- **Decision**: Keep **segment slots** stable; use a **short neutral placeholder** for a segment whose title is still loading (e.g. ellipsis character or non-committal loading copy consistent with product), then replace with the resolved **trip/passenger** title. Do **not** show the **school name** as a filler.
- **Rationale**: Edge case “dynamic names” + stable layout; avoids implying wrong names.
- **Alternatives considered**: Omit segment until loaded — causes layout shift; shrink/grow trail — **rejected** for orientation stability.

## 6. Accessibility

- **Decision**: Keep using the shadcn **`Breadcrumb`** primitive (`nav` + list semantics). Ensure **one** breadcrumb landmark per page after duplicate removal. Current page: **`BreadcrumbPage`**; parents: **`BreadcrumbLink`** when navigable per FR-007.
- **Rationale**: Aligns with spec assumption (“platform expectations”); no new WCAG level mandated in spec.

## 7. Non-school-scoped routes (`/schools`, `/schools/new`)

- **Decision**: Use a **minimal, honest trail** (e.g. Escolas → Criar escola) **without** inventing a school scope. Do **not** show a fake “Início” school-scoped segment on these pages if they are not under `/schools/:id`.
- **Rationale**: Edge case “routes without a clear sidebar parent” — avoid false location (spec edge cases).
