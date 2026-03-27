import fs from 'node:fs';
import path from 'node:path';
import { Eta } from 'eta';
import { createLogger, type Logger } from '@bss/core';
import { runBuildPipeline } from './build-pipeline';
import { extractSurfacesPageData } from './pages/surfaces-page-data';
import { extractSemanticTokensPageData } from './pages/semantic-tokens-page-data';
import { extractIconSystemPageData } from './pages/icon-system-page-data';
import { extractLogoUsagePageData } from './pages/logo-usage-page-data';
import { extractMoodboardPageData } from './pages/moodboard-page-data';
import { extractMovementPageData } from './pages/movement-page-data';
import { extractSeoDocumentationPageData } from './pages/seo-documentation-page-data';
import { extractEditorialStrategyPageData } from './pages/editorial-strategy-page-data';
import { buildNavigationTree, generateBreadcrumbs } from './navigation';

/**
 * Build types supported by the static generator.
 */
export type BuildType = 'brand-book' | 'landing-page' | 'site' | 'bio-link' | 'thank-you' | 'microcopy-guide';

/**
 * Options for static site generation.
 */
export interface GeneratorOptions {
  /** Client identifier for token resolution */
  readonly clientId: string;
  /** Type of static site to generate */
  readonly type: BuildType;
  /** Output directory */
  readonly outputDir: string;
  /** Use relative paths for local package portability (NFR-9.2) */
  readonly relativePaths?: boolean;
  /** Enable debug logging */
  readonly debug?: boolean;
  /** Custom template data (merged with defaults and fixture data) */
  readonly templateData?: Record<string, unknown>;
}

/**
 * Generator configuration for brand book builds.
 */
export interface GeneratorConfig {
  /** Client slug for output directory naming */
  readonly clientSlug: string;
  /** Output root directory */
  readonly outputDir: string;
  /** Path to tokens directory */
  readonly tokenDir: string;
  /** Brand configuration */
  readonly brandConfig: BrandConfig;
  /** Enable debug logging */
  readonly debug?: boolean;
}

/**
 * Brand configuration loaded from brand.config.json.
 */
export interface BrandConfig {
  /** Client display name */
  readonly clientName: string;
  /** Primary brand color in hex */
  readonly primaryColor: string;
  /** Path to logo SVG (relative to project root) */
  readonly logoPath: string;
  /** Brand tagline */
  readonly tagline: string;
  /** Client website URL */
  readonly websiteUrl: string;
  /** Brand book title (defaults to "{clientName} Brand Book") */
  readonly brandBookTitle?: string;
}

/**
 * Color swatch data for template rendering.
 */
export interface ColorSwatch {
  readonly name: string;
  readonly step: string;
  readonly hex: string;
  readonly wcag?: {
    readonly onWhite: number;
    readonly onBlack: number;
    readonly aa: boolean;
    readonly aaLarge: boolean;
    readonly aaa: boolean;
  };
}

/**
 * Color group for template rendering.
 */
export interface ColorGroup {
  readonly name: string;
  readonly swatches: ColorSwatch[];
}

/**
 * Typography specimen for template rendering.
 */
export interface TypographySpecimen {
  readonly name: string;
  readonly fontSize: string;
  readonly lineHeight?: string;
  readonly letterSpacing?: string;
  readonly clamp?: string;
}

/**
 * Spacing block for template rendering.
 */
export interface SpacingBlock {
  readonly name: string;
  readonly value: string;
  readonly description: string;
}

/**
 * Component spec table entry.
 */
export interface ComponentProperty {
  readonly property: string;
  readonly value: string;
  readonly type: string;
  readonly description: string;
}

/**
 * Component group for template rendering.
 */
export interface ComponentGroup {
  readonly name: string;
  readonly variant: string;
  readonly properties: ComponentProperty[];
}

/**
 * Search index entry for Fuse.js.
 */
export interface SearchIndexEntry {
  readonly id: string;
  readonly section: string;
  readonly title: string;
  readonly content: string;
}

/**
 * Brand book page definition.
 */
export interface BrandBookPage {
  readonly slug: string;
  readonly title: string;
  readonly template: string;
}

/**
 * All brand book pages in navigation order.
 */
export const BRAND_BOOK_PAGES: BrandBookPage[] = [
  { slug: 'index', title: 'Overview', template: 'index' },
  { slug: 'guidelines', title: 'Guidelines', template: 'guidelines' },
  { slug: 'foundations', title: 'Foundations', template: 'foundations' },
  { slug: 'logo', title: 'Logo', template: 'logo' },
  { slug: 'logo-usage', title: 'Logo Usage Rules', template: 'logo-usage' },
  { slug: 'colors', title: 'Colors', template: 'colors' },
  { slug: 'typography', title: 'Typography', template: 'typography' },
  { slug: 'icons', title: 'Icons', template: 'icons' },
  { slug: 'components', title: 'Components', template: 'components' },
  { slug: 'motion', title: 'Motion', template: 'motion' },
  { slug: 'surfaces', title: 'Surfaces & Borders', template: 'surfaces' },
  { slug: 'semantic-tokens', title: 'Semantic Tokens', template: 'semantic-tokens' },
  { slug: 'templates', title: 'Templates', template: 'templates' },
  { slug: 'moodboard', title: 'Moodboard', template: 'moodboard' },
  { slug: 'movement', title: 'Movement & Strategy', template: 'movement' },
  { slug: 'seo-documentation', title: 'SEO Documentation', template: 'seo-documentation' },
  { slug: 'editorial-strategy', title: 'Editorial Strategy', template: 'editorial-strategy' },
  { slug: 'about', title: 'About', template: 'about' },
];

/**
 * Load and validate brand.config.json.
 *
 * @param configPath - Path to brand.config.json
 * @returns Validated BrandConfig
 * @throws Error if required fields are missing
 */
