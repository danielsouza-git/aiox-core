# Figma Primitives

```yaml
task:
  id: figma-primitives
  name: "Figma Primitives"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create the primitive (base) UI components in the Figma Component Library -- Button, Input, Select, Checkbox, Radio, and Toggle -- with all size, style, and state variants using Auto Layout and design tokens.

## Input

- Initialized Figma library (from figma-library-init)
- Design tokens (colors, typography, spacing, radii)
- Component specifications: 6 base components, ~88 total variants

## Output

- 6 primitive components with all variants
- Auto Layout applied to all components
- Interactive states documented (default, hover, focus, disabled)
- Component descriptions and usage notes embedded

## Workflow

### Passo 1: Create Button Component
Build Button with variants: size (sm, md, lg) x style (primary, secondary, outline, ghost) x state (default, hover, focus, disabled) = 48 variants.

### Passo 2: Create Input Component
Build Input with variants: size (sm, md, lg) x state (default, hover, focus, error) = 12 variants, including label and helper text slots.

### Passo 3: Create Select Component
Build Select with variants: size (sm, md, lg) x state (default, hover, focus, error) = 12 variants, with dropdown indicator.

### Passo 4: Create Checkbox, Radio, Toggle
Build Checkbox (size 2 x state 3 = 6), Radio (size 2 x state 3 = 6), and Toggle (size 2 x state 2 = 4) components.

### Passo 5: Document and Publish
Add component descriptions, usage guidelines, and embed instructions (NFR-3.6) in each component. Publish to library.

## O que faz

- Creates 6 base primitive components with ~88 total variants
- Applies Auto Layout consistently to all components (NFR-3.4)
- Uses design tokens for all color, spacing, and typography values
- Documents interactive states and usage guidelines
- Embeds instructions per NFR-3.6 requirements

## O que NAO faz

- Does not create feedback, navigation, or other component categories
- Does not define the design tokens (uses existing tokens from token-engineer)
- Does not create the Figma file structure (figma-library-init handles that)

## Ferramentas

- **Figma** -- Component creation with variants and Auto Layout
- **Tokens Studio** -- Design token application

## Quality Gate

- Threshold: >70%
- All 6 base components created with documented variants
- Auto Layout applied to every component (no fixed positioning)
- All variants use design tokens (no hardcoded values)

---
*Squad Branding Task*
