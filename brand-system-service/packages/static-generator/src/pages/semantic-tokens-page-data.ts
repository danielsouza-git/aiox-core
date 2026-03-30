/**
 * Semantic Tokens Page Data Extractor
 *
 * Extracts and structures semantic token data for the brand book
 * semantic tokens dedicated page. Reads from semantic/colors.json,
 * primitive/effects.json, and primitive/typography.json token files.
 *
 * @module pages/semantic-tokens-page-data
 */

/**
 * A semantic background token with CSS variable and resolved value.
 */
export interface SemanticBackgroundToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
}

/**
 * A semantic text token with CSS variable, resolved value, and preview text.
 */
export interface SemanticTextToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
  readonly preview: string;
}

/**
 * A glow/neon effect token with CSS box-shadow value.
 */
export interface GlowToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
}

/**
 * An interactive state showcase entry.
 */
export interface InteractiveState {
  readonly state: string;
  readonly cssProperties: string;
  readonly description: string;
}

/**
 * A font weight token.
 */
export interface FontWeightToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
}

/**
 * A shadcn/ui to BSS semantic token mapping entry.
 */
export interface ShadcnMapping {
  readonly shadcnVar: string;
  readonly bssToken: string;
  readonly resolvedValue: string;
}

/**
 * Complete page data for the semantic tokens page.
 */
export interface SemanticTokensPageData {
  readonly backgrounds: SemanticBackgroundToken[];
  readonly text: SemanticTextToken[];
  readonly glow: GlowToken[];
  readonly interactiveStates: InteractiveState[];
  readonly fontWeights: FontWeightToken[];
  readonly shadcnMappings: ShadcnMapping[];
}

/**
 * Safely read a nested token value from a token group.
 *
 * @param tokens - Root token object
 * @param path - Dot-separated path like "background.default"
 * @returns The $value string or empty string
 */
function getTokenValue(
  tokens: Record<string, unknown>,
  path: string
): string {
  const parts = path.split('.');
  let current: unknown = tokens;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return '';
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current !== 'object' || current === null) return '';
  const obj = current as Record<string, unknown>;
  return (obj.$value as string) || '';
}

/**
 * Extract semantic background tokens from semantic colors.
 *
 * Maps known background token paths to friendly names. If a token is
 * missing from the data, a sensible default is provided.
 */
function extractBackgroundTokens(
  semanticColors: Record<string, unknown>
): SemanticBackgroundToken[] {
  const definitions: Array<{ name: string; cssVar: string; path: string; fallback: string }> = [
    { name: 'bg-primary', cssVar: '--bg-primary', path: 'background.default', fallback: '#FFFFFF' },
    { name: 'bg-secondary', cssVar: '--bg-secondary', path: 'background.subtle', fallback: '#F9FAFB' },
    { name: 'bg-muted', cssVar: '--bg-muted', path: 'surface.default', fallback: '#F3F4F6' },
    { name: 'bg-accent', cssVar: '--bg-accent', path: 'interactive.default', fallback: '#7631e5' },
    { name: 'bg-destructive', cssVar: '--bg-destructive', path: 'error.500', fallback: '#c7000f' },
    { name: 'bg-success', cssVar: '--bg-success', path: 'success.500', fallback: '#008229' },
  ];

  return definitions.map((def) => {
    const resolved = getTokenValue(semanticColors, def.path);
    return {
      name: def.name,
      cssVar: def.cssVar,
      value: resolved || def.fallback,
    };
  });
}

/**
 * Extract semantic text tokens from semantic colors.
 */
function extractTextTokens(
  semanticColors: Record<string, unknown>
): SemanticTextToken[] {
  const definitions: Array<{
    name: string;
    cssVar: string;
    path: string;
    fallback: string;
    preview: string;
  }> = [
    {
      name: 'text-primary',
      cssVar: '--text-primary',
      path: 'text.default',
      fallback: '#111827',
      preview: 'The quick brown fox jumps over the lazy dog',
    },
    {
      name: 'text-secondary',
      cssVar: '--text-secondary',
      path: 'text.secondary',
      fallback: '#6B7280',
      preview: 'Secondary text for supporting content and labels',
    },
    {
      name: 'text-muted',
      cssVar: '--text-muted',
      path: 'text.muted',
      fallback: '#9CA3AF',
      preview: 'Muted text for placeholders and disabled states',
    },
    {
      name: 'text-accent',
      cssVar: '--text-accent',
      path: 'interactive.default',
      fallback: '#7631e5',
      preview: 'Accent text for links, highlights, and interactive labels',
    },
  ];

  return definitions.map((def) => {
    const resolved = getTokenValue(semanticColors, def.path);
    return {
      name: def.name,
      cssVar: def.cssVar,
      value: resolved || def.fallback,
      preview: def.preview,
    };
  });
}

