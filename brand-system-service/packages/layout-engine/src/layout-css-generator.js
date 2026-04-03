'use strict';

/**
 * Layout CSS Generator
 *
 * Converts layout recommendations (from brief or defaults) into CSS:
 * - CSS custom properties (:root block)
 * - Navigation CSS for 6 styles
 * - Divider CSS for 8 styles
 * - Animation keyframes for 6 entrance types
 * - Grid rhythm CSS for 6 patterns
 * - Section background CSS for 6 treatments
 * - Responsive overrides at 375px, 768px, 1440px
 *
 * Static-first: zero runtime JS for layout (CON-16 compliant).
 * All CSS uses var() with fallback values for backward compatibility.
 *
 * Zero external dependencies.
 *
 * @module layout-css-generator
 */

const { DEFAULT_LAYOUT } = require('./defaults');

/**
 * Generate CSS custom properties from layout tokens.
 *
 * @param {object} layout - Merged layout configuration
 * @returns {string} CSS :root block with custom properties
 */
function generateCustomProperties(layout) {
  const l = layout || DEFAULT_LAYOUT;
  const cornerRadius = l.corners && l.corners.radius_base ? l.corners.radius_base : '8px';
  const whitespaceMult = l.whitespace && l.whitespace.multiplier != null ? l.whitespace.multiplier : 0.8;
  const sectionGap = l.whitespace && l.whitespace.section_gap ? l.whitespace.section_gap : '48px';
  const contentPadding = l.whitespace && l.whitespace.content_padding ? l.whitespace.content_padding : '40px';
  const gridMaxWidth = l.grid && l.grid.max_width ? l.grid.max_width : '1400px';
  const animDuration = l.animation && l.animation.duration ? l.animation.duration : '0ms';
  const navStyle = l.navigation && l.navigation.style ? l.navigation.style : 'sidebar-fixed';
  const dividerStyle = l.dividers && l.dividers.style ? l.dividers.style : 'solid-thin';
  const gridRhythm = l.grid && l.grid.rhythm ? l.grid.rhythm : 'strict-grid';
  const sectionBg = l.sections && l.sections.background ? l.sections.background : 'flat-solid';
  const family = l.family || 'bold-structured';

  return `:root {
  --layout-corner-radius: ${cornerRadius};
  --layout-whitespace-mult: ${whitespaceMult};
  --layout-section-gap: ${sectionGap};
  --layout-content-padding: ${contentPadding};
  --layout-grid-max-width: ${gridMaxWidth};
  --layout-animation-duration: ${animDuration};
  --layout-nav-style: ${navStyle};
  --layout-divider-style: ${dividerStyle};
  --layout-grid-rhythm: ${gridRhythm};
  --layout-section-bg: ${sectionBg};
  --layout-family: ${family};
}`;
}

/**
 * Generate navigation CSS for a given style.
 *
 * @param {string} style - One of 6 navigation styles
 * @returns {string} CSS rules for the navigation style
 */
