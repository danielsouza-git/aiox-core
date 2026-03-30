# token-export

```yaml
task: tokenExport()
agent: token-engineer
squad: branding
prd_refs: [FR-1.2, NFR-3.3]

inputs:
  - name: built_tokens
    type: directory
    required: true
    source: style-dictionary-build output

outputs:
  - name: export_package
    type: zip
    destination: .aiox/branding/{client}/exports/tokens-package.zip
  - name: cdn_assets
    type: directory
    destination: r2://{client}/tokens/

tools:
  - style-dictionary
  - cloudflare-r2
```

## Purpose

Export design tokens for client delivery in multiple formats with CDN deployment option.

## Export Package Contents

```
tokens-package/
├── README.md                    # Usage instructions
├── css/
│   ├── tokens.css              # CSS Custom Properties
│   └── tokens.min.css          # Minified version
├── scss/
│   ├── _tokens.scss            # SCSS variables
│   └── _mixins.scss            # Helper mixins
├── tailwind/
│   ├── tailwind.config.js      # Full config
│   └── preset.js               # Shareable preset
├── json/
│   ├── tokens.json             # W3C DTCG source
│   ├── tokens.flat.json        # Flattened key-value
│   └── tokens.nested.json      # Nested structure
├── figma/
│   └── figma-variables.json    # Tokens Studio format
├── typescript/
│   ├── tokens.ts               # TypeScript constants
│   └── tokens.d.ts             # Type definitions
└── CHANGELOG.md                # Version history
```

## CDN Deployment

```yaml
cdn_structure:
  base_url: "https://r2.brand.aioxsquad.ai/{client}/tokens"
  files:
    - path: /latest/tokens.css
      cache: 1h
    - path: /v{version}/tokens.css
      cache: 1y
    - path: /latest/tokens.json
      cache: 1h

versioning:
  format: semver
  auto_increment: patch
  changelog: auto_generate
```

## Usage Examples (README.md)

### CSS (CDN)
```html
<link rel="stylesheet" href="https://r2.brand.aioxsquad.ai/acme/tokens/latest/tokens.css">
```

### CSS (Local)
```css
@import './tokens.css';

.button {
  background: var(--color-primary-500);
  color: var(--color-text-on-primary);
}
```

### SCSS
```scss
@import 'tokens';

.button {
  background: $color-primary-500;
  color: $color-text-on-primary;
}
```

### Tailwind
```javascript
// tailwind.config.js
const brandTokens = require('./tokens-package/tailwind/preset');

module.exports = {
  presets: [brandTokens],
};
```

### JavaScript/TypeScript
```typescript
import { colors, spacing } from './tokens-package/typescript/tokens';

const primaryColor = colors.primary[500];
```

## Export Process

```yaml
steps:
  - step: prepare_package
    actions:
      - create_directory_structure
      - copy_built_files
      - generate_readme
      - generate_changelog

  - step: minify_css
    input: tokens.css
    output: tokens.min.css
    tool: cssnano

  - step: generate_types
    input: tokens.json
    output: [tokens.ts, tokens.d.ts]

  - step: create_zip
    input: tokens-package/
    output: tokens-package.zip

  - step: deploy_cdn
    if: cdn_enabled
    destination: r2://{client}/tokens/
    versioned: true
```

## Pre-Conditions

- [ ] Style Dictionary build complete
- [ ] All formats generated successfully

## Post-Conditions

- [ ] ZIP package created
- [ ] All files included
- [ ] README accurate
- [ ] CDN deployed (if enabled)

## Acceptance Criteria

- [ ] Package extracts correctly
- [ ] All usage examples work
- [ ] CDN URLs accessible
- [ ] Version tagged correctly

## Quality Gate

- Threshold: >70%
- Exported files valid in target format (parseable CSS/SCSS/JSON)
- All tokens from schema present in exported output
- File sizes reasonable and ready for production use

---
*Branding Squad Task - token-engineer*
