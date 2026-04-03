/**
 * PDL-7: Build Pipeline Layout Injection Tests
 *
 * Tests for layout brief consumption, template rendering with layout data,
 * backward compatibility, and nav partial rendering.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createLogger } from '@bss/core';
import { runBuildPipeline } from '../build-pipeline';
import type { GeneratorOptions } from '../static-generator';

const logger = createLogger('BuildPipelineLayoutTest', false);

/**
 * Helper to create a token directory for a test client.
 */
function createTokenDir(baseDir: string, clientId: string): void {
  const tokenDir = path.join(baseDir, 'data', 'tokens', clientId);
  fs.mkdirSync(path.join(tokenDir, 'primitive'), { recursive: true });
  fs.mkdirSync(path.join(tokenDir, 'semantic'), { recursive: true });

  fs.writeFileSync(
    path.join(tokenDir, 'primitive', 'colors.json'),
    JSON.stringify({
      color: {
        primary: {
          '500': { $value: '#7631e5', $type: 'color', $description: 'primary' },
        },
        neutral: {
          '50': { $value: '#f8f9fa', $type: 'color', $description: 'neutral 50' },
          '100': { $value: '#f5f5f5', $type: 'color', $description: 'neutral 100' },
          '200': { $value: '#e5e7eb', $type: 'color', $description: 'neutral 200' },
        },
      },
    }),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(tokenDir, 'primitive', 'typography.json'),
    JSON.stringify({
      fontSize: { base: { $value: '16px', $type: 'dimension', $description: 'base' } },
    }),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(tokenDir, 'primitive', 'spacing.json'),
    JSON.stringify({
      spacing: { '1': { $value: '8px', $type: 'dimension', $description: '8px' } },
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
}

describe('PDL-7: Layout Brief Consumption (AC-1)', () => {
  let tmpDir: string;
  let outputDir: string;
  let originalEnv: string | undefined;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bss-pdl7-ac1-'));
    outputDir = path.join(tmpDir, 'dist');
    createTokenDir(tmpDir, 'layout-test-client');
    originalEnv = process.env['BSS_TOKENS_PATH'];
    process.env['BSS_TOKENS_PATH'] = path.join(tmpDir, 'data', 'tokens');
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env['BSS_TOKENS_PATH'];
    } else {
      process.env['BSS_TOKENS_PATH'] = originalEnv;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should pass layout data to Nunjucks template context when layout is provided', async () => {
    const options: GeneratorOptions = {
      clientId: 'layout-test-client',
      type: 'landing-page',
      outputDir,
      templateData: {
        layout: {
          family: 'ethereal',
          nav: { style: 'centered-top' },
          whitespace: { density: 'spacious', multiplier: 1.5, sectionGap: '96px', contentPadding: '80px' },
          corners: { radiusBase: '24px' },
          dividers: { style: 'organic-wave' },
          animation: { entrance: 'fade-up', duration: '300ms' },
          grid: { rhythm: 'centered-single', maxWidth: '800px' },
          sections: { background: 'soft-fill' },
        },
      },
    };

    await runBuildPipeline(options, logger);

    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    expect(html).toContain('layout-family--ethereal');
  });

  it('should render centered-top nav partial for ethereal layout', async () => {
    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    expect(html).toContain('layout-nav--centered-top');
    expect(html).not.toContain('layout-nav--sidebar-fixed');
  });
});

describe('PDL-7: Conversion Architecture Preserved (AC-2)', () => {
  let tmpDir: string;
  let outputDir: string;
  let originalEnv: string | undefined;
  let html: string;

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bss-pdl7-ac2-'));
    outputDir = path.join(tmpDir, 'dist');
    createTokenDir(tmpDir, 'conv-arch-client');
    originalEnv = process.env['BSS_TOKENS_PATH'];
    process.env['BSS_TOKENS_PATH'] = path.join(tmpDir, 'data', 'tokens');

    const options: GeneratorOptions = {
      clientId: 'conv-arch-client',
      type: 'landing-page',
      outputDir,
      templateData: {
        layout: {
          family: 'playful-dynamic',
          nav: { style: 'floating-pill' },
        },
      },
    };

    await runBuildPipeline(options, logger);
    html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env['BSS_TOKENS_PATH'];
    } else {
      process.env['BSS_TOKENS_PATH'] = originalEnv;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should include Hero section', () => {
    expect(html).toContain('class="hero"');
  });

  it('should include Problem section', () => {
    expect(html).toContain('class="problem');
  });

  it('should include Solution section', () => {
    expect(html).toContain('class="solution');
  });

  it('should include How It Works section', () => {
    expect(html).toContain('how-it-works');
  });

  it('should include Social Proof section', () => {
    expect(html).toContain('social-proof');
  });

  it('should include FAQ section', () => {
    expect(html).toContain('faq');
  });

  it('should include Final CTA section', () => {
    expect(html).toContain('final-cta');
  });

  it('should use playful-dynamic layout family class', () => {
    expect(html).toContain('layout-family--playful-dynamic');
  });
});

