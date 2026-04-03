'use strict';

/**
 * Parse a CSS dimension string like '24px' or '60vh' into { value, unit }.
 * @param {string} dimension
 * @returns {{ value: number, unit: string }}
 */
function parseDimension(dimension) {
  const match = String(dimension).match(/^(-?\d+(?:\.\d+)?)\s*(px|vh|vw|em|rem|ms|%)?$/);
  if (!match) {
    return { value: parseFloat(dimension) || 0, unit: '' };
  }
  return { value: parseFloat(match[1]), unit: match[2] || '' };
}

/**
 * Scale a CSS dimension string by a factor.
 * '24px' * 1.3 = '31px' (rounded to nearest integer for px).
 *
 * @param {string} value - CSS dimension string (e.g., '24px', '60vh')
 * @param {number} factor - Multiplier
 * @returns {string} Scaled dimension string
 */
function scaleDimension(value, factor) {
  const parsed = parseDimension(value);
  const scaled = parsed.value * factor;
  const rounded = Math.round(scaled);
  return `${rounded}${parsed.unit}`;
}

/**
 * Deep clone a preset object (simple JSON-safe objects only).
 * @param {import('./types').LayoutTokenPreset} preset
 * @returns {import('./types').LayoutTokenPreset}
 */
function deepClone(preset) {
  return JSON.parse(JSON.stringify(preset));
}

/**
 * Modulate base family tokens based on personality traits.
 *
 * Modulation rules:
 * - Whitespace: minimalExpressive<=2 -> multiplier*1.2, sectionGap*1.2; >=4 -> multiplier*0.9
 * - Corner radius: formalCasual>=4 -> radiusBase*1.3; <=2 -> radiusBase*0.5
 * - Animation: conservativeBold>=4 -> duration*0.7
 * - Grid: minimalExpressive>=4 -> maxWidth='1200px'
 *
 * @param {import('./types').LayoutTokenPreset} baseTokens - Base family preset
 * @param {import('./types').PersonalityTraits} traits - Personality scale values (1-5)
 * @returns {import('./types').LayoutTokenPreset} Modulated preset (new object)
 */
function modulateTokens(baseTokens, traits) {
  const tokens = deepClone(baseTokens);

  if (!traits) {
    return tokens;
  }

  // Whitespace modulation based on minimalExpressive
  if (traits.minimalExpressive <= 2) {
    tokens.whitespace.multiplier = +(tokens.whitespace.multiplier * 1.2).toFixed(2);
    tokens.whitespace.sectionGap = scaleDimension(tokens.whitespace.sectionGap, 1.2);
  } else if (traits.minimalExpressive >= 4) {
    tokens.whitespace.multiplier = +(tokens.whitespace.multiplier * 0.9).toFixed(2);
  }

  // Corner radius modulation based on formalCasual
  if (traits.formalCasual >= 4) {
    tokens.corner.radiusBase = scaleDimension(tokens.corner.radiusBase, 1.3);
  } else if (traits.formalCasual <= 2) {
    tokens.corner.radiusBase = scaleDimension(tokens.corner.radiusBase, 0.5);
  }

  // Animation duration modulation based on conservativeBold
  if (traits.conservativeBold >= 4) {
    tokens.animation.duration = scaleDimension(tokens.animation.duration, 0.7);
  }

  // Grid width modulation based on minimalExpressive
  if (traits.minimalExpressive >= 4) {
    tokens.grid.maxWidth = '1200px';
  }

  return tokens;
}

module.exports = {
  modulateTokens,
  scaleDimension,
};
