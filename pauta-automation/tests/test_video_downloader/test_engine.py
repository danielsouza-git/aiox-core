"""Tests for VideoDownloaderEngine -- core download/clip/merge/repeat logic.

All external dependencies (yt-dlp, FFmpeg/ffprobe via subprocess) are mocked.
Tests validate the engine logic without requiring network or binary access.
"""

import os
from unittest.mock import MagicMock, patch

from src.processors.video_downloader.engine import (
    QUALITY_OPTIONS,
    VideoDownloaderEngine,
    VideoInfo,
)


# ======================================================================
# Platform detection
# ======================================================================


class TestDetectPlatform:
    """Tests for detect_platform static method."""

    def test_detect_platform_youtube_full(self):
        assert VideoDownloaderEngine.detect_platform("https://www.youtube.com/watch?v=abc123") == "YouTube"

    def test_detect_platform_youtube_short(self):
        assert VideoDownloaderEngine.detect_platform("https://youtu.be/abc123") == "YouTube"

    def test_detect_platform_twitter(self):
        assert VideoDownloaderEngine.detect_platform("https://twitter.com/user/status/123") == "X (Twitter)"

    def test_detect_platform_x(self):
        assert VideoDownloaderEngine.detect_platform("https://x.com/user/status/123") == "X (Twitter)"

    def test_detect_platform_instagram(self):
        assert VideoDownloaderEngine.detect_platform("https://www.instagram.com/p/abc123/") == "Instagram"

    def test_detect_platform_instagram_short(self):
        assert VideoDownloaderEngine.detect_platform("https://instagr.am/p/abc123/") == "Instagram"

    def test_detect_platform_other(self):
        assert VideoDownloaderEngine.detect_platform("https://vimeo.com/123456") == "Other"

    def test_detect_platform_case_insensitive(self):
        assert VideoDownloaderEngine.detect_platform("https://YOUTUBE.COM/watch?v=x") == "YouTube"


# ======================================================================
# Time parsing
# ======================================================================


class TestParseTime:
    """Tests for parse_time static method."""

    def test_parse_time_mmss_format(self):
        """MMSS: '0130' = 1 min 30 sec = 90 seconds."""
        assert VideoDownloaderEngine.parse_time("0130") == 90.0

    def test_parse_time_mmss_zero(self):
        assert VideoDownloaderEngine.parse_time("0000") == 0.0

    def test_parse_time_mmss_one_minute(self):
        assert VideoDownloaderEngine.parse_time("0100") == 60.0

    def test_parse_time_colon_mmss(self):
        assert VideoDownloaderEngine.parse_time("01:30") == 90.0

    def test_parse_time_colon_hhmmss(self):
        assert VideoDownloaderEngine.parse_time("01:00:00") == 3600.0

    def test_parse_time_hmmss_format(self):
        """HMMSS: '10000' = 1h 00m 00s = 3600 seconds."""
        assert VideoDownloaderEngine.parse_time("10000") == 3600.0

    def test_parse_time_empty_returns_none(self):
        assert VideoDownloaderEngine.parse_time("") is None

    def test_parse_time_none_returns_none(self):
        assert VideoDownloaderEngine.parse_time(None) is None

    def test_parse_time_whitespace_returns_none(self):
        assert VideoDownloaderEngine.parse_time("   ") is None

    def test_parse_time_invalid_seconds_returns_none(self):
        """Seconds >= 60 should return None."""
        assert VideoDownloaderEngine.parse_time("0170") is None

    def test_parse_time_invalid_colon_seconds(self):
        assert VideoDownloaderEngine.parse_time("01:70") is None

    def test_parse_time_short_format_padded(self):
        """Short formats get zero-padded to 4 digits: '30' -> '0030' = 30s."""
        assert VideoDownloaderEngine.parse_time("30") == 30.0


# ======================================================================
# Quality options
# ======================================================================


