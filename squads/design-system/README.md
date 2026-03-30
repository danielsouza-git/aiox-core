# Design System Squad

Transform design tokens into reusable component libraries using Atomic Design methodology.

## Overview

| Aspect | Value |
|--------|-------|
| **Domain** | Design Systems |
| **Agents** | 6 |
| **Tasks** | 12 |
| **Workflows** | 3 |

## Agents

| Icon | ID | Name | Role |
|------|-----|------|------|
| 🏛️ | `ds-architect` | Atlas | Design System Architect |
| 🔄 | `token-transformer` | Tara | Token Transformation Specialist |
| 🧱 | `component-builder` | Cole | Component Builder |
| ♿ | `a11y-auditor` | Aria | Accessibility Auditor |
| 📚 | `ds-documenter` | Doris | Documentation Specialist |
| 🗺️ | `migration-planner` | Miles | Migration & Adoption Planner |

## Quick Start

```bash
# Activate an agent
@design-system:ds-architect

# Or use slash command
/design-system:component-builder

# Run a command
*build
```

## Atomic Design Levels

| Level | Description | Examples |
|-------|-------------|----------|
| **Atoms** | Smallest indivisible elements | Button, Input, Label, Icon |
| **Molecules** | Simple groups of atoms | Search bar, Form field, Card header |
| **Organisms** | Complex groups of molecules | Navigation, Hero section, Footer |
| **Templates** | Page-level layouts | Dashboard layout, Article layout |
| **Pages** | Specific instances of templates | Home page, Settings page |

## Workflows

### 1. Design System Build Flow
Full pipeline from audit to documented, tested components.
```
audit -> extract patterns -> transform tokens -> build components -> a11y audit -> document -> test
```

### 2. Component Library Flow
Build a complete component library from brand tokens.
```
tokens -> atoms -> molecules -> organisms -> variants -> test -> document -> package
```

### 3. Token Pipeline Flow
Token ingestion, transformation, and multi-platform export.
```
ingest W3C DTCG -> validate -> transform -> export CSS/Tailwind/SCSS/JSON -> sync Figma
```

## Integration with Branding Squad

The Design System Squad bridges brand identity and implementation:

**Receives from Branding:**
- Design tokens (W3C DTCG format)
- Color palette and scales
- Typography system
- Brand profile and personality

**Provides to Branding:**
- Component library (HTML/CSS/JS)
- Theme CSS files
- Component documentation (Storybook-like)

```bash
# Example: Branding Squad delivers tokens, Design System builds components
@branding:token-engineer -> exports design tokens
@design-system:token-transformer -> transforms to CSS/Tailwind
@design-system:component-builder -> builds components from tokens
```

## File Structure

```
squads/design-system/
├── squad.yaml              # Manifest
├── README.md               # This file
├── config/
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── atomic-design-guide.md
├── agents/
│   ├── ds-architect.md
│   ├── token-transformer.md
│   ├── component-builder.md
│   ├── a11y-auditor.md
│   ├── ds-documenter.md
│   └── migration-planner.md
├── tasks/
│   ├── atomic-audit.md
│   ├── token-transform.md
│   ├── component-build.md
│   ├── component-variants.md
│   ├── a11y-audit.md
│   ├── a11y-remediate.md
│   ├── ds-document.md
│   ├── usage-examples.md
│   ├── migration-plan.md
│   ├── pattern-extract.md
│   ├── theme-create.md
│   └── component-test.md
├── workflows/
│   ├── design-system-build-flow.yaml
│   ├── component-library-flow.yaml
│   └── token-pipeline-flow.yaml
└── checklists/
    ├── component-quality-checklist.md
    ├── a11y-wcag-checklist.md
    ├── token-quality-checklist.md
    └── ds-review-checklist.md
```

## License

MIT

---

*Design System Squad - Part of AIOX Framework*
