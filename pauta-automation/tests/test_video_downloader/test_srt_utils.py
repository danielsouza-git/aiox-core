"""Tests for SRT/ASS utility functions in srt_utils.py.

Covers timestamp formatting, SRT parsing/writing round-trips,
ASS generation with default and custom styles, and ASS time adjustment.
"""

import os

import pytest

from src.processors.video_downloader.srt_utils import (
    SubtitleEntry,
    SubtitleStyle,
    adjust_ass_times,
    format_timestamp,
    generate_ass,
    parse_srt,
    write_srt,
    _parse_ass_timestamp,
    _parse_srt_timestamp,
    _seconds_to_ass_timestamp,
)


# ======================================================================
# SubtitleStyle
# ======================================================================


class TestSubtitleStyle:
    """Tests for SubtitleStyle dataclass with background fields."""

    def test_default_values(self):
        style = SubtitleStyle()
        assert style.font_name == "Arial"
        assert style.font_size == 21
        assert style.bold is True
        assert style.border_style == 3
        assert style.background_color == "&H80000000"

    def test_border_style_outline_only(self):
        style = SubtitleStyle(border_style=1)
        assert style.border_style == 1

    def test_custom_background_color(self):
        style = SubtitleStyle(background_color="&H40FF0000")
        assert style.background_color == "&H40FF0000"

    def test_all_fields_set(self):
        style = SubtitleStyle(
            font_name="Helvetica",
            font_size=28,
            bold=False,
            color="&H0000FFFF",
            outline_color="&H00FF0000",
            outline_width=3,
            position="top",
            border_style=1,
            background_color="&H00000000",
        )
        assert style.font_name == "Helvetica"
        assert style.border_style == 1
        assert style.background_color == "&H00000000"


# ======================================================================
# format_timestamp
# ======================================================================


class TestFormatTimestamp:
    """Tests for format_timestamp -- seconds to SRT format."""

    def test_zero_seconds(self):
        assert format_timestamp(0.0) == "00:00:00,000"

    def test_fractional_seconds(self):
        assert format_timestamp(1.5) == "00:00:01,500"

    def test_one_minute(self):
        assert format_timestamp(60.0) == "00:01:00,000"

    def test_one_hour(self):
        assert format_timestamp(3600.0) == "01:00:00,000"

    def test_complex_time(self):
        # 1h 23m 45.678s
        assert format_timestamp(5025.678) == "01:23:45,678"

    def test_small_fraction(self):
        assert format_timestamp(0.001) == "00:00:00,001"

    def test_large_time(self):
        # 24 hours
        assert format_timestamp(86400.0) == "24:00:00,000"

    def test_negative_clamped_to_zero(self):
        assert format_timestamp(-5.0) == "00:00:00,000"

    @pytest.mark.parametrize(
        "seconds,expected",
        [
            (0.999, "00:00:00,999"),
            (59.999, "00:00:59,999"),
            (5.200, "00:00:05,200"),
            (10.050, "00:00:10,050"),
        ],
    )
    def test_parametrized_values(self, seconds, expected):
        assert format_timestamp(seconds) == expected


# ======================================================================
# _parse_srt_timestamp
# ======================================================================


class TestParseSrtTimestamp:
    """Tests for internal SRT timestamp parser."""

    def test_parse_standard(self):
        assert _parse_srt_timestamp("01:23:45,678") == pytest.approx(5025.678, abs=0.001)

    def test_parse_zero(self):
        assert _parse_srt_timestamp("00:00:00,000") == 0.0

    def test_parse_with_period(self):
        """Some SRT files use period instead of comma."""
        assert _parse_srt_timestamp("00:00:05.200") == pytest.approx(5.2, abs=0.001)

    def test_parse_invalid_raises(self):
        with pytest.raises(ValueError, match="Invalid SRT timestamp"):
            _parse_srt_timestamp("bad")


# ======================================================================
# _parse_ass_timestamp / _seconds_to_ass_timestamp
# ======================================================================


