# UTM Strategy

```yaml
task:
  id: utm-strategy
  name: "UTM Strategy"
  agent: analytics-specialist
  squad: branding
  type: analytics
```

## Proposito

Define and document a comprehensive UTM parameter strategy for a branding client, establishing naming conventions, creating a URL builder template, and providing guidelines for consistent campaign attribution across all marketing channels.

## Input

- Client's active marketing channels (social, email, paid, organic)
- Campaign naming conventions (if existing)
- Analytics platform (GA4) property details
- Team members who will use UTM parameters

## Output

- UTM naming convention document
- URL builder template (spreadsheet or tool)
- Channel-specific UTM guidelines
- Example URLs for each channel type

## Workflow

### Passo 1: Define Naming Conventions
Establish consistent rules for each UTM parameter: utm_source (platform), utm_medium (channel type), utm_campaign (campaign name), utm_content (variant), utm_term (keyword).

### Passo 2: Create Channel Templates
Build pre-filled templates for each marketing channel with the correct source/medium combinations (e.g., google/cpc, facebook/social, newsletter/email).

### Passo 3: Build URL Generator
Create a simple URL builder (spreadsheet formula or script) that team members can use to generate properly formatted UTM URLs.

### Passo 4: Document Guidelines
Write clear guidelines covering lowercase usage, separator conventions (hyphens over underscores), and naming examples for common scenarios.

### Passo 5: Distribute and Train
Share the UTM strategy document and URL builder with all team members who create marketing links.

## O que faz

- Establishes consistent UTM naming conventions for all channels
- Creates reusable channel-specific URL templates
- Provides a URL builder tool for non-technical team members
- Documents clear guidelines with real-world examples
- Enables accurate campaign attribution in GA4

## O que NAO faz

- Does not create marketing campaigns or ad content
- Does not configure GA4 campaign reports (that is part of ga4-setup)
- Does not manage link shortening or redirect services

## Ferramentas

- **UTM Builder** -- Spreadsheet or script for URL generation
- **Documentation** -- Naming convention and guideline templates

## Quality Gate

- Threshold: >70%
- All five UTM parameters have documented conventions
- URL builder produces correctly formatted URLs
- At least one example URL provided per active marketing channel

---
*Squad Branding Task*
