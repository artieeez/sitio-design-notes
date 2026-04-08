<!--
Sync Impact Report
- Version change: 1.2.0 -> 1.3.0
- Modified principles:
  - None renamed
- Added sections:
  - VI. List–Detail Layout (Material Design 3) (new principle under Core Principles)
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ✅ reviewed (no edit): .cursor/commands/speckit.constitution.md
- Follow-up TODOs:
  - None
-->
# Sitio Design Notes Constitution

## Core Principles

### I. Code Quality Is Non-Negotiable
All delivered code MUST be readable, intentionally structured, and safe to evolve.
Every change MUST pass repository lint/format checks and MUST avoid dead code,
duplicated logic, and hidden side effects. Refactors are required when complexity
prevents clear maintenance. Rationale: high-quality code lowers regression risk and
keeps feature velocity sustainable.

### II. Testing Defines Done
Work is complete only when automated tests prove expected behavior. Every feature
or fix MUST include tests at the appropriate level (unit, integration, or
acceptance) and MUST include at least one failing-to-passing path during
implementation. Bug fixes MUST include a regression test. Rationale: testing is
the primary control against breakage and unclear requirements.

### III. User Experience and Language Must Stay Consistent
User-facing behavior MUST follow established interaction patterns, terminology,
and visual intent across flows. User interfaces MUST be written in Brazilian
Portuguese (`pt-BR`). Source code, technical specifications, and engineering
documentation MUST be written in English. New UX patterns or language exceptions
require explicit justification in the specification and acceptance criteria that
verify consistency. Rationale: consistency reduces user confusion, support burden,
and rework while keeping engineering collaboration clear.

### IV. Small, Reviewable Changes
Specifications, plans, and tasks MUST break delivery into independently testable
increments, each aligned to user value. Large changes MUST be split before
implementation unless a documented constraint prevents it. Rationale: small slices
improve review quality, rollback safety, and predictable progress.

### V. Specs Must Target Real Sibling Repositories
This repository is specifications-only. It MUST not be treated as an application
runtime or source implementation repository. Every spec, plan, and task list MUST
identify the target application repository or repositories under the shared parent
folder (for example `../sitio-dashboard` and `../sitio-backend`) and MUST use
repository-relative paths for implementation tasks. Rationale: explicit targeting
prevents ambiguity, broken handoffs, and implementation in the wrong repository.

### VI. List–Detail Layout (Material Design 3)
Features in the dashboard that combine a **list** (or collection) of items with a
**detail** or **editing** surface for a selected item—including **forms**—MUST
follow the Material Design 3 **List–detail** canonical layout: coordinated list
and detail regions, clear selection and navigation that preserve context, and
responsive behavior per the official guidance (including appropriate adaptation on
compact viewports). The normative reference is [Material Design 3 — List–detail
canonical layout](https://m3.material.io/foundations/layout/canonical-layouts/list-detail).
Deviations MUST be documented in the spec and plan with rationale and acceptance
criteria that prove an equivalent or better user outcome. Rationale: one canonical
pattern reduces layout drift, matches expectations for productivity UIs, and keeps
specs and implementation aligned.

## Quality Standards

- Requirements MUST be explicit, testable, and traceable to user stories.
- Success criteria MUST be measurable and technology-agnostic.
- Edge cases MUST include failure handling, empty states, and boundary conditions.
- Any ambiguity MUST be marked and resolved before implementation starts.
- Language rules MUST be explicit: code/spec content in English and user-facing
  interface content in Brazilian Portuguese (`pt-BR`).
- List–detail flows MUST state how they comply with Principle VI or cite an
  approved exemption with measurable acceptance criteria.

## Scope & Repository Boundaries

- `sitio-design-notes` contains specifications, planning artifacts, and task
  decomposition only.
- Application code changes MUST be executed in target sibling repositories, not
  in this repository.
- Each spec MUST declare target repositories explicitly, at minimum using relative
  paths from this repository root.

## Delivery Workflow & Quality Gates

- Constitution Check in planning MUST explicitly validate code quality approach,
  test strategy, UX consistency expectations, language compliance, list–detail
  layout compliance (or exemption) for applicable flows, and target repository
  mapping.
- Task breakdowns MUST include test tasks for each user story and MUST identify
  verification points before cross-cutting polish work.
- Pull requests MUST demonstrate passing quality gates (lint, tests, and
  acceptance criteria evidence) before merge.

## Governance

This constitution overrides conflicting local process notes for this repository.
Amendments require: (1) a documented proposal, (2) explicit update of impacted
templates, and (3) a version bump justified by semantic versioning policy.

Versioning policy:
- MAJOR: Removes or redefines a principle or governance rule in a
  backward-incompatible way.
- MINOR: Adds a new principle/section or materially expands required behavior.
- PATCH: Clarifies wording without changing required behavior.

Compliance review expectations:
- Every plan MUST pass Constitution Check before research/design completion.
- Every task list MUST map work to principles where relevant (quality, testing,
  UX consistency, list–detail layout where applicable).
- Reviewers SHOULD block merges that violate non-negotiable principles.

**Version**: 1.3.0 | **Ratified**: 2026-04-01 | **Last Amended**: 2026-04-08
