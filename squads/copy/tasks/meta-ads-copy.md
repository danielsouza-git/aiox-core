# meta-ads-copy

```yaml
task:
  id: meta-ads-copy
  name: Write Meta Ads Copy (Profile-Driven)
  agent: ads-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
  optional:
    - campaign_objective: "Awareness, Traffic, Leads, Sales (default: from manifest)"
    - offer: "What's being promoted (default: from brand profile deliverables)"
    - landing_page: "Destination URL"
    - ad_format: "Feed, Stories, Reels, Carousel (default: from manifest ad formats)"
    - existing_ads: "Current ads for reference"
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"

outputs:
  - meta_ads/: "Folder with all ad variants"
  - creative_specs.md: "Image/video requirements"
  - targeting_notes.md: "Audience targeting suggestions"

pre_conditions:
  - "Brand profile exists with archetype, industry, and target audience"
  - "Content manifest exists with Ad Strategy section"

post_conditions:
  - "Meta Ads confirmed as selected channel in manifest"
  - "Ad angles match archetype personality"
  - "Target audience from brand profile (not generic)"
  - "Tone matches archetype + ad modifier (+25% energy)"
  - "3-5 ad variants per format"
  - "All specs within character limits"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for ad channel selection, ad tone, and targeting direction.
Read `brand-profile.yaml` for archetype (shapes ad angles), industry (shapes creative direction),
and target audience (shapes targeting notes). Do NOT hardcode angles or audience definitions.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Ad Strategy section:
   - Is Meta/Instagram Ads a selected channel?
   - Campaign type, budget priority, ad formats
   - Ad tone (energy, directness, hook style from archetype)
2. Read `brand-profile.yaml`:
   - `personality.archetypes` -> determines ad angle selection
   - `client.target_audience` -> targeting notes and audience definition
   - `client.industry` -> creative direction and proof type
   - `visual_direction` -> creative specs alignment
3. If Meta Ads is NOT in manifest ad channels, SKIP this task
4. Select ad angles that match archetype (see Angle Selection below)

## Workflow

### Phase 1: Campaign Setup (5 min)

**Meta Ad Specs:**

| Element | Feed | Stories/Reels |
|---------|------|---------------|
| Primary Text | 125 chars (visible) | 72 chars (visible) |
| Full Text | 500 chars max | 125 chars max |
| Headline | 27 chars | 40 chars |
| Description | 27 chars | N/A |
| CTA | Standard buttons | Swipe up/Button |

### Phase 2: Angle Selection (5 min)

**Ad Angles:**
| Angle | Hook Style | Best For |
|-------|------------|----------|
| **Pain** | "Tired of X?" | Problem-aware |
| **Desire** | "Imagine if..." | Solution-aware |
| **Curiosity** | "The secret to..." | Cold traffic |
| **Proof** | "10,000+ customers..." | Warm traffic |
| **Authority** | "As seen in Forbes..." | Premium products |
| **Urgency** | "Last 24 hours..." | Retargeting |
| **Contrarian** | "Stop doing X" | Differentiation |

### Phase 3: Ad Writing (30 min)

## Meta Ad Templates

### Template 1: Pain Angle (Feed)

```markdown
# Ad Variant: Pain Angle

## Creative Direction:
[Image/video concept that shows the problem]

## Primary Text (125 visible / 500 max):
"Tired of [pain point]?

You've tried [solution A].
You've tried [solution B].
Nothing works.

Here's why: [insight/reason]

[Product/Service] is different.

[1-2 sentence value prop]

[Social proof or result]

[CTA]"

## Headline (27 chars):
"Stop [Pain] Today"

## Description (27 chars):
"[Benefit] in [Time]"

## CTA Button:
[Learn More / Shop Now / Sign Up]

## URL:
{{landing_page}}
```

### Template 2: Desire Angle (Feed)

```markdown
# Ad Variant: Desire Angle

## Creative Direction:
[Image/video showing the transformation/outcome]

## Primary Text:
"Imagine waking up and [desired state].

No more [pain point 1].
No more [pain point 2].
Just [positive outcome].

That's exactly what [number] people experienced with [Product].

'[Short testimonial]' — [Name]

Ready to [transformation]?

👇 Tap below to start"

## Headline:
"[Outcome] Made Easy"

## Description:
"Join [X]+ happy [customers]"

