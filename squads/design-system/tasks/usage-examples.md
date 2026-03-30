# usage-examples

```yaml
task: usageExamples()
agent: ds-documenter
squad: design-system

inputs:
  - name: component_name
    type: string
    required: true
  - name: component_files
    type: object
    required: true
  - name: framework
    type: enum
    values: [html, react, vue, angular, svelte]
    default: html

outputs:
  - name: examples_page
    type: html
    destination: .aiox/design-system/{project}/docs/{name}/examples.html
  - name: examples_code
    type: directory
    destination: .aiox/design-system/{project}/docs/{name}/examples/

tools:
  - browser
```

## Purpose

Create interactive, copy-paste ready usage examples for design system components. Each example includes a live preview, source code, and explanation of the pattern demonstrated. Examples cover basic usage, common patterns, edge cases, and composition with other components.

## Workflow

### Phase 1: Example Planning
```yaml
steps:
  - identify_basic: Plan basic usage example (minimal props)
  - identify_patterns: Plan common usage patterns (with icons, in forms, etc.)
  - identify_variants: Plan variant showcase examples
  - identify_composition: Plan examples showing composition with other components
  - identify_edge_cases: Plan edge cases (long text, empty state, error state)
```

### Phase 2: Code Generation
```yaml
steps:
  - generate_html_examples: Write HTML code for each example
  - generate_framework_examples: Adapt to target framework syntax if not HTML
  - add_comments: Add inline comments explaining key decisions
  - add_token_annotations: Mark which tokens are in use
```

### Phase 3: Interactive Page
```yaml
steps:
  - create_live_preview: Embed live-rendered component in page
  - create_code_view: Add syntax-highlighted code panel
  - add_copy_button: Add one-click copy for each code example
  - add_variant_toggles: Allow toggling variants in live preview
  - add_theme_toggle: Allow switching between light/dark theme
```

### Phase 4: Organization
```yaml
categories:
  - basic: Minimal usage with default props
  - patterns: Common real-world usage patterns
  - variants: All visual variants side by side
  - composition: Combined with other components
  - edge_cases: Long text, empty states, error states
  - responsive: Behavior at different breakpoints
```

## Example Categories

### Basic
```html
<!-- Default button -->
<button class="btn" data-variant="primary" data-size="md">
  Click me
</button>
```

### With Icon
```html
<!-- Button with leading icon -->
<button class="btn" data-variant="primary">
  <svg class="btn__icon" aria-hidden="true">...</svg>
  Save changes
</button>
```

### Composition
```html
<!-- Button group in a toolbar -->
<div class="toolbar" role="toolbar" aria-label="Actions">
  <button class="btn" data-variant="primary">Save</button>
  <button class="btn" data-variant="secondary">Cancel</button>
</div>
```

## Pre-Conditions

- [ ] Component documented (ds-document task completed)
- [ ] All variants built and tested

## Post-Conditions

- [ ] Examples page with live previews generated
- [ ] Code examples are copy-paste ready
- [ ] All categories covered

## Acceptance Criteria

- [ ] At least 5 examples per component covering all categories
- [ ] Each example has live preview and source code
- [ ] Code is copy-paste ready (no dependencies beyond tokens CSS)
- [ ] Examples include theme and variant toggles
- [ ] Edge cases demonstrated (long text, empty state)

## Quality Gate
- Threshold: >70%
- At least 5 examples per component covering basic, patterns, variants, composition, and edge cases
- Each example includes both a live preview and copy-paste ready source code
- Examples include theme and variant toggles for interactive exploration

---
*Design System Squad Task - ds-documenter*
