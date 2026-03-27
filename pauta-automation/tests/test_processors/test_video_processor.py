"""Testes unitarios para o VideoProcessor.

Cobre os dois modos de operacao (VIDEO_SUBTITLE / VIDEO_ONLY),
extracao de timecodes, download com timeout, merge de clips e error handling.
Todas as chamadas externas (subprocess, VideoDownloaderEngine, SubtitleProcessor, filesystem) sao mockadas.
"""

import os
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from unittest.mock import patch, MagicMock
import pytest

from src.core.models import (
    Instruction,
    InstructionType,
    TimeCode,
    VideoClip,
)
from src.core.config import AppConfig, GoogleConfig, OpenAIConfig, PathsConfig, VideoConfig
from src.processors.video_processor import VideoProcessor


# ---------------------------------------------------------------------------
# Fixtures / Helpers
# ---------------------------------------------------------------------------

def _make_config(output_dir="/tmp/output", api_key="sk-test-key-123"):
    """Cria AppConfig de teste com valores minimos."""
    return AppConfig(
        google=GoogleConfig(
            credentials_path="/fake/creds.json",
            token_path="/fake/token.json",
            slides_template_id="template-id",
        ),
        openai=OpenAIConfig(api_key=api_key),
        paths=PathsConfig(
            output_dir=output_dir,
            font_tarja_bold="/fake/bold.ttf",
            font_tarja_regular="/fake/regular.ttf",
            font_tarja_semibold="/fake/semibold.ttf",
            tarja_template_epoch="/fake/epoch.pptx",
            tarja_template_cobertura="/fake/cobertura.pptx",
        ),
        video=VideoConfig(
            default_quality="1080",
            whisper_model="whisper-1",
            translation_model="gpt-4",
        ),
    )


def _make_instruction(
    inst_type=InstructionType.VIDEO_ONLY,
    url="https://youtube.com/watch?v=test123",
    news_block="Test News",
    order=1,
    timecode=None,
    clips=None,
    merge=False,
):
    """Cria Instruction de teste."""
    return Instruction(
        type=inst_type,
        news_block=news_block,
        order=order,
        url=url,
        timecode=timecode,
        clips=clips or [],
        merge=merge,
    )


def _make_video_processor(config=None):
    """Cria VideoProcessor."""
    if config is None:
        config = _make_config()
    return VideoProcessor(config)


# ===========================================================================
# 1. Inicializacao
# ===========================================================================

class TestVideoProcessorInit:
    """Testes de inicializacao do VideoProcessor."""

    def test_init_stores_config(self):
        """VideoProcessor armazena a config recebida."""
        config = _make_config()
        processor = VideoProcessor(config)
        assert processor.config is config

    def test_no_downloader_property(self):
        """VideoProcessor nao tem mais propriedade downloader (usa engine estatica)."""
        config = _make_config()
        processor = VideoProcessor(config)
        assert not hasattr(processor, '_downloader')
        assert not hasattr(processor, 'downloader')


# ===========================================================================
# 2. Tipo de instrucao nao suportado
# ===========================================================================

class TestUnsupportedType:
    """Testes para tipos de instrucao nao suportados."""

    def test_process_rejects_slide_type(self):
        """process() rejeita tipos que nao sao video."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.SLIDE_POST)

        with pytest.raises(ValueError, match="nao suportado"):
            processor.process(instruction)

    def test_process_rejects_tarja_type(self):
        """process() rejeita tipo TARJA."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.TARJA)

        with pytest.raises(ValueError, match="nao suportado"):
            processor.process(instruction)


# ===========================================================================
# 3. Modo VIDEO_ONLY (FR8)
# ===========================================================================

