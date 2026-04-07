# Feature Specification: Dashboard breadcrumbs (school-scoped)

**Feature Branch**: `003-dashboard-breadcrumbs`  
**Created**: 2026-04-07  
**Status**: Draft  
**Input**: User description: Breadcrumbs for the school-scoped dashboard: omit the school name (already shown in the school selector); trail starts at school-scoped sidebar destinations and continues for nested routes using each level’s human-readable name; responsive placement in the top bar vs below it on small screens; scrollable trail with initial view aligned to the end (right) when overflow occurs.

**Target Repositories**: `../sitio-dashboard` (primary). Backend not required unless route titles must come from new APIs—see Assumptions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See where I am in the school-scoped app (Priority: P1)

As staff working inside a selected school, I see a breadcrumb trail that reflects my current place in the app, starting from the same destinations that appear in the school-scoped sidebar (for example home and trips), then continuing with nested levels such as a specific trip and a sub-area like passengers or create.

**Why this priority**: Orientation is the core value of breadcrumbs; without a correct, readable trail, the feature fails.

**Independent Test**: Open any school-scoped screen that maps to a sidebar entry and at least one nested segment; confirm the trail begins with the sidebar-aligned label(s) and continues with labels that match the page (not raw identifiers), without repeating the school name.

**Acceptance Scenarios**:

1. **Given** I am on the school-scoped home route, **When** I view the breadcrumb area, **Then** I see a trail consistent with the “home” entry (for example the label equivalent to “Início” in the product language).
2. **Given** I am on a top-level sidebar route (for example trips), **When** I view the breadcrumb area, **Then** the first segment matches that sidebar item’s name (for example “Viagens”).
3. **Given** I navigate deeper (for example a specific trip and then passengers), **When** I view the breadcrumb area, **Then** the trail includes nested segments using the specific names for that trip and sub-area (for example “Viagens / [trip name] / Passengers”), not internal ids alone.
4. **Given** the active school is shown in the school selector, **When** I view the breadcrumb trail, **Then** the school name does **not** appear as a breadcrumb segment.

---

### User Story 2 - Move up the hierarchy from the trail (Priority: P2)

As staff, I can use the breadcrumb trail to move to a parent level when segments are interactive, so I can go back without relying only on the sidebar.

**Why this priority**: Reduces clicks and matches common breadcrumb expectations; secondary to showing the correct trail.

**Independent Test**: On a nested page, activate a parent segment in the trail and confirm navigation lands on the corresponding parent route.

**Acceptance Scenarios**:

1. **Given** I am on a nested page with at least two segments in the trail, **When** I activate a non-current parent segment, **Then** I navigate to that level’s destination.
2. **Given** I am on the deepest segment, **When** I view the trail, **Then** the current segment is clearly the active step (visual distinction acceptable; exact styling is not prescribed here).

---

### User Story 3 - Responsive placement and overflow (Priority: P2)

As staff on different screen sizes, I see breadcrumbs in the right place: on large layouts they sit in the top bar immediately after the control that expands or collapses the sidebar; on small layouts the top bar prioritizes the school title, and breadcrumbs appear below that bar. If the trail is wider than the space available, I can scroll it horizontally, and the first view shows the end of the trail (the current context) aligned to the visible area.

**Why this priority**: Matches the described layout and prevents the school context and breadcrumbs from competing on small screens; overflow behavior avoids hiding the current segment.

**Independent Test**: Resize or use a narrow viewport to confirm school title stays in the top bar row and breadcrumbs sit below; use a long trail to confirm horizontal scroll and that the right side (including the current segment) is visible without manual scrolling immediately after load.

**Acceptance Scenarios**:

1. **Given** a large layout, **When** I view the top bar, **Then** breadcrumbs appear after the sidebar toggle, in reading order.
2. **Given** a small layout, **When** I view the shell, **Then** the school title occupies the top bar row and breadcrumbs are shown on a separate row below (not in the same row as the school title).
3. **Given** the breadcrumb content is wider than its container, **When** the trail first appears, **Then** I can scroll horizontally and the default visible portion emphasizes the trailing (current) part of the path.
4. **Given** overflow, **When** I scroll, **Then** I can reach the leading segments without losing access to the current segment.

---

### Edge Cases

- **Long or many segments**: Trail remains usable via horizontal scroll; current context remains discoverable per User Story 3.
- **Dynamic names** (for example a trip renamed elsewhere): Trail shows the best available title for the current view; exact refresh behavior when data changes mid-session is left to implementation if not user-visible.
- **Routes without a clear sidebar parent**: Trail still reflects the logical hierarchy or named steps available in product copy; if a route is truly orphan, show a minimal sensible trail rather than an empty control.
- **Errors or blocking states**: Breadcrumbs may be hidden or reduced if there is no valid scoped route; must not claim a false location.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST show a breadcrumb trail for school-scoped dashboard routes that mirrors the hierarchy from school-scoped sidebar destinations through nested pages.
- **FR-002**: The trail MUST NOT include the active school’s name as a segment, because the school is already indicated in the school selector.
- **FR-003**: Each segment MUST use the human-readable name for that level (navigation label, entity title, or approved page title), not raw technical identifiers alone, except where the product explicitly uses an identifier as the user-visible label.
- **FR-004**: On large layouts, the trail MUST appear in the top application bar immediately after the sidebar expand/collapse control.
- **FR-005**: On small layouts, the top application bar MUST reserve its primary row for the school title (and related header actions as already defined by the shell); the breadcrumb trail MUST appear below that row.
- **FR-006**: When the trail overflows horizontally, the container MUST be scrollable, and the initial scroll position MUST reveal the end of the trail (current context on the side that matches the product’s reading direction—for left-to-right layouts, the right side).
- **FR-007**: Where multiple segments are shown, parent segments SHOULD be activatable for navigation to that level unless a route is not reachable that way; the current segment MUST NOT navigate away as if it were a parent.
- **FR-008**: All user-facing labels in this feature MUST follow Brazilian Portuguese (`pt-BR`) conventions for the dashboard, consistent with existing copy.
- **FR-009**: Changed UI areas MUST meet existing project quality expectations (linting, tests where applicable, and no new high-severity issues in CI).
- **FR-010**: Implementation work for this feature is scoped to `../sitio-dashboard` unless a separate API for titles is explicitly added later.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a sample of at least five distinct school-scoped routes (mix of top-level and nested), users can name their current area from the breadcrumb alone in informal testing (e.g. hallway test), with no segment incorrectly showing the school name.
- **SC-002**: On viewports classified as small in the product, observers can confirm the school title and breadcrumbs are not on the same row in 100% of checked pages carrying this feature.
- **SC-003**: On a deliberately long breadcrumb string, the current (last) segment is visible without user scrolling in 100% of checked cases after load.
- **SC-004**: All new or changed user-visible strings for this feature are in `pt-BR` and reviewed for clarity.
- **SC-005**: Automated tests and lint for touched code pass in the dashboard project’s pipeline.

## Assumptions

- The school-scoped sidebar and school selector from prior work remain the source of truth for which routes are “school-scoped” and how the active school is shown.
- “Large” vs “small” layout follows existing dashboard breakpoints; this spec does not fix pixel values.
- Trip names and similar middle segments come from data already loaded for the page or from existing APIs; fetching new backend fields only for breadcrumbs is out of scope unless already planned elsewhere.
- Accessibility for the trail (semantics, focus) should align with platform expectations and can be detailed during planning; no specific WCAG level is mandated in this specification.
