'use strict';

const { LAYOUT_FAMILIES, VALID_ARCHETYPES } = require('./types');

/**
 * Archetype-to-family mapping: primary and fallback family for each archetype.
 * @type {Object<string, {primary: string, fallback: string}>}
 */
const ARCHETYPE_FAMILY_MAP = {
  'Innocent': { primary: 'ethereal', fallback: 'warm-artisan' },
  'Dreamer': { primary: 'ethereal', fallback: 'adventurous-open' },
  'Creator': { primary: 'warm-artisan', fallback: 'playful-dynamic' },
  'Caregiver': { primary: 'warm-artisan', fallback: 'ethereal' },
  'Explorer': { primary: 'adventurous-open', fallback: 'warm-artisan' },
  'Sage': { primary: 'adventurous-open', fallback: 'bold-structured' },
  'Ruler': { primary: 'bold-structured', fallback: 'adventurous-open' },
  'Hero': { primary: 'bold-structured', fallback: 'rebel-edge' },
  'Jester': { primary: 'playful-dynamic', fallback: 'warm-artisan' },
  'Magician': { primary: 'playful-dynamic', fallback: 'adventurous-open' },
  'Rebel': { primary: 'rebel-edge', fallback: 'bold-structured' },
  'Outlaw': { primary: 'rebel-edge', fallback: 'playful-dynamic' },
  'Everyman': { primary: 'warm-artisan', fallback: 'bold-structured' },
  'Lover': { primary: 'ethereal', fallback: 'warm-artisan' },
};

/**
 * Positional weights for archetypes: first=1.0, second=0.6, third=0.3, rest=0.2.
 * @type {number[]}
 */
const ARCHETYPE_WEIGHTS = [1.0, 0.6, 0.3];

/**
 * Fallback contribution ratio (weight * this factor).
 * @type {number}
 */
const FALLBACK_RATIO = 0.3;

/**
 * Initialize a scores map with all families at 0.
 * @returns {Object<string, number>}
 */
function initScores() {
  /** @type {Object<string, number>} */
  const scores = {};
  for (const family of LAYOUT_FAMILIES) {
    scores[family] = 0;
  }
  return scores;
}

/**
 * Apply archetype-based scoring to the family scores.
 * @param {string[]} archetypes - Ordered list of archetypes
 * @param {Object<string, number>} scores - Mutable scores map
 */
function applyArchetypeScoring(archetypes, scores) {
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    const mapping = ARCHETYPE_FAMILY_MAP[archetype];
    if (!mapping) {
      continue; // Skip unknown archetypes
    }

    const weight = i < ARCHETYPE_WEIGHTS.length
      ? ARCHETYPE_WEIGHTS[i]
      : 0.2;

    scores[mapping.primary] += weight;
    scores[mapping.fallback] += weight * FALLBACK_RATIO;
  }
}

/**
 * Apply personality trait modifiers to the family scores.
 *
 * Modifier rules:
 * - formalCasual: low(1-2) -> bold-structured+0.3, high(4-5) -> playful-dynamic+0.3
 * - traditionalModern: low(1-2) -> warm-artisan+0.2, high(4-5) -> adventurous-open+0.2
 * - seriousPlayful: low(1-2) -> bold-structured+0.2, high(4-5) -> playful-dynamic+0.2
 * - conservativeBold: low(1-2) -> ethereal+0.2, high(4-5) -> rebel-edge+0.2
 * - minimalExpressive: low(1-2) -> ethereal+0.3, high(4-5) -> playful-dynamic+0.3
 *
 * @param {import('./types').PersonalityTraits} traits
 * @param {Object<string, number>} scores - Mutable scores map
 */
function applyPersonalityModifiers(traits, scores) {
  if (!traits) {
    return;
  }

  // formalCasual
  if (traits.formalCasual <= 2) {
    scores['bold-structured'] += 0.3;
  } else if (traits.formalCasual >= 4) {
    scores['playful-dynamic'] += 0.3;
  }

  // traditionalModern
  if (traits.traditionalModern <= 2) {
    scores['warm-artisan'] += 0.2;
  } else if (traits.traditionalModern >= 4) {
    scores['adventurous-open'] += 0.2;
  }

  // seriousPlayful
  if (traits.seriousPlayful <= 2) {
    scores['bold-structured'] += 0.2;
  } else if (traits.seriousPlayful >= 4) {
    scores['playful-dynamic'] += 0.2;
  }

  // conservativeBold
  if (traits.conservativeBold <= 2) {
    scores['ethereal'] += 0.2;
  } else if (traits.conservativeBold >= 4) {
    scores['rebel-edge'] += 0.2;
  }

  // minimalExpressive
  if (traits.minimalExpressive <= 2) {
    scores['ethereal'] += 0.3;
  } else if (traits.minimalExpressive >= 4) {
    scores['playful-dynamic'] += 0.3;
  }
}

/**
 * Resolve the winning layout family from archetypes and personality traits.
 *
 * @param {string[]} archetypes - Ordered list of brand archetypes (primary first)
 * @param {import('./types').PersonalityTraits} traits - Personality scale values (1-5)
 * @returns {{ family: string, scores: Object<string, number> }}
 */
function resolveFamily(archetypes, traits) {
  const scores = initScores();

  const validArchetypes = Array.isArray(archetypes)
    ? archetypes.filter((a) => VALID_ARCHETYPES.includes(a))
    : [];

  if (validArchetypes.length === 0) {
    // Default to warm-artisan when no valid archetypes provided
    scores['warm-artisan'] = 1.0;
    return { family: 'warm-artisan', scores };
  }

  applyArchetypeScoring(validArchetypes, scores);
  applyPersonalityModifiers(traits, scores);

  // Find the family with the highest score
  let winningFamily = LAYOUT_FAMILIES[0];
  let highestScore = -1;
  for (const family of LAYOUT_FAMILIES) {
    if (scores[family] > highestScore) {
      highestScore = scores[family];
      winningFamily = family;
    }
  }

  return { family: winningFamily, scores };
}

module.exports = {
  resolveFamily,
  ARCHETYPE_FAMILY_MAP,
  ARCHETYPE_WEIGHTS,
  FALLBACK_RATIO,
};
