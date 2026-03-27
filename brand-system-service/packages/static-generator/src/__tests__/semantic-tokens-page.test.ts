import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  extractSemanticTokensPageData,
  buildShadcnMappings,
  type SemanticTokensPageData,
} from '../pages/semantic-tokens-page-data';
import { BRAND_BOOK_PAGES, StaticGenerator, type BrandConfig } from '../static-generator';

describe('extractSemanticTokensPageData', () => {
  const semanticColors: Record<string, unknown> = {
    background: {
      default: { $value: '#FFFFFF', $type: 'color', $description: 'Default background' },
      subtle: { $value: '#F9FAFB', $type: 'color', $description: 'Subtle background' },
    },
    text: {
      default: { $value: '#111827', $type: 'color', $description: 'Primary text' },
      secondary: { $value: '#6B7280', $type: 'color', $description: 'Secondary text' },
      muted: { $value: '#9CA3AF', $type: 'color', $description: 'Muted text' },
      inverse: { $value: '#FFFFFF', $type: 'color', $description: 'Inverse text' },
    },
    interactive: {
      default: { $value: '#7631e5', $type: 'color', $description: 'Interactive default' },
      hover: { $value: '#5b21b6', $type: 'color', $description: 'Hover state' },
      active: { $value: '#4c1d95', $type: 'color', $description: 'Active state' },
      disabled: { $value: '#d1d5db', $type: 'color', $description: 'Disabled state' },
    },
    surface: {
      default: { $value: '#FFFFFF', $type: 'color', $description: 'Surface default' },
    },
    border: {
      default: { $value: '#E5E7EB', $type: 'color', $description: 'Border default' },
      focus: { $value: '#7631e5', $type: 'color', $description: 'Focus border' },
    },
    success: {
      '500': { $value: '#008229', $type: 'color', $description: 'Success 500' },
    },
    warning: {
      '500': { $value: '#a84a00', $type: 'color', $description: 'Warning 500' },
    },
    error: {
      '500': { $value: '#c7000f', $type: 'color', $description: 'Error 500' },
    },
  };

  const effectsTokens: Record<string, unknown> = {
    borderRadius: {
      md: { $value: '8px', $type: 'dimension', $description: 'Medium radius' },
    },
    shadow: {
      md: { $value: '0 4px 6px rgba(0,0,0,0.1)', $type: 'shadow', $description: 'Medium shadow' },
    },
  };

  const typographyTokens: Record<string, unknown> = {
    fontWeight: {
      thin: { $value: '100', $type: 'fontWeight', $description: 'Thin' },
      regular: { $value: '400', $type: 'fontWeight', $description: 'Regular' },
      medium: { $value: '500', $type: 'fontWeight', $description: 'Medium' },
      bold: { $value: '700', $type: 'fontWeight', $description: 'Bold' },
      black: { $value: '900', $type: 'fontWeight', $description: 'Black' },
    },
    fontSize: {
      base: { $value: '16px', $type: 'dimension', $description: 'Base' },
    },
  };

  let result: SemanticTokensPageData;

  beforeAll(() => {
    result = extractSemanticTokensPageData(semanticColors, effectsTokens, typographyTokens);
  });

  it('should return a complete SemanticTokensPageData structure', () => {
    expect(result).toHaveProperty('backgrounds');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('glow');
    expect(result).toHaveProperty('interactiveStates');
    expect(result).toHaveProperty('fontWeights');
    expect(result).toHaveProperty('shadcnMappings');
  });

  it('should extract 6 background tokens', () => {
    expect(result.backgrounds).toHaveLength(6);
    const names = result.backgrounds.map((t) => t.name);
    expect(names).toContain('bg-primary');
    expect(names).toContain('bg-secondary');
    expect(names).toContain('bg-muted');
    expect(names).toContain('bg-accent');
    expect(names).toContain('bg-destructive');
    expect(names).toContain('bg-success');
  });

  it('should resolve background token values from semantic colors', () => {
    const primary = result.backgrounds.find((t) => t.name === 'bg-primary');
    expect(primary).toBeDefined();
    expect(primary!.value).toBe('#FFFFFF');
    expect(primary!.cssVar).toBe('--bg-primary');
  });

  it('should extract 4 text tokens', () => {
    expect(result.text).toHaveLength(4);
    const names = result.text.map((t) => t.name);
    expect(names).toContain('text-primary');
    expect(names).toContain('text-secondary');
    expect(names).toContain('text-muted');
    expect(names).toContain('text-accent');
  });

  it('should include preview text for each text token', () => {
    for (const token of result.text) {
      expect(token.preview.length).toBeGreaterThan(0);
    }
  });

  it('should extract 5 glow tokens', () => {
    expect(result.glow).toHaveLength(5);
    const names = result.glow.map((t) => t.name);
    expect(names).toContain('glow-primary');
    expect(names).toContain('glow-accent');
    expect(names).toContain('glow-success');
    expect(names).toContain('glow-warning');
    expect(names).toContain('glow-error');
  });

  it('should generate box-shadow CSS values for glow tokens', () => {
    for (const token of result.glow) {
      // Glow values are box-shadow value strings (offset + blur + spread + color)
      expect(token.value).toMatch(/0 0 \d+px/);
      expect(token.value.length).toBeGreaterThan(10);
    }
  });

  it('should extract 4 interactive states', () => {
    expect(result.interactiveStates).toHaveLength(4);
    const states = result.interactiveStates.map((s) => s.state);
    expect(states).toContain('hover');
    expect(states).toContain('focus');
    expect(states).toContain('active');
    expect(states).toContain('disabled');
  });

  it('should include CSS properties and description for each interactive state', () => {
    for (const state of result.interactiveStates) {
      expect(state.cssProperties.length).toBeGreaterThan(0);
      expect(state.description.length).toBeGreaterThan(0);
    }
  });

  it('should extract 5 font weights', () => {
    expect(result.fontWeights).toHaveLength(5);
    const names = result.fontWeights.map((w) => w.name);
    expect(names).toEqual(['thin', 'regular', 'medium', 'bold', 'black']);
  });

  it('should resolve font weight values from typography tokens', () => {
    const bold = result.fontWeights.find((w) => w.name === 'bold');
    expect(bold).toBeDefined();
    expect(bold!.value).toBe('700');
    expect(bold!.cssVar).toBe('--font-weight-bold');
  });

  it('should use default font weight values when tokens are missing', () => {
    const emptyResult = extractSemanticTokensPageData({}, {}, {});
    expect(emptyResult.fontWeights).toHaveLength(5);
    const thin = emptyResult.fontWeights.find((w) => w.name === 'thin');
    expect(thin!.value).toBe('100');
  });

  it('should provide fallback values when semantic colors are empty', () => {
    const emptyResult = extractSemanticTokensPageData({}, {}, {});
    expect(emptyResult.backgrounds).toHaveLength(6);
    expect(emptyResult.text).toHaveLength(4);
    expect(emptyResult.glow).toHaveLength(5);
    expect(emptyResult.interactiveStates).toHaveLength(4);

    // All backgrounds should have non-empty fallback values
    for (const bg of emptyResult.backgrounds) {
      expect(bg.value.length).toBeGreaterThan(0);
    }
  });
});

