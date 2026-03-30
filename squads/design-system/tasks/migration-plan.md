# migration-plan

```yaml
task: migrationPlan()
agent: migration-planner
squad: design-system

inputs:
  - name: audit_report
    type: markdown
    required: true
    description: Atomic audit report of existing codebase
  - name: component_library
    type: object
    required: true
    description: Available design system component inventory
  - name: project_size
    type: enum
    values: [small, medium, large, enterprise]
    default: medium

outputs:
  - name: migration_plan
    type: markdown
    destination: .aiox/design-system/{project}/migration/migration-plan.md
  - name: migration_phases
    type: yaml
    destination: .aiox/design-system/{project}/migration/phases.yaml

tools:
  - code-graph
```

## Purpose

Create a comprehensive adoption plan for migrating an existing project to the design system. Defines phases, priorities, effort estimates, risk assessment, and ROI metrics. Ensures migration is incremental, backward-compatible, and measurable.

## Workflow

### Phase 1: Current State Assessment
```yaml
steps:
  - inventory_legacy: Count legacy components from audit report
  - map_to_ds: Map each legacy component to its design system equivalent
  - identify_gaps: List legacy components with no DS equivalent yet
  - calculate_coverage: Compute migration coverage percentage
  - assess_complexity: Rate complexity of each replacement (trivial/moderate/complex)
```

### Phase 2: Prioritization
```yaml
steps:
  - rank_by_reuse: Prioritize components used most frequently
  - rank_by_visibility: Prioritize user-facing over internal
  - rank_by_inconsistency: Prioritize components with most variant drift
  - rank_by_effort: Factor in replacement complexity
  - produce_ordered_list: Final prioritized migration backlog
```

### Phase 3: Phase Planning
```yaml
phases:
  - phase_0_foundation:
      scope: Token integration, CSS reset, base typography
      duration: 1-2 weeks
      risk: low
      description: "Lay foundation without changing any components"
  - phase_1_atoms:
      scope: Buttons, inputs, labels, icons, badges
      duration: 2-4 weeks
      risk: low
      description: "Replace atomic elements (highest reuse, lowest risk)"
  - phase_2_molecules:
      scope: Form fields, search bars, card headers, nav items
      duration: 3-6 weeks
      risk: medium
      description: "Replace molecule-level compositions"
  - phase_3_organisms:
      scope: Navigation, hero sections, footers, sidebars
      duration: 4-8 weeks
      risk: medium
      description: "Replace complex organisms"
  - phase_4_cleanup:
      scope: Remove legacy CSS, dead code, unused dependencies
      duration: 1-2 weeks
      risk: low
      description: "Clean up migration artifacts"
```

### Phase 4: Risk Mitigation
```yaml
steps:
  - identify_breaking_changes: List potential API differences
  - plan_coexistence: Define strategy for legacy + DS components coexisting
  - define_rollback: Define rollback procedure per phase
  - set_quality_gates: Define acceptance criteria per phase
```

### Phase 5: Metrics & ROI
```yaml
metrics:
  - adoption_rate: Percentage of components migrated over time
  - consistency_score: Visual consistency before/after
  - bundle_size: CSS/JS bundle size impact
  - dev_velocity: Time to build new components (before/after)
  - bug_rate: UI-related bug count (before/after)
  - a11y_score: Accessibility score improvement
```

## Migration Strategy: Strangler Fig

```
1. Wrap legacy components with DS-compatible API
2. Replace internals with DS component gradually
3. Remove legacy wrapper once all consumers migrate
4. Delete legacy CSS/JS
```

## Pre-Conditions

- [ ] Atomic audit completed
- [ ] Design system component library available
- [ ] Project stakeholders identified

## Post-Conditions

- [ ] Migration plan document with phased approach
- [ ] Phases YAML with timeline and dependencies
- [ ] ROI metrics defined and baseline captured

## Acceptance Criteria

- [ ] Every legacy component mapped to DS equivalent or flagged as gap
- [ ] Phases ordered by dependency and priority
- [ ] Effort estimates in T-shirt sizes (S/M/L/XL) per component
- [ ] Rollback strategy defined per phase
- [ ] Adoption metrics defined with baseline values

## Quality Gate
- Threshold: >70%
- Every legacy component mapped to a design system equivalent or flagged as gap
- Phases ordered by dependency with effort estimates (T-shirt sizes) per component
- Rollback strategy and adoption metrics defined with baseline values

---
*Design System Squad Task - migration-planner*
