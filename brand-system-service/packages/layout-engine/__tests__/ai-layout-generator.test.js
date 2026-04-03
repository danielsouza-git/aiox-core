'use strict';

const { generateAILayoutTokens, buildLayoutPrompt, extractJSON } = require('../src/ai-layout-generator');

// Valid W3C DTCG token structure matching the 21 required paths
const VALID_AI_TOKENS = {
  layout: {
    family: {
      name: { $value: 'ethereal-dreamer', $type: 'string', $description: 'Dreamy ethereal family for Stray Innocence' },
    },
    corner: {
      radiusBase: { $value: '28px', $type: 'dimension', $description: 'Soft, rounded corners' },
      radiusSmall: { $value: '16px', $type: 'dimension', $description: 'Smaller radius for buttons' },
      radiusLarge: { $value: '40px', $type: 'dimension', $description: 'Large radius for cards' },
    },
    whitespace: {
      density: { $value: 'spacious', $type: 'string', $description: 'Airy, open feel' },
      multiplier: { $value: 1.6, $type: 'number', $description: 'Generous spacing' },
      sectionGap: { $value: '104px', $type: 'dimension', $description: 'Large gaps between sections' },
      contentPadding: { $value: '88px', $type: 'dimension', $description: 'Breathing room' },
    },
    nav: {
      style: { $value: 'centered-top', $type: 'string', $description: 'Minimal centered navigation' },
      width: { $value: '100%', $type: 'dimension', $description: 'Full width' },
      height: { $value: '72px', $type: 'dimension', $description: 'Taller nav for elegance' },
    },
    divider: {
      style: { $value: 'organic-wave', $type: 'string', $description: 'Flowing organic dividers' },
      height: { $value: '3px', $type: 'dimension', $description: 'Subtle presence' },
    },
    animation: {
      entrance: { $value: 'fade-up', $type: 'string', $description: 'Gentle fade entrance' },
      duration: { $value: '400ms', $type: 'duration', $description: 'Slow, graceful timing' },
      easing: { $value: 'cubic-bezier(0.22, 0.61, 0.36, 1.0)', $type: 'cubicBezier', $description: 'Smooth ease-out' },
    },
    grid: {
      rhythm: { $value: 'centered-single', $type: 'string', $description: 'Single column focus' },
      maxWidth: { $value: '860px', $type: 'dimension', $description: 'Narrow for reading' },
      columns: { $value: 1, $type: 'number', $description: 'Single column' },
    },
    section: {
      background: { $value: 'soft-fill', $type: 'string', $description: 'Soft pastel fills' },
      heroHeight: { $value: '65vh', $type: 'dimension', $description: 'Immersive hero' },
    },
    component: {
      cardShape: { $value: 'pill', $type: 'string', $description: 'Pill-shaped cards' },
      shadowIntensity: { $value: 'light', $type: 'string', $description: 'Soft shadows' },
    },
  },
};

