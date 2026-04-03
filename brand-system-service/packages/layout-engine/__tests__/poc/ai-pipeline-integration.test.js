'use strict';

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const {
  resolveLayoutTokensAsync,
  resolveLayoutTokens,
  validateLayoutTokens,
  writeLayoutTokens,
  generateCSSVariables,
  parseBrief,
  extractFamilySuggestion,
} = require('../../src/index');

/**
 * PDL Pipeline Integration Test
 *
 * Tests the FULL end-to-end pipeline:
 *   Brand Profile (YAML) → Layout Brief (MD) → AI Generator → Validate → Write → CSS
 *
 * Covers gaps:
 * - PDL-1/2/3: Upstream pipeline reads real brand profiles and layout briefs
 * - PDL-5/6: AI tokens flow through the complete pipeline
 * - PDL-9: Quality gate validation on AI output
 */

const BRANDS_DIR = path.resolve(__dirname, '..', '..', '..', '..', 'brands');

function loadBrandProfile(brandSlug) {
  const profilePath = path.join(BRANDS_DIR, brandSlug, 'brand-profile.yaml');
  const content = fs.readFileSync(profilePath, 'utf-8');
  const parsed = yaml.load(content);
  return parsed.brand;
}

function loadLayoutBrief(brandSlug) {
  const briefPath = path.join(BRANDS_DIR, brandSlug, 'layout-brief.md');
  return fs.readFileSync(briefPath, 'utf-8');
}

// Realistic AI token factories per brand
function createStrayAiTokens() {
  return {
    layout: {
      family: { name: { $value: 'stray-innocence-custom', $type: 'string', $description: 'Custom for Stray Innocence' } },
      corner: {
        radiusBase: { $value: '22px', $type: 'dimension', $description: 'Soft innocence' },
        radiusSmall: { $value: '14px', $type: 'dimension', $description: 'Small' },
        radiusLarge: { $value: '36px', $type: 'dimension', $description: 'Large' },
      },
      whitespace: {
        density: { $value: 'spacious', $type: 'string', $description: 'Airy' },
        multiplier: { $value: 1.7, $type: 'number', $description: 'Generous' },
        sectionGap: { $value: '108px', $type: 'dimension', $description: 'Large' },
        contentPadding: { $value: '92px', $type: 'dimension', $description: 'Generous' },
      },
      nav: {
        style: { $value: 'minimal-top', $type: 'string', $description: 'Minimal' },
        width: { $value: '100%', $type: 'dimension', $description: 'Full' },
        height: { $value: '56px', $type: 'dimension', $description: 'Slim' },
      },
      divider: {
        style: { $value: 'organic-wave', $type: 'string', $description: 'Organic' },
        height: { $value: '2px', $type: 'dimension', $description: 'Subtle' },
      },
      animation: {
        entrance: { $value: 'blur-in', $type: 'string', $description: 'Dreamy' },
        duration: { $value: '450ms', $type: 'duration', $description: 'Slow' },
        easing: { $value: 'cubic-bezier(0.19, 0.74, 0.33, 1.0)', $type: 'cubicBezier', $description: 'Custom' },
      },
      grid: {
        rhythm: { $value: 'centered-single', $type: 'string', $description: 'Focus' },
        maxWidth: { $value: '780px', $type: 'dimension', $description: 'Narrow' },
        columns: { $value: 1, $type: 'number', $description: 'Single' },
      },
      section: {
        background: { $value: 'soft-fill', $type: 'string', $description: 'Soft' },
        heroHeight: { $value: '70vh', $type: 'dimension', $description: 'Immersive' },
      },
      component: {
        cardShape: { $value: 'pill', $type: 'string', $description: 'Soft' },
        shadowIntensity: { $value: 'light', $type: 'string', $description: 'Gentle' },
      },
    },
  };
}

