# Feature Specification: School Trip Pending Payments Dashboard

**Feature Branch**: `001-school-trip-payments`  
**Created**: 2026-04-01  
**Status**: Draft  
**Input**: User description: "We are creating a dashboard for a tourism company to control which passengers have payment pending. This tourism company mainly works with schools. The tourism company staff should be able to register a school, register a trip for a school and register passengers for the trip and register payments (that may or may not be linked to a passenger). Authentication is out of scope for this spec. Any payment integration is out of scope for this spec (there should only be a CRUD for manual interaction). Payment creation should be accessible both from the payment list and from individual passengers in the passengers table."  
**Target Repositories**: `../sitio-dashboard` (user flows and UI), `../sitio-backend` (business rules and data persistence)

## Clarifications

### Session 2026-04-01

- Q: Where is the expected payable amount defined for comparing recorded payments to decide pending vs settled? → A: Trip defines a default expected amount; each passenger may override that amount for their own status calculation (option B).
- Q: When a school or trip is deactivated (FR-001, FR-002), how should the system treat linked trips, passengers, and payments? → A: Option A — deactivated schools and trips are **hidden from default lists** unless staff explicitly includes inactive records; **no new** trips under an inactive school and **no new** passengers under an inactive trip; existing passengers and payments remain **readable** when staff opens that trip’s context.
- Q: How should duplicate passengers on the same trip be detected? → A: **Blocking duplicate error** when **CPF** or **RG** matches another passenger on that trip (after normalization). **Full name** match alone: **warning** plus required **confirmation** before save; staff may cancel or confirm to proceed.
- Q: How should concurrent edits and stale saves be handled? → A: **Out of scope** — no stale-save detection, optimistic concurrency, or conflict-resolution UX; ordinary persistence behavior (e.g. last write wins) is acceptable.
- Q: Can a payment exist without being tied to a passenger? → A: **No.** Every payment MUST reference **exactly one passenger**; there are **no** unlinked payments (supersedes the original input phrase “may or may not be linked to a passenger”).
- Q: Should “mark paid without payment details” be part of payment creation? → A: **No.** Every **payment record** MUST include a monetary amount (prefilled from the effective expected amount when applicable) plus the other standard payment fields. Marking a passenger paid **without** creating a payment entry is a **separate action** on the passenger list, with user-facing wording equivalent to **“Manually tagged as paid without payment information”** (Brazilian Portuguese in the product; see FR-016).
- Q: How should monetary amounts be represented and compared for pending vs settled? → A: **Option A** — all amounts in **BRL**; store and compare using a **fixed scale of two decimal places** (e.g. integer cents or decimal with consistent rounding on input); passenger is **settled** via payments when cumulative amount **≥** effective expected amount at that scale (see FR-034).
- Q: When staff removes a passenger from a trip, what should happen to that passenger’s payment records? → A: **Option B** — **soft-remove** the passenger (hidden from default passenger lists); **payments remain** linked to that passenger for history and reporting (see FR-035).
- Q: Should soft-removed passengers appear in default pending/settled trip views and aggregates? → A: **Option A** — **default** passenger views and any **trip-level** pending/settled **aggregates** include **only non-removed** passengers; soft-removed passengers appear in the table and in aggregates **only** when staff opts to **include removed passengers** (see FR-036).
- Q: What precision and timezone should **payment date** use? → A: **Option A** — **date only** (calendar day, no time-of-day); canonical timezone **`America/Sao_Paulo`** for persistence and display (see FR-037).

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
7. **Given** a deactivated school that still has trips, **When** staff views default school lists, **Then** the school is hidden unless staff opts to include inactive schools; **When** staff tries to register a new trip for that school, **Then** the system blocks it; **When** staff navigates to an existing trip under that school, **Then** passengers and payments remain viewable.
8. **Given** a deactivated trip that has passengers, **When** staff views default trip lists for the school, **Then** the trip is hidden unless staff opts to include inactive trips; **When** staff tries to add a passenger to that trip, **Then** the system blocks it; **When** staff opens the trip, **Then** the passenger table and payments for those passengers remain viewable.
9. **Given** a passenger on a trip with a stored CPF or RG, **When** staff creates or updates another passenger on that trip with the same CPF or the same RG respectively (after normalization, both compared values non-empty), **Then** the system blocks save with a duplicate error.
10. **Given** a passenger on a trip, **When** staff creates another passenger with the same full name (normalized) but different CPF and RG, **Then** the system shows a warning and requires explicit confirmation before save completes.

