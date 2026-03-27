"""Tests for Subtitle Editor bridge methods and SRT utilities (Story 6.7)."""

import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

# Mock webview before importing app module
sys.modules.setdefault("webview", MagicMock())

from src.gui.app import PautaBridge  # noqa: E402
from src.processors.video_downloader.srt_utils import (  # noqa: E402
    SubtitleEntry,
    SubtitleStyle,
    format_timestamp,
    parse_srt,
    write_srt,
)


# ── Fixtures ──


@pytest.fixture
def bridge(tmp_path):
    """Create PautaBridge instance."""
    return PautaBridge(root_dir=tmp_path)


@pytest.fixture
def sample_srt(tmp_path):
    """Create a valid SRT file for testing."""
    srt_path = tmp_path / "test.srt"
    srt_path.write_text(
        "1\n"
        "00:00:01,000 --> 00:00:04,000\n"
        "Hello world\n"
        "\n"
        "2\n"
        "00:00:05,000 --> 00:00:08,500\n"
        "This is a test\n"
        "with multiple lines\n"
        "\n"
        "3\n"
        "00:00:10,000 --> 00:00:13,000\n"
        "Final subtitle\n",
        encoding="utf-8",
    )
    return str(srt_path)


@pytest.fixture
def sample_video(tmp_path):
    """Create a fake video file (empty mp4 placeholder)."""
    video_path = tmp_path / "test.mp4"
    video_path.write_bytes(b"\x00" * 100)
    return str(video_path)


@pytest.fixture
def empty_srt(tmp_path):
    """Create an empty SRT file."""
    srt_path = tmp_path / "empty.srt"
    srt_path.write_text("", encoding="utf-8")
    return str(srt_path)


@pytest.fixture
def malformed_srt(tmp_path):
    """Create a malformed SRT file with some valid and invalid entries."""
    srt_path = tmp_path / "malformed.srt"
    srt_path.write_text(
        "1\n"
        "00:00:01,000 --> 00:00:04,000\n"
        "Valid entry\n"
        "\n"
        "not a number\n"
        "invalid timestamp\n"
        "This should be skipped\n"
        "\n"
        "3\n"
        "00:00:10,000 --> 00:00:13,000\n"
        "Another valid entry\n",
        encoding="utf-8",
    )
    return str(srt_path)


@pytest.fixture
def bom_srt(tmp_path):
    """Create an SRT file with BOM."""
    srt_path = tmp_path / "bom.srt"
    srt_path.write_text(
        "\ufeff1\n"
        "00:00:01,000 --> 00:00:04,000\n"
        "BOM entry\n",
        encoding="utf-8",
    )
    return str(srt_path)


# ── parse_srt Tests ──


class TestParseSrt:
    def test_parses_valid_srt(self, sample_srt):
        entries = parse_srt(sample_srt)
        assert len(entries) == 3
        assert entries[0].index == 1
        assert entries[0].start_seconds == pytest.approx(1.0)
        assert entries[0].end_seconds == pytest.approx(4.0)
        assert entries[0].text == "Hello world"

    def test_parses_multiline_text(self, sample_srt):
        entries = parse_srt(sample_srt)
        assert entries[1].text == "This is a test\nwith multiple lines"

    def test_returns_empty_for_empty_file(self, empty_srt):
        entries = parse_srt(empty_srt)
        assert entries == []

    def test_skips_malformed_entries(self, malformed_srt):
        entries = parse_srt(malformed_srt)
        assert len(entries) == 2
        assert entries[0].text == "Valid entry"
        assert entries[1].text == "Another valid entry"

    def test_handles_bom(self, bom_srt):
        entries = parse_srt(bom_srt)
        assert len(entries) == 1
        assert entries[0].text == "BOM entry"

    def test_raises_for_missing_file(self):
        with pytest.raises(FileNotFoundError):
            parse_srt("/nonexistent/path.srt")

    def test_handles_dot_separator(self, tmp_path):
        srt_path = tmp_path / "dot.srt"
        srt_path.write_text(
            "1\n"
            "00:00:01.000 --> 00:00:04.000\n"
            "Dot separator\n",
            encoding="utf-8",
        )
        entries = parse_srt(str(srt_path))
        assert len(entries) == 1
        assert entries[0].start_seconds == pytest.approx(1.0)


