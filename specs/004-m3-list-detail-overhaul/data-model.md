# Data model (UI): 004 list–detail overhaul

This feature does **not** change **domain** persistence. It introduces **UI state** concepts for layout and guards. Backend entities (School, Trip, Passenger, Payment) stay as today in `../sitio-backend` / Prisma; the dashboard keeps existing Zod schemas in `../sitio-dashboard/src/lib/schemas/`.

## Layout shell

| Concept | Description |
|---------|-------------|
| **List pane** | Region showing the **collection**; scrollable; hosts row selection and list-level actions (filters, create entry point). |
| **Detail pane** | Region showing **selected item** content, **empty** state, **loading/error**, **create** mode, or **not found** (FR-014). |
| **Layout mode** | `expanded` (both panes visible) vs `compact` (one pane visible; explicit back to list). Derived from viewport / breakpoint. |
| **Selection key** | Stable id for the selected entity (`schoolId`, `tripId`, etc.) or **`null`** for empty selection; **`create`** sentinel optional for create-only detail mode. |

## Unsaved changes guard

| Concept | Description |
|---------|-------------|
| **Dirty flag** | `true` when detail form differs from last loaded/saved baseline. |
| **Pending intent** | Describes blocked action: `select-row`, `navigate`, `compact-back`, etc. |
| **Dialog open** | When dirty + intent, show **Alert Dialog**; clear intent on cancel; on discard, apply intent and reset dirty. |
| **Baseline reset** | After successful save or discard, align baseline with server or initial values. |

## Relationships

- **One** list–detail shell **per** in-scope route group (or shared parent layout); **detail** content is **swapped** by selection or child route without destroying list scroll position where feasible.
- **Create** flows either use **`selection = null` + detail mode = create** or a **documented** child route that still renders inside the detail pane (FR-004).

## Validation rules (UI)

- Cannot **commit** selection change or **complete** navigation away from detail while **dirty** unless user **saves** or **confirms discard** (FR-012).
- **FR-014**: If URL param id fails to resolve, detail shows **not found**; list remains usable when visible.

## State transitions (summary)

1. `empty` → user selects row → `detail-loading` → `detail-readonly` or `detail-edit`.
2. `detail-edit` + dirty + user selects other row → **blocked** → dialog → discard → apply new selection **or** cancel → stay.
3. Compact: `list-visible` ↔ `detail-visible` via **back** / row tap; same dirty rules apply.