---

### User Story 2 - Record manual payments with required amount and context (Priority: P2)

As tourism company staff, I can create, edit, and delete manual payment records from the centralized payment list or from a passenger row, with a monetary amount and the other standard payment fields always required, so that every payment row represents a complete operational record.

**Why this priority**: Staff need consistent payment data for audits and reconciliation; separating the “quick paid” shortcut from real payments avoids ambiguous records.

**Independent Test**: Can be fully tested by creating one payment from the payment list and one from a passenger row, confirming amount pre-fill where applicable, editing, and deleting.

**Acceptance Scenarios**:

1. **Given** a trip with passengers and defined effective expected amounts, **When** staff starts payment creation for a passenger (e.g. from that passenger’s row), **Then** the amount field is pre-filled with that passenger's effective expected amount and staff must confirm or adjust before save.
2. **Given** payment creation from any entry point, **When** staff tries to save without a passenger, without a monetary amount, or without the other required payment fields, **Then** the system blocks save and indicates what is missing.
3. **Given** any payment creation entry point, **When** staff completes a valid payment, **Then** the system stores a **calendar payment date** (no time-of-day), payment location, payer identity, and monetary amount together with the payment, with the date interpreted per **FR-037**.
4. **Given** an existing payment, **When** staff edits or deletes the payment, **Then** the changes are reflected immediately in the payment list and that passenger’s trip context.
5. **Given** a passenger who has been **soft-removed** from a trip but still has payments, **When** staff views the centralized payment list, **Then** those payments still appear with passenger, trip, and school context and indicate the passenger is **removed** (per FR-021 and FR-035; `pt-BR` labeling).

---

### User Story 3 - Mark passenger paid without a payment record (Priority: P2)

As tourism company staff, I can mark a passenger as paid from the passenger list **without** creating a payment entry when operational reality does not require a detailed payment row, while the interface makes it obvious that this was a manual tag without payment information.

**Why this priority**: Preserves a practical shortcut without weakening the integrity of the payment ledger.

**Independent Test**: Can be fully tested by toggling the manual tag on and off for a passenger and observing status and labeling versus passengers settled only through payment totals.

**Acceptance Scenarios**:

1. **Given** a passenger in the trip passenger table, **When** staff chooses the action to mark paid without payment information, **Then** the passenger is treated as **settled** and the passenger row shows wording equivalent to **“Manually tagged as paid without payment information”** (in Brazilian Portuguese in the product UI).
2. **Given** a passenger already marked via that manual tag, **When** staff clears the tag, **Then** the passenger's status is recalculated from that passenger’s recorded payment amounts and effective expected amount per the standard rules.
3. **Given** a passenger with the manual tag active, **When** staff views the passenger list, **Then** the tag state is visually distinct from passengers who are settled solely through recorded payments.

---

### User Story 4 - Monitor pending payment status (Priority: P3)

As tourism company staff, I can identify which passengers still have pending payment so that I can follow up with schools and families before trip deadlines.

**Why this priority**: This is the main business outcome, but it depends on data, payment records, and optional manual tags being modeled clearly.

**Independent Test**: Can be fully tested by registering passengers, recording payments above and below the effective expected amount, applying and removing manual tags, and verifying pending, settled, and unavailable states.

**Acceptance Scenarios**:

