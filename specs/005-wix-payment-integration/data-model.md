# Data Model: Wix Payment Gateway Event Console

**Feature**: `005-wix-payment-integration`  
**Date**: 2026-04-18  
**Scope**: Frontend conceptual model and mock fixtures (`../sitio-dashboard`). No persistence.

## Entity: `WixPaymentEvent` (canonical / detail payload)

Represents one inbound payment notification as surfaced in the **detail pane**. Field names follow the design sample (`wix-payment-event-entity.json`); implementers MAY normalize typos (`buyerIndo*` → internal `buyerInfo*`) in code while preserving display labels in Portuguese.

| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|--------|
| `id` | UUID string | yes | Event / order correlation id in sample |
| `dateCreated` | ISO-8601 datetime | yes | Shown in table “Date” column |
| `buyerInfoId` | UUID string | yes | Detail only unless surfaced later |
| `buyerIndoFirstname` | string | yes | Part of buyer name |
| `buyerIndoLastname` | string | yes | Part of buyer name |
| `buyerIndoPhone` | string | yes | |
| `buyerIndoEmail` | string | yes | Table “Email” column |
| `buyerIndoContactId` | UUID string | yes | |
| `orderId` | UUID string | yes | |
| `orderTotal` | decimal as string | yes | Table “Value”; format as BRL in UI |
| `billingInfoPaymentMethod` | string | yes | |
| `billingInfoCountry` | string | yes | e.g. `BR` |
| `billingInfoSubdivision` | string | yes | e.g. `BR-RS` |
| `billingInfoCity` | string | yes | |
| `billingInfoZipCode` | string | yes | |
| `billingInfoPhone` | string | yes | |
| `billingInfoEmail` | string | yes | |
| `billingInfoVatIdNumber` | string | yes | Sensitive; show in detail, consider copy-only |
| `billingInfoVatIdType` | string | yes | e.g. `CPF` |
| `billingInfoStreetNumber` | string | yes | |
| `billingInfoStreetName` | string | yes | |
| `lineItemsName` | string | yes | |
| `lineItemsProductId` | string | yes | |
| `lineItemsOptions` | string | no | May be empty |
| `lineItemsCustomTextFields` | string | no | May be empty |

### Projection for table row (derived)

| Logical field | Source | Notes |
|---------------|--------|--------|
| Trip label | `tripTitle` (mock-only) OR placeholder when orphan | Spec column “Trip” |
| Value | `orderTotal` | Formatted BRL |
| Buyer name | `buyerIndoFirstname` + `buyerIndoLastname` | Trim, single space |
| Email | `buyerIndoEmail` | |
| Date | `dateCreated` | Locale `pt-BR` |

## Entity: `WixPaymentEventListItem`

Extends or wraps `WixPaymentEvent` for list rendering.

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `event` | `WixPaymentEvent` | yes | Full payload for detail pane |
| `isOrphan` | boolean | yes | `true` when no matching trip; drives chip + tag |
| `tripTitle` | string \| null | yes | `null` or empty when orphan — UI shows em dash or “Sem viagem” per copy spec |

## Value object: `IntegrationKeyDraft`

Ephemeral UI state (not persisted in this feature).

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `publicKey` | string | no | User-editable |
| `privateApiKey` | string | no | Masked input; in-memory only |

## State: list UI controller (conceptual)

| State | Type | Notes |
|-------|------|-------|
| `sort` | `{ column: Trip \| Value \| Name \| Email \| Date; direction: asc \| desc }` | Toggle per column header |
| `pageSize` | `10 \| 25 \| 100` | User-selectable |
| `pageIndex` | number (0-based) | Reset when filters or page size change |
| `orphanOnly` | boolean | Chip active/inactive |
| `selectedEventId` | string \| null | Drives detail pane |

## Validation rules (UX-level)

- Empty key fields do not block viewing or selecting events.
- Orphan events: `isOrphan === true`; table shows a visible **orphan** tag in addition to chip filter.
- Sorting on **Trip** treats null/empty trip labels as sortable empties (consistent order, documented in tests).

## Relationships (future, out of scope here)

- `WixPaymentEvent` **may later link to** `Trip` by id; this iteration only mocks `tripTitle` / `isOrphan`.
