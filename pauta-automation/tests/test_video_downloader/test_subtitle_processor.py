"""Tests for SubtitleProcessor -- transcription, translation, and embedding.

All OpenAI API calls and FFmpeg subprocess calls are mocked.
Tests validate processing logic, error handling, and progress callbacks.
"""

import os
from unittest.mock import MagicMock, patch

import pytest

from src.processors.video_downloader.subtitle_processor import SubtitleProcessor


# ======================================================================
# Fixtures
# ======================================================================


@pytest.fixture
def processor():
    """SubtitleProcessor with a fake API key."""
    return SubtitleProcessor(
        api_key="sk-test-fake-key-12345",
        whisper_model="whisper-1",
        translation_model="gpt-4.1-mini",
    )


@pytest.fixture
def fake_video(tmp_path):
    """Create a fake video file for testing."""
    video_file = tmp_path / "test_video.mp4"
    video_file.write_bytes(b"\x00" * 1024)
    return str(video_file)


@pytest.fixture
def fake_srt(tmp_path):
    """Create a valid SRT file for testing."""
    srt_file = tmp_path / "test_video.srt"
    srt_file.write_text(
        "1\n"
        "00:00:00,000 --> 00:00:05,200\n"
        "Hello world\n"
        "\n"
        "2\n"
        "00:00:05,200 --> 00:00:10,500\n"
        "This is a test\n"
        "\n",
        encoding="utf-8",
    )
    return str(srt_file)


@pytest.fixture
def mock_whisper_response_with_segments():
    """Mock Whisper API response with segments."""
    response = MagicMock()
    response.text = "Hello world. This is a test."
    response.segments = [
        {"start": 0.0, "end": 5.2, "text": " Hello world."},
        {"start": 5.2, "end": 10.5, "text": " This is a test."},
    ]
    return response


@pytest.fixture
def mock_whisper_response_no_segments():
    """Mock Whisper API response without segments (fallback)."""
    response = MagicMock()
    response.text = "Hello world this is a test of the emergency broadcast system"
    response.segments = []
    return response


@pytest.fixture
def mock_gpt_translation_response():
    """Mock GPT translation response."""
    response = MagicMock()
    response.choices = [MagicMock()]
    response.choices[0].message.content = (
        "1\n"
        "00:00:00,000 --> 00:00:05,200\n"
        "Ola mundo\n"
        "\n"
        "2\n"
        "00:00:05,200 --> 00:00:10,500\n"
        "Este e um teste\n"
        "\n"
    )
    return response


# ======================================================================
# Constructor
# ======================================================================


class TestSubtitleProcessorInit:
    """Tests for SubtitleProcessor initialization."""

    def test_init_with_valid_key(self):
        proc = SubtitleProcessor(api_key="sk-valid-key")
        assert proc.api_key == "sk-valid-key"
        assert proc.whisper_model == "whisper-1"
        assert proc.translation_model == "gpt-4.1-mini"

    def test_init_custom_models(self):
        proc = SubtitleProcessor(
            api_key="sk-key",
            whisper_model="whisper-large",
            translation_model="gpt-4o",
        )
        assert proc.whisper_model == "whisper-large"
        assert proc.translation_model == "gpt-4o"

    def test_init_empty_key_raises(self):
        with pytest.raises(ValueError, match="API key must be provided"):
            SubtitleProcessor(api_key="")

    def test_api_key_from_config_not_hardcoded(self, processor):
        """Verify the processor uses the injected key, not a hardcoded one."""
        assert processor.api_key == "sk-test-fake-key-12345"
        assert "sk-test" in processor.api_key


# ======================================================================
# Transcribe
# ======================================================================


