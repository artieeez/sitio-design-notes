# Feature Specification: School Trip Payment & Passenger Status

**Feature Branch**: `001-school-trip-payments`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "I'm building an application for a tourism company that mainly works with schools. They already handle landing pages and checkouts elsewhere but need a place to control who already paid and who needs to pay. Trips are grouped by school and in each trip page expect a list of passengers with an indication if they already paid or not. It is also required that the Tourism Company staff can generate share links so the school staff can verify which student still have a pending action (paying or submiting documents). As the information from payment comes from an integration from elsewhere, the tourism company staff should be able to verify those payments. They should be able to merge the information with a student in the list (if the integration failed to match their ids somehow) or flag a payment or student for later action."

## Clarifications

### Session 2026-03-30

- Q: What share-link scopes are supported for school staff views? → A: **Option C** — support both **trip-scoped** and **school-scoped** read-only links.
- Q: What payment detail can school staff see via share links? → A: **Option A** — status-only visibility (paid/pending/document-pending/flag), with no monetary amounts or transaction-level details.
- Q: How should school-scoped links present multi-trip data? → A: **Option B** — trip-first navigation (select/group by trip before listing students).
- Q: How should share-link expiration be defined? → A: **Option B** — staff select expiration per link from allowed options, with a secure default.
- Q: Can staff correct a wrong payment merge later? → A: **Option B** — reassignment is allowed only with audit trail (who/when/from/to/reason).

### Session 2026-03-30 (roster & payments intake)

- **Passenger roster**: Tourism company staff load trip passengers primarily via **CSV or Excel import**; **manual single-passenger** registration is also supported for exceptions (e.g. one late traveler). Imports use **all-or-nothing** validation (one bad row blocks the whole file) with **clear errors** and an in-app **format help** section.
- **Payments**: Integration-sourced payments remain the default; staff may **manually register a single payment** when needed. When a payment cannot auto-merge to an existing passenger, staff may **create a passenger from payment fields** while verifying or accepting the payment as valid.

## User Scenarios & Testing *(mandatory)*

### Automated verification *(required)*

Delivery MUST include automated tests as defined in `plan.md`: **Vitest** and **React Testing Library** for `sitio-dashboard`; **Jest** and **Supertest** for `sitio-backend`. Bruno collections supplement manual and contract checks but do not replace automated suites. A user story is not complete until its listed automated test tasks in `tasks.md` pass in local runs or CI per `quickstart.md`.

### User Story 1 - View trips by school and passenger payment status (Priority: P1)

Tourism company staff open the application, see trips organized by school, open a trip, and see every passenger on that trip with a clear indication of whether each passenger has completed payment and whether any other required action (such as document submission) is still pending. Staff **populate the roster** for a trip using **CSV or Excel import** and/or **manual registration of a single passenger** when appropriate.

**Why this priority**: This is the core operational need: knowing who has paid and who still owes payment or other steps, without using landing pages or checkout systems.

**Independent Test**: With sample schools, trips, and passengers (including at least one successful import and one manual add), a tester can confirm that lists match expectations and statuses are visible without using share links or payment integration tools.

**Acceptance Scenarios**:

1. **Given** at least one school with trips and passengers, **When** staff view the school’s trips, **Then** they see trips grouped or filtered so it is obvious which trip belongs to which school.
2. **Given** a selected trip, **When** staff open the trip detail, **Then** they see a passenger list where each passenger shows payment status (paid vs not paid) and any separate pending action relevant to that passenger (e.g., document submission still required).
3. **Given** a passenger who has fully completed payment and required submissions, **When** staff view that passenger on the trip, **Then** no payment or document-pending indicator suggests further action for that item.
4. **Given** a CSV or Excel file for a trip’s roster, **When** staff run validation or commit, **Then** the system previews rows; **if any row fails validation, the entire import is rejected** (no partial roster writes), staff see **which rows failed and a clear explanation** of each error, and a **summary message** that the import did not apply. **Given** staff open import help, **Then** they see how to format the file (columns, template, examples) and **common mistakes to avoid** (pt-BR copy).
5. **Given** staff need to add exactly one traveler not present in any import, **When** they use manual single-passenger registration for that trip, **Then** the new passenger appears on the trip list with the same status fields as other passengers.

