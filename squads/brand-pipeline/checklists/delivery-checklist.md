# Delivery Checklist

Final delivery quality gate for the complete brand pipeline.

**Items:** 10
**Used by:** brand-orchestrator (Maestro)
**Scoring:** PASS (>=8/10), CONDITIONAL (6-7/10), FAIL (<6/10)

## Checklist

- [ ] **Brand Profile Complete** -- Brand profile document exists with all required sections: personality, values, positioning, audience, voice attributes
- [ ] **Design Tokens Exported** -- Tokens exported in all three formats: CSS custom properties, Tailwind config, SCSS variables
- [ ] **Component Library Built** -- Component library exists with documented components, each with at least one variant
- [ ] **Visual Assets Organized** -- All visual assets organized in standard folder structure with consistent naming and optimized file sizes
- [ ] **Copy Deliverables Complete** -- All copy deliverables present: landing page copy, social media posts, email sequences, SEO meta tags
- [ ] **WCAG AA Compliance** -- WCAG 2.1 Level AA compliance verified; all color contrast ratios meet 4.5:1 minimum for text
- [ ] **Brand Compliance Score** -- Brand compliance check score is >= 90% across all deliverables
- [ ] **Lighthouse Performance** -- Lighthouse performance score is >= 80 for any generated web pages
- [ ] **Delivery Folder Organized** -- All files organized in the delivery folder (`.aiox/branding/{client}/`) with clear phase-based structure
- [ ] **Delivery Report Generated** -- Final delivery report exists at `.aiox/branding/{client}/delivery-report.md` with all sections complete

## Verdict Criteria

| Verdict | Score | Action |
|---------|-------|--------|
| **PASS** | >= 8/10 | Pipeline complete -- deliver to client |
| **CONDITIONAL** | 6-7/10 | Deliver with documented caveats; schedule follow-up for failed items |
| **FAIL** | < 6/10 | Do NOT deliver; re-run failed phases or escalate to user |

## Critical Items (Must Pass)

These items MUST pass regardless of total score:
- **Brand Profile Complete** -- Without this, nothing downstream is valid
- **WCAG AA Compliance** -- Legal and accessibility requirement
- **Brand Compliance Score** -- Brand integrity is non-negotiable

If any critical item fails, verdict is FAIL regardless of total score.

## Quality Thresholds

| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| Brand Compliance | 90% | 95% | 98%+ |
| WCAG AA | Pass | Pass | AAA |
| Lighthouse | 80 | 90 | 95+ |
| Deliverables Complete | 80% | 95% | 100% |
| Token Coverage | 3 formats | 3 formats | 3 formats + Figma |

## Post-Delivery Actions

After PASS verdict:
1. Archive pipeline state to `.aiox/session-history/`
2. Generate client handoff documentation
3. Schedule quarterly brand review reminder
4. Archive raw outputs for future reference

---
*Brand Pipeline Checklist*
