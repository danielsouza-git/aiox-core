# theme-create

```yaml
task: themeCreate()
agent: token-transformer
squad: design-system

inputs:
  - name: base_tokens
    type: json
    required: true
    description: Base theme tokens (W3C DTCG format)
  - name: theme_name
    type: string
    required: true
    description: "Theme identifier (e.g., dark, high-contrast, compact)"
  - name: overrides
    type: json
    required: false
    description: Specific token overrides for the new theme

outputs:
  - name: theme_tokens
    type: json
    destination: .aiox/design-system/{project}/themes/{theme_name}/tokens.json
  - name: theme_css
    type: css
    destination: .aiox/design-system/{project}/themes/{theme_name}/theme.css

tools:
  - style-dictionary
```

## Purpose

Create a new theme variant from existing base tokens. Supports dark mode, high contrast, compact density, and custom brand themes. Generates both the token definition and compiled CSS output with proper CSS selector scoping.

## Workflow

### Phase 1: Theme Analysis
```yaml
steps:
  - analyze_base: Identify all semantic tokens that change between themes
  - identify_surfaces: List background, surface, and overlay tokens
  - identify_text: List all text and icon color tokens
  - identify_borders: List border and divider tokens
  - identify_interactive: List hover, focus, active, disabled state tokens
```

### Phase 2: Theme Generation
```yaml
steps:
  - apply_overrides: Apply user-provided overrides first
  - generate_dark: If dark theme, invert lightness scale and adjust saturation
  - generate_contrast: If high-contrast, increase contrast ratios to AAA (7:1+)
  - generate_compact: If compact, reduce spacing tokens by 25%
  - validate_contrast: Ensure all text/background pairs meet WCAG AA minimum
```

### Phase 3: Output
```yaml
steps:
  - generate_tokens_json: Produce theme-specific tokens.json
  - generate_css: Produce scoped CSS with [data-theme="{name}"] selector
  - generate_preview: Produce theme preview color swatches
  - document_changes: List all tokens that differ from base theme
```

## Theme Scoping Strategy

```css
/* Base theme (default) */
:root {
  --color-surface-primary: #ffffff;
  --color-text-primary: #1a1a1a;
}

/* Dark theme */
[data-theme="dark"] {
  --color-surface-primary: #1a1a1a;
  --color-text-primary: #f5f5f5;
}

/* High contrast */
[data-theme="high-contrast"] {
  --color-surface-primary: #000000;
  --color-text-primary: #ffffff;
}
```

## Pre-Conditions

- [ ] Base theme tokens exist in W3C DTCG format
- [ ] Theme name is defined

## Post-Conditions

- [ ] Theme tokens JSON generated
- [ ] Theme CSS with proper scoping generated
- [ ] All color pairs meet WCAG AA contrast ratios

## Acceptance Criteria

- [ ] Theme tokens follow same structure as base tokens
- [ ] CSS uses `[data-theme]` attribute selector for scoping
- [ ] Contrast ratios validated for all text/surface pairs
- [ ] Changes from base theme documented

## Quality Gate
- Threshold: >70%
- All text/surface color pairs meet WCAG AA contrast ratios (4.5:1 minimum)
- Theme CSS uses `[data-theme]` attribute selector for proper scoping
- Valid JSON output for theme tokens following the same structure as base tokens

---
*Design System Squad Task - token-transformer*