export function loadBrandConfig(configPath: string): BrandConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Brand config not found: ${configPath}`);
  }

  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  if (!raw.clientName || typeof raw.clientName !== 'string') {
    throw new Error('brand.config.json: "clientName" is required and must be a string');
  }
  if (!raw.primaryColor || typeof raw.primaryColor !== 'string') {
    throw new Error('brand.config.json: "primaryColor" is required and must be a hex string');
  }
  if (!raw.logoPath || typeof raw.logoPath !== 'string') {
    throw new Error('brand.config.json: "logoPath" is required and must be a string');
  }

  const logger = createLogger('BrandConfig', false);

  if (!raw.tagline) {
    logger.warn('brand.config.json: "tagline" is missing, using empty string');
  }
  if (!raw.websiteUrl) {
    logger.warn('brand.config.json: "websiteUrl" is missing, using empty string');
  }

  return {
    clientName: raw.clientName,
    primaryColor: raw.primaryColor,
    logoPath: raw.logoPath,
    tagline: raw.tagline || '',
    websiteUrl: raw.websiteUrl || '',
    brandBookTitle: raw.brandBookTitle || `${raw.clientName} Brand Book`,
  };
}

/**
 * Extract color swatches from primitive color tokens.
 *
 * @param tokens - Parsed primitive colors.json
 * @returns Array of color groups with swatches
 */
export function injectColors(tokens: Record<string, unknown>): ColorGroup[] {
  const colorRoot = (tokens.color ?? tokens) as Record<string, unknown>;
  const groups: ColorGroup[] = [];

  for (const [groupName, groupData] of Object.entries(colorRoot)) {
    if (typeof groupData !== 'object' || groupData === null) continue;

    const swatches: ColorSwatch[] = [];
    const entries = groupData as Record<string, unknown>;

    for (const [step, tokenData] of Object.entries(entries)) {
      if (step.startsWith('$')) continue;
      if (typeof tokenData !== 'object' || tokenData === null) continue;

      const token = tokenData as Record<string, unknown>;
      if (!token.$value || !token.$type) continue;

      const swatch: ColorSwatch = {
        name: groupName,
        step,
        hex: token.$value as string,
        wcag: token.$extensions
          ? ((token.$extensions as Record<string, unknown>).wcag as ColorSwatch['wcag'])
          : undefined,
      };

      swatches.push(swatch);
    }

    if (swatches.length > 0) {
      // Sort numerically by step
      swatches.sort((a, b) => {
        const numA = parseInt(a.step, 10);
        const numB = parseInt(b.step, 10);
        if (isNaN(numA) || isNaN(numB)) return a.step.localeCompare(b.step);
        return numA - numB;
      });

      groups.push({ name: groupName, swatches });
    }
  }

  return groups;
}

/**
 * Extract typography specimens from primitive typography tokens.
 *
 * @param tokens - Parsed primitive typography.json
 * @returns Array of typography specimens
 */
export function injectTypography(tokens: Record<string, unknown>): TypographySpecimen[] {
  const specimens: TypographySpecimen[] = [];
  const fontSizes = tokens.fontSize as Record<string, unknown> | undefined;
  const lineHeights = tokens.lineHeight as Record<string, unknown> | undefined;

  if (!fontSizes) return specimens;

  const scaleOrder = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'];

  for (const name of scaleOrder) {
    const sizeToken = fontSizes[name] as Record<string, unknown> | undefined;
    if (!sizeToken || !sizeToken.$value) continue;

    const specimen: TypographySpecimen = {
      name,
      fontSize: sizeToken.$value as string,
      lineHeight: lineHeights?.normal
        ? ((lineHeights.normal as Record<string, unknown>).$value as string)
        : undefined,
      letterSpacing: undefined,
      clamp: sizeToken.$extensions
        ? ((sizeToken.$extensions as Record<string, unknown>).clamp as string)
        : undefined,
    };

    specimens.push(specimen);
  }

  return specimens;
}

/**
 * Extract spacing blocks from primitive spacing tokens.
 *
 * @param tokens - Parsed primitive spacing.json
 * @returns Array of spacing blocks
 */
export function injectSpacing(tokens: Record<string, unknown>): SpacingBlock[] {
  const spacingRoot = (tokens.spacing ?? tokens) as Record<string, unknown>;
  const blocks: SpacingBlock[] = [];

  const sortOrder = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '4', '5', '6', '7', '8', '10', '12', '14', '16'];

  for (const name of sortOrder) {
    const token = spacingRoot[name] as Record<string, unknown> | undefined;
    if (!token || !token.$value) continue;

    blocks.push({
      name,
      value: token.$value as string,
      description: (token.$description as string) || '',
    });
  }

  return blocks;
}

/**
 * Extract component specification tables from component token files.
 *
 * @param componentDir - Path to tokens/component/ directory
 * @returns Array of component groups
 */
export function injectComponents(componentDir: string): ComponentGroup[] {
  const groups: ComponentGroup[] = [];

  if (!fs.existsSync(componentDir)) return groups;

  const files = fs.readdirSync(componentDir).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(componentDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const [componentName, componentData] of Object.entries(data)) {
      if (typeof componentData !== 'object' || componentData === null) continue;

      for (const [variantName, variantData] of Object.entries(componentData as Record<string, unknown>)) {
        if (typeof variantData !== 'object' || variantData === null) continue;

        const properties: ComponentProperty[] = [];

        for (const [propName, propData] of Object.entries(variantData as Record<string, unknown>)) {
          if (typeof propData !== 'object' || propData === null) continue;

          const token = propData as Record<string, unknown>;
          if (token.$value !== undefined) {
            properties.push({
              property: propName,
              value: token.$value as string,
              type: (token.$type as string) || 'unknown',
              description: (token.$description as string) || '',
            });
          } else {
            // Nested group (e.g., button.primary.label.fontSize)
            for (const [subProp, subData] of Object.entries(propData as Record<string, unknown>)) {
              if (typeof subData !== 'object' || subData === null) continue;
              const subToken = subData as Record<string, unknown>;
              if (subToken.$value !== undefined) {
                properties.push({
                  property: `${propName}.${subProp}`,
                  value: subToken.$value as string,
                  type: (subToken.$type as string) || 'unknown',
                  description: (subToken.$description as string) || '',
                });
              }
            }
          }
        }

        if (properties.length > 0) {
          groups.push({
            name: componentName,
            variant: variantName,
            properties,
          });
        }
      }
    }
  }

  return groups;
}

/**
 * Build search index from all generated section content.
 *
 * @param sections - Map of section slug to text content
 * @returns Array of search index entries
 */
export function buildSearchIndex(sections: Map<string, string>): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];

  for (const [slug, content] of sections) {
    const page = BRAND_BOOK_PAGES.find((p) => p.slug === slug);
    if (!page) continue;

    entries.push({
      id: slug,
      section: slug,
      title: page.title,
      content: content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    });
  }

  return entries;
}

/**
 * Static Generator builds HTML/CSS/JS brand books from templates and tokens.
 *
 * Per ADR-001, this is the DEFAULT build path. Templates are rendered
 * at build time with design tokens injected as CSS Custom Properties.
 */
export class StaticGenerator {
  private readonly logger: Logger;
  private readonly eta: Eta;

  constructor(debug = false) {
    this.logger = createLogger('StaticGenerator', debug);
    this.eta = new Eta({ views: path.join(__dirname, '..', 'templates'), autoEscape: false });
  }

  /**
   * Generate a static site.
   *
   * Routes to the appropriate build pipeline based on the build type:
   * - brand-book: Uses Eta templates and the existing brand book generation flow
   * - landing-page, site: Uses Nunjucks templates with LightningCSS + esbuild bundling
   */
  async generate(options: GeneratorOptions): Promise<string> {
    const startTime = Date.now();
    this.logger.info('Static generation started', {
      clientId: options.clientId,
      type: options.type,
      outputDir: options.outputDir,
    });

    if (options.type === 'brand-book') {
      return this.generateBrandBook({
        clientSlug: options.clientId,
        outputDir: options.outputDir,
        tokenDir: path.join(process.cwd(), 'tokens'),
        brandConfig: loadBrandConfig(path.join(process.cwd(), 'brand.config.json')),
        debug: options.debug,
      });
    }

    // Landing page and site types use the full build pipeline
    const result = await runBuildPipeline(options, this.logger);

    const elapsed = Date.now() - startTime;
    this.logger.info(`Static generation completed in ${elapsed}ms`, {
      clientId: options.clientId,
      type: options.type,
      durationMs: elapsed,
      pageCount: result.pageCount,
      assetCount: result.assetCount,
    });

    return result.outputDir;
  }

  /**
   * Generate a brand book from config, tokens, and templates.
   *
   * @param config - Generator configuration
   * @returns Output directory path
   */
  async generateBrandBook(config: GeneratorConfig): Promise<string> {
    const startTime = Date.now();
    const outputDir = path.join(config.outputDir, config.clientSlug, 'brand-book');

    this.logger.info('Brand book generation started', { clientSlug: config.clientSlug, outputDir });

    // Ensure output directories exist
    fs.mkdirSync(path.join(outputDir, 'assets'), { recursive: true });

    // Load token data
    const colorTokens = this.loadJsonSafe(path.join(config.tokenDir, 'primitive', 'colors.json'));
    const typographyTokens = this.loadJsonSafe(path.join(config.tokenDir, 'primitive', 'typography.json'));
    const spacingTokens = this.loadJsonSafe(path.join(config.tokenDir, 'primitive', 'spacing.json'));
    const effectsTokens = this.loadJsonSafe(path.join(config.tokenDir, 'primitive', 'effects.json'));
    const semanticColors = this.loadJsonSafe(path.join(config.tokenDir, 'semantic', 'colors.json'));
    const typographyMeta = this.loadJsonSafe(path.join(config.tokenDir, 'typography-meta.json'));
    const gridConfig = this.loadJsonSafe(path.join(config.tokenDir, 'grid.config.json'));

    // Inject token data
    const colorGroups = injectColors(colorTokens);
    const semanticColorGroups = injectColors(semanticColors);
    const typographySpecimens = injectTypography(typographyTokens);
    const spacingBlocks = injectSpacing(spacingTokens);
    const componentGroups = injectComponents(path.join(config.tokenDir, 'component'));
    const surfacesData = extractSurfacesPageData(semanticColors, effectsTokens);
    const semanticTokensData = extractSemanticTokensPageData(semanticColors, effectsTokens, typographyTokens);
    const iconSystemData = extractIconSystemPageData(config.brandConfig);
    const logoUsageData = extractLogoUsagePageData(config.brandConfig);
    const moodboardData = extractMoodboardPageData(undefined, config.brandConfig.primaryColor);
    const movementData = extractMovementPageData(undefined, config.brandConfig.clientName);
    const seoDocumentationData = extractSeoDocumentationPageData({
      brandName: config.brandConfig.clientName,
      domain: config.brandConfig.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com',
      tagline: config.brandConfig.tagline,
    });
    const editorialStrategyData = extractEditorialStrategyPageData();

    // Build navigation tree (hierarchical sidebar with icons + breadcrumbs)
    const navigationTree = buildNavigationTree();

    // Build template data
    const templateData = {
      brand: config.brandConfig,
      title: config.brandConfig.brandBookTitle || `${config.brandConfig.clientName} Brand Book`,
      pages: BRAND_BOOK_PAGES,
      navigationTree,
      colors: { primitive: colorGroups, semantic: semanticColorGroups },
      typography: {
        specimens: typographySpecimens,
        fontFamilies: typographyTokens.fontFamily || {},
        meta: typographyMeta,
      },
      spacing: spacingBlocks,
      effects: effectsTokens,
      grid: gridConfig,
      components: componentGroups,
      surfacesData,
      semanticTokens: semanticTokensData,
      iconSystem: iconSystemData,
      logoUsage: logoUsageData,
      moodboard: moodboardData,
      movement: movementData,
      seoDocumentation: seoDocumentationData,
      editorialStrategy: editorialStrategyData,
    };

    // Generate CSS
    const cssContent = this.generateCSS(config.brandConfig, typographyMeta);
    fs.writeFileSync(path.join(outputDir, 'assets', 'style.css'), cssContent, 'utf-8');

    // Generate pages and collect content for search index
    const sectionContent = new Map<string, string>();

    for (const page of BRAND_BOOK_PAGES) {
      const pageContent = this.renderPage(page, templateData);
      fs.writeFileSync(path.join(outputDir, `${page.slug}.html`), pageContent, 'utf-8');
      sectionContent.set(page.slug, pageContent);
      this.logger.info(`Generated ${page.slug}.html`);
    }

    // Generate search index
    const searchIndex = buildSearchIndex(sectionContent);
    fs.writeFileSync(
      path.join(outputDir, 'assets', 'search-index.json'),
      JSON.stringify(searchIndex, null, 2),
      'utf-8'
    );

    // Generate search.js
    const searchJs = this.generateSearchJs();
    fs.writeFileSync(path.join(outputDir, 'assets', 'search.js'), searchJs, 'utf-8');

    // Copy assets
    this.copyAssets(config, outputDir);

    const elapsed = Date.now() - startTime;
    this.logger.info(`Brand book generation completed in ${elapsed}ms`, {
      clientSlug: config.clientSlug,
      pages: BRAND_BOOK_PAGES.length,
      elapsed,
    });

    return outputDir;
  }

  /**
   * Render a single page using layout + section template.
   */
  private renderPage(
    page: BrandBookPage,
    data: Record<string, unknown>
  ): string {
    const breadcrumbs = generateBreadcrumbs(page.slug);

    const sectionHtml = this.eta.render(page.template, {
      ...data,
      currentPage: page,
      breadcrumbs,
    });

    return this.eta.render('layout', {
      ...data,
      currentPage: page,
      breadcrumbs,
      content: sectionHtml,
    });
  }

  /**
   * Generate the main CSS file.
   */
  private generateCSS(brand: BrandConfig, typographyMeta: Record<string, unknown>): string {
    return `/* Brand Book Styles — Generated by @bss/static-generator */
