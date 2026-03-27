/**
 * Logo Usage Rules page data extractor.
 *
 * Generates structured data for the Logo Usage Rules brand book page,
 * including clear space requirements, do's and don'ts galleries,
 * color context variants, file format guides, and minimum size specs.
 *
 * @module pages/logo-usage-page-data
 */

/**
 * Clear space specification using an X-unit system.
 */
export interface ClearSpaceSpec {
  readonly unitName: string;
  readonly description: string;
  readonly minMultiplier: number;
}

/**
 * An approved logo usage example ("do").
 */
export interface LogoUsageDo {
  readonly label: string;
  readonly description: string;
  readonly bgColor: string;
  readonly textColor: string;
}

/**
 * An incorrect logo usage example ("don't").
 */
export interface LogoUsageDont {
  readonly label: string;
  readonly description: string;
  readonly cssTransform: string;
}

/**
 * A color context showing logo on a specific background.
 */
export interface LogoColorContext {
  readonly name: string;
  readonly bgColor: string;
  readonly logoColor: string;
  readonly description: string;
}

/**
 * A file format specification for logo delivery.
 */
export interface LogoFileFormat {
  readonly format: string;
  readonly extension: string;
  readonly dimensions: string;
  readonly useCase: string;
}

/**
 * Minimum size specifications for digital and print.
 */
export interface LogoMinimumSize {
  readonly digital: string;
  readonly print: string;
}

/**
 * Complete data for the Logo Usage Rules brand book page.
 */
export interface LogoUsagePageData {
  readonly clearSpace: ClearSpaceSpec;
  readonly dos: LogoUsageDo[];
  readonly donts: LogoUsageDont[];
  readonly colorContexts: LogoColorContext[];
  readonly fileFormats: LogoFileFormat[];
  readonly minimumSize: LogoMinimumSize;
}

/**
 * Brand configuration subset needed for logo usage data extraction.
 */
export interface LogoUsageBrandConfig {
  readonly clientName: string;
  readonly primaryColor: string;
  readonly logoPath: string;
}

/**
 * Default clear space specification.
 */
const DEFAULT_CLEAR_SPACE: ClearSpaceSpec = {
  unitName: 'X',
  description: 'The X-unit is derived from the height of the logo mark. Maintain a minimum clear space of 1.5X around all edges of the logo to ensure visual breathing room and legibility.',
  minMultiplier: 1.5,
};

/**
 * Default approved usage contexts.
 */
const DEFAULT_DOS: LogoUsageDo[] = [
  {
    label: 'On Dark Backgrounds',
    description: 'Use the white (reversed) logo version on dark or saturated backgrounds for maximum contrast.',
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
  },
  {
    label: 'On Light Backgrounds',
    description: 'Use the dark logo version on light or white backgrounds. Ensure sufficient contrast ratio (4.5:1 minimum).',
    bgColor: '#ffffff',
    textColor: '#1a1a2e',
  },
  {
    label: 'Monochrome Usage',
    description: 'A single-color logo is acceptable for print, embossing, or low-fidelity contexts.',
    bgColor: '#f3f4f6',
    textColor: '#374151',
  },
  {
    label: 'Minimum Size Respected',
    description: 'Always render the logo at or above the specified minimum size to preserve legibility and brand recognition.',
    bgColor: '#f9fafb',
    textColor: '#111827',
  },
  {
    label: 'With Clear Space',
    description: 'Always maintain the required clear space zone around the logo. No other elements should intrude into this area.',
    bgColor: '#f0fdf4',
    textColor: '#166534',
  },
];

/**
 * Default incorrect usage examples.
 */
