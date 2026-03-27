"""Video Downloader Engine -- internalized from external Video Downloader app.

Provides VideoDownloaderEngine for downloading, clipping, merging, and
repeating videos using yt-dlp and FFmpeg.

Also provides SubtitleProcessor for transcription, translation, and subtitle
embedding, along with SRT/ASS utility types SubtitleEntry and SubtitleStyle.
"""

from src.processors.video_downloader.engine import VideoDownloaderEngine, VideoInfo
from src.processors.video_downloader.srt_utils import SubtitleEntry, SubtitleStyle
from src.processors.video_downloader.subtitle_processor import SubtitleProcessor

__all__ = [
    "VideoDownloaderEngine",
    "VideoInfo",
    "SubtitleProcessor",
    "SubtitleEntry",
    "SubtitleStyle",
]
