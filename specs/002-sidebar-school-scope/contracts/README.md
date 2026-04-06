# Contracts: 002-sidebar-school-scope

## REST API

This feature **reuses** the HTTP contract from **001**:

- Authoritative OpenAPI: [../001-school-trip-payments/contracts/openapi.yaml](../001-school-trip-payments/contracts/openapi.yaml)
- Typical calls: `GET /schools`, `GET /schools/{schoolId}` for initialization, validation, search source data, and **last created** derivation (see [research.md](../research.md)).

If the implementation adds query parameters, response fields, or endpoints, **extend** the shared OpenAPI in `sitio-backend` and mirror the change in the **001** contract file or a merged project-level contract (team convention).

## Client-only contracts

- [client-scope-state.md](./client-scope-state.md) — `localStorage` keys and JSON shapes for **last accessed** and **recent schools**.
