# Feature Specification: School-Scoped Sidebar & Scope Control

**Feature Branch**: `002-sidebar-school-scope`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "UI and hierarchy: sidebar shows current school scope at top with favicon, school name, and secondary line (**placeholder username** until auth; auth out of scope). Scope row includes an **icon-only edit** control (no duplicate sidebar link). Scope control is clickable: recently accessed schools, search, and Add school redirecting to school create form. Dashboard is school-scoped. Sidebar links: **Home** (placeholder content out of scope), **Trips** (school trip list hub per **001**)."  
**Input (addendum 2026-04-06)**: On app initialization, **school selection** MUST follow this order of priority: (1) **last school accessed**, (2) **last school created** (when the first does not apply), (3) **school creation form** (when neither applies).  
**Related specification**: `001-school-trip-payments` (trip-scoped domain flows and data model)  
**Target Repositories**: `../sitio-dashboard` (primary: shell, navigation, scope control, and school-scoped routing entry points); `../sitio-backend` (only if new or extended APIs are required for school search, recent schools, or favicon resolution—see Assumptions)

## Clarifications

### Session 2026-04-06

- Q: When staff change the active school from the scope control while there is unsaved work in the main content area, what should the product do? → A: No special rule in this spec; defer entirely to whatever the dashboard already does when that exists (Option D).
- Q: On cold start, if the app cannot load the school data needed to apply FR-001, what must the product do before staff can work in a school-scoped shell? → A: Show a blocking error state with **retry** in the **main content area** only; keep the **sidebar** (including the **scope control**) visible so staff can still **switch school** or **add a school** when possible; do **not** set an active school or show school-scoped **main** content until required data loads successfully (extends Option A).
- Q: What fixed maximum should this release use for the “recently accessed schools” list (FR-006)? → A: **10** schools maximum (Option C).
- Q: If the route or URL encodes a school id that the server does not recognize (deleted school, typo, or stale bookmark), what must happen when that screen loads? → A: Show a blocking error with **retry** in the **main content area** only; keep the **sidebar** and **scope control** usable so staff can **search**, pick **another school**, or **add a school**; do **not** silently scope to another school via **FR-001** (Option B revised).
- Q: Should there be a visible **app root** landing at `/` for recovery? → A: **No.** The **`/`** route MUST **not** be a dedicated staff **landing** screen; it MUST **resolve** using **FR-001** (auto-select school or navigate to **school creation**) or show **FR-019** in **main content** while keeping the shell as above.
- Q: What accessibility standard must new or changed UI for this feature meet? → A: **No separate WCAG level** in this spec; **match** the existing dashboard accessibility baseline and components (Option C).
- Q: Where should school edit appear, and what should the secondary line under the school name show? → A: **No** “Edit school info” item in the **sidebar**; an **edit icon** on the **scope header row** (alongside favicon and school name) opens **school edit**. The secondary line shows a **placeholder username** (non-real; layout only) until authenticated identity exists.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Land with the correct school on app start (Priority: P1)

As tourism company staff, when I open the dashboard, I am placed in a sensible school context without extra steps when data exists, or I am taken to create a school when none exists.

**Why this priority**: Wrong or missing initial scope blocks every downstream task; resolving it automatically matches how staff expect “continue where I left off” to work.

**Independent Test**: Clear local “last accessed” state, seed schools with known creation order, and cold-start the app under each priority branch; verify scope matches the rules without manual selection.

**Acceptance Scenarios**:

1. **Given** a **last accessed** school is recorded and that school **still exists**, **When** the app initializes, **Then** the dashboard is scoped to that school and the scope control reflects it.
2. **Given** **no** usable last-accessed school (none recorded, or recorded id no longer exists), **and** at least one school exists in the system, **When** the app initializes, **Then** the dashboard is scoped to the **most recently created** school (by authoritative creation ordering).
3. **Given** **no** school exists in the system, **When** the app initializes, **Then** staff are taken to the **school creation** flow (not a broken or empty scoped shell).
4. **Given** last accessed pointed to a school that was **removed** since the last visit, **When** the app initializes, **Then** the product does **not** stay stuck on the missing school; it **falls through** to **last created** if any school exists, otherwise to **school creation**.
5. **Given** **initialization** needs **server data** to apply **FR-001** (for example to confirm last accessed still exists, resolve **last created**, or confirm **no schools** exist) but that data **cannot be loaded** due to **network or API failure**, **When** the app initializes, **Then** staff see a **blocking error** with **retry** in the **main content area**, the **sidebar** (including **scope control**) remains available for recovery actions where data allows, and the product does **not** show **school-scoped main** content with an **assumed** active school (**FR-019**).
6. **Given** the loaded route references a **school id** that the server **does not recognize** (for example deleted school or stale deep link), **When** the screen resolves, **Then** staff see a **blocking error** with **retry** in the **main content area**, the **sidebar** and **scope menu** remain usable to pick **another school** or **add a school**, and the product does **not** silently scope to a **different** school using **FR-001** alone (**FR-020**).

---

### User Story 2 - See and understand the active school (Priority: P1)

As tourism company staff, I always see which school the dashboard is scoped to so that I do not confuse data between schools.

**Why this priority**: Wrong-school context is a high-severity operational mistake; orientation is foundational for every other task.

**Independent Test**: With a school selected, open any school-scoped screen and verify the scope control shows that school’s **title** and visual identity (favicon or agreed fallback), a **placeholder username** on the secondary line, and that **real** sign-in identity is not implied.

**Acceptance Scenarios**:

1. **Given** the dashboard is scoped to a school, **When** staff view the shell, **Then** the scope control shows that school’s **title** and favicon (or fallback when no favicon exists) and a **secondary line** with a **placeholder username** (non-authoritative stub until authenticated identity exists).
2. **Given** a school has no stored favicon, **When** staff view the scope control, **Then** the product shows a consistent fallback treatment that remains recognizable as the school row (not a broken image).

---

### User Story 3 - Switch or find a school without leaving the shell pattern (Priority: P2)

As staff who work with multiple schools, I can open a scope menu from the top of the sidebar, see schools I used recently, search across available schools, or start creating a new school.

**Why this priority**: Multi-school workflows are common; fast switching and discovery reduce navigation time and errors.

**Independent Test**: From a scoped dashboard, open the scope control, verify recent entries, search filtering, selection behavior, and that Add school leads to the school creation flow.

**Acceptance Scenarios**:

1. **Given** staff have accessed more than one school in the product, **When** they open the scope control, **Then** they see a recently accessed schools list ordered from most to least recent (within the limits defined in requirements).
2. **Given** many schools exist, **When** staff type in the search field, **Then** the list narrows to schools matching the query by the defined matching rules.
3. **Given** staff choose Add school from the scope control, **When** they activate it, **Then** they are taken to the school creation flow without losing the overall shell pattern.
4. **Given** staff select a different school from recent search or list, **When** the selection completes, **Then** the dashboard becomes scoped to that school and the scope control reflects it.

---

### User Story 4 - Navigate core school-scoped areas from the sidebar (Priority: P2)

As staff, I use the sidebar to move between **Home** and **Trips** while staying in the current school context; I edit school details from the **scope header** via the **edit icon**, not from a sidebar link.

**Why this priority**: Predictable information architecture reduces training cost and aligns with how staff describe their work (by school, then trips).

**Independent Test**: From a school-scoped shell, follow each sidebar link and the **scope edit icon**; verify destinations and that school context is preserved unless the flow explicitly changes scope.

**Acceptance Scenarios**:

1. **Given** a school is active, **When** staff activate the **school edit icon** on the **scope header row** (icon only; **no** sidebar text link for this action), **Then** they reach the school edit experience for that school (**FR-010**).
2. **Given** a school is active, **When** staff choose **Trips**, **Then** they reach the school-scoped **trip list** for that school (**FR-011**), consistent with the related domain specification.
3. **Given** a school is active, **When** staff choose **Home**, **Then** they see the Home area for that school scope; initial release may show only an empty or placeholder state as specified (**FR-008**).

