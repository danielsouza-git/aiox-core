# Story PAUTA-7.1: PyInstaller Frozen Executable Path Resolution Fix

## Status

Ready for Review

## Story

**As a** user running pauta-automation as a compiled `.exe`,
**I want** the application to correctly locate config files and assets,
**so that** the application works reliably in both source and executable modes without manual path adjustments.

## Acceptance Criteria

1. When running as PyInstaller executable (`.exe`), paths to `config/credentials.json`, `config/token.json`, and `assets/` resolve correctly
2. When running as Python source (`python main.py`), paths continue to resolve correctly (backward compatibility)
3. No new dependencies are added
4. Path resolution uses `sys.frozen` and `sys.executable` detection pattern already established in `config.py`
5. All affected modules (`auth.py`, `social_media.py`, `slide_processor.py`) use consistent path resolution logic

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Disabled
>
> CodeRabbit CLI is not enabled in `core-config.yaml`.
> Quality validation will use manual review process only.
> To enable, set `coderabbit_integration.enabled: true` in core-config.yaml

## Tasks / Subtasks

- [x] Task 1: Update `auth.py` path resolution (AC: 1, 4)
  - [x] Add `sys.frozen` check to `_resolve_path()` function
  - [x] Use `sys.executable` when frozen, `__file__` when source
  - [x] Ensure `_PROJECT_ROOT` resolves correctly in both modes
  - [x] Test with both `config/credentials.json` and `config/token.json` paths

- [x] Task 2: Update `social_media.py` path resolution (AC: 1, 5)
  - [x] Replace `ASSETS_DIR` hardcoded path calculation with `sys.frozen`-aware logic
  - [x] Extract path resolution to helper function if needed
  - [x] Ensure `assets/platform_logos/` is found in both modes

- [x] Task 3: Update `slide_processor.py` path resolution (AC: 1, 5)
  - [x] Replace `LOGOS_DIR` hardcoded path calculation with `sys.frozen`-aware logic
  - [x] Ensure `assets/logos/` is found in both modes
  - [x] Maintain consistency with other modules

- [x] Task 4: Testing (AC: 2)
  - [x] Write unit tests for path resolution in both frozen and source modes
  - [x] Test with mocked `sys.frozen` attribute
  - [x] Verify backward compatibility with source mode execution
  - [x] Document test coverage

- [ ] Task 5: Integration Testing (AC: 1, 2)
  - [ ] Manual test: Run as source (`python main.py`) and verify all paths resolve
  - [ ] Manual test: Build `.exe` with PyInstaller and verify all paths resolve
  - [ ] Verify `config/credentials.json` is found in both modes
  - [ ] Verify `assets/` directories are accessible in both modes

## Dev Notes

### Bug Analysis

**Root Cause**: Modules use `__file__` to calculate project root, but when PyInstaller packages the app, `__file__` points to the temporary `_MEIPASS` directory instead of the executable's directory.

**Current Behavior**:
- `config.py` (lines 61-74): Already handles `sys.frozen` correctly
- `auth.py` (line 15): Uses `__file__` unconditionally → BROKEN in frozen mode
- `social_media.py` (line 30): Uses `__file__` unconditionally → BROKEN in frozen mode
- `slide_processor.py` (line 38-40): Uses `__file__` unconditionally → BROKEN in frozen mode

**Reference Implementation** (from `config.py`):
```python
if getattr(sys, "frozen", False):
    # Quando empacotado como executavel
    base_dir = os.path.dirname(os.path.abspath(sys.executable))
else:
    # Quando rodando como source
    base_dir = os.path.dirname(os.path.abspath(__file__))
```

### Affected Files and Lines

1. **`pauta-automation/src/google_api/auth.py`**
   - Line 15: `_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))`
   - Line 21-25: `_resolve_path()` function

2. **`pauta-automation/src/extractors/social_media.py`**
   - Line 30: `ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "assets", "platform_logos")`

3. **`pauta-automation/src/processors/slide_processor.py`**
   - Lines 38-40: `LOGOS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "assets", "logos")`

### Fix Pattern

Apply the same pattern from `config.py` to all affected modules:

```python
import sys

def get_project_root():
    """Get project root directory, works in both source and frozen modes."""
    if getattr(sys, "frozen", False):
        # Running as compiled executable
        return os.path.dirname(os.path.abspath(sys.executable))
    else:
        # Running as source
        # Adjust dirname() depth based on module location
        return os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
```

### Testing

**Test Scenarios**:
1. **Source mode**: `python main.py` — paths resolve to project root
2. **Frozen mode (mocked)**: Mock `sys.frozen = True` and `sys.executable` — paths resolve to executable directory
3. **Frozen mode (real)**: Build with `pyinstaller main.spec` and run `dist/pauta-automation.exe` — all features work

**Test Files**:
- Create `tests/test_path_resolution.py` with mocked `sys.frozen` tests
- Verify each module's path resolution function independently
- Integration test with actual PyInstaller build

### Technical Constraints

- **No new dependencies**: Use only stdlib (`sys`, `os`)
- **Backward compatibility**: Source mode (`python main.py`) must continue working
- **Consistency**: All modules should use the same path resolution pattern
- **PyInstaller compatibility**: Must work with both `--onefile` and `--onedir` modes

### Previous Story Insights

[AUTO-DECISION] No previous stories directly related to path resolution — this is the first story addressing PyInstaller compatibility.

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-30 | 1.0 | Initial story creation | @sm (River) |
| 2026-03-30 | 1.1 | Implementation complete: 3 modules fixed, 14 tests added, 510/510 passing | @dev (Dex) |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (Dex / @dev)

### Debug Log References

No debug issues encountered. All changes were straightforward pattern application.

### Completion Notes List

1. Added `import sys` to all 3 affected modules
2. Applied `getattr(sys, "frozen", False)` check at module-level for path resolution in auth.py, social_media.py, slide_processor.py
3. When frozen: uses `os.path.dirname(os.path.abspath(sys.executable))` as project root
4. When source: preserves original `__file__`-based path calculation (backward compatible)
5. Pattern matches existing `config.py` reference implementation exactly
6. Created 14 unit tests covering source mode, frozen mode, and cross-module consistency
7. Google API mocks injected at test module level to handle missing `googleapiclient` in test env
8. All 510 pauta-automation tests pass (496 existing + 14 new) with zero regressions
9. Zero new dependencies added -- only stdlib `sys` and `os` used
10. Task 5 (Integration Testing) left unchecked -- requires manual PyInstaller build + execution on Windows

### File List

| File | Action | Description |
|------|--------|-------------|
| `pauta-automation/src/google_api/auth.py` | Modified | Added `sys.frozen` check for `_PROJECT_ROOT` resolution |
| `pauta-automation/src/extractors/social_media.py` | Modified | Added `sys.frozen` check for `ASSETS_DIR` resolution |
| `pauta-automation/src/processors/slide_processor.py` | Modified | Added `sys.frozen` check for `LOGOS_DIR` resolution |
| `pauta-automation/tests/test_path_resolution.py` | Created | 14 unit tests for frozen/source path resolution |

## QA Results

_To be filled by QA Agent_