const DEFAULT_DONTS: LogoUsageDont[] = [
  {
    label: 'Do not rotate',
    description: 'Never rotate or tilt the logo. It should always appear level and upright.',
    cssTransform: 'rotate(15deg)',
  },
  {
    label: 'Do not stretch',
    description: 'Never distort the logo proportions. Always scale uniformly (lock aspect ratio).',
    cssTransform: 'scaleX(1.4)',
  },
  {
    label: 'Do not recolor',
    description: 'Never apply non-brand colors to the logo. Use only the approved color variants.',
    cssTransform: 'hue-rotate(120deg)',
  },
  {
    label: 'Do not display too small',
    description: 'Never render the logo below the specified minimum size. Illegible logos damage brand perception.',
    cssTransform: 'scale(0.3)',
  },
  {
    label: 'No busy backgrounds',
    description: 'Avoid placing the logo over complex imagery, patterns, or gradients that reduce legibility.',
    cssTransform: 'opacity(0.35)',
  },
  {
    label: 'No drop shadows',
    description: 'Do not add drop shadows, glows, or other visual effects to the logo.',
    cssTransform: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.5))',
  },
  {
    label: 'No outline stroke',
    description: 'Never outline or stroke the logo. Use only the filled, solid versions provided.',
    cssTransform: 'contrast(2) brightness(1.3)',
  },
];

/**
 * Build color contexts from brand config, providing 5 standard variants.
 */
function buildColorContexts(brandConfig: LogoUsageBrandConfig): LogoColorContext[] {
  return [
    {
      name: 'On Black',
      bgColor: '#000000',
      logoColor: '#ffffff',
      description: 'White logo on pure black. Highest contrast for dark environments.',
    },
    {
      name: 'On Surface',
      bgColor: '#0F0F11',
      logoColor: '#ffffff',
      description: 'White logo on dark surface. Standard dark-mode presentation.',
    },
    {
      name: 'On Cream',
      bgColor: '#FFFDF5',
      logoColor: '#1a1a2e',
      description: 'Dark logo on warm cream. Elegant and approachable editorial context.',
    },
    {
      name: 'On Brand',
      bgColor: brandConfig.primaryColor,
      logoColor: '#ffffff',
      description: `White logo on the primary brand color (${brandConfig.primaryColor}). Use for brand-heavy touchpoints.`,
    },
    {
      name: 'On White',
      bgColor: '#ffffff',
      logoColor: '#1a1a2e',
      description: 'Dark logo on white. Default usage for print and digital.',
    },
  ];
}

/**
 * Default file format specifications.
 */
const DEFAULT_FILE_FORMATS: LogoFileFormat[] = [
  {
    format: 'SVG',
    extension: '.svg',
    dimensions: 'Vector (scalable)',
    useCase: 'Web, responsive layouts, any size — preferred format',
  },
  {
    format: 'PNG',
    extension: '.png',
    dimensions: '1024 x 1024 px (transparent)',
    useCase: 'Social media, presentations, print at fixed sizes',
  },
  {
    format: 'ICO',
    extension: '.ico',
    dimensions: '16 x 16, 32 x 32, 48 x 48 px',
    useCase: 'Browser favicons',
  },
  {
    format: 'WebP',
    extension: '.webp',
    dimensions: '512 x 512 px (transparent)',
    useCase: 'Web-optimized raster — smaller file size than PNG',
  },
];

/**
 * Default minimum size specifications.
 */
const DEFAULT_MINIMUM_SIZE: LogoMinimumSize = {
  digital: '32px height',
  print: '10mm height',
};

/**
 * Extract all data for the Logo Usage Rules page.
 *
 * Generates structured data from brand configuration with sensible defaults.
 * The data drives the logo-usage template to render clear space diagrams,
 * do/don't galleries, color context variants, and file format guides.
 *
 * @param brandConfig - Brand configuration with clientName, primaryColor, logoPath
 * @returns Complete page data for template rendering
 */
export function extractLogoUsagePageData(
  brandConfig: LogoUsageBrandConfig,
): LogoUsagePageData {
  return {
    clearSpace: DEFAULT_CLEAR_SPACE,
    dos: DEFAULT_DOS,
    donts: DEFAULT_DONTS,
    colorContexts: buildColorContexts(brandConfig),
    fileFormats: DEFAULT_FILE_FORMATS,
    minimumSize: DEFAULT_MINIMUM_SIZE,
  };
}
