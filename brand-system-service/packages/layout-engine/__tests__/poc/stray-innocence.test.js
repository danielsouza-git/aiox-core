'use strict';

const path = require('path');
const fs = require('fs');
const {
  resolveLayout,
  parseBrief,
  extractRecommendations,
  extractFamilySuggestion,
  generateLayoutCSS,
  generateNavCSS,
  generateCustomProperties,
} = require('../../src/index');
const { validateBriefOutput } = require('../../src/validators/brief-output-validator');

/**
 * PDL-5 PoC: Stray Innocence AI-Generated Brand Book
 *
 * Validates that the full PDL pipeline produces ETHEREAL family
 * for the Stray Innocence brand profile:
 *   Archetypes: Innocent (primary), Dreamer, Creator
 *   Traits: formalCasual=2, traditionalModern=3, seriousPlayful=3,
 *           conservativeBold=2, minimalExpressive=3
 *
 * Expected: ETHEREAL family with centered-top nav, spacious whitespace,
 *           organic-wave dividers, fade-up animations, centered-single grid.
 *
 * Note on corner radius: The ETHEREAL base preset has radiusBase=24px,
 * but the personality modulator scales it by 0.5 when formalCasual<=2,
 * resulting in radiusBase=12px after modulation. The brief lists the
 * pre-modulation base (24px) while the engine output reflects the
 * post-modulation value (12px). Both are correct for their context.
 */

const STRAY_INNOCENCE_INPUT = {
  archetypes: ['Innocent', 'Dreamer', 'Creator'],
  personalityTraits: {
    formalCasual: 2,
    traditionalModern: 3,
    seriousPlayful: 3,
    conservativeBold: 2,
    minimalExpressive: 3,
  },
  buildType: 'brand-book',
};

