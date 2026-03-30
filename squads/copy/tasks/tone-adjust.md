# tone-adjust

```yaml
task:
  id: tone-adjust
  name: Adjust Copy Tone
  agent: copy-editor
  squad: copy
  type: transformation
  elicit: true

inputs:
  required:
    - original_copy: "Copy to transform"
    - current_tone: "Current tone assessment"
    - target_tone: "Desired tone"
  optional:
    - brand_voice: "Voice guidelines"
    - audience: "Who this is for"
    - context: "Where copy will appear"

outputs:
  - adjusted_copy.md: "Transformed copy"
  - tone_analysis.md: "Before/after tone comparison"
  - technique_notes.md: "How changes achieve tone"

pre_conditions:
  - "Original copy provided"
  - "Target tone defined"

post_conditions:
  - "Tone successfully shifted"
  - "Meaning preserved"
  - "Techniques documented"
```

## Workflow

### Phase 1: Tone Analysis (10 min)
1. Assess current tone
2. Define target tone
3. Identify gap
4. Plan transformation approach

### Phase 2: Transformation (20 min)
1. Apply tone techniques
2. Adjust vocabulary
3. Modify sentence structure
4. Refine delivery

### Phase 3: Verification (10 min)
1. Read aloud
2. Compare to target
3. Document techniques

## Tone Spectrum

| Tone | Characteristics | Use When |
|------|-----------------|----------|
| **Formal** | Professional, structured, third-person | Corporate, legal, academic |
| **Professional** | Polished, competent, trustworthy | B2B, enterprise |
| **Friendly** | Warm, approachable, conversational | Consumer brands |
| **Casual** | Relaxed, colloquial, first-person | Lifestyle, startups |
| **Playful** | Fun, witty, energetic | Youth brands, entertainment |
| **Urgent** | Direct, time-sensitive, action-oriented | Sales, limited offers |
| **Empathetic** | Understanding, supportive, compassionate | Healthcare, support |
| **Authoritative** | Expert, confident, decisive | Thought leadership |
| **Inspiring** | Motivational, visionary, aspirational | Nonprofits, coaching |

## Tone Transformation Techniques

### Formal → Casual

| Technique | Formal | Casual |
|-----------|--------|--------|
| Contractions | "we are" | "we're" |
| Pronouns | "one might" | "you might" |
| Sentence length | Long, complex | Short, punchy |
| Vocabulary | "utilize" | "use" |
| Voice | Passive | Active |
| Address | Third person | Second person |

**Example:**
- **Formal:** "It is recommended that users complete the registration process prior to accessing the platform."
- **Casual:** "Sign up before you dive in. It takes two minutes."

### Casual → Formal

| Technique | Casual | Formal |
|-----------|--------|--------|
| Contractions | "won't" | "will not" |
| Slang | "awesome" | "excellent" |
| Sentence structure | Fragments | Complete sentences |
| Punctuation | "!!" | "." |
| Vocabulary | Simple | Sophisticated |

### Professional → Friendly

| Technique | Professional | Friendly |
|-----------|--------------|----------|
| Opening | "Dear valued customer" | "Hey there!" |
| Tone words | "ensure," "facilitate" | "help," "make sure" |
| Personal touches | None | Stories, humor |
| Closings | "Best regards" | "Cheers!" |

### Aggressive → Soft

| Technique | Aggressive | Soft |
|-----------|------------|------|
| Urgency | "Act NOW!" | "When you're ready" |
| Commands | "Buy this" | "Consider this" |
| Pressure | "Don't miss out!" | "Here if you need" |
| Punctuation | "!!!" | "." |

### Boring → Engaging

| Technique | Boring | Engaging |
|-----------|--------|----------|
| Opening | "This article discusses" | "Ever wondered why..." |
| Structure | Long paragraphs | Short, varied |
| Voice | Passive | Active |
| Content | Abstract | Specific, concrete |
| Stories | None | Personal anecdotes |
| Questions | None | Rhetorical questions |

## Tone Adjustment Template

```markdown
# Tone Adjustment: [Document]

**Current Tone:** [Assessment]
**Target Tone:** [Goal]
**Copy Type:** [Type]

---

## Tone Analysis

### Current Tone Markers
- [Element 1] suggests [tone]
- [Element 2] suggests [tone]
- [Element 3] suggests [tone]

### Target Tone Characteristics
- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]

### Gap Analysis
| Current | Target | Adjustment Needed |
|---------|--------|-------------------|
| [Trait] | [Trait] | [Change] |
| [Trait] | [Trait] | [Change] |

---

## Adjusted Copy

[FULL ADJUSTED COPY HERE]

---

## Transformation Notes

### Vocabulary Changes
| Original | Adjusted | Reason |
|----------|----------|--------|
| [Word] | [Word] | [Why] |
| [Phrase] | [Phrase] | [Why] |

### Structure Changes
- [Change 1 and effect]
- [Change 2 and effect]

### Key Transformations

**Before:**
"[Original passage]"

**After:**
"[Adjusted passage]"

**Techniques Used:**
- [Technique 1]
- [Technique 2]

---

## Verification

### Tone Test
Read aloud and assess:
- [ ] Sounds like target tone
- [ ] Feels natural, not forced
- [ ] Meaning preserved
- [ ] Audience appropriate

### Comparison
| Element | Before | After |
|---------|--------|-------|
| Formality | [X/10] | [X/10] |
| Warmth | [X/10] | [X/10] |
| Energy | [X/10] | [X/10] |
| Authority | [X/10] | [X/10] |
```

## Tone Word Banks

### Formal Words
- Utilize, facilitate, endeavor, subsequent
- Accordingly, therefore, furthermore
- Regarding, pertaining to, in accordance with

### Casual Words
- Use, help, try, next
- So, also, plus
- About, related to, based on

### Warm Words
- Welcome, excited, delighted
- Together, community, support
- Happy, grateful, appreciate

### Urgent Words
- Now, today, immediately
- Limited, exclusive, final
- Don't miss, act fast, hurry

### Empowering Words
- You can, achieve, succeed
- Transform, unlock, discover
- Confident, capable, ready

## Acceptance Criteria

- [ ] Tone successfully transformed
- [ ] Original meaning preserved
- [ ] Sounds natural, not forced
- [ ] Audience appropriate
- [ ] Techniques documented
- [ ] Before/after comparison clear
- [ ] Ready for use

## Quality Gate
- Threshold: >70%
- Tone shift verified by read-aloud test (sounds natural, not forced)
- Original meaning fully preserved after transformation
- Vocabulary changes documented with before/after comparison and rationale

---
*Copy Squad Task*
