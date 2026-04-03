'use strict';

/** @type {import('../types').LayoutTokenPreset} */
const warmArtisan = {
  corner: {
    radiusBase: '12px',
    radiusSmall: '8px',
    radiusLarge: '20px',
  },
  whitespace: {
    density: 'balanced',
    multiplier: 1.0,
    sectionGap: '64px',
    contentPadding: '60px',
  },
  nav: {
    style: 'breadcrumb-horizontal',
    width: '100%',
    height: '56px',
  },
  divider: {
    style: 'textured-line',
    height: '2px',
  },
  animation: {
    entrance: 'slide-in',
    duration: '250ms',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  grid: {
    rhythm: 'masonry-inspired',
    maxWidth: '1100px',
    columns: 3,
  },
  section: {
    background: 'layered-shadow',
    heroHeight: '50vh',
  },
  component: {
    cardShape: 'rounded',
    shadowIntensity: 'medium',
  },
};

module.exports = warmArtisan;
