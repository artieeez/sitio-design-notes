# Data Model: 001-school-trip-payments

English technical artifact. User-facing labels are specified in `spec.md` (pt-BR).

## Entity overview

| Entity | Description |
|--------|-------------|
| **School** | Customer school; owns many trips; optional persisted **landing page URL** (`url`, FR-043); can be **deactivated** (FR-029). |
| **Trip** | Belongs to one school; default expected amount (BRL, 2 dp); optional persisted **landing page URL** (`url`, FR-043); can be **deactivated** (FR-030); owns many passengers. |
| **Passenger** | Belongs to one trip; name; optional CPF (FR-031/038); optional **parent/guardian** name, phone, email (FR-044); optional expected amount override; **manual paid-without-info** flag (FR-016/017); **soft-removed** flag (FR-035); derived **payment status** (FR-018). |
| **Payment** | Belongs to exactly one passenger (FR-015); amount BRL 2 dp; **date only** (FR-037); location; payer identity (FR-012–FR-014). |
| **Landing metadata** | Ephemeral or DTO-only: title, description, image URL, favicon URL from pasted URL (FR-005–FR-007) — not necessarily persisted as its own table. |

## School

| Field | Type | Rules |
|-------|------|--------|
| `id` | UUID (or cuid) | Primary key |
| `name` | string | Required |
| `url` | string (URI), nullable | Optional landing page URL used for metadata prefill and staff “open landing page” (FR-043); validate format when non-null |
| `active` | boolean | `true` by default; deactivation blocks **new** trips (FR-029) |
| Contact / marketing fields | strings, optional | As needed for UI (title, description, image, favicon from FR-005–FR-007) |
| `createdAt`, `updatedAt` | timestamptz | Standard audit |

**Relationships**: one-to-many **Trip**.

## Trip

| Field | Type | Rules |
|-------|------|--------|
| `id` | UUID | PK |
| `schoolId` | FK → School | Required |
| `url` | string (URI), nullable | Optional landing page URL (FR-043); same semantics as school `url` |
| `title`, `description`, `imageUrl`, `faviconUrl` | optional strings | From metadata or manual (FR-005–FR-007) |
| `defaultExpectedAmountMinor` | int (centavos) | Nullable if trip may have no default yet; BRL scale (FR-034) |
| `active` | boolean | Deactivation blocks **new** passengers (FR-030) |
| `createdAt`, `updatedAt` | timestamptz | |

**Relationships**: many-to-one **School**; one-to-many **Passenger**.

## Passenger

| Field | Type | Rules |
|-------|------|--------|
| `id` | UUID | PK |
| `tripId` | FK → Trip | Required |
| `fullName` | string | Required; normalized for duplicate **warning** (FR-032) |
| `cpfNormalized` | string, nullable | Unique among rows for same `tripId` where not null (include soft-removed, FR-031) |
| `parentName` | string, nullable | Optional parent/guardian display name (FR-044) |
| `parentPhoneNumber` | string, nullable | Optional; normalize consistently (e.g. Brazil) when non-empty (FR-044) |
| `parentEmail` | string, nullable | Optional; validate email format when non-empty (FR-044) |
| `expectedAmountOverrideMinor` | int, nullable | Overrides trip default for **this** passenger only (FR-028) |
| `manualPaidWithoutInfo` | boolean | When true, status **settled** with manual labeling (FR-016–FR-018) |
| `removedAt` | timestamptz, nullable | Soft-remove (FR-035); null = not removed |
| `createdAt`, `updatedAt` | timestamptz | |

**Indexes**: unique partial index on (`tripId`, `cpfNormalized`) where `cpfNormalized` is not null (and optionally where `removedAt` is null — **do not** use partial that excludes soft-removed if uniqueness must include removed passengers per FR-031).

**Relationships**: many-to-one **Trip**; one-to-many **Payment**.

## Payment

| Field | Type | Rules |
|-------|------|--------|
| `id` | UUID | PK |
| `passengerId` | FK → Passenger | Required; immutable on update (FR-015) |
| `amountMinor` | int | Required, > 0 per business rules (zero payments out of scope unless product changes) |
| `paidOn` | date | Date only; interpreted/displayed America/Sao_Paulo (FR-037) |
| `location` | string | Required (FR-014) |
| `payerIdentity` | string | Required (FR-014) |
| `createdAt`, `updatedAt` | timestamptz | |

**Rules**: Creating payment for **removed** passenger blocked (FR-035); read/update/delete allowed in trip context per FR-010.

## Derived: effective expected amount (per passenger)

Not a stored column unless materialized for reporting:

- If `passenger.expectedAmountOverrideMinor` is not null → use it.
- Else if `trip.defaultExpectedAmountMinor` is not null → use it.
- Else → no effective amount (status **unavailable** path, FR-018).

## Derived: payment status (per passenger)

Computed on read (or cached in query layer) per FR-018:

1. If `manualPaidWithoutInfo` → **settled (manual tag)**.
2. Else if effective expected exists and sum(payments.amountMinor) ≥ effective → **settled (payments)**.
3. Else if effective expected exists and sum < effective and at least one payment → **pending**.
4. Else if effective expected exists and no payments → **pending**.
5. Else if no effective expected and no payments and no manual tag → **unavailable**.

**Aggregates (FR-036)**: Default trip passenger list and counts use only passengers with `removedAt` null; “include removed” adds soft-removed rows back into list and aggregates.

## Validation rules (cross-cutting)

- **CPF**: When non-empty after normalize, validate Brazilian algorithm (FR-038); reject duplicates on same trip (FR-031).
- **Parent contact (FR-044)**: When `parentEmail` is non-empty, require valid email; when `parentPhoneNumber` is non-empty, apply agreed phone normalization; `parentName` is free text. None of these participate in duplicate-passenger logic.
- **Name duplicate**: Same trip, normalized full name match, and FR-031 does not apply → **warning + confirm** before commit (FR-032); backend may accept a header or `confirmNameDuplicate: true` on write DTO.
- **Money**: Half-up rounding to centavos on input; all sums in integer minor units (FR-034).
- **Logging**: Never log raw CPF (FR-039).

## State transitions

- **School/Trip**: `active` false hides from default lists; existing children remain readable.
- **Passenger**: `removedAt` set → hidden from default roster; restore clears `removedAt`.
- **Payments**: CUD triggers status recalculation for that passenger (FR-020).
