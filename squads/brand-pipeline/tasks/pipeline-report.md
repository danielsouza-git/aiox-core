# Pipeline Report

Generate a final delivery report for a completed brand pipeline.

## Metadata

| Field | Value |
|-------|-------|
| **Agent** | brand-orchestrator (Maestro) |
| **Squad** | brand-pipeline |
| **Elicit** | true |
| **Mode** | yolo |

## Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `client_name` | string | YES | - | Client or brand name |

## Outputs

| Output | Location | Description |
|--------|----------|-------------|
| `delivery-report.md` | `.aiox/branding/{client}/delivery-report.md` | Comprehensive delivery report |

## Steps

### Step 1: Load Pipeline Data

1. Validate `client_name` is provided (elicit if missing)
2. Read `.aiox/branding/{client}/pipeline-state.yaml`
3. If pipeline not completed, warn: "Pipeline is {status}. Report will reflect partial completion."

### Step 2: Generate Report Header

```markdown
# Brand Pipeline Delivery Report

| Field | Value |
|-------|-------|
| **Client** | {client_name} |
| **Date** | {current_date} |
| **Pipeline Mode** | {mode} |
| **Status** | {status} |
| **Started** | {started_at} |
| **Completed** | {completed_at} |
| **Total Duration** | {duration} |
```

### Step 3: Generate Per-Phase Summary

For each phase, include:

```markdown
## Phase {N}: {Phase Name}

| Aspect | Detail |
|--------|--------|
| **Status** | {status} |
| **Squad** | {squad_name} |
| **Lead Agent** | {agent_name} |
| **Duration** | {duration} |
| **Gate Score** | {score}/8 |

### Deliverables
- {output_1}: {description}
- {output_2}: {description}
```

### Step 4: Generate Deliverables Inventory

Compile all outputs across all phases:

```markdown
## Deliverables Inventory

### Research
- [ ] Market Report
- [ ] Competitive Analysis
- [ ] Trend Report
- [ ] Audience Personas

### Discovery
- [ ] Brand Profile
- [ ] Voice Guide
- [ ] Brand Manifesto
- [ ] Moodboard
- [ ] Color Palette
- [ ] Typography System
- [ ] Design Tokens

### Design System
- [ ] CSS Variables
- [ ] Tailwind Config
- [ ] SCSS Variables
- [ ] Component Library
- [ ] Component Variants
- [ ] Component Documentation

### Visual Assets
- [ ] Visual Direction Document
- [ ] Generated Images
- [ ] Retouched Images
- [ ] Motion Assets
- [ ] Organized Asset Library

### Content
- [ ] Copy Strategy
- [ ] Landing Page Copy
- [ ] Social Media Posts
- [ ] SEO Meta Tags
- [ ] Email Sequences

### QA Reports
- [ ] Visual QA Report
- [ ] WCAG Compliance Report
- [ ] Brand Compliance Report
- [ ] Lighthouse Performance Report
```

Check each item based on whether the output file exists.

### Step 5: Generate Quality Scores

```markdown
## Quality Scores

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| Phase Gate Average | {avg}/8 | >=7 | {pass/fail} |
| Brand Compliance | {score}% | >=90% | {pass/fail} |
| WCAG AA Compliance | {status} | Pass | {pass/fail} |
| Lighthouse Performance | {score} | >=80 | {pass/fail} |
| Deliverables Complete | {count}/{total} | 100% | {pass/fail} |
```

### Step 6: Generate Recommendations

Based on pipeline results, provide:

```markdown
## Recommendations

### Immediate Actions
1. {action based on any failed checks}

### Next Steps
1. Deploy design system to production
2. Schedule social media content calendar
3. Launch email sequences
4. Monitor analytics post-launch

### Maintenance
1. Quarterly brand compliance review
2. Monthly content refresh cycle
3. Annual brand refresh assessment
```

### Step 7: Save Report

1. Write `delivery-report.md` to `.aiox/branding/{client}/delivery-report.md`
2. Display summary:
   - Total deliverables count
   - Overall quality score
   - Report file path
3. Log: "Delivery report generated for {client_name}"

## Quality Gate

- Threshold: >70%
- All phase summaries include accurate status, duration, and gate scores
- Deliverables inventory reflects actual file existence (checked, not assumed)
- Quality scores section covers all metrics (gate average, compliance, WCAG, Lighthouse, completeness)

---
*Brand Pipeline Task*
