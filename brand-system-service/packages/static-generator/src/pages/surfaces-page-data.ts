/**
 * Surfaces & Borders page data extractor.
 *
 * Extracts surface, border, radius, and glass effect tokens from
 * semantic and primitive token files. Provides sensible defaults
 * when token data is incomplete.
 *
 * @module pages/surfaces-page-data
 */

/**
 * A surface background token with CSS variable and resolved value.
 */
export interface SurfaceToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
  readonly description: string;
}

/**
 * A border token with CSS variable and resolved value.
 */
export interface BorderToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
  readonly description: string;
}

/**
 * A radius token with CSS variable, value, and pixel equivalent.
 */
export interface RadiusToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
  readonly pixels: string;
}

/**
 * A glass/frosted effect with backdrop-blur CSS and code snippet.
 */
export interface GlassEffect {
  readonly name: string;
  readonly backdropBlur: string;
  readonly bgOpacity: string;
  readonly css: string;
}

/**
 * Complete data for the Surfaces & Borders brand book page.
 */
export interface SurfacesPageData {
  readonly surfaces: SurfaceToken[];
  readonly borders: BorderToken[];
  readonly radii: RadiusToken[];
  readonly glass: GlassEffect[];
}

/**
 * Default surface tokens when semantic tokens lack background-* entries.
 */
const DEFAULT_SURFACES: SurfaceToken[] = [
  { name: 'Background Base', cssVar: '--color-bg-base', value: '#ffffff', description: 'Default page background' },
  { name: 'Background Elevated', cssVar: '--color-bg-elevated', value: '#ffffff', description: 'Cards, modals, elevated surfaces' },
  { name: 'Background Sunken', cssVar: '--color-bg-sunken', value: '#f3f4f6', description: 'Recessed areas, code blocks' },
  { name: 'Background Overlay', cssVar: '--color-bg-overlay', value: 'rgba(0, 0, 0, 0.5)', description: 'Modal backdrops, overlays' },
  { name: 'Background Card', cssVar: '--color-bg-card', value: '#ffffff', description: 'Card component backgrounds' },
  { name: 'Background Input', cssVar: '--color-bg-input', value: '#ffffff', description: 'Form input backgrounds' },
  { name: 'Background Hover', cssVar: '--color-bg-hover', value: '#f9fafb', description: 'Interactive element hover state' },
  { name: 'Background Active', cssVar: '--color-bg-active', value: '#f3f4f6', description: 'Interactive element active/pressed state' },
];

/**
 * Default border tokens when semantic tokens lack border-* entries.
 */
const DEFAULT_BORDERS: BorderToken[] = [
  { name: 'Border Default', cssVar: '--color-border-default', value: '#e5e7eb', description: 'Standard dividers and card borders' },
  { name: 'Border Subtle', cssVar: '--color-border-subtle', value: '#f3f4f6', description: 'Subtle separators, low contrast' },
  { name: 'Border Strong', cssVar: '--color-border-strong', value: '#9ca3af', description: 'High contrast borders, active fields' },
  { name: 'Border Focus', cssVar: '--color-border-focus', value: '#3b82f6', description: 'Focus ring for keyboard navigation (WCAG)' },
  { name: 'Border Error', cssVar: '--color-border-error', value: '#ef4444', description: 'Error state borders on form inputs' },
];

/**
 * Default radius tokens.
 */
const DEFAULT_RADII: RadiusToken[] = [
  { name: 'Radius SM', cssVar: '--radius-sm', value: '0.25rem', pixels: '4px' },
  { name: 'Radius MD', cssVar: '--radius-md', value: '0.375rem', pixels: '6px' },
  { name: 'Radius LG', cssVar: '--radius-lg', value: '0.5rem', pixels: '8px' },
  { name: 'Radius XL', cssVar: '--radius-xl', value: '0.75rem', pixels: '12px' },
  { name: 'Radius 2XL', cssVar: '--radius-2xl', value: '1rem', pixels: '16px' },
  { name: 'Radius Full', cssVar: '--radius-full', value: '9999px', pixels: '9999px' },
];

