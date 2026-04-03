'use strict';

/**
 * CSS Variable Generator
 *
 * Generates CSS custom property declarations from W3C DTCG layout.json tokens.
 * Flattens nested DTCG tokens to --layout-* CSS variables.
 *
 * @module css-var-generator
 */

/**
 * Flatten a DTCG token tree into a flat map of CSS variable name -> value.
 *
 * Given: { layout: { corner: { radiusBase: { $value: '24px', ... } } } }
 * Produces: { '--layout-corner-radiusBase': '24px' }
 *
 * @param {object} obj - The current object being traversed
 * @param {string} prefix - The current CSS variable prefix
 * @param {object} result - Accumulator for flattened variables
 * @returns {object} Flat map of CSS variable names to values
 */
function flattenTokens(obj, prefix, result) {
  if (!obj || typeof obj !== 'object') {
    return result;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && '$value' in value) {
      // Leaf token - emit CSS variable
      const varName = prefix ? `${prefix}-${key}` : `--layout-${key}`;
      result[varName] = value.$value;
    } else if (value && typeof value === 'object') {
      // Nested group - recurse
      const nextPrefix = prefix ? `${prefix}-${key}` : `--layout-${key}`;
      flattenTokens(value, nextPrefix, result);
    }
  }

  return result;
}

/**
 * Generate CSS custom property declarations from W3C DTCG layout tokens.
 *
 * Flattens nested DTCG tokens to --layout-* CSS vars with fallback pattern:
 *   --layout-corner-radiusBase: var(--layout-corner-radiusBase, 8px);
 *
 * @param {object|null} tokens - The DTCG layout tokens (e.g., { layout: { ... } })
 * @returns {string} CSS string with :root block, or empty string if no tokens
 */
function generateCSSVariables(tokens) {
  if (!tokens || typeof tokens !== 'object') {
    return '';
  }

  // Start from the 'layout' key if present, otherwise use the whole object
  const root = tokens.layout || tokens;
  const vars = flattenTokens(root, '', {});

  const entries = Object.entries(vars);
  if (entries.length === 0) {
    return '';
  }

  const lines = entries.map(([name, value]) => {
    return `  ${name}: var(${name}, ${value});`;
  });

  return `:root {\n${lines.join('\n')}\n}`;
}

module.exports = {
  generateCSSVariables,
  flattenTokens,
};