## CTA Button:
[Get Started / Learn More]
```

### Template 3: Curiosity Angle (Feed)

```markdown
# Ad Variant: Curiosity Angle

## Creative Direction:
[Pattern interrupt visual / unexpected image]

## Primary Text:
"Most [audience] are making this mistake with [topic].

(Hint: It's not what you think)

After [working with X customers / years of research], I discovered:

The problem isn't [common belief].
It's [actual problem].

Once you fix this, [positive outcome].

I put together a [free guide/training/tool] that shows you exactly how.

[CTA]"

## Headline:
"The [Topic] Secret"

## Description:
"[X] Already Know This"

## CTA Button:
[Learn More / Download]
```

### Template 4: Social Proof (Feed)

```markdown
# Ad Variant: Social Proof

## Creative Direction:
[Customer testimonial video / before-after / results screenshot]

## Primary Text:
"'[Specific testimonial with result]'
— [Name], [Title/Location]

[Name] was struggling with [problem].

After [using Product for X weeks], [specific result].

Join [X,XXX]+ [customers] who've [achieved outcome].

[Limited time offer if applicable]

[CTA]"

## Headline:
"See Why [X]+ Choose Us"

## Description:
"Real Results, Real People"

## CTA Button:
[Shop Now / Get Started]
```

### Template 5: Carousel Ad

```markdown
# Ad Variant: Carousel (3-5 cards)

## Card 1: Hook
**Image:** [Eye-catching visual]
**Headline:** "The [X] things that [outcome]"
**Description:** "Swipe to see →"

## Card 2: Point 1
**Image:** [Related visual]
**Headline:** "#1: [Point]"
**Description:** "[Brief explanation]"

## Card 3: Point 2
**Image:** [Related visual]
**Headline:** "#2: [Point]"
**Description:** "[Brief explanation]"

## Card 4: Point 3
**Image:** [Related visual]
**Headline:** "#3: [Point]"
**Description:** "[Brief explanation]"

## Card 5: CTA
**Image:** [Product/offer visual]
**Headline:** "Ready to [outcome]?"
**Description:** "[CTA] →"

## Primary Text:
"[Hook that introduces the carousel content]

Swipe through to discover:
✓ [Point 1]
✓ [Point 2]
✓ [Point 3]

[CTA with urgency if applicable]"
```

### Template 6: Stories/Reels

```markdown
# Ad Variant: Stories/Reels

## Creative Direction:
- Vertical 9:16 format
- Hook in first 1-3 seconds
- Native feel (not overly produced)
- Captions for sound-off viewing

## Hook Options:
1. "POV: You finally [achieved outcome]"
2. "Wait for it... 🤯"
3. "This is the [thing] no one talks about"
4. "I was today years old when I learned..."

## Script (15-30 sec):
**[0-3 sec]:** [Hook / pattern interrupt]
**[3-10 sec]:** [Problem or context]
**[10-20 sec]:** [Solution / product intro]
**[20-30 sec]:** [CTA + urgency]

## Text Overlay (72 chars visible):
"[Short punchy copy]"

## CTA:
[Swipe Up / Shop Now / Learn More]
```

## A/B Testing Matrix

| Test | Variable | Variants |
|------|----------|----------|
| 1 | Angle | Pain vs Desire |
| 2 | Hook | Question vs Statement |
| 3 | Social Proof | Testimonial vs Statistics |
| 4 | CTA | Soft vs Direct |
| 5 | Creative | Static vs Video |

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] Meta Ads confirmed as selected channel in manifest
- [ ] Ad angles match archetype personality (not generic)
- [ ] Target audience sourced from brand profile
- [ ] Tone matches archetype + ad energy modifier
- [ ] 3-5 ad variants created
- [ ] Multiple angles represented (archetype-appropriate)
- [ ] Character limits respected
- [ ] Headlines use archetype-appropriate hook style
- [ ] CTAs match campaign objective and brand tone
- [ ] Creative direction aligns with brand visual direction
- [ ] A/B test recommendations
- [ ] Targeting notes derived from brand profile audience

## Quality Gate
- Threshold: >70%
- Primary text within 125 visible characters (feed) or 72 visible characters (stories)
- Headline within 27 characters and description within 27 characters
- At least 3 ad variants with different angles (pain, desire, curiosity, proof, etc.)

---
*Copy Squad Task*
