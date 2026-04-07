# Feature Specification: School scope selector (sidebar)

**Feature**: `002-sidebar-school-scope`  
**Status**: Draft  
**Target**: `../sitio-dashboard` (primary). Backend only if existing school APIs are insufficient for search/list—see Assumptions.

## Overview

Staff work in the context of one school at a time. The **school scope selector** sits at the **top of the sidebar**. It shows which school is active, lets staff search and pick another school or use recents, and drives **application-wide** scope to `/schools/{schoolId}` when a school is chosen.

This specification does **not** define other sidebar items, the top bar, breadcrumbs, or main-area page content beyond what is required for initialization and invalid-route handling.

## User scenarios & testing

### P1 — Correct school on app start

As staff, when I open the dashboard, I land in a sensible school context when data allows, or I am directed to create a school when none exist.

**Acceptance**

1. **Last accessed** school is applied when it is recorded and still exists (see Initialization).
2. If step 1 does not apply and at least one school exists, the active school is the **most recently created** school (deterministic ordering if ties).
3. If no school exists, I am taken to the **school creation** flow—not a broken scoped shell.
4. If **last accessed** pointed to a removed school, behavior falls through: **last created** if any school exists, otherwise **school creation**.
5. If **minimum server data** to run initialization cannot load (network/API failure), I see a **blocking error with retry** in the **main content**; I do **not** see guessed school-scoped content. The **sidebar** (including the scope selector) stays available where data allows so I can recover.
6. If the URL names a **school id the server does not recognize**, I see a **blocking error with retry** in the **main content**; I do **not** silently get a different school from initialization rules alone. The **sidebar** and **scope selector** stay usable to pick another school when possible.

### P1 — See the active school

As staff, I always see which school the app is scoped to.

**Acceptance**

1. When a school is active, the selector shows that school’s **title** and **favicon** (or a consistent fallback if none).
2. A **secondary line** shows **placeholder** text for the signed-in user (real identity and auth are **out of scope**).

### P2 — Open the selector and change school

As staff, I open the selector, search, use recents, and pick a school.

**Acceptance**

1. The selector shows a **chevron** (or equivalent) indicating it can be opened.
2. **On click**, the selector **expands** (in place in the sidebar) to show: a **search field**, **search results**, and **recent schools** (ordered most recent first, **at most 10** recents).
3. Choosing a school navigates to **`/schools/{schoolId}`** (or equivalent product route) and the **whole application** treats that school as active.
4. Search matches school **title** with case-insensitive substring matching unless product later defines otherwise.

## Requirements

### Initialization (cold load / full reload)

- **INIT-1**: When navigation is **not** governed by **INIT-3** (invalid school in URL), and **minimum data** to evaluate the steps is available, the product selects the active school in this order: (1) **last accessed** if recorded and school still exists; (2) else **last created** among visible schools; (3) else **no school** → **school creation** flow. The **app root** route applies the same resolution (redirect to scoped school, creation, or error state)—**not** a dedicated marketing-style landing.
- **INIT-2**: If minimum data for **INIT-1** cannot load, show **blocking error + retry** in **main content** only; do not show school-scoped main content based on local guesses. Sidebar including the selector remains visible for recovery when possible.
- **INIT-3**: If the route carries an **unrecognized** school id, show **blocking error + retry** in **main content**; do **not** substitute another school via **INIT-1** alone. Recovery via selector/search when possible.

### Scope selector (sidebar top)

- **SEL-1**: The selector reflects the **currently active school** whenever one is active.
- **SEL-2**: Shows school **title** (human-facing name field aligned with the school domain model).
- **SEL-3**: Shows **favicon** when available; **consistent fallback** when not.
- **SEL-4**: Secondary line: **placeholder** user label until real auth exists (wording in `pt-BR` at implementation time).
- **SEL-5**: **Chevron** (or equivalent affordance) shows the control is expandable.
- **SEL-6**: **Click** expands **in the sidebar** to show **search**, **search results**, and **recents** (max **10** recents).
- **SEL-7**: Selecting a school updates navigation to **`/schools/{schoolId}`** and **application-wide** scope to that school.
- **SEL-8**: **Authentication** and real user name on the secondary line are **out of scope** (placeholder only).

### Product quality (minimal)

- **Q-1**: User-facing copy for this feature is **Brazilian Portuguese** (`pt-BR`).
- **Q-2**: New UI aligns with the **existing dashboard accessibility baseline** (no new WCAG tier mandated here).

## Out of scope

- **Other sidebar entries** (Home, Trips, settings, edit school, add school as separate rows, theme toggle, etc.).
- **Top bar**, **breadcrumbs**, and **main area** content except **initialization error** and **invalid school id** states described above.
- **Real** signed-in identity on the secondary line.
- **Unsaved changes** when switching school (follow existing product behavior when present).
- Domain rules for trips/passengers/payments (**001**); this spec only defines **school scope** and **selector** behavior.

## Success criteria

- **SC-1**: In walkthroughs, participants identify the **active school** from the selector without help after brief orientation.
- **SC-2**: Typical **open selector → search → pick school** completes in **under 30 seconds** with a moderate school list.
- **SC-3**: **≥95%** of school picks from the selector succeed (user ends in UI scoped to that school) when network/API are healthy.
- **SC-4**: **Cold-start** tests for all **INIT-1** branches pass **100%** when scenarios match (valid last accessed, fallback to last created, empty → creation).
- **SC-5**: Automated tests cover initialization, invalid-route handling, selector open/search/select, and recents cap where feasible.

## Assumptions

- **Recents** persist **per browser profile** until server-backed preferences exist.
- **“Last created”** uses authoritative server ordering; ties resolved **deterministically** (e.g. stable id).
- **Search** uses school list data already available to the client or via existing APIs.
- **Responsive** behavior follows the same IA; no separate mobile spec unless the shell already defines one.

## Key entities

- **Active school**: School governing routes and labels for the session.
- **Last accessed**: Last school confirmed active for this profile (for **INIT-1**).
- **Recents**: Up to **10** recently opened schools for quick switch.
