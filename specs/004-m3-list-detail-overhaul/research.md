# Research: 004 M3 list–detail dashboard overhaul

## 1. Material Design 3 list–detail layout

**Decision**: Implement the **canonical list–detail** pattern: **list pane** (primary navigation/selection) + **detail pane** (content, including forms); on **compact** widths, show **one pane at a time** with explicit **back** to the list, preserving context per M3 guidance.

**Rationale**: Matches spec FR-001, FR-003, constitution Principle VI, and user expectations for productivity UIs.

**Alternatives considered**:

- **Master–detail via full route navigation only** (current baseline) — rejected as primary pattern because it breaks coordinated regions and compact behavior required by the spec.
- **Detail-only on mobile without list escape hatch** — rejected (violates FR-003, SC-002).

## 2. Component library: shadcn/ui

**Decision**: Use **shadcn/ui** (project already on shadcn + Base UI primitives) for **new** UI pieces and for the **unsaved changes** confirmation. Reuse existing `button`, `scroll-area`, `separator`, `sheet`, `skeleton` where they fit the layout.

**Rationale**: Single visual language, accessible primitives, matches user direction and existing `src/components/ui/*`.

**Alternatives considered**:

- **Ad-hoc modal markup** — rejected: harder to meet FR-013 focus trap/ARIA consistently.
- **Radix-only without shadcn wrappers** — rejected: diverges from repo conventions.

## 3. Unsaved changes: shadcn Alert Dialog

**Decision**: Add **`alert-dialog`** via shadcn CLI. On **dirty** forms, **intercept** (a) **selecting another list row**, (b) **router navigation** away from detail, (c) **compact “back”** from detail — open **AlertDialog** with **pt-BR** title/description and actions: **Continue editing** (cancel), **Discard** (destructive confirm), optional **Save** when submit is valid (product choice: at minimum discard + cancel per FR-012).

**Rationale**: Meets FR-012, clarifications session; Alert Dialog is the appropriate **blocking** pattern for destructive navigation.

**Alternatives considered**:

- **`window.confirm`** — rejected: poor a11y/i18n styling.
- **Inline banner only** — rejected: does not block navigation strongly enough for FR-012.

## 4. TanStack Router + dirty state

**Decision**: Use a **two-layer** approach:

1. **Application guard**: List–detail container owns **selected id**; before changing selection, if **dirty**, open dialog and **do not** change selection until resolved.
2. **Router guard**: Where routes mount forms, use TanStack Router **navigation blocking** APIs if available in the pinned version; if not, use **`useRouter` subscription / `beforeLoad` patterns** or a **wrapper** that intercepts `Link`/`navigate` when dirty — **research during implementation** against `@tanstack/react-router` version in `package.json`.

**Rationale**: FR-012 applies to **selection change** and **leaving detail**; both in-app selection and URL changes must be covered.

**Alternatives considered**:

- **Dirty guard only inside form components** — insufficient: list clicks bypass form.

## 5. Accessibility (FR-013)

**Decision**: Treat **list** as a **single tab stop** or use **roving tabindex** / arrow-key listbox pattern only if components support it; ensure **visible focus** on list items and primary actions; **Alert Dialog** must trap focus and restore focus on close (shadcn/Base UI default behavior expected — verify in implementation).

**Rationale**: WCAG 2.1 AA requirement in spec.

**Alternatives considered**:

- **Defer a11y to polish phase** — rejected: constitution and SC-009 require upfront design.

## 6. Pagination / virtualization (out of scope)

**Decision**: **No** changes to fetch/windowing strategy in this feature (per clarifications).

**Rationale**: Explicitly excluded from spec scope.

## 7. Backend / API

**Decision**: **No** contract changes assumed; reuse existing REST endpoints and Zod schemas.

**Rationale**: Spec assumption; reduces blast radius.
