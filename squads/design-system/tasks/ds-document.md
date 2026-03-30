# ds-document

```yaml
task: dsDocument()
agent: ds-documenter
squad: design-system

inputs:
  - name: component_name
    type: string
    required: true
  - name: component_files
    type: object
    required: true
    description: Component HTML/CSS/JS files
  - name: pattern_spec
    type: markdown
    required: false
    description: Pattern spec with API definition

outputs:
  - name: documentation_page
    type: html
    destination: .aiox/design-system/{project}/docs/{name}/index.html
  - name: documentation_md
    type: markdown
    destination: .aiox/design-system/{project}/docs/{name}/README.md

tools:
  - browser
```

## Purpose

Generate comprehensive component documentation including a props table, usage examples, do/don't guidelines, variant showcase, accessibility notes, and implementation guidance. Produces both a standalone HTML documentation page and a markdown reference.

## Workflow

### Phase 1: Analysis
```yaml
steps:
  - analyze_api: Extract props, slots, events from component files
  - analyze_variants: Inventory all variant combinations
  - analyze_tokens: List all design tokens used by the component
  - analyze_a11y: Summarize ARIA requirements and keyboard behavior
  - analyze_composition: Identify how component composes with others
```

### Phase 2: Documentation Structure
```yaml
sections:
  - overview: One-sentence description and when to use
  - anatomy: Visual diagram of component parts
  - props_table: All configurable properties with types and defaults
  - variants: Visual showcase of all variants
  - usage_examples: Code snippets for common use cases
  - do_dont: Visual do/don't guidelines
  - accessibility: ARIA, keyboard, screen reader notes
  - tokens: Design tokens referenced
  - changelog: Version history
```

### Phase 3: Content Generation
```yaml
steps:
  - write_overview: Concise description and use cases
  - write_props_table: Prop name, type, default, description per row
  - write_examples: At least 3 usage examples with code
  - write_do_dont: At least 3 do/don't pairs with visual examples
  - write_a11y_notes: Keyboard shortcuts, ARIA roles, screen reader behavior
  - write_tokens_list: All tokens used with current values
```

### Phase 4: Page Generation
```yaml
steps:
  - generate_html: Build standalone documentation page with live examples
  - generate_markdown: Build markdown reference
  - add_navigation: Add sidebar navigation for multi-component docs
  - add_search: Include search for large component libraries
```

## Documentation Template

```markdown
# {ComponentName}

{One-sentence description.}

## When to Use
- Use when...
- Do not use when... (use {Alternative} instead)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' | 'md' | 'lg' | 'md' | Controls component size |
| variant | 'primary' | 'secondary' | 'danger' | 'primary' | Visual style |
| disabled | boolean | false | Prevents interaction |

## Examples

### Basic Usage
[code example]

### With Icon
[code example]

### Custom Variant
[code example]

## Do and Don't

| Do | Don't |
|----|-------|
| Use primary for main actions | Use primary for every button on the page |
| Provide accessible labels | Rely on color alone to communicate meaning |

## Accessibility

- **Role:** {ARIA role}
- **Keyboard:** Enter/Space to activate, Tab to navigate
- **Screen reader:** Announces "{label}" as {role}

## Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| --color-primary-500 | #2563eb | Background (primary variant) |
| --spacing-3 | 0.75rem | Vertical padding |
```

## Pre-Conditions

- [ ] Component built and tested
- [ ] All variants available for showcase

## Post-Conditions

- [ ] HTML documentation page generated
- [ ] Markdown reference generated
- [ ] Props table complete and accurate

## Acceptance Criteria

- [ ] Every prop documented with type, default, and description
- [ ] At least 3 usage examples included
- [ ] At least 3 do/don't guidelines included
- [ ] Accessibility section covers keyboard and screen reader
- [ ] All design tokens used are listed

## Quality Gate
- Threshold: >70%
- Every prop documented with type, default value, and description in the props table
- At least 3 usage examples and 3 do/don't guidelines included per component
- Accessibility section covers keyboard shortcuts, ARIA roles, and screen reader behavior

---
*Design System Squad Task - ds-documenter*
