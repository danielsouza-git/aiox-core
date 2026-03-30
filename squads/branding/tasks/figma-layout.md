# Figma Layout

```yaml
task:
  id: figma-layout
  name: "Figma Layout"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create layout UI components in the Figma Component Library -- Container, Grid, Stack, Divider, and Spacer -- providing the structural foundation that all other components use for page composition and responsive behavior.

## Input

- Initialized Figma library with published foundation styles
- Design tokens (spacing scale, breakpoint widths)
- Component specifications: 5 base components, ~36 total variants

## Output

- 5 layout components with all variants
- Responsive container widths configured
- Spacing tokens driving all gap and padding values
- Component descriptions documenting responsive behavior

## Workflow

### Passo 1: Create Container Component
Build Container with variants: maxWidth (sm, md, lg, xl) = 4 variants, using Auto Layout with horizontal centering and responsive padding.

### Passo 2: Create Grid Component
Build Grid with variants: columns (2, 3, 4, 6) x gap (sm, md, lg) = 12 variants, documenting column behavior across breakpoints.

### Passo 3: Create Stack Component
Build Stack with variants: direction (horizontal, vertical) x gap (xs, sm, md, lg) = 8 variants, the fundamental layout building block.

### Passo 4: Create Divider Component
Build Divider with variants: style (solid, dashed, dotted) x orientation (horizontal, vertical) = 6 variants.

### Passo 5: Create Spacer and Publish
Build Spacer with variants: size (4, 8, 16, 24, 32, 48) = 6 variants mapped to spacing tokens. Add descriptions and publish to library.

## O que faz

- Creates 5 foundational layout components with ~36 total variants
- Uses spacing tokens exclusively for all gap and padding values
- Documents responsive behavior for containers and grids
- Provides composable building blocks for page layout
- Establishes consistent vertical rhythm through Spacer component

## O que NAO faz

- Does not create page templates or full page layouts
- Does not handle responsive breakpoint logic (documents behavior only)
- Does not create content-specific components

## Ferramentas

- **Figma** -- Component creation with Auto Layout and constraints
- **Tokens Studio** -- Spacing token application

## Quality Gate

- Threshold: >70%
- All 5 layout components created with correct variant counts
- All spacing values derived from design tokens (no hardcoded pixels)
- Container maxWidth variants match the defined breakpoints

---
*Squad Branding Task*
