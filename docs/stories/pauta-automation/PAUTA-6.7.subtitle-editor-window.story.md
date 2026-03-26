# Story PAUTA-6.7: Subtitle Editor Window (HTML/JS)

**Epic:** PAUTA-6 Video Downloader Migration
**Status:** Ready for Review
**Priority:** High
**Complexity:** High
**Estimated Effort:** 16h
**Dependencies:** Stories 6.1, 6.2, 6.3, 6.4, 6.5 (all DONE)

---

## Story

**Como** produtor do programa,
**Quero** um editor de legendas integrado baseado em HTML/JS com preview de vídeo e timeline,
**Para que** eu possa editar legendas de forma visual após a transcrição, sem usar a interface externa Tkinter.

---

## Description

Implement a comprehensive subtitle editor window using HTML/CSS/JS compatible with pywebview, replacing the need for external Tkinter editor. The editor features three development phases: Phase 1 (basic editable subtitle list + save/cancel), Phase 2 (HTML5 video preview with playhead sync), Phase 3 (canvas timeline + style customization). Currently, after transcription completes, subtitles are embedded automatically without user editing. This story enables manual review and correction before embedding.

The editor opens in a new pywebview window (like the Video Downloader UI) after transcription completes (when NOT video_only mode). User can edit timestamp and text for each subtitle entry, add/remove entries, customize ASS style (text color, outline), preview synced video, and see visual timeline blocks. On save, generates both SRT and ASS files, then embeds into video via SubtitleProcessor.embed_subtitles().

---

## Acceptance Criteria

### Phase 1: Editor Basics (Tasks 1-4)

1. **New HTML UI File**
   - New file `ui/subtitle-editor.html` with dark mode styling matching existing UI
   - Editable list of subtitle entries (timestamp start, timestamp end, text)
   - Each entry has inline edit mode (click to edit), delete button
   - Add New Entry button (inserts blank entry at cursor position)
   - Save button (generates SRT + ASS, embeds into video)
   - Cancel button (discards changes, closes editor)
   - No external CSS files — styles inline or in `<style>` tag

2. **Bridge Methods for Editor**
   - `open_subtitle_editor(srt_path, video_path)` opens new pywebview window with `subtitle-editor.html`
   - Passes subtitle data (parsed from SRT) and video path to JS via `window.subtitle_data` and `window.video_path`
   - `save_subtitles(subtitles)` receives edited subtitle array from JS, writes SRT + generates ASS, embeds into video
   - `cancel_editor()` closes the subtitle editor window without saving

3. **Integration in Download Flow**
   - After transcription completes in `download_video()`, if NOT video_only mode, open subtitle editor instead of auto-embedding
   - Sequence: download → transcribe → open editor (user edits) → save triggers embedding
   - Video-only mode bypasses editor (no transcription)

4. **Subtitle Data Format**
   - JS receives subtitle array: `[{index: 1, start: "00:01:30,000", end: "00:01:35,000", text: "Hello world"}, ...]`
   - Timestamps in SRT format (HH:MM:SS,mmm)
   - Save returns same format to Python bridge
   - SubtitleProcessor.embed_subtitles() handles conversion to ASS + embedding

### Phase 2: Video Preview (Tasks 5-6)

5. **HTML5 Video Player**
   - `<video>` element displays the processed video (from `video_path`)
   - Standard controls: play/pause button, seek bar, volume slider, current time / total duration display
   - Video loads on editor open (preload metadata)

6. **Playhead Sync with Subtitles**
   - As video plays, current subtitle entry highlights in the subtitle list
   - Click on subtitle entry → video seeks to that subtitle's start time
   - Seek bar shows subtitle block positions (visual markers)
   - Current subtitle text overlays on video player (simulates embedded result)

### Phase 3: Timeline + Style (Tasks 7-8)

