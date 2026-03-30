/**
 * Editorial Strategy page data extractor.
 *
 * Generates editorial strategy data for the brand book page including
 * visual system (editorial context of 4 brand colors), brand traits
 * showcase, audience personas, and editorial strategy documentation.
 *
 * NOTE: The Visual System section presents colors in EDITORIAL context
 * (how to use them in content), not as a comprehensive palette reference
 * (see Foundations/Colors for that).
 *
 * NO external API calls — all data derived from brand profile and voice guide.
 *
 * @module pages/editorial-strategy-page-data
 */

/**
 * An editorial color entry with usage context.
 */
export interface EditorialColor {
  readonly name: string;
  readonly hex: string;
  readonly role: string;
  readonly editorialUsage: string;
}

/**
 * Visual System section data (editorial context).
 */
export interface VisualSystemSection {
  readonly colors: EditorialColor[];
  readonly description: string;
}

/**
 * A brand personality trait with icon and description.
 */
export interface BrandTrait {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
}

/**
 * Brand Traits Showcase section data.
 */
export interface BrandTraitsSection {
  readonly traits: BrandTrait[];
}

/**
 * An audience persona entry.
 */
export interface AudiencePersona {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly characteristics: string[];
}

/**
 * Audience Personas section data.
 */
export interface AudiencePersonasSection {
  readonly personas: AudiencePersona[];
  readonly fallbackMessage?: string;
}

/**
 * Editorial Strategy section data.
 */
export interface EditorialStrategySection {
  readonly paragraphs: string[];
  readonly principles: string[];
}

/**
 * Complete data for the Editorial Strategy brand book page.
 */
export interface EditorialStrategyPageData {
  readonly visualSystem: VisualSystemSection;
  readonly brandTraits: BrandTraitsSection;
  readonly audiencePersonas: AudiencePersonasSection;
  readonly editorialStrategy: EditorialStrategySection;
}

/**
 * Brand profile subset for editorial strategy generation.
 */
export interface EditorialBrandProfile {
  readonly personality?: {
    readonly traits?: string[];
    readonly tone?: string;
  };
  readonly colors?: {
    readonly primary?: { name: string; hex: string };
    readonly background?: { name: string; hex: string };
    readonly surface?: { name: string; hex: string };
    readonly text?: { name: string; hex: string };
  };
  readonly audience?: {
    readonly personas?: Array<{
      readonly title: string;
      readonly subtitle?: string;
      readonly description: string;
      readonly characteristics?: string[];
    }>;
  };
  readonly voiceGuide?: {
    readonly tone?: string;
    readonly philosophy?: string;
    readonly principles?: string[];
  };
  readonly manifesto?: {
    readonly narrative?: string;
  };
}

/**
 * Default trait icons (SVG inline, no CDN per CON-22).
 */
const TRAIT_ICONS: Record<string, string> = {
  empowering: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  direct: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  rebellious: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  clear: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  passionate: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  courageous: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  bold: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  innovative: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  authentic: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  creative: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
};

/**
 * Default generic icon for unrecognized traits.
 */
const DEFAULT_TRAIT_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

/**
 * Default trait descriptions when brand profile does not provide them.
 */
const DEFAULT_TRAIT_DESCRIPTIONS: Record<string, string> = {
  empowering: 'Enables creators and teams to build without barriers. Language that lifts up, never talks down.',
  direct: 'Clear communication, no jargon or fluff. Every word serves a purpose.',
  rebellious: 'Challenges the status quo. Questions conventions when they no longer serve the mission.',
  clear: 'Systematic methodology over magical solutions. Structure creates freedom.',
  passionate: 'Energetic about transformation and craft. Conviction in every message.',
  courageous: 'Bold statements, contrarian positioning. Says what others are thinking but not saying.',
  bold: 'Makes strong claims backed by substance. Never generic, never safe.',
  innovative: 'Forward-thinking approach to problems. Embraces new methods and tools.',
  authentic: 'Honest and transparent. No pretense, no hype, just truth.',
  creative: 'Finds unexpected connections and solutions. Expression through craft.',
};

/**
 * Default editorial colors when brand profile does not provide them.
 */
