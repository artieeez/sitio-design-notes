# Feature Specification: Dashboard list–detail layout overhaul

**Feature Branch**: `004-m3-list-detail-overhaul`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "Overhaul list views and create/edit forms so they follow Material Design 3 list-detail canonical layout. Scope: every list-detail pattern in the dashboard."  
**Target Repositories**: `../sitio-dashboard` (primary). `../sitio-backend` only if a planned change requires API or contract adjustments; default assumption is no backend scope.

## Clarifications

### Session 2026-04-08

- **Q**: If the user has unsaved changes in the detail/create/edit form and tries to select another list item or leave the detail context (including back on compact), what should happen? **→ A**: Block the navigation or selection change until the user saves or explicitly discards changes, with a clear prompt if needed (user choice: Option A).
- **URL + list–detail (clarified)**: For any **in-scope list–detail shell** (schools directory, school-scoped trips, trip workspace, passengers, payments, etc.), the intended shape is: **collection base** shows **LIST** + **DETAIL** placeholder (“select an item”); **after** a stable segment under that scope (e.g. a non-index child path), **LIST** stays paired with **DETAIL** for **that** shell only. **Do not** stack an unrelated collection list (e.g. the **schools directory**) beside a scoped hub such as `/schools/$schoolId/...`. Where the product avoids a bare `/$entityId` index URL for content, **redirect** to an explicit subpath (e.g. `.../home`, `.../summary`). **Close** on the detail surface (compact or wide) **deselects** for **that** list–detail shell (parent handles routing), not a generic “back” metaphor.
- **Q**: Should this feature spell out a minimum accessibility bar for list–detail screens? **→ A**: Yes—**WCAG 2.1 Level AA** for keyboard navigation, focus order, and visible focus in list and detail regions; the plan documents how reviewers verify (user choice: Option A).
- **Q**: Should the spec require a default pattern for loading long collections in the list pane (pagination, load more, virtualization)? **→ A**: **Pagination and similar collection-loading patterns are out of scope** for this feature; how data is paged, windowed, or fetched stays as today or is owned by a separate specification (user: pagination is out of scope).
- **Q**: When a deep link or bookmark points to a missing or inaccessible list item, what should happen? **→ A**: Show a clear **not found / unavailable** state in the **detail** region; keep the list usable where the layout allows; user can pick another item or return to list context (user choice: Option A).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and act on items from a coordinated list and detail (Priority: P1)

A staff user opens a dashboard area that shows many records (for example trips, passengers, or payments). They see a clear list region and a detail region that work together: choosing an item updates the detail without breaking orientation, and actions such as viewing fields or starting edits feel anchored to the selected item.

**Why this priority**: This is the core value of the overhaul—predictable list–detail behavior everywhere it applies.

**Independent Test**: Open any in-scope dashboard list–detail screen, select different items, and confirm list and detail regions stay coordinated and understandable without relying on other stories.

**Acceptance Scenarios**:

1. **Given** a screen with a list of records and a detail or form area, **When** the user selects an item in the list, **Then** the detail area shows content for that selection and the user can tell which item is active.
2. **Given** a selected item, **When** the user performs a primary task in the detail area (view fields, start edit, or submit a form where applicable), **Then** the task completes without the layout hiding the list or the selection state in a confusing way on standard desktop widths.
3. **Given** multiple items in the list, **When** the user moves selection from one item to another, **Then** the interface updates in a predictable order (selection and detail stay aligned).
4. **Given** unsaved edits in the detail or form area, **When** the user tries to select a different list item or otherwise leave the current detail context without saving, **Then** the product prevents the change until the user saves or explicitly discards, with clear user-facing messaging.
5. **Given** keyboard-only use (no pointer), **When** the user moves through the list and into the detail region and back, **Then** focus order is logical, focus is visible, and the user can tell which item is selected and which region is active.
6. **Given** a deep link or bookmark to an item that is missing or no longer accessible, **When** the screen loads, **Then** the detail region shows a clear unavailable/not-found state in `pt-BR`, the list remains usable where the layout allows, and the user can select another item or return to list context without a dead end.

---

### User Story 2 - Work on smaller or changing viewport widths (Priority: P2)

The same user resizes the browser or uses a narrower window. The experience follows the canonical list–detail guidance for compact widths: they can still reach the list, open an item, and complete viewing or editing without getting stuck or losing context.

**Why this priority**: Constitution and product expectations require correct responsive behavior, not only wide layouts.

**Independent Test**: Repeat Story 1 flows at compact widths and confirm navigation between list and detail remains possible and understandable.

**Acceptance Scenarios**:

