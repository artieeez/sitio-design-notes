# Feature Specification: School Trip Pending Payments Dashboard

**Feature Branch**: `001-school-trip-payments`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: User description: "We are creating a dashboard for a tourism company to control which passengers have payment pending. This tourism company mainly works with schools. The tourism company staff should be able to register a school, register a trip for a school and register passengers for the trip and register payments (that may or may not be linked to a passenger). Authentication is out of scope for this spec. Any payment integration is out of scope for this spec (there should only be a CRUD for manual interaction). Payment creation should be accessible both from the payment list and from individual passengers in the passengers table."  
**Target Repositories**: `../sitio-dashboard` (user flows and UI), `../sitio-backend` (business rules and data persistence)

## Clarifications

### Session 2026-04-01

- Q: Where is the expected payable amount defined for comparing recorded payments to decide pending vs settled? → A: Trip defines a default expected amount; each passenger may override that amount for their own status calculation (option B).
- Q: What is required in the simplified payment flow, and how is partial payment represented? → A: (Superseded by Session 2026-04-02) Previously: optional fields and no-amount attestation via payment record; product direction changed to separate flows.

### Session 2026-04-02

- Q: Should “mark paid without payment details” stay inside payment creation? → A: No. Drop the “simplified payment” notion. Every **payment record** MUST include a monetary amount (prefilled from the effective expected amount when applicable) plus the other standard payment fields. The shortcut to mark a passenger paid without creating a payment entry is a **separate action** on the passenger list, with user-facing wording equivalent to **“Manually tagged as paid without payment information”** (implemented in Brazilian Portuguese per FR-019).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register core trip data (Priority: P1)

As tourism company staff, I can register a school, create a trip under that school, and register passengers for that trip so that I can maintain the operational basis needed to track pending payments.

**Why this priority**: Payment control is not possible unless schools, trips, and passengers exist in the system first.

**Independent Test**: Can be fully tested by creating one school, one trip for that school, and multiple passengers, then verifying all records are visible and correctly related.

**Acceptance Scenarios**:

1. **Given** no school exists yet, **When** staff registers a school with required information, **Then** the school is saved and can be selected for trip registration.
2. **Given** a registered school, **When** staff registers a trip linked to that school, **Then** the trip is saved and listed under that school.
3. **Given** a registered trip, **When** staff registers passengers for that trip, **Then** passengers are saved and displayed in that trip's passenger table.
4. **Given** staff starts school or trip creation with a landing page URL, **When** the system reads that URL metadata, **Then** title, description, image, and favicon are auto-filled and remain editable before save.
5. **Given** a registered trip with a default expected payment amount, **When** staff adds a passenger without an individual override, **Then** that passenger's pending or settled status is evaluated against the trip default.
6. **Given** a trip with a default expected payment amount, **When** staff sets a different expected amount on one passenger, **Then** that passenger's status is evaluated against the passenger-specific amount and other passengers keep using the trip default unless they also have overrides.

---

### User Story 2 - Record manual payments with required amount and context (Priority: P2)

As tourism company staff, I can create, edit, and delete manual payment records from the centralized payment list or from a passenger row, with a monetary amount and the other standard payment fields always required, so that every payment row represents a complete operational record.

**Why this priority**: Staff need consistent payment data for audits and reconciliation; separating the “quick paid” shortcut from real payments avoids ambiguous records.

**Independent Test**: Can be fully tested by creating one payment from the payment list and one from a passenger row, confirming amount pre-fill where applicable, editing, and deleting.

**Acceptance Scenarios**:

1. **Given** a trip with passengers and defined effective expected amounts, **When** staff starts payment creation linked to a passenger, **Then** the amount field is pre-filled with that passenger's effective expected amount and staff must confirm or adjust before save.
2. **Given** payment creation (linked or unlinked), **When** staff tries to save without a monetary amount or without the other required payment fields, **Then** the system blocks save and indicates what is missing.
3. **Given** any payment creation entry point, **When** staff completes a valid payment, **Then** the system stores payment date, payment location, payer identity, and monetary amount together with the payment.
4. **Given** an existing payment, **When** staff edits or deletes the payment, **Then** the changes are reflected immediately in the payment list and related passenger context (if linked).

---

### User Story 3 - Mark passenger paid without a payment record (Priority: P2)

As tourism company staff, I can mark a passenger as paid from the passenger list **without** creating a payment entry when operational reality does not require a detailed payment row, while the interface makes it obvious that this was a manual tag without payment information.

**Why this priority**: Preserves a practical shortcut without weakening the integrity of the payment ledger.

**Independent Test**: Can be fully tested by toggling the manual tag on and off for a passenger and observing status and labeling versus passengers settled only through payment totals.

**Acceptance Scenarios**:

