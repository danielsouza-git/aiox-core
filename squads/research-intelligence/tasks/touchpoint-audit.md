# touchpoint-audit

```yaml
task:
  id: touchpoint-audit
  name: Brand Touchpoint Audit
  agent: brand-auditor
  squad: research-intelligence
  type: audit
  elicit: true

inputs:
  required:
    - brand: "Brand to audit"
    - touchpoint_scope: "all | digital-only | physical-only"
  optional:
    - brand_guidelines: "Existing brand guidelines"
    - customer_journey: "Documented customer journey"
    - priority_touchpoints: "Specific touchpoints to prioritize"
    - brand_assets: "Current brand asset library"

outputs:
  - touchpoint-audit.md: "Complete touchpoint audit report"
  - touchpoint-inventory.md: "Full inventory of all touchpoints"
  - compliance-scores.md: "Per-touchpoint compliance scoring"
  - remediation-plan.md: "Fix plan for non-compliant touchpoints"

pre_conditions:
  - "Brand guidelines exist (even if informal)"
  - "Touchpoint scope defined"

post_conditions:
  - "All touchpoints cataloged"
  - "Each touchpoint scored"
  - "Non-compliant touchpoints flagged"
  - "Remediation plan provided"
```

## Purpose

Audit every brand touchpoint across the customer journey, scoring each for brand guideline compliance and identifying inconsistencies that erode brand trust.

## Workflow

### Phase 1: Touchpoint Discovery (15 min)
1. Map the customer journey stages:
   - Awareness
   - Consideration
   - Purchase
   - Onboarding
   - Usage
   - Support
   - Renewal/Advocacy
2. List every touchpoint per stage
3. Classify as owned, earned, or paid
4. Note responsible team/person

### Phase 2: Digital Touchpoints Audit (30 min)

**Website:**
- [ ] Homepage
- [ ] About page
- [ ] Product/service pages
- [ ] Blog/content
- [ ] Pricing page
- [ ] Contact/support pages
- [ ] 404/error pages
- [ ] Checkout/signup flow

**Social Media:**
- [ ] Profile images and banners
- [ ] Bio/description text
- [ ] Content templates
- [ ] Story highlights
- [ ] Link in bio page

**Email:**
- [ ] Welcome email
- [ ] Transactional emails
- [ ] Newsletter template
- [ ] Promotional emails
- [ ] Signature blocks

**Advertising:**
- [ ] Display ads
- [ ] Social ads
- [ ] Search ads
- [ ] Retargeting ads

**Other Digital:**
- [ ] App UI (if applicable)
- [ ] Chatbot/live chat
- [ ] Help center/docs
- [ ] Webinar/video templates
- [ ] PDF downloads

### Phase 3: Physical Touchpoints Audit (20 min)
- [ ] Business cards
- [ ] Letterhead/stationery
- [ ] Packaging
- [ ] Signage
- [ ] Merchandise/swag
- [ ] Event materials
- [ ] Uniforms/name badges
- [ ] Vehicle wraps
- [ ] Store/office interiors

### Phase 4: Compliance Scoring (25 min)
Per touchpoint, score:
1. **Logo usage** (correct version, clear space, sizing) - 0-10
2. **Color compliance** (correct palette, no off-brand colors) - 0-10
3. **Typography compliance** (correct fonts, hierarchy) - 0-10
4. **Voice/tone compliance** (on-brand messaging) - 0-10
5. **Dark mode consistency** (if touchpoint supports dark mode) - 0-10
   - Dark mode palette follows brand guidelines
   - Logo variant appropriate for dark backgrounds
   - Color contrast meets WCAG AA in dark mode
   - Typography remains legible on dark surfaces
   - Imagery/icons adapted for dark backgrounds
   - Consistent dark mode experience across digital touchpoints
6. **Overall brand feel** (holistic impression) - 0-10

### Phase 5: Remediation Planning (15 min)
1. Flag critical non-compliance (score < 5)
2. Categorize fixes by effort:
   - Quick fix (< 1 hour)
   - Moderate effort (1 day)
   - Major effort (1 week+)
3. Prioritize by customer impact
4. Create remediation timeline

## Touchpoint Inventory Template

```markdown
# Brand Touchpoint Audit: [Brand]

## Touchpoint Inventory

| # | Touchpoint | Stage | Channel | Type | Owner | Logo | Color | Typo | Voice | Dark Mode | Overall | Priority |
|---|------------|-------|---------|------|-------|------|-------|------|-------|-----------|---------|----------|
| 1 | Homepage | Awareness | Web | Owned | [Team] | [/10] | [/10] | [/10] | [/10] | [/10 or N/A] | [/10] | [H/M/L] |
| 2 | Instagram Profile | Awareness | Social | Owned | [Team] | [/10] | [/10] | [/10] | [/10] | [N/A] | [/10] | [H/M/L] |

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Touchpoints | [X] |
| Average Score | [X]/10 |
| Compliant (8+) | [X] ([X]%) |
| Needs Improvement (5-7) | [X] ([X]%) |
| Non-Compliant (<5) | [X] ([X]%) |

## Critical Non-Compliance

| Touchpoint | Score | Issue | Impact | Fix Effort |
|------------|-------|-------|--------|------------|
| [Touchpoint] | [X]/10 | [What's wrong] | H/M/L | Quick/Moderate/Major |

## Remediation Plan

### Week 1 - Quick Fixes
1. [Fix] - [Touchpoint] - [Expected improvement]

### Week 2-4 - Moderate Fixes
1. [Fix] - [Touchpoint] - [Expected improvement]

### Month 2+ - Major Overhauls
1. [Fix] - [Touchpoint] - [Expected improvement]
```

## Acceptance Criteria

- [ ] All touchpoints in scope discovered and cataloged
- [ ] Each touchpoint scored across 6 compliance dimensions (including dark mode)
- [ ] Dark mode consistency evaluated for all digital touchpoints that support it
- [ ] Non-compliant touchpoints flagged with specific issues
- [ ] Summary statistics calculated
- [ ] Remediation plan with timeline
- [ ] Touchpoints prioritized by customer impact
- [ ] Quick wins identified
- [ ] Responsible teams/owners noted

---
*Research Intelligence Squad Task*
