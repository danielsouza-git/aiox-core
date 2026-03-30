# Figma Overlay

```yaml
task:
  id: figma-overlay
  name: "Figma Overlay"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create overlay UI components in the Figma Component Library -- Modal, Drawer, and Command Palette -- with all size, position, and behavior variants using Auto Layout and design tokens.

## Input

- Initialized Figma library with published foundation styles
- Design tokens (colors, shadows, spacing, radii)
- Component specifications: 3 base components, ~15 total variants

## Output

- 3 overlay components with all variants
- Backdrop/scrim layer included
- Content slots with Auto Layout for flexible content
- Component descriptions and usage notes embedded

## Workflow

### Passo 1: Create Modal Component
Build Modal with variants: size (sm, md, lg) x scrollable (yes, no) = 6 variants, including header, body, and footer slots with backdrop overlay.

### Passo 2: Create Drawer Component
Build Drawer with variants: position (left, right, top, bottom) x size (sm, md) = 8 variants, with backdrop and content area.

### Passo 3: Create Command Palette
Build Command Palette as a single variant with search input, command list, keyboard shortcut hints, and grouped sections.

### Passo 4: Create Backdrop Component
Build a shared Backdrop/Scrim sub-component used by Modal, Drawer, and Command Palette for consistent overlay behavior.

### Passo 5: Document and Publish
Add usage guidelines covering accessibility (focus trapping, escape to close), z-index layering, and responsive behavior. Publish to library.

## O que faz

- Creates 3 overlay components with ~15 total variants
- Includes backdrop/scrim layer for proper overlay behavior
- Provides flexible content slots using Auto Layout
- Documents accessibility requirements (focus trapping, keyboard navigation)
- Supports multiple positions and sizes for different use cases

## O que NAO faz

- Does not implement interactive prototype animations
- Does not create the underlying page content behind overlays
- Does not handle z-index management logic

## Ferramentas

- **Figma** -- Component creation with variants and Auto Layout
- **Tokens Studio** -- Shadow, color, and spacing token application

## Quality Gate

- Threshold: >70%
- All 3 overlay components created with correct variant counts
- Backdrop/scrim component shared across all overlays
- Accessibility notes (focus trap, escape key) documented

---
*Squad Branding Task*
