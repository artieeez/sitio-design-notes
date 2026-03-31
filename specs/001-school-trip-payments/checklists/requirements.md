# Specification Quality Checklist: School Trip Payment & Passenger Status

**Purpose**: Validate specification completeness and quality before proceeding to planning  
**Created**: 2026-03-29  
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Validation pass: 2026-03-29 — spec meets checklist; assumptions document share-link vs login and out-of-scope checkout.

---

# Requirements writing quality (unit tests for English)

**Purpose**: Validate clarity, completeness, consistency, and measurability of requirements as written—not implementation behavior.  
**Created**: 2026-03-30  
**Feature**: [spec.md](../spec.md) · [plan.md](../plan.md) · [tasks.md](../tasks.md)

## Requirement completeness

- [ ] CHK001 Are navigation requirements for schools → trips → trip detail stated explicitly enough to exclude ambiguous alternate hierarchies? [Completeness, Spec §FR-001, User Story 1]
- [ ] CHK002 Are all passenger status dimensions (payment vs document vs other pending actions) enumerated or clearly bounded where “other” applies? [Completeness, Spec §FR-002, Assumptions]
- [ ] CHK003 Are both share-link scopes (trip-scoped and school-scoped) defined with the same level of behavioral detail? [Completeness, Spec §FR-003, §FR-011, §FR-013]
- [ ] CHK004 Are read-only constraints for school-facing channels specified for every mutation class that must be impossible (payments, merges, flags, internal fields)? [Completeness, Spec §FR-004, §FR-012]
- [ ] CHK005 Is ingestion of integration-sourced vs manually entered payments covered as a single coherent requirement set without gaps? [Completeness, Spec §FR-005, §FR-018, Clarifications]
- [ ] CHK006 Are duplicate-payment and double-application scenarios addressed alongside normal match flows? [Completeness, Spec §FR-009, Edge Cases]
- [ ] CHK007 Are CSV/Excel import rules (all-or-nothing, preview, help) specified as one traceable requirement block? [Completeness, Spec §FR-016, User Story 1]
- [ ] CHK008 Are manual single-passenger and manual single-payment requirements distinguished so their lifecycles do not blur? [Completeness, Spec §FR-017, §FR-018]

## Requirement clarity

- [ ] CHK009 Is “status-only” for school-facing views defined with an explicit exclusion list (amounts, methods, transaction identifiers, payer data) consistent across requirements? [Clarity, Spec §FR-012, Edge Cases]
- [ ] CHK010 Is “trip-first navigation” for school-scoped links defined precisely enough to rule out mixed unstructured lists? [Clarity, Spec §FR-013, User Story 2]
- [ ] CHK011 Is share-link expiration described with an “allowed option set” and a “secure default” without leaving policy entirely implicit? [Clarity, Ambiguity, Spec §FR-014, Clarifications]
- [ ] CHK012 Is the immutable audit record for reassignment specified with required fields only (actor, time, from, to, reason) or are additional audit fields allowed without contradiction? [Clarity, Spec §FR-015]
- [ ] CHK013 Are qualitative terms like “clear,” “obvious,” or “understandable” tied to any measurable or reviewable acceptance hooks? [Clarity, Spec §Success Criteria, Edge Cases]
- [ ] CHK014 Is “create passenger from payment” scoped to trip selection, required staff input, and audit expectations in one unambiguous flow description? [Clarity, Spec §FR-019, User Story 3]

## Requirement consistency

- [ ] CHK015 Do terminology choices (“passenger” vs “student”) remain consistent across staff vs school-facing narratives without conflicting obligations? [Consistency, Spec Key Entities, User Story 2]
- [ ] CHK016 Do share-link scope boundaries align between trip-scoped and school-scoped descriptions and the edge case about wide sharing? [Consistency, Spec §FR-011, Edge Cases]
- [ ] CHK017 Do reconciliation requirements (verify, match, reassign, flag) align with audit event expectations without duplicate or conflicting obligations? [Consistency, Spec §FR-006–§FR-009, §FR-015, Key Entities]

## Acceptance criteria quality

- [ ] CHK018 Can success criterion SC-001 be verified without relying on undefined “trip data is complete”? [Measurability, Spec §SC-001, Assumptions]
- [ ] CHK019 Is SC-002’s usability bar (e.g. 90%) tied to a defined test population, task script, or validation owner in requirements? [Measurability, Gap, Spec §SC-002]
- [ ] CHK020 Is SC-003 scoped to “controlled test scenarios” with enough definition to avoid subjective pass/fail? [Measurability, Spec §SC-003]
- [ ] CHK021 Is SC-004’s “within one minute” findability criterion paired with defined starting conditions (e.g. labeled test data) in the spec? [Measurability, Spec §SC-004]

## Scenario coverage

- [ ] CHK022 Are primary staff journeys (roster intake, trip review, reconciliation) distinguished from school share-link journeys in requirements without overlap holes? [Coverage, User Stories 1–3]
- [ ] CHK023 Are exception flows for invalid/expired/revoked links specified at the same depth as happy-path link usage? [Coverage, Spec §FR-010, User Story 2]
- [ ] CHK024 Are recovery or deferral paths described when imports fail entirely or staff must retry (requirements-level, not UI mechanics)? [Coverage, Edge Cases, Spec §FR-016]

## Edge case coverage

- [ ] CHK025 Are malformed import files covered with the same all-or-nothing semantics as partial validation failures? [Edge Case, Spec Edge Cases, §FR-016]
- [ ] CHK026 Is the “payment before passenger exists” scenario requirement-complete for dismissal/archive vs indefinite visibility? [Edge Case, Gap, Spec Edge Cases, tasks.md T056]
- [ ] CHK027 Are cancellation/removal scenarios for trips or passengers specified without contradicting “no orphaned confusing states”? [Edge Case, Spec Edge Cases, tasks.md T057]

## Non-functional requirements (as specifications)

- [ ] CHK028 Are language/locale obligations (e.g. pt-BR operator copy) stated only where they are requirements vs implementation notes? [Consistency, Spec §FR-016, Plan §Constraints]
- [ ] CHK029 Are security/privacy boundaries for share links expressed as requirements independent of backend mechanism? [Completeness, Spec §FR-010–§FR-012, Plan §Constraints]
- [ ] CHK030 Is automated testing mandated in the spec aligned with measurable story completion criteria (not only tooling names)? [Traceability, Spec “Automated verification”, Plan §Testing]

## Dependencies and assumptions

- [ ] CHK031 Are assumptions about checkout scope, staff auth, and future school logins explicit enough to avoid scope creep? [Assumption, Spec §Assumptions]
- [ ] CHK032 Are “defined at implementation time” items (file types, field lists) enumerated as assumptions with an owner or follow-up? [Assumption, Gap, Spec §Assumptions]
- [ ] CHK033 Does the spec state dependencies on external integration field availability without contradicting status-only school views? [Dependency, Assumption, Spec §Assumptions, §FR-012]

## Ambiguities and conflicts

- [ ] CHK034 Are any remaining [NEEDS CLARIFICATION] markers or placeholder tokens absent from normative requirements? [Traceability, Spec §Clarifications]
- [ ] CHK035 Does feature status (e.g. Draft) reflect governance expectations versus plan/tasks readiness, or is that transition documented? [Consistency, Spec header, Plan §Constitution Check]