const DEFAULT_EDITORIAL_COLORS: EditorialColor[] = [
  {
    name: 'Primary Accent',
    hex: '#7631e5',
    role: 'CTAs & Emphasis',
    editorialUsage: 'Use for calls-to-action, links, highlighted keywords, and brand accent moments in editorial content.',
  },
  {
    name: 'Dark Background',
    hex: '#0F0F11',
    role: 'Hero Sections & Backgrounds',
    editorialUsage: 'Use for hero sections, dark-mode backgrounds, and high-contrast editorial layouts.',
  },
  {
    name: 'Surface',
    hex: '#1A1A2E',
    role: 'Cards & Panels',
    editorialUsage: 'Use for content cards, pull-quotes, and secondary container backgrounds.',
  },
  {
    name: 'Primary Text',
    hex: '#F5F4E7',
    role: 'Body Copy & Readability',
    editorialUsage: 'Use for body text on dark backgrounds. Optimized for long-form reading comfort.',
  },
];

/**
 * Default brand traits when profile does not provide them.
 */
const DEFAULT_TRAITS: string[] = [
  'Empowering',
  'Direct',
  'Rebellious',
  'Clear',
  'Passionate',
  'Courageous',
];

/**
 * Default audience personas when brand discovery data is not available.
 */
const DEFAULT_PERSONAS: AudiencePersona[] = [
  {
    title: 'The Builder',
    subtitle: 'Creator-entrepreneurs who value systematic tools',
    description: 'Professionals who build products and services. They value tools that reduce friction and increase output quality.',
    characteristics: [
      'Values efficiency and craft',
      'Prefers structured approaches',
      'Seeks tools that scale with their ambition',
    ],
  },
  {
    title: 'The Reinventor',
    subtitle: 'Experienced professionals seeking new paths',
    description: 'Late-career professionals exploring new creation paths. They bring deep expertise and seek modern tools to amplify it.',
    characteristics: [
      'Rich professional experience',
      'Open to new methodologies',
      'Values quality over speed',
    ],
  },
  {
    title: 'The Craft Seeker',
    subtitle: 'Professionals recovering focus and purpose',
    description: 'Developers and designers who want to reconnect with the craft of creation. Seeking recovery from burnout through meaningful work.',
    characteristics: [
      'Deep technical expertise',
      'Motivated by mastery',
      'Community-oriented mindset',
    ],
  },
];

/**
 * Default editorial strategy content.
 */
const DEFAULT_STRATEGY_PARAGRAPHS: string[] = [
  'Our editorial approach prioritizes clarity and structure over complexity and abstraction. Every piece of content serves a specific purpose: to educate, to guide, or to inspire action. We reject filler content and generic messaging in favor of direct, substantive communication.',
  'The brand voice is confident but not arrogant — authority earned through demonstrated craft, not claimed through superlatives. We use active voice, concrete examples, and structured formats. The narrative centers the reader as the protagonist: the tools and systems exist to amplify their capability, not to replace their judgment.',
  'Content strategy follows a systematic methodology: identify the audience need, map it to brand capability, deliver with precision. Consistency across channels is achieved not through rigid templates but through internalized principles that every piece of content embodies.',
];

/**
 * Default editorial principles.
 */
const DEFAULT_STRATEGY_PRINCIPLES: string[] = [
  'Clarity over cleverness — if it can be misunderstood, rewrite it.',
  'Substance over style — every claim needs evidence or context.',
  'Active voice — the brand acts, guides, builds. Never passive.',
  'Reader as protagonist — the audience is the hero, the brand is the guide.',
  'Consistency through principles — not rigid templates, but internalized standards.',
];

/**
 * Build visual system section from brand colors.
 */
