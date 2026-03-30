# blog-post-create

```yaml
task:
  id: blog-post-create
  name: Write SEO Blog Post (Profile-Driven)
  agent: seo-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
    - topic: "Blog post topic (should align with a content pillar from manifest)"
  optional:
    - target_keyword_override: "Override keyword (default: from manifest SEO keyword clusters)"
    - search_intent: "Informational, commercial, transactional (default: derived from topic)"
    - word_count: "Target length (default: from manifest SEO content plan)"
    - secondary_keywords: "LSI and related keywords"
    - competitor_urls: "Top ranking articles"
    - internal_links: "Pages to link to"
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"

outputs:
  - blog_post.md: "Complete blog post"
  - meta_tags.md: "SEO title and description"
  - internal_links.md: "Link placement map"
  - image_alt_texts.md: "Alt text suggestions"

pre_conditions:
  - "Brand profile exists with industry and archetype data"
  - "Content manifest exists with SEO Strategy and Content Pillars"

post_conditions:
  - "Topic aligns with a content pillar from the manifest"
  - "Keywords sourced from manifest SEO keyword clusters"
  - "Tone matches archetype base + blog modifier (+5% formality, -5% energy)"
  - "Keyword density 1-2%"
  - "All on-page SEO elements"
  - "Internal links included"
  - "Images specified with alt text"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for content pillars (topic alignment), SEO keyword
clusters (keyword selection), and blog post quantities. Read `brand-profile.yaml` for archetype
(shapes writing tone and framework), industry (shapes topic expertise level), and target audience
(shapes reading level and complexity). Do NOT write generic content.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Content Pillars:
   - Verify topic aligns with one of the content pillars
   - Use pillar weight to determine depth (higher weight = more comprehensive posts)
2. Read `content-manifest.md` -> SEO Strategy:
   - Pull keyword from clusters if no override provided
   - Check SEO content plan for target word count and priority
3. Read `brand-profile.yaml`:
   - `personality.archetypes` -> writing framework (Sage=QUEST, Hero=AIDA)
   - `personality.tone_of_voice` -> blog voice
   - `client.industry` -> expertise depth, terminology level
   - `client.target_audience` -> reading level
4. Read `content-manifest.md` -> Framework Assignments:
   - Get assigned framework for blog content type

## Workflow

### Phase 1: Keyword Analysis (10 min)
1. Confirm primary keyword
2. Identify secondary/LSI keywords
3. Analyze search intent
4. Review SERP features

### Phase 2: Content Structure (10 min)
1. Create outline from top-ranking content
2. Identify content gaps
3. Plan unique angle
4. Structure H2/H3 hierarchy

### Phase 3: Writing (60 min)

## Blog Post Template

```markdown
# [SEO-Optimized Title with Primary Keyword]

**Meta Title (50-60 chars):**
[Title] | [Brand Name]

**Meta Description (150-160 chars):**
[Description with primary keyword and CTA]

**URL Slug:**
/[keyword-optimized-url]

---

## Table of Contents
1. [Section 1]
2. [Section 2]
3. [Section 3]
4. [Section 4]
5. [FAQ]
6. [Conclusion]

---

## Introduction (100-150 words)

[Hook - question or bold statement]

[Problem statement or context]

[What the reader will learn]

[Transition to first section]

**In this article, you'll discover:**
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

---

## [H2: First Main Section with Keyword]

[Opening paragraph establishing the point]

### [H3: Subtopic]

[Content with supporting details]

[Example or case study]

**Key takeaway:** [Highlight box content]

### [H3: Another Subtopic]

[Content]

[Bullet points for scannability:]
- [Point 1]
- [Point 2]
- [Point 3]

[IMAGE: [Image description]
ALT TEXT: [Keyword-rich alt text]]

---

## [H2: Second Main Section]

[Opening paragraph]

### [H3: Subtopic]

[Content with internal link: [anchor text](internal-url)]

[Data or statistics to support points]

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data | Data | Data |
| Data | Data | Data |

### [H3: Another Subtopic]

[Content]

> "[Quote or testimonial]" — Source

[External link to authoritative source: [anchor text](external-url)]