---

### Edge Cases

- **Initialization — tie on “last created”**: If two schools share the same creation granularity, the product MUST use a single deterministic rule (for example server-defined ordering or stable id) so tests and support can reproduce behavior.
- **Initialization — empty tenant**: No schools exist → **school creation form** per priority rule; scope control shows appropriate empty or post-create state once a school exists.
- **Initialization — required data unavailable**: If **network or API failure** prevents loading the **minimum server data** needed to apply **FR-001** (validate last accessed, resolve **last created**, or confirm **zero schools**), the product MUST show a **blocking error** with **retry** in **main content** and MUST **not** enter **school-scoped main** content with a **guessed** school (**FR-019**); the **sidebar** stays available per **FR-019**.
- **Routing — unrecognized school id**: If a **school-scoped** route or URL names a **school id** that the server **does not recognize**, the product MUST follow **FR-020** (blocking error in **main content**; **no** silent substitution from **FR-001**; **sidebar** / **scope menu** usable). This is **distinct** from **FR-001** step (1) when **last accessed** points at a **removed** school **without** a conflicting deep-linked id: there **FR-001** fall-through to **last created** or **school creation** still applies.
- **No favicon**: School row still shows **title** and secondary line; visual fallback is consistent across the product.
- **Very long school titles**: Scope control truncates or wraps in a way that does not break the sidebar layout; full **title** available via tooltip or expanded menu where appropriate.
- **No recent schools** (first visit or cleared storage): Recent list is empty or explains none yet; search and Add school remain available.
- **Search returns no schools**: Clear empty state; staff can still use Add school if permitted.
- **Single school only**: Search and recents still behave sensibly (search may return one row; recents may show one).
- **Switching school while unsaved work exists in main area**: **Not mandated by this specification** — warn, block, or allow without prompt follows the **dashboard-wide unsaved-changes convention** when one exists for equivalent navigation; if none exists yet, implementation may choose freely until a separate cross-cutting specification defines it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On **app initialization** (cold load or full reload into the dashboard), **when** the **initial navigation** is **not** governed by **FR-020** (unrecognized school id in route), **once the minimum data required to evaluate the following steps is successfully available** (see **FR-019** for failure handling), the product MUST select the active school in this **strict priority order**: (1) **Last school accessed** — the school recorded as most recently active for this staff workflow on this **device / browser profile** (same notion as “last accessed” used for scope continuity), **if** that school **still exists** in the system; (2) **Last school created** — if step (1) does not yield a school, scope to the school with the **latest creation time** among all schools **visible to the product in this release** (global list for the deployment; no per-user permission layer in scope for this spec); (3) **School creation form** — if **no** school exists, navigate staff to the **school creation** flow instead of showing a school-scoped shell with no school. The **`/`** (**app root**) route MUST apply the **same** resolution: **redirect** to the chosen **`/schools/{schoolId}`** route, to **school creation**, or to the **FR-019** error state in **main content**—it MUST **not** be implemented as a standalone **visible root landing** page for staff when the dashboard shell is shown.
- **FR-019**: If **initialization** cannot load the **minimum server data** needed to apply **FR-001** (for example: confirm whether the **last accessed** id still exists, determine **last created** among schools, or confirm **no schools** exist) due to **network or API failure**, the product MUST show a **blocking error** with **retry** in the **main content area** only; the **sidebar** (including the **scope control** and, when the schools list is available, the **scope menu** per **FR-006**) MUST remain **visible** so staff can **switch school** or **add a school** without a separate **root landing** screen. The product MUST **not** set an **active school** or present **school-scoped** main content based on **local guesses alone**.
- **FR-020**: When a **school-scoped** route or URL carries a **school id** that the server **does not recognize** (including **deleted** schools), the product MUST show a **blocking error** with **retry** in the **main content area** only; the **sidebar** MUST remain **visible** and the **scope control** MUST remain **usable** so staff can **search**, select **another school**, or use **add a new school** (**FR-006**). The product MUST **not** automatically scope the dashboard to a **different** school by applying **FR-001** priority rules **in place of** resolving that id. Recovery MUST **not** rely on navigating to a dedicated **visible `/` landing**; staff recover via **scope menu**, **retry**, or **school creation**—not by substituting scope silently.
- **FR-002**: The shell MUST present a primary **scope control** at the top of the sidebar that always reflects the **currently active school** for the dashboard session whenever a school is active (**FR-001**).
- **FR-003**: The scope control MUST display the school’s **favicon** when available and a **consistent fallback** when not.
- **FR-004**: The scope control MUST display the school’s **`title`** as the primary label (the human-facing School field from `001-school-trip-payments`; there is **no** separate persisted `name` column—informal phrases such as “display name” or “school name” in UX copy refer to this **`title`** value).
- **FR-005**: The scope control MUST include a **secondary line** suitable for short contextual text. Until authentication exists, this line MUST show a **placeholder username** (a **non-authoritative** display name used for layout and future identity shape—not a **real** authenticated user). The specification does not mandate exact wording; product copy in Brazilian Portuguese (`pt-BR`) is set during implementation.
- **FR-006**: Activating the scope control MUST open a **menu or panel** that includes: (a) **recently accessed schools** (most recent first, **at most 10** entries; older entries fall off), (b) **search** over schools the staff may open, and (c) a control to **add a new school** that navigates to the **school creation** flow.
- **FR-007**: **Authentication** and **binding** the secondary line to **real user identity** are **out of scope** for this feature; only the **placeholder username** behavior in **FR-005** is required.
- **FR-008**: **Home** in the sidebar MUST be present as a navigation target; **main Home content** (widgets, summaries) is **out of scope** and MAY be empty or a minimal placeholder until a future specification defines it.
- **FR-009**: The sidebar MUST include the following **navigation links** under the active school scope: **Home**, **Trips** (labels in `pt-BR` in the product). The sidebar MUST **not** include a separate **Edit school info** text link.
- **FR-010**: **School edit** MUST be reachable via an **icon-only** control on the **scope header row** (alongside the school identity; **no** accompanying **sidebar** label required for this action). Activating that control MUST navigate to the **school edit** experience for the active school.
- **FR-011**: **Trips** MUST navigate to the **school-scoped trip list** for the active school (for example `/schools/{schoolId}/trips`), consistent with **001-school-trip-payments**. Further trip drill-down remains as defined in **001**; **002** does **not** add additional top-level sidebar targets beyond **FR-009**.
- **FR-012**: *(Unused in this release; reserved for future sidebar IA.)*
- **FR-013**: All navigation and scope switching MUST preserve **school context** in the UX: after a scope change, sidebar links and URLs reflect the **new** school; staff MUST be able to see which school is active at all times (**FR-002**).
- **FR-014**: System MUST define observable quality constraints (linting, code style, or maintainability expectations) for changed components.
- **FR-015**: System MUST define user experience consistency constraints (terminology, interaction patterns, and visual behavior) for impacted flows.
- **FR-021**: New and changed UI for this feature MUST align with the **dashboard’s existing accessibility baseline** (design system, components, and documented practices). This specification does **not** set a **separate** WCAG conformance level; any **level** is inherited from the **parent product** standards.
- **FR-016**: System MUST ensure all user-facing interface copy is in Brazilian Portuguese (`pt-BR`) and define review criteria for language quality.
- **FR-017**: System MUST keep source code and technical specification content in English for implementation and maintenance consistency.
- **FR-018**: Specification MUST identify target implementation repositories in the shared parent folder and describe the scope split per repo (see header).

