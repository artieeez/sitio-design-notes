# Feature Specification: Wix Payment Gateway Event Console

**Feature Branch**: `005-wix-payment-integration`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "Frontend-only Wix payment integration exploration with mocked events, list-detail inspection (including integration keys in the detail pane), ordering, pagination, and orphan filtering."  
**Target Repositories**: `../sitio-dashboard` (in scope), `../sitio-backend` (out of scope for this feature)

## Clarifications

### Session 2026-04-18

- Integration key fields (public and private/API) are edited in the **detail pane**, opened from the **list column** (same list–detail pattern as viewing a selected event).
- Q: Is the Wix Integration experience school-scoped like Trips (sidebar and route under the active school)? → A: Yes — same school selection rules; the page is used in the context of one school at a time.
- Q: On that school-scoped page, may the default (unfiltered) event table include rows that are orphan (no matching trip)? → A: Yes — orphan means **no trip match**, not “outside the school”; matched and orphan rows may appear together until the user activates the orphan-only filter.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access and inspect Wix payment events (Priority: P1)

As an operations user, I can open a dedicated Wix Integration page from the sidebar and inspect incoming payment events in a list-detail experience to understand recent payment activity quickly.

**Why this priority**: Event visibility is the core user value for this feature and enables future event-to-trip reconciliation workflows.

**Independent Test**: Can be fully tested by navigating to the Wix Integration page, confirming event rows render, and opening row details in the right-side pane.

**Acceptance Scenarios**:

1. **Given** I am in the dashboard with an active school scope, **When** I select the Wix Integration item in the sidebar, **Then** I see a Wix Payment Events page with a table of mocked events for that school context.
2. **Given** I can see the event table, **When** I click an event row, **Then** a right-side detail pane opens and shows the complete event payload fields for that selected event.
3. **Given** no event is selected, **When** I load the page, **Then** the detail pane follows the existing list-detail behavior used in other dashboard lists.

---

### User Story 2 - Register integration keys (Priority: P2)

As an operations user, I can open integration key fields in the **same right-hand detail pane** used for event inspection, so configuration stays consistent with the rest of the dashboard list–detail pattern and the events list stays the primary focus in the left column.

**Why this priority**: Key registration is required setup context for the integration; placing it in the detail pane avoids crowding the list column and matches how other screens surface secondary setup next to a primary list.

**Independent Test**: Can be tested by opening the Wix Integration page, using the list column entry point for integration settings, and confirming the detail pane shows title, explanatory copy, and two key fields (public and private/API), with a clear way to leave that view.

**Acceptance Scenarios**:

1. **Given** I opened the Wix Integration page with an active school scope, **When** I choose the integration settings entry from the list column (for example via an options menu on the list header), **Then** the right-hand detail pane shows the integration key configuration (public key and private/API key inputs) instead of an event payload.
2. **Given** I am viewing integration key fields in the detail pane, **When** I type values in both fields and move focus away, **Then** entered values remain available for the session so I can close the configuration view and continue reviewing events without losing what I typed.
3. **Given** I am viewing integration key configuration in the detail pane, **When** I use the same close/dismiss pattern as other detail views on this screen, **Then** I return to the list–detail state where no event row is required to be selected (consistent with existing list–detail behavior for this page).

---

### User Story 3 - Sort, paginate, and filter orphan events (Priority: P3)

As an operations user, I can sort events, change page size, and filter orphan events so I can focus on unmatched payments that need follow-up.

**Why this priority**: Sorting and filtering are secondary discovery tools that improve triage efficiency after baseline event visibility is available.

**Independent Test**: Can be tested by applying sort on each column, switching page size between 10/25/100, and toggling the orphan filter chip to narrow results.

**Acceptance Scenarios**:

1. **Given** the events table is populated, **When** I sort by any column (Trip, Value, Name, Email, Date), **Then** rows reorder according to that column and sort direction.
2. **Given** the table has more than one page of data, **When** I switch page size to 10, 25, or 100, **Then** pagination updates to the selected size.
3. **Given** mocked events include both matched and orphan records in the default table, **When** I activate the orphan filter chip, **Then** only orphan events are shown.

---

### Edge Cases

