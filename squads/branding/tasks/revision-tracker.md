# Revision Tracker

```yaml
task:
  id: revision-tracker
  name: "Revision Tracker"
  agent: operations-coordinator
  squad: branding
  type: operations
```

## Proposito

Track revision rounds for client deliverables, enforce the 3-round maximum policy (CON-14), record feedback from each round, and update ClickUp task statuses to maintain full revision history.

## Input

- Deliverable identifier and type
- Revision round number
- Client feedback (text and/or annotated files)
- Current ClickUp task reference

## Output

- Updated revision log with round details
- ClickUp task status updated
- Escalation alert if round 3 reached
- Revision history report

## Workflow

### Passo 1: Record Feedback
Capture the client's feedback for the current revision round, tagging each item by category (copy, design, layout, technical).

### Passo 2: Validate Round Number
Check if this is round 1, 2, or 3. If round 3, flag for escalation per CON-14 policy.

### Passo 3: Update ClickUp Status
Move the ClickUp task to the appropriate revision status and log the feedback as a comment with structured formatting.

### Passo 4: Notify Responsible Agent
Route the revision feedback to the appropriate agent (creative-producer, web-builder, etc.) with prioritized action items.

### Passo 5: Generate Revision Report
Produce a cumulative revision history showing all rounds, feedback items, and resolution status.

## O que faz

- Tracks all revision rounds per deliverable with full history
- Enforces the 3-round maximum revision policy (CON-14)
- Routes feedback to the correct responsible agent
- Maintains structured revision logs in ClickUp
- Generates escalation alerts when limits are reached

## O que NAO faz

- Does not implement the actual revisions (responsible agents do that)
- Does not negotiate additional revision rounds with clients
- Does not make creative decisions about how to address feedback

## Ferramentas

- **ClickUp API** -- Task status updates and comment logging
- **Revision Log** -- Structured feedback tracking per deliverable

## Quality Gate

- Threshold: >70%
- All feedback items categorized and logged
- ClickUp task status accurately reflects current round
- Escalation triggered automatically at round 3

---
*Squad Branding Task*
