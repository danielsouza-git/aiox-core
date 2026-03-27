import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  StaticGenerator,
  BRAND_BOOK_PAGES,
  type BrandConfig,
} from '../static-generator';
import { findNavItem, buildNavigationTree } from '../navigation/nav-tree';

describe('About page — BRAND_BOOK_PAGES registration', () => {
  it('should include about in BRAND_BOOK_PAGES', () => {
    const aboutPage = BRAND_BOOK_PAGES.find((p) => p.slug === 'about');
    expect(aboutPage).toBeDefined();
    expect(aboutPage!.title).toBe('About');
    expect(aboutPage!.template).toBe('about');
  });

  it('should have about as the last page in the array', () => {
    const lastPage = BRAND_BOOK_PAGES[BRAND_BOOK_PAGES.length - 1];
    expect(lastPage.slug).toBe('about');
  });
});

describe('About page — Navigation integration', () => {
  it('should have about as a non-placeholder item in nav tree', () => {
    const navItem = findNavItem('about');
    expect(navItem).toBeDefined();
    expect(navItem!.slug).toBe('about');
    expect(navItem!.placeholder).toBeFalsy();
    expect(navItem!.path).toBe('./about.html');
  });

  it('should be in the about section of the nav tree', () => {
    const tree = buildNavigationTree();
    const aboutSection = tree.find((s) => s.id === 'about');
    expect(aboutSection).toBeDefined();
    expect(aboutSection!.children).toHaveLength(1);
    expect(aboutSection!.children[0].slug).toBe('about');
  });
});

describe('About page — HTML generation (integration)', () => {
  const tmpDir = path.join(os.tmpdir(), `bss-test-about-${Date.now()}`);
  const outputDir = path.join(tmpDir, 'output');
  const tokenDir = path.join(tmpDir, 'tokens');

  const brandConfig: BrandConfig = {
    clientName: 'TestAbout',
    primaryColor: '#3B82F6',
    logoPath: 'logo.svg',
    tagline: 'Testing the about page',
    websiteUrl: 'https://testabout.com',
    brandBookTitle: 'TestAbout Brand Book',
  };

  let brandBookDir: string;
  let aboutHtml: string;

  beforeAll(async () => {
    // Create token directory structure
    fs.mkdirSync(path.join(tokenDir, 'primitive'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'semantic'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'component'), { recursive: true });

    // Write minimal token files
    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'colors.json'),
      JSON.stringify({
        color: {
          primary: {
            '500': { $value: '#3B82F6', $type: 'color', $description: 'primary 500' },
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
          '0': { $value: '0', $type: 'dimension', $description: 'No spacing' },
        },
      }),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'primitive', 'effects.json'),
      JSON.stringify({}),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'semantic', 'colors.json'),
      JSON.stringify({}),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'typography-meta.json'),
      JSON.stringify({}),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(tokenDir, 'grid.config.json'),
      JSON.stringify({}),
      'utf-8'
    );

    // Generate brand book
    const generator = new StaticGenerator(false);
    const result = await generator.generateBrandBook({
      clientSlug: 'test-about',
      outputDir,
      tokenDir,
      brandConfig,
    });

    brandBookDir = result;
    aboutHtml = fs.readFileSync(path.join(brandBookDir, 'about.html'), 'utf-8');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should generate about.html in the output directory', () => {
    const filePath = path.join(brandBookDir, 'about.html');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should contain the brand name in the overview section', () => {
    expect(aboutHtml).toContain('TestAbout');
  });

  it('should contain the tagline in the overview section', () => {
    expect(aboutHtml).toContain('Testing the about page');
  });

  it('should contain the website URL', () => {
    expect(aboutHtml).toContain('https://testabout.com');
  });

  it('should contain the brand book title', () => {
    expect(aboutHtml).toContain('TestAbout Brand Book');
  });

  it('should have the page title in the HTML head', () => {
    expect(aboutHtml).toContain('<title>About - TestAbout Brand Book</title>');
  });

  it('should render the tech stack section with BSS tools', () => {
    expect(aboutHtml).toContain('Technology Stack');
    expect(aboutHtml).toContain('Style Dictionary');
    expect(aboutHtml).toContain('Eta Templates');
    expect(aboutHtml).toContain('OKLCH Color Engine');
    expect(aboutHtml).toContain('Puppeteer');
    expect(aboutHtml).toContain('LightningCSS');
    expect(aboutHtml).toContain('Fuse.js');
    expect(aboutHtml).toContain('esbuild');
    expect(aboutHtml).toContain('WCAG 2.1 AA');
  });

  it('should render the timeline section with 5 phases', () => {
    expect(aboutHtml).toContain('System Evolution');
    expect(aboutHtml).toContain('Brand Identity');
    expect(aboutHtml).toContain('Design Foundations');
    expect(aboutHtml).toContain('UI Components');
    expect(aboutHtml).toContain('Showcase');
    expect(aboutHtml).toContain('Final Edition');

    // Verify 5 timeline markers exist
    const markerCount = (aboutHtml.match(/timeline__marker/g) || []).length;
    expect(markerCount).toBe(5);
  });

  it('should render the team placeholder section', () => {
    expect(aboutHtml).toContain('Team');
    expect(aboutHtml).toContain('about-team__placeholder');
    expect(aboutHtml).toContain('Team member information can be added here');
  });

  it('should include the layout wrapper (sidebar, header, footer)', () => {
    expect(aboutHtml).toContain('<aside class="sidebar"');
    expect(aboutHtml).toContain('<main class="main-content"');
    expect(aboutHtml).toContain('<footer');
    expect(aboutHtml).toContain('Generated by Brand System Service');
  });

  it('should include navigation with link to about page', () => {
    expect(aboutHtml).toContain('about.html');
    expect(aboutHtml).toContain('About');
  });

  it('should use semantic HTML with section and headings', () => {
    expect(aboutHtml).toContain('<section');
    expect(aboutHtml).toContain('aria-labelledby="about-title"');
    expect(aboutHtml).toContain('<h1 id="about-title"');
    expect(aboutHtml).toContain('<h2>');
  });

  it('should use only relative paths (file:// compatible)', () => {
    const absoluteUrls = aboutHtml.match(/https?:\/\/[^\s"'<>]+/g) || [];
    const disallowed = absoluteUrls.filter(
      (url) =>
        !url.includes('fonts.googleapis.com') &&
        !url.includes('fonts.gstatic.com') &&
        !url.includes('cdn.jsdelivr.net') &&
        !url.includes('testabout.com') &&
        !url.includes('w3.org') &&
        !url.includes('schema.org')
    );
    expect(disallowed).toHaveLength(0);
  });

  it('should include about page CSS styles in style.css', () => {
    const cssPath = path.join(brandBookDir, 'assets', 'style.css');
    const css = fs.readFileSync(cssPath, 'utf-8');

    expect(css).toContain('.about-overview__card');
    expect(css).toContain('.about-detail');
    expect(css).toContain('.tech-stack-grid');
    expect(css).toContain('.tech-stack-item');
    expect(css).toContain('.timeline');
    expect(css).toContain('.timeline__marker');
    expect(css).toContain('.timeline__item--complete');
    expect(css).toContain('.timeline__item--active');
    expect(css).toContain('.about-team__placeholder');
  });

  it('should include about in the search index', () => {
    const searchIndexPath = path.join(brandBookDir, 'assets', 'search-index.json');
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8'));
    const aboutEntry = searchIndex.find((e: { section: string }) => e.section === 'about');

    expect(aboutEntry).toBeDefined();
    expect(aboutEntry.title).toBe('About');
    expect(aboutEntry.content).toContain('TestAbout');
  });
});

