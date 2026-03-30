# localize-copy

```yaml
task:
  id: localize-copy
  name: Localize Copy for Market
  agent: copy-editor
  squad: copy
  type: transformation
  elicit: true

inputs:
  required:
    - original_copy: "Copy to localize"
    - source_market: "Original market (e.g., US)"
    - target_market: "Target market (e.g., BR, UK, DE)"
  optional:
    - brand_guidelines: "Market-specific brand rules"
    - local_competitors: "How competitors communicate"
    - cultural_notes: "Specific considerations"

outputs:
  - localized_copy.md: "Localized version"
  - localization_notes.md: "Adaptation decisions"
  - cultural_checklist.md: "Cultural validation"

pre_conditions:
  - "Original copy finalized"
  - "Target market defined"

post_conditions:
  - "Copy culturally appropriate"
  - "Local conventions followed"
  - "Meaning preserved"
  - "All adaptations documented"
```

## Workflow

### Phase 1: Cultural Analysis (15 min)
1. Identify cultural references
2. Note date/time/currency formats
3. Find idioms and expressions
4. Check legal requirements

### Phase 2: Localization (30 min)
1. Adapt content culturally
2. Convert formats
3. Replace idioms
4. Adjust tone for market

### Phase 3: Validation (15 min)
1. Cultural sensitivity check
2. Format verification
3. Native speaker review recommendation

## Localization Checklist

```markdown
# Localization Checklist: [Market]

## Currency & Numbers
- [ ] Currency symbol correct (€, £, R$, etc.)
- [ ] Currency position correct (€10 vs 10€)
- [ ] Decimal separator correct (. vs ,)
- [ ] Thousand separator correct (, vs . vs space)
- [ ] Number formatting consistent

## Dates & Times
- [ ] Date format correct (DD/MM/YYYY vs MM/DD/YYYY)
- [ ] Time format correct (12h vs 24h)
- [ ] Timezone references appropriate
- [ ] Holiday references localized

## Measurements
- [ ] Units localized (miles vs km, lbs vs kg)
- [ ] Temperature (°F vs °C)
- [ ] Paper sizes if applicable (Letter vs A4)

## Language
- [ ] Spelling localized (US vs UK English)
- [ ] Idioms replaced with local equivalents
- [ ] Cultural references appropriate
- [ ] Humor translates or removed
- [ ] Formality level appropriate for market

## Legal & Compliance
- [ ] Required disclaimers added
- [ ] Privacy language localized
- [ ] Terms comply with local law
- [ ] Pricing transparency requirements met

## Cultural Sensitivity
- [ ] No offensive imagery/references
- [ ] Colors culturally appropriate
- [ ] Names/examples localized
- [ ] Social norms respected
```

## Market-Specific Guidelines

### US → UK Localization

| US | UK |
|----|-----|
| color | colour |
| organize | organise |
| center | centre |
| program | programme |
| check (payment) | cheque |
| $100 | £100 or £X equivalent |
| MM/DD/YYYY | DD/MM/YYYY |
| "gotten" | "got" |
| "apartment" | "flat" |
| "vacation" | "holiday" |

### US → Brazil (PT-BR) Localization

| US | Brazil |
|----|--------|
| $ USD | R$ BRL |
| Formal "you" | "você" (informal) |
| Last name first | First name common |
| MM/DD/YYYY | DD/MM/YYYY |
| Direct communication | Relationship-focused |
| American sports refs | Football (soccer) refs |

### US → Germany (DE) Localization

| US | Germany |
|----|---------|
| $ USD | € EUR |
| Informal tone | More formal |
| MM/DD/YYYY | DD.MM.YYYY |
| 12-hour time | 24-hour time |
| Short sentences | Longer acceptable |
| Hype language | Understated |
| "You" (informal) | "Sie" (formal) initially |

## Localization Template

```markdown
# Localization: [Document]

**Source Market:** [Market]
**Target Market:** [Market]
**Copy Type:** [Type]

---

## Cultural Adaptations

### References Localized
| Original | Localized | Reason |
|----------|-----------|--------|
| [Reference] | [Adapted] | [Why] |
| [Idiom] | [Equivalent] | [Why] |
| [Example] | [Local example] | [Why] |

### Tone Adjustments
- [Adjustment 1]
- [Adjustment 2]

### Removed Content
- [What was removed and why]

---

## Format Conversions

### Currency
- Original: [X]
- Localized: [X]

### Dates
- Original format: [Format]
- Localized format: [Format]

### Measurements
- [Conversion made]

---

## Localized Copy

[FULL LOCALIZED COPY HERE]

---

## Localization Notes

### Key Decisions
1. [Decision and rationale]
2. [Decision and rationale]

### Potential Issues
1. [Issue to flag for review]
2. [Alternative interpretation]

### Recommendations
1. [Recommendation for market]
2. [Follow-up action needed]

---

## Validation

### Native Speaker Review
- [ ] Recommended before publication
- Reviewer: [Name if available]
- Status: [Pending / Complete]

### Cultural Check
- [ ] No offensive content
- [ ] Culturally appropriate
- [ ] Resonates with local audience
```

## Common Localization Pitfalls

### Avoid
- Direct word-for-word translation
- Keeping source market cultural references
- Ignoring local legal requirements
- Using idioms that don't translate
- Assuming humor transfers
- Keeping source currency

### Instead
- Adapt meaning, not just words
- Use local equivalents
- Research local requirements
- Find native expressions
- Test humor locally
- Convert and contextualize currency

## Idiom Equivalents

### US → UK
| US | UK |
|----|-----|
| "touch base" | "catch up" |
| "in the weeds" | "bogged down" |
| "knock it out of the park" | "hit it for six" |

### US → Brazil
| US | Brazil |
|----|--------|
| "piece of cake" | "moleza" |
| "break a leg" | "boa sorte" |
| "hit the nail on the head" | "acertou em cheio" |

## Acceptance Criteria

- [ ] All formats localized (dates, currency, measurements)
- [ ] Cultural references adapted
- [ ] Idioms replaced with equivalents
- [ ] Tone appropriate for market
- [ ] Legal requirements addressed
- [ ] No culturally insensitive content
- [ ] All adaptations documented
- [ ] Native review recommended

## Quality Gate
- Threshold: >70%
- All formats localized (dates, currency, measurements) for target market
- Idioms replaced with local equivalents (no untranslated source-market expressions)
- Cultural sensitivity checklist completed with zero offensive content flags

---
*Copy Squad Task*
