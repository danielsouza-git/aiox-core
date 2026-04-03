'use strict';

const { generateAILayoutTokens } = require('../src/ai-layout-generator');

/**
 * PDL-14: AI Layout Uniqueness Validation
 *
 * Tests that AI-generated layout tokens are statistically divergent
 * across different brands. Each of 10 mock brands should produce
 * unique token values with < 80% overlap between any pair.
 */

// 10 diverse mock brand profiles
const MOCK_BRANDS = [
  {
    name: 'Stray Innocence',
    clientId: 'stray-innocence',
    industryVertical: 'fashion',
    personality: {
      archetypes: ['Innocent', 'Dreamer', 'Creator'],
      traits: { formal_casual: 2, traditional_modern: 2, serious_playful: 2, conservative_bold: 1, minimal_expressive: 1 },
    },
  },
  {
    name: 'Nova Vista Cafe',
    clientId: 'nova-vista-cafe',
    industryVertical: 'food-beverage',
    personality: {
      archetypes: ['Explorer', 'Creator'],
      traits: { formal_casual: 4, traditional_modern: 4, serious_playful: 3, conservative_bold: 4, minimal_expressive: 4 },
    },
  },
  {
    name: 'Iron Fortress Bank',
    clientId: 'iron-fortress',
    industryVertical: 'finance',
    personality: {
      archetypes: ['Ruler', 'Hero'],
      traits: { formal_casual: 1, traditional_modern: 2, serious_playful: 1, conservative_bold: 1, minimal_expressive: 1 },
    },
  },
  {
    name: 'Spark Joy Toys',
    clientId: 'spark-joy-toys',
    industryVertical: 'toys',
    personality: {
      archetypes: ['Jester', 'Magician'],
      traits: { formal_casual: 5, traditional_modern: 4, serious_playful: 5, conservative_bold: 5, minimal_expressive: 5 },
    },
  },
  {
    name: 'Zenith Wellness',
    clientId: 'zenith-wellness',
    industryVertical: 'health',
    personality: {
      archetypes: ['Caregiver', 'Sage'],
      traits: { formal_casual: 3, traditional_modern: 3, serious_playful: 2, conservative_bold: 2, minimal_expressive: 3 },
    },
  },
  {
    name: 'Rebel Motors',
    clientId: 'rebel-motors',
    industryVertical: 'automotive',
    personality: {
      archetypes: ['Rebel', 'Outlaw', 'Hero'],
      traits: { formal_casual: 4, traditional_modern: 5, serious_playful: 3, conservative_bold: 5, minimal_expressive: 4 },
    },
  },
  {
    name: 'Heritage Craft',
    clientId: 'heritage-craft',
    industryVertical: 'artisan-goods',
    personality: {
      archetypes: ['Creator', 'Everyman'],
      traits: { formal_casual: 3, traditional_modern: 1, serious_playful: 2, conservative_bold: 2, minimal_expressive: 3 },
    },
  },
  {
    name: 'Neon Pulse Gaming',
    clientId: 'neon-pulse',
    industryVertical: 'gaming',
    personality: {
      archetypes: ['Magician', 'Rebel', 'Jester'],
      traits: { formal_casual: 5, traditional_modern: 5, serious_playful: 5, conservative_bold: 5, minimal_expressive: 5 },
    },
  },
  {
    name: 'Ivory & Lace',
    clientId: 'ivory-lace',
    industryVertical: 'luxury-wedding',
    personality: {
      archetypes: ['Lover', 'Innocent'],
      traits: { formal_casual: 1, traditional_modern: 1, serious_playful: 1, conservative_bold: 1, minimal_expressive: 2 },
    },
  },
  {
    name: 'Summit Ventures',
    clientId: 'summit-ventures',
    industryVertical: 'venture-capital',
    personality: {
      archetypes: ['Sage', 'Explorer', 'Ruler'],
      traits: { formal_casual: 2, traditional_modern: 4, serious_playful: 1, conservative_bold: 3, minimal_expressive: 2 },
    },
  },
];