describe('About page — Minimal brand config (no optional fields)', () => {
  const tmpDir = path.join(os.tmpdir(), `bss-test-about-minimal-${Date.now()}`);
  const outputDir = path.join(tmpDir, 'output');
  const tokenDir = path.join(tmpDir, 'tokens');

  const brandConfig: BrandConfig = {
    clientName: 'MinimalBrand',
    primaryColor: '#000000',
    logoPath: 'logo.svg',
    tagline: '',
    websiteUrl: '',
  };

  let aboutHtml: string;

  beforeAll(async () => {
    fs.mkdirSync(path.join(tokenDir, 'primitive'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'semantic'), { recursive: true });
    fs.mkdirSync(path.join(tokenDir, 'component'), { recursive: true });

    // Write minimal token files
    const emptyJson = JSON.stringify({});
    fs.writeFileSync(path.join(tokenDir, 'primitive', 'colors.json'), emptyJson, 'utf-8');
    fs.writeFileSync(path.join(tokenDir, 'primitive', 'typography.json'), emptyJson, 'utf-8');
    fs.writeFileSync(path.join(tokenDir, 'primitive', 'spacing.json'), emptyJson, 'utf-8');
    fs.writeFileSync(path.join(tokenDir, 'primitive', 'effects.json'), emptyJson, 'utf-8');
    fs.writeFileSync(path.join(tokenDir, 'semantic', 'colors.json'), emptyJson, 'utf-8');
    fs.writeFileSync(path.join(tokenDir, 'typography-meta.json'), emptyJson, 'utf-8');
    fs.writeFileSync(path.join(tokenDir, 'grid.config.json'), emptyJson, 'utf-8');

    const generator = new StaticGenerator(false);
    const result = await generator.generateBrandBook({
      clientSlug: 'minimal',
      outputDir,
      tokenDir,
      brandConfig,
    });

    aboutHtml = fs.readFileSync(path.join(result, 'about.html'), 'utf-8');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should render without errors when tagline is empty', () => {
    expect(aboutHtml).toContain('MinimalBrand');
    expect(aboutHtml).not.toContain('Tagline');
  });

  it('should render without errors when websiteUrl is empty', () => {
    expect(aboutHtml).not.toContain('Website');
    expect(aboutHtml).not.toContain('href=""');
  });

  it('should still render tech stack and timeline with minimal config', () => {
    expect(aboutHtml).toContain('Technology Stack');
    expect(aboutHtml).toContain('System Evolution');
    expect(aboutHtml).toContain('Team');
  });
});
