/**
 * Layout Token Integration Tests (PDL-8)
 *
 * Tests token substitution, fallback behavior, and visual output
 * for different layout families across shared components and templates.
 */

import React from 'react';
import type { TokenSet, LayoutTokenFlat } from '../types';
import { resolveCardRadius, resolveShadow } from '../types';
import { BrandBar } from '../templates/shared/brand-bar';
import { Headline } from '../templates/shared/headline';
import { CtaBadge } from '../templates/shared/cta-badge';
import { InstagramFeedSquare } from '../templates/instagram/feed-square';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * InstagramFeedSquare delegates to variant sub-components via JSX.
 * The returned element has type=VariantFunction, props={tokens, content}.
 * To inspect the actual rendered DOM tree, we call el.type(el.props).
 */
function renderVariant(tokens: TokenSet, variant: string, content?: Record<string, unknown>) {
  const el = InstagramFeedSquare({
    tokens,
    content: { ...BASE_CONTENT, variant: variant as any, ...content },
  });
  // Unwrap: el is <VariantFn .../>, call it to get the actual JSX tree
  if (typeof el.type === 'function') {
    return (el.type as Function)(el.props);
  }
  return el;
}

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const BASE_TOKENS: TokenSet = {
  color: {
    primary: { $value: '#1a1a2e', $type: 'color' },
    secondary: { $value: '#e94560', $type: 'color' },
    neutral50: { $value: '#f5f5f5', $type: 'color' },
  },
  typography: {
    heading: {
      fontFamily: { $value: 'Inter', $type: 'fontFamily' },
      fontSize: { $value: 36, $type: 'dimension' },
    },
    body: {
      fontFamily: { $value: 'Inter', $type: 'fontFamily' },
    },
  },
  spacing: {
    md: { $value: 16, $type: 'dimension' },
  },
};

const LAYOUT_ROUNDED: LayoutTokenFlat = {
  family: 'rounded-friendly',
  cornerRadiusBase: '24px',
  cornerRadiusSmall: '12px',
  whitespaceMultiplier: 1.3,
  contentPadding: '48px',
  cardShape: 'rounded',
  shadowIntensity: 'medium',
  dividerStyle: 'solid',
};

const LAYOUT_SHARP: LayoutTokenFlat = {
  family: 'sharp-corporate',
  cornerRadiusBase: '0px',
  cornerRadiusSmall: '0px',
  whitespaceMultiplier: 1.0,
  contentPadding: '60px',
  cardShape: 'sharp',
  shadowIntensity: 'none',
  dividerStyle: 'none',
};

const LAYOUT_PILL: LayoutTokenFlat = {
  family: 'playful-soft',
  cornerRadiusBase: '32px',
  cornerRadiusSmall: '16px',
  whitespaceMultiplier: 1.5,
  contentPadding: '64px',
  cardShape: 'pill',
  shadowIntensity: 'deep',
  dividerStyle: 'dashed',
};

const TOKENS_WITH_LAYOUT: TokenSet = {
  ...BASE_TOKENS,
  layout: LAYOUT_ROUNDED,
};

const TOKENS_WITH_SHARP: TokenSet = {
  ...BASE_TOKENS,
  layout: LAYOUT_SHARP,
};

const TOKENS_WITH_PILL: TokenSet = {
  ...BASE_TOKENS,
  layout: LAYOUT_PILL,
};

const BASE_CONTENT = {
  headline: 'Test Headline',
  body: 'Test body text',
  stat: '87%',
  ctaText: 'Learn More',
  logoUrl: 'https://example.com/logo.png',
  variant: 'quote' as const,
};

// ---------------------------------------------------------------------------
// resolveCardRadius
// ---------------------------------------------------------------------------

describe('resolveCardRadius', () => {
  it('returns fallback when layout is undefined', () => {
    expect(resolveCardRadius(undefined, '16px')).toBe('16px');
  });

  it('resolves sharp to 0px', () => {
    expect(resolveCardRadius(LAYOUT_SHARP, '16px')).toBe('0px');
  });

  it('resolves subtle to 8px', () => {
    const subtle = { ...LAYOUT_ROUNDED, cardShape: 'subtle' };
    expect(resolveCardRadius(subtle, '16px')).toBe('8px');
  });

  it('resolves rounded to 16px', () => {
    expect(resolveCardRadius(LAYOUT_ROUNDED, '0px')).toBe('16px');
  });

  it('resolves pill to 999px', () => {
    expect(resolveCardRadius(LAYOUT_PILL, '0px')).toBe('999px');
  });

  it('returns fallback for unknown cardShape', () => {
    const unknown = { ...LAYOUT_ROUNDED, cardShape: 'diamond' };
    expect(resolveCardRadius(unknown, '12px')).toBe('12px');
  });
});

