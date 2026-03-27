/**
 * SEO Documentation page data extractor.
 *
 * Generates structured SEO documentation data for the brand book page
 * including meta tags guide, Open Graph guide, Twitter/X Card guide,
 * JSON-LD schema examples, and image size specifications.
 *
 * Leverages the existing seo-engine.ts (BSS-5.5) for SEO patterns
 * while providing brand-specific documentation examples.
 *
 * NO external API calls — all data derived from brand profile.
 *
 * @module pages/seo-documentation-page-data
 */

/**
 * A single meta tag example with explanation.
 */
export interface MetaTagExample {
  readonly tag: string;
  readonly attribute: string;
  readonly value: string;
  readonly description: string;
  readonly maxLength?: number;
  readonly bestPractice: string;
}

/**
 * Meta Tags Guide section data.
 */
export interface MetaTagsGuide {
  readonly title: MetaTagExample;
  readonly description: MetaTagExample;
  readonly robots: MetaTagExample;
  readonly canonical: MetaTagExample;
  readonly fullSnippet: string;
}

/**
 * A single Open Graph property example.
 */
export interface OGPropertyExample {
  readonly property: string;
  readonly content: string;
  readonly description: string;
  readonly bestPractice: string;
}

/**
 * Open Graph Guide section data.
 */
export interface OpenGraphGuide {
  readonly properties: OGPropertyExample[];
  readonly fullSnippet: string;
}

/**
 * A single Twitter Card property example.
 */
export interface TwitterCardProperty {
  readonly name: string;
  readonly content: string;
  readonly description: string;
  readonly bestPractice: string;
}

/**
 * Twitter/X Card Guide section data.
 */
export interface TwitterCardGuide {
  readonly properties: TwitterCardProperty[];
  readonly fullSnippet: string;
}

/**
 * A JSON-LD schema example.
 */
export interface JsonLdExample {
  readonly schemaType: string;
  readonly description: string;
  readonly snippet: string;
  readonly useCase: string;
}

/**
 * JSON-LD Schema section data.
 */
export interface JsonLdGuide {
  readonly schemas: JsonLdExample[];
}

/**
 * Image size specification entry.
 */
export interface ImageSizeSpec {
  readonly platform: string;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: string;
  readonly format: string;
  readonly maxFileSize: string;
  readonly notes: string;
}

/**
 * Image Specifications section data.
 */
export interface ImageSpecsGuide {
  readonly specs: ImageSizeSpec[];
}

/**
 * Complete data for the SEO Documentation brand book page.
 */
export interface SeoDocumentationPageData {
  readonly metaTags: MetaTagsGuide;
  readonly openGraph: OpenGraphGuide;
  readonly twitterCard: TwitterCardGuide;
  readonly jsonLd: JsonLdGuide;
  readonly imageSpecs: ImageSpecsGuide;
}

/**
 * Brand profile subset for SEO documentation generation.
 */
export interface SeoBrandProfile {
  readonly brandName?: string;
  readonly domain?: string;
  readonly tagline?: string;
  readonly logoUrl?: string;
  readonly socialHandles?: {
    readonly twitter?: string;
    readonly linkedin?: string;
    readonly instagram?: string;
  };
  readonly industry?: string;
}

/**
 * Escape HTML entities for safe embedding in code snippets.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Build meta tags guide section from brand data.
 */
function buildMetaTagsGuide(
  brandName: string,
  domain: string,
  tagline: string,
): MetaTagsGuide {
  const titleValue = `${brandName} — ${tagline}`.slice(0, 60);
  const descriptionValue =
    `${tagline}. Discover what ${brandName} offers for your business.`.slice(0, 155);

  const title: MetaTagExample = {
    tag: 'title',
    attribute: '',
    value: titleValue,
    description: 'The page title shown in search results and browser tabs.',
    maxLength: 60,
    bestPractice:
      'Keep under 60 characters. Include brand name as suffix. Front-load primary keyword.',
  };

  const description: MetaTagExample = {
    tag: 'meta',
    attribute: 'name="description"',
    value: descriptionValue,
    description: 'The page description shown below the title in search results.',
    maxLength: 155,
    bestPractice:
      'Keep under 155 characters. Include a call-to-action. Use natural language with keywords.',
  };

  const robots: MetaTagExample = {
    tag: 'meta',
    attribute: 'name="robots"',
    value: 'index, follow',
    description: 'Instructs search engine crawlers on indexing and link-following behavior.',
    bestPractice:
      'Use "index, follow" for public pages. Use "noindex, nofollow" for private/admin pages.',
  };

  const canonical: MetaTagExample = {
    tag: 'link',
    attribute: 'rel="canonical"',
    value: `https://${domain}`,
    description: 'Declares the preferred URL for this page to prevent duplicate content issues.',
    bestPractice:
      'Always use absolute URLs. Self-referencing canonicals on every page. One canonical per page.',
  };

  const fullSnippet = [
    `${escapeHtml(`<title>${titleValue}</title>`)}`,
    `${escapeHtml(`<meta name="description" content="${descriptionValue}" />`)}`,
    `${escapeHtml(`<meta name="robots" content="index, follow" />`)}`,
    `${escapeHtml(`<link rel="canonical" href="https://${domain}" />`)}`,
  ].join('\n');

  return { title, description, robots, canonical, fullSnippet };
}

