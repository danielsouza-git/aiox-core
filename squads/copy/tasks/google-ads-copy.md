# google-ads-copy

```yaml
task:
  id: google-ads-copy
  name: Write Google Ads Copy (Profile-Driven)
  agent: ads-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
  optional:
    - campaign_type: "Search, Display, Performance Max (default: from manifest ad strategy)"
    - keywords_override: "Override keywords (default: from manifest SEO keyword clusters)"
    - landing_page: "Destination URL"
    - competitors: "Competitor ads"
    - extensions: "Sitelinks, callouts, etc."
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"

outputs:
  - google_ads/: "Folder with all ad variants"
  - extension_copy.md: "Ad extensions copy"
  - keyword_mapping.md: "Ads to keyword group mapping"

pre_conditions:
  - "Brand profile exists with industry and differentiators"
  - "Content manifest exists with Ad Strategy and SEO keyword clusters"

post_conditions:
  - "Keywords from manifest SEO clusters (not invented)"
  - "Ad tone matches archetype + ad modifier (+25% energy, -10% formality)"
  - "USP derived from brand profile differentiators/values"
  - "Campaign type matches manifest ad channel selection"
  - "Responsive Search Ads complete"
  - "Ad extensions written"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for ad channel selection, keyword clusters, and ad tone.
Read `brand-profile.yaml` for industry (determines campaign type priority), archetype (shapes ad
angles), and competitive differentiators (shapes USP). Do NOT hardcode keywords or angles.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Ad Strategy section:
   - Selected ad channels (is Google Ads selected?)
   - Campaign type, budget priority, ad formats, targeting
   - Ad tone (energy, directness, hook style)
2. Read `content-manifest.md` -> SEO Strategy section:
   - Keyword clusters for ad group targeting
3. Read `brand-profile.yaml`:
   - `client.industry` -> determines campaign type priority
   - `personality.archetypes` -> shapes ad hook angles
   - `competitors.differentiation` -> unique selling proposition
   - `personality.values` -> proof points for extensions
   - `client.location` -> for local campaign targeting
4. If Google Ads is NOT in manifest ad channels, SKIP this task (recommend alternative channels)

## Workflow

### Phase 1: Google Ads Specs (5 min)

**Responsive Search Ads (RSA):**

| Element | Limit | Required |
|---------|-------|----------|
| Headlines | 30 chars each | 3-15 |
| Descriptions | 90 chars each | 2-4 |
| Final URL | - | Yes |
| Display Path | 15 chars x 2 | Optional |

**Display Ads:**

| Element | Limit |
|---------|-------|
| Short Headline | 25 chars |
| Long Headline | 90 chars |
| Description | 90 chars |
| Business Name | 25 chars |

### Phase 2: Keyword Analysis (10 min)

**Keyword Intent Mapping:**

| Intent | Keyword Type | Ad Focus |
|--------|--------------|----------|
| Informational | "what is X" | Educate → Lead |
| Navigational | "brand name" | Direct → Convert |
| Commercial | "best X for" | Compare → Demo |
| Transactional | "buy X" | Offer → Purchase |

### Phase 3: Ad Writing (30 min)

## Google Search Ad Templates

### Responsive Search Ad (RSA) Template

```markdown
# RSA: [Ad Group Name]
**Target Keywords:** [keyword 1], [keyword 2], [keyword 3]
**Landing Page:** {{landing_page}}

---

## Headlines (30 chars each, need 3-15)

### Benefit-Focused:
1. "[Main Benefit] - Try Free"
2. "Get [Outcome] in [Time]"
3. "[X]% [Improvement/Savings]"
4. "[Benefit] Without [Pain]"
5. "Achieve [Goal] Today"

### Feature-Focused:
6. "[Feature] + [Feature]"
7. "[Technology/Method] System"
8. "Advanced [Solution]"

### Social Proof:
9. "[X,XXX]+ Happy Customers"
10. "Rated [X] Stars"
11. "Trusted by [Industry]"
12. "As Seen In [Publication]"

### Urgency/Offer:
13. "Limited Time: [Offer]"
14. "[X]% Off - Ends Soon"
15. "Free [Trial/Demo/Consult]"

---

## Descriptions (90 chars each, need 2-4)

1. "[Primary value prop]. [Secondary benefit]. [CTA]. Start today!"

2. "Struggling with [problem]? Our [solution] helps you [achieve outcome]. [Social proof]."

3. "[Feature 1]. [Feature 2]. [Feature 3]. [Guarantee/offer]. Learn more."

4. "Join [X]+ [customers] who [achieved result]. [Unique differentiator]. [CTA]."

---

## Display Paths (15 chars each)
Path 1: [Category]
Path 2: [Subcategory]

Example: /Solutions/Enterprise

---

## Pin Recommendations:
- Pin headline 1 or 2 to position 1 (contains keyword)
- Pin headline with CTA to position 3
- Pin description with main value prop to position 1
```

### Ad Extensions Copy

```markdown
# Sitelink Extensions (4-8)

