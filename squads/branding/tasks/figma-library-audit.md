# Figma Library Audit

```yaml
task:
  id: figma-library-audit
  name: "Figma Library Audit"
  agent: figma-component-builder
  squad: branding
  type: design-system
```

## Proposito

Audit the Figma Component Library for consistency, completeness, and quality, verifying that all components meet the design system standards for naming, Auto Layout usage, token adherence, and variant coverage.

## Input

- Figma library file to audit
- Expected component inventory (from FR-1.11: 60+ base, 200-400 variants)
- Design tokens reference (for adherence verification)
- Naming convention standards

## Output

- Audit report with pass/fail per category
- Completeness score (actual vs. expected components/variants)
- Consistency issues list with severity
- Recommendations for improvements

## Workflow

### Passo 1: Inventory Components
Scan the Figma library and catalog all components by category, counting base components and variants against the expected inventory.

### Passo 2: Check Naming Conventions
Verify all components follow the naming convention (Category/ComponentName/Variant) and flag any inconsistencies.

### Passo 3: Verify Auto Layout
Check that all components use Auto Layout (NFR-3.4 requirement) and flag any components using fixed positioning or absolute coordinates.

### Passo 4: Verify Token Adherence
Check that all color, spacing, typography, and shadow values reference design tokens instead of hardcoded values.

### Passo 5: Generate Audit Report
Compile findings into a structured audit report with completeness score, consistency issues, and prioritized improvement recommendations.

## O que faz

- Inventories all library components and compares against expected counts
- Verifies naming convention adherence across all components
- Checks Auto Layout usage on every component (NFR-3.4)
- Validates design token adherence (no hardcoded values)
- Produces a structured audit report with actionable findings

## O que NAO faz

- Does not fix the issues found (those are addressed by re-running category tasks)
- Does not audit non-Figma deliverables (brand book, web, social)
- Does not validate functional behavior or interactions

## Ferramentas

- **Figma API** -- Component inventory and property inspection
- **Audit Checklist** -- Standardized evaluation criteria

## Quality Gate

- Threshold: >70%
- Completeness score calculated (actual/expected components)
- All components checked for Auto Layout and token adherence
- Audit report includes specific recommendations per category

---
*Squad Branding Task*