:root {
  --brand-primary: ${brand.primaryColor};
  --sidebar-width: 260px;
  --content-max: 960px;
  --nav-height: 56px;
  --color-bg: #ffffff;
  --color-bg-subtle: #f8f9fa;
  --color-text: #1a1a2e;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-focus: ${brand.primaryColor};
  --font-body: 'Inter', system-ui, sans-serif;
  --font-display: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Focus styles (WCAG AA) */
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

a { color: var(--brand-primary); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Layout */
.page-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Navigation */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-bg-subtle);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  z-index: 100;
  padding: 24px 0;
}

.sidebar__brand {
  padding: 0 24px 24px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.sidebar__brand-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}

.sidebar__brand-tagline {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.sidebar__logo {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav a {
  display: block;
  padding: 10px 24px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}

.sidebar nav a:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-text);
  text-decoration: none;
}

.sidebar nav a.active {
  color: var(--brand-primary);
  background: rgba(0, 0, 0, 0.06);
  font-weight: 600;
  border-left: 3px solid var(--brand-primary);
}

/* Main Content */
.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  padding: 48px 64px;
  max-width: calc(var(--content-max) + 128px);
}

.main-content h1 {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.025em;
}

.main-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 16px;
  letter-spacing: -0.015em;
}

.main-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
}

