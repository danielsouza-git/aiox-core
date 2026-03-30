# prompt-template-manage

```yaml
task: promptTemplateManage()
agent: ai-orchestrator
squad: branding
prd_refs: [FR-9.1, FR-9.2, FR-9.3]

inputs:
  - name: action
    type: enum
    values: [create, update, version, evaluate, promote]
    required: true
  - name: template_id
    type: string
    required: true

outputs:
  - name: template_file
    type: yaml
    destination: .aiox/branding/prompts/{category}/{template_id}.yaml
  - name: evaluation_report
    type: markdown
    destination: .aiox/branding/prompts/evaluations/{template_id}-eval.md

tools:
  - prompt-library
```

## Purpose

Manage versioned prompt templates for all AI generation tasks with quality scoring and calibration.

## Template Structure

```yaml
prompt_template:
  id: voice-guide-generator-v1
  version: "1.2.0"
  category: brand-strategy
  deliverable: brand_voice_guide

  metadata:
    created: 2026-01-15
    updated: 2026-03-08
    author: Nova
    status: production  # draft | testing | production | deprecated

  variables:
    required:
      - client_name
      - personality_adjectives
      - voice_pillars
      - target_audience
    optional:
      - industry_context
      - competitor_voices
      - examples

  system_prompt: |
    You are an expert brand strategist creating a Brand Voice Guide.

    Client: {client_name}
    Personality: {personality_adjectives}
    Voice Pillars: {voice_pillars}
    Target Audience: {target_audience}

    Create comprehensive voice documentation following these principles:
    - Be specific with examples
    - Include do/don't guidance
    - Provide vocabulary recommendations

  user_prompt: |
    Generate a Brand Voice Guide with the following sections:
    1. Brand Personality (3-5 adjectives with descriptions)
    2. Voice Pillars (3 core principles)
    3. Tone Spectrum (formal to casual by channel)
    4. Do/Don't List (10-15 each with examples)
    5. Vocabulary Bank (20-30 approved, 10-15 forbidden)

  output_format:
    type: markdown
    sections: [personality, pillars, tone, dos_donts, vocabulary]
    min_length: 2000
    max_length: 4000

  quality_criteria:
    brand_voice_adherence: "Examples match stated personality"
    factual_accuracy: "No invented facts or claims"
    tone_appropriateness: "Consistent with target audience"
    actionability: "Clear, implementable guidance"
    creativity: "Fresh, not generic"
```

## Template Lifecycle

```yaml
lifecycle:
  draft:
    description: "Initial creation, not for production use"
    allowed_actions: [edit, test]

  testing:
    description: "Undergoing quality evaluation"
    allowed_actions: [evaluate, iterate]
    min_evaluations: 5

  production:
    description: "Approved for client work"
    allowed_actions: [use, version]
    requirements:
      - average_score >= 4.0
      - min_evaluations >= 10

  deprecated:
    description: "Replaced by newer version"
    allowed_actions: [archive]
```

## Quality Scoring Pipeline (FR-9.2)

```yaml
evaluation_process:
  - step: generate_output
    using: template
    with: test_inputs

  - step: human_review
    reviewer: senior_copywriter
    dimensions:
      brand_voice_adherence: 1-5
      factual_accuracy: 1-5
      tone_appropriateness: 1-5
      cta_effectiveness: 1-5
      creativity: 1-5

  - step: calculate_score
    method: average_all_dimensions

  - step: record_evaluation
    store:
      - inputs_used
      - output_generated
      - scores
      - reviewer_notes

  - step: check_promotion
    if: average >= 4.0 AND evaluations >= 10
    action: promote_to_production
```

## Client Calibration (FR-9.3)

```yaml
calibration_workflow:
  - step: initial_customization
    inject:
      - brand_discovery_outputs
      - personality_traits
      - vocabulary_from_discovery
      - tone_spectrum

  - step: ab_testing
    variants: 2-3
    same_input: true
    compare: output_quality

  - step: track_performance
    metrics:
      - acceptance_rate
      - revision_requests
      - quality_scores

  - step: auto_select
    condition: min_10_evaluations
    select: best_performing_variant
```

## Pre-Conditions

- [ ] Template category exists
- [ ] Required variables defined

## Post-Conditions

- [ ] Template saved with version
- [ ] Changelog updated
- [ ] Status set correctly

## Acceptance Criteria

- [ ] Template follows structure
- [ ] Variables documented
- [ ] Quality criteria defined
- [ ] Ready for evaluation

## Quality Gate

- Threshold: >70%
- Templates versioned and documented with usage examples
- Variables clearly defined with types and defaults
- At least one A/B variant available for key templates

---
*Branding Squad Task - ai-orchestrator*
