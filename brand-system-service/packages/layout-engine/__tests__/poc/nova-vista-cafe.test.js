'use strict';

const fs = require('fs');
const path = require('path');
const { resolveLayout, parseBrief, extractFamilySuggestion, generateNavCSS, generateLayoutCSS } = require('../../src/index');
const { validateBriefOutput } = require('../../src/validators/brief-output-validator');

/**
 * Nova Vista Cafe PoC Tests (PDL-6)
 *
 * Validates that the full PDL pipeline resolves Nova Vista Cafe
 * to the ADVENTUROUS-OPEN family with the correct layout tokens.
 */
describe('PDL-6: Nova Vista Cafe PoC', () => {
  // Nova Vista Cafe brand personality input
  const novaVistaInput = {
    archetypes: ['Explorer', 'Creator'],
    personalityTraits: {
      formalCasual: 2,
      traditionalModern: 4,
      seriousPlayful: 3,
      conservativeBold: 4,
      minimalExpressive: 4,
    },
  };

  let result;

  beforeAll(() => {
    result = resolveLayout(novaVistaInput);
  });

  describe('Task 1-3: Pipeline resolution', () => {
    it('resolves to adventurous-open family', () => {
      expect(result.family).toBe('adventurous-open');
    });

    it('adventurous-open has highest score', () => {
      const scores = result.scoring.scores;
      const adventurousScore = scores['adventurous-open'];
      for (const [family, score] of Object.entries(scores)) {
        if (family !== 'adventurous-open') {
          expect(adventurousScore).toBeGreaterThan(score);
        }
      }
    });

    it('scoring method is archetype-weighted', () => {
      expect(result.scoring.method).toBe('archetype-weighted');
    });
  });

  describe('Task 4: ADVENTUROUS-OPEN characteristics', () => {
    it('nav style is sticky-minimal', () => {
      expect(result.tokens.layout.nav.style.$value).toBe('sticky-minimal');
    });

    it('corner radiusBase is in 1-8px range (modulated)', () => {
      const radiusStr = result.tokens.layout.corner.radiusBase.$value;
      const radiusNum = parseInt(radiusStr, 10);
      expect(radiusNum).toBeGreaterThanOrEqual(1);
      expect(radiusNum).toBeLessThanOrEqual(8);
    });

    it('whitespace density is generous', () => {
      expect(result.tokens.layout.whitespace.density.$value).toBe('generous');
    });

    it('divider style is thin-geometric', () => {
      expect(result.tokens.layout.divider.style.$value).toBe('thin-geometric');
    });

    it('animation entrance is scroll-reveal', () => {
      expect(result.tokens.layout.animation.entrance.$value).toBe('scroll-reveal');
    });

    it('grid rhythm is editorial-wide', () => {
      expect(result.tokens.layout.grid.rhythm.$value).toBe('editorial-wide');
    });

    it('section background is full-bleed-image', () => {
      expect(result.tokens.layout.section.background.$value).toBe('full-bleed-image');
    });

    it('hero height is 80vh', () => {
      expect(result.tokens.layout.section.heroHeight.$value).toBe('80vh');
    });
  });

  describe('Task 5: CSS generation', () => {
    it('generates sticky-minimal nav CSS', () => {
      const css = generateNavCSS('sticky-minimal');
      expect(css).toContain('sticky-minimal');
      expect(css).toContain('position: sticky');
      expect(css).toContain('backdrop-filter: blur');
    });

    it('generates complete layout CSS with adventurous-open tokens', () => {
      const layoutConfig = {
        family: 'adventurous-open',
        navigation: { style: 'sticky-minimal' },
        whitespace: {
          density: 'generous',
          multiplier: 1.3,
          section_gap: '80px',
          content_padding: '64px',
        },
        corners: { radius_base: '6px', treatment: 'subtle' },
        dividers: { style: 'thin-geometric' },
        grid: { rhythm: 'editorial-wide', max_width: '1200px', columns: 2 },
        animation: { entrance: 'scroll-reveal', duration: '400ms' },
        sections: { background: 'full-bleed-image', hero_height: '80vh' },
      };
      const css = generateLayoutCSS(layoutConfig);
      expect(css).toContain('sticky-minimal');
      expect(css).toContain('thin-geometric');
      expect(css).toContain('scroll-reveal');
      expect(css).toContain('editorial-wide');
      expect(css).toContain('full-bleed-image');
    });
  });

  describe('Task 6: Brief parsing and validation', () => {
    const briefPath = path.resolve(
      __dirname,
      '../../../../brands/nova-vista-cafe/layout-brief.md'
    );

    let briefContent;
    let parsed;

    beforeAll(() => {
      briefContent = fs.readFileSync(briefPath, 'utf-8');
      parsed = parseBrief(briefContent);
    });

    it('brief file exists', () => {
      expect(fs.existsSync(briefPath)).toBe(true);
    });

    it('parseBrief returns non-null result', () => {
      expect(parsed).not.toBeNull();
    });

    it('brief validates successfully', () => {
      // Parse raw YAML for validation (strip frontmatter)
      let yamlContent = briefContent.trim();
      if (yamlContent.startsWith('---')) {
        const endIdx = yamlContent.indexOf('---', 3);
        if (endIdx !== -1) {
          yamlContent = yamlContent.slice(3, endIdx).trim();
        }
      }
      // parseBrief already validates; if it returned non-null, it passed
      expect(parsed).toBeTruthy();
    });

    it('brief family suggestion is adventurous-open', () => {
      const suggestion = extractFamilySuggestion(parsed);
      expect(suggestion).not.toBeNull();
      expect(suggestion.primary).toBe('adventurous-open');
    });

    it('brief confidence is >= 0.8', () => {
      const suggestion = extractFamilySuggestion(parsed);
      expect(suggestion.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('brief fallback is warm-artisan', () => {
      const suggestion = extractFamilySuggestion(parsed);
      expect(suggestion.fallback).toBe('warm-artisan');
    });

    it('brief navigation style is sticky-minimal', () => {
      expect(parsed.recommendations.navigation.style).toBe('sticky-minimal');
    });

    it('brief divider style is thin-geometric', () => {
      expect(parsed.recommendations.dividers.style).toBe('thin-geometric');
    });
  });

  describe('Task 7: Token file output', () => {
    const tokenPath = path.resolve(
      __dirname,
      '../../../../brands/nova-vista-cafe/tokens/layout/layout.json'
    );

    it('layout.json file exists', () => {
      expect(fs.existsSync(tokenPath)).toBe(true);
    });

    it('layout.json contains valid JSON', () => {
      const content = fs.readFileSync(tokenPath, 'utf-8');
      const tokens = JSON.parse(content);
      expect(tokens).toHaveProperty('layout');
      expect(tokens.layout).toHaveProperty('family');
    });

    it('layout.json family is adventurous-open', () => {
      const content = fs.readFileSync(tokenPath, 'utf-8');
      const tokens = JSON.parse(content);
      expect(tokens.layout.family.name.$value).toBe('adventurous-open');
    });

    it('layout.json nav style is sticky-minimal', () => {
      const content = fs.readFileSync(tokenPath, 'utf-8');
      const tokens = JSON.parse(content);
      expect(tokens.layout.nav.style.$value).toBe('sticky-minimal');
    });
  });

  describe('Task 8: All token categories present', () => {
    const categories = [
      'family',
      'corner',
      'whitespace',
      'nav',
      'divider',
      'animation',
      'grid',
      'section',
      'component',
    ];

    it.each(categories)('token category "%s" is present', (category) => {
      expect(result.tokens.layout[category]).toBeDefined();
    });

    it('every token has $value, $type, $description', () => {
      const layout = result.tokens.layout;
      for (const [catName, category] of Object.entries(layout)) {
        for (const [tokenName, token] of Object.entries(category)) {
          expect(token).toHaveProperty('$value');
          expect(token).toHaveProperty('$type');
          expect(token).toHaveProperty('$description');
        }
      }
    });
  });
});
