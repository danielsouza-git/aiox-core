# Epic 6: Video Downloader Migration — Brownfield Enhancement

**Epic ID:** PAUTA-6
**Status:** Draft
**Author:** Morgan (PM Agent)
**Date:** 2026-03-25
**PRD Reference:** `docs/prd-pauta-automation.md` (v1.1) -- FR7, FR8, FR15, FR16
**Architecture Reference:** `docs/architecture-pauta-automation.md` (v2.0) -- Sections 8.3, 13.1

---

## Epic Goal

Migrate the standalone Video Downloader application (currently at `D:\EPOCH\ET_IA_e_Automações\epochnews_apps\videos\video_downloader\`) into the Pauta Automation monolith, replacing the current thin wrapper (`video_processor.py`) with a fully internalized implementation. Convert the GUI from CustomTkinter to pywebview (HTML/CSS/JS) following the existing design system. Integrate the Video Downloader view in the sidebar so that videos parsed from the pauta can be opened, downloaded, clipped, transcribed, and subtitled directly within the app.

---

## Existing System Context

**Current Pauta Automation State:**
- 16/16 FRs implemented, 326+ tests passing, .exe buildable
- Architecture: Python 3.10+ / pywebview / HTML+CSS+JS SPA / dark mode design system
- Existing `video_processor.py` (480 lines) is a thin wrapper that imports `VideoDownloader` from the external directory via `sys.path.insert`
- Config already has `openai.api_key` and `video.*` settings in `config.json`
- Bridge pattern: `PautaBridge` (js_api) with 500ms event polling
- Orchestrator: `ThreadPoolExecutor(max_workers=3)` with `EventBus`

**External Video Downloader State:**
- `downloader.py` (~1000 lines) -- Core logic: yt-dlp download, Whisper transcription, SRT translation, FFmpeg clip/merge/repeat/timecode parsing
- `gui.py` (~1800 lines) -- CustomTkinter GUI: URL input, quality selector, clip settings, multi-clip (1-3), merge, video name, progress bar, history
- `subtitle_editor.py` (~900 lines) -- VLC/OpenCV subtitle editor: video preview, SRT editing, style customization, subtitle embedding
- Hardcoded API key at `gui.py:35` (security risk to eliminate)
- Stack: CustomTkinter, yt-dlp, openai, opencv-python, Pillow, python-vlc, moviepy, FFmpeg

**Integration Points:**
- `src/processors/video_processor.py` -- replace external import with internal module
- `src/core/config.py` -- `AppConfig.openai.api_key` and `AppConfig.video.*` already exist
- `src/core/models.py` -- `InstructionType.VIDEO_SUBTITLE`, `VIDEO_ONLY`, `VideoClip`, `TimeCode` already defined
- `src/core/orchestrator.py` -- already routes video instructions to VideoProcessor
- `ui/app.js` -- Videos view already shows parsed video items from pauta
- `ui/index.html` -- sidebar already has "Video Downloader" section (FR15/FR16)

---

## Enhancement Details

### What is being migrated:

1. **Core download/processing logic** (downloader.py) -- internalized into `src/processors/video_downloader/`
2. **GUI** (gui.py) -- converted from CustomTkinter to pywebview HTML/CSS/JS views
3. **Subtitle editor** (subtitle_editor.py) -- simplified for web: HTML5 video + JS SRT editor (no VLC/OpenCV dependency)
4. **Standalone mode** -- the Video Downloader view can be used independently (paste URL, download, clip) OR integrated with pauta flow (click parsed video item)

### What changes:

| Component | Before (External) | After (Internal) |
|-----------|-------------------|------------------|
| Download logic | `sys.path.insert` import from `D:\...` | Native module at `src/processors/video_downloader/` |
| API key | Hardcoded in gui.py | Read from `config.json` -> `openai.api_key` |
| GUI framework | CustomTkinter | pywebview (HTML/CSS/JS) |
| Subtitle editor | VLC/OpenCV/CustomTkinter | HTML5 `<video>` + JS SRT editor |
| Video preview | VLC player / OpenCV frames | HTML5 `<video>` element |
| Entry point | Standalone app (`gui.py`) | View inside Pauta Automation sidebar |
| Dependencies | python-vlc, opencv-python, moviepy, customtkinter | yt-dlp, openai, FFmpeg (already in project) |

### How it integrates:

1. **From pauta flow:** User parses pauta -> Videos view shows detected videos -> click item opens Video Downloader view pre-filled with URL/timecodes
2. **Standalone mode:** User navigates to Video Downloader in sidebar -> manual URL input, download, clip, transcribe, translate, subtitle
3. **Processing:** VideoProcessor uses internal `VideoDownloaderEngine` instead of external import
4. **Events:** Same EventBus pattern for progress reporting

### Success Criteria:

- All 15 video downloader features migrated and functional within pauta-automation
- Zero external path dependencies (no `sys.path.insert` to `D:\...`)
- API key sourced exclusively from `config.json`
- Existing 326+ tests continue passing
- New tests cover migrated functionality (target: 40+ new tests)
- .exe builds successfully with internalized dependencies
- VLC and opencv-python removed from dependencies (not needed in web-based UI)

---

## Stories

### Executor Assignment Table

| Story | Title | Executor | Quality Gate | Quality Gate Tools |
|-------|-------|----------|-------------|-------------------|
| 6.1 | Internalize Video Downloader Engine | @dev | @architect | [code_review, pattern_validation, dependency_analysis] |
| 6.2 | Video Downloader Standalone UI (pywebview) | @dev | @architect | [code_review, ui_consistency, bridge_validation] |
| 6.3 | Whisper Transcription + SRT Translation Module | @dev | @architect | [code_review, api_integration_review] |
| 6.4 | Web-Based Subtitle Editor | @dev | @architect | [code_review, ui_consistency, a11y_check] |
| 6.5 | Pauta Integration -- Video Items to Downloader | @dev | @architect | [code_review, integration_validation, event_flow] |
| 6.6 | Replace VideoProcessor Wrapper + Cleanup | @dev | @qa | [regression_testing, dependency_audit, exe_build_validation] |

---

### Story 6.1: Internalize Video Downloader Engine

**Como** produtor do programa,
**Quero** que a logica de download, clip, merge e repeat de videos esteja dentro do pauta-automation,
**Para que** o app nao dependa de um diretorio externo e seja autocontido.

**Description:**
Extract the core logic from `downloader.py` (~1000 lines) into a new internal module `src/processors/video_downloader/engine.py`. This covers: yt-dlp download, FFmpeg clip (start/end with MMSS format), 16:9 padding, multi-clip (up to 3), merge with fadewhite transition, repeat clip N times, platform detection, quality selection, and video info retrieval.

**Scope:**
- Create `src/processors/video_downloader/__init__.py`
- Create `src/processors/video_downloader/engine.py` -- `VideoDownloaderEngine` class
- Create `src/processors/video_downloader/ffmpeg_utils.py` -- FFmpeg operations (clip, merge, pad, repeat)
- Create `src/processors/video_downloader/timecode.py` -- MMSS timecode parsing and validation
- API key for OpenAI read from `AppConfig.openai.api_key` (NOT hardcoded)
- Progress callback support (same interface as current downloader)

**Acceptance Criteria:**
1. `VideoDownloaderEngine` class with methods: `download(url, quality, output_path)`, `clip_video(path, start, end)`, `merge_clips(paths, output)`, `repeat_clip(path, n, output)`, `get_video_info(url)`
2. MMSS timecode format preserved (e.g., "0130" = 1m30s)
3. Quality options preserved: Best, 1080p, 720p, 480p, Audio Only
4. Platform detection: YouTube, X/Twitter, Instagram, Other
5. Progress callback fired during download (percentage + status text)
6. Multi-clip support: up to 3 clips with merge (fadewhite 1s transition)
7. No dependency on external `D:\...` path -- fully self-contained
8. No hardcoded API keys anywhere in the new module
9. Unit tests: 15+ tests covering download mock, clip, merge, timecode parsing, platform detection
10. All existing 326+ tests continue passing

**Files Created:**
- `pauta-automation/src/processors/video_downloader/__init__.py`
- `pauta-automation/src/processors/video_downloader/engine.py`
- `pauta-automation/src/processors/video_downloader/ffmpeg_utils.py`
- `pauta-automation/src/processors/video_downloader/timecode.py`
- `pauta-automation/tests/test_video_downloader/test_engine.py`
- `pauta-automation/tests/test_video_downloader/test_ffmpeg_utils.py`
- `pauta-automation/tests/test_video_downloader/test_timecode.py`

**Files Modified:**
- `pauta-automation/requirements.txt` -- ensure yt-dlp, openai are listed (likely already present)

**Technical Notes:**
- The existing `downloader.py` uses `subprocess` to call FFmpeg -- preserve this approach (not moviepy)
- `yt_dlp.YoutubeDL` is used programmatically -- no CLI wrapper
- Timecode parsing from the original: `int(tc[:2]) * 60 + int(tc[2:])` for MMSS format
- Quality format strings are yt-dlp format selectors (preserve exact strings from `QUALITY_OPTIONS`)

---

### Story 6.2: Video Downloader Standalone UI (pywebview)

**Como** produtor do programa,
**Quero** uma interface de Video Downloader dentro da sidebar do Pauta Automation,
**Para que** eu possa baixar e processar videos sem abrir um app separado.

**Description:**
Create the Video Downloader standalone view in the existing pywebview SPA. This view allows the user to: paste a URL (or browse local file), select quality, set clip start/end times (MMSS), configure multi-clip (up to 3 clips), enable merge, set custom video name, and start download. Replaces the functionality of `gui.py` (~1800 lines) converted to HTML/CSS/JS.

**Scope:**
- New view in `ui/index.html` -- Video Downloader standalone (separate from the pauta-parsed video list)
- Navigation: sidebar item "Video Downloader" shows this view when no pauta is loaded, or as a sub-view
- Bridge methods on `PautaBridge` for standalone download operations
- Progress bar and download history

**Acceptance Criteria:**
1. URL input field with "Paste URL" placeholder
2. "Browse Local File" button (calls `PautaBridge.browse_file()` already exists)
3. Quality selector dropdown: Best, 1080p, 720p, 480p, Audio Only
4. Clip settings: Start time (MMSS), End time (MMSS) with input validation
5. Multi-clip toggle: enable Clip 2 and Clip 3 with separate start/end fields
6. Merge checkbox (enabled when 2+ clips configured)
7. Repeat field (number input, default 1, enabled per-clip)
8. Custom video name input
9. "Video Only" checkbox (skip transcription/subtitle steps)
10. Download button triggers `PautaBridge.download_video(params)` -- fires engine via thread
11. Progress bar shows real-time progress (reuses EventBus polling at 500ms)
12. Status messages: "Downloading...", "Clipping...", "Merging...", "Done"
13. Download history list below the form (last 10 downloads with filename + status)
14. UI follows existing dark mode design system (colors, fonts, spacing, border-radius)
15. All existing tests continue passing

**Files Created:**
- `pauta-automation/ui/views/video-downloader.html` (or section within index.html)
- `pauta-automation/ui/js/video-downloader.js` -- standalone downloader view logic
- `pauta-automation/ui/css/video-downloader.css` -- view-specific styles

**Files Modified:**
- `pauta-automation/ui/index.html` -- add Video Downloader standalone view section
- `pauta-automation/ui/app.js` -- add routing for video-downloader standalone view, import view JS
- `pauta-automation/ui/styles.css` -- import video-downloader.css (or inline)
- `pauta-automation/src/gui/app.py` -- add bridge methods: `download_video(params)`, `get_download_history()`

**Technical Notes:**
- The existing sidebar already has "Video Downloader" showing pauta-parsed videos. The standalone mode should be accessible when user clicks the sidebar item without having parsed a pauta, or via a "New Download" button within the Videos view.
- MMSS input validation in JS: 4 digits, first 2 are minutes (0-99), last 2 are seconds (0-59)
- The download runs in a worker thread via PautaBridge, progress reported via EventBus

---

### Story 6.3: Whisper Transcription + SRT Translation Module

**Como** produtor do programa,
**Quero** que a transcricao e traducao de legendas esteja integrada ao app,
**Para que** videos com legenda sejam processados sem dependencias externas.

**Description:**
Internalize the Whisper transcription and GPT translation logic from `downloader.py` (methods `transcribe_with_whisper` and `translate_subtitles`) into a dedicated subtitle processing module. This handles: audio extraction from video, OpenAI Whisper API call, SRT file generation, SRT translation to PT-BR via GPT-4.1-mini, and ASS subtitle file generation for embedding.

**Scope:**
- Create `src/processors/video_downloader/subtitle_processor.py` -- transcription + translation
- Create `src/processors/video_downloader/srt_utils.py` -- SRT/ASS parsing, generation, formatting
- OpenAI API key sourced from `AppConfig.openai.api_key`
- Translation model from `AppConfig.video.translation_model` (default: gpt-4.1-mini)
- Whisper model from `AppConfig.video.whisper_model` (default: whisper-1)

**Acceptance Criteria:**
1. `SubtitleProcessor.transcribe(video_path)` -- extracts audio, calls Whisper API, returns SRT path
2. `SubtitleProcessor.translate(srt_path, target_lang="pt-BR")` -- translates SRT via GPT, returns translated SRT path
3. `SubtitleProcessor.generate_ass(srt_path, style)` -- converts SRT to ASS with styling (font, color, outline, position)
4. `SubtitleProcessor.embed_subtitles(video_path, ass_path, output_path)` -- burns subtitles into video via FFmpeg
5. Default subtitle style: Arial Bold 21, white text on black background box (matching existing video downloader defaults)
6. API key read from config -- never hardcoded
7. Progress callback support for long-running operations (Whisper can take minutes)
8. Error handling: API timeout, invalid audio, empty transcription
9. Unit tests: 10+ tests covering transcription mock, translation mock, SRT parsing, ASS generation
10. All existing tests continue passing

**Files Created:**
- `pauta-automation/src/processors/video_downloader/subtitle_processor.py`
- `pauta-automation/src/processors/video_downloader/srt_utils.py`
- `pauta-automation/tests/test_video_downloader/test_subtitle_processor.py`
- `pauta-automation/tests/test_video_downloader/test_srt_utils.py`

**Files Modified:**
- `pauta-automation/src/core/config.py` -- ensure `VideoConfig` has `whisper_model` and `translation_model` fields (likely already present)

**Technical Notes:**
- Audio extraction for Whisper: `ffmpeg -i video.mp4 -vn -acodec pcm_s16le -ar 16000 audio.wav`
- Whisper API accepts files up to 25 MB. For longer videos, may need to split audio.
- GPT translation uses a system prompt like: "You are a translator. Translate the following SRT subtitles to Brazilian Portuguese (PT-BR). Maintain SRT format, timestamps, and numbering. Translate naturally, not literally."
- ASS format for subtitle embedding: `[V4+ Styles]` section with configurable font, color, outline, position

---

### Story 6.4: Web-Based Subtitle Editor

**Como** produtor do programa,
**Quero** editar legendas (SRT) e visualizar o resultado sobre o video no browser,
**Para que** eu possa ajustar legendas sem precisar de VLC ou software externo.

**Description:**
Create a web-based subtitle editor to replace the VLC/OpenCV-based `subtitle_editor.py`. Uses HTML5 `<video>` element for playback and JavaScript for SRT editing, timeline synchronization, and style preview. This is the most complex story in the epic and intentionally placed near the end.

**Scope:**
- New view/modal in the UI for subtitle editing
- HTML5 video player with controls (play, pause, seek, speed)
- SRT text editor with line-by-line editing
- Timeline sync: clicking a subtitle line seeks video to that timestamp
- Style controls: font size, color, outline, position (top/center/bottom)
- Live preview: styled subtitle overlay on the video
- Save: writes edited SRT back, optionally re-embeds subtitles

**Acceptance Criteria:**
1. HTML5 `<video>` player loads local video file (served via pywebview or file:// protocol)
2. SRT editor panel: shows subtitle entries with index, start time, end time, text
3. Click subtitle entry -> video seeks to start time of that entry
4. During playback, current subtitle is highlighted in the editor panel
5. Editable fields: start time, end time, text for each subtitle entry
6. Style panel: font size slider (14-42), font color picker, outline toggle, position selector (top/bottom)
7. Live subtitle overlay: shows styled text over the video during playback
8. "Save SRT" button: saves edited SRT via bridge (`PautaBridge.save_srt(path, content)`)
9. "Embed Subtitles" button: calls `SubtitleProcessor.embed_subtitles()` via bridge
10. Accessible via: "Edit Subtitles" button on any video item that has SRT generated
11. UI follows dark mode design system
12. All existing tests continue passing

**Files Created:**
- `pauta-automation/ui/views/subtitle-editor.html` (or section/modal within index.html)
- `pauta-automation/ui/js/subtitle-editor.js` -- editor logic, timeline sync, SRT parsing in JS
- `pauta-automation/ui/css/subtitle-editor.css` -- editor-specific styles

**Files Modified:**
- `pauta-automation/ui/index.html` -- add subtitle editor view/modal
- `pauta-automation/ui/app.js` -- add routing/modal trigger for subtitle editor
- `pauta-automation/src/gui/app.py` -- add bridge methods: `save_srt(path, content)`, `load_srt(path)`, `embed_subtitles(video_path, srt_path, style)`

**Technical Notes:**
- HTML5 `<video>` can play local MP4 files when served through pywebview (file:// or relative path)
- SRT parsing in JS is straightforward: split by double newline, parse index/timestamps/text
- Video `timeupdate` event fires during playback -- use it to highlight current subtitle
- For subtitle overlay: absolutely-positioned `<div>` over the `<video>` element with CSS styling
- This replaces ~900 lines of VLC/OpenCV/CustomTkinter code with ~300-400 lines of JS
- VLC and OpenCV dependencies are completely eliminated

**Risk:**
- HTML5 video codec support varies by pywebview renderer (EdgeChromium supports H.264 MP4 natively)
- Large video files (>1GB) may have performance issues in HTML5 video -- mitigated by working with clipped segments

---

### Story 6.5: Pauta Integration -- Video Items to Downloader

**Como** produtor do programa,
**Quero** que ao clicar em um video detectado na pauta, ele abra no Video Downloader pre-preenchido,
**Para que** o fluxo seja continuo entre parser e processamento de videos.

**Description:**
Connect the existing Videos view (which shows pauta-parsed video items) with the new Video Downloader standalone view. When user clicks a video item from the parsed pauta, the Video Downloader view opens pre-filled with the URL, timecodes, and mode (video only vs. with subtitle). Also connect the subtitle editor to video items that have completed transcription.

**Scope:**
- "Open in Downloader" action on video items in the Videos section tab and standalone view
- Pre-fill: URL, start/end timecodes, video only flag, clip configuration
- "Edit Subtitles" action on video items that have SRT generated
- Bidirectional status sync: processing in downloader view updates the pauta video item status

**Acceptance Criteria:**
1. Video items in Videos view show "Open in Downloader" button/link
2. Clicking "Open in Downloader" navigates to Video Downloader view with fields pre-populated from the parsed instruction
3. Pre-filled fields: URL, quality (from config default), start time (MMSS), end time (MMSS), video only checkbox
4. For multi-clip instructions: all clips pre-populated with their timecodes
5. Merge flag pre-set based on instruction's `merge` field
6. After download completes, pauta video item status updates to COMPLETED
7. Video items with status COMPLETED and subtitle show "Edit Subtitles" button
8. Clicking "Edit Subtitles" opens the subtitle editor (Story 6.4) with the SRT + video path
9. Processing a video from the downloader view updates the instruction status in the orchestrator
10. All existing tests continue passing

**Files Modified:**
- `pauta-automation/ui/app.js` -- add "Open in Downloader" handler, pre-fill logic, bidirectional status sync
- `pauta-automation/ui/js/video-downloader.js` -- add `prefill(instruction)` function
- `pauta-automation/src/gui/app.py` -- add bridge method: `get_instruction_details(id)` to retrieve full instruction data for pre-fill
- `pauta-automation/src/core/orchestrator.py` -- ensure video processing from downloader view updates instruction status

**Technical Notes:**
- The existing Videos view renders items from `PautaResult.instructions` where type is `VIDEO_*`
- Pre-fill is a JS-side operation: read instruction data, populate form fields
- Status sync uses the existing EventBus polling -- no new mechanism needed
- The orchestrator already tracks instruction status by ID -- the downloader view just needs to reference the same instruction ID

---

### Story 6.6: Replace VideoProcessor Wrapper + Cleanup

**Como** produtor do programa,
**Quero** que o app seja completamente independente do Video Downloader externo,
**Para que** o .exe funcione em qualquer maquina sem precisar de arquivos em `D:\EPOCH\...`.

**Description:**
Replace the current `video_processor.py` (thin wrapper that does `sys.path.insert` to import from external directory) with a new implementation that uses the internal `VideoDownloaderEngine` (Story 6.1) and `SubtitleProcessor` (Story 6.3). Clean up all references to the external path. Update the .exe build spec. Run full regression.

**Scope:**
- Rewrite `src/processors/video_processor.py` to use internal modules
- Remove `VIDEO_DOWNLOADER_PATH` constant and `_get_downloader_class()` function
- Update `requirements.txt` -- remove python-vlc, opencv-python, moviepy if present; ensure yt-dlp, openai, ffmpeg-python (or subprocess) are listed
- Update PyInstaller spec to include new modules
- Full regression: all existing tests + new tests must pass
- Build .exe and verify it works

**Acceptance Criteria:**
1. `video_processor.py` no longer contains any reference to `D:\EPOCH\...` or `VIDEO_DOWNLOADER_PATH`
2. `video_processor.py` imports from `src.processors.video_downloader.engine` and `src.processors.video_downloader.subtitle_processor`
3. `_get_downloader_class()` function removed
4. Pipeline preserved: VIDEO_SUBTITLE -> download -> clip -> 16:9 -> transcribe -> translate -> embed; VIDEO_ONLY -> download -> clip -> 16:9
5. Multi-clip with merge preserved (fadewhite 1s)
6. All 55 existing VideoProcessor tests pass (with updated imports/mocks)
7. All 326+ existing tests pass
8. All new tests from Stories 6.1-6.5 pass
9. `requirements.txt` cleaned: no python-vlc, no opencv-python, no moviepy
10. PyInstaller spec updated: new `src/processors/video_downloader/*` modules included
11. .exe builds successfully
12. .exe starts and Video Downloader view is functional

**Files Modified:**
- `pauta-automation/src/processors/video_processor.py` -- rewrite to use internal engine
- `pauta-automation/requirements.txt` -- dependency cleanup
- `pauta-automation/spec/Pauta-Automation.spec` -- add hidden imports for new modules
- `pauta-automation/tests/test_video_processor.py` -- update mocks to reference internal modules

**Files Removed (or references removed):**
- No files deleted, but all `sys.path.insert` to external `VIDEO_DOWNLOADER_PATH` removed

**Technical Notes:**
- The rewrite should be minimal: replace `_get_downloader_class()` with direct import from internal engine
- The `VideoProcessor.process()` method signature stays the same (receives `Instruction`, returns path)
- Mocks in tests need to change from `downloader.VideoDownloader` to `src.processors.video_downloader.engine.VideoDownloaderEngine`
- The .exe must be tested on a clean machine (or at minimum, a directory without the external `D:\EPOCH\...` path) to confirm independence

---

## Story Dependency Graph

```
Story 6.1 (Engine)
    |
    +---> Story 6.2 (Standalone UI) -- depends on engine for download operations
    |
    +---> Story 6.3 (Subtitle Module) -- depends on engine for audio extraction
              |
              +---> Story 6.4 (Subtitle Editor) -- depends on subtitle module for SRT/embed
              |
              +---> Story 6.5 (Pauta Integration) -- depends on UI + subtitle module
                        |
                        +---> Story 6.6 (Replace Wrapper) -- depends on all above

Recommended implementation order: 6.1 -> 6.3 -> 6.2 -> 6.4 -> 6.5 -> 6.6
```

**Rationale for order:**
1. **6.1 first** -- engine is the foundation everything else depends on
2. **6.3 second** -- subtitle processing is needed by both the editor and the pauta integration
3. **6.2 third** -- standalone UI can be built once engine exists, and tested independently
4. **6.4 fourth** -- subtitle editor needs both the engine and subtitle module
5. **6.5 fifth** -- integration requires all previous components working
6. **6.6 last** -- cleanup and replacement is the final step after everything is validated

---

## Compatibility Requirements

- [x] Existing APIs remain unchanged (PautaBridge public methods preserved)
- [x] No database schema changes (no database in this project)
- [x] UI changes follow existing patterns (dark mode, design system, bridge pattern, EventBus polling)
- [x] Performance impact is minimal (video processing is already I/O bound -- no architecture change)
- [x] All 326+ existing tests continue passing after each story
- [x] .exe build continues to work

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| HTML5 video cannot play all formats that FFmpeg outputs | Low | Medium | FFmpeg already outputs H.264 MP4, which EdgeChromium supports natively. Add format validation post-clip. |
| Subtitle editor cannot handle large SRT files (1000+ entries) | Low | Low | Videos are typically clipped to 1-5 minute segments. Virtual scrolling if needed. |
| Whisper API latency causes poor UX | Medium | Medium | Progress callback shows "Transcribing..." with spinner. Configurable timeout. Retry on failure. |
| yt-dlp breaks with platform changes (Twitter/X, Instagram) | Medium | Medium | Already a known risk in current system. yt-dlp updates frequently. Pin version but allow update. |
| pywebview file:// access blocked for local video playback | Low | High | pywebview with EdgeChromium allows local file access. If blocked, serve via local HTTP server (webview.start with http). |
| Migration introduces regressions in existing video processing | Medium | High | Story 6.6 explicitly runs full regression. Existing 55 video tests provide safety net. |

**Primary Risk:** Breaking existing video processing pipeline during migration.
**Mitigation:** Stories are ordered so the old wrapper (`video_processor.py`) is only replaced in the final story (6.6), after all new components are built and tested independently. Until 6.6, both old and new implementations coexist.
**Rollback Plan:** Revert Story 6.6 changes to restore the old `video_processor.py` wrapper. Stories 6.1-6.5 are additive (new files) and do not break existing functionality.

---

## Quality Assurance Strategy

**Pre-Commit (every story):**
- ruff lint: 0 issues
- All existing tests pass
- New tests pass

**Pre-PR (Stories 6.2, 6.4 -- UI changes):**
- Visual consistency check against design system
- Bridge method validation (JS calls match Python signatures)

**Story 6.6 (Final -- regression gate):**
- Full test suite: 326+ existing + 40+ new tests
- .exe build success
- Manual smoke test: download a video from YouTube, clip it, transcribe, translate, embed subtitles
- Verify .exe works without `D:\EPOCH\...` directory present

**Agent Assignments:**
- All stories: @dev (executor) -- code implementation
- Stories 6.1-6.5: @architect (quality gate) -- pattern validation, architecture consistency
- Story 6.6: @qa (quality gate) -- full regression, dependency audit, build validation

---

## Definition of Done

- [ ] All 6 stories completed with acceptance criteria met
- [ ] Zero references to external `D:\EPOCH\...` path in codebase
- [ ] API key sourced from config.json (no hardcoded keys)
- [ ] All existing 326+ tests passing
- [ ] 40+ new tests covering migrated functionality
- [ ] ruff lint: 0 issues
- [ ] .exe builds and runs successfully
- [ ] Video Downloader view functional in sidebar (standalone + pauta integration)
- [ ] Subtitle editor functional in browser (no VLC/OpenCV dependency)
- [ ] Dependencies cleaned: no python-vlc, opencv-python, moviepy, customtkinter in requirements

---

## Estimated Effort

| Story | Complexity | Estimated LOC | Estimated Time |
|-------|-----------|---------------|----------------|
| 6.1 Engine | Medium | ~600 Python + ~200 test | 2-3 hours |
| 6.2 Standalone UI | Medium-High | ~400 HTML/CSS/JS + ~100 Python | 3-4 hours |
| 6.3 Subtitle Module | Medium | ~300 Python + ~150 test | 2-3 hours |
| 6.4 Subtitle Editor | High | ~400 HTML/CSS/JS + ~100 Python | 3-4 hours |
| 6.5 Integration | Medium | ~200 JS + ~50 Python | 1-2 hours |
| 6.6 Cleanup | Low-Medium | ~100 Python (rewrite) + test updates | 1-2 hours |
| **Total** | | **~2600 LOC** | **12-18 hours** |

---

## Story Manager Handoff

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running Python 3.10+ / pywebview / HTML+CSS+JS
- Integration points: VideoProcessor, PautaBridge (js_api), EventBus, Orchestrator, config.json
- Existing patterns to follow: BaseProcessor interface, EventBus progress events, pywebview bridge methods, dark mode design system, 500ms polling
- Critical compatibility requirements: 326+ existing tests must pass, .exe must build, no external path dependencies
- Each story must include verification that existing functionality remains intact
- Stories 6.1 and 6.3 are the foundation -- prioritize these for independent validation

The epic should maintain system integrity while delivering a fully internalized Video Downloader with web-based UI and subtitle editor."

---

*Epic 6 -- Video Downloader Migration*
*Author: Morgan (PM Agent) | Synkra AIOX*
*-- Morgan, planejando o futuro*
