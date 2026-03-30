# stories-copy

```yaml
task:
  id: stories-copy
  name: Write Stories Copy
  agent: social-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - platform: "Instagram, Facebook, LinkedIn"
    - story_type: "Educational, promotional, BTS, engagement, announcement"
    - num_frames: "Number of story frames"
  optional:
    - brand_voice: "Voice guide"
    - visual_assets: "Available images/videos"
    - interactive_elements: "Polls, questions, quizzes"

outputs:
  - stories_copy.md: "Frame-by-frame copy"
  - visual_direction.md: "Per-frame visual notes"
  - interactive_elements.md: "Poll/quiz copy"

pre_conditions:
  - "Story type determined"
  - "Number of frames planned"
  - "Platform selected"

post_conditions:
  - "All frames written"
  - "Interactive elements included"
  - "CTA clear"
  - "Visual direction provided"
```

## Workflow

### Phase 1: Story Structure (5 min)

**Story Frame Limits:**

| Platform | Max Frames | Duration/Frame |
|----------|------------|-----------------|
| Instagram | 100 | 15 sec (video), 7 sec (image) |
| Facebook | 20 | 20 sec max |
| LinkedIn | 20 | 20 sec max |

**Optimal Story Length:** 5-10 frames

### Phase 2: Story Type Selection (5 min)

**Story Types:**

| Type | Purpose | Frames |
|------|---------|--------|
| **Educational** | Teach something | 7-10 |
| **Behind-the-Scenes** | Build connection | 5-8 |
| **Promotional** | Drive action | 5-7 |
| **Engagement** | Get interaction | 3-5 |
| **Announcement** | Share news | 4-6 |
| **Day-in-the-Life** | Humanize brand | 8-12 |
| **Product Demo** | Show features | 5-8 |
| **Q&A** | Answer questions | 6-10 |

### Phase 3: Frame Writing (20 min)

## Story Templates

### Template 1: Educational Story

```markdown
# Story: [Topic]
**Type:** Educational
**Frames:** 8
**Platform:** Instagram

---

## FRAME 1: Hook
**Visual:** [Eye-catching image/video]
**Text Overlay:** "[Question or bold statement]"
**Sticker:** None
**Duration:** 5 sec

---

## FRAME 2: Context
**Visual:** [Talking head or text on background]
**Text Overlay:** "Here's what most people get wrong about [topic]..."
**Sticker:** None
**Duration:** 7 sec

---

## FRAME 3: Poll
**Visual:** [Simple background]
**Text Overlay:** "Do you [question]?"
**Sticker:** Poll
**Options:** "Yes" / "No" or "This" / "That"
**Duration:** Until engagement

---

## FRAME 4: Tip #1
**Visual:** [Visual representing tip]
**Text Overlay:** "#1: [Tip]"
**Additional Text:** "[Brief explanation]"
**Duration:** 7 sec

---

## FRAME 5: Tip #2
**Visual:** [Visual representing tip]
**Text Overlay:** "#2: [Tip]"
**Additional Text:** "[Brief explanation]"
**Duration:** 7 sec

---

## FRAME 6: Tip #3
**Visual:** [Visual representing tip]
**Text Overlay:** "#3: [Tip]"
**Additional Text:** "[Brief explanation]"
**Duration:** 7 sec

---

## FRAME 7: Summary
**Visual:** [Clean summary visual]
**Text Overlay:** "Quick recap:
✓ [Tip 1]
✓ [Tip 2]
✓ [Tip 3]"
**Duration:** 7 sec

---

## FRAME 8: CTA
**Visual:** [Brand visual or product]
**Text Overlay:** "Want more tips like this?"
**Sticker:** Link sticker or "DM me [keyword]"
**Duration:** 7 sec
```

### Template 2: Promotional Story

```markdown
# Story: [Product/Offer]
**Type:** Promotional
**Frames:** 6
**Platform:** Instagram

---

## FRAME 1: Problem Hook
**Visual:** [Problem visualization]
**Text Overlay:** "Struggling with [pain point]?"
**Music:** [Trending sound if applicable]
**Duration:** 5 sec

---

## FRAME 2: Agitate
**Visual:** [Consequence of problem]
**Text Overlay:** "You've tried [solution A].
You've tried [solution B].
Nothing works."
**Duration:** 7 sec

---

## FRAME 3: Solution Reveal
**Visual:** [Product image/video]
**Text Overlay:** "Introducing [Product]"
**Sticker:** "NEW" sticker
**Duration:** 5 sec

---

## FRAME 4: Key Benefit
**Visual:** [Benefit in action]
**Text Overlay:** "[Main benefit in 5 words or less]"
**Duration:** 5 sec

---

## FRAME 5: Social Proof
**Visual:** [Testimonial screenshot or results]
**Text Overlay:** "[Quote or stat]"
**Duration:** 7 sec

---

## FRAME 6: CTA
**Visual:** [Product + offer]
**Text Overlay:** "[Offer] — Link in bio 👆"
**Sticker:** Link sticker with URL
**Duration:** 7 sec
```