const MOCK_BRAND_PROFILE = {
  name: 'Stray Innocence',
  clientId: 'stray-innocence',
  industryVertical: 'fashion',
  toneSpectrum: 'ethereal-dreamy',
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

describe('ai-layout-generator', () => {
  describe('buildLayoutPrompt', () => {
    it('builds system and user prompts from brand profile', () => {
      const { systemPrompt, userPrompt } = buildLayoutPrompt(MOCK_BRAND_PROFILE);

      expect(systemPrompt).toContain('brand design system architect');
      expect(systemPrompt).toContain('ONLY valid JSON');
      expect(userPrompt).toContain('Stray Innocence');
      expect(userPrompt).toContain('fashion');
      expect(userPrompt).toContain('Innocent');
      expect(userPrompt).toContain('Dreamer');
    });

    it('handles missing optional fields gracefully', () => {
      const { userPrompt } = buildLayoutPrompt({ name: 'Minimal Brand' });

      expect(userPrompt).toContain('Minimal Brand');
      expect(userPrompt).toContain('general');
    });

    it('includes build type in prompt', () => {
      const { userPrompt } = buildLayoutPrompt(MOCK_BRAND_PROFILE, { buildType: 'landing-page' });
      expect(userPrompt).toContain('landing-page');
    });

    it('includes visual references when provided', () => {
      const { userPrompt } = buildLayoutPrompt(MOCK_BRAND_PROFILE, {
        visualReferences: 'minimalist Japanese aesthetics',
      });
      expect(userPrompt).toContain('minimalist Japanese aesthetics');
    });
  });

  describe('extractJSON', () => {
    it('parses clean JSON', () => {
      const json = JSON.stringify({ layout: { family: 'test' } });
      expect(extractJSON(json)).toEqual({ layout: { family: 'test' } });
    });

    it('extracts JSON from markdown fences', () => {
      const text = 'Here is the result:\n```json\n{"layout": {"family": "test"}}\n```\nDone.';
      expect(extractJSON(text)).toEqual({ layout: { family: 'test' } });
    });

    it('extracts JSON from text with surrounding content', () => {
      const text = 'The tokens are: {"layout": {"family": "test"}} hope this helps!';
      expect(extractJSON(text)).toEqual({ layout: { family: 'test' } });
    });

    it('returns null for non-JSON text', () => {
      expect(extractJSON('This is not JSON')).toBeNull();
    });

    it('returns null for null/undefined input', () => {
      expect(extractJSON(null)).toBeNull();
      expect(extractJSON(undefined)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(extractJSON('')).toBeNull();
    });
  });

  describe('generateAILayoutTokens', () => {
    it('returns tokens on successful AI generation', async () => {
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(VALID_AI_TOKENS),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 500,
          outputTokens: 800,
          costUsd: 0.001,
          latencyMs: 1500,
        }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
      });

      expect(result).not.toBeNull();
      expect(result.source).toBe('ai');
      expect(result.tokens).toEqual(VALID_AI_TOKENS);
      expect(mockAiService.generateText).toHaveBeenCalledTimes(1);
    });

    it('returns null when aiService is not provided', async () => {
      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: null,
      });
      expect(result).toBeNull();
    });

    it('returns null when aiService has no generateText method', async () => {
      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: {},
      });
      expect(result).toBeNull();
    });

    it('retries on invalid JSON and succeeds on second attempt', async () => {
      const mockAiService = {
        generateText: jest.fn()
          .mockResolvedValueOnce({
            text: 'Sorry, I cannot generate that.',
            provider: 'claude',
            model: 'claude-3-haiku',
            inputTokens: 100,
            outputTokens: 10,
            costUsd: 0,
            latencyMs: 500,
          })
          .mockResolvedValueOnce({
            text: JSON.stringify(VALID_AI_TOKENS),
            provider: 'claude',
            model: 'claude-3-haiku',
            inputTokens: 500,
            outputTokens: 800,
            costUsd: 0.001,
            latencyMs: 1500,
          }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        options: { maxRetries: 1 },
      });

      expect(result).not.toBeNull();
      expect(result.source).toBe('ai');
      expect(mockAiService.generateText).toHaveBeenCalledTimes(2);
    });

    it('returns null after all retries fail', async () => {
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: 'I cannot do that.',
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 100,
          outputTokens: 10,
          costUsd: 0,
          latencyMs: 500,
        }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        options: { maxRetries: 1 },
      });

      expect(result).toBeNull();
      expect(mockAiService.generateText).toHaveBeenCalledTimes(2);
    });

    it('returns null when AI throws an error', async () => {
      const mockAiService = {
        generateText: jest.fn().mockRejectedValue(new Error('Provider unavailable')),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        options: { maxRetries: 0 },
      });

      expect(result).toBeNull();
    });

    it('returns null when tokens fail validation', async () => {
      const invalidTokens = {
        layout: {
          family: { name: { $value: 'test' } },
          // Missing all other required paths
        },
      };

      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(invalidTokens),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 300,
          outputTokens: 100,
          costUsd: 0,
          latencyMs: 800,
        }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        options: { maxRetries: 0 },
      });

      expect(result).toBeNull();
    });

    it('uses lower temperature on retry', async () => {
      const mockAiService = {
        generateText: jest.fn()
          .mockResolvedValueOnce({
            text: 'not json',
            provider: 'claude',
            model: 'claude-3-haiku',
            inputTokens: 100,
            outputTokens: 10,
            costUsd: 0,
            latencyMs: 500,
          })
          .mockResolvedValueOnce({
            text: JSON.stringify(VALID_AI_TOKENS),
            provider: 'claude',
            model: 'claude-3-haiku',
            inputTokens: 500,
            outputTokens: 800,
            costUsd: 0.001,
            latencyMs: 1500,
          }),
      };

      await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        options: { temperature: 0.8, maxRetries: 1 },
      });

      const firstCall = mockAiService.generateText.mock.calls[0][0];
      const secondCall = mockAiService.generateText.mock.calls[1][0];
      expect(firstCall.temperature).toBe(0.8);
      expect(secondCall.temperature).toBe(0.3); // retry temperature
    });

    it('logs cost information on success', async () => {
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(VALID_AI_TOKENS),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 500,
          outputTokens: 800,
          costUsd: 0.0012,
          latencyMs: 1500,
        }),
      };

      const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        logger: mockLogger,
      });

      const successLog = mockLogger.info.mock.calls.find(
        (call) => call[0].includes('generated successfully')
      );
      expect(successLog).toBeDefined();
      expect(successLog[1]).toMatchObject({
        inputTokens: 500,
        outputTokens: 800,
        costUsd: 0.0012,
      });
    });

    it('handles JSON wrapped in markdown fences', async () => {
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: '```json\n' + JSON.stringify(VALID_AI_TOKENS) + '\n```',
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 500,
          outputTokens: 800,
          costUsd: 0.001,
          latencyMs: 1500,
        }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
      });

      expect(result).not.toBeNull();
      expect(result.source).toBe('ai');
    });
  });

  describe('PDL-13: budget enforcement', () => {
    it('skips AI when costTracker.canSubmit returns false', async () => {
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(VALID_AI_TOKENS),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 500,
          outputTokens: 800,
          costUsd: 0.001,
          latencyMs: 1500,
        }),
      };

      const mockCostTracker = {
        canSubmit: jest.fn().mockReturnValue(false),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        costTracker: mockCostTracker,
      });

      expect(result).toBeNull();
      expect(mockAiService.generateText).not.toHaveBeenCalled();
      expect(mockCostTracker.canSubmit).toHaveBeenCalledWith('stray-innocence');
    });

    it('proceeds when costTracker.canSubmit returns true', async () => {
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(VALID_AI_TOKENS),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 500,
          outputTokens: 800,
          costUsd: 0.001,
          latencyMs: 1500,
        }),
      };

      const mockCostTracker = {
        canSubmit: jest.fn().mockReturnValue(true),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        costTracker: mockCostTracker,
      });

      expect(result).not.toBeNull();
      expect(result.source).toBe('ai');
      expect(mockAiService.generateText).toHaveBeenCalled();
    });

    it('skips AI when costTracker.canSubmit throws BudgetExceededError', async () => {
      const mockAiService = {
        generateText: jest.fn(),
      };

      const mockCostTracker = {
        canSubmit: jest.fn().mockImplementation(() => {
          throw new Error('Budget exceeded: $50.00 / $50.00');
        }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        costTracker: mockCostTracker,
      });

      expect(result).toBeNull();
      expect(mockAiService.generateText).not.toHaveBeenCalled();
    });

    it('proceeds normally when no costTracker provided', async () => {
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(VALID_AI_TOKENS),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 500,
          outputTokens: 800,
          costUsd: 0.001,
          latencyMs: 1500,
        }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: MOCK_BRAND_PROFILE,
        aiService: mockAiService,
        // no costTracker
      });

      expect(result).not.toBeNull();
    });
  });
});
