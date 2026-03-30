# ad-angles-generate

```yaml
task:
  id: ad-angles-generate
  name: Generate Ad Angles
  agent: ads-writer
  squad: copy
  type: generation
  elicit: true

inputs:
  required:
    - product: "Product/service being advertised"
    - target_audience: "Who we're targeting"
    - campaign_goal: "What we want to achieve"
  optional:
    - existing_angles: "Angles already tested"
    - competitor_ads: "What competitors are doing"
    - customer_insights: "Voice of customer data"

outputs:
  - ad_angles.md: "Complete angle bank"
  - angle_priority.md: "Ranked angles with rationale"
  - test_plan.md: "A/B testing roadmap"

pre_conditions:
  - "Product/service understood"
  - "Target audience defined"

post_conditions:
  - "10+ unique angles generated"
  - "Angles organized by type"
  - "Testing priority assigned"
```

## Workflow

### Phase 1: Angle Framework (5 min)

**Core Angle Types:**

| Type | Focus | Trigger |
|------|-------|---------|
| **Pain** | Problem/frustration | Fear, frustration |
| **Desire** | Aspirational outcome | Hope, ambition |
| **Curiosity** | Information gap | FOMO, intrigue |
| **Proof** | Evidence/results | Trust, validation |
| **Authority** | Expert positioning | Credibility |
| **Urgency** | Time pressure | Scarcity, deadlines |
| **Contrarian** | Challenge beliefs | Surprise, differentiation |
| **Story** | Narrative arc | Emotion, connection |

### Phase 2: Angle Generation (20 min)

Generate 2-3 angles per type.

### Phase 3: Prioritization (10 min)

## Angle Generation Template

```markdown
# Ad Angles: [Product/Campaign]
**Target Audience:** [Audience]
**Campaign Goal:** [Goal]

---

## 🔴 PAIN ANGLES

### Angle 1: [Name]
**Hook:** "Tired of [specific pain point]?"
**Core Message:** [What we're saying]
**Emotional Trigger:** [Fear/frustration/overwhelm]
**Supporting Points:**
- [Pain point detail 1]
- [Pain point detail 2]
- [Pain point detail 3]

**Sample Ad Copy:**
"[2-3 sentence ad copy using this angle]"

---

### Angle 2: [Name]
**Hook:** "Stop wasting [time/money] on [ineffective solution]"
**Core Message:** [What we're saying]
**Emotional Trigger:** [Specific emotion]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

### Angle 3: [Name]
**Hook:** "The hidden cost of [problem]"
**Core Message:** [What we're saying]
**Emotional Trigger:** [Specific emotion]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## 🟢 DESIRE ANGLES

### Angle 4: [Name]
**Hook:** "Imagine [ideal outcome]..."
**Core Message:** [Transformation we're promising]
**Emotional Trigger:** [Hope/aspiration/freedom]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

### Angle 5: [Name]
**Hook:** "What if you could [dream scenario]?"
**Core Message:** [What we're saying]
**Emotional Trigger:** [Specific emotion]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## 🟡 CURIOSITY ANGLES

### Angle 6: [Name]
**Hook:** "The [unexpected thing] that [outcome]"
**Core Message:** [Information gap we're creating]
**Emotional Trigger:** [FOMO/intrigue]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

### Angle 7: [Name]
**Hook:** "Why [common belief] is wrong"
**Core Message:** [What we're saying]
**Emotional Trigger:** [Curiosity/surprise]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## 🔵 PROOF ANGLES

### Angle 8: [Name]
**Hook:** "[X,XXX] [people] already [achieved result]"
**Core Message:** [Social proof we're leveraging]
**Proof Element:** [Specific number/testimonial/case study]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

### Angle 9: [Name]
**Hook:** "How [Customer] got [specific result]"
**Core Message:** [Case study angle]
**Proof Element:** [Specific results/metrics]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## 🟣 AUTHORITY ANGLES

### Angle 10: [Name]
**Hook:** "As seen in [Publication/Platform]"
**Core Message:** [Credibility we're establishing]
**Authority Element:** [Press/expert endorsement/credentials]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## ⚫ CONTRARIAN ANGLES

### Angle 11: [Name]
**Hook:** "Stop [common advice everyone gives]"
**Core Message:** [Belief we're challenging]
**Differentiation:** [How we're different]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

### Angle 12: [Name]
**Hook:** "Everything you know about [topic] is wrong"
**Core Message:** [Paradigm shift]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## 🟠 URGENCY ANGLES

### Angle 13: [Name]
**Hook:** "Last chance: [offer] ends [time]"
**Core Message:** [Scarcity/deadline]
**Urgency Type:** [Time-limited / quantity-limited / exclusive]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## 📖 STORY ANGLES

### Angle 14: [Name]
**Hook:** "I used to [struggle]..."
**Core Message:** [Narrative arc]
**Story Structure:** [Before → Discovery → After]
**Sample Ad Copy:**
"[2-3 sentence ad copy]"

---

## Angle Priority Matrix

| Rank | Angle | Type | Confidence | Test First? |
|------|-------|------|------------|-------------|
| 1 | [Angle Name] | [Type] | High | Yes |
| 2 | [Angle Name] | [Type] | High | Yes |
| 3 | [Angle Name] | [Type] | Medium | Yes |
| 4 | [Angle Name] | [Type] | Medium | No |
| 5 | [Angle Name] | [Type] | Medium | No |

**Priority Rationale:**
- Angle 1 ranked first because [reason]
- Angle 2 ranked second because [reason]
- [Continue...]

---

## A/B Test Plan

### Test 1: Pain vs Desire
**Hypothesis:** [Which should win and why]
**Ads:**
- A: [Pain Angle X]
- B: [Desire Angle Y]

### Test 2: [Test name]
**Hypothesis:** [Expected outcome]
**Ads:**
- A: [Angle X]
- B: [Angle Y]

### Test 3: [Test name]
**Hypothesis:** [Expected outcome]
**Ads:**
- A: [Angle X]
- B: [Angle Y]

---

## Angles to Avoid

| Angle | Reason |
|-------|--------|
| [Competitor's main angle] | Too similar, won't differentiate |
| [Overused industry angle] | Audience is numb to it |
| [Angle that doesn't fit brand] | Off-brand, confusing |

---

## Next Steps

1. Create ad copy for top 3 angles
2. Design creatives for each angle
3. Launch Test 1 (Pain vs Desire)
4. Analyze results after [X] impressions
5. Kill losers, scale winners
6. Move to Test 2
```

## Angle Generation Prompts

**Pain Discovery:**
- What keeps them up at night?
- What have they tried that failed?
- What's the hidden cost of their problem?

**Desire Discovery:**
- What's their dream outcome?
- Who do they want to become?
- What would life look like if solved?

**Curiosity Discovery:**
- What do they not know they don't know?
- What surprising truth can we reveal?
- What common belief can we challenge?

**Proof Discovery:**
- What results have we achieved?
- What do customers say?
- What external validation do we have?

## Acceptance Criteria

- [ ] 10+ unique angles generated
- [ ] All 8 angle types represented
- [ ] Sample ad copy for each angle
- [ ] Angles prioritized with rationale
- [ ] A/B test plan created
- [ ] Angles to avoid identified
- [ ] Ready for ad copy creation

## Quality Gate
- Threshold: >70%
- Minimum 10 unique angles generated across all 8 angle types
- Each angle includes sample ad copy (not just a hook)
- Priority matrix with rationale and A/B test plan provided

---
*Copy Squad Task*
