'use strict';

/** @type {import('../types').LayoutTokenPreset} */
const adventurousOpen = {
  corner: {
    radiusBase: '6px',
    radiusSmall: '4px',
    radiusLarge: '12px',
  },
  whitespace: {
    density: 'generous',
    multiplier: 1.3,
    sectionGap: '80px',
    contentPadding: '64px',
  },
  nav: {
    style: 'sticky-minimal',
    width: '100%',
    height: '48px',
  },
  divider: {
    style: 'thin-geometric',
    height: '1px',
  },
  animation: {
    entrance: 'scroll-reveal',
    duration: '400ms',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  grid: {
    rhythm: 'editorial-wide',
    maxWidth: '1200px',
    columns: 2,
  },
  section: {
    background: 'full-bleed-image',
    heroHeight: '80vh',
  },
  component: {
    cardShape: 'subtle',
    shadowIntensity: 'light',
  },
};

module.exports = adventurousOpen;
