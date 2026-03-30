# token-schema-create

```yaml
task: tokenSchemaCreate()
agent: token-engineer
squad: branding
prd_refs: [FR-1.2]

inputs:
  - name: color_palette
    type: ColorPalette
    required: true
  - name: typography_system
    type: TypographySystem
    required: true
  - name: brand_profile
    type: BrandProfile
    required: true

outputs:
  - name: tokens_dtcg
    type: json
    destination: .aiox/branding/{client}/tokens/tokens.json
  - name: token_documentation
    type: markdown
    destination: .aiox/branding/{client}/tokens/README.md

tools:
  - style-dictionary
```

## Purpose

Create design tokens in W3C DTCG format with 3-tier architecture (primitive → semantic → component).

## Token Architecture

### Tier 1: Primitive Tokens
```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#2563eb",
        "$type": "color"
      }
    }
  },
  "spacing": {
    "4": {
      "$value": "1rem",
      "$type": "dimension"
    }
  },
  "fontFamily": {
    "sans": {
      "$value": "Inter, system-ui, sans-serif",
      "$type": "fontFamily"
    }
  }
}
```

### Tier 2: Semantic Tokens
```json
{
  "color": {
    "text": {
      "primary": {
        "$value": "{color.neutral.900}",
        "$type": "color"
      },
      "secondary": {
        "$value": "{color.neutral.600}",
        "$type": "color"
      }
    },
    "background": {
      "default": {
        "$value": "{color.neutral.50}",
        "$type": "color"
      },
      "surface": {
        "$value": "{color.white}",
        "$type": "color"
      }
    },
    "border": {
      "default": {
        "$value": "{color.neutral.200}",
        "$type": "color"
      }
    }
  }
}
```

### Tier 3: Component Tokens
```json
{
  "button": {
    "primary": {
      "background": {
        "$value": "{color.primary.500}",
        "$type": "color"
      },
      "text": {
        "$value": "{color.white}",
        "$type": "color"
      },
      "borderRadius": {
        "$value": "{radius.md}",
        "$type": "dimension"
      }
    }
  }
}
```

## Token Categories

```yaml
categories:
  color:
    types: [solid, gradient, shadow]
    includes: [palette, semantic, component]

  typography:
    types: [fontFamily, fontSize, fontWeight, lineHeight, letterSpacing]
    includes: [scale, semantic]

  spacing:
    types: [dimension]
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64]

  sizing:
    types: [dimension]
    includes: [icon, avatar, button, input]

  radius:
    types: [dimension]
    scale: [none, sm, md, lg, xl, 2xl, full]

  shadow:
    types: [shadow]
    scale: [sm, md, lg, xl, 2xl, inner]

  motion:
    types: [duration, cubicBezier]
    includes: [duration, easing]

  breakpoint:
    types: [dimension]
    scale: [xs, sm, md, lg, xl, 2xl]
```

## W3C DTCG Compliance

```yaml
dtcg_spec:
  version: "2025.10"
  required_fields:
    - $value
    - $type
  optional_fields:
    - $description
    - $extensions

type_mappings:
  color: "color"
  dimension: "dimension"
  fontFamily: "fontFamily"
  fontWeight: "fontWeight"
  duration: "duration"
  cubicBezier: "cubicBezier"
  shadow: "shadow"
  gradient: "gradient"
```

## Generation Process

```yaml
steps:
  - step: create_primitives
    input: [color_palette, typography_system]
    output: primitives.json

  - step: create_semantics
    input: primitives.json
    mapping: brand_profile.usage_patterns
    output: semantics.json

  - step: create_components
    input: semantics.json
    components: [button, input, card, badge, alert]
    output: components.json

  - step: merge_tokens
    files: [primitives, semantics, components]
    output: tokens.json

  - step: validate_schema
    validator: w3c-dtcg-validator
    errors: blocking
    warnings: logged
```

## Pre-Conditions

- [ ] Color palette finalized
- [ ] Typography system defined
- [ ] Brand profile approved

## Post-Conditions

- [ ] tokens.json W3C DTCG compliant
- [ ] All references resolve correctly
- [ ] Documentation generated

## Acceptance Criteria

- [ ] 3-tier architecture implemented
- [ ] All token references valid
- [ ] Schema validation passes
- [ ] Ready for Style Dictionary build

## Quality Gate

- Threshold: >70%
- Token schema compliant with W3C DTCG 2025.10 specification
- Three-tier architecture implemented (primitive, semantic, component)
- No circular references in token definitions

---
*Branding Squad Task - token-engineer*
