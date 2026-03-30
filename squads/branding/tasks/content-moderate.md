# content-moderate

```yaml
task: contentModerate()
agent: ai-orchestrator
squad: branding
prd_refs: [NFR-8.1]

inputs:
  - name: content
    type: string
    required: true
  - name: content_type
    type: enum
    values: [copy, image_prompt, ad_copy, email]
    required: true
  - name: brand_profile
    type: BrandProfile
    required: true

outputs:
  - name: moderation_result
    type: ModerationResult
    destination: memory
  - name: flagged_content
    type: json
    destination: .aiox/branding/{client}/moderation/flagged/

tools:
  - content-filter
  - profanity-filter
```

## Purpose

Automated content moderation to filter AI-generated content before human review.

## Moderation Checks

```yaml
checks:
  offensive_language:
    method: profanity_filter + context_aware_detection
    action: flag_for_review
    severity: high

  brand_forbidden_words:
    source: brand_profile.voice_guide.forbidden_words
    action: auto_reject
    severity: medium

  competitor_mentions:
    detect: competitor_brand_names
    action: alert
    severity: low

  factual_claims:
    detect: statements_requiring_verification
    patterns:
      - "studies show"
      - "proven to"
      - "X% of people"
      - "guaranteed"
    action: flag_for_verification
    severity: medium

  legal_compliance:
    detect: unsubstantiated_claims
    categories:
      - health_claims
      - financial_promises
      - legal_advice
    action: flag_for_legal_review
    severity: high
```

## Moderation Pipeline

```yaml
pipeline:
  - step: profanity_check
    tool: profanity-filter
    sensitivity: medium
    languages: [pt-BR, en-US]

  - step: forbidden_words_check
    source: brand_vocabulary_bank
    match_type: exact + fuzzy

  - step: competitor_check
    source: brand_profile.competitors
    match_type: brand_name + variations

  - step: claims_check
    patterns: factual_claim_patterns
    action: extract_and_flag

  - step: legal_check
    categories: [health, finance, legal]
    action: flag_if_detected

  - step: aggregate_results
    combine: all_checks
    determine: final_action
```

## Result Schema

```yaml
ModerationResult:
  status: pass | flag | reject

  checks:
    - check: string
      passed: boolean
      findings: string[]
      severity: high | medium | low

  action_required:
    human_review: boolean
    legal_review: boolean
    brand_review: boolean

  flagged_items:
    - text: string
      reason: string
      suggestion: string

  auto_fixes:
    - original: string
      replacement: string
      applied: boolean
```

## Auto-Fix Capabilities

```yaml
auto_fixes:
  forbidden_word_replacement:
    enabled: true
    method: use_approved_alternatives

  tone_adjustment:
    enabled: false
    reason: requires_human_judgment

  competitor_removal:
    enabled: true
    method: replace_with_generic
```

## Severity Actions

```yaml
severity_actions:
  high:
    action: reject
    notification: immediate
    requires: human_approval_to_override

  medium:
    action: flag
    notification: batch
    requires: human_review

  low:
    action: alert
    notification: summary
    requires: acknowledgment
```

## Pre-Conditions

- [ ] Content provided
- [ ] Brand profile with vocabulary bank
- [ ] Competitor list available

## Post-Conditions

- [ ] All checks executed
- [ ] Results documented
- [ ] Flagged items stored

## Acceptance Criteria

- [ ] No offensive content passes
- [ ] Forbidden words caught
- [ ] Factual claims flagged
- [ ] Human review triggered when needed

## Quality Gate

- Threshold: >70%
- All content checked against brand guidelines
- Flagged items include severity rating and specific policy violation
- Moderation decision documented with rationale

---
*Branding Squad Task - ai-orchestrator*
