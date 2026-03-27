"""Video Downloader Engine -- core downloading functionality using yt-dlp.

Supports YouTube, X (Twitter), Instagram, and 1000+ other sites via yt-dlp.
FFmpeg operations for clip, merge, repeat, and aspect ratio adjustment.

Extracted and internalized from the external Video Downloader application at:
D:/EPOCH/ET_IA_e_Automacoes/epochnews_apps/videos/video_downloader/downloader.py

All logic preserved exactly from the original with the following improvements:
- No hardcoded paths
- Type hints throughout
- Configurable progress_callback interface
- Dataclass for VideoInfo
"""

import logging
import os
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass, field
from typing import Callable, Optional

import yt_dlp

logger = logging.getLogger(__name__)


@dataclass
class VideoInfo:
    """Information about a video retrieved from yt-dlp metadata."""

    title: str
    duration: int  # in seconds
    thumbnail: str
    platform: str
    formats: list[str] = field(default_factory=list)


# yt-dlp format selectors -- preserved exactly from original
QUALITY_OPTIONS: dict[str, str] = {
    "Best": (
        "bestvideo[ext=mp4]+bestaudio[ext=m4a]/"
        "bestvideo+bestaudio/best[ext=mp4]/best"
    ),
    "1080p": (
        "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/"
        "bestvideo[height<=1080]+bestaudio/"
        "best[height<=1080][ext=mp4]/best[height<=1080]/best"
    ),
    "720p": (
        "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/"
        "bestvideo[height<=720]+bestaudio/"
        "best[height<=720][ext=mp4]/best[height<=720]/best"
    ),
    "480p": (
        "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/"
        "bestvideo[height<=480]+bestaudio/"
        "best[height<=480][ext=mp4]/best[height<=480]/best"
    ),
    "Audio Only": "bestaudio/best",
}


