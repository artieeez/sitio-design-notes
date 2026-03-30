# Data Model: School Trip Payment and Passenger Status

## Entity: School

- **Fields**
  - `id` (UUID)
  - `name` (string, required)
  - `externalRef` (string, optional, unique)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
- **Relationships**
  - One-to-many with `Trip`
- **Validation Rules**
  - `name` non-empty, max 200 chars

## Entity: Trip

- **Fields**
  - `id` (UUID)
  - `schoolId` (UUID, FK -> School)
  - `title` (string, required)
  - `code` (string, optional, unique)
  - `startsAt` (date/time, optional)
  - `endsAt` (date/time, optional)
  - `status` (enum: `ACTIVE`, `CANCELLED`, `COMPLETED`)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
- **Relationships**
  - Many-to-one with `School`
  - One-to-many with `Passenger`
  - One-to-many with `ShareLink` (trip-scoped)
- **Validation Rules**
  - `schoolId` required
  - if both dates present: `startsAt <= endsAt`

## Entity: Passenger

- **Fields**
  - `id` (UUID)
  - `tripId` (UUID, FK -> Trip)
  - `fullName` (string, required)
  - `studentDocument` (string, optional)
  - `paymentStatus` (enum: `PAID`, `PENDING`, `UNDER_REVIEW`)
  - `documentStatus` (enum: `NOT_REQUIRED`, `PENDING`, `SUBMITTED`, `VERIFIED`)
  - `isFlagged` (boolean, default false)
  - `flagReason` (string, optional)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
- **Relationships**
  - Many-to-one with `Trip`
  - Zero-or-many with `PaymentRecord` (via reconciliations over time, but active match must be unique)
  - One-to-many with `Flag`
- **Validation Rules**
  - `fullName` non-empty
  - `flagReason` required when `isFlagged=true`

## Entity: PaymentRecord (Integration)

- **Fields**
  - `id` (UUID)
  - `integrationSource` (string, required)
  - `externalPaymentId` (string, required)
  - `tripId` (UUID, optional FK -> Trip)
  - `rawPayload` (JSONB)
  - `amount` (numeric, optional, internal use only)
  - `currency` (string, optional)
  - `paymentDate` (timestamp, optional)
  - `status` (enum: `UNMATCHED`, `MATCHED`, `VERIFIED`, `FLAGGED`)
  - `matchedPassengerId` (UUID, nullable FK -> Passenger)
  - `verifiedByUserId` (string, optional, auth-proxy user id)
  - `verifiedAt` (timestamp, optional)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
- **Relationships**
  - Optional many-to-one with `Passenger` for active match
  - One-to-many with `PaymentAuditEvent`
  - One-to-many with `Flag`
- **Validation Rules**
  - Unique (`integrationSource`, `externalPaymentId`)
  - One payment active-match to at most one passenger at a time

## Entity: PaymentAuditEvent

- **Fields**
  - `id` (UUID)
  - `paymentRecordId` (UUID, FK -> PaymentRecord)
  - `eventType` (enum: `VERIFIED`, `MATCHED`, `REASSIGNED`, `UNMATCHED`, `FLAGGED`, `UNFLAGGED`)
  - `actorType` (enum: `INTERNAL_USER`, `SYSTEM`)
  - `actorId` (string, required for `INTERNAL_USER`)
  - `fromPassengerId` (UUID, nullable)
  - `toPassengerId` (UUID, nullable)
  - `reason` (string, optional but required for reassignment)
  - `occurredAt` (timestamp)
  - `metadata` (JSONB, optional)
- **Relationships**
  - Many-to-one with `PaymentRecord`
- **Validation Rules**
  - Immutable after insert
  - `reason` mandatory for `REASSIGNED`
  - `fromPassengerId` and `toPassengerId` cannot be equal for `REASSIGNED`

## Entity: ShareLink

- **Fields**
  - `id` (UUID)
  - `tokenHash` (string, unique, required)
  - `scopeType` (enum: `TRIP`, `SCHOOL`)
  - `tripId` (UUID, nullable FK -> Trip)
  - `schoolId` (UUID, nullable FK -> School)
  - `expiresAt` (timestamp, required)
  - `revokedAt` (timestamp, nullable)
  - `createdByUserId` (string, required)
  - `createdAt` (timestamp)
- **Relationships**
  - Optional many-to-one with `Trip` or `School` (exactly one required by scope)
- **Validation Rules**
  - For `TRIP`, `tripId` required and `schoolId` null
  - For `SCHOOL`, `schoolId` required and `tripId` null
  - `expiresAt > createdAt`
  - invalid when `revokedAt` is not null or current time > `expiresAt`

## Entity: Flag

- **Fields**
  - `id` (UUID)
  - `targetType` (enum: `PASSENGER`, `PAYMENT_RECORD`)
  - `targetId` (UUID, required)
  - `reason` (string, required)
  - `status` (enum: `OPEN`, `RESOLVED`)
  - `createdByUserId` (string, required)
  - `resolvedByUserId` (string, nullable)
  - `createdAt` (timestamp)
  - `resolvedAt` (timestamp, nullable)
- **Relationships**
  - Polymorphic relation to `Passenger` or `PaymentRecord`
- **Validation Rules**
  - `reason` min length 3
  - `resolvedAt` required when `status=RESOLVED`

## Read Models (CQRS Queries)

- `TripPassengerStatusView`
  - Trip metadata + passenger list with `paymentStatus`, `documentStatus`, and `isFlagged`
- `SchoolTripsPendingSummaryView`
  - Trip-first grouping for school share links with counts and per-passenger status-only rows
- `ReconciliationQueueView`
  - Unmatched/flagged/under-review payment records with linkage suggestions

## State Transitions

### PaymentRecord status transitions

- `UNMATCHED -> MATCHED` (manual or automatic association)
- `MATCHED -> VERIFIED` (staff verifies payment)
- `MATCHED|VERIFIED -> FLAGGED` (issue found)
- `FLAGGED -> MATCHED|VERIFIED` (issue resolved)
- Reassignment: remains `MATCHED|VERIFIED`, but updates `matchedPassengerId` and emits immutable `REASSIGNED` audit event

### ShareLink validity transitions

- `ACTIVE` (created, not expired/revoked)
- `EXPIRED` (time-based invalidation)
- `REVOKED` (manual invalidation)
