# youtube-ads-script

```yaml
task:
  id: youtube-ads-script
  name: Write YouTube Ad Script (Profile-Driven)
  agent: ads-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
  optional:
    - ad_type: "Skippable, Non-skippable, Bumper, Discovery (default: from manifest)"
    - video_length: "6s, 15s, 30s, 60s, 2min+ (default: derived from ad type)"
    - offer: "What's being promoted"
    - presenter: "On-camera, voiceover, animation"
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"
    - existing_videos: "Current YouTube content"

outputs:
  - youtube_scripts/: "Folder with all script variants"
  - storyboard_notes.md: "Scene-by-scene visual notes"
  - production_specs.md: "Technical requirements"

pre_conditions:
  - "Brand profile exists with archetype and target audience"
  - "Content manifest exists with Ad Strategy section"

post_conditions:
  - "YouTube Ads confirmed as selected channel in manifest"
  - "Hook style matches archetype personality"
  - "Script tone matches archetype + ad energy modifier"
  - "Target audience from brand profile"
  - "Scripts match length requirements"
  - "Clear CTA using brand tone language"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for ad channel selection. YouTube Ads are typically
selected for industries with visual storytelling needs (Education, Gaming, SaaS demos) and
archetypes that benefit from video (Hero, Explorer, Creator). Read `brand-profile.yaml` for
archetype (shapes hook style and energy level) and industry (shapes script structure).

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Ad Strategy section:
   - Is YouTube Ads a selected channel?
   - Ad formats and targeting
   - Ad tone (energy, hook style from archetype)
2. Read `brand-profile.yaml`:
   - `personality.archetypes` -> hook style (Hero=bold, Sage=educational, Jester=playful)
   - `client.target_audience` -> viewer qualification in first 5 seconds
   - `client.industry` -> script structure (demo for SaaS, story for lifestyle)
   - `personality.tone_of_voice` -> voiceover/script voice
3. If YouTube Ads is NOT in manifest ad channels, SKIP this task

## Workflow

### Phase 1: YouTube Ad Specs (5 min)

**Ad Types:**

| Type | Length | Skippable | Best For |
|------|--------|-----------|----------|
| **Bumper** | 6 sec | No | Brand awareness |
| **Non-skippable** | 15 sec | No | Key messaging |
| **Skippable** | 15-60 sec | After 5 sec | Consideration |
| **TrueView** | 2+ min | After 5 sec | Education/demo |
| **Discovery** | Thumbnail + text | Click to watch | Content marketing |

### Phase 2: Script Framework (5 min)

**5-Second Rule:**
The first 5 seconds determine if they skip. Must include:
1. Hook (pattern interrupt)
2. Relevance (qualify viewer)
3. Promise (why watch)

### Phase 3: Script Writing (30 min)

## YouTube Script Templates

### Template 1: Bumper Ad (6 seconds)

```markdown
# Bumper Ad: [Campaign Name]
**Length:** 6 seconds
**Format:** Non-skippable

---

## Option A: Problem → Solution

**[0-2 sec]**
VISUAL: [Problem scenario]
AUDIO: "Tired of [pain point]?"

**[2-4 sec]**
VISUAL: [Product/solution reveal]
AUDIO: "[Product] fixes that."

**[4-6 sec]**
VISUAL: Logo + CTA
AUDIO: "[CTA]. [Brand]."

---

## Option B: Benefit Statement

**[0-3 sec]**
VISUAL: [Outcome visualization]
AUDIO: "[Achieve outcome] in [time]."

**[3-6 sec]**
VISUAL: Product + Logo + URL
AUDIO: "[Brand]. [CTA]."

---

## Option C: One-Liner

**[0-6 sec]**
VISUAL: Clean brand visual with text overlay
AUDIO: "[Single powerful statement]. [Brand]."

---

