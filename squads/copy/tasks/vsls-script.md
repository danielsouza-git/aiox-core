# vsls-script

```yaml
task:
  id: vsls-script
  name: Write VSL Script
  agent: conversion-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - copy_strategy: "Strategy with messaging"
    - product_details: "Product/offer information"
    - target_audience: "Audience profile"
    - video_length: "Target duration (5, 10, 20, 45 min)"
  optional:
    - presenter_style: "Talking head, slides, animation"
    - testimonials: "Customer stories"

outputs:
  - vsl_script.md: "Complete video script"
  - slide_notes.md: "Slide-by-slide content"
  - shot_list.md: "Visual direction notes"

pre_conditions:
  - "Copy strategy approved"
  - "Video length determined"
  - "Presentation style decided"

post_conditions:
  - "Script matches target duration"
  - "Hook captures attention in 3 seconds"
  - "Clear story arc"
  - "CTA integrated naturally"
```

## Workflow

### Phase 1: Structure Planning (10 min)

**Duration Guidelines:**
| Length | Word Count | Best For |
|--------|------------|----------|
| 5 min | ~750 words | Cold traffic, simple offer |
| 10 min | ~1,500 words | Warm traffic, mid-ticket |
| 20 min | ~3,000 words | Webinar replay style |
| 45 min | ~6,750 words | High-ticket, complex offer |

### Phase 2: VSL Framework (varies)

**The 16-Step VSL Formula:**

1. **Pattern Interrupt** (0:00-0:03)
   - Stop the scroll immediately
   - Unexpected visual or statement

2. **Big Promise** (0:03-0:30)
   - State the transformation
   - Qualify the viewer

3. **Hook** (0:30-1:00)
   - Curiosity loop
   - "In the next X minutes..."

4. **Credibility** (1:00-2:00)
   - Who you are
   - Why they should listen

5. **Problem** (2:00-4:00)
   - Name their pain
   - Show you understand

6. **Agitation** (4:00-6:00)
   - Consequences of inaction
   - Emotional trigger

7. **Story** (6:00-10:00)
   - Your journey or client's
   - Relatable struggle
   - Discovery moment

8. **Solution Intro** (10:00-12:00)
   - What you discovered
   - The breakthrough

9. **Proof** (12:00-15:00)
   - Results you've achieved
   - Client results
   - Statistics/data

10. **Offer Reveal** (15:00-20:00)
    - What they're getting
    - Module by module

11. **Value Stack** (20:00-22:00)
    - Total value
    - Bonuses

12. **Price Reveal** (22:00-24:00)
    - Anchor high
    - Reveal actual price
    - Payment options

13. **Guarantee** (24:00-25:00)
    - Remove all risk
    - Make it bold

14. **Scarcity** (25:00-26:00)
    - Real urgency
    - Limited availability

15. **CTA** (26:00-27:00)
    - Clear instruction
    - What happens next

16. **Recap + Final CTA** (27:00-end)
    - Summary of value
    - Final push

### Phase 3: Script Writing (40 min)

## VSL Script Template

```markdown
# VSL Script: [Product Name]
**Target Duration:** [X] minutes
**Word Count:** [X] words
**Style:** [Talking head / Slides / Animation]

---

## SCENE 1: Pattern Interrupt (0:00-0:03)

**VISUAL:** [Description]

**SCRIPT:**
"[Opening line that stops the scroll]"

---

## SCENE 2: Big Promise (0:03-0:30)

**VISUAL:** [Description]

**SCRIPT:**
"If you [target audience identifier], then pay attention.

Because in the next [X] minutes, I'm going to show you [big promise].

Without [common objection 1].
Without [common objection 2].
Without [common objection 3]."

---

## SCENE 3: Hook (0:30-1:00)

**VISUAL:** [Description]

**SCRIPT:**
"Here's what most people don't realize about [topic]...

[Curiosity statement that creates open loop]

I'll explain exactly how this works in just a moment."

---

## SCENE 4: Credibility (1:00-2:00)

**VISUAL:** [Credentials on screen]

**SCRIPT:**
"My name is [Name], and [credibility statement].

Over the past [time], I've [achievement].

And today, I want to share [what you're sharing]."

---

## SCENE 5: Problem (2:00-4:00)

**VISUAL:** [Problem visualization]

**SCRIPT:**
"Let me ask you something...

Have you ever [problem situation]?

You know that feeling when [emotional description]?

If that sounds familiar, you're not alone."

---

[Continue for all 16 sections...]

---

## SCENE 16: Final CTA

**VISUAL:** [CTA button / link]

**SCRIPT:**
"Click the button below right now.

[What happens when they click]

[Final urgency reminder]

[Transformation reminder]

I'll see you on the inside."

---

## PRODUCTION NOTES

**B-Roll Needed:**
- [List of supplementary footage]

**Graphics Needed:**
- [List of text overlays, charts, etc.]

**Music:**
- [Background music recommendations]
```

## Acceptance Criteria

- [ ] Script matches target duration (±10%)
- [ ] Pattern interrupt in first 3 seconds
- [ ] All 16 VSL sections included
- [ ] Story arc is compelling
- [ ] Social proof integrated
- [ ] Offer presented clearly
- [ ] Price anchored properly
- [ ] CTA clear and repeated
- [ ] Production notes included

## Quality Gate
- Threshold: >70%
- Script word count within +/-10% of target duration guidelines
- Pattern interrupt present in first 3 seconds of script
- All 16 VSL formula sections addressed with production notes included

---
*Copy Squad Task*
