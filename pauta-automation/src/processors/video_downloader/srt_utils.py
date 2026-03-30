"""SRT/ASS subtitle parsing, generation, and formatting utilities.

Provides functions for working with SRT and ASS subtitle formats:
- Parse and write SRT files
- Convert SRT to ASS with custom styling
- Timestamp formatting and manipulation
- ASS time adjustment for clipped videos

Extracted and internalized from the external Video Downloader application.
"""

import os
import re
from dataclasses import dataclass


@dataclass
class SubtitleEntry:
    """A single subtitle entry with timing and text."""

    index: int
    start_seconds: float
    end_seconds: float
    text: str


@dataclass
class SubtitleStyle:
    """Styling configuration for ASS subtitle rendering."""

    font_name: str = "Arial"
    font_size: int = 80
    bold: bool = True
    color: str = "&H00FFFFFF"  # White (ASS BGR format)
    outline_color: str = "&H00000000"  # Black
    outline_width: int = 2
    position: str = "bottom"  # bottom = Alignment 2 (bottom-center)
    border_style: int = 3  # 1=outline only, 3=opaque box (background strip)
    background_color: str = "&H00000000"  # Fully opaque black (ASS AABBGGRR)


def format_timestamp(seconds: float) -> str:
    """Format seconds to SRT timestamp format HH:MM:SS,mmm.

    Args:
        seconds: Time in seconds (can be fractional).

    Returns:
        Formatted timestamp string like "01:23:45,678".
    """
    if seconds < 0:
        seconds = 0.0
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    # Clamp millis to 999 to avoid overflow from rounding
    if millis >= 1000:
        millis = 999
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def _parse_srt_timestamp(ts: str) -> float:
    """Parse an SRT timestamp string to seconds.

    Args:
        ts: Timestamp in format "HH:MM:SS,mmm".

    Returns:
        Time in seconds.

    Raises:
        ValueError: If timestamp format is invalid.
    """
    ts = ts.strip()
    match = re.match(r"(\d{2}):(\d{2}):(\d{2})[,.](\d{3})", ts)
    if not match:
        raise ValueError(f"Invalid SRT timestamp: {ts}")
    hours, minutes, secs, millis = match.groups()
    return int(hours) * 3600 + int(minutes) * 60 + int(secs) + int(millis) / 1000.0