class TestVideoOnly:
    """Testes para o modo VIDEO_ONLY."""

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_video_only_success(self, mock_engine):
        """VIDEO_ONLY com download bem-sucedido retorna path do video."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY)

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            temp_path = f.name
            f.write(b"fake video data")

        try:
            mock_engine.download.return_value = (True, "OK", temp_path)
            mock_engine.adjust_aspect_ratio.return_value = (True, temp_path)

            with patch("src.processors.video_processor.subprocess") as mock_sub:
                mock_result = MagicMock()
                mock_result.returncode = 1
                mock_sub.run.return_value = mock_result

                result = processor.process(instruction)

            assert result == temp_path
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def test_video_only_no_url_raises(self):
        """VIDEO_ONLY sem URL levanta ValueError."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY, url=None)

        with pytest.raises(ValueError, match="sem URL"):
            processor.process(instruction)

    def test_video_only_empty_url_raises(self):
        """VIDEO_ONLY com URL vazia levanta ValueError."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY, url="")

        with pytest.raises(ValueError, match="sem URL"):
            processor.process(instruction)

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_video_only_download_failure_raises(self, mock_engine):
        """VIDEO_ONLY com download falhado levanta RuntimeError."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY)

        mock_engine.download.return_value = (False, "Network error", None)

        with patch("src.processors.video_processor.subprocess") as mock_sub:
            mock_result = MagicMock()
            mock_result.returncode = 1
            mock_sub.run.return_value = mock_result

            with pytest.raises(RuntimeError, match="Download falhou"):
                processor.process(instruction)

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_video_only_video_not_found_raises(self, mock_engine):
        """VIDEO_ONLY quando download retorna path inexistente levanta RuntimeError."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY)

        mock_engine.download.return_value = (True, "OK", "/nonexistent/video.mp4")
        mock_engine.adjust_aspect_ratio.return_value = (True, "/nonexistent/video.mp4")

        with patch("src.processors.video_processor.subprocess") as mock_sub:
            mock_result = MagicMock()
            mock_result.returncode = 1
            mock_sub.run.return_value = mock_result

            with pytest.raises(RuntimeError, match="nao encontrado"):
                processor.process(instruction)

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_video_only_with_timecode(self, mock_engine):
        """VIDEO_ONLY passa timecodes para clip_video."""
        processor = _make_video_processor()
        instruction = _make_instruction(
            inst_type=InstructionType.VIDEO_ONLY,
            timecode=TimeCode(start="0130", end="0245"),
        )

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            temp_path = f.name
            f.write(b"fake")

        try:
            mock_engine.download.return_value = (True, "OK", temp_path)
            mock_engine.clip_video.return_value = (True, temp_path)
            mock_engine.adjust_aspect_ratio.return_value = (True, temp_path)

            with patch("src.processors.video_processor.subprocess") as mock_sub:
                mock_result = MagicMock()
                mock_result.returncode = 1
                mock_sub.run.return_value = mock_result

                processor.process(instruction)

            # Verifica que clip_video foi chamado com timecodes formatados
            mock_engine.clip_video.assert_called_once()
            call_kwargs = mock_engine.clip_video.call_args[1]
            assert call_kwargs["start_time"] == "01:30"
            assert call_kwargs["end_time"] == "02:45"
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_video_only_calls_progress_callback(self, mock_engine):
        """VIDEO_ONLY invoca callback de progresso durante download."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY)
        progress_values = []

        def track_progress(pct):
            progress_values.append(pct)

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            temp_path = f.name
            f.write(b"fake")

        try:
            # Simula download que invoca o callback de progresso
            def fake_download(url, output_dir, quality, progress_callback=None):
                if progress_callback:
                    progress_callback(50, "Downloading...")
                    progress_callback(100, "Done")
                return (True, "OK", temp_path)

            mock_engine.download.side_effect = fake_download
            mock_engine.adjust_aspect_ratio.return_value = (True, temp_path)

            with patch("src.processors.video_processor.subprocess") as mock_sub:
                mock_result = MagicMock()
                mock_result.returncode = 1
                mock_sub.run.return_value = mock_result

                processor.process(instruction, on_progress=track_progress)

            assert len(progress_values) == 2
            assert progress_values[0] == 0.5  # 50/100.0
            assert progress_values[1] == 1.0  # 100/100.0
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)


# ===========================================================================
# 4. Modo VIDEO_SUBTITLE (FR7)
# ===========================================================================