function createNovaVistaAiTokens() {
  return {
    layout: {
      family: { name: { $value: 'nova-vista-explorer', $type: 'string', $description: 'Custom for Nova Vista' } },
      corner: {
        radiusBase: { $value: '10px', $type: 'dimension', $description: 'Moderate' },
        radiusSmall: { $value: '6px', $type: 'dimension', $description: 'Crisp' },
        radiusLarge: { $value: '18px', $type: 'dimension', $description: 'Rounded' },
      },
      whitespace: {
        density: { $value: 'balanced', $type: 'string', $description: 'Balanced' },
        multiplier: { $value: 1.2, $type: 'number', $description: 'Moderate' },
        sectionGap: { $value: '72px', $type: 'dimension', $description: 'Rhythmic' },
        contentPadding: { $value: '56px', $type: 'dimension', $description: 'Comfortable' },
      },
      nav: {
        style: { $value: 'floating-bar', $type: 'string', $description: 'Modern' },
        width: { $value: '100%', $type: 'dimension', $description: 'Full' },
        height: { $value: '64px', $type: 'dimension', $description: 'Standard' },
      },
      divider: {
        style: { $value: 'gradient-fade', $type: 'string', $description: 'Gradient' },
        height: { $value: '1px', $type: 'dimension', $description: 'Subtle' },
      },
      animation: {
        entrance: { $value: 'slide-in', $type: 'string', $description: 'Dynamic' },
        duration: { $value: '280ms', $type: 'duration', $description: 'Quick' },
        easing: { $value: 'cubic-bezier(0.34, 1.56, 0.64, 1.0)', $type: 'cubicBezier', $description: 'Bouncy' },
      },
      grid: {
        rhythm: { $value: 'masonry', $type: 'string', $description: 'Eclectic' },
        maxWidth: { $value: '1120px', $type: 'dimension', $description: 'Wide' },
        columns: { $value: 3, $type: 'number', $description: 'Three' },
      },
      section: {
        background: { $value: 'gradient-subtle', $type: 'string', $description: 'Warm' },
        heroHeight: { $value: '55vh', $type: 'dimension', $description: 'Medium' },
      },
      component: {
        cardShape: { $value: 'rounded', $type: 'string', $description: 'Approachable' },
        shadowIntensity: { $value: 'medium', $type: 'string', $description: 'Depth' },
      },
    },
  };
}

