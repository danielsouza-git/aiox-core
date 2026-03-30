# Token Quality Checklist

**Reference:** W3C DTCG Spec, Style Dictionary Best Practices
**Items:** 25
**Used by:** token-transformer

## Naming Convention

- [ ] **Kebab-case** - All token names use kebab-case (e.g., `color-primary-500`)
- [ ] **Three-tier structure** - Tokens follow primitive -> semantic -> component hierarchy
- [ ] **Descriptive names** - Names describe purpose, not value (e.g., `color-text-primary` not `color-dark-gray`)
- [ ] **Consistent prefixes** - Category prefixes are consistent (color, spacing, font, radius, shadow)
- [ ] **No abbreviations** - Full words used (e.g., `background` not `bg`, `medium` not `md` in names)

## Completeness

- [ ] **Color palette** - Full color scales present (50-950 for each hue)
- [ ] **Semantic colors** - Text, background, border, surface, interactive colors defined
- [ ] **State colors** - Success, warning, danger, info semantic colors present
- [ ] **Typography scale** - Font sizes from xs through 4xl defined
- [ ] **Font weights** - Regular, medium, semibold, bold weights defined
- [ ] **Spacing scale** - Consistent spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)
- [ ] **Border radii** - None, sm, md, lg, full radius tokens present
- [ ] **Shadows** - Elevation levels defined (sm, md, lg, xl)
- [ ] **Z-index** - Z-index scale defined to avoid magic numbers

## Semantic Grouping

- [ ] **References resolve** - All semantic tokens reference primitives correctly (e.g., `{color.blue.500}`)
- [ ] **No circular references** - No token references itself directly or indirectly
- [ ] **Theme-ready** - Semantic tokens can be overridden per theme without changing primitives
- [ ] **Consistent structure** - Same structure used across all token categories

## W3C DTCG Compliance

- [ ] **$value present** - Every token has a `$value` field
- [ ] **$type present** - Every token has a `$type` field matching DTCG types
- [ ] **$description present** - Tokens include `$description` for documentation
- [ ] **Valid types** - $type values are DTCG-compliant (color, dimension, fontFamily, fontWeight, duration, cubicBezier, number, strokeStyle, border, transition, shadow, gradient, typography, fontStyle)

## Platform Coverage

- [ ] **CSS Custom Properties** - Tokens compile to valid CSS `--` variables
- [ ] **Tailwind Config** - Tokens produce valid Tailwind theme extension
- [ ] **SCSS Variables** - Tokens compile to valid SCSS `$` variables

## Verdict Criteria

| Verdict | Criteria |
|---------|----------|
| **PASS** | All 25 items checked |
| **CONCERNS** | 20-24 items checked, issues are minor |
| **FAIL** | <20 items checked or any DTCG compliance items unchecked |

## Common Issues

1. **Missing $type** - Add `$type` to every token definition
2. **Unresolved reference** - Check referenced token exists in the tree
3. **Hardcoded value in semantic** - Semantic tokens should reference primitives, not raw values
4. **Inconsistent scale** - Ensure spacing/typography scales follow consistent progression
5. **Missing description** - Add `$description` for documentation generation

---
*Design System Squad Checklist*
