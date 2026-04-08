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
2. **Narrow viewport**: Open item → detail; **back** returns to list; no dead end.
3. **Dirty form**: Edit field → click another row / back / in-app nav → **Alert Dialog** (`pt-BR`); **Continue editing** cancels; **Discard** proceeds; save path clears dirty without dialog.
4. **Invalid deep link**: Open URL with unknown id → **detail** shows not-found; list usable or back path clear (FR-014).
5. **Keyboard**: Tab through list actions and detail; focus visible; dialog focus trap.

## Key files to introduce

- `src/components/layout/list-detail-layout.tsx`
- `src/components/layout/unsaved-changes-dialog.tsx`
- `src/hooks/use-unsaved-changes-guard.ts`
- Strings in `src/messages/pt-BR.ts`

## Contracts

See [contracts/README.md](./contracts/README.md) for behavioral contracts used in tests and review.