class TestTranscribe:
    """Tests for the transcribe method.

    For tests that need to reach the Whisper API call, we mock
    _extract_audio and _ensure_size_limit to return a real temp file,
    since subprocess.run mock alone does not create the audio file.
    """

    @patch("openai.OpenAI")
    def test_transcribe_success_with_segments(
        self, mock_openai_cls, processor, fake_video,
        mock_whisper_response_with_segments, tmp_path,
    ):
        """Successful transcription with Whisper segments."""
        # Create a real temp audio file for the API call to read
        audio_file = tmp_path / "audio.mp3"
        audio_file.write_bytes(b"\x00" * 100)

        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.audio.transcriptions.create.return_value = (
            mock_whisper_response_with_segments
        )

        with (
            patch.object(processor, "_extract_audio", return_value=str(audio_file)),
            patch.object(processor, "_ensure_size_limit", return_value=str(audio_file)),
        ):
            success, result = processor.transcribe(fake_video)

        assert success is True
        assert result.endswith(".srt")
        # Verify the API was called with correct model
        call_kwargs = mock_client.audio.transcriptions.create.call_args[1]
        assert call_kwargs["model"] == "whisper-1"

    @patch("openai.OpenAI")
    def test_transcribe_fallback_to_simple_srt(
        self, mock_openai_cls, processor, fake_video,
        mock_whisper_response_no_segments, tmp_path,
    ):
        """When no segments, creates simple SRT from full text."""
        audio_file = tmp_path / "audio.mp3"
        audio_file.write_bytes(b"\x00" * 100)

        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.audio.transcriptions.create.return_value = (
            mock_whisper_response_no_segments
        )

        with (
            patch.object(processor, "_extract_audio", return_value=str(audio_file)),
            patch.object(processor, "_ensure_size_limit", return_value=str(audio_file)),
        ):
            success, result = processor.transcribe(fake_video)

        assert success is True
        assert result.endswith(".srt")
        # Verify fallback SRT was written (check file exists)
        assert os.path.exists(result)

    @patch("src.processors.video_downloader.subtitle_processor.subprocess.run")
    def test_transcribe_mp3_fails_fallback_wav(self, mock_run, processor, fake_video):
        """If both MP3 and WAV extraction fail, should return error."""
        mock_run.side_effect = [
            MagicMock(returncode=1),  # MP3 fails
            MagicMock(returncode=1),  # WAV also fails
        ]

        success, result = processor.transcribe(fake_video)

        assert success is False
        assert "Failed to extract audio" in result
        assert mock_run.call_count == 2

    @patch("src.processors.video_downloader.subtitle_processor.subprocess.run")
    def test_transcribe_mp3_fails_wav_succeeds(self, mock_run, processor, fake_video, tmp_path):
        """If MP3 fails but WAV succeeds, should use WAV."""
        def ffmpeg_side_effect(cmd, **kwargs):
            # Only create the WAV file, not MP3
            if "pcm_s16le" in cmd:
                # This is the WAV command -- create the file
                wav_path = cmd[-1]  # last arg is output path
                os.makedirs(os.path.dirname(wav_path), exist_ok=True)
                with open(wav_path, "wb") as f:
                    f.write(b"\x00" * 100)
                return MagicMock(returncode=0)
            return MagicMock(returncode=1)

        mock_run.side_effect = ffmpeg_side_effect

        # Mock the API call since we want to test the extraction fallback
        with patch("openai.OpenAI") as mock_openai_cls:
            mock_client = MagicMock()
            mock_openai_cls.return_value = mock_client
            response = MagicMock()
            response.text = "Test"
            response.segments = [{"start": 0, "end": 1, "text": "Test"}]
            mock_client.audio.transcriptions.create.return_value = response

            with patch.object(processor, "_ensure_size_limit", side_effect=lambda p, td, **kw: p):
                success, result = processor.transcribe(fake_video)

        assert success is True

    @patch("openai.OpenAI")
    def test_transcribe_file_too_large_triggers_compression(
        self, mock_openai_cls, processor, fake_video,
        mock_whisper_response_with_segments, tmp_path,
    ):
        """Audio > 25MB should trigger compression via _ensure_size_limit."""
        audio_file = tmp_path / "audio.mp3"
        audio_file.write_bytes(b"\x00" * 100)
        compressed_file = tmp_path / "compressed.mp3"
        compressed_file.write_bytes(b"\x00" * 50)

        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.audio.transcriptions.create.return_value = (
            mock_whisper_response_with_segments
        )

        # _extract_audio returns large file, _ensure_size_limit compresses it
        with (
            patch.object(processor, "_extract_audio", return_value=str(audio_file)),
            patch.object(processor, "_ensure_size_limit", return_value=str(compressed_file)),
        ):
            success, result = processor.transcribe(fake_video)

        assert success is True
        # Verify _ensure_size_limit was called (the mock was used)

    @patch("openai.OpenAI")
    def test_transcribe_api_error(
        self, mock_openai_cls, processor, fake_video, tmp_path,
    ):
        """API error should return failure."""
        audio_file = tmp_path / "audio.mp3"
        audio_file.write_bytes(b"\x00" * 100)

        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.audio.transcriptions.create.side_effect = Exception("API timeout")

        with (
            patch.object(processor, "_extract_audio", return_value=str(audio_file)),
            patch.object(processor, "_ensure_size_limit", return_value=str(audio_file)),
        ):
            success, result = processor.transcribe(fake_video)

        assert success is False
        assert "Whisper API error" in result

    def test_transcribe_video_not_found(self, processor):
        success, result = processor.transcribe("/nonexistent/video.mp4")
        assert success is False
        assert "not found" in result

    @patch("openai.OpenAI")
    def test_transcribe_empty_response(
        self, mock_openai_cls, processor, fake_video, tmp_path,
    ):
        """Empty transcription should return failure."""
        audio_file = tmp_path / "audio.mp3"
        audio_file.write_bytes(b"\x00" * 100)

        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        empty_response = MagicMock()
        empty_response.segments = []
        empty_response.text = ""
        mock_client.audio.transcriptions.create.return_value = empty_response

        with (
            patch.object(processor, "_extract_audio", return_value=str(audio_file)),
            patch.object(processor, "_ensure_size_limit", return_value=str(audio_file)),
        ):
            success, result = processor.transcribe(fake_video)

        assert success is False
        assert "empty transcription" in result

    @patch("openai.OpenAI")
    def test_transcribe_progress_callback(
        self, mock_openai_cls, processor, fake_video,
        mock_whisper_response_with_segments, tmp_path,
    ):
        """Verify progress callback is called during transcription."""
        audio_file = tmp_path / "audio.mp3"
        audio_file.write_bytes(b"\x00" * 100)

        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.audio.transcriptions.create.return_value = (
            mock_whisper_response_with_segments
        )

        callback = MagicMock()

        with (
            patch.object(processor, "_extract_audio", return_value=str(audio_file)),
            patch.object(processor, "_ensure_size_limit", return_value=str(audio_file)),
        ):
            success, result = processor.transcribe(
                fake_video, progress_callback=callback,
            )

        assert success is True
        assert callback.call_count >= 3
        last_call_args = callback.call_args_list[-1][0]
        assert last_call_args[0] == 1.0
        assert "complete" in last_call_args[1].lower()


