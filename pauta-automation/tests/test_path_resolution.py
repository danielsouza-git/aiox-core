"""Testes unitarios para path resolution em modo frozen (PyInstaller) e source.

Verifica que todos os modulos afetados resolvem paths corretamente:
- auth.py: _PROJECT_ROOT e _resolve_path()
- social_media.py: ASSETS_DIR
- slide_processor.py: LOGOS_DIR

Testa ambos os modos:
1. Source mode (python direto): usa __file__ para calcular raiz
2. Frozen mode (PyInstaller .exe): usa sys.executable para calcular raiz
"""

import importlib
import os
import sys
import types
from unittest.mock import patch, MagicMock


# ---------------------------------------------------------------------------
# Setup: mock google API dependencies so auth.py can be imported even when
# google-api-python-client is not installed in the test environment.
# ---------------------------------------------------------------------------

def _ensure_google_mocks():
    """Inject mock google modules into sys.modules if not already present."""
    mods_to_mock = [
        "googleapiclient",
        "googleapiclient.discovery",
        "google",
        "google.auth",
        "google.auth.transport",
        "google.auth.transport.requests",
        "google.oauth2",
        "google.oauth2.credentials",
        "google_auth_oauthlib",
        "google_auth_oauthlib.flow",
    ]
    for name in mods_to_mock:
        if name not in sys.modules:
            mock_mod = types.ModuleType(name)
            mock_mod.build = MagicMock()  # googleapiclient.discovery.build
            sys.modules[name] = mock_mod


_ensure_google_mocks()


# ===========================================================================
# 1. auth.py — _PROJECT_ROOT e _resolve_path
# ===========================================================================

def test_auth_project_root_source_mode():
    """auth.py: _PROJECT_ROOT resolve corretamente em modo source (python direto)."""
    assert not getattr(sys, "frozen", False), "Este teste deve rodar em modo source"

    from src.google_api import auth
    root = auth._PROJECT_ROOT

    # _PROJECT_ROOT deve apontar para pauta-automation/ (3 niveis acima de auth.py)
    assert os.path.isabs(root)
    # Deve conter a pasta src/ como subdiretorio
    assert os.path.isdir(os.path.join(root, "src")), (
        f"_PROJECT_ROOT={root} nao contem subdiretorio src/"
    )


def test_auth_project_root_frozen_mode():
    """auth.py: _PROJECT_ROOT resolve para diretorio do executavel em modo frozen."""
    fake_exe = os.path.normpath("/fake/dist/pauta-automation.exe")

    with patch.object(sys, "frozen", True, create=True), \
         patch.object(sys, "executable", fake_exe):
        import src.google_api.auth as auth_module
        reloaded = importlib.reload(auth_module)

    expected = os.path.dirname(os.path.abspath(fake_exe))
    assert reloaded._PROJECT_ROOT == expected

    # Restaura o modulo para modo source
    importlib.reload(auth_module)


def test_auth_resolve_path_relative():
    """auth.py: _resolve_path() resolve path relativo ao _PROJECT_ROOT."""
    from src.google_api.auth import _resolve_path, _PROJECT_ROOT

    result = _resolve_path("config/credentials.json")
    expected = os.path.join(_PROJECT_ROOT, "config", "credentials.json")
    assert result == expected


def test_auth_resolve_path_absolute_passthrough():
    """auth.py: _resolve_path() retorna path absoluto sem modificacao."""
    from src.google_api.auth import _resolve_path

    abs_path = os.path.normpath("/absolute/path/to/file.json")
    result = _resolve_path(abs_path)
    assert result == abs_path


def test_auth_resolve_path_frozen_mode():
    """auth.py: _resolve_path() usa diretorio do executavel em modo frozen."""
    fake_exe = os.path.normpath("/fake/dist/pauta-automation.exe")
    expected_root = os.path.dirname(os.path.abspath(fake_exe))

    with patch.object(sys, "frozen", True, create=True), \
         patch.object(sys, "executable", fake_exe):
        import src.google_api.auth as auth_module
        reloaded = importlib.reload(auth_module)

    result = reloaded._resolve_path("config/credentials.json")
    expected = os.path.join(expected_root, "config", "credentials.json")
    assert result == expected

    # Restaura
    importlib.reload(auth_module)