1. **Given** a passenger in the trip passenger table, **When** staff chooses the action to mark paid without payment information, **Then** the passenger is treated as **settled** and the passenger row shows wording equivalent to **“Manually tagged as paid without payment information”** (in Brazilian Portuguese in the product UI).
2. **Given** a passenger already marked via that manual tag, **When** staff clears the tag, **Then** the passenger's status is recalculated from linked payment amounts and effective expected amount per the standard rules.
3. **Given** a passenger with the manual tag active, **When** staff views the passenger list, **Then** the tag state is visually distinct from passengers who are settled solely through recorded payments.

---

### User Story 4 - Monitor pending payment status (Priority: P3)

As tourism company staff, I can identify which passengers still have pending payment so that I can follow up with schools and families before trip deadlines.

**Why this priority**: This is the main business outcome, but it depends on data, payment records, and optional manual tags being modeled clearly.

**Independent Test**: Can be fully tested by registering passengers, recording payments above and below the effective expected amount, applying and removing manual tags, and verifying pending, settled, and unavailable states.

**Acceptance Scenarios**:

1. **Given** passengers with different combinations of payments and manual tags, **When** staff views the passenger list for a trip, **Then** each passenger's status clearly shows **pending**, **settled** (via payments or via manual tag, distinguishable), or **unavailable** per the status rules.
2. **Given** a passenger in **pending** because cumulative payment amounts are below the effective expected amount and no manual tag is active, **When** staff registers further linked payments so cumulative amounts meet or exceed the effective expected amount, **Then** the passenger status becomes **settled** through payments alone.

---

### Edge Cases

- A payment is created without linking it to a passenger; the system still stores it and marks it as unlinked so staff can reconcile later; amount and other required payment fields still apply.
- A passenger has multiple payments below the effective expected amount; status remains **pending** until cumulative amounts meet or exceed it (implicit partial progress while **pending**).
- Trip default expected amount changes after passengers and payments exist; system recalculates each passenger's status using current effective expected amounts and active manual tags.
- Neither trip default nor passenger override defines an expected amount, the passenger has no linked payments, and no manual paid-without-info tag; automated numeric status is **unavailable** until staff supplies an expected amount, records payments, or applies the manual tag.
- A payment linked to a passenger is deleted; passenger status is recalculated and may return to **pending** unless a manual paid-without-info tag keeps them **settled**.
- Staff applies manual paid-without-info tag while payments exist that would otherwise imply **pending**; passenger remains **settled** with the manual-tag labeling until staff clears the tag or adjusts payments/tags consistently.
- Effective expected amount is missing at payment creation time; amount field is not pre-filled and staff must enter a valid amount to save.
- Staff tries to register a trip without selecting a school; the system blocks save and explains missing required data.
- Staff tries to create duplicate passenger records in the same trip (same identifying data); the system warns and prevents accidental duplication.
- Provided landing page URL is invalid, unreachable, or has no metadata; system allows manual completion of form without blocking record creation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow staff to create, view, update, and deactivate school records.
- **FR-002**: System MUST allow staff to create, view, update, and deactivate trip records linked to exactly one school.
- **FR-003**: System MUST allow school creation flow to optionally start with a landing page URL as the first input.
- **FR-004**: System MUST allow trip creation flow to optionally start with a landing page URL as the first input.
- **FR-005**: When a landing page URL is provided for school or trip creation, system MUST attempt to auto-fill title, description, image, and favicon fields.
- **FR-006**: Auto-filled school or trip metadata fields MUST remain editable by staff before saving.
- **FR-007**: If URL metadata retrieval fails or returns incomplete data, system MUST inform staff and allow manual field completion without blocking save.
- **FR-008**: System MUST allow staff to create, view, update, and remove passenger records linked to exactly one trip.
- **FR-009**: System MUST provide a passenger table within each trip context that shows each passenger's payment status and distinguishes settlement via recorded payments versus manual paid-without-info tagging.
- **FR-010**: System MUST allow staff to create, view, update, and delete manual payment records from a centralized payment list.
- **FR-011**: System MUST allow staff to create manual payment records directly from an individual passenger entry in the passenger table.
- **FR-012**: System MUST require a monetary amount on every payment record before save; partial progress MUST NOT be represented by a separate “partial payment” field—**pending** implies incomplete payment relative to the effective expected amount when numeric rules apply.
- **FR-013**: When staff creates a payment linked to a passenger, system MUST pre-fill the amount field with that passenger's effective expected amount when that value exists; staff MUST be able to change the amount before save.
- **FR-014**: System MUST require payment date, payment location, and payer identity on every payment record in addition to the monetary amount.
- **FR-015**: System MUST allow payments to be recorded either linked to a passenger or unlinked; for unlinked payments, pre-fill of amount from a passenger context does not apply.
- **FR-016**: System MUST provide, on the passenger list for a trip, an action to mark a passenger as paid **without** creating a payment record, and MUST label that state with user-facing copy equivalent to **“Manually tagged as paid without payment information”** (Brazilian Portuguese in the product).
- **FR-017**: System MUST allow staff to clear the manual paid-without-info tag on a passenger; clearing MUST trigger recalculation of status from payments and effective expected amount.
- **FR-018**: System MUST derive each passenger's payment status as follows: (a) If the manual paid-without-info tag is active, the passenger MUST be **settled** and MUST display the manual-tag labeling. (b) If the tag is not active, an effective expected amount exists, and linked payments exist, the passenger MUST be **pending** when cumulative payment amounts are below the effective expected amount and **settled** when cumulative meets or exceeds it. (c) If the tag is not active, an effective expected amount exists, and there are no linked payments, the passenger MUST be **pending**. (d) If the tag is not active, no effective expected amount exists, and there are no linked payments, status MUST be **unavailable** until staff supplies an expected amount, records payments, or applies the manual tag.
- **FR-019**: When the trip default expected amount changes, system MUST recalculate payment status for all passengers on that trip per FR-018.
- **FR-020**: System MUST recalculate passenger status whenever linked payment records are created, updated, deleted, linked, or unlinked, or when the manual paid-without-info tag is toggled.
- **FR-021**: System MUST present unlinked payments in a dedicated identifiable state so staff can review and reconcile them.
- **FR-022**: System MUST treat authentication and user sign-in behavior as out of scope for this feature.
- **FR-023**: System MUST treat external payment gateway processing and financial transaction integration as out of scope for this feature.
- **FR-024**: System MUST keep user-facing interface copy in Brazilian Portuguese (`pt-BR`).
- **FR-025**: System MUST keep source code and technical specification artifacts in English.
- **FR-026**: Specification MUST split implementation scope across `../sitio-dashboard` and `../sitio-backend` repositories.
- **FR-027**: System MUST allow staff to set and update a default expected payment amount on each trip used as the baseline for passenger payment status unless a passenger has an override.
- **FR-028**: System MUST allow staff to optionally set an expected payment amount on a passenger that overrides the trip default for that passenger's pending/settled calculation only.

