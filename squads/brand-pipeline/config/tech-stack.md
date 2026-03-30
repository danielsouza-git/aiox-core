# Brand Pipeline - Tech Stack

## Orchestration

| Component | Technology |
|-----------|-----------|
| **State Machine** | YAML-based state persistence |
| **State Format** | `pipeline-state.yaml` per client |
| **Workflow Engine** | AIOX task runner (agent-delegated) |
| **Parallel Execution** | Agent-level parallelism (phases 3-4-5) |
| **Change Detection** | File timestamp comparison (`fs.stat().mtime`) |

## Dependencies

### Required Squads

All 6 squads must be installed for the full pipeline:

| Squad | Version | Purpose |
|-------|---------|---------|
| `research-intelligence` | ^1.0.0 | Market research and competitive analysis |
| `branding` | ^1.1.0 | Brand discovery, tokens, brand book |
| `design-system` | ^1.0.0 | Component library and token transforms |
| `visual-production` | ^1.0.0 | Visual assets and image generation |
| `copy` | ^1.0.0 | Copywriting and content production |
| `qa-accessibility` | ^1.0.0 | Quality assurance and accessibility testing |

### Transitive Dependencies

The pipeline inherits all dependencies from its constituent squads:

| Category | Dependencies |
|----------|-------------|
| **Node.js** | style-dictionary, sharp, @vercel/og, puppeteer, tailwindcss |
| **AI Services** | Claude, GPT-4o, Flux 1.1 Pro, DALL-E 3 |
| **Integrations** | Cloudflare R2, ClickUp, Figma, Vercel, GA4, GTM |

## State Management

### Pipeline State

```yaml
# .aiox/branding/{client}/pipeline-state.yaml
pipeline:
  client: "client-name"
  mode: "full"
  status: "in_progress"
  started_at: "ISO 8601"
  completed_at: null
  current_phase: "discovery"
phases:
  research: { status: "passed", gate_score: 7 }
  discovery: { status: "running" }
  # ...
```

### State Transitions

```
not_started -> in_progress -> completed
                           -> failed
                           -> paused
```

Per phase:
```
pending -> running -> passed
                   -> failed
                   -> skipped
```

## Artifact Storage

| Location | Purpose | Persistence |
|----------|---------|-------------|
| `.aiox/branding/{client}/` | Pipeline artifacts | Runtime (gitignored) |
| `.aiox/branding/{client}/pipeline-state.yaml` | State machine | Runtime |
| `.aiox/branding/{client}/delivery-report.md` | Final report | Runtime |

## Performance Targets

| Metric | Target |
|--------|--------|
| Full pipeline duration | < 8 hours |
| Express pipeline duration | < 2 hours |
| Phase gate evaluation | < 30 seconds |
| State save/load | < 100ms |
| Change detection (refresh) | < 5 seconds |

---
*Brand Pipeline Config*