### Template 3: Engagement Story

```markdown
# Story: [Engagement Topic]
**Type:** Engagement
**Frames:** 5
**Platform:** Instagram

---

## FRAME 1: Question Hook
**Visual:** [Casual/authentic image]
**Text Overlay:** "Quick question for you..."
**Duration:** 3 sec

---

## FRAME 2: Poll
**Visual:** [Simple background]
**Text Overlay:** "[Question]?"
**Sticker:** Poll
**Options:** "[Option A]" / "[Option B]"
**Duration:** Until engagement

---

## FRAME 3: Results Tease
**Visual:** [Your face or brand visual]
**Text Overlay:** "I'll share my answer in the next story..."
**Duration:** 5 sec

---

## FRAME 4: Your Answer
**Visual:** [Authentic response]
**Text Overlay:** "Here's what I think: [Your take]"
**Duration:** 7 sec

---

## FRAME 5: Discussion Invite
**Visual:** [Question box background]
**Text Overlay:** "What about you?"
**Sticker:** Questions box
**Prompt:** "Share your thoughts 👇"
**Duration:** Until engagement
```

### Template 4: Behind-the-Scenes

```markdown
# Story: [BTS Topic]
**Type:** Behind-the-Scenes
**Frames:** 8
**Platform:** Instagram

---

## FRAME 1: Context
**Visual:** [You or workspace]
**Text Overlay:** "POV: You're joining me for [activity]"
**Duration:** 5 sec

---

## FRAME 2: Process Start
**Visual:** [Beginning of process]
**Text Overlay:** "First, I [action]..."
**Duration:** 5 sec

---

## FRAME 3: In Progress
**Visual:** [Working on it]
**Text Overlay:** "[Commentary on process]"
**Duration:** 5 sec

---

## FRAME 4: Challenge
**Visual:** [Problem or challenge]
**Text Overlay:** "The tricky part: [challenge]"
**Duration:** 5 sec

---

## FRAME 5: Solution
**Visual:** [How you solved it]
**Text Overlay:** "Here's how I fixed it..."
**Duration:** 5 sec

---

## FRAME 6: Result
**Visual:** [Final result]
**Text Overlay:** "And here's how it turned out!"
**Duration:** 7 sec

---

## FRAME 7: Lesson
**Visual:** [Reflection]
**Text Overlay:** "Lesson learned: [insight]"
**Duration:** 5 sec

---

## FRAME 8: Engagement
**Visual:** [Question background]
**Text Overlay:** "What do you think?"
**Sticker:** Slider or emoji reaction
**Duration:** Until engagement
```

## Interactive Elements

**Polls:**
- This or That
- Yes or No
- Agree or Disagree
- [Option A] or [Option B]

**Questions:**
- "What's your biggest challenge with [topic]?"
- "What should I cover next?"
- "Any questions about [topic]?"

**Quizzes:**
- "[Topic] knowledge check"
- "Which [thing] are you?"

**Sliders:**
- "How much do you [feeling]?"
- "Rate this [thing]"

**Countdowns:**
- Launch countdown
- Sale ending
- Event timing

## Story Best Practices

- **First frame:** Must stop the tap-through
- **Text:** Max 20 words per frame
- **Captions:** Always (70% watch without sound)
- **Stickers:** 1-2 max per frame
- **Consistency:** Same visual style throughout
- **Pacing:** Mix static and video

## Acceptance Criteria

- [ ] All frames written with copy
- [ ] Hook frame stops tap-through
- [ ] Interactive elements included
- [ ] CTA clear and actionable
- [ ] Visual direction provided
- [ ] Duration appropriate for content
- [ ] Text readable (contrast, size)

## Quality Gate
- Threshold: >70%
- Text overlay per frame does not exceed 20 words
- At least 1 interactive element (poll, question, quiz, slider) included
- CTA frame has a clear and actionable instruction (link sticker, DM keyword, follow)

---
*Copy Squad Task*