/**
 * Extract glow/neon tokens.
 *
 * Glow tokens are derived from the semantic color palette, generating
 * CSS box-shadow values for neon-style effects. The primary color is
 * read from the interactive or brand accent tokens.
 */
function extractGlowTokens(
  semanticColors: Record<string, unknown>
): GlowToken[] {
  const accentColor = getTokenValue(semanticColors, 'interactive.default') || '#7631e5';
  const successColor = getTokenValue(semanticColors, 'success.500') || '#008229';
  const warningColor = getTokenValue(semanticColors, 'warning.500') || '#a84a00';
  const errorColor = getTokenValue(semanticColors, 'error.500') || '#c7000f';

  return [
    {
      name: 'glow-primary',
      cssVar: '--glow-primary',
      value: `0 0 8px 2px ${accentColor}80, 0 0 24px 4px ${accentColor}40`,
    },
    {
      name: 'glow-accent',
      cssVar: '--glow-accent',
      value: `0 0 8px 2px ${accentColor}80, 0 0 24px 4px ${accentColor}40`,
    },
    {
      name: 'glow-success',
      cssVar: '--glow-success',
      value: `0 0 8px 2px ${successColor}80, 0 0 24px 4px ${successColor}40`,
    },
    {
      name: 'glow-warning',
      cssVar: '--glow-warning',
      value: `0 0 8px 2px ${warningColor}80, 0 0 24px 4px ${warningColor}40`,
    },
    {
      name: 'glow-error',
      cssVar: '--glow-error',
      value: `0 0 8px 2px ${errorColor}80, 0 0 24px 4px ${errorColor}40`,
    },
  ];
}

/**
 * Build interactive states showcase data.
 *
 * Uses semantic interactive tokens when available, otherwise falls
 * back to sensible defaults derived from the primary brand color.
 */
function extractInteractiveStates(
  semanticColors: Record<string, unknown>
): InteractiveState[] {
  const hoverColor = getTokenValue(semanticColors, 'interactive.hover') || '{color.primary.600}';
  const activeColor = getTokenValue(semanticColors, 'interactive.active') || '{color.primary.700}';
  const disabledColor = getTokenValue(semanticColors, 'interactive.disabled') || '{color.neutral.300}';
  const focusColor = getTokenValue(semanticColors, 'border.focus') || '{color.primary.500}';

  return [
    {
      state: 'hover',
      cssProperties: `background-color: ${hoverColor}; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.12);`,
      description: 'Elevated appearance on mouse hover with subtle lift and shadow.',
    },
    {
      state: 'focus',
      cssProperties: `outline: 3px solid ${focusColor}; outline-offset: 2px;`,
      description: 'Visible focus ring for keyboard navigation (WCAG 2.1 AA compliant).',
    },
    {
      state: 'active',
      cssProperties: `background-color: ${activeColor}; transform: scale(0.98);`,
      description: 'Pressed/active state with slight scale reduction for tactile feedback.',
    },
    {
      state: 'disabled',
      cssProperties: `background-color: ${disabledColor}; opacity: 0.6; cursor: not-allowed; pointer-events: none;`,
      description: 'Reduced opacity and muted color to indicate non-interactive element.',
    },
  ];
}

/**
 * Extract font weight tokens from typography data.
 */
function extractFontWeights(
  typographyTokens: Record<string, unknown>
): FontWeightToken[] {
  const fontWeight = typographyTokens.fontWeight as Record<string, unknown> | undefined;

  const definitions: Array<{ name: string; cssVar: string; expectedValue: string }> = [
    { name: 'thin', cssVar: '--font-weight-thin', expectedValue: '100' },
    { name: 'regular', cssVar: '--font-weight-regular', expectedValue: '400' },
    { name: 'medium', cssVar: '--font-weight-medium', expectedValue: '500' },
    { name: 'bold', cssVar: '--font-weight-bold', expectedValue: '700' },
    { name: 'black', cssVar: '--font-weight-black', expectedValue: '900' },
  ];

  return definitions.map((def) => {
    let value = def.expectedValue;

    if (fontWeight) {
      const token = fontWeight[def.name] as Record<string, unknown> | undefined;
      if (token && token.$value !== undefined) {
        value = String(token.$value);
      }
    }

    return {
      name: def.name,
      cssVar: def.cssVar,
      value,
    };
  });
}

