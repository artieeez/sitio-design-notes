# Feature Specification: Dashboard list–detail layout overhaul

**Feature Branch**: `004-m3-list-detail-overhaul`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "Overhaul list views and create/edit forms so they follow Material Design 3 list-detail canonical layout. Scope: every list-detail pattern in the dashboard."  
**Target Repositories**: `../sitio-dashboard` (primary). `../sitio-backend` only if a planned change requires API or contract adjustments; default assumption is no backend scope.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and act on items from a coordinated list and detail (Priority: P1)

A staff user opens a dashboard area that shows many records (for example trips, passengers, or payments). They see a clear list region and a detail region that work together: choosing an item updates the detail without breaking orientation, and actions such as viewing fields or starting edits feel anchored to the selected item.

**Why this priority**: This is the core value of the overhaul—predictable list–detail behavior everywhere it applies.

**Independent Test**: Open any in-scope dashboard list–detail screen, select different items, and confirm list and detail regions stay coordinated and understandable without relying on other stories.

**Acceptance Scenarios**:

1. **Given** a screen with a list of records and a detail or form area, **When** the user selects an item in the list, **Then** the detail area shows content for that selection and the user can tell which item is active.
2. **Given** a selected item, **When** the user performs a primary task in the detail area (view fields, start edit, or submit a form where applicable), **Then** the task completes without the layout hiding the list or the selection state in a confusing way on standard desktop widths.
3. **Given** multiple items in the list, **When** the user moves selection from one item to another, **Then** the interface updates in a predictable order (selection and detail stay aligned).

---

### User Story 2 - Work on smaller or changing viewport widths (Priority: P2)

The same user resizes the browser or uses a narrower window. The experience follows the canonical list–detail guidance for compact widths: they can still reach the list, open an item, and complete viewing or editing without getting stuck or losing context.

**Why this priority**: Constitution and product expectations require correct responsive behavior, not only wide layouts.

**Independent Test**: Repeat Story 1 flows at compact widths and confirm navigation between list and detail remains possible and understandable.

**Acceptance Scenarios**:

1. **Given** a narrow viewport, **When** the user needs to pick an item and see its detail or form, **Then** they can move between list and detail using patterns consistent with the canonical list–detail layout (no dead ends).
2. **Given** a narrow viewport, **When** the user completes or cancels a detail task, **Then** they can return to the list context without unexplained loss of place where the guidance expects preservation of context.

---

### User Story 3 - Create and edit using the same structural pattern (Priority: P3)

When the user creates a new record or edits an existing one in a flow that belongs to a list–detail screen, the create/edit experience sits in the same conceptual detail region (or equivalent transition) as view mode, so switching between browse, create, and edit feels like one pattern—not a separate, unrelated page layout.

**Why this priority**: Forms were explicitly called out; aligning create/edit with the list–detail pattern reduces cognitive load and matches the constitution.

**Independent Test**: From an in-scope screen, run a create flow and an edit flow and confirm they align with the same list–detail structure and navigation expectations as read-only detail.

**Acceptance Scenarios**:

1. **Given** a list–detail screen that supports creating records, **When** the user starts creation, **Then** the create form appears in the detail role of the pattern (or a documented equivalent transition), not as an unrelated layout.
2. **Given** an existing record, **When** the user opens edit, **Then** editing uses the same structural relationship to the list as viewing detail, including selection context where applicable.

---

### Edge Cases

