# Content Selection Engine

Profile-driven content selection for the Copy Squad. Determines WHAT content to produce,
WHICH channels to target, and HOW to adapt tone -- all based on the client's brand profile.

The reference templates in `squads/copy/tasks/` are a QUALITY reference for production standards,
not a CONTENT template to copy. Every client gets a unique content strategy driven by their profile.

---

## How It Works

```
Inputs:
  brand_profile.yaml   -> archetype, industry, personality, target_audience
  pipeline-state.yaml  -> scope (portfolio | small | medium | large | enterprise)
  voice_guide.md       -> tone, vocabulary, forbidden words
  deliverables.tier    -> what the client paid for

Output:
  content-manifest.md  -> EXACTLY what content to produce, for which channels, in what tone
```

---

## Content Type Selection by Industry

Based on `client.industry`, select ONLY the content types this client actually needs:

| Industry | Content Types to Include |
|----------|------------------------|
| Cafe / Restaurant | Menu descriptions, seasonal campaigns, event announcements, local SEO pages, Instagram captions, Stories, Google Business posts, email newsletter (weekly specials), blog (origin stories, brewing guides) |
| SaaS / Tech | Product landing pages, feature announcements, API changelog, onboarding email sequences, LinkedIn thought leadership, blog (tutorials, comparisons, case studies), Google Ads, retargeting ads |
| Fashion / Retail | Lookbook copy, product descriptions, collection launch emails, Instagram carousels, TikTok captions, Pinterest descriptions, seasonal sale campaigns, influencer brief copy |
| Health / Wellness | Patient education pages, appointment reminder emails, wellness blog, trust-building testimonial pages, Google local SEO, Instagram educational carousels, Facebook community posts |
| Education | Course descriptions, enrollment landing pages, student newsletter emails, LinkedIn authority content, blog (industry insights, career guides), webinar scripts, YouTube educational scripts |
| Finance / Corporate | Investor communications, compliance-safe landing pages, LinkedIn professional content, email nurture sequences, blog (market insights, guides), Google Ads (high-intent), case study pages |
| Gaming / Entertainment | Event announcements, Discord community copy, TikTok scripts, Twitter/X engagement posts, YouTube ad scripts, email launch sequences, in-game copy templates |
| Real Estate | Property listing descriptions, neighborhood guides, virtual tour CTAs, email drip campaigns (buyer/seller), Google local SEO, Facebook/Instagram ads, blog (market reports) |
| Creative Agency | Case study pages, portfolio descriptions, client pitch decks, LinkedIn thought leadership, blog (process insights, industry trends), email outreach sequences |
| Nightlife / Events | Event descriptions, DJ/artist bios, Instagram Stories/Reels captions, email event announcements, poster/flyer copy, ticket sale landing pages, SMS blast copy |

If the client's industry is not listed, derive content types from `personality.archetypes`,
`client.target_audience`, and `deliverables.items`. Document reasoning in the manifest.

---

## Channel Selection by Archetype

The archetype determines WHERE the brand communicates and the communication style per channel:

| Archetype | Primary Channels | Secondary Channels | Avoid |
|-----------|-----------------|-------------------|-------|
| Ruler | LinkedIn, Email, Landing Pages | Google Ads, Blog | TikTok, Discord |
| Creator | Instagram, Blog, YouTube | Pinterest, TikTok, Email | LinkedIn Ads (too corporate) |
| Caregiver | Email, Blog, Facebook | Instagram, Google Local | TikTok, Twitter/X (too fast-paced) |
| Explorer | Instagram, Blog, YouTube | TikTok, Email, Twitter/X | LinkedIn Ads, Corporate email |
| Hero | Landing Pages, YouTube, Google Ads | LinkedIn, Email, Blog | Pinterest, Discord |
| Sage | Blog, LinkedIn, Email | YouTube (educational), Podcast notes | TikTok, Instagram Reels |
| Magician | Instagram, YouTube, Landing Pages | Email, Blog, TikTok | Facebook, LinkedIn Ads |
| Outlaw | Twitter/X, TikTok, Instagram | YouTube, Blog, Email | LinkedIn, Corporate channels |
| Jester | TikTok, Instagram, Twitter/X | YouTube, Email (casual), Blog | LinkedIn (formal), Corporate email |
| Lover | Instagram, Email, Pinterest | Blog, Landing Pages, Facebook | Twitter/X, Gaming channels |
| Everyman | Facebook, Email, Blog | Instagram, Google Ads, LinkedIn | Niche/exclusive platforms |
| Innocent | Instagram, Blog, Email | Pinterest, Facebook, YouTube | Twitter/X (debates), Dark channels |