## Production Notes:
- Text overlays for sound-off viewing
- Bold, readable typography
- Quick cuts to maintain energy
```

### Template 2: Non-Skippable (15 seconds)

```markdown
# Non-Skippable Ad: [Campaign Name]
**Length:** 15 seconds
**Format:** Must-watch

---

## Script

**[0-3 sec] — Hook**
VISUAL: [Pattern interrupt / attention grab]
AUDIO: "[Question or bold statement]"

**[3-8 sec] — Problem/Context**
VISUAL: [Problem visualization or scenario]
AUDIO: "[Expand on problem. Create tension or curiosity.]"

**[8-13 sec] — Solution**
VISUAL: [Product demo or transformation]
AUDIO: "[Introduce solution. Key benefit. Social proof.]"

**[13-15 sec] — CTA**
VISUAL: Logo + URL + CTA button
AUDIO: "[CTA]. [Brand]."

---

## Example Script:

**[0-3 sec]**
VISUAL: Person frustrated at computer
AUDIO: "Still doing [task] manually?"

**[3-8 sec]**
VISUAL: Time-lapse of tedious work
AUDIO: "That's [X] hours a week you'll never get back."

**[8-13 sec]**
VISUAL: Product interface / happy user
AUDIO: "[Product] automates [task]. Save [X] hours. Join [X,XXX] users."

**[13-15 sec]**
VISUAL: Logo + URL
AUDIO: "Try free at [URL]."
```

### Template 3: Skippable Ad (30-60 seconds)

```markdown
# Skippable Ad: [Campaign Name]
**Length:** 30-60 seconds
**Format:** Skippable after 5 seconds

---

## THE FIRST 5 SECONDS (Critical)

**[0-2 sec] — Pattern Interrupt**
VISUAL: [Unexpected visual or direct address]
AUDIO: "[Hook that creates curiosity]"

**[2-5 sec] — Qualify + Promise**
VISUAL: [Relevant to target audience]
AUDIO: "If you're a [audience], stay for [promise]."

---

## AFTER THE SKIP BUTTON (25-55 sec)

**[5-15 sec] — Problem Agitation**
VISUAL: [Problem scenarios / pain points]
AUDIO: "Here's the truth about [topic]...

[Problem 1]
[Problem 2]
[Problem 3]

Sound familiar?"

**[15-25 sec] — Solution Introduction**
VISUAL: [Product demo / transformation]
AUDIO: "That's why we built [Product].

[How it works in simple terms]

[Key benefit 1]
[Key benefit 2]"

**[25-35 sec] — Social Proof**
VISUAL: [Testimonials / logos / metrics]
AUDIO: "[X,XXX] [customers] already [achieved result].

'[Quick testimonial]' — [Name]"

**[35-45 sec] — Offer**
VISUAL: [Offer details / pricing]
AUDIO: "Right now, you can [offer].

[Urgency if applicable]"

**[45-60 sec] — CTA**
VISUAL: Logo + URL + CTA
AUDIO: "[Clear CTA]. Link in the description.

[Brand]."

---

## Production Notes:
- Captions throughout (70%+ watch without sound)
- Face on camera in first 2 seconds performs best
- Direct address ("you") increases engagement
```

### Template 4: TrueView/Long-Form (2+ minutes)

```markdown
# TrueView Ad: [Campaign Name]
**Length:** 2-3 minutes
**Format:** Skippable, educational/story-driven

---

## Structure: Mini-VSL

**[0-5 sec] — Hook**
"[Pattern interrupt + qualify viewer]"

**[5-30 sec] — Setup/Credibility**
"[Who you are, why they should listen]"

**[30-90 sec] — Problem Deep-Dive**
"[Explore the problem thoroughly]
[Agitate with consequences]
[Create desire for solution]"

**[90-120 sec] — Solution Reveal**
"[Introduce your solution]
[How it works]
[Key differentiators]"

**[120-150 sec] — Proof**
"[Case studies, testimonials, data]"

