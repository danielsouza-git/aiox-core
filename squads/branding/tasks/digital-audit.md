# digital-audit

```yaml
task: digitalAudit()
agent: brand-strategist
squad: branding
prd_refs: [FR-10.1, FR-10.2, FR-10.3, FR-10.4, FR-10.5]

inputs:
  - name: client_name
    type: string
    required: true
  - name: urls
    type: object
    required: true
    schema:
      website: string
      linkedin: string
      instagram: string
      facebook: string
      youtube: string
      tiktok: string
      twitter: string

outputs:
  - name: audit_report
    type: markdown
    destination: .aiox/branding/{client}/audit-report.md
  - name: ai_drafts
    type: object
    destination: .aiox/branding/{client}/ai-drafts/

tools:
  - ai-orchestrator
  - web-scraper
```

## Purpose

Analyze client's existing digital presence to generate AI-assisted drafts and identify improvement opportunities before brand discovery workshop.

## Workflow

### Phase 1: URL Collection
```yaml
steps:
  - collect_public_urls
  - validate_accessibility
  - flag_private_content
```

### Phase 2: Automated Analysis
```yaml
analyze:
  - positioning:
      description: Current perceived market position
      confidence: high|medium|low
  - tone_of_voice:
      description: Communication style analysis
      samples: string[]
  - messaging_consistency:
      description: Cross-channel message alignment
      score: 1-10
  - visual_consistency:
      description: Colors, typography, imagery style
      patterns: object
  - improvement_opportunities:
      description: Gaps and enhancement areas
      priority: high|medium|low
  - competitive_gaps:
      description: Differentiators vs competitors
```

### Phase 3: AI Draft Generation
```yaml
drafts:
  - voice_guide_draft:
      label: "AI Draft - Requires Human Validation"
      source: existing content tone
  - messaging_framework_draft:
      label: "AI Draft - Requires Human Validation"
      source: existing value propositions
  - moodboard_direction_draft:
      label: "AI Draft - Requires Human Validation"
      source: existing visual patterns
```

### Phase 4: Report Generation
```yaml
report_sections:
  - executive_summary
  - current_state_analysis
  - channel_by_channel_breakdown
  - improvement_recommendations
  - discovery_workshop_focus_areas
```

## Confidence Levels

All inferences include confidence indicators:

| Level | Criteria |
|-------|----------|
| **High** | Multiple consistent sources, recent content, clear patterns |
| **Medium** | Some sources available, moderate consistency |
| **Low** | Limited sources, outdated content, conflicting signals |

## Graceful Degradation

Handle incomplete/inconsistent content:
- Flag data quality issues
- Indicate confidence levels
- Highlight conflicts between current and desired positioning
- Recommend workshop focus areas based on gaps

## Pre-Conditions

- [ ] At least 2 public URLs provided
- [ ] URLs are accessible (not private/authenticated)

## Post-Conditions

- [ ] audit-report.md generated
- [ ] AI drafts clearly labeled as requiring validation
- [ ] Confidence levels included for all inferences

## Acceptance Criteria

- [ ] Report covers all provided channels
- [ ] No AI inference presented as fact
- [ ] Workshop focus areas identified
- [ ] Client briefed on draft nature of outputs

## Quality Gate

- Threshold: >70%
- All provided digital presence URLs analyzed and scored
- Audit report includes strengths, weaknesses, and opportunity gaps
- Recommendations actionable and linked to discovery findings

---
*Branding Squad Task - brand-strategist*
