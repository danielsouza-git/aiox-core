# figma-sync

```yaml
task: figmaSync()
agent: token-engineer
squad: branding
prd_refs: [CON-13]

inputs:
  - name: figma_variables
    type: json
    required: true
    source: style-dictionary-build output
  - name: figma_file_id
    type: string
    required: true

outputs:
  - name: sync_report
    type: markdown
    destination: .aiox/branding/{client}/figma-sync-report.md

tools:
  - tokens-studio
  - figma-api
```

## Purpose

Push design tokens from code to Figma using Tokens Studio plugin. **Code is the source of truth** — Figma only consumes tokens.

## Critical Constraint (CON-13)

```yaml
token_flow:
  direction: CODE → FIGMA (unidirectional)
  source_of_truth: W3C DTCG JSON in code
  prohibited: Figma → Code sync

rationale: |
  Bidirectional sync causes:
  - Token conflicts
  - State divergence
  - Version confusion
  - Breaking changes from Figma edits
```

## Sync Process

```yaml
steps:
  - step: validate_source
    input: figma-variables.json
    checks:
      - valid_json
      - dtcg_compliant
      - no_circular_refs

  - step: connect_figma
    method: figma_api
    auth: figma_access_token
    file_id: input.figma_file_id

  - step: backup_existing
    action: export current Figma variables
    destination: .aiox/branding/{client}/figma-backup-{timestamp}.json

  - step: push_tokens
    tool: tokens-studio
    mode: overwrite
    sets:
      - name: "Brand Tokens"
        tokens: all_from_source

  - step: validate_push
    checks:
      - all_tokens_created
      - references_resolved
      - no_errors_in_figma

  - step: generate_report
    include:
      - tokens_added
      - tokens_updated
      - tokens_removed
      - warnings
```

## Tokens Studio Integration

```yaml
tokens_studio:
  plugin_version: "2.x"
  sync_method: "push_only"

  configuration:
    token_sets:
      - primitives
      - semantics
      - components

    themes:
      light:
        sets: [primitives, semantics.light, components]
      dark:
        sets: [primitives, semantics.dark, components]

  mapping:
    dtcg_to_figma:
      color: "colors"
      dimension: "spacing"
      fontFamily: "typography"
      shadow: "effects"
```

## Figma Variable Structure

```
📁 Brand Tokens
├── 📁 Color
│   ├── 📁 Primitive
│   │   ├── blue-500
│   │   └── ...
│   ├── 📁 Semantic
│   │   ├── text-primary
│   │   └── ...
│   └── 📁 Component
│       ├── button-primary-bg
│       └── ...
├── 📁 Typography
│   ├── font-family-sans
│   ├── font-size-base
│   └── ...
├── 📁 Spacing
│   ├── spacing-4
│   └── ...
└── 📁 Effects
    ├── shadow-md
    └── ...
```

## Sync Report

```markdown
# Figma Sync Report

**Date:** {timestamp}
**File:** {figma_file_name}
**Direction:** Code → Figma

## Summary
- Tokens added: {count}
- Tokens updated: {count}
- Tokens removed: {count}

## Changes
| Token | Action | Old Value | New Value |
|-------|--------|-----------|-----------|
| color.primary.500 | updated | #2563eb | #3b82f6 |

## Warnings
- {any warnings}

## Next Steps
1. Review changes in Figma
2. Update components using changed tokens
3. Notify design team
```

## Pre-Conditions

- [ ] figma-variables.json exists
- [ ] Figma file ID provided
- [ ] Figma API token configured
- [ ] Tokens Studio plugin installed in Figma

## Post-Conditions

- [ ] All tokens synced to Figma
- [ ] Backup created
- [ ] Report generated

## Acceptance Criteria

- [ ] Figma Variables match code
- [ ] No manual Figma edits overwritten without backup
- [ ] Design team notified of changes
- [ ] Report documents all changes

## Quality Gate

- Threshold: >70%
- All tokens synced to Figma with zero push errors
- Backup of previous Figma variables created before sync
- Sync report documents all added, updated, and removed tokens

---
*Branding Squad Task - token-engineer*
