'use strict';

/**
 * Determine the W3C DTCG token $type for a given value.
 *
 * - Strings ending in px, vh, vw, em, rem -> "dimension"
 * - Strings ending in ms, s (duration) -> "duration"
 * - Strings starting with "cubic-bezier" -> "cubicBezier"
 * - Numbers -> "number"
 * - Everything else -> "string"
 *
 * @param {*} value
 * @returns {string}
 */
function inferTokenType(value) {
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value !== 'string') {
    return 'string';
  }
  if (/^\d+(\.\d+)?(px|vh|vw|em|rem)$/.test(value)) {
    return 'dimension';
  }
  if (/^\d+(\.\d+)?m?s$/.test(value)) {
    return 'duration';
  }
  if (value.startsWith('cubic-bezier')) {
    return 'cubicBezier';
  }
  return 'string';
}

/**
 * Token descriptions for well-known token paths.
 * @type {Object<string, Object<string, string>>}
 */
const TOKEN_DESCRIPTIONS = {
  corner: {
    radiusBase: 'Base corner radius for general elements',
    radiusSmall: 'Small corner radius for compact elements',
    radiusLarge: 'Large corner radius for hero/card elements',
  },
  whitespace: {
    density: 'Overall whitespace density category',
    multiplier: 'Whitespace scaling multiplier',
    sectionGap: 'Vertical gap between major sections',
    contentPadding: 'Content area padding',
  },
  nav: {
    style: 'Navigation layout style',
    width: 'Navigation width',
    height: 'Navigation height',
  },
  divider: {
    style: 'Section divider visual style',
    height: 'Divider stroke height',
  },
  animation: {
    entrance: 'Element entrance animation type',
    duration: 'Animation duration',
    easing: 'Animation easing curve',
  },
  grid: {
    rhythm: 'Grid layout rhythm pattern',
    maxWidth: 'Maximum content width',
    columns: 'Number of grid columns',
  },
  section: {
    background: 'Section background treatment',
    heroHeight: 'Hero section viewport height',
  },
  component: {
    cardShape: 'Card element shape style',
    shadowIntensity: 'Component shadow depth',
  },
};

/**
 * Emit W3C DTCG compliant layout tokens from a family preset.
 *
 * Every token has { $value, $type, $description }.
 *
 * @param {string} familyName - The resolved family name
 * @param {import('./types').LayoutTokenPreset} modulatedPreset - Modulated token preset
 * @returns {Object} W3C DTCG compliant token object
 */
function emitTokens(familyName, modulatedPreset) {
  const layout = {
    family: {
      name: {
        $value: familyName,
        $type: 'string',
        $description: 'Resolved layout family name',
      },
    },
  };

  const categories = ['corner', 'whitespace', 'nav', 'divider', 'animation', 'grid', 'section', 'component'];

  for (const category of categories) {
    const categoryData = modulatedPreset[category];
    if (!categoryData) {
      continue;
    }

    layout[category] = {};
    const descriptions = TOKEN_DESCRIPTIONS[category] || {};

    for (const [key, value] of Object.entries(categoryData)) {
      layout[category][key] = {
        $value: value,
        $type: inferTokenType(value),
        $description: descriptions[key] || `${category}.${key} layout token`,
      };
    }
  }

  return { layout };
}

module.exports = {
  emitTokens,
  inferTokenType,
};