1. **Given** passengers with different combinations of payments and manual tags among **non-removed** passengers, **When** staff views the **default** passenger list for a trip, **Then** each shown passenger's status clearly shows **pending**, **settled** (via payments or via manual tag, distinguishable), or **unavailable** per the status rules; **soft-removed** passengers are **not** shown and **do not** affect default trip-level pending/settled aggregates (FR-036).
2. **Given** a passenger in **pending** because cumulative payment amounts are below the effective expected amount and no manual tag is active, **When** staff registers further payments for that passenger so cumulative amounts meet or exceed the effective expected amount, **Then** the passenger status becomes **settled** through payments alone.
3. **Given** a **soft-removed** passenger whose status under FR-018 would be **pending**, **When** staff views the **default** passenger list and any default trip-level pending summary, **Then** that passenger is omitted from both; **When** staff enables **include removed passengers**, **Then** the passenger appears in the table with status per FR-018 and is included in aggregates shown in that mode (FR-036).

---

### Edge Cases

- Staff starts payment creation from the **centralized payment list** without selecting a passenger; the system **blocks** save until a passenger is assigned.
- A passenger has multiple payments below the effective expected amount; status remains **pending** until cumulative amounts meet or exceed it at **BRL** and **two decimal places** per FR-034 (implicit partial progress while **pending**).
- Trip default expected amount changes after passengers and payments exist; system recalculates each passenger's status using current effective expected amounts and active manual tags.
- Neither trip default nor passenger override defines an expected amount, the passenger has no payments recorded, and no manual paid-without-info tag; automated numeric status is **unavailable** until staff supplies an expected amount, records payments, or applies the manual tag.
- A payment for a passenger is deleted; that passenger’s status is recalculated and may return to **pending** unless a manual paid-without-info tag keeps them **settled**.
- Staff applies manual paid-without-info tag while payments exist that would otherwise imply **pending**; passenger remains **settled** with the manual-tag labeling until staff clears the tag or adjusts payments/tags consistently.
- Effective expected amount is missing at payment creation time; amount field is not pre-filled and staff must enter a valid amount to save.
- Staff tries to register a trip without selecting a school; the system blocks save and explains missing required data.
- Staff enters a passenger whose **CPF** matches another passenger’s **CPF** on the same trip (or **RG** matches another’s **RG**), with both sides of the comparison having that field populated: system **blocks** save with a duplicate error until identifiers differ.
- Staff enters a passenger whose **full name** matches another on the same trip under normalized name comparison and **no** CPF/RG duplicate rule applies: system shows a **warning** and requires **confirmation**; staff may cancel or confirm to save.
- Provided landing page URL is invalid, unreachable, or has no metadata; system allows manual completion of form without blocking record creation.
- A school is **deactivated**: it does not appear in default school lists until staff includes inactive records; staff cannot create new trips for that school; existing trips, their passengers, and payments stay readable when staff opens a trip under that school.
- A trip is **deactivated**: it does not appear in default trip lists until staff includes inactive records; staff cannot add new passengers to that trip; the passenger table and each passenger’s payments remain readable in that trip’s context.
- Two staff edit the same school, trip, passenger, or payment without refreshing: the spec does **not** require detecting stale saves or resolving conflicts; the system may apply the last successful write without dedicated warning.
- Staff **soft-removes** a passenger who has payments: passenger disappears from the **default** passenger table; payments **stay** linked; payment list still shows them with **removed-passenger** indication per FR-021.
- Staff attempts to **create a new payment** for a **removed** passenger: system **blocks** until the passenger is **restored** (per FR-035).
- Staff views a trip’s passenger table with **include removed passengers** enabled: soft-removed rows are visible; staff can **restore** a removed passenger per FR-035.
- **Default** trip passenger view and default **counts** of pending vs settled passengers (or similar operational summaries) **exclude** soft-removed passengers; **include removed** mode adds them back to the table and to those aggregates (FR-036).
- Payment **date** has **no** time-of-day; lists and filters that sort by payment date MUST order by **calendar day** under **`America/Sao_Paulo`** per **FR-037**.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow staff to create, view, update, and deactivate school records.
- **FR-002**: System MUST allow staff to create, view, update, and deactivate trip records linked to exactly one school.
- **FR-003**: System MUST allow school creation flow to optionally start with a landing page URL as the first input.
- **FR-004**: System MUST allow trip creation flow to optionally start with a landing page URL as the first input.
- **FR-005**: When a landing page URL is provided for school or trip creation, system MUST attempt to auto-fill title, description, image, and favicon fields.
- **FR-006**: Auto-filled school or trip metadata fields MUST remain editable by staff before saving.
- **FR-007**: If URL metadata retrieval fails or returns incomplete data, system MUST inform staff and allow manual field completion without blocking save.
- **FR-008**: System MUST allow staff to create, view, update, **soft-remove**, and **restore** passenger records linked to exactly one trip. **Soft-remove** MUST retain the passenger row and all linked payment rows (no hard-delete of the passenger as part of this action); **removed** passengers MUST be omitted from the **default** passenger table for that trip unless staff explicitly opts to **include removed passengers**, consistent with how inactive schools and trips are hidden until opted in (FR-029, FR-030). Full behavior for removal, restoration, payments, and duplicates is specified in **FR-035**.
- **FR-009**: System MUST provide a passenger table within each trip context that shows each **included** passenger's payment status and distinguishes settlement via recorded payments versus manual paid-without-info tagging. By **default**, the table MUST list **only** passengers who are **not** soft-removed; **soft-removed** passengers MUST appear only when staff opts to **include removed passengers** (FR-035, FR-036). Status for every row shown MUST follow **FR-018**.
- **FR-010**: System MUST allow staff to create, view, update, and delete manual payment records from a centralized payment list.
- **FR-011**: System MUST allow staff to create manual payment records directly from an individual passenger entry in the passenger table.
- **FR-012**: System MUST require a monetary amount on every payment record before save; partial progress MUST NOT be represented by a separate “partial payment” field—**pending** implies incomplete payment relative to the effective expected amount when numeric rules apply.
- **FR-013**: When staff creates a payment **for a passenger** (including from that passenger’s row), system MUST pre-fill the amount field with that passenger's effective expected amount when that value exists; staff MUST be able to change the amount before save.
- **FR-014**: System MUST require **payment date**, payment location, and payer identity on every payment record in addition to the monetary amount. **Payment date** semantics are defined in **FR-037**.
- **FR-015**: Every payment MUST reference **exactly one passenger**; system MUST block saving a payment without a passenger. From the **centralized payment list**, staff MUST select a passenger (and thereby the trip) as part of creation; FR-013 pre-fill applies once the passenger is known.
- **FR-016**: System MUST provide, on the passenger list for a trip, an action to mark a passenger as paid **without** creating a payment record, and MUST label that state with user-facing copy equivalent to **“Manually tagged as paid without payment information”** (Brazilian Portuguese in the product).
- **FR-017**: System MUST allow staff to clear the manual paid-without-info tag on a passenger; clearing MUST trigger recalculation of status from payments and effective expected amount.
- **FR-018**: System MUST derive each passenger's payment status as follows: (a) If the manual paid-without-info tag is active, the passenger MUST be **settled** and MUST display the manual-tag labeling. (b) If the tag is not active, an effective expected amount exists, and **one or more payments exist for that passenger**, the passenger MUST be **pending** when cumulative payment amounts are below the effective expected amount and **settled** when cumulative meets or exceeds it, using the monetary representation and comparison rules in **FR-034**. (c) If the tag is not active, an effective expected amount exists, and **there are no payments for that passenger**, the passenger MUST be **pending**. (d) If the tag is not active, no effective expected amount exists, and **there are no payments for that passenger**, status MUST be **unavailable** until staff supplies an expected amount, records payments, or applies the manual tag.
- **FR-019**: When the trip default expected amount changes, system MUST recalculate payment status for all passengers on that trip per FR-018.
- **FR-020**: System MUST recalculate passenger status whenever payment records are created, updated, or deleted, or when the manual paid-without-info tag is toggled.
- **FR-021**: System MUST present each row in the centralized payment list with enough context to identify the **passenger**, **trip**, and **school** (e.g. columns or expandable detail), since every payment belongs to a passenger. When the passenger is **soft-removed** (FR-035), the row MUST still show that identity chain and MUST indicate that the passenger is **removed** (user-visible labeling in `pt-BR`).
- **FR-022**: System MUST treat authentication and user sign-in behavior as out of scope for this feature.
- **FR-023**: System MUST treat external payment gateway processing and financial transaction integration as out of scope for this feature.
- **FR-024**: System MUST keep user-facing interface copy in Brazilian Portuguese (`pt-BR`).
- **FR-025**: System MUST keep source code and technical specification artifacts in English.
- **FR-026**: Specification MUST split implementation scope across `../sitio-dashboard` and `../sitio-backend` repositories.
- **FR-027**: System MUST allow staff to set and update a default expected payment amount on each trip used as the baseline for passenger payment status unless a passenger has an override.
- **FR-028**: System MUST allow staff to optionally set an expected payment amount on a passenger that overrides the trip default for that passenger's pending/settled calculation only.
- **FR-029**: For a **deactivated** school, system MUST omit it from default school lists unless staff explicitly opts to include inactive records; system MUST block creating new trips linked to that school; system MUST still allow staff to open existing trips under that school and view their passengers and payments.
- **FR-030**: For a **deactivated** trip, system MUST omit it from default trip lists unless staff explicitly opts to include inactive records; system MUST block creating new passengers on that trip; system MUST still allow staff to open the trip and view its passenger table and linked payment information.
- **FR-031**: On passenger **create or update** within a trip, system MUST block save with a **duplicate document error** if **CPF** matches another passenger’s **CPF** on that trip or **RG** matches another passenger’s **RG** on that trip, using **normalized** values (e.g. strip formatting) and only when both compared values are non-empty. Comparisons MUST include **soft-removed** passengers on that trip so the same document cannot be reused on a new row while a soft-removed passenger with that identifier still exists on the trip.
- **FR-032**: When FR-031 does not apply and the passenger’s **full name** matches another passenger on that trip under **normalized** name comparison (e.g. case-insensitive, trimmed), system MUST show a **warning** and require explicit **staff confirmation** before completing save; staff MUST be able to cancel or confirm. The set of passengers compared MUST include **soft-removed** passengers on that trip, consistent with FR-031.
- **FR-033**: System MUST treat **stale-save detection**, **optimistic concurrency**, and **concurrent-edit conflict resolution** (including dedicated merge UX) as **out of scope** for this feature; default persistence behavior such as **last write wins** without conflict prompts is acceptable.
- **FR-034**: All monetary fields—trip default expected amount, per-passenger expected amount overrides, and payment amounts—MUST be denominated in **BRL** (`BRL` / Brazilian Real). System MUST persist and compare values using a **fixed scale of two decimal places** (e.g. minor units such as centavos, or decimals with **half-up** rounding applied consistently when staff enter or edit amounts). Sums of payment amounts for a passenger MUST use the same scale before comparison; **settled** via recorded payments when cumulative amount is **greater than or equal to** the effective expected amount at that scale.
- **FR-035**: Passenger **removal** MUST be **soft-remove** only: the passenger record and all linked payments MUST persist; soft-remove MUST **not** unlink or delete payment rows. **Removed** passengers MUST be omitted from the **default** passenger table until staff opts to **include removed passengers**. Staff MUST be able to **restore** a soft-removed passenger from that trip’s context. System MUST **block** creating **new** payments for a **removed** passenger (including from the centralized payment list passenger picker) until that passenger is **restored**; existing payments for that passenger MUST remain editable and deletable per FR-010. FR-031 and FR-032 MUST treat **soft-removed** passengers on the trip as part of the comparison set.
- **FR-036**: Any **default** trip-level passenger roster and any **aggregates** derived from passenger payment status for operational monitoring (e.g. counts of **pending** passengers) MUST include **only** passengers who are **not** soft-removed. When staff enables **include removed passengers** for that trip context, soft-removed passengers MUST appear in the roster and MUST be included in aggregates displayed in that mode; their status MUST still be derived per **FR-018**.
- **FR-037**: **Payment date** MUST be a **calendar date** only (no time-of-day). The system MUST interpret, persist, and display that date using the canonical timezone **`America/Sao_Paulo`** so day boundaries and ordering are consistent for staff in Brazil.