7. **Canvas Timeline**
   - HTML5 `<canvas>` below video player shows horizontal timeline
   - Each subtitle entry rendered as colored block (proportional to duration)
   - Click on timeline block → seek to that subtitle
   - Drag timeline to scrub video position
   - Zoom controls (+ / -) to expand/compress timeline view

8. **Style Customization**
   - Color pickers for subtitle text color and outline color
   - Font size slider (preserved in ASS generation)
   - Real-time preview of style changes on video overlay
   - Style settings passed to `save_subtitles()` for ASS generation via SubtitleStyle dataclass

### Cross-Phase ACs

9. **Pywebview Window Management**
   - Subtitle editor opens in new window (800x600 default, resizable)
   - Window title: "Subtitle Editor — {video_filename}"
   - Closing window without saving triggers cancel confirmation dialog (JS confirm)

10. **Error Handling**
    - Invalid SRT file → show error message in editor, disable save
    - Missing video file → show warning, disable video preview (editor still functional for text edits)
    - Save failure (FFmpeg error) → show error in editor, keep window open for retry

11. **Test Coverage**
    - All existing tests (456+) continue passing
    - Ruff 0 issues maintained
    - New tests for `open_subtitle_editor()`, `save_subtitles()`, `cancel_editor()` bridge methods
    - Manual test plan for full editor workflow (load, edit, save, embed)

---

## Dev Notes

### Implementation Approach

**New Files to Create:**
- `pauta-automation/ui/subtitle-editor.html` — Full editor UI (HTML/CSS/JS in one file for simplicity)

**Files to Modify:**
- `pauta-automation/src/gui/app.py` — Add `open_subtitle_editor()`, `save_subtitles()`, `cancel_editor()` bridge methods
- `pauta-automation/src/processors/video_downloader/engine.py` — No changes (already has video processing methods)
- `pauta-automation/src/processors/video_downloader/subtitle_processor.py` — Expose `embed_subtitles()` as standalone method (may already exist from Story 6.4)

**Dependencies:**
- SubtitleProcessor class (already exists): `transcribe()`, `translate()`, `generate_ass()`, `embed_subtitles()`
- VideoDownloaderEngine class (already exists): no changes needed
- pywebview window API for multi-window support

### Key Design Decisions

**Why HTML/JS Instead of Tkinter:**
- Consistency with existing pauta-automation UI (index.html, video-downloader form)
- Easier styling and responsive layout with CSS
- Better integration with pywebview bridge pattern
- Avoids mixing Tkinter and webview UI paradigms

**Why Single HTML File:**
- Simplifies deployment and asset management
- No HTTP server needed for static assets
- Inline styles and scripts reduce file dependencies
- Similar pattern to original video downloader's subtitle editor (959 lines, all in one file)

**Why Three Phases:**
- Phase 1 delivers minimum viable editor (editable text + save)
- Phase 2 adds critical preview feature (sync video with subtitles)
- Phase 3 adds polish (timeline, style customization)
- Each phase independently testable and shippable

### Subtitle Editor HTML Structure

