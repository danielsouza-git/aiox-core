# Branding Squad

Full digital brand presence squad for the Brand System Service.

## Overview

| Aspect | Value |
|--------|-------|
| **Domain** | Brand System Service |
| **PRD** | `docs/prd-brand-system-service.md` v1.2 |
| **Agents** | 10 |
| **Tasks** | 64 |
| **Workflows** | 4 |
| **Version** | 1.1.0 (MVP Expansion) |

## Agents

### Core Agents (v1.0)

| Icon | ID | Name | Role |
|------|-----|------|------|
| 🎯 | `brand-strategist` | Stella | Brand Discovery & Strategy Lead |
| 🔧 | `token-engineer` | Toren | Design Token System Architect |
| 📖 | `brand-book-builder` | Paige | Brand Book Generator (Triple Delivery) |
| 🤖 | `ai-orchestrator` | Nova | AI Pipeline & Prompt Engineering Lead |
| 🎨 | `creative-producer` | Cleo | Social Media & Creative Production Lead |
| 🌐 | `web-builder` | Webb | Landing Pages & Static Sites |
| ✅ | `qa-reviewer` | Quentin | Quality Assurance & Review Lead |

### MVP Expansion Agents (v1.1)

| Icon | ID | Name | Role | PRD Coverage |
|------|-----|------|------|--------------|
| 📋 | `operations-coordinator` | Olive | Client Operations & Validation Lead | FR-8.x, FR-11.x |
| 📊 | `analytics-specialist` | Atlas | Analytics & Tracking Specialist | FR-5.8, Tier 2, Retainer |
| 🧩 | `figma-component-builder` | Finn | Figma Component Library Architect | FR-1.6, FR-1.11 |

## Quick Start

```bash
# Activate an agent
@branding:brand-strategist

# Or use slash command
/branding:brand-strategist

# Run a command
*discovery
```

## Workflows

### 1. Brand Discovery Flow
Complete brand discovery from intake to tokens.

```
brand-discovery → digital-audit → moodboard-generate → voice-guide-generator
    → manifesto-generator → color-palette-generate → typography-pairing
    → token-schema-create → style-dictionary-build
```

### 2. Brand Book Delivery
Generate and deliver brand book in 3 formats.

```
brand-book-generate → brand-book-pdf → brand-book-package
    → review-deliverable → final-approval → brand-book-deploy
```

### 3. Creative Batch Flow
Generate batch of social media content.

```
content-calendar → copy-generate → image-generate → batch-generate
    → review-deliverable → final-approval
```

### 4. Landing Page Flow
Create and deploy landing page.

```
copy-generate → landing-page-create → seo-metadata-generate
    → accessibility-check → review-deliverable → final-approval → static-deploy
```

## PRD Coverage

| Epic | Coverage | Agent(s) |
|------|----------|----------|
| EPIC-BSS-2 (Tokens & Brand Book) | 95% | token-engineer, brand-book-builder |
| EPIC-BSS-3 (AI Pipeline) | 90% | ai-orchestrator |
| EPIC-BSS-4 (Creatives) | 90% | creative-producer |
| EPIC-BSS-5 (Web) | 85% | web-builder |
| EPIC-BSS-6 (Figma Components) | **95%** | figma-component-builder |
| EPIC-BSS-7 (Onboarding & Ops) | **95%** | brand-strategist, operations-coordinator |
| EPIC-BSS-8 (QA) | 90% | qa-reviewer |
| EPIC-BSS-9 (Analytics) | **95%** | analytics-specialist |
| EPIC-BSS-10 (Validation) | **90%** | operations-coordinator |

**MVP Coverage: 93%** (up from 85%)

## Dependencies

### Node.js
- `style-dictionary@^4.0.0`
- `sharp@^0.33.0`
- `@vercel/og@^0.6.0` (Satori)
- `puppeteer@^22.0.0`

### Integrations
- Cloudflare R2 (asset storage)
- ClickUp (operations)
- Figma (design system)
- Vercel/Netlify (hosting)
- Google Analytics 4 (analytics)
- Google Tag Manager (tracking)
- Meta Business Suite (pixel)
- Google Ads (conversion tracking)
- Google Search Console (SEO)

## File Structure

```
squads/branding/
├── squad.yaml              # Manifest
├── README.md               # This file
├── config/
│   ├── coding-standards.md
│   └── tech-stack.md
├── agents/
│   ├── brand-strategist.md
│   ├── token-engineer.md
│   ├── brand-book-builder.md
│   ├── ai-orchestrator.md
│   ├── creative-producer.md
│   ├── web-builder.md
│   ├── qa-reviewer.md
│   ├── operations-coordinator.md  # MVP Expansion
│   ├── analytics-specialist.md    # MVP Expansion
│   └── figma-component-builder.md # MVP Expansion
├── tasks/
│   └── (64 task files)
├── workflows/
│   ├── brand-discovery-flow.yaml
│   ├── brand-book-delivery.yaml
│   ├── creative-batch-flow.yaml
│   └── landing-page-flow.yaml
├── checklists/
│   ├── brand-identity-checklist.md
│   ├── social-media-checklist.md
│   └── web-design-checklist.md
├── templates/
├── tools/
├── scripts/
└── data/
```

## Usage Examples

### Start a new brand project
```bash
@branding:brand-strategist
*discovery
```

### Generate design tokens
```bash
@branding:token-engineer
*palette
*typography
*create-tokens
*build-tokens
```

### Create brand book
```bash
@branding:brand-book-builder
*generate-book
*export-pdf
*export-package
```

### Generate social content
```bash
@branding:creative-producer
*content-calendar
*generate-batch
```

### Review and approve
```bash
@branding:qa-reviewer
*review
*approve
```

### Setup project operations (MVP)
```bash
@branding:operations-coordinator
*setup-project
*onboard
*upload-assets
```

### Configure analytics (MVP)
```bash
@branding:analytics-specialist
*ga4-setup
*gtm-setup
*meta-pixel
*utm-strategy
```

### Build Figma library (MVP)
```bash
@branding:figma-component-builder
*library-init
*primitives
*icons
*audit
```

### Run validation program (MVP)
```bash
@branding:operations-coordinator
*validation-run
*validation-log
```

## License

MIT

---

*Branding Squad v1.1.0 - Part of AIOX Framework*
*Generated from Brand System Service PRD v1.2*
*MVP Expansion: 2026-03-10 - Added operations, analytics, figma-component agents*
