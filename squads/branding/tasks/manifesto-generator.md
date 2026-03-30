# manifesto-generator

```yaml
task: manifestoGenerator()
agent: brand-strategist
squad: branding
prd_refs: [FR-1.9, FR-1.10]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: voice_guide
    type: VoiceGuide
    required: true

outputs:
  - name: manifesto
    type: markdown
    destination: .aiox/branding/{client}/manifesto.md
  - name: taglines
    type: yaml
    destination: .aiox/branding/{client}/taglines.yaml
  - name: value_proposition
    type: markdown
    destination: .aiox/branding/{client}/value-proposition.md

tools:
  - ai-orchestrator
```

## Purpose

Generate Brand Manifesto using Belief-Bridge-Bold framework and 5-10 tagline options using proven creation formulas.

## Manifesto Structure (1 page)

### Belief-Bridge-Bold Framework

```yaml
manifesto:
  belief:
    description: "What we believe about the world"
    format: 2-3 sentences
    tone: conviction

  bridge:
    description: "How our belief connects to action"
    format: 2-3 sentences
    tone: connection

  bold:
    description: "Our bold promise/commitment"
    format: 1-2 sentences
    tone: declaration
```

### Value Proposition Canvas

```yaml
value_proposition:
  headline:
    format: 5-10 words
    goal: immediate clarity

  sub_headline:
    format: 15-25 words
    goal: expand on headline

  benefit_bullets:
    count: 3
    format: outcome-focused

  anti_vp:
    description: "What we're NOT"
    format: contrast statement
```

## Tagline Generation

### 5 Creation Formulas

```yaml
formulas:
  - direct_benefit:
      pattern: "[Benefit] for [audience]"
      example: "Growth for ambitious brands"

  - metaphor:
      pattern: "[Brand] is your [metaphor]"
      example: "Your brand's north star"

  - contrast:
      pattern: "Not [old way], [new way]"
      example: "Not templates. Transformation."

  - provocation:
      pattern: "[Challenge assumption]"
      example: "Brands don't need logos. They need meaning."

  - identity:
      pattern: "For those who [identity]"
      example: "For those who build different"
```

### Output Format

```yaml
taglines:
  - tagline: string
    formula: string
    rationale: string
    recommended: boolean
  # 5-10 options total

final_selection:
  primary: string
  rationale: string
  usage_guidelines: string
```

## AI Generation Process

```yaml
steps:
  - step: analyze_inputs
    input: [brand_profile, voice_guide]
    output: manifesto_direction

  - step: generate_manifesto_draft
    prompt_template: manifesto-bbf-v1
    iterations: 2-3
    human_review: required

  - step: generate_value_proposition
    prompt_template: value-prop-canvas-v1
    human_review: required

  - step: generate_taglines
    prompt_template: taglines-5formulas-v1
    count: 10
    select: 5-10 best
    human_review: required

  - step: recommend_final
    criteria: [memorability, uniqueness, voice_alignment]
```

## Pre-Conditions

- [ ] Brand profile approved
- [ ] Voice guide completed
- [ ] Competitor taglines researched

## Post-Conditions

- [ ] Manifesto follows BBF framework
- [ ] 5-10 taglines generated
- [ ] Final recommendation provided

## Acceptance Criteria

- [ ] Manifesto fits 1 page
- [ ] Voice consistency with guide
- [ ] Taglines are unique (not copies of competitors)
- [ ] Client approved final selection

## Quality Gate

- Threshold: >70%
- Manifesto reflects brand archetypes and core values from discovery
- At least 3 tagline variants generated for client selection
- Tone consistent with brand voice guide

---
*Branding Squad Task - brand-strategist*