// Generate a unique but valid token set per brand, varying values based on brand traits
function generateMockTokensForBrand(brand) {
  const t = brand.personality.traits;
  const a = brand.personality.archetypes[0];

  // Use traits to deterministically vary token values
  const radiusBase = Math.round(2 + (t.formal_casual * 6)) + 'px';
  const radiusSmall = Math.round(1 + (t.formal_casual * 3)) + 'px';
  const radiusLarge = Math.round(4 + (t.formal_casual * 8)) + 'px';
  const multiplier = +(0.6 + (t.minimal_expressive * 0.28)).toFixed(2);
  const sectionGap = Math.round(40 + (t.minimal_expressive * 14)) + 'px';
  const contentPadding = Math.round(32 + (t.minimal_expressive * 12)) + 'px';
  const duration = Math.round(50 + (t.conservative_bold * 80)) + 'ms';
  const maxWidth = Math.round(700 + (t.conservative_bold * 140)) + 'px';
  const columns = Math.min(12, Math.max(1, Math.round(t.minimal_expressive * 2.4)));
  const heroHeight = Math.round(30 + (t.minimal_expressive * 8)) + 'vh';

  const navStyles = ['centered-top', 'sidebar-fixed', 'floating-bar', 'minimal-top', 'overlay-menu'];
  const dividerStyles = ['organic-wave', 'solid-thick', 'dotted-light', 'gradient-fade', 'solid-thin'];
  const entranceStyles = ['fade-up', 'slide-in', 'none', 'scale-up', 'blur-in'];
  const gridRhythms = ['centered-single', 'strict-grid', 'masonry', 'asymmetric', 'fluid-columns'];
  const bgStyles = ['soft-fill', 'flat-solid', 'gradient-subtle', 'textured', 'transparent'];
  const cardShapes = ['pill', 'sharp', 'rounded', 'soft-square'];
  const shadows = ['none', 'light', 'medium', 'dramatic'];
  const densities = ['spacious', 'balanced', 'compact'];

  // Use archetype index + traits for variety
  const archetypeIdx = ['Innocent', 'Dreamer', 'Creator', 'Caregiver', 'Explorer', 'Sage',
    'Ruler', 'Hero', 'Jester', 'Magician', 'Rebel', 'Outlaw', 'Everyman', 'Lover'].indexOf(a);
  const variety = (archetypeIdx + t.formal_casual + t.conservative_bold) % 5;

  return {
    layout: {
      family: { name: { $value: `${brand.name.toLowerCase().replace(/\s+/g, '-')}-custom`, $type: 'string', $description: `Custom family for ${brand.name}` } },
      corner: {
        radiusBase: { $value: radiusBase, $type: 'dimension', $description: 'test' },
        radiusSmall: { $value: radiusSmall, $type: 'dimension', $description: 'test' },
        radiusLarge: { $value: radiusLarge, $type: 'dimension', $description: 'test' },
      },
      whitespace: {
        density: { $value: densities[t.minimal_expressive % 3], $type: 'string', $description: 'test' },
        multiplier: { $value: multiplier, $type: 'number', $description: 'test' },
        sectionGap: { $value: sectionGap, $type: 'dimension', $description: 'test' },
        contentPadding: { $value: contentPadding, $type: 'dimension', $description: 'test' },
      },
      nav: {
        style: { $value: navStyles[variety], $type: 'string', $description: 'test' },
        width: { $value: '100%', $type: 'dimension', $description: 'test' },
        height: { $value: Math.round(48 + (t.formal_casual * 6)) + 'px', $type: 'dimension', $description: 'test' },
      },
      divider: {
        style: { $value: dividerStyles[variety], $type: 'string', $description: 'test' },
        height: { $value: (1 + (t.conservative_bold % 3)) + 'px', $type: 'dimension', $description: 'test' },
      },
      animation: {
        entrance: { $value: entranceStyles[variety], $type: 'string', $description: 'test' },
        duration: { $value: duration, $type: 'duration', $description: 'test' },
        easing: { $value: `cubic-bezier(0.${20 + variety}, 0.${10 + t.formal_casual}, 0.${25 + variety}, 1.0)`, $type: 'cubicBezier', $description: 'test' },
      },
      grid: {
        rhythm: { $value: gridRhythms[variety], $type: 'string', $description: 'test' },
        maxWidth: { $value: maxWidth, $type: 'dimension', $description: 'test' },
        columns: { $value: columns, $type: 'number', $description: 'test' },
      },
      section: {
        background: { $value: bgStyles[variety], $type: 'string', $description: 'test' },
        heroHeight: { $value: heroHeight, $type: 'dimension', $description: 'test' },
      },
      component: {
        cardShape: { $value: cardShapes[variety % 4], $type: 'string', $description: 'test' },
        shadowIntensity: { $value: shadows[variety % 4], $type: 'string', $description: 'test' },
      },
    },
  };
}

