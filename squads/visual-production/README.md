# Visual Production Squad

Professional visual asset production at scale. Art direction, AI image generation, photo editing, motion design, and asset management.

## Overview

| Aspect | Value |
|--------|-------|
| **Domain** | Visual Assets |
| **Agents** | 5 |
| **Tasks** | 15 |
| **Workflows** | 3 |

## Agents

| Icon | ID | Name | Role |
|------|-----|------|------|
| 🎨 | `art-director` | Vincent | Visual Direction & Creative Consistency |
| ✨ | `ai-image-specialist` | Nova | AI Image Generation & Prompt Engineering |
| 📸 | `photo-editor` | Phoebe | Photo Retouching & Compositing |
| 🎬 | `motion-designer` | Max | Motion Design & Lottie Animations |
| 📦 | `asset-manager` | Archer | Asset Organization & CDN Delivery |

## Quick Start

```bash
# Activate an agent
@visual-production:art-director

# Or use slash command
/visual-production:ai-image-specialist

# Run a command
*generate
```

## Visual Standards

### Supported Formats
| Format | Use Case | Quality |
|--------|----------|---------|
| **WebP** | Web primary | 85% |
| **AVIF** | Web next-gen | 80% |
| **PNG** | Social / transparency | 95% |
| **JPG** | Fallback / email | 90% |
| **SVG** | Icons / vectors | N/A |
| **Lottie** | Animations | Max 150KB |

### Standard Sizes
| Asset | Dimensions | Notes |
|-------|-----------|-------|
| Hero | 1920x1080 | 16:9 landscape |
| Social Square | 1080x1080 | Instagram, Facebook |
| Social Story | 1080x1920 | Stories, Reels, TikTok |
| Thumbnail | 640x360 | Video thumbnails |
| OG Image | 1200x630 | Social share preview |

## Workflows

### 1. Visual Production Flow
End-to-end visual production from direction to organized delivery.
```
direction --> generate --> edit --> optimize --> organize
```

### 2. Asset Pipeline Flow
Asset ingestion through processing, optimization, and CDN deployment.
```
ingest --> validate --> process --> optimize --> cdn-deploy
```

### 3. AI Image Pipeline Flow
AI-powered image generation from prompt engineering to final delivery.
```
prompt-engineer --> generate --> curate --> edit --> deliver
```

## Integration with Other Squads

**Receives from Branding:**
- Brand profile & personality
- Color palette & moodboard
- Visual direction guidelines

**Receives from Design System:**
- Component specifications
- Icon system

**Provides to Branding:**
- Hero images
- Social media assets
- Web assets
- Motion assets

**Provides to Copy:**
- Carousel images
- Thumbnail images
- Ad creatives

```bash
# Example: Branding Squad delegates to Visual Production
@branding:brand-strategist --> creates visual direction
@visual-production:ai-image-specialist --> generates brand-aligned images
@visual-production:asset-manager --> optimizes and delivers to CDN
```

## Usage Examples

### Generate AI images
```bash
@visual-production:ai-image-specialist
*generate --model flux --style "brand-aligned" --count 5
```

### Create motion piece
```bash
@visual-production:motion-designer
*animate --type loader --format lottie
```

### Optimize for web
```bash
@visual-production:photo-editor
*optimize --formats "webp,avif,png" --responsive
```

### Organize assets
```bash
@visual-production:asset-manager
*organize --project "campaign-q1" --structure standard
```

### Deploy to CDN
```bash
@visual-production:asset-manager
*cdn --provider cloudflare-r2 --purge
```

## File Structure

```
squads/visual-production/
├── squad.yaml              # Manifest
├── README.md               # This file
├── config/
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── image-specs.md
├── agents/
│   ├── art-director.md
│   ├── ai-image-specialist.md
│   ├── photo-editor.md
│   ├── motion-designer.md
│   └── asset-manager.md
├── tasks/
│   └── (15 task files)
├── workflows/
│   ├── visual-production-flow.yaml
│   ├── asset-pipeline-flow.yaml
│   └── ai-image-pipeline-flow.yaml
└── checklists/
    ├── visual-quality-checklist.md
    ├── brand-consistency-checklist.md
    ├── asset-delivery-checklist.md
    └── motion-quality-checklist.md
```

## License

MIT

---

*Visual Production Squad - Part of AIOX Framework*
