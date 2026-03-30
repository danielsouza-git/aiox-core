# social-post-create

```yaml
task:
  id: social-post-create
  name: Create Social Media Post (Profile-Driven)
  agent: social-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
    - topic: "What the post is about"
  optional:
    - platform_override: "Override channel from manifest (Instagram, LinkedIn, Twitter/X, TikTok, Facebook)"
    - content_type: "Educational, promotional, engagement, authority"
    - visual_concept: "Image/video idea"
    - hashtag_strategy: "Existing hashtag bank"
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"

outputs:
  - social_post.md: "Complete post copy"
  - hashtag_set.md: "Platform-optimized hashtags"
  - visual_notes.md: "Image/video direction"

pre_conditions:
  - "Brand profile exists with archetype and industry data"
  - "Content manifest exists with channel strategy and social media plan"

post_conditions:
  - "Post optimized for profile-selected platform"
  - "Hook uses archetype-appropriate angle"
  - "Content pillar from manifest drives topic"
  - "Tone matches archetype + platform adjustment from manifest"
  - "Hashtags researched for industry"
  - "CTA matches brand tone"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` for channel selection, post quantities, content pillar
distribution, and tone adjustments. Read `brand-profile.yaml` for archetype, industry, and audience.
Do NOT hardcode platforms, quantities, or tone. Everything flows from the profile.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Social Media Plan section:
   - Which channels are selected (and quantities per channel)
   - Content pillar distribution per channel
   - Tone adjustments per platform
2. Read `brand-profile.yaml` -> extract archetype, industry, target audience
3. Determine platform: use `platform_override` if provided, otherwise follow manifest channel priority
4. Determine content pillar: match `topic` to the closest content pillar from the manifest

## Workflow

### Phase 1: Platform Analysis (5 min)

**Platform Best Practices:**

| Platform | Length | Hashtags | Best Format |
|----------|--------|----------|-------------|
| **Instagram** | 150-200 words | 5-10 | Carousels, Reels |
| **LinkedIn** | 200-300 words | 3-5 | Text + Image |
| **Twitter/X** | 280 chars | 1-2 | Threads, Images |
| **TikTok** | 50-100 words | 3-5 | Short hooks |
| **Facebook** | 100-250 words | 2-3 | Video, Links |

### Phase 2: Framework Selection (5 min)

**HCEA Framework:**
- **H**ook: Stop the scroll
- **C**ontext: Set the scene
- **E**ntrega: Deliver value
- **A**ction: Drive engagement

### Phase 3: Post Writing (15 min)

## Social Post Templates

### Instagram Post

```markdown
# Instagram Post: [Topic]
**Type:** [Educational / Promotional / Engagement / Authority]

---

## Caption (150-200 words):

[HOOK — First line that stops the scroll. Use pattern interrupt, bold statement, or question.]

[CONTEXT — 1-2 sentences setting up the topic]

[VALUE — The main content]

[Bullet points or numbered list if applicable]
• [Point 1]
• [Point 2]
• [Point 3]

[TRANSITION — Bridge to CTA]

[CTA — Clear next step]

📌 Save this for later
💬 Comment [X] if you agree
🔗 Link in bio for more

---

## Hashtags (5-10):

**Primary (high volume):**
#[hashtag1] #[hashtag2] #[hashtag3]

**Secondary (medium volume):**
#[hashtag4] #[hashtag5] #[hashtag6]

**Niche (low volume, high relevance):**
#[hashtag7] #[hashtag8]

---

## Visual Direction:
[Description of image/carousel/video concept]

## Alt Text:
[Accessibility description of visual]
```

### LinkedIn Post

```markdown
# LinkedIn Post: [Topic]
**Type:** [Thought Leadership / Career / Industry / Story]

---

## Post (200-300 words):

[HOOK — Pattern interrupt or contrarian take]

[LINE BREAK]

[CONTEXT — Why this matters now]

[LINE BREAK]

[STORY or INSIGHT — Main content]

[Use white space liberally on LinkedIn]

[Key takeaway or framework]

↳ [Point 1]
↳ [Point 2]
↳ [Point 3]

[LINE BREAK]

[CTA — Question to drive comments]

---

## Hashtags (3-5):
#[professional hashtag] #[industry hashtag] #[topic hashtag]

---

## Visual Direction:
[Professional image, data visualization, or carousel concept]

## Post Timing:
Best: Tuesday-Thursday, 8-10 AM or 12-1 PM
```

### Twitter/X Post

```markdown
# Twitter Post: [Topic]
**Type:** [Hot take / Tip / Thread starter / Engagement]

---

## Tweet (280 chars):

[Hook + value + CTA in minimal words]

---

## Thread Option (if applicable):

**Tweet 1 (Hook):**
[Pattern interrupt or big promise]

**Tweet 2:**
[Context or setup]

**Tweet 3-6:**
[Main points, one per tweet]

**Tweet 7 (Wrap):**
[Summary + CTA]

---

## Hashtags (1-2):
#[hashtag1] #[hashtag2]

---

## Media:
[Image, GIF, or video concept]
```

### TikTok Caption

```markdown
# TikTok Caption: [Topic]
**Type:** [Educational / Trend / Story / POV]

---

## Caption (50-100 words):

[Hook that complements the video]

[Value statement or context]

[CTA]

---

## Hashtags (3-5):
#[trending] #[niche] #[topic] #fyp

---

## Video Concept:
**Hook (0-3 sec):** [What happens]
**Content (3-30 sec):** [Main value]
**CTA (end):** [What to do]

## Trending Sound:
[Sound suggestion if applicable]
```

## Content Pillars (Profile-Driven)

**CRITICAL:** Do NOT use these hardcoded pillars. Read content pillars from `content-manifest.md`.
The manifest defines industry-specific pillars with custom weights and topics.

**Fallback only** (if no manifest available):

| Pillar | % of Content | Examples |
|--------|--------------|----------|
| **Educational** | 40% | How-to, tips, tutorials, frameworks |
| **Authority** | 25% | Case studies, results, insights, data |
| **Engagement** | 20% | Questions, polls, discussions, debates |
| **Promotional** | 15% | Offers, launches, CTAs |

## Hook Bank

**Questions:**
- "Have you ever [relatable situation]?"
- "Why does nobody talk about [topic]?"
- "What if everything you knew about [X] was wrong?"

**Statements:**
- "Unpopular opinion: [take]"
- "The truth about [topic] nobody shares"
- "I spent [time] learning [topic]. Here's what I found:"

**Pattern Interrupts:**
- "Stop scrolling."
- "This is important."
- "Read this twice."

**Numbers:**
- "[X] things that [outcome]"
- "In [time], I [achieved X]. Here's how:"
- "[X]% of [people] get this wrong"

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] Platform matches manifest channel selection (not arbitrary)
- [ ] Hook uses archetype-appropriate angle (from content-selection-engine)
- [ ] Content aligns with a content pillar from the manifest
- [ ] Tone matches archetype base + platform adjustment from manifest
- [ ] Post quantity contributes to manifest social media plan totals
- [ ] CTA uses brand tone profile language
- [ ] Hashtags researched for client industry
- [ ] Visual direction provided
- [ ] Format uses platform conventions

## Quality Gate
- Threshold: >70%
- Post length follows platform-specific guidelines (Instagram 150-200w, LinkedIn 200-300w, Twitter 280 chars)
- Hook uses archetype-appropriate angle sourced from content manifest
- Hashtags researched for client industry (not generic/placeholder tags)

---
*Copy Squad Task*
