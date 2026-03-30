import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  extractSurfacesPageData,
} from '../pages/surfaces-page-data';
import {
  StaticGenerator,
  BRAND_BOOK_PAGES,
  type BrandConfig,
} from '../static-generator';

describe('extractSurfacesPageData', () => {
  it('should return default surfaces when semantic tokens have no background keys', () => {
    const data = extractSurfacesPageData({}, {});
    expect(data.surfaces.length).toBe(8);
    expect(data.surfaces[0].cssVar).toContain('--color-bg');
  });

  it('should return default borders when semantic tokens have no border keys', () => {
    const data = extractSurfacesPageData({}, {});
    expect(data.borders.length).toBe(5);
    expect(data.borders[0].cssVar).toContain('--color-border');
  });

  it('should return default radii when effects tokens have no radius keys', () => {
    const data = extractSurfacesPageData({}, {});
    expect(data.radii.length).toBe(6);
    expect(data.radii[0].cssVar).toContain('--radius');
  });

  it('should return default glass effects when effects tokens have no glass keys', () => {
    const data = extractSurfacesPageData({}, {});
    expect(data.glass.length).toBe(2);
    expect(data.glass[0].backdropBlur).toBeTruthy();
    expect(data.glass[0].css).toContain('backdrop-filter');
  });

  it('should extract surface tokens from semantic data with background keys', () => {
    const semanticTokens = {
      background: {
        base: { $value: '#fff', $type: 'color', $description: 'Base background' },
        elevated: { $value: '#fafafa', $type: 'color', $description: 'Elevated' },
      },
    };

    const data = extractSurfacesPageData(semanticTokens, {});
    expect(data.surfaces.length).toBe(2);
    expect(data.surfaces[0].name).toBe('Background Base');
    expect(data.surfaces[0].cssVar).toBe('--color-background-base');
    expect(data.surfaces[0].value).toBe('#fff');
    expect(data.surfaces[0].description).toBe('Base background');
  });

  it('should extract surface tokens from flat $value entries', () => {
    const semanticTokens = {
      'bg-base': {
        $value: '#ffffff',
        $type: 'color',
        $description: 'Page background',
      },
    };

    const data = extractSurfacesPageData(semanticTokens, {});
    expect(data.surfaces.length).toBe(1);
    expect(data.surfaces[0].value).toBe('#ffffff');
  });

  it('should extract border tokens from semantic data', () => {
    const semanticTokens = {
      border: {
        default: { $value: '#e5e7eb', $type: 'color', $description: 'Default border' },
        focus: { $value: '#3b82f6', $type: 'color', $description: 'Focus border' },
      },
    };

    const data = extractSurfacesPageData(semanticTokens, {});
    expect(data.borders.length).toBe(2);
    expect(data.borders[0].name).toBe('Border Default');
    expect(data.borders[0].cssVar).toBe('--color-border-default');
    expect(data.borders[1].value).toBe('#3b82f6');
  });

  it('should extract radius tokens from effects data', () => {
    const effectsTokens = {
      radius: {
        sm: { $value: '4px', $type: 'dimension', $description: 'Small radius' },
        md: { $value: '0.5rem', $type: 'dimension', $description: 'Medium radius' },
        full: { $value: '9999px', $type: 'dimension', $description: 'Full round' },
      },
    };

    const data = extractSurfacesPageData({}, effectsTokens);
    expect(data.radii.length).toBe(3);
    expect(data.radii[0].name).toBe('Radius Sm');
    expect(data.radii[0].cssVar).toBe('--radius-sm');
    expect(data.radii[0].value).toBe('4px');
    expect(data.radii[0].pixels).toBe('4px');
    expect(data.radii[1].pixels).toBe('8px'); // 0.5rem * 16
  });

  it('should extract glass effects from effects data', () => {
    const effectsTokens = {
      glass: {
        $value: '12px',
        $type: 'dimension',
        $description: 'Glass blur',
      },
    };

    const data = extractSurfacesPageData({}, effectsTokens);
    expect(data.glass.length).toBe(1);
    expect(data.glass[0].backdropBlur).toBe('12px');
    expect(data.glass[0].css).toContain('blur(12px)');
  });

  it('should produce valid SurfacesPageData structure', () => {
    const data = extractSurfacesPageData({}, {});
    expect(data).toHaveProperty('surfaces');
    expect(data).toHaveProperty('borders');
    expect(data).toHaveProperty('radii');
    expect(data).toHaveProperty('glass');
    expect(Array.isArray(data.surfaces)).toBe(true);
    expect(Array.isArray(data.borders)).toBe(true);
    expect(Array.isArray(data.radii)).toBe(true);
    expect(Array.isArray(data.glass)).toBe(true);
  });

  it('each surface token should have name, cssVar, value, and description', () => {
    const data = extractSurfacesPageData({}, {});
    for (const token of data.surfaces) {
      expect(token.name).toBeTruthy();
      expect(token.cssVar).toBeTruthy();
      expect(token.value).toBeTruthy();
      expect(typeof token.description).toBe('string');
    }
  });

  it('each border token should have name, cssVar, value, and description', () => {
    const data = extractSurfacesPageData({}, {});
    for (const token of data.borders) {
      expect(token.name).toBeTruthy();
      expect(token.cssVar).toBeTruthy();
      expect(token.value).toBeTruthy();
      expect(typeof token.description).toBe('string');
    }
  });

  it('each radius token should have name, cssVar, value, and pixels', () => {
    const data = extractSurfacesPageData({}, {});
    for (const token of data.radii) {
      expect(token.name).toBeTruthy();
      expect(token.cssVar).toBeTruthy();
      expect(token.value).toBeTruthy();
      expect(token.pixels).toBeTruthy();
    }
  });

  it('each glass effect should have name, backdropBlur, bgOpacity, and css', () => {
    const data = extractSurfacesPageData({}, {});
    for (const effect of data.glass) {
      expect(effect.name).toBeTruthy();
      expect(effect.backdropBlur).toBeTruthy();
      expect(effect.bgOpacity).toBeTruthy();
      expect(effect.css).toContain('backdrop-filter');
    }
  });

  it('should convert rem values to pixel equivalents', () => {
    const effectsTokens = {
      borderRadius: {
        lg: { $value: '1rem', $type: 'dimension' },
      },
    };

    const data = extractSurfacesPageData({}, effectsTokens);
    expect(data.radii.length).toBe(1);
    expect(data.radii[0].pixels).toBe('16px');
  });
});

