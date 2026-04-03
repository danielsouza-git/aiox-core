'use strict';

/** @type {import('../types').LayoutTokenPreset} */
const ethereal = {
  corner: {
    radiusBase: '24px',
    radiusSmall: '16px',
    radiusLarge: '32px',
  },
  whitespace: {
    density: 'spacious',
    multiplier: 1.5,
    sectionGap: '96px',
    contentPadding: '80px',
  },
  nav: {
    style: 'centered-top',
    width: '100%',
    height: '64px',
  },
  divider: {
    style: 'organic-wave',
    height: '2px',
  },
  animation: {
    entrance: 'fade-up',
    duration: '300ms',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  },
  grid: {
    rhythm: 'centered-single',
    maxWidth: '800px',
    columns: 1,
  },
  section: {
    background: 'soft-fill',
    heroHeight: '60vh',
  },
  component: {
    cardShape: 'pill',
    shadowIntensity: 'light',
  },
};

module.exports = ethereal;