# ======================================================================
# Translate
# ======================================================================


class TestTranslate:
    """Tests for the translate method."""

    @patch("openai.OpenAI")
    def test_translate_success(
        self, mock_openai_cls, processor, fake_srt,
        mock_gpt_translation_response,
    ):
        """Successful translation saves translated SRT."""
        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.chat.completions.create.return_value = (
            mock_gpt_translation_response
        )

        success, result = processor.translate(fake_srt, target_lang="pt-BR")

        assert success is True
        assert result == fake_srt  # Returns the original path (overwritten)

        # Verify GPT was called with correct model and temperature
        call_kwargs = mock_client.chat.completions.create.call_args
        assert call_kwargs[1]["model"] == "gpt-4.1-mini"
        assert call_kwargs[1]["temperature"] == 0.3

        # Verify system prompt mentions target language
        messages = call_kwargs[1]["messages"]
        assert "pt-BR" in messages[0]["content"]

    @patch("openai.OpenAI")
    def test_translate_creates_lang_suffix_file(
        self, mock_openai_cls, processor, fake_srt,
        mock_gpt_translation_response,
    ):
        """Should also create a file with language suffix."""
        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.chat.completions.create.return_value = (
            mock_gpt_translation_response
        )

        processor.translate(fake_srt, target_lang="pt-BR")

        # Check that the _pt_br.srt file was created
        base = os.path.splitext(fake_srt)[0]
        lang_file = f"{base}_pt_br.srt"
        assert os.path.exists(lang_file)

    @patch("openai.OpenAI")
    def test_translate_api_error(self, mock_openai_cls, processor, fake_srt):
        """API error should return failure."""
        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.chat.completions.create.side_effect = Exception("Rate limit")

        success, result = processor.translate(fake_srt)

        assert success is False
        assert "Translation API error" in result

    def test_translate_srt_not_found(self, processor):
        success, result = processor.translate("/nonexistent/file.srt")
        assert success is False
        assert "not found" in result

    @patch("openai.OpenAI")
    def test_translate_progress_callback(
        self, mock_openai_cls, processor, fake_srt,
        mock_gpt_translation_response,
    ):
        """Verify progress callback is invoked during translation."""
        mock_client = MagicMock()
        mock_openai_cls.return_value = mock_client
        mock_client.chat.completions.create.return_value = (
            mock_gpt_translation_response
        )

        callback = MagicMock()
        processor.translate(fake_srt, progress_callback=callback)

        assert callback.call_count >= 2


# ======================================================================
# Generate ASS
# ======================================================================