### Key Entities *(include if feature involves data)*

- **School**: Educational institution customer; key business identity and contact attributes; parent entity for trips.
- **Trip**: Travel operation associated with one school; includes planning details, operational dates, and a default expected payment amount for passengers; parent entity for passengers.
- **Landing Page Metadata**: Structured public page information (title, description, image, favicon) used to pre-fill school and trip forms from a pasted URL.
- **Passenger**: Student or participant assigned to one trip; carries identifying information, an optional expected payment amount override, an optional **manual paid-without-info** flag, and a derived payment status.
- **Payment**: Manual financial record with **required** monetary amount, payment date, payment location, and payer identity; may reference one passenger or be unlinked. No separate partial-payment flag; partial progress is implicit while cumulative amounts remain below the effective expected amount.
- **Payment Status**: Derived state per passenger (**pending**, **settled**, or **unavailable**) per FR-018, including whether **settled** is due to recorded payments or the manual paid-without-info tag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Staff can register a new school, trip, and at least one passenger in under 6 minutes in usability testing.
- **SC-002**: In 90% of tests with valid landing page URLs, school and trip forms auto-fill title, description, image, and favicon in under 5 seconds.
- **SC-003**: 95% of payment records are successfully created on first attempt by staff during pilot usage when required fields are known.
- **SC-004**: Staff can create a payment from either entry point (payment list or passenger table) in 3 clicks/actions or fewer after opening the relevant screen.
- **SC-005**: In usability testing, 90% of staff apply or clear the manual paid-without-info tag for a passenger in under 15 seconds.
- **SC-006**: For test datasets, 100% of passengers display the correct pending, settled (source distinguishable), or unavailable status after payment create, update, delete, and manual-tag toggles.
- **SC-007**: At least 90% of pilot users report that identifying pending passengers is clear without additional training.
- **SC-008**: Operational follow-up time to identify pending passengers is reduced by at least 40% compared with the current manual process.

## Assumptions

- Tourism company staff are internal users who already have access to the system through an existing access control process outside this feature scope.
- Each trip has a default expected payment amount staff maintain; passengers may optionally override that amount individually for status calculation.
- A trip is always associated with one school, and a passenger is always associated with one trip.
- Manual payment records are entered based on offline confirmations (cash, transfer, or other external methods) and do not require automated verification.
- Initial release targets web dashboard usage by staff; mobile-specific workflows are out of scope.
- School and trip landing pages usually expose metadata fields that can be consumed for form pre-fill; when unavailable, manual entry remains the default fallback.
- The product presents the manual-tag label in Brazilian Portuguese using wording equivalent in meaning to the English reference **“Manually tagged as paid without payment information.”**
