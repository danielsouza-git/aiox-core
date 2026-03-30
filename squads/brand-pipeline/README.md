# Brand Pipeline

Meta-orchestrator squad that chains all brand-related squads into a single automated pipeline.

## Overview

| Aspect | Value |
|--------|-------|
| **Domain** | Brand Orchestration |
| **Agents** | 1 (Maestro -- orchestrator) |
| **Tasks** | 5 |
| **Workflows** | 3 |
| **Checklists** | 2 |
| **Dependent Squads** | 6 |
| **Version** | 1.0.0 |

## The Pipeline

When a user starts a brand project, Maestro runs the entire pipeline end-to-end without manual intervention across 6 phases:

```
Phase 1: RESEARCH           (research-intelligence squad)
  market-research -> competitive-audit -> trend-report -> audience-analysis

Phase 2: DISCOVERY           (branding squad)
  brand-discovery -> voice-guide -> manifesto -> moodboard -> palette -> typography -> tokens

Phase 3: DESIGN SYSTEM       (design-system squad)       ─┐
  token-transform -> component-build -> variants -> a11y-audit -> docs  │
                                                                        │ PARALLEL
Phase 4: VISUAL PRODUCTION   (visual-production squad)                  │
  visual-direction -> ai-image-generate -> photo-retouch -> motion -> organize │
                                                                        │
Phase 5: CONTENT             (copy squad)                               │
  copy-strategy -> landing-page -> social-posts -> seo-meta -> emails  ─┘

Phase 6: QA                  (qa-accessibility squad)
  visual-review -> wcag-test -> brand-compliance -> lighthouse -> final-report
```

Phases 3, 4, and 5 run in **parallel** after Phase 2 completes. Phase 6 waits for all three.

## Agent

| Icon | ID | Name | Role |
|------|-----|------|------|
| 🎼 | `brand-orchestrator` | Maestro | Brand Pipeline Orchestrator |

## Quick Start

```bash
# Activate the orchestrator
@brand-pipeline:brand-orchestrator

# Run full pipeline
*pipeline acme-corp

# Run express pipeline (skip research, minimal QA)
*pipeline acme-corp --express

# Run only changed phases
*pipeline acme-corp --refresh

# Run a specific phase
*phase acme-corp --phase discovery

# Check progress
*status acme-corp

# Resume from failure
*resume acme-corp

# Generate delivery report
*report acme-corp
```

## Pipeline Modes

### Full Mode (default)
Runs all 6 phases. Most comprehensive brand creation pipeline.
- Duration: 4-8 hours
- All gate scores at maximum thresholds
- Complete deliverable set

### Express Mode
Skips research phase. Streamlines build phases (fewer tasks per phase). Basic QA only.
- Duration: 1-2 hours
- Reduced gate thresholds
- Core deliverables only (no email sequences, social posts, motion assets)

### Refresh Mode
Compares file timestamps. Only re-runs phases whose inputs changed.
- Duration: Variable
- Same gate thresholds as full mode
- Cascading re-run (changed discovery triggers build + QA refresh)

## Phase Dependencies

```
research ──> discovery ──> design-system ──> qa
                 │              │
                 ├──> visual ───┤
                 │              │
                 └──> content ──┘
```

## Gate System

Every phase must pass its gate checklist before the next phase starts.

| Phase | Minimum Score | Checklist |
|-------|---------------|-----------|
| Research | 7/8 | pipeline-gate-checklist.md |
| Discovery | 8/8 | pipeline-gate-checklist.md |
| Design System | 7/8 | pipeline-gate-checklist.md |
| Visual | 7/8 | pipeline-gate-checklist.md |
| Content | 7/8 | pipeline-gate-checklist.md |
| QA | 8/10 | delivery-checklist.md |

Failed gates trigger 1 automatic retry. If retry fails, pipeline halts.

## Deliverables

### Research
- Market Report
- Competitive Analysis
- Trend Report
- Audience Personas

### Discovery
- Brand Profile
- Voice Guide
- Brand Manifesto
- Moodboard
- Color Palette
- Typography System
- Design Tokens (JSON)

### Design System
- CSS Custom Properties
- Tailwind Config
- SCSS Variables
- Component Library
- Component Variants
- Component Documentation

### Visual Assets
- Visual Direction Document
- AI-Generated Images
- Retouched Images
- Motion Assets
- Organized Asset Library

### Content
- Copy Strategy
- Landing Page Copy
- Social Media Posts
- SEO Meta Tags
- Email Sequences

### QA Reports
- Visual QA Report
- WCAG Compliance Report
- Brand Compliance Report
- Lighthouse Performance Report
- Delivery Report

## State Persistence

Pipeline state is persisted at `.aiox/branding/{client}/pipeline-state.yaml` after every phase transition. This enables:

- **Resume** from any failure point
- **Status checks** at any time
- **Refresh** detection via file timestamps
- **Audit trail** of gate scores and durations

## Required Squads

| Squad | Purpose |
|-------|---------|
| research-intelligence | Market research, competitive audit, trend analysis |
| branding | Brand discovery, voice, tokens, brand book |
| design-system | Token transforms, component library |
| visual-production | Visual direction, image generation, motion |
| copy | Copywriting, landing pages, email, social, SEO |
| qa-accessibility | Visual QA, WCAG, brand compliance, performance |

## File Structure

```
squads/brand-pipeline/
  squad.yaml                        # Manifest
  README.md                         # This file
  agents/
    brand-orchestrator.md           # Maestro
  tasks/
    run-pipeline.md                 # Full pipeline execution
    run-phase.md                    # Single phase execution
    pipeline-status.md              # Status check
    resume-pipeline.md              # Resume from checkpoint
    pipeline-report.md              # Delivery report generation
  workflows/
    full-brand-pipeline.yaml        # Complete 6-phase workflow
    express-brand-pipeline.yaml     # Streamlined 4-phase workflow
    refresh-brand-pipeline.yaml     # Incremental re-run workflow
  checklists/
    pipeline-gate-checklist.md      # Inter-phase gate (8 items)
    delivery-checklist.md           # Final delivery gate (10 items)
  config/
    pipeline-config.md              # Phase config, timeouts, retry policy
    tech-stack.md                   # Orchestration dependencies
  data/
    pipeline-state-template.yaml    # State file template
  templates/
  tools/
  scripts/
```

## License

MIT

---

*Brand Pipeline Squad v1.0.0 -- Part of AIOX Framework*
*Meta-orchestrator for end-to-end brand creation*