def parse_srt(srt_path: str) -> list[SubtitleEntry]:
    """Parse an SRT file into a list of SubtitleEntry objects.

    Args:
        srt_path: Path to the SRT file.

    Returns:
        List of SubtitleEntry objects parsed from the file.
        Returns empty list for empty or malformed files.
    """
    if not os.path.exists(srt_path):
        raise FileNotFoundError(f"SRT file not found: {srt_path}")

    with open(srt_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove BOM if present
    content = content.lstrip("\ufeff")

    if not content.strip():
        return []

    entries: list[SubtitleEntry] = []
    # Split into blocks by blank lines
    blocks = re.split(r"\n\s*\n", content.strip())

    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 2:
            continue

        # First line should be index
        try:
            index = int(lines[0].strip())
        except ValueError:
            continue

        # Second line should be timestamp range
        ts_match = re.match(
            r"(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})",
            lines[1].strip(),
        )
        if not ts_match:
            continue

        try:
            start = _parse_srt_timestamp(ts_match.group(1))
            end = _parse_srt_timestamp(ts_match.group(2))
        except ValueError:
            continue

        # Remaining lines are subtitle text
        text = "\n".join(lines[2:]).strip()
        if not text:
            continue

        entries.append(
            SubtitleEntry(
                index=index,
                start_seconds=start,
                end_seconds=end,
                text=text,
            )
        )

    return entries


def write_srt(entries: list[SubtitleEntry], output_path: str) -> None:
    """Write SubtitleEntry objects to an SRT file.

    Args:
        entries: List of SubtitleEntry objects to write.
        output_path: Path for the output SRT file.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        for i, entry in enumerate(entries, start=1):
            f.write(f"{i}\n")
            f.write(
                f"{format_timestamp(entry.start_seconds)} --> "
                f"{format_timestamp(entry.end_seconds)}\n"
            )
            f.write(f"{entry.text}\n\n")


def _seconds_to_ass_timestamp(seconds: float) -> str:
    """Convert seconds to ASS timestamp format H:MM:SS.cc.

    Args:
        seconds: Time in seconds.

    Returns:
        ASS timestamp string like "0:01:23.45".
    """
    if seconds < 0:
        seconds = 0.0
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centiseconds = int(round((seconds - int(seconds)) * 100))
    if centiseconds >= 100:
        centiseconds = 99
    return f"{hours}:{minutes:02d}:{secs:02d}.{centiseconds:02d}"


def _parse_ass_timestamp(ass_time: str) -> float:
    """Parse an ASS timestamp to seconds.

    Args:
        ass_time: Timestamp in format "H:MM:SS.cc" or "HH:MM:SS.cc".

    Returns:
        Time in seconds.

    Raises:
        ValueError: If timestamp format is invalid.
    """
    ass_time = ass_time.strip()
    match = re.match(r"(\d+):(\d{2}):(\d{2})\.(\d{2})", ass_time)
    if not match:
        raise ValueError(f"Invalid ASS timestamp: {ass_time}")
    hours, minutes, secs, centiseconds = match.groups()
    return (
        int(hours) * 3600
        + int(minutes) * 60
        + int(secs)
        + int(centiseconds) / 100.0
    )


def generate_ass(srt_path: str, style: SubtitleStyle | None = None) -> str:
    """Convert an SRT file to ASS format with styling.

    Args:
        srt_path: Path to the source SRT file.
        style: Optional SubtitleStyle configuration. Uses defaults if None.

    Returns:
        Path to the generated ASS file (same directory, .ass extension).
    """
    if style is None:
        style = SubtitleStyle()

    entries = parse_srt(srt_path)
    ass_path = os.path.splitext(srt_path)[0] + ".ass"

    # Map position to ASS Alignment value
    alignment_map = {
        "bottom": 2,       # bottom-center
        "bottom-left": 1,
        "bottom-center": 2,
        "bottom-right": 3,
        "top": 8,          # top-center
        "top-left": 7,
        "top-center": 8,
        "top-right": 9,
        "center": 5,       # middle-center
    }
    alignment = alignment_map.get(style.position, 2)

    bold_flag = -1 if style.bold else 0

    with open(ass_path, "w", encoding="utf-8") as f:
        # Script Info section
        f.write("[Script Info]\n")
        f.write("Title: Subtitles\n")
        f.write("ScriptType: v4.00+\n")
        f.write("PlayResX: 1920\n")
        f.write("PlayResY: 1080\n")
        f.write("\n")

        # V4+ Styles section
        f.write("[V4+ Styles]\n")
        f.write(
            "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, "
            "OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, "
            "ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
            "Alignment, MarginL, MarginR, MarginV, Encoding\n"
        )
        f.write(
            f"Style: Default,{style.font_name},{style.font_size},"
            f"{style.color},&H000000FF,"
            f"{style.outline_color},{style.background_color},"
            f"{bold_flag},0,0,0,"
            f"100,100,0,0,{style.border_style},{style.outline_width},0,"
            f"{alignment},10,10,20,1\n"
        )
        f.write("\n")

        # Events section
        f.write("[Events]\n")
        f.write("Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")

        for entry in entries:
            start_ts = _seconds_to_ass_timestamp(entry.start_seconds)
            end_ts = _seconds_to_ass_timestamp(entry.end_seconds)
            # Replace newlines with ASS line break
            text = entry.text.replace("\n", "\\N")
            f.write(
                f"Dialogue: 0,{start_ts},{end_ts},Default,,0,0,0,,{text}\n"
            )

    return ass_path


def adjust_ass_times(ass_path: str, offset: float, output_path: str | None = None) -> str:
    """Adjust all timestamps in an ASS file by a given offset.

    Args:
        ass_path: Path to the ASS file to adjust.
        offset: Seconds to add (positive) or subtract (negative) from all timestamps.
        output_path: Optional output path. If None, overwrites the input file.

    Returns:
        Path to the adjusted ASS file.
    """
    if output_path is None:
        output_path = ass_path

    with open(ass_path, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.split("\n")
    adjusted_lines: list[str] = []

    for line in lines:
        if line.startswith("Dialogue:"):
            # Parse dialogue line: Dialogue: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
            match = re.match(
                r"(Dialogue:\s*\d+,)"
                r"(\d+:\d{2}:\d{2}\.\d{2}),"
                r"(\d+:\d{2}:\d{2}\.\d{2})(,.*)",
                line,
            )
            if match:
                prefix = match.group(1)
                start_time = _parse_ass_timestamp(match.group(2))
                end_time = _parse_ass_timestamp(match.group(3))
                suffix = match.group(4)

                new_start = max(0.0, start_time + offset)
                new_end = max(0.0, end_time + offset)

                adjusted_lines.append(
                    f"{prefix}{_seconds_to_ass_timestamp(new_start)},"
                    f"{_seconds_to_ass_timestamp(new_end)}{suffix}"
                )
            else:
                adjusted_lines.append(line)
        else:
            adjusted_lines.append(line)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(adjusted_lines))

    return output_path
