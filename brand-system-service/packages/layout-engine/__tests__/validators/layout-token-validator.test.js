'use strict';

const { validateLayoutTokens, REQUIRED_TOKEN_PATHS, VALID_TYPES } = require('../../src/validators/layout-token-validator');
const { resolveLayout } = require('../../src/index');

describe('layout-token-validator', () => {
  // Generate valid tokens from the layout engine for use in tests
  const validInput = {
    archetypes: ['Innocent', 'Dreamer'],
    personalityTraits: {
      formalCasual: 2,
      traditionalModern: 2,
      seriousPlayful: 2,
      conservativeBold: 1,
      minimalExpressive: 1,
    },
  };

  function getValidTokens() {
    return resolveLayout(validInput).tokens;
  }

  describe('valid DTCG tokens pass', () => {
    it('passes validation for layout-engine-generated tokens', () => {
      const tokens = getValidTokens();
      const result = validateLayoutTokens(tokens);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('passes for all 6 families', () => {
      const families = [
        { archetypes: ['Innocent', 'Dreamer'], traits: { formalCasual: 2, traditionalModern: 2, seriousPlayful: 2, conservativeBold: 1, minimalExpressive: 1 } },
        { archetypes: ['Ruler', 'Hero'], traits: { formalCasual: 1, traditionalModern: 3, seriousPlayful: 1, conservativeBold: 3, minimalExpressive: 2 } },
        { archetypes: ['Creator', 'Caregiver'], traits: { formalCasual: 3, traditionalModern: 2, seriousPlayful: 3, conservativeBold: 3, minimalExpressive: 3 } },
        { archetypes: ['Explorer', 'Sage'], traits: { formalCasual: 4, traditionalModern: 4, seriousPlayful: 3, conservativeBold: 4, minimalExpressive: 4 } },
        { archetypes: ['Jester', 'Magician'], traits: { formalCasual: 5, traditionalModern: 4, seriousPlayful: 5, conservativeBold: 3, minimalExpressive: 4 } },
        { archetypes: ['Rebel', 'Outlaw'], traits: { formalCasual: 4, traditionalModern: 5, seriousPlayful: 4, conservativeBold: 5, minimalExpressive: 3 } },
      ];

      for (const { archetypes, traits } of families) {
        const result = resolveLayout({ archetypes, personalityTraits: traits });
        const validation = validateLayoutTokens(result.tokens);
        expect(validation.valid).toBe(true);
      }
    });
  });

  describe('missing required paths fail', () => {
    it('fails when layout key is missing', () => {
      const result = validateLayoutTokens({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Tokens must have a "layout" top-level key');
    });

    it('fails when a required token path is missing', () => {
      const tokens = getValidTokens();
      // Remove corner.radiusBase
      delete tokens.layout.corner.radiusBase;
      const result = validateLayoutTokens(tokens);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('layout.corner.radiusBase'))).toBe(true);
    });

    it('fails when entire category is missing', () => {
      const tokens = getValidTokens();
      delete tokens.layout.animation;
      const result = validateLayoutTokens(tokens);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('layout.animation'))).toBe(true);
    });
  });

  describe('invalid $type fail', () => {
    it('fails when $type is not in VALID_TYPES', () => {
      const tokens = getValidTokens();
      tokens.layout.corner.radiusBase.$type = 'invalid-type';
      const result = validateLayoutTokens(tokens);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('invalid $type'))).toBe(true);
    });
  });

  describe('missing $value fail', () => {
    it('fails when $value is missing from a token', () => {
      const tokens = getValidTokens();
      delete tokens.layout.nav.style.$value;
      const result = validateLayoutTokens(tokens);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('missing $value'))).toBe(true);
    });
  });

  describe('missing $description fail', () => {
    it('fails when $description is missing from a token', () => {
      const tokens = getValidTokens();
      delete tokens.layout.grid.rhythm.$description;
      const result = validateLayoutTokens(tokens);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('missing $description'))).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('fails for null input', () => {
      const result = validateLayoutTokens(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Tokens must be a non-null object');
    });

    it('fails for undefined input', () => {
      const result = validateLayoutTokens(undefined);
      expect(result.valid).toBe(false);
    });

    it('fails for non-object input', () => {
      const result = validateLayoutTokens('string');
      expect(result.valid).toBe(false);
    });

    it('reports all errors, not just the first', () => {
      const tokens = getValidTokens();
      delete tokens.layout.corner;
      delete tokens.layout.whitespace;
      const result = validateLayoutTokens(tokens);
      expect(result.valid).toBe(false);
      // Should have errors for all missing corner and whitespace tokens
      expect(result.errors.length).toBeGreaterThan(3);
    });
  });

  describe('constants', () => {
    it('REQUIRED_TOKEN_PATHS contains expected paths', () => {
      expect(REQUIRED_TOKEN_PATHS).toContain('layout.family.name');
      expect(REQUIRED_TOKEN_PATHS).toContain('layout.corner.radiusBase');
      expect(REQUIRED_TOKEN_PATHS).toContain('layout.nav.style');
    });

    it('VALID_TYPES contains standard DTCG types', () => {
      expect(VALID_TYPES).toContain('string');
      expect(VALID_TYPES).toContain('number');
      expect(VALID_TYPES).toContain('dimension');
      expect(VALID_TYPES).toContain('duration');
      expect(VALID_TYPES).toContain('cubicBezier');
    });
  });
});