class TestVideoSubtitle:
    """Testes para o modo VIDEO_SUBTITLE (com legenda)."""

    @patch("src.processors.video_processor.SubtitleProcessor")
    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_subtitle_success(self, mock_engine, mock_subtitle_cls):
        """VIDEO_SUBTITLE com download+transcricao bem-sucedido retorna path."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_SUBTITLE)

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            temp_path = f.name
            f.write(b"fake video")

        try:
            mock_engine.download.return_value = (True, "OK", temp_path)
            mock_engine.adjust_aspect_ratio.return_value = (True, temp_path)

            mock_proc = MagicMock()
            mock_subtitle_cls.return_value = mock_proc
            mock_proc.transcribe.return_value = (True, "/tmp/sub.srt")
            mock_proc.translate.return_value = (True, "/tmp/sub_pt.srt")
            mock_proc.generate_ass_file.return_value = (True, "/tmp/sub.ass")
            mock_proc.embed_subtitles.return_value = (True, temp_path)

            with patch("src.processors.video_processor.subprocess") as mock_sub:
                mock_result = MagicMock()
                mock_result.returncode = 1
                mock_sub.run.return_value = mock_result

                result = processor.process(instruction)

            assert result == temp_path
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def test_subtitle_no_url_raises(self):
        """VIDEO_SUBTITLE sem URL levanta ValueError."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_SUBTITLE, url=None)

        with pytest.raises(ValueError, match="sem URL"):
            processor.process(instruction)

    def test_subtitle_no_api_key_raises(self):
        """VIDEO_SUBTITLE sem API key levanta ValueError."""
        config = _make_config(api_key="")
        processor = _make_video_processor(config=config)
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_SUBTITLE)

        with pytest.raises(ValueError, match="API key"):
            processor.process(instruction)

    @patch("src.processors.video_processor.SubtitleProcessor")
    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_subtitle_calls_subtitle_processor(self, mock_engine, mock_subtitle_cls):
        """VIDEO_SUBTITLE usa SubtitleProcessor para transcricao e traducao."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_SUBTITLE)

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            temp_path = f.name
            f.write(b"fake")

        try:
            mock_engine.download.return_value = (True, "OK", temp_path)
            mock_engine.adjust_aspect_ratio.return_value = (True, temp_path)

            mock_proc = MagicMock()
            mock_subtitle_cls.return_value = mock_proc
            mock_proc.transcribe.return_value = (True, "/tmp/sub.srt")
            mock_proc.translate.return_value = (True, "/tmp/sub_pt.srt")
            mock_proc.generate_ass_file.return_value = (True, "/tmp/sub.ass")
            mock_proc.embed_subtitles.return_value = (True, temp_path)

            with patch("src.processors.video_processor.subprocess") as mock_sub:
                mock_result = MagicMock()
                mock_result.returncode = 1
                mock_sub.run.return_value = mock_result

                processor.process(instruction)

            mock_subtitle_cls.assert_called_once_with(api_key="sk-test-key-123")
            mock_proc.transcribe.assert_called_once()
            mock_proc.translate.assert_called_once()
            mock_proc.generate_ass_file.assert_called_once()
            mock_proc.embed_subtitles.assert_called_once()
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_subtitle_download_failure_raises(self, mock_engine):
        """VIDEO_SUBTITLE com processamento falhado levanta RuntimeError."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_SUBTITLE)

        mock_engine.download.return_value = (False, "Whisper timeout", None)

        with patch("src.processors.video_processor.subprocess") as mock_sub:
            mock_result = MagicMock()
            mock_result.returncode = 1
            mock_sub.run.return_value = mock_result

            with pytest.raises(RuntimeError, match="Processamento falhou"):
                processor.process(instruction)


# ===========================================================================
# 5. Extracao de timecodes
# ===========================================================================

class TestTimecodes:
    """Testes para extracao e formatacao de timecodes."""

    def test_format_timecode_4digits(self):
        """Formata timecode MMSS de 4 digitos para MM:SS."""
        assert VideoProcessor._format_timecode("0034") == "00:34"
        assert VideoProcessor._format_timecode("0130") == "01:30"
        assert VideoProcessor._format_timecode("3840") == "38:40"

    def test_format_timecode_3digits(self):
        """Formata timecode de 3 digitos (M:SS) para MM:SS."""
        assert VideoProcessor._format_timecode("130") == "01:30"
        assert VideoProcessor._format_timecode("045") == "00:45"

    def test_format_timecode_2digits(self):
        """Formata timecode de 2 digitos (SS) para 00:SS."""
        assert VideoProcessor._format_timecode("34") == "00:34"
        assert VideoProcessor._format_timecode("05") == "00:05"

    def test_format_timecode_already_formatted(self):
        """Retorna timecode inalterado se ja contem ':'."""
        assert VideoProcessor._format_timecode("01:30") == "01:30"
        assert VideoProcessor._format_timecode("38:40") == "38:40"

    def test_format_timecode_with_whitespace(self):
        """Remove whitespace antes de formatar."""
        assert VideoProcessor._format_timecode("  0130  ") == "01:30"

    def test_format_timecode_non_standard_passthrough(self):
        """Timecodes nao reconhecidos passam inalterados."""
        assert VideoProcessor._format_timecode("abc") == "abc"
        assert VideoProcessor._format_timecode("12345") == "12345"

    def test_get_timecodes_from_instruction_timecode(self):
        """Extrai timecodes do campo timecode da instrucao."""
        instruction = _make_instruction(
            timecode=TimeCode(start="0100", end="0230"),
        )
        start, end = VideoProcessor._get_timecodes(instruction)
        assert start == "01:00"
        assert end == "02:30"

    def test_get_timecodes_from_first_clip(self):
        """Extrai timecodes do primeiro clip quando instrucao nao tem timecode."""
        instruction = _make_instruction(
            clips=[
                VideoClip(url="https://example.com/v1", timecode=TimeCode(start="0530", end="0645")),
                VideoClip(url="https://example.com/v2", timecode=TimeCode(start="1000", end="1100")),
            ],
        )
        start, end = VideoProcessor._get_timecodes(instruction)
        assert start == "05:30"
        assert end == "06:45"

    def test_get_timecodes_empty_when_no_timecode(self):
        """Retorna strings vazias quando nao ha timecode."""
        instruction = _make_instruction()
        start, end = VideoProcessor._get_timecodes(instruction)
        assert start == ""
        assert end == ""