class VideoDownloaderEngine:
    """Engine for downloading and processing videos.

    Wraps yt-dlp for downloads and FFmpeg/ffprobe for video manipulation.
    All methods are static or class-level -- no instance state required.
    """

    QUALITY_OPTIONS = QUALITY_OPTIONS

    # ------------------------------------------------------------------
    # Platform detection
    # ------------------------------------------------------------------

    @staticmethod
    def detect_platform(url: str) -> str:
        """Detect which platform the URL is from.

        Args:
            url: Video URL to check.

        Returns:
            Platform name: "YouTube", "X (Twitter)", "Instagram", or "Other".
        """
        if re.search(r"(youtube\.com|youtu\.be)", url, re.IGNORECASE):
            return "YouTube"
        elif re.search(r"(twitter\.com|x\.com)", url, re.IGNORECASE):
            return "X (Twitter)"
        elif re.search(r"(instagram\.com|instagr\.am)", url, re.IGNORECASE):
            return "Instagram"
        else:
            return "Other"

    # ------------------------------------------------------------------
    # Video info retrieval
    # ------------------------------------------------------------------

    @staticmethod
    def get_video_info(url: str) -> Optional[VideoInfo]:
        """Fetch video metadata without downloading.

        Args:
            url: Video URL to query.

        Returns:
            VideoInfo dataclass with metadata, or None on failure.
        """
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": False,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)

                # Get available format heights
                formats: list[str] = []
                if info.get("formats"):
                    heights: set[int] = set()
                    for f in info["formats"]:
                        if f.get("height"):
                            heights.add(f["height"])
                    formats = [str(h) + "p" for h in sorted(heights, reverse=True)[:5]]

                return VideoInfo(
                    title=info.get("title", "Unknown"),
                    duration=info.get("duration", 0) or 0,
                    thumbnail=info.get("thumbnail", ""),
                    platform=VideoDownloaderEngine.detect_platform(url),
                    formats=formats,
                )
        except Exception as e:
            logger.error("Error getting video info: %s", e)
            return None

    # ------------------------------------------------------------------
    # Time parsing
    # ------------------------------------------------------------------

    @staticmethod
    def parse_time(time_str: str) -> Optional[float]:
        """Parse time string to seconds.

        Accepts formats:
        - MMSS (e.g., "0100" = 60s, "0230" = 150s)
        - HMMSS (e.g., "10000" = 3600s)
        - MM:SS or HH:MM:SS (traditional format)

        Args:
            time_str: Time string to parse.

        Returns:
            Seconds as float, or None if invalid/empty.
        """
        if not time_str or not time_str.strip():
            return None

        time_str = time_str.strip()

        try:
            # Format with colons (traditional)
            if ":" in time_str:
                parts = time_str.split(":")
                if len(parts) == 2:  # MM:SS
                    minutes = int(parts[0])
                    seconds = float(parts[1])
                    if minutes < 0 or seconds < 0 or seconds >= 60:
                        return None
                    return minutes * 60 + seconds
                elif len(parts) == 3:  # HH:MM:SS
                    hours = int(parts[0])
                    minutes = int(parts[1])
                    seconds = float(parts[2])
                    if (
                        hours < 0
                        or minutes < 0
                        or minutes >= 60
                        or seconds < 0
                        or seconds >= 60
                    ):
                        return None
                    return hours * 3600 + minutes * 60 + seconds
                return None

            # Format without colons (e.g., 0100, 0230, 10000)
            if time_str.isdigit():
                time_str = time_str.zfill(4)  # Pad to at least 4 digits
                if len(time_str) == 4:  # MMSS
                    minutes = int(time_str[:2])
                    seconds = int(time_str[2:])
                    if seconds >= 60:
                        return None
                    return float(minutes * 60 + seconds)
                elif len(time_str) >= 5:  # HMMSS or HHMMSS
                    secs = int(time_str[-2:])
                    mins = int(time_str[-4:-2])
                    hrs = int(time_str[:-4]) if len(time_str) > 4 else 0
                    if secs >= 60 or mins >= 60:
                        return None
                    return float(hrs * 3600 + mins * 60 + secs)

            return None
        except ValueError:
            return None

    # ------------------------------------------------------------------
    # Download
    # ------------------------------------------------------------------

    @staticmethod
    def download(
        url: str,
        output_dir: str,
        quality: str = "Best",
        filename: Optional[str] = None,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> tuple[bool, str, Optional[str]]:
        """Download a video from the given URL.

        Args:
            url: Video URL to download.
            output_dir: Directory to save the downloaded file.
            quality: Quality option key from QUALITY_OPTIONS.
            filename: Optional custom filename (without extension).
            progress_callback: Called with (percentage, status_text).

        Returns:
            Tuple of (success, message, video_path or None).
        """

        def progress_hook(d: dict) -> None:
            if progress_callback is None:
                return

            if d["status"] == "downloading":
                total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
                downloaded = d.get("downloaded_bytes", 0)

                if total > 0:
                    percentage = (downloaded / total) * 100
                    speed = d.get("speed", 0)
                    if speed:
                        speed_str = f"{speed / 1024 / 1024:.1f} MB/s"
                    else:
                        speed_str = "calculating..."
                    progress_callback(percentage, f"Downloading: {speed_str}")
                else:
                    progress_callback(0, "Downloading...")

            elif d["status"] == "finished":
                progress_callback(100, "Processing...")

        format_string = QUALITY_OPTIONS.get(quality, QUALITY_OPTIONS["Best"])

        # Build output template
        if filename:
            outtmpl = os.path.join(output_dir, f"{filename}.%(ext)s")
        else:
            outtmpl = os.path.join(output_dir, "%(title).80s.%(ext)s")

        ydl_opts: dict = {
            "format": format_string,
            "outtmpl": outtmpl,
            "progress_hooks": [progress_hook],
            "quiet": True,
            "no_warnings": True,
            "overwrites": True,
        }

        # For video downloads, merge into mp4
        if quality != "Audio Only":
            ydl_opts["merge_output_format"] = "mp4"
        else:
            ydl_opts["postprocessors"] = [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }
            ]

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                title = info.get("title", "video")

                if quality == "Audio Only":
                    ext = "mp3"
                else:
                    ext = "mp4"

                if filename:
                    downloaded_file = os.path.join(output_dir, f"{filename}.{ext}")
                else:
                    sanitized_title = yt_dlp.utils.sanitize_filename(title)[:80]
                    downloaded_file = os.path.join(
                        output_dir, f"{sanitized_title}.{ext}"
                    )

                return True, f"Downloaded: {title}", downloaded_file

        except yt_dlp.utils.DownloadError as e:
            return False, f"Download failed: {e!s}", None
        except Exception as e:
            return False, f"Error: {e!s}", None

    # ------------------------------------------------------------------
    # Clip video
    # ------------------------------------------------------------------

    @staticmethod
    def clip_video(
        video_path: str,
        start_time: str,
        end_time: str,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> tuple[bool, str]:
        """Clip video to specified time range using FFmpeg.

        Uses re-encoding (-c:v libx264 -c:a aac) for frame-accurate cuts.
        The clipped video replaces the original file.

        Args:
            video_path: Path to the video file.
            start_time: Start time (MMSS, MM:SS, or HH:MM:SS).
            end_time: End time (MMSS, MM:SS, or HH:MM:SS).
            progress_callback: Called with (percentage, status_text).

        Returns:
            Tuple of (success, result_path_or_error_message).
        """
        start_sec = VideoDownloaderEngine.parse_time(start_time)
        end_sec = VideoDownloaderEngine.parse_time(end_time)

        if start_sec is None and end_sec is None:
            return True, video_path  # No clipping needed

        # Validate against video duration
        video_duration = VideoDownloaderEngine._get_video_duration(video_path)
        if video_duration and video_duration > 0:
            if start_sec is not None and start_sec >= video_duration:
                return (
                    False,
                    f"Start time ({start_time}) is beyond video duration "
                    f"({int(video_duration)}s)",
                )
            if end_sec is not None and end_sec > video_duration:
                end_sec = video_duration  # Auto-adjust

        if progress_callback:
            progress_callback(90, "Clipping video...")

        output_path = os.path.splitext(video_path)[0] + "_clipped.mp4"

        try:
            # Build FFmpeg command -- re-encode for accurate cuts
            cmd: list[str] = ["ffmpeg"]

            if start_sec is not None:
                cmd.extend(["-ss", str(start_sec)])

            cmd.extend(["-i", video_path])

            if end_sec is not None:
                if start_sec is not None:
                    duration = end_sec - start_sec
                    if duration <= 0:
                        return False, "End time must be after start time"
                    cmd.extend(["-t", str(duration)])
                else:
                    cmd.extend(["-to", str(end_sec)])

            cmd.extend(["-c:v", "libx264", "-c:a", "aac", "-y", output_path])

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode != 0:
                error_msg = (
                    result.stderr[:200] if result.stderr else "Unknown error"
                )
                return False, f"FFmpeg clip error: {error_msg}"

            # Validate output
            output_size = (
                os.path.getsize(output_path)
                if os.path.exists(output_path)
                else 0
            )
            if output_size < 1000:
                if os.path.exists(output_path):
                    os.remove(output_path)
                dur_msg = (
                    f" (video duration: {int(video_duration)}s)"
                    if video_duration
                    else ""
                )
                return (
                    False,
                    f"Clip produced empty output - times ({start_time}-"
                    f"{end_time}) may be beyond video duration{dur_msg}",
                )

            # Replace original with clipped version
            os.remove(video_path)
            os.rename(output_path, video_path)

            if progress_callback:
                progress_callback(95, "Video clipped successfully!")

            return True, video_path

        except Exception as e:
            return False, f"Error clipping video: {e!s}"

    # ------------------------------------------------------------------
    # Merge clips with fadewhite transition
    # ------------------------------------------------------------------

    @staticmethod
    def merge_clips(
        clip_paths: list[str],
        output_path: str,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> tuple[bool, str]:
        """Merge video clips with fadewhite transition (1 second).

        Supports 2-3 clips with xfade fadewhite transitions.
        For >3 clips, falls back to simple concat.

        Args:
            clip_paths: List of paths to video clips to merge.
            output_path: Path for the merged output file.
            progress_callback: Called with (percentage, status_text).

        Returns:
            Tuple of (success, output_path_or_error_message).
        """
        if len(clip_paths) < 2:
            return False, "Need at least 2 clips to merge"

        if progress_callback:
            progress_callback(80, "Merging clips with fadewhite...")

        num_clips = len(clip_paths)
        transition_duration = 1.0  # seconds

        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                # Copy clips to temp
                temp_clips: list[str] = []
                for i, path in enumerate(clip_paths):
                    temp_name = f"clip{i + 1}.mp4"
                    temp_path = os.path.join(temp_dir, temp_name)
                    shutil.copy2(path, temp_path)
                    temp_clips.append(temp_name)

                # Get durations
                durations: list[float] = []
                for clip_name in temp_clips:
                    dur = VideoDownloaderEngine._get_video_duration(
                        os.path.join(temp_dir, clip_name)
                    )
                    durations.append(dur if dur else 10.0)

                # Check if all have audio
                all_have_audio = all(
                    VideoDownloaderEngine._has_audio_stream(
                        os.path.join(temp_dir, c)
                    )
                    for c in temp_clips
                )

                # Build filter_complex
                filter_complex, map_args = (
                    VideoDownloaderEngine._build_merge_filter(
                        num_clips, durations, all_have_audio, transition_duration
                    )
                )

                # Run FFmpeg
                cmd: list[str] = ["ffmpeg"]
                for clip_name in temp_clips:
                    cmd.extend(["-i", clip_name])
                cmd.extend(["-filter_complex", filter_complex])
                cmd.extend(map_args)
                cmd.extend(["-c:v", "libx264", "-c:a", "aac", "-y", "merged.mp4"])

                result = subprocess.run(
                    cmd, cwd=temp_dir, capture_output=True, text=True
                )
                temp_output = os.path.join(temp_dir, "merged.mp4")

                if result.returncode != 0 or not os.path.exists(temp_output):
                    error = result.stderr[-300:] if result.stderr else "Unknown error"
                    return False, f"Merge failed: {error}"

                # Copy result to output
                if os.path.exists(output_path):
                    os.remove(output_path)
                shutil.copy2(temp_output, output_path)

            if progress_callback:
                progress_callback(95, "Clips merged successfully!")

            return True, output_path

        except Exception as e:
            return False, f"Error merging clips: {e!s}"

    @staticmethod
    def _build_merge_filter(
        num_clips: int,
        durations: list[float],
        all_have_audio: bool,
        transition_duration: float = 1.0,
    ) -> tuple[str, list[str]]:
        """Build FFmpeg filter_complex for merge with fadewhite.

        Supports 2 or 3 clips with xfade transitions.
        Falls back to concat for >3 clips.

        Args:
            num_clips: Number of clips.
            durations: Duration of each clip in seconds.
            all_have_audio: Whether all clips have audio streams.
            transition_duration: Duration of fadewhite transition.

        Returns:
            Tuple of (filter_complex_string, map_arguments).
        """
        td = transition_duration

        if num_clips == 2:
            offset1 = max(0, durations[0] - td)
            if all_have_audio:
                fc = (
                    f"[0:v][1:v]xfade=transition=fadewhite:duration={td}"
                    f":offset={offset1}[v];"
                    f"[0:a][1:a]acrossfade=d={td}[a]"
                )
                maps = ["-map", "[v]", "-map", "[a]"]
            else:
                fc = (
                    f"[0:v][1:v]xfade=transition=fadewhite:duration={td}"
                    f":offset={offset1}[v]"
                )
                maps = ["-map", "[v]", "-an"]

        elif num_clips == 3:
            offset1 = max(0, durations[0] - td)
            merged_12_duration = durations[0] + durations[1] - td
            offset2 = max(0, merged_12_duration - td)

            if all_have_audio:
                fc = (
                    f"[0:v][1:v]xfade=transition=fadewhite:duration={td}"
                    f":offset={offset1}[vt1];"
                    f"[vt1][2:v]xfade=transition=fadewhite:duration={td}"
                    f":offset={offset2}[v];"
                    f"[0:a][1:a]acrossfade=d={td}[at1];"
                    f"[at1][2:a]acrossfade=d={td}[a]"
                )
                maps = ["-map", "[v]", "-map", "[a]"]
            else:
                fc = (
                    f"[0:v][1:v]xfade=transition=fadewhite:duration={td}"
                    f":offset={offset1}[vt1];"
                    f"[vt1][2:v]xfade=transition=fadewhite:duration={td}"
                    f":offset={offset2}[v]"
                )
                maps = ["-map", "[v]", "-an"]

        else:
            # Fallback for >3 clips: simple concat
            fc = "".join(f"[{i}:v][{i}:a]" for i in range(num_clips))
            fc += f"concat=n={num_clips}:v=1:a=1[v][a]"
            maps = ["-map", "[v]", "-map", "[a]"]

        return fc, maps

    # ------------------------------------------------------------------
    # Repeat clip
    # ------------------------------------------------------------------

    @staticmethod
    def repeat_clip(
        video_path: str,
        count: int,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> tuple[bool, str]:
        """Repeat/loop a video N times by concatenating it with itself.

        Uses FFmpeg concat demuxer with stream copy (no re-encode).
        The repeated video replaces the original file.

        Args:
            video_path: Path to the video file.
            count: Total number of repetitions (2 = plays twice).
            progress_callback: Called with (percentage, status_text).

        Returns:
            Tuple of (success, result_path_or_error_message).
        """
        if count <= 1:
            return True, video_path

        if progress_callback:
            progress_callback(92, f"Repeating clip {count}x...")

        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                # Copy source to temp
                temp_src = os.path.join(temp_dir, "source.mp4")
                shutil.copy2(video_path, temp_src)

                # Create concat list file
                list_path = os.path.join(temp_dir, "list.txt")
                with open(list_path, "w") as f:
                    for _ in range(count):
                        f.write("file 'source.mp4'\n")

                # Run FFmpeg concat
                cmd = [
                    "ffmpeg",
                    "-f",
                    "concat",
                    "-safe",
                    "0",
                    "-i",
                    "list.txt",
                    "-c",
                    "copy",
                    "-y",
                    "output.mp4",
                ]
                result = subprocess.run(
                    cmd, cwd=temp_dir, capture_output=True, text=True
                )

                if result.returncode != 0:
                    return False, f"FFmpeg repeat error: {result.stderr[:200]}"

                temp_output = os.path.join(temp_dir, "output.mp4")
                if not os.path.exists(temp_output):
                    return False, "Repeat output not created"

                # Replace original with repeated version
                os.remove(video_path)
                shutil.copy2(temp_output, video_path)

            if progress_callback:
                progress_callback(95, f"Clip repeated {count}x!")

            return True, video_path

        except Exception as e:
            return False, f"Error repeating video: {e!s}"

    # ------------------------------------------------------------------
    # Aspect ratio adjustment
    # ------------------------------------------------------------------

    @staticmethod
    def adjust_aspect_ratio(
        video_path: str,
        target_ratio: str = "16:9",
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> tuple[bool, str]:
        """Check if video matches target aspect ratio and adjust if not.

        Adds black bars (letterbox or pillarbox) to fit the target ratio.
        The adjusted video replaces the original file.

        Args:
            video_path: Path to the video file.
            target_ratio: Target aspect ratio string (e.g., "16:9").
            progress_callback: Called with (percentage, status_text).

        Returns:
            Tuple of (success, result_path_or_error_message).
        """
        if progress_callback:
            progress_callback(92, "Checking aspect ratio...")

        # Parse target ratio
        try:
            ratio_parts = target_ratio.split(":")
            target_ratio_float = float(ratio_parts[0]) / float(ratio_parts[1])
        except (ValueError, IndexError, ZeroDivisionError):
            return False, f"Invalid target ratio: {target_ratio}"

        try:
            # Get video dimensions using ffprobe
            cmd = [
                "ffprobe",
                "-v",
                "quiet",
                "-select_streams",
                "v:0",
                "-show_entries",
                "stream=width,height",
                "-of",
                "csv=p=0",
                video_path,
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode != 0:
                return True, video_path  # Can't check, return as is

            dimensions = result.stdout.strip().split(",")
            if len(dimensions) != 2:
                return True, video_path

            width = int(dimensions[0])
            height = int(dimensions[1])

            # Check if already matches target ratio (tolerance of 0.01)
            current_ratio = width / height
            if abs(current_ratio - target_ratio_float) < 0.01:
                return True, video_path

            if progress_callback:
                progress_callback(93, f"Adjusting to {target_ratio}...")

            output_path = os.path.splitext(video_path)[0] + "_ratio_adj.mp4"

            if current_ratio > target_ratio_float:
                # Video is wider -- add top/bottom bars (letterbox)
                new_height = int(width / target_ratio_float)
                new_height = new_height + (new_height % 2)  # Make even
                pad_filter = (
                    f"pad={width}:{new_height}:(ow-iw)/2:(oh-ih)/2:black"
                )
            else:
                # Video is taller -- add left/right bars (pillarbox)
                new_width = int(height * target_ratio_float)
                new_width = new_width + (new_width % 2)  # Make even
                pad_filter = (
                    f"pad={new_width}:{height}:(ow-iw)/2:(oh-ih)/2:black"
                )

            cmd = [
                "ffmpeg",
                "-i",
                video_path,
                "-vf",
                pad_filter,
                "-c:v",
                "libx264",
                "-c:a",
                "copy",
                "-y",
                output_path,
            ]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode != 0:
                error_msg = (
                    result.stderr[:200] if result.stderr else "Unknown error"
                )
                return False, f"FFmpeg aspect ratio error: {error_msg}"

            # Replace original with adjusted version
            os.remove(video_path)
            os.rename(output_path, video_path)

            if progress_callback:
                progress_callback(95, f"Aspect ratio adjusted to {target_ratio}!")

            return True, video_path

        except Exception as e:
            return False, f"Error adjusting aspect ratio: {e!s}"

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _get_video_duration(video_path: str) -> Optional[float]:
        """Get video duration in seconds using ffprobe.

        Args:
            video_path: Path to the video file.

        Returns:
            Duration in seconds, or None on failure.
        """
        try:
            cmd = [
                "ffprobe",
                "-v",
                "quiet",
                "-show_entries",
                "format=duration",
                "-of",
                "csv=p=0",
                video_path,
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0 and result.stdout.strip():
                return float(result.stdout.strip())
        except (ValueError, Exception):
            pass
        return None

    @staticmethod
    def _has_audio_stream(video_path: str) -> bool:
        """Check if video file has an audio stream.

        Args:
            video_path: Path to the video file.

        Returns:
            True if audio stream found, False otherwise.
        """
        try:
            cmd = [
                "ffprobe",
                "-v",
                "quiet",
                "-select_streams",
                "a",
                "-show_entries",
                "stream=index",
                "-of",
                "csv=p=0",
                video_path,
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            return bool(result.stdout.strip())
        except Exception:
            return False
