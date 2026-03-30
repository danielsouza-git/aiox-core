# copy-edit

```yaml
task:
  id: copy-edit
  name: Edit Copy for Clarity and Impact
  agent: copy-editor
  squad: copy
  type: editing
  elicit: true

inputs:
  required:
    - copy_draft: "Copy to be edited"
    - edit_level: "Light, medium, or heavy"
    - copy_type: "Landing page, email, ad, blog, etc."
  optional:
    - brand_voice: "Voice guide"
    - target_audience: "Who this is for"
    - word_limit: "Maximum word count"

outputs:
  - edited_copy.md: "Edited version"
  - edit_notes.md: "Explanation of changes"
  - before_after.md: "Comparison document"

pre_conditions:
  - "Draft copy provided"
  - "Edit level determined"

post_conditions:
  - "Copy clearer and more impactful"
  - "All changes explained"
  - "Original intent preserved"
```

## Workflow

### Phase 1: Assessment (5 min)
1. Read draft completely
2. Identify major issues
3. Determine edit priorities
4. Note voice/tone

### Phase 2: Editing (varies by level)
- Light: 15 min
- Medium: 30 min
- Heavy: 60 min

### Phase 3: Documentation (10 min)

## Editing Levels

| Level | Focus | Time | Scope |
|-------|-------|------|-------|
| **Light** | Grammar, spelling, punctuation | Fast | Surface errors |
| **Medium** | + Clarity, flow, word choice | Medium | Sentence-level |
| **Heavy** | + Structure, logic, rewriting | Slow | Full revision |

## Edit Checklist by Level

### Light Edit
```markdown
- [ ] Spelling errors corrected
- [ ] Grammar issues fixed
- [ ] Punctuation consistent
- [ ] Typos removed
- [ ] Formatting cleaned
- [ ] Basic consistency
```

### Medium Edit
```markdown
Light edit plus:
- [ ] Sentence clarity improved
- [ ] Word choice tightened
- [ ] Redundancy removed
- [ ] Flow between sentences
- [ ] Passive voice reduced
- [ ] Jargon clarified
- [ ] Tone consistency
```

### Heavy Edit
```markdown
Medium edit plus:
- [ ] Structure reorganized
- [ ] Arguments strengthened
- [ ] Logic gaps filled
- [ ] Sections rewritten
- [ ] Message sharpened
- [ ] CTA optimized
- [ ] Full copy polish
```

## Editing Template

```markdown
# Edit Report: [Copy Title]

**Copy Type:** [Type]
**Edit Level:** [Light / Medium / Heavy]
**Word Count:** Original [X] → Edited [X]

---

## Executive Summary

**Overall Assessment:**
[1-2 sentence evaluation of the draft]

**Key Issues:**
1. [Major issue 1]
2. [Major issue 2]
3. [Major issue 3]

**Edit Approach:**
[How you approached the edit]

---

## Edited Copy

[FULL EDITED COPY HERE]

---

## Edit Notes

### Structural Changes
1. [Change and why]
2. [Change and why]

### Clarity Improvements
1. **Before:** "[Original]"
   **After:** "[Edited]"
   **Why:** [Reason]

2. **Before:** "[Original]"
   **After:** "[Edited]"
   **Why:** [Reason]

### Word Choice
1. Changed "[word]" to "[word]" — [reason]
2. Changed "[phrase]" to "[phrase]" — [reason]

### Cuts
- Removed: "[Cut content]" — [reason]
- Removed: "[Cut content]" — [reason]

### Additions
- Added: "[New content]" — [reason]

---

## Before/After Comparison

### Headline
**Before:** [Original]
**After:** [Edited]
**Change:** [What changed and why]

### Opening
**Before:** [Original paragraph]
**After:** [Edited paragraph]
**Change:** [What changed and why]

### Key Section
**Before:** [Original]
**After:** [Edited]
**Change:** [What changed and why]

### CTA
**Before:** [Original]
**After:** [Edited]
**Change:** [What changed and why]

---

## Recommendations

### Further Improvements
1. [Suggestion beyond scope]
2. [Suggestion for consideration]

### Questions for Author
1. [Clarification needed]
2. [Approval needed for major change]
```

## Editing Principles

### Clarity Rules
- One idea per sentence
- Active voice > passive voice
- Specific > vague
- Short words > long words
- Show > tell

### Cutting Rules
- Cut redundant words ("very unique" → "unique")
- Cut filler words ("actually," "really," "just")
- Cut unnecessary qualifiers
- Cut repetitive ideas
- Kill your darlings

### Flow Rules
- Vary sentence length
- Use transitions
- Connect ideas logically
- Maintain consistent voice
- Read aloud test

## Common Edits

| Issue | Before | After |
|-------|--------|-------|
| Redundancy | "free gift" | "gift" |
| Weak verb | "is able to" | "can" |
| Passive | "was written by" | "wrote" |
| Wordiness | "in order to" | "to" |
| Vague | "things" | "[specific noun]" |
| Filler | "basically" | [delete] |
| Qualifier | "somewhat effective" | "effective" |

## Acceptance Criteria

- [ ] All errors at edit level corrected
- [ ] Copy clearer than original
- [ ] Edit notes explain all changes
- [ ] Before/after comparison provided
- [ ] Original intent preserved
- [ ] Voice/tone consistent
- [ ] Word count appropriate
- [ ] Recommendations provided

## Quality Gate
- Threshold: >70%
- All changes explained with rationale in edit notes (no unexplained edits)
- Before/after comparison provided for key sections (headline, opening, CTA)
- Original intent and brand voice preserved throughout edits

---
*Copy Squad Task*
