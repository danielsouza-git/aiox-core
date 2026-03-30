# copy-generate

```yaml
task: copyGenerate()
agent: ai-orchestrator
squad: branding
prd_refs: [FR-2.7, FR-2.9, FR-2.10, FR-3.1]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: voice_guide
    type: VoiceGuide
    required: true
  - name: content_brief
    type: ContentBrief
    required: true

outputs:
  - name: generated_copy
    type: CopyOutput
    destination: .aiox/branding/{client}/copy/{content_type}/
  - name: generation_log
    type: json
    destination: .aiox/branding/{client}/logs/copy-generation.json

tools:
  - claude-api
  - gpt-4o
```

## Purpose

Generate brand-aligned copy using AI with quality scoring and human review gates.

## Content Types

```yaml
content_types:
  social_post:
    framework: HCEA
    length: 150-300 words
    hashtags: 8-12

  carousel:
    framework: HCEA
    slides: 2-10
    cta: save/share/comment

  landing_page:
    framework: ConversionArchitecture
    sections: 8
    length: 1500-3000 words

  email:
    framework: HCEA
    length: 150-400 words
    subject_lines: 3 variants

  ad_copy:
    variants: 3-5
    lengths: [short, medium, long]
    angles: [dor, desejo, curiosidade, prova, autoridade]

  blog_post:
    length: 2000 words
    seo_optimized: true
```

## HCEA Framework

```yaml
hcea:
  hook:
    description: "Attention-grabbing opener"
    length: 1-2 sentences

  context:
    description: "Set the scene, relate to audience"
    length: 2-3 sentences

  entrega:
    description: "Deliver value, main content"
    length: varies by content type

  action:
    description: "Clear CTA"
    length: 1 sentence
```

## Generation Process

```yaml
steps:
  - step: prepare_context
    inject:
      - brand_personality
      - voice_pillars
      - vocabulary_bank
      - forbidden_words
      - tone_for_channel

  - step: select_prompt_template
    source: prompt_library
    version: latest_approved

  - step: generate_draft
    provider: claude-api
    fallback: gpt-4o
    temperature: 0.7
    max_tokens: varies

  - step: validate_output
    checks:
      - no_forbidden_words
      - brand_voice_alignment
      - grammar_spelling
      - length_requirements
      - cta_present

  - step: content_moderation
    delegate: content-moderate task

  - step: human_review
    required: true
    reviewer: copywriter
    criteria:
      - brand_voice_consistency
      - factual_accuracy
      - tone_appropriateness
      - cta_effectiveness
      - creativity

  - step: log_generation
    include:
      - prompt_version
      - tokens_used
      - cost
      - quality_score
```

## Prompt Template Structure

```yaml
prompt_template:
  system: |
    You are a brand copywriter for {client_name}.
    Brand personality: {personality_adjectives}
    Voice pillars: {voice_pillars}
    Tone for this channel: {tone_spectrum_value}

    APPROVED vocabulary: {approved_words}
    FORBIDDEN vocabulary: {forbidden_words}

  user: |
    Create a {content_type} about {topic}.

    Target audience: {target_audience}
    Goal: {content_goal}
    Key message: {key_message}

    Follow the {framework} framework.
```

## Quality Scoring

```yaml
quality_dimensions:
  brand_voice: 1-5
  factual_accuracy: 1-5
  tone_appropriateness: 1-5
  cta_effectiveness: 1-5
  creativity: 1-5

thresholds:
  auto_approve: average >= 4.5
  human_review: average >= 3.5
  reject: average < 3.5
```

## Pre-Conditions

- [ ] Brand profile and voice guide available
- [ ] Content brief provided
- [ ] API credits available

## Post-Conditions

- [ ] Copy generated and stored
- [ ] Quality score recorded
- [ ] Generation logged for cost tracking

## Acceptance Criteria

- [ ] No forbidden words in output
- [ ] Voice consistent with guide
- [ ] Human review completed
- [ ] Client approved (if client-facing)

## Quality Gate

- Threshold: >70%
- Copy follows HCEA framework (Hook, Context, Entrega, Action)
- Brand voice consistent with voice guide
- Content moderation passed with no flagged items

---
*Branding Squad Task - ai-orchestrator*
