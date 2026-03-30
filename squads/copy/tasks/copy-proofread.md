# copy-proofread

```yaml
task:
  id: copy-proofread
  name: Proofread Copy for Errors
  agent: copy-editor
  squad: copy
  type: quality
  elicit: false

inputs:
  required:
    - copy_final: "Copy to proofread"
    - copy_type: "Type of copy"
  optional:
    - style_guide: "AP, Chicago, house style"
    - previous_errors: "Known issues to watch"

outputs:
  - proofread_copy.md: "Corrected copy"
  - error_log.md: "List of corrections"
  - quality_report.md: "Error analysis"

pre_conditions:
  - "Copy has been edited"
  - "This is final check before publish"

post_conditions:
  - "Zero spelling errors"
  - "Zero grammar errors"
  - "Punctuation consistent"
  - "Formatting correct"
```

## Workflow

### Phase 1: First Pass - Technical (10 min)
1. Spelling check
2. Grammar check
3. Punctuation check
4. Number/date formatting

### Phase 2: Second Pass - Consistency (10 min)
1. Style consistency
2. Formatting consistency
3. Capitalization
4. Hyphenation

### Phase 3: Third Pass - Final (5 min)
1. Read aloud
2. Fresh eyes check
3. Final verification

## Proofreading Checklist

```markdown
# Proofreading Checklist: [Document]

## Spelling
- [ ] No misspelled words
- [ ] Proper nouns correct
- [ ] Technical terms verified
- [ ] Homophones correct (their/there/they're)
- [ ] British vs American spelling consistent

## Grammar
- [ ] Subject-verb agreement
- [ ] Pronoun-antecedent agreement
- [ ] Correct tense usage
- [ ] No dangling modifiers
- [ ] No run-on sentences
- [ ] No sentence fragments

## Punctuation
- [ ] Commas used correctly
- [ ] Apostrophes correct (possessives vs contractions)
- [ ] Quotation marks consistent (curly vs straight)
- [ ] Hyphens vs en-dashes vs em-dashes
- [ ] Periods inside/outside quotes (style guide)
- [ ] Colons and semicolons correct
- [ ] No double spaces

## Numbers & Dates
- [ ] Numbers formatted consistently (1,000 vs 1000)
- [ ] Spell out numbers (one-ten or similar)
- [ ] Dates formatted consistently
- [ ] Time zones specified if needed
- [ ] Currencies correct
- [ ] Percentages (% vs percent)

## Formatting
- [ ] Consistent heading hierarchy
- [ ] Bullet points consistent
- [ ] Spacing uniform
- [ ] Indentation correct
- [ ] Bold/italic used consistently
- [ ] Links working

## Capitalization
- [ ] Sentence case vs title case consistent
- [ ] Proper nouns capitalized
- [ ] After colons (per style guide)
- [ ] Headlines consistent

## Consistency
- [ ] Brand names spelled correctly
- [ ] Product names consistent
- [ ] Terminology consistent throughout
- [ ] Voice consistent
- [ ] Abbreviations introduced properly

## Final Check
- [ ] Read entire piece aloud
- [ ] No missing words
- [ ] No duplicated words
- [ ] All placeholders replaced
- [ ] No "lorem ipsum" remaining
```

## Error Log Template

```markdown
# Error Log: [Document]

**Proofread By:** [Name]
**Date:** [Date]
**Copy Type:** [Type]
**Word Count:** [X]

---

## Error Summary

| Error Type | Count |
|------------|-------|
| Spelling | [X] |
| Grammar | [X] |
| Punctuation | [X] |
| Formatting | [X] |
| Consistency | [X] |
| **Total** | [X] |

---

## Corrections Made

### Spelling
| Location | Error | Correction |
|----------|-------|------------|
| [Para/Line] | [Wrong] | [Right] |
| [Para/Line] | [Wrong] | [Right] |

### Grammar
| Location | Error | Correction |
|----------|-------|------------|
| [Para/Line] | [Wrong] | [Right] |
| [Para/Line] | [Wrong] | [Right] |

### Punctuation
| Location | Error | Correction |
|----------|-------|------------|
| [Para/Line] | [Wrong] | [Right] |

### Formatting
| Location | Issue | Fix |
|----------|-------|-----|
| [Location] | [Issue] | [Fix] |

### Consistency
| Issue | Standardized To |
|-------|-----------------|
| [Inconsistency] | [Standard] |

---

## Quality Assessment

**Error Rate:** [X] errors per 1000 words

| Rating | Threshold |
|--------|-----------|
| Excellent | <2 errors/1000 |
| Good | 2-5 errors/1000 |
| Needs Work | >5 errors/1000 |

**Overall Rating:** [Rating]

---

## Recurring Issues

[Note any patterns that suggest training needs]

1. [Pattern 1]
2. [Pattern 2]
```

## Common Errors Reference

### Homophones
| Correct Usage | Common Error |
|---------------|--------------|
| their (possessive) | there, they're |
| you're (you are) | your |
| it's (it is) | its |
| affect (verb) | effect (noun) |
| than (comparison) | then |
| lose (verb) | loose |

### Grammar
| Correct | Incorrect |
|---------|-----------|
| "fewer items" | "less items" |
| "comprises X" | "is comprised of" |
| "different from" | "different than" |
| "try to" | "try and" |
| "couldn't care less" | "could care less" |

### Punctuation
| Rule | Example |
|------|---------|
| Oxford comma | A, B, and C |
| Possessive singular | boss's |
| Possessive plural | bosses' |
| Em dash spacing | word—word (no space) |

## Acceptance Criteria

- [ ] Zero spelling errors
- [ ] Zero grammar errors
- [ ] Punctuation 100% correct
- [ ] Formatting consistent
- [ ] All items on checklist verified
- [ ] Error log completed
- [ ] Quality rating assigned
- [ ] Ready for publication

## Quality Gate
- Threshold: >70%
- Zero spelling and grammar errors in final output
- Error rate below 2 errors per 1000 words (Excellent rating)
- All placeholders replaced and no "lorem ipsum" remaining in deliverables

---
*Copy Squad Task*
