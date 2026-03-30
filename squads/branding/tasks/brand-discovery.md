# brand-discovery

```yaml
task: brandDiscovery()
agent: brand-strategist
squad: branding
prd_refs: [FR-1.1, FR-8.2]

inputs:
  - name: client_name
    type: string
    required: true
  - name: mode
    type: enum
    values: [standard, audit-assisted]
    default: standard

outputs:
  - name: brand_profile
    type: BrandProfile
    destination: .aiox/branding/{client}/brand-profile.yaml
  - name: discovery_report
    type: markdown
    destination: .aiox/branding/{client}/discovery-report.md

tools:
  - ai-orchestrator
  - clickup
```

## Purpose

Execute Brand Discovery Workshop capturing brand personality, visual preferences, existing assets, competitors, and deliverable selection.

## Execution Modes

### Standard Mode (15min questionnaire)
- Company basics
- Brand personality (5-point scales)
- Visual preferences (mood selection)
- Asset upload
- Competitor URLs
- Deliverable selection

### Audit-Assisted Mode
- Client provides existing digital presence URLs
- System performs automated analysis before workshop
- Workshop focuses on gaps identified in audit

## Workflow

### Phase 1: Intake (15min)
```yaml
steps:
  - step: company_basics
    fields: [name, industry, size, target_audience]
  - step: brand_personality
    fields: [personality_scales_5x5, archetypes, values]
  - step: visual_preferences
    fields: [mood_selection, color_preferences, style_direction]
  - step: competitor_analysis
    fields: [competitor_urls_3_5, differentiation_goals]
  - step: deliverable_selection
    fields: [tier, add_ons, timeline_preference]
```

### Phase 2: AI Analysis (30min automated)
```yaml
steps:
  - analyze_competitors
  - generate_positioning_recommendations
  - draft_personality_profile
  - identify_differentiation_opportunities
```

### Phase 3: Human Review (45min internal)
```yaml
steps:
  - review_ai_outputs
  - refine_recommendations
  - prepare_client_presentation
```

### Phase 4: Client Approval (30min)
```yaml
steps:
  - present_brand_direction
  - collect_feedback
  - finalize_brand_profile
```

## Output Schema

```yaml
BrandProfile:
  client:
    name: string
    industry: string
    target_audience: string[]
  personality:
    archetypes: string[]  # 1-2 primary
    traits: object  # 5-point scales
    values: string[]  # 3-5 core values
  visual_direction:
    mood: string[]  # from selection
    color_preferences: string[]
    style: string  # modern/classic/bold/minimal
  competitors:
    urls: string[]
    differentiation: string[]
  deliverables:
    tier: number  # 1, 2, or 3
    add_ons: string[]
```

## Pre-Conditions

- [ ] Client contact information available
- [ ] ClickUp project created
- [ ] Intake form/questionnaire ready

## Post-Conditions

- [ ] brand-profile.yaml saved
- [ ] discovery-report.md generated
- [ ] ClickUp task updated with status

## Acceptance Criteria

- [ ] All mandatory fields captured
- [ ] Competitor URLs validated (accessible)
- [ ] Client approved brand direction
- [ ] Profile ready for token-engineer handoff

## Quality Gate

- Threshold: >70%
- All mandatory brand profile fields captured and validated
- Competitor URLs accessible and analyzed
- Client approved brand direction before handoff to token-engineer

---
*Branding Squad Task - brand-strategist*
