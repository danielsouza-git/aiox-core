'use strict';

/** @type {import('../types').LayoutTokenPreset} */
const playfulDynamic = {
  corner: {
    radiusBase: '16px',
    radiusSmall: '12px',
    radiusLarge: '28px',
  },
  whitespace: {
    density: 'varied',
    multiplier: 1.2,
    sectionGap: '72px',
    contentPadding: '56px',
  },
  nav: {
    style: 'floating-pill',
    width: 'auto',
    height: '52px',
  },
  divider: {
    style: 'zigzag-wave',
    height: '4px',
  },
  animation: {
    entrance: 'bounce-in',
    duration: '350ms',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  grid: {
    rhythm: 'broken-asymmetric',
    maxWidth: '1100px',
    columns: 3,
  },
  section: {
    background: 'alternating-accent',
    heroHeight: '70vh',
  },
  component: {
    cardShape: 'rounded',
    shadowIntensity: 'deep',
  },
};

module.exports = playfulDynamic;
