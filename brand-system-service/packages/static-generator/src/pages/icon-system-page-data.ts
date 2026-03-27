/**
 * Icon System page data extractor.
 *
 * Generates icon system data for the brand book icon page including
 * grid sizes, default icon library, stroke rules, color variants,
 * and accessibility guidelines.
 *
 * @module pages/icon-system-page-data
 */

import type { BrandConfig } from '../static-generator';

/**
 * Icon grid size entry for size showcase.
 */
export interface IconGridSize {
  readonly size: number;
  readonly label: string;
}

/**
 * A single icon with name and inline SVG.
 */
export interface IconEntry {
  readonly name: string;
  readonly svg: string;
}

/**
 * Stroke style rules for icon consistency.
 */
export interface StrokeRules {
  readonly width: string;
  readonly cap: string;
  readonly join: string;
}

/**
 * Color variant for icon display.
 */
export interface IconColorVariant {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
}

/**
 * Accessibility guidelines for icon usage.
 */
export interface IconAccessibilityGuidelines {
  readonly minTouchTarget: string;
  readonly ariaLabel: boolean;
}

/**
 * Complete data for the Icon System brand book page.
 */
export interface IconSystemPageData {
  readonly gridSizes: IconGridSize[];
  readonly icons: IconEntry[];
  readonly strokeRules: StrokeRules;
  readonly colorVariants: IconColorVariant[];
  readonly accessibilityGuidelines: IconAccessibilityGuidelines;
}

/**
 * Default grid sizes for the icon size showcase.
 */
const DEFAULT_GRID_SIZES: IconGridSize[] = [
  { size: 16, label: 'Small (16px)' },
  { size: 24, label: 'Medium (24px)' },
  { size: 32, label: 'Large (32px)' },
  { size: 48, label: 'Extra Large (48px)' },
];

/**
 * Helper to build an SVG icon string with configurable viewBox size.
 * All icons use 24x24 viewBox, currentColor, stroke-width 2, round caps/joins.
 */
function icon(paths: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

/**
 * Default icon library with 20 common brand icons.
 * All use currentColor for automatic color adaptation.
 */
const DEFAULT_ICONS: IconEntry[] = [
  {
    name: 'arrow-right',
    svg: icon('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
  },
  {
    name: 'arrow-left',
    svg: icon('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),
  },
  {
    name: 'check',
    svg: icon('<polyline points="20 6 9 17 4 12"/>'),
  },
  {
    name: 'close',
    svg: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  },
  {
    name: 'search',
    svg: icon('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
  },
  {
    name: 'settings',
    svg: icon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
  },
  {
    name: 'home',
    svg: icon('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
  },
  {
    name: 'star',
    svg: icon('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  },
  {
    name: 'heart',
    svg: icon('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'),
  },
  {
    name: 'mail',
    svg: icon('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>'),
  },
  {
    name: 'bell',
    svg: icon('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
  },
  {
    name: 'user',
    svg: icon('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  },
  {
    name: 'plus',
    svg: icon('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
  },
  {
    name: 'minus',
    svg: icon('<line x1="5" y1="12" x2="19" y2="12"/>'),
  },
  {
    name: 'eye',
    svg: icon('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
  },
  {
    name: 'download',
    svg: icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
  },
  {
    name: 'upload',
    svg: icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),
  },
  {
    name: 'edit',
    svg: icon('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'),
  },
  {
    name: 'trash',
    svg: icon('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
  },
  {
    name: 'menu',
    svg: icon('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>'),
  },
];

/**
 * Default stroke rules for icon consistency.
 */
const DEFAULT_STROKE_RULES: StrokeRules = {
  width: '2px',
  cap: 'round',
  join: 'round',
};

/**
 * Default accessibility guidelines for icon usage.
 */
const DEFAULT_ACCESSIBILITY_GUIDELINES: IconAccessibilityGuidelines = {
  minTouchTarget: '44px',
  ariaLabel: true,
};

/**
 * Build default color variants from brand config or fallback values.
 */
function buildColorVariants(brandConfig?: BrandConfig): IconColorVariant[] {
  const primary = brandConfig?.primaryColor ?? '#7631e5';

  return [
    { name: 'Primary', cssVar: '--brand-primary', value: primary },
    { name: 'Secondary', cssVar: '--color-text-secondary', value: '#6b7280' },
    { name: 'Accent', cssVar: '--color-accent', value: '#6366f1' },
    { name: 'Muted', cssVar: '--color-text-muted', value: '#9ca3af' },
    { name: 'Success', cssVar: '--color-success', value: '#22c55e' },
    { name: 'Error', cssVar: '--color-error', value: '#ef4444' },
  ];
}

/**
 * Extract icon system page data for brand book rendering.
 *
 * Generates a complete icon system dataset with default icons,
 * grid sizes, stroke rules, color variants, and accessibility
 * guidelines. Accepts optional brand config for color resolution.
 *
 * @param brandConfig - Optional brand configuration for color variant resolution
 * @returns Complete page data for the icons template
 */
export function extractIconSystemPageData(
  brandConfig?: BrandConfig,
): IconSystemPageData {
  return {
    gridSizes: DEFAULT_GRID_SIZES,
    icons: DEFAULT_ICONS,
    strokeRules: DEFAULT_STROKE_RULES,
    colorVariants: buildColorVariants(brandConfig),
    accessibilityGuidelines: DEFAULT_ACCESSIBILITY_GUIDELINES,
  };
}
