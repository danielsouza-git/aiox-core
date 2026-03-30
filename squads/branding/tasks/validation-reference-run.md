# Validation Reference Run

```yaml
task:
  id: validation-reference-run
  name: "Validation Reference Run"
  agent: operations-coordinator
  squad: branding
  type: validation
```

## Proposito

Execute a full branding workflow as a validation reference project, exercising all pipeline stages end-to-end to identify friction points, bugs, and improvement opportunities before commercial launch.

## Input

- Reference project profile (synthetic or real client data)
- Tier selection (1, 2, or 3 -- full scope preferred)
- Validation checklist and success criteria
- Previous validation learnings (if any)

## Output

- Completed reference project deliverables
- Validation report with friction points documented
- Learnings log entries for backlog
- Go/No-Go recommendation for commercial readiness

## Workflow

### Passo 1: Setup Reference Project
Create a reference project using the standard onboarding flow with synthetic or volunteer client data, tagging it as a validation run.

### Passo 2: Execute Full Workflow
Run the complete branding pipeline: discovery, tokens, brand book, creatives, web, and QA review -- timing each stage.

### Passo 3: Document Friction Points
Record any workflow friction, errors, missing automations, unclear handoffs, or quality issues encountered during execution.

### Passo 4: Assess Quality Outputs
Evaluate all generated deliverables against the branding squad quality checklists and acceptance criteria.

### Passo 5: Generate Validation Report
Compile a validation report with stage timings, friction points, quality scores, and a Go/No-Go recommendation.

## O que faz

- Executes the full branding pipeline as a controlled test run
- Times each workflow stage to identify bottlenecks
- Documents all friction points and errors systematically
- Assesses output quality against squad standards
- Produces a Go/No-Go recommendation for commercial launch

## O que NAO faz

- Does not deliver outputs to actual paying clients
- Does not modify the pipeline during the validation run
- Does not replace QA review (qa-reviewer still runs independently)

## Ferramentas

- **Full Branding Pipeline** -- All squad agent tasks executed in sequence
- **Validation Tracker** -- Structured friction point and timing logging

## Quality Gate

- Threshold: >70%
- All pipeline stages executed without critical failures
- Friction points documented with severity ratings
- Validation report includes actionable improvement recommendations

---
*Squad Branding Task*
