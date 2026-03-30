# Figma Forms

```yaml
task:
  id: figma-forms
  name: "Figma Forms"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create advanced form UI components in the Figma Component Library -- Date Picker, Time Picker, File Upload, Color Picker, and Slider -- extending the primitive input components with specialized form controls.

## Input

- Initialized Figma library with published primitives
- Design tokens (colors, typography, spacing, radii)
- Component specifications: 5 base components, ~18 total variants

## Output

- 5 form components with all variants
- Consistent styling with primitive input components
- Auto Layout applied with proper spacing
- Component descriptions and usage notes embedded

## Workflow

### Passo 1: Create Date Picker Component
Build Date Picker with variants: type (single, range) x size (sm, md) = 4 variants, including calendar dropdown and input field.

### Passo 2: Create Time Picker Component
Build Time Picker with variants: format (12h, 24h) x size (sm, md) = 4 variants, with hour/minute selectors.

### Passo 3: Create File Upload Component
Build File Upload with variants: style (button, dropzone) x multiple (single, multi) = 4 variants, with drag-and-drop visual states.

### Passo 4: Create Color Picker Component
Build Color Picker with variants: format (hex, rgb) = 2 variants, including swatch grid and input field.

### Passo 5: Create Slider and Publish
Build Slider with variants: orientation (horizontal, vertical) x range (single, dual) = 4 variants. Add descriptions and publish to library.

## O que faz

- Creates 5 advanced form components with ~18 total variants
- Maintains visual consistency with primitive input components
- Provides specialized controls for common form patterns
- Documents interaction states (open, selected, error)
- Uses design tokens for all visual properties

## O que NAO faz

- Does not create basic form inputs (figma-primitives handles Button, Input, Select)
- Does not implement functional form validation logic
- Does not create form layout patterns or multi-step forms

## Ferramentas

- **Figma** -- Component creation with variants and Auto Layout
- **Tokens Studio** -- Design token application

## Quality Gate

- Threshold: >70%
- All 5 form components created with correct variant counts
- Visual style consistent with primitive input components
- Auto Layout applied to all components

---
*Squad Branding Task*
