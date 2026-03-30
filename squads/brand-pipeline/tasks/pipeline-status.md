# Pipeline Status

Check the current status and progress of a brand pipeline.

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

## Steps

### Step 1: Load State

1. Validate `client_name` is provided (elicit if missing)
2. Read `.aiox/branding/{client}/pipeline-state.yaml`
3. If file does not exist: "No pipeline found for {client_name}. Run `*pipeline {client_name}` to start."

### Step 2: Calculate Progress

1. Count phases by status:
   - `passed`: completed phases
   - `running`: currently active phase
   - `failed`: failed phases
   - `skipped`: intentionally skipped
   - `pending`: not yet started
2. Calculate overall progress: `(passed + skipped) / total * 100`
3. Calculate elapsed time from `pipeline.started_at`

### Step 3: Display Overall Status

```
Pipeline: {client_name}
Mode: {mode} | Status: {status}
Progress: [{progress_bar}] {percentage}%
Started: {started_at} | Elapsed: {elapsed}
```

Progress bar format: `[####------]` (10 segments)

### Step 4: Display Phase Table

```
| Phase | Status | Score | Duration | Agent |
|-------|--------|-------|----------|-------|
| 1. Research | PASSED | 7/8 | 45m | @market-researcher |
| 2. Discovery | PASSED | 8/8 | 1h20m | @brand-strategist |
| 3. Design System | RUNNING | - | 30m+ | @ds-architect |
| 4. Visual | RUNNING | - | 25m+ | @art-director |
| 5. Content | PENDING | - | - | @copy-chief |
| 6. QA | PENDING | - | - | @visual-qa |
```

Status badges:
- PASSED: passed
- RUNNING: running (with elapsed time)
- FAILED: failed (with error summary)
- SKIPPED: skipped (with reason)
- PENDING: pending

### Step 5: Display Active Details

If any phase is `running`:
- Show current phase name and agent
- Show which task within the phase is active (if trackable)
- Show elapsed time for current phase

### Step 6: Display Blockers

If any phase is `failed`:
- Show error message from state
- Show retry count
- Suggest: "Run `*resume {client_name}` to retry from the failed phase"

### Step 7: Estimate Completion

Based on mode and completed phases, estimate remaining time:

| Mode | Avg Phase Duration | Total Estimate |
|------|-------------------|----------------|
| full | 40-80 min/phase | 4-8 hours |
| express | 20-40 min/phase | 1-2 hours |
| refresh | 10-30 min/phase | Variable |

Display: "Estimated completion: {estimate} (based on {mode} mode averages)"

## Quality Gate

- Threshold: >70%
- Pipeline state file loads without errors and reflects actual phase statuses
- Progress calculation is accurate (matches passed + skipped vs total phases)
- Blockers and failed phases are clearly surfaced with actionable suggestions

---
*Brand Pipeline Task*
