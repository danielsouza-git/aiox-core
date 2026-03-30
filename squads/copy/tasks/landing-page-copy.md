# landing-page-copy

```yaml
task:
  id: landing-page-copy
  name: Write Landing Page Copy (Profile-Driven)
  agent: conversion-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
  optional:
    - copy_strategy: "Strategy document with messaging (if available)"
    - page_purpose: "Lead gen, sales, signup (default: derived from industry)"
    - cta_goal: "Specific action to drive (default: from manifest CTA strategy)"
    - wireframe: "Page layout/structure"
    - competitor_pages: "Competitor landing pages"
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"

outputs:
  - landing_page_copy.md: "Complete landing page copy"
  - variant_headlines.md: "A/B headline variants"
  - meta_copy.md: "SEO title and description"

pre_conditions:
  - "Brand profile exists with archetype, industry, and audience data"
  - "Content manifest exists with Landing Page Strategy and Framework Assignments"

post_conditions:
  - "Page sections match industry-specific sections from manifest"
  - "Copy follows framework assigned in manifest (not hardcoded default)"
  - "Tone matches archetype + landing page adjustment (+10% formality, +15% energy)"
  - "A/B variants use archetype-appropriate angles"
  - "Meta copy included with industry keywords from manifest"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for landing page strategy, framework assignment,
and industry-specific sections. Read `brand-profile.yaml` for archetype (shapes CTA language),
industry (shapes page sections), and target audience (shapes problem/solution framing).
Do NOT use generic sections. Every section is justified by the client profile.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Landing Page Strategy section:
   - Pages to create (purpose, framework, sections, SEO target)
   - Industry-specific sections
   - Framework assignment for landing pages
2. Read `content-manifest.md` -> Tone & Voice Profile:
   - Base tone + landing page modifier (+10% formality, +15% energy)
3. Read `brand-profile.yaml`:
   - `personality.archetypes` -> CTA language, headline angle
   - `client.industry` -> page sections, proof types, objection types
   - `client.target_audience` -> problem/desire framing
   - `personality.values` -> value proposition alignment
4. Derive page sections from industry:
   - Cafe: Hero, Menu Highlights, Our Story, Location/Hours, Reviews, CTA
   - SaaS: Hero, Problem, Solution, Features, Pricing, Testimonials, FAQ, CTA
   - Health: Hero, Services, Trust Signals, Team, Testimonials, Appointment CTA
   - (Full list in Content Selection Engine)

## Workflow

### Phase 1: Framework Selection (5 min)
Select based on page type:

| Page Type | Framework | Focus |
|-----------|-----------|-------|
| Lead gen | AIDA | Build interest, capture email |
| Sales | PASTOR | Full persuasion journey |
| Product | PAS | Problem to solution |
| Comparison | FAB | Features, advantages, benefits |

### Phase 2: Section-by-Section Writing (30 min)

#### Hero Section
- **Headline:** Stop the scroll (5-10 words)
- **Subheadline:** Clarify the offer (15-25 words)
- **Hero CTA:** Primary action

#### Problem Section
- Agitate the pain (2-3 paragraphs)
- Use specific, relatable scenarios
- Emotional language

#### Solution Section
- Introduce your solution
- Bridge from problem to product
- Position as the answer

#### Benefits Section
- 3-5 key benefits (not features)
- "So that..." format
- Visual hierarchy

#### Social Proof
- Testimonials (specific results)
- Logos/trust badges
- Statistics

#### FAQ/Objections
- Address top 3-5 objections
- Turn objections into benefits

#### Final CTA
- Urgency element
- Risk reversal (guarantee)
- Clear action

### Phase 3: A/B Variants (10 min)
Create 3-5 headline variants:
- Pain-focused variant
- Benefit-focused variant
- Curiosity variant
- Social proof variant

### Phase 4: Meta Copy (5 min)
- SEO Title (50-60 chars)
- Meta Description (150-160 chars)
- OG Title/Description

## Landing Page Template

```markdown
# [HEADLINE: Primary hook - stop the scroll]

## [Subheadline: Expand on headline, clarify offer]

[Hero CTA Button]

---

## [Problem Section Header]

[Problem paragraph 1 - identify the pain]

[Problem paragraph 2 - agitate the pain]

[Problem paragraph 3 - make it urgent]

---

## [Solution Section Header]

[Solution intro - what if there was a better way?]

[Solution description - introduce your product/service]

---

## Why [Product] Works

✓ **[Benefit 1]** - [Explanation]
✓ **[Benefit 2]** - [Explanation]
✓ **[Benefit 3]** - [Explanation]

---

## What Our Customers Say

> "[Testimonial with specific result]"
> — [Name, Title/Company]

---

## Frequently Asked Questions

**Q: [Objection 1]?**
A: [Answer that turns objection into benefit]

**Q: [Objection 2]?**
A: [Answer with proof point]

---

## [Final CTA Section]

[Urgency element]

[Risk reversal/guarantee]

[CTA Button]
```

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] Page sections match industry-specific structure from manifest
- [ ] Framework matches manifest assignment (not hardcoded default)
- [ ] Headline uses archetype-appropriate angle
- [ ] Tone matches archetype base + landing page modifier
- [ ] Benefits framed for target audience from profile
- [ ] Social proof type matches industry (testimonials vs data vs logos)
- [ ] Objections are industry-specific
- [ ] CTA uses brand tone profile language
- [ ] 3+ A/B headline variants with different archetype angles
- [ ] Meta copy uses industry keywords from manifest SEO clusters
- [ ] All landing page sections complete

## Quality Gate
- Threshold: >70%
- Hero headline is 5-10 words and stops the scroll
- At least 3 A/B headline variants with different archetype angles provided
- Social proof section uses industry-appropriate proof type (testimonials, data, logos)

---
*Copy Squad Task*
