# positioning-map

```yaml
task:
  id: positioning-map
  name: Create Positioning Map
  agent: competitive-analyst
  squad: research-intelligence
  type: analysis
  elicit: true

inputs:
  required:
    - brand: "Brand to position"
    - competitors: "5-10 competitors to map"
    - axis_candidates: "Potential axes for the map"
  optional:
    - competitive_audit: "Existing competitive audit data"
    - brand_strategy: "Existing brand strategy"
    - audience_data: "Audience research data"
    - market_data: "Market sizing data"

outputs:
  - positioning-map.md: "Positioning map with analysis"
  - white-space-analysis.md: "White space opportunities"
  - positioning-strategy.md: "Recommended positioning strategy"

pre_conditions:
  - "Competitor data available"
  - "Differentiation axes identified"

post_conditions:
  - "2D map created with all players"
  - "White space identified"
  - "Positioning recommendation provided"
```

## Purpose

Create a strategic 2D positioning map that visualizes where the brand and competitors sit relative to key differentiators, revealing white space opportunities and informing positioning strategy.

## Workflow

### Phase 1: Axis Selection (15 min)
1. Brainstorm 6-8 potential axes:
   - Price (Low to Premium)
   - Quality (Basic to Luxury)
   - Innovation (Traditional to Cutting-edge)
   - Service (Self-serve to High-touch)
   - Audience (Mass market to Niche)
   - Complexity (Simple to Enterprise)
   - Brand personality (Serious to Playful)
   - Geographic scope (Local to Global)
2. Evaluate each axis:
   - Does it represent a real customer decision factor?
   - Does it differentiate the competitive set?
   - Can we reliably place competitors on it?
3. Select 2 axes that create the most strategic insight
4. Consider creating 2-3 maps with different axis combinations

### Phase 2: Competitor Placement (20 min)
1. Rate each competitor on both axes (1-10 scale)
2. Document evidence for each rating
3. Place brand on the same scale
4. Validate placements against known data
5. Note any competitors that are difficult to place

### Phase 3: Map Creation (15 min)
1. Create the 2x2 grid with labeled axes
2. Place all competitors as points
3. Size points by market share or relevance (optional)
4. Label quadrants with descriptive names
5. Highlight clusters and empty spaces

### Phase 4: White Space Analysis (15 min)
1. Identify empty quadrants or sparse areas
2. Assess viability of each white space:
   - Is there demand in this position?
   - Is the position defensible?
   - Does it align with brand capabilities?
3. Rank white spaces by attractiveness
4. Note risks of each position

### Phase 5: Positioning Recommendation (15 min)
1. Recommend optimal position for the brand
2. Justify with audience data and capability fit
3. Define positioning statement
4. Identify necessary brand attributes for the position
5. Note required messaging shifts

## Positioning Map Template

```markdown
# Positioning Map: [Industry/Category]

## Axis Definition

**X-Axis:** [Axis Name]
- Left: [Low end descriptor]
- Right: [High end descriptor]
- Why: [Why this axis matters to customers]

**Y-Axis:** [Axis Name]
- Bottom: [Low end descriptor]
- Top: [High end descriptor]
- Why: [Why this axis matters to customers]

## Competitor Ratings

| Brand | X-Axis (1-10) | Y-Axis (1-10) | Evidence |
|-------|----------------|----------------|----------|
| [Brand] | [X] | [Y] | [Why this rating] |
| [Comp 1] | [X] | [Y] | [Why this rating] |
| [Comp 2] | [X] | [Y] | [Why this rating] |

## Map Visualization

```
              HIGH [Y-Axis Label]
                    |
    Q2              |              Q1
    [Label]         |         [Label]
                    |
         [Comp A]   |    [Comp B]
                    |          [Comp C]
  LOW ----[Brand]---|--------------------> HIGH
  [X-Axis]          |          [Comp D]
                    |
    Q3              |              Q4
    [Label]         |         [Label]
         [Comp E]   |
                    |
              LOW [Y-Axis Label]
```

## Quadrant Analysis

| Quadrant | Position | Players | Characteristics |
|----------|----------|---------|-----------------|
| Q1 (Top-Right) | [Label] | [Who's here] | [What defines this position] |
| Q2 (Top-Left) | [Label] | [Who's here] | [What defines this position] |
| Q3 (Bottom-Left) | [Label] | [Who's here] | [What defines this position] |
| Q4 (Bottom-Right) | [Label] | [Who's here] | [What defines this position] |

## White Space Analysis

| White Space | Location | Demand | Viability | Risk | Score |
|-------------|----------|--------|-----------|------|-------|
| [Space 1] | [Quadrant] | H/M/L | H/M/L | H/M/L | [X]/10 |
| [Space 2] | [Quadrant] | H/M/L | H/M/L | H/M/L | [X]/10 |

## Recommended Position

**Target Position:** [X], [Y] on the map

**Positioning Statement:**
For [target audience] who [need/want], [Brand] is the [category] that [key differentiator] because [reason to believe].

**Required Brand Attributes:**
- [Attribute 1]
- [Attribute 2]
- [Attribute 3]

**Messaging Implications:**
- [What to emphasize]
- [What to de-emphasize]
- [Key proof points needed]
```

## Acceptance Criteria

- [ ] Meaningful axes selected with justification
- [ ] All competitors rated with evidence
- [ ] 2D positioning map created
- [ ] Quadrants labeled and analyzed
- [ ] White spaces identified and scored
- [ ] Positioning recommendation provided
- [ ] Positioning statement drafted
- [ ] Required brand attributes defined

---
*Research Intelligence Squad Task*
