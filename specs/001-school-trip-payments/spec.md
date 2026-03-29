# Feature Specification: School Trip Payment & Passenger Status

**Feature Branch**: `001-school-trip-payments`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "I'm building an application for a tourism company that mainly works with schools. They already handle landing pages and checkouts elsewhere but need a place to control who already paid and who needs to pay. Trips are grouped by school and in each trip page expect a list of passengers with an indication if they already paid or not. It is also required that the Tourism Company staff can generate share links so the school staff can verify which student still have a pending action (paying or submiting documents). As the information from payment comes from an integration from elsewhere, the tourism company staff should be able to verify those payments. They should be able to merge the information with a student in the list (if the integration failed to match their ids somehow) or flag a payment or student for later action."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View trips by school and passenger payment status (Priority: P1)

Tourism company staff open the application, see trips organized by school, open a trip, and see every passenger on that trip with a clear indication of whether each passenger has completed payment and whether any other required action (such as document submission) is still pending.

**Why this priority**: This is the core operational need: knowing who has paid and who still owes payment or other steps, without using landing pages or checkout systems.

**Independent Test**: With sample schools, trips, and passengers, a tester can confirm that lists match expectations and statuses are visible without using share links or payment integration tools.

**Acceptance Scenarios**:

1. **Given** at least one school with trips and passengers, **When** staff view the school’s trips, **Then** they see trips grouped or filtered so it is obvious which trip belongs to which school.
2. **Given** a selected trip, **When** staff open the trip detail, **Then** they see a passenger list where each passenger shows payment status (paid vs not paid) and any separate pending action relevant to that passenger (e.g., document submission still required).
3. **Given** a passenger who has fully completed payment and required submissions, **When** staff view that passenger on the trip, **Then** no payment or document-pending indicator suggests further action for that item.

---

### User Story 2 - Share links for school staff (Priority: P2)

Tourism company staff generate a share link for a trip (or school/trip scope as appropriate) so school staff can open it and see which students still have pending actions (payment and/or document submission) without needing access to internal tourism systems beyond that link.

**Why this priority**: Schools need transparency on outstanding items; this reduces back-and-forth and aligns with how schools coordinate with families.

**Independent Test**: A tester can create a link, open it in a separate session (or device), and confirm the pending-action view matches what tourism staff expect for that scope, without performing integration or merge workflows.

**Acceptance Scenarios**:

1. **Given** a trip with known pending and completed passengers, **When** tourism staff generate a share link for that trip, **Then** they receive a link they can copy and send to school staff.
2. **Given** a valid share link, **When** school staff open it, **Then** they see a read-only view listing students (or passengers) and what is still pending for each, consistent with internal status rules for that trip.
3. **Given** an invalid, expired, or revoked share link, **When** someone opens it, **Then** they do not see passenger details and see a clear message that access is unavailable.

---

### User Story 3 - Verify integration payments and reconcile to passengers (Priority: P3)

Tourism company staff see payment information arriving from the external integration, confirm or adjust how those records apply to travelers, manually associate an unmatched payment with the correct passenger when identifiers failed to match, and flag a payment or passenger for follow-up when something cannot be resolved immediately.

**Why this priority**: Automated matching will not always work; operations need control so passenger lists and paid status stay trustworthy.

**Independent Test**: With mocked or test integration data including unmatched payments, staff can complete merge and flag flows and see the trip passenger list update accordingly.

**Acceptance Scenarios**:

1. **Given** payment records synced from the integration, **When** staff open the reconciliation or payment review area, **Then** they can see which records are matched to passengers and which are not.
2. **Given** an unmatched payment and a passenger on a trip, **When** staff explicitly link the payment to that passenger, **Then** that passenger’s paid status (and related indicators) reflect the payment without duplicating the same payment onto another passenger incorrectly.
3. **Given** a suspicious or unclear payment or passenger situation, **When** staff flag it for later action, **Then** the item appears in a way staff can find later (e.g., a list or filter) with enough context to resume work.
4. **Given** staff verify a payment as correct against the integration, **When** they confirm verification, **Then** the system records that verification in a way that supports audits and reduces duplicate work.

