# Contract: Unsaved changes (shadcn Alert Dialog)

## Preconditions

- Detail surface contains a **form** or field group tracked as **dirty** vs baseline.
- User attempts a **blocked action** (non-exhaustive): select different list row; navigate away via router; compact **back** from detail while dirty.

## Behavior

1. **Blocked action does not complete** until resolved.
2. **Alert Dialog** opens (shadcn `AlertDialog`), modal, focus trapped.
3. Copy is **pt-BR** (title, description, buttons).

## Required actions (minimum)

- **Continue editing** (or equivalent): closes dialog, **no** navigation/selection change.
- **Discard changes**: closes dialog, **applies** the pending action, form resets to last loaded/server state or navigates without saving.

## Optional action

- **Save** (primary): if form is submittable, save then apply pending action without showing discard — product may add when UX is defined; **must not** violate FR-012 minimum (save **or** explicit discard).

## Implementation note

- Use shared **`unsaved-changes-dialog`** + **`use-unsaved-changes-guard`** so all in-scope forms behave consistently (FR-007).
