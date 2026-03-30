# Search Console Setup

```yaml
task:
  id: search-console-setup
  name: "Search Console Setup"
  agent: analytics-specialist
  squad: branding
  type: analytics
```

## Proposito

Set up and verify Google Search Console for a branding client's domain, submit the sitemap, configure URL inspection, and establish baseline performance tracking for organic search visibility.

## Input

- Client domain URL
- Google account with domain verification access
- Sitemap URL (if available)
- DNS or HTML verification method preference

## Output

- Search Console property verified and active
- Sitemap submitted and indexed
- Initial coverage report reviewed
- Performance tracking baseline established
- Setup documentation

## Workflow

### Passo 1: Verify Domain Ownership
Add the client's domain as a property in Search Console and complete verification using DNS TXT record, HTML file, or meta tag method.

### Passo 2: Submit Sitemap
Submit the sitemap.xml URL to Search Console and verify it is accepted with no errors.

### Passo 3: Review Coverage Report
Check the initial coverage report for indexing issues, crawl errors, or pages excluded from indexing that should be included.

### Passo 4: Configure URL Inspection
Use URL inspection to verify key pages (homepage, landing pages, service pages) are indexed and rendering correctly.

### Passo 5: Establish Baseline
Document the initial performance metrics (impressions, clicks, average position) as a baseline for future comparison.

## O que faz

- Verifies domain ownership in Google Search Console
- Submits sitemap for crawling and indexing
- Identifies and documents initial indexing issues
- Verifies key pages are properly indexed and rendered
- Establishes performance baselines for SEO tracking

## O que NAO faz

- Does not perform SEO optimization (seo-metadata-generate handles that)
- Does not fix website technical issues found in coverage reports
- Does not manage Google Ads or paid search campaigns

## Ferramentas

- **Google Search Console** -- Property verification, sitemap submission, coverage reports
- **DNS Provider** -- Domain verification via TXT records (if DNS method chosen)

## Quality Gate

- Threshold: >70%
- Domain ownership verified successfully
- Sitemap submitted with status "Success"
- Key pages confirmed as indexed via URL inspection

---
*Squad Branding Task*