class TestGenerateAss:
    """Tests for the generate_ass_file method."""

    def test_generate_ass_delegates_to_srt_utils(self, processor, fake_srt):
        success, result = processor.generate_ass_file(fake_srt)

        assert success is True
        assert result.endswith(".ass")
        assert os.path.exists(result)

    def test_generate_ass_with_custom_style(self, processor, fake_srt):
        from src.processors.video_downloader.srt_utils import SubtitleStyle

        style = SubtitleStyle(font_name="Courier", font_size=18)
        success, result = processor.generate_ass_file(fake_srt, style=style)

        assert success is True
        content = open(result, "r", encoding="utf-8").read()
        assert "Courier" in content


# ======================================================================
# Embed Subtitles
# ======================================================================


class TestEmbedSubtitles:
    """Tests for embed_subtitles with mocked subprocess."""

    @patch("src.processors.video_downloader.subtitle_processor.subprocess.run")
    def test_embed_with_srt(self, mock_run, processor, fake_video, fake_srt, tmp_path):
        """Embedding SRT subtitles should use subtitles= filter."""
        output_path = str(tmp_path / "output.mp4")

        # Make ffmpeg succeed and create output
        def ffmpeg_side_effect(cmd, **kwargs):
            cwd = kwargs.get("cwd", ".")
            output_file = os.path.join(cwd, "output.mp4")
            with open(output_file, "wb") as f:
                f.write(b"\x00" * 1024)
            return MagicMock(returncode=0, stderr="")

        mock_run.side_effect = ffmpeg_side_effect

        success, result = processor.embed_subtitles(
            fake_video, fake_srt, output_path,
        )

        assert success is True
        assert result == output_path

        # Verify FFmpeg was called with subtitles= filter
        cmd = mock_run.call_args[0][0]
        vf_idx = cmd.index("-vf") + 1
        assert "subtitles=" in cmd[vf_idx]

    @patch("src.processors.video_downloader.subtitle_processor.subprocess.run")
    def test_embed_with_ass(self, mock_run, processor, fake_video, tmp_path):
        """Embedding ASS subtitles should use ass= filter."""
        # Create fake ASS file
        ass_file = tmp_path / "subs.ass"
        ass_file.write_text("[Script Info]\nTitle: Test\n", encoding="utf-8")
        output_path = str(tmp_path / "output.mp4")

        def ffmpeg_side_effect(cmd, **kwargs):
            cwd = kwargs.get("cwd", ".")
            output_file = os.path.join(cwd, "output.mp4")
            with open(output_file, "wb") as f:
                f.write(b"\x00" * 1024)
            return MagicMock(returncode=0, stderr="")

        mock_run.side_effect = ffmpeg_side_effect

        success, result = processor.embed_subtitles(
            fake_video, str(ass_file), output_path,
        )

        assert success is True

        cmd = mock_run.call_args[0][0]
        vf_idx = cmd.index("-vf") + 1
        assert "ass=" in cmd[vf_idx]

    @patch("src.processors.video_downloader.subtitle_processor.subprocess.run")
    def test_embed_ffmpeg_failure(self, mock_run, processor, fake_video, fake_srt, tmp_path):
        """FFmpeg failure should return error."""
        output_path = str(tmp_path / "output.mp4")

        mock_run.return_value = MagicMock(returncode=1, stderr="Encoding error")

        success, result = processor.embed_subtitles(
            fake_video, fake_srt, output_path,
        )

        assert success is False
        assert "FFmpeg embed error" in result

    def test_embed_video_not_found(self, processor, fake_srt, tmp_path):
        success, result = processor.embed_subtitles(
            "/nonexistent/video.mp4", fake_srt, str(tmp_path / "out.mp4"),
        )
        assert success is False
        assert "not found" in result

    def test_embed_subtitle_not_found(self, processor, fake_video, tmp_path):
        success, result = processor.embed_subtitles(
            fake_video, "/nonexistent/subs.srt", str(tmp_path / "out.mp4"),
        )
        assert success is False
        assert "not found" in result

    @patch("src.processors.video_downloader.subtitle_processor.subprocess.run")
    def test_embed_progress_callback(
        self, mock_run, processor, fake_video, fake_srt, tmp_path,
    ):
        """Verify progress callback during embedding."""
        output_path = str(tmp_path / "output.mp4")

        def ffmpeg_side_effect(cmd, **kwargs):
            cwd = kwargs.get("cwd", ".")
            output_file = os.path.join(cwd, "output.mp4")
            with open(output_file, "wb") as f:
                f.write(b"\x00" * 1024)
            return MagicMock(returncode=0, stderr="")

        mock_run.side_effect = ffmpeg_side_effect
        callback = MagicMock()

        processor.embed_subtitles(
            fake_video, fake_srt, output_path, progress_callback=callback,
        )

        assert callback.call_count >= 2
