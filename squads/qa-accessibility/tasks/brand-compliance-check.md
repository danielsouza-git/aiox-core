# brand-compliance-check

```yaml
task:
  id: brand-compliance-check
  name: Full Brand Compliance Audit
  agent: brand-compliance
  squad: qa-accessibility
  type: audit
  elicit: true

inputs:
  required:
    - deliverable: "URL, file, or asset to audit"
    - brand_guidelines: "Path to brand guidelines document"
  optional:
    - scope: "Full audit or specific section (logo, colors, typography)"
    - tolerance: "Acceptable deviation level (strict, standard, relaxed)"

outputs:
  - brand_compliance_report.md: "Full compliance report"
  - violations.json: "Machine-readable violation list"
  - compliance_score.md: "Overall compliance score breakdown"

pre_conditions:
  - "Deliverable accessible for review"
  - "Brand guidelines document available"
  - "Manifest validation passed (manifest-validate task)"

post_conditions:
  - "Manifest alignment verified as prerequisite"
  - "All brand elements audited"
  - "React component token compliance verified"
  - "Animation compliance verified"
  - "Violations documented with evidence"
  - "Compliance score calculated"
  - "Remediation priorities assigned"
```

## Purpose

Perform a comprehensive brand compliance audit across all deliverables. Verify logo usage, color palette, typography, spacing, imagery, and messaging against the official brand guidelines. Produce an objective compliance score.

## Workflow

### Phase 0: Manifest Prerequisite Check (3 min)

**This phase runs BEFORE the traditional brand compliance audit.**

1. Verify `manifest-validate` task has been executed and PASSED
2. If manifest validation report is available:
   - Check verdict is PASS or WARN (not FAIL)
   - Note any cross-reference warnings for follow-up in later phases
3. If manifest validation has NOT been run:
   - WARN: "Manifest validation not yet executed. Running brand compliance without manifest cross-validation."
   - Document this gap in the final report
4. Load manifests for reference during audit:
   - `component-manifest.md` -- for React component compliance
   - `motion-manifest.md` -- for animation compliance
   - `brandbook-manifest.md` -- for page structure verification

### Phase 1: Guidelines Loading (5 min)
1. Load brand guidelines document
2. Extract approved logo variants and rules
3. Extract color palette (primary, secondary, accent, neutral)
4. Extract typography specs (families, weights, sizes)
5. Extract spacing and layout rules
6. Note any brand-specific constraints

### Phase 2: Logo Audit (10 min)
1. **Correct variant used** - Primary, secondary, or icon as appropriate
2. **Clear space respected** - Minimum padding around logo
3. **Minimum size met** - Logo not below minimum dimension
4. **Color variant correct** - Full color, mono, reversed as appropriate
5. **No modifications** - Logo not stretched, rotated, or altered
6. **Background appropriate** - Logo visible against background

### Phase 3: Color Audit (10 min)
1. Extract all colors used in deliverable
2. Compare each against approved palette (exact hex match)
3. Flag unapproved colors
4. Verify color usage context (primary for CTAs, neutral for body, etc.)
5. Check gradient usage against guidelines

### Phase 4: Typography Audit (10 min)
1. **Font families** - Only approved fonts used
2. **Font weights** - Only approved weights used
3. **Font sizes** - Match approved size scale
4. **Line heights** - Match approved line height ratios
5. **Letter spacing** - Match approved tracking values
6. **Text alignment** - Follows guidelines (left, center, justified)

### Phase 5: Spacing & Layout (5 min)
1. Grid system followed (if defined)
2. Margin/padding matches spacing scale
3. Component spacing consistent
4. Section spacing follows guidelines
5. Whitespace usage appropriate

### Phase 6: Imagery & Tone (5 min)
1. Image style matches brand (photography, illustration, abstract)
2. Image treatment follows guidelines (filters, overlays, crops)
3. Iconography consistent with brand set
4. Messaging tone matches brand voice
5. No conflicting brand messages

### Phase 7: React Component Token Compliance (10 min)

**Validates that React components use design tokens via Tailwind classes, not hardcoded values.**

1. Scan all `.tsx` files in `app/components/ui/` and `app/components/layout/`
2. For each component, check Tailwind class usage:
   - **Color classes** must reference brand tokens (`bg-primary`, `text-accent`, etc.), NOT hardcoded hex/rgb values (`bg-[#ff0000]`, `text-[rgb(0,0,0)]`)
   - **Typography classes** must use brand font families (`font-heading`, `font-body`), NOT system fonts directly (`font-sans`, `font-serif` when brand fonts are defined)
   - **Spacing classes** should follow the project spacing scale (use token-based values from `tailwind.config.ts`)
   - **Border radius** should use brand radius tokens (`rounded-sm`, `rounded-md`, `rounded-lg`)
