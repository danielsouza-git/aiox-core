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

## Profile-Driven Architecture

Todas as tasks do Copy Squad sao **profile-driven**: recebem o perfil do cliente como input e adaptam
o output com base no archetype, industria, audiencia e escopo.

### Content Selection Engine

O motor central que determina O QUE produzir, PARA QUAIS canais e EM QUE tom:

```
Inputs:
  brand-profile.yaml    -> archetype, industry, personality, target_audience
  pipeline-state.yaml   -> scope (portfolio | small | medium | large | enterprise)
  voice-guide.md        -> tone, vocabulary, forbidden words
  deliverables.tier     -> what the client paid for

Output:
  content-manifest.md   -> EXACTLY what content to produce, for which channels, in what tone
```

**Config:** `config/content-selection-engine.md`
**Template:** `data/content-manifest-template.md`

### Manifests

| Manifest | Responsavel | Descricao |
|----------|------------|-----------|
| `brand-profile.yaml` | Branding Squad | Archetype, industria, personalidade |
| `voice-guide.md` | Branding Squad | Tom, vocabulario, palavras proibidas |
| `design-manifest.md` | Design System Squad | Tokens, tipografia, cores |
| `content-manifest.md` | **Copy Squad** | Conteudo, canais, quantidades, frameworks |

### Fluxo Profile-Driven

```
1. brand-profile.yaml (input)
2. Content Selection Engine aplica tabelas de selecao
3. content-manifest.md (gerado)
4. Tasks leem manifest para decidir canais, quantidades, tom, frameworks
5. Nenhum valor hardcoded -- tudo flui do perfil do cliente
```

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
├── config.yaml                 # Squad manifest
├── README.md                   # This file
├── config/
│   ├── coding-standards.md
│   ├── content-selection-engine.md  # Profile-driven content selection
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
│   └── (30 task files — all profile-driven)
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
    └── content-manifest-template.md  # 4th manifest template
```

## License

MIT

---

*Copy Squad - Part of AIOX Framework*
