# Cross-Squad Overlaps -- Scope Differentiation

**Date:** 2026-03-30
**Source:** Audit Report (2026-03-29), Finding M5
**Status:** Documented -- All 6 overlaps have distinct scopes. No duplication.

---

## Purpose

This document explicitly records the 6 cross-squad overlaps identified by the auditoria squad audit. Each overlap involves two agents from different squads that touch the same domain but with clearly distinct scopes. This documentation prevents future contributors from creating true duplications and provides a reference for delegation decisions.

---

## Overlap Registry

### 1. SEO Content

| Dimension | copy/seo-writer | marketing/content-manager |
|-----------|-----------------|---------------------------|
| **Scope** | Writes SEO-optimized copy (meta tags, headings, alt text, body content) | Plans SEO strategy, publishes content, monitors rankings and performance |
| **Input** | Brief with keywords, brand voice, target audience | SEO audit data, keyword research, competitive positioning |
| **Output** | SEO-ready copy artifacts (text files, markdown) | Editorial calendar, published content, performance reports |
| **Domain** | Execution -- writing | Strategy -- planning and measurement |
| **Verdict** | Complementary. Writer produces; manager distributes and measures. |

### 2. Brand Consistency Review

| Dimension | branding/qa-reviewer | qa-accessibility/brand-compliance |
|-----------|---------------------|-----------------------------------|
| **Scope** | Reviews all branding squad deliverables for visual fidelity, token compliance, and WCAG basics | Reviews cross-squad deliverables for brand guideline adherence (logo usage, color, typography) |
| **Input** | Brand tokens, design specs, branding squad output | Brand book, published guidelines, any squad output |
| **Output** | PASS/CONCERNS/FAIL verdict on branding artifacts | Brand compliance score card for external-facing assets |
| **Domain** | Internal squad QA (branding artifacts only) | External cross-squad audit (any squad's assets) |
| **Verdict** | Complementary. QA-reviewer is internal gate; brand-compliance is external audit. |

### 3. Accessibility Testing

| Dimension | branding/qa-reviewer | qa-accessibility/a11y-tester |
|-----------|---------------------|------------------------------|
| **Scope** | Checks WCAG basics (contrast, alt text) as part of brand deliverable review | Full WCAG 2.1 AA/AAA audit with tooling (axe, Lighthouse, screen reader testing) |
| **Input** | Brand deliverables from branding squad | Any web deliverable from any squad |
| **Output** | Basic a11y pass/fail within brand review | Detailed a11y audit report with remediation steps |
| **Domain** | Surface-level a11y as part of brand QA | Deep a11y specialization |
| **Verdict** | Complementary. QA-reviewer catches basics; a11y-tester does deep audit. |

### 4. Visual Audit

| Dimension | qa-accessibility/visual-qa | branding/qa-reviewer |
|-----------|--------------------------|---------------------|
| **Scope** | Visual regression testing, screenshot comparison, layout consistency across breakpoints | Visual fidelity to brand tokens, design system compliance, creative direction alignment |
| **Input** | Rendered pages, screenshots, design specs | Brand tokens, design system, creative briefs |
| **Output** | Visual regression report (pixel diff, layout shift scores) | Brand fidelity verdict (PASS/CONCERNS/FAIL) |
| **Domain** | Technical visual testing (automated) | Creative/brand visual review (manual/hybrid) |
| **Verdict** | Complementary. Visual-qa is automated regression; qa-reviewer is creative fidelity. |

### 5. Content Creation

| Dimension | copy squad (all agents) | produto/content-creator |
|-----------|------------------------|-------------------------|
| **Scope** | Brand-aligned copywriting (SEO, UX, editorial, social media, email) | Product-focused content (feature descriptions, release notes, help center articles) |
| **Input** | Brand voice guide, briefs, audience research | Product specs, feature PRDs, user feedback |
| **Output** | Marketing and brand copy artifacts | Product documentation and user-facing content |
| **Domain** | Brand and marketing communication | Product communication |
| **Verdict** | Complementary. Copy squad writes brand/marketing content; content-creator writes product content. |

### 6. Image Generation

| Dimension | branding/ai-orchestrator | visual-production squad |
|-----------|-------------------------|------------------------|
| **Scope** | AI-generated brand assets (logos, icons, mood boards, brand imagery) as part of brand identity creation | Production-ready visual assets (social media graphics, ads, presentations, packaging) at scale |
| **Input** | Brand profile, design tokens, creative direction | Approved brand assets, campaign briefs, templates |
| **Output** | Brand identity visual assets (exploratory/generative) | Final production assets (sized, formatted, exported) |
| **Domain** | Brand identity creation (upstream) | Visual production (downstream) |
| **Verdict** | Complementary. AI-orchestrator creates brand visuals; visual-production produces final deliverables from them. |

### 7. Email Marketing

| Dimension | copy/email-specialist | marketing/email-strategist |
|-----------|----------------------|---------------------------|
| **Scope** | Writes email copy (subject lines, body text, CTAs) for sequences and campaigns | Plans email strategy, builds sequences, segments audience, analyzes metrics |
| **Input** | Copy brief, brand voice guide, messaging hierarchy | Campaign goals, audience segments, behavioral data |
| **Output** | Email copy artifacts (subject lines, body copy, CTA variants) | Sequence architecture, segmentation rules, performance reports |
| **Domain** | Execution -- writing email copy | Strategy -- planning, automation and measurement |
| **Verdict** | Complementary. Email-specialist writes; email-strategist plans, automates, and measures. |

---

## Cross-Reference: Delegation Rules

When a task touches an overlap boundary, use these rules:

1. **If the task is about writing/creating content**: Route to the squad that owns the content type (brand copy to copy squad, product content to produto squad).
2. **If the task is about reviewing/auditing**: Route to the squad that owns the audit scope (internal brand QA to branding/qa-reviewer, cross-squad brand audit to qa-accessibility/brand-compliance).
3. **If the task is about production/delivery**: Route to the downstream squad (visual-production for final assets, marketing for publishing).
4. **If unclear**: Escalate to orchestrator for routing decision.

---

*Generated from Audit Report Finding M5 -- 2026-03-30*