function generateNavCSS(style) {
  const navStyles = {
    'centered-top': `/* Navigation: centered-top */
.layout-nav--centered-top {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: var(--layout-nav-height, 64px);
  position: relative;
  top: 0;
  left: 0;
  background: var(--color-bg, #ffffff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  z-index: 100;
  padding: 0 var(--layout-content-padding, 40px);
}
.layout-nav--centered-top .nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.layout-nav--centered-top .nav-links a {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
  transition: color 0.15s;
}
.layout-nav--centered-top .nav-links a:hover,
.layout-nav--centered-top .nav-links a.active {
  color: var(--brand-primary, currentColor);
}`,

    'sidebar-fixed': `/* Navigation: sidebar-fixed */
.layout-nav--sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width, 280px);
  height: 100vh;
  background: var(--color-bg-subtle, #f8f9fa);
  border-right: 1px solid var(--color-border, #e5e7eb);
  overflow-y: auto;
  z-index: 100;
  padding: 24px 0;
}
.layout-nav--sidebar-fixed ~ .main-content {
  margin-left: var(--sidebar-width, 280px);
}`,

    'breadcrumb-horizontal': `/* Navigation: breadcrumb-horizontal */
.layout-nav--breadcrumb-horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--layout-nav-height, 48px);
  background: var(--color-bg, #ffffff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding: 0 var(--layout-content-padding, 40px);
  font-size: 13px;
}
.layout-nav--breadcrumb-horizontal .nav-links {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}
.layout-nav--breadcrumb-horizontal .nav-links li + li::before {
  content: '/';
  margin-right: 8px;
  color: var(--color-text-secondary, #6b7280);
}
.layout-nav--breadcrumb-horizontal .nav-links a {
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
}
.layout-nav--breadcrumb-horizontal .nav-links a:hover {
  color: var(--brand-primary, currentColor);
}`,

    'sticky-minimal': `/* Navigation: sticky-minimal */
.layout-nav--sticky-minimal {
  position: sticky;
  top: 0;
  width: 100%;
  height: var(--layout-nav-height, 44px);
  background: var(--color-bg, #ffffff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 var(--layout-content-padding, 40px);
  font-size: 13px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.9);
}
.layout-nav--sticky-minimal .nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.layout-nav--sticky-minimal .nav-links a {
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
  font-weight: 500;
}
.layout-nav--sticky-minimal .nav-links a:hover,
.layout-nav--sticky-minimal .nav-links a.active {
  color: var(--color-text, #1a1a2e);
}`,

    'floating-pill': `/* Navigation: floating-pill */
.layout-nav--floating-pill {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  background: var(--color-bg, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--layout-corner-radius, 9999px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 100;
}
.layout-nav--floating-pill .nav-links {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.layout-nav--floating-pill .nav-links a {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
  padding: 4px 12px;
  border-radius: 9999px;
  transition: background 0.15s, color 0.15s;
}
.layout-nav--floating-pill .nav-links a:hover,
.layout-nav--floating-pill .nav-links a.active {
  background: var(--brand-primary, #7631e5);
  color: #ffffff;
}`,

    'inline-minimal': `/* Navigation: inline-minimal */
.layout-nav--inline-minimal {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px var(--layout-content-padding, 40px);
}
.layout-nav--inline-minimal .nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.layout-nav--inline-minimal .nav-links a {
  font-size: 14px;
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
}
.layout-nav--inline-minimal .nav-links a:hover,
.layout-nav--inline-minimal .nav-links a.active {
  color: var(--color-text, #1a1a2e);
  text-decoration: underline;
}`,
  };

  return navStyles[style] || navStyles['sidebar-fixed'];
}

/**
 * Generate divider CSS for a given style.
 *
 * @param {string} style - One of 8 divider styles
 * @returns {string} CSS rules for the divider style
 */
