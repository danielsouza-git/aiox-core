# linkedin-ads-copy

```yaml
task:
  id: linkedin-ads-copy
  name: Write LinkedIn Ads Copy (Profile-Driven)
  agent: ads-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
  optional:
    - campaign_objective: "Awareness, Consideration, Conversions (default: from manifest)"
    - target_audience_override: "Override targeting (default: from brand profile)"
    - offer: "What's being promoted"
    - ad_format: "Single image, Carousel, Video, Text, Message (default: from manifest)"
    - landing_page: "Destination URL"
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"
    - existing_ads: "Current LinkedIn ads"

outputs:
  - linkedin_ads/: "Folder with all ad variants"
  - creative_specs.md: "Image/video requirements"
  - targeting_notes.md: "Audience targeting suggestions"

pre_conditions:
  - "Brand profile exists with industry, archetype, and target audience"
  - "Content manifest exists with Ad Strategy section"

post_conditions:
  - "LinkedIn Ads confirmed as selected channel in manifest"
  - "B2B tone derived from archetype (formality adjusted per archetype)"
  - "Targeting derived from brand profile audience"
  - "Ad angles match archetype + LinkedIn professional context"
  - "3-5 ad variants created"
  - "Specs within limits"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for ad channel selection. LinkedIn Ads are typically
selected for B2B industries (SaaS, Finance, Education, Creative Agency) and archetypes that
align with professional communication (Ruler, Sage, Hero). Read `brand-profile.yaml` for
industry context and audience targeting. Do NOT hardcode B2B assumptions.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Ad Strategy section:
   - Is LinkedIn Ads a selected channel?
   - Campaign type, budget priority, ad formats
   - Ad tone for LinkedIn (archetype base + professional modifier)
2. Read `brand-profile.yaml`:
   - `personality.archetypes` -> shapes professional tone level
   - `client.industry` -> determines if B2B focus is appropriate
   - `client.target_audience` -> job titles, company sizes, industries
   - `competitors.differentiation` -> competitive angles for ads
3. If LinkedIn Ads is NOT in manifest ad channels, SKIP this task
4. Derive targeting from brand profile (job titles, industries from target_audience)

## Workflow

### Phase 1: LinkedIn Ad Specs (5 min)

**Sponsored Content (Single Image):**

| Element | Limit |
|---------|-------|
| Intro Text | 150 chars (visible), 600 max |
| Headline | 70 chars (200 max) |
| Description | 100 chars |
| Image | 1200x627 (1.91:1) |
| CTA | Standard buttons |

**Sponsored Content (Carousel):**

| Element | Limit |
|---------|-------|
| Intro Text | 150 chars visible |
| Cards | 2-10 |
| Card Headline | 45 chars |
| Image per Card | 1080x1080 |

**Message Ads:**

| Element | Limit |
|---------|-------|
| Subject | 60 chars |
| Message | 1,500 chars |
| CTA Button | 20 chars |

### Phase 2: B2B Angle Selection (5 min)

**LinkedIn-Specific Angles:**

| Angle | Hook Style | Best For |
|-------|------------|----------|
| **Industry Pain** | "[Industry] leaders struggle with..." | Awareness |
| **ROI/Results** | "[X]% improvement in [metric]" | Consideration |
| **Thought Leadership** | "The future of [topic]..." | Brand building |
| **FOMO** | "[Competitor] already using..." | Urgency |
| **Data/Research** | "New research shows..." | Authority |
| **Direct Value** | "Get [specific outcome]" | Conversions |

### Phase 3: Ad Writing (30 min)

## LinkedIn Ad Templates

### Template 1: Sponsored Content (Single Image) — Pain/Solution

```markdown
# Ad Variant: Pain/Solution

## Creative Direction:
- Professional imagery (not stock-feeling)
- Clean, minimal design
- Data visualization if applicable

## Intro Text (150 visible / 600 max):

**Version A (Short):**
"[Job Title]s: Stop wasting time on [pain point].

[Product] helps you [achieve outcome] without [obstacle].

See why [X,XXX]+ companies trust us."

**Version B (Detailed):**
"Every [Job Title] knows this struggle:

❌ [Pain point 1]
❌ [Pain point 2]
❌ [Pain point 3]

What if you could [ideal outcome]?

[Product] gives you:
✓ [Benefit 1]
✓ [Benefit 2]
✓ [Benefit 3]

[Social proof or offer]"

## Headline (70 chars):
"[Outcome] for [Audience] — Without [Pain]"

## Description (100 chars):
"[Specific result]. [Differentiator]. [CTA]."

## CTA Button:
[Learn More / Download / Request Demo]
```

### Template 2: Sponsored Content — Data/Authority

```markdown
# Ad Variant: Data-Driven

