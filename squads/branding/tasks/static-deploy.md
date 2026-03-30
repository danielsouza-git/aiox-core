# static-deploy

```yaml
task: staticDeploy()
agent: web-builder
squad: branding
prd_refs: [FR-3.6, NFR-9.3]

inputs:
  - name: static_package
    type: directory
    required: true
  - name: deploy_config
    type: DeployConfig
    required: true

outputs:
  - name: deploy_url
    type: url
    destination: .aiox/branding/{client}/deploys/{deploy_id}.json
  - name: deploy_report
    type: markdown
    destination: .aiox/branding/{client}/deploys/{deploy_id}-report.md

tools:
  - vercel-cli
  - netlify-cli
  - wrangler
  - gh-pages
```

## Purpose

Deploy static site to any hosting platform (Vercel, Netlify, Cloudflare Pages, GitHub Pages, or custom).

## Supported Platforms

```yaml
platforms:
  vercel:
    cli: vercel
    deploy_command: vercel --prod
    features:
      - automatic_https
      - edge_functions
      - preview_deploys
      - analytics
    domain: *.vercel.app or custom
    pricing: free_to_pro

  netlify:
    cli: netlify
    deploy_command: netlify deploy --prod --dir .
    features:
      - automatic_https
      - forms
      - functions
      - split_testing
    domain: *.netlify.app or custom
    pricing: free_to_pro

  cloudflare_pages:
    cli: wrangler
    deploy_command: wrangler pages deploy . --project-name {name}
    features:
      - automatic_https
      - edge_network
      - web_analytics
      - unlimited_bandwidth
    domain: *.pages.dev or custom
    pricing: free

  github_pages:
    cli: gh-pages
    deploy_command: gh-pages -d .
    features:
      - free
      - github_integration
      - custom_domain
    domain: *.github.io or custom
    pricing: free

  custom_ftp:
    method: ftp_upload
    features:
      - any_hosting
      - full_control
    requires: ftp_credentials
```

## Deploy Configuration

```yaml
DeployConfig:
  platform: vercel | netlify | cloudflare | github | ftp
  project_name: string
  production: boolean
  custom_domain: string (optional)

  # Platform-specific
  vercel:
    team: string (optional)
    env_vars: object (optional)

  netlify:
    site_id: string (optional)

  cloudflare:
    account_id: string

  github:
    repo: string
    branch: gh-pages

  ftp:
    host: string
    user: string
    path: string
```

## Deployment Process

```yaml
steps:
  - step: validate_package
    checks:
      - index.html exists
      - no broken links
      - assets present

  - step: authenticate
    platform_specific:
      vercel: vercel login
      netlify: netlify login
      cloudflare: wrangler login
      github: gh auth login
      ftp: test_connection

  - step: deploy
    platform_specific:
      vercel: |
        vercel --prod --name {project_name}
      netlify: |
        netlify deploy --prod --dir . --site {site_id}
      cloudflare: |
        wrangler pages deploy . --project-name {project_name}
      github: |
        gh-pages -d . -b gh-pages
      ftp: |
        upload_all_files

  - step: configure_domain
    if: custom_domain
    actions:
      - add_domain_to_platform
      - provide_dns_instructions
      - verify_dns_propagation
      - enable_https

  - step: verify_deployment
    checks:
      - site_accessible
      - https_enabled
      - all_pages_load
      - no_mixed_content

  - step: run_lighthouse
    pages: [home, key_landing_pages]
    metrics: [performance, accessibility, seo]

  - step: generate_report
    include:
      - deploy_url
      - lighthouse_scores
      - domain_status
      - next_steps
```

## Custom Domain Setup

```yaml
domain_setup:
  dns_records:
    option_1_apex:
      type: A
      name: "@"
      value: platform_ip

    option_2_subdomain:
      type: CNAME
      name: "www" or "brand"
      value: platform_domain

  ssl:
    provider: platform_automatic
    type: lets_encrypt or cloudflare

  verification:
    - check_dns_propagation
    - verify_ssl_certificate
    - test_https_redirect
```

## Deploy Report

```markdown
# Deployment Report

**Date:** {timestamp}
**Platform:** {platform}
**Status:** ✅ Success

## URLs

| Type | URL |
|------|-----|
| Production | {deploy_url} |
| Custom Domain | {custom_domain} |

## Lighthouse Scores

| Page | Performance | Accessibility | SEO |
|------|-------------|---------------|-----|
| Home | {score} | {score} | {score} |

## SSL Status
- Certificate: ✅ Valid
- HTTPS Redirect: ✅ Enabled

## Next Steps
1. Verify all pages
2. Set up monitoring
3. Configure analytics
```

## Pre-Conditions

- [ ] Static package ready
- [ ] Platform credentials configured
- [ ] Domain DNS access (if custom)

## Post-Conditions

- [ ] Site deployed and accessible
- [ ] HTTPS enabled
- [ ] Report generated

## Acceptance Criteria

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Custom domain works (if configured)
- [ ] Lighthouse scores acceptable

## Quality Gate

- Threshold: >70%
- Site accessible at configured URL with no errors
- Custom domain configured and SSL active (if applicable)
- Lighthouse scores acceptable (performance >80)

---
*Branding Squad Task - web-builder*