# ── write_srt Tests ──


class TestWriteSrt:
    def test_writes_valid_srt(self, tmp_path):
        entries = [
            SubtitleEntry(index=1, start_seconds=1.0, end_seconds=4.0, text="Hello"),
            SubtitleEntry(index=2, start_seconds=5.5, end_seconds=8.0, text="World"),
        ]
        output_path = str(tmp_path / "output.srt")
        write_srt(entries, output_path)

        content = Path(output_path).read_text(encoding="utf-8")
        assert "00:00:01,000 --> 00:00:04,000" in content
        assert "Hello" in content
        assert "00:00:05,500 --> 00:00:08,000" in content
        assert "World" in content

    def test_roundtrip_parse_write(self, sample_srt, tmp_path):
        entries = parse_srt(sample_srt)
        output_path = str(tmp_path / "roundtrip.srt")
        write_srt(entries, output_path)
        re_parsed = parse_srt(output_path)
        assert len(re_parsed) == len(entries)
        for orig, reloaded in zip(entries, re_parsed):
            assert orig.text == reloaded.text
            assert orig.start_seconds == pytest.approx(reloaded.start_seconds, abs=0.01)
            assert orig.end_seconds == pytest.approx(reloaded.end_seconds, abs=0.01)


# ── format_timestamp Tests ──


class TestFormatTimestamp:
    def test_zero(self):
        assert format_timestamp(0) == "00:00:00,000"

    def test_negative(self):
        assert format_timestamp(-5) == "00:00:00,000"

    def test_simple(self):
        assert format_timestamp(65.5) == "00:01:05,500"

    def test_hours(self):
        assert format_timestamp(3661.123) == "01:01:01,123"


# ── PautaBridge.load_srt Tests ──


class TestBridgeLoadSrt:
    def test_loads_valid_srt(self, bridge, sample_srt):
        result = bridge.load_srt(sample_srt)
        assert result["status"] == "ok"
        assert len(result["entries"]) == 3
        assert result["entries"][0]["text"] == "Hello world"
        assert result["entries"][0]["start_seconds"] == pytest.approx(1.0)

    def test_error_for_missing_file(self, bridge):
        result = bridge.load_srt("/nonexistent/file.srt")
        assert result["status"] == "error"

    def test_empty_srt_returns_empty_entries(self, bridge, empty_srt):
        result = bridge.load_srt(empty_srt)
        assert result["status"] == "ok"
        assert result["entries"] == []


# ── PautaBridge.save_srt Tests ──


class TestBridgeSaveSrt:
    def test_saves_entries(self, bridge, tmp_path):
        srt_path = str(tmp_path / "output" / "saved.srt")
        entries = [
            {"index": 1, "start_seconds": 0.0, "end_seconds": 3.0, "text": "First"},
            {"index": 2, "start_seconds": 4.0, "end_seconds": 7.0, "text": "Second"},
        ]
        result = bridge.save_srt(srt_path, entries)
        assert result["status"] == "ok"
        assert os.path.exists(srt_path)

        # Verify content
        parsed = parse_srt(srt_path)
        assert len(parsed) == 2
        assert parsed[0].text == "First"

    def test_error_handling(self, bridge):
        # Pass invalid data
        result = bridge.save_srt("", [{"invalid": True}])
        assert result["status"] == "error"


# ── PautaBridge.get_video_path_for_srt Tests ──


class TestBridgeGetVideoPathForSrt:
    def test_returns_video_path(self, bridge, sample_srt, sample_video, tmp_path):
        # Create SRT with matching video path
        srt_path = str(tmp_path / "test.srt")
        Path(srt_path).write_text("1\n00:00:00,000 --> 00:00:01,000\nTest\n", encoding="utf-8")
        result = bridge.get_video_path_for_srt(srt_path)
        assert result["status"] == "ok"
        assert result["video_path"].endswith(".mp4")

    def test_error_when_video_missing(self, bridge, tmp_path):
        srt_path = str(tmp_path / "no_video.srt")
        Path(srt_path).write_text("1\n00:00:00,000 --> 00:00:01,000\nTest\n", encoding="utf-8")
        result = bridge.get_video_path_for_srt(srt_path)
        assert result["status"] == "error"