/**
 * Extract comparable values from a token set for overlap calculation.
 * Returns a flat map of path -> value for comparison.
 */
function extractComparableValues(tokens) {
  const values = {};
  const layout = tokens.layout;

  function walk(obj, prefix) {
    for (const [key, val] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object' && '$value' in val) {
        values[path] = String(val.$value);
      } else if (val && typeof val === 'object') {
        walk(val, path);
      }
    }
  }

  walk(layout, '');
  return values;
}

/**
 * Calculate overlap percentage between two token sets.
 * Returns the percentage of token paths that have identical values.
 */
function calculateOverlap(tokensA, tokensB) {
  const valuesA = extractComparableValues(tokensA);
  const valuesB = extractComparableValues(tokensB);

  const allPaths = new Set([...Object.keys(valuesA), ...Object.keys(valuesB)]);
  let matches = 0;

  for (const path of allPaths) {
    if (valuesA[path] === valuesB[path]) {
      matches++;
    }
  }

  return (matches / allPaths.size) * 100;
}

describe('PDL-14: AI Layout Uniqueness Validation', () => {
  let generatedTokenSets;

  beforeAll(async () => {
    // Generate tokens for all 10 brands using mock AI service
    generatedTokenSets = [];

    for (const brand of MOCK_BRANDS) {
      const mockTokens = generateMockTokensForBrand(brand);
      const mockAiService = {
        generateText: jest.fn().mockResolvedValue({
          text: JSON.stringify(mockTokens),
          provider: 'claude',
          model: 'claude-3-haiku',
          inputTokens: 500,
          outputTokens: 800,
          costUsd: 0.001,
          latencyMs: 1500,
        }),
      };

      const result = await generateAILayoutTokens({
        brandProfile: brand,
        aiService: mockAiService,
        options: { maxRetries: 0 },
      });

      generatedTokenSets.push({
        brand: brand.name,
        tokens: result ? result.tokens : null,
        source: result ? result.source : 'failed',
      });
    }
  });

  it('generates tokens for all 10 brands', () => {
    for (const set of generatedTokenSets) {
      expect(set.tokens).not.toBeNull();
      expect(set.source).toBe('ai');
    }
  });

  it('all generated tokens pass validation', () => {
    const { validateLayoutTokens } = require('../src/validators/layout-token-validator');
    for (const set of generatedTokenSets) {
      const validation = validateLayoutTokens(set.tokens);
      expect(validation.valid).toBe(true);
    }
  });

  it('no pair of brands has > 80% token overlap', () => {
    const overlaps = [];

    for (let i = 0; i < generatedTokenSets.length; i++) {
      for (let j = i + 1; j < generatedTokenSets.length; j++) {
        const overlap = calculateOverlap(
          generatedTokenSets[i].tokens,
          generatedTokenSets[j].tokens
        );
        overlaps.push({
          brandA: generatedTokenSets[i].brand,
          brandB: generatedTokenSets[j].brand,
          overlap: Math.round(overlap * 10) / 10,
        });

        expect(overlap).toBeLessThan(80);
      }
    }
  });

  it('family names are unique across all brands', () => {
    const familyNames = generatedTokenSets
      .map((s) => s.tokens.layout.family.name.$value)
      .filter(Boolean);

    const uniqueNames = new Set(familyNames);
    expect(uniqueNames.size).toBe(familyNames.length);
  });

  it('corner radius values vary across brands', () => {
    const radii = generatedTokenSets
      .map((s) => s.tokens.layout.corner.radiusBase.$value);
    const uniqueRadii = new Set(radii);
    // At least 50% of brands should have unique corner radius
    expect(uniqueRadii.size).toBeGreaterThanOrEqual(Math.ceil(MOCK_BRANDS.length * 0.5));
  });

  it('animation durations vary across brands', () => {
    const durations = generatedTokenSets
      .map((s) => s.tokens.layout.animation.duration.$value);
    const uniqueDurations = new Set(durations);
    expect(uniqueDurations.size).toBeGreaterThanOrEqual(Math.ceil(MOCK_BRANDS.length * 0.5));
  });

  it('whitespace multipliers vary across brands', () => {
    const multipliers = generatedTokenSets
      .map((s) => s.tokens.layout.whitespace.multiplier.$value);
    const uniqueMultipliers = new Set(multipliers);
    expect(uniqueMultipliers.size).toBeGreaterThanOrEqual(Math.ceil(MOCK_BRANDS.length * 0.5));
  });
});
