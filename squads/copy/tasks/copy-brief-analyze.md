# copy-brief-analyze

```yaml
task:
  id: copy-brief-analyze
  name: Analyze Copy Brief
  agent: copy-chief
  squad: copy
  type: analysis
  elicit: true

inputs:
  required:
    - client_brief: "Client requirements document or brief"
    - project_type: "Type of copy (landing page, email, ads, etc.)"
  optional:
    - brand_voice: "Existing brand voice guide"
    - competitors: "Competitor examples"
    - target_audience: "Audience profile"

outputs:
  - copy_analysis.md: "Detailed brief analysis"
  - audience_profile.md: "Target audience insights"
  - competitor_insights.md: "Competitor copy analysis"
  - strategic_recommendations.md: "Copy strategy recommendations"

pre_conditions:
  - "Client brief or requirements document provided"
  - "Project type clearly defined"

post_conditions:
  - "All key messaging extracted from brief"
  - "Target audience fully profiled"
  - "Competitive landscape understood"
  - "Strategic direction defined"
```

## Workflow

### Phase 1: Brief Extraction (5 min)
1. Read client brief thoroughly
2. Identify primary objective (sell, inform, engage)
3. Extract key messages and value propositions
4. Note constraints (word limits, tone, legal)

### Phase 2: Audience Analysis (10 min)
1. Define target audience demographics
2. Identify psychographics (fears, desires, motivations)
3. Map customer journey stage (awareness, consideration, decision)
4. Define awareness level (unaware, problem-aware, solution-aware, product-aware, most-aware)

### Phase 3: Competitive Intelligence (10 min)
1. Analyze competitor messaging
2. Identify messaging gaps and opportunities
3. Note successful patterns to leverage
4. Flag clichés to avoid

### Phase 4: Strategic Recommendations (5 min)
1. Recommend copy framework (AIDA, PAS, PASTOR, etc.)
2. Define primary angle (pain, desire, curiosity, proof)
3. Outline key hooks and headlines
4. Suggest tone adjustments

## Elicitation Questions

```yaml
elicit:
  - question: "What is the primary goal of this copy?"
    options:
      - "Generate leads/signups"
      - "Drive sales/purchases"
      - "Build brand awareness"
      - "Educate audience"
      - "Re-engage existing customers"

  - question: "Who is the target audience?"
    type: text
    hint: "Age, profession, pain points, desires"

  - question: "What is their awareness level?"
    options:
      - "Unaware - Don't know they have a problem"
      - "Problem-aware - Know the problem, not solutions"
      - "Solution-aware - Know solutions exist, not yours"
      - "Product-aware - Know your product, not convinced"
      - "Most-aware - Ready to buy, need final push"
```

## Acceptance Criteria

- [ ] All brief requirements extracted and documented
- [ ] Target audience profiled with psychographics
- [ ] At least 3 competitors analyzed
- [ ] Copy framework recommended with justification
- [ ] Primary angle and hooks defined
- [ ] Deliverables structured for next phase

## Quality Gate
- Threshold: >70%
- All brief requirements extracted with zero ambiguity
- Target audience profiled including psychographics (fears, desires, motivations)
- At least 3 competitor messaging patterns documented

---
*Copy Squad Task*
