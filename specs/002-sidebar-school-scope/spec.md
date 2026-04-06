# Feature Specification: School-Scoped Sidebar & Scope Control

**Feature Branch**: `002-sidebar-school-scope`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "UI and hierarchy: sidebar shows current school scope at top with favicon, school name, and secondary line (placeholder for future user id; auth out of scope). Scope control is clickable: recently accessed schools, search, and Add school redirecting to school create form. Dashboard is school-scoped. Sidebar links: Home (empty, content out of scope), Edit school info, Passengers, Payments."  
**Related specification**: `001-school-trip-payments` (domain flows, trip- and passenger-scoped payment rules)  
**Target Repositories**: `../sitio-dashboard` (primary: shell, navigation, scope control, and school-scoped routing entry points); `../sitio-backend` (only if new or extended APIs are required for school search, recent schools, or favicon resolution—see Assumptions)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See and understand the active school (Priority: P1)

As tourism company staff, I always see which school the dashboard is scoped to so that I do not confuse data between schools.

**Why this priority**: Wrong-school context is a high-severity operational mistake; orientation is foundational for every other task.

**Independent Test**: With a school selected, open any school-scoped screen and verify the scope control shows that school’s name and visual identity (favicon or agreed fallback) and a secondary line that does not imply authentication features are available yet.

**Acceptance Scenarios**:

1. **Given** the dashboard is scoped to a school, **When** staff view the shell, **Then** the scope control shows that school’s name and favicon (or fallback when no favicon exists) and a secondary description line using the agreed placeholder pattern until authenticated identity exists.
2. **Given** a school has no stored favicon, **When** staff view the scope control, **Then** the product shows a consistent fallback treatment that remains recognizable as the school row (not a broken image).

---

### User Story 2 - Switch or find a school without leaving the shell pattern (Priority: P2)

As staff who work with multiple schools, I can open a scope menu from the top of the sidebar, see schools I used recently, search across available schools, or start creating a new school.

**Why this priority**: Multi-school workflows are common; fast switching and discovery reduce navigation time and errors.

**Independent Test**: From a scoped dashboard, open the scope control, verify recent entries, search filtering, selection behavior, and that Add school leads to the school creation flow.

**Acceptance Scenarios**:

1. **Given** staff have accessed more than one school in the product, **When** they open the scope control, **Then** they see a recently accessed schools list ordered from most to least recent (within the limits defined in requirements).
2. **Given** many schools exist, **When** staff type in the search field, **Then** the list narrows to schools matching the query by the defined matching rules.
3. **Given** staff choose Add school from the scope control, **When** they activate it, **Then** they are taken to the school creation flow without losing the overall shell pattern.
4. **Given** staff select a different school from recent search or list, **When** the selection completes, **Then** the dashboard becomes scoped to that school and the scope control reflects it.

---

### User Story 3 - Navigate core school-scoped areas from the sidebar (Priority: P2)

As staff, I use the sidebar to move between Home, school settings, passenger-related work, and payment-related work while staying in the current school context.

**Why this priority**: Predictable information architecture reduces training cost and aligns with how staff describe their work (by school, then passengers and payments).

**Independent Test**: From a school-scoped shell, follow each sidebar link and verify destinations and that school context is preserved unless the flow explicitly changes scope.

**Acceptance Scenarios**:

1. **Given** a school is active, **When** staff choose Edit school info, **Then** they reach the school edit experience for that school.
2. **Given** a school is active, **When** staff choose Passengers, **Then** they reach the school-scoped entry point for passenger management defined in requirements (consistent with trip-scoped passenger work in the related domain specification).
3. **Given** a school is active, **When** staff choose Payments, **Then** they reach the school-scoped entry point for payment-related work defined in requirements (consistent with trip-scoped payment constraints in the related domain specification).
4. **Given** a school is active, **When** staff choose Home, **Then** they see the Home area for that school scope; initial release may show only an empty or placeholder state as specified.

---

### Edge Cases

