/**
 * Movement/Strategy page data extractor.
 *
 * Generates brand strategy data for the Movement page including
 * manifesto, purpose/values, archetype composition, positioning,
 * BrandScript, vocabulary, Hero's Journey, and brand contract.
 *
 * NO external API calls, NO AI generation — all data derived from
 * brand profile or sensible defaults.
 *
 * @module pages/movement-page-data
 */

/**
 * Manifesto section data.
 */
export interface ManifestoSection {
  readonly statement: string;
  readonly philosophyStatements: string[];
  readonly brandPromise: string;
}

/**
 * A single core value entry.
 */
export interface CoreValue {
  readonly name: string;
  readonly description: string;
}

/**
 * Purpose & Values section data.
 */
export interface PurposeValuesSection {
  readonly purpose: string;
  readonly values: CoreValue[];
}

/**
 * Archetype composition entry with percentage.
 */
export interface ArchetypeEntry {
  readonly archetype: string;
  readonly percentage: number;
  readonly description: string;
  readonly icon: string;
}

/**
 * Archetype section data.
 */
export interface ArchetypeSection {
  readonly primary: ArchetypeEntry;
  readonly secondary: ArchetypeEntry[];
  readonly composition: ArchetypeEntry[];
}

/**
 * Positioning section data.
 */
export interface PositioningSection {
  readonly statement: string;
  readonly category: string;
  readonly uniqueValue: string;
  readonly targetAudience: string;
  readonly method: string;
}

/**
 * BrandScript (StoryBrand) section data.
 */
export interface BrandScriptSection {
  readonly character: string;
  readonly problem: {
    readonly external: string;
    readonly internal: string;
    readonly philosophical: string;
  };
  readonly guide: string;
  readonly plan: string[];
  readonly action: string;
  readonly success: string;
  readonly failure: string;
}

/**
 * Vocabulary section data.
 */
export interface VocabularySection {
  readonly powerWords: string[];
  readonly bannedWords: string[];
  readonly toneGuidelines: string[];
}

/**
 * Hero's Journey stage.
 */
export interface JourneyStage {
  readonly name: string;
  readonly title: string;
  readonly description: string;
}

/**
 * Brand contract section data.
 */
export interface BrandContractSection {
  readonly promises: string[];
  readonly demands: string[];
}

/**
 * Complete data for the Movement/Strategy brand book page.
 */
export interface MovementPageData {
  readonly manifesto: ManifestoSection;
  readonly purposeValues: PurposeValuesSection;
  readonly archetype: ArchetypeSection;
  readonly positioning: PositioningSection;
  readonly brandScript: BrandScriptSection;
  readonly vocabulary: VocabularySection;
  readonly heroJourney: JourneyStage[];
  readonly brandContract: BrandContractSection;
}

/**
 * Brand profile input for movement page generation.
 */
export interface MovementBrandProfile {
  readonly personality?: {
    readonly traits?: string[];
    readonly tone?: string;
  };
  readonly values?: {
    readonly core?: Array<{ name: string; description: string }>;
    readonly mission?: string;
  };
  readonly positioning?: {
    readonly category?: string;
    readonly unique_value?: string;
    readonly target_audience?: string;
    readonly method?: string;
  };
  readonly story?: {
    readonly character?: string;
    readonly problem?: {
      readonly external?: string;
      readonly internal?: string;
      readonly philosophical?: string;
    };
    readonly guide?: string;
    readonly plan?: string[];
    readonly action?: string;
    readonly success?: string;
    readonly failure?: string;
  };
  readonly archetype?: {
    readonly primary?: string;
    readonly secondary?: string[];
    readonly composition?: Array<{ archetype: string; percentage: number }>;
  };
  readonly contract?: {
    readonly promises?: string[];
    readonly demands?: string[];
  };
}

/**
 * The 12 standard brand archetypes with descriptions and icons.
 */
