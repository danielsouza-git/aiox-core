'use strict';

const { validateLayoutTokens } = require('./validators/layout-token-validator');

/**
 * AI Layout Token Generator — PDL-4 / PDL-12
 *
 * Generates unique layout tokens via LLM for a brand, replacing
 * the deterministic family-based system as the PRIMARY path.
 * Family-based resolution remains as FALLBACK.
 *
 * Flow:
 *   Brand Profile + Layout Brief → Prompt Template → LLM → JSON → Validate → Tokens
 *
 * @module layout-engine/ai-layout-generator
 */

/** Default generation options. */
const AI_LAYOUT_DEFAULTS = {
  temperature: 0.7,
  maxTokens: 2000,
  maxRetries: 1,
  retryTemperature: 0.3,
};

/**
 * Build the prompt for AI layout token generation.
 *
 * @param {object} brandProfile - Brand profile with personality, archetypes, etc.
 * @param {object} [options] - Additional options
 * @param {string} [options.buildType] - Build type (brand-book, landing-page, etc.)
 * @param {string} [options.visualReferences] - Optional visual references
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildLayoutPrompt(brandProfile, options = {}) {
  const name = brandProfile.name || brandProfile.brandName || 'Unknown Brand';
  const archetypes = (brandProfile.personality && brandProfile.personality.archetypes) || [];
  const personality = (brandProfile.personality && brandProfile.personality.traits) || {};
  const industry = brandProfile.industryVertical || brandProfile.industry || 'general';
  const tone = brandProfile.toneSpectrum || brandProfile.tone || 'neutral';
  const buildType = options.buildType || 'brand-book';
  const visualRefs = options.visualReferences || '';

  const traitsJson = JSON.stringify({
    formalCasual: personality.formal_casual || personality.formalCasual || 3,
    traditionalModern: personality.traditional_modern || personality.traditionalModern || 3,
    seriousPlayful: personality.serious_playful || personality.seriousPlayful || 3,
    conservativeBold: personality.conservative_bold || personality.conservativeBold || 3,
    minimalExpressive: personality.minimal_expressive || personality.minimalExpressive || 3,
  });

  const systemPrompt = 'You are a brand design system architect who generates unique layout design tokens for brands. You output ONLY valid JSON — no markdown, no explanation, no extra text. Each brand MUST receive a UNIQUE layout that reflects its specific personality, archetypes, and industry. NEVER output generic or template-like values. Every value must be deliberately chosen to express this specific brand\'s visual identity.';

  const userPrompt = `Generate layout design tokens for **${name}** (${industry}).

Brand Archetypes (ordered by importance): ${archetypes.join(', ')}
Brand Personality: ${JSON.stringify(brandProfile.brandPersonality || archetypes)}
Tone: ${tone}
Personality Trait Scores: ${traitsJson}
Build Type: ${buildType}
${visualRefs ? `Visual References: ${visualRefs}` : ''}

Generate a JSON object with this EXACT structure. Every value must be UNIQUE to this brand — do not use generic defaults.

{
  "layout": {
    "family": {
      "name": { "$value": "<unique-family-name-for-this-brand>", "$type": "string", "$description": "<why this family fits>" }
    },
    "corner": {
      "radiusBase": { "$value": "<Npx>", "$type": "dimension", "$description": "<rationale>" },
      "radiusSmall": { "$value": "<Npx>", "$type": "dimension", "$description": "<rationale>" },
      "radiusLarge": { "$value": "<Npx>", "$type": "dimension", "$description": "<rationale>" }
    },
    "whitespace": {
      "density": { "$value": "<spacious|balanced|compact>", "$type": "string", "$description": "<rationale>" },
      "multiplier": { "$value": "<0.6-2.0>", "$type": "number", "$description": "<rationale>" },
      "sectionGap": { "$value": "<Npx>", "$type": "dimension", "$description": "<rationale>" },
      "contentPadding": { "$value": "<Npx>", "$type": "dimension", "$description": "<rationale>" }
    },
    "nav": {
      "style": { "$value": "<centered-top|sidebar-fixed|floating-bar|minimal-top|overlay-menu>", "$type": "string", "$description": "<rationale>" },
      "width": { "$value": "<value>", "$type": "dimension", "$description": "<rationale>" },
      "height": { "$value": "<value>", "$type": "dimension", "$description": "<rationale>" }
    },
    "divider": {
      "style": { "$value": "<organic-wave|solid-thick|dotted-light|gradient-fade|solid-thin|dashed-artistic>", "$type": "string", "$description": "<rationale>" },
      "height": { "$value": "<Npx>", "$type": "dimension", "$description": "<rationale>" }
    },
    "animation": {
      "entrance": { "$value": "<fade-up|slide-in|none|scale-up|blur-in|stagger-fade>", "$type": "string", "$description": "<rationale>" },
      "duration": { "$value": "<Nms>", "$type": "duration", "$description": "<rationale>" },
      "easing": { "$value": "<cubic-bezier(...)>", "$type": "cubicBezier", "$description": "<rationale>" }
    },
    "grid": {
      "rhythm": { "$value": "<centered-single|strict-grid|masonry|asymmetric|fluid-columns>", "$type": "string", "$description": "<rationale>" },
      "maxWidth": { "$value": "<Npx>", "$type": "dimension", "$description": "<rationale>" },
      "columns": { "$value": "<N>", "$type": "number", "$description": "<rationale>" }
    },
    "section": {
      "background": { "$value": "<soft-fill|flat-solid|gradient-subtle|textured|transparent>", "$type": "string", "$description": "<rationale>" },
      "heroHeight": { "$value": "<Nvh>", "$type": "dimension", "$description": "<rationale>" }
    },
    "component": {
      "cardShape": { "$value": "<pill|sharp|rounded|soft-square>", "$type": "string", "$description": "<rationale>" },
      "shadowIntensity": { "$value": "<none|light|medium|dramatic>", "$type": "string", "$description": "<rationale>" }
    }
  }
}

IMPORTANT:
- Output ONLY the JSON object, no markdown fences, no explanation
- Every $value must be a concrete value, not a placeholder
- Every $description must explain WHY this value fits ${name}
- Values must differ meaningfully from generic brand-book defaults
- Consider the brand's archetypes and personality when choosing every value`;

  return { systemPrompt, userPrompt };
}

/**
 * Extract JSON from an LLM response that may contain markdown fences or extra text.
 *
 * @param {string} text - Raw LLM output
 * @returns {object|null} Parsed JSON or null
 */
