# caption-generate

```yaml
task:
  id: caption-generate
  name: Generate Caption Variants
  agent: social-writer
  squad: copy
  type: generation
  elicit: true

inputs:
  required:
    - visual_description: "What the image/video shows"
    - platform: "Instagram, LinkedIn, Facebook, TikTok"
    - num_variants: "How many variants to generate"
  optional:
    - brand_voice: "Voice guide"
    - content_pillar: "Educational, authority, engagement, promotional"
    - hashtag_bank: "Existing hashtags"

outputs:
  - captions.md: "All caption variants"
  - hashtag_sets.md: "Platform-optimized hashtags"
  - test_pairs.md: "A/B test recommendations"

pre_conditions:
  - "Visual content ready or described"
  - "Platform selected"

post_conditions:
  - "Variants cover multiple hooks"
  - "Platform-optimized lengths"
  - "Hashtags researched"
```

## Workflow

### Phase 1: Visual Analysis (5 min)
1. Understand the visual content
2. Identify key elements to highlight
3. Determine the story/message

### Phase 2: Hook Generation (10 min)
Generate multiple opening lines using different angles.

### Phase 3: Caption Variants (15 min)

## Caption Generation Template

```markdown
# Caption Variants: [Visual Description]
**Platform:** [Platform]
**Content Type:** [Type]

---

## Hook Bank

**Questions:**
1. "[Question that relates to visual]?"
2. "Have you ever [relatable situation]?"
3. "What if [possibility]?"

**Statements:**
4. "[Bold claim or observation]"
5. "The truth about [topic]..."
6. "[Number] things I learned from [experience]"

**Pattern Interrupts:**
7. "Stop scrolling."
8. "This changed everything."
9. "Unpopular opinion:"

**Personal:**
10. "I used to [before state]..."
11. "Here's something I don't share often..."
12. "True story:"

---

## VARIANT 1: Question Hook
**Length:** [X words]

"[Question hook]?

[2-3 sentences of context/story]

[Main point or value]

[CTA]

[Hashtags]"

---

## VARIANT 2: Statement Hook
**Length:** [X words]

"[Bold statement]

[Line break]

[Supporting content]

[Proof or example]

[CTA]

[Hashtags]"

---

## VARIANT 3: Story Hook
**Length:** [X words]

"[Story opening]...

[Continue narrative]

[Lesson or takeaway]

[CTA]

[Hashtags]"

---

## VARIANT 4: Direct Value
**Length:** [X words]

"[Number] ways to [achieve outcome]:

1. [Point 1]
2. [Point 2]
3. [Point 3]

[CTA]

[Hashtags]"

---

## VARIANT 5: Curiosity Hook
**Length:** [X words]

"[Curiosity statement]...

[Open loop]

[Resolution + value]

[CTA]

[Hashtags]"

---

## A/B Test Recommendations

### Test 1: Hook Type
- A: [Question hook variant]
- B: [Statement hook variant]
- Hypothesis: [Which should win]

### Test 2: Length
- A: [Short version ~100 words]
- B: [Long version ~200 words]
- Hypothesis: [Which should win]

### Test 3: CTA Style
- A: [Soft CTA - "What do you think?"]
- B: [Direct CTA - "Save this post"]
- Hypothesis: [Which should win]

---

## Hashtag Sets

### Set A (Broad Reach):
#[high volume] #[high volume] #[medium volume] #[medium volume] #[niche]

### Set B (Niche Focus):
#[niche] #[niche] #[niche] #[medium] #[medium]

### Set C (Mixed):
#[high] #[medium] #[medium] #[niche] #[niche]

---

## Platform-Specific Adjustments

### If Instagram:
- Length: 150-200 words
- Hashtags: 5-10 in caption or first comment
- Line breaks for readability
- Emojis: moderate

### If LinkedIn:
- Length: 200-300 words
- Hashtags: 3-5 max
- Professional tone
- Emojis: minimal

### If Facebook:
- Length: 100-250 words
- Hashtags: 2-3 max
- Conversational tone
- Tag relevant pages

### If TikTok:
- Length: 50-100 words
- Hashtags: 3-5 including #fyp
- Hook complements video
- Casual/trendy tone
```

## Caption Formulas

**HCEA (Social Media Standard):**
- Hook → Context → Entrega → Action

**PAS (Problem-Aware Audience):**
- Problem → Agitation → Solution

**BAB (Transformation Focus):**
- Before → After → Bridge

**AIDA (Promotional):**
- Attention → Interest → Desire → Action

## CTA Options by Goal

**Engagement:**
- "What do you think? 👇"
- "Drop a [emoji] if you agree"
- "Tag someone who needs this"
- "Which one resonates most?"

**Save/Share:**
- "📌 Save for later"
- "🔄 Share with a friend"
- "Bookmark this"

**Follow:**
- "👆 Follow for more [topic]"
- "Follow @[handle] for daily [content]"

**Conversion:**
- "🔗 Link in bio"
- "DM '[keyword]' for [offer]"
- "Tap the link in my profile"

## Acceptance Criteria

- [ ] [X] variants generated
- [ ] Multiple hook types represented
- [ ] Platform length guidelines followed
- [ ] CTAs match content goals
- [ ] Hashtag sets researched
- [ ] A/B test pairs recommended
- [ ] Line breaks for readability
- [ ] Emojis used appropriately

## Quality Gate
- Threshold: >70%
- Caption length follows platform guidelines (Instagram 150-200w, LinkedIn 200-300w, TikTok 50-100w)
- At least 3 different hook types represented across variants
- Hashtag sets researched with mix of broad, medium, and niche tags

---
*Copy Squad Task*
