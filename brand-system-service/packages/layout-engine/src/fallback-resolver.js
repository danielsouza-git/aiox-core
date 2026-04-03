'use strict';

const { resolveLayout } = require('./index');

/**
 * Determines layout tokens based on available inputs.
 * Priority: AI brief > fallback engine > defaults
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

module.exports = { resolveLayoutTokens };
