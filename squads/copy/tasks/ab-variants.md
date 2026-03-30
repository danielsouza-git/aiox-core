# ab-variants

```yaml
task:
  id: ab-variants
  name: Create A/B Test Variants
  agent: copy-editor
  squad: copy
  type: generation
  elicit: true

inputs:
  required:
    - original_copy: "Control version copy"
    - element_to_test: "Headline, CTA, body, etc."
    - num_variants: "Number of variants needed"
  optional:
    - hypothesis: "What you expect to win"
    - past_results: "Previous test data"
    - constraints: "Character limits, brand rules"

outputs:
  - variants.md: "All test variants"
  - test_plan.md: "Testing methodology"
  - hypothesis_doc.md: "Predictions and rationale"

pre_conditions:
  - "Original copy (control) finalized"
  - "Test element identified"

post_conditions:
  - "Variants meaningfully different"
  - "Single variable tested"
  - "Hypotheses documented"
```

## Workflow

### Phase 1: Test Strategy (10 min)
1. Define what to test
2. Ensure single-variable
3. Set success metric
4. Document hypothesis

### Phase 2: Variant Creation (20 min)
1. Create variants by angle
2. Ensure meaningful differences
3. Maintain brand consistency
4. Document rationale

### Phase 3: Test Planning (10 min)

## A/B Test Elements

| Element | Impact | Test Difficulty |
|---------|--------|-----------------|
| **Headline** | Very High | Easy |
| **CTA Button** | High | Easy |
| **Subject Line** | Very High | Easy |
| **Opening Line** | High | Easy |
| **Social Proof** | Medium | Medium |
| **Price Display** | High | Medium |
| **Body Copy** | Medium | Hard |
| **Full Page** | Varies | Hard |

## A/B Variant Template

```markdown
# A/B Test: [Element] Variants

**Test Name:** [Descriptive name]
**Element Tested:** [Headline / CTA / Subject / etc.]
**Control:** [Original version]
**Goal Metric:** [Clicks / Opens / Conversions / etc.]

---

## Test Hypothesis

**We believe that** [change we're making]
**will result in** [expected outcome]
**because** [reasoning based on principles/data]

---

## Control (A)

```
[Original copy]
```

**Characteristics:**
- [What approach it uses]
- [What angle it takes]

---

## Variant B

```
[Variant copy]
```

**Change:** [What's different]
**Angle:** [What approach this takes]
**Hypothesis:** [Why this might win]

---

## Variant C

```
[Variant copy]
```

**Change:** [What's different]
**Angle:** [What approach this takes]
**Hypothesis:** [Why this might win]

---

## Variant D

```
[Variant copy]
```

**Change:** [What's different]
**Angle:** [What approach this takes]
**Hypothesis:** [Why this might win]

---

## Variant E

```
[Variant copy]
```

**Change:** [What's different]
**Angle:** [What approach this takes]
**Hypothesis:** [Why this might win]

---

## Test Matrix

| Variant | Angle | Key Difference | Expected Winner? |
|---------|-------|----------------|------------------|
| A (Control) | [Angle] | Baseline | - |
| B | [Angle] | [Difference] | [Yes/No/Maybe] |
| C | [Angle] | [Difference] | [Yes/No/Maybe] |
| D | [Angle] | [Difference] | [Yes/No/Maybe] |
| E | [Angle] | [Difference] | [Yes/No/Maybe] |

---

## Test Plan

### Sample Size
- Minimum per variant: [X,XXX]
- Statistical confidence: 95%
- Minimum detectable effect: [X]%

### Duration
- Estimated: [X] days
- Based on: [traffic/volume data]

### Segments
- [ ] All traffic
- [ ] New visitors only
- [ ] Returning visitors only
- [ ] Mobile only
- [ ] [Specific segment]

### Success Criteria
- Primary metric: [Metric]
- Winning threshold: [X]% lift
- Secondary metrics: [Metrics]

---

## After Test

### Results Documentation
| Variant | Metric | Lift vs Control | Confidence |
|---------|--------|-----------------|------------|
| A | [X.XX%] | - | - |
| B | [X.XX%] | [±X.X%] | [XX%] |
| C | [X.XX%] | [±X.X%] | [XX%] |
| D | [X.XX%] | [±X.X%] | [XX%] |
| E | [X.XX%] | [±X.X%] | [XX%] |

### Winner
**Variant [X]** won with [X]% lift at [X]% confidence.

### Learnings
- [Insight 1]
- [Insight 2]

### Next Test
Based on learnings, next test: [What to test next]
```

## Variant Angles by Element

### Headlines
| Angle | Example |
|-------|---------|
| **Benefit** | "Save 10 Hours Every Week" |
| **Pain** | "Stop Wasting Time on X" |
| **Curiosity** | "The Secret to X That Nobody Shares" |
| **Social Proof** | "Join 10,000+ Who Already X" |
| **Question** | "Ready to Finally X?" |
| **Direct** | "X: Starts at $9/month" |
| **How-To** | "How to X in 5 Minutes" |
| **Number** | "7 Ways to X" |

### CTAs
| Angle | Example |
|-------|---------|
| **Action** | "Start Free Trial" |
| **Benefit** | "Get More Leads" |
| **Urgency** | "Claim Your Spot" |
| **Personal** | "Create My Account" |
| **Casual** | "Let's Go" |
| **Specific** | "Download the Guide" |
| **Low Commitment** | "See How It Works" |

### Subject Lines
| Angle | Example |
|-------|---------|
| **Curiosity** | "About [topic]..." |
| **Personal** | "[Name], quick question" |
| **Benefit** | "Your [outcome] awaits" |
| **Urgency** | "[X] hours left" |
| **Question** | "Have you tried this?" |
| **Social** | "[Person] recommended this" |

## Testing Best Practices

### Do
- Test one variable at a time
- Run until statistical significance
- Document everything
- Test meaningful differences
- Use proper sample sizes

### Don't
- End tests early
- Test multiple variables at once
- Ignore losing variants' insights
- Assume past winners always win
- Test tiny variations

## Statistical Significance

| Sample Size | Minimum Detectable Effect |
|-------------|---------------------------|
| 1,000/variant | ~15% |
| 5,000/variant | ~7% |
| 10,000/variant | ~5% |
| 50,000/variant | ~2% |

## Acceptance Criteria

- [ ] [X] variants created
- [ ] Single variable tested
- [ ] Variants meaningfully different
- [ ] Angles clearly documented
- [ ] Hypotheses stated
- [ ] Test plan complete
- [ ] Success metrics defined
- [ ] Sample size calculated

## Quality Gate
- Threshold: >70%
- Single variable tested per experiment (no multi-variable contamination)
- Variants are meaningfully different (not just word swaps)
- Hypothesis documented with predicted winner and rationale for each test

---
*Copy Squad Task*
