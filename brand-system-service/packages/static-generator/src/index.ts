/**
 * @bss/static-generator - Static Site Generator
 *
 * Generates static HTML/CSS/JS for Brand Books, Landing Pages,
 * and Institutional Sites per ADR-001 (Static-First Architecture).
 *
 * Key responsibilities:
 * - HTML generation from Eta templates
 * - Build-time token injection as rendered HTML
 * - Three delivery formats: online deploy, PDF, local package (ZIP)
 * - Platform-agnostic output (Vercel, Netlify, any static host)
 * - Relative paths for local package portability (NFR-9.2)
 * - Client-side search via Fuse.js
 */

export {
  StaticGenerator,
  loadBrandConfig,
  injectColors,
  injectTypography,
  injectSpacing,
  injectComponents,
  buildSearchIndex,
  BRAND_BOOK_PAGES,
  type GeneratorOptions,
  type GeneratorConfig,
  type BrandConfig,
  type BuildType,
  type ColorSwatch,
  type ColorGroup,
  type TypographySpecimen,
  type SpacingBlock,
  type ComponentProperty,
  type ComponentGroup,
  type SearchIndexEntry,
  type BrandBookPage,
} from './static-generator';

// Surfaces & Borders page (BSS-A.4)
export {
  extractSurfacesPageData,
  type SurfaceToken,
  type BorderToken,
  type RadiusToken,
  type GlassEffect,
  type SurfacesPageData,
} from './pages/surfaces-page-data';

// Semantic Tokens page (BSS-A.5)
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
} from './pages/semantic-tokens-page-data';

// Icon System page (BSS-A.6)
export {
  extractIconSystemPageData,
  type IconGridSize,
  type IconEntry,
  type StrokeRules,
  type IconColorVariant,
  type IconAccessibilityGuidelines,
  type IconSystemPageData,
} from './pages/icon-system-page-data';

// Logo Usage Rules page (BSS-A.3)
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
} from './pages/logo-usage-page-data';

// Moodboard page (BSS-A.1)
export {
  extractMoodboardPageData,
  type MoodboardSlot,
  type MoodboardCategory,
  type DesignPrinciple,
  type MoodboardPageData,
  type MoodboardBrandProfile,
} from './pages/moodboard-page-data';

// Movement/Strategy page (BSS-A.2)
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
} from './pages/movement-page-data';

export {
  PdfGenerator,
  type PdfGeneratorConfig,
  type PdfGeneratorResult,
} from './pdf-generator';

export {
  downloadGoogleFonts,
  extractGoogleFontFamilies,
  type FontDownloadResult,
} from './font-downloader';

export {
  validateRelativePaths,
  replaceGoogleFontsLinks,
  inlineSearchIndex,
  type PathViolation,
  type ValidationResult,
} from './path-validator';

export {
  buildPackage,
  generateReadme,
  type PackageBuildOptions,
  type PackageBuildResult,
} from './package-builder';

export {
  runBuildPipeline,
  type BuildResult,
} from './build-pipeline';

export {
  generateToc,
  type TocEntry,
  type TocChild,
} from './toc-generator';

// Copy Framework (BSS-5.4)
export {
  LandingPageCopyFramework,
  CopyValidator,
  CopyPlaceholderGenerator,
  copyToTemplateVars,
  type CopyBrief,
  type Testimonial,
  type PricingTierBrief,
  type FaqItemBrief,
  type LandingPageCopy,
  type HeroCopy,
  type ProblemCopy,
  type SolutionCopy,
  type SolutionFeature,
  type HowItWorksCopy,
  type HowItWorksStep,
  type SocialProofCopy,
  type SocialProofTestimonial,
  type SocialProofMetric,
  type PricingCopy,
  type PricingTier,
  type FaqCopy,
  type FaqItem,
  type FinalCtaCopy,
  type HeroSocialProof,
  type ValidationResult as CopyValidationResult,
  type ValidationIssue,
  type ValidationSeverity,
  type SectionWordCount,
} from './copy-framework';

// SEO Engine (BSS-5.5)
export {
  SEOMetadataEngine,
  type SEOInput,
  type SEOMetadata,
  type OpenGraphMeta,
  type ImageInput,
  type HeadingEntry,
  type SEOWarning,
  type SitemapEntry,
  type RobotsConfig,
  type RobotsRule,
} from './seo';

// SEO Documentation Page (BSS-C.2)
export {
  extractSeoDocumentationPageData,
  type SeoDocumentationPageData,
  type SeoBrandProfile,
  type MetaTagExample,
  type MetaTagsGuide,
  type OGPropertyExample,
  type OpenGraphGuide,
  type TwitterCardProperty,
  type TwitterCardGuide,
  type JsonLdExample,
  type JsonLdGuide,
  type ImageSizeSpec,
  type ImageSpecsGuide,
} from './pages/seo-documentation-page-data';

// Editorial Strategy Page (BSS-C.3)
export {
  extractEditorialStrategyPageData,
  type EditorialStrategyPageData,
  type EditorialBrandProfile,
  type EditorialColor,
  type VisualSystemSection,
  type BrandTrait,
  type BrandTraitsSection,
  type AudiencePersona,
  type AudiencePersonasSection,
  type EditorialStrategySection,
} from './pages/editorial-strategy-page-data';

// Microcopy Guide (BSS-5.7)
export {
  MicrocopyGuide,
  type MicrocopyInput,
  type MicrocopyItem,
  type MicrocopyData,
  type MicrocopySection,
  type MicrocopyValidationError,
} from './microcopy';

// Static Package Exporter (BSS-5.8)
export {
  StaticPackageExporter,
  ExportError,
  type ExportOptions,
  type ExportResult,
} from './exporter';
