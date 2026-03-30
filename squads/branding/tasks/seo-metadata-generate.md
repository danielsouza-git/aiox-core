# seo-metadata-generate

```yaml
task: seoMetadataGenerate()
agent: web-builder
squad: branding
prd_refs: [FR-3.7]

inputs:
  - name: page_content
    type: PageContent
    required: true
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: keyword_research
    type: KeywordResearch
    required: false

outputs:
  - name: seo_metadata
    type: SEOMetadata
    destination: .aiox/branding/{client}/web/seo/{page_id}.yaml
  - name: meta_tags
    type: html
    destination: .aiox/branding/{client}/web/seo/{page_id}-meta.html

tools:
  - ai-orchestrator
  - seo-analyzer
```

## Purpose

Generate SEO metadata for all pages: titles, descriptions, headings, alt text, URLs, internal links.

## Metadata Components

```yaml
components:
  meta_title:
    max_length: 60 characters
    format: "Primary Keyword - Secondary | Brand"
    include_keyword: required

  meta_description:
    max_length: 155 characters
    include_cta: recommended
    include_keyword: required

  h1:
    count: exactly 1 per page
    alignment: with meta_title
    include_keyword: required

  h2_h6:
    count: 3-7 per page
    include_secondary_keywords: yes
    hierarchy: proper nesting

  alt_text:
    per_image: descriptive + keyword (natural)
    max_length: 125 characters
    avoid: "image of", "picture of"

  url_slug:
    format: kebab-case
    max_length: 60 characters
    include_keyword: when natural

  internal_links:
    count: 2-3 per page
    anchor_text: keyword_rich (varied)
```

## Schema.org Markup

```yaml
schema_types:
  organization:
    applies_to: home, about
    properties:
      - name
      - url
      - logo
      - contactPoint
      - sameAs (social)

  local_business:
    applies_to: contact
    properties:
      - name
      - address
      - telephone
      - openingHours

  article:
    applies_to: blog posts
    properties:
      - headline
      - author
      - datePublished
      - image

  product:
    applies_to: product pages
    properties:
      - name
      - description
      - price
      - availability

  faq_page:
    applies_to: faq sections
    properties:
      - mainEntity (Q&A pairs)

  breadcrumb:
    applies_to: all pages
    properties:
      - itemListElement
```

## Output Format

```html
<!-- Meta Tags -->
<title>Primary Keyword - Secondary | Brand Name</title>
<meta name="description" content="Compelling description with keyword and CTA under 155 chars.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://example.com/page-slug">

<!-- Open Graph -->
<meta property="og:title" content="Title for Social">
<meta property="og:description" content="Description for social sharing">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com/page-slug">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Title for Twitter">
<meta name="twitter:description" content="Description for Twitter">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">

<!-- Schema.org -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  ...
}
</script>
```

## Generation Process

```yaml
steps:
  - step: analyze_content
    extract:
      - main_topic
      - key_points
      - target_audience

  - step: keyword_mapping
    if: keyword_research_provided
    assign: primary + secondary keywords

  - step: generate_meta_title
    constraints:
      - include_primary_keyword
      - under_60_chars
      - compelling

  - step: generate_meta_description
    constraints:
      - include_keyword
      - under_155_chars
      - include_cta

  - step: optimize_headings
    ensure:
      - h1_unique_with_keyword
      - h2_h6_logical_hierarchy
      - secondary_keywords_distributed

  - step: generate_alt_text
    per_image: descriptive + contextual

  - step: create_schema_markup
    select: appropriate_type
    populate: required_properties

  - step: generate_og_twitter
    create: social_sharing_tags

  - step: validate
    checks:
      - no_duplicate_titles
      - all_images_have_alt
      - schema_valid
```

## Pre-Conditions

- [ ] Page content available
- [ ] Brand name defined
- [ ] Keywords (optional but recommended)

## Post-Conditions

- [ ] All metadata generated
- [ ] Schema markup valid
- [ ] Meta tags ready for insertion

## Acceptance Criteria

- [ ] Titles under 60 chars
- [ ] Descriptions under 155 chars
- [ ] All images have alt text
- [ ] Schema validates (Google Rich Results Test)

## Quality Gate

- Threshold: >70%
- All pages have unique title and meta description
- Open Graph and Twitter Card meta tags present
- Schema markup validates via Google Rich Results Test

---
*Branding Squad Task - web-builder*
