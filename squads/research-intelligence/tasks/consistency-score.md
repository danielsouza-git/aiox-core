# consistency-score

```yaml
task:
  id: consistency-score
  name: Brand Consistency Score
  agent: brand-auditor
  squad: research-intelligence
  type: scoring
  elicit: true

inputs:
  required:
    - brand: "Brand to score"
    - touchpoint_audit: "Touchpoint audit data (or run touchpoint-audit first)"
  optional:
    - brand_guidelines: "Existing brand guidelines"
    - previous_score: "Previous consistency score for comparison"
    - weight_overrides: "Custom dimension weights"
    - industry_benchmarks: "Industry benchmark scores"

outputs:
  - consistency-score.md: "Detailed consistency score report"
  - score-breakdown.md: "Per-dimension score breakdown"
  - trend-analysis.md: "Score trend over time (if previous data)"
  - improvement-roadmap.md: "Prioritized improvement roadmap"

pre_conditions:
  - "Touchpoint audit complete (or sufficient data available)"
  - "Brand guidelines documented"

post_conditions:
  - "Overall score calculated (0-100)"
  - "Per-dimension scores provided"
  - "Weakest areas identified"
  - "Improvement roadmap created"
```

## Purpose

Calculate a quantified brand consistency score (0-100) based on a weighted assessment across multiple dimensions, providing a single actionable metric for brand health tracking over time.

## Workflow

### Phase 1: Data Preparation (10 min)
1. Gather touchpoint audit data
2. Confirm dimension weights
3. Load brand guidelines as reference
4. Load previous score (if available)

### Phase 2: Dimension Scoring (30 min)

Score each dimension 0-100:

**1. Visual Consistency (25%)**
- Logo usage compliance across touchpoints
- Color palette adherence
- Typography consistency
- Imagery style alignment
- Layout pattern consistency
- Dark mode consistency (palette, logo variants, contrast, imagery adaptation across all dark-mode-enabled touchpoints)

**2. Voice & Tone Consistency (20%)**
- Messaging alignment with brand voice
- Vocabulary usage (approved vs. forbidden words)
- Tone consistency across channels
- Tagline and value prop consistency
- Content style adherence

**3. Experience Consistency (20%)**
- UX pattern consistency
- Interaction quality uniformity
- Service quality across channels
- Response time consistency
- Error handling brand alignment

**4. Channel Alignment (20%)**
- Cross-channel message coherence
- Visual bridge between channels
- Audience targeting consistency
- Content repurpose quality
- Channel-specific adaptation quality

**5. Guideline Adherence (15%)**
- Clear space and sizing rules followed
- Approved asset usage
- Template compliance
- Naming convention adherence
- Documentation completeness

### Phase 3: Score Calculation (10 min)
1. Calculate weighted score per dimension
2. Calculate overall score
3. Determine rating band
4. Compare to previous score (if available)
5. Compare to industry benchmark (if available)

### Phase 4: Gap Analysis (10 min)
1. Identify lowest-scoring dimensions
2. Map specific touchpoints dragging scores down
3. Identify patterns in failures
4. Quantify improvement potential

### Phase 5: Improvement Roadmap (15 min)
1. Rank improvements by score impact
2. Estimate effort for each improvement
3. Create phased improvement plan
4. Define target score for each phase
5. Set review cadence

## Score Report Template

```markdown
# Brand Consistency Score: [Brand]

## Overall Score

# [XX] / 100 — [Rating]

| Rating Band | Score Range | Meaning |
|-------------|------------|---------|
| Excellent | 90-100 | Highly consistent, industry-leading |
| Good | 75-89 | Strong consistency, minor gaps |
| Fair | 60-74 | Noticeable inconsistencies |
| Poor | 40-59 | Significant fragmentation |
| Critical | 0-39 | Urgent realignment needed |

## Dimension Breakdown

| Dimension | Weight | Score | Weighted | Status |
|-----------|--------|-------|----------|--------|
| Visual Consistency | 25% | [X]/100 | [X] | [Status] |
| Voice & Tone | 20% | [X]/100 | [X] | [Status] |
| Experience Consistency | 20% | [X]/100 | [X] | [Status] |
| Channel Alignment | 20% | [X]/100 | [X] | [Status] |
| Guideline Adherence | 15% | [X]/100 | [X] | [Status] |
| **Overall** | **100%** | | **[X]/100** | **[Rating]** |

## Score Visualization

```
Visual Consistency    [========--------] 80/100
Voice & Tone         [======----------] 65/100
Experience           [========---------] 72/100
Channel Alignment    [======-----------] 58/100
Guideline Adherence  [=========-------] 85/100
                     0    25    50    75   100
```

## Trend (if previous data available)

| Period | Score | Change | Trend |
|--------|-------|--------|-------|
| [Previous] | [X] | - | - |
| [Current] | [X] | [+/-X] | [Up/Down/Stable] |

## Weakest Areas

| Rank | Area | Score | Root Cause | Impact |
|------|------|-------|------------|--------|
| 1 | [Area] | [X] | [Why it's low] | [Customer impact] |
| 2 | [Area] | [X] | [Why it's low] | [Customer impact] |
| 3 | [Area] | [X] | [Why it's low] | [Customer impact] |

## Improvement Roadmap

### Phase 1: Quick Wins (Target: +[X] points)
Timeline: 0-30 days
1. [Action] -> Expected impact: +[X] on [Dimension]

### Phase 2: Systematic Fixes (Target: +[X] points)
Timeline: 30-90 days
1. [Action] -> Expected impact: +[X] on [Dimension]

### Phase 3: Strategic Alignment (Target: +[X] points)
Timeline: 90-180 days
1. [Action] -> Expected impact: +[X] on [Dimension]

### Target Score: [X]/100 by [Date]

## Methodology Notes
- Scoring based on [X] touchpoints across [X] channels
- Weights reflect typical brand impact distribution
- Scores are assessor ratings validated against evidence
- Recalculation recommended every [X] months
```

## Acceptance Criteria

- [ ] Overall score calculated (0-100)
- [ ] All 5 dimensions scored individually (Visual includes dark mode sub-assessment)
- [ ] Dark mode consistency evaluated within Visual Consistency dimension
- [ ] Weights applied correctly
- [ ] Rating band assigned
- [ ] Top 3 weakest areas identified with root causes
- [ ] Improvement roadmap with phases and targets
- [ ] Trend comparison (if previous data available)
- [ ] Methodology documented

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Score geral calculado (0-100) | 100% | Sim |
| 5 dimensoes pontuadas individualmente | 100% | Sim |
| Dark mode avaliado dentro de Visual Consistency | 100% | Sim |
| Pesos aplicados corretamente | 100% | Sim |
| Top 3 areas fracas com root causes | 100% | Sim |
| Improvement roadmap com fases e targets | >70% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
