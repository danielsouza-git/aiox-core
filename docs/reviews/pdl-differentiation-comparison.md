# Differentiation Comparison: Stray Innocence vs Nova Vista Cafe (PDL-6)

**Date:** 2026-04-02
**Status:** PASS -- Full differentiation achieved (7/7 dimensions)
**Stories:** PDL-5 (Stray Innocence), PDL-6 (Nova Vista Cafe)

## Brand Profiles

| Attribute | Stray Innocence | Nova Vista Cafe |
|-----------|----------------|-----------------|
| Industry | Fashion | Food & Beverage |
| Primary Archetype | Innocent | Explorer |
| Secondary Archetypes | Dreamer, Creator | Creator |
| formal_casual | 2 | 2 |
| traditional_modern | 2 | 4 |
| serious_playful | 2 | 3 |
| conservative_bold | 1 | 4 |
| minimal_expressive | 1 | 4 |

## Family Resolution

| Brand | Resolved Family | Score | Runner-up | Score |
|-------|----------------|-------|-----------|-------|
| Stray Innocence | **ETHEREAL** | ~1.8 | warm-artisan | ~0.8 |
| Nova Vista Cafe | **ADVENTUROUS-OPEN** | 1.2 | warm-artisan | 0.9 |

## Side-by-Side Token Comparison

| Dimension | Stray Innocence (ETHEREAL) | Nova Vista Cafe (ADVENTUROUS-OPEN) | Different? |
|-----------|---------------------------|-------------------------------------|:----------:|
| **Navigation** | centered-top | sticky-minimal | YES |
| **Corner Radius** | 12px (modulated from 24px) | 3px (modulated from 6px) | YES |
| **Whitespace Density** | spacious | generous | YES |
| **Whitespace Multiplier** | 1.8 (modulated from 1.5) | 1.17 (modulated from 1.3) | YES |
| **Dividers** | organic-wave | thin-geometric | YES |
| **Animation Entrance** | fade-up | scroll-reveal | YES |
| **Animation Duration** | 300ms | 280ms | YES |
| **Grid Rhythm** | centered-single | editorial-wide | YES |
| **Grid Max Width** | 800px | 1200px | YES |
| **Grid Columns** | 1 | 2 | YES |
| **Section Background** | soft-fill | full-bleed-image | YES |
| **Hero Height** | 60vh | 80vh | YES |
| **Card Shape** | pill | subtle | YES |

**Differentiation Score: 7/7 key dimensions (100%)**

## Visual DNA Comparison

### Stray Innocence (ETHEREAL)
- Soft, centered, dreamlike aesthetic
- Single-column centered reading flow
- Organic wave dividers, pill-shaped elements
- Spacious breathing room (1.5x base, modulated to 1.8x)
- Gentle fade-up entrance animations
- Soft-fill alternating section backgrounds

### Nova Vista Cafe (ADVENTUROUS-OPEN)
- Expansive, scroll-driven, discovery-oriented aesthetic
- Wide two-column editorial layout
- Thin geometric dividers with angular accents
- Generous but active spacing (1.3x base, modulated to 1.17x)
- Scroll-reveal entrance animations with subtle scale
- Full-bleed image backgrounds for immersive experience

## CSS Output Comparison

The generated CSS for both brands produces completely different class sets:

| CSS Component | Stray Innocence | Nova Vista Cafe |
|--------------|----------------|-----------------|
| Nav class | `.layout-nav--centered-top` | `.layout-nav--sticky-minimal` |
| Divider class | `.layout-divider--organic-wave` | `.layout-divider--thin-geometric` |
| Animation keyframes | `@keyframes layout-fade-up` | `@keyframes layout-scroll-reveal` |
| Grid class | `.layout-grid--centered-single` | `.layout-grid--editorial-wide` |
| Section BG class | `.layout-section-bg--soft-fill` | `.layout-section-bg--full-bleed-image` |
| Custom properties | `--layout-corner-radius: 24px` | `--layout-corner-radius: 6px` |

## Conclusion

The Personality-Driven Layout pipeline successfully differentiates two brands with distinct personality profiles, producing visually unique layout skeletons from the same code pipeline. All 7 key layout dimensions differ between the two brands, confirming the system's ability to generate brand-specific layouts purely from personality data.

This validates the core value proposition: **same pipeline, different brands, different outputs**.

## Test Evidence

- `differentiation.test.js`: 22 tests, all passing
  - Family resolution: both brands resolve to expected families
  - Per-dimension comparison: all 7 dimensions differ
  - Threshold check: >=5 of 7 differ (actual: 7/7)
  - CSS string comparison: outputs are fully distinct
  - Scoring breakdown: winning families match expected
