# Implementation Plan: School Trip Payment and Passenger Status

**Branch**: `001-school-trip-payments` | **Date**: 2026-03-30 | **Spec**: `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/spec.md`
**Input**: Feature specification from `/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/spec.md`

## Summary

Deliver a multi-repo implementation where `sitio-dashboard` (CSR React app) allows tourism staff to manage trip passenger payment/document statuses and reconciliation workflows, while `sitio-backend` (Nest.js + Prisma + CQRS) exposes secure APIs, share-link access flows, and immutable reconciliation audit events. Share-link views remain status-only and read-only, scoped to trip/school with expiration and revocation.

## Technical Context

**Language/Version**: TypeScript (frontend + backend), Node.js 22 LTS runtime target  
**Primary Dependencies**:  
- Frontend (`sitio-dashboard`): React (CSR with Vite), TanStack Router, TanStack Query, Zustand, Mantine, TanStack Form, Zod  
- Backend (`sitio-backend`): Nest.js, Prisma ORM, PostgreSQL driver, CQRS module (`@nestjs/cqrs`), class-validator/class-transformer as needed  
**Storage**: PostgreSQL (local dev assumption: `localhost:5432`), managed PostgreSQL in cluster environments  
**Testing** *(mandatory deliverables)*:  
- Frontend: Vitest + React Testing Library (unit/component), minimal integration tests for routing/state interactions  
- Backend: Jest (unit/integration), Supertest for HTTP integration  
- API endpoint collections: Bruno for manual/exploratory checks alongside—not instead of—automated tests  
- **Requirement**: Each phase’s test tasks in `tasks.md` MUST be implemented; PRs keep the repo test command green (`pnpm test` or equivalent). Incomplete automated coverage for a story requires an explicit deferral in Complexity Tracking with an agreed substitute (e.g. time-boxed follow-up issue).  
**Target Platform**: Browser clients (evergreen desktop/mobile browsers) + Linux ARM64 containers on Oracle OKE  
**Project Type**: Web application with separate frontend and backend repositories; frontend is CSR  
**Performance Goals**:  
- Trip details (up to 50 passengers) usable in under 2 minutes for staff workflows (SC-001)  
- Share-link pages load status lists with p95 backend API latency under 300ms for typical trip payloads  
**Constraints**:  
- UI language in frontend must be pt-BR  
- Contracts and code artifacts in English  
- Frontend auth is out of scope except share-link flows  
- Backend behind auth proxy; internal user identity forwarded by headers  
- Share-link auth context indicated by dedicated header and validated in middleware  
- No sensitive payment details exposed in share-link responses (status-only)  
**Scale/Scope**:  
- Multi-school, multi-trip operations with per-trip passenger rosters  
- Initial scope targets feature stories P1-P3 from spec and matching APIs/UI screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify against `.specify/memory/constitution.md` (Sitio App, CSR bare minimum):

- **Spec-first**: PASS. `spec.md` and this `plan.md` are aligned to branch `001-school-trip-payments`; clarifications resolved by user input and spec clarifications session.
- **CSR & client-safe config**: PASS. Frontend is explicitly CSR with Vite; only public client config via `import.meta.env` with `VITE_` keys. Secrets remain backend-only.
- **Stories**: PASS. P1 (trip/passenger status), P2 (share links), P3 (reconciliation/verification/flagging) remain independent and testable.
- **Tests**: PASS. `spec.md` requires automated verification; this plan defines Vitest/RTL + Jest/Supertest plus Bruno; `tasks.md` lists mandatory test tasks per phase.
- **Small & safe**: PASS with justified patterns (CQRS for backend reconciliation complexity, TanStack stack for frontend state/routing/forms). Production error views return sanitized messages only.
- **Stack**: PASS. Technical Context names CSR stack and evergreen browsers.

## Project Structure

### Documentation (this feature)

```text
/Users/arturwebber/Documents/sitio/sitio-design-notes/specs/001-school-trip-payments/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── backend-api.openapi.yaml
│   └── share-link-auth-header.md
└── tasks.md             # Created by /speckit.tasks
```

### Source Code (repository root)
```text
/Users/arturwebber/Documents/sitio/sitio-dashboard/
├── src/
│   ├── app/                      # app shell, providers, router bootstrap
│   ├── routes/                   # TanStack Router route tree
│   ├── features/
│   │   ├── trips/
│   │   ├── passengers/
│   │   ├── reconciliation/
│   │   └── share-links/
│   ├── components/               # reusable Mantine components
│   ├── stores/                   # Zustand global stores
│   ├── api/                      # TanStack Query API clients/hooks
│   ├── forms/                    # TanStack Form + Zod schemas
│   ├── i18n/                     # pt-BR messages and formatting
│   └── utils/
├── bruno/                        # optional frontend mock/proxy requests
├── .github/workflows/
│   └── docker-arm64.yml
└── tests/
    ├── unit/
    └── integration/

/Users/arturwebber/Documents/sitio/sitio-backend/
├── src/
│   ├── modules/
│   │   ├── schools/
│   │   ├── trips/
│   │   ├── passengers/
│   │   ├── payments/
│   │   ├── reconciliation/       # CQRS commands/queries/handlers
│   │   └── share-links/
│   ├── common/
│   │   ├── auth-proxy/
│   │   │   ├── auth-proxy.guard.ts
│   │   │   └── share-link.middleware.ts
│   │   ├── interceptors/
│   │   └── filters/
│   ├── prisma/
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── bruno/
│   └── school-trip-payments/
├── .github/workflows/
│   └── docker-arm64.yml
└── test/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Structure Decision**: Use a two-repository web application structure (`sitio-dashboard` + `sitio-backend`) while storing planning artifacts in `sitio-design-notes/specs/001-school-trip-payments/`. Frontend remains CSR and backend is a modular Nest.js service with CQRS boundaries for reconciliation logic.

## Post-Design Constitution Check

- **Spec-first**: PASS. `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` reflect FR-001..FR-015 and clarifications.
- **CSR & client-safe config**: PASS. Frontend remains CSR; client config restricted to public `VITE_` vars; sensitive logic remains backend side.
- **Independent stories**: PASS. Design keeps internal trip management, share-link access, and reconciliation workflows independently testable.
- **Tests when spec says so**: PASS. Spec mandates automated suites; quickstart covers how to run them with Bruno as adjunct.
- **Small changes & safe errors**: PASS. Chosen patterns are requirement-driven; error contract avoids exposing internals in production-facing responses.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
