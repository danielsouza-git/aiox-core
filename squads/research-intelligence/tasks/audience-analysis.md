# audience-analysis

```yaml
task:
  id: audience-analysis
  name: Deep Audience Analysis
  agent: market-researcher
  squad: research-intelligence
  type: research
  elicit: true

inputs:
  required:
    - product_service: "Product or service being offered"
    - current_audience: "Description of current audience (if any)"
    - num_segments: "Number of audience segments to create (2-6)"
  optional:
    - existing_personas: "Current personas to refine"
    - analytics_data: "Google Analytics or similar data"
    - survey_data: "Customer survey results"
    - social_data: "Social media audience insights"
    - industry: "Industry vertical"

outputs:
  - audience-analysis.md: "Complete audience analysis report"
  - personas.md: "Detailed audience personas"
  - journey-maps.md: "Buyer journey per segment"
  - pain-points.md: "Prioritized pain points matrix"

pre_conditions:
  - "Product/service clearly defined"
  - "Target segment count decided"

post_conditions:
  - "Personas include demographics and psychographics"
  - "Pain points ranked by severity"
  - "Buyer journey mapped per segment"
  - "Language patterns documented"
```

## Purpose

Deliver deep audience analysis with actionable personas, psychographic profiles, pain point mapping, and buyer journey documentation. Output feeds directly into brand strategy, copy creation, and positioning.

## Workflow

### Phase 1: Data Collection (15 min)
1. Gather existing audience data (analytics, surveys, CRM)
2. Research industry audience benchmarks
3. Analyze competitor audiences
4. Review social media audience signals
5. Identify data gaps

### Phase 2: Segmentation (20 min)
1. Identify distinct audience segments
2. Define segmentation criteria:
   - **Demographic:** Age, gender, income, education, location
   - **Psychographic:** Values, interests, lifestyle, personality
   - **Behavioral:** Purchase patterns, brand interactions, channel preferences
   - **Needs-based:** Problems to solve, goals to achieve
3. Size each segment (relative %)
4. Prioritize segments by opportunity

### Phase 3: Persona Development (30 min)
Per segment, create a detailed persona:
1. Name and visual description
2. Demographics profile
3. Psychographic profile
4. Goals and motivations
5. Pain points and frustrations
6. Information sources and influences
7. Buying behavior and triggers
8. Objections and barriers
9. Preferred channels
10. Language and vocabulary patterns

### Phase 4: Pain Point Mapping (15 min)
1. List all identified pain points
2. Rank by severity (1-5) and frequency (1-5)
3. Map pain points to segments
4. Identify shared vs. segment-specific pain points
5. Note language customers use to describe pain

### Phase 5: Buyer Journey Mapping (20 min)
Per segment, map the journey:
1. **Awareness** - How they discover solutions
2. **Consideration** - How they evaluate options
3. **Decision** - What triggers the purchase
4. **Post-Purchase** - Retention and advocacy patterns

### Phase 6: Synthesis (15 min)
1. Cross-reference findings
2. Identify highest-value segments
3. Document language patterns for copy team
4. Create actionable recommendations

## Persona Template

```markdown
# Persona: [Name]

## Demographics
- **Age:** [Range]
- **Gender:** [M/F/All]
- **Income:** [Range]
- **Education:** [Level]
- **Location:** [Type]
- **Occupation:** [Role/Industry]

## Psychographics
- **Values:** [Top 3 values]
- **Interests:** [Key interests]
- **Lifestyle:** [Description]
- **Personality:** [Traits]

## Goals & Motivations
1. [Primary goal]
2. [Secondary goal]
3. [Emotional motivation]

## Pain Points
| Pain Point | Severity (1-5) | Frequency (1-5) | Their Words |
|------------|-----------------|------------------|-------------|
| [Pain 1] | [X] | [X] | "[How they describe it]" |
| [Pain 2] | [X] | [X] | "[How they describe it]" |

## Buying Behavior
- **Research style:** [How they research]
- **Decision timeline:** [Fast/Medium/Slow]
- **Key influencers:** [Who influences them]
- **Objections:** [Common objections]
- **Trigger events:** [What prompts action]

## Channels
- **Primary:** [Top 2-3 channels]
- **Content preference:** [Video/Text/Audio]
- **Social platforms:** [Which ones]

## Language Patterns
- **Vocabulary:** [Words they use]
- **Tone they respond to:** [Formal/Casual/Expert]
- **Phrases that resonate:** ["Key phrases"]
```

## Acceptance Criteria

- [ ] [X] audience segments defined with sizing
- [ ] Detailed persona for each segment
- [ ] Demographics and psychographics included
- [ ] Pain points ranked by severity and frequency
- [ ] Buyer journey mapped per segment
- [ ] Language patterns documented
- [ ] Actionable recommendations provided
- [ ] Data sources cited

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Segmentos com demographics e psychographics | 100% dos segmentos | Sim |
| Pain points ranqueados por severidade e frequencia | >70% coverage | Sim |
| Buyer journey mapeado por segmento | 100% dos segmentos | Sim |
| Language patterns documentados | >70% dos segmentos | Sim |
| Fontes de dados citadas | 100% | Sim |
| Completude do output | 100% | Sim |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Research Intelligence Squad Task*
