'use strict';

/**
 * Required token paths in the W3C DTCG layout.json structure.
 * Each path is a dot-separated string representing nested keys.
 *
 * @type {string[]}
 */
const REQUIRED_TOKEN_PATHS = [
  'layout.family.name',
  'layout.corner.radiusBase',
  'layout.whitespace.density',
  'layout.whitespace.multiplier',
  'layout.whitespace.sectionGap',
  'layout.whitespace.contentPadding',
  'layout.nav.style',
  'layout.nav.width',
  'layout.nav.height',
  'layout.divider.style',
  'layout.divider.height',
  'layout.animation.entrance',
  'layout.animation.duration',
  'layout.animation.easing',
  'layout.grid.rhythm',
  'layout.grid.maxWidth',
  'layout.grid.columns',
  'layout.section.background',
  'layout.section.heroHeight',
  'layout.component.cardShape',
  'layout.component.shadowIntensity',
];

/**
 * Valid $type values per W3C DTCG spec.
 *
 * @type {string[]}
 */
const VALID_TYPES = [
  'string',
  'number',
  'dimension',
  'duration',
  'cubicBezier',
  'color',
  'fontFamily',
  'fontWeight',
  'strokeStyle',
  'border',
  'transition',
  'shadow',
  'gradient',
  'typography',
];

/**
 * Resolve a dot-separated path to a value in a nested object.
 *
 * @param {object} obj - The object to traverse
 * @param {string} dotPath - e.g. 'layout.family.name'
 * @returns {*} The value at the path, or undefined if not found
 */
function resolvePath(obj, dotPath) {
  const parts = dotPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

/**
 * Validates a W3C DTCG layout token structure.
 *
 * Checks:
 * 1. All required token paths exist
 * 2. Each token has $value, $type, $description
 * 3. $type is a valid DTCG type
 *
 * @param {object} tokens - The layout token object (e.g., { layout: { ... } })
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateLayoutTokens(tokens) {
  const errors = [];

  if (!tokens || typeof tokens !== 'object') {
    return { valid: false, errors: ['Tokens must be a non-null object'] };
  }

  if (!tokens.layout || typeof tokens.layout !== 'object') {
    return { valid: false, errors: ['Tokens must have a "layout" top-level key'] };
  }

  // Check all required paths
  for (const tokenPath of REQUIRED_TOKEN_PATHS) {
    const token = resolvePath(tokens, tokenPath);
    if (token === undefined) {
      errors.push(`Missing required token path: ${tokenPath}`);
      continue;
    }

    // Each leaf token must have $value, $type, $description
    if (token.$value === undefined) {
      errors.push(`Token at ${tokenPath} is missing $value`);
    }
    if (!token.$type) {
      errors.push(`Token at ${tokenPath} is missing $type`);
    } else if (!VALID_TYPES.includes(token.$type)) {
      errors.push(`Token at ${tokenPath} has invalid $type: "${token.$type}"`);
    }
    if (!token.$description) {
      errors.push(`Token at ${tokenPath} is missing $description`);
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateLayoutTokens,
  REQUIRED_TOKEN_PATHS,
  VALID_TYPES,
};