describe('buildShadcnMappings', () => {
  it('should produce approximately 20 mappings', () => {
    const mappings = buildShadcnMappings({}, {});
    expect(mappings.length).toBeGreaterThanOrEqual(18);
    expect(mappings.length).toBeLessThanOrEqual(25);
  });

  it('should include canonical shadcn/ui variables', () => {
    const mappings = buildShadcnMappings({}, {});
    const vars = mappings.map((m) => m.shadcnVar);

    expect(vars).toContain('--background');
    expect(vars).toContain('--foreground');
    expect(vars).toContain('--primary');
    expect(vars).toContain('--secondary');
    expect(vars).toContain('--muted');
    expect(vars).toContain('--accent');
    expect(vars).toContain('--destructive');
    expect(vars).toContain('--border');
    expect(vars).toContain('--input');
    expect(vars).toContain('--ring');
    expect(vars).toContain('--radius');
  });

  it('should map to BSS semantic token variables', () => {
    const mappings = buildShadcnMappings({}, {});
    for (const mapping of mappings) {
      expect(mapping.bssToken).toMatch(/^var\(--/);
    }
  });

  it('should resolve values from semantic colors when available', () => {
    const semanticColors: Record<string, unknown> = {
      background: {
        default: { $value: '#FAFAFA', $type: 'color', $description: 'bg' },
      },
    };
    const mappings = buildShadcnMappings(semanticColors, {});
    const bgMapping = mappings.find((m) => m.shadcnVar === '--background');
    expect(bgMapping!.resolvedValue).toBe('#FAFAFA');
  });

  it('should resolve --radius from effects tokens', () => {
    const effectsTokens: Record<string, unknown> = {
      borderRadius: {
        md: { $value: '12px', $type: 'dimension', $description: 'md' },
      },
    };
    const mappings = buildShadcnMappings({}, effectsTokens);
    const radiusMapping = mappings.find((m) => m.shadcnVar === '--radius');
    expect(radiusMapping!.resolvedValue).toBe('12px');
  });
});

describe('BRAND_BOOK_PAGES includes semantic-tokens', () => {
  it('should have a semantic-tokens page entry', () => {
    const page = BRAND_BOOK_PAGES.find((p) => p.slug === 'semantic-tokens');
    expect(page).toBeDefined();
    expect(page!.title).toBe('Semantic Tokens');
    expect(page!.template).toBe('semantic-tokens');
  });
});

describe('Semantic tokens template rendering (integration)', () => {
  const tmpDir = path.join(os.tmpdir(), `bss-test-semantic-tokens-${Date.now()}`);
  const outputDir = path.join(tmpDir, 'output');
  const tokenDir = path.join(tmpDir, 'tokens');

  beforeAll(() => {
    // Create token structure
    fs.mkdirSync(path.join(tokenDir, 'primitive'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'semantic'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'component'), { recursive: true });

    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'colors.json'),
      JSON.stringify({
        color: {
          primary: {
            '500': { $value: '#7631e5', $type: 'color', $description: 'primary 500' },
          },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'typography.json'),
      JSON.stringify({
        fontFamily: {
          body: { $value: 'Inter, sans-serif', $type: 'fontFamily', $description: 'Body' },
        },
        fontSize: {
          base: { $value: '16px', $type: 'dimension', $description: 'base' },
        },
        lineHeight: {
          normal: { $value: 1.5, $type: 'number', $description: 'normal' },
        },
        fontWeight: {
          thin: { $value: '100', $type: 'fontWeight', $description: 'Thin' },
          regular: { $value: '400', $type: 'fontWeight', $description: 'Regular' },
          medium: { $value: '500', $type: 'fontWeight', $description: 'Medium' },
          bold: { $value: '700', $type: 'fontWeight', $description: 'Bold' },
          black: { $value: '900', $type: 'fontWeight', $description: 'Black' },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'spacing.json'),
      JSON.stringify({
        spacing: {
          '0': { $value: '0', $type: 'dimension', $description: 'No spacing' },
          '1': { $value: '8px', $type: 'dimension', $description: '8px' },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'effects.json'),
      JSON.stringify({
        borderRadius: {
          md: { $value: '8px', $type: 'dimension', $description: 'Medium radius' },
        },
        shadow: {
          md: { $value: '0 4px 6px rgba(0,0,0,0.1)', $type: 'shadow', $description: 'Medium shadow' },
        },
        motion: {
          duration: {
            fast: { $value: '100ms', $type: 'duration', $description: 'Fast' },
          },
          easing: {
            default: { $value: 'ease-in-out', $type: 'cubicBezier', $description: 'Default' },
          },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'semantic', 'colors.json'),
      JSON.stringify({
        background: {
          default: { $value: '#FFFFFF', $type: 'color', $description: 'Default background' },
          subtle: { $value: '#F9FAFB', $type: 'color', $description: 'Subtle background' },
        },
        text: {
          default: { $value: '#111827', $type: 'color', $description: 'Primary text' },
          secondary: { $value: '#6B7280', $type: 'color', $description: 'Secondary text' },
          muted: { $value: '#9CA3AF', $type: 'color', $description: 'Muted text' },
          inverse: { $value: '#FFFFFF', $type: 'color', $description: 'Inverse text' },
        },
        interactive: {
          default: { $value: '#7631e5', $type: 'color', $description: 'Interactive default' },
          hover: { $value: '#5b21b6', $type: 'color', $description: 'Hover' },
          active: { $value: '#4c1d95', $type: 'color', $description: 'Active' },
          disabled: { $value: '#d1d5db', $type: 'color', $description: 'Disabled' },
        },
        surface: {
          default: { $value: '#FFFFFF', $type: 'color', $description: 'Surface' },
        },
        border: {
          default: { $value: '#E5E7EB', $type: 'color', $description: 'Border' },
          focus: { $value: '#7631e5', $type: 'color', $description: 'Focus' },
        },
        success: {
          '500': { $value: '#008229', $type: 'color', $description: 'Success 500' },
        },
        warning: {
          '500': { $value: '#a84a00', $type: 'color', $description: 'Warning 500' },
        },
        error: {
          '500': { $value: '#c7000f', $type: 'color', $description: 'Error 500' },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'typography-meta.json'),
      JSON.stringify({ embedTag: '', fonts: [] }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'grid.config.json'),
      JSON.stringify({ baseUnit: 8, maxWidth: 1280 }),
      'utf-8'
    );
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should generate semantic-tokens.html without errors', async () => {
    const generator = new StaticGenerator(false);
    const brandConfig: BrandConfig = {
      clientName: 'TestBrand',
      primaryColor: '#7631e5',
      logoPath: 'logo.svg',
      tagline: 'Test tagline',
      websiteUrl: 'https://test.com',
      brandBookTitle: 'TestBrand Brand Book',
    };

    const result = await generator.generateBrandBook({
      clientSlug: 'semantic-test',
      outputDir,
      tokenDir,
      brandConfig,
    });

    const semanticHtml = path.join(result, 'semantic-tokens.html');
    expect(fs.existsSync(semanticHtml)).toBe(true);

    const html = fs.readFileSync(semanticHtml, 'utf-8');
    expect(html).toContain('Semantic Tokens');
    expect(html).toContain('Background Tokens');
    expect(html).toContain('Text Tokens');
    expect(html).toContain('Glow');
    expect(html).toContain('Interactive States');
    expect(html).toContain('Font Weight');
    expect(html).toContain('shadcn/ui Mapping');
  });

  it('should contain CSS variable references in the generated HTML', async () => {
    const brandBookDir = path.join(outputDir, 'semantic-test', 'brand-book');
    const html = fs.readFileSync(path.join(brandBookDir, 'semantic-tokens.html'), 'utf-8');

    expect(html).toContain('--bg-primary');
    expect(html).toContain('--text-primary');
    expect(html).toContain('--glow-primary');
    expect(html).toContain('--font-weight-bold');
    expect(html).toContain('--background');
  });

  it('should include semantic tokens CSS in style.css', async () => {
    const brandBookDir = path.join(outputDir, 'semantic-test', 'brand-book');
    const css = fs.readFileSync(path.join(brandBookDir, 'assets', 'style.css'), 'utf-8');

    expect(css).toContain('.semantic-swatches');
    expect(css).toContain('.glow-token');
    expect(css).toContain('.interactive-state');
    expect(css).toContain('.font-weight-token');
    expect(css).toContain('.shadcn-mapping-table');
  });
});