**CRITICAL:** Channel selection is advisory. The `deliverables.items` in the brand profile determines
what the client PAID for. The manifest only generates content for paid deliverables, but recommends
additional channels based on archetype match.

---

## Quantity Rules by Scope

| Scope | Social Posts | Email Sequences | Blog Posts | Ad Sets | Landing Pages | SEO Pages |
|-------|-------------|----------------|------------|---------|---------------|-----------|
| Portfolio | 10-15 | 1 (3-5 emails) | 0-1 | 0 | 1 | 3-5 meta tags |
| Small Business | 20-30 | 1-2 (5-7 emails each) | 2-4 | 1-2 sets | 1-2 | 5-10 meta tags |
| Medium | 30-50 | 2-3 (7-10 emails each) | 4-8 | 2-4 sets | 2-3 | 10-20 meta tags |
| Large / Enterprise | 50-80 | 3-5 (7-12 emails each) | 8-15 | 4-8 sets | 3-5 | 20-40 meta tags |

### Social Post Distribution

Social posts are distributed across selected channels based on archetype + industry:

| Channel | Distribution Weight | Post Types |
|---------|-------------------|------------|
| Instagram | 30-40% | Feed, Carousel, Reels captions, Stories |
| LinkedIn | 15-25% | Thought leadership, case studies, industry insights |
| Twitter/X | 10-20% | Hot takes, threads, engagement |
| TikTok | 10-20% | Short-form captions, trends |
| Facebook | 10-15% | Community posts, event shares, longer format |

Actual distribution adjusts based on which channels are selected for this client.

---

## Tone & Voice Mapping by Archetype

Each archetype has a default tone profile that applies across ALL content:

| Archetype | Formality | Energy | Confidence | Warmth | Directness | Signature Phrases |
|-----------|-----------|--------|------------|--------|------------|-------------------|
| Ruler | 75% | 50% | 90% | 30% | 85% | "The standard", "Excellence defined", "Lead with" |
| Creator | 30% | 75% | 70% | 60% | 60% | "Imagine", "Create", "What if", "Let's build" |
| Caregiver | 40% | 45% | 65% | 90% | 55% | "We're here for you", "Together", "Your wellbeing" |
| Explorer | 25% | 80% | 75% | 55% | 70% | "Discover", "Uncharted", "Adventure awaits", "New horizons" |
| Hero | 50% | 85% | 95% | 40% | 90% | "Conquer", "Achieve", "Rise above", "Unleash" |
| Sage | 65% | 40% | 80% | 50% | 75% | "The truth is", "Research shows", "Understanding", "Wisdom" |
| Magician | 35% | 70% | 80% | 50% | 60% | "Transform", "Unlock", "The secret", "Beyond ordinary" |
| Outlaw | 15% | 90% | 85% | 25% | 95% | "Break the rules", "No compromise", "Raw", "Unapologetic" |
| Jester | 10% | 95% | 65% | 70% | 50% | "Plot twist", "Fun fact", "Wait for it", "No boring stuff" |
| Lover | 45% | 55% | 70% | 95% | 45% | "Indulge", "Savor", "Intimate", "Passion" |
| Everyman | 35% | 55% | 60% | 80% | 65% | "Just like you", "Real talk", "Simple", "Honest" |
| Innocent | 40% | 60% | 55% | 85% | 50% | "Pure", "Simple joy", "Fresh start", "Believe" |

### Tone Adjustments per Content Type

The base archetype tone is adjusted per content type:

| Content Type | Formality Modifier | Energy Modifier | Notes |
|-------------|-------------------|----------------|-------|
| Landing Page | +10% | +15% | More energetic, conversion-focused |
| Blog Post | +5% | -5% | Slightly more educational |
| Social Post | -15% | +10% | More casual, platform-native |
| Email Nurture | -10% | -5% | Personal, conversational |
| Email Promotional | -5% | +20% | Urgency and excitement |
| Ad Copy | -10% | +25% | Maximum energy, scroll-stopping |
| SEO Meta | +10% | +5% | Clear, keyword-optimized |
| Case Study | +15% | -10% | Professional, data-driven |

---

## Content Pillars Selection by Industry

Content pillars determine the TOPICS the brand talks about (not the format):