### Key Entities *(include if feature involves data)*

- **Active school scope**: The school currently governing dashboard routes and labels; drives which school’s trips (and downstream trip-scoped work in **001**) staff manage from this shell.
- **Last accessed school (initialization)**: The school last confirmed as active for this browser profile; MUST align with the **most recent** entry used for **FR-001** step (1) and with updating **recent schools** when staff work in a scoped dashboard.
- **Recent schools (client-side)**: Ordered list of schools the user opened recently for quick switching, **retaining at most 10** entries (**FR-006**); persistence mechanism is an implementation detail but MUST be consistent per device/profile until authentication provides a server-side preference.
- **School summary for scope UI**: **`title`** (display label), favicon reference or resolved image, and identifiers needed to load edit and navigation targets—aligned with school entities in the related domain specification.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability tests or structured walkthroughs, **100%** of participants correctly identify the **active school** from the scope control without prompting after one minute of orientation.
- **SC-002**: Staff can **open the scope control**, **search**, and **select** a different school (or **Add school**) in **under 30 seconds** in typical conditions with fewer than 50 schools visible to search.
- **SC-003**: **95%** of attempted school switches from the scope control complete successfully (user ends on screens scoped to the chosen school) when the network and APIs behave normally.
- **SC-004**: Navigation reaches the **correct** school-scoped destination for **Home** and **Trips** from the **sidebar**, and **school edit** from the **scope edit icon**, with **no** cross-school data shown on first paint after navigation, verified by test cases per school.
- **SC-005**: All changed modules pass lint and no new high-severity static analysis issues are introduced.
- **SC-006**: New behavior is covered by automated tests where applicable (navigation, scope switch, **app initialization priority**, **initialization blocking error** when required data cannot load (**FR-019**), **unrecognized school id in route** (**FR-020**), empty and fallback states) and all related tests pass in CI.
- **SC-007**: Users complete scope switching and primary sidebar navigation without increased error rate versus an informal baseline on predecessor navigation, measured in moderated sessions or telemetry when available.
- **SC-008**: 100% of new or changed UI strings are in Brazilian Portuguese (`pt-BR`) and pass product review.
- **SC-009**: In **cold-start** tests covering all three **FR-001** branches (last accessed valid, fallback to last created, empty database → creation flow), **100%** of runs land on the **expected** screen with **no** manual school pick **when** the scenario matches that branch.
- **SC-010**: New or changed surfaces in this feature are implemented with the **same accessibility expectations** as the rest of the dashboard (**FR-021**), verified by the **same** review or automated checks the project already applies to comparable UI.