| Sitelink Text (25 chars) | Description Line 1 (35 chars) | Description Line 2 (35 chars) |
|--------------------------|------------------------------|------------------------------|
| Free Trial | Start your 14-day free trial | No credit card required |
| Pricing | See our transparent pricing | Plans from $X/month |
| Features | Explore all features | [Feature 1], [Feature 2], more |
| Case Studies | Real results from real users | [X]% average improvement |
| About Us | Learn about our mission | Trusted since [Year] |
| Contact | Talk to our team today | Response within 24 hours |

---

# Callout Extensions (4-10, 25 chars each)

1. "Free Shipping"
2. "24/7 Support"
3. "Money-Back Guarantee"
4. "No Setup Fees"
5. "Award-Winning"
6. "[X]+ Years Experience"
7. "Same-Day Delivery"
8. "Cancel Anytime"

---

# Structured Snippets

**Header: Types**
Values: [Type 1], [Type 2], [Type 3], [Type 4]

**Header: Features**
Values: [Feature 1], [Feature 2], [Feature 3], [Feature 4]

**Header: Brands**
Values: [Brand 1], [Brand 2], [Brand 3], [Brand 4]

---

# Call Extension
Phone: [Phone Number]
Hours: [Business Hours]

---

# Location Extension
[Link to Google Business Profile]

---

# Price Extension
| Item | Price | Unit |
|------|-------|------|
| [Product 1] | $XX | /month |
| [Product 2] | $XX | /month |
| [Product 3] | $XX | /month |

---

# Promotion Extension
Occasion: [None/Holiday/Event]
Promotion Type: [Monetary/Percent/Up to]
Amount: [X]% off
Item: [Product/Service]
Dates: [Start] - [End]
```

### Display Ad Template

```markdown
# Display Ad: [Campaign Name]

## Short Headline (25 chars):
"[Benefit] — Try Free"

## Long Headline (90 chars):
"[Full value proposition with benefit and differentiator]. [CTA with urgency]."

## Description (90 chars):
"[Problem statement]. [Solution intro]. [Key benefit]. [Social proof or offer]."

## Business Name (25 chars):
"[Brand Name]"

## CTA Options:
- Apply Now
- Contact Us
- Download
- Get Quote
- Learn More
- Shop Now
- Sign Up
- Subscribe
- Get Started
- Book Now

## Image Specs:
- Landscape: 1200x628
- Square: 1200x1200
- Logo: 1200x1200 (transparent)
```

### Performance Max Asset Groups

```markdown
# Performance Max: [Campaign Name]

## Headlines (3-5, 30 chars each):
1. "[Primary headline with keyword]"
2. "[Benefit-focused headline]"
3. "[Social proof headline]"
4. "[Offer/urgency headline]"
5. "[Differentiator headline]"

## Long Headlines (1-5, 90 chars each):
1. "[Full value prop with primary benefit and CTA]"
2. "[Problem → solution narrative with outcome]"

## Descriptions (1-5, 90 chars each):
1. "[Feature-rich description with proof]"
2. "[Benefit-focused with CTA]"

## Images:
- 5+ landscape images (1200x628)
- 5+ square images (1200x1200)
- 5+ portrait images (960x1200)
- 1+ logo (1200x1200, transparent)

## Videos (optional):
- YouTube video link
- Minimum 10 seconds
```

## Quality Score Optimization

**Factors:**
1. **Expected CTR:** Headlines match search intent
2. **Ad Relevance:** Keywords in headlines/descriptions
3. **Landing Page:** Content matches ad promise

**Checklist:**
- [ ] Primary keyword in Headline 1
- [ ] Primary keyword in Description 1
- [ ] Benefit clear within first 30 chars
- [ ] CTA present in ad copy
- [ ] Landing page matches ad messaging

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] Google Ads confirmed as selected channel in manifest
- [ ] Keywords sourced from manifest SEO keyword clusters
- [ ] USP derived from brand profile differentiators (not generic)
- [ ] Ad tone matches archetype + ad energy modifier
- [ ] Headline angles match archetype personality
- [ ] RSA with 10-15 headlines, 3-4 descriptions
- [ ] All character limits respected
- [ ] Keywords naturally incorporated
- [ ] Multiple ad angles represented (archetype-appropriate)
- [ ] Extensions copy uses brand values as proof points
- [ ] Display ads if applicable (from manifest ad formats)
- [ ] Pin recommendations provided
- [ ] Quality score factors addressed

## Quality Gate
- Threshold: >70%
- RSA includes 10-15 headlines (30 chars each) and 3-4 descriptions (90 chars each)
- Primary keyword present in at least Headline 1 and Description 1
- Ad extensions copy provided (sitelinks, callouts, structured snippets)

---
*Copy Squad Task*
