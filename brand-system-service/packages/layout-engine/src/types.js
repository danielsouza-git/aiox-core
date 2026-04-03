'use strict';

/**
 * @bss/layout-engine type definitions
 * Pure constants and JSDoc typedefs for the Layout Personality Engine.
 */

/** @type {readonly string[]} */
const LAYOUT_FAMILIES = Object.freeze([
  'ethereal',
  'bold-structured',
  'warm-artisan',
  'adventurous-open',
  'playful-dynamic',
  'rebel-edge',
]);

/** @type {readonly string[]} */
const VALID_ARCHETYPES = Object.freeze([
  'Innocent',
  'Dreamer',
  'Creator',
  'Caregiver',
  'Explorer',
  'Sage',
  'Ruler',
  'Hero',
  'Jester',
  'Magician',
  'Rebel',
  'Outlaw',
  'Everyman',
  'Lover',
]);

/** @type {readonly string[]} */
const PERSONALITY_TRAITS = Object.freeze([
  'formalCasual',
  'traditionalModern',
  'seriousPlayful',
  'conservativeBold',
  'minimalExpressive',
]);

/** @type {readonly string[]} */
const BUILD_TYPES = Object.freeze([
  'brand-book',
  'landing-page',
  'site',
  'social-post',
]);

/**
 * @typedef {Object} PersonalityTraits
 * @property {number} formalCasual - 1 (very formal) to 5 (very casual)
 * @property {number} traditionalModern - 1 (very traditional) to 5 (very modern)
 * @property {number} seriousPlayful - 1 (very serious) to 5 (very playful)
 * @property {number} conservativeBold - 1 (very conservative) to 5 (very bold)
 * @property {number} minimalExpressive - 1 (very minimal) to 5 (very expressive)
 */

/**
 * @typedef {Object} LayoutEngineInput
 * @property {string[]} archetypes - Ordered list of brand archetypes (primary first)
 * @property {PersonalityTraits} personalityTraits - Personality scale values (1-5)
 * @property {string} [buildType] - Optional build type context
 */

/**
 * @typedef {Object} FamilyScoringBreakdown
 * @property {string} family - Winning family name
 * @property {Object<string, number>} scores - Score per family
 * @property {string} method - 'archetype-weighted' scoring method
 */

/**
 * @typedef {Object} LayoutEngineOutput
 * @property {string} family - Resolved layout family name
 * @property {Object} tokens - W3C DTCG compliant token object
 * @property {FamilyScoringBreakdown} scoring - Scoring breakdown
 */

/**
 * @typedef {Object} LayoutTokenPreset
 * @property {Object} corner - Corner radius tokens
 * @property {string} corner.radiusBase
 * @property {string} corner.radiusSmall
 * @property {string} corner.radiusLarge
 * @property {Object} whitespace - Whitespace tokens
 * @property {string} whitespace.density
 * @property {number} whitespace.multiplier
 * @property {string} whitespace.sectionGap
 * @property {string} whitespace.contentPadding
 * @property {Object} nav - Navigation tokens
 * @property {string} nav.style
 * @property {string} nav.width
 * @property {string} nav.height
 * @property {Object} divider - Divider tokens
 * @property {string} divider.style
 * @property {string} divider.height
 * @property {Object} animation - Animation tokens
 * @property {string} animation.entrance
 * @property {string} animation.duration
 * @property {string} animation.easing
 * @property {Object} grid - Grid tokens
 * @property {string} grid.rhythm
 * @property {string} grid.maxWidth
 * @property {number} grid.columns
 * @property {Object} section - Section tokens
 * @property {string} section.background
 * @property {string} section.heroHeight
 * @property {Object} component - Component tokens
 * @property {string} component.cardShape
 * @property {string} component.shadowIntensity
 */

module.exports = {
  LAYOUT_FAMILIES,
  VALID_ARCHETYPES,
  PERSONALITY_TRAITS,
  BUILD_TYPES,
};
