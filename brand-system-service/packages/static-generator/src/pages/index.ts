/**
 * Page data extraction modules.
 *
 * @module pages
 */
export {
  extractSurfacesPageData,
  type SurfaceToken,
  type BorderToken,
  type RadiusToken,
  type GlassEffect,
  type SurfacesPageData,
} from './surfaces-page-data';

export {
  extractSemanticTokensPageData,
  buildShadcnMappings,
  type SemanticBackgroundToken,
  type SemanticTextToken,
  type GlowToken,
  type InteractiveState,
  type FontWeightToken,
  type ShadcnMapping,
  type SemanticTokensPageData,
} from './semantic-tokens-page-data';

export {
  extractIconSystemPageData,
  type IconGridSize,
  type IconEntry,
  type StrokeRules,
  type IconColorVariant,
  type IconAccessibilityGuidelines,
  type IconSystemPageData,
} from './icon-system-page-data';

export {
  extractLogoUsagePageData,
  type ClearSpaceSpec,
  type LogoUsageDo,
  type LogoUsageDont,
  type LogoColorContext,
  type LogoFileFormat,
  type LogoMinimumSize,
  type LogoUsagePageData,
  type LogoUsageBrandConfig,
} from './logo-usage-page-data';

export {
  extractMoodboardPageData,
  type MoodboardSlot,
  type MoodboardCategory,
  type DesignPrinciple,
  type MoodboardPageData,
  type MoodboardBrandProfile,
} from './moodboard-page-data';

export {
  extractMovementPageData,
  type ManifestoSection,
  type CoreValue,
  type PurposeValuesSection,
  type ArchetypeEntry,
  type ArchetypeSection,
  type PositioningSection,
  type BrandScriptSection,
  type VocabularySection,
  type JourneyStage,
  type BrandContractSection,
  type MovementPageData,
  type MovementBrandProfile,
} from './movement-page-data';
