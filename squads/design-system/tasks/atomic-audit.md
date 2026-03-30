# atomic-audit

```yaml
task: atomicAudit()
agent: ds-architect
squad: design-system

inputs:
  - name: codebase_path
    type: string
    required: true
  - name: framework
    type: enum
    values: [react, vue, angular, html, svelte]
    default: react

outputs:
  - name: audit_report
    type: markdown
    destination: .aiox/design-system/{project}/atomic-audit-report.md
  - name: component_inventory
    type: json
    destination: .aiox/design-system/{project}/component-inventory.json

tools:
  - code-graph
  - grep
```

## Purpose

Audit an existing codebase to identify and classify UI elements according to Brad Frost's Atomic Design methodology. Produces a comprehensive inventory of atoms, molecules, organisms, templates, and pages, along with recommendations for consolidation.

## Workflow

### Phase 1: Discovery (Scan)
```yaml
steps:
  - scan_components: Glob for component files (*.tsx, *.vue, *.svelte, *.html)
  - scan_styles: Identify CSS/SCSS files and inline styles
  - scan_tokens: Check for existing design tokens or CSS custom properties
  - count_elements: Tally unique UI elements found
```

### Phase 2: Classification
```yaml
steps:
  - classify_atoms: Identify buttons, inputs, labels, icons, badges, tags
  - classify_molecules: Identify search bars, form fields, card headers, nav items
  - classify_organisms: Identify navigation bars, hero sections, footers, sidebars
  - classify_templates: Identify page layouts, grid systems
  - classify_pages: Identify specific page instances
```

### Phase 3: Analysis
```yaml
steps:
  - identify_duplicates: Find components that serve the same purpose with different implementations
  - identify_hardcoded: Find hardcoded colors, fonts, spacing (not using tokens)
  - identify_inconsistencies: Find similar components with inconsistent APIs or styling
  - measure_reuse: Calculate component reuse ratio across the codebase
  - assess_a11y_baseline: Quick check for ARIA attributes, alt texts, semantic HTML
```

### Phase 4: Report
```yaml
steps:
  - generate_inventory: Create JSON inventory of all components by atomic level
  - generate_recommendations: Prioritized list of consolidation opportunities
  - generate_migration_estimate: Estimated effort to systematize the current state
  - produce_report: Compile markdown audit report
```

## Output Schema

```yaml
ComponentInventory:
  project: string
  scanned_at: ISO 8601
  framework: string
  summary:
    total_components: number
    atoms: number
    molecules: number
    organisms: number
    templates: number
    pages: number
    duplicates: number
    hardcoded_values: number
  components:
    atoms: ComponentEntry[]
    molecules: ComponentEntry[]
    organisms: ComponentEntry[]
    templates: ComponentEntry[]
    pages: ComponentEntry[]
  recommendations:
    - priority: high|medium|low
      action: string
      components: string[]
      estimated_effort: string

ComponentEntry:
  name: string
  file: string
  uses_tokens: boolean
  has_a11y: boolean
  reuse_count: number
  variants: number
```

## Pre-Conditions

- [ ] Codebase path is accessible
- [ ] Framework type is known
- [ ] Project has UI components to audit

## Post-Conditions

- [ ] Audit report generated
- [ ] Component inventory JSON saved
- [ ] Recommendations prioritized by impact

## Acceptance Criteria

- [ ] All UI components discovered and classified by atomic level
- [ ] Duplicates and inconsistencies identified
- [ ] Hardcoded values flagged with file/line references
- [ ] Report includes actionable recommendations

## Quality Gate
- Threshold: >70%
- All UI components discovered and classified by atomic level (atoms, molecules, organisms)
- Component inventory JSON validates against the defined output schema
- Hardcoded values flagged with file and line references for each occurrence

---
*Design System Squad Task - ds-architect*