---

### Edge Cases

- Integration sends a duplicate payment for the same passenger: staff can identify duplicates and avoid double-counting paid status.
- Payment arrives before the passenger exists on the trip list: unmatched payment remains visible until merged or dismissed per policy.
- School staff share link is shared widely: content is limited to what is appropriate for schools (no internal-only financial detail beyond what is required for pending actions).
- Trip or passenger is cancelled or removed after a payment was matched: status and history remain understandable for staff (no orphaned confusing states without explanation).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST let tourism company staff navigate from schools to trips and open a trip that shows all passengers for that trip.
- **FR-002**: For each passenger on a trip, the system MUST show whether payment is recorded as paid or not yet paid, and MUST show whether required non-payment actions (e.g., document submission) are still pending when such requirements exist for that trip.
- **FR-003**: The system MUST allow tourism company staff to create at least one shareable access method per trip (or clearly defined scope) so school staff can view pending payment and document actions for passengers on that trip without using the internal staff navigation path.
- **FR-004**: Views reachable via share links MUST be read-only for school staff: they MUST NOT change payment records, merge payments, or edit internal flags through that channel.
- **FR-005**: The system MUST ingest or display payment-related information that originates from the external integration so tourism staff can review it alongside passenger records.
- **FR-006**: Tourism company staff MUST be able to manually associate an unmatched integration payment with a specific passenger on a trip when automatic matching failed or was wrong.
- **FR-007**: Tourism company staff MUST be able to flag a payment record and/or a passenger for follow-up, and MUST be able to find and review flagged items later.
- **FR-008**: Tourism company staff MUST be able to record verification of a payment (e.g., confirmed against the integration) so the organization can tell which items were reviewed.
- **FR-009**: The system MUST prevent applying the same integration payment to more than one passenger in a way that double-counts paid status, or MUST surface a clear conflict if staff attempt inconsistent assignments.
- **FR-010**: Invalid, expired, or revoked share links MUST NOT reveal passenger or payment details and MUST present a clear access-denied or unavailable message.

### Key Entities *(include if feature involves data)*

- **School**: An educational institution the tourism company serves; groups trips for navigation.
- **Trip**: A defined travel offering for a school with a passenger roster.
- **Passenger**: A traveler on a trip (typically a student); holds payment and pending-action status for that trip.
- **Payment record (integration)**: A payment event or row from the external system, possibly unmatched or matched to a passenger.
- **Share link**: A revocable or expirable access grant that exposes a limited pending-action view to school staff.
- **Flag / follow-up**: A marker on a payment or passenger that requires later staff attention.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tourism company staff can identify unpaid passengers and document-pending passengers for a trip in under two minutes for a typical trip size (e.g., up to 50 passengers) when data is complete.
- **SC-002**: School staff, using only a issued share link, can correctly name at least one student who still has a pending action on a trip in a usability test (e.g., 90% success on a scripted task).
- **SC-003**: For test cases with intentionally unmatched integration payments, staff complete manual merge to the correct passenger without creating duplicate “paid” outcomes for the same money, in 100% of controlled test scenarios.
- **SC-004**: Flagged payments or passengers are locatable by staff within one minute of returning to the application (findability test with labeled test data).

## Assumptions

- Landing pages and checkout remain out of scope; this product only coordinates status, reconciliation, and read-only school visibility—not taking payments here.
- “Tourism company staff” are authenticated internal users; “school staff” rely on share links (or similar) without requiring the same internal accounts, unless a future phase adds school logins.
- Which document types are required per trip is configurable or defined elsewhere; this specification only requires showing pending document action when the business rules say it applies.
- The external payment integration provides enough fields for staff to verify amounts and references; exact fields are defined at implementation time.
