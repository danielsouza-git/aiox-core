# Figma Navigation

```yaml
task:
  id: figma-navigation
  name: "Figma Navigation"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create navigation UI components in the Figma Component Library -- Navbar, Sidebar, Tabs, Breadcrumbs, Pagination, and Menu -- with all style and behavior variants using Auto Layout and design tokens.

## Input

- Initialized Figma library with published foundation styles
- Design tokens (colors, typography, spacing)
- Component specifications: 6 base components, ~27 total variants

## Output

- 6 navigation components with all variants
- Responsive behavior documented for each component
- Auto Layout applied with correct padding and gap tokens
- Component descriptions and usage notes embedded

## Workflow

### Passo 1: Create Navbar Component
Build Navbar with variants: style (default, transparent, colored) x sticky (yes, no) = 6 variants, with logo, nav links, and action slots.

### Passo 2: Create Sidebar Component
Build Sidebar with variants: collapsed (yes, no) x style (default, overlay) = 4 variants, with nested navigation items.

### Passo 3: Create Tabs Component
Build Tabs with variants: style (underline, pill, boxed) x size (sm, md) = 6 variants, with active state indicators.

### Passo 4: Create Breadcrumbs and Pagination
Build Breadcrumbs (separator 3 = 3 variants) and Pagination (style 2 x size 2 = 4 variants) components.

### Passo 5: Create Menu and Publish
Build Menu (style 2 x nested 2 = 4 variants) with dropdown support. Add descriptions and publish to library.

## O que faz

- Creates 6 navigation components with ~27 total variants
- Documents responsive behavior for each navigation pattern
- Applies consistent spacing and typography tokens
- Includes active/selected state indicators
- Supports nested navigation patterns (sidebar, menu)

## O que NAO faz

- Does not create routing logic or interactive prototypes
- Does not create data display or form components
- Does not handle responsive breakpoint switching (documents behavior only)

## Ferramentas

- **Figma** -- Component creation with variants and Auto Layout
- **Tokens Studio** -- Design token application

## Quality Gate

- Threshold: >70%
- All 6 navigation components created with documented variants
- Active/selected states visually distinct from default
- Auto Layout applied with consistent spacing tokens

---
*Squad Branding Task*
