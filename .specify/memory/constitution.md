<!--
Sync Impact Report
- Version: template (unversioned placeholders) → 1.0.0
- Principles: [PRINCIPLE_1_NAME]…[PRINCIPLE_5_NAME] → I–V (Spec-First; Independent
  Stories; Testing Discipline; Security & Secrets; Simplicity & Observability)
- Added sections: Technology Stack & Constraints; Workflow & Quality Gates (replaced
  SECTION_2_NAME / SECTION_3_NAME placeholders)
- Removed: none (template structure retained)
- Templates: .specify/templates/plan-template.md ✅ | .specify/templates/spec-template.md ✅ |
  .specify/templates/tasks-template.md ✅ |
  .specify/templates/commands/*.md ⚠ N/A (directory not present)
- Follow-up: Add README.md when application code exists; restate stack in first plan.md
-->

# Sitio App Constitution

## Core Principles

### I. Spec-First Delivery

Feature work MUST trace to documented artifacts: `spec.md` and `plan.md` under
`/specs/<branch-feature>/`. Scope changes MUST update those documents before code
changes land. Underspecified areas MUST be marked `NEEDS CLARIFICATION` in the spec
or plan rather than silently guessed.

**Rationale**: Prevents drift between intent and implementation and keeps the Spec Kit
workflow the single source of truth.

### II. Independent User Stories

User stories MUST be prioritized (P1, P2, …), independently testable, and deliverable
as incremental MVPs. Implementation and task ordering SHOULD default to completing P1
before expanding scope unless the plan documents a parallel or risk-driven exception.

**Rationale**: Enables incremental delivery, clearer testing, and predictable demos.

### III. Testing Discipline

When the feature specification requests tests, contributors MUST follow the agreed
order (failing tests first where TDD applies), keep tests close to the structure in
`plan.md` and `tasks.md`, and add contract or integration coverage for boundaries
called out in the plan (e.g., external HTTP APIs, auth). Tests MUST NOT be removed to
“green” the build without product or spec agreement.

**Rationale**: Protects regressions and documents behavior at system edges.

### IV. Security & Secrets Hygiene

Secrets and long-lived credentials MUST NOT be committed. Configuration MUST use
environment variables or the project’s approved secret mechanism once introduced.
User-visible errors MUST avoid leaking internal stack traces or tokens in production
builds. Authentication, authorization, and PII handling MUST match what the spec and
plan require—no “temporary” open endpoints without an explicit, time-bounded
exception in the plan’s Complexity Tracking.

**Rationale**: Web apps are high-risk surfaces; defaults must favor least exposure.

### V. Simplicity, Observability & Stack Consistency

Prefer the smallest change that satisfies the spec. New dependencies, frameworks, or
patterns MUST be justified in the plan; unjustified complexity MUST be listed under
Complexity Tracking with a simpler alternative noted. Operational signals (structured
logging, actionable error messages, and—where applicable—client-side error reporting)
MUST be sufficient to diagnose production issues without reproducing locally.

**Rationale**: Keeps the codebase maintainable and incidents diagnosable.

## Technology Stack & Constraints

The concrete language, framework, and tooling stack MUST be recorded in each feature’s
`plan.md` under **Technical Context** once the repository contains application code.
Until a stack is fixed, plans MUST use `NEEDS CLARIFICATION` instead of assuming
(e.g.) a specific UI framework or host. Cross-cutting constraints (browser support,
accessibility target, performance budget) SHOULD appear in the plan when known.

**Rationale**: This repository may bootstrap incrementally; the constitution still
requires explicit stack decisions per feature.

## Workflow & Quality Gates

Branches and specs MUST follow the Spec Kit conventions already configured for this
repo (e.g., `specs/[###-feature-name]/`). Every implementation plan MUST complete the
**Constitution Check** before Phase 0 research and re-validate after Phase 1 design.
Pull requests SHOULD verify alignment with this constitution; intentional deviations
MUST reference the plan’s Complexity Tracking table.

**Rationale**: Connects day-to-day work to documented governance without blocking
progress when exceptions are explicit.

## Governance

This constitution supersedes ad-hoc conventions when they conflict. Amendments MUST:

1. Update `.specify/memory/constitution.md` with a new **Version** and **Last
   Amended** date (ISO `YYYY-MM-DD`).
2. Follow semantic versioning for the constitution: **MAJOR** for breaking governance
   or removed/redefined principles; **MINOR** for new principles or materially new
   obligations; **PATCH** for clarifications and non-semantic edits.
3. Propagate material requirement changes to `.specify/templates/` (plan, spec,
   tasks) and any agent command docs that reference obsolete rules.

Compliance: Feature planning and code review SHOULD confirm Constitution Check gates
and security/testing expectations for the feature at hand. Runtime developer hints
MAY live in `README.md` or `AGENTS.md` when added; they MUST NOT contradict this file.

**Version**: 1.0.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-29