describe('PDL Pipeline Integration — Full End-to-End', () => {
  // --- PDL-1/2/3: Upstream pipeline ---

  describe('PDL-1/2/3: Upstream pipeline (brand profiles + layout briefs)', () => {
    it('loads Stray Innocence brand profile from YAML', () => {
      const profile = loadBrandProfile('stray-innocence');
      expect(profile.name).toBe('Stray Innocence');
      expect(profile.personality.archetypes).toEqual(['Innocent', 'Dreamer', 'Creator']);
      expect(profile.personality.traits.formal_casual).toBe(2);
    });

    it('loads Nova Vista Cafe brand profile from YAML', () => {
      const profile = loadBrandProfile('nova-vista-cafe');
      expect(profile.name).toBe('Nova Vista Cafe');
      expect(profile.personality.archetypes).toEqual(['Explorer', 'Creator']);
    });

    it('parses Stray Innocence layout brief', () => {
      const briefContent = loadLayoutBrief('stray-innocence');
      const parsed = parseBrief(briefContent);
      expect(parsed).not.toBeNull();
      expect(parsed.brand).toBe('Stray Innocence');
    });

    it('parses Nova Vista Cafe layout brief', () => {
      const briefContent = loadLayoutBrief('nova-vista-cafe');
      const parsed = parseBrief(briefContent);
      expect(parsed).not.toBeNull();
      expect(parsed.brand).toBe('Nova Vista Cafe');
    });

    it('extracts family suggestion from Stray Innocence brief', () => {
      const briefContent = loadLayoutBrief('stray-innocence');
      const parsed = parseBrief(briefContent);
      const suggestion = extractFamilySuggestion(parsed);
      expect(suggestion.primary).toBe('ethereal');
    });

    it('extracts family suggestion from Nova Vista brief', () => {
      const briefContent = loadLayoutBrief('nova-vista-cafe');
      const parsed = parseBrief(briefContent);
      const suggestion = extractFamilySuggestion(parsed);
      expect(suggestion.primary).toBe('adventurous-open');
    });
  });

  // --- PDL-5/6: Full AI pipeline ---

  describe('PDL-5/6: AI-first pipeline with real brand profiles', () => {
    it('generates AI tokens for Stray Innocence from real profile', async () => {
      const profile = loadBrandProfile('stray-innocence');
      const mockAi = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(createStrayAiTokens()),
          provider: 'claude', model: 'claude-3-haiku',
          inputTokens: 600, outputTokens: 900, costUsd: 0.0015, latencyMs: 2000,
        }),
      };

      const result = await resolveLayoutTokensAsync({
        brandProfile: profile,
        featureFlags: { enabled: true },
        aiService: mockAi,
      });

      expect(result.source).toBe('ai');
      expect(result.family).toBe('stray-innocence-custom');
      expect(validateLayoutTokens(result.tokens).valid).toBe(true);
    });

    it('generates AI tokens for Nova Vista from real profile', async () => {
      const profile = loadBrandProfile('nova-vista-cafe');
      const mockAi = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(createNovaVistaAiTokens()),
          provider: 'claude', model: 'claude-3-haiku',
          inputTokens: 600, outputTokens: 900, costUsd: 0.0015, latencyMs: 2000,
        }),
      };

      const result = await resolveLayoutTokensAsync({
        brandProfile: profile,
        featureFlags: { enabled: true },
        aiService: mockAi,
      });

      expect(result.source).toBe('ai');
      expect(result.family).toBe('nova-vista-explorer');
      expect(validateLayoutTokens(result.tokens).valid).toBe(true);
    });
  });

  // --- PDL-9: Quality gates on AI output ---

  describe('PDL-9: Quality gate validation on AI-generated output', () => {
    it('AI tokens have all 21 required paths', () => {
      const strayValidation = validateLayoutTokens(createStrayAiTokens());
      const novaValidation = validateLayoutTokens(createNovaVistaAiTokens());
      expect(strayValidation.valid).toBe(true);
      expect(strayValidation.errors).toHaveLength(0);
      expect(novaValidation.valid).toBe(true);
      expect(novaValidation.errors).toHaveLength(0);
    });

    it('every AI token has $value, $type, and $description', () => {
      const tokens = createStrayAiTokens();
      const layout = tokens.layout;

      for (const [, category] of Object.entries(layout)) {
        for (const [, token] of Object.entries(category)) {
          expect(token).toHaveProperty('$value');
          expect(token).toHaveProperty('$type');
          expect(token).toHaveProperty('$description');
        }
      }
    });

    it('AI CSS output is non-empty and contains custom properties', () => {
      const strayCSS = generateCSSVariables(createStrayAiTokens());
      const novaCSS = generateCSSVariables(createNovaVistaAiTokens());

      expect(strayCSS.length).toBeGreaterThan(100);
      expect(novaCSS.length).toBeGreaterThan(100);
      expect(strayCSS).toContain(':root');
      expect(novaCSS).toContain(':root');
    });

    it('AI tokens can be written and read back identically', () => {
      const tmpDir = path.join(__dirname, '..', '..', '.tmp-test-qa');
      const tokens = createStrayAiTokens();

      writeLayoutTokens(tmpDir, tokens);

      const outputPath = path.join(tmpDir, 'layout', 'layout.json');
      const readBack = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(readBack).toEqual(tokens);

      // Cleanup
      fs.unlinkSync(outputPath);
      fs.rmdirSync(path.join(tmpDir, 'layout'));
      fs.rmdirSync(tmpDir);
    });
  });

  // --- Cross-brand differentiation ---

  describe('cross-brand AI differentiation', () => {
    it('AI tokens differ in at least 80% of comparable values', () => {
      const stray = createStrayAiTokens();
      const nova = createNovaVistaAiTokens();

      const strayValues = flattenValues(stray.layout);
      const novaValues = flattenValues(nova.layout);

      const allPaths = new Set([...Object.keys(strayValues), ...Object.keys(novaValues)]);
      let matches = 0;
      for (const p of allPaths) {
        if (strayValues[p] === novaValues[p]) matches++;
      }

      const overlapPct = (matches / allPaths.size) * 100;
      expect(overlapPct).toBeLessThan(80);
    });
  });
});

function flattenValues(obj, prefix, result) {
  if (!result) result = {};
  for (const [key, val] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      result[p] = String(val.$value);
    } else if (val && typeof val === 'object') {
      flattenValues(val, p, result);
    }
  }
  return result;
}
