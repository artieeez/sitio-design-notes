# Contracts: 003-dashboard-breadcrumbs

## REST / OpenAPI

**No changes** to backend contracts for this feature. Titles continue to come from existing **001** endpoints (`GET /trips/{id}`, `GET /passengers/{id}`, `GET /schools/{id}` for resolution only).

Authoritative API description (if needed for cross-reference): [../../001-school-trip-payments/contracts/openapi.yaml](../../001-school-trip-payments/contracts/openapi.yaml).

## UI contract

- [breadcrumb-trail.md](./breadcrumb-trail.md) — shape of the **breadcrumb trail** and rules for **segments**, **links**, and **scope**.
