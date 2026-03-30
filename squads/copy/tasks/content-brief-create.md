# content-brief-create

```yaml
task:
  id: content-brief-create
  name: Create Content Brief (Profile-Driven)
  agent: seo-writer
  squad: copy
  type: planning
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
  optional:
    - target_keyword_override: "Override keyword (default: from manifest SEO keyword clusters)"
    - content_type: "Blog, pillar, landing, product (default: from manifest content types)"
    - search_intent: "Informational, commercial, transactional (default: derived from keyword)"
    - competitor_urls: "Top ranking content (default: from brand profile competitors)"
    - internal_links: "Pages to link to"
    - subject_matter_expert: "SME for interviews"

outputs:
  - content_brief.md: "Complete brief for writer"
  - competitor_analysis.md: "SERP analysis"
  - outline.md: "Suggested structure"

pre_conditions:
  - "Brand profile exists with industry and competitor data"
  - "Content manifest exists with SEO Strategy and Content Pillars"

post_conditions:
  - "Brief references content pillars and keyword clusters from manifest"
  - "Voice & tone section uses archetype profile"
  - "Competitor URLs sourced from brand profile (if available)"
  - "Brief actionable for writer"
  - "SEO requirements clear"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for keyword clusters, content pillars, and SEO content plan.
Read `brand-profile.yaml` for competitor URLs, industry context, and archetype tone. The brief
must guide the writer to produce profile-aligned content, not generic SEO copy.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> SEO Strategy:
   - Keyword clusters (select keyword from appropriate cluster)
   - SEO content plan (word count, priority, search intent)
2. Read `content-manifest.md` -> Content Pillars:
   - Ensure topic aligns with a pillar
3. Read `content-manifest.md` -> Tone & Voice Profile:
   - Include tone profile in brief for writer
4. Read `brand-profile.yaml`:
   - `competitors.urls` -> for competitive analysis
   - `client.industry` -> for SERP context
   - `personality.archetypes` -> for voice & tone section of brief
   - `personality.tone_of_voice` -> for voice & tone section of brief

## Workflow

### Phase 1: Keyword Research (10 min)
1. Analyze primary keyword
2. Identify secondary/LSI keywords
3. Map search intent
4. Check search volume and difficulty

### Phase 2: Competitive Analysis (15 min)
1. Analyze top 5-10 SERP results
2. Identify content gaps
3. Note winning patterns
4. Find differentiation opportunities

### Phase 3: Brief Creation (20 min)

## Content Brief Template

```markdown
# Content Brief: [Working Title]

**Brief ID:** [ID]
**Created:** [Date]
**Assigned To:** [Writer]
**Due Date:** [Date]
**Status:** [Draft / In Review / Approved]

---

## Executive Summary

**Goal:** [What this content should achieve]
**Target Audience:** [Who this is for]
**Key Message:** [One sentence core message]

---

## Keyword Strategy

### Primary Keyword
- **Keyword:** [Primary keyword]
- **Monthly Search Volume:** [X,XXX]
- **Keyword Difficulty:** [X/100]
- **Current Ranking:** [Position or N/A]
- **Search Intent:** [Informational / Commercial / Transactional]

### Secondary Keywords
| Keyword | Volume | Difficulty | Include In |
|---------|--------|------------|------------|
| [Keyword 1] | [X] | [X] | H2, Body |
| [Keyword 2] | [X] | [X] | H3, Body |
| [Keyword 3] | [X] | [X] | Body |
| [Keyword 4] | [X] | [X] | FAQ |

### LSI/Related Terms
- [Term 1]
- [Term 2]
- [Term 3]
- [Term 4]
- [Term 5]

---

## Competitive Analysis

### Top Ranking Content