/**
 * Build Open Graph guide section from brand data.
 */
function buildOpenGraphGuide(
  brandName: string,
  domain: string,
  tagline: string,
): OpenGraphGuide {
  const properties: OGPropertyExample[] = [
    {
      property: 'og:title',
      content: `${brandName} — ${tagline}`.slice(0, 60),
      description: 'The title displayed when the page is shared on social platforms.',
      bestPractice:
        'Match or closely align with the page title. Keep concise and compelling.',
    },
    {
      property: 'og:description',
      content: `${tagline}. Learn more about ${brandName}.`.slice(0, 155),
      description: 'A brief summary shown below the title in social share previews.',
      bestPractice:
        'Keep under 155 characters. Make it compelling — this is your social elevator pitch.',
    },
    {
      property: 'og:type',
      content: 'website',
      description:
        'The type of content. Use "website" for homepages, "article" for blog posts.',
      bestPractice:
        'Use "website" for main pages, "article" for blog/editorial, "product" for e-commerce.',
    },
    {
      property: 'og:image',
      content: `https://${domain}/og-image-1200x630.png`,
      description:
        'The image displayed in social share previews. This is the most impactful OG tag.',
      bestPractice:
        'Use 1200x630px (1.91:1 ratio). Keep important content centered. Under 5MB. PNG or JPG.',
    },
    {
      property: 'og:url',
      content: `https://${domain}`,
      description: 'The canonical URL for this page in social shares.',
      bestPractice:
        'Always use absolute URLs. Should match the canonical link tag.',
    },
  ];

  const fullSnippet = properties
    .map(
      (p) =>
        escapeHtml(`<meta property="${p.property}" content="${p.content}" />`),
    )
    .join('\n');

  return { properties, fullSnippet };
}

/**
 * Build Twitter/X Card guide section from brand data.
 */
function buildTwitterCardGuide(
  brandName: string,
  domain: string,
  twitterHandle: string,
): TwitterCardGuide {
  const handle = twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`;

  const properties: TwitterCardProperty[] = [
    {
      name: 'twitter:card',
      content: 'summary_large_image',
      description:
        'The card type. "summary_large_image" shows a large image preview in the timeline.',
      bestPractice:
        'Use "summary_large_image" for pages with strong visuals. Use "summary" for text-focused content.',
    },
    {
      name: 'twitter:site',
      content: handle,
      description: 'The Twitter/X handle of the brand account.',
      bestPractice:
        'Include the @ prefix. This attributes the card to your brand in analytics.',
    },
    {
      name: 'twitter:image',
      content: `https://${domain}/twitter-image-1200x600.png`,
      description:
        'The image shown in the Twitter/X card preview. Optimized for the platform.',
      bestPractice:
        'Use 1200x600px (2:1 ratio). Under 5MB. Images are cropped to center.',
    },
  ];

  const fullSnippet = properties
    .map(
      (p) => escapeHtml(`<meta name="${p.name}" content="${p.content}" />`),
    )
    .join('\n');

  return { properties, fullSnippet };
}

/**
 * Build JSON-LD schema examples from brand data.
 */