.main-content p {
  margin-bottom: 16px;
  max-width: 680px;
}

/* Search */
.search-container {
  padding: 0 24px 16px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
}

.search-input:focus {
  border-color: var(--brand-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

.search-results {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-height: 400px;
  overflow-y: auto;
  z-index: 200;
  margin-top: 4px;
}

.search-results.visible { display: block; }

.search-result-item {
  display: block;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.search-result-item:hover {
  background: var(--color-bg-subtle);
  text-decoration: none;
}

.search-result-item__title {
  font-weight: 600;
  font-size: 14px;
}

.search-result-item__snippet {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

/* Color Swatches */
.color-group { margin-bottom: 40px; }

.color-group__title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: capitalize;
}

.color-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.color-swatch {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.color-swatch__preview {
  height: 80px;
  width: 100%;
}

.color-swatch__info {
  padding: 8px 12px;
  font-size: 12px;
}

.color-swatch__name {
  font-weight: 600;
  font-family: var(--font-mono);
}

.color-swatch__hex {
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.wcag-badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  margin-top: 4px;
}

.wcag-badge--pass { background: #dcfce7; color: #166534; }
.wcag-badge--fail { background: #fef2f2; color: #991b1b; }

/* Typography Specimens */
.type-specimen {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.type-specimen__label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  margin-bottom: 8px;
}

.type-specimen__sample {
  margin-bottom: 8px;
}

.type-specimen__meta {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

/* Spacing Blocks */
.spacing-blocks { display: flex; flex-direction: column; gap: 8px; }

.spacing-block {
  display: flex;
  align-items: center;
  gap: 16px;
}

.spacing-block__visual {
  background: var(--brand-primary);
  opacity: 0.3;
  border-radius: 4px;
  min-width: 8px;
  height: 32px;
  flex-shrink: 0;
}

.spacing-block__label {
  font-family: var(--font-mono);
  font-size: 13px;
  min-width: 60px;
  font-weight: 600;
}

.spacing-block__value {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-secondary);
  min-width: 60px;
}

.spacing-block__desc {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* Component Spec Tables */
.component-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
  font-size: 14px;
}

.component-table th {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 2px solid var(--color-border);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.component-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: 13px;
}

/* Hamburger Menu (CSS-only for mobile) */
.hamburger-toggle { display: none; }
.hamburger-label { display: none; }

.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 150;
  align-items: center;
  padding: 0 16px;
}

.mobile-header__title {
  font-weight: 700;
  font-size: 16px;
  margin-left: 12px;
}

/* Hamburger icon */
.hamburger-label span,
.hamburger-label span::before,
.hamburger-label span::after {
  display: block;
  background: var(--color-text);
  height: 2px;
  width: 24px;
  transition: transform 0.2s;
  position: relative;
}

.hamburger-label span::before,
.hamburger-label span::after {
  content: '';
  position: absolute;
}

.hamburger-label span::before { top: -7px; }
.hamburger-label span::after { top: 7px; }

.hamburger-toggle:checked ~ .sidebar {
  transform: translateX(0);
}

.hamburger-toggle:checked ~ .mobile-header .hamburger-label span {
  background: transparent;
}

.hamburger-toggle:checked ~ .mobile-header .hamburger-label span::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger-toggle:checked ~ .mobile-header .hamburger-label span::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .mobile-header { display: flex; }

  .hamburger-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px;
  }

  .main-content {
    margin-left: 0;
    padding: 80px 24px 48px;
  }
}

/* Section-specific */
.section-intro {
  font-size: 18px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  max-width: 680px;
}

.font-family-card {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 16px;
}

.font-family-card__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.font-family-card__sample {
  font-size: 32px;
  margin-bottom: 8px;
}

.logo-display {
  padding: 48px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  text-align: center;
  margin-bottom: 24px;
}

.logo-display img {
  max-width: 320px;
  max-height: 200px;
}

.motion-card {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 16px;
}

.motion-card__label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  margin-bottom: 8px;
}

.motion-card__value {
  font-family: var(--font-mono);
  font-weight: 600;
}

/* About Page — Overview Card */
.about-overview__card {
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px 32px;
  margin-bottom: 32px;
}

.about-overview__details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin: 0;
}

.about-detail {
  display: flex;
  align-items: baseline;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.about-detail:last-child {
  border-bottom: none;
}

.about-detail dt {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-width: 140px;
  flex-shrink: 0;
}

.about-detail dd {
  font-size: 15px;
  color: var(--color-text);
  margin: 0;
}

/* About Page — Tech Stack Grid */
.tech-stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 32px;
}

.tech-stack-item {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: box-shadow 0.15s;
}

.tech-stack-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tech-stack-item__icon {
  color: var(--brand-primary);
  margin-bottom: 12px;
}

.tech-stack-item__name {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.tech-stack-item__desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* About Page — Timeline */
.timeline {
  position: relative;
  padding: 16px 0;
  margin-bottom: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-border);
}

.timeline__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding-bottom: 32px;
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__marker {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  flex-shrink: 0;
}

.timeline__number {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.timeline__item--complete .timeline__marker {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.timeline__item--complete .timeline__number {
  color: #ffffff;
}

.timeline__item--active .timeline__marker {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.06);
}

.timeline__item--active .timeline__number {
  color: var(--brand-primary);
}

.timeline__content {
  padding-top: 6px;
  flex: 1;
}

.timeline__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.timeline__desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
  max-width: 520px;
}

/* About Page — Team Placeholder */
.about-team__placeholder {
  background: var(--color-bg-subtle);
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
}

.about-team__placeholder p {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0 auto;
  max-width: 480px;
}

/* About Page — Responsive */
@media (max-width: 768px) {
  .about-detail {
    flex-direction: column;
    gap: 2px;
  }

  .about-detail dt {
    min-width: auto;
  }

  .tech-stack-grid {
    grid-template-columns: 1fr;
  }

  .timeline::before {
    left: 15px;
  }

  .timeline__marker {
    width: 32px;
    height: 32px;
  }

  .timeline__number {
    font-size: 12px;
  }
}

/* Surfaces & Borders — Token Swatches */
.token-grid { display: grid; gap: 16px; }
.token-grid--3col { grid-template-columns: repeat(3, 1fr); }
.token-grid--2col { grid-template-columns: repeat(2, 1fr); }

.token-swatch {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.token-swatch__preview {
  height: 80px;
  width: 100%;
  border-radius: 8px 8px 0 0;
}

.token-swatch__info {
  padding: 12px;
}

.token-swatch__name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.token-swatch__var {
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--brand-primary);
  margin-bottom: 4px;
}

.token-swatch__value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
}