### Key Entities *(include if feature involves data)*

- **School**: Educational institution customer; key business identity and contact attributes; parent entity for trips; may be **deactivated** (inactive), which affects default list visibility and whether new trips can be created, per FR-029.
- **Trip**: Travel operation associated with one school; includes planning details, operational dates, and a default expected payment amount for passengers in **BRL** at **two decimal places** per FR-034; parent entity for passengers; may be **deactivated** (inactive), which affects default list visibility and whether new passengers can be added, per FR-030.
- **Landing Page Metadata**: Structured public page information (title, description, image, favicon) used to pre-fill school and trip forms from a pasted URL.
- **Passenger**: Student or participant assigned to one trip; carries identifying information including **full name** and optional **CPF** and **RG**; optional expected payment amount override in **BRL** at **two decimal places** per FR-034; optional **manual paid-without-info** flag; derived payment status; may be **soft-removed** (hidden from default passenger lists) while payments remain linked, per **FR-035**; duplicate rules per FR-031 and FR-032 scoped to **the same trip** including soft-removed passengers.
- **Payment**: Manual financial record with **required** monetary amount in **BRL** at **two decimal places** per FR-034, **calendar payment date** (no time-of-day) per **FR-037**, payment location, and payer identity; **always** references **exactly one passenger** (and thus one trip and one school). No separate partial-payment flag; partial progress is implicit while cumulative amounts remain below the effective expected amount.
- **Payment Status**: Derived state per passenger (**pending**, **settled**, or **unavailable**) per FR-018, including whether **settled** is due to recorded payments or the manual paid-without-info tag. **Default** trip dashboards and aggregates use this status **only** for **non-removed** passengers unless staff includes removed passengers (**FR-036**).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Staff can register a new school, trip, and at least one passenger in under 6 minutes in usability testing.
- **SC-002**: In 90% of tests with valid landing page URLs, school and trip forms auto-fill title, description, image, and favicon in under 5 seconds.
- **SC-003**: 95% of payment records are successfully created on first attempt by staff during pilot usage when required fields are known.
- **SC-004**: Staff can create a payment from either entry point (payment list or passenger table) in 3 clicks/actions or fewer after opening the relevant screen.
- **SC-005**: In usability testing, 90% of staff apply or clear the manual paid-without-info tag for a passenger in under 15 seconds.
- **SC-006**: For test datasets, 100% of **shown** passengers display the correct pending, settled (source distinguishable), or unavailable status after payment create, update, delete, manual-tag toggles, and soft-remove/restore, evaluated per **FR-018**, **FR-034**, and **FR-036** (default vs include-removed modes).
- **SC-007**: At least 90% of pilot users report that identifying pending passengers is clear without additional training.
- **SC-008**: Operational follow-up time to identify pending passengers is reduced by at least 40% compared with the current manual process.

