# GA4 Setup

```yaml
task:
  id: ga4-setup
  name: "GA4 Setup"
  agent: analytics-specialist
  squad: branding
  type: analytics
```

## Proposito

Set up a Google Analytics 4 property for a branding client's web presence, configuring data streams, enhanced measurement, custom events, conversions, and audience segments for remarketing.

## Input

- Client website URL(s)
- Google account with Analytics access
- Conversion goals (lead forms, CTA clicks, downloads)
- Remarketing audience definitions (if applicable)

## Output

- GA4 property configured and collecting data
- Custom events defined (form_submit, cta_click, scroll_depth, file_download)
- Conversions marked and tracking
- Audiences configured for remarketing
- Setup verification report

## Workflow

### Passo 1: Create GA4 Property
Create a new GA4 property in the client's Google Analytics account with the correct timezone and currency settings.

### Passo 2: Configure Data Stream
Add a web data stream for the client's domain, enable enhanced measurement (page views, scrolls, outbound clicks, site search, file downloads).

### Passo 3: Define Custom Events
Set up custom events for key conversion actions: form_submit, cta_click, scroll_depth (25/50/75/100%), file_download, and video_engagement.

### Passo 4: Mark Conversions
Flag the primary conversion events (form_submit, cta_click) as conversions in the GA4 interface.

### Passo 5: Configure Audiences
Create remarketing audiences based on user behavior (e.g., visitors who scrolled 75%+, form starters who did not submit).

## O que faz

- Creates and configures GA4 property with proper settings
- Enables enhanced measurement for automatic event tracking
- Defines custom events aligned with client conversion goals
- Marks key events as conversions for reporting
- Builds remarketing audiences for advertising platforms

## O que NAO faz

- Does not install the tracking code on the website (GTM setup handles that)
- Does not create Google Ads campaigns or ad groups
- Does not configure server-side tracking (CAPI)

## Ferramentas

- **Google Analytics Admin API** -- Property and stream configuration
- **GA4 Interface** -- Event and conversion configuration

## Quality Gate

- Threshold: >70%
- GA4 property receiving real-time data after installation
- All custom events firing correctly (verified via DebugView)
- At least one conversion event marked and tracking

---
*Squad Branding Task*