**[150-180 sec] — CTA**
"[Clear next step]
[Urgency/scarcity if applicable]
[Final hook]"

---

## Full Script Example:

**[0-5 sec] — HOOK**

VISUAL: Direct to camera
AUDIO: "I'm about to show you the [X] that helped [X]+ [audience] [achieve outcome]. If that sounds good, keep watching."

**[5-30 sec] — CREDIBILITY**

VISUAL: B-roll of you working / credentials
AUDIO: "My name is [Name]. Over the past [X] years, I've [credibility statement]. And I've noticed something..."

**[30-90 sec] — PROBLEM**

VISUAL: Problem visualization / frustrated person / data
AUDIO: "Most [audience] struggle with [problem].

You've probably tried [solution A]. Maybe [solution B].

But here's what nobody tells you: [insight].

The real problem isn't [common belief]. It's [actual problem].

And if you don't fix this, [consequence]."

**[90-120 sec] — SOLUTION**

VISUAL: Product demo / transformation
AUDIO: "That's exactly why I created [Product].

It's a [description] that helps you [outcome].

Here's how it works:
[Step 1]
[Step 2]
[Step 3]

The result? [Transformation]."

**[120-150 sec] — PROOF**

VISUAL: Testimonials / results screenshots / logos
AUDIO: "[X,XXX] people have already used [Product] to [achieve outcome].

[Name] said '[testimonial].'
[Name] went from [before] to [after]."

**[150-180 sec] — CTA**

VISUAL: URL + offer + logo
AUDIO: "Ready to [outcome]?

Click the link below to [CTA].

[Offer if applicable]

[Final hook / urgency]

See you inside."
```

### Template 5: Discovery Ad

```markdown
# Discovery Ad: [Campaign Name]
**Format:** Thumbnail + headline + description
**Appears:** Search results, related videos, homepage

---

## Thumbnail Options:
1. Face with expression + text overlay
2. Before/after split
3. Bold number + question
4. "Clickbait" thumbnail (ethical)

## Headline (100 chars):
"[How to / X Ways to / The Secret to] [Outcome] (Without [Pain])"

## Description (2 lines):
Line 1: "[Expand on headline with curiosity hook]"
Line 2: "[Credibility or social proof]"

---

## Example:

**Thumbnail:** Face looking surprised + "THIS Changed Everything"

**Headline:** "How I [Achieved Outcome] in [Time] (And You Can Too)"

**Description:**
"Most people struggle with [problem]. Here's what actually works."
"Over [X]+ views • [X,XXX] subscribers"
```

## First 5 Seconds Bank

**Questions:**
- "Want to know the secret to [outcome]?"
- "Still struggling with [pain point]?"
- "What if I told you [surprising claim]?"

**Statements:**
- "Stop doing [common mistake]."
- "This is the [thing] no one talks about."
- "[X] people discovered this already."

**Pattern Interrupts:**
- "Wait — before you skip..."
- "I know what you're thinking..."
- "[Unexpected visual/action]"

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] YouTube Ads confirmed as selected channel in manifest
- [ ] Hook style matches archetype personality
- [ ] Script tone matches archetype + ad energy modifier
- [ ] Target audience qualification in first 5 seconds (from profile)
- [ ] Script matches ad type/length
- [ ] Hook in first 5 seconds
- [ ] Clear problem -> solution flow (industry-appropriate)
- [ ] Social proof included (proof type per industry)
- [ ] CTA using brand tone language
- [ ] Production notes provided
- [ ] Captions/text overlays planned
- [ ] Multiple script variants

## Quality Gate
- Threshold: >70%
- Hook present in first 5 seconds with viewer qualification (pattern interrupt + promise)
- Script length matches ad type specification (6s bumper, 15s non-skip, 30-60s skippable)
- Captions/text overlays planned for sound-off viewing (70%+ watch without sound)

---
*Copy Squad Task*