## Creative Direction:
- Chart or statistic visual
- Professional, authoritative
- Report/whitepaper aesthetic

## Intro Text:

"📊 New research from [Source]:

[X]% of [audience] report [problem/trend].

But the top performers do things differently.

In our latest [report/guide], we analyzed [X] companies and found:

→ [Key finding 1]
→ [Key finding 2]
→ [Key finding 3]

Download the full report (free) 👇"

## Headline:
"[Year] [Topic] Report — [X] Pages of Insights"

## Description:
"Data from [X]+ companies. Actionable insights. Free download."

## CTA Button:
[Download]
```

### Template 3: Sponsored Content — Case Study

```markdown
# Ad Variant: Case Study

## Creative Direction:
- Customer logo or photo
- Result metrics prominent
- Before/after if applicable

## Intro Text:

"How [Company] achieved [specific result]:

'[Short quote from customer]'
— [Name], [Title] at [Company]

The challenge: [Problem]
The solution: [Product/approach]
The result: [Specific metrics]

Read the full case study 👇"

## Headline:
"[Company] Increased [Metric] by [X]%"

## Description:
"See how they did it — and how you can too."

## CTA Button:
[Learn More]
```

### Template 4: Carousel Ad

```markdown
# Ad Variant: Carousel

## Intro Text:
"The [X] things every [Job Title] needs to know about [topic]:

Swipe through for quick insights 👉

(Save this for later)"

---

## Card 1: Hook
**Image:** Eye-catching visual with "1/5"
**Headline:** "[Topic]: What You Need to Know"

## Card 2: Point 1
**Image:** Visual representing point 1
**Headline:** "#1: [Key point]"

## Card 3: Point 2
**Image:** Visual representing point 2
**Headline:** "#2: [Key point]"

## Card 4: Point 3
**Image:** Visual representing point 3
**Headline:** "#3: [Key point]"

## Card 5: CTA
**Image:** Product/brand visual
**Headline:** "Ready to [outcome]? Get started →"

---

## CTA Button:
[Learn More / Download]
```

### Template 5: Message Ad

```markdown
# Ad Variant: InMail/Message Ad

## Subject (60 chars):
"Quick question about [topic], [First Name]"

## Message Body (1,500 chars max):

"Hi [First Name],

I noticed you're a [Job Title] at [Company] — we've helped other [industry] leaders like you [achieve outcome].

Quick context: [1-2 sentences about what you do and why it matters]

[Companies like X, Y, Z] are already using [Product] to:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

I'd love to show you how it works — just a quick 15-minute call.

Would [Day 1] or [Day 2] work for a brief chat?

[Signature]

P.S. [Additional value or urgency]"

## CTA Button (20 chars):
"Schedule a Call"
```

### Template 6: Text Ad

```markdown
# Ad Variant: Text Ad

## Headline (25 chars):
"[Outcome] for [Audience]"

## Description (75 chars):
"[Problem]? [Product] helps you [benefit]. [CTA]."

## Image: 100x100 logo or product image
```

## B2B Copywriting Best Practices

**Do:**
- Lead with business outcomes
- Use specific metrics/data
- Reference job titles directly
- Mention enterprise features (security, scale)
- Include social proof (logos, case studies)

**Don't:**
- Use consumer-style urgency ("Buy now!")
- Oversimplify complex solutions
- Ignore the buying committee
- Use jargon without context

## Targeting Notes Template

```markdown
## Recommended Targeting

### Job Titles:
- [Title 1]
- [Title 2]
- [Title 3]

### Industries:
- [Industry 1]
- [Industry 2]

### Company Size:
- [X-Y employees] or [Revenue range]

### Seniority:
- [Entry / Senior / Manager / Director / VP / C-Suite]

### Exclusions:
- Competitors
- Current customers (if applicable)
- Job seekers (if B2B)
```

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] LinkedIn Ads confirmed as selected channel in manifest
- [ ] Professional tone calibrated to archetype (not generic B2B)
- [ ] Targeting derived from brand profile audience
- [ ] Ad angles match archetype + LinkedIn context
- [ ] 3-5 ad variants created
- [ ] Character limits respected
- [ ] Multiple angles represented (archetype-appropriate)
- [ ] Creative direction aligns with brand visual direction
- [ ] Targeting recommendations derived from profile
- [ ] Message ad if applicable (from manifest ad formats)
- [ ] Carousel structure clear

## Quality Gate
- Threshold: >70%
- Professional B2B tone calibrated to archetype (not generic corporate speak)
- Intro text within 150 visible characters, headline within 70 characters
- Targeting recommendations derived from brand profile audience (job titles, industries, seniority)

---
*Copy Squad Task*
