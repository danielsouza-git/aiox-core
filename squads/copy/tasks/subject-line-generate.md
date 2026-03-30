# subject-line-generate

```yaml
task:
  id: subject-line-generate
  name: Generate Subject Line Variants
  agent: email-specialist
  squad: copy
  type: generation
  elicit: true

inputs:
  required:
    - email_content: "Email body or summary"
    - email_type: "newsletter, promo, nurture, transactional"
    - num_variants: "How many variants to generate"
  optional:
    - brand_voice: "Tone guidelines"
    - past_winners: "Historical high-performing subjects"
    - avoid_words: "Words to not use"

outputs:
  - subject_lines.md: "All variants organized by angle"
  - preview_texts.md: "Matching preview texts"
  - test_matrix.md: "Recommended A/B test pairs"

pre_conditions:
  - "Email content available"
  - "Email type known"

post_conditions:
  - "Variants cover multiple angles"
  - "Character counts verified"
  - "Preview texts complement subjects"
```

## Workflow

### Phase 1: Email Analysis (5 min)
1. Identify main message/hook
2. Extract key benefit
3. Note any urgency/scarcity
4. Identify emotional angle

### Phase 2: Formula Application (10 min)

**Subject Line Formulas:**

| Formula | Example | Best For |
|---------|---------|----------|
| **Number + Benefit** | "7 ways to double conversions" | Listicles |
| **Question** | "Making this mistake?" | Problem-aware |
| **How + Result** | "How I got 10K followers" | Case studies |
| **Urgency** | "Ends tonight: 50% off" | Promos |
| **Curiosity Gap** | "The one thing most miss" | Engagement |
| **Personal** | "I need to tell you something" | Newsletters |
| **Direct** | "Your guide is ready" | Transactional |
| **Contrast** | "Why 'hustle' is killing you" | Contrarian |
| **Social Proof** | "10,000+ people did this" | Authority |
| **Warning** | "Don't open this unless..." | Curiosity |

### Phase 3: Variant Generation (15 min)

## Subject Line Generation Template

```markdown
# Subject Line Variants
**Email:** [Email name/description]
**Type:** [newsletter/promo/nurture/transactional]

---

## Curiosity Angles

1. "[Open loop statement]..."
   - Preview: "[Closes the loop]"
   - Chars: [XX]

2. "The [adjective] truth about [topic]"
   - Preview: "[Continuation]"
   - Chars: [XX]

3. "What nobody tells you about [topic]"
   - Preview: "[Hint at content]"
   - Chars: [XX]

---

## Benefit Angles

1. "How to [achieve outcome] in [timeframe]"
   - Preview: "[Additional benefit]"
   - Chars: [XX]

2. "[Number] ways to [benefit]"
   - Preview: "#[X] is a game-changer"
   - Chars: [XX]

3. "Get [specific result] without [obstacle]"
   - Preview: "[Proof or expansion]"
   - Chars: [XX]

---

## Urgency Angles

1. "[Time] left: [offer]"
   - Preview: "[Consequence of missing out]"
   - Chars: [XX]

2. "Last chance: [offer]"
   - Preview: "[Deadline specifics]"
   - Chars: [XX]

3. "Closing at midnight"
   - Preview: "[What they'll miss]"
   - Chars: [XX]

---

## Personal Angles

1. "I made a mistake with [topic]"
   - Preview: "[Lesson or outcome]"
   - Chars: [XX]

2. "[First Name], quick question"
   - Preview: "[Conversational hook]"
   - Chars: [XX]

3. "Can I be honest with you?"
   - Preview: "[Vulnerability statement]"
   - Chars: [XX]

---

## Social Proof Angles

1. "How [Name] got [result]"
   - Preview: "[Specifics of their success]"
   - Chars: [XX]

2. "[X,XXX] people already did this"
   - Preview: "[What they're missing]"
   - Chars: [XX]

---

## A/B Test Recommendations

### Test 1: Curiosity vs Benefit
- A: "[Curiosity subject]"
- B: "[Benefit subject]"
- Hypothesis: [Which should win and why]

### Test 2: Personalized vs Generic
- A: "[First Name], [subject]"
- B: "[Subject without name]"
- Hypothesis: [Which should win and why]

### Test 3: Emoji vs No Emoji
- A: "🔥 [Subject with emoji]"
- B: "[Same subject without emoji]"
- Hypothesis: [Which should win and why]

---

## Best Practices Applied

✓ Under 50 characters (mobile-friendly)
✓ No spam trigger words
✓ Preview text complements, doesn't repeat
✓ Personalization where appropriate
✓ Emoji used strategically (not excessively)
```

## Subject Line Power Words

**Urgency:**
- Now, Today, Hurry, Quick, Instant
- Last chance, Final, Limited, Expires
- Don't miss, Before it's gone

**Curiosity:**
- Secret, Hidden, Little-known
- Surprising, Unexpected, Strange
- The truth about, What nobody tells you

**Value:**
- Free, Bonus, Save, Win
- Exclusive, VIP, Private
- Best, Essential, Ultimate

**Personal:**
- You, Your, [First Name]
- Just for you, Personalized
- I, My, We

**Avoid (Spam Triggers):**
- FREE!!! (excessive caps/punctuation)
- $$$ money symbols
- "Act now" (alone)
- "Click here"
- "Winner"

## Character Count Guidelines

| Device | Visible Characters |
|--------|-------------------|
| Desktop | 60-70 chars |
| Mobile | 30-40 chars |
| **Target** | **40-50 chars** |

## Acceptance Criteria

- [ ] [X] variants generated
- [ ] Multiple angles covered (curiosity, benefit, urgency, etc.)
- [ ] Character counts verified (< 50 ideal)
- [ ] Preview text for each variant
- [ ] No spam trigger words
- [ ] A/B test pairs recommended
- [ ] Mobile-optimized (front-loaded)

## Quality Gate
- Threshold: >70%
- All subject lines under 50 characters (mobile-friendly)
- No spam trigger words present (FREE!!!, $$$, "Click here")
- At least 3 different angles covered (curiosity, benefit, urgency, personal, etc.)

---
*Copy Squad Task*
