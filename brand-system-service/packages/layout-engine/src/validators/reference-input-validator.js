'use strict';

/**
 * Reference Input Validator
 *
 * Validates brand profile input for the visual reference research task.
 * Zero external dependencies.
 *
 * @module reference-input-validator
 */

const VALID_ARCHETYPES = [
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
];

const PERSONALITY_TRAIT_FIELDS = [
  'formal_casual',
  'traditional_modern',
  'serious_playful',
  'conservative_bold',
  'minimal_expressive',
];

const MIN_ARCHETYPES = 1;
const MAX_ARCHETYPES = 3;
const MIN_TRAIT_VALUE = 1;
const MAX_TRAIT_VALUE = 5;

/**
 * Validates brand profile input for reference research.
 *
 * @param {object} input - The brand profile input to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateReferenceInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Input must be a non-null object'] };
  }

  // --- archetypes (required, 1-3 strings from valid set) ---
  if (!input.archetypes) {
    errors.push('Missing required field: archetypes');
  } else if (!Array.isArray(input.archetypes)) {
    errors.push('archetypes must be an array');
  } else {
    if (input.archetypes.length < MIN_ARCHETYPES) {
      errors.push(`archetypes must have at least ${MIN_ARCHETYPES} item`);
    }
    if (input.archetypes.length > MAX_ARCHETYPES) {
      errors.push(`archetypes must have at most ${MAX_ARCHETYPES} items`);
    }
    for (const archetype of input.archetypes) {
      if (typeof archetype !== 'string') {
        errors.push(`Each archetype must be a string, got ${typeof archetype}`);
      } else if (!VALID_ARCHETYPES.includes(archetype)) {
        errors.push(`Invalid archetype: "${archetype}". Valid: ${VALID_ARCHETYPES.join(', ')}`);
      }
    }
  }

  // --- personality_traits (required, 5 scales 1-5) ---
  if (!input.personality_traits) {
    errors.push('Missing required field: personality_traits');
  } else if (typeof input.personality_traits !== 'object' || Array.isArray(input.personality_traits)) {
    errors.push('personality_traits must be an object');
  } else {
    for (const field of PERSONALITY_TRAIT_FIELDS) {
      if (!(field in input.personality_traits)) {
        errors.push(`Missing personality trait field: ${field}`);
      } else {
        const value = input.personality_traits[field];
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          errors.push(`personality_traits.${field} must be a number`);
        } else if (value < MIN_TRAIT_VALUE || value > MAX_TRAIT_VALUE) {
          errors.push(`personality_traits.${field} must be between ${MIN_TRAIT_VALUE} and ${MAX_TRAIT_VALUE}, got ${value}`);
        }
      }
    }
  }

  // --- industry (required, non-empty string) ---
  if (!input.industry) {
    errors.push('Missing required field: industry');
  } else if (typeof input.industry !== 'string') {
    errors.push('industry must be a string');
  } else if (input.industry.trim().length === 0) {
    errors.push('industry must be a non-empty string');
  }

  // --- visual_preferences (optional, object if present) ---
  if (input.visual_preferences !== undefined && input.visual_preferences !== null) {
    if (typeof input.visual_preferences !== 'object' || Array.isArray(input.visual_preferences)) {
      errors.push('visual_preferences must be an object when provided');
    }
  }

  // --- mood_keywords (optional, array of strings if present) ---
  if (input.mood_keywords !== undefined && input.mood_keywords !== null) {
    if (!Array.isArray(input.mood_keywords)) {
      errors.push('mood_keywords must be an array when provided');
    } else {
      for (const keyword of input.mood_keywords) {
        if (typeof keyword !== 'string') {
          errors.push('Each mood_keyword must be a string');
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateReferenceInput,
  VALID_ARCHETYPES,
  PERSONALITY_TRAIT_FIELDS,
};