function generateDividerCSS(style) {
  const dividerStyles = {
    'solid-thin': `/* Divider: solid-thin */
.layout-divider--solid-thin {
  border: none;
  border-top: 1px solid var(--color-border, #e5e7eb);
  margin: var(--layout-section-gap, 48px) 0;
}`,

    'solid-thick': `/* Divider: solid-thick */
.layout-divider--solid-thick {
  border: none;
  border-top: 3px solid var(--color-border, #e5e7eb);
  margin: var(--layout-section-gap, 48px) 0;
}`,

    'organic-wave': `/* Divider: organic-wave */
.layout-divider--organic-wave {
  border: none;
  height: 24px;
  margin: var(--layout-section-gap, 48px) 0;
  background: transparent;
  position: relative;
  overflow: hidden;
}
.layout-divider--organic-wave::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-border, #e5e7eb);
  clip-path: polygon(
    0% 50%, 5% 30%, 10% 50%, 15% 70%, 20% 50%,
    25% 30%, 30% 50%, 35% 70%, 40% 50%, 45% 30%,
    50% 50%, 55% 70%, 60% 50%, 65% 30%, 70% 50%,
    75% 70%, 80% 50%, 85% 30%, 90% 50%, 95% 70%, 100% 50%,
    100% 100%, 0% 100%
  );
}`,

    'textured-line': `/* Divider: textured-line */
.layout-divider--textured-line {
  border: none;
  height: 4px;
  margin: var(--layout-section-gap, 48px) 0;
  background: repeating-linear-gradient(
    90deg,
    var(--color-border, #e5e7eb) 0px,
    var(--color-border, #e5e7eb) 8px,
    transparent 8px,
    transparent 12px
  );
}`,

    'thin-geometric': `/* Divider: thin-geometric */
.layout-divider--thin-geometric {
  border: none;
  height: 1px;
  margin: var(--layout-section-gap, 48px) 0;
  background: var(--color-border, #e5e7eb);
  position: relative;
}
.layout-divider--thin-geometric::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: var(--color-bg, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}`,

    'zigzag-wave': `/* Divider: zigzag-wave */
.layout-divider--zigzag-wave {
  border: none;
  height: 12px;
  margin: var(--layout-section-gap, 48px) 0;
  background: linear-gradient(135deg, var(--color-border, #e5e7eb) 25%, transparent 25%) -8px 0,
    linear-gradient(225deg, var(--color-border, #e5e7eb) 25%, transparent 25%) -8px 0,
    linear-gradient(315deg, var(--color-border, #e5e7eb) 25%, transparent 25%),
    linear-gradient(45deg, var(--color-border, #e5e7eb) 25%, transparent 25%);
  background-size: 16px 12px;
  background-color: transparent;
}`,

    'slash-raw': `/* Divider: slash-raw */
.layout-divider--slash-raw {
  border: none;
  height: 2px;
  margin: var(--layout-section-gap, 48px) 0;
  background: repeating-linear-gradient(
    -45deg,
    var(--color-border, #e5e7eb),
    var(--color-border, #e5e7eb) 2px,
    transparent 2px,
    transparent 6px
  );
}`,

    'none': `/* Divider: none */
.layout-divider--none {
  border: none;
  height: 0;
  margin: var(--layout-section-gap, 48px) 0;
}`,
  };

  return dividerStyles[style] || dividerStyles['solid-thin'];
}

/**
 * Generate animation keyframes CSS for a given entrance type.
 *
 * @param {string} entrance - One of 6 animation entrance types
 * @returns {string} CSS keyframes and utility class
 */
function generateAnimationCSS(entrance) {
  const animations = {
    'none': `/* Animation: none */
.layout-animate--none {
  animation: none;
}`,

    'fade-up': `/* Animation: fade-up */
@keyframes layout-fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.layout-animate--fade-up {
  animation: layout-fade-up var(--layout-animation-duration, 300ms) ease-out both;
}`,

    'slide-in': `/* Animation: slide-in */
@keyframes layout-slide-in {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.layout-animate--slide-in {
  animation: layout-slide-in var(--layout-animation-duration, 300ms) ease-out both;
}`,

    'scroll-reveal': `/* Animation: scroll-reveal */
@keyframes layout-scroll-reveal {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.layout-animate--scroll-reveal {
  animation: layout-scroll-reveal var(--layout-animation-duration, 400ms) ease-out both;
}`,

    'bounce-in': `/* Animation: bounce-in */
@keyframes layout-bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  60% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
.layout-animate--bounce-in {
  animation: layout-bounce-in var(--layout-animation-duration, 400ms) ease-out both;
}`,

    'cut-in': `/* Animation: cut-in */
@keyframes layout-cut-in {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
.layout-animate--cut-in {
  animation: layout-cut-in var(--layout-animation-duration, 300ms) ease-out both;
}`,
  };

  return animations[entrance] || animations['none'];
}

/**
 * Generate grid rhythm CSS for a given pattern.
 *
 * @param {string} rhythm - One of 6 grid rhythm patterns
 * @returns {string} CSS rules for the grid pattern
 */