// ---------------------------------------------------------------------------
// resolveShadow
// ---------------------------------------------------------------------------

describe('resolveShadow', () => {
  it('returns fallback when layout is undefined', () => {
    expect(resolveShadow(undefined, 'none')).toBe('none');
  });

  it('resolves none to none', () => {
    expect(resolveShadow(LAYOUT_SHARP, '0 2px 8px rgba(0,0,0,0.08)')).toBe('none');
  });

  it('resolves light to light shadow', () => {
    const light = { ...LAYOUT_ROUNDED, shadowIntensity: 'light' };
    expect(resolveShadow(light, 'none')).toBe('0 2px 8px rgba(0,0,0,0.08)');
  });

  it('resolves medium to medium shadow', () => {
    expect(resolveShadow(LAYOUT_ROUNDED, 'none')).toBe('0 4px 16px rgba(0,0,0,0.12)');
  });

  it('resolves deep to deep shadow', () => {
    expect(resolveShadow(LAYOUT_PILL, 'none')).toBe('0 8px 32px rgba(0,0,0,0.18)');
  });

  it('returns fallback for unknown shadowIntensity', () => {
    const unknown = { ...LAYOUT_ROUNDED, shadowIntensity: 'ultra' };
    expect(resolveShadow(unknown, 'none')).toBe('none');
  });
});

// ---------------------------------------------------------------------------
// LayoutTokenFlat on TokenSet — backward compatibility (AC-6)
// ---------------------------------------------------------------------------

describe('TokenSet backward compatibility', () => {
  it('accepts TokenSet without layout field', () => {
    const tokens: TokenSet = { ...BASE_TOKENS };
    expect(tokens.layout).toBeUndefined();
  });

  it('accepts TokenSet with layout field', () => {
    expect(TOKENS_WITH_LAYOUT.layout).toBeDefined();
    expect(TOKENS_WITH_LAYOUT.layout!.family).toBe('rounded-friendly');
  });

  it('layout tokens are accessible via optional chaining', () => {
    // With layout
    expect(TOKENS_WITH_LAYOUT.layout?.cornerRadiusBase).toBe('24px');
    expect(TOKENS_WITH_LAYOUT.layout?.contentPadding).toBe('48px');
    expect(TOKENS_WITH_LAYOUT.layout?.cardShape).toBe('rounded');
    expect(TOKENS_WITH_LAYOUT.layout?.shadowIntensity).toBe('medium');

    // Without layout
    expect(BASE_TOKENS.layout?.cornerRadiusBase).toBeUndefined();
  });

  it('nullish coalescing provides fallback when layout is absent', () => {
    const radius = BASE_TOKENS.layout?.cornerRadiusBase ?? '16px';
    expect(radius).toBe('16px');

    const padding = BASE_TOKENS.layout?.contentPadding ?? '60px';
    expect(padding).toBe('60px');
  });
});

// ---------------------------------------------------------------------------
// BrandBar — layout token integration (AC-7)
// ---------------------------------------------------------------------------

describe('BrandBar with layout tokens', () => {
  it('renders without layout tokens (fallback)', () => {
    const el = BrandBar({ tokens: BASE_TOKENS, logoUrl: 'logo.png' });
    expect(el).toBeDefined();
    expect(el.props.style.borderRadius).toBe('0px');
  });

  it('uses cornerRadiusSmall from layout tokens', () => {
    const el = BrandBar({ tokens: TOKENS_WITH_LAYOUT, logoUrl: 'logo.png' });
    expect(el.props.style.borderRadius).toBe('12px');
  });

  it('uses contentPadding from layout tokens for logo section', () => {
    const el = BrandBar({ tokens: TOKENS_WITH_LAYOUT, logoUrl: 'logo.png' });
    // The logo container is the second child (after color strip)
    const logoContainer = el.props.children[1];
    expect(logoContainer.props.style.padding).toBe('48px');
  });

  it('uses sharp layout values', () => {
    const el = BrandBar({ tokens: TOKENS_WITH_SHARP, logoUrl: 'logo.png' });
    expect(el.props.style.borderRadius).toBe('0px');
  });
});

