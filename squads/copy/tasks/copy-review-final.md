# copy-review-final

```yaml
task:
  id: copy-review-final
  name: Final Copy Review
  agent: copy-chief
  squad: copy
  type: review
  elicit: false

inputs:
  required:
    - copy_deliverables: "All copy files to review"
    - copy_strategy: "Original strategy document"
    - brand_guidelines: "Voice and tone guidelines"
  optional:
    - feedback: "Client or stakeholder feedback"

outputs:
  - review_report.md: "Detailed review findings"
  - approved_copy/: "Final approved copy files"
  - revision_notes.md: "Notes for any required revisions"

pre_conditions:
  - "All copy deliverables completed"
  - "Copy has passed initial quality check"

post_conditions:
  - "All copy aligns with strategy"
  - "Brand voice consistent throughout"
  - "No grammatical or spelling errors"
  - "CTAs clear and compelling"
```

## Workflow

### Phase 1: Strategy Alignment Check (10 min)
1. Compare copy against messaging hierarchy
2. Verify value proposition is clear
3. Check all key messages are present
4. Ensure proof points included

### Phase 2: Voice & Tone Audit (10 min)
1. Read copy aloud for flow
2. Check consistency with brand voice
3. Verify tone matches audience
4. Flag any off-brand language

### Phase 3: Technical Review (10 min)
1. Grammar and spelling check
2. Punctuation consistency
3. Formatting verification
4. Link and CTA functionality

### Phase 4: Conversion Optimization (10 min)
1. Headlines strong enough to stop scroll
2. Benefits clear (not just features)
3. Objections addressed
4. Urgency/scarcity appropriate
5. CTA compelling and clear

## Review Checklist

### Strategy Alignment
- [ ] Primary value proposition prominent
- [ ] All secondary messages included
- [ ] Proof points support claims
- [ ] Target audience language used

### Voice & Tone
- [ ] Consistent brand voice
- [ ] Appropriate tone for context
- [ ] No jargon (unless intentional)
- [ ] Conversational where appropriate

### Technical Quality
- [ ] Zero spelling errors
- [ ] Grammar correct
- [ ] Punctuation consistent
- [ ] Formatting clean

### Conversion Elements
- [ ] Hook captures attention (first 3 seconds)
- [ ] Benefits > Features
- [ ] Social proof included
- [ ] Objections handled
- [ ] CTA clear and compelling
- [ ] Urgency appropriate (not forced)

## Review Verdicts

| Verdict | Criteria | Next Step |
|---------|----------|-----------|
| **APPROVED** | All checks pass | Deliver to client |
| **MINOR REVISIONS** | <5 minor issues | Quick fixes, re-review |
| **MAJOR REVISIONS** | Strategy misalignment | Return to writer |
| **REJECTED** | Fundamental issues | Restart from strategy |

## Acceptance Criteria

- [ ] All deliverables reviewed against checklist
- [ ] Review report generated with specific feedback
- [ ] Verdict assigned (APPROVED/REVISIONS/REJECTED)
- [ ] Approved copy files organized for delivery
- [ ] Revision notes provided if applicable

## Quality Gate
- Threshold: >70%
- Zero grammatical or spelling errors in approved copy
- All CTAs clear, compelling, and action-oriented
- Brand voice consistency score across all deliverables (no off-brand language)

---
*Copy Squad Task*