class TestQualityOptions:
    """Tests for QUALITY_OPTIONS preservation."""

    def test_quality_options_keys(self):
        expected_keys = {"Best", "1080p", "720p", "480p", "Audio Only"}
        assert set(QUALITY_OPTIONS.keys()) == expected_keys

    def test_quality_options_on_class(self):
        assert VideoDownloaderEngine.QUALITY_OPTIONS is QUALITY_OPTIONS

    def test_quality_best_contains_bestvideo(self):
        assert "bestvideo" in QUALITY_OPTIONS["Best"]

    def test_quality_audio_only(self):
        assert QUALITY_OPTIONS["Audio Only"] == "bestaudio/best"


# ======================================================================
# get_video_info (mocked yt-dlp)
# ======================================================================


class TestGetVideoInfo:
    """Tests for get_video_info with mocked yt-dlp."""

    @patch("src.processors.video_downloader.engine.yt_dlp.YoutubeDL")
    def test_get_video_info_success(self, mock_ydl_class):
        mock_ydl = MagicMock()
        mock_ydl_class.return_value.__enter__ = MagicMock(return_value=mock_ydl)
        mock_ydl_class.return_value.__exit__ = MagicMock(return_value=False)

        mock_ydl.extract_info.return_value = {
            "title": "Test Video",
            "duration": 120,
            "thumbnail": "https://example.com/thumb.jpg",
            "formats": [
                {"height": 1080, "ext": "mp4"},
                {"height": 720, "ext": "mp4"},
                {"height": 480, "ext": "mp4"},
            ],
        }

        result = VideoDownloaderEngine.get_video_info("https://youtube.com/watch?v=test")

        assert result is not None
        assert isinstance(result, VideoInfo)
        assert result.title == "Test Video"
        assert result.duration == 120
        assert result.platform == "YouTube"
        assert "1080p" in result.formats
        assert "720p" in result.formats

    @patch("src.processors.video_downloader.engine.yt_dlp.YoutubeDL")
    def test_get_video_info_failure_returns_none(self, mock_ydl_class):
        mock_ydl = MagicMock()
        mock_ydl_class.return_value.__enter__ = MagicMock(return_value=mock_ydl)
        mock_ydl_class.return_value.__exit__ = MagicMock(return_value=False)
        mock_ydl.extract_info.side_effect = Exception("Network error")

        result = VideoDownloaderEngine.get_video_info("https://bad-url.com/video")
        assert result is None


# ======================================================================
# download (mocked yt-dlp)
# ======================================================================