## Assumptions

- Tourism company staff are internal users who already have access to the system through an existing access control process outside this feature scope.
- Each trip has a default expected payment amount staff maintain; passengers may optionally override that amount individually for status calculation. All such amounts and payment line items use **BRL** with **two decimal places** per **FR-034**.
- A trip is always associated with one school, and a passenger is always associated with one trip.
- Passenger **removal** is **soft-remove** only: records and payment links are retained; default UIs hide removed passengers until staff opts in, per **FR-035**. Default trip-level **aggregates** over payment status also **exclude** removed passengers until that opt-in, per **FR-036**.
- Manual payment records are entered based on offline confirmations (cash, transfer, or other external methods) and do not require automated verification. **Payment date** is **date-only** in **`America/Sao_Paulo`**, per **FR-037**.
- Initial release targets web dashboard usage by staff; mobile-specific workflows are out of scope.
- School and trip landing pages usually expose metadata fields that can be consumed for form pre-fill; when unavailable, manual entry remains the default fallback.
- The product presents the manual-tag label in Brazilian Portuguese using wording equivalent in meaning to the English reference **“Manually tagged as paid without payment information.”**
- **CPF** and **RG** on passengers are optional for business use but enable strict duplicate detection when provided; normalization rules for comparison are defined at implementation time and applied consistently on create and update.
- Concurrent use by multiple staff is allowed; simultaneous edits to the same record may overwrite without the product detecting **stale** state or offering conflict resolution (per FR-033).
