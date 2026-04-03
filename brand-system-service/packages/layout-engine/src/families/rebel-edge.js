'use strict';

/** @type {import('../types').LayoutTokenPreset} */
const rebelEdge = {
  corner: {
    radiusBase: '0px',
    radiusSmall: '0px',
    radiusLarge: '0px',
  },
  whitespace: {
    density: 'aggressive',
    multiplier: 0.7,
    sectionGap: '40px',
    contentPadding: '32px',
  },
  nav: {
    style: 'inline-minimal',
    width: '100%',
    height: '44px',
  },
  divider: {
    style: 'slash-raw',
    height: '3px',
  },
  animation: {
    entrance: 'cut-in',
    duration: '150ms',
    easing: 'linear',
  },
  grid: {
    rhythm: 'single-column-stacked',
    maxWidth: '900px',
    columns: 1,
  },
  section: {
    background: 'dark-mono',
    heroHeight: '100vh',
  },
  component: {
    cardShape: 'sharp',
    shadowIntensity: 'none',
  },
};

module.exports = rebelEdge;
