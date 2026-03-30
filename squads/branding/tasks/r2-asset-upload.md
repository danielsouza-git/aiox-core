# R2 Asset Upload

```yaml
task:
  id: r2-asset-upload
  name: "R2 Asset Upload"
  agent: operations-coordinator
  squad: branding
  type: operations
```

## Proposito

Upload brand assets to Cloudflare R2 storage with proper folder structure, naming conventions, and metadata tagging, ensuring all assets are organized and accessible to the entire branding squad.

## Input

- Client identifier
- Asset files to upload (images, fonts, documents, etc.)
- Asset category (brand-book, social, video, web, email, tokens, source)
- Optional metadata (version, description, tags)

## Output

- Assets uploaded to correct R2 path
- Asset manifest updated with URLs and metadata
- Upload confirmation report

## Workflow

### Passo 1: Validate Assets
Check file formats, sizes, and naming against branding squad conventions. Rename files that do not follow the naming pattern.

### Passo 2: Determine Destination Path
Resolve the correct R2 path based on client ID and asset category: `r2://brand-assets/{client-id}/{category}/`.

### Passo 3: Upload Files
Upload assets to R2 with appropriate content-type headers and cache control settings. Handle batch uploads for multiple files.

### Passo 4: Update Asset Manifest
Update the client's asset manifest file with new URLs, checksums, upload timestamps, and metadata tags.

### Passo 5: Generate Confirmation
Produce an upload report listing all uploaded files, their R2 URLs, and any warnings (e.g., large file sizes, unusual formats).

## O que faz

- Validates and normalizes asset filenames and formats
- Uploads assets to the correct R2 folder structure
- Maintains an up-to-date asset manifest per client
- Generates shareable R2 URLs for team access
- Handles batch uploads efficiently

## O que NAO faz

- Does not generate or modify creative assets (creative-producer handles that)
- Does not manage R2 bucket permissions or CORS configuration
- Does not handle billing for storage costs

## Ferramentas

- **Cloudflare R2 API** -- File upload and management
- **Asset Manifest** -- JSON manifest tracking all client assets

## Quality Gate

- Threshold: >70%
- All files uploaded successfully with correct content-type
- Asset manifest updated with valid URLs
- No orphaned files (every upload tracked in manifest)

---
*Squad Branding Task*
