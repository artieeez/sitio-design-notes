<!--
Sync Impact Report
- Version: 1.0.0 → 1.1.0
- Principles: tightened to bare minimum for CSR; I–V retitled/refocused (Spec-First;
  CSR Delivery & Client-Safe Config; Independent Stories; Tests When Spec Says So;
  Small Changes & Safe Errors)
- Added sections: none
- Removed sections: none
- Templates: .specify/templates/plan-template.md ✅ | .specify/templates/spec-template.md ⚠
  unchanged (still aligned) | .specify/templates/tasks-template.md ✅ |
  .specify/templates/commands/*.md ⚠ N/A
- Follow-up: none
-->

# Sitio App Constitution

## Core Principles

### I. Spec-First Delivery

Feature work MUST trace to `spec.md` and `plan.md` under `/specs/<branch-feature>/`.
Scope changes MUST update those documents first. Unknowns MUST be marked
`NEEDS CLARIFICATION`, not guessed.

**Rationale**: Keeps the Spec Kit workflow the contract for what ships.

### II. CSR Delivery & Client-Safe Configuration

This product is a **client-side rendered (CSR)** web app: meaningful UI and data
fetching run in the browser after load. Plans MUST state that rendering model and
how client env/config is supplied (e.g. build-time `import.meta.env`, `NEXT_PUBLIC_*`,
or equivalent).

Anything sent to the browser is public. Server-only secrets and private API keys MUST
NOT appear in client source, bundled assets, or client-exposed env. If a key is
intentionally public (e.g. anon client id), the plan MUST say so.

**Rationale**: CSR makes the bundle and public env the trust boundary; mistakes here
are common and severe.

### III. Independent User Stories

User stories MUST stay prioritized (P1, P2, …) and independently testable so each
slice can ship and be verified on its own.

**Rationale**: Matches incremental CSR feature work without prescribing ceremony.

### IV. Tests When the Spec Says So

If `spec.md` calls for automated tests, implementation MUST follow the plan’s
testing shape (what to run, where files live). Tests MUST NOT be dropped to pass CI
without updating the spec.

**Rationale**: Bare minimum testing rule—no mandatory TDD unless the spec asks.

### V. Small Changes & Safe Errors

Prefer the smallest change that meets the spec. New dependencies or patterns MUST be
justified in the plan or listed under Complexity Tracking. Production-facing error UI
MUST NOT expose stack traces, tokens, or internal paths.

**Rationale**: Limits bundle and cognitive growth; avoids leaking internals in CSR
error surfaces.

## Technology Stack & Constraints

Each `plan.md` **Technical Context** MUST record the CSR stack (framework, bundler,
TypeScript/version if used) and target browsers or “evergreen only” when known. SEO,
first-contentful paint, or offline needs MUST be called out in the plan if they matter
for the feature—CSR does not fix them by default.

## Workflow & Quality Gates

Use Spec Kit paths (`specs/[###-feature-name]/`). Complete **Constitution Check** in
the plan before Phase 0 and again after Phase 1 design. Deviations MUST be explicit in
Complexity Tracking.

## Governance

This constitution supersedes conflicting ad-hoc rules. Amendments MUST update this
file’s **Version** (semver: MAJOR = breaking governance; MINOR = new obligations;
PATCH = clarifications), set **Last Amended** to the change date, and sync
`.specify/templates/` when gates change. Reviews SHOULD confirm Constitution Check and
CSR/client-secret rules for each feature.

**Version**: 1.1.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-29