class TestDownload:
    """Tests for download with mocked yt-dlp."""

    @patch("src.processors.video_downloader.engine.yt_dlp.YoutubeDL")
    def test_download_success(self, mock_ydl_class):
        mock_ydl = MagicMock()
        mock_ydl_class.return_value.__enter__ = MagicMock(return_value=mock_ydl)
        mock_ydl_class.return_value.__exit__ = MagicMock(return_value=False)

        mock_ydl.extract_info.return_value = {"title": "My Video"}

        with patch("src.processors.video_downloader.engine.yt_dlp.utils") as mock_utils:
            mock_utils.sanitize_filename.return_value = "My_Video"

            success, message, path = VideoDownloaderEngine.download(
                url="https://youtube.com/watch?v=test",
                output_dir="/tmp/output",
                quality="Best",
            )

        assert success is True
        assert "My Video" in message
        assert path == os.path.join("/tmp/output", "My_Video.mp4")

    @patch("src.processors.video_downloader.engine.yt_dlp.YoutubeDL")
    def test_download_with_custom_filename(self, mock_ydl_class):
        mock_ydl = MagicMock()
        mock_ydl_class.return_value.__enter__ = MagicMock(return_value=mock_ydl)
        mock_ydl_class.return_value.__exit__ = MagicMock(return_value=False)

        mock_ydl.extract_info.return_value = {"title": "Original Title"}

        success, message, path = VideoDownloaderEngine.download(
            url="https://youtube.com/watch?v=test",
            output_dir="/tmp/output",
            quality="720p",
            filename="custom_name",
        )

        assert success is True
        assert path == os.path.join("/tmp/output", "custom_name.mp4")

    @patch("src.processors.video_downloader.engine.yt_dlp.YoutubeDL")
    def test_download_audio_only(self, mock_ydl_class):
        mock_ydl = MagicMock()
        mock_ydl_class.return_value.__enter__ = MagicMock(return_value=mock_ydl)
        mock_ydl_class.return_value.__exit__ = MagicMock(return_value=False)

        mock_ydl.extract_info.return_value = {"title": "Podcast"}

        with patch("src.processors.video_downloader.engine.yt_dlp.utils") as mock_utils:
            mock_utils.sanitize_filename.return_value = "Podcast"

            success, message, path = VideoDownloaderEngine.download(
                url="https://youtube.com/watch?v=test",
                output_dir="/tmp/output",
                quality="Audio Only",
            )

        assert success is True
        assert path == os.path.join("/tmp/output", "Podcast.mp3")

    @patch("src.processors.video_downloader.engine.yt_dlp.YoutubeDL")
    def test_download_failure(self, mock_ydl_class):
        mock_ydl = MagicMock()
        mock_ydl_class.return_value.__enter__ = MagicMock(return_value=mock_ydl)
        mock_ydl_class.return_value.__exit__ = MagicMock(return_value=False)

        import yt_dlp as real_yt_dlp
        mock_ydl.extract_info.side_effect = real_yt_dlp.utils.DownloadError("Not found")

        success, message, path = VideoDownloaderEngine.download(
            url="https://bad-url.com/video",
            output_dir="/tmp/output",
        )

        assert success is False
        assert "Download failed" in message
        assert path is None

    @patch("src.processors.video_downloader.engine.yt_dlp.YoutubeDL")
    def test_download_progress_callback(self, mock_ydl_class):
        """Verify that progress_callback is wired into ydl_opts."""
        captured_opts = {}

        def capture_init(opts):
            captured_opts.update(opts)
            mock_inst = MagicMock()
            mock_inst.extract_info.return_value = {"title": "Test"}
            return mock_inst

        mock_ydl_class.side_effect = None
        mock_ydl_instance = MagicMock()
        mock_ydl_instance.extract_info.return_value = {"title": "Test"}
        mock_ydl_class.return_value.__enter__ = MagicMock(return_value=mock_ydl_instance)
        mock_ydl_class.return_value.__exit__ = MagicMock(return_value=False)

        callback = MagicMock()

        with patch("src.processors.video_downloader.engine.yt_dlp.utils") as mock_utils:
            mock_utils.sanitize_filename.return_value = "Test"
            VideoDownloaderEngine.download(
                url="https://youtube.com/watch?v=test",
                output_dir="/tmp/output",
                progress_callback=callback,
            )

        # Verify that YoutubeDL was called with progress_hooks
        call_args = mock_ydl_class.call_args
        assert call_args is not None
        opts = call_args[0][0] if call_args[0] else call_args[1]
        # The progress_hooks should be a list with one function
        if isinstance(opts, dict):
            assert "progress_hooks" in opts
            assert len(opts["progress_hooks"]) == 1


# ======================================================================
# clip_video (mocked subprocess)
# ======================================================================


class TestClipVideo:
    """Tests for clip_video with mocked subprocess."""

    @patch("src.processors.video_downloader.engine.subprocess.run")
    @patch("src.processors.video_downloader.engine.os.path.getsize", return_value=50000)
    @patch("src.processors.video_downloader.engine.os.path.exists", return_value=True)
    @patch("src.processors.video_downloader.engine.os.remove")
    @patch("src.processors.video_downloader.engine.os.rename")
    def test_clip_video_success(self, mock_rename, mock_remove, mock_exists, mock_getsize, mock_run):
        mock_run.return_value = MagicMock(returncode=0, stderr="")

        # Mock _get_video_duration
        with patch.object(VideoDownloaderEngine, "_get_video_duration", return_value=300.0):
            success, result = VideoDownloaderEngine.clip_video(
                "/tmp/video.mp4", "0100", "0200"
            )

        assert success is True
        assert result == "/tmp/video.mp4"

        # Verify ffmpeg was called
        mock_run.assert_called_once()
        cmd_args = mock_run.call_args[0][0]
        assert "ffmpeg" in cmd_args
        assert "-ss" in cmd_args
        assert "-t" in cmd_args

    def test_clip_video_no_times(self):
        """When both start and end are empty, should return original path."""
        success, result = VideoDownloaderEngine.clip_video("/tmp/video.mp4", "", "")
        assert success is True
        assert result == "/tmp/video.mp4"

    @patch("src.processors.video_downloader.engine.subprocess.run")
    def test_clip_validates_end_before_start(self, mock_run):
        """End time before start time should fail."""
        with patch.object(VideoDownloaderEngine, "_get_video_duration", return_value=300.0):
            success, result = VideoDownloaderEngine.clip_video(
                "/tmp/video.mp4", "0200", "0100"
            )

        assert success is False
        assert "End time must be after start time" in result

    @patch("src.processors.video_downloader.engine.subprocess.run")
    def test_clip_start_beyond_duration(self, mock_run):
        """Start time beyond video duration should fail."""
        with patch.object(VideoDownloaderEngine, "_get_video_duration", return_value=60.0):
            success, result = VideoDownloaderEngine.clip_video(
                "/tmp/video.mp4", "0200", "0300"
            )

        assert success is False
        assert "beyond video duration" in result