function generateGridCSS(rhythm) {
  const grids = {
    'centered-single': `/* Grid: centered-single */
.layout-grid--centered-single {
  max-width: var(--layout-grid-max-width, 800px);
  margin: 0 auto;
  padding: 0 var(--layout-content-padding, 40px);
}
.layout-grid--centered-single > * {
  max-width: 100%;
}`,

    'strict-grid': `/* Grid: strict-grid */
.layout-grid--strict-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: var(--layout-grid-max-width, 1400px);
  margin: 0 auto;
  padding: 0 var(--layout-content-padding, 40px);
}`,

    'masonry-inspired': `/* Grid: masonry-inspired */
.layout-grid--masonry-inspired {
  column-count: 3;
  column-gap: 24px;
  max-width: var(--layout-grid-max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--layout-content-padding, 40px);
}
.layout-grid--masonry-inspired > * {
  break-inside: avoid;
  margin-bottom: 24px;
}`,

    'editorial-wide': `/* Grid: editorial-wide */
.layout-grid--editorial-wide {
  max-width: var(--layout-grid-max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--layout-content-padding, 40px);
}
.layout-grid--editorial-wide > * {
  max-width: 100%;
}
.layout-grid--editorial-wide .wide-block {
  margin-left: calc(var(--layout-content-padding, 40px) * -1);
  margin-right: calc(var(--layout-content-padding, 40px) * -1);
  max-width: none;
}`,

    'broken-asymmetric': `/* Grid: broken-asymmetric */
.layout-grid--broken-asymmetric {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-auto-flow: dense;
  gap: 24px;
  max-width: var(--layout-grid-max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--layout-content-padding, 40px);
}
.layout-grid--broken-asymmetric > *:nth-child(3n) {
  grid-column: span 2;
}`,

    'single-column-stacked': `/* Grid: single-column-stacked */
.layout-grid--single-column-stacked {
  display: flex;
  flex-direction: column;
  gap: var(--layout-section-gap, 48px);
  max-width: var(--layout-grid-max-width, 960px);
  margin: 0 auto;
  padding: 0 var(--layout-content-padding, 40px);
}`,
  };

  return grids[rhythm] || grids['strict-grid'];
}

/**
 * Generate section background CSS for a given treatment.
 *
 * @param {string} background - One of 6 section background treatments
 * @returns {string} CSS rules for the section background
 */
function generateSectionBgCSS(background) {
  const backgrounds = {
    'flat-solid': `/* Section BG: flat-solid */
.layout-section-bg--flat-solid {
  background: var(--color-bg, #ffffff);
}`,

    'soft-fill': `/* Section BG: soft-fill */
.layout-section-bg--soft-fill {
  background: var(--color-bg-subtle, #f8f9fa);
}
.layout-section-bg--soft-fill:nth-child(odd) {
  background: var(--color-bg, #ffffff);
}`,

    'layered-shadow': `/* Section BG: layered-shadow */
.layout-section-bg--layered-shadow {
  background: var(--color-bg, #ffffff);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.02);
  border-radius: var(--layout-corner-radius, 8px);
  margin: 16px;
  padding: var(--layout-content-padding, 40px);
}`,

    'full-bleed-image': `/* Section BG: full-bleed-image */
.layout-section-bg--full-bleed-image {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}
.layout-section-bg--full-bleed-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  z-index: 0;
}
.layout-section-bg--full-bleed-image > * {
  position: relative;
  z-index: 1;
}`,

    'alternating-accent': `/* Section BG: alternating-accent */
.layout-section-bg--alternating-accent {
  background: var(--color-bg, #ffffff);
}
.layout-section-bg--alternating-accent:nth-child(even) {
  background: color-mix(in srgb, var(--brand-primary, #7631e5) 5%, var(--color-bg, #ffffff));
}`,

    'dark-mono': `/* Section BG: dark-mono */
.layout-section-bg--dark-mono {
  background: #1a1a2e;
  color: #e0e0f0;
}
.layout-section-bg--dark-mono a {
  color: #a0a0f0;
}
.layout-section-bg--dark-mono h1,
.layout-section-bg--dark-mono h2,
.layout-section-bg--dark-mono h3 {
  color: #ffffff;
}`,
  };

  return backgrounds[background] || backgrounds['flat-solid'];
}