class TestAssTimestamps:
    """Tests for ASS timestamp parsing and formatting."""

    def test_seconds_to_ass(self):
        assert _seconds_to_ass_timestamp(0.0) == "0:00:00.00"

    def test_seconds_to_ass_complex(self):
        # 1h 23m 45.67s
        assert _seconds_to_ass_timestamp(5025.67) == "1:23:45.67"

    def test_parse_ass_standard(self):
        assert _parse_ass_timestamp("1:23:45.67") == pytest.approx(5025.67, abs=0.01)

    def test_parse_ass_zero(self):
        assert _parse_ass_timestamp("0:00:00.00") == 0.0

    def test_parse_ass_invalid_raises(self):
        with pytest.raises(ValueError, match="Invalid ASS timestamp"):
            _parse_ass_timestamp("invalid")

    def test_roundtrip_ass(self):
        """Convert to ASS timestamp and back, verify consistency."""
        original = 3661.50  # 1h 1m 1.50s
        ass_ts = _seconds_to_ass_timestamp(original)
        parsed = _parse_ass_timestamp(ass_ts)
        assert parsed == pytest.approx(original, abs=0.01)


# ======================================================================
# parse_srt
# ======================================================================


class TestParseSrt:
    """Tests for parse_srt -- reading SRT files."""

    def test_parse_valid_srt(self, tmp_path):
        srt_file = tmp_path / "test.srt"
        srt_file.write_text(
            "1\n"
            "00:00:00,000 --> 00:00:05,200\n"
            "Hello world\n"
            "\n"
            "2\n"
            "00:00:05,200 --> 00:00:10,500\n"
            "This is a subtitle\n"
            "\n",
            encoding="utf-8",
        )

        entries = parse_srt(str(srt_file))
        assert len(entries) == 2
        assert entries[0].index == 1
        assert entries[0].start_seconds == pytest.approx(0.0)
        assert entries[0].end_seconds == pytest.approx(5.2, abs=0.001)
        assert entries[0].text == "Hello world"
        assert entries[1].index == 2
        assert entries[1].text == "This is a subtitle"

    def test_parse_empty_file(self, tmp_path):
        srt_file = tmp_path / "empty.srt"
        srt_file.write_text("", encoding="utf-8")

        entries = parse_srt(str(srt_file))
        assert entries == []

    def test_parse_malformed_entries(self, tmp_path):
        """Malformed entries should be skipped, valid ones kept."""
        srt_file = tmp_path / "malformed.srt"
        srt_file.write_text(
            "not_a_number\n"
            "bad timestamp\n"
            "text\n"
            "\n"
            "2\n"
            "00:00:05,200 --> 00:00:10,500\n"
            "Valid entry\n"
            "\n",
            encoding="utf-8",
        )

        entries = parse_srt(str(srt_file))
        assert len(entries) == 1
        assert entries[0].text == "Valid entry"

    def test_parse_multiline_text(self, tmp_path):
        srt_file = tmp_path / "multiline.srt"
        srt_file.write_text(
            "1\n"
            "00:00:00,000 --> 00:00:05,000\n"
            "Line one\n"
            "Line two\n"
            "\n",
            encoding="utf-8",
        )

        entries = parse_srt(str(srt_file))
        assert len(entries) == 1
        assert entries[0].text == "Line one\nLine two"

    def test_parse_file_not_found(self):
        with pytest.raises(FileNotFoundError):
            parse_srt("/nonexistent/file.srt")

    def test_parse_bom_file(self, tmp_path):
        """SRT files sometimes start with a UTF-8 BOM."""
        srt_file = tmp_path / "bom.srt"
        srt_file.write_bytes(
            b"\xef\xbb\xbf1\n"
            b"00:00:00,000 --> 00:00:05,000\n"
            b"BOM entry\n"
            b"\n"
        )

        entries = parse_srt(str(srt_file))
        assert len(entries) == 1
        assert entries[0].text == "BOM entry"


# ======================================================================
# write_srt
# ======================================================================