function buildVisualSystem(profile?: EditorialBrandProfile): VisualSystemSection {
  if (profile?.colors) {
    const colors: EditorialColor[] = [];
    const c = profile.colors;

    if (c.primary) {
      colors.push({
        name: c.primary.name,
        hex: c.primary.hex,
        role: 'CTAs & Emphasis',
        editorialUsage: `Use ${c.primary.name} for calls-to-action, links, and highlighted keywords in editorial content.`,
      });
    }
    if (c.background) {
      colors.push({
        name: c.background.name,
        hex: c.background.hex,
        role: 'Hero Sections & Backgrounds',
        editorialUsage: `Use ${c.background.name} for hero sections and high-contrast editorial layouts.`,
      });
    }
    if (c.surface) {
      colors.push({
        name: c.surface.name,
        hex: c.surface.hex,
        role: 'Cards & Panels',
        editorialUsage: `Use ${c.surface.name} for content cards, pull-quotes, and secondary containers.`,
      });
    }
    if (c.text) {
      colors.push({
        name: c.text.name,
        hex: c.text.hex,
        role: 'Body Copy & Readability',
        editorialUsage: `Use ${c.text.name} for body text. Optimized for long-form reading comfort.`,
      });
    }

    if (colors.length > 0) {
      return {
        colors,
        description: 'The editorial visual system uses these core colors to create consistent, on-brand content across all channels.',
      };
    }
  }

  return {
    colors: DEFAULT_EDITORIAL_COLORS,
    description: 'The editorial visual system uses these core colors to create consistent, on-brand content across all channels.',
  };
}

/**
 * Build brand traits section from personality data.
 */
function buildBrandTraits(profile?: EditorialBrandProfile): BrandTraitsSection {
  const traitNames =
    profile?.personality?.traits && profile.personality.traits.length > 0
      ? profile.personality.traits.slice(0, 6)
      : DEFAULT_TRAITS;

  const traits: BrandTrait[] = traitNames.map((name) => {
    const key = name.toLowerCase();
    return {
      name,
      description: DEFAULT_TRAIT_DESCRIPTIONS[key] ?? `${name} — a core brand personality trait that shapes all communication.`,
      icon: TRAIT_ICONS[key] ?? DEFAULT_TRAIT_ICON,
    };
  });

  return { traits };
}

/**
 * Build audience personas section with graceful fallback.
 */
function buildAudiencePersonas(profile?: EditorialBrandProfile): AudiencePersonasSection {
  if (profile?.audience?.personas && profile.audience.personas.length > 0) {
    const personas: AudiencePersona[] = profile.audience.personas.map((p) => ({
      title: p.title,
      subtitle: p.subtitle ?? '',
      description: p.description,
      characteristics: p.characteristics ?? [],
    }));

    return { personas };
  }

  // Graceful fallback: show default personas with explanatory message
  return {
    personas: DEFAULT_PERSONAS,
    fallbackMessage: 'These are illustrative personas. Replace with audience data from brand discovery when available.',
  };
}

/**
 * Build editorial strategy section from voice guide and manifesto.
 */
function buildEditorialStrategy(profile?: EditorialBrandProfile): EditorialStrategySection {
  let paragraphs: string[];
  let principles: string[];

  if (profile?.voiceGuide) {
    const vg = profile.voiceGuide;
    const parts: string[] = [];

    if (vg.philosophy) {
      parts.push(vg.philosophy);
    }
    if (vg.tone) {
      parts.push(
        `The editorial tone is ${vg.tone}. Every piece of content embodies this tone consistently across all channels and formats.`,
      );
    }
    if (profile.manifesto?.narrative) {
      parts.push(profile.manifesto.narrative);
    }

    paragraphs = parts.length > 0 ? parts : DEFAULT_STRATEGY_PARAGRAPHS;
    principles = vg.principles && vg.principles.length > 0
      ? vg.principles
      : DEFAULT_STRATEGY_PRINCIPLES;
  } else {
    paragraphs = DEFAULT_STRATEGY_PARAGRAPHS;
    principles = DEFAULT_STRATEGY_PRINCIPLES;
  }

  return { paragraphs, principles };
}

/**
 * Extract editorial strategy page data for brand book rendering.
 *
 * Generates structured editorial data from brand profile, voice guide,
 * and manifesto with sensible defaults when data is incomplete.
 *
 * @param profile - Brand profile data (optional)
 * @returns Complete editorial strategy page data for template rendering
 */
export function extractEditorialStrategyPageData(
  profile?: EditorialBrandProfile,
): EditorialStrategyPageData {
  return {
    visualSystem: buildVisualSystem(profile),
    brandTraits: buildBrandTraits(profile),
    audiencePersonas: buildAudiencePersonas(profile),
    editorialStrategy: buildEditorialStrategy(profile),
  };
}
