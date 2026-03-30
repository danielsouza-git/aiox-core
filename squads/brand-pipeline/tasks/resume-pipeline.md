# Resume Pipeline

Resume a brand pipeline from the last successful checkpoint.

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

## Steps

### Step 1: Load State

1. Validate `client_name` is provided (elicit if missing)
2. Read `.aiox/branding/{client}/pipeline-state.yaml`
3. If file does not exist: "No pipeline found for {client_name}. Run `*pipeline {client_name}` to start."

### Step 2: Analyze State

1. Identify pipeline status:
   - `completed`: "Pipeline already completed. Run `*report {client_name}` for delivery report."
   - `not_started`: "Pipeline not started. Run `*pipeline {client_name}` to begin."
   - `in_progress` or `paused` or `failed`: Continue to Step 3

2. Find resume point:
   - Scan phases in order: research -> discovery -> design-system/visual/content -> qa
   - Find the FIRST phase that is NOT `passed` or `skipped`
   - This is the resume point

3. Handle partial phase states:
   - If resume phase is `running`: Phase was interrupted mid-execution. Restart it from scratch.
   - If resume phase is `failed`: Phase failed previously. Retry it.
   - If resume phase is `pending`: Normal progression.

### Step 3: Display Resume Plan

```
Pipeline: {client_name}
Status: {status}
Last completed: Phase {N} ({name})
Resume from: Phase {N+1} ({name})
Remaining phases: {count}
```

If mode is interactive, ask: "Resume from Phase {N+1}? (YES/NO)"

### Step 4: Execute Remaining Phases

1. Update `pipeline.status = "in_progress"`
2. For the resume phase:
   - Reset: `status = "pending"`, clear `error`, clear `started_at`/`completed_at`
   - Execute using the same logic as `run-pipeline.md` (Step 3-6)
3. Continue with subsequent phases normally
4. Respect parallel execution rules (phases 3-4-5 in parallel)

### Step 5: Handle Parallel Phase Resume

If resuming into the parallel build group (phases 3-4-5):

1. Check which parallel phases already passed
2. Only re-run phases that are not `passed`
3. Run remaining parallel phases simultaneously
4. Wait for all to complete before proceeding to QA

Example scenarios:
- design-system=passed, visual=failed, content=passed -> Only re-run visual
- design-system=running, visual=pending, content=pending -> Run all three
- design-system=passed, visual=passed, content=passed -> Skip to QA

### Step 6: Finalize

1. Save updated pipeline state
2. If pipeline completes: generate delivery report
3. Display resume summary:
   - Phases completed in this resume session
   - Total pipeline progress
   - Final status

## Error Handling

| Error | Action |
|-------|--------|
| Corrupted state file | Offer to re-initialize from last known good phase |
| Missing output files from passed phases | Re-run the phase that should have produced them |
| Repeated failure (same phase fails again) | HALT, suggest manual intervention |

## Quality Gate

- Threshold: >70%
- Pipeline state restored correctly from the last checkpoint (no data loss)
- Resume point identified accurately (first non-passed, non-skipped phase)
- Parallel phase resume handles partial completion correctly (only re-runs failed/pending phases)

---
*Brand Pipeline Task*