| Rank | URL | Word Count | Key Strengths | Gaps |
|------|-----|------------|---------------|------|
| 1 | [URL] | [X] | [What they do well] | [What's missing] |
| 2 | [URL] | [X] | [What they do well] | [What's missing] |
| 3 | [URL] | [X] | [What they do well] | [What's missing] |
| 4 | [URL] | [X] | [What they do well] | [What's missing] |
| 5 | [URL] | [X] | [What they do well] | [What's missing] |

### Competitive Insights

**What competitors do well:**
- [Pattern 1]
- [Pattern 2]
- [Pattern 3]

**Content gaps we can fill:**
- [Gap 1]
- [Gap 2]
- [Gap 3]

**Our differentiation:**
- [Unique angle 1]
- [Unique angle 2]

---

## Content Requirements

### Format & Length
- **Content Type:** [Blog / Pillar / Landing / etc.]
- **Word Count:** [X,XXX - X,XXX words]
- **Reading Level:** [Grade level or complexity]
- **Tone:** [Professional / Conversational / Technical]

### Structure Requirements
- [ ] H1 with primary keyword
- [ ] [X] H2 sections minimum
- [ ] Table of contents (if >2000 words)
- [ ] Bullet points for scannability
- [ ] [X] images minimum
- [ ] FAQ section with [X] questions

### SEO Requirements
- [ ] Primary keyword in first 100 words
- [ ] Primary keyword in 2-3 H2s
- [ ] Secondary keywords naturally included
- [ ] Keyword density 1-2%
- [ ] Meta title (50-60 chars)
- [ ] Meta description (150-160 chars)

---

## Suggested Outline

### Title Options
1. [Title option 1]
2. [Title option 2]
3. [Title option 3]

### Outline

**H1:** [Main title]

**Introduction**
- Hook: [Suggested hook]
- Context: [What to cover]
- Promise: [What reader will learn]

**H2:** [Section 1 Title]
- H3: [Subtopic]
- H3: [Subtopic]
- Key point: [What to emphasize]

**H2:** [Section 2 Title]
- H3: [Subtopic]
- H3: [Subtopic]
- Include: [Specific element]

**H2:** [Section 3 Title]
- H3: [Subtopic]
- H3: [Subtopic]
- Data: [Stat or research to include]

**H2:** [Section 4 Title]
- [Content notes]

**H2:** FAQ
- Q: [Question 1]
- Q: [Question 2]
- Q: [Question 3]

**Conclusion**
- Summary
- CTA: [Specific call to action]

---

## Linking Strategy

### Internal Links (Required)
| Anchor Text | Target URL | Context |
|-------------|------------|---------|
| [Text] | [URL] | [Where to place] |
| [Text] | [URL] | [Where to place] |
| [Text] | [URL] | [Where to place] |

### External Links (Suggested)
| Topic | Suggested Source | Type |
|-------|-----------------|------|
| [Topic] | [Authority site] | Data/research |
| [Topic] | [Authority site] | Definition |

---

## Content Inputs

### Research & Data
- [ ] [Specific stat or data point needed]
- [ ] [Industry research to reference]
- [ ] [Case study or example]

### Expert Input
- **SME:** [Name if applicable]
- **Questions to ask:**
  - [Question 1]
  - [Question 2]

### Visual Assets
- [ ] Featured image concept: [Description]
- [ ] Infographic: [Topic if applicable]
- [ ] Screenshots: [What to capture]
- [ ] Charts/graphs: [Data to visualize]

---

## Brand Guidelines

### Voice & Tone
- [Voice characteristic 1]
- [Voice characteristic 2]
- [Tone for this piece]

### Do's
- [Do this]
- [Do this]
- [Do this]

### Don'ts
- [Avoid this]
- [Avoid this]
- [Avoid this]

---

## Success Metrics

### Primary Goal
- **Metric:** [Organic traffic / Rankings / Conversions]
- **Target:** [Specific number or position]
- **Timeframe:** [When to measure]

### Secondary Goals
- [Metric 1]: [Target]
- [Metric 2]: [Target]

---

## Review Process

1. **First Draft Due:** [Date]
2. **SEO Review:** [Reviewer]
3. **Editorial Review:** [Reviewer]
4. **Final Approval:** [Approver]
5. **Publish Date:** [Date]

---

## Additional Notes

[Any other context, preferences, or requirements]
```

## Content Brief Checklist

```markdown
## Before Sending Brief
- [ ] Primary keyword validated (volume + difficulty)
- [ ] Search intent clearly identified
- [ ] Competitive analysis complete
- [ ] Content gaps identified
- [ ] Outline is actionable
- [ ] Word count is competitive
- [ ] Internal links identified
- [ ] Success metrics defined
- [ ] Timeline is realistic
```

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before creating brief
- [ ] Keyword sourced from manifest SEO keyword clusters
- [ ] Topic aligned with content pillar from manifest
- [ ] Voice & tone section uses archetype profile from manifest
- [ ] Competitor URLs from brand profile used in analysis
- [ ] Keyword strategy complete
- [ ] Competitive analysis done
- [ ] Actionable outline provided
- [ ] SEO requirements clear
- [ ] Linking strategy defined
- [ ] Success metrics set
- [ ] Brief ready for writer handoff

## Quality Gate
- Threshold: >70%
- Primary keyword validated with search volume and difficulty data
- Actionable outline with H1/H2/H3 structure provided for writer
- Voice and tone section references archetype profile from manifest (not generic guidelines)

---
*Copy Squad Task*
