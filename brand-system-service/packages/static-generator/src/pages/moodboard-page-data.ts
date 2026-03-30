/**
 * Moodboard page data extractor.
 *
 * Generates moodboard categories and design principles from brand profile
 * data. Template-driven approach — NO external API calls, NO AI image generation.
 *
 * @module pages/moodboard-page-data
 */

/**
 * A visual reference slot in a moodboard category.
 */
export interface MoodboardSlot {
  readonly caption: string;
  readonly imageUrl: string;
  readonly categoryTag: string;
  readonly cssPattern: string;
  readonly description: string;
}

/**
 * A moodboard category with 2-3 visual reference slots.
 */
export interface MoodboardCategory {
  readonly name: string;
  readonly description: string;
  readonly slots: MoodboardSlot[];
}

/**
 * A design principle with visual swatch.
 */
export interface DesignPrinciple {
  readonly title: string;
  readonly description: string;
  readonly swatchColor: string;
  readonly swatchPattern: string;
}

/**
 * Complete data for the Moodboard brand book page.
 */
export interface MoodboardPageData {
  readonly categories: MoodboardCategory[];
  readonly designPrinciples: DesignPrinciple[];
}

/**
 * Brand profile subset for moodboard generation.
 */
export interface MoodboardBrandProfile {
  readonly personality?: {
    readonly traits?: string[];
    readonly tone?: string;
  };
  readonly industry?: {
    readonly category?: string;
    readonly subCategory?: string;
  };
  readonly visualPreferences?: {
    readonly styleKeywords?: string[];
    readonly primaryColors?: string[];
    readonly mood?: string;
  };
  readonly values?: {
    readonly core?: string[];
  };
}

/**
 * CSS pattern generators for placeholder slots.
 */
const CSS_PATTERNS: Record<string, string> = {
  grid: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.05) 19px, rgba(0,0,0,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.05) 19px, rgba(0,0,0,0.05) 20px)',
  diagonal: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)',
  dots: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
  gradient: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 100%)',
  waves: 'repeating-linear-gradient(120deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px)',
  halftone: 'radial-gradient(circle, rgba(0,0,0,0.06) 2px, transparent 2px)',
};

/**
 * Industry-specific category templates.
 */
const INDUSTRY_CATEGORIES: Record<string, string[]> = {
  technology: ['Web UI & Product', 'Dashboard & Data', 'Graphic & Pattern', 'Layout & Typography'],
  'food-beverage': ['Interior & Ambiance', 'Packaging & Menu', 'Typography & Signage', 'Color & Texture'],
  fashion: ['Editorial & Campaign', 'Texture & Material', 'Typography & Layout', 'Color & Mood'],
  finance: ['Corporate & Trust', 'Data Visualization', 'Typography & Clarity', 'Color & Contrast'],
  health: ['Clinical & Clean', 'Empathy & Care', 'Typography & Readability', 'Nature & Wellness'],
  default: ['Visual Identity', 'UI & Digital', 'Typography & Layout', 'Color & Pattern'],
};

/**
 * Derive 4 moodboard categories from brand profile.
 */
function deriveCategories(profile?: MoodboardBrandProfile, primaryColor?: string): MoodboardCategory[] {
  const industry = profile?.industry?.category ?? 'default';
  const categoryNames = INDUSTRY_CATEGORIES[industry] ?? INDUSTRY_CATEGORIES.default;
  const patternKeys = Object.keys(CSS_PATTERNS);
  const color = primaryColor ?? '#7631e5';

  return categoryNames.map((name, idx) => ({
    name,
    description: `Visual references for ${name.toLowerCase()} direction.`,
    slots: [
      {
        caption: `${name} Reference 1`,
        imageUrl: '',
        categoryTag: name,
        cssPattern: CSS_PATTERNS[patternKeys[idx % patternKeys.length]],
        description: `Primary visual reference for ${name.toLowerCase()}`,
      },
      {
        caption: `${name} Reference 2`,
        imageUrl: '',
        categoryTag: name,
        cssPattern: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
        description: `Secondary visual reference for ${name.toLowerCase()}`,
      },
    ],
  }));
}

/**
 * Derive 4-5 design principles from brand profile.
 */
function derivePrinciples(profile?: MoodboardBrandProfile, primaryColor?: string): DesignPrinciple[] {
  const color = primaryColor ?? '#7631e5';
  const keywords = profile?.visualPreferences?.styleKeywords ?? [];
  const traits = profile?.personality?.traits ?? [];

  const defaults: DesignPrinciple[] = [
    {
      title: 'Brand-First Design',
      description: 'Every visual element reinforces the brand identity. Color, typography, and spacing work in harmony.',
      swatchColor: color,
      swatchPattern: 'solid',
    },
    {
      title: 'Clarity & Hierarchy',
      description: 'Clear information architecture with strong visual hierarchy. Users find what they need instantly.',
      swatchColor: '#1a1a2e',
      swatchPattern: 'solid',
    },
    {
      title: 'Consistent Rhythm',
      description: 'Spacing, sizing, and repetition create a predictable and comfortable visual rhythm.',
      swatchColor: '#6b7280',
      swatchPattern: 'striped',
    },
    {
      title: 'Purposeful Color',
      description: 'Color is used intentionally — for emphasis, feedback, and brand recognition. Never decorative noise.',
      swatchColor: color,
      swatchPattern: 'gradient',
    },
  ];

  if (keywords.includes('dark-first') || traits.includes('bold')) {
    defaults.push({
      title: 'Dark-First Aesthetic',
      description: 'Dark backgrounds with high-contrast accents create focus and reduce visual fatigue.',
      swatchColor: '#0F0F11',
      swatchPattern: 'solid',
    });
  }

  return defaults;
}

/**
 * Extract moodboard page data for brand book rendering.
 *
 * @param profile - Brand profile data (optional, uses defaults if missing)
 * @param primaryColor - Primary brand color from config
 * @returns Complete moodboard page data
 */
export function extractMoodboardPageData(
  profile?: MoodboardBrandProfile,
  primaryColor?: string,
): MoodboardPageData {
  return {
    categories: deriveCategories(profile, primaryColor),
    designPrinciples: derivePrinciples(profile, primaryColor),
  };
}