- **No favicon**: School row still shows name and secondary line; visual fallback is consistent across the product.
- **Very long school names**: Scope control truncates or wraps in a way that does not break the sidebar layout; full name available via tooltip or expanded menu where appropriate.
- **No recent schools** (first visit or cleared storage): Recent list is empty or explains none yet; search and Add school remain available.
- **Search returns no schools**: Clear empty state; staff can still use Add school if permitted.
- **Single school only**: Search and recents still behave sensibly (search may return one row; recents may show one).
- **Switching school while unsaved work exists in main area**: Product defines whether to warn or scope-switch is blocked—default is to follow browser or app-level patterns already used elsewhere; if none exist, switching is allowed and staff accept risk until a dedicated unsaved-changes pattern is specified.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The shell MUST present a primary **scope control** at the top of the sidebar that always reflects the **currently active school** for the dashboard session.
- **FR-002**: The scope control MUST display the school’s **favicon** when available and a **consistent fallback** when not.
- **FR-003**: The scope control MUST display the school’s **display name** as the primary label.
- **FR-004**: The scope control MUST include a **secondary line** suitable for short contextual text. Until authentication exists, this line MUST show a **neutral placeholder** (for example fixed copy such as “Account information unavailable” or an em dash) rather than a real user identifier. The specification does not mandate exact wording; product copy in Brazilian Portuguese (`pt-BR`) is set during implementation.
- **FR-005**: Activating the scope control MUST open a **menu or panel** that includes: (a) **recently accessed schools** (most recent first, capped at a reasonable maximum such as five to ten entries unless product sets another cap), (b) **search** over schools the staff may open, and (c) a control to **add a new school** that navigates to the **school creation** flow.
- **FR-006**: **Authentication** and **real user identity** on the scope control are **out of scope** for this feature; only the **placeholder** behavior in **FR-004** is required.
- **FR-007**: **Home** in the sidebar MUST be present as a navigation target; **main Home content** (widgets, summaries) is **out of scope** and MAY be empty or a minimal placeholder until a future specification defines it.
- **FR-008**: The sidebar MUST include the following **navigation links** under the active school scope: **Home**, **Edit school info**, **Passengers**, **Payments** (labels in `pt-BR` in the product).
- **FR-009**: **Edit school info** MUST navigate to the **school edit** experience for the active school.
- **FR-010**: **Passengers** MUST navigate to the **school-scoped entry point** for passenger management. This MUST remain consistent with the domain rule that passenger tables are **trip-scoped** in the related specification: the entry point is at minimum the **school trip list** (or equivalent hub) from which staff open a trip’s passengers. If a future spec adds a school-wide passenger aggregate, this requirement will be updated explicitly.
- **FR-011**: **Payments** MUST navigate to a **school-scoped payment entry point** that respects the domain rule that **payment create, edit, and history** are **trip- and passenger-scoped** in the related specification (no global cross-school payment list). The entry point SHOULD surface **trip-level** paths into payment work (for example a trip list with **pending payment** indicators or filters, or another hub that only deep-links into trip context). Exact presentation is product choice; the requirement is that staff always reach payment tasks **without** violating trip-scoped payment rules.
- **FR-012**: All navigation and scope switching MUST preserve **school context** in the UX: after a scope change, sidebar links and URLs reflect the **new** school; staff MUST be able to see which school is active at all times (**FR-001**).
- **FR-013**: System MUST define observable quality constraints (linting, code style, or maintainability expectations) for changed components.
- **FR-014**: System MUST define user experience consistency constraints (terminology, interaction patterns, and visual behavior) for impacted flows.
- **FR-015**: System MUST ensure all user-facing interface copy is in Brazilian Portuguese (`pt-BR`) and define review criteria for language quality.
- **FR-016**: System MUST keep source code and technical specification content in English for implementation and maintenance consistency.
- **FR-017**: Specification MUST identify target implementation repositories in the shared parent folder and describe the scope split per repo (see header).

### Key Entities *(include if feature involves data)*

- **Active school scope**: The school currently governing dashboard routes and labels; drives which school’s trips, passengers, and payments staff manage.
- **Recent schools (client-side)**: Ordered list of schools the user opened recently for quick switching; persistence mechanism is an implementation detail but MUST be consistent per device/profile until authentication provides a server-side preference.
- **School summary for scope UI**: Name, favicon reference or resolved image, and identifiers needed to load edit and navigation targets—aligned with school entities in the related domain specification.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability tests or structured walkthroughs, **100%** of participants correctly identify the **active school** from the scope control without prompting after one minute of orientation.
- **SC-002**: Staff can **open the scope control**, **search**, and **select** a different school (or **Add school**) in **under 30 seconds** in typical conditions with fewer than 50 schools visible to search.
- **SC-003**: **95%** of attempted school switches from the scope control complete successfully (user ends on screens scoped to the chosen school) when the network and APIs behave normally.
- **SC-004**: Sidebar navigation reaches the **correct** school-scoped destination for **Home**, **Edit school info**, **Passengers**, and **Payments** with **no** cross-school data shown on first paint after navigation, verified by test cases per school.
- **SC-005**: All changed modules pass lint and no new high-severity static analysis issues are introduced.
- **SC-006**: New behavior is covered by automated tests where applicable (navigation, scope switch, empty and fallback states) and all related tests pass in CI.
- **SC-007**: Users complete scope switching and primary sidebar navigation without increased error rate versus an informal baseline on predecessor navigation, measured in moderated sessions or telemetry when available.
- **SC-008**: 100% of new or changed UI strings are in Brazilian Portuguese (`pt-BR`) and pass product review.

## Assumptions

- **Assumption — Repository split**: Primary implementation is in `../sitio-dashboard`. Backend changes are needed only if listing schools for search, resolving favicons, or persisting recents requires APIs not already provided by `001-school-trip-payments`; otherwise backend scope is minimal or none.
- **Assumption — Recent schools**: Stored **per browser profile** (local persistence) until authenticated cross-device preferences exist.
- **Assumption — Search**: Matches school **name** (and optionally other fields already exposed for school lists) with case-insensitive substring matching unless product later defines advanced search.
- **Assumption — Home**: Empty or minimal placeholder is acceptable; no KPI or feed content in this release.
- **Assumption — Alignment with 001**: Trip lists, passenger tables, and payment routes remain as defined in `001-school-trip-payments`; this specification only defines **where** sidebar links **enter** those graphs.
- **Assumption — Mobile**: Responsive behavior follows the same information architecture; deep mobile-specific gestures are not required unless already standard for the dashboard shell.

## Out of Scope

- User authentication, sign-in, and displaying real user id or profile on the scope control (placeholder only).
- Home dashboard content beyond an empty or minimal placeholder.
- Changing domain rules from `001-school-trip-payments` (for example creating a global payment list or altering trip-scoped payment rules).
- Application logo or global user avatar in the chrome (may remain out of scope per related specification unless explicitly added later).