describe('PDL-5 PoC: Stray Innocence', () => {
  let result;

  beforeAll(() => {
    result = resolveLayout(STRAY_INNOCENCE_INPUT);
  });

  // --- Task 5: Family resolution ---

  describe('family resolution', () => {
    it('resolves to ethereal family', () => {
      expect(result.family).toBe('ethereal');
    });

    it('ethereal has the highest score in scoring breakdown', () => {
      const scores = result.scoring.scores;
      const etherealScore = scores['ethereal'];
      for (const [family, score] of Object.entries(scores)) {
        if (family !== 'ethereal') {
          expect(etherealScore).toBeGreaterThan(score);
        }
      }
    });

    it('scoring method is archetype-weighted', () => {
      expect(result.scoring.method).toBe('archetype-weighted');
    });
  });

  // --- Task 6: Layout token assertions ---

  describe('ETHEREAL layout tokens', () => {
    it('nav.style is centered-top', () => {
      expect(result.tokens.layout.nav.style.$value).toBe('centered-top');
    });

    it('corner.radiusBase is 12px (24px base modulated by formalCasual=2 factor 0.5)', () => {
      expect(result.tokens.layout.corner.radiusBase.$value).toBe('12px');
    });

    it('whitespace.density is spacious', () => {
      expect(result.tokens.layout.whitespace.density.$value).toBe('spacious');
    });

    it('whitespace.multiplier is 1.5', () => {
      expect(result.tokens.layout.whitespace.multiplier.$value).toBe(1.5);
    });

    it('divider.style is organic-wave', () => {
      expect(result.tokens.layout.divider.style.$value).toBe('organic-wave');
    });

    it('animation.entrance is fade-up', () => {
      expect(result.tokens.layout.animation.entrance.$value).toBe('fade-up');
    });

    it('animation.duration is 300ms', () => {
      expect(result.tokens.layout.animation.duration.$value).toBe('300ms');
    });

    it('grid.rhythm is centered-single', () => {
      expect(result.tokens.layout.grid.rhythm.$value).toBe('centered-single');
    });

    it('grid.maxWidth is 800px', () => {
      expect(result.tokens.layout.grid.maxWidth.$value).toBe('800px');
    });

    it('grid.columns is 1', () => {
      expect(result.tokens.layout.grid.columns.$value).toBe(1);
    });

    it('section.background is soft-fill', () => {
      expect(result.tokens.layout.section.background.$value).toBe('soft-fill');
    });

    it('section.heroHeight is 60vh', () => {
      expect(result.tokens.layout.section.heroHeight.$value).toBe('60vh');
    });

    it('component.cardShape is pill', () => {
      expect(result.tokens.layout.component.cardShape.$value).toBe('pill');
    });
  });

  // --- Task 7: CSS generation ---

  describe('layout CSS generation', () => {
    it('generateCustomProperties produces CSS with --layout-corner-radius containing 12', () => {
      const layout = {
        family: 'ethereal',
        navigation: { style: 'centered-top' },
        whitespace: { density: 'spacious', multiplier: 1.5, section_gap: '96px', content_padding: '80px' },
        corners: { radius_base: '12px', treatment: 'pill' },
        dividers: { style: 'organic-wave' },
        grid: { rhythm: 'centered-single', max_width: '800px', columns: 1 },
        animation: { entrance: 'fade-up', duration: '300ms' },
        sections: { background: 'soft-fill', hero_height: '60vh' },
      };
      const css = generateCustomProperties(layout);
      expect(css).toContain('--layout-corner-radius: 12px');
    });

    it('generateNavCSS produces centered-top nav CSS', () => {
      const css = generateNavCSS('centered-top');
      expect(css).toContain('centered-top');
      expect(css).toContain('justify-content: center');
    });

    it('generateLayoutCSS produces complete CSS with ETHEREAL properties', () => {
      const layout = {
        family: 'ethereal',
        navigation: { style: 'centered-top' },
        whitespace: { density: 'spacious', multiplier: 1.5, section_gap: '96px', content_padding: '80px' },
        corners: { radius_base: '12px', treatment: 'pill' },
        dividers: { style: 'organic-wave' },
        grid: { rhythm: 'centered-single', max_width: '800px', columns: 1 },
        animation: { entrance: 'fade-up', duration: '300ms' },
        sections: { background: 'soft-fill', hero_height: '60vh' },
      };
      const css = generateLayoutCSS(layout);
      expect(css).toContain('centered-top');
      expect(css).toContain('organic-wave');
      expect(css).toContain('fade-up');
      expect(css).toContain('centered-single');
      expect(css).toContain('soft-fill');
    });
  });

  // --- Task 8: Brief parsing and validation ---

  describe('layout brief parsing', () => {
    const briefPath = path.resolve(
      __dirname,
      '../../../../brands/stray-innocence/layout-brief.md'
    );

    let briefContent;

    beforeAll(() => {
      briefContent = fs.readFileSync(briefPath, 'utf8');
    });

    it('brief file exists', () => {
      expect(fs.existsSync(briefPath)).toBe(true);
    });

    it('parseBrief can parse the layout-brief.md', () => {
      const parsed = parseBrief(briefContent);
      expect(parsed).not.toBeNull();
      expect(parsed.brand).toBe('Stray Innocence');
    });

    it('extractFamilySuggestion returns ethereal primary', () => {
      const parsed = parseBrief(briefContent);
      const suggestion = extractFamilySuggestion(parsed);
      expect(suggestion).not.toBeNull();
      expect(suggestion.primary).toBe('ethereal');
      expect(suggestion.fallback).toBe('warm-artisan');
      expect(suggestion.confidence).toBe(0.92);
    });

    it('extractRecommendations returns all 7 sections', () => {
      const parsed = parseBrief(briefContent);
      const rec = extractRecommendations(parsed);
      expect(rec).not.toBeNull();
      expect(rec.navigation).toBeDefined();
      expect(rec.whitespace).toBeDefined();
      expect(rec.corners).toBeDefined();
      expect(rec.dividers).toBeDefined();
      expect(rec.grid).toBeDefined();
      expect(rec.animation).toBeDefined();
      expect(rec.sections).toBeDefined();
    });

    it('brief validator validates the brief successfully', () => {
      const parsed = parseBrief(briefContent);
      // parseBrief already validates internally; if it returned non-null, it passed.
      // Double-check with direct validator call.
      const validation = validateBriefOutput(parsed);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  // --- Generated layout.json validation ---

  describe('generated layout.json', () => {
    const layoutJsonPath = path.resolve(
      __dirname,
      '../../../../brands/stray-innocence/tokens/layout/layout.json'
    );

    let layoutData;

    beforeAll(() => {
      const raw = fs.readFileSync(layoutJsonPath, 'utf8');
      layoutData = JSON.parse(raw);
    });

    it('layout.json file exists', () => {
      expect(fs.existsSync(layoutJsonPath)).toBe(true);
    });

    it('has layout wrapper object', () => {
      expect(layoutData).toHaveProperty('layout');
    });

    it('family name is ethereal', () => {
      expect(layoutData.layout.family.name.$value).toBe('ethereal');
    });

    it('is valid W3C DTCG format (every token has $value, $type, $description)', () => {
      const layout = layoutData.layout;
      for (const [catName, category] of Object.entries(layout)) {
        for (const [tokenName, token] of Object.entries(category)) {
          expect(token).toHaveProperty('$value');
          expect(token).toHaveProperty('$type');
          expect(token).toHaveProperty('$description');
        }
      }
    });

    it('matches engine output exactly', () => {
      const engineResult = resolveLayout(STRAY_INNOCENCE_INPUT);
      expect(layoutData).toEqual(engineResult.tokens);
    });
  });

  // --- Determinism ---

  describe('determinism', () => {
    it('produces identical output across 20 runs', () => {
      const first = resolveLayout(STRAY_INNOCENCE_INPUT);
      const firstJson = JSON.stringify(first);

      for (let i = 0; i < 20; i++) {
        const run = resolveLayout(STRAY_INNOCENCE_INPUT);
        expect(JSON.stringify(run)).toBe(firstJson);
      }
    });
  });
});
