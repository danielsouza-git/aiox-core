# sales-page-copy

```yaml
task:
  id: sales-page-copy
  name: Write Sales Page Copy
  agent: conversion-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - copy_strategy: "Strategy with messaging hierarchy"
    - product_details: "Product/service information"
    - pricing: "Pricing structure and options"
    - target_audience: "Detailed audience profile"
  optional:
    - testimonials: "Customer success stories"
    - case_studies: "Detailed case studies"
    - brand_voice: "Voice guide"

outputs:
  - sales_page_copy.md: "Complete long-form sales copy"
  - bonus_stack.md: "Bonus descriptions if applicable"
  - guarantee_copy.md: "Guarantee/risk reversal copy"
  - urgency_elements.md: "Scarcity and urgency copy"

pre_conditions:
  - "Copy strategy approved"
  - "Product details fully documented"
  - "Pricing finalized"

post_conditions:
  - "Full PASTOR framework applied"
  - "All objections addressed"
  - "Pricing presented strategically"
  - "Guarantee clearly stated"
```

## Workflow

### Phase 1: PASTOR Framework Setup (10 min)
Map content to each section:
- **P**roblem: Pain points (3-5)
- **A**mplify: Consequences of inaction
- **S**tory: Transformation narrative
- **T**estimonials: Social proof
- **O**ffer: Product + bonuses
- **R**esponse: CTA + guarantee

### Phase 2: Long-Form Writing (60 min)

#### Opening Hook (5 min)
- Pattern interrupt headline
- Curiosity loop opener
- Identify with reader's struggle

#### Problem Amplification (15 min)
- Name the problem specifically
- Show you understand their pain
- Agitate with consequences
- Create urgency

#### Story/Solution (15 min)
- Share origin story or case study
- Show the transformation journey
- Position product as the vehicle

#### Offer Presentation (15 min)
- Lead with transformation, not features
- Stack value visually
- Present bonuses strategically
- Price anchoring

#### Close (10 min)
- Summarize transformation
- Address final objections
- Guarantee/risk reversal
- Urgency element
- Clear CTA

### Phase 3: Conversion Elements (15 min)
1. **Price anchoring:** Compare to alternatives
2. **Bonus stack:** Value > price
3. **Guarantee:** Remove all risk
4. **Urgency:** Real scarcity

## Sales Page Template

```markdown
# [HEADLINE: Big Promise or Pattern Interrupt]

## [Subheadline: Qualify the reader]

---

Dear [Target Reader],

[Opening hook - identify with their struggle]

[Paragraph establishing credibility and empathy]

---

## The Problem Nobody Talks About

[Problem 1 - name it specifically]

[Problem 2 - show you understand]

[Problem 3 - agitate the consequences]

**If you don't solve this now...**

[Amplify with worst-case scenario]

---

## The Turning Point

[Story - your journey or client's journey]

[Discovery - what changed everything]

[Results - the transformation]

---

## Introducing [Product Name]

[Product description - transformation-focused]

### What You'll Get:

**Module 1: [Name]**
- [Deliverable 1]
- [Deliverable 2]
Value: $[XXX]

**Module 2: [Name]**
- [Deliverable 1]
- [Deliverable 2]
Value: $[XXX]

[Continue for all modules]

---

## But Wait, There's More...

**BONUS #1: [Name]** ($XXX Value)
[Description]

**BONUS #2: [Name]** ($XXX Value)
[Description]

**BONUS #3: [Name]** ($XXX Value)
[Description]

---

## Total Value: $[X,XXX]

### Your Investment Today: $[Price]

[Payment options if applicable]

---

## Our [X]-Day Guarantee

[Guarantee copy - make it bold and specific]

---

## What Others Are Saying

> "[Testimonial 1]"
> — [Name, Result]

> "[Testimonial 2]"
> — [Name, Result]

---

## This Offer Expires [Date/Time]

[Urgency element - real scarcity]

[FINAL CTA BUTTON]

---

## Still Have Questions?

**Q: [Objection 1]**
A: [Answer]

**Q: [Objection 2]**
A: [Answer]

---

P.S. [Final hook - restate the transformation]

P.P.S. [Reminder of guarantee + urgency]
```

## Acceptance Criteria

- [ ] PASTOR framework fully applied
- [ ] Opening hook creates curiosity
- [ ] Problem deeply amplified
- [ ] Story/transformation compelling
- [ ] Offer stacked with value
- [ ] Price anchored appropriately
- [ ] Guarantee removes risk
- [ ] Urgency is real (not fake)
- [ ] All objections addressed
- [ ] CTA clear and repeated

## Quality Gate
- Threshold: >70%
- PASTOR framework fully applied with all 6 sections present
- Price anchoring uses at least 2 comparison points (total value vs investment)
- Guarantee/risk reversal section explicitly removes buyer objections

---
*Copy Squad Task*
