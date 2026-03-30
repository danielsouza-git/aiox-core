# QA Accessibility Squad

Specialized quality assurance for design systems and brand outputs. Visual QA, accessibility testing, brand compliance verification, and performance auditing.

## Overview

| Aspect | Value |
|--------|-------|
| **Domain** | Design QA & Compliance |
| **Agents** | 4 |
| **Tasks** | 18 |
| **Workflows** | 3 |

## Agents

| Icon | ID | Name | Role |
|------|-----|------|------|
| :eye: | `visual-qa` | Vega | Pixel-Perfect Review & Visual Regression |
| :wheelchair: | `a11y-tester` | Ally | WCAG Testing & Assistive Tech |
| :white_check_mark: | `brand-compliance` | Barrett | Brand Guideline Enforcement |
| :zap: | `performance-auditor` | Percy | Lighthouse & Core Web Vitals |

## Quick Start

```bash
# Activate an agent
@qa-accessibility:visual-qa

# Or use slash command
/qa-accessibility:a11y-tester

# Run a command
*wcag
```

## Workflows

### 1. QA Pipeline Flow
Complete design QA pipeline from manifest validation through build, export, and compliance.
```
manifest-validate -> next-build-validate -> static-export-validate -> visual-review -> a11y-test -> brand-compliance -> performance -> report
```

### 2. A11y Certification Flow
Full WCAG certification from automated tests to manual verification.
```
wcag-test -> screen-reader -> keyboard-nav -> contrast -> certificate
```

### 3. Brand Compliance Flow
Brand guideline verification across all deliverables.
```
logo-check -> palette-check -> typography-check -> overall-score
```

## Testing Standards

### WCAG Compliance Levels
| Level | Description | Target |
|-------|-------------|--------|
| **A** | Minimum accessibility | Baseline |
| **AA** | Standard compliance | Default target |
| **AAA** | Enhanced accessibility | Stretch goal |

### Browser Matrix
| Browser | Versions | Priority |
|---------|----------|----------|
| Chrome | Latest 2 | P0 |
| Firefox | Latest 2 | P0 |
| Safari | Latest 2 | P1 |
| Edge | Latest 2 | P1 |

### Performance Budgets
| Metric | Target | Threshold |
|--------|--------|-----------|
| LCP | < 2.5s | < 4.0s |
| FID/INP | < 100ms | < 300ms |
| CLS | < 0.1 | < 0.25 |
| Lighthouse Performance | >= 90 | >= 75 |

### Responsive Breakpoints
| Breakpoint | Width | Device |
|------------|-------|--------|
| Mobile S | 320px | Small phones |
| Tablet | 768px | iPad |
| Desktop | 1024px | Laptops |
| Desktop L | 1440px | Desktop monitors |
| Desktop XL | 1920px | Large monitors |

## Integration with Other Squads

**Receives from Branding:**
- Brand guidelines & palette
- Typography specs
- Logo usage rules

**Receives from Design System:**
- Component library
- Token specifications

**Receives from Visual Production:**
- Visual assets
- Motion assets

**Provides to All Squads:**
- QA reports
- Compliance scores
- A11y certificates
- Performance reports

```bash
# Example: Branding Squad delivers, QA Squad validates
@branding:web-builder -> builds landing page
@qa-accessibility:visual-qa -> reviews pixel-perfect accuracy
@qa-accessibility:a11y-tester -> certifies WCAG compliance
@qa-accessibility:performance-auditor -> audits Core Web Vitals
```

## Usage Examples

### Run visual review
```bash
@qa-accessibility:visual-qa
*review --target landing-page --spec figma-link
```

### Run WCAG audit
```bash
@qa-accessibility:a11y-tester
*wcag --level AA --url https://staging.example.com
```

### Check brand compliance
```bash
@qa-accessibility:brand-compliance
*check --deliverable brand-book --guidelines brand-guide.md
```

### Run Lighthouse audit
```bash
@qa-accessibility:performance-auditor
*lighthouse --url https://staging.example.com --budget performance-budget.json
```

## File Structure

```
squads/qa-accessibility/
+-- squad.yaml              # Manifest
+-- README.md               # This file
+-- config/
|   +-- coding-standards.md
|   +-- tech-stack.md
|   +-- testing-standards.md
+-- agents/
|   +-- visual-qa.md
|   +-- a11y-tester.md
|   +-- brand-compliance.md
|   +-- performance-auditor.md
+-- tasks/
|   +-- (18 task files)
+-- workflows/
|   +-- qa-pipeline-flow.yaml
|   +-- a11y-certification-flow.yaml
|   +-- brand-compliance-flow.yaml
+-- checklists/
|   +-- visual-qa-checklist.md
|   +-- a11y-wcag-checklist.md
|   +-- brand-compliance-checklist.md
|   +-- performance-checklist.md
```

## License

MIT

---

*QA Accessibility Squad - Part of AIOX Framework*