## Assumptions

- **Assumption — Repository split**: Primary implementation is in `../sitio-dashboard`. Backend changes are needed only if listing schools for search, resolving favicons, or persisting recents requires APIs not already provided by `001-school-trip-payments`; otherwise backend scope is minimal or none.
- **Assumption — Initialization “last created”**: **Creation time** comes from the **authoritative persisted** school record (server-defined ordering); ties use a **deterministic** secondary key as noted in Edge Cases.
- **Assumption — Recent schools**: Stored **per browser profile** (local persistence) until authenticated cross-device preferences exist.
- **Assumption — Search**: Matches school **`title`** (and optionally other fields already exposed for school lists) with case-insensitive substring matching unless product later defines advanced search.
- **Assumption — Home**: Empty or minimal placeholder is acceptable; no KPI or feed content in this release.
- **Assumption — Alignment with 001**: Trip lists and downstream flows remain as defined in `001-school-trip-payments`; **002** defines **Home** and **Trips** sidebar entry under `/schools/{schoolId}/...`.
- **Assumption — Mobile**: Responsive behavior follows the same information architecture; deep mobile-specific gestures are not required unless already standard for the dashboard shell.
- **Assumption — Accessibility**: **WCAG** level (if any) and **accessibility** requirements for this work follow the **dashboard’s existing** baseline and components (**FR-021**); this feature does not introduce a **new** standalone conformance target.

## Out of Scope

- Defining **warn / block / allow** behavior for **unsaved edits** when changing active school from the scope control (follows existing dashboard conventions when available; see **Clarifications**).
- User authentication, sign-in, and **binding** the scope control’s secondary line to **real** user id or profile (**placeholder username** only; **FR-005**, **FR-007**).
- Home dashboard content beyond an empty or minimal placeholder.
- Changing domain rules from `001-school-trip-payments` (for example altering trip-scoped flows).
- Application logo or global user avatar in the chrome (may remain out of scope per related specification unless explicitly added later).
