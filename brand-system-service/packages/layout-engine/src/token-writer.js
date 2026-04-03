'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Writes layout tokens to client's token directory.
 *
 * @param {string} clientTokenDir - e.g., 'brands/stray-innocence/tokens'
 * @param {object|null} tokens - Layout tokens from resolveLayout() or brief
 * @returns {boolean} true if tokens were written, false if tokens is null/undefined
 */
function writeLayoutTokens(clientTokenDir, tokens) {
  if (!tokens) {
    return false;
  }
  const layoutDir = path.join(clientTokenDir, 'layout');
  if (!fs.existsSync(layoutDir)) {
    fs.mkdirSync(layoutDir, { recursive: true });
  }
  const outputPath = path.join(layoutDir, 'layout.json');
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), 'utf-8');
  return true;
}

module.exports = { writeLayoutTokens };
