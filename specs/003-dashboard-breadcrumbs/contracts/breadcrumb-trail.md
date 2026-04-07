# UI contract: Breadcrumb trail (dashboard)

## Scope

Applies to **`DashboardBreadcrumbs`** in `../sitio-dashboard` and any extracted builder module. User-facing strings are **pt-BR** via `messages/pt-BR.ts`.

## Trail shape

The component renders an ordered list of **segments**:

```typescript
type BreadcrumbSegment =
  | { key: string; label: string }
  | {
      key: string;
      label: string;
      to: string;
      params?: Record<string, string>;
    };
```

- **`label`**: Always non-empty for rendering (use a **neutral placeholder** while async titles load — see research).
- **Link segments**: Include **`to`** (and **`params`** when the route has params). The **last** segment for the current URL MUST NOT be a link unless product explicitly allows (default: **current = page**, not link).

## School-scoped rules (`/schools/{schoolId}/...`)

1. The trail MUST use **sidebar-aligned** copy (**`ptBR.nav.home`**, **`ptBR.entities.trips`**, etc.). **Trip-related** flows (trips list, new trip, and anything under trip routes) MUST **root at “Viagens”**—the first segment is **Viagens** when the user is in that area, **not** “Início → Viagens”. **Início** (school-scoped home) is its own trail when on `/schools/{schoolId}/home`, not a parent above **Viagens** in trip contexts.
2. The trail MUST NOT contain the **active school’s name** or a generic **Escolas** list crumb as part of the scoped story (spec FR-002).
3. Nested segments (trip title, passengers, payments, create/edit) follow the **URL hierarchy** with **human-readable** labels.

## Deep links (`/trips/{tripId}/...`)

When the URL is not under `/schools/...`, resolve **`schoolId`** from the trip payload for **link targets** only; still **omit** school name from visible segments. The trail MUST still **root at “Viagens”** (same as the sidebar item), then the trip and deeper segments—**not** “Início → Viagens → …”.

## Accessibility

- One **breadcrumb** landmark per view after consolidation (shell only).
- Use existing **`Breadcrumb`**, **`BreadcrumbList`**, **`BreadcrumbItem`**, **`BreadcrumbLink`**, **`BreadcrumbPage`** from `@/components/ui/breadcrumb`.

## Overflow

- The list container MUST be **horizontally scrollable** when content overflows.
- On mount/update, **initial scroll position** MUST show the **trailing** (current) segment in view for LTR (spec FR-006).
