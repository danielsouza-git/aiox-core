# carousel-copy

```yaml
task:
  id: carousel-copy
  name: Write Carousel Copy
  agent: social-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - platform: "Instagram, LinkedIn, Twitter"
    - topic: "Carousel subject"
    - num_slides: "Number of slides (5-10)"
  optional:
    - brand_voice: "Voice guide"
    - visual_style: "Design direction"
    - existing_carousels: "Past carousels for reference"

outputs:
  - carousel_copy.md: "Slide-by-slide copy"
  - design_notes.md: "Visual direction per slide"
  - caption.md: "Accompanying caption"

pre_conditions:
  - "Topic defined"
  - "Number of slides determined"
  - "Platform selected"

post_conditions:
  - "All slides written"
  - "Hook slide compelling"
  - "CTA slide clear"
  - "Caption optimized"
```

## Workflow

### Phase 1: Carousel Structure (5 min)

**Carousel Anatomy:**

| Slide | Purpose | Content Type |
|-------|---------|--------------|
| 1 | Hook | Headline + visual hook |
| 2-3 | Setup | Context, problem, promise |
| 4-7 | Value | Main content, tips, steps |
| 8-9 | Proof | Examples, results, data |
| 10 | CTA | Action + incentive |

### Phase 2: Framework Selection (5 min)

**Carousel Types:**

| Type | Structure | Best For |
|------|-----------|----------|
| **Listicle** | X tips/ways/secrets | Quick value |
| **How-To** | Step-by-step | Tutorials |
| **Story** | Narrative arc | Engagement |
| **Myth-Buster** | Myth → Truth | Authority |
| **Before/After** | Problem → Solution | Transformation |
| **Comparison** | This vs That | Decision help |

### Phase 3: Slide Writing (20 min)

## Carousel Templates

### Template 1: Listicle Carousel

```markdown
# Carousel: [X] [Things] to [Outcome]
**Platform:** [Instagram / LinkedIn]
**Slides:** [X]

---

## SLIDE 1: Hook
**Headline:** "[X] [Things] to [Outcome]"
**Subtext:** "Swipe to learn →"
**Visual:** [Eye-catching image or bold text]

---

## SLIDE 2: Context
**Text:** "Most [audience] struggle with [problem].

But these [X] [things] will change that."
**Visual:** [Problem visualization or relatable image]

---

## SLIDE 3: Item #1
**Headline:** "#1: [Point]"
**Body:** "[2-3 sentences explaining the point]"
**Visual:** [Icon or illustration representing the point]

---

## SLIDE 4: Item #2
**Headline:** "#2: [Point]"
**Body:** "[2-3 sentences explaining the point]"
**Visual:** [Icon or illustration]

---

## SLIDE 5: Item #3
**Headline:** "#3: [Point]"
**Body:** "[2-3 sentences explaining the point]"
**Visual:** [Icon or illustration]

---

## SLIDE 6: Item #4
**Headline:** "#4: [Point]"
**Body:** "[2-3 sentences explaining the point]"
**Visual:** [Icon or illustration]

---

## SLIDE 7: Item #5
**Headline:** "#5: [Point]"
**Body:** "[2-3 sentences explaining the point]"
**Visual:** [Icon or illustration]

---

## SLIDE 8: Summary
**Headline:** "Quick Recap"
**Body:**
"✓ [Point 1]
✓ [Point 2]
✓ [Point 3]
✓ [Point 4]
✓ [Point 5]"
**Visual:** [Checklist design]

---

## SLIDE 9: CTA
**Headline:** "Want more [topic] tips?"
**Body:** "📌 Save this post
💬 Comment which was most helpful
👆 Follow @[handle] for daily [topic]"
**Visual:** [Profile picture or brand element]

---

## Caption:

"[Restate hook with context]

Here's what you'll learn:
1️⃣ [Point 1]
2️⃣ [Point 2]
3️⃣ [Point 3]
4️⃣ [Point 4]
5️⃣ [Point 5]

Which one resonates most? Drop a comment 👇

📌 Save for later
🔄 Share with someone who needs this

#[hashtags]"
```

### Template 2: How-To Carousel

