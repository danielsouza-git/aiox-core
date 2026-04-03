'use strict';

const path = require('path');
const fs = require('fs');
const { resolveLayoutTokensAsync, validateLayoutTokens, writeLayoutTokens, generateCSSVariables } = require('../../src/index');

/**
 * PDL-6 AI PoC: Nova Vista Cafe — AI-Generated Brand Book
 *
 * Validates the FULL AI-first pipeline for Nova Vista Cafe:
 *   1. AI generates unique tokens distinct from family presets
 *   2. Tokens pass validation
 *   3. AI tokens differ from Stray Innocence (cross-brand differentiation)
 *   4. Falls back gracefully on failure
 */

// Realistic AI-generated tokens for Nova Vista Cafe
const NOVA_VISTA_AI_TOKENS = {
  layout: {
    family: {
      name: { $value: 'nova-vista-explorer', $type: 'string', $description: 'Adventurous explorer family for Nova Vista Cafe — warm, open, inviting' },
    },
    corner: {
      radiusBase: { $value: '10px', $type: 'dimension', $description: 'Moderate rounding for approachable warmth' },
      radiusSmall: { $value: '6px', $type: 'dimension', $description: 'Crisp small radius for interactive elements' },
      radiusLarge: { $value: '18px', $type: 'dimension', $description: 'Slightly rounded for feature cards' },
    },
    whitespace: {
      density: { $value: 'balanced', $type: 'string', $description: 'Balanced density for cafe browsing experience' },
      multiplier: { $value: 1.2, $type: 'number', $description: 'Moderate spacing for content-rich pages' },
      sectionGap: { $value: '72px', $type: 'dimension', $description: 'Rhythmic gaps matching cafe tempo' },
      contentPadding: { $value: '56px', $type: 'dimension', $description: 'Comfortable padding for readability' },
    },
    nav: {
      style: { $value: 'floating-bar', $type: 'string', $description: 'Floating nav bar for modern explorer feel' },
      width: { $value: '100%', $type: 'dimension', $description: 'Full width floating bar' },
      height: { $value: '64px', $type: 'dimension', $description: 'Standard height for food-beverage' },
    },
    divider: {
      style: { $value: 'gradient-fade', $type: 'string', $description: 'Gradient fades evoking cafe ambiance transitions' },
      height: { $value: '1px', $type: 'dimension', $description: 'Subtle gradient line' },
    },
    animation: {
      entrance: { $value: 'slide-in', $type: 'string', $description: 'Dynamic slide-in for explorer energy' },
      duration: { $value: '280ms', $type: 'duration', $description: 'Quick, energetic entrance' },
      easing: { $value: 'cubic-bezier(0.34, 1.56, 0.64, 1.0)', $type: 'cubicBezier', $description: 'Bouncy overshoot for playful feel' },
    },
    grid: {
      rhythm: { $value: 'masonry', $type: 'string', $description: 'Masonry grid for eclectic menu/gallery display' },
      maxWidth: { $value: '1120px', $type: 'dimension', $description: 'Wide layout for visual richness' },
      columns: { $value: 3, $type: 'number', $description: 'Three columns for menu-style browsing' },
    },
    section: {
      background: { $value: 'gradient-subtle', $type: 'string', $description: 'Warm gradient backgrounds evoking coffee tones' },
      heroHeight: { $value: '55vh', $type: 'dimension', $description: 'Medium hero for food photography focus' },
    },
    component: {
      cardShape: { $value: 'rounded', $type: 'string', $description: 'Rounded cards for approachable menu items' },
      shadowIntensity: { $value: 'medium', $type: 'string', $description: 'Medium shadows for depth and warmth' },
    },
  },
};

// Stray Innocence tokens for cross-brand comparison
const STRAY_AI_TOKENS = {
  layout: {
    family: { name: { $value: 'stray-innocence-ethereal', $type: 'string', $description: 'test' } },
    corner: {
      radiusBase: { $value: '22px', $type: 'dimension', $description: 'test' },
      radiusSmall: { $value: '14px', $type: 'dimension', $description: 'test' },
      radiusLarge: { $value: '36px', $type: 'dimension', $description: 'test' },
    },
    whitespace: {
      density: { $value: 'spacious', $type: 'string', $description: 'test' },
      multiplier: { $value: 1.7, $type: 'number', $description: 'test' },
      sectionGap: { $value: '108px', $type: 'dimension', $description: 'test' },
      contentPadding: { $value: '92px', $type: 'dimension', $description: 'test' },
    },
    nav: {
      style: { $value: 'minimal-top', $type: 'string', $description: 'test' },
      width: { $value: '100%', $type: 'dimension', $description: 'test' },
      height: { $value: '56px', $type: 'dimension', $description: 'test' },
    },
    divider: {
      style: { $value: 'organic-wave', $type: 'string', $description: 'test' },
      height: { $value: '2px', $type: 'dimension', $description: 'test' },
    },
    animation: {
      entrance: { $value: 'blur-in', $type: 'string', $description: 'test' },
      duration: { $value: '450ms', $type: 'duration', $description: 'test' },
      easing: { $value: 'cubic-bezier(0.19, 0.74, 0.33, 1.0)', $type: 'cubicBezier', $description: 'test' },
    },
    grid: {
      rhythm: { $value: 'centered-single', $type: 'string', $description: 'test' },
      maxWidth: { $value: '780px', $type: 'dimension', $description: 'test' },
      columns: { $value: 1, $type: 'number', $description: 'test' },
    },
    section: {
      background: { $value: 'soft-fill', $type: 'string', $description: 'test' },
      heroHeight: { $value: '70vh', $type: 'dimension', $description: 'test' },
    },
    component: {
      cardShape: { $value: 'pill', $type: 'string', $description: 'test' },
      shadowIntensity: { $value: 'light', $type: 'string', $description: 'test' },
    },
  },
};

