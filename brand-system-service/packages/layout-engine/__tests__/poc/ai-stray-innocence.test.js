'use strict';

const path = require('path');
const fs = require('fs');
const { resolveLayoutTokensAsync, validateLayoutTokens, writeLayoutTokens, generateCSSVariables } = require('../../src/index');

/**
 * PDL-5 AI PoC: Stray Innocence — AI-Generated Brand Book
 *
 * Validates the FULL AI-first pipeline for Stray Innocence:
 *   1. resolveLayoutTokensAsync() calls AI → gets unique tokens
 *   2. Tokens pass W3C DTCG validation
 *   3. Tokens can be written to layout.json
 *   4. Tokens can be converted to CSS variables
 *   5. AI tokens differ from family-based fallback tokens
 *   6. Falls back to family-based when AI fails
 */

// Realistic AI-generated tokens for Stray Innocence (unique, not family-based)
const STRAY_AI_TOKENS = {
  layout: {
    family: {
      name: { $value: 'stray-innocence-ethereal', $type: 'string', $description: 'Custom ethereal family for Stray Innocence — soft, dreamlike innocence' },
    },
    corner: {
      radiusBase: { $value: '22px', $type: 'dimension', $description: 'Gentle rounding reflecting innocent softness' },
      radiusSmall: { $value: '14px', $type: 'dimension', $description: 'Subtle small radius for buttons' },
      radiusLarge: { $value: '36px', $type: 'dimension', $description: 'Pronounced rounding for hero cards' },
    },
    whitespace: {
      density: { $value: 'spacious', $type: 'string', $description: 'Airy, breathing space echoing dreamer archetype' },
      multiplier: { $value: 1.7, $type: 'number', $description: 'Extra generous spacing for contemplative feel' },
      sectionGap: { $value: '108px', $type: 'dimension', $description: 'Large gaps for visual breathing room' },
      contentPadding: { $value: '92px', $type: 'dimension', $description: 'Generous padding reflecting openness' },
    },
    nav: {
      style: { $value: 'minimal-top', $type: 'string', $description: 'Understated navigation letting content breathe' },
      width: { $value: '100%', $type: 'dimension', $description: 'Full width minimal bar' },
      height: { $value: '56px', $type: 'dimension', $description: 'Slim nav for innocence aesthetic' },
    },
    divider: {
      style: { $value: 'organic-wave', $type: 'string', $description: 'Flowing organic dividers for dreamy feel' },
      height: { $value: '2px', $type: 'dimension', $description: 'Subtle, delicate dividers' },
    },
    animation: {
      entrance: { $value: 'blur-in', $type: 'string', $description: 'Dreamy blur entrance unique to this brand' },
      duration: { $value: '450ms', $type: 'duration', $description: 'Slow, ethereal reveal' },
      easing: { $value: 'cubic-bezier(0.19, 0.74, 0.33, 1.0)', $type: 'cubicBezier', $description: 'Custom gentle ease curve' },
    },
    grid: {
      rhythm: { $value: 'centered-single', $type: 'string', $description: 'Single column focus for intimate storytelling' },
      maxWidth: { $value: '780px', $type: 'dimension', $description: 'Narrow reading width for intimacy' },
      columns: { $value: 1, $type: 'number', $description: 'Single column layout' },
    },
    section: {
      background: { $value: 'soft-fill', $type: 'string', $description: 'Soft pastel fills evoking innocence' },
      heroHeight: { $value: '70vh', $type: 'dimension', $description: 'Immersive hero for dreamlike entry' },
    },
    component: {
      cardShape: { $value: 'pill', $type: 'string', $description: 'Soft pill shapes for innocent feel' },
      shadowIntensity: { $value: 'light', $type: 'string', $description: 'Gentle shadows maintaining softness' },
    },
  },
};

const STRAY_BRAND_PROFILE = {
  name: 'Stray Innocence',
  clientId: 'stray-innocence',
  industryVertical: 'fashion',
  toneSpectrum: 'ethereal-dreamy',
  personality: {
    archetypes: ['Innocent', 'Dreamer', 'Creator'],
    traits: {
      formal_casual: 2,
      traditional_modern: 3,
      serious_playful: 3,
      conservative_bold: 2,
      minimal_expressive: 3,
    },
  },
};

