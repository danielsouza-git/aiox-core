# webinar-script

```yaml
task:
  id: webinar-script
  name: Write Webinar Script
  agent: conversion-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - copy_strategy: "Messaging and positioning"
    - webinar_topic: "Core teaching topic"
    - offer_details: "Product/service being sold"
    - duration: "45, 60, or 90 minutes"
  optional:
    - presentation_style: "Live, automated, hybrid"
    - q_and_a: "Include Q&A segment"
    - case_studies: "Examples to feature"

outputs:
  - webinar_script.md: "Complete webinar script"
  - slide_deck_outline.md: "Slide-by-slide guide"
  - handout_copy.md: "Downloadable resource copy"
  - follow_up_emails.md: "Post-webinar email sequence"

pre_conditions:
  - "Webinar topic validated"
  - "Offer finalized"
  - "Duration confirmed"

post_conditions:
  - "Script matches duration"
  - "Teaching content valuable standalone"
  - "Pitch integrated naturally"
  - "Follow-up sequence included"
```

## Workflow

### Phase 1: Webinar Structure (10 min)

**Perfect Webinar Formula (Russell Brunson):**

| Section | Time (60 min) | Purpose |
|---------|---------------|---------|
| Welcome & Hook | 5 min | Capture attention |
| Introduction | 5 min | Establish authority |
| Content (3 Secrets) | 30 min | Deliver value |
| Transition | 2 min | Bridge to offer |
| Stack & Close | 15 min | Present offer |
| Q&A | 3 min | Handle objections |

### Phase 2: Content Framework (15 min)

**The 3 Secrets Structure:**

Each "secret" breaks a false belief:
1. **Vehicle:** Why THIS solution
2. **Internal:** Why YOU can do it
3. **External:** Why NOW is the time

**Per Secret Format:**
- State the false belief
- Tell a story that breaks it
- Teach the truth
- Show proof

### Phase 3: Script Writing (60 min)

## Webinar Script Template

```markdown
# Webinar Script: [Title]
**Duration:** [X] minutes
**Format:** [Live / Automated / Hybrid]

---

## PRE-WEBINAR

**Registration Page Headline:**
"[Big Promise Headline]"

**Confirmation Email Subject:**
"[You're in! Here's what to expect...]"

---

## WELCOME (0:00-5:00)

### Slide 1: Title Slide
**SCRIPT:**
"Welcome everyone! I'm so excited you're here.

My name is [Name], and over the next [X] minutes, I'm going to show you [big promise].

If you stay until the end, I have a special [bonus/offer] just for those who take action today."

### Slide 2: Housekeeping
**SCRIPT:**
"Before we dive in, a few quick things:
- Turn off distractions
- Grab a notebook
- Stay until the end for [bonus]
- Use the chat for questions"

---

## INTRODUCTION (5:00-10:00)

### Slide 3: Who Am I?
**SCRIPT:**
"[Credibility story - brief, relevant]

[Why I'm qualified to teach this]

[Quick social proof - results]"

### Slide 4: What You'll Learn
**SCRIPT:**
"By the end of this webinar, you'll know:

1. [Secret 1 benefit]
2. [Secret 2 benefit]
3. [Secret 3 benefit]

Plus, I'll share [bonus teaching]."

---

## SECRET #1: The Vehicle (10:00-22:00)

### Slide 5: False Belief
**SCRIPT:**
"Most people believe [false belief about the solution].

I used to think this too, until [story moment]."

### Slide 6-8: Story
**SCRIPT:**
"[Story that breaks the false belief]

[Key moment of realization]

[What I discovered]"

### Slide 9-10: Teaching
**SCRIPT:**
"Here's the truth...

[Teach the correct approach]

[Actionable framework/steps]"

### Slide 11: Proof
**SCRIPT:**
"Don't just take my word for it...

[Case study / testimonial / data]"

---

## SECRET #2: Internal Belief (22:00-34:00)

### Slide 12: False Belief
**SCRIPT:**
"You might be thinking, 'That's great for them, but I can't because [internal false belief].'

I hear this all the time, and here's why it's not true..."

[Continue pattern: Story → Teaching → Proof]

---

## SECRET #3: External Belief (34:00-46:00)

### Slide 13: False Belief
**SCRIPT:**
"The last thing holding you back is believing [external false belief - timing, circumstances, etc.]

Here's why RIGHT NOW is actually the best time..."

[Continue pattern: Story → Teaching → Proof]

---

## TRANSITION (46:00-48:00)

### Slide 14: Bridge
**SCRIPT:**
"So we've covered:
- Secret 1: [Recap]
- Secret 2: [Recap]
- Secret 3: [Recap]

Now, some of you are ready to go implement this on your own. And that's great.

But for those of you who want [faster results / done-for-you / shortcut], I want to tell you about something..."

---

## THE STACK (48:00-58:00)

### Slide 15: The Offer
**SCRIPT:**
"Introducing [Product Name].

This is [what it is] designed to [transformation]."

### Slide 16-20: Module Breakdown
**SCRIPT:**
"Here's everything you get:

**[Module 1]** - Value: $X
[What they'll learn/get]

**[Module 2]** - Value: $X
[What they'll learn/get]

[Continue...]"

### Slide 21: Bonus Stack
**SCRIPT:**
"When you join today, you also get:

**Bonus 1:** [Name] - $X value
**Bonus 2:** [Name] - $X value
**Bonus 3:** [Name] - $X value"

### Slide 22: Price Reveal
**SCRIPT:**
"Total value: $[X,XXX]

But you won't pay anywhere near that.

Your investment today: $[Price]

And if you use [payment plan], that's just $[X] per month."

### Slide 23: Guarantee
**SCRIPT:**
"Plus, you're protected by our [X]-day guarantee.

[Explain guarantee - make it bulletproof]"

### Slide 24: Urgency
**SCRIPT:**
"This offer is only available [until/for the next X hours].

After that, [consequence]."

### Slide 25: CTA
**SCRIPT:**
"Click the button below to [action].

[URL shown on screen]

I'll see you inside."

---

## Q&A (58:00-60:00)

**SCRIPT:**
"Let me answer some of the most common questions..."

[Pre-planned FAQ that handles objections]

---

## POST-WEBINAR SEQUENCE

**Email 1 (Immediate):** Replay + offer reminder
**Email 2 (24 hours):** Case study + urgency
**Email 3 (48 hours):** FAQ + objection handling
**Email 4 (Cart close):** Final call + bonus expiring
```

## Acceptance Criteria

- [ ] Script matches target duration
- [ ] 3 Secrets structure applied
- [ ] Each secret breaks a false belief
- [ ] Stories are compelling and relevant
- [ ] Teaching provides real value
- [ ] Transition to offer is smooth
- [ ] Stack builds value
- [ ] Price reveal is strategic
- [ ] Guarantee removes risk
- [ ] Urgency is real
- [ ] Follow-up sequence included

## Quality Gate
- Threshold: >70%
- 3 Secrets structure applied, each breaking a distinct false belief
- Transition from teaching to offer is smooth (not jarring)
- Post-webinar follow-up email sequence included with 4 emails minimum

---
*Copy Squad Task*