```markdown
# Carousel: How to [Achieve Outcome]
**Platform:** [Instagram / LinkedIn]
**Slides:** [X]

---

## SLIDE 1: Hook
**Headline:** "How to [Achieve Outcome] in [X] Steps"
**Subtext:** "Even if [common objection]"
**Visual:** [End result or transformation visual]

---

## SLIDE 2: Promise
**Text:** "By the end of this carousel, you'll know exactly how to [outcome].

Let's dive in 👇"
**Visual:** [Arrow or swipe indicator]

---

## SLIDE 3: Step 1
**Headline:** "Step 1: [Action]"
**Body:** "[What to do and why it matters]"
**Pro tip:** "[Helpful hint]"
**Visual:** [Step visualization]

---

## SLIDE 4: Step 2
**Headline:** "Step 2: [Action]"
**Body:** "[What to do and why it matters]"
**Pro tip:** "[Helpful hint]"
**Visual:** [Step visualization]

---

## SLIDE 5: Step 3
**Headline:** "Step 3: [Action]"
**Body:** "[What to do and why it matters]"
**Pro tip:** "[Helpful hint]"
**Visual:** [Step visualization]

---

## SLIDE 6: Step 4
**Headline:** "Step 4: [Action]"
**Body:** "[What to do and why it matters]"
**Pro tip:** "[Helpful hint]"
**Visual:** [Step visualization]

---

## SLIDE 7: Step 5
**Headline:** "Step 5: [Action]"
**Body:** "[What to do and why it matters]"
**Pro tip:** "[Helpful hint]"
**Visual:** [Step visualization]

---

## SLIDE 8: Common Mistakes
**Headline:** "Avoid These Mistakes"
**Body:**
"❌ [Mistake 1]
❌ [Mistake 2]
❌ [Mistake 3]"
**Visual:** [Warning or X icons]

---

## SLIDE 9: Results
**Headline:** "What to Expect"
**Body:** "[What happens when they follow these steps]"
**Visual:** [Result visualization or testimonial]

---

## SLIDE 10: CTA
**Headline:** "Ready to [outcome]?"
**Body:** "📌 Save this guide
👆 Follow for more [topic]
🔗 Link in bio for [deeper resource]"
**Visual:** [Brand element]

---

## Caption:

"[Hook that introduces the problem]

Most people overcomplicate [topic].

But here's a simple [X]-step process:

Step 1: [Action]
Step 2: [Action]
Step 3: [Action]
Step 4: [Action]
Step 5: [Action]

The key? [Important insight]

Drop a 🙌 if this was helpful!

#[hashtags]"
```

### Template 3: Myth-Buster Carousel

```markdown
# Carousel: [X] [Topic] Myths Busted
**Platform:** [Instagram / LinkedIn]
**Slides:** [X]

---

## SLIDE 1: Hook
**Headline:** "[X] [Topic] Myths That Are Holding You Back"
**Subtext:** "Let's bust them →"
**Visual:** [Broken chain or explosion graphic]

---

## SLIDE 2: Setup
**Text:** "These myths are keeping [audience] from [desired outcome].

Time to set the record straight."

---

## SLIDE 3: Myth #1
**Myth:** "❌ [Common misconception]"
**Truth:** "✅ [What's actually true]"
**Why it matters:** "[Brief explanation]"

---

## SLIDE 4: Myth #2
**Myth:** "❌ [Common misconception]"
**Truth:** "✅ [What's actually true]"
**Why it matters:** "[Brief explanation]"

---

## SLIDE 5: Myth #3
**Myth:** "❌ [Common misconception]"
**Truth:** "✅ [What's actually true]"
**Why it matters:** "[Brief explanation]"

---

## SLIDE 6: Myth #4
**Myth:** "❌ [Common misconception]"
**Truth:** "✅ [What's actually true]"
**Why it matters:** "[Brief explanation]"

---

## SLIDE 7: Myth #5
**Myth:** "❌ [Common misconception]"
**Truth:** "✅ [What's actually true]"
**Why it matters:** "[Brief explanation]"

---

## SLIDE 8: The Real Truth
**Headline:** "What Actually Works"
**Body:** "[Key insight or framework]"

---

## SLIDE 9: CTA
**Headline:** "Stop believing myths. Start seeing results."
**Body:** "📌 Save • 💬 Share • 👆 Follow"
```

## Design Guidelines

**Slide Dimensions:**
- Instagram: 1080x1350 (4:5)
- LinkedIn: 1080x1350 or 1080x1080

**Typography:**
- Headlines: 40-60pt, bold
- Body: 24-32pt, readable
- Max 30-40 words per slide

**Consistency:**
- Same font throughout
- Consistent color palette
- Brand elements on each slide
- Progress indicator (1/10, 2/10...)

## Acceptance Criteria

- [ ] All slides written with copy
- [ ] Hook slide stops the scroll
- [ ] Value delivered clearly
- [ ] CTA slide actionable
- [ ] Design notes provided
- [ ] Caption optimized for platform
- [ ] Hashtags included
- [ ] Consistent visual direction

## Quality Gate
- Threshold: >70%
- Hook slide (slide 1) contains a compelling headline with "swipe" indicator
- Maximum 30-40 words per slide for readability
- CTA slide includes specific actionable instruction (save, comment, follow)

---
*Copy Squad Task*
