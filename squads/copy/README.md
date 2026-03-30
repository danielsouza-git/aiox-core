# Copy Squad

Professional copywriting squad for conversion-focused content across all channels.

## Overview

| Aspect | Value |
|--------|-------|
| **Domain** | Copywriting & Content |
| **Agents** | 7 |
| **Tasks** | 30 |
| **Workflows** | 4 |

## Agents

| Icon | ID | Name | Role |
|------|-----|------|------|
| 📝 | `copy-chief` | Reed | Copy Strategy & Quality Lead |
| 🎯 | `conversion-writer` | Cora | Landing Pages & Sales Copy |
| 📧 | `email-specialist` | Eva | Email Sequences & Campaigns |
| 📢 | `ads-writer` | Adam | Paid Ads Copy (Meta, Google, LinkedIn) |
| 📱 | `social-writer` | Sofia | Social Media Content |
| 🔍 | `seo-writer` | Samuel | SEO Content & Blog Posts |
| ✏️ | `copy-editor` | Edgar | Editing, Proofreading, Localization |

## Quick Start

```bash
# Activate an agent
@copy:conversion-writer

# Or use slash command
/copy:conversion-writer

# Run a command
*landing-page
```

## Copy Frameworks

### Conversion Frameworks
| Framework | Structure | Best For |
|-----------|-----------|----------|
| **AIDA** | Attention → Interest → Desire → Action | Landing pages, ads |
| **PAS** | Problem → Agitation → Solution | Pain-focused copy |
| **PASTOR** | Problem → Amplify → Story → Transform → Offer → Response | Long-form sales |
| **BAB** | Before → After → Bridge | Transformation stories |
| **4Ps** | Promise → Picture → Proof → Push | Direct response |

### Content Frameworks
| Framework | Structure | Best For |
|-----------|-----------|----------|
| **HCEA** | Hook → Context → Entrega → Action | Social posts, captions |
| **StoryBrand** | Hero → Problem → Guide → Plan → Action | Brand storytelling |

### Email Frameworks
| Framework | Structure | Best For |
|-----------|-----------|----------|
| **1-2-3** | One idea, Two benefits, Three proofs | Newsletters |
| **Star-Chain-Hook** | Attention → Logic chain → CTA | Sales emails |

## Workflows

### 1. Copy Production Flow
Complete copy production from brief to delivery.
```
brief-analyze → strategy-create → write → edit → review → deliver
```

### 2. Email Campaign Flow
Email sequence creation and optimization.
```
strategy → sequence-plan → write-emails → subject-lines → edit → test
```

### 3. Ads Campaign Flow
Multi-platform ad copy production.
```
angles-generate → platform-copy → variants → review → deliver
```

### 4. Content Pipeline Flow
SEO content production at scale.
```
content-brief → research → outline → write → edit → seo-optimize → publish
```

## Integration with Branding Squad

The Copy Squad integrates seamlessly with the Branding Squad:

**Receives from Branding:**
- Brand profile & personality
- Voice guide & tone spectrum
- Vocabulary bank (approved/forbidden words)

**Provides to Branding:**
- Landing page copy
- Social media copy
- Email copy
- Ad copy

```bash
# Example: Branding Squad delegates to Copy Squad
@branding:brand-strategist → creates voice guide
@copy:conversion-writer → uses voice guide for landing page copy
```

## Usage Examples

### Create landing page copy
```bash
@copy:conversion-writer
*landing-page --framework PASTOR --length long
```

### Generate email sequence
```bash
@copy:email-specialist
*sequence --type welcome --emails 5
```

### Write ad copy
```bash
@copy:ads-writer
*meta-ads --angles 5 --variants 3
```

### Create blog post
```bash
@copy:seo-writer
*blog-post --topic "keyword" --length 2000
```

### Edit existing copy
```bash
@copy:copy-editor
*edit --tone professional --clarity high
```

## File Structure

```
squads/copy/
├── squad.yaml              # Manifest
├── README.md               # This file
├── config/
│   ├── coding-standards.md
│   ├── copy-frameworks.md
│   └── tone-guidelines.md
├── agents/
│   ├── copy-chief.md
│   ├── conversion-writer.md
│   ├── email-specialist.md
│   ├── ads-writer.md
│   ├── social-writer.md
│   ├── seo-writer.md
│   └── copy-editor.md
├── tasks/
│   └── (30 task files)
├── workflows/
│   ├── copy-production-flow.yaml
│   ├── email-campaign-flow.yaml
│   ├── ads-campaign-flow.yaml
│   └── content-pipeline-flow.yaml
├── checklists/
│   ├── copy-quality-checklist.md
│   ├── conversion-copy-checklist.md
│   ├── email-copy-checklist.md
│   └── seo-copy-checklist.md
└── data/
```

## License

MIT

---

*Copy Squad - Part of AIOX Framework*