1. **Given** a narrow viewport, **When** the user needs to pick an item and see its detail or form, **Then** they can move between list and detail using patterns consistent with the canonical list–detail layout (no dead ends).
2. **Given** a narrow viewport, **When** the user completes or cancels a detail task, **Then** they can return to the list context without unexplained loss of place where the guidance expects preservation of context.
3. **Given** unsaved edits in the detail area on a narrow viewport, **When** the user uses **Close** (deselect) or another control that would leave the detail context, **Then** the same save-or-discard rule applies before the context changes.

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
- **Unsaved edits**: If the detail surface has unsaved changes, selecting another list item or leaving the detail context (including compact **Close** / deselect) MUST NOT apply silently; the user MUST complete save or explicit discard first, with messaging in `pt-BR`.
- **Very long labels or content**: List rows and detail content remain usable (readable truncation, wrapping, or scroll within regions) without breaking the two-pane intent.
- **Screens that only look like lists**: Any screen that is in scope must be identified during planning; pure settings pages or single-panel tools without a collection+detail pattern remain out of scope.
- **Keyboard and focus**: List and detail regions remain fully operable without a pointer where the UI offers controls; focus is not lost or hidden when selection or layout mode changes, within the WCAG 2.1 AA bar stated in FR-013.
- **Missing or inaccessible deep-linked item**: If routing targets an item that cannot be loaded or no longer exists, the detail surface MUST show an explicit not-found or unavailable state in `pt-BR`; the list pane MUST remain usable on layouts where it is shown so the user can continue; compact layouts MUST still offer a clear path back to the list context.

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
- **FR-012**: On every in-scope screen with editable fields in the detail surface, the product MUST block changing the selected list item or abandoning the detail context while there are unsaved changes until the user saves or explicitly discards; prompts and labels MUST follow `pt-BR` rules. The plan MAY document narrow exemptions (for example read-only detail with no form) where this rule does not apply.
- **FR-013**: In-scope list–detail screens MUST meet **WCAG 2.1 Level AA** expectations for keyboard operability, meaningful focus order, and visible focus indicators across the list and detail regions (including compact layouts). The plan MUST describe how verification is performed (for example checklist, manual pass, or automated checks where applicable) and any approved exemption with acceptance criteria.
- **FR-014**: For in-scope screens that support deep links or bookmarks to a specific list item, when that target is missing, deleted, or otherwise unavailable, the product MUST show a clear error or not-found state in the detail region (copy in `pt-BR`), MUST keep the list operable where the canonical layout shows both panes, and MUST avoid trapping the user on compact widths (clear path back to the list). Screens without item-level deep linking are exempt; the plan MUST list which routes require this behavior.

### Key Entities

- **Collection**: The set of records shown in the list region (trips, passengers, payments, or other dashboard entities—concrete inventory is fixed in planning).
- **Selected item**: The record (if any) driving the detail or form region.
- **Detail surface**: The region used for viewing, editing, or creating the focused record within the list–detail pattern.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every screen listed in the plan as in-scope, reviewers can confirm in a single session (under 30 minutes per screen) that list and detail regions behave as one coordinated pattern and match the published list–detail canonical guidance for structure, selection, and responsive breakpoints, except for approved exemptions with passing criteria; where forms exist, reviewers also confirm that unsaved edits cannot be lost via selection change or leaving detail without save or explicit discard.
- **SC-002**: On compact widths, 100% of in-scope screens allow completing the primary task (select item → view or edit → return to list context) in a usability walkthrough without dead ends.
- **SC-003**: At least 90% of participants in an internal design or product review agree that create/edit flows feel consistent with the same list–detail pattern as read-only detail on sampled screens (minimum sample: every distinct list–detail pattern type identified in the plan).
- **SC-004**: 100% of new or changed user-visible strings on touched screens are in `pt-BR` and pass the stated language review.
- **SC-005**: All changed dashboard modules pass the repository’s automated quality gates (lint and related checks) with no new high-severity issues.
- **SC-006**: Automated tests added or updated for navigation and layout behavior pass in continuous integration for the dashboard repository.
- **SC-007**: Compared to the prior release, support or internal feedback channels show no increase in confusion reports specifically about “lost context” or “cannot get back to the list” on in-scope flows during the first two weeks after release (baseline: zero such reports if none existed).
- **SC-008**: Exemptions, if any, are documented with acceptance criteria and are verified in the same review pass as SC-001.
- **SC-009**: For every screen listed in the plan as in-scope, the documented accessibility verification for FR-013 is executed and passes before release (no open blocking defects against the stated WCAG 2.1 AA bar for list–detail keyboard and focus behavior), except for approved exemptions verified under SC-008.
- **SC-010**: For every in-scope screen identified in the plan as supporting item-level deep links, reviewers verify FR-014 once per screen (missing or inaccessible target shows explicit detail state, list continuity, no dead end on compact).

## Assumptions

- “Dashboard” means authenticated product UI in `sitio-dashboard`, not marketing or external sites.
- An inventory of list–detail screens will be produced in planning; until then, scope is defined as any current or planned dashboard view that combines a collection list with a per-item detail or form.
- Business rules, validation rules, and API contracts stay the same unless planning discovers a hard dependency; this specification is primarily a layout and interaction overhaul.
- Pagination, virtualization, infinite scroll, and other list windowing or fetch strategies are **not** goals of this specification; existing behavior continues unless another feature changes it.
- Users have a modern browser capable of responsive layouts; offline behavior is unchanged unless already specified elsewhere.
- Deep links and bookmarks to a specific item remain supported where they exist today; when the target is missing or inaccessible, behavior follows FR-014. Planning will call out any intentional URL or routing adjustments.

## Out of Scope

- Backend-only features with no dashboard list–detail UI.
- Screens that are not list–detail (for example single full-page forms with no sibling collection list, unless later moved into a list–detail pattern by a separate decision).
- Native mobile applications outside the web dashboard.
- Introducing or standardizing **pagination**, **virtualized lists**, **infinite scroll**, **load-more** patterns, or other **collection windowing** as a deliverable of this overhaul (those concerns belong elsewhere unless explicitly added to scope later).
