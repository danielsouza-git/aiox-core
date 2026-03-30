# seo-meta-write

```yaml
task:
  id: seo-meta-write
  name: Write SEO Meta Tags (Profile-Driven)
  agent: seo-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
    - page_content: "Content of the page"
  optional:
    - target_keyword_override: "Override keyword (default: from manifest SEO keyword clusters)"
    - page_type: "Blog, product, landing, homepage, category"
    - competitor_metas: "Competitor meta tags"
    - character_limits: "Custom limits if applicable"

outputs:
  - meta_tags.md: "Complete meta tag set"
  - schema_markup.md: "Structured data recommendations"
  - og_tags.md: "Open Graph tags for social"

pre_conditions:
  - "Brand profile exists with industry and client name"
  - "Content manifest exists with SEO Strategy section"

post_conditions:
  - "Keywords sourced from manifest SEO keyword clusters (not invented)"
  - "Title includes brand name from brand_profile.yaml"
  - "Title 50-60 characters"
  - "Description 150-160 characters, using archetype tone"
  - "Schema type matches industry (LocalBusiness for cafe, SoftwareApplication for SaaS, etc.)"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` -> SEO Strategy section for keyword clusters, meta tag plan,
and target pages. Read `brand-profile.yaml` for industry (determines schema type) and client name
(for title formatting). Do NOT invent keywords. Use manifest clusters as starting direction.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> SEO Strategy section:
   - Keyword clusters (primary, secondary, long-tail by industry)
   - SEO content plan (pages, target keywords, search intent)
   - Meta tags plan (title format, description angle per page)
2. Read `brand-profile.yaml`:
   - `client.name` -> for brand name in titles
   - `client.industry` -> for schema type selection and keyword context
   - `client.location` -> for local SEO keywords (if applicable)
   - `personality.archetypes` -> for description tone
3. Select target keyword: use `target_keyword_override` if provided, otherwise pull from manifest
4. Select schema type based on industry:
   - Cafe/Restaurant -> LocalBusiness, Restaurant, CafeOrCoffeeShop
   - SaaS/Tech -> SoftwareApplication, WebApplication
   - Health -> MedicalBusiness, HealthAndBeautyBusiness
   - Education -> EducationalOrganization, Course
   - Finance -> FinancialService
   - Real Estate -> RealEstateAgent, RealEstateListing

## Workflow

### Phase 1: Page Analysis (5 min)
1. Identify primary message
2. Extract key benefits
3. Note target keyword
4. Understand search intent

### Phase 2: Meta Writing (15 min)
1. Write 3-5 title variants
2. Write 3-5 description variants
3. Create social tags
4. Recommend schema

### Phase 3: Optimization (5 min)

## Meta Tags Template

```markdown
# SEO Meta Tags: [Page Name]

**Page URL:** [URL]
**Primary Keyword:** [Keyword]
**Page Type:** [Type]

---

## Meta Title Variants (50-60 chars)

### Option 1 (Keyword-First):
**Title:** "[Keyword]: [Benefit/Promise] | [Brand]"
**Characters:** [XX]

### Option 2 (Benefit-First):
**Title:** "[Benefit] — [Keyword] | [Brand]"
**Characters:** [XX]

### Option 3 (How-To):
**Title:** "How to [Achieve Outcome]: [Keyword] Guide | [Brand]"
**Characters:** [XX]

### Option 4 (List):
**Title:** "[X] Best [Keyword] for [Outcome] ([Year]) | [Brand]"
**Characters:** [XX]

### Option 5 (Question):
**Title:** "What is [Keyword]? Complete Guide | [Brand]"
**Characters:** [XX]

**Recommended:** [Option X] — [Reason]

---

## Meta Description Variants (150-160 chars)

### Option 1 (Benefit-Focused):
**Description:** "[Benefit statement]. Learn how to [action] with our [resource]. [CTA]."
**Characters:** [XXX]

### Option 2 (Problem-Solution):
**Description:** "Struggling with [problem]? Our guide to [keyword] shows you [solution]. [Proof point]. [CTA]."
**Characters:** [XXX]

### Option 3 (Feature-Rich):
**Description:** "[Keyword] made easy. [Feature 1], [Feature 2], and [Feature 3]. [CTA with value]."
**Characters:** [XXX]

### Option 4 (Authority):
**Description:** "The complete guide to [keyword]. [X] chapters, [X] examples. Updated [Year]. [CTA]."
**Characters:** [XXX]

### Option 5 (Direct):
**Description:** "Learn [keyword] in [time/steps]. [Benefit]. Free [resource/tool]. Start now."
**Characters:** [XXX]

**Recommended:** [Option X] — [Reason]

---

## URL Slug

**Current:** [Current URL if exists]
**Optimized:** /[keyword-optimized-slug]

**URL Best Practices:**
- [ ] 3-5 words maximum
- [ ] Primary keyword included
- [ ] Hyphens, not underscores
- [ ] Lowercase
- [ ] No stop words (a, the, and)

---

## Open Graph Tags (Social)

```html
<meta property="og:title" content="[Title — can be longer than SEO title]">
<meta property="og:description" content="[Description — can be more engaging than SEO]">
<meta property="og:image" content="[Image URL — 1200x630 recommended]">
<meta property="og:url" content="[Canonical URL]">
<meta property="og:type" content="[article/website/product]">
<meta property="og:site_name" content="[Brand Name]">
```

---

## Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Title]">
<meta name="twitter:description" content="[Description]">
<meta name="twitter:image" content="[Image URL]">
<meta name="twitter:site" content="@[handle]">
```

