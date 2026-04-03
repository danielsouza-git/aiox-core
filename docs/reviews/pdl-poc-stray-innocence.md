# PDL PoC Report: Stray Innocence AI-Generated Brand Book

**Date:** 2026-04-02
**Story:** PDL-5
**Epic:** EPIC-BSS-D (Personality-Driven Layouts)
**Status:** PASS

---

## Brand Profile

| Field | Value |
|-------|-------|
| Brand | Stray Innocence |
| Industry | Fashion |
| Archetypes | Innocent (primary), Dreamer, Creator |
| formalCasual | 2 |
| traditionalModern | 3 |
| seriousPlayful | 3 |
| conservativeBold | 2 |
| minimalExpressive | 3 |

## Family Resolution

| Metric | Value |
|--------|-------|
| Expected family | ETHEREAL |
| Actual family | ETHEREAL |
| Winning score | 1.8 |
| Runner-up | warm-artisan (0.6) |
| Scoring method | archetype-weighted |
| Confidence (brief) | 0.92 |

### Full Scoring Breakdown

| Family | Score |
|--------|-------|
| ethereal | 1.8 |
| warm-artisan | 0.6 |
| bold-structured | 0.3 |
| adventurous-open | 0.18 |
| playful-dynamic | 0.09 |
| rebel-edge | 0.0 |

## 7 Dimensions Comparison

| Dimension | Expected (Brief) | Actual (Engine) | Match |
|-----------|-------------------|-----------------|-------|
| Navigation | centered-top | centered-top | PASS |
| Whitespace density | spacious (1.5x) | spacious (1.5x) | PASS |
| Corner radius | 24px (pre-modulation) | 12px (post-modulation, formalCasual=2 applies 0.5x) | PASS (*) |
| Divider style | organic-wave | organic-wave | PASS |
| Animation | fade-up (300ms) | fade-up (300ms) | PASS |
| Grid rhythm | centered-single (800px, 1 col) | centered-single (800px, 1 col) | PASS |
| Section background | soft-fill (60vh hero) | soft-fill (60vh hero) | PASS |

(*) Corner radius note: The brief records the ETHEREAL family base value (24px). The engine's personality modulator applies a 0.5x factor when formalCasual<=2, producing 12px in the final tokens. Both values are correct for their context. The engine's modulation is working as designed.

## Additional Token Verification

| Token | Expected | Actual |
|-------|----------|--------|
| component.cardShape | pill | pill |
| component.shadowIntensity | light | light |
| whitespace.sectionGap | 96px | 96px |
| whitespace.contentPadding | 80px | 80px |
| animation.easing | cubic-bezier(...) | cubic-bezier(0.25, 0.1, 0.25, 1.0) |
| section.heroHeight | 60vh | 60vh |

## Test Results

| Suite | Tests | Passed | Failed |
|-------|-------|--------|--------|
| Family resolution | 3 | 3 | 0 |
| ETHEREAL layout tokens | 13 | 13 | 0 |
| Layout CSS generation | 3 | 3 | 0 |
| Layout brief parsing | 5 | 5 | 0 |
| Generated layout.json | 4 | 4 | 0 |
| Determinism | 1 | 1 | 0 |
| **Total** | **30** | **30** | **0** |

## Pipeline Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Brand profile | `brand-system-service/brands/stray-innocence/brand-profile.yaml` | Created |
| Visual references | `brand-system-service/brands/stray-innocence/visual-references.md` | Created (PoC mock) |
| Layout brief | `brand-system-service/brands/stray-innocence/layout-brief.md` | Created |
| Layout tokens | `brand-system-service/brands/stray-innocence/tokens/layout/layout.json` | Generated (W3C DTCG) |
| Integration tests | `brand-system-service/packages/layout-engine/__tests__/poc/stray-innocence.test.js` | 30/30 PASS |

## Conclusion

The PDL pipeline correctly resolves Stray Innocence to the ETHEREAL layout family with all 7 visual dimensions matching expectations. The personality modulator correctly adjusts tokens based on trait values. The layout brief parser and validator work end-to-end. All 30 tests pass deterministically.

**Verdict: PASS**
