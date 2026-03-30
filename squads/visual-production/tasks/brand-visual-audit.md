# brand-visual-audit

```yaml
task:
  id: brand-visual-audit
  name: Brand Visual Audit
  agent: art-director
  squad: visual-production
  type: audit
  elicit: true

inputs:
  required:
    - asset_sources: "Locations of visual assets to audit (folders, URLs, CDN)"
    - brand_guidelines: "Brand guidelines or style guide"
  optional:
    - audit_scope: "full, channel-specific, or category-specific"
    - previous_audit: "Previous audit report for trend comparison"

outputs:
  - visual-audit-report.md: "Comprehensive audit report"
  - consistency-matrix.md: "Cross-channel consistency analysis"
  - improvement-roadmap.md: "Prioritized improvement plan"
  - asset-inventory.md: "Complete asset inventory with status"

pre_conditions:
  - "Asset sources accessible"
  - "Brand guidelines available for comparison"

post_conditions:
  - "All assets inventoried and categorized"
  - "Consistency gaps identified across channels"
  - "Prioritized improvement roadmap created"
  - "Quick wins and long-term fixes documented"
```

## Purpose

Conduct a comprehensive audit of all existing visual assets across channels to identify consistency gaps, quality issues, and areas for improvement.

## Workflow

### Phase 1: Asset Discovery (15 min)
1. Scan all provided asset sources
2. Create complete inventory: filename, type, dimensions, format
3. Categorize assets by channel (web, social, email, print)
4. Tag assets by age (current, outdated, unknown)

### Phase 2: Consistency Analysis (20 min)
Evaluate cross-channel consistency:

**Color Consistency:**
- Compare color usage across channels
- Identify palette drift or unauthorized colors
- Check color reproduction across formats

**Typography Consistency:**
- Verify font usage across assets
- Check hierarchy application
- Identify unauthorized typefaces

**Imagery Consistency:**
- Compare photography/illustration styles
- Check subject treatment alignment
- Evaluate quality variation

**Layout Consistency:**
- Compare composition patterns
- Check logo placement consistency
- Evaluate whitespace usage

### Phase 3: Quality Assessment (15 min)
For each asset evaluate:
- Resolution adequacy for intended use
- Format appropriateness (WebP for web, etc.)
- File size optimization
- Metadata completeness
- Accessibility (alt text, contrast)

### Phase 4: Gap Identification (10 min)
1. Map required assets vs. available assets
2. Identify missing asset types per channel
3. Flag outdated assets needing refresh
4. Note duplicate or redundant assets

### Phase 5: Improvement Roadmap (10 min)
1. **Quick Wins** - Fix in 1-2 days (format conversion, metadata)
2. **Short Term** - Fix in 1-2 weeks (color correction, resizing)
3. **Medium Term** - Fix in 1 month (reshoot, redesign)
4. **Long Term** - Systemic improvements (new guidelines, automation)

## Elicitation Questions

```yaml
elicit:
  - question: "What is the scope of this audit?"
    options:
      - "Full audit - all channels and asset types"
      - "Web only - website and landing pages"
      - "Social only - all social platforms"
      - "Campaign-specific - particular campaign assets"

  - question: "What is the primary concern?"
    options:
      - "Brand consistency across channels"
      - "Asset quality and resolution"
      - "Missing assets for upcoming campaign"
      - "General health check"
```

## Acceptance Criteria

- [ ] Complete asset inventory created
- [ ] Consistency analysis across all channels
- [ ] Quality assessment per asset category
- [ ] Gaps and missing assets identified
- [ ] Prioritized improvement roadmap delivered
- [ ] Quick wins clearly marked for immediate action

## Quality Gate
- Threshold: >70%
- Complete asset inventory with categorization and status
- Cross-channel consistency gaps identified and documented
- Prioritized improvement roadmap with quick wins marked

---
*Visual Production Squad Task*
