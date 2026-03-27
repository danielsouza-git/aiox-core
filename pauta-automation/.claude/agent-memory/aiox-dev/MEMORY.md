# Dev Agent Memory - pauta-automation

## Project Structure
- Python desktop app at `pauta-automation/` within the aios-core monorepo
- Source: `pauta-automation/src/` (processors, parser, core, extractors, google_api)
- Tests: `pauta-automation/tests/` (pytest-based)
- Config: `pauta-automation/config.json` (user-specific paths to fonts, templates, output dirs)

## Key Patterns

### Test Fixtures for TarjaProcessor
- `conftest.py` provides `tarja_test_config`, `mock_fonts`, `fake_template_png` fixtures
- TarjaProcessor depends on external files: PNG template, TTF fonts, output directory
- Tests mock `PIL.ImageFont.truetype` via monkeypatch to avoid needing real font files
- A real 1920x1080 RGBA PNG is created as temp fixture for the template
- See `pauta-automation/tests/conftest.py` for full implementation

### Auto-naming Logic (TarjaProcessor)
- `_auto_name` returns "giro" ONLY when `is_giro_header=True` (title == "MANCHETES DO BRASIL E DO MUNDO")
- All other cases return "lt{counter}" incrementally
- Tests must use the exact header title to get "giro.png" output

### VideoProcessor Test Gotcha
- `patch.object(processor, method)` as context manager: assertions must be INSIDE the `with` block
- The mock reference is only valid within the context manager scope