# ── PautaBridge.open_subtitle_editor Tests ──


class TestOpenSubtitleEditor:
    @patch("src.gui.app.webview")
    def test_opens_editor_window(self, mock_webview, bridge, sample_srt, sample_video):
        mock_window = MagicMock()
        mock_window.events.loaded = MagicMock()
        mock_window.events.loaded.__iadd__ = MagicMock(return_value=mock_window.events.loaded)
        mock_webview.create_window.return_value = mock_window

        # Create the subtitle-editor.html in the expected location
        editor_html = Path(bridge._root_dir) / "ui" / "subtitle-editor.html"
        editor_html.parent.mkdir(parents=True, exist_ok=True)
        editor_html.write_text("<html></html>")

        result = bridge.open_subtitle_editor(sample_srt, sample_video)
        assert result["status"] == "ok"
        mock_webview.create_window.assert_called_once()

        # Verify window was created with correct parameters
        call_kwargs = mock_webview.create_window.call_args
        assert "Subtitle Editor" in call_kwargs.kwargs.get("title", call_kwargs[1].get("title", ""))

    def test_error_for_invalid_srt(self, bridge, sample_video):
        result = bridge.open_subtitle_editor("/nonexistent/file.srt", sample_video)
        assert result["status"] == "error"

    @patch("src.gui.app.webview")
    def test_error_for_missing_editor_html(self, mock_webview, bridge, sample_srt, sample_video):
        # Don't create the HTML file — should return error
        result = bridge.open_subtitle_editor(sample_srt, sample_video)
        assert result["status"] == "error"
        assert "nao encontrado" in result["message"].lower()


# ── PautaBridge.cancel_editor Tests ──


class TestCancelEditor:
    def test_cancel_returns_ok(self, bridge):
        result = bridge.cancel_editor()
        assert result["status"] == "ok"

    def test_cancel_destroys_editor_window(self, bridge):
        mock_window = MagicMock()
        bridge._editor_window = mock_window
        result = bridge.cancel_editor()
        assert result["status"] == "ok"
        mock_window.destroy.assert_called_once()
        assert bridge._editor_window is None


# ── PautaBridge.embed_subtitles_standalone Tests ──


class TestEmbedSubtitlesStandalone:
    def test_accepts_style_dict(self, bridge, sample_srt, sample_video):
        style = {
            "font_size": 24,
            "bold": True,
            "color": "&H00FFFFFF",
            "outline_width": 2,
            "position": "bottom",
        }
        # This starts a thread, should return ok immediately
        with patch("src.processors.video_downloader.subtitle_processor.SubtitleProcessor"):
            result = bridge.embed_subtitles_standalone(sample_video, sample_srt, style)
            assert result["status"] == "ok"

    def test_error_for_missing_video(self, bridge, sample_srt):
        style = {"font_size": 21, "bold": True, "color": "&H00FFFFFF", "outline_width": 2}
        # SubtitleProcessor init requires api_key — patch it
        result = bridge.embed_subtitles_standalone(
            "/nonexistent/video.mp4", sample_srt, style
        )
        # Should still return ok (thread spawned), error emitted via event bus
        assert result["status"] == "ok"


# ── SubtitleStyle Tests ──


class TestSubtitleStyle:
    def test_default_values(self):
        style = SubtitleStyle()
        assert style.font_name == "Arial"
        assert style.font_size == 21
        assert style.bold is True
        assert style.color == "&H00FFFFFF"
        assert style.outline_color == "&H00000000"
        assert style.outline_width == 2
        assert style.position == "bottom"

    def test_custom_values(self):
        style = SubtitleStyle(
            font_name="Helvetica",
            font_size=30,
            bold=False,
            color="&H000000FF",
            outline_color="&H00FF0000",
            outline_width=3,
            position="top",
        )
        assert style.font_name == "Helvetica"
        assert style.font_size == 30
        assert style.bold is False
        assert style.position == "top"