.token-swatch__desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.token-swatch__snippet {
  padding: 8px 12px;
  background: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border);
  font-size: 12px;
}

.token-swatch__snippet code {
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}

/* Surfaces — Border Preview */
.border-preview {
  height: 80px;
  width: 100%;
  border-radius: 8px 8px 0 0;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Surfaces — Radius Preview */
.radius-preview {
  height: 80px;
  width: 100%;
  background: var(--brand-primary);
  opacity: 0.15;
}

/* Surfaces — Glass Effects */
.glass-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.glass-preview {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(135deg, var(--brand-primary), #6366f1, #ec4899);
  position: relative;
}

.glass-preview__label {
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.glass-snippet {
  margin: 0;
  padding: 12px;
  background: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
}

/* Surfaces — Responsive */
@media (max-width: 768px) {
  .token-grid--3col { grid-template-columns: 1fr; }
  .token-grid--2col { grid-template-columns: 1fr; }
}

/* Semantic Tokens — Background Swatches */
.semantic-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 32px;
}

.semantic-swatch {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.semantic-swatch__preview {
  height: 80px;
  width: 100%;
}

.semantic-swatch__info {
  padding: 10px 12px;
}

.semantic-swatch__name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.semantic-swatch__css {
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--brand-primary);
  margin-bottom: 2px;
}

.semantic-swatch__value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* Semantic Tokens — Text Previews */
.semantic-text-tokens {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 32px;
}

.semantic-text-token {
  padding: 20px 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.semantic-text-token__preview {
  font-size: 20px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.semantic-text-token__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.semantic-text-token__name {
  font-weight: 600;
}

.semantic-text-token__css {
  font-family: var(--font-mono);
  color: var(--brand-primary);
}

.semantic-text-token__value {
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}

/* Semantic Tokens — Glow & Neon */
.glow-tokens {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 16px;
  margin-bottom: 32px;
}

.glow-token {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.glow-token__preview {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a2e;
  border-radius: 8px;
  margin: 16px;
}

.glow-token__label {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.glow-token__meta {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
}

.glow-token__css {
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--brand-primary);
  margin-bottom: 4px;
}

.glow-token__value {
  font-size: 11px;
  line-height: 1.5;
}

.glow-token__value code {
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  word-break: break-all;
}

/* Semantic Tokens — Interactive States */
.interactive-states {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 16px;
  margin-bottom: 32px;
}

.interactive-state {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.interactive-state__demo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  background: var(--brand-primary);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.interactive-state__demo--hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  filter: brightness(1.1);
}

.interactive-state__demo--focus:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.interactive-state__demo--active:active {
  transform: scale(0.98);
  filter: brightness(0.9);
}

.interactive-state__demo--disabled {
  background: var(--color-text-secondary);
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.interactive-state__info {
  padding: 16px;
}

.interactive-state__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.interactive-state__desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.interactive-state__css {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-secondary);
  background: var(--color-bg-subtle);
  padding: 8px;
  border-radius: 4px;
  word-break: break-all;
  line-height: 1.5;
}

/* Semantic Tokens — Font Weights */
.font-weight-tokens {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 32px;
}

.font-weight-token {
  padding: 20px 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.font-weight-token__sample {
  font-size: 24px;
  line-height: 1.4;
  margin-bottom: 8px;
}

.font-weight-token__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.font-weight-token__name {
  font-weight: 600;
  text-transform: capitalize;
}

.font-weight-token__css {
  font-family: var(--font-mono);
  color: var(--brand-primary);
}

.font-weight-token__value {
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}

/* Semantic Tokens — shadcn/ui Mapping Table */
.shadcn-table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
  margin-bottom: 32px;
}

.shadcn-mapping-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.shadcn-mapping-table th {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid var(--color-border);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.shadcn-mapping-table td {
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: 13px;
  vertical-align: middle;
}

.shadcn-mapping-table tbody tr:hover {
  background: var(--color-bg-subtle);
}

.shadcn-mapping-table__color {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid var(--color-border);
  vertical-align: middle;
  margin-right: 6px;
}

/* Semantic Tokens — Responsive */
@media (max-width: 768px) {
  .semantic-swatches { grid-template-columns: 1fr 1fr; }
  .glow-tokens { grid-template-columns: 1fr; }
  .interactive-states { grid-template-columns: 1fr; }
  .shadcn-mapping-table { font-size: 12px; }
  .shadcn-mapping-table th,
  .shadcn-mapping-table td { padding: 8px 10px; }
}

/* ===== Icon System Page (BSS-A.6) ===== */
.icon-size-showcase {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  margin: 24px 0;
  flex-wrap: wrap;
}
.icon-size-card {
  text-align: center;
}
.icon-size-card__preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary, #1a1a2e);
}
.icon-size-card__label {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  margin-top: 8px;
}
.icon-search-wrapper {
  margin: 16px 0;
}
.icon-search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 16px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-size: 14px;
  background: var(--color-bg-input, #fff);
  color: var(--color-text-primary, #1a1a2e);
}
.icon-search-input:focus {
  outline: none;
  border-color: var(--brand-primary, #7631e5);
  box-shadow: 0 0 0 3px rgba(118, 49, 229, 0.1);
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.icon-card {
  text-align: center;
  padding: 16px 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.icon-card:hover {
  border-color: var(--brand-primary, #7631e5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.icon-card__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  color: var(--color-text-primary, #1a1a2e);
}
.icon-card__name {
  font-size: 11px;
  color: var(--color-text-secondary, #6b7280);
  margin-top: 8px;
  font-family: var(--font-mono, monospace);
}
.stroke-rules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 16px 0;
}
.stroke-rule-card {
  padding: 16px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  text-align: center;
}
.stroke-rule-card__label {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.stroke-rule-card__value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a2e);
}
.accessibility-guidelines {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 16px 0;
}
.color-variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.color-variant-card {
  text-align: center;
  padding: 16px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
}
.color-variant-card__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  margin-bottom: 8px;
}
.color-variant-card__name {
  font-weight: 600;
  font-size: 13px;
}
.color-variant-card__css {
  font-size: 11px;
  color: var(--color-text-secondary, #6b7280);
}
.color-variant-card__value {
  font-size: 11px;
  color: var(--color-text-muted, #9ca3af);
  font-family: var(--font-mono, monospace);
}

/* ===== Logo Usage Page (BSS-A.3) ===== */
.clear-space-diagram {
  max-width: 400px;
  margin: 24px auto;
}
.clear-space-diagram svg {
  width: 100%;
  height: auto;
}
.logo-dos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.logo-do-card {
  padding: 20px;
  border-radius: 8px;
  position: relative;
}
.logo-do-card__check {
  font-size: 20px;
  margin-bottom: 8px;
  color: #22c55e;
}
.logo-do-card__label {
  font-weight: 600;
  margin-bottom: 4px;
}
.logo-do-card__desc {
  font-size: 13px;
  opacity: 0.85;
}
.logo-donts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.logo-dont-card {
  padding: 16px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  text-align: center;
}
.logo-dont-card__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  margin-bottom: 8px;
}
.logo-dont-card__preview img {
  max-height: 60px;
  object-fit: contain;
}
.logo-dont-card__x {
  color: #ef4444;
  font-size: 18px;
  font-weight: 700;
}
.logo-dont-card__label {
  font-weight: 600;
  font-size: 13px;
  margin: 4px 0;
}
.logo-dont-card__desc {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
}
.logo-context-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.logo-context-card {
  padding: 24px;
  border-radius: 8px;
  text-align: center;
}
.logo-context-card__logo {
  margin-bottom: 12px;
}
.logo-context-card__logo img {
  max-height: 80px;
  object-fit: contain;
}
.logo-context-card__name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}
.logo-context-card__desc {
  font-size: 12px;
  opacity: 0.8;
}
.file-format-table-wrapper {
  overflow-x: auto;
  margin: 16px 0;
}
.file-format-table {
  width: 100%;
  border-collapse: collapse;
}
.file-format-table th,
.file-format-table td {
  padding: 10px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}
.file-format-table th {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary, #6b7280);
  font-weight: 600;
}
.minimum-size-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}
.minimum-size-card {
  padding: 20px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  text-align: center;
}
.minimum-size-card__label {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.minimum-size-card__value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a2e);
}

/* ===== Moodboard Page (BSS-A.1) ===== */
.moodboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.moodboard-slot {
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
}
.moodboard-slot__image,
.moodboard-slot__pattern {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.moodboard-slot__placeholder {
  font-size: 13px;
  color: var(--color-text-secondary, #6b7280);
  text-align: center;
  padding: 16px;
}
.moodboard-slot__caption {
  padding: 8px 12px;
  font-weight: 600;
  font-size: 13px;
}
.moodboard-slot__tag {
  display: inline-block;
  margin: 0 12px 8px;
  padding: 2px 8px;
  font-size: 11px;
  background: var(--color-bg-subtle, #f3f4f6);
  border-radius: 4px;
  color: var(--color-text-secondary, #6b7280);
}
.design-principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.design-principle-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
}
.design-principle-card__swatch {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
}
.design-principle-card__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
}
.design-principle-card__desc {
  font-size: 13px;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
}

/* ===== Movement/Strategy Page (BSS-A.2) ===== */
.movement-toc {
  position: sticky;
  top: 0;
  background: var(--color-bg-base, #fff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding: 12px 0;
  margin: -8px 0 24px;
  z-index: 10;
  overflow-x: auto;
}
.movement-toc ul {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}
.movement-toc a {
  font-size: 13px;
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.movement-toc a:hover {
  color: var(--brand-primary, #7631e5);
  border-bottom-color: var(--brand-primary, #7631e5);
}
.movement-manifesto {
  border-left: 4px solid var(--brand-primary, #7631e5);
  padding: 20px 24px;
  margin: 16px 0;
  background: var(--color-bg-subtle, #f9fafb);
  border-radius: 0 8px 8px 0;
  font-size: 18px;
  font-style: italic;
  color: var(--color-text-primary, #1a1a2e);
}
.movement-philosophy__statement {
  font-size: 15px;
  color: var(--color-text-secondary, #6b7280);
  padding-left: 24px;
  border-left: 2px solid var(--color-border, #e5e7eb);
  margin: 12px 0;
}
.movement-promise {
  margin: 24px 0;
  padding: 16px 20px;
  background: var(--color-bg-subtle, #f9fafb);
  border-radius: 8px;
}
.movement-purpose__statement {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
}
.movement-values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin: 16px 0;
}
.movement-value-card {
  padding: 20px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
}
.movement-value-card__name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}
.movement-value-card__desc {
  font-size: 13px;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
}
.archetype-composition {
  display: grid;
  gap: 16px;
  margin: 16px 0;
}
.archetype-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.archetype-card--primary {
  border-color: var(--brand-primary, #7631e5);
  border-width: 2px;
}
.archetype-card__icon {
  flex-shrink: 0;
  color: var(--brand-primary, #7631e5);
}
.archetype-card__name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
.archetype-card__percentage {
  font-size: 24px;
  font-weight: 700;
  color: var(--brand-primary, #7631e5);
}
.archetype-card__desc {
  font-size: 13px;
  color: var(--color-text-secondary, #6b7280);
  margin: 4px 0 0;
}
.archetype-card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--brand-primary, #7631e5);
  border-radius: 0 3px 0 0;
}
.movement-positioning {
  border-left: 4px solid var(--brand-primary, #7631e5);
  padding: 16px 20px;
  margin: 16px 0;
  background: var(--color-bg-subtle, #f9fafb);
  border-radius: 0 8px 8px 0;
  font-size: 16px;
}
.positioning-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 16px 0;
}
.positioning-element {
  padding: 16px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
}
.positioning-element__label {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.positioning-element__value {
  font-size: 14px;
  font-weight: 500;
}
.brandscript-flow {
  display: grid;
  gap: 16px;
  margin: 16px 0;
}
.brandscript-card {
  padding: 20px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
}
.brandscript-card__label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary, #6b7280);
  font-weight: 600;
  margin-bottom: 8px;
}
.brandscript-card--problem {
  border-left: 3px solid #ef4444;
}
.brandscript-problem-levels > div {
  margin: 8px 0;
  font-size: 14px;
}
.brandscript-plan {
  padding-left: 20px;
}
.brandscript-plan li {
  margin: 8px 0;
}
.brandscript-cta {
  font-size: 16px;
  font-weight: 600;
  color: var(--brand-primary, #7631e5);
}
.brandscript-outcomes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.brandscript-card--success {
  border-left: 3px solid #22c55e;
}
.brandscript-card--failure {
  border-left: 3px solid #ef4444;
}
.vocabulary-section {
  display: grid;
  gap: 24px;
  margin: 16px 0;
}
.vocabulary-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}
.vocabulary-word {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}
.vocabulary-word--power {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.vocabulary-word--banned {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  text-decoration: line-through;
}
.vocabulary-tone {
  padding-left: 20px;
}
.vocabulary-tone li {
  margin: 8px 0;
  font-size: 14px;
  color: var(--color-text-secondary, #6b7280);
}
.hero-journey-timeline {
  position: relative;
  margin: 24px 0;
  padding-left: 32px;
}
.hero-journey-timeline::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-border, #e5e7eb);
}
.hero-journey-stage {
  position: relative;
  margin-bottom: 32px;
}
.hero-journey-stage__marker {
  position: absolute;
  left: -32px;
  top: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand-primary, #7631e5);
  border: 3px solid var(--color-bg-base, #fff);
}
.hero-journey-stage__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}
.brand-contract {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 16px 0;
}
.brand-contract__section {
  padding: 24px;
  border-radius: 8px;
}
.brand-contract__section--promises {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}
.brand-contract__section--demands {
  background: #fef3c7;
  border: 1px solid #fde68a;
}
.brand-contract__section h3 {
  margin: 0 0 12px;
  font-size: 16px;
}
.brand-contract__section ul {
  padding-left: 18px;
  margin: 0;
}
.brand-contract__section li {
  margin: 8px 0;
  font-size: 14px;
}

/* Wave 2 Pages — Responsive */
@media (max-width: 768px) {
  .icon-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
  .stroke-rules-grid { grid-template-columns: 1fr; }
  .accessibility-guidelines { grid-template-columns: 1fr; }
  .logo-dos-grid { grid-template-columns: 1fr; }
  .logo-donts-grid { grid-template-columns: repeat(2, 1fr); }
  .logo-context-grid { grid-template-columns: 1fr 1fr; }
  .minimum-size-grid { grid-template-columns: 1fr; }
  .moodboard-grid { grid-template-columns: 1fr; }
  .design-principles-grid { grid-template-columns: 1fr; }
  .movement-values-grid { grid-template-columns: 1fr; }
  .positioning-grid { grid-template-columns: 1fr; }
  .brandscript-outcomes { grid-template-columns: 1fr; }
  .brand-contract { grid-template-columns: 1fr; }
  .movement-toc ul { gap: 8px; }
}
`;
  }

  /**
   * Generate the search.js client-side script.
   */
  private generateSearchJs(): string {
    return `/* Brand Book Search — Powered by Fuse.js */
(function() {
  'use strict';
  var searchInput = document.getElementById('brand-search');
  var resultsEl = document.getElementById('search-results');
  if (!searchInput || !resultsEl) return;

  var fuse = null;
  var indexLoaded = false;

  function loadIndex() {
    if (indexLoaded) return Promise.resolve();
    return fetch('./assets/search-index.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        fuse = new Fuse(data, {
          keys: ['title', 'content'],
          threshold: 0.3,
          includeMatches: true,
          minMatchCharLength: 2,
        });
        indexLoaded = true;
      });
  }

  searchInput.addEventListener('focus', function() {
    loadIndex();
  });

  var debounce;
  searchInput.addEventListener('input', function() {
    clearTimeout(debounce);
    var query = searchInput.value.trim();
    if (query.length < 2) {
      resultsEl.classList.remove('visible');
      resultsEl.innerHTML = '';
      return;
    }
    debounce = setTimeout(function() {
      loadIndex().then(function() {
        var results = fuse.search(query, { limit: 8 });
        if (results.length === 0) {
          resultsEl.innerHTML = '<div style="padding:16px;color:#6b7280;font-size:14px;">No results found.</div>';
          resultsEl.classList.add('visible');
          return;
        }
        var html = results.map(function(r) {
          var snippet = r.item.content.substring(0, 120) + '...';
          return '<a class="search-result-item" href="./' + r.item.section + '.html">' +
            '<div class="search-result-item__title">' + r.item.title + '</div>' +
            '<div class="search-result-item__snippet">' + snippet + '</div></a>';
        }).join('');
        resultsEl.innerHTML = html;
        resultsEl.classList.add('visible');
      });
    }, 150);
  });

  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !resultsEl.contains(e.target)) {
      resultsEl.classList.remove('visible');
    }
  });

  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      resultsEl.classList.remove('visible');
      searchInput.blur();
    }
  });
})();
`;
  }

  /**
   * Copy logo and other assets to output directory.
   */
  private copyAssets(config: GeneratorConfig, outputDir: string): void {
    // Copy logo if it exists
    const logoSrc = path.resolve(path.dirname(config.tokenDir), config.brandConfig.logoPath);
    const logoDest = path.join(outputDir, 'assets', 'logo.svg');

    if (fs.existsSync(logoSrc)) {
      fs.copyFileSync(logoSrc, logoDest);
      this.logger.info('Copied logo to assets/logo.svg');
    } else {
      // Create a placeholder SVG
      const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" fill="${config.brandConfig.primaryColor}" rx="16"/>
  <text x="60" y="68" text-anchor="middle" fill="white" font-family="system-ui" font-size="48" font-weight="700">${config.brandConfig.clientName.charAt(0)}</text>
</svg>`;
      fs.writeFileSync(logoDest, placeholderSvg, 'utf-8');
      this.logger.warn('Logo not found, created placeholder SVG');
    }
  }

  /**
   * Safely load a JSON file, returning empty object if not found.
   */
  private loadJsonSafe(filePath: string): Record<string, unknown> {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (err) {
      this.logger.warn(`Failed to load ${filePath}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    return {};
  }
}
