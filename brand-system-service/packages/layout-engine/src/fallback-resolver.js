'use strict';

const { resolveLayout } = require('./index');
const { generateAILayoutTokens } = require('./ai-layout-generator');

/**
 * Determines layout tokens based on available inputs (SYNC version).
 * Priority: AI brief > fallback engine > defaults
 *
 * This is the original synchronous resolver. It does NOT call the LLM.
 * For AI-first generation, use resolveLayoutTokensAsync().
 *
 * @param {object} options
 * @param {object|null} options.layoutBrief - Parsed layout brief (from AI pipeline)
 * @param {object|null} options.brandProfile - Brand profile with archetypes and traits
 * @param {object} options.featureFlags - { enabled: boolean, fallbackOnly: boolean }
 * @returns {{ tokens: object|null, source: 'ai'|'fallback'|'default'|'disabled', family: string|null }}
 */
function resolveLayoutTokens({ layoutBrief, brandProfile, featureFlags }) {
  // 1. Feature flag check
  if (!featureFlags || !featureFlags.enabled) {
    return { tokens: null, source: 'disabled', family: null };
  }

  // 2. AI brief takes precedence (unless fallbackOnly)
  if (layoutBrief && !featureFlags.fallbackOnly) {
    const tokens = layoutBrief.tokens || layoutBrief;
    const family = (layoutBrief.family_suggestion && layoutBrief.family_suggestion.primary) || 'unknown';
    return { tokens, source: 'ai', family };
  }

  // 3. Fallback: use layout engine
  if (brandProfile && brandProfile.personality && brandProfile.personality.archetypes) {
    const traits = brandProfile.personality.traits || {};
    const input = {
      archetypes: brandProfile.personality.archetypes,
      personalityTraits: {
        formalCasual: traits.formal_casual || 3,
        traditionalModern: traits.traditional_modern || 3,
        seriousPlayful: traits.serious_playful || 3,
        conservativeBold: traits.conservative_bold || 3,
        minimalExpressive: traits.minimal_expressive || 3,
      },
      buildType: 'brand-book',
    };
    const result = resolveLayout(input);
    return { tokens: result.tokens, source: 'fallback', family: result.family };
  }

  // 4. No brand profile -- use defaults (backward compat)
  return { tokens: null, source: 'default', family: 'bold-structured' };
}

/**
 * Resolve layout tokens using a fallback-safe family resolver (SYNC helper).
 * Extracted to avoid code duplication between sync and async paths.
 *
 * @param {object} brandProfile
 * @returns {{ tokens: object, source: 'fallback', family: string }}
 */
function resolveFallbackTokens(brandProfile) {
  const traits = brandProfile.personality.traits || {};
  const input = {
    archetypes: brandProfile.personality.archetypes,
    personalityTraits: {
      formalCasual: traits.formal_casual || 3,
      traditionalModern: traits.traditional_modern || 3,
      seriousPlayful: traits.serious_playful || 3,
      conservativeBold: traits.conservative_bold || 3,
      minimalExpressive: traits.minimal_expressive || 3,
    },
    buildType: 'brand-book',
  };
  const result = resolveLayout(input);
  return { tokens: result.tokens, source: 'fallback', family: result.family };
}

/**
 * Determines layout tokens with AI-first generation (ASYNC version).
 * Priority: AI generation > AI brief > fallback engine > defaults
 *
 * This is the new async resolver that calls the LLM to generate
 * unique per-brand tokens. Falls back to family-based on any failure.
 *
 * @param {object} options
 * @param {object|null} options.layoutBrief - Parsed layout brief (from AI pipeline)
 * @param {object|null} options.brandProfile - Brand profile with archetypes and traits
 * @param {object} options.featureFlags - { enabled: boolean, fallbackOnly: boolean }
 * @param {object} [options.aiService] - AI service instance with generateText()
 * @param {object} [options.aiOptions] - Options for AI generation (temperature, maxTokens, etc.)
 * @param {object} [options.logger] - Logger instance
 * @returns {Promise<{ tokens: object|null, source: 'ai'|'fallback'|'default'|'disabled', family: string|null }>}
 */
async function resolveLayoutTokensAsync({
  layoutBrief,
  brandProfile,
  featureFlags,
  aiService,
  aiOptions = {},
  logger,
}) {
  // 1. Feature flag check
  if (!featureFlags || !featureFlags.enabled) {
    return { tokens: null, source: 'disabled', family: null };
  }

  // 2. If fallbackOnly, skip AI entirely
  if (featureFlags.fallbackOnly) {
    if (brandProfile && brandProfile.personality && brandProfile.personality.archetypes) {
      return resolveFallbackTokens(brandProfile);
    }
    return { tokens: null, source: 'default', family: 'bold-structured' };
  }

  // 3. Try AI generation (PRIMARY path)
  if (aiService && brandProfile) {
    const aiResult = await generateAILayoutTokens({
      brandProfile,
      aiService,
      options: aiOptions,
      logger,
    });

    if (aiResult) {
      const familyName = aiResult.tokens && aiResult.tokens.layout &&
        aiResult.tokens.layout.family && aiResult.tokens.layout.family.name &&
        aiResult.tokens.layout.family.name.$value;
      return {
        tokens: aiResult.tokens,
        source: 'ai',
        family: familyName || 'ai-generated',
      };
    }
    // AI failed — fall through to other sources
  }

  // 4. AI brief (pre-computed tokens from earlier pipeline stage)
  if (layoutBrief) {
    const tokens = layoutBrief.tokens || layoutBrief;
    const family = (layoutBrief.family_suggestion && layoutBrief.family_suggestion.primary) || 'unknown';
    return { tokens, source: 'ai', family };
  }

  // 5. Fallback: use family-based layout engine
  if (brandProfile && brandProfile.personality && brandProfile.personality.archetypes) {
    return resolveFallbackTokens(brandProfile);
  }

  // 6. No brand profile — use defaults
  return { tokens: null, source: 'default', family: 'bold-structured' };
}

module.exports = { resolveLayoutTokens, resolveLayoutTokensAsync };