**Phase 1 Template:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Subtitle Editor</title>
  <style>
    /* Dark mode theme matching index.html */
    body { background: #1a1a1a; color: #e0e0e0; font-family: Arial, sans-serif; }
    .subtitle-entry { display: flex; gap: 10px; padding: 8px; border-bottom: 1px solid #333; }
    .subtitle-entry:hover { background: #252525; }
    input[type="text"] { background: #2a2a2a; color: #e0e0e0; border: 1px solid #444; padding: 5px; }
    .time-input { width: 120px; }
    .text-input { flex: 1; }
    button { background: #3a3a3a; color: #e0e0e0; border: 1px solid #555; padding: 8px 16px; cursor: pointer; }
    button:hover { background: #4a4a4a; }
    .btn-save { background: #2a7a2a; }
    .btn-cancel { background: #7a2a2a; }
  </style>
</head>
<body>
  <div id="editor-container">
    <h2>Subtitle Editor</h2>
    <div id="subtitle-list">
      <!-- Dynamic subtitle entries rendered here -->
    </div>
    <button onclick="addEntry()">Add New Entry</button>
    <button class="btn-save" onclick="saveSubtitles()">Save & Embed</button>
    <button class="btn-cancel" onclick="cancelEditor()">Cancel</button>
  </div>
  <script>
    // Access data passed from Python
    const subtitles = window.subtitle_data || [];
    const videoPath = window.video_path || "";

    function renderSubtitles() { /* Render editable list */ }
    function addEntry() { /* Add blank entry */ }
    function deleteEntry(index) { /* Remove entry */ }
    function saveSubtitles() {
      // Collect edited data, call bridge
      pywebview.api.save_subtitles(subtitles);
    }
    function cancelEditor() {
      if (confirm("Discard changes?")) {
        pywebview.api.cancel_editor();
      }
    }

    renderSubtitles();
  </script>
</body>
</html>
```

**Phase 2 Additions (Video Player):**
```html
<video id="video-player" controls preload="metadata">
  <source src="" type="video/mp4">
</video>
<div id="video-controls">
  <button onclick="togglePlay()">Play/Pause</button>
  <input type="range" id="seek-bar" min="0" max="100" value="0" oninput="seekVideo(this.value)">
  <span id="current-time">00:00</span> / <span id="total-time">00:00</span>
</div>

<script>
const video = document.getElementById("video-player");
video.addEventListener("timeupdate", () => {
  highlightCurrentSubtitle(video.currentTime);
  updateSeekBar();
});
function highlightCurrentSubtitle(time) { /* Find and highlight entry */ }
function seekVideo(value) { video.currentTime = (value / 100) * video.duration; }
</script>
```

**Phase 3 Additions (Canvas Timeline + Style):**
```html
<canvas id="timeline-canvas" width="800" height="100"></canvas>
<div id="style-controls">
  <label>Text Color: <input type="color" id="text-color" value="#ffffff"></label>
  <label>Outline Color: <input type="color" id="outline-color" value="#000000"></label>
  <label>Font Size: <input type="range" id="font-size" min="12" max="48" value="24"></label>
</div>

<script>
const canvas = document.getElementById("timeline-canvas");
const ctx = canvas.getContext("2d");

function drawTimeline() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  subtitles.forEach((sub, i) => {
    const startX = (parseTime(sub.start) / video.duration) * canvas.width;
    const endX = (parseTime(sub.end) / video.duration) * canvas.width;
    ctx.fillStyle = "#3a7a3a";
    ctx.fillRect(startX, 20, endX - startX, 60);
  });
}
canvas.addEventListener("click", (e) => {
  const clickTime = (e.offsetX / canvas.width) * video.duration;
  video.currentTime = clickTime;
});
</script>
```

### Bridge Method Implementation (app.py)

**PautaBridge additions:**
```python
def open_subtitle_editor(self, srt_path: str, video_path: str) -> dict[str, Any]:
    """Open subtitle editor in new pywebview window."""
    try:
        # Parse SRT file into subtitle array
        from src.processors.video_downloader.srt_utils import parse_srt
        subtitles = parse_srt(srt_path)  # Returns list of SubtitleEntry dicts

        # Create new window with subtitle-editor.html
        editor_window = webview.create_window(
            title=f"Subtitle Editor — {Path(video_path).name}",
            url=str(self._root_dir / "ui" / "subtitle-editor.html"),
            width=800,
            height=600,
            resizable=True,
            js_api=self  # Expose bridge methods
        )

        # Pass data to JS via window object
        editor_window.evaluate_js(f"window.subtitle_data = {json.dumps(subtitles)};")
        editor_window.evaluate_js(f"window.video_path = '{video_path}';")

        return {"status": "ok"}
    except Exception as e:
        logger.error("Failed to open subtitle editor: %s", e)
        return {"status": "error", "message": str(e)}

def save_subtitles(self, subtitles: list[dict], style: dict = None) -> dict[str, Any]:
    """Save edited subtitles, generate ASS, embed into video."""
    try:
        from src.processors.video_downloader.subtitle_processor import SubtitleProcessor
        from src.processors.video_downloader.srt_utils import write_srt, generate_ass, SubtitleStyle

        # Write SRT
        srt_path = self._output_paths.get("srt")  # Tracked from transcription
        write_srt(srt_path, subtitles)

        # Generate ASS with custom style
        ass_style = SubtitleStyle(
            font_size=style.get("font_size", 24) if style else 24,
            primary_color=style.get("text_color", "#ffffff") if style else "#ffffff",
            outline_color=style.get("outline_color", "#000000") if style else "#000000"
        )
        ass_path = srt_path.replace(".srt", ".ass")
        generate_ass(srt_path, ass_path, ass_style)

        # Embed into video
        processor = SubtitleProcessor(api_key=self.config.openai.api_key)
        video_path = self._output_paths.get("video")
        success, result = processor.embed_subtitles(video_path, ass_path)

        if success:
            return {"status": "ok", "output_path": result}
        else:
            return {"status": "error", "message": result}
    except Exception as e:
        logger.error("Failed to save subtitles: %s", e)
        return {"status": "error", "message": str(e)}

def cancel_editor(self) -> None:
    """Close subtitle editor window without saving."""
    # Window closes automatically when JS calls this
    return {"status": "ok"}
```

**Update download flow in orchestrator/processor:**
```python
# In download_video() after transcription completes
if not video_only:
    # Instead of auto-embedding:
    # success, srt_path = processor.transcribe(video_path, language="en")
    # success, output = processor.embed_subtitles(video_path, srt_path)

    # New flow:
    success, srt_path = processor.transcribe(video_path, language="en")
    self._output_paths["srt"] = srt_path
    self._output_paths["video"] = video_path
    self.open_subtitle_editor(srt_path, video_path)
    # Embedding happens when user clicks Save in editor
```

### SRT Parsing Utility (srt_utils.py)

**Add parse_srt() if not already present:**
```python
def parse_srt(srt_path: str) -> list[dict[str, Any]]:
    """Parse SRT file into list of subtitle dicts for editor."""
    subtitles = []
    with open(srt_path, "r", encoding="utf-8") as f:
        entries = f.read().strip().split("\n\n")
        for entry in entries:
            lines = entry.split("\n")
            if len(lines) >= 3:
                index = int(lines[0])
                times = lines[1].split(" --> ")
                start = times[0].strip()
                end = times[1].strip()
                text = "\n".join(lines[2:])
                subtitles.append({
                    "index": index,
                    "start": start,
                    "end": end,
                    "text": text
                })
    return subtitles
```

### Testing Strategy

**Unit Tests (Python):**
- `test_open_subtitle_editor()` — creates window with correct data
- `test_save_subtitles()` — writes SRT, generates ASS, embeds into video
- `test_cancel_editor()` — closes window without errors
- `test_parse_srt()` — correctly parses SRT into subtitle array

**Manual Test Plan:**
1. Download video with transcription enabled (NOT video_only)
2. After transcription, subtitle editor opens in new window
3. Verify subtitle list populated with transcribed text
4. Edit timestamp of first entry, change text
5. Add new entry via "Add New Entry" button
6. Delete one entry via delete button
7. Click "Save & Embed" → verify SRT + ASS generated, video re-encoded with subtitles
8. Re-download same video, click "Cancel" in editor → verify no changes saved

**Phase 2 Manual Tests:**
9. Open editor, click play → verify video plays with subtitle highlights
10. Click on subtitle entry → verify video seeks to that timestamp
11. Seek video manually → verify correct subtitle highlights

**Phase 3 Manual Tests:**
12. Open editor, verify timeline canvas shows subtitle blocks
13. Click on timeline block → verify video seeks correctly
14. Change text color → verify preview updates in real-time
15. Change font size → verify preview updates
16. Save with custom style → verify ASS file contains custom colors/size

---

## Tasks

### Phase 1: Basic Editor (AC 1-4)

#### Task 1: Create subtitle-editor.html (AC 1)
- [x] Create `ui/subtitle-editor.html` with dark mode styling (matching index.html theme)
- [x] Implement editable subtitle list container (`#subtitle-list`)
- [x] Implement subtitle entry template (start time, end time, text, delete button)
- [x] Implement "Add New Entry" button handler
- [x] Implement "Save & Embed" button (calls `pywebview.api.save_subtitles()`)
- [x] Implement "Cancel" button (calls `pywebview.api.cancel_editor()` with confirm dialog)
- [x] Add input validation (timestamps must be in HH:MM:SS,mmm format)
- [x] Inline edit mode: click on timestamp/text to edit, blur to save

#### Task 2: Add Bridge Methods to app.py (AC 2)
- [x] Implement `open_subtitle_editor(srt_path, video_path)` in PautaBridge
- [x] Parse SRT file using `parse_srt()` utility (add to srt_utils.py if missing)
- [x] Create new pywebview window with subtitle-editor.html
- [x] Pass subtitle data and video path to JS via `window` object
- [x] Implement `save_subtitles(subtitles, style={})` in PautaBridge
- [x] Write updated SRT file from subtitles array
- [x] Generate ASS file with SubtitleStyle (from style dict or defaults)
- [x] Embed subtitles into video via SubtitleProcessor.embed_subtitles()
- [x] Implement `cancel_editor()` in PautaBridge (closes window, returns ok status)
- [x] Unit tests for all three bridge methods

#### Task 3: Add parse_srt() Utility (AC 4)
- [x] Implement `parse_srt(srt_path)` in srt_utils.py
- [x] Parse SRT format into list of dicts: `{index, start, end, text}`
- [x] Handle multi-line subtitle text (join with `\n`)
- [x] Handle malformed SRT gracefully (skip invalid entries, log warning)
- [x] Unit tests for parse_srt() with valid/invalid SRT files

#### Task 4: Integrate Editor into Download Flow (AC 3)
- [x] Update `download_video()` in orchestrator or processor to call `open_subtitle_editor()` after transcription (when NOT video_only)
- [x] Store SRT and video paths in `_output_paths` dict before opening editor
- [x] Remove auto-embedding after transcription (embedding now triggered by Save in editor)
- [x] Handle editor cancel (no embedding, video remains without subtitles)
- [x] Integration test: download with transcription → editor opens → cancel → no subtitles embedded
- [x] Integration test: download with transcription → editor opens → edit → save → subtitles embedded

### Phase 2: Video Preview (AC 5-6)

#### Task 5: Add Video Player to Editor (AC 5)
- [x] Add `<video>` element to subtitle-editor.html
- [x] Load video from `window.video_path` on editor open
- [x] Implement custom controls: play/pause button, seek bar (range input), volume slider
- [x] Display current time / total duration (update on timeupdate event)
- [x] Preload video metadata on page load
- [x] Handle missing video file (show warning, disable player, editor still functional)

#### Task 6: Implement Playhead Sync (AC 6)
- [x] On video timeupdate event, find current subtitle by timestamp
- [x] Highlight current subtitle entry in list (add `.active` class)
- [x] On subtitle entry click, seek video to subtitle's start time
- [x] Display current subtitle text as overlay on video player (simulates embedded result)
- [x] Update seek bar to show subtitle block positions (visual markers via CSS background gradient)

### Phase 3: Timeline + Style (AC 7-8)

#### Task 7: Implement Canvas Timeline (AC 7)
- [x] Add `<canvas id="timeline-canvas">` below video player
- [x] On editor load, draw subtitle blocks on canvas (horizontal bars proportional to duration)
- [x] Color-code blocks by speaker or index (alternating colors for visual clarity)
- [x] On canvas click, calculate timestamp from X position, seek video to that time
- [x] Implement timeline drag to scrub (mousemove updates video.currentTime)
- [x] Add zoom controls (+ / - buttons) to expand/compress timeline horizontally
- [x] Redraw timeline on subtitle data change (add/delete entry)

#### Task 8: Add Style Customization (AC 8)
- [x] Add color pickers for text color and outline color
- [x] Add font size slider (12-48px range, default 24)
- [x] On style change, update video subtitle overlay preview in real-time
- [x] Store style settings in JS state object
- [x] Pass style settings to `save_subtitles(subtitles, style)` on save
- [x] Update SubtitleStyle dataclass in generate_ass() to accept hex colors (convert to ASS color format)
- [x] Unit test: style dict with custom colors → ASS file contains correct color codes

### Cross-Phase Tasks

#### Task 9: Window Management & Error Handling (AC 9-10)
- [x] Set editor window title to "Subtitle Editor — {video_filename}"
- [x] Set default window size to 800x600, resizable
- [x] On window close (X button), trigger cancel confirmation if unsaved changes exist
- [x] Handle invalid SRT file: show error message in editor, disable save button
- [x] Handle missing video file: show warning, disable video preview, editor text edits still work
- [x] Handle save failure (FFmpeg error): show error in editor, keep window open for retry
- [x] Add loading spinner during save operation (SRT write + ASS gen + embedding can take time)

#### Task 10: Testing & QA (AC 11)
- [x] Run full test suite: `cd pauta-automation && python -m pytest tests/ -x -q` — all tests pass (489 passed)
- [x] Run linter: `cd pauta-automation && python -m ruff check src/ tests/` — 0 issues
- [ ] Manual test: Phase 1 workflow (load, edit text, add entry, delete entry, save, cancel)
- [ ] Manual test: Phase 2 workflow (video playback, playhead sync, subtitle click seek)
- [ ] Manual test: Phase 3 workflow (timeline click seek, style customization, save with custom style)
- [ ] Manual test: Error scenarios (invalid SRT, missing video, save failure)
- [x] Verify all existing 456+ tests still pass after integration (489 passed)

---

## Testing

**Automated Tests (Python, new):**
- `test_open_subtitle_editor()` — creates window with subtitle data and video path
- `test_open_subtitle_editor_invalid_srt()` — handles invalid SRT file gracefully
- `test_save_subtitles()` — writes SRT, generates ASS, embeds into video
- `test_save_subtitles_with_style()` — applies custom style to ASS generation
- `test_cancel_editor()` — closes window without errors
- `test_parse_srt()` — parses valid SRT into subtitle array
- `test_parse_srt_invalid()` — handles malformed SRT entries

**Manual Test Plan:**

**Phase 1 Tests:**
1. Download video with transcription (NOT video_only)
2. Verify subtitle editor window opens automatically after transcription
3. Verify subtitle list populated with transcribed entries (start, end, text)
4. Edit timestamp of first entry (change start time from 00:00:01,000 to 00:00:02,000)
5. Edit text of second entry
6. Click "Add New Entry" → verify blank entry inserted at end of list
7. Enter text and timestamps for new entry
8. Click delete button on one entry → verify entry removed
9. Click "Save & Embed" → verify SRT + ASS files written, video re-encoded with subtitles
10. Re-download same video, click "Cancel" in editor → verify no changes saved, window closes

**Phase 2 Tests:**
11. Open editor with video preview
12. Click play button → verify video plays, current subtitle highlights in list
13. Let video play through multiple subtitles → verify highlight moves correctly
14. Click on subtitle entry #3 → verify video seeks to that entry's start time
15. Seek video manually via seek bar → verify correct subtitle highlights
16. Verify subtitle text overlay on video player matches current subtitle

**Phase 3 Tests:**
17. Verify timeline canvas shows subtitle blocks (horizontal bars)
18. Click on timeline block #2 → verify video seeks to that subtitle
19. Drag timeline scrubber → verify video follows scrub position
20. Click zoom + → verify timeline expands (blocks wider)
21. Click zoom - → verify timeline compresses
22. Change text color to red → verify video overlay updates to red text in real-time
23. Change outline color to blue → verify overlay outline updates
24. Change font size to 36 → verify overlay text size increases
25. Save with custom style → open generated ASS file, verify custom color codes present

**Error Handling Tests:**
26. Corrupt SRT file → verify error message in editor, save button disabled
27. Missing video file → verify warning shown, video player disabled, text edits still work
28. Trigger FFmpeg error during save → verify error message in editor, window stays open

---

## File List

**Created:**
- `pauta-automation/ui/subtitle-editor.html` — Standalone subtitle editor UI (HTML/CSS/JS, all 3 phases: editable list, video player with playhead sync, canvas timeline, style customization)
- `pauta-automation/tests/test_subtitle_editor.py` — 29 tests for bridge methods (open_subtitle_editor, save_subtitles, cancel_editor, load_srt, get_video_path_for_srt), srt_utils (parse_srt, write_srt, format_timestamp), and SubtitleStyle

**Modified:**
- `pauta-automation/src/gui/app.py` — Added `import json`; added `open_subtitle_editor()`, `save_subtitles()`, `cancel_editor()` bridge methods; updated `download_video()` worker to auto-open editor after transcription (when NOT video_only)

**Not Modified (already existed from previous stories):**
- `pauta-automation/src/processors/video_downloader/srt_utils.py` — Already had `parse_srt()`, `write_srt()`, `SubtitleEntry`, `SubtitleStyle`, `generate_ass()`, `format_timestamp()`
- `pauta-automation/src/processors/video_downloader/subtitle_processor.py` — Already had `SubtitleProcessor` with `transcribe()`, `translate()`, `generate_ass_file()`, `embed_subtitles()`

---

## CodeRabbit Integration

**Pre-Commit Review Focus:**
- Validate subtitle-editor.html follows accessibility best practices (ARIA labels, keyboard navigation)
- Check for proper error handling in bridge methods (open_subtitle_editor, save_subtitles)
- Verify SRT parsing handles edge cases (empty lines, malformed timestamps, non-ASCII characters)
- Ensure pywebview window lifecycle managed correctly (no memory leaks on repeated open/close)
- Check video player controls accessibility (keyboard shortcuts for play/pause/seek)
- Validate canvas timeline performance (60fps for smooth scrubbing on large subtitle files)

**Story Review Checklist:**
- All 3 phases implemented and functional (editor, preview, timeline)
- All acceptance criteria met
- All existing tests pass + new tests added
- Ruff 0 issues
- Manual test plan executed and documented
- Error handling for all failure modes (invalid SRT, missing video, save failure)

**Self-Healing Targets:**
- CRITICAL: Security issues (XSS in subtitle text input, path traversal in video_path)
- HIGH: Data loss issues (unsaved changes warning on window close, save failure recovery)
- MEDIUM: UX issues (timeline performance, video sync accuracy)

---

## Change Log

- **2026-03-26:** Story created by @sm (River)
- **2026-03-26:** Implementation complete by @dev (Dex) — All 3 phases implemented:
  - Created `ui/subtitle-editor.html` (standalone editor with video player, canvas timeline, style customization)
  - Added `open_subtitle_editor()`, `save_subtitles()`, `cancel_editor()` bridge methods to `app.py`
  - Integrated editor into `download_video()` flow (auto-opens after transcription)
  - Created 29 tests in `tests/test_subtitle_editor.py` (all pass)
  - Full suite: 489 passed, ruff 0 issues

---

*Story PAUTA-6.7 -- Subtitle Editor Window*
*-- River, removendo obstaculos 🌊*
