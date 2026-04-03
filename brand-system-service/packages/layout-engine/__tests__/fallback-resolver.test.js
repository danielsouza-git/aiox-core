'use strict';

const { resolveLayoutTokens } = require('../src/fallback-resolver');

describe('fallback-resolver', () => {
  describe('feature flag disabled', () => {
    it('returns source=disabled and tokens=null when enabled is false', () => {
      const result = resolveLayoutTokens({
        layoutBrief: { tokens: { some: 'data' } },
        brandProfile: { personality: { archetypes: ['Innocent'] } },
        featureFlags: { enabled: false },
      });
      expect(result.source).toBe('disabled');
      expect(result.tokens).toBeNull();
      expect(result.family).toBeNull();
    });

    it('returns source=disabled when featureFlags is null', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: null,
        featureFlags: null,
      });
      expect(result.source).toBe('disabled');
      expect(result.tokens).toBeNull();
    });

    it('returns source=disabled when featureFlags is undefined', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: null,
        featureFlags: undefined,
      });
      expect(result.source).toBe('disabled');
    });
  });

  describe('AI brief present (source=ai)', () => {
    it('uses brief tokens when layoutBrief has tokens property', () => {
      const briefTokens = { layout: { family: { name: { $value: 'ethereal' } } } };
      const result = resolveLayoutTokens({
        layoutBrief: {
          tokens: briefTokens,
          family_suggestion: { primary: 'ethereal' },
        },
        brandProfile: null,
        featureFlags: { enabled: true, fallbackOnly: false },
      });
      expect(result.source).toBe('ai');
      expect(result.tokens).toBe(briefTokens);
      expect(result.family).toBe('ethereal');
    });

    it('uses layoutBrief itself when no tokens property', () => {
      const brief = { layout: { family: { name: { $value: 'bold-structured' } } } };
      const result = resolveLayoutTokens({
        layoutBrief: brief,
        brandProfile: null,
        featureFlags: { enabled: true, fallbackOnly: false },
      });
      expect(result.source).toBe('ai');
      expect(result.tokens).toBe(brief);
    });

    it('returns family=unknown when no family_suggestion', () => {
      const result = resolveLayoutTokens({
        layoutBrief: { layout: {} },
        brandProfile: null,
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('ai');
      expect(result.family).toBe('unknown');
    });
  });

  describe('fallbackOnly=true ignores brief', () => {
    it('uses fallback engine even when brief exists', () => {
      const result = resolveLayoutTokens({
        layoutBrief: { tokens: { some: 'ai-data' }, family_suggestion: { primary: 'ethereal' } },
        brandProfile: {
          personality: {
            archetypes: ['Innocent', 'Dreamer', 'Creator'],
            traits: {
              formal_casual: 2,
              traditional_modern: 2,
              serious_playful: 2,
              conservative_bold: 1,
              minimal_expressive: 1,
            },
          },
        },
        featureFlags: { enabled: true, fallbackOnly: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
      expect(result.tokens).toHaveProperty('layout');
    });
  });

  describe('no brief + brand profile (source=fallback)', () => {
    it('calls resolveLayout with brand profile archetypes and traits', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: {
          personality: {
            archetypes: ['Explorer', 'Creator'],
            traits: {
              formal_casual: 4,
              traditional_modern: 4,
              serious_playful: 3,
              conservative_bold: 4,
              minimal_expressive: 4,
            },
          },
        },
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.tokens).toBeDefined();
      expect(result.tokens).toHaveProperty('layout');
      expect(result.family).toBe('adventurous-open');
    });

    it('defaults missing traits to 3', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: {
          personality: {
            archetypes: ['Ruler'],
            traits: {},
          },
        },
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.tokens).toHaveProperty('layout');
      // With all-3 traits, Ruler primary is bold-structured
      expect(result.family).toBe('bold-structured');
    });

    it('defaults missing traits object to all 3s', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: {
          personality: {
            archetypes: ['Rebel'],
          },
        },
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('rebel-edge');
    });
  });

  describe('Stray Innocence profile fallback -> ETHEREAL', () => {
    it('resolves to ethereal family', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: {
          personality: {
            archetypes: ['Innocent', 'Dreamer', 'Creator'],
            traits: {
              formal_casual: 2,
              traditional_modern: 2,
              serious_playful: 2,
              conservative_bold: 1,
              minimal_expressive: 1,
            },
          },
        },
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
    });
  });

  describe('Nova Vista profile fallback -> ADVENTUROUS-OPEN', () => {
    it('resolves to adventurous-open family', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: {
          personality: {
            archetypes: ['Explorer', 'Creator'],
            traits: {
              formal_casual: 4,
              traditional_modern: 4,
              serious_playful: 3,
              conservative_bold: 4,
              minimal_expressive: 4,
            },
          },
        },
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('adventurous-open');
    });
  });

  describe('no brief + no profile (source=default)', () => {
    it('returns source=default with null tokens and bold-structured family', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: null,
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('default');
      expect(result.tokens).toBeNull();
      expect(result.family).toBe('bold-structured');
    });

    it('returns default when brandProfile has no personality', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: { name: 'Test Brand' },
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('default');
    });

    it('returns default when brandProfile.personality has no archetypes', () => {
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: { personality: { traits: {} } },
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('default');
    });
  });
});
