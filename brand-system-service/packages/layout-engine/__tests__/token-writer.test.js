'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { writeLayoutTokens } = require('../src/token-writer');

describe('token-writer', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'token-writer-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('writes layout.json to correct path', () => {
    const tokens = { layout: { family: { name: { $value: 'ethereal' } } } };
    const result = writeLayoutTokens(tmpDir, tokens);

    expect(result).toBe(true);
    const outputPath = path.join(tmpDir, 'layout', 'layout.json');
    expect(fs.existsSync(outputPath)).toBe(true);

    const written = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    expect(written).toEqual(tokens);
  });

  it('creates layout/ directory if missing', () => {
    const layoutDir = path.join(tmpDir, 'layout');
    expect(fs.existsSync(layoutDir)).toBe(false);

    writeLayoutTokens(tmpDir, { some: 'data' });

    expect(fs.existsSync(layoutDir)).toBe(true);
  });

  it('returns false when tokens is null', () => {
    const result = writeLayoutTokens(tmpDir, null);
    expect(result).toBe(false);

    const layoutDir = path.join(tmpDir, 'layout');
    expect(fs.existsSync(layoutDir)).toBe(false);
  });

  it('returns false when tokens is undefined', () => {
    const result = writeLayoutTokens(tmpDir, undefined);
    expect(result).toBe(false);
  });

  it('written JSON is valid and parseable', () => {
    const tokens = {
      layout: {
        corner: { radiusBase: { $value: '24px', $type: 'dimension', $description: 'Base radius' } },
        whitespace: { density: { $value: 'spacious', $type: 'string', $description: 'Density' } },
      },
    };
    writeLayoutTokens(tmpDir, tokens);

    const outputPath = path.join(tmpDir, 'layout', 'layout.json');
    const raw = fs.readFileSync(outputPath, 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed).toEqual(tokens);
    // Verify pretty-printed (2-space indent)
    expect(raw).toContain('  "layout"');
  });

  it('overwrites existing file', () => {
    const tokens1 = { version: 1 };
    const tokens2 = { version: 2 };

    writeLayoutTokens(tmpDir, tokens1);
    writeLayoutTokens(tmpDir, tokens2);

    const outputPath = path.join(tmpDir, 'layout', 'layout.json');
    const written = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    expect(written).toEqual(tokens2);
  });

  it('handles deeply nested token directories', () => {
    const deepDir = path.join(tmpDir, 'brands', 'test-brand', 'tokens');
    const tokens = { layout: {} };
    const result = writeLayoutTokens(deepDir, tokens);

    expect(result).toBe(true);
    const outputPath = path.join(deepDir, 'layout', 'layout.json');
    expect(fs.existsSync(outputPath)).toBe(true);
  });
});
