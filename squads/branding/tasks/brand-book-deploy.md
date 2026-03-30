# brand-book-deploy

```yaml
task: brandBookDeploy()
agent: brand-book-builder
squad: branding
prd_refs: [FR-1.12, NFR-1.2]

inputs:
  - name: brand_book_dist
    type: directory
    required: true
    source: brand-book-generate output
  - name: deploy_config
    type: DeployConfig
    required: true

outputs:
  - name: deploy_url
    type: url
    destination: .aiox/branding/{client}/deploy-info.json
  - name: deploy_report
    type: markdown
    destination: .aiox/branding/{client}/deploy-report.md

tools:
  - vercel-cli
  - netlify-cli
  - cloudflare-pages
```

## Purpose

Deploy Brand Book static site to hosting platform with custom domain support.

## Deployment Options

```yaml
hosting_options:
  vercel:
    command: vercel --prod
    features:
      - automatic_https
      - edge_network
      - preview_deploys
    pricing: free_to_pro

  netlify:
    command: netlify deploy --prod
    features:
      - automatic_https
      - forms
      - functions
    pricing: free_to_pro

  cloudflare_pages:
    command: wrangler pages deploy
    features:
      - automatic_https
      - fast_edge
      - free_bandwidth
    pricing: free

  github_pages:
    command: gh-pages -d dist
    features:
      - free
      - github_integration
    pricing: free

  any_static_host:
    method: file_upload
    features:
      - maximum_flexibility
    requirements: [ftp, sftp, s3_upload]
```

## Deploy Configuration

```yaml
DeployConfig:
  platform: vercel | netlify | cloudflare | github | custom
  project_name: "{client}-brand"
  custom_domain: "brand.{client}.com"  # optional
  environment: production | preview
```

## Deployment Process

```yaml
steps:
  - step: validate_build
    checks:
      - index_html_exists
      - assets_present
      - no_broken_links

  - step: select_platform
    input: deploy_config.platform
    fallback: vercel

  - step: deploy
    platform_specific:
      vercel:
        commands:
          - vercel login (if needed)
          - vercel --prod --name {project_name}

      netlify:
        commands:
          - netlify login (if needed)
          - netlify deploy --prod --dir dist

      cloudflare:
        commands:
          - wrangler pages deploy dist --project-name {project_name}

  - step: configure_domain
    if: custom_domain_provided
    actions:
      - add_cname_record
      - verify_dns
      - enable_https

  - step: verify_deployment
    checks:
      - site_accessible
      - https_enabled
      - all_pages_load
      - assets_load

  - step: generate_report
    include:
      - deploy_url
      - custom_domain (if configured)
      - ssl_status
      - performance_scores
```

## Custom Domain Setup

```yaml
domain_setup:
  method: cname
  record:
    type: CNAME
    name: brand (or @)
    value: {platform_domain}

  verification:
    - dns_propagation_check
    - ssl_certificate_issued
    - redirect_http_to_https

  documentation:
    - provide_dns_instructions
    - note_propagation_time (up to 48h)
```

## Deploy Report

```markdown
# Deployment Report: {client_name}

**Date:** {timestamp}
**Platform:** {platform}

## URLs

- **Production:** {deploy_url}
- **Custom Domain:** {custom_domain} (if configured)

## Status

| Check | Status |
|-------|--------|
| Deployment | ✅ Success |
| HTTPS | ✅ Enabled |
| Custom Domain | ✅/⏳/❌ |

## Performance (Lighthouse)

| Metric | Score |
|--------|-------|
| Performance | {score} |
| Accessibility | {score} |
| Best Practices | {score} |
| SEO | {score} |

## Next Steps

1. Share URL with client
2. Configure custom domain DNS (if not done)
3. Set up monitoring/analytics
```

## Pre-Conditions

- [ ] Brand book build complete
- [ ] Platform credentials configured
- [ ] Custom domain DNS access (if using)

## Post-Conditions

- [ ] Site deployed and accessible
- [ ] HTTPS enabled
- [ ] Report generated

## Acceptance Criteria

- [ ] Site loads in < 2 seconds
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Custom domain works (if configured)

## Quality Gate

- Threshold: >70%
- Deployed site accessible at configured URL
- All pages load without 404 errors
- SSL certificate active and valid

---
*Branding Squad Task - brand-book-builder*