| Industry | Pillar 1 (40%) | Pillar 2 (25%) | Pillar 3 (20%) | Pillar 4 (15%) |
|----------|---------------|---------------|---------------|---------------|
| Cafe / Restaurant | Craft & Origin (brewing, sourcing, seasonal) | Community & Culture (events, local, people) | Education (guides, tips, pairings) | Behind-the-Scenes (process, team, values) |
| SaaS / Tech | Product & Features (tutorials, updates, tips) | Industry Insights (trends, research, data) | Customer Success (case studies, results) | Thought Leadership (opinions, predictions) |
| Fashion / Retail | Collections & Trends (new arrivals, styling) | Lifestyle & Aspiration (lookbooks, inspiration) | Behind-the-Brand (process, sustainability) | Community (UGC, influencer, events) |
| Health / Wellness | Education & Prevention (guides, tips, research) | Patient Stories (testimonials, journeys) | Professional Authority (credentials, expertise) | Wellness Lifestyle (holistic, community) |
| Education | Knowledge & Learning (courses, insights, how-to) | Student/Alumni Success (stories, outcomes) | Industry Trends (career paths, market data) | Campus/Community (culture, events, faculty) |
| Finance / Corporate | Market Insights (analysis, reports, trends) | Client Success (case studies, ROI data) | Expertise & Trust (credentials, compliance) | Thought Leadership (predictions, opinions) |
| Gaming / Entertainment | Content & Releases (events, updates, previews) | Community & Culture (player stories, memes) | Behind-the-Scenes (dev process, making-of) | Competitive & Achievement (rankings, tips) |
| Real Estate | Market Reports (trends, data, predictions) | Lifestyle & Neighborhood (guides, community) | Client Stories (buying/selling journeys) | Professional Expertise (tips, process, advice) |
| Creative Agency | Portfolio & Work (case studies, results) | Process & Methodology (behind-the-scenes) | Industry Insights (trends, tools, techniques) | Team & Culture (people, values, growth) |
| Nightlife / Events | Events & Lineups (announcements, previews) | Scene & Culture (lifestyle, community) | Artist/DJ Spotlights (profiles, interviews) | Behind-the-Scenes (venue, setup, vibes) |

**Percentage allocations** are guidelines. Adjust based on brand profile personality traits:
- Brands with `playful` trait: increase Community pillar by 5-10%
- Brands with `serious` trait: increase Education/Authority pillar by 5-10%
- Brands with `bold` trait: increase Thought Leadership by 5-10%

---

## SEO Keyword Cluster by Industry

Each industry has core keyword clusters to target:

| Industry | Primary Keywords | Secondary Keywords | Long-Tail Keywords |
|----------|-----------------|-------------------|-------------------|
| Cafe / Restaurant | specialty coffee, cafe near me, {location} coffee | single origin, pour over, cold brew, brunch {location} | best specialty coffee {location}, organic coffee shop near me |
| SaaS / Tech | {product category}, {product name} alternative | {feature} software, {problem} solution | best {category} for {audience}, how to {solve problem} with {product} |
| Fashion / Retail | {brand} clothing, {category} fashion | sustainable fashion, {style} outfits, new collection | {brand} {product} review, {style} outfit ideas for {occasion} |
| Health / Wellness | {specialty} near me, {treatment} | {condition} treatment, wellness {service} | best {specialty} in {location}, natural {treatment} for {condition} |
| Education | {subject} course, learn {skill} | online {subject} class, {certification} program | best {subject} course for beginners, {skill} certification online |
| Finance / Corporate | {service} company, financial {product} | {industry} consulting, investment {type} | best {service} for {business size}, how to {financial goal} |

**CRITICAL:** Keyword clusters are starting points. Actual keywords must be researched per client using
the SEO writer's keyword analysis workflow. The manifest provides the cluster direction, not final keywords.

---

## Framework Selection by Content Type + Archetype

The copywriting framework is selected based on BOTH the content type and the archetype:

| Content Type | Default Framework | Archetype Override |
|-------------|------------------|-------------------|
| Landing Page | AIDA | Hero/Ruler -> PASTOR (more commanding), Caregiver -> BAB (transformation focus) |
| Sales Page | PASTOR | Jester -> 4Ps (shorter, punchier), Sage -> QUEST (educational approach) |
| Email Sequence | Star-Chain-Hook | Caregiver -> Story-based, Outlaw -> PAS (provocative) |
| Social Post | HCEA | Sage -> QUEST (educational), Jester -> Pattern-interrupt only |
| Blog Post | QUEST | Hero -> AIDA (action-focused), Creator -> StoryBrand |
| Ad Copy | PAS | Explorer -> Curiosity-first, Ruler -> Authority-first |
| SEO Content | QUEST + SEO structure | Universal (SEO structure overrides framework) |

---

