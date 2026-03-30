# Figma Data Display

```yaml
task:
  id: figma-data-display
  name: "Figma Data Display"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create data display UI components in the Figma Component Library -- Table, Card, List, Avatar, Tag, Tooltip, and Popover -- with all style, size, and density variants using Auto Layout and design tokens.

## Input

- Initialized Figma library with published foundation styles
- Design tokens (colors, typography, spacing, shadows)
- Component specifications: 7 base components, ~47 total variants

## Output

- 7 data display components with all variants
- Elevation/shadow tokens applied correctly to cards
- Auto Layout with flexible content areas
- Component descriptions and usage notes embedded

## Workflow

### Passo 1: Create Table Component
Build Table with variants: size (compact, default) x striped (yes, no) x bordered (yes, no) = 8 variants, with header, row, and cell sub-components.

### Passo 2: Create Card Component
Build Card with variants: style (default, outlined, filled) x elevation (none, sm, md) = 9 variants, with content, header, and footer slots.

### Passo 3: Create List and Avatar
Build List (style 3 x density 2 = 6 variants) and Avatar (size 4 x shape 2 = 8 variants) components.

### Passo 4: Create Tag Component
Build Tag with variants: size (sm, md) x style (solid, outline, subtle, dot) = 8 variants, with optional close icon.

### Passo 5: Create Tooltip, Popover, and Publish
Build Tooltip (position 4 = 4 variants) and Popover (position 4 = 4 variants). Add descriptions and publish to library.

## O que faz

- Creates 7 data display components with ~47 total variants
- Applies elevation/shadow tokens for depth hierarchy
- Configures flexible content areas using Auto Layout
- Supports composable patterns (Table with sortable headers, Card with action slots)
- Documents content guidelines for each component

## O que NAO faz

- Does not create real data or content (uses placeholder examples)
- Does not implement interactive behaviors (sorting, filtering)
- Does not create form or overlay components

## Ferramentas

- **Figma** -- Component creation with variants and Auto Layout
- **Tokens Studio** -- Shadow, spacing, and color token application

## Quality Gate

- Threshold: >70%
- All 7 base data display components created with correct variant counts
- Shadow/elevation tokens applied consistently to Card component
- Auto Layout enables flexible content resizing

---
*Squad Branding Task*
