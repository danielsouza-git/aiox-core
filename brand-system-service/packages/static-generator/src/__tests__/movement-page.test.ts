import {
  extractMovementPageData,
} from '../pages/movement-page-data';
import {
  BRAND_BOOK_PAGES,
} from '../static-generator';

describe('extractMovementPageData', () => {
  it('should return complete page data with all 8 sections', () => {
    const data = extractMovementPageData();
    expect(data).toHaveProperty('manifesto');
    expect(data).toHaveProperty('purposeValues');
    expect(data).toHaveProperty('archetype');
    expect(data).toHaveProperty('positioning');
    expect(data).toHaveProperty('brandScript');
    expect(data).toHaveProperty('vocabulary');
    expect(data).toHaveProperty('heroJourney');
    expect(data).toHaveProperty('brandContract');
  });

  // Manifesto
  it('should have manifesto with statement, philosophy, and promise', () => {
    const data = extractMovementPageData();
    expect(data.manifesto.statement).toBeTruthy();
    expect(data.manifesto.philosophyStatements.length).toBeGreaterThanOrEqual(3);
    expect(data.manifesto.brandPromise).toBeTruthy();
  });

  it('should personalize brand promise with client name', () => {
    const data = extractMovementPageData(undefined, 'Acme Corp');
    expect(data.manifesto.brandPromise).toContain('Acme Corp');
  });

  // Purpose & Values
  it('should have purpose and at least 3 values', () => {
    const data = extractMovementPageData();
    expect(data.purposeValues.purpose).toBeTruthy();
    expect(data.purposeValues.values.length).toBeGreaterThanOrEqual(3);
  });

  it('each value should have name and description', () => {
    const data = extractMovementPageData();
    for (const val of data.purposeValues.values) {
      expect(val.name).toBeTruthy();
      expect(val.description).toBeTruthy();
    }
  });

  it('should use custom values from brand profile', () => {
    const data = extractMovementPageData({
      values: {
        mission: 'Our custom mission',
        core: [
          { name: 'Speed', description: 'We move fast' },
          { name: 'Quality', description: 'We build right' },
        ],
      },
    });
    expect(data.purposeValues.purpose).toBe('Our custom mission');
    expect(data.purposeValues.values.length).toBe(2);
    expect(data.purposeValues.values[0].name).toBe('Speed');
  });

  // Archetype
  it('should have archetype with primary and composition', () => {
    const data = extractMovementPageData();
    expect(data.archetype.primary).toBeTruthy();
    expect(data.archetype.composition.length).toBeGreaterThanOrEqual(2);
  });

  it('should derive archetype from personality traits', () => {
    const data = extractMovementPageData({
      personality: { traits: ['rebellious', 'innovative', 'curious'] },
    });
    expect(data.archetype.primary.archetype).toBe('Outlaw');
    expect(data.archetype.composition.length).toBeGreaterThanOrEqual(2);
  });

  it('each archetype entry should have percentage, description, and icon', () => {
    const data = extractMovementPageData();
    for (const arch of data.archetype.composition) {
      expect(arch.archetype).toBeTruthy();
      expect(arch.percentage).toBeGreaterThan(0);
      expect(arch.description).toBeTruthy();
      expect(arch.icon).toContain('<svg');
    }
  });

  it('archetype percentages should sum to 100', () => {
    const data = extractMovementPageData();
    const total = data.archetype.composition.reduce((sum, a) => sum + a.percentage, 0);
    expect(total).toBe(100);
  });

  it('should use explicit archetype composition from profile', () => {
    const data = extractMovementPageData({
      archetype: {
        composition: [
          { archetype: 'Hero', percentage: 70 },
          { archetype: 'Sage', percentage: 30 },
        ],
      },
    });
    expect(data.archetype.primary.archetype).toBe('Hero');
    expect(data.archetype.primary.percentage).toBe(70);
    expect(data.archetype.secondary.length).toBe(1);
    expect(data.archetype.secondary[0].archetype).toBe('Sage');
  });

  // Positioning
  it('should have positioning with statement and components', () => {
    const data = extractMovementPageData();
    expect(data.positioning.statement).toBeTruthy();
    expect(data.positioning.category).toBeTruthy();
    expect(data.positioning.uniqueValue).toBeTruthy();
    expect(data.positioning.targetAudience).toBeTruthy();
    expect(data.positioning.method).toBeTruthy();
  });

  it('should build positioning statement from profile data', () => {
    const data = extractMovementPageData({
      positioning: {
        category: 'SaaS tool',
        unique_value: 'automates everything',
        target_audience: 'busy founders',
        method: 'AI-driven workflows',
      },
    });
    expect(data.positioning.statement).toContain('SaaS tool');
    expect(data.positioning.statement).toContain('automates everything');
    expect(data.positioning.statement).toContain('busy founders');
    expect(data.positioning.statement).toContain('AI-driven workflows');
  });

  // BrandScript
  it('should have BrandScript with all 7 elements', () => {
    const data = extractMovementPageData();
    expect(data.brandScript.character).toBeTruthy();
    expect(data.brandScript.problem.external).toBeTruthy();
    expect(data.brandScript.problem.internal).toBeTruthy();
    expect(data.brandScript.problem.philosophical).toBeTruthy();
    expect(data.brandScript.guide).toBeTruthy();
    expect(data.brandScript.plan.length).toBeGreaterThanOrEqual(3);
    expect(data.brandScript.action).toBeTruthy();
    expect(data.brandScript.success).toBeTruthy();
    expect(data.brandScript.failure).toBeTruthy();
  });

  it('should use custom BrandScript from profile', () => {
    const data = extractMovementPageData({
      story: {
        character: 'Custom character',
        action: 'Custom CTA',
      },
    });
    expect(data.brandScript.character).toBe('Custom character');
    expect(data.brandScript.action).toBe('Custom CTA');
  });

  // Vocabulary
  it('should have vocabulary with power words and banned words', () => {
    const data = extractMovementPageData();
    expect(data.vocabulary.powerWords.length).toBeGreaterThanOrEqual(5);
    expect(data.vocabulary.bannedWords.length).toBeGreaterThanOrEqual(5);
    expect(data.vocabulary.toneGuidelines.length).toBeGreaterThanOrEqual(3);
  });

  // Hero's Journey
  it('should have 4 journey stages', () => {
    const data = extractMovementPageData();
    expect(data.heroJourney.length).toBe(4);
    const stageNames = data.heroJourney.map((s) => s.name);
    expect(stageNames).toEqual(['sleep', 'call', 'rabbit-hole', 'awakening']);
  });

  it('each journey stage should have name, title, and description', () => {
    const data = extractMovementPageData();
    for (const stage of data.heroJourney) {
      expect(stage.name).toBeTruthy();
      expect(stage.title).toBeTruthy();
      expect(stage.description).toBeTruthy();
    }
  });

  // Brand Contract
  it('should have brand contract with promises and demands', () => {
    const data = extractMovementPageData();
    expect(data.brandContract.promises.length).toBeGreaterThanOrEqual(3);
    expect(data.brandContract.demands.length).toBeGreaterThanOrEqual(3);
  });

  it('should use custom brand contract from profile', () => {
    const data = extractMovementPageData({
      contract: {
        promises: ['Custom promise 1', 'Custom promise 2', 'Custom promise 3'],
        demands: ['Custom demand 1', 'Custom demand 2', 'Custom demand 3'],
      },
    });
    expect(data.brandContract.promises[0]).toBe('Custom promise 1');
    expect(data.brandContract.demands[0]).toBe('Custom demand 1');
  });
});

describe('BRAND_BOOK_PAGES includes movement', () => {
  it('should include movement page entry', () => {
    const page = BRAND_BOOK_PAGES.find((p) => p.slug === 'movement');
    expect(page).toBeDefined();
    expect(page!.title).toBe('Movement & Strategy');
    expect(page!.template).toBe('movement');
  });
});