- The table has fewer records than the selected page size; pagination controls remain valid and show a single page.
- All events are non-orphan and the orphan filter is active; the table shows an empty state with clear guidance that no orphan events match.
- A selected event is no longer visible after applying a filter or sort; the detail pane resets or updates consistently with existing list-detail selection behavior.
- Key input fields contain empty values; the configuration view and event table still render and event inspection remains available when an event is selected.
- The user opens integration configuration while another detail context could apply; navigation and close behavior remain predictable (one clear detail content at a time, aligned with list–detail conventions on this page).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a sidebar navigation entry that opens a dedicated Wix Integration page **under the active school scope**, using the same enable/disable behaviour as other school-dependent main nav items when no school is selected.
- **FR-002**: System MUST provide access to two key input fields (public key and private/API key) inside the **right-hand detail pane**, reachable from the list column, using the same list–detail interaction pattern as event inspection on this page.
- **FR-003**: System MUST render a Wix payment events table with the columns: Trip, Value, Buyer Name, Buyer Email, and Date.
- **FR-004**: System MUST allow sorting on every payment events table column.
- **FR-005**: System MUST provide pagination controls with page size options of 10, 25, and 100 records.
- **FR-006**: System MUST support selecting an event row to open a right-side detail pane following the established list-detail interaction pattern used in the dashboard.
- **FR-007**: System MUST display event detail information that includes all fields represented in the Wix payment event entity sample.
- **FR-008**: System MUST include mocked payment events with an orphan status indicating **no matching trip association**; orphan rows MUST be visible in the default table together with matched rows (the orphan filter only narrows the view).
- **FR-009**: System MUST provide an orphan filter chip that limits the table to orphan events when active.
- **FR-010**: System MUST make it visually clear which events are orphan, both in the full list and filtered list.
- **FR-011**: This feature specification MUST scope implementation to `../sitio-dashboard`, with backend webhook ingestion and persistence explicitly out of scope.
- **FR-012**: System MUST use Brazilian Portuguese (`pt-BR`) for all user-facing labels, placeholders, empty states, and status tags introduced by this feature.
- **FR-013**: Source code and technical specification content MUST remain in English.
- **FR-014**: The list-detail layout MUST conform to Material Design 3 canonical list-detail behavior or document a justified exception with acceptance criteria.
- **FR-015**: Changed components MUST define and satisfy project linting and maintainability expectations.

### Key Entities *(include if feature involves data)*

- **Wix Payment Event**: A payment notification record shown in the table and details pane, including identifiers, buyer information, billing information, item fields, amount/value, created date, and reconciliation status.
- **Integration Key Pair**: User-entered public key and private/API key values used to represent Wix integration credentials in the frontend experience; in this iteration they are edited in the detail pane.
- **Orphan Status**: A classification state for payment events that do not match an existing trip association and require operational attention. **Orphan is not synonymous with “wrong school”** in this phase: the list is school-scoped for navigation and triage, while orphan flags missing trip linkage only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of test users with an active school scope can open the Wix Integration page in **one** sidebar action (same pattern as opening Trips).
- **SC-002**: 100% of required table columns (Trip, Value, Buyer Name, Buyer Email, Date) are visible and sortable during acceptance testing.
- **SC-003**: Users can switch between page sizes (10, 25, 100) and see updated pagination behavior within one interaction per change.
- **SC-004**: At least 95% of evaluated tasks to identify orphan events are completed without external guidance using the orphan visual tag and filter chip.
- **SC-005**: 100% of selected rows open event details containing the full mocked event payload structure defined for this feature.
- **SC-006**: All newly introduced user-facing text for this flow passes product review for Brazilian Portuguese clarity and consistency.
- **SC-007**: 100% of evaluated users with an active school scope can reach integration key fields from the list column and see them in the detail pane in **two** or fewer deliberate actions (open page, then open configuration).

## Assumptions

- This iteration is frontend-only and uses static or locally mocked data; no live webhook ingestion, authentication, or key persistence is included.
- The Wix Integration page is **school-scoped** (same mental model as the Trips list): operators work in the context of the currently selected school.
- Users accessing this page already have dashboard access permissions consistent with existing sidebar-protected areas.
- Existing list-detail behavior and visual conventions from the trip list are available as the baseline UX reference.
- Orphan status is represented as a mocked boolean or equivalent categorical state only for UX exploration in this phase.
- Future backend rules for which raw gateway events are associated with which school are **out of scope**; mocks only need to support the UX described here (including mixed matched and orphan rows on one school’s page).