- **Empty list**: User sees a helpful empty state; detail region behavior is defined (placeholder, hidden, or guided action) without broken layout.
- **Loading and errors**: List or detail loading and failure states do not collapse the pattern or trap the user; retry or back navigation remains clear.
- **No selection yet**: First visit or cleared selection defines what appears in the detail region and how the user is invited to choose an item.
- **Concurrent changes**: If data changes while the user is viewing an item (for example refresh or another actor), the UI recovers with clear messaging or refresh behavior without corrupting the list–detail structure.
- **Very long labels or content**: List rows and detail content remain usable (readable truncation, wrapping, or scroll within regions) without breaking the two-pane intent.
- **Screens that only look like lists**: Any screen that is in scope must be identified during planning; pure settings pages or single-panel tools without a collection+detail pattern remain out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: For every dashboard screen in scope (collection plus per-item detail or editing, including forms), the product MUST present a list–detail experience that matches the structure, selection behavior, and responsive rules described in Material Design 3 [List–detail canonical layout](https://m3.material.io/foundations/layout/canonical-layouts/list-detail), unless a written exemption in this specification’s plan defines an alternative and how success is measured.
- **FR-002**: Users MUST always be able to identify the currently selected item when a detail or form is shown, except in explicit create-only states where no item exists yet and the plan documents that exception.
- **FR-003**: The product MUST preserve task context when moving between list and detail on compact viewports per the same canonical guidance (for example back navigation or equivalent that does not strand the user).
- **FR-004**: Create and edit flows that live on list–detail screens MUST use the detail role of the pattern (or a plan-documented equivalent) so browse, create, and edit feel consistent.
- **FR-005**: In-scope screens MUST define behavior for empty, loading, and error states that keeps the list–detail pattern understandable and actionable.
- **FR-006**: Delivery MUST define observable quality expectations for changed UI (for example repository lint and style gates for the dashboard) and meet them before merge.
- **FR-007**: Delivery MUST document UX consistency expectations for impacted flows (shared terminology, selection affordances, motion or focus behavior where relevant) so reviewers can verify uniformity across screens.
- **FR-008**: All new or changed user-visible copy MUST be in Brazilian Portuguese (`pt-BR`); review MUST confirm clarity and consistency with existing dashboard language.
- **FR-009**: Source code and technical specification text MUST remain in English.
- **FR-010**: The plan MUST name every dashboard route or feature area that counts as list–detail in scope and list any exemption with rationale and acceptance criteria.
- **FR-011**: Where this feature applies, list–detail behavior MUST remain aligned with Principle VI of the Sitio constitution (same canonical reference as FR-001); any deviation MUST be an approved exemption with measurable acceptance criteria.

### Key Entities

- **Collection**: The set of records shown in the list region (trips, passengers, payments, or other dashboard entities—concrete inventory is fixed in planning).
- **Selected item**: The record (if any) driving the detail or form region.
- **Detail surface**: The region used for viewing, editing, or creating the focused record within the list–detail pattern.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every screen listed in the plan as in-scope, reviewers can confirm in a single session (under 30 minutes per screen) that list and detail regions behave as one coordinated pattern and match the published list–detail canonical guidance for structure, selection, and responsive breakpoints, except for approved exemptions with passing criteria.
- **SC-002**: On compact widths, 100% of in-scope screens allow completing the primary task (select item → view or edit → return to list context) in a usability walkthrough without dead ends.
- **SC-003**: At least 90% of participants in an internal design or product review agree that create/edit flows feel consistent with the same list–detail pattern as read-only detail on sampled screens (minimum sample: every distinct list–detail pattern type identified in the plan).
- **SC-004**: 100% of new or changed user-visible strings on touched screens are in `pt-BR` and pass the stated language review.
- **SC-005**: All changed dashboard modules pass the repository’s automated quality gates (lint and related checks) with no new high-severity issues.
- **SC-006**: Automated tests added or updated for navigation and layout behavior pass in continuous integration for the dashboard repository.
- **SC-007**: Compared to the prior release, support or internal feedback channels show no increase in confusion reports specifically about “lost context” or “cannot get back to the list” on in-scope flows during the first two weeks after release (baseline: zero such reports if none existed).
- **SC-008**: Exemptions, if any, are documented with acceptance criteria and are verified in the same review pass as SC-001.

## Assumptions

- “Dashboard” means authenticated product UI in `sitio-dashboard`, not marketing or external sites.
- An inventory of list–detail screens will be produced in planning; until then, scope is defined as any current or planned dashboard view that combines a collection list with a per-item detail or form.
- Business rules, validation rules, and API contracts stay the same unless planning discovers a hard dependency; this specification is primarily a layout and interaction overhaul.
- Users have a modern browser capable of responsive layouts; offline behavior is unchanged unless already specified elsewhere.
- Deep links and bookmarks to a specific item remain valid where they exist today; planning will call out any intentional URL or routing adjustments.

## Out of Scope

- Backend-only features with no dashboard list–detail UI.
- Screens that are not list–detail (for example single full-page forms with no sibling collection list, unless later moved into a list–detail pattern by a separate decision).
- Native mobile applications outside the web dashboard.
