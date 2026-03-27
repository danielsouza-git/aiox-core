# Story PAUTA-6.5: Pauta Integration -- Video Items to Downloader

**Epic:** PAUTA-6 Video Downloader Migration
**Status:** Ready for Review
**Priority:** High
**Complexity:** Medium
**Estimated Effort:** 4h
**Dependencies:** Stories 6.1, 6.2, 6.3, 6.4 (all DONE)

---

## Story

**Como** produtor do programa,
**Quero** que ao clicar em um video detectado na pauta, ele abra no Video Downloader pre-preenchido,
**Para que** o fluxo seja continuo entre parser e processamento de videos.

---

## Description

Connect the existing Videos view (which shows pauta-parsed video items via `renderViewItems("videosViewList", videos, "video")`) with the Video Downloader standalone form (Story 6.2). When user clicks a video item from the parsed pauta, the download form opens pre-filled with the URL, timecodes, clips, merge flag, and video-only mode from the parsed `Instruction`. After download completes, the pauta video item status updates bidirectionally. Also refine the "Edit Subtitles" button (Story 6.4) to work with tracked output paths instead of requiring file browse.

---

## Acceptance Criteria

1. **"Open in Downloader" Button**
   - Video items in `renderViewItems()` (Videos sidebar view) show an "Open in Downloader" button
   - Button visible for all video items regardless of status

2. **Navigation to Download Form**
   - Clicking "Open in Downloader" navigates to the Videos sidebar view and expands the download form (`download-form-container`)
   - The form scrolls into view if not visible

3. **Pre-fill from Parsed Instruction**
   - URL field (`download-url`) populated from `item.url`
   - Quality selector set to config default (already populated)
   - Clip 1 start/end populated from `item.timecode.start` / `item.timecode.end` (MMSS format)
   - For multi-clip instructions: `item.clips[]` populates Clip 1/2/3 start/end fields, enables checkboxes
   - Merge checkbox set from `item.merge`
   - "Video Only" checkbox set based on `item.type === "video_only"`

4. **Multi-Clip Pre-fill**
   - If instruction has `clips` array with 2+ entries: enable Clip 2 (and Clip 3 if present)
   - Each clip's start/end and repeat values populated from the instruction data
   - Merge checkbox auto-checked if `item.merge === true`

5. **Bridge Method for Instruction Details**
   - New `PautaBridge.get_instruction_details(instruction_id)` returns full instruction data as dict
   - Returns: url, type, timecode (start/end), clips (list with url/start/end), merge, enabled, status

6. **Bidirectional Status Sync**
   - After download completes via downloader form, the originating pauta video item status updates to COMPLETED
   - `download_video(params)` accepts optional `instruction_id` parameter
   - On completion, if `instruction_id` provided, update `Instruction.status` to COMPLETED and `Instruction.output_path` to the output file path
   - Status update reflected in Videos view (`view-status-{id}` element)

7. **"Edit Subtitles" with Tracked Paths**
   - After download+transcription completes, store the output SRT path in instruction metadata
   - "Edit Subtitles" button uses tracked SRT path instead of file browse dialog (current MVP behavior)
   - Fallback: if no tracked path, keep existing file browse behavior

8. **Status Display in Videos View**
   - Video items show status badge: Pending (default), Processing (during download), Completed (after success), Error (on failure)
   - Status polling reuses existing EventBus pattern (200ms interval, already in download polling)

9. **UI Consistency**
   - Follows existing dark mode design system (CSS vars, existing button styles)
   - No new CSS files -- inline additions to `styles.css`
   - No new JS files -- additions to `app.js`

10. **Test Coverage**
    - All existing 442 tests continue passing
    - Ruff 0 issues maintained
    - New Python tests for `get_instruction_details()` bridge method
    - New Python tests for `instruction_id` parameter in `download_video()`

---

## Dev Notes

### Implementation Approach

**Files to Modify:**
- `pauta-automation/ui/app.js` -- Add "Open in Downloader" handler, `prefillDownloadForm(item)` function, bidirectional status sync, tracked SRT path for edit subtitles
- `pauta-automation/ui/styles.css` -- Minor additions for status badges on video items
- `pauta-automation/src/gui/app.py` -- Add `get_instruction_details(id)` bridge method, update `download_video()` to accept `instruction_id`, track output paths
- `pauta-automation/src/core/orchestrator.py` -- Expose method to update instruction status by ID (if not already available)

