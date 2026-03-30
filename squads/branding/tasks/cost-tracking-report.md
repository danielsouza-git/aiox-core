# cost-tracking-report

```yaml
task: costTrackingReport()
agent: ai-orchestrator
squad: branding
prd_refs: [NFR-4.2, NFR-6.1]

inputs:
  - name: client_id
    type: string
    required: true
  - name: period
    type: enum
    values: [daily, weekly, monthly, project]
    default: project

outputs:
  - name: cost_report
    type: markdown
    destination: .aiox/branding/{client}/reports/cost-report-{period}.md
  - name: cost_data
    type: json
    destination: .aiox/branding/{client}/reports/cost-data-{period}.json

tools:
  - analytics-aggregator
```

## Purpose

Track and report AI API costs per client project for margin monitoring and optimization.

## Cost Categories

```yaml
cost_categories:
  text_generation:
    providers: [claude-api, gpt-4o]
    tracking:
      - input_tokens
      - output_tokens
      - requests_count

  image_generation:
    providers: [flux-1.1-pro, dall-e-3]
    tracking:
      - images_generated
      - resolution

  voice_synthesis:
    providers: [elevenlabs]
    tracking:
      - characters_synthesized
      - voice_id

  other:
    providers: [replicate, mubert]
    tracking:
      - api_calls
      - compute_time
```

## Target Costs (NFR-4.2)

```yaml
budget_targets:
  total_per_project: $130-150

  breakdown:
    onboarding: $15
    brand_book: $45
    creatives_30_posts: $25
    video_3_videos: $20
    web_landing_page: $20
    email_5_templates: $5
```

## Data Collection

```yaml
log_schema:
  timestamp: datetime
  client_id: string
  operation: string
  provider: string
  model: string

  tokens:
    input: number
    output: number

  cost:
    amount: number
    currency: USD

  metadata:
    deliverable_type: string
    prompt_template_id: string
    success: boolean
```

## Report Structure

```markdown
# AI Cost Report: {client_name}

**Period:** {start_date} - {end_date}
**Project Tier:** {tier}

## Summary

| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| Total Cost | ${total} | $150 | ✅/⚠️/❌ |
| Text Generation | ${text} | $80 | |
| Image Generation | ${image} | $30 | |
| Voice Synthesis | ${voice} | $20 | |
| Other | ${other} | $20 | |

## Cost by Deliverable

| Deliverable | Cost | Expected | Variance |
|-------------|------|----------|----------|
| Brand Book | ${bb} | $45 | +/- |
| Social Posts | ${sp} | $25 | +/- |
| Landing Page | ${lp} | $20 | +/- |

## Provider Breakdown

### Claude API
- Requests: {count}
- Input Tokens: {input}
- Output Tokens: {output}
- Cost: ${cost}

### Flux 1.1 Pro
- Images: {count}
- Cost: ${cost}

## Optimization Recommendations

1. {recommendation_1}
2. {recommendation_2}

## Alerts

- ⚠️ {any_budget_overruns}
```

## Alerting

```yaml
alerts:
  budget_warning:
    threshold: 80% of budget
    action: notify_project_manager

  budget_exceeded:
    threshold: 100% of budget
    action: [notify_pm, pause_non_critical]

  anomaly_detection:
    method: >2 std_dev from average
    action: investigate
```

## Optimization Recommendations

```yaml
optimization_rules:
  - condition: image_cost > 40% of total
    recommendation: "Consider reusing successful prompts"

  - condition: text_regen_rate > 30%
    recommendation: "Review prompt templates for quality"

  - condition: cost_per_deliverable > 1.5x expected
    recommendation: "Audit generation workflow"
```

## Pre-Conditions

- [ ] Generation logs available
- [ ] Client project exists

## Post-Conditions

- [ ] Report generated
- [ ] Data aggregated
- [ ] Alerts triggered if needed

## Acceptance Criteria

- [ ] All costs tracked
- [ ] Budget comparison accurate
- [ ] Recommendations actionable
- [ ] Alerts configured

## Quality Gate

- Threshold: >70%
- All API calls tracked with provider, model, and cost
- Budget utilization percentage calculated against $200/month cap
- Alert generated if usage exceeds 80% threshold

---
*Branding Squad Task - ai-orchestrator*