/**
 * Build the shadcn/ui to BSS semantic token mapping table.
 *
 * Uses the canonical mapping from the story specification, resolving
 * actual values where the token data is available.
 */
export function buildShadcnMappings(
  semanticColors: Record<string, unknown>,
  effectsTokens: Record<string, unknown>
): ShadcnMapping[] {
  const resolve = (path: string, fallback: string): string => {
    const val = getTokenValue(semanticColors, path);
    return val || fallback;
  };

  const resolveEffect = (path: string, fallback: string): string => {
    const val = getTokenValue(effectsTokens, path);
    return val || fallback;
  };

  return [
    { shadcnVar: '--background', bssToken: 'var(--bg-primary)', resolvedValue: resolve('background.default', '#FFFFFF') },
    { shadcnVar: '--foreground', bssToken: 'var(--text-primary)', resolvedValue: resolve('text.default', '#111827') },
    { shadcnVar: '--card', bssToken: 'var(--bg-card)', resolvedValue: resolve('surface.default', '#FFFFFF') },
    { shadcnVar: '--card-foreground', bssToken: 'var(--text-primary)', resolvedValue: resolve('text.default', '#111827') },
    { shadcnVar: '--popover', bssToken: 'var(--bg-elevated)', resolvedValue: resolve('surface.default', '#FFFFFF') },
    { shadcnVar: '--popover-foreground', bssToken: 'var(--text-primary)', resolvedValue: resolve('text.default', '#111827') },
    { shadcnVar: '--primary', bssToken: 'var(--color-accent)', resolvedValue: resolve('interactive.default', '#7631e5') },
    { shadcnVar: '--primary-foreground', bssToken: 'var(--text-on-accent)', resolvedValue: resolve('text.inverse', '#FFFFFF') },
    { shadcnVar: '--secondary', bssToken: 'var(--bg-secondary)', resolvedValue: resolve('background.subtle', '#F9FAFB') },
    { shadcnVar: '--secondary-foreground', bssToken: 'var(--text-secondary)', resolvedValue: resolve('text.secondary', '#6B7280') },
    { shadcnVar: '--muted', bssToken: 'var(--bg-muted)', resolvedValue: resolve('surface.default', '#F3F4F6') },
    { shadcnVar: '--muted-foreground', bssToken: 'var(--text-muted)', resolvedValue: resolve('text.muted', '#9CA3AF') },
    { shadcnVar: '--accent', bssToken: 'var(--bg-accent)', resolvedValue: resolve('interactive.default', '#7631e5') },
    { shadcnVar: '--accent-foreground', bssToken: 'var(--text-on-accent)', resolvedValue: resolve('text.inverse', '#FFFFFF') },
    { shadcnVar: '--destructive', bssToken: 'var(--color-error)', resolvedValue: resolve('error.500', '#c7000f') },
    { shadcnVar: '--destructive-foreground', bssToken: 'var(--text-on-error)', resolvedValue: resolve('text.inverse', '#FFFFFF') },
    { shadcnVar: '--border', bssToken: 'var(--border-default)', resolvedValue: resolve('border.default', '#E5E7EB') },
    { shadcnVar: '--input', bssToken: 'var(--bg-input)', resolvedValue: resolve('surface.default', '#FFFFFF') },
    { shadcnVar: '--ring', bssToken: 'var(--glow-primary)', resolvedValue: resolve('border.focus', '#7631e5') },
    { shadcnVar: '--radius', bssToken: 'var(--radius-md)', resolvedValue: resolveEffect('borderRadius.md', '8px') },
  ];
}

/**
 * Extract all semantic token page data from the provided token files.
 *
 * @param semanticColors - Parsed semantic/colors.json
 * @param effectsTokens - Parsed primitive/effects.json
 * @param typographyTokens - Parsed primitive/typography.json
 * @returns Complete page data for the semantic tokens template
 */
export function extractSemanticTokensPageData(
  semanticColors: Record<string, unknown>,
  effectsTokens: Record<string, unknown>,
  typographyTokens: Record<string, unknown>
): SemanticTokensPageData {
  return {
    backgrounds: extractBackgroundTokens(semanticColors),
    text: extractTextTokens(semanticColors),
    glow: extractGlowTokens(semanticColors),
    interactiveStates: extractInteractiveStates(semanticColors),
    fontWeights: extractFontWeights(typographyTokens),
    shadcnMappings: buildShadcnMappings(semanticColors, effectsTokens),
  };
}
