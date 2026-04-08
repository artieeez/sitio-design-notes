# Contract: List–detail layout (M3-aligned)

## Regions

- **LIST**: Contains the collection; must have an accessible name (e.g. `aria-label` / heading association).
- **DETAIL**: Contains selected item content, placeholders, errors, or create/edit forms.

## Expanded (wide) behavior

- **LIST** and **DETAIL** are **simultaneously visible**.
- Changing **selection** updates **DETAIL** without full-page replace.
- **Selected** row is **visually distinct** and programmatically identifiable (e.g. `aria-current="true"` or `data-state="selected"`).

## Compact behavior

- Only **one** primary region is shown at a time **or** M3-equivalent stacked pattern with explicit **back** to **LIST**.
- User can **complete** primary task and return to **LIST** without dead end (SC-002).

## Exemptions

- Routes listed in **plan.md** as **exempt** (e.g. `/`) do not implement this contract.

## Deep link: missing entity (FR-014)

- **DETAIL** shows explicit **unavailable / not found** messaging (`pt-BR`).
- **LIST** remains operable when shown side-by-side.
- On compact, user can return to **LIST** without trap.