3. Check `app/styles/tokens.css` for CSS custom properties:
   - Verify all `--color-*` properties match values from `discovery/tokens.json`
   - Verify all `--font-*` properties reference correct font families
   - Verify all `--space-*` properties follow the spacing scale
4. Check `tailwind.config.ts`:
   - Verify `theme.extend.colors` maps to CSS custom properties (`var(--color-*)`)
   - Verify `theme.extend.fontFamily` maps to CSS custom properties (`var(--font-*)`)
5. Flag violations:
   - **CRITICAL:** Hardcoded color value in a component (bypasses brand tokens)
   - **HIGH:** Font family not from brand system
   - **MEDIUM:** Spacing value not from spacing scale
   - **LOW:** Arbitrary Tailwind value (`[...]`) that could use a token

### Phase 8: Animation Compliance (10 min)

**Validates that Framer Motion animations match the motion-manifest specifications.**

1. Load `motion-manifest.md` and extract:
   - Expected animation character (easing, duration scale, entrance style)
   - Selected motion components list
   - Framer Motion preset overrides (duration, stagger, scale, spring values)
2. Check `app/lib/animations.ts`:
   - Verify `fadeInUp.transition.duration` matches manifest duration scale
   - Verify `staggerContainer.transition.staggerChildren` matches manifest value
   - Verify `scaleOnHover.hover.scale` matches manifest value
   - Verify spring stiffness/damping match if spring easing is specified
3. Scan `app/components/motion/` directory:
   - Verify every motion component in the manifest has a corresponding `.tsx` file
   - Verify no extra motion components exist that are NOT in the manifest
   - Flag orphan motion components as WARNING
4. Check motion component implementations:
   - Verify they import presets from `app/lib/animations.ts` (not hardcoded inline)
   - Verify they respect `prefers-reduced-motion` media query
   - Verify animation durations do not exceed 1 second (unless justified by archetype)
5. Check `app/components/showcase/` for animation usage:
   - Verify showcase components use motion components from `app/components/motion/`
   - Verify no direct Framer Motion usage that bypasses the motion component library
6. Flag violations:
   - **CRITICAL:** Animation timing values do not match manifest overrides
   - **HIGH:** Motion component missing for a manifest-listed animation
   - **HIGH:** Hardcoded animation values instead of importing from animations.ts
   - **MEDIUM:** Missing `prefers-reduced-motion` handling
   - **LOW:** Extra motion component not in manifest

### Phase 9: Scoring & Report (5 min)
1. Calculate compliance per category
2. Calculate overall compliance score
3. Prioritize violations by visibility and severity
4. Generate final report with evidence

## Compliance Scoring

| Category | Weight | Criteria |
|----------|--------|----------|
| Logo Usage | 15% | Correct variant, clear space, min size, no mods |
| Colors | 15% | Exact hex match, correct usage context |
| Typography | 15% | Correct families, weights, sizes, spacing |
| Spacing/Layout | 10% | Grid, margins, component spacing |
| Imagery/Tone | 10% | Style, treatment, messaging alignment |
| Manifest Alignment | 5% | Manifests validated, no orphan references |
| Component Token Compliance | 15% | React components use brand tokens via Tailwind, no hardcoded values |
| Animation Compliance | 15% | Framer Motion matches motion-manifest specs, uses centralized presets |

| Score | Rating | Verdict |
|-------|--------|---------|
| 95-100% | Fully Compliant | Approved |
| 85-94% | Minor Violations | Fix required |
| 70-84% | Significant Violations | Revision required |
| < 70% | Non-Compliant | Major rework |

## Acceptance Criteria

- [ ] Manifest validation prerequisite verified (Phase 0)
- [ ] Brand guidelines loaded and parsed
- [ ] Logo usage audited (variant, clear space, size, background)
- [ ] All colors compared against approved palette
- [ ] Typography verified (family, weight, size, line-height)
- [ ] Spacing and layout checked
- [ ] Imagery and tone assessed
- [ ] React component token compliance verified (no hardcoded values)
- [ ] Animation compliance verified (matches motion-manifest specs)
- [ ] Compliance score calculated with category breakdown (including new categories)
- [ ] Violations documented with remediation guidance

## Quality Gate
- Threshold: >70%
- Overall brand compliance score >= 85% across all categories
- Zero critical violations in logo usage, color palette, or React component tokens
- Animation compliance verified against motion-manifest specifications

---
*QA Accessibility Squad Task - brand-compliance*
