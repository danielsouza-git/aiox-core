# pattern-extract

```yaml
task: patternExtract()
agent: ds-architect
squad: design-system

inputs:
  - name: audit_report
    type: markdown
    required: true
  - name: component_inventory
    type: json
    required: true
  - name: priority
    type: enum
    values: [high, medium, all]
    default: high

outputs:
  - name: pattern_specs
    type: markdown
    destination: .aiox/design-system/{project}/patterns/
  - name: extraction_plan
    type: yaml
    destination: .aiox/design-system/{project}/extraction-plan.yaml

tools:
  - code-graph
  - grep
```

## Purpose

Extract recurring UI patterns from an existing codebase into reusable, token-driven component specifications. Uses the audit report to identify consolidation targets and produces detailed specs for the component-builder to implement.

## Workflow

### Phase 1: Pattern Identification
```yaml
steps:
  - analyze_duplicates: Review duplicate components from audit
  - identify_recurring: Find patterns used in 3+ places
  - group_variants: Cluster similar components into pattern families
  - rank_impact: Score patterns by reuse potential and consistency gain
```

### Phase 2: Specification
```yaml
steps:
  - define_api: Specify props, slots, events for each pattern
  - define_tokens: Map each visual property to a design token
  - define_variants: List all valid variant combinations (size, state, theme)
  - define_composition: Describe how pattern composes with others
  - define_a11y: Specify ARIA requirements, keyboard behavior
```

### Phase 3: Extraction Plan
```yaml
steps:
  - order_by_dependency: Sort patterns bottom-up (atoms first)
  - estimate_effort: T-shirt size per pattern (S/M/L)
  - identify_blockers: Note any patterns requiring token additions
  - create_plan: Produce sequenced extraction plan
```

## Output Schema

```yaml
ExtractionPlan:
  project: string
  created_at: ISO 8601
  patterns:
    - name: string
      level: atom|molecule|organism
      priority: high|medium|low
      effort: S|M|L
      source_files: string[]
      reuse_count: number
      spec_file: string
      depends_on: string[]
      blockers: string[]
```

## Pre-Conditions

- [ ] Atomic audit completed
- [ ] Component inventory available

## Post-Conditions

- [ ] Pattern specs generated per component
- [ ] Extraction plan ordered by dependency
- [ ] Each spec includes token mappings and a11y requirements

## Acceptance Criteria

- [ ] All high-priority patterns have detailed specs
- [ ] Specs include complete prop/token/a11y definitions
- [ ] Extraction plan is dependency-ordered
- [ ] Effort estimates provided for planning

## Quality Gate
- Threshold: >70%
- All high-priority patterns have detailed specs with prop, token, and a11y definitions
- Extraction plan is dependency-ordered (atoms before molecules before organisms)
- Each pattern spec includes complete token mappings and ARIA requirements

---
*Design System Squad Task - ds-architect*