describe('BRAND_BOOK_PAGES includes surfaces', () => {
  it('should include surfaces page entry', () => {
    const surfacesPage = BRAND_BOOK_PAGES.find((p) => p.slug === 'surfaces');
    expect(surfacesPage).toBeDefined();
    expect(surfacesPage!.title).toBe('Surfaces & Borders');
    expect(surfacesPage!.template).toBe('surfaces');
  });
});

describe('Surfaces template rendering (integration)', () => {
  const tmpDir = path.join(os.tmpdir(), `bss-test-surfaces-${Date.now()}`);
  const outputDir = path.join(tmpDir, 'output');
  const tokenDir = path.join(tmpDir, 'tokens');

  beforeAll(() => {
    // Create token structure
    fs.mkdirSync(path.join(tokenDir, 'primitive'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'semantic'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'component'), { recursive: true });

    // Write minimal token files needed for brand book generation
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
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'spacing.json'),
      JSON.stringify({
        spacing: {
          '1': { $value: '8px', $type: 'dimension', $description: '8px' },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'effects.json'),
      JSON.stringify({
        motion: {
          duration: {
            fast: { $value: '100ms', $type: 'duration', $description: 'Fast' },
          },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'semantic', 'colors.json'),
      JSON.stringify({
        success: {
          '500': { $value: '#008229', $type: 'color', $description: 'success 500' },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'typography-meta.json'),
      JSON.stringify({ embedTag: '' }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'grid.config.json'),
      JSON.stringify({ baseUnit: 8, maxWidth: 1280, breakpoints: { sm: 640 } }),
      'utf-8'
    );
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should generate surfaces.html in output', async () => {
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
      clientSlug: 'test-surfaces',
      outputDir,
      tokenDir,
      brandConfig,
    });

    const surfacesHtml = path.join(result, 'surfaces.html');
    expect(fs.existsSync(surfacesHtml)).toBe(true);
  });

  it('should contain surface token sections', async () => {
    const brandBookDir = path.join(outputDir, 'test-surfaces', 'brand-book');
    const html = fs.readFileSync(path.join(brandBookDir, 'surfaces.html'), 'utf-8');

    // Should have the page heading (Eta autoEscape: false, so & is not escaped)
    expect(html).toContain('Surfaces & Borders');

    // Should have surface tokens section
    expect(html).toContain('Surface Tokens');

    // Should have CSS variable references
    expect(html).toContain('--color-bg');

    // Should have code snippets
    expect(html).toContain('var(--color-bg');
  });

  it('should contain border token sections', async () => {
    const brandBookDir = path.join(outputDir, 'test-surfaces', 'brand-book');
    const html = fs.readFileSync(path.join(brandBookDir, 'surfaces.html'), 'utf-8');

    expect(html).toContain('Border Tokens');
    expect(html).toContain('--color-border');
  });

  it('should contain radius token sections', async () => {
    const brandBookDir = path.join(outputDir, 'test-surfaces', 'brand-book');
    const html = fs.readFileSync(path.join(brandBookDir, 'surfaces.html'), 'utf-8');

    expect(html).toContain('Radius Tokens');
    expect(html).toContain('--radius');
  });

  it('should contain glass effects section', async () => {
    const brandBookDir = path.join(outputDir, 'test-surfaces', 'brand-book');
    const html = fs.readFileSync(path.join(brandBookDir, 'surfaces.html'), 'utf-8');

    expect(html).toContain('Glass Effects');
    expect(html).toContain('backdrop-filter');
  });

  it('should have responsive grid CSS in style.css', async () => {
    const brandBookDir = path.join(outputDir, 'test-surfaces', 'brand-book');
    const css = fs.readFileSync(path.join(brandBookDir, 'assets', 'style.css'), 'utf-8');

    expect(css).toContain('.token-grid');
    expect(css).toContain('.token-grid--3col');
    expect(css).toContain('grid-template-columns: repeat(3, 1fr)');
    // Responsive: 1-col on mobile
    expect(css).toContain('.token-grid--3col { grid-template-columns: 1fr; }');
  });

  it('should include surfaces in search index', async () => {
    const brandBookDir = path.join(outputDir, 'test-surfaces', 'brand-book');
    const searchIndex = JSON.parse(
      fs.readFileSync(path.join(brandBookDir, 'assets', 'search-index.json'), 'utf-8')
    );

    const surfacesEntry = searchIndex.find((e: Record<string, unknown>) => e.section === 'surfaces');
    expect(surfacesEntry).toBeDefined();
    expect(surfacesEntry.title).toBe('Surfaces & Borders');
    expect(surfacesEntry.content.length).toBeGreaterThan(0);
  });
});
