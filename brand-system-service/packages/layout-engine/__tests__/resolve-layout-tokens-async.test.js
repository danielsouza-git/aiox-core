'use strict';

const { resolveLayoutTokensAsync } = require('../src/fallback-resolver');

// Valid W3C DTCG token structure
const VALID_AI_TOKENS = {
  layout: {
    family: {
      name: { $value: 'ethereal-dreamer', $type: 'string', $description: 'test' },
    },
    corner: {
      radiusBase: { $value: '28px', $type: 'dimension', $description: 'test' },
      radiusSmall: { $value: '16px', $type: 'dimension', $description: 'test' },
      radiusLarge: { $value: '40px', $type: 'dimension', $description: 'test' },
    },
    whitespace: {
      density: { $value: 'spacious', $type: 'string', $description: 'test' },
      multiplier: { $value: 1.6, $type: 'number', $description: 'test' },
      sectionGap: { $value: '104px', $type: 'dimension', $description: 'test' },
      contentPadding: { $value: '88px', $type: 'dimension', $description: 'test' },
    },
    nav: {
      style: { $value: 'centered-top', $type: 'string', $description: 'test' },
      width: { $value: '100%', $type: 'dimension', $description: 'test' },
      height: { $value: '72px', $type: 'dimension', $description: 'test' },
    },
    divider: {
      style: { $value: 'organic-wave', $type: 'string', $description: 'test' },
      height: { $value: '3px', $type: 'dimension', $description: 'test' },
    },
    animation: {
      entrance: { $value: 'fade-up', $type: 'string', $description: 'test' },
      duration: { $value: '400ms', $type: 'duration', $description: 'test' },
      easing: { $value: 'cubic-bezier(0.22, 0.61, 0.36, 1.0)', $type: 'cubicBezier', $description: 'test' },
    },
    grid: {
      rhythm: { $value: 'centered-single', $type: 'string', $description: 'test' },
      maxWidth: { $value: '860px', $type: 'dimension', $description: 'test' },
      columns: { $value: 1, $type: 'number', $description: 'test' },
    },
    section: {
      background: { $value: 'soft-fill', $type: 'string', $description: 'test' },
      heroHeight: { $value: '65vh', $type: 'dimension', $description: 'test' },
    },
    component: {
      cardShape: { $value: 'pill', $type: 'string', $description: 'test' },
      shadowIntensity: { $value: 'light', $type: 'string', $description: 'test' },
    },
  },
};

const MOCK_BRAND_PROFILE = {
  name: 'Stray Innocence',
  clientId: 'stray-innocence',
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
};

function createMockAiService(response) {
  return {
    generateText: jest.fn().mockResolvedValue({
      text: JSON.stringify(response || VALID_AI_TOKENS),
      provider: 'claude',
      model: 'claude-3-haiku',
      inputTokens: 500,
      outputTokens: 800,
      costUsd: 0.001,
      latencyMs: 1500,
    }),
  };
}

describe('resolveLayoutTokensAsync', () => {
  describe('feature flag disabled', () => {
    it('returns disabled when featureFlags.enabled is false', async () => {
      const result = await resolveLayoutTokensAsync({
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: false },
        aiService: createMockAiService(),
      });
      expect(result.source).toBe('disabled');
      expect(result.tokens).toBeNull();
    });

    it('returns disabled when featureFlags is null', async () => {
      const result = await resolveLayoutTokensAsync({
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: null,
      });
      expect(result.source).toBe('disabled');
    });
  });

  describe('fallbackOnly skips AI', () => {
    it('uses fallback engine when fallbackOnly is true even with aiService', async () => {
      const mockAi = createMockAiService();
      const result = await resolveLayoutTokensAsync({
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: true, fallbackOnly: true },
        aiService: mockAi,
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
      expect(result.tokens).toHaveProperty('layout');
      expect(mockAi.generateText).not.toHaveBeenCalled();
    });

    it('returns default when fallbackOnly and no brand profile', async () => {
      const result = await resolveLayoutTokensAsync({
        brandProfile: null,
        featureFlags: { enabled: true, fallbackOnly: true },
      });
      expect(result.source).toBe('default');
      expect(result.family).toBe('bold-structured');
    });
  });

  describe('AI-first path (PRIMARY)', () => {
    it('returns AI tokens when AI generation succeeds', async () => {
      const mockAi = createMockAiService();
      const result = await resolveLayoutTokensAsync({
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: mockAi,
      });
      expect(result.source).toBe('ai');
      expect(result.tokens).toEqual(VALID_AI_TOKENS);
      expect(result.family).toBe('ethereal-dreamer');
    });

    it('falls back to family engine when AI fails', async () => {
      const mockAi = {
        generateText: jest.fn().mockRejectedValue(new Error('AI unavailable')),
      };
      const result = await resolveLayoutTokensAsync({
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: mockAi,
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
      expect(result.tokens).toHaveProperty('layout');
    });

    it('falls back when AI returns invalid tokens', async () => {
      const mockAi = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify({ layout: { family: { name: 'test' } } }),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 100,
          outputTokens: 50,
          costUsd: 0,
          latencyMs: 500,
        }),
      };
      const result = await resolveLayoutTokensAsync({
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: mockAi,
      });
      expect(result.source).toBe('fallback');
    });
  });

  describe('no AI service provided', () => {
    it('falls back to brief when no aiService', async () => {
      const result = await resolveLayoutTokensAsync({
        layoutBrief: {
          tokens: { layout: { data: true } },
          family_suggestion: { primary: 'warm-artisan' },
        },
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('ai');
      expect(result.family).toBe('warm-artisan');
    });

    it('falls back to family engine when no aiService and no brief', async () => {
      const result = await resolveLayoutTokensAsync({
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
    });

    it('returns default when no aiService, no brief, no profile', async () => {
      const result = await resolveLayoutTokensAsync({
        brandProfile: null,
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('default');
      expect(result.family).toBe('bold-structured');
    });
  });

  describe('backward compatibility', () => {
    it('sync resolveLayoutTokens still works unchanged', () => {
      const { resolveLayoutTokens } = require('../src/fallback-resolver');
      const result = resolveLayoutTokens({
        layoutBrief: null,
        brandProfile: MOCK_BRAND_PROFILE,
        featureFlags: { enabled: true },
      });
      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
      expect(result.tokens).toHaveProperty('layout');
    });
  });
});