---

## Schema Markup Recommendations

### For Blog Posts:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Title]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]"
  },
  "datePublished": "[Date]",
  "dateModified": "[Date]",
  "image": "[Image URL]"
}
```

### For How-To Content:
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[How-to Title]",
  "step": [
    {"@type": "HowToStep", "name": "[Step 1]", "text": "[Description]"},
    {"@type": "HowToStep", "name": "[Step 2]", "text": "[Description]"}
  ]
}
```

### For FAQ Content:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 1]"
      }
    }
  ]
}
```

### For Products:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[Description]",
  "offers": {
    "@type": "Offer",
    "price": "[Price]",
    "priceCurrency": "USD"
  }
}
```

---

## Additional Tags

```html
<!-- Canonical -->
<link rel="canonical" href="[Canonical URL]">

<!-- Robots -->
<meta name="robots" content="index, follow">

<!-- Language -->
<html lang="en">

<!-- Viewport (Mobile) -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```
```

## Meta Title Formulas

| Formula | Example |
|---------|---------|
| [Keyword]: [Benefit] \| [Brand] | "Email Marketing: 10x Your Opens \| Mailchimp" |
| How to [Action] [Keyword] \| [Brand] | "How to Write Converting Copy \| CopyHacks" |
| [X] Best [Keyword] ([Year]) \| [Brand] | "15 Best CRM Tools (2024) \| TechReview" |
| [Keyword] Guide: [Benefit] \| [Brand] | "SEO Guide: Rank #1 on Google \| Moz" |
| [Keyword] — [Benefit] for [Audience] | "Project Management — Made Simple for Teams" |

## Meta Description Formulas

| Formula | Use When |
|---------|----------|
| [Benefit]. [How]. [Proof]. [CTA]. | Product/service pages |
| Learn [topic] with our [resource]. [Features]. [CTA]. | Educational content |
| [Problem]? [Solution]. [Differentiator]. [CTA]. | Problem-aware audience |
| [X] [things] to [outcome]. [Bonus]. [CTA]. | List content |
| Discover [keyword]. [What they'll learn]. Updated [Year]. | Guides/pillar content |

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] Keywords sourced from manifest SEO keyword clusters
- [ ] Brand name from profile used in title variants
- [ ] Schema type matches client industry
- [ ] Description tone matches archetype profile
- [ ] 3-5 title variants provided
- [ ] 3-5 description variants provided
- [ ] All within character limits
- [ ] Keyword naturally included
- [ ] Recommendation with rationale
- [ ] Open Graph tags complete
- [ ] Twitter Card tags complete
- [ ] Schema markup recommended (industry-appropriate type)
- [ ] URL slug optimized
- [ ] Local SEO elements included if client has physical location

## Quality Gate
- Threshold: >70%
- Meta title between 50-60 characters with primary keyword and brand name
- Meta description between 150-160 characters with CTA
- Schema markup type matches client industry (LocalBusiness, SoftwareApplication, etc.)

---
*Copy Squad Task*