## Email Sequence Types by Business Model

| Business Model | Recommended Sequences | Notes |
|---------------|----------------------|-------|
| E-commerce / Retail | Welcome (5-7), Abandon Cart (3-5), Post-Purchase (3-5), Re-engage (3-5) | Transaction-focused, urgency-driven |
| SaaS / Subscription | Welcome/Onboarding (7-10), Trial-to-Paid (5-7), Feature Adoption (5-7), Churn Prevention (3-5) | Value-demonstration focused |
| Service Business | Welcome (3-5), Nurture (7-12), Appointment Reminder (2-3), Follow-up (3-5) | Relationship-building focused |
| Content / Media | Welcome (5-7), Newsletter (ongoing weekly), Re-engage (3-5) | Value-first, minimal selling |
| Local Business | Welcome (3-5), Seasonal/Event (3-5), Loyalty (3-5) | Community-focused, local events |
| B2B / Enterprise | Welcome (5-7), Nurture (10-15), Case Study Drip (5-7), Re-engage (5-7) | Long sales cycle, multi-stakeholder |

---

## Ad Channel Selection by Industry + Archetype

| Industry | Primary Ad Channels | Secondary Ad Channels | Budget Priority |
|----------|--------------------|-----------------------|----------------|
| Cafe / Restaurant | Instagram Ads, Google Local Ads | Facebook Ads, Google Maps | Instagram > Google Local |
| SaaS / Tech | Google Search Ads, LinkedIn Ads | Meta Ads (retargeting), YouTube Ads | Google > LinkedIn > Meta |
| Fashion / Retail | Instagram Ads, Meta Ads | TikTok Ads, Pinterest Ads, Google Shopping | Instagram > Meta > TikTok |
| Health / Wellness | Google Search Ads, Facebook Ads | Instagram Ads, Google Local | Google > Facebook > Instagram |
| Education | Google Search Ads, YouTube Ads | LinkedIn Ads, Meta Ads | Google > YouTube > LinkedIn |
| Finance / Corporate | LinkedIn Ads, Google Search Ads | Meta Ads (retargeting) | LinkedIn > Google > Meta |
| Gaming / Entertainment | YouTube Ads, TikTok Ads | Meta Ads, Twitter Ads | YouTube > TikTok > Meta |
| Real Estate | Google Search Ads, Facebook Ads | Instagram Ads, Google Local | Google > Facebook > Instagram |
| Creative Agency | LinkedIn Ads, Instagram Ads | Google Search Ads | LinkedIn > Instagram > Google |
| Nightlife / Events | Instagram Ads, Meta Ads | TikTok Ads | Instagram > Meta > TikTok |

---

## Manifest Generation Process

### Step 1: Read Profile Dimensions

```
brand_profile.yaml:
  client.industry        -> Industry selection tables
  personality.archetypes -> Channel + tone + framework tables
  personality.traits     -> Tone modifiers
  personality.values     -> Content pillar emphasis
  client.target_audience -> Platform affinity
  deliverables.tier      -> Scope/quantity tables
  deliverables.items     -> What was paid for (hard constraint)
```

### Step 2: Apply Selection Tables

1. Match `industry` to Content Type Selection table
2. Match `archetypes[0]` (primary) to Channel Selection table
3. Match `deliverables.tier` to Quantity Rules table
4. Match `industry` to Content Pillars table
5. Match `industry` to SEO Keyword Cluster table
6. Match content types + archetype to Framework Selection table
7. Match business model (derived from industry) to Email Sequence Types table
8. Match industry + archetype to Ad Channel Selection table

### Step 3: Apply Constraints

- Only generate content for deliverables the client PAID for (deliverables.items)
- Respect quantity limits per scope
- Exclude channels that are in the archetype's "Avoid" list
- If primary archetype conflicts with industry norm, use secondary archetype or blend

### Step 4: Generate content-manifest.md

Write the manifest to `.aiox/branding/{client}/content-manifest.md` with full rationale
for every selection and exclusion.

### Step 5: Validate Manifest

- [ ] Every content type maps to a paid deliverable
- [ ] Channel selections align with archetype AND industry
- [ ] Quantities fall within scope range
- [ ] Tone profile is documented with archetype source
- [ ] Content pillars are documented with percentage allocations
- [ ] SEO keyword clusters are provided (not final keywords)
- [ ] Frameworks are assigned per content type
- [ ] Email sequence types match business model
- [ ] No content type is included "because the template had it"
- [ ] Every inclusion has a documented reason tied to the brand profile

---

*Copy Squad - Content Selection Engine v1.0*
