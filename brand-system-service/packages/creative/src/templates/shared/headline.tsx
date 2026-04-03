/**
 * Headline — Shared sub-component for social media templates.
 *
 * Renders a styled headline text block driven by brand tokens.
 * Uses flexbox only (no CSS Grid — ADR-005 / Satori constraint).
 * Inline styles only — no CSS classes, no Tailwind, no CSS modules.
 *
 * PDL-8: Spacing multiplied by layout whitespaceMultiplier when present.
 */

import React from 'react';
import type { TokenSet } from '../../types';
import { tokenStr, tokenNum } from '../../types';

export interface HeadlineProps {
  readonly tokens: TokenSet;
  readonly text: string;
  /** Override font size in pixels */
  readonly fontSize?: number;
  /** Override text color */
  readonly color?: string;
  /** Text alignment (default: 'left') */
  readonly align?: 'left' | 'center' | 'right';
  /** Maximum number of lines before ellipsis (no built-in Satori support, visual hint only) */
  readonly maxLines?: number;
}

/**
 * Headline component — styled headline block with token-driven font.
 */
export function Headline({
  tokens,
  text,
  fontSize,
  color,
  align = 'left',
}: HeadlineProps): React.ReactElement {
  const headingGroup = tokens.typography
    ? (tokens.typography.heading as Record<string, unknown>)
    : undefined;

  const fontFamily = headingGroup
    ? tokenStr(headingGroup as import('../../types').TokenGroup, 'fontFamily', 'sans-serif')
    : 'sans-serif';

  const defaultSize = headingGroup
    ? tokenNum(headingGroup as import('../../types').TokenGroup, 'fontSize', 32)
    : 32;

  const resolvedColor = color ?? tokenStr(tokens.color, 'primary', '#111111');

  // PDL-8: Scale line-height and letter-spacing by whitespace multiplier
  const wsMultiplier = tokens.layout?.whitespaceMultiplier ?? 1;
  const lineHeight = 1.2 * wsMultiplier;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: fontSize ?? defaultSize,
          fontWeight: 700,
          color: resolvedColor,
          textAlign: align,
          lineHeight,
          letterSpacing: '-0.02em',
        }}
      >
        {text}
      </span>
    </div>
  );
}
