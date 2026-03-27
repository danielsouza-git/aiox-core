"""Shared test fixtures for pauta-automation tests.

Provides mock configurations, temporary directories, and fake template images
so tests don't depend on external files (fonts, PNG templates on user desktop).
"""

import pytest
from PIL import Image, ImageFont

from src.core.config import AppConfig, GoogleConfig, OpenAIConfig, PathsConfig, VideoConfig


@pytest.fixture
def tmp_output_dir(tmp_path):
    """Temporary output directory for test artifacts."""
    output_dir = tmp_path / "output"
    output_dir.mkdir()
    return str(output_dir)


@pytest.fixture
def fake_template_png(tmp_path):
    """Creates a real PNG template image (1920x1080 RGBA) for tarja tests."""
    template_path = tmp_path / "lower_template.png"
    img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    img.save(str(template_path), "PNG")
    return str(template_path)


@pytest.fixture
def fake_font_path():
    """Returns path to a default font available on the system.

    Uses PIL's built-in default font mechanism -- ImageFont.truetype
    will be mocked to return the default font in the tarja_config fixture.
    We return a placeholder path since the actual font loading is mocked.
    """
    return "/fake/font.ttf"


@pytest.fixture
def tarja_test_config(tmp_output_dir, fake_template_png, fake_font_path):
    """Creates an AppConfig suitable for tarja testing.

    All paths point to temporary files/directories so tests
    don't depend on external files on the user's desktop.
    """
    return AppConfig(
        google=GoogleConfig(
            credentials_path="/fake/creds.json",
            token_path="/fake/token.json",
            slides_template_id="fake-template-id",
        ),
        openai=OpenAIConfig(api_key="sk-fake-test-key"),
        paths=PathsConfig(
            output_dir=tmp_output_dir,
            font_tarja_bold=fake_font_path,
            font_tarja_regular=fake_font_path,
            font_tarja_semibold=fake_font_path,
            tarja_template_epoch=fake_template_png,
            tarja_template_cobertura=fake_template_png,
        ),
        video=VideoConfig(
            default_quality="1080",
            whisper_model="whisper-1",
            translation_model="gpt-4",
        ),
    )


@pytest.fixture
def mock_fonts(monkeypatch):
    """Patches ImageFont.truetype to return a default bitmap font.

    This avoids needing real .ttf font files on the test machine.
    The default font is small but sufficient for rendering text in tests.
    """
    default_font = ImageFont.load_default()

    def fake_truetype(font_path, size=10, *args, **kwargs):
        # Return default font -- it works for textbbox and text drawing
        return default_font

    monkeypatch.setattr("PIL.ImageFont.truetype", fake_truetype)
    return default_font