/**
 * Default glass/frosted effects.
 */
const DEFAULT_GLASS: GlassEffect[] = [
  {
    name: 'Glass Light',
    backdropBlur: '12px',
    bgOpacity: 'rgba(255, 255, 255, 0.7)',
    css: 'background: rgba(255, 255, 255, 0.7);\nbackdrop-filter: blur(12px);\n-webkit-backdrop-filter: blur(12px);\nborder: 1px solid rgba(255, 255, 255, 0.3);',
  },
  {
    name: 'Glass Dark',
    backdropBlur: '16px',
    bgOpacity: 'rgba(0, 0, 0, 0.4)',
    css: 'background: rgba(0, 0, 0, 0.4);\nbackdrop-filter: blur(16px);\n-webkit-backdrop-filter: blur(16px);\nborder: 1px solid rgba(255, 255, 255, 0.1);',
  },
];

/**
 * Attempt to extract surface tokens from semantic color data.
 *
 * Looks for keys containing "background", "bg", or "surface" in the
 * semantic token tree.
 */
function extractSurfaceTokens(semanticTokens: Record<string, unknown>): SurfaceToken[] {
  const surfaces: SurfaceToken[] = [];
  const targetKeys = ['background', 'bg', 'surface'];

  for (const [key, val] of Object.entries(semanticTokens)) {
    const keyLower = key.toLowerCase();
    const matchesSurface = targetKeys.some((t) => keyLower.includes(t));

    if (matchesSurface && typeof val === 'object' && val !== null) {
      const token = val as Record<string, unknown>;

      if (token.$value && token.$type) {
        surfaces.push({
          name: formatTokenName(key),
          cssVar: `--color-${key}`,
          value: token.$value as string,
          description: (token.$description as string) || '',
        });
      } else {
        // Nested group: bg.base, bg.elevated, etc.
        for (const [subKey, subVal] of Object.entries(token)) {
          if (subKey.startsWith('$')) continue;
          if (typeof subVal !== 'object' || subVal === null) continue;

          const subToken = subVal as Record<string, unknown>;
          if (subToken.$value) {
            surfaces.push({
              name: formatTokenName(`${key}-${subKey}`),
              cssVar: `--color-${key}-${subKey}`,
              value: subToken.$value as string,
              description: (subToken.$description as string) || '',
            });
          }
        }
      }
    }
  }

  return surfaces;
}

/**
 * Attempt to extract border tokens from semantic color data.
 *
 * Looks for keys containing "border" in the semantic token tree.
 */
function extractBorderTokens(semanticTokens: Record<string, unknown>): BorderToken[] {
  const borders: BorderToken[] = [];

  for (const [key, val] of Object.entries(semanticTokens)) {
    if (!key.toLowerCase().includes('border')) continue;
    if (typeof val !== 'object' || val === null) continue;

    const token = val as Record<string, unknown>;

    if (token.$value && token.$type) {
      borders.push({
        name: formatTokenName(key),
        cssVar: `--color-${key}`,
        value: token.$value as string,
        description: (token.$description as string) || '',
      });
    } else {
      for (const [subKey, subVal] of Object.entries(token)) {
        if (subKey.startsWith('$')) continue;
        if (typeof subVal !== 'object' || subVal === null) continue;

        const subToken = subVal as Record<string, unknown>;
        if (subToken.$value) {
          borders.push({
            name: formatTokenName(`${key}-${subKey}`),
            cssVar: `--color-${key}-${subKey}`,
            value: subToken.$value as string,
            description: (subToken.$description as string) || '',
          });
        }
      }
    }
  }

  return borders;
}

/**
 * Attempt to extract radius tokens from effects or primitive tokens.
 *
 * Looks for keys containing "radius" or "borderRadius".
 */