// ---------------------------------------------------------------------------
// Headline — layout token integration (AC-7)
// ---------------------------------------------------------------------------

describe('Headline with layout tokens', () => {
  it('renders without layout tokens (default lineHeight 1.2)', () => {
    const el = Headline({ tokens: BASE_TOKENS, text: 'Hello' });
    const span = el.props.children;
    expect(span.props.style.lineHeight).toBe(1.2);
  });

  it('scales lineHeight by whitespaceMultiplier', () => {
    const el = Headline({ tokens: TOKENS_WITH_LAYOUT, text: 'Hello' });
    const span = el.props.children;
    // 1.2 * 1.3 = 1.56
    expect(span.props.style.lineHeight).toBeCloseTo(1.56, 2);
  });

  it('uses 1.0 multiplier for sharp layout (no change)', () => {
    const el = Headline({ tokens: TOKENS_WITH_SHARP, text: 'Hello' });
    const span = el.props.children;
    expect(span.props.style.lineHeight).toBe(1.2);
  });

  it('applies higher multiplier for pill layout', () => {
    const el = Headline({ tokens: TOKENS_WITH_PILL, text: 'Hello' });
    const span = el.props.children;
    // 1.2 * 1.5 = 1.8
    expect(span.props.style.lineHeight).toBeCloseTo(1.8, 2);
  });
});

// ---------------------------------------------------------------------------
// CtaBadge — layout token integration (AC-4, AC-7)
// ---------------------------------------------------------------------------

describe('CtaBadge with layout tokens', () => {
  it('renders with pill border-radius fallback when no layout', () => {
    const el = CtaBadge({ tokens: BASE_TOKENS, text: 'Buy Now' });
    expect(el.props.style.borderRadius).toBe('999px');
  });

  it('uses cardShape rounded -> 16px', () => {
    const el = CtaBadge({ tokens: TOKENS_WITH_LAYOUT, text: 'Buy Now' });
    expect(el.props.style.borderRadius).toBe('16px');
  });

  it('uses cardShape sharp -> 0px', () => {
    const el = CtaBadge({ tokens: TOKENS_WITH_SHARP, text: 'Buy Now' });
    expect(el.props.style.borderRadius).toBe('0px');
  });

  it('uses cardShape pill -> 999px', () => {
    const el = CtaBadge({ tokens: TOKENS_WITH_PILL, text: 'Buy Now' });
    expect(el.props.style.borderRadius).toBe('999px');
  });
});

// ---------------------------------------------------------------------------
// InstagramFeedSquare — layout token integration (AC-2, AC-3, AC-4, AC-5)
// ---------------------------------------------------------------------------