# ======================================================================
# merge_clips (mocked subprocess)
# ======================================================================


class TestMergeClips:
    """Tests for merge_clips with mocked subprocess."""

    @patch("src.processors.video_downloader.engine.shutil.copy2")
    @patch("src.processors.video_downloader.engine.subprocess.run")
    @patch("src.processors.video_downloader.engine.os.path.exists", return_value=True)
    @patch("src.processors.video_downloader.engine.os.remove")
    def test_merge_clips_builds_filter(self, mock_remove, mock_exists, mock_run, mock_copy):
        """Verify merge uses xfade fadewhite filter for 2 clips."""
        mock_run.return_value = MagicMock(returncode=0, stderr="")

        with (
            patch.object(VideoDownloaderEngine, "_get_video_duration", return_value=30.0),
            patch.object(VideoDownloaderEngine, "_has_audio_stream", return_value=True),
            patch("src.processors.video_downloader.engine.tempfile.TemporaryDirectory") as mock_tmpdir,
        ):
            mock_tmpdir.return_value.__enter__ = MagicMock(return_value="/tmp/merge_dir")
            mock_tmpdir.return_value.__exit__ = MagicMock(return_value=False)

            success, result = VideoDownloaderEngine.merge_clips(
                ["/tmp/clip1.mp4", "/tmp/clip2.mp4"],
                "/tmp/merged.mp4",
            )

        # FFmpeg was called
        assert mock_run.called
        cmd = mock_run.call_args[0][0]
        filter_arg_idx = cmd.index("-filter_complex") + 1
        assert "xfade=transition=fadewhite" in cmd[filter_arg_idx]

    def test_merge_clips_too_few(self):
        """Need at least 2 clips."""
        success, result = VideoDownloaderEngine.merge_clips(
            ["/tmp/clip1.mp4"], "/tmp/merged.mp4"
        )
        assert success is False
        assert "at least 2 clips" in result


# ======================================================================
# repeat_clip (mocked subprocess)
# ======================================================================


class TestRepeatClip:
    """Tests for repeat_clip with mocked subprocess."""

    def test_repeat_clip_count_1_noop(self):
        """Repeat count 1 should be a no-op."""
        success, result = VideoDownloaderEngine.repeat_clip("/tmp/video.mp4", 1)
        assert success is True
        assert result == "/tmp/video.mp4"

    @patch("src.processors.video_downloader.engine.subprocess.run")
    def test_repeat_clip_success(self, mock_run, tmp_path):
        """Test repeat_clip with a real temp file and mocked subprocess."""
        # Create a real source file
        video_file = tmp_path / "video.mp4"
        video_file.write_bytes(b"\x00" * 1000)

        # Mock ffmpeg concat to succeed and create the output file
        def fake_run(cmd, **kwargs):
            cwd = kwargs.get("cwd", ".")
            output_file = os.path.join(cwd, "output.mp4")
            with open(output_file, "wb") as f:
                f.write(b"\x00" * 2000)
            return MagicMock(returncode=0, stderr="")

        mock_run.side_effect = fake_run

        success, result = VideoDownloaderEngine.repeat_clip(str(video_file), 3)

        assert success is True
        assert result == str(video_file)
        assert mock_run.called
        cmd = mock_run.call_args[0][0]
        assert "concat" in cmd