function extractRadiusTokens(effectsTokens: Record<string, unknown>): RadiusToken[] {
  const radii: RadiusToken[] = [];

  const searchIn = (obj: Record<string, unknown>, prefix: string): void => {
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      const keyLower = key.toLowerCase();

      if ((keyLower.includes('radius') || keyLower.includes('borderradius')) && typeof val === 'object' && val !== null) {
        const token = val as Record<string, unknown>;

        if (token.$value) {
          const value = String(token.$value);
          radii.push({
            name: formatTokenName(prefix ? `${prefix}-${key}` : key),
            cssVar: `--radius-${key}`,
            value,
            pixels: toPixels(value),
          });
        } else {
          // Nested: radius.sm, radius.md, etc.
          for (const [subKey, subVal] of Object.entries(token)) {
            if (subKey.startsWith('$')) continue;
            if (typeof subVal !== 'object' || subVal === null) continue;

            const subToken = subVal as Record<string, unknown>;
            if (subToken.$value) {
              const value = String(subToken.$value);
              radii.push({
                name: formatTokenName(`radius-${subKey}`),
                cssVar: `--radius-${subKey}`,
                value,
                pixels: toPixels(value),
              });
            }
          }
        }
      }
    }
  };

  searchIn(effectsTokens, '');
  return radii;
}

/**
 * Attempt to extract glass effect data from effects tokens.
 */
function extractGlassEffects(effectsTokens: Record<string, unknown>): GlassEffect[] {
  const effects: GlassEffect[] = [];

  for (const [key, val] of Object.entries(effectsTokens)) {
    const keyLower = key.toLowerCase();
    if (!(keyLower.includes('glass') || keyLower.includes('blur') || keyLower.includes('frosted'))) continue;
    if (typeof val !== 'object' || val === null) continue;

    const token = val as Record<string, unknown>;

    if (token.$value) {
      effects.push({
        name: formatTokenName(key),
        backdropBlur: String(token.$value),
        bgOpacity: 'rgba(255, 255, 255, 0.7)',
        css: `backdrop-filter: blur(${token.$value});\n-webkit-backdrop-filter: blur(${token.$value});`,
      });
    }
  }

  return effects;
}

/**
 * Convert a CSS value to its pixel equivalent string.
 * Handles rem, em, px, and raw numbers.
 */
function toPixels(value: string): string {
  if (value.endsWith('px')) return value;
  if (value.endsWith('rem')) {
    const num = parseFloat(value);
    return isNaN(num) ? value : `${num * 16}px`;
  }
  if (value.endsWith('em')) {
    const num = parseFloat(value);
    return isNaN(num) ? value : `${num * 16}px`;
  }
  const num = parseFloat(value);
  if (!isNaN(num)) return `${num}px`;
  return value;
}

/**
 * Convert a kebab-case or camelCase key to a readable display name.
 *
 * @example formatTokenName('background-base') // 'Background Base'
 * @example formatTokenName('borderRadius') // 'Border Radius'
 */
function formatTokenName(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extract all data for the Surfaces & Borders page.
 *
 * Attempts to extract tokens from semantic and effects data.
 * Falls back to sensible defaults when token data is incomplete.
 *
 * @param semanticTokens - Parsed semantic/colors.json
 * @param effectsTokens - Parsed primitive/effects.json
 * @returns Complete page data for template rendering
 */
export function extractSurfacesPageData(
  semanticTokens: Record<string, unknown>,
  effectsTokens: Record<string, unknown>,
): SurfacesPageData {
  const surfaces = extractSurfaceTokens(semanticTokens);
  const borders = extractBorderTokens(semanticTokens);
  const radii = extractRadiusTokens(effectsTokens);
  const glass = extractGlassEffects(effectsTokens);

  return {
    surfaces: surfaces.length > 0 ? surfaces : DEFAULT_SURFACES,
    borders: borders.length > 0 ? borders : DEFAULT_BORDERS,
    radii: radii.length > 0 ? radii : DEFAULT_RADII,
    glass: glass.length > 0 ? glass : DEFAULT_GLASS,
  };
}
