'use strict';

/**
 * PDL Workflow Integration Tests
 *
 * Validates that brand-book-delivery.yaml, full-brand-pipeline.yaml,
 * and brand-pipeline/config.yaml have correct PDL phase configuration:
 * ordering, agent assignments, data flow, and feature flag gating.
 *
 * Zero external dependencies -- YAML parsed via string/regex matching.
 */

const fs = require('fs');
const path = require('path');

// Paths relative to the monorepo root (aios-core/)
const ROOT = path.resolve(__dirname, '../../../../..');
const BRAND_BOOK_DELIVERY = path.join(ROOT, 'squads/branding/workflows/brand-book-delivery.yaml');
const FULL_BRAND_PIPELINE = path.join(ROOT, 'squads/brand-pipeline/workflows/full-brand-pipeline.yaml');
const PIPELINE_CONFIG = path.join(ROOT, 'squads/brand-pipeline/config.yaml');

/**
 * Minimal YAML step/phase parser.
 * Extracts top-level list items under a given key (e.g. 'steps:' or 'phases:').
 * Returns an array of objects with id, name, agent, feature_flag, depends_on,
 * depends_on_mode, inputs, outputs fields (all optional).
 */
function parseYamlListItems(content, sectionKey) {
  const lines = content.split('\n');
  let inSection = false;
  let sectionIndent = -1;
  const items = [];
  let currentItem = null;
  let currentField = null;
  let currentFieldIndent = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trimStart();
    const indent = line.length - stripped.length;

    // Detect section start
    if (stripped.startsWith(sectionKey + ':') || stripped === sectionKey + ':') {
      inSection = true;
      sectionIndent = indent;
      continue;
    }

    if (!inSection) continue;

    // Detect section end (another top-level key at same or lower indent)
    if (indent <= sectionIndent && stripped.length > 0 && !stripped.startsWith('#') && !stripped.startsWith('-')) {
      // Check if this is a new top-level key (not a continuation)
      if (stripped.match(/^[a-zA-Z_]/)) {
        break;
      }
    }

    // Skip comments and blank lines
    if (stripped.startsWith('#') || stripped.length === 0) continue;

    // Detect new list item (- id: ...)
    if (stripped.startsWith('- id:')) {
      if (currentItem) items.push(currentItem);
      currentItem = { id: stripped.replace('- id:', '').trim() };
      currentField = null;
      currentFieldIndent = -1;
      continue;
    }

    if (!currentItem) continue;

    // Detect sub-fields of current item
    const fieldMatch = stripped.match(/^(\w[\w_-]*):\s*(.*)/);
    if (fieldMatch && !stripped.startsWith('- ')) {
      const [, key, value] = fieldMatch;
      currentField = key;
      currentFieldIndent = indent;

      if (key === 'depends_on') {
        // Parse inline array [a, b, c]
        const arrMatch = value.match(/\[([^\]]*)\]/);
        if (arrMatch) {
          currentItem.depends_on = arrMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        }
        currentField = null;
      } else if (key === 'inputs' || key === 'outputs') {
        if (value.trim()) {
          // Inline value
          currentItem[key] = [value.trim()];
        } else {
          // Multi-line list follows
          currentItem[key] = [];
        }
      } else if (value.trim()) {
        currentItem[key] = value.trim().replace(/^["']|["']$/g, '');
      }
      continue;
    }

    // Detect list items for inputs/outputs
    if (stripped.startsWith('- ') && currentField && (currentField === 'inputs' || currentField === 'outputs')) {
      if (!currentItem[currentField]) currentItem[currentField] = [];
      const val = stripped.replace(/^-\s*/, '').trim();
      // Skip comment-only lines
      if (!val.startsWith('#')) {
        currentItem[currentField].push(val);
      }
      continue;
    }

    // Detect list items for steps within phases
    if (stripped.startsWith('- id:') === false && stripped.startsWith('- ') && currentField === 'steps') {
      // nested steps -- skip for phase-level parsing
      continue;
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
}

/**
 * Parse nested phase items under 'pipeline:' -> 'phases:'.
 * Handles the two-level nesting in config.yaml.
 */
function parsePipelinePhases(content) {
  const lines = content.split('\n');
  let inPipeline = false;
  let inPhases = false;
  const items = [];
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trimStart();
    const indent = line.length - stripped.length;

    if (stripped === 'pipeline:' || stripped.startsWith('pipeline:')) {
      inPipeline = true;
      continue;
    }

    if (inPipeline && (stripped === 'phases:' || stripped.startsWith('phases:'))) {
      inPhases = true;
      continue;
    }

    if (!inPhases) continue;

    // End of phases section
    if (indent <= 2 && stripped.length > 0 && !stripped.startsWith('#') && !stripped.startsWith('-') && stripped.match(/^[a-zA-Z]/)) {
      break;
    }

    if (stripped.startsWith('#') || stripped.length === 0) continue;

    if (stripped.startsWith('- id:')) {
      if (currentItem) items.push(currentItem);
      currentItem = { id: stripped.replace('- id:', '').trim() };
      continue;
    }

    if (!currentItem) continue;

    const fieldMatch = stripped.match(/^(\w[\w_-]*):\s*(.*)/);
    if (fieldMatch) {
      const [, key, value] = fieldMatch;
      if (key === 'depends_on') {
        const arrMatch = value.match(/\[([^\]]*)\]/);
        if (arrMatch) {
          currentItem.depends_on = arrMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (value.trim()) {
        currentItem[key] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
}

// ============================================================
// Tests
// ============================================================

describe('PDL Workflow Integration', () => {
  let deliveryContent;
  let pipelineContent;
  let configContent;

  beforeAll(() => {
    deliveryContent = fs.readFileSync(BRAND_BOOK_DELIVERY, 'utf8');
    pipelineContent = fs.readFileSync(FULL_BRAND_PIPELINE, 'utf8');
    configContent = fs.readFileSync(PIPELINE_CONFIG, 'utf8');
  });

  // ----------------------------------------------------------
  // brand-book-delivery.yaml
  // ----------------------------------------------------------
  describe('brand-book-delivery.yaml', () => {
    let steps;

    beforeAll(() => {
      steps = parseYamlListItems(deliveryContent, 'steps');
    });

    it('has visual-reference-research step', () => {
      const step = steps.find(s => s.id === 'visual-reference-research');
      expect(step).toBeDefined();
      expect(step.name).toMatch(/Visual Reference Research/i);
    });

    it('has layout-brief step', () => {
      const step = steps.find(s => s.id === 'layout-brief');
      expect(step).toBeDefined();
      expect(step.name).toMatch(/Layout Brief/i);
    });

    it('visual-reference-research is assigned to competitive-analyst', () => {
      const step = steps.find(s => s.id === 'visual-reference-research');
      expect(step.agent).toBe('competitive-analyst');
    });

    it('layout-brief is assigned to architect', () => {
      const step = steps.find(s => s.id === 'layout-brief');
      expect(step.agent).toBe('architect');
    });

    it('visual-reference-research comes before layout-brief', () => {
      const vrIdx = steps.findIndex(s => s.id === 'visual-reference-research');
      const lbIdx = steps.findIndex(s => s.id === 'layout-brief');
      expect(vrIdx).toBeGreaterThanOrEqual(0);
      expect(lbIdx).toBeGreaterThan(vrIdx);
    });

    it('layout-brief comes before generate', () => {
      const lbIdx = steps.findIndex(s => s.id === 'layout-brief');
      const genIdx = steps.findIndex(s => s.id === 'generate');
      expect(lbIdx).toBeGreaterThanOrEqual(0);
      expect(genIdx).toBeGreaterThan(lbIdx);
    });

    it('enforces phase order: visual-reference-research -> layout-brief -> generate -> review', () => {
      const ids = steps.map(s => s.id);
      const vrIdx = ids.indexOf('visual-reference-research');
      const lbIdx = ids.indexOf('layout-brief');
      const genIdx = ids.indexOf('generate');
      const reviewIdx = ids.indexOf('review');

      expect(vrIdx).toBeLessThan(lbIdx);
      expect(lbIdx).toBeLessThan(genIdx);
      expect(genIdx).toBeLessThan(reviewIdx);
    });

    it('PDL steps have feature flag condition', () => {
      const vr = steps.find(s => s.id === 'visual-reference-research');
      const lb = steps.find(s => s.id === 'layout-brief');
      expect(vr.feature_flag).toBe('bss.personalityDrivenLayouts.enabled');
      expect(lb.feature_flag).toBe('bss.personalityDrivenLayouts.enabled');
    });

    it('layout-brief depends on visual-reference-research', () => {
      const lb = steps.find(s => s.id === 'layout-brief');
      expect(lb.depends_on).toContain('visual-reference-research');
    });

    it('generate depends on layout-brief with optional mode', () => {
      const gen = steps.find(s => s.id === 'generate');
      expect(gen.depends_on).toContain('layout-brief');
      expect(gen.depends_on_mode).toBe('optional');
    });

    it('data flow: visual-reference-research outputs visual-references.md', () => {
      const vr = steps.find(s => s.id === 'visual-reference-research');
      expect(vr.outputs).toContain('visual-references.md');
    });

    it('data flow: layout-brief inputs visual-references.md', () => {
      const lb = steps.find(s => s.id === 'layout-brief');
      expect(lb.inputs).toContain('visual-references.md');
    });

    it('data flow: visual-reference-research output matches layout-brief input', () => {
      const vr = steps.find(s => s.id === 'visual-reference-research');
      const lb = steps.find(s => s.id === 'layout-brief');
      const vrOutputs = vr.outputs || [];
      const lbInputs = lb.inputs || [];
      // visual-references.md must appear in both
      const shared = vrOutputs.filter(o => lbInputs.includes(o));
      expect(shared).toContain('visual-references.md');
    });
  });

  // ----------------------------------------------------------
  // full-brand-pipeline.yaml
  // ----------------------------------------------------------
  describe('full-brand-pipeline.yaml', () => {
    let phases;

    beforeAll(() => {
      phases = parseYamlListItems(pipelineContent, 'phases');
    });

    it('has visual-reference-research phase', () => {
      const phase = phases.find(p => p.id === 'visual-reference-research');
      expect(phase).toBeDefined();
      expect(phase.name).toMatch(/Visual Reference Research/i);
    });

    it('has layout-brief phase', () => {
      const phase = phases.find(p => p.id === 'layout-brief');
      expect(phase).toBeDefined();
      expect(phase.name).toMatch(/Layout Brief/i);
    });

    it('PDL phases are in correct order: discovery -> visual-reference-research -> layout-brief -> build phases', () => {
      const ids = phases.map(p => p.id);
      const discIdx = ids.indexOf('discovery');
      const vrIdx = ids.indexOf('visual-reference-research');
      const lbIdx = ids.indexOf('layout-brief');
      const dsIdx = ids.indexOf('design-system');

      expect(discIdx).toBeLessThan(vrIdx);
      expect(vrIdx).toBeLessThan(lbIdx);
      expect(lbIdx).toBeLessThan(dsIdx);
    });

    it('visual-reference-research depends on discovery', () => {
      const vr = phases.find(p => p.id === 'visual-reference-research');
      expect(vr.depends_on).toContain('discovery');
    });

    it('layout-brief depends on visual-reference-research', () => {
      const lb = phases.find(p => p.id === 'layout-brief');
      expect(lb.depends_on).toContain('visual-reference-research');
    });

    it('PDL phases have feature flag', () => {
      const vr = phases.find(p => p.id === 'visual-reference-research');
      const lb = phases.find(p => p.id === 'layout-brief');
      expect(vr.feature_flag).toBe('bss.personalityDrivenLayouts.enabled');
      expect(lb.feature_flag).toBe('bss.personalityDrivenLayouts.enabled');
    });

    it('build phases fall back to discovery when PDL disabled (any_completed mode)', () => {
      const buildPhases = ['design-system', 'visual', 'content'];
      for (const phaseId of buildPhases) {
        const phase = phases.find(p => p.id === phaseId);
        expect(phase.depends_on).toContain('layout-brief');
        expect(phase.depends_on).toContain('discovery');
        expect(phase.depends_on_mode).toBe('any_completed');
      }
    });

    it('visual-reference-research uses competitive-analyst agent in steps', () => {
      // Check that the phase steps include competitive-analyst
      const vrSection = pipelineContent.split(/- id: visual-reference-research/)[1];
      if (vrSection) {
        const nextPhaseIdx = vrSection.search(/\n  - id:/);
        const phaseBlock = nextPhaseIdx > -1 ? vrSection.substring(0, nextPhaseIdx) : vrSection;
        expect(phaseBlock).toMatch(/agent:\s*competitive-analyst/);
      }
    });

    it('PDL artifacts section includes visual_references and layout_brief', () => {
      expect(pipelineContent).toMatch(/pdl:\s*\[.*visual_references/);
      expect(pipelineContent).toMatch(/pdl:\s*\[.*layout_brief/);
    });
  });

  // ----------------------------------------------------------
  // brand-pipeline/config.yaml
  // ----------------------------------------------------------
  describe('brand-pipeline/config.yaml', () => {
    it('has bss.personalityDrivenLayouts.enabled set to true', () => {
      expect(configContent).toMatch(/personalityDrivenLayouts:/);
      expect(configContent).toMatch(/enabled:\s*true/);
    });

    it('has featureFlag reference', () => {
      expect(configContent).toMatch(/featureFlag:\s*["']?bss\.personalityDrivenLayouts\.enabled["']?/);
    });

    it('lists PDL phases in config', () => {
      expect(configContent).toMatch(/visual-reference-research/);
      expect(configContent).toMatch(/layout-brief/);
    });

    it('pipeline phases include PDL phases with feature flag', () => {
      const phases = parsePipelinePhases(configContent);
      const vr = phases.find(p => p.id === 'visual-reference-research');
      const lb = phases.find(p => p.id === 'layout-brief');

      expect(vr).toBeDefined();
      expect(vr.feature_flag).toBe('bss.personalityDrivenLayouts.enabled');

      expect(lb).toBeDefined();
      expect(lb.feature_flag).toBe('bss.personalityDrivenLayouts.enabled');
    });

    it('PDL phases ordered between discovery and build phases', () => {
      const phases = parsePipelinePhases(configContent);
      const disc = phases.find(p => p.id === 'discovery');
      const vr = phases.find(p => p.id === 'visual-reference-research');
      const lb = phases.find(p => p.id === 'layout-brief');

      expect(parseFloat(vr.order)).toBeGreaterThan(parseFloat(disc.order));
      expect(parseFloat(lb.order)).toBeGreaterThan(parseFloat(vr.order));
    });

    it('describes fallback behavior when PDL is disabled', () => {
      expect(configContent).toMatch(/fallback/i);
      expect(configContent).toMatch(/backward.?compat/i);
    });
  });

  // ----------------------------------------------------------
  // Cross-file consistency
  // ----------------------------------------------------------
  describe('cross-file consistency', () => {
    it('both workflow YAMLs use the same feature flag key', () => {
      const deliveryFlag = deliveryContent.match(/feature_flag:\s*(\S+)/g);
      const pipelineFlag = pipelineContent.match(/feature_flag:\s*(\S+)/g);

      // All flags should be bss.personalityDrivenLayouts.enabled
      const extractFlag = (match) => match.replace('feature_flag:', '').trim();

      for (const flag of deliveryFlag) {
        expect(extractFlag(flag)).toBe('bss.personalityDrivenLayouts.enabled');
      }
      for (const flag of pipelineFlag) {
        expect(extractFlag(flag)).toBe('bss.personalityDrivenLayouts.enabled');
      }
    });

    it('config feature flag matches workflow feature flags', () => {
      expect(configContent).toMatch(/bss\.personalityDrivenLayouts\.enabled/);
      expect(deliveryContent).toMatch(/bss\.personalityDrivenLayouts\.enabled/);
      expect(pipelineContent).toMatch(/bss\.personalityDrivenLayouts\.enabled/);
    });
  });
});