# ===========================================================================
# 6. Download com timeout
# ===========================================================================

class TestDownloadWithTimeout:
    """Testes para o mecanismo de download com timeout."""

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_download_timeout_returns_error(self, mock_engine):
        """Download que excede timeout retorna erro."""
        processor = _make_video_processor()

        # Simula download que nunca termina
        def slow_download(**kwargs):
            import time
            time.sleep(10)
            return (True, "OK", "/tmp/video.mp4")

        mock_engine.download.side_effect = slow_download

        with patch("src.processors.video_processor.subprocess") as mock_sub:
            mock_result = MagicMock()
            mock_result.returncode = 1
            mock_sub.run.return_value = mock_result

            with patch("src.processors.video_processor.DOWNLOAD_TIMEOUT_SECONDS", 0.1):
                success, message, video_path = processor._download_with_timeout(
                    "https://example.com/video", None
                )

        assert success is False
        assert "timeout" in message.lower()

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_download_success_within_timeout(self, mock_engine):
        """Download que completa dentro do timeout retorna sucesso."""
        processor = _make_video_processor()
        mock_engine.download.return_value = (True, "OK", "/tmp/video.mp4")
        mock_engine.adjust_aspect_ratio.return_value = (True, "/tmp/video.mp4")

        with patch("src.processors.video_processor.subprocess") as mock_sub:
            mock_result = MagicMock()
            mock_result.returncode = 1
            mock_sub.run.return_value = mock_result

            success, message, video_path = processor._download_with_timeout(
                "https://example.com/video", None
            )

        assert success is True
        assert video_path == "/tmp/video.mp4"

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_download_exception_captured(self, mock_engine):
        """Excecao durante download e capturada e retornada como mensagem."""
        processor = _make_video_processor()
        mock_engine.download.side_effect = Exception("Connection refused")

        with patch("src.processors.video_processor.subprocess") as mock_sub:
            mock_result = MagicMock()
            mock_result.returncode = 1
            mock_sub.run.return_value = mock_result

            success, message, video_path = processor._download_with_timeout(
                "https://example.com/video", None
            )

        assert success is False
        assert "Connection refused" in message


# ===========================================================================
# 7. Video size check
# ===========================================================================

class TestVideoSizeCheck:
    """Testes para verificacao de tamanho do video."""

    def _mock_yt_dlp(self, info_dict):
        """Helper: cria mock do yt_dlp.YoutubeDL que retorna info_dict."""
        mock_ydl = MagicMock()
        mock_ydl.__enter__ = MagicMock(return_value=mock_ydl)
        mock_ydl.__exit__ = MagicMock(return_value=False)
        mock_ydl.extract_info.return_value = info_dict
        return patch("yt_dlp.YoutubeDL", return_value=mock_ydl)

    def test_size_check_rejects_large_video(self):
        """Rejeita video maior que 2 GB."""
        processor = _make_video_processor()

        with self._mock_yt_dlp({"filesize": 3000000000}):
            ok, msg = processor._check_video_size("https://example.com/large.mp4")

        assert ok is False
        assert "grande" in msg.lower()

    def test_size_check_allows_small_video(self):
        """Permite video menor que 2 GB."""
        processor = _make_video_processor()

        with self._mock_yt_dlp({"filesize": 500000000}):
            ok, msg = processor._check_video_size("https://example.com/small.mp4")

        assert ok is True
        assert msg == ""

    def test_size_check_allows_on_probe_failure(self):
        """Se yt-dlp falhar na sondagem, permite download (fallback)."""
        processor = _make_video_processor()

        with patch("yt_dlp.YoutubeDL", side_effect=Exception("extraction failed")):
            ok, msg = processor._check_video_size("https://example.com/video.mp4")

        assert ok is True

    def test_size_check_allows_on_exception(self):
        """Se yt-dlp levantar excecao, permite download (fallback)."""
        processor = _make_video_processor()

        with patch("yt_dlp.YoutubeDL", side_effect=Exception("not found")):
            ok, msg = processor._check_video_size("https://example.com/video.mp4")

        assert ok is True

    def test_size_check_uses_filesize_approx(self):
        """Usa filesize_approx como fallback quando filesize nao esta presente."""
        processor = _make_video_processor()

        with self._mock_yt_dlp({"filesize_approx": 3000000000}):
            ok, msg = processor._check_video_size("https://example.com/large.mp4")

        assert ok is False

    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_download_blocked_by_size_check(self, mock_engine):
        """Download e bloqueado quando video excede limite de tamanho."""
        processor = _make_video_processor()

        with self._mock_yt_dlp({"filesize": 3000000000}):
            success, msg, video_path = processor._download_with_timeout(
                "https://example.com/huge.mp4", None
            )

        assert success is False
        assert "grande" in msg.lower()
        # Engine should NOT have been called
        mock_engine.download.assert_not_called()


