# brand-perception-audit

```yaml
task:
  id: brand-perception-audit
  name: Brand Perception Audit
  agent: brand-auditor
  squad: research-intelligence
  type: audit
  elicit: true

inputs:
  required:
    - brand: "Brand to audit"
    - intended_perception: "How the brand intends to be perceived"
    - channels: "Channels to audit (web, social, email, etc.)"
  optional:
    - brand_guidelines: "Existing brand guidelines"
    - competitor_perceptions: "How competitors are perceived"
    - audience_feedback: "Customer feedback or survey data"
    - brand_values: "Core brand values"

outputs:
  - brand-perception-audit.md: "Complete perception audit report"
  - perception-gap.md: "Intended vs. actual perception gap analysis"
  - channel-breakdown.md: "Per-channel perception assessment"
  - action-plan.md: "Recommendations to close perception gaps"

pre_conditions:
  - "Intended brand perception documented"
  - "Channels to audit agreed"
  - "Brand guidelines available (if they exist)"

post_conditions:
  - "Actual perception documented per channel"
  - "Gaps between intended and actual quantified"
  - "Root causes identified"
  - "Action plan provided"
```

## Purpose

Audit how a brand is actually perceived versus how it intends to be perceived, identifying gaps across channels and providing an actionable plan to close them.

## Workflow

### Phase 1: Intended Perception Baseline (10 min)
1. Document the intended brand perception:
   - Brand personality attributes (3-5 adjectives)
   - Core values
   - Desired emotional response
   - Target positioning
2. Create a perception scorecard with target ratings
3. Establish the "ideal state" for comparison

### Phase 2: Channel-by-Channel Audit (40 min)
For each channel, assess actual perception:

**Website:**
1. First impression (5-second test)
2. Visual personality assessment
3. Messaging tone analysis
4. Trust signals present
5. Emotional response evoked

**Social Media:**
1. Profile consistency
2. Content tone and personality
3. Visual consistency
4. Community engagement style
5. Comment sentiment

**Email:**
1. Template design alignment
2. Subject line tone
3. Body copy voice
4. CTA style
5. Frequency and value perception

**Physical/Other:**
1. Packaging (if applicable)
2. Store presence
3. Printed materials
4. Customer service interactions
5. Partner/third-party representation

### Phase 3: Gap Analysis (20 min)
1. Score actual perception per channel per attribute
2. Calculate gap: Intended - Actual
3. Identify largest gaps
4. Map root causes for each gap
5. Prioritize gaps by impact

### Phase 4: Cross-Channel Consistency (15 min)
1. Compare perception across channels
2. Identify channels that deviate most
3. Note "halo" channels (strongest perception)
4. Note "drag" channels (weakest perception)
5. Assess overall brand coherence score

### Phase 5: Recommendations (15 min)
1. Prioritize gaps to close (impact vs. effort)
2. Create channel-specific action items
3. Recommend quick wins
4. Suggest long-term brand alignment initiatives
5. Define success metrics

## Perception Audit Template

```markdown
# Brand Perception Audit: [Brand]

## Intended Perception

| Attribute | Target Rating (1-10) | Description |
|-----------|---------------------|-------------|
| [Attribute 1] | [X] | [What it means for this brand] |
| [Attribute 2] | [X] | [What it means for this brand] |
| [Attribute 3] | [X] | [What it means for this brand] |
| [Attribute 4] | [X] | [What it means for this brand] |
| [Attribute 5] | [X] | [What it means for this brand] |

## Actual Perception by Channel

### Website
| Attribute | Actual (1-10) | Gap | Evidence |
|-----------|---------------|-----|----------|
| [Attr 1] | [X] | [+/-X] | [What we observed] |

### Social Media
| Attribute | Actual (1-10) | Gap | Evidence |
|-----------|---------------|-----|----------|
| [Attr 1] | [X] | [+/-X] | [What we observed] |

### Email
| Attribute | Actual (1-10) | Gap | Evidence |
|-----------|---------------|-----|----------|
| [Attr 1] | [X] | [+/-X] | [What we observed] |

## Gap Summary

| Attribute | Intended | Website | Social | Email | Avg Actual | Avg Gap |
|-----------|----------|---------|--------|-------|------------|---------|
| [Attr 1] | [X] | [X] | [X] | [X] | [X] | [+/-X] |

## Largest Gaps (Prioritized)

| Rank | Attribute | Channel | Gap | Root Cause | Impact |
|------|-----------|---------|-----|------------|--------|
| 1 | [Attr] | [Channel] | [X] | [Why] | H/M/L |

## Action Plan

### Quick Wins (0-30 days)
1. [Action] - [Channel] - [Expected impact]

### Medium-Term (30-90 days)
1. [Action] - [Channel] - [Expected impact]

### Long-Term (90+ days)
1. [Action] - [Channel] - [Expected impact]

## Success Metrics
- [Metric 1]: [Current] -> [Target]
- [Metric 2]: [Current] -> [Target]
```

## Acceptance Criteria

- [ ] Intended perception documented with target ratings
- [ ] All specified channels audited
- [ ] Actual perception scored per channel per attribute
- [ ] Gaps calculated and ranked
- [ ] Root causes identified for top gaps
- [ ] Cross-channel consistency assessed
- [ ] Action plan with quick wins and long-term items
- [ ] Success metrics defined

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Canais auditados com scores | 100% dos canais definidos | Sim |
| Gaps quantificados (intended vs actual) | >70% dos atributos | Sim |
| Root causes identificados para top gaps | >70% | Sim |
| Action plan com quick wins e long-term | 100% | Sim |
| Metricas de sucesso definidas | >70% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