class TestWriteSrt:
    """Tests for write_srt -- writing SRT files."""

    def test_write_basic(self, tmp_path):
        entries = [
            SubtitleEntry(index=1, start_seconds=0.0, end_seconds=5.2, text="Hello"),
            SubtitleEntry(index=2, start_seconds=5.2, end_seconds=10.5, text="World"),
        ]
        output = str(tmp_path / "output.srt")
        write_srt(entries, output)

        assert os.path.exists(output)
        content = open(output, "r", encoding="utf-8").read()
        assert "00:00:00,000 --> 00:00:05,200" in content
        assert "Hello" in content
        assert "World" in content

    def test_roundtrip_parse_write_parse(self, tmp_path):
        """Parse -> write -> parse should produce identical entries."""
        original_srt = tmp_path / "original.srt"
        original_srt.write_text(
            "1\n"
            "00:00:00,000 --> 00:00:05,200\n"
            "First entry\n"
            "\n"
            "2\n"
            "00:00:05,200 --> 00:00:10,500\n"
            "Second entry\n"
            "\n",
            encoding="utf-8",
        )

        entries1 = parse_srt(str(original_srt))
        output_srt = str(tmp_path / "roundtrip.srt")
        write_srt(entries1, output_srt)
        entries2 = parse_srt(output_srt)

        assert len(entries1) == len(entries2)
        for e1, e2 in zip(entries1, entries2):
            assert e1.start_seconds == pytest.approx(e2.start_seconds, abs=0.001)
            assert e1.end_seconds == pytest.approx(e2.end_seconds, abs=0.001)
            assert e1.text == e2.text

    def test_write_creates_directories(self, tmp_path):
        output = str(tmp_path / "subdir" / "nested" / "output.srt")
        entries = [SubtitleEntry(index=1, start_seconds=0, end_seconds=1, text="Test")]
        write_srt(entries, output)
        assert os.path.exists(output)


# ======================================================================
# generate_ass
# ======================================================================


class TestGenerateAss:
    """Tests for generate_ass -- SRT to ASS conversion."""

    def _create_srt(self, tmp_path, name="test.srt"):
        srt_file = tmp_path / name
        srt_file.write_text(
            "1\n"
            "00:00:00,000 --> 00:00:05,200\n"
            "Hello world\n"
            "\n"
            "2\n"
            "00:00:05,200 --> 00:00:10,500\n"
            "Second line\n"
            "\n",
            encoding="utf-8",
        )
        return str(srt_file)

    def test_generate_ass_default_style(self, tmp_path):
        srt_path = self._create_srt(tmp_path)
        ass_path = generate_ass(srt_path)

        assert os.path.exists(ass_path)
        assert ass_path.endswith(".ass")

        content = open(ass_path, "r", encoding="utf-8").read()
        assert "[Script Info]" in content
        assert "[V4+ Styles]" in content
        assert "[Events]" in content
        assert "Dialogue:" in content
        # Default font
        assert "Arial" in content
        assert "21" in content

    def test_generate_ass_custom_style(self, tmp_path):
        srt_path = self._create_srt(tmp_path)
        custom_style = SubtitleStyle(
            font_name="Helvetica",
            font_size=28,
            bold=False,
            color="&H0000FFFF",
            outline_color="&H00FF0000",
            outline_width=3,
            position="top-center",
        )
        ass_path = generate_ass(srt_path, style=custom_style)

        content = open(ass_path, "r", encoding="utf-8").read()
        assert "Helvetica" in content
        assert "28" in content
        # Alignment 8 = top-center
        assert ",8," in content

    def test_generate_ass_contains_dialogue_events(self, tmp_path):
        srt_path = self._create_srt(tmp_path)
        ass_path = generate_ass(srt_path)

        content = open(ass_path, "r", encoding="utf-8").read()
        # Should have 2 dialogue lines
        dialogue_lines = [line for line in content.split("\n") if line.startswith("Dialogue:")]
        assert len(dialogue_lines) == 2
        assert "Hello world" in dialogue_lines[0]
        assert "Second line" in dialogue_lines[1]

    def test_generate_ass_timestamps_correct(self, tmp_path):
        srt_path = self._create_srt(tmp_path)
        ass_path = generate_ass(srt_path)

        content = open(ass_path, "r", encoding="utf-8").read()
        # First entry: 0:00:00.00 to 0:00:05.20
        assert "0:00:00.00,0:00:05.20" in content

    def test_generate_ass_default_border_style_3(self, tmp_path):
        """Default style uses BorderStyle=3 (opaque box) for background strip."""
        srt_path = self._create_srt(tmp_path)
        ass_path = generate_ass(srt_path)

        content = open(ass_path, "r", encoding="utf-8").read()
        # Style line should contain BorderStyle=3
        style_line = [line for line in content.split("\n") if line.startswith("Style:")][0]
        assert ",3," in style_line  # BorderStyle=3
        assert "&H80000000" in style_line  # Default BackColour

    def test_generate_ass_border_style_1_outline_only(self, tmp_path):
        """BorderStyle=1 when background disabled."""
        srt_path = self._create_srt(tmp_path)
        outline_style = SubtitleStyle(border_style=1, background_color="&H00000000")
        ass_path = generate_ass(srt_path, style=outline_style)

        content = open(ass_path, "r", encoding="utf-8").read()
        style_line = [line for line in content.split("\n") if line.startswith("Style:")][0]
        assert ",1," in style_line  # BorderStyle=1

    def test_generate_ass_custom_background_color(self, tmp_path):
        """Custom background color is written to ASS BackColour field."""
        srt_path = self._create_srt(tmp_path)
        custom_style = SubtitleStyle(
            border_style=3,
            background_color="&H40FF0000",  # Semi-transparent blue
        )
        ass_path = generate_ass(srt_path, style=custom_style)

        content = open(ass_path, "r", encoding="utf-8").read()
        style_line = [line for line in content.split("\n") if line.startswith("Style:")][0]
        assert "&H40FF0000" in style_line