# ===========================================================================
# 8. Merge de clips (multi-clip)
# ===========================================================================

class TestBuildMergeFilter:
    """Testes para construcao do filter_complex de merge."""

    def test_merge_2_clips_with_audio(self):
        """Filter complex para 2 clips com audio inclui xfade + acrossfade."""
        fc, maps = VideoProcessor._build_merge_filter(2, [10.0, 8.0], True)

        assert "xfade" in fc
        assert "acrossfade" in fc
        assert "[v]" in fc
        assert "[a]" in fc
        assert "-map" in maps

    def test_merge_2_clips_no_audio(self):
        """Filter complex para 2 clips sem audio usa -an."""
        fc, maps = VideoProcessor._build_merge_filter(2, [10.0, 8.0], False)

        assert "xfade" in fc
        assert "acrossfade" not in fc
        assert "-an" in maps

    def test_merge_3_clips_with_audio(self):
        """Filter complex para 3 clips com audio inclui encadeamento."""
        fc, maps = VideoProcessor._build_merge_filter(3, [10.0, 8.0, 12.0], True)

        assert "vt1" in fc  # Intermediate label
        assert "at1" in fc  # Intermediate audio label
        assert fc.count("xfade") == 2
        assert fc.count("acrossfade") == 2

    def test_merge_3_clips_no_audio(self):
        """Filter complex para 3 clips sem audio usa -an."""
        fc, maps = VideoProcessor._build_merge_filter(3, [10.0, 8.0, 12.0], False)

        assert "xfade" in fc
        assert "acrossfade" not in fc
        assert "-an" in maps

    def test_merge_4_clips_fallback_concat(self):
        """Mais de 3 clips usa concat simples como fallback."""
        fc, maps = VideoProcessor._build_merge_filter(4, [10.0, 8.0, 12.0, 6.0], True)

        assert "concat" in fc
        assert "n=4" in fc

    def test_merge_2_clips_correct_offset(self):
        """Offset para 2 clips e calculado como duracao[0] - transicao."""
        from src.processors.video_processor import TRANSITION_DURATION
        fc, _ = VideoProcessor._build_merge_filter(2, [15.0, 10.0], True)

        expected_offset = 15.0 - TRANSITION_DURATION
        assert f"offset={expected_offset}" in fc


# ===========================================================================
# 9. Duracao e audio helpers
# ===========================================================================

