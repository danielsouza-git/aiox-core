# Meta Pixel Setup

```yaml
task:
  id: meta-pixel-setup
  name: "Meta Pixel Setup"
  agent: analytics-specialist
  squad: branding
  type: analytics
```

## Proposito

Set up the Meta Pixel for a branding client's website, configuring standard events for conversion tracking, custom conversions, and verification through the Pixel Helper, enabling Meta Ads optimization and remarketing audiences.

## Input

- Meta Business Suite account access
- Client website URL
- Conversion goals (leads, contact forms, content views)
- GTM container ID (for deployment via GTM)

## Output

- Meta Pixel created and configured
- Standard events mapped (PageView, Lead, ViewContent, Contact)
- Custom conversions defined
- Pixel verified via Pixel Helper
- Setup documentation

## Workflow

### Passo 1: Create Pixel
Create a new Meta Pixel in the client's Meta Business Suite account with a descriptive name matching the project.

### Passo 2: Install Base Code
Deploy the base pixel code via GTM or provide the code snippet for direct installation on all pages.

### Passo 3: Configure Standard Events
Set up standard events: PageView (all pages), Lead (form submissions), ViewContent (key pages), Contact (contact forms).

### Passo 4: Define Custom Conversions
Create custom conversions in Meta Business Suite for specific URL-based or event-based conversion actions.

### Passo 5: Verify and Document
Verify pixel firing using the Meta Pixel Helper browser extension and document the full setup with event mappings.

## O que faz

- Creates and configures Meta Pixel for conversion tracking
- Deploys standard events aligned with client conversion goals
- Defines custom conversions for specific business actions
- Verifies pixel functionality using official diagnostic tools
- Documents the complete setup for team reference

## O que NAO faz

- Does not create Meta Ads campaigns or ad sets
- Does not configure Conversions API (CAPI) for server-side tracking
- Does not manage Meta Business Suite account permissions

## Ferramentas

- **Meta Business Suite** -- Pixel creation and custom conversion configuration
- **Meta Pixel Helper** -- Browser extension for pixel verification
- **Google Tag Manager** -- Pixel deployment via GTM tags

## Quality Gate

- Threshold: >70%
- Pixel firing PageView event on all pages
- At least one standard conversion event (Lead or Contact) verified
- Pixel Helper shows no errors or warnings

---
*Squad Branding Task*
