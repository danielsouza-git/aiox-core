# Story 6.1: Internalize Video Downloader Engine

**Story ID:** PAUTA-6.1
**Epic:** PAUTA-6 (Video Downloader Migration)
**Status:** InProgress
**Author:** Dex (Dev Agent)
**Date:** 2026-03-25

---

## Story

**Como** produtor do programa,
**Quero** que a logica de download, clip, merge e repeat de videos esteja dentro do pauta-automation,
**Para que** o app nao dependa de um diretorio externo e seja autocontido.

---

## Acceptance Criteria

1. [x] `VideoDownloaderEngine` class importable from `src.processors.video_downloader.engine`
2. [x] `engine.download(url, quality, output_dir)` downloads video via yt-dlp
3. [x] `engine.clip_video(path, start, end)` clips video via FFmpeg
4. [x] `engine.merge_clips(paths, output)` merges clips with fadewhite
5. [x] `engine.repeat_clip(path, count)` repeats clip N times
6. [x] `engine.parse_time("0130")` returns 90 (1min30s)
7. [x] `engine.detect_platform(url)` identifies YouTube/X/Instagram
8. [x] `engine.get_video_info(url)` returns VideoInfo with metadata
9. [x] `engine.adjust_aspect_ratio(path, "16:9")` adjusts via FFmpeg
10. [x] `QUALITY_OPTIONS` dict preserved exactly from original
11. [x] 15+ unit tests with mocks for yt-dlp and FFmpeg
12. [x] All existing tests (326+) continue passing
13. [x] ruff lint: 0 issues

---

## Tasks

- [x] Task 1: Create `src/processors/video_downloader/__init__.py` package
- [x] Task 2: Create `src/processors/video_downloader/engine.py` with VideoDownloaderEngine
- [x] Task 3: Create `tests/test_video_downloader/__init__.py`
- [x] Task 4: Create `tests/test_video_downloader/test_engine.py` with 15+ tests
- [x] Task 5: Run all existing tests to verify no regression
- [x] Task 6: Run ruff lint on new files

---

## Dev Notes

- Source extracted from `D:\EPOCH\...\video_downloader\downloader.py`
- Preserved exact yt-dlp format strings from QUALITY_OPTIONS
- Preserved exact FFmpeg commands for clip, merge, repeat, aspect ratio
- Used dataclass for VideoInfo (matching original)
- All FFmpeg operations use subprocess (matching original, no moviepy)
- Progress callback interface preserved: `(percentage: float, status: str) -> None`
- Does NOT modify existing `video_processor.py` (that is Story 6.6)

---

## File List

| File | Action | Description |
|------|--------|-------------|
| `src/processors/video_downloader/__init__.py` | Created | Package init, exports VideoDownloaderEngine |
| `src/processors/video_downloader/engine.py` | Created | Core engine class with all download/clip/merge/repeat logic |
| `tests/test_video_downloader/__init__.py` | Created | Test package init |
| `tests/test_video_downloader/test_engine.py` | Created | 18 unit tests covering all engine methods |

---

## Dev Agent Record

### Agent Model Used
claude-opus-4-6

### Debug Log
(none)

### Completion Notes
- Engine extracted from original downloader.py with exact logic preservation
- 18 unit tests all passing with mocks for yt-dlp and subprocess
- All existing tests continue passing
- ruff lint: 0 issues

### Change Log
- 2026-03-25: Created story file, implemented engine and tests
