# GTM Setup

```yaml
task:
  id: gtm-setup
  name: "GTM Setup"
  agent: analytics-specialist
  squad: branding
  type: analytics
```

## Proposito

Configure a Google Tag Manager container for a branding client's website, setting up all necessary variables, triggers, and tags to deploy GA4, Meta Pixel, Google Ads tracking, and custom event tracking through a single tag management layer.

## Input

- Client website URL
- GA4 measurement ID
- Meta Pixel ID (if applicable)
- Google Ads conversion IDs (if applicable)
- Custom event definitions from GA4 setup

## Output

- GTM container configured and published
- GA4 tag deployed via GTM
- Variables, triggers, and tags for all tracking needs
- Container installation code (head + body snippets)
- Setup verification report

## Workflow

### Passo 1: Create GTM Container
Create a new GTM container for the client's web property and generate the installation code snippets.

### Passo 2: Configure Variables
Set up built-in variables (Page URL, Page Path, Click URL, Click Text, Form ID) and custom Data Layer variables for conversion tracking.

### Passo 3: Configure Triggers
Create triggers for Page View, DOM Ready, Window Loaded, CTA click elements, form submissions, and scroll depth thresholds.

### Passo 4: Deploy Tags
Add and configure tags: GA4 Configuration, GA4 Event tags for custom events, Conversion Linker (Google Ads), and Meta Pixel base code.

### Passo 5: Test and Publish
Use GTM Preview mode to verify all tags fire correctly, then publish the container version with descriptive release notes.

## O que faz

- Creates a centralized tag management container for all tracking
- Deploys GA4 tracking through GTM instead of hard-coded scripts
- Configures triggers for all conversion-relevant user interactions
- Provides a single installation point (2 code snippets) for the website
- Enables future tag additions without code changes

## O que NAO faz

- Does not install the GTM code on the website (web-builder handles that)
- Does not create the GA4 property (ga4-setup handles that)
- Does not manage Google Ads campaigns

## Ferramentas

- **Google Tag Manager** -- Container, tag, trigger, and variable configuration
- **GTM Preview Mode** -- Tag firing verification

## Quality Gate

- Threshold: >70%
- All tags firing correctly in GTM Preview mode
- GA4 receiving events through GTM (verified in GA4 DebugView)
- Container published with descriptive version notes

---
*Squad Branding Task*