function createMockAiService(tokens) {
  return {
    generateText: jest.fn().mockResolvedValue({
      text: JSON.stringify(tokens || STRAY_AI_TOKENS),
      provider: 'claude',
      model: 'claude-3-haiku',
      inputTokens: 600,
      outputTokens: 900,
      costUsd: 0.0015,
      latencyMs: 2000,
    }),
  };
}

describe('PDL-5 AI PoC: Stray Innocence — AI-First Pipeline', () => {
  describe('AI-first token generation', () => {
    let result;

    beforeAll(async () => {
      result = await resolveLayoutTokensAsync({
        brandProfile: STRAY_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: createMockAiService(),
      });
    });

    it('resolves with source=ai', () => {
      expect(result.source).toBe('ai');
    });

    it('family name is unique (not a standard 6-family name)', () => {
      const standardFamilies = ['ethereal', 'bold-structured', 'warm-artisan', 'adventurous-open', 'playful-dynamic', 'rebel-edge'];
      expect(standardFamilies).not.toContain(result.family);
      expect(result.family).toBe('stray-innocence-ethereal');
    });

    it('tokens pass W3C DTCG validation', () => {
      const validation = validateLayoutTokens(result.tokens);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('AI tokens differ from fallback tokens in specific values', () => {
      const { resolveLayoutTokens } = require('../../src/fallback-resolver');
      const fallbackResult = resolveLayoutTokens({
        brandProfile: STRAY_BRAND_PROFILE,
        featureFlags: { enabled: true },
      });

      // AI corner radius differs from fallback
      const aiRadius = result.tokens.layout.corner.radiusBase.$value;
      const fallbackRadius = fallbackResult.tokens.layout.corner.radiusBase.$value;
      expect(aiRadius).not.toBe(fallbackRadius);
    });
  });

  describe('token write and CSS generation', () => {
    const tmpDir = path.join(__dirname, '..', '..', '.tmp-test-stray');

    afterAll(() => {
      // Clean up
      const layoutDir = path.join(tmpDir, 'layout');
      if (fs.existsSync(path.join(layoutDir, 'layout.json'))) {
        fs.unlinkSync(path.join(layoutDir, 'layout.json'));
      }
      if (fs.existsSync(layoutDir)) fs.rmdirSync(layoutDir);
      if (fs.existsSync(tmpDir)) fs.rmdirSync(tmpDir);
    });

    it('writes AI tokens to layout.json', () => {
      const written = writeLayoutTokens(tmpDir, STRAY_AI_TOKENS);
      expect(written).toBe(true);

      const outputPath = path.join(tmpDir, 'layout', 'layout.json');
      expect(fs.existsSync(outputPath)).toBe(true);

      const data = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(data.layout.family.name.$value).toBe('stray-innocence-ethereal');
    });

    it('generates CSS variables from AI tokens', () => {
      const css = generateCSSVariables(STRAY_AI_TOKENS);
      expect(css).toContain(':root');
      expect(css).toContain('22px'); // AI corner radius
      expect(css).toContain('blur-in'); // AI-unique entrance animation
      expect(css).toContain('780px'); // AI-unique maxWidth
    });
  });

  describe('fallback when AI fails', () => {
    it('falls back to ethereal family when AI service throws', async () => {
      const failingAi = {
        generateText: jest.fn().mockRejectedValue(new Error('API unavailable')),
      };
      const result = await resolveLayoutTokensAsync({
        brandProfile: STRAY_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: failingAi,
      });

      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
      expect(result.tokens).toHaveProperty('layout');
    });

    it('falls back to ethereal when AI returns invalid JSON', async () => {
      const badAi = {
        generateText: jest.fn().mockResolvedValue({
          text: 'Sorry, I cannot generate that.',
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 100,
          outputTokens: 20,
          costUsd: 0,
          latencyMs: 500,
        }),
      };
      const result = await resolveLayoutTokensAsync({
        brandProfile: STRAY_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: badAi,
      });

      expect(result.source).toBe('fallback');
      expect(result.family).toBe('ethereal');
    });
  });
});