---

### User Story 2 - Share links for school staff (Priority: P2)

Tourism company staff generate share links in two supported scopes: **trip-scoped** (single trip) and **school-scoped** (multiple trips of one school). School staff open the link and see which students still have pending actions (payment and/or document submission) for the authorized scope, without needing access to internal tourism systems beyond that link.

**Why this priority**: Schools need transparency on outstanding items; this reduces back-and-forth and aligns with how schools coordinate with families.

**Independent Test**: A tester can create one trip-scoped link and one school-scoped link, open each in a separate session (or device), and confirm each view exposes only pending-action data for its intended scope, without performing integration or merge workflows.

**Acceptance Scenarios**:

1. **Given** a trip with known pending and completed passengers, **When** tourism staff generate a **trip-scoped** share link, **Then** they receive a link they can copy and send to school staff.
2. **Given** a school with multiple trips, **When** tourism staff generate a **school-scoped** share link, **Then** school staff can see pending actions for students in that school scope and not for other schools.
3. **Given** a valid share link, **When** school staff open it, **Then** they see a read-only, **status-only** view listing students (or passengers) and what is still pending for each, consistent with internal status rules for that link scope and without payment amount or transaction details.
4. **Given** an invalid, expired, or revoked share link, **When** someone opens it, **Then** they do not see passenger details and see a clear message that access is unavailable.
5. **Given** a valid **school-scoped** share link, **When** school staff open it, **Then** they first navigate by trip (selection or grouped trip sections) before drilling into passenger-level pending statuses.
6. **Given** tourism staff creating a share link, **When** they set expiration, **Then** they choose from allowed durations (with a secure default), and after expiry the link denies access until a new link is issued.

---

### User Story 3 - Verify integration payments and reconcile to passengers (Priority: P3)

Tourism company staff see payment information arriving from the external integration, confirm or adjust how those records apply to travelers, manually associate an unmatched payment with the correct passenger when identifiers failed to match, **create a new passenger from payment information when no suitable passenger exists or auto-merge is impossible**, **register a one-off payment manually** when no integration row exists yet, and flag a payment or passenger for follow-up when something cannot be resolved immediately.

**Why this priority**: Automated matching will not always work; operations need control so passenger lists and paid status stay trustworthy.

**Independent Test**: With mocked or test integration data including unmatched payments, staff can complete merge, **create-passenger-from-payment**, **manual payment entry**, and flag flows and see the trip passenger list update accordingly.

**Acceptance Scenarios**:

1. **Given** payment records synced from the integration, **When** staff open the reconciliation or payment review area, **Then** they can see which records are matched to passengers and which are not.
2. **Given** an unmatched payment and a passenger on a trip, **When** staff explicitly link the payment to that passenger, **Then** that passenger’s paid status (and related indicators) reflect the payment without duplicating the same payment onto another passenger incorrectly.
3. **Given** a suspicious or unclear payment or passenger situation, **When** staff flag it for later action, **Then** the item appears in a way staff can find later (e.g., a list or filter) with enough context to resume work.
4. **Given** staff verify a payment as correct against the integration, **When** they confirm verification, **Then** the system records that verification in a way that supports audits and reduces duplicate work.
5. **Given** a payment was linked to the wrong passenger, **When** authorized staff reassign it to the correct passenger, **Then** the system updates paid-status outcomes accordingly and records an immutable audit event (who/when/from/to/reason).
6. **Given** an unmatched payment and **no** matching passenger on the trip (e.g. roster import not done or identifiers insufficient for auto-merge), **When** staff verify or accept the payment as valid and choose to **create a passenger from the payment**, **Then** the system creates the passenger on the selected trip, links the payment to that passenger, and records audit entries for both actions.
7. **Given** staff need to record a payment that does not exist as an integration row, **When** they use **manual single-payment registration** for a trip (with required fields), **Then** the payment appears in reconciliation like other payment records and can be matched, verified, or reassigned under the same rules, with origin marked as manual in audit metadata.

---

### Edge Cases

