# Google Ads Tracking

```yaml
task:
  id: google-ads-tracking
  name: "Google Ads Tracking"
  agent: analytics-specialist
  squad: branding
  type: analytics
```

## Proposito

Configure Google Ads conversion tracking for a branding client's website, setting up conversion actions, deploying tracking via GTM, enabling enhanced conversions, and linking GA4 audiences for optimized ad delivery.

## Input

- Google Ads account access
- Conversion goals (lead forms, thank-you pages, CTA clicks)
- GTM container ID
- GA4 property ID (for audience linking)

## Output

- Conversion actions created in Google Ads
- Global site tag deployed via GTM
- Enhanced conversions enabled
- GA4 audiences linked to Google Ads
- Tracking verification report

## Workflow

### Passo 1: Create Conversion Actions
Define conversion actions in Google Ads for each conversion goal: lead form submissions, thank-you page views, and CTA micro-conversions.

### Passo 2: Deploy via GTM
Install the Google Ads global site tag and conversion tracking tags through the GTM container with appropriate triggers.

### Passo 3: Configure Enhanced Conversions
Enable enhanced conversions to improve tracking accuracy using first-party data (hashed email, phone) from form submissions.

### Passo 4: Link GA4 Audiences
Connect the GA4 property to Google Ads and import relevant remarketing audiences for campaign targeting.

### Passo 5: Verify Tracking
Use Google Ads Tag Assistant and the conversion status dashboard to verify all conversion actions are recording correctly.

## O que faz

- Creates conversion actions aligned with client business goals
- Deploys Google Ads tracking through centralized GTM container
- Enables enhanced conversions for improved attribution accuracy
- Links GA4 behavioral audiences for remarketing campaigns
- Verifies end-to-end conversion tracking functionality

## O que NAO faz

- Does not create or manage Google Ads campaigns, keywords, or budgets
- Does not set up offline conversion tracking
- Does not handle Google Ads billing or account structure

## Ferramentas

- **Google Ads** -- Conversion action creation and configuration
- **Google Tag Manager** -- Tag deployment and trigger management
- **Google Ads Tag Assistant** -- Tracking verification

## Quality Gate

- Threshold: >70%
- All conversion actions showing "Recording conversions" status
- Enhanced conversions enabled and receiving hashed data
- GA4 audiences linked and available in Google Ads

---
*Squad Branding Task*