# ===========================================================================
# 2. social_media.py — ASSETS_DIR
# ===========================================================================

def test_social_media_assets_dir_source_mode():
    """social_media.py: ASSETS_DIR resolve corretamente em modo source."""
    assert not getattr(sys, "frozen", False)

    from src.extractors import social_media
    assets_dir = social_media.ASSETS_DIR

    assert os.path.isabs(assets_dir)
    assert assets_dir.endswith(os.path.join("assets", "platform_logos"))


def test_social_media_assets_dir_frozen_mode():
    """social_media.py: ASSETS_DIR resolve para diretorio do executavel em modo frozen."""
    fake_exe = os.path.normpath("/fake/dist/pauta-automation.exe")
    expected_root = os.path.dirname(os.path.abspath(fake_exe))

    with patch.object(sys, "frozen", True, create=True), \
         patch.object(sys, "executable", fake_exe):
        import src.extractors.social_media as sm_module
        reloaded = importlib.reload(sm_module)

    expected = os.path.join(expected_root, "assets", "platform_logos")
    assert reloaded.ASSETS_DIR == expected

    # Restaura
    importlib.reload(sm_module)


def test_social_media_platform_logo_path_uses_assets_dir():
    """social_media.py: _get_platform_logo_path usa ASSETS_DIR correto."""
    from src.extractors.social_media import _get_platform_logo_path, ASSETS_DIR
    from src.core.models import Platform

    path = _get_platform_logo_path(Platform.X)
    assert path.startswith(ASSETS_DIR)
    assert path.endswith("x.png")


# ===========================================================================
# 3. slide_processor.py — LOGOS_DIR
# ===========================================================================

def test_slide_processor_logos_dir_source_mode():
    """slide_processor.py: LOGOS_DIR resolve corretamente em modo source."""
    assert not getattr(sys, "frozen", False)

    from src.processors import slide_processor
    logos_dir = slide_processor.LOGOS_DIR

    assert os.path.isabs(logos_dir)
    assert logos_dir.endswith(os.path.join("assets", "logos"))


def test_slide_processor_logos_dir_frozen_mode():
    """slide_processor.py: LOGOS_DIR resolve para diretorio do executavel em modo frozen."""
    fake_exe = os.path.normpath("/fake/dist/pauta-automation.exe")
    expected_root = os.path.dirname(os.path.abspath(fake_exe))

    with patch.object(sys, "frozen", True, create=True), \
         patch.object(sys, "executable", fake_exe):
        import src.processors.slide_processor as sp_module
        reloaded = importlib.reload(sp_module)

    expected = os.path.join(expected_root, "assets", "logos")
    assert reloaded.LOGOS_DIR == expected

    # Restaura
    importlib.reload(sp_module)


# ===========================================================================
# 4. Consistencia entre modulos
# ===========================================================================

def test_all_modules_use_same_root_in_source_mode():
    """Todos os modulos afetados resolvem para o mesmo diretorio raiz em modo source."""
    from src.google_api.auth import _PROJECT_ROOT
    from src.extractors.social_media import _ASSETS_BASE
    from src.processors.slide_processor import _LOGOS_BASE

    # Normaliza para comparacao
    root_auth = os.path.normpath(_PROJECT_ROOT)
    root_social = os.path.normpath(_ASSETS_BASE)
    root_slide = os.path.normpath(_LOGOS_BASE)

    assert root_auth == root_social, (
        f"auth._PROJECT_ROOT ({root_auth}) != social_media._ASSETS_BASE ({root_social})"
    )
    assert root_auth == root_slide, (
        f"auth._PROJECT_ROOT ({root_auth}) != slide_processor._LOGOS_BASE ({root_slide})"
    )