**No new files created.** This is pure integration of existing components.

### Key Integration Points

**Parsed Item Data Available in JS:**
From `parsedItems` array (populated by `parse_url()` / `parse_text()`):
```javascript
{
  id: "abc12345",
  type: "video_sub" | "video_only",
  url: "https://youtube.com/...",
  timecode: { start: "0130", end: "0230" },  // or null
  clips: [{ url: "...", timecode: { start: "0130", end: "0230" } }],
  merge: true|false,
  enabled: true,
  news_block: "BLOCO 1"
}
```

**Download Form Fields (already exist from Story 6.2):**
- `#download-url` -- URL input
- `#download-quality` -- Quality dropdown
- `#clip1-start`, `#clip1-end`, `#clip1-repeat` -- Clip 1
- `#clip2-enable`, `#clip2-start`, `#clip2-end`, `#clip2-repeat` -- Clip 2
- `#clip3-enable`, `#clip3-start`, `#clip3-end`, `#clip3-repeat` -- Clip 3
- `#download-merge` -- Merge checkbox
- `#download-video-only` -- Video Only checkbox
- `#download-custom-name` -- Custom name input

**Pre-fill Function Pattern:**
```javascript
function prefillDownloadForm(item) {
  // Expand form if collapsed
  const container = document.getElementById("download-form-container");
  container.style.display = "";

  // Set URL
  document.getElementById("download-url").value = item.url || "";

  // Set video only
  document.getElementById("download-video-only").checked = (item.type === "video_only");

  // Set clip 1 from timecode
  if (item.timecode) {
    document.getElementById("clip1-start").value = item.timecode.start || "";
    document.getElementById("clip1-end").value = item.timecode.end || "";
  }

  // Handle multi-clip from clips array
  if (item.clips && item.clips.length >= 2) { /* enable clip 2, populate */ }
  if (item.clips && item.clips.length >= 3) { /* enable clip 3, populate */ }

  // Set merge
  document.getElementById("download-merge").checked = item.merge || false;
  updateMergeCheckboxState();

  // Store instruction ID for bidirectional sync
  currentDownloadInstructionId = item.id;
}
```

**Bidirectional Status Sync:**
- Store `currentDownloadInstructionId` when pre-filling from pauta item
- On download completion (in `pollDownloadEvents()`), if `currentDownloadInstructionId` is set, call bridge to update instruction status
- Bridge method: `update_instruction_status(id, status, output_path)` updates the in-memory `Instruction` object

**Output Path Tracking for SRT:**
- After successful transcription in `download_video()`, store SRT path in a dict keyed by instruction ID
- `openSubtitleEditorForVideo(itemId)` checks tracked paths first, falls back to file browse

---

## Tasks

### Task 1: Add Bridge Methods to app.py
- [x] Implement `get_instruction_details(instruction_id)` -- find instruction by ID in `_pauta_result`, return as dict
- [x] Update `download_video(params)` to accept optional `instruction_id` key in params
- [x] Implement `update_instruction_status(instruction_id, status, output_path)` -- update instruction in `_pauta_result`
- [x] Track SRT output path per instruction ID (in-memory dict `_output_paths`)
- [x] Add `get_output_paths(instruction_id)` bridge method -- returns video/SRT paths for a completed instruction
- [x] Unit tests for new bridge methods

### Task 2: Add "Open in Downloader" to Video Items
- [x] In `renderViewItems()`, add "Open in Downloader" button for video items (alongside existing "Edit Subtitles")
- [x] Implement `openInDownloader(itemId)` -- finds item in `parsedItems`, calls `prefillDownloadForm(item)`
- [x] Navigate to Videos sidebar view if not already there
- [x] Expand download form container and scroll into view

### Task 3: Implement Pre-fill Logic
- [x] Implement `prefillDownloadForm(item)` function
- [x] Handle single timecode (Clip 1 only)
- [x] Handle multi-clip array (enable Clip 2/3, populate start/end/repeat)
- [x] Set merge and video_only checkboxes
- [x] Store `currentDownloadInstructionId` for status sync
- [x] Reset form state before pre-filling (clear previous values)

