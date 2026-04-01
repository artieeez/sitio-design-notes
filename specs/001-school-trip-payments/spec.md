# Feature Specification: School Trip Pending Payments Dashboard

**Feature Branch**: `001-school-trip-payments`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: User description: "We are creating a dashboard for a tourism company to control which passengers have payment pending. This tourism company mainly works with schools. The tourism company staff should be able to register a school, register a trip for a school and register passengers for the trip and register payments (that may or may not be linked to a passenger). Authentication is out of scope for this spec. Any payment integration is out of scope for this spec (there should only be a CRUD for manual interaction). Payment creation should be accessible both from the payment list and from individual passengers in the passengers table."  
**Target Repositories**: `../sitio-dashboard` (user flows and UI), `../sitio-backend` (business rules and data persistence)

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

---

### User Story 2 - Record manual payments in simplified or detailed mode (Priority: P2)

As tourism company staff, I can create, edit, and delete manual payment records either from the global payment list or from an individual passenger row, using either a simplified flow (quick register to passenger) or a detailed flow (full payment information), so that payment information can be maintained with the right level of speed and detail.

**Why this priority**: Staff must be able to keep payment records updated quickly during day-to-day operations; two entry points plus two data-entry modes reduce friction and support both fast and complete recording.

**Independent Test**: Can be fully tested by creating one payment using the simplified flow and one payment using the detailed flow from each entry point, then updating and deleting records.

**Acceptance Scenarios**:

1. **Given** a trip with passengers, **When** staff creates a payment from the payment list using simplified flow, **Then** the payment is saved linked to the selected passenger with minimum required data.
2. **Given** a passenger in the passenger table, **When** staff creates a payment from that passenger context using simplified flow, **Then** the payment is saved linked to that passenger.
3. **Given** any payment creation entry point, **When** staff chooses detailed flow, **Then** the system captures payment location, amount, partial payment indicator, and payer identity.
4. **Given** an existing payment, **When** staff edits or deletes the payment, **Then** the changes are reflected immediately in the payment list and related passenger context (if linked).

---

### User Story 3 - Monitor pending payment status (Priority: P3)

As tourism company staff, I can identify which passengers still have pending payment so that I can follow up with schools and families before trip deadlines.

**Why this priority**: This is the main business outcome, but it depends on data and payment records already being available.

**Independent Test**: Can be fully tested by registering passengers, recording partial/no payments, and verifying pending status updates correctly.

**Acceptance Scenarios**:

1. **Given** passengers with and without sufficient payment records, **When** staff views the passenger list for a trip, **Then** each passenger's payment status clearly shows pending or settled.
2. **Given** a passenger previously marked as pending, **When** staff registers additional manual payment that completes the required amount, **Then** the passenger status changes from pending to settled.

---

### Edge Cases

- A payment is created without linking it to a passenger; the system still stores it and marks it as unlinked so staff can reconcile later.
- Staff starts in simplified flow but needs more information; system must allow switching to detailed flow before saving without losing already entered data.
- A passenger has multiple partial payments; status remains pending until cumulative recorded amount reaches the expected amount.
- A payment linked to a passenger is deleted; passenger status is recalculated and may return to pending.
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
- **FR-009**: System MUST provide a passenger table within each trip context that shows each passenger's payment status.
- **FR-010**: System MUST allow staff to create, view, update, and delete manual payment records from a centralized payment list.
- **FR-011**: System MUST allow staff to create manual payment records directly from an individual passenger entry in the passenger table.
- **FR-012**: System MUST provide a simplified payment creation flow whose purpose is only to register a payment to a passenger with minimum required information.
- **FR-013**: System MUST provide a detailed payment creation flow that captures payment location, payment amount, whether it is partial payment, and payer identity.
- **FR-014**: System MUST allow payments to be recorded either linked to a passenger or unlinked.
- **FR-015**: System MUST recalculate passenger pending/settled status whenever related payment records are created, updated, deleted, linked, or unlinked.
- **FR-016**: System MUST present unlinked payments in a dedicated identifiable state so staff can review and reconcile them.
- **FR-017**: System MUST treat authentication and user sign-in behavior as out of scope for this feature.
- **FR-018**: System MUST treat external payment gateway processing and financial transaction integration as out of scope for this feature.
- **FR-019**: System MUST keep user-facing interface copy in Brazilian Portuguese (`pt-BR`).
- **FR-020**: System MUST keep source code and technical specification artifacts in English.
- **FR-021**: Specification MUST split implementation scope across `../sitio-dashboard` and `../sitio-backend` repositories.

### Key Entities *(include if feature involves data)*

- **School**: Educational institution customer; key business identity and contact attributes; parent entity for trips.
- **Trip**: Travel operation associated with one school; includes planning details and operational dates; parent entity for passengers.
- **Landing Page Metadata**: Structured public page information (title, description, image, favicon) used to pre-fill school and trip forms from a pasted URL.
- **Passenger**: Student or participant assigned to one trip; carries identifying information and a derived payment status.
- **Payment**: Manual financial record that may optionally reference one passenger and includes amount, date, payment location, partial payment indicator, and payer identity.
- **Payment Status**: Derived state per passenger (pending or settled) based on expected amount versus total linked recorded payments.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Staff can register a new school, trip, and at least one passenger in under 6 minutes in usability testing.
- **SC-002**: In 90% of tests with valid landing page URLs, school and trip forms auto-fill title, description, image, and favicon in under 5 seconds.
- **SC-003**: 95% of payment records are successfully created on first attempt by staff during pilot usage.
- **SC-004**: Staff can create a payment from either entry point (payment list or passenger table) in 3 clicks/actions or fewer after opening the relevant screen.
- **SC-005**: In usability testing, 90% of staff complete simplified payment registration for a passenger in under 20 seconds.
- **SC-006**: For test datasets, 100% of passengers display the correct pending/settled status after payment create, update, and delete operations.
- **SC-007**: At least 90% of pilot users report that identifying pending passengers is clear without additional training.
- **SC-008**: Operational follow-up time to identify pending passengers is reduced by at least 40% compared with the current manual process.

## Assumptions

- Tourism company staff are internal users who already have access to the system through an existing access control process outside this feature scope.
- Each passenger has an expected payable amount available in trip operations data or can be defined in existing business process inputs.
- A trip is always associated with one school, and a passenger is always associated with one trip.
- Manual payment records are entered based on offline confirmations (cash, transfer, or other external methods) and do not require automated verification.
- Initial release targets web dashboard usage by staff; mobile-specific workflows are out of scope.
- School and trip landing pages usually expose metadata fields that can be consumed for form pre-fill; when unavailable, manual entry remains the default fallback.
