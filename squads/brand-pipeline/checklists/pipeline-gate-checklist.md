# Pipeline Gate Checklist

Phase gate checklist used between every phase of the brand pipeline.

**Items:** 8
**Used by:** brand-orchestrator (Maestro)
**Scoring:** PASS (>=7/8), CONDITIONAL (5-6/8), FAIL (<5/8)

## Checklist

- [ ] **Outputs Generated** -- All required outputs for this phase were generated successfully
- [ ] **Files Exist** -- Output files exist on disk and are non-empty (>0 bytes)
- [ ] **No Critical Errors** -- Phase execution logs contain no critical errors or unhandled exceptions
- [ ] **Quality Score Met** -- Quality score meets or exceeds the phase minimum threshold
- [ ] **Schema Conformance** -- Outputs conform to expected schema/format (JSON is valid, YAML parses, Markdown has required sections)
- [ ] **Brand Consistency** -- No brand consistency violations detected (colors match palette, fonts match typography, voice matches guide)
- [ ] **Duration Within Range** -- Phase completed within expected time range (not suspiciously fast or over timeout)
- [ ] **Dependencies Satisfied** -- All inputs required by the next phase are available and accessible

## Verdict Criteria

| Verdict | Score | Action |
|---------|-------|--------|
| **PASS** | >= 7/8 | Proceed to next phase |
| **CONDITIONAL** | 5-6/8 | Proceed with warnings logged; review failed items before final delivery |
| **FAIL** | < 5/8 | Retry phase once; if retry fails, HALT pipeline and escalate |

## Phase-Specific Minimum Scores

| Phase | Minimum Score | Rationale |
|-------|---------------|-----------|
| Research | 7/8 | Foundation data must be reliable |
| Discovery | 8/8 | Brand foundation is critical -- no shortcuts |
| Design System | 7/8 | Components must be functional |
| Visual | 7/8 | Assets must meet quality bar |
| Content | 7/8 | Copy must align with brand voice |
| QA | 8/8 | Final gate -- all quality standards must pass |

## Common Failure Patterns

1. **Missing outputs** -- Task completed but did not write expected files
2. **Empty files** -- Files created but contain no meaningful content
3. **Schema violation** -- JSON/YAML outputs do not match expected structure
4. **Brand drift** -- Colors, fonts, or voice deviated from brand profile
5. **Timeout** -- Phase exceeded expected duration (check for stuck tasks)

## Retry Policy

- **Auto-retry:** 1 attempt on FAIL
- **Retry scope:** Re-run entire phase (not individual tasks)
- **Retry logging:** Record retry in `pipeline-state.yaml` under `retry_log`
- **Post-retry FAIL:** Escalate to user with failure details

---
*Brand Pipeline Checklist*