/**
 * Generate responsive CSS for layout variants at 375px, 768px, and 1440px.
 *
 * @param {object} layout - Merged layout configuration
 * @returns {string} CSS @media rules
 */
function generateResponsiveCSS(layout) {
  const navStyle = (layout && layout.navigation && layout.navigation.style) || 'sidebar-fixed';

  return `/* Responsive: 1440px (full layout) */
@media (min-width: 1440px) {
  :root {
    --layout-content-padding: ${layout && layout.whitespace && layout.whitespace.content_padding ? layout.whitespace.content_padding : '80px'};
  }
}

/* Responsive: 768px (intermediate) */
@media (max-width: 768px) {
  :root {
    --layout-content-padding: 24px;
    --layout-section-gap: 32px;
  }

  .layout-nav--sidebar-fixed {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .layout-nav--sidebar-fixed ~ .main-content {
    margin-left: 0;
  }

  .layout-nav--floating-pill {
    top: auto;
    bottom: 16px;
    padding: 6px 16px;
  }

  .layout-nav--floating-pill .nav-links {
    gap: 8px;
  }

  .layout-grid--strict-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .layout-grid--masonry-inspired {
    column-count: 2;
  }

  .layout-grid--broken-asymmetric {
    grid-template-columns: 1fr;
  }

  .layout-grid--broken-asymmetric > *:nth-child(3n) {
    grid-column: span 1;
  }
}

/* Responsive: 375px (mobile) */
@media (max-width: 375px) {
  :root {
    --layout-content-padding: 16px;
    --layout-section-gap: 24px;
    --layout-grid-max-width: 100%;
  }

  .layout-nav--centered-top .nav-links,
  .layout-nav--breadcrumb-horizontal .nav-links,
  .layout-nav--sticky-minimal .nav-links,
  .layout-nav--floating-pill .nav-links,
  .layout-nav--inline-minimal .nav-links {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .layout-nav--floating-pill {
    left: 16px;
    right: 16px;
    transform: none;
    border-radius: var(--layout-corner-radius, 16px);
  }

  .layout-grid--strict-grid {
    grid-template-columns: 1fr;
  }

  .layout-grid--masonry-inspired {
    column-count: 1;
  }

  .layout-grid--editorial-wide .wide-block {
    margin-left: -16px;
    margin-right: -16px;
  }
}`;
}

/**
 * Generate complete layout CSS from layout configuration.
 *
 * Produces a single CSS string containing:
 * 1. CSS custom properties (:root)
 * 2. Active navigation style
 * 3. Active divider style
 * 4. Active animation keyframes
 * 5. Active grid rhythm
 * 6. Active section background
 * 7. Responsive overrides
 *
 * @param {object} layoutTokens - Merged layout configuration
 * @returns {string} Complete CSS string
 */
function generateLayoutCSS(layoutTokens) {
  const l = layoutTokens || DEFAULT_LAYOUT;

  const navStyle = (l.navigation && l.navigation.style) || 'sidebar-fixed';
  const dividerStyle = (l.dividers && l.dividers.style) || 'solid-thin';
  const entrance = (l.animation && l.animation.entrance) || 'none';
  const gridRhythm = (l.grid && l.grid.rhythm) || 'strict-grid';
  const sectionBg = (l.sections && l.sections.background) || 'flat-solid';

  const parts = [
    '/* Layout CSS — Generated by @bss/layout-engine */',
    '',
    generateCustomProperties(l),
    '',
    generateNavCSS(navStyle),
    '',
    generateDividerCSS(dividerStyle),
    '',
    generateAnimationCSS(entrance),
    '',
    generateGridCSS(gridRhythm),
    '',
    generateSectionBgCSS(sectionBg),
    '',
    generateResponsiveCSS(l),
  ];

  return parts.join('\n');
}

module.exports = {
  generateLayoutCSS,
  generateNavCSS,
  generateDividerCSS,
  generateAnimationCSS,
  generateGridCSS,
  generateSectionBgCSS,
  generateResponsiveCSS,
  generateCustomProperties,
};
