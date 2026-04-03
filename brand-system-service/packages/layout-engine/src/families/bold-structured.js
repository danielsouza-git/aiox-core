'use strict';

/** @type {import('../types').LayoutTokenPreset} */
const boldStructured = {
  corner: {
    radiusBase: '2px',
    radiusSmall: '0px',
    radiusLarge: '4px',
  },
  whitespace: {
    density: 'compact',
    multiplier: 0.8,
    sectionGap: '48px',
    contentPadding: '40px',
  },
  nav: {
    style: 'sidebar-fixed',
    width: '280px',
    height: '100vh',
  },
  divider: {
    style: 'solid-thick',
    height: '3px',
  },
  animation: {
    entrance: 'none',
    duration: '0ms',
    easing: 'linear',
  },
  grid: {
    rhythm: 'strict-grid',
    maxWidth: '1400px',
    columns: 12,
  },
  section: {
    background: 'flat-solid',
    heroHeight: '40vh',
  },
  component: {
    cardShape: 'sharp',
    shadowIntensity: 'none',
  },
};

module.exports = boldStructured;
