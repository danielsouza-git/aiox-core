'use strict';

/**
 * Reference Output Validator
 *
 * Validates visual-references output structure (parsed as object, not raw markdown).
 * Zero external dependencies.
 *
 * @module reference-output-validator
 */

const VALID_FAMILIES = [
  'ethereal',
  'bold-structured',
  'warm-artisan',
  'adventurous-open',
  'playful-dynamic',
  'rebel-edge',
];

const LAYOUT_PATTERN_FIELDS = [
  'nav_style',
  'whitespace_density',
  'corner_treatment',
  'divider_style',
  'grid_rhythm',
  'animation_approach',
  'section_backgrounds',
];

const MIN_REFERENCES = 5;
const MAX_REFERENCES = 10;
const MIN_RELEVANCE_SCORE = 1;
const MAX_RELEVANCE_SCORE = 5;

/**
 * Validates visual-references output structure.
 *
 * @param {object} output - The parsed visual-references object to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateReferenceOutput(output) {
  const errors = [];

  if (!output || typeof output !== 'object') {
    return { valid: false, errors: ['Output must be a non-null object'] };
  }

  // --- brand (required, string) ---
  if (!output.brand) {
    errors.push('Missing required field: brand');
  } else if (typeof output.brand !== 'string') {
    errors.push('brand must be a string');
  }

  // --- archetypes (required, array of strings) ---
  if (!output.archetypes) {
    errors.push('Missing required field: archetypes');
  } else if (!Array.isArray(output.archetypes)) {
    errors.push('archetypes must be an array');
  } else {
    for (const archetype of output.archetypes) {
      if (typeof archetype !== 'string') {
        errors.push('Each archetype must be a string');
        break;
      }
    }
  }

  // --- resolved_family (required, one of 6 families) ---
  if (!output.resolved_family) {
    errors.push('Missing required field: resolved_family');
  } else if (typeof output.resolved_family !== 'string') {
    errors.push('resolved_family must be a string');
  } else if (!VALID_FAMILIES.includes(output.resolved_family)) {
    errors.push(`Invalid resolved_family: "${output.resolved_family}". Valid: ${VALID_FAMILIES.join(', ')}`);
  }

  // --- references (required, array of 5-10 items) ---
  if (!output.references) {
    errors.push('Missing required field: references');
  } else if (!Array.isArray(output.references)) {
    errors.push('references must be an array');
  } else {
    if (output.references.length < MIN_REFERENCES) {
      errors.push(`references must have at least ${MIN_REFERENCES} items, got ${output.references.length}`);
    }
    if (output.references.length > MAX_REFERENCES) {
      errors.push(`references must have at most ${MAX_REFERENCES} items, got ${output.references.length}`);
    }

    output.references.forEach((ref, index) => {
      const prefix = `references[${index}]`;

      if (!ref || typeof ref !== 'object') {
        errors.push(`${prefix} must be a non-null object`);
        return;
      }

      // url (required, starts with http)
      if (!ref.url) {
        errors.push(`${prefix}.url is required`);
      } else if (typeof ref.url !== 'string') {
        errors.push(`${prefix}.url must be a string`);
      } else if (!ref.url.startsWith('http://') && !ref.url.startsWith('https://')) {
        errors.push(`${prefix}.url must start with http:// or https://`);
      }

      // description (required, string)
      if (!ref.description) {
        errors.push(`${prefix}.description is required`);
      } else if (typeof ref.description !== 'string') {
        errors.push(`${prefix}.description must be a string`);
      }

      // relevance_score (required, 1-5)
      if (ref.relevance_score === undefined || ref.relevance_score === null) {
        errors.push(`${prefix}.relevance_score is required`);
      } else if (typeof ref.relevance_score !== 'number' || !Number.isFinite(ref.relevance_score)) {
        errors.push(`${prefix}.relevance_score must be a number`);
      } else if (ref.relevance_score < MIN_RELEVANCE_SCORE || ref.relevance_score > MAX_RELEVANCE_SCORE) {
        errors.push(`${prefix}.relevance_score must be between ${MIN_RELEVANCE_SCORE} and ${MAX_RELEVANCE_SCORE}`);
      }

      // layout_patterns (required, object with 7 string fields)
      if (!ref.layout_patterns) {
        errors.push(`${prefix}.layout_patterns is required`);
      } else if (typeof ref.layout_patterns !== 'object' || Array.isArray(ref.layout_patterns)) {
        errors.push(`${prefix}.layout_patterns must be an object`);
      } else {
        for (const field of LAYOUT_PATTERN_FIELDS) {
          if (!(field in ref.layout_patterns)) {
            errors.push(`${prefix}.layout_patterns.${field} is required`);
          } else if (typeof ref.layout_patterns[field] !== 'string') {
            errors.push(`${prefix}.layout_patterns.${field} must be a string`);
          }
        }
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateReferenceOutput,
  VALID_FAMILIES,
  LAYOUT_PATTERN_FIELDS,
};
