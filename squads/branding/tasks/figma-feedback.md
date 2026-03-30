# Figma Feedback

```yaml
task:
  id: figma-feedback
  name: "Figma Feedback"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create feedback UI components in the Figma Component Library -- Alert, Toast, Badge, Progress, Skeleton, and Spinner -- with all type, size, and style variants using Auto Layout and design tokens.

## Input

- Initialized Figma library with published foundation styles
- Design tokens (semantic colors for success, warning, error, info)
- Component specifications: 6 base components, ~49 total variants

## Output

- 6 feedback components with all variants
- Semantic color tokens applied correctly
- Auto Layout and responsive behavior configured
- Component descriptions and usage notes embedded

## Workflow

### Passo 1: Create Alert Component
Build Alert with variants: type (success, warning, error, info) x dismissible (yes, no) = 8 variants, with icon slot and Auto Layout.

### Passo 2: Create Toast Component
Build Toast with variants: type (success, warning, error, info) x position (top-left, top-right, bottom-left, bottom-right) = 16 variants.

### Passo 3: Create Badge Component
Build Badge with variants: size (sm, md, lg) x style (solid, outline, subtle, dot) = 12 variants.

### Passo 4: Create Progress and Skeleton
Build Progress (type 2 x size 3 = 6 variants) and Skeleton (type 4 = 4 variants) loading state components.

### Passo 5: Create Spinner and Publish
Build Spinner (size 3 = 3 variants). Add descriptions and usage notes to all components, then publish to library.

## O que faz

- Creates 6 feedback components with ~49 total variants
- Applies semantic color tokens (success, warning, error, info) correctly
- Configures Auto Layout for responsive behavior
- Documents usage guidelines and accessibility considerations
- Publishes components to the shared library

## O que NAO faz

- Does not create primitive or navigation components
- Does not define semantic color tokens (uses existing from token-engineer)
- Does not implement interactive animations (static representations only)

## Ferramentas

- **Figma** -- Component creation with variants and Auto Layout
- **Tokens Studio** -- Semantic color token application

## Quality Gate

- Threshold: >70%
- All 6 base feedback components created with correct variant counts
- Semantic colors (success/warning/error/info) applied consistently
- Auto Layout applied to every component

---
*Squad Branding Task*