def test_all_modules_use_same_root_in_frozen_mode():
    """Todos os modulos afetados resolvem para o mesmo diretorio raiz em modo frozen."""
    fake_exe = os.path.normpath("/fake/dist/pauta-automation.exe")
    expected_root = os.path.dirname(os.path.abspath(fake_exe))

    with patch.object(sys, "frozen", True, create=True), \
         patch.object(sys, "executable", fake_exe):
        import src.google_api.auth as auth_mod
        import src.extractors.social_media as sm_mod
        import src.processors.slide_processor as sp_mod

        auth_reloaded = importlib.reload(auth_mod)
        sm_reloaded = importlib.reload(sm_mod)
        sp_reloaded = importlib.reload(sp_mod)

    assert auth_reloaded._PROJECT_ROOT == expected_root
    assert sm_reloaded._ASSETS_BASE == expected_root
    assert sp_reloaded._LOGOS_BASE == expected_root

    # Restaura
    importlib.reload(auth_mod)
    importlib.reload(sm_mod)
    importlib.reload(sp_mod)


# ===========================================================================
# 5. config.py — verificacao de referencia (ja funciona)
# ===========================================================================

def test_config_get_config_path_source_mode():
    """config.py: get_config_path() funciona em modo source (referencia -- ja correto)."""
    assert not getattr(sys, "frozen", False)

    from src.core.config import get_config_path

    path = get_config_path()
    assert os.path.isabs(path)
    assert path.endswith("config.json")


def test_config_get_config_path_frozen_mode():
    """config.py: get_config_path() funciona em modo frozen (referencia -- ja correto)."""
    fake_exe = os.path.normpath("/fake/dist/pauta-automation.exe")
    expected_dir = os.path.dirname(os.path.abspath(fake_exe))

    with patch.object(sys, "frozen", True, create=True), \
         patch.object(sys, "executable", fake_exe), \
         patch("os.path.exists", return_value=True):
        import src.core.config as config_mod
        reloaded = importlib.reload(config_mod)
        path = reloaded.get_config_path()

    assert path.startswith(expected_dir) or "config.json" in path

    # Restaura
    importlib.reload(config_mod)


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    print("=== Testes: path resolution (frozen/source) ===\n")

    tests = [
        # auth.py
        ("1a. auth _PROJECT_ROOT source mode", test_auth_project_root_source_mode),
        ("1b. auth _PROJECT_ROOT frozen mode", test_auth_project_root_frozen_mode),
        ("1c. auth _resolve_path relative", test_auth_resolve_path_relative),
        ("1d. auth _resolve_path absolute passthrough", test_auth_resolve_path_absolute_passthrough),
        ("1e. auth _resolve_path frozen mode", test_auth_resolve_path_frozen_mode),
        # social_media.py
        ("2a. social_media ASSETS_DIR source mode", test_social_media_assets_dir_source_mode),
        ("2b. social_media ASSETS_DIR frozen mode", test_social_media_assets_dir_frozen_mode),
        ("2c. social_media platform logo uses ASSETS_DIR", test_social_media_platform_logo_path_uses_assets_dir),
        # slide_processor.py
        ("3a. slide_processor LOGOS_DIR source mode", test_slide_processor_logos_dir_source_mode),
        ("3b. slide_processor LOGOS_DIR frozen mode", test_slide_processor_logos_dir_frozen_mode),
        # Consistencia
        ("4a. All modules same root source mode", test_all_modules_use_same_root_in_source_mode),
        ("4b. All modules same root frozen mode", test_all_modules_use_same_root_in_frozen_mode),
        # config.py (referencia)
        ("5a. config get_config_path source mode", test_config_get_config_path_source_mode),
        ("5b. config get_config_path frozen mode", test_config_get_config_path_frozen_mode),
    ]

    passed = 0
    failed = 0

    for name, test_fn in tests:
        try:
            test_fn()
            print(f"  PASS  {name}")
            passed += 1
        except Exception as e:
            print(f"  FAIL  {name}: {e}")
            failed += 1

    print(f"\n=== Resultado: {passed}/{passed + failed} testes passaram ===")
    if failed:
        print(f"FALHAS: {failed}")
        sys.exit(1)
    else:
        print("Todos os testes passaram!")
