'use strict';

const { resolveLayout } = require('../src/index');

describe('integration tests', () => {
  describe('Stray Innocence -> ETHEREAL', () => {
    const input = {
      archetypes: ['Innocent', 'Dreamer', 'Creator'],
      personalityTraits: {
        formalCasual: 2,
        traditionalModern: 2,
        seriousPlayful: 2,
        conservativeBold: 1,
        minimalExpressive: 1,
      },
    };

    it('resolves to ethereal family', () => {
      const result = resolveLayout(input);
      expect(result.family).toBe('ethereal');
    });

    it('returns valid tokens object', () => {
      const result = resolveLayout(input);
      expect(result.tokens).toHaveProperty('layout');
      expect(result.tokens.layout).toHaveProperty('family');
      expect(result.tokens.layout.family.name.$value).toBe('ethereal');
    });

    it('returns scoring breakdown', () => {
      const result = resolveLayout(input);
      expect(result.scoring).toHaveProperty('family', 'ethereal');
      expect(result.scoring).toHaveProperty('scores');
      expect(result.scoring).toHaveProperty('method', 'archetype-weighted');
      expect(result.scoring.scores['ethereal']).toBeGreaterThan(0);
    });
  });

  describe('Nova Vista Cafe -> ADVENTUROUS-OPEN', () => {
    const input = {
      archetypes: ['Explorer', 'Creator'],
      personalityTraits: {
        formalCasual: 4,
        traditionalModern: 4,
        seriousPlayful: 3,
        conservativeBold: 4,
        minimalExpressive: 4,
      },
    };

    it('resolves to adventurous-open family', () => {
      const result = resolveLayout(input);
      expect(result.family).toBe('adventurous-open');
    });

    it('tokens reflect adventurous-open characteristics', () => {
      const result = resolveLayout(input);
      const layout = result.tokens.layout;
      expect(layout.family.name.$value).toBe('adventurous-open');
      // adventurous-open has generous whitespace density
      expect(layout.whitespace.density.$value).toBe('generous');
    });
  });

  describe('determinism: same input always produces same output', () => {
    const input = {
      archetypes: ['Rebel', 'Hero', 'Explorer'],
      personalityTraits: {
        formalCasual: 4,
        traditionalModern: 5,
        seriousPlayful: 4,
        conservativeBold: 5,
        minimalExpressive: 3,
      },
    };

    it('produces identical output across 10 runs', () => {
      const first = resolveLayout(input);
      const firstJson = JSON.stringify(first);

      for (let i = 0; i < 10; i++) {
        const result = resolveLayout(input);
        expect(JSON.stringify(result)).toBe(firstJson);
      }
    });
  });

  describe('full pipeline: resolveLayout() returns valid LayoutEngineOutput', () => {
    const input = {
      archetypes: ['Jester', 'Magician'],
      personalityTraits: {
        formalCasual: 5,
        traditionalModern: 4,
        seriousPlayful: 5,
        conservativeBold: 3,
        minimalExpressive: 4,
      },
    };

    it('returns family as a string', () => {
      const result = resolveLayout(input);
      expect(typeof result.family).toBe('string');
      expect(result.family.length).toBeGreaterThan(0);
    });

    it('returns tokens with layout wrapper', () => {
      const result = resolveLayout(input);
      expect(result.tokens).toHaveProperty('layout');
    });

    it('returns scoring with family, scores, method', () => {
      const result = resolveLayout(input);
      expect(result.scoring.family).toBe(result.family);
      expect(typeof result.scoring.scores).toBe('object');
      expect(result.scoring.method).toBe('archetype-weighted');
    });

    it('all 6 families have scores in scoring breakdown', () => {
      const result = resolveLayout(input);
      const families = ['ethereal', 'bold-structured', 'warm-artisan', 'adventurous-open', 'playful-dynamic', 'rebel-edge'];
      for (const f of families) {
        expect(result.scoring.scores).toHaveProperty(f);
        expect(typeof result.scoring.scores[f]).toBe('number');
      }
    });

    it('all token categories are present', () => {
      const result = resolveLayout(input);
      const layout = result.tokens.layout;
      const categories = ['family', 'corner', 'whitespace', 'nav', 'divider', 'animation', 'grid', 'section', 'component'];
      for (const cat of categories) {
        expect(layout[cat]).toBeDefined();
      }
    });

    it('every emitted token has $value, $type, $description', () => {
      const result = resolveLayout(input);
      const layout = result.tokens.layout;
      for (const [catName, category] of Object.entries(layout)) {
        for (const [tokenName, token] of Object.entries(category)) {
          expect(token.$value).toBeDefined();
          expect(token.$type).toBeDefined();
          expect(token.$description).toBeDefined();
        }
      }
    });
  });

  describe('input validation', () => {
    it('throws on null input', () => {
      expect(() => resolveLayout(null)).toThrow('LayoutEngineInput is required');
    });

    it('throws on non-array archetypes', () => {
      expect(() => resolveLayout({
        archetypes: 'Innocent',
        personalityTraits: { formalCasual: 3, traditionalModern: 3, seriousPlayful: 3, conservativeBold: 3, minimalExpressive: 3 },
      })).toThrow('archetypes must be an array');
    });

    it('throws on missing personalityTraits', () => {
      expect(() => resolveLayout({
        archetypes: ['Innocent'],
      })).toThrow('personalityTraits is required');
    });

    it('throws on trait value out of range', () => {
      expect(() => resolveLayout({
        archetypes: ['Innocent'],
        personalityTraits: { formalCasual: 0, traditionalModern: 3, seriousPlayful: 3, conservativeBold: 3, minimalExpressive: 3 },
      })).toThrow('formalCasual must be a number between 1 and 5');
    });

    it('throws on trait value above 5', () => {
      expect(() => resolveLayout({
        archetypes: ['Innocent'],
        personalityTraits: { formalCasual: 3, traditionalModern: 6, seriousPlayful: 3, conservativeBold: 3, minimalExpressive: 3 },
      })).toThrow('traditionalModern must be a number between 1 and 5');
    });
  });
});
