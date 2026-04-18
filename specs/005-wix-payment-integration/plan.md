# Implementation Plan: Wix Payment Gateway Event Console

**Branch**: `005-wix-payment-integration` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/005-wix-payment-integration/spec.md`

**Note**: This plan was produced by `/speckit.plan`. Phase 0 and Phase 1 artifacts live alongside this file.

## Summary

Deliver a **school-scoped** dashboard page for **Wix payment events**: operators enter **public** and **private/API** keys (in-memory only), review a **sortable, paginated** table (Trip, Value, buyer name, email, date), filter **orphan** events via a chip, and inspect **full event details** in a **list–detail** right pane. **All data is mocked** in the dashboard repo; **webhook ingestion and backend persistence are out of scope**.

Technical approach (see [research.md](./research.md)): reuse **`ListDetailLayout`** and navigation patterns from the trips hub; static fixture data; client-side sort/filter/pagination; Vitest/RTL coverage for interactive behaviour; Biome lint/format gate.

## Technical Context

**Language/Version**: TypeScript 5.x; React 19 (per sibling `../sitio-dashboard/package.json`)  
**Primary Dependencies**: TanStack Router, TanStack Query (if needed for future wiring; **not required** for mocks), shadcn/ui-style components, Tailwind CSS 4, Zod (recommended for fixture validation against contracts)  
**Storage**: N/A for this slice (in-memory UI state only)  
**Testing**: Vitest (`pnpm test`), React Testing Library for UI behaviour  
**Target Platform**: Modern evergreen browsers; responsive behaviour per Material Design 3 list–detail guidance  
**Project Type**: Web SPA (TanStack Start / Vite dashboard)  
**Target Repository/Repos**: `../sitio-dashboard` (**in scope**), `../sitio-backend` (**out of scope**)  
**Performance Goals**: Instant interaction on mocked datasets (≤ 500 rows); no perceptible lag for sort/page/filter  
**Constraints**: No network calls for events/keys; user-facing copy **pt-BR**; spec/plan/code comments **English**; comply with Constitution Principle VI for list–detail  
**Scale/Scope**: One new primary route + sidebar entry + fixtures + tests; no schema migrations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial gate (pre-research)

- **Code Quality Gate**: Implementation MUST run `pnpm lint` (Biome) and `pnpm typecheck` in `../sitio-dashboard`; prefer small focused modules (fixtures, table pane, detail pane, route shell) over monolithic route files.
- **Testing Gate**: Each user story maps to automated tests: navigation/shell presence (smoke or integration as appropriate), key fields rendering, sort/pagination/chip filtering, selection → detail content, orphan empty-state. Regression: existing trips list–detail behaviour unchanged.
- **UX Consistency Gate**: Reuse `DashboardShell` sidebar patterns (enabled/disabled with school scope), trip-adjacent **chip** language/patterns where they exist, and **`ListDetailLayout`** matching `src/routes/schools/$schoolId/trips/route.tsx` coordination between list and detail.
- **List–Detail Layout Gate**: **Pass** — feature uses collection + detail; implement with `ListDetailLayout` and documented responsive/narrow-pane behaviour consistent with trips. **No exemption.**
- **Language Gate**: UI strings in **`pt-BR`** via central messages (e.g. `src/messages/pt-BR.ts`); artifacts in this folder and implementation identifiers in **English**.
- **Repository Boundary Gate**: All code changes in **`/Users/arturwebber/Documents/sitio/sitio-dashboard`**; this repo holds only spec/plan/research/contracts/quickstart.
- **Incremental Delivery Gate**: Deliver as P1 list+detail+fixtures first; P2 key fields; P3 sort/page/chip polish — each independently demonstrable (see spec priorities).
- **Documentation Sync Gate**: Keep [spec.md](./spec.md) authoritative for product wording; update implementation readme only if a stable deep-link or menu label needs documenting for the team.

### Post–Phase 1 re-check

- **Code Quality / Testing / UX / List–Detail / Language / Repository / Incremental / Docs**: **Pass** — [research.md](./research.md), [data-model.md](./data-model.md), and [contracts/](./contracts/) align with gates; no unresolved clarifications.

## Project Structure

### Documentation (this feature)

```text
specs/005-wix-payment-integration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── wix-payment-event.ui.schema.json
│   └── wix-payment-event-list-item.ui.schema.json
├── spec.md
└── checklists/
    └── requirements.md
```

### Implementation Repositories (sibling repositories)

```text
# Target: ../sitio-dashboard
/Users/arturwebber/Documents/sitio/sitio-dashboard/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── dashboard-shell.tsx      # add sidebar nav item (school-scoped link)
│   │       └── list-detail-layout.tsx   # reuse for Wix page shell
│   ├── routes/
│   │   └── schools/
│   │       └── $schoolId/
│   │           ├── trips/
│   │           │   └── route.tsx        # reference: list-detail + outlet
│   │           └── integrations/        # NEW suggested folder
│   │               └── wix/
│   │                   ├── route.tsx    # suggested: ListDetailLayout + outlet
│   │                   ├── index.tsx      # optional: empty detail placeholder
│   │                   └── $eventId.tsx # optional: detail via route param (if matching trips pattern)
│   ├── messages/
│   │   └── pt-BR.ts                     # NEW strings for Wix integration page
│   └── lib/ or features/                # NEW: mock fixtures + types + selectors
├── package.json
└── biome.json
```

**Structure Decision**: Implement exclusively in **`../sitio-dashboard`**. Suggested route segment: **`/schools/$schoolId/integrations/wix`** with child route or query-driven selection mirroring trips list–detail semantics; exact file names may follow TanStack Router file conventions generated by the repo.

**Out of scope**: `../sitio-backend` (webhooks, persistence, sealing of secrets).

## Phase 0: Research

**Output**: [research.md](./research.md) — resolved routing, layout reuse, mock strategy, key-field UX, client-side table behaviour, and testing stack.

## Phase 1: Design and contracts

**Outputs**:

- [data-model.md](./data-model.md) — `WixPaymentEvent`, list wrapper, ephemeral keys, UI state.
- [contracts/wix-payment-event.ui.schema.json](./contracts/wix-payment-event.ui.schema.json) — payload keys aligned with `wix-payment-event-entity.json`.
- [contracts/wix-payment-event-list-item.ui.schema.json](./contracts/wix-payment-event-list-item.ui.schema.json) — list projection + `isOrphan` + `tripTitle`.
- [quickstart.md](./quickstart.md) — local run and verification steps.

**Agent context**: Run `.specify/scripts/bash/update-agent-context.sh cursor-agent` from repo root after this plan is saved.

## Complexity Tracking

No constitution violations requiring exemption tables for this feature.
