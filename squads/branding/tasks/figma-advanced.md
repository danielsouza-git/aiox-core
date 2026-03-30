# Figma Advanced

```yaml
task:
  id: figma-advanced
  name: "Figma Advanced"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create advanced UI components in the Figma Component Library -- Accordion, Stepper, Timeline, Tree View, Data Chart, and Code Block -- providing complex interaction patterns for sophisticated interfaces.

## Input

- Initialized Figma library with published foundation styles and primitives
- Design tokens (colors, typography, spacing)
- Component specifications: 6 base components, ~22 total variants

## Output

- 6 advanced components with all variants
- Complex nested Auto Layout configurations
- Interactive state documentation for each component
- Component descriptions and usage notes embedded

## Workflow

### Passo 1: Create Accordion Component
Build Accordion with variants: style (default, bordered) x multiple (single, multi-expand) = 4 variants, with expand/collapse states.

### Passo 2: Create Stepper Component
Build Stepper with variants: orientation (horizontal, vertical) x style (default, compact) = 4 variants, with active/completed/pending step states.

### Passo 3: Create Timeline Component
Build Timeline with variants: style (default, alternate) x orientation (vertical, horizontal) = 4 variants, with event nodes and content slots.

### Passo 4: Create Tree View and Data Chart
Build Tree View (selectable 2 = 2 variants) with nested expand/collapse and Data Chart (type: bar, line, pie, area = 4 variants) as visual placeholders.

### Passo 5: Create Code Block and Publish
Build Code Block (theme 2 x lineNumbers 2 = 4 variants) with syntax highlighting indicators. Add descriptions and publish to library.

## O que faz

- Creates 6 advanced components with ~22 total variants
- Handles complex nested Auto Layout for multi-level components
- Documents interaction states (expanded, collapsed, active, completed)
- Provides visual representations for data-heavy patterns
- Uses design tokens consistently across all components

## O que NAO faz

- Does not implement real data binding or dynamic content
- Does not create basic UI primitives (separate tasks handle those)
- Does not implement functional behaviors (code highlighting, chart rendering)

## Ferramentas

- **Figma** -- Component creation with nested variants and Auto Layout
- **Tokens Studio** -- Design token application

## Quality Gate

- Threshold: >70%
- All 6 advanced components created with correct variant counts
- Nested Auto Layout configurations stable and resizable
- Interaction states (expanded/collapsed, active/completed) clearly documented

---
*Squad Branding Task*