---

## [H2: Third Main Section]

[Content following same structure]

### [H3: Step-by-Step Process]

**Step 1: [Action]**
[Explanation]

**Step 2: [Action]**
[Explanation]

**Step 3: [Action]**
[Explanation]

---

## [H2: Fourth Main Section (Comparative or Deeper)]

[Content]

### Pros and Cons

**Pros:**
✓ [Pro 1]
✓ [Pro 2]
✓ [Pro 3]

**Cons:**
✗ [Con 1]
✗ [Con 2]

---

## [H2: Frequently Asked Questions]

### What is [keyword-related question]?

[Answer in 2-3 sentences, naturally including keyword]

### How do I [action-related question]?

[Answer with actionable steps]

### Why is [benefit-related question]?

[Answer explaining benefits]

### When should I [timing-related question]?

[Answer with specific guidance]

### How much does [cost-related question]?

[Answer with ranges or factors]

---

## Conclusion

[Summary of key points]

[Reiterate main benefit]

[CTA - what to do next]

**Next Steps:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

[Final CTA with internal link]

---

## Related Articles

- [Related Post 1](internal-link)
- [Related Post 2](internal-link)
- [Related Post 3](internal-link)
```

## On-Page SEO Checklist

```markdown
## Keyword Optimization

- [ ] Primary keyword in title (front-loaded)
- [ ] Primary keyword in H1
- [ ] Primary keyword in first 100 words
- [ ] Primary keyword in 2-3 H2s
- [ ] Primary keyword in URL slug
- [ ] Primary keyword in meta description
- [ ] Keyword density 1-2% (not forced)
- [ ] LSI keywords naturally included

## Content Structure

- [ ] H1 (title) — only one
- [ ] H2s for main sections
- [ ] H3s for subsections
- [ ] Short paragraphs (2-4 sentences)
- [ ] Bullet points for lists
- [ ] Table of contents for posts >1500 words
- [ ] Jump links working

## Links

- [ ] 3-5 internal links to relevant pages
- [ ] 2-3 external links to authoritative sources
- [ ] Anchor text descriptive (not "click here")
- [ ] External links open in new tab
- [ ] No broken links

## Media

- [ ] Featured image with alt text
- [ ] 3-5 images throughout
- [ ] All images have alt text with keyword
- [ ] Images compressed for speed
- [ ] Infographic or original visual if applicable

## Technical

- [ ] Meta title 50-60 characters
- [ ] Meta description 150-160 characters
- [ ] URL slug short and keyword-rich
- [ ] Schema markup (FAQ, How-to)
- [ ] Mobile-friendly formatting
```

## Content Length Guidelines

| Search Intent | Word Count | Depth |
|---------------|------------|-------|
| Quick answer | 1000-1500 | Overview |
| How-to | 1500-2500 | Step-by-step |
| Guide | 2500-4000 | Comprehensive |
| Pillar | 4000-6000 | Definitive |

## E-E-A-T Signals

- [ ] Author bio with credentials
- [ ] First-person experience (when applicable)
- [ ] Citations to authoritative sources
- [ ] Updated date visible
- [ ] Transparent about limitations
- [ ] Contact information accessible

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] Topic aligns with a content pillar from manifest
- [ ] Keywords sourced from manifest SEO keyword clusters
- [ ] Writing framework matches manifest assignment
- [ ] Tone matches archetype base + blog modifier
- [ ] Primary keyword optimized throughout
- [ ] Word count meets target from manifest SEO content plan
- [ ] All H2/H3 structure clear
- [ ] On-page SEO checklist complete
- [ ] Internal links placed naturally
- [ ] External links to authority sites
- [ ] Meta title and description written
- [ ] Alt text for all images
- [ ] FAQ section with schema-ready format
- [ ] E-E-A-T signals present (industry-appropriate)

## Quality Gate
- Threshold: >70%
- Primary keyword in title, H1, first 100 words, and 2-3 H2s with 1-2% density
- Meta title 50-60 chars, meta description 150-160 chars, both with keyword and CTA
- At least 3 internal links and 2 external authority links placed naturally

---
*Copy Squad Task*