- Import file has malformed rows, duplicates, or columns that do not map to the template: **the import does not commit any rows** until the file passes validation; staff see **per-row error detail** and a **clear summary** that the whole import was blocked; they can use the **in-app help** (format, examples, common mistakes) to fix the file and retry.
- Integration sends a duplicate payment for the same passenger: staff can identify duplicates and avoid double-counting paid status.
- Payment arrives before the passenger exists on the trip list: unmatched payment remains **visible in reconciliation** until staff **merge** it to a passenger or complete **create-passenger-from-payment**. **Dismiss or archive** of an unmatched row is **not required in the first release**; if added later, it MUST be an explicit staff action with **audit metadata** (document in API / data model).
- School staff share link is shared widely: content is limited to what is appropriate for schools (status-only pending signals; no internal-only financial detail, no payment amounts, and no transaction-level references), and the exposed records remain constrained to the link scope (trip or school).
- Trip or passenger is cancelled or removed after a payment was matched: status and history remain understandable for staff (no orphaned confusing states without explanation).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST let tourism company staff navigate from schools to trips and open a trip that shows all passengers for that trip.
- **FR-002**: For each passenger on a trip, the system MUST show whether payment is recorded as paid or not yet paid, and MUST show whether required non-payment actions (e.g., document submission) are still pending when such requirements exist for that trip.
- **FR-003**: The system MUST allow tourism company staff to create two share-link scopes for school visibility: **trip-scoped** (single trip) and **school-scoped** (multiple trips for one school), both read-only and without internal staff navigation access.
- **FR-004**: Views reachable via share links MUST be read-only for school staff: they MUST NOT change payment records, merge payments, or edit internal flags through that channel.
- **FR-005**: The system MUST ingest or display payment-related information that originates from the external integration **or from manual staff entry (FR-018)** so tourism staff can review it alongside passenger records.
- **FR-006**: Tourism company staff MUST be able to manually associate an unmatched integration payment with a specific passenger on a trip when automatic matching failed or was wrong.
- **FR-007**: Tourism company staff MUST be able to flag a payment record and/or a passenger for follow-up, and MUST be able to find and review flagged items later.
- **FR-008**: Tourism company staff MUST be able to record verification of a payment (e.g., confirmed against the integration) so the organization can tell which items were reviewed.
- **FR-009**: The system MUST prevent applying the same integration payment to more than one passenger in a way that double-counts paid status, or MUST surface a clear conflict if staff attempt inconsistent assignments.
- **FR-010**: Invalid, expired, or revoked share links MUST NOT reveal passenger or payment details and MUST present a clear access-denied or unavailable message.
- **FR-011**: For any share link, the system MUST enforce scope boundaries: a trip-scoped link exposes only that trip; a school-scoped link exposes only trips for that school; neither scope may expose records from another school.
- **FR-012**: School-facing share-link views MUST be **status-only** for payment: they may show whether payment is complete, pending, under review, or flagged for follow-up, but MUST NOT show payment amounts, methods, transaction identifiers, payer account data, or reconciliation internals.
- **FR-013**: For **school-scoped** links, the read-only view MUST use **trip-first navigation** (trip grouping or explicit trip selection) before showing passenger rows, to avoid mixing students from different trips in an unstructured list.
- **FR-014**: Share links MUST have an expiration configured at creation time by staff from an allowed option set (configured by policy) with a secure default preselected; expired links MUST behave as invalid until renewed or replaced.
- **FR-015**: Authorized tourism staff MUST be able to **reassign** a previously merged payment to a different passenger when a mismatch is identified; every reassignment MUST capture an immutable audit record including actor, timestamp, previous passenger, new passenger, and reason.
- **FR-016**: Tourism company staff MUST be able to **import passengers for a trip** from a **CSV or Excel** file. The system MUST support a defined column mapping (or downloadable template), **validation** and **preview** before commit, and **all-or-nothing semantics**: **if any row fails validation, the import MUST NOT persist any passengers from that attempt** (no partial application). Staff MUST see **row-level error messages** identifying failing rows and the reason each row was rejected, plus a **concise summary** stating that the import was blocked and did not change the roster. The import experience MUST include an **in-app help section** (e.g. collapsible panel, modal, or dedicated tab) visible from the import flow, written in **pt-BR**, that explains **required columns and order**, **acceptable file types**, **example rows**, and **common mistakes to avoid** (e.g. wrong separators, merged cells, missing headers, duplicate keys in the same file).
- **FR-017**: Tourism company staff MUST be able to **manually register a single passenger** on a trip without using a file import.
- **FR-018**: Tourism company staff MUST be able to **manually register a single payment record** (e.g. when no integration row exists yet), with the same reconciliation lifecycle as integration-sourced payments and **audit metadata** indicating manual entry.
- **FR-019**: When automatic matching to an existing passenger is **not** possible—because the roster is incomplete, identifiers are insufficient, or the payment is unmatched—staff MUST be able, while **verifying or accepting a payment as valid**, to **create a new passenger on the chosen trip** using payment-derived fields (plus any required staff input), and **link that payment** to the new passenger in one flow, with **immutable audit** for passenger creation and linkage.