function extractJSON(text) {
  if (!text || typeof text !== 'string') return null;

  // Try direct parse first
  try {
    return JSON.parse(text.trim());
  } catch {
    // Continue to extraction
  }

  // Try extracting from markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // Continue
    }
  }

  // Try finding first { ... } block
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      return JSON.parse(text.slice(braceStart, braceEnd + 1));
    } catch {
      // Give up
    }
  }

  return null;
}

/**
 * Generate layout tokens via AI (LLM).
 *
 * @param {object} params
 * @param {object} params.brandProfile - Brand profile with personality, archetypes, name, industry
 * @param {object} params.aiService - AI service instance with generateText() method
 * @param {object} [params.options] - Generation options
 * @param {string} [params.options.buildType] - Build type
 * @param {string} [params.options.visualReferences] - Visual references
 * @param {number} [params.options.temperature] - LLM temperature (default 0.7)
 * @param {number} [params.options.maxTokens] - Max tokens (default 2000)
 * @param {number} [params.options.maxRetries] - Max retry attempts (default 1)
 * @param {object} [params.costTracker] - Cost tracker with canSubmit() for budget enforcement
 * @param {object} [params.logger] - Logger instance (optional)
 * @returns {Promise<{ tokens: object, source: 'ai' }|null>} Tokens or null on failure
 */
async function generateAILayoutTokens({ brandProfile, aiService, options = {}, costTracker, logger }) {
  const log = logger || { info: () => {}, warn: () => {}, error: () => {} };
  const brandName = brandProfile.name || brandProfile.brandName || 'Unknown';

  if (!aiService || typeof aiService.generateText !== 'function') {
    log.warn('AI layout generation skipped: no aiService provided');
    return null;
  }

  // PDL-13: Budget enforcement — check before calling LLM
  if (costTracker && typeof costTracker.canSubmit === 'function') {
    const clientId = brandProfile.clientId || brandName;
    try {
      const budgetOk = costTracker.canSubmit(clientId);
      if (!budgetOk) {
        log.warn(`AI layout generation skipped: budget exceeded for ${clientId}`);
        return null;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      log.warn(`AI layout generation skipped: budget check failed — ${msg}`);
      return null;
    }
  }

  const temperature = options.temperature ?? AI_LAYOUT_DEFAULTS.temperature;
  const maxTokens = options.maxTokens ?? AI_LAYOUT_DEFAULTS.maxTokens;
  const maxRetries = options.maxRetries ?? AI_LAYOUT_DEFAULTS.maxRetries;

  const { systemPrompt, userPrompt } = buildLayoutPrompt(brandProfile, options);

  // Attempt generation with retries
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const currentTemp = attempt === 0 ? temperature : AI_LAYOUT_DEFAULTS.retryTemperature;

    try {
      log.info(`AI layout generation attempt ${attempt + 1}/${maxRetries + 1} for ${brandName}`, {
        temperature: currentTemp,
      });

      const response = await aiService.generateText({
        prompt: userPrompt,
        systemPrompt,
        temperature: currentTemp,
        maxTokens,
        clientId: brandProfile.clientId || brandName,
      });

      const parsed = extractJSON(response.text);
      if (!parsed) {
        log.warn(`AI layout attempt ${attempt + 1}: failed to parse JSON from response`);
        continue;
      }

      // Validate token structure
      const validation = validateLayoutTokens(parsed);
      if (!validation.valid) {
        log.warn(`AI layout attempt ${attempt + 1}: token validation failed`, {
          errors: validation.errors,
        });
        continue;
      }

      log.info(`AI layout tokens generated successfully for ${brandName}`, {
        attempt: attempt + 1,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        costUsd: response.costUsd,
      });

      return { tokens: parsed, source: 'ai' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      log.error(`AI layout attempt ${attempt + 1} failed: ${msg}`);
    }
  }

  log.warn(`AI layout generation failed after ${maxRetries + 1} attempts for ${brandName}, will use fallback`);
  return null;
}

module.exports = {
  generateAILayoutTokens,
  buildLayoutPrompt,
  extractJSON,
  AI_LAYOUT_DEFAULTS,
};
