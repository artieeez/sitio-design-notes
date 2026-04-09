# Quickstart: 004 M3 list–detail (implementers)

**Target repo**: `../sitio-dashboard` (sibling of `sitio-design-notes`).

## Prerequisites

- Node.js LTS, `pnpm`
- Read [spec.md](./spec.md) and [plan.md](./plan.md)

## Add shadcn Alert Dialog

From `../sitio-dashboard` (use the project’s documented shadcn CLI; example):

```bash
cd ../sitio-dashboard
pnpm dlx shadcn@latest add alert-dialog
```

Verify `src/components/ui/alert-dialog.tsx` exists and matches existing `components.json` / Tailwind setup.

## Run quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Manual smoke (per migrated screen)

1. **Wide viewport**: List + detail visible; selection highlights; detail updates with selection.
2. **Narrow viewport**: Open item → detail; **Fechar** (Close) returns to list / clears selection; no dead end.
3. **Dirty form**: Edit field → click another row / **Fechar** / in-app nav → **Alert Dialog** (`pt-BR`); **Continuar editando** cancels; **Descartar alterações** proceeds; save path clears dirty without dialog.
4. **Invalid deep link**: Open URL with unknown id → **detail** shows not-found; list usable or path back to list context clear (FR-014).
5. **Keyboard**: Tab through list actions and detail; focus visible; dialog focus trap.

---

## FR-013 manual verification (WCAG 2.1 AA snapshot) — T031

Execute before release on **each** in-scope list–detail screen (expanded + compact width):

1. **Keyboard-only**: Move focus through **Lista** rows/actions, then **Detalhes** (forms, primary buttons), then **Fechar** where shown; reverse with Shift+Tab. Order matches visual reading order.
2. **Visible focus**: Every interactive control shows a visible focus indicator (browser or theme); no hidden focus.
3. **Selection**: Active list row uses `aria-current` (or equivalent) where implemented; screen reader can infer which item drives the detail pane.
4. **Alert Dialog (FR-012)**: Trigger unsaved guard → focus moves inside the dialog; **Continuar editando** / **Descartar** are reachable by keyboard; closing returns focus without stranding the user.
5. **Regions**: `aria-label` for list/detail matches `pt-BR.listDetail.listRegion` / `pt-BR.listDetail.detailRegion` (or documented equivalent).

---

## FR-007 UX consistency (reviewer checklist) — T031

- **Terminology**: Use **Lista** / **Detalhes** for region labels; compact detail chrome uses **Fechar** (`pt-BR.listDetail.detailClose`) — not “back” copy for clearing selection.
- **Selection affordances**: Highlight selected row; create flows that share the shell (e.g. `__new__`) show consistent selected styling where applicable.
- **Motion / focus**: Avoid layout-breaking animations in the split pane; prefer no gratuitous motion; focus management on route changes should not drop focus to `body` without recovery where feasible.

---

## Release gate (T032)

Before merging a slice that touches list–detail, run **Manual smoke** and **FR-013 manual verification** above in a real browser (expanded and compact widths). Record regressions or “checked” in the PR. Automated `pnpm lint` / `typecheck` / `test` do not replace this pass.

## Key files to introduce

- `src/components/layout/list-detail-layout.tsx`
- `src/components/layout/unsaved-changes-dialog.tsx`
- `src/hooks/use-unsaved-changes-guard.ts`
- Strings in `src/messages/pt-BR.ts`

## Contracts

See [contracts/README.md](./contracts/README.md) for behavioral contracts used in tests and review.