# ======================================================================
# adjust_ass_times
# ======================================================================


class TestAdjustAssTimes:
    """Tests for adjust_ass_times -- timestamp offset adjustment."""

    def _create_ass(self, tmp_path):
        """Create a minimal ASS file for testing."""
        ass_file = tmp_path / "test.ass"
        ass_file.write_text(
            "[Script Info]\n"
            "Title: Test\n"
            "\n"
            "[Events]\n"
            "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
            "Dialogue: 0,0:00:10.00,0:00:15.00,Default,,0,0,0,,Hello\n"
            "Dialogue: 0,0:00:20.00,0:00:25.00,Default,,0,0,0,,World\n",
            encoding="utf-8",
        )
        return str(ass_file)

    def test_positive_offset(self, tmp_path):
        ass_path = self._create_ass(tmp_path)
        output_path = str(tmp_path / "adjusted.ass")
        adjust_ass_times(ass_path, 5.0, output_path)

        content = open(output_path, "r", encoding="utf-8").read()
        # 10s + 5s = 15s, 15s + 5s = 20s
        assert "0:00:15.00,0:00:20.00" in content
        # 20s + 5s = 25s, 25s + 5s = 30s
        assert "0:00:25.00,0:00:30.00" in content

    def test_negative_offset(self, tmp_path):
        ass_path = self._create_ass(tmp_path)
        output_path = str(tmp_path / "adjusted.ass")
        adjust_ass_times(ass_path, -5.0, output_path)

        content = open(output_path, "r", encoding="utf-8").read()
        # 10s - 5s = 5s, 15s - 5s = 10s
        assert "0:00:05.00,0:00:10.00" in content

    def test_negative_offset_clamped_to_zero(self, tmp_path):
        ass_path = self._create_ass(tmp_path)
        output_path = str(tmp_path / "adjusted.ass")
        # -15s offset: 10-15 = negative -> clamp to 0
        adjust_ass_times(ass_path, -15.0, output_path)

        content = open(output_path, "r", encoding="utf-8").read()
        # First dialogue: max(0, 10-15)=0, max(0, 15-15)=0
        assert "0:00:00.00,0:00:00.00" in content

    def test_overwrite_in_place(self, tmp_path):
        ass_path = self._create_ass(tmp_path)
        result = adjust_ass_times(ass_path, 5.0)

        assert result == ass_path
        content = open(ass_path, "r", encoding="utf-8").read()
        assert "0:00:15.00,0:00:20.00" in content

    def test_non_dialogue_lines_preserved(self, tmp_path):
        ass_path = self._create_ass(tmp_path)
        output_path = str(tmp_path / "adjusted.ass")
        adjust_ass_times(ass_path, 5.0, output_path)

        content = open(output_path, "r", encoding="utf-8").read()
        assert "[Script Info]" in content
        assert "Title: Test" in content
        assert "[Events]" in content