# ======================================================================
# adjust_aspect_ratio (mocked subprocess)
# ======================================================================


class TestAdjustAspectRatio:
    """Tests for adjust_aspect_ratio with mocked subprocess."""

    @patch("src.processors.video_downloader.engine.subprocess.run")
    def test_already_16_9(self, mock_run):
        """Already 16:9 video should be returned as-is."""
        mock_run.return_value = MagicMock(
            returncode=0, stdout="1920,1080\n", stderr=""
        )

        success, result = VideoDownloaderEngine.adjust_aspect_ratio(
            "/tmp/video.mp4", "16:9"
        )

        assert success is True
        assert result == "/tmp/video.mp4"
        # ffprobe was called but not ffmpeg (only 1 call)
        assert mock_run.call_count == 1

    @patch("src.processors.video_downloader.engine.os.remove")
    @patch("src.processors.video_downloader.engine.os.rename")
    @patch("src.processors.video_downloader.engine.subprocess.run")
    def test_needs_pillarbox(self, mock_run, mock_rename, mock_remove):
        """Vertical video needs pillarbox (left/right bars)."""
        # First call: ffprobe returns 1080x1920 (vertical)
        # Second call: ffmpeg converts
        mock_run.side_effect = [
            MagicMock(returncode=0, stdout="1080,1920\n", stderr=""),
            MagicMock(returncode=0, stderr=""),
        ]

        success, result = VideoDownloaderEngine.adjust_aspect_ratio(
            "/tmp/video.mp4", "16:9"
        )

        assert success is True
        # ffmpeg was called with pad filter
        ffmpeg_call = mock_run.call_args_list[1]
        cmd = ffmpeg_call[0][0]
        assert "-vf" in cmd
        vf_idx = cmd.index("-vf") + 1
        assert "pad=" in cmd[vf_idx]

    def test_invalid_target_ratio(self):
        success, result = VideoDownloaderEngine.adjust_aspect_ratio(
            "/tmp/video.mp4", "invalid"
        )
        assert success is False
        assert "Invalid target ratio" in result


# ======================================================================
# _build_merge_filter
# ======================================================================


class TestBuildMergeFilter:
    """Tests for _build_merge_filter internal method."""

    def test_2_clips_with_audio(self):
        fc, maps = VideoDownloaderEngine._build_merge_filter(
            num_clips=2,
            durations=[10.0, 10.0],
            all_have_audio=True,
        )
        assert "xfade=transition=fadewhite" in fc
        assert "acrossfade" in fc
        assert maps == ["-map", "[v]", "-map", "[a]"]

    def test_2_clips_no_audio(self):
        fc, maps = VideoDownloaderEngine._build_merge_filter(
            num_clips=2,
            durations=[10.0, 10.0],
            all_have_audio=False,
        )
        assert "xfade=transition=fadewhite" in fc
        assert "acrossfade" not in fc
        assert maps == ["-map", "[v]", "-an"]

    def test_3_clips_with_audio(self):
        fc, maps = VideoDownloaderEngine._build_merge_filter(
            num_clips=3,
            durations=[10.0, 10.0, 10.0],
            all_have_audio=True,
        )
        assert fc.count("xfade=transition=fadewhite") == 2
        assert fc.count("acrossfade") == 2

    def test_4_clips_fallback_concat(self):
        fc, maps = VideoDownloaderEngine._build_merge_filter(
            num_clips=4,
            durations=[10.0, 10.0, 10.0, 10.0],
            all_have_audio=True,
        )
        assert "concat=n=4" in fc


# ======================================================================
# VideoInfo dataclass
# ======================================================================


class TestVideoInfo:
    """Tests for the VideoInfo dataclass."""

    def test_videoinfo_creation(self):
        info = VideoInfo(
            title="Test",
            duration=120,
            thumbnail="https://example.com/thumb.jpg",
            platform="YouTube",
            formats=["1080p", "720p"],
        )
        assert info.title == "Test"
        assert info.duration == 120
        assert info.platform == "YouTube"
        assert len(info.formats) == 2

    def test_videoinfo_default_formats(self):
        info = VideoInfo(
            title="Test",
            duration=60,
            thumbnail="",
            platform="Other",
        )
        assert info.formats == []