### Task 4: Bidirectional Status Sync
- [x] Add `currentDownloadInstructionId` state variable
- [x] On download completion in `pollDownloadEvents()`, call `update_instruction_status()` bridge
- [x] Update `view-status-{id}` element in Videos view to reflect new status
- [x] Handle error status (update instruction to ERROR with message)
- [x] Clear `currentDownloadInstructionId` after sync

### Task 5: Improve "Edit Subtitles" with Tracked Paths
- [x] Update `openSubtitleEditorForVideo()` to check tracked output paths first via `get_output_paths(itemId)`
- [x] If SRT path exists and file is valid, open editor directly (skip file browse)
- [x] Keep file browse as fallback if no tracked path found
- [x] Show "Edit Subtitles" button only when instruction status is COMPLETED (or always with fallback)

### Task 6: Status Badges for Video Items
- [x] Add CSS for status badges in video items (pending/processing/completed/error colors)
- [x] Update `renderViewItems()` to show initial status from item data
- [x] Ensure status updates from polling are reflected in the badge element

### Task 7: Integration Testing
- [x] Run full test suite: `cd pauta-automation && python -m pytest tests/ -x -q` -- 456 tests pass (442 existing + 14 new)
- [x] Run linter: `cd pauta-automation && python -m ruff check src/ tests/` -- 0 issues
- [ ] Manual test: parse a pauta with video items, click "Open in Downloader", verify pre-fill
- [ ] Manual test: complete a download from pre-filled form, verify status updates in Videos view
- [ ] Manual test: click "Edit Subtitles" on completed item, verify direct editor open (no file browse)

---

## Testing

**Automated Tests (new):**
- `test_get_instruction_details()` -- returns correct dict for valid instruction ID
- `test_get_instruction_details_not_found()` -- returns error for invalid ID
- `test_download_video_with_instruction_id()` -- accepts and stores instruction_id
- `test_update_instruction_status()` -- updates instruction status correctly
- `test_get_output_paths()` -- returns tracked output paths

**Manual Test Checklist:**
1. Parse pauta with video items (URL + timecodes)
2. Navigate to Videos sidebar view
3. Verify "Open in Downloader" button on each video item
4. Click "Open in Downloader" on a video_sub item
5. Verify download form expands with URL, timecodes, video_only=false pre-filled
6. Click "Open in Downloader" on a video_only item
7. Verify video_only=true pre-filled
8. Start download from pre-filled form
9. Verify video item status changes to Processing during download
10. Verify video item status changes to Completed after download
11. Click "Edit Subtitles" on completed video_sub item
12. Verify subtitle editor opens directly (no file browse dialog)
13. Verify all 442+ existing tests still pass

---

## File List

**Modified:**
- `pauta-automation/ui/app.js` -- Add prefillDownloadForm(), openInDownloader(), resetDownloadForm(), bidirectional status sync via syncInstructionStatus(), updateVideoItemStatus(), tracked SRT paths in openSubtitleEditorForVideo()
- `pauta-automation/ui/styles.css` -- Add .btn--video-action class for video item action buttons
- `pauta-automation/src/gui/app.py` -- Add get_instruction_details(), update_instruction_status(), get_output_paths() bridge methods; update download_video() to accept instruction_id and track output paths; fix EventBus.emit() calls to use ProcessingEvent objects; enhance _serialize_result() with timecode_start/end, clips array, merge flag

**Created:**
- `pauta-automation/tests/test_bridge_integration.py` -- 14 tests for bridge methods (get_instruction_details, update_instruction_status, get_output_paths, download_video with instruction_id, _serialize_result video fields)

---

## Change Log

- **2026-03-25:** Story created by @sm (River)
- **2026-03-25:** Implementation by @dev (Dex) -- Tasks 1-7 completed, 456 tests passing, ruff clean
- **2026-03-25:** QA review by @qa (Quinn) -- CONCERNS: event type mismatch in handleDownloadEvent()
- **2026-03-25:** Fix by @dev (Dex) -- Event types aligned to EventType enum values (progress/completed/error), added instruction_id filter. 456 tests, ruff clean.
- **2026-03-25:** QA re-review by @qa (Quinn) -- PASS. Fix verified, all 456 tests pass, ruff clean. Tech debt noted: embed_subtitles_standalone() kwargs emit (Story 6.4, fix in 6.6).

---

*Story PAUTA-6.5 -- Pauta Integration*
*-- River, removendo obstaculos*