function buildJsonLdGuide(
  brandName: string,
  domain: string,
  logoUrl: string,
  socialProfiles: string[],
): JsonLdGuide {
  const organizationSchema = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brandName,
      url: `https://${domain}`,
      logo: logoUrl,
      sameAs: socialProfiles,
    },
    null,
    2,
  );

  const articleSchema = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `[Article Title] | ${brandName}`,
      author: {
        '@type': 'Organization',
        name: brandName,
      },
      publisher: {
        '@type': 'Organization',
        name: brandName,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
      },
      datePublished: '[YYYY-MM-DD]',
      dateModified: '[YYYY-MM-DD]',
      image: `https://${domain}/[article-image].jpg`,
    },
    null,
    2,
  );

  const productSchema = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `[Product Name] by ${brandName}`,
      description: '[Product description]',
      brand: {
        '@type': 'Brand',
        name: brandName,
      },
      image: `https://${domain}/[product-image].jpg`,
      offers: {
        '@type': 'Offer',
        price: '[Price]',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    null,
    2,
  );

  const schemas: JsonLdExample[] = [
    {
      schemaType: 'Organization',
      description:
        'Establishes your brand identity in search results with logo, social profiles, and official information.',
      snippet: organizationSchema,
      useCase: 'Homepage and About page. Required for Knowledge Panel in Google.',
    },
    {
      schemaType: 'Article',
      description:
        'Marks up blog posts and editorial content for rich search results with authorship and publish dates.',
      snippet: articleSchema,
      useCase: 'Blog posts, news articles, editorial content pages.',
    },
    {
      schemaType: 'Product',
      description:
        'Enables rich product snippets in search results with pricing, availability, and brand attribution.',
      snippet: productSchema,
      useCase: 'Product pages, service listings, e-commerce catalog.',
    },
  ];

  return { schemas };
}

/**
 * Build image size specifications.
 */
function buildImageSpecs(): ImageSpecsGuide {
  const specs: ImageSizeSpec[] = [
    {
      platform: 'Open Graph',
      width: 1200,
      height: 630,
      aspectRatio: '1.91:1',
      format: 'PNG, JPG',
      maxFileSize: '< 5 MB',
      notes:
        'Primary social sharing image. Used by Facebook, LinkedIn, Discord, Slack, and most platforms.',
    },
    {
      platform: 'Twitter/X Card',
      width: 1200,
      height: 600,
      aspectRatio: '2:1',
      format: 'PNG, JPG',
      maxFileSize: '< 5 MB',
      notes:
        'Twitter-optimized image. Cropped to center. summary_large_image card type.',
    },
    {
      platform: 'Schema.org Logo',
      width: 600,
      height: 60,
      aspectRatio: '10:1',
      format: 'PNG, SVG',
      maxFileSize: '< 1 MB',
      notes:
        'Logo for JSON-LD Organization schema. Google recommends rectangular format.',
    },
    {
      platform: 'Favicon',
      width: 32,
      height: 32,
      aspectRatio: '1:1',
      format: 'ICO, PNG, SVG',
      maxFileSize: '< 100 KB',
      notes: 'Browser tab icon. Also provide 16x16 and 180x180 (Apple Touch Icon).',
    },
  ];

  return { specs };
}

/**
 * Extract SEO documentation page data for brand book rendering.
 *
 * Auto-populates all examples with brand-specific data.
 * Falls back to sensible defaults when brand profile data is incomplete.
 *
 * @param profile - Brand profile data (optional, uses defaults if missing)
 * @returns Complete SEO documentation page data
 */
export function extractSeoDocumentationPageData(
  profile?: SeoBrandProfile,
): SeoDocumentationPageData {
  const brandName = profile?.brandName ?? 'Brand Name';
  const domain = profile?.domain ?? 'example.com';
  const tagline = profile?.tagline ?? 'Your brand tagline here';
  const logoUrl =
    profile?.logoUrl ?? `https://${domain}/logo.svg`;
  const twitterHandle = profile?.socialHandles?.twitter ?? '@yourbrand';

  const socialProfiles: string[] = [];
  if (profile?.socialHandles?.twitter) {
    socialProfiles.push(
      `https://twitter.com/${profile.socialHandles.twitter.replace('@', '')}`,
    );
  }
  if (profile?.socialHandles?.linkedin) {
    socialProfiles.push(
      `https://linkedin.com/company/${profile.socialHandles.linkedin}`,
    );
  }
  if (profile?.socialHandles?.instagram) {
    socialProfiles.push(
      `https://instagram.com/${profile.socialHandles.instagram}`,
    );
  }
  if (socialProfiles.length === 0) {
    socialProfiles.push(`https://example.com/social/${twitterHandle.replace('@', '')}`);
  }

  return {
    metaTags: buildMetaTagsGuide(brandName, domain, tagline),
    openGraph: buildOpenGraphGuide(brandName, domain, tagline),
    twitterCard: buildTwitterCardGuide(brandName, domain, twitterHandle),
    jsonLd: buildJsonLdGuide(brandName, domain, logoUrl, socialProfiles),
    imageSpecs: buildImageSpecs(),
  };
}