const ARCHETYPE_FRAMEWORK: Record<string, { description: string; icon: string }> = {
  Innocent: { description: 'Strives for happiness and purity. Optimistic, honest, and simple.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' },
  Explorer: { description: 'Seeks freedom and discovery. Adventurous, independent, and ambitious.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' },
  Sage: { description: 'Seeks truth and understanding. Wise, analytical, and knowledgeable.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
  Hero: { description: 'Proves worth through courageous action. Strong, brave, and determined.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' },
  Outlaw: { description: 'Breaks rules to create change. Rebellious, disruptive, and bold.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
  Magician: { description: 'Makes dreams come true through transformation. Visionary and innovative.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  'Regular Guy': { description: 'Connects through belonging. Authentic, approachable, and down-to-earth.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  Lover: { description: 'Creates intimate experiences and connection. Passionate and committed.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
  Jester: { description: 'Lives in the moment with joy. Playful, humorous, and irreverent.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' },
  Caregiver: { description: 'Protects and cares for others. Nurturing, generous, and compassionate.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  Creator: { description: 'Creates things of enduring value. Artistic, imaginative, and expressive.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>' },
  Ruler: { description: 'Creates order and structure. Authoritative, responsible, and organized.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1L1 7l11 6 11-6-11-6z"/><path d="M1 17l11 6 11-6"/><path d="M1 12l11 6 11-6"/></svg>' },
};

/**
 * Trait-to-archetype mapping for derivation.
 */
const TRAIT_ARCHETYPE_MAP: Record<string, string> = {
  rebellious: 'Outlaw',
  disruptive: 'Outlaw',
  bold: 'Outlaw',
  innovative: 'Magician',
  transformative: 'Magician',
  adventurous: 'Explorer',
  curious: 'Explorer',
  protective: 'Caregiver',
  nurturing: 'Caregiver',
  authoritative: 'Ruler',
  structured: 'Ruler',
  playful: 'Jester',
  humorous: 'Jester',
  romantic: 'Lover',
  passionate: 'Lover',
  heroic: 'Hero',
  courageous: 'Hero',
  wise: 'Sage',
  knowledgeable: 'Sage',
  creative: 'Creator',
  artistic: 'Creator',
  authentic: 'Regular Guy',
  approachable: 'Regular Guy',
  optimistic: 'Innocent',
  pure: 'Innocent',
};

/**
 * Derive archetype composition from personality traits.
 */
function deriveArchetypeFromTraits(traits: string[]): ArchetypeEntry[] {
  const scores: Record<string, number> = {};

  traits.forEach((trait, idx) => {
    const key = trait.toLowerCase();
    const archetype = TRAIT_ARCHETYPE_MAP[key];
    if (archetype) {
      const weight = idx === 0 ? 3 : idx === 1 ? 2 : 1;
      scores[archetype] = (scores[archetype] ?? 0) + weight;
    }
  });

  if (Object.keys(scores).length === 0) {
    return [buildArchetypeEntry('Creator', 60), buildArchetypeEntry('Explorer', 40)];
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [, s]) => sum + s, 0);
  const primaryScore = sorted[0][1];
  const threshold = primaryScore * 0.3;

  const relevant = sorted.filter(([, s]) => s >= threshold).slice(0, 3);
  const relevantTotal = relevant.reduce((sum, [, s]) => sum + s, 0);

  return relevant.map(([name, score]) =>
    buildArchetypeEntry(name, Math.round((score / relevantTotal) * 100)),
  );
}

/**
 * Build an ArchetypeEntry from the framework data.
 */
function buildArchetypeEntry(name: string, percentage: number): ArchetypeEntry {
  const info = ARCHETYPE_FRAMEWORK[name] ?? {
    description: `The ${name} archetype.`,
    icon: '',
  };
  return {
    archetype: name,
    percentage,
    description: info.description,
    icon: info.icon,
  };
}

/**
 * Default manifesto when no data is available.
 */
const DEFAULT_MANIFESTO: ManifestoSection = {
  statement: 'We believe in the power of design to transform how people experience brands.',
  philosophyStatements: [
    'Every touchpoint is an opportunity to build trust.',
    'Consistency is not repetition — it is coherence with purpose.',
    'Great brands don\'t just look good. They feel right.',
  ],
  brandPromise: 'To deliver a brand experience that is authentic, consistent, and memorable.',
};

/**
 * Default purpose and values.
 */
const DEFAULT_PURPOSE_VALUES: PurposeValuesSection = {
  purpose: 'To empower organizations with a brand system that scales from concept to every customer touchpoint.',
  values: [
    { name: 'Clarity', description: 'We cut through noise. Every decision, every design, every word serves understanding.' },
    { name: 'Consistency', description: 'Same brand, every channel, every time. No surprises, only recognition.' },
    { name: 'Craft', description: 'We obsess over details because details are what separate good from exceptional.' },
    { name: 'Courage', description: 'We push boundaries and challenge conventions when it serves the brand vision.' },
  ],
};

/**
 * Default positioning.
 */
const DEFAULT_POSITIONING: PositioningSection = {
  statement: 'The only brand system service that delivers production-ready brand books for any organization through automated design token extraction.',
  category: 'brand system service',
  uniqueValue: 'delivers production-ready brand books',
  targetAudience: 'organizations building or refreshing their brand identity',
  method: 'automated design token extraction',
};

/**
 * Default BrandScript.
 */
const DEFAULT_BRAND_SCRIPT: BrandScriptSection = {
  character: 'The brand owner who wants a professional, consistent identity but lacks design resources.',
  problem: {
    external: 'Creating a comprehensive brand book is expensive and time-consuming.',
    internal: 'Feels overwhelmed by the complexity of brand consistency across channels.',
    philosophical: 'Every brand deserves a professional identity, regardless of budget.',
  },
  guide: 'A systematic brand service that transforms design tokens into living brand documentation.',
  plan: [
    'Define your brand foundations (colors, typography, logo)',
    'Let the system extract and organize your design tokens',
    'Receive a complete, interactive brand book ready for your team',
  ],
  action: 'Start building your brand system',
  success: 'A cohesive brand identity that your team can implement consistently across every touchpoint.',
  failure: 'Without a brand system, every new design becomes a guessing game — inconsistency erodes trust.',
};

/**
 * Default vocabulary.
 */
const DEFAULT_VOCABULARY: VocabularySection = {
  powerWords: [
    'transform', 'elevate', 'craft', 'empower', 'precision',
    'seamless', 'authentic', 'bold', 'intentional', 'refined',
  ],
  bannedWords: [
    'cheap', 'basic', 'simple', 'just', 'only',
    'revolutionary', 'synergy', 'leverage', 'disrupt',
  ],
  toneGuidelines: [
    'Confident but not arrogant — authority earned through craft.',
    'Clear and direct — no jargon, no fluff, no filler.',
    'Professional with warmth — expertise that invites, not intimidates.',
    'Active voice preferred — the brand acts, never passively waits.',
  ],
};

/**
 * Default Hero's Journey stages.
 */
const DEFAULT_HERO_JOURNEY: JourneyStage[] = [
  {
    name: 'sleep',
    title: 'The Sleep',
    description: 'The audience lives with inconsistent branding. Every touchpoint feels disconnected. They know something is off but haven\'t identified the root cause.',
  },
  {
    name: 'call',
    title: 'The Call',
    description: 'A moment of clarity — a competitor\'s polished brand, a failed pitch, or customer confusion — reveals the cost of brand inconsistency.',
  },
  {
    name: 'rabbit-hole',
    title: 'The Rabbit Hole',
    description: 'They discover that brand consistency isn\'t about a logo file. It\'s a system: tokens, rules, documentation, and governance that scale.',
  },
  {
    name: 'awakening',
    title: 'The Awakening',
    description: 'With a comprehensive brand system in place, every touchpoint reinforces the same story. The brand becomes recognizable, trustworthy, and alive.',
  },
];

/**
 * Default brand contract.
 */
const DEFAULT_BRAND_CONTRACT: BrandContractSection = {
  promises: [
    'We deliver production-quality brand documentation.',
    'We maintain consistency across every generated asset.',
    'We respect your design decisions and amplify them systematically.',
    'We make professional branding accessible regardless of team size.',
  ],
  demands: [
    'Define your brand foundations honestly — no shortcuts in discovery.',
    'Trust the system — consistency requires discipline.',
    'Use the brand book as a living document, not a shelf decoration.',
    'Give feedback — the system improves with every iteration.',
  ],
};

/**
 * Extract all data for the Movement/Strategy page.
 *
 * Generates structured brand strategy data from brand profile
 * with sensible defaults when data is incomplete.
 *
 * @param profile - Brand profile data (optional)
 * @param clientName - Client name for personalization
 * @returns Complete movement page data for template rendering
 */
export function extractMovementPageData(
  profile?: MovementBrandProfile,
  clientName?: string,
): MovementPageData {
  // Archetype
  let archetypeComposition: ArchetypeEntry[];
  if (profile?.archetype?.composition) {
    archetypeComposition = profile.archetype.composition.map((c) =>
      buildArchetypeEntry(c.archetype, c.percentage),
    );
  } else if (profile?.personality?.traits && profile.personality.traits.length > 0) {
    archetypeComposition = deriveArchetypeFromTraits(profile.personality.traits);
  } else {
    archetypeComposition = [buildArchetypeEntry('Creator', 60), buildArchetypeEntry('Explorer', 40)];
  }

  const primary = archetypeComposition[0];
  const secondary = archetypeComposition.slice(1);

  // Positioning
  let positioning: PositioningSection;
  if (profile?.positioning) {
    const p = profile.positioning;
    const cat = p.category ?? DEFAULT_POSITIONING.category;
    const uv = p.unique_value ?? DEFAULT_POSITIONING.uniqueValue;
    const ta = p.target_audience ?? DEFAULT_POSITIONING.targetAudience;
    const m = p.method ?? DEFAULT_POSITIONING.method;
    positioning = {
      statement: `The only ${cat} that ${uv} for ${ta} through ${m}.`,
      category: cat,
      uniqueValue: uv,
      targetAudience: ta,
      method: m,
    };
  } else {
    positioning = DEFAULT_POSITIONING;
  }

  // BrandScript
  let brandScript: BrandScriptSection;
  if (profile?.story) {
    const s = profile.story;
    brandScript = {
      character: s.character ?? DEFAULT_BRAND_SCRIPT.character,
      problem: {
        external: s.problem?.external ?? DEFAULT_BRAND_SCRIPT.problem.external,
        internal: s.problem?.internal ?? DEFAULT_BRAND_SCRIPT.problem.internal,
        philosophical: s.problem?.philosophical ?? DEFAULT_BRAND_SCRIPT.problem.philosophical,
      },
      guide: s.guide ?? DEFAULT_BRAND_SCRIPT.guide,
      plan: s.plan ?? DEFAULT_BRAND_SCRIPT.plan,
      action: s.action ?? DEFAULT_BRAND_SCRIPT.action,
      success: s.success ?? DEFAULT_BRAND_SCRIPT.success,
      failure: s.failure ?? DEFAULT_BRAND_SCRIPT.failure,
    };
  } else {
    brandScript = DEFAULT_BRAND_SCRIPT;
  }

  // Purpose & Values
  let purposeValues: PurposeValuesSection;
  if (profile?.values?.core && profile.values.core.length > 0) {
    purposeValues = {
      purpose: profile.values.mission ?? DEFAULT_PURPOSE_VALUES.purpose,
      values: profile.values.core,
    };
  } else {
    purposeValues = DEFAULT_PURPOSE_VALUES;
  }

  // Brand Contract
  let brandContract: BrandContractSection;
  if (profile?.contract) {
    brandContract = {
      promises: profile.contract.promises ?? DEFAULT_BRAND_CONTRACT.promises,
      demands: profile.contract.demands ?? DEFAULT_BRAND_CONTRACT.demands,
    };
  } else {
    brandContract = DEFAULT_BRAND_CONTRACT;
  }

  // Manifesto (personalized with clientName if available)
  const name = clientName ?? 'the brand';
  const manifesto: ManifestoSection = {
    statement: DEFAULT_MANIFESTO.statement,
    philosophyStatements: DEFAULT_MANIFESTO.philosophyStatements,
    brandPromise: `${name} promises ${DEFAULT_MANIFESTO.brandPromise.charAt(0).toLowerCase()}${DEFAULT_MANIFESTO.brandPromise.slice(1)}`,
  };

  return {
    manifesto,
    purposeValues,
    archetype: {
      primary,
      secondary,
      composition: archetypeComposition,
    },
    positioning,
    brandScript,
    vocabulary: DEFAULT_VOCABULARY,
    heroJourney: DEFAULT_HERO_JOURNEY,
    brandContract,
  };
}