const NOVA_VISTA_BRAND_PROFILE = {
  name: 'Nova Vista Cafe',
  clientId: 'nova-vista-cafe',
  industryVertical: 'food-beverage',
  toneSpectrum: 'warm-adventurous',
  personality: {
    archetypes: ['Explorer', 'Creator'],
    traits: {
      formal_casual: 2,
      traditional_modern: 4,
      serious_playful: 3,
      conservative_bold: 4,
      minimal_expressive: 4,
    },
  },
};

function createMockAiService(tokens) {
  return {
    generateText: jest.fn().mockResolvedValue({
      text: JSON.stringify(tokens || NOVA_VISTA_AI_TOKENS),
      provider: 'claude',
      model: 'claude-3-haiku',
      inputTokens: 600,
      outputTokens: 900,
      costUsd: 0.0015,
      latencyMs: 2000,
    }),
  };
}

describe('PDL-6 AI PoC: Nova Vista Cafe — AI-First Pipeline', () => {
  describe('AI-first token generation', () => {
    let result;

    beforeAll(async () => {
      result = await resolveLayoutTokensAsync({
        brandProfile: NOVA_VISTA_BRAND_PROFILE,
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
      expect(result.family).toBe('nova-vista-explorer');
    });

    it('tokens pass W3C DTCG validation', () => {
      const validation = validateLayoutTokens(result.tokens);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('cross-brand differentiation (vs Stray Innocence)', () => {
    let novaResult;
    let strayResult;

    beforeAll(async () => {
      novaResult = await resolveLayoutTokensAsync({
        brandProfile: NOVA_VISTA_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: createMockAiService(NOVA_VISTA_AI_TOKENS),
      });
      strayResult = await resolveLayoutTokensAsync({
        brandProfile: { name: 'Stray Innocence', clientId: 'stray-innocence', personality: { archetypes: ['Innocent', 'Dreamer', 'Creator'], traits: { formal_casual: 2, traditional_modern: 3, serious_playful: 3, conservative_bold: 2, minimal_expressive: 3 } } },
        featureFlags: { enabled: true },
        aiService: createMockAiService(STRAY_AI_TOKENS),
      });
    });

    it('family names are different', () => {
      expect(novaResult.family).not.toBe(strayResult.family);
    });

    it('nav styles are different', () => {
      expect(novaResult.tokens.layout.nav.style.$value).not.toBe(strayResult.tokens.layout.nav.style.$value);
    });

    it('grid rhythms are different', () => {
      expect(novaResult.tokens.layout.grid.rhythm.$value).not.toBe(strayResult.tokens.layout.grid.rhythm.$value);
    });

    it('animation entrances are different', () => {
      expect(novaResult.tokens.layout.animation.entrance.$value).not.toBe(strayResult.tokens.layout.animation.entrance.$value);
    });

    it('corner radii are different', () => {
      expect(novaResult.tokens.layout.corner.radiusBase.$value).not.toBe(strayResult.tokens.layout.corner.radiusBase.$value);
    });

    it('whitespace multipliers are different', () => {
      expect(novaResult.tokens.layout.whitespace.multiplier.$value).not.toBe(strayResult.tokens.layout.whitespace.multiplier.$value);
    });

    it('grid columns are different', () => {
      expect(novaResult.tokens.layout.grid.columns.$value).not.toBe(strayResult.tokens.layout.grid.columns.$value);
    });
  });

  describe('CSS output differentiation', () => {
    it('generates different CSS for each brand', () => {
      const novaCSS = generateCSSVariables(NOVA_VISTA_AI_TOKENS);
      const strayCSS = generateCSSVariables(STRAY_AI_TOKENS);

      expect(novaCSS).not.toBe(strayCSS);
      expect(novaCSS).toContain('masonry');
      expect(strayCSS).toContain('centered-single');
      expect(novaCSS).toContain('slide-in');
      expect(strayCSS).toContain('blur-in');
    });
  });

  describe('fallback when AI fails', () => {
    it('falls back to adventurous-open family', async () => {
      const failingAi = {
        generateText: jest.fn().mockRejectedValue(new Error('API unavailable')),
      };
      const result = await resolveLayoutTokensAsync({
        brandProfile: NOVA_VISTA_BRAND_PROFILE,
        featureFlags: { enabled: true },
        aiService: failingAi,
      });

      expect(result.source).toBe('fallback');
      expect(result.family).toBe('adventurous-open');
    });
  });
});
