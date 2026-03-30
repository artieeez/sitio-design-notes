# Phase 0 Research: School Trip Payment and Passenger Status

## Decision 1: Frontend architecture and stack

- **Decision**: Build `sitio-dashboard` as a CSR React app with Vite, TanStack Router, TanStack Query, Zustand, Mantine, TanStack Form, and Zod.
- **Rationale**: Matches explicit implementation constraints, supports fast route-level data loading and client-side UX for operations dashboards, and keeps form/data validation consistent.
- **Alternatives considered**:
  - Next.js/SSR: rejected because requirement is CSR React.
  - Redux Toolkit for global state: rejected because requirement specifies Zustand.
  - React Hook Form: rejected because requirement specifies TanStack Form.

## Decision 2: Backend architecture and stack

- **Decision**: Build `sitio-backend` with Nest.js + Prisma + PostgreSQL using CQRS for reconciliation and auditing workflows.
- **Rationale**: CQRS cleanly separates read models (trip/passenger status views) from write-heavy reconciliation flows (merge, verify, reassign, flag) and supports auditability.
- **Alternatives considered**:
  - Plain service/controller style without CQRS: rejected due to higher risk of coupling read and write concerns in complex reconciliation logic.
  - TypeORM: rejected because requirement specifies Prisma.

## Decision 3: Authentication and request trust boundaries

- **Decision**: Assume service is behind auth proxy for internal staff routes; enforce a dedicated share-link authentication header in middleware for share-link flows where user headers are absent.
- **Rationale**: Aligns with infrastructure assumptions and enables explicit branch logic for internal users versus link-based school users.
- **Alternatives considered**:
  - Frontend-managed auth: rejected as out of frontend scope.
  - JWT parsing directly in backend app for all requests: rejected because identity is forwarded by proxy headers.

## Decision 4: Share-link contract and data minimization

- **Decision**: Share-link endpoints return status-only fields for school views (paid/pending/document-pending/under-review/flagged), with strict scope enforcement (trip or school) and expiration/revocation checks.
- **Rationale**: Directly satisfies FR-010 to FR-014 and minimizes leakage risk when links are shared.
- **Alternatives considered**:
  - Including amount or transaction metadata: rejected by FR-012.
  - Single mixed list for school scope: rejected; trip-first navigation required (FR-013).

## Decision 5: Localization policy

- **Decision**: UI copy and user-facing messages in frontend are pt-BR; code, API contracts, identifiers, and docs under `contracts/` stay in English.
- **Rationale**: Matches user requirement while preserving developer-facing consistency for integrations and tests.
- **Alternatives considered**:
  - Bilingual UI: rejected for unnecessary complexity in initial scope.

## Decision 6: Deployment target and CI pipeline

- **Decision**: Add ARM64 container build workflows in both `sitio-dashboard` and `sitio-backend` using GitHub Actions with Docker Buildx (`linux/arm64`).
- **Rationale**: Oracle OKE target uses ARM VMs; native ARM images avoid emulation/runtime mismatch.
- **Alternatives considered**:
  - Multi-arch from day one: possible but deferred unless x86 runtime is also needed.
  - ARM-only local scripts without CI: rejected due to reproducibility concerns.

## Decision 7: API testing strategy

- **Decision**: Keep Bruno collections in `sitio-backend/bruno/` to validate endpoint behavior for internal and share-link flows.
- **Rationale**: Explicit requirement to use Bruno and easy collaboration for QA/dev without coupling to frontend test harness.
- **Alternatives considered**:
  - Postman collections only: rejected due to Bruno requirement.
