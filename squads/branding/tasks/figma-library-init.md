# Figma Library Init

```yaml
task:
  id: figma-library-init
  name: "Figma Library Init"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Initialize the Figma Component Library structure for a branding client, setting up the file organization, page hierarchy, design token integration via Tokens Studio, and foundational styles that all subsequent components will inherit.

## Input

- Client brand profile
- Design tokens from token-engineer (colors, typography, spacing)
- Figma file ID or new file request
- Component library scope (based on project tier)

## Output

- Organized Figma file with standard page structure
- Tokens Studio integration configured (code-to-Figma sync)
- Color, typography, and effect styles published
- Grid and spacing foundation components created
- Library initialization report

## Workflow

### Passo 1: Create File Structure
Set up the Figma file with standard pages: Cover, Foundations, Primitives, Feedback, Navigation, Data Display, Layout, Overlay, Forms, Advanced, Icons, Changelog.

### Passo 2: Integrate Design Tokens
Connect Tokens Studio plugin and push the client's design tokens (colors, typography, spacing, shadows) from code to Figma Variables.

### Passo 3: Publish Foundation Styles
Create and publish color styles, text styles, and effect styles derived from the design tokens as Figma library styles.

### Passo 4: Create Grid Foundation
Set up responsive grid components (4-column, 8-column, 12-column) with spacing tokens applied, and document breakpoint behavior.

### Passo 5: Document Library Standards
Add a Foundations page documenting naming conventions, variant naming patterns, Auto Layout rules, and contribution guidelines.

## O que faz

- Creates a well-organized Figma file with standardized page structure
- Integrates design tokens via Tokens Studio for code-Figma sync
- Publishes foundation styles (colors, typography, effects) as library assets
- Sets up responsive grid components with proper spacing
- Documents library standards for consistent component creation

## O que NAO faz

- Does not create individual UI components (separate tasks handle each category)
- Does not generate design tokens (token-engineer handles that)
- Does not handle Figma team/project permissions

## Ferramentas

- **Figma API** -- File creation and style management
- **Tokens Studio** -- Design token sync from code to Figma
- **Style Dictionary** -- Token format conversion

## Quality Gate

- Threshold: >70%
- All standard pages created in the Figma file
- Tokens Studio connected and syncing from code
- Color, typography, and effect styles published as library assets

---
*Squad Branding Task*
