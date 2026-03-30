# style-dictionary-build

```yaml
task: styleDictionaryBuild()
agent: token-engineer
squad: branding
prd_refs: [FR-1.2, NFR-3.3]

inputs:
  - name: tokens_dtcg
    type: json
    required: true
    source: token-schema-create output

outputs:
  - name: css_variables
    type: css
    destination: .aiox/branding/{client}/dist/tokens.css
  - name: scss_variables
    type: scss
    destination: .aiox/branding/{client}/dist/_tokens.scss
  - name: tailwind_config
    type: js
    destination: .aiox/branding/{client}/dist/tailwind.config.js
  - name: json_flat
    type: json
    destination: .aiox/branding/{client}/dist/tokens.flat.json
  - name: figma_variables
    type: json
    destination: .aiox/branding/{client}/dist/figma-variables.json

tools:
  - style-dictionary
  - node
```

## Purpose

Build design tokens from W3C DTCG source into multiple output formats using Style Dictionary.

## Output Formats

### CSS Custom Properties
```css
:root {
  --color-primary-500: #2563eb;
  --color-text-primary: var(--color-neutral-900);
  --spacing-4: 1rem;
  --font-family-sans: Inter, system-ui, sans-serif;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

[data-theme="dark"] {
  --color-text-primary: var(--color-neutral-100);
  --color-background-default: var(--color-neutral-900);
}
```

### SCSS Variables
```scss
$color-primary-500: #2563eb;
$color-text-primary: $color-neutral-900;
$spacing-4: 1rem;

$colors: (
  'primary-500': $color-primary-500,
  'text-primary': $color-text-primary,
);

@mixin color($name) {
  color: map-get($colors, $name);
}
```

### Tailwind Config
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--color-primary-500)',
        },
      },
      spacing: {
        '4': 'var(--spacing-4)',
      },
      fontFamily: {
        sans: 'var(--font-family-sans)',
      },
    },
  },
};
```

### Figma Variables (for Tokens Studio)
```json
{
  "color/primary/500": {
    "value": "#2563eb",
    "type": "color"
  }
}
```

## Style Dictionary Config

```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/',
      files: [{
        destination: '_tokens.scss',
        format: 'scss/variables'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'tailwind.config.js',
        format: 'tailwind/config'
      }]
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'figma-variables.json',
        format: 'json/figma-tokens'
      }]
    }
  }
};
```

## Build Process

```yaml
steps:
  - step: validate_source
    command: style-dictionary validate
    on_error: abort

  - step: build_css
    command: style-dictionary build --platform css
    output: dist/tokens.css

  - step: build_scss
    command: style-dictionary build --platform scss
    output: dist/_tokens.scss

  - step: build_tailwind
    command: style-dictionary build --platform tailwind
    output: dist/tailwind.config.js

  - step: build_figma
    command: style-dictionary build --platform figma
    output: dist/figma-variables.json

  - step: generate_types
    command: generate-token-types
    output: dist/tokens.d.ts

  - step: validate_outputs
    checks:
      - css_valid
      - scss_compiles
      - tailwind_loads
      - json_parseable
```

## Pre-Conditions

- [ ] tokens.json exists and valid
- [ ] Style Dictionary installed (v4.0+)
- [ ] Node.js available

## Post-Conditions

- [ ] All output formats generated
- [ ] No build errors
- [ ] References resolved correctly

## Acceptance Criteria

- [ ] CSS variables work in browser
- [ ] SCSS compiles without errors
- [ ] Tailwind config loads correctly
- [ ] Figma import successful
- [ ] TypeScript types generated

## Quality Gate

- Threshold: >70%
- Style Dictionary build completes without errors or warnings
- All configured output formats generated (CSS, SCSS, JSON, Tailwind)
- Token values consistent across all output formats

---
*Branding Squad Task - token-engineer*
