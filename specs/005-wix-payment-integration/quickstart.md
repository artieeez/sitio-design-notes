# Quickstart: Wix Payment Gateway Event Console (implementation handoff)

**Target repo**: `/Users/arturwebber/Documents/sitio/sitio-dashboard`  
**Spec**: `spec.md` in this folder  
**Plan**: `plan.md`

## Prerequisites

- Node.js LTS compatible with the dashboard repo
- `pnpm` installed

## Run the dashboard locally

```bash
cd /Users/arturwebber/Documents/sitio/sitio-dashboard
pnpm install
pnpm dev
```

Default dev server is port **8080** (see `package.json`).

## Verify the feature (after implementation)

1. Open the dashboard in the browser.
2. Select a school from the scope menu so sidebar items are enabled.
3. Use the sidebar entry **Integração Wix** (label per `pt-BR` messages) to open `/schools/{schoolId}/integrations/wix` (exact path per implementation).
4. Confirm:
   - Public and private/API key fields render **above** the table.
   - Table shows columns Trip, Value, Name, Email, Date with **mock** rows including at least one **orphan** event.
   - Each column header toggles sort.
   - Page size 10 / 25 / 100 updates the visible page.
   - Orphan filter chip hides non-orphan rows when active.
   - Row selection opens the **right-hand detail** pane with all fields from the event payload contract.

## Quality gates (before merge)

```bash
cd /Users/arturwebber/Documents/sitio/sitio-dashboard
pnpm lint
pnpm test
pnpm typecheck
```

## Related design artifacts

- `research.md` — routing, layout, mock, and testing decisions  
- `data-model.md` — entities and UI state  
- `contracts/wix-payment-event.ui.schema.json` — payload shape for mocks and tests