class TestMediaHelpers:
    """Testes para helpers de duracao e deteccao de audio."""

    def test_get_clip_duration_success(self):
        """Retorna duracao real do clip quando ffprobe funciona."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = "12.345\n"

        with patch("src.processors.video_processor.subprocess.run", return_value=mock_result):
            duration = VideoProcessor._get_clip_duration("/tmp/clip.mp4")

        assert duration == 12.345

    def test_get_clip_duration_fallback(self):
        """Retorna 10.0 como fallback quando ffprobe falha."""
        mock_result = MagicMock()
        mock_result.returncode = 1
        mock_result.stdout = ""

        with patch("src.processors.video_processor.subprocess.run", return_value=mock_result):
            duration = VideoProcessor._get_clip_duration("/tmp/clip.mp4")

        assert duration == 10.0

    def test_get_clip_duration_fallback_on_exception(self):
        """Retorna 10.0 como fallback quando ffprobe levanta excecao."""
        with patch("src.processors.video_processor.subprocess.run", side_effect=Exception("ffprobe not found")):
            duration = VideoProcessor._get_clip_duration("/tmp/clip.mp4")

        assert duration == 10.0

    def test_has_audio_stream_true(self):
        """Detecta stream de audio quando ffprobe retorna resultado."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = "0\n"

        with patch("src.processors.video_processor.subprocess.run", return_value=mock_result):
            has_audio = VideoProcessor._has_audio_stream("/tmp/clip.mp4")

        assert has_audio is True

    def test_has_audio_stream_false(self):
        """Retorna False quando nao ha stream de audio."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = ""

        with patch("src.processors.video_processor.subprocess.run", return_value=mock_result):
            has_audio = VideoProcessor._has_audio_stream("/tmp/clip.mp4")

        assert has_audio is False

    def test_has_audio_stream_false_on_exception(self):
        """Retorna False quando ffprobe levanta excecao."""
        with patch("src.processors.video_processor.subprocess.run", side_effect=Exception("error")):
            has_audio = VideoProcessor._has_audio_stream("/tmp/clip.mp4")

        assert has_audio is False


# ===========================================================================
# 10. Multi-clip processing
# ===========================================================================

class TestMultiClipProcessing:
    """Testes para processamento de multiplos clips com merge."""

    def test_multi_clip_no_clips_raises(self):
        """Multi-clip sem clips definidos levanta ValueError."""
        processor = _make_video_processor()
        instruction = _make_instruction(
            inst_type=InstructionType.VIDEO_SUBTITLE,
            clips=[],
            merge=True,
        )
        instruction.clips = []
        instruction.merge = True

        with pytest.raises(ValueError, match="sem clips"):
            processor._process_multi_clip(instruction, None)

    @patch("src.processors.video_processor.SubtitleProcessor")
    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_multi_clip_single_clip_returns_directly(self, mock_engine, mock_subtitle_cls):
        """Multi-clip com apenas 1 clip retorna path sem merge."""
        processor = _make_video_processor()

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            temp_path = f.name
            f.write(b"fake clip")

        try:
            instruction = _make_instruction(
                inst_type=InstructionType.VIDEO_SUBTITLE,
                clips=[VideoClip(url="https://example.com/v1", timecode=TimeCode(start="0100", end="0200"))],
                merge=True,
            )

            mock_engine.download.return_value = (True, "OK", temp_path)
            mock_engine.clip_video.return_value = (True, temp_path)
            mock_engine.adjust_aspect_ratio.return_value = (True, temp_path)

            mock_proc = MagicMock()
            mock_subtitle_cls.return_value = mock_proc
            mock_proc.transcribe.return_value = (True, "/tmp/sub.srt")
            mock_proc.translate.return_value = (True, "/tmp/sub_pt.srt")
            mock_proc.generate_ass_file.return_value = (True, "/tmp/sub.ass")
            mock_proc.embed_subtitles.return_value = (True, temp_path)

            result = processor._process_multi_clip(instruction, None)
            assert result == temp_path
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    @patch("src.processors.video_processor.SubtitleProcessor")
    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_multi_clip_clip_failure_raises(self, mock_engine, mock_subtitle_cls):
        """Multi-clip com falha em um clip levanta RuntimeError."""
        processor = _make_video_processor()
        instruction = _make_instruction(
            inst_type=InstructionType.VIDEO_SUBTITLE,
            clips=[
                VideoClip(url="https://example.com/v1", timecode=TimeCode(start="0100", end="0200")),
                VideoClip(url="https://example.com/v2", timecode=TimeCode(start="0300", end="0400")),
            ],
            merge=True,
        )

        mock_engine.download.return_value = (False, "Clip download failed", None)

        with pytest.raises(RuntimeError, match="Clip 1 falhou"):
            processor._process_multi_clip(instruction, None)

    @patch("src.processors.video_processor.SubtitleProcessor")
    @patch("src.processors.video_processor.VideoDownloaderEngine")
    def test_multi_clip_uses_instruction_url_as_fallback(self, mock_engine, mock_subtitle_cls):
        """Multi-clip usa URL da instrucao quando clip nao tem URL propria."""
        processor = _make_video_processor()
        instruction = _make_instruction(
            inst_type=InstructionType.VIDEO_SUBTITLE,
            url="https://example.com/main-video",
            clips=[
                VideoClip(url="", timecode=TimeCode(start="0100", end="0200")),
            ],
            merge=True,
        )

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            temp_path = f.name
            f.write(b"fake")

        try:
            mock_engine.download.return_value = (True, "OK", temp_path)
            mock_engine.clip_video.return_value = (True, temp_path)
            mock_engine.adjust_aspect_ratio.return_value = (True, temp_path)

            mock_proc = MagicMock()
            mock_subtitle_cls.return_value = mock_proc
            mock_proc.transcribe.return_value = (True, "/tmp/sub.srt")
            mock_proc.translate.return_value = (True, "/tmp/sub_pt.srt")
            mock_proc.generate_ass_file.return_value = (True, "/tmp/sub.ass")
            mock_proc.embed_subtitles.return_value = (True, temp_path)

            processor._process_multi_clip(instruction, None)

            call_kwargs = mock_engine.download.call_args[1]
            assert call_kwargs["url"] == "https://example.com/main-video"
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def test_multi_clip_no_url_at_all_raises(self):
        """Multi-clip sem URL no clip nem na instrucao levanta ValueError."""
        processor = _make_video_processor()
        instruction = _make_instruction(
            inst_type=InstructionType.VIDEO_SUBTITLE,
            url=None,
            clips=[
                VideoClip(url="", timecode=TimeCode(start="0100", end="0200")),
            ],
            merge=True,
        )

        with pytest.raises(ValueError, match="sem URL"):
            processor._process_multi_clip(instruction, None)


# ===========================================================================
# 11. Merge clips (FFmpeg integration)
# ===========================================================================

class TestMergeClips:
    """Testes para o merge de clips via FFmpeg."""

    def test_merge_clips_success(self):
        """Merge de clips via FFmpeg retorna path do arquivo merged."""
        processor = _make_video_processor()

        with tempfile.TemporaryDirectory() as tmpdir:
            # Cria clips fake
            clip1 = os.path.join(tmpdir, "clip1.mp4")
            clip2 = os.path.join(tmpdir, "clip2.mp4")
            for p in [clip1, clip2]:
                with open(p, "wb") as f:
                    f.write(b"fake video data")

            instruction = _make_instruction(
                inst_type=InstructionType.VIDEO_SUBTITLE,
                news_block="Test Merge",
            )

            config = _make_config(output_dir=tmpdir)
            processor.config = config

            # Mock subprocess.run para ffprobe (duracao) e ffmpeg (merge)
            def mock_run(cmd, **kwargs):
                result = MagicMock()
                if cmd[0] == "ffprobe":
                    if "-show_entries" in cmd and "format=duration" in cmd:
                        result.returncode = 0
                        result.stdout = "10.0\n"
                    elif "-select_streams" in cmd:
                        result.returncode = 0
                        result.stdout = "0\n"
                    else:
                        result.returncode = 0
                        result.stdout = ""
                elif cmd[0] == "ffmpeg":
                    result.returncode = 0
                    result.stderr = ""
                    # Cria arquivo merged no cwd
                    cwd = kwargs.get("cwd", ".")
                    merged_file = os.path.join(cwd, "merged.mp4")
                    with open(merged_file, "wb") as f:
                        f.write(b"merged video data")
                else:
                    result.returncode = 0
                    result.stdout = ""
                return result

            with patch("src.processors.video_processor.subprocess.run", side_effect=mock_run):
                merged = processor._merge_clips([clip1, clip2], instruction, None)

            assert os.path.exists(merged)
            assert "merged" in merged

    def test_merge_clips_ffmpeg_failure_raises(self):
        """Merge levanta RuntimeError quando FFmpeg falha."""
        processor = _make_video_processor()

        with tempfile.TemporaryDirectory() as tmpdir:
            clip1 = os.path.join(tmpdir, "clip1.mp4")
            clip2 = os.path.join(tmpdir, "clip2.mp4")
            for p in [clip1, clip2]:
                with open(p, "wb") as f:
                    f.write(b"fake")

            instruction = _make_instruction(news_block="FailMerge")
            config = _make_config(output_dir=tmpdir)
            processor.config = config

            def mock_run(cmd, **kwargs):
                result = MagicMock()
                if cmd[0] == "ffprobe":
                    result.returncode = 0
                    result.stdout = "10.0\n"
                elif cmd[0] == "ffmpeg":
                    result.returncode = 1
                    result.stderr = "FFmpeg error: invalid filter"
                    # Do NOT create merged.mp4
                else:
                    result.returncode = 0
                    result.stdout = ""
                return result

            with patch("src.processors.video_processor.subprocess.run", side_effect=mock_run):
                with pytest.raises(RuntimeError, match="Merge falhou"):
                    processor._merge_clips([clip1, clip2], instruction, None)


# ===========================================================================
# 12. Process routing (integration-level)
# ===========================================================================

class TestProcessRouting:
    """Testes de roteamento do metodo process()."""

    def test_process_routes_to_video_only(self):
        """process() roteia VIDEO_ONLY para _process_video_only."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY)

        with patch.object(processor, "_process_video_only", return_value="/tmp/video.mp4") as mock_method:
            result = processor.process(instruction)

        mock_method.assert_called_once_with(instruction, None)
        assert result == "/tmp/video.mp4"

    def test_process_routes_to_subtitle(self):
        """process() roteia VIDEO_SUBTITLE para _process_with_subtitles."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_SUBTITLE)

        with patch.object(processor, "_process_with_subtitles", return_value="/tmp/sub.mp4") as mock_method:
            result = processor.process(instruction)

        mock_method.assert_called_once_with(instruction, None)
        assert result == "/tmp/sub.mp4"

    def test_process_passes_on_progress(self):
        """process() passa callback de progresso adiante."""
        processor = _make_video_processor()
        instruction = _make_instruction(inst_type=InstructionType.VIDEO_ONLY)
        progress_fn = MagicMock()

        with patch.object(processor, "_process_video_only", return_value="/tmp/v.mp4") as mock_method:
            processor.process(instruction, on_progress=progress_fn)
            mock_method.assert_called_once_with(instruction, progress_fn)

    def test_subtitle_with_multi_clip_routes_to_multi(self):
        """VIDEO_SUBTITLE com merge=True e 2+ clips roteia para _process_multi_clip."""
        processor = _make_video_processor()
        # Need a valid API key
        processor.config = _make_config(api_key="sk-valid-key")
        instruction = _make_instruction(
            inst_type=InstructionType.VIDEO_SUBTITLE,
            clips=[
                VideoClip(url="https://a.com/1"),
                VideoClip(url="https://a.com/2"),
            ],
            merge=True,
        )

        with patch.object(processor, "_process_multi_clip", return_value="/tmp/merged.mp4") as mock_method:
            result = processor.process(instruction)

        mock_method.assert_called_once_with(instruction, None)
        assert result == "/tmp/merged.mp4"


# ===========================================================================
# 13. Internal module usage verification (Story 6.6 NEW)
# ===========================================================================

class TestInternalModuleUsage:
    """Testes que verificam uso de modulos internos e ausencia de paths externos."""

    def test_video_processor_uses_internal_engine(self):
        """VideoProcessor importa VideoDownloaderEngine do modulo interno."""
        import inspect
        from src.processors import video_processor as vp_module

        source = inspect.getsource(vp_module)
        assert "from src.processors.video_downloader.engine import VideoDownloaderEngine" in source
        assert "from src.processors.video_downloader.subtitle_processor import SubtitleProcessor" in source

    def test_video_processor_no_external_path(self):
        """VideoProcessor nao contem referencias a paths externos (D:\\EPOCH)."""
        import inspect
        from src.processors import video_processor as vp_module

        source = inspect.getsource(vp_module)
        assert "D:\\EPOCH" not in source
        assert "D:/EPOCH" not in source
        assert "VIDEO_DOWNLOADER_PATH" not in source
        assert "_get_downloader_class" not in source
        assert "sys.path.insert" not in source

    def test_video_processor_no_downloader_property(self):
        """VideoProcessor nao tem propriedade downloader (usa engine estatica)."""
        processor = _make_video_processor()
        assert not hasattr(processor, '_downloader')
        # Verifica que a classe nao define 'downloader' como property
        assert not isinstance(
            getattr(VideoProcessor, 'downloader', None),
            property,
        )


# ===========================================================================
# 14. EventBus ProcessingEvent usage (Story 6.6 NEW)
# ===========================================================================

class TestEventBusProcessingEvent:
    """Testes que verificam uso de ProcessingEvent no EventBus.emit()."""

    def test_embed_subtitles_uses_processing_event(self):
        """embed_subtitles_standalone emite ProcessingEvent (nao kwargs)."""
        # Read source file directly to avoid importing pywebview dependency
        app_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "src", "gui", "app.py"
        )
        with open(app_path, "r", encoding="utf-8") as f:
            source = f.read()

        # Deve ter ProcessingEvent calls
        assert "ProcessingEvent(" in source
        assert "EventType.PROGRESS" in source
        assert "EventType.COMPLETED" in source
        assert "EventType.ERROR" in source

        # Nao deve ter kwargs-style emit
        assert 'event_type="embed_progress"' not in source
        assert 'event_type="embed_complete"' not in source
        assert 'event_type="embed_error"' not in source


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