### Key Entities *(include if feature involves data)*

- **School**: An educational institution the tourism company serves; groups trips for navigation.
- **Trip**: A defined travel offering for a school with a passenger roster.
- **Passenger**: A traveler on a trip (typically a student); holds payment and pending-action status for that trip. Passengers may be created via **file import**, **manual single registration**, or **create-from-payment** during reconciliation. **Terminology**: requirements use **passenger**; school-facing copy may say **student** where natural—the obligations are the same.
- **Payment record (integration)**: A payment event or row from the external system **or a manual staff entry**, possibly unmatched or matched to a passenger; manual rows MUST be distinguishable in audit/metadata from integration-sourced rows.
- **Payment reconciliation audit event**: Immutable log entry for verification, merge, unmerge/reassignment actions including who performed the action, when, affected records, and reason.
- **Share link**: A revocable or expirable access grant for school staff with one of two scopes: **trip-scoped** (single trip) or **school-scoped** (school-wide trips).
- **Flag / follow-up**: A marker on a payment or passenger that requires later staff attention.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tourism company staff can clearly see, on a trip’s passenger list, who is unpaid for payment and who still has a pending document (or other) action when trip data is complete.
- **SC-002**: School staff, using only an issued share link and a status-only view, can correctly name at least one **passenger** who still has a pending action on a trip in a usability test (e.g., 90% success on a scripted task). **Validation**: scripted steps, pass/fail definition, and participant count (or documented pilot threshold) are recorded in `quickstart.md` (Pre-release validation); Phase 6 tasks **T044** / **T062** include executing that script before release candidate.
- **SC-003**: For test cases with intentionally unmatched integration payments, staff complete manual merge to the correct passenger without creating duplicate “paid” outcomes for the same money, in 100% of controlled test scenarios.
- **SC-004**: Flagged payments or passengers are locatable by staff within one minute of returning to the application (findability test with labeled test data). **Validation**: the **entry screen** (where the clock starts), **labeled fixture identifiers**, and success criteria are recorded in `quickstart.md` (Pre-release validation); **T044** / **T062** include this findability run alongside SC-002.

## Assumptions

- Landing pages and checkout remain out of scope; this product only coordinates status, reconciliation, and read-only school visibility—not taking payments here.
- “Tourism company staff” are authenticated internal users; “school staff” rely on share links (or similar) without requiring the same internal accounts, unless a future phase adds school logins.
- Which document types are required per trip is configurable or defined elsewhere; this specification only requires showing pending document action when the business rules say it applies.
- The external payment integration provides enough fields for staff to verify amounts and references; exact fields are defined at implementation time.
- **CSV/Excel import**: Accepted file types (e.g. `.csv`, `.xlsx`), maximum size, and column template are defined at implementation time; **validation is all-or-nothing** (see FR-016). Operator-facing **help copy** in the UI supplements downloadable templates.
- **Manual payment entry**: Required fields (minimum to satisfy reconciliation and audit) are defined at implementation time and may align with integration `PaymentRecord` shape where applicable.
- **Unmatched payment without roster row**: First release keeps unmatched payments visible until merge or create-passenger-from-payment; dismiss/archive is optional/future (see Edge Cases).
