'use strict';

const { resolveFamily } = require('./family-resolver');
const { modulateTokens } = require('./personality-modulator');
const { emitTokens } = require('./token-emitter');
const { FAMILY_PRESETS } = require('./families');
const {
  LAYOUT_FAMILIES,
  VALID_ARCHETYPES,
  PERSONALITY_TRAITS,
  BUILD_TYPES,
} = require('./types');

/**
 * Build a scoring breakdown object for the output.
 *
 * @param {Object<string, number>} scores - Raw scores per family
 * @returns {import('./types').FamilyScoringBreakdown}
 */
function buildScoringBreakdown(scores) {
  let winningFamily = '';
  let highestScore = -1;
  for (const [family, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      winningFamily = family;
    }
  }

  // Round scores for clean output
  /** @type {Object<string, number>} */
  const roundedScores = {};
  for (const [family, score] of Object.entries(scores)) {
    roundedScores[family] = +score.toFixed(4);
  }

  return {
    family: winningFamily,
    scores: roundedScores,
    method: 'archetype-weighted',
  };
}

/**
 * Validate the layout engine input.
 *
 * @param {import('./types').LayoutEngineInput} input
 * @throws {Error} If input is invalid
 */
function validateInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('LayoutEngineInput is required and must be an object');
  }
  if (!Array.isArray(input.archetypes)) {
    throw new Error('archetypes must be an array of strings');
  }
  if (!input.personalityTraits || typeof input.personalityTraits !== 'object') {
    throw new Error('personalityTraits is required and must be an object');
  }

  const traits = input.personalityTraits;
  for (const trait of PERSONALITY_TRAITS) {
    const value = traits[trait];
    if (typeof value !== 'number' || value < 1 || value > 5) {
      throw new Error(`personalityTraits.${trait} must be a number between 1 and 5, got ${value}`);
    }
  }
}

/**
 * Resolve a complete layout from brand archetypes and personality traits.
 *
 * Pure function: same input always produces same output.
 * Zero side effects, zero external dependencies.
 *
 * @param {import('./types').LayoutEngineInput} input
 * @returns {import('./types').LayoutEngineOutput}
 */
function resolveLayout(input) {
  validateInput(input);

  // 1. Resolve family from archetypes + personality
  const { family, scores } = resolveFamily(input.archetypes, input.personalityTraits);

  // 2. Get base family preset
  const basePreset = FAMILY_PRESETS[family];
  if (!basePreset) {
    throw new Error(`Unknown layout family: ${family}`);
  }

  // 3. Modulate preset with personality traits
  const modulatedPreset = modulateTokens(basePreset, input.personalityTraits);

  // 4. Emit W3C DTCG tokens
  const tokens = emitTokens(family, modulatedPreset);

  // 5. Build scoring breakdown
  const scoring = buildScoringBreakdown(scores);

  return { family, tokens, scoring };
}

// PDL-4: Layout CSS generation pipeline
const { parseBrief, extractRecommendations, extractFamilySuggestion } = require('./layout-brief-parser');
const {
  generateLayoutCSS,
  generateNavCSS,
  generateDividerCSS,
  generateAnimationCSS,
  generateGridCSS,
  generateSectionBgCSS,
  generateResponsiveCSS,
  generateCustomProperties,
} = require('./layout-css-generator');
const { DEFAULT_LAYOUT, mergeWithDefaults, deepMerge } = require('./defaults');

// PDL-11: Fallback integration
const { resolveLayoutTokens, resolveLayoutTokensAsync } = require('./fallback-resolver');
const { writeLayoutTokens } = require('./token-writer');
const { validateLayoutTokens } = require('./validators/layout-token-validator');
const { generateCSSVariables } = require('./css-var-generator');

// PDL-4/12: AI layout generation
const { generateAILayoutTokens } = require('./ai-layout-generator');

module.exports = {
  resolveLayout,
  LAYOUT_FAMILIES,
  VALID_ARCHETYPES,
  PERSONALITY_TRAITS,
  BUILD_TYPES,
  FAMILY_PRESETS,
  // PDL-4: Layout brief parsing
  parseBrief,
  extractRecommendations,
  extractFamilySuggestion,
  // PDL-4: Layout CSS generation
  generateLayoutCSS,
  generateNavCSS,
  generateDividerCSS,
  generateAnimationCSS,
  generateGridCSS,
  generateSectionBgCSS,
  generateResponsiveCSS,
  generateCustomProperties,
  // PDL-4: Defaults and merging
  DEFAULT_LAYOUT,
  mergeWithDefaults,
  deepMerge,
  // PDL-11: Fallback integration
  resolveLayoutTokens,
  resolveLayoutTokensAsync,
  writeLayoutTokens,
  validateLayoutTokens,
  generateCSSVariables,
  // PDL-4/12: AI layout generation
  generateAILayoutTokens,
};