describe('PDL-7: Visual Variation per Nav Style (AC-3, AC-5)', () => {
  let tmpDir: string;
  let originalEnv: string | undefined;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bss-pdl7-nav-'));
    createTokenDir(tmpDir, 'nav-test-client');
    originalEnv = process.env['BSS_TOKENS_PATH'];
    process.env['BSS_TOKENS_PATH'] = path.join(tmpDir, 'data', 'tokens');
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env['BSS_TOKENS_PATH'];
    } else {
      process.env['BSS_TOKENS_PATH'] = originalEnv;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const navStyles = [
    { style: 'centered-top', family: 'ethereal', cssClass: 'layout-nav--centered-top' },
    { style: 'sidebar-fixed', family: 'bold-structured', cssClass: 'layout-nav--sidebar-fixed' },
    { style: 'breadcrumb-horizontal', family: 'warm-artisan', cssClass: 'layout-nav--breadcrumb-horizontal' },
    { style: 'sticky-minimal', family: 'adventurous-open', cssClass: 'layout-nav--sticky-minimal' },
    { style: 'floating-pill', family: 'playful-dynamic', cssClass: 'layout-nav--floating-pill' },
    { style: 'inline-minimal', family: 'rebel-edge', cssClass: 'layout-nav--inline-minimal' },
  ];

  for (const { style, family, cssClass } of navStyles) {
    it(`should render ${style} nav partial for ${family} family`, async () => {
      const outputDir = path.join(tmpDir, `dist-${style}`);

      const options: GeneratorOptions = {
        clientId: 'nav-test-client',
        type: 'landing-page',
        outputDir,
        templateData: {
          layout: {
            family,
            nav: { style },
          },
        },
      };

      await runBuildPipeline(options, logger);

      const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
      expect(html).toContain(cssClass);
      expect(html).toContain(`layout-family--${family}`);
    });
  }
});

describe('PDL-7: Backward Compatibility (AC-7)', () => {
  let tmpDir: string;
  let outputDir: string;
  let originalEnv: string | undefined;

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bss-pdl7-compat-'));
    outputDir = path.join(tmpDir, 'dist');
    createTokenDir(tmpDir, 'compat-client');
    originalEnv = process.env['BSS_TOKENS_PATH'];
    process.env['BSS_TOKENS_PATH'] = path.join(tmpDir, 'data', 'tokens');
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env['BSS_TOKENS_PATH'];
    } else {
      process.env['BSS_TOKENS_PATH'] = originalEnv;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should use bold-structured default when no layout brief is provided', async () => {
    const options: GeneratorOptions = {
      clientId: 'compat-client',
      type: 'landing-page',
      outputDir,
      // No templateData.layout — backward compat scenario
    };

    await runBuildPipeline(options, logger);

    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    // Default: sidebar-fixed nav, bold-structured family
    expect(html).toContain('layout-family--bold-structured');
    expect(html).toContain('layout-nav--sidebar-fixed');
  });

  it('should produce valid HTML with all required sections even without layout', async () => {
    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('class="hero"');
    expect(html).toContain('role="main"');
    expect(html).toContain('</html>');
  });
});

describe('PDL-7: CSS Custom Properties (AC-6)', () => {
  let tmpDir: string;
  let outputDir: string;
  let originalEnv: string | undefined;

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bss-pdl7-css-'));
    outputDir = path.join(tmpDir, 'dist');
    createTokenDir(tmpDir, 'css-test-client');
    originalEnv = process.env['BSS_TOKENS_PATH'];
    process.env['BSS_TOKENS_PATH'] = path.join(tmpDir, 'data', 'tokens');

    const options: GeneratorOptions = {
      clientId: 'css-test-client',
      type: 'landing-page',
      outputDir,
    };

    await runBuildPipeline(options, logger);
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env['BSS_TOKENS_PATH'];
    } else {
      process.env['BSS_TOKENS_PATH'] = originalEnv;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should include --layout-* custom properties in bundled CSS', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('--layout-corner-radius');
    expect(css).toContain('--layout-grid-max-width');
    expect(css).toContain('--layout-animation-duration');
  });

  it('should include layout-family CSS modifier classes', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('layout-family--ethereal');
    expect(css).toContain('layout-family--bold-structured');
    expect(css).toContain('layout-family--playful-dynamic');
    expect(css).toContain('layout-family--rebel-edge');
  });

  it('should include layout nav CSS classes', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('layout-nav--centered-top');
    expect(css).toContain('layout-nav--sidebar-fixed');
    expect(css).toContain('layout-nav--floating-pill');
  });

  it('should include animation keyframes', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('layout-fade-up');
    expect(css).toContain('layout-slide-in');
    expect(css).toContain('layout-bounce-in');
  });

  it('should include prefers-reduced-motion media query', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('prefers-reduced-motion');
  });
});

describe('PDL-7: Responsive Rendering (AC-8)', () => {
  let tmpDir: string;
  let outputDir: string;
  let originalEnv: string | undefined;

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bss-pdl7-resp-'));
    outputDir = path.join(tmpDir, 'dist');
    createTokenDir(tmpDir, 'resp-client');
    originalEnv = process.env['BSS_TOKENS_PATH'];
    process.env['BSS_TOKENS_PATH'] = path.join(tmpDir, 'data', 'tokens');

    const options: GeneratorOptions = {
      clientId: 'resp-client',
      type: 'landing-page',
      outputDir,
    };

    await runBuildPipeline(options, logger);
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env['BSS_TOKENS_PATH'];
    } else {
      process.env['BSS_TOKENS_PATH'] = originalEnv;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should include mobile breakpoint (max-width: 767px)', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('767px');
  });

  it('should include tablet breakpoint (min-width: 768px)', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('768px');
  });

  it('should include desktop breakpoint (min-width: 1440px)', () => {
    const css = fs.readFileSync(path.join(outputDir, 'styles.min.css'), 'utf-8');
    expect(css).toContain('1440px');
  });

  it('should use viewport meta tag in HTML', () => {
    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    expect(html).toContain('viewport');
    expect(html).toContain('width=device-width');
  });
});
