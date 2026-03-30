# Run Phase

Execute a single phase of the brand pipeline.

## Metadata

| Field | Value |
|-------|-------|
| **Agent** | brand-orchestrator (Maestro) |
| **Squad** | brand-pipeline |
| **Elicit** | true |
| **Mode** | yolo / interactive |

## Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `client_name` | string | YES | - | Client or brand name |
| `phase` | enum | YES | - | Phase to run: `research`, `discovery`, `design-system`, `visual`, `content`, `qa` |

## Outputs

| Output | Location | Description |
|--------|----------|-------------|
| `pipeline-state.yaml` | `.aiox/branding/{client}/pipeline-state.yaml` | Updated pipeline state |
| Phase-specific outputs | `.aiox/branding/{client}/{phase}/` | Deliverables from the phase |

## Steps

### Step 1: Validate Inputs

1. Validate `client_name` is provided (elicit if missing)
2. Validate `phase` is one of: `research`, `discovery`, `design-system`, `visual`, `content`, `qa`
3. If `phase` not provided, show numbered list of phases for selection

### Step 2: Check Prerequisites

1. Load pipeline state from `.aiox/branding/{client}/pipeline-state.yaml`
   - If state file does not exist, initialize from template
2. Check phase dependencies:

| Phase | Prerequisites |
|-------|---------------|
| research | None |
| discovery | research passed OR skipped |
| design-system | discovery passed |
| visual | discovery passed |
| content | discovery passed |
| qa | design-system + visual + content all passed |

3. If prerequisites not met:
   - List missing prerequisites
   - Ask user: "Run missing prerequisites first?" (YES/NO)
   - If YES: run prerequisites sequentially, then target phase
   - If NO: HALT

### Step 3: Load Phase Configuration

1. Read `config/pipeline-config.md` for phase-specific settings
2. Load timeout, retry policy, and gate minimum score for the phase

### Step 4: Execute Phase

Delegate to the appropriate squad based on phase:

| Phase | Squad | Lead Agent | Tasks |
|-------|-------|-----------|-------|
| research | research-intelligence | market-researcher | market-research, competitive-audit, trend-report, audience-analysis |
| discovery | branding | brand-strategist | brand-discovery, voice-guide, manifesto, moodboard, palette, typography, tokens |
| design-system | design-system | ds-architect | token-transform, component-build, component-variants, a11y-audit, ds-document |
| visual | visual-production | art-director | visual-direction, ai-image-generate, photo-retouch, motion-create, asset-organize |
| content | copy | copy-chief | copy-strategy, landing-page-copy, social-post-create, seo-meta-write, email-sequence |
| qa | qa-accessibility | visual-qa | visual-review, wcag-test, brand-compliance-check, lighthouse-audit, final-report |

1. Update state: `phases.{phase}.status = "running"`, `started_at = now()`
2. Execute each task in the phase sequentially (respecting intra-phase dependencies)
3. Collect all outputs

### Step 5: Run Phase Gate

1. Run `checklists/pipeline-gate-checklist.md`
2. If gate PASSES (score >= minimum for phase):
   - `phases.{phase}.status = "passed"`, `gate_score = {score}`, `completed_at = now()`
   - Record outputs in state
   - Log: "Phase {phase} PASSED (score: {score}/8)"
3. If gate FAILS:
   - Retry once
   - If retry passes: mark passed
   - If retry fails: `phases.{phase}.status = "failed"`, record error
   - Log: "Phase {phase} FAILED after retry"

### Step 6: Save State

1. Save updated pipeline state
2. Display phase summary:
   - Phase name and status
   - Duration
   - Gate score
   - Outputs generated
   - Next recommended phase (if any)

## Error Handling

| Error | Action |
|-------|--------|
| Phase timeout | Mark failed, save state |
| Missing inputs from previous phase | List what is missing, suggest running prerequisite |
| Squad not available | HALT with clear error message |

## Quality Gate

- Threshold: >70%
- Phase gate score meets or exceeds the minimum for the phase type (>=7/8 for research, >=8/8 for discovery)
- All intra-phase tasks completed sequentially with valid outputs
- Pipeline state updated correctly with status, timestamps, and gate score

---
*Brand Pipeline Task*
