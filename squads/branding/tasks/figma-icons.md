# Figma Icons

```yaml
task:
  id: figma-icons
  name: "Figma Icons"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Create a comprehensive icon set (40-80 icons) in the Figma Component Library, following a consistent 24x24px grid with 2px stroke and rounded caps, organized by category and exported as both SVG and Figma Components.

## Input

- Icon category requirements (Navigation, Actions, Communication, Media, Interface, Social, Status, Commerce)
- Design tokens (stroke width, corner radius)
- Brand style direction (for custom icon treatment)

## Output

- 40-80 icon components in Figma
- Icons organized by category on dedicated page
- SVG export package
- Icon naming convention documentation

## Workflow

### Passo 1: Define Icon Grid
Set up the 24x24px icon grid with 2px live area margin, 2px stroke width, and rounded caps as the foundation for all icons.

### Passo 2: Create Navigation Icons (12)
Build navigation icons: arrow-up, arrow-down, arrow-left, arrow-right, chevron-up, chevron-down, chevron-left, chevron-right, menu, close, home, back.

### Passo 3: Create Action and Communication Icons (17)
Build action icons (edit, delete, add, remove, search, filter, sort, download, upload, share) and communication icons (email, phone, chat, comment, send, notification, bell).

### Passo 4: Create Remaining Categories (27)
Build Media (7), Interface (9), Social (6), Status (6), and Commerce (5) icon categories.

### Passo 5: Organize, Export, and Publish
Organize icons by category on the Icons page, set up SVG export settings (flatten, outline strokes), and publish as Figma components.

## O que faz

- Creates 40-80 consistent icons following a unified grid system
- Applies consistent stroke width (2px) and rounded caps across all icons
- Organizes icons by functional category for easy discovery
- Exports icons as clean SVG files for development use
- Publishes icons as Figma components for designer use

## O que NAO faz

- Does not create animated icons or icon animations
- Does not create brand-specific illustrations (those are creative assets)
- Does not handle icon font generation (developers handle that separately)

## Ferramentas

- **Figma** -- Icon creation on 24x24 grid with component publishing
- **SVG Export** -- Clean SVG file generation for development

## Quality Gate

- Threshold: >70%
- Minimum 40 icons created across all required categories
- All icons consistent on 24x24 grid with 2px stroke
- SVG exports are clean (no unnecessary groups, correct viewBox)

---
*Squad Branding Task*