describe('InstagramFeedSquare with layout tokens', () => {
  describe('Quote variant', () => {
    it('renders without layout tokens (fallback padding 80px)', () => {
      const el = renderVariant(BASE_TOKENS, 'quote');
      const contentDiv = el.props.children[0];
      expect(contentDiv.props.style.padding).toBe('80px');
    });

    it('uses contentPadding from layout tokens', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'quote');
      const contentDiv = el.props.children[0];
      expect(contentDiv.props.style.padding).toBe('48px');
    });

    it('applies shadow from layout tokens', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'quote');
      expect(el.props.style.boxShadow).toBe('0 4px 16px rgba(0,0,0,0.12)');
    });

    it('no shadow when layout is absent', () => {
      const el = renderVariant(BASE_TOKENS, 'quote');
      expect(el.props.style.boxShadow).toBe('none');
    });
  });

  describe('Tip variant', () => {
    it('uses cornerRadiusBase from layout for tip badge', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'tip');
      // Navigate: root > [accentBar, contentDiv, ctaDiv?, brandBar]
      const contentDiv = el.props.children[1];
      const tipBadge = contentDiv.props.children[0];
      expect(tipBadge.props.style.borderRadius).toBe('24px');
    });

    it('falls back to 16px without layout', () => {
      const el = renderVariant(BASE_TOKENS, 'tip');
      const contentDiv = el.props.children[1];
      const tipBadge = contentDiv.props.children[0];
      expect(tipBadge.props.style.borderRadius).toBe('16px');
    });
  });

  describe('Statistic variant', () => {
    it('uses contentPadding from layout', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'statistic');
      const innerDiv = el.props.children[0];
      expect(innerDiv.props.style.padding).toBe('48px');
    });

    it('hides divider when dividerStyle is none', () => {
      const el = renderVariant(TOKENS_WITH_SHARP, 'statistic');
      const innerDiv = el.props.children[0];
      // divider is child index 1 (after stat span)
      const divider = innerDiv.props.children[1];
      expect(divider.props.style.height).toBe('0px');
    });

    it('shows divider with solid style (default)', () => {
      const el = renderVariant(BASE_TOKENS, 'statistic');
      const innerDiv = el.props.children[0];
      const divider = innerDiv.props.children[1];
      expect(divider.props.style.height).toBe('4px');
    });
  });

  describe('Question variant', () => {
    it('uses contentPadding from layout', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'question');
      // root > flex-1 container > [watermark, content area]
      const flexContainer = el.props.children[0];
      const contentArea = flexContainer.props.children[1];
      expect(contentArea.props.style.padding).toBe('48px');
    });

    it('uses cornerRadiusBase for question icon badge', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'question');
      const flexContainer = el.props.children[0];
      const contentArea = flexContainer.props.children[1];
      const iconBadge = contentArea.props.children[0];
      expect(iconBadge.props.style.borderRadius).toBe('24px');
    });
  });

  describe('Announcement variant', () => {
    it('uses cornerRadiusSmall for announcement tag', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'announcement');
      // root > [bannerHeader, detailBlock, brandBar]
      const banner = el.props.children[0];
      const tag = banner.props.children[0];
      expect(tag.props.style.borderRadius).toBe('12px');
    });

    it('falls back to 8px without layout', () => {
      const el = renderVariant(BASE_TOKENS, 'announcement');
      const banner = el.props.children[0];
      const tag = banner.props.children[0];
      expect(tag.props.style.borderRadius).toBe('8px');
    });

    it('uses contentPadding for banner padding', () => {
      const el = renderVariant(TOKENS_WITH_LAYOUT, 'announcement');
      const banner = el.props.children[0];
      expect(banner.props.style.padding).toBe('48px');
    });
  });
});

// ---------------------------------------------------------------------------
// Cross-family visual differentiation
// ---------------------------------------------------------------------------

describe('Layout family differentiation', () => {
  it('rounded-friendly produces different radius than sharp-corporate', () => {
    const rounded = renderVariant(TOKENS_WITH_LAYOUT, 'tip');
    const sharp = renderVariant(TOKENS_WITH_SHARP, 'tip');

    const roundedBadge = rounded.props.children[1].props.children[0];
    const sharpBadge = sharp.props.children[1].props.children[0];

    expect(roundedBadge.props.style.borderRadius).not.toBe(sharpBadge.props.style.borderRadius);
    expect(roundedBadge.props.style.borderRadius).toBe('24px');
    expect(sharpBadge.props.style.borderRadius).toBe('0px');
  });

  it('shadow differs between families', () => {
    const rounded = renderVariant(TOKENS_WITH_LAYOUT, 'tip');
    const sharp = renderVariant(TOKENS_WITH_SHARP, 'tip');
    const pill = renderVariant(TOKENS_WITH_PILL, 'tip');

    expect(rounded.props.style.boxShadow).toBe('0 4px 16px rgba(0,0,0,0.12)');
    expect(sharp.props.style.boxShadow).toBe('none');
    expect(pill.props.style.boxShadow).toBe('0 8px 32px rgba(0,0,0,0.18)');
  });

  it('all variants render without errors with any layout family', () => {
    const variants = ['quote', 'tip', 'statistic', 'question', 'announcement'] as const;
    const tokenSets = [BASE_TOKENS, TOKENS_WITH_LAYOUT, TOKENS_WITH_SHARP, TOKENS_WITH_PILL];

    for (const tokenSet of tokenSets) {
      for (const variant of variants) {
        expect(() => {
          renderVariant(tokenSet, variant);
        }).not.toThrow();
      }
    }
  });
});
