'use strict';

const ethereal = require('./ethereal');
const boldStructured = require('./bold-structured');
const warmArtisan = require('./warm-artisan');
const adventurousOpen = require('./adventurous-open');
const playfulDynamic = require('./playful-dynamic');
const rebelEdge = require('./rebel-edge');

/**
 * Registry of all 6 layout family presets.
 * @type {Object<string, import('../types').LayoutTokenPreset>}
 */
const FAMILY_PRESETS = {
  'ethereal': ethereal,
  'bold-structured': boldStructured,
  'warm-artisan': warmArtisan,
  'adventurous-open': adventurousOpen,
  'playful-dynamic': playfulDynamic,
  'rebel-edge': rebelEdge,
};

/**
 * Get a family preset by name.
 * @param {string} familyName
 * @returns {import('../types').LayoutTokenPreset | undefined}
 */
function getFamilyPreset(familyName) {
  return FAMILY_PRESETS[familyName];
}

module.exports = {
  FAMILY_PRESETS,
  getFamilyPreset,
};
