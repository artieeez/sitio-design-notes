# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Target Repository/Repos**: [e.g., ../sitio-dashboard, ../sitio-backend or NEEDS CLARIFICATION]
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality Gate**: Define linting/formatting/static analysis checks and
  identify how complexity is kept maintainable.
- **Testing Gate**: Define required test layers per user story and confirm a
  regression strategy for changed behavior.
- **UX Consistency Gate**: List existing UX patterns this feature reuses and any
  justified deviations with acceptance criteria.
- **Language Gate**: Confirm code/spec artifacts are in English and all
  user-facing UI content is in Brazilian Portuguese (`pt-BR`).
- **Repository Boundary Gate**: Confirm this repo is used for specs only and
  implementation paths are mapped to sibling target repositories.
- **Incremental Delivery Gate**: Confirm user stories are independently testable
  and deliverable in small reviewable slices.
- **Documentation Sync Gate**: Identify which docs/spec artifacts must be updated
  with implementation to prevent drift.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Implementation Repositories (sibling repositories)
<!--
  ACTION REQUIRED: Replace the placeholder trees below with concrete target repo
  layouts. Keep paths relative to this repository root (e.g., ../sitio-dashboard).
-->

```text
# Example target repo A: ../sitio-dashboard
../sitio-dashboard/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Example target repo B: ../sitio-backend
../sitio-backend/
├── src/
│   ├── modules/
│   ├── services/
│   └── api/
└── tests/
```

**Structure Decision**: [Document selected target repositories and the concrete
directories where implementation will occur]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
