"""Processor de videos — integra com o VideoDownloaderEngine interno.

Suporta dois modos:
- VIDEO_SUBTITLE: Download -> Clip -> 16:9 -> Whisper -> GPT traduz -> Embed legenda
- VIDEO_ONLY: Download -> Clip -> 16:9

Multi-clip com merge usando transicao fadewhite de 1 segundo.

Usa modulos internos (sem dependencia de paths externos):
- src.processors.video_downloader.engine.VideoDownloaderEngine
- src.processors.video_downloader.subtitle_processor.SubtitleProcessor
"""

import logging
import os
import shutil
import subprocess
import tempfile
import threading
from typing import Callable, Optional

from src.core.config import AppConfig
from src.core.models import Instruction, InstructionType
from src.processors.base import BaseProcessor
from src.processors.video_downloader.engine import VideoDownloaderEngine
from src.processors.video_downloader.subtitle_processor import SubtitleProcessor

logger = logging.getLogger(__name__)

# Transicao de merge entre clips
TRANSITION_DURATION = 1.0  # segundos

# Timeout maximo para download de video (5 minutos)
DOWNLOAD_TIMEOUT_SECONDS = 300

# Tamanho maximo de video para download (2 GB em bytes)
MAX_VIDEO_SIZE_BYTES = 2 * 1024 * 1024 * 1024


class VideoProcessor(BaseProcessor):
    """Processa videos usando o VideoDownloaderEngine interno."""

    def __init__(self, config: AppConfig):
        self.config = config

    def process(self, instruction: Instruction, on_progress: Optional[Callable] = None) -> str:
        """Processa um video a partir de uma instrucao.

        Args:
            instruction: Instrucao do tipo VIDEO_SUBTITLE ou VIDEO_ONLY.
            on_progress: Callback de progresso (0.0 a 1.0).

        Returns:
            Path do MP4 gerado.
        """
        if instruction.type == InstructionType.VIDEO_SUBTITLE:
            return self._process_with_subtitles(instruction, on_progress)
        elif instruction.type == InstructionType.VIDEO_ONLY:
            return self._process_video_only(instruction, on_progress)
        else:
            raise ValueError(f"Tipo de instrucao nao suportado: {instruction.type}")

    def _check_video_size(self, url: str) -> tuple[bool, str]:
        """Verifica tamanho estimado do video antes de baixar.

        Returns:
            (ok, mensagem): ok=True se pode baixar, False se excede limite.
        """
        try:
            import yt_dlp
            ydl_opts = {'quiet': True, 'no_warnings': True, 'skip_download': True}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)

            filesize = info.get("filesize") or info.get("filesize_approx") or 0

            if filesize > MAX_VIDEO_SIZE_BYTES:
                size_gb = filesize / (1024 * 1024 * 1024)
                msg = f"Video muito grande ({size_gb:.1f} GB). Limite: 2 GB. Pule este video."
                logger.warning(msg + " URL: %s", url)
                return False, msg

            return True, ""
        except Exception as e:
            logger.debug("Falha ao verificar tamanho do video: %s", e)
            return True, ""  # Na duvida, tenta baixar

    def _download_with_timeout(
        self,
        url: str,
        on_progress: Optional[Callable],
        start_time: str = "",
        end_time: str = "",
    ) -> tuple[bool, str, Optional[str]]:
        """Executa download com timeout para evitar downloads infinitos.

        Returns:
            tuple: (success, message, video_path)
        """
        # Verifica tamanho antes de baixar
        ok, size_msg = self._check_video_size(url)
        if not ok:
            return False, size_msg, None

        result: list = [False, "Timeout", None]

        def progress_cb(pct: float, msg: str) -> None:
            if on_progress:
                on_progress(pct / 100.0)

        def do_download() -> None:
            try:
                success, message, video_path = VideoDownloaderEngine.download(
                    url=url,
                    output_dir=self.config.paths.output_dir,
                    quality=self.config.video.default_quality,
                    progress_callback=progress_cb,
                )
                result[0], result[1], result[2] = success, message, video_path
            except Exception as e:
                result[1] = str(e)

        thread = threading.Thread(target=do_download, daemon=True)
        thread.start()
        thread.join(timeout=DOWNLOAD_TIMEOUT_SECONDS)

        if thread.is_alive():
            logger.warning("Download timeout (%ds) para: %s", DOWNLOAD_TIMEOUT_SECONDS, url)
            return False, f"Download excedeu timeout de {DOWNLOAD_TIMEOUT_SECONDS}s", None

        success = result[0]
        message = result[1]
        video_path = result[2]

        if not success:
            return False, message, None

        # Clip if timecodes provided
        if video_path and (start_time or end_time):
            clip_success, clip_result = VideoDownloaderEngine.clip_video(
                video_path=video_path,
                start_time=start_time,
                end_time=end_time,
            )
            if not clip_success:
                return False, f"Clip falhou: {clip_result}", None
            video_path = clip_result

        # Adjust aspect ratio to 16:9
        if video_path:
            ratio_success, ratio_result = VideoDownloaderEngine.adjust_aspect_ratio(
                video_path=video_path,
                target_ratio="16:9",
            )
            if not ratio_success:
                logger.warning("Ajuste de aspect ratio falhou: %s", ratio_result)
                # Non-fatal: continue with original

        return True, message, video_path

    def _process_video_only(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Processa video sem legenda: Download -> Clip -> 16:9."""
        url = instruction.url
        if not url:
            raise ValueError("Instrucao VIDEO_ONLY sem URL")

        start_time, end_time = self._get_timecodes(instruction)

        success, message, video_path = self._download_with_timeout(
            url, on_progress, start_time, end_time,
        )

        if not success:
            raise RuntimeError(f"Download falhou: {message}")

        if not video_path or not os.path.exists(video_path):
            raise RuntimeError(f"Video nao encontrado apos download: {video_path}")

        logger.info("Video only concluido: %s", video_path)
        return video_path

    def _process_with_subtitles(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Processa video com legenda: Download -> Clip -> 16:9 -> Whisper -> GPT -> Embed."""
        url = instruction.url
        if not url:
            raise ValueError("Instrucao VIDEO_SUBTITLE sem URL")

        api_key = self.config.openai.api_key
        if not api_key:
            raise ValueError("OpenAI API key necessaria para transcricao. Configure em config.json.")

        # Multi-clip: processa cada clip separadamente e depois faz merge
        if instruction.merge and len(instruction.clips) > 1:
            return self._process_multi_clip(instruction, on_progress)

        # Single clip
        start_time, end_time = self._get_timecodes(instruction)

        success, message, video_path = self._download_with_timeout(
            url, on_progress, start_time, end_time,
        )

        if not success:
            raise RuntimeError(f"Processamento falhou: {message}")

        if not video_path or not os.path.exists(video_path):
            raise RuntimeError(f"Video nao encontrado apos processamento: {video_path}")

        # Subtitle pipeline: transcribe -> translate -> ASS -> embed
        subtitle_proc = SubtitleProcessor(api_key=api_key)

        transcribe_ok, srt_result = subtitle_proc.transcribe(
            video_path=video_path,
            language="en",
        )
        if not transcribe_ok:
            raise RuntimeError(f"Transcricao falhou: {srt_result}")

        translate_ok, translate_result = subtitle_proc.translate(
            srt_path=srt_result,
            target_lang="pt-BR",
        )
        if not translate_ok:
            logger.warning("Traducao falhou: %s", translate_result)
            # Non-fatal: use original SRT

        ass_ok, ass_result = subtitle_proc.generate_ass_file(srt_result)
        if ass_ok:
            embed_ok, embed_result = subtitle_proc.embed_subtitles(
                video_path=video_path,
                subtitle_path=ass_result,
            )
            if not embed_ok:
                logger.warning("Embed de legendas falhou: %s", embed_result)
        else:
            logger.warning("Geracao de ASS falhou: %s", ass_result)

        logger.info("Video com legenda concluido: %s", video_path)
        return video_path

    def _process_multi_clip(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Processa multiplos clips e faz merge com fadewhite.

        Pipeline para cada clip: Download -> Clip -> 16:9 -> Whisper -> GPT -> Embed
        Depois: Merge todos com transicao fadewhite de 1 segundo.
        """
        clips = instruction.clips
        if not clips:
            raise ValueError("Instrucao de merge sem clips definidos")

        api_key = self.config.openai.api_key
        clip_paths: list[str] = []
        total_clips = len(clips)

        for i, clip in enumerate(clips):
            clip_url = clip.url or instruction.url
            if not clip_url:
                raise ValueError(f"Clip {i+1} sem URL")

            start_time = ""
            end_time = ""
            if clip.timecode:
                start_time = self._format_timecode(clip.timecode.start)
                end_time = self._format_timecode(clip.timecode.end)

            def progress_cb(pct: float, msg: str) -> None:
                # Mapeia progresso do clip para progresso total
                base = (i / total_clips) * 0.7  # 70% para downloads
                clip_progress = (pct / 100.0) * (0.7 / total_clips)
                if on_progress:
                    on_progress(base + clip_progress)
                logger.info("[Clip %d/%d] %.0f%% - %s", i + 1, total_clips, pct, msg)

            success, message, video_path = VideoDownloaderEngine.download(
                url=clip_url,
                output_dir=self.config.paths.output_dir,
                quality=self.config.video.default_quality,
                progress_callback=progress_cb,
            )

            if not success:
                logger.error("Clip %d falhou: %s", i + 1, message)
                raise RuntimeError(f"Clip {i+1} falhou: {message}")

            if not video_path or not os.path.exists(video_path):
                raise RuntimeError(f"Clip {i+1} nao gerou arquivo: {video_path}")

            # Clip timecodes
            if start_time or end_time:
                clip_ok, clip_result = VideoDownloaderEngine.clip_video(
                    video_path=video_path,
                    start_time=start_time,
                    end_time=end_time,
                )
                if not clip_ok:
                    logger.warning("Clip %d clip falhou: %s", i + 1, clip_result)
                else:
                    video_path = clip_result

            # Adjust aspect ratio
            VideoDownloaderEngine.adjust_aspect_ratio(
                video_path=video_path,
                target_ratio="16:9",
            )

            # Subtitle pipeline for each clip
            if api_key:
                subtitle_proc = SubtitleProcessor(api_key=api_key)
                transcribe_ok, srt_result = subtitle_proc.transcribe(
                    video_path=video_path,
                    language="en",
                )
                if transcribe_ok:
                    subtitle_proc.translate(srt_path=srt_result, target_lang="pt-BR")
                    ass_ok, ass_result = subtitle_proc.generate_ass_file(srt_result)
                    if ass_ok:
                        subtitle_proc.embed_subtitles(
                            video_path=video_path,
                            subtitle_path=ass_result,
                        )

            clip_paths.append(video_path)

        # Merge clips
        if on_progress:
            on_progress(0.75)

        if len(clip_paths) < 2:
            return clip_paths[0] if clip_paths else ""

        merged_path = self._merge_clips(clip_paths, instruction, on_progress)
        return merged_path

    def _merge_clips(
        self,
        clip_paths: list[str],
        instruction: Instruction,
        on_progress: Optional[Callable],
    ) -> str:
        """Merge clips com transicao fadewhite de 1 segundo.

        Logica extraida do gui.py do Video Downloader.
        """
        num_clips = len(clip_paths)
        logger.info("Merging %d clips com fadewhite...", num_clips)

        if on_progress:
            on_progress(0.8)

        with tempfile.TemporaryDirectory() as temp_dir:
            # Copia clips para temp
            temp_clips = []
            for i, path in enumerate(clip_paths):
                temp_name = f"clip{i+1}.mp4"
                temp_path = os.path.join(temp_dir, temp_name)
                shutil.copy2(path, temp_path)
                temp_clips.append(temp_name)

            # Obtem duracoes
            durations = []
            for clip_name in temp_clips:
                dur = self._get_clip_duration(os.path.join(temp_dir, clip_name))
                durations.append(dur)

            # Verifica se todos tem audio
            all_have_audio = all(
                self._has_audio_stream(os.path.join(temp_dir, c))
                for c in temp_clips
            )

            # Constroi filter_complex
            filter_complex, map_args = self._build_merge_filter(
                num_clips, durations, all_have_audio
            )

            # Executa FFmpeg
            cmd = ["ffmpeg"]
            for clip_name in temp_clips:
                cmd.extend(["-i", clip_name])
            cmd.extend(["-filter_complex", filter_complex])
            cmd.extend(map_args)
            cmd.extend(["-c:v", "libx264", "-c:a", "aac", "-y", "merged.mp4"])

            result = subprocess.run(cmd, cwd=temp_dir, capture_output=True, text=True)
            temp_output = os.path.join(temp_dir, "merged.mp4")

            if result.returncode != 0 or not os.path.exists(temp_output):
                error = result.stderr[-300:] if result.stderr else "Unknown error"
                raise RuntimeError(f"Merge falhou: {error}")

            # Copia resultado para output dir
            video_name = instruction.news_block.replace(" ", "_")[:40] or "merged"
            merged_path = os.path.join(
                self.config.paths.output_dir, f"{video_name}_merged.mp4"
            )
            if os.path.exists(merged_path):
                os.remove(merged_path)
            shutil.copy2(temp_output, merged_path)

        # Limpa clips individuais
        for path in clip_paths:
            try:
                if os.path.exists(path) and os.path.normpath(path) != os.path.normpath(merged_path):
                    os.remove(path)
            except Exception as e:
                logger.warning("Falha ao deletar clip %s: %s", path, e)

        if on_progress:
            on_progress(1.0)

        logger.info("Merge concluido: %s", merged_path)
        return merged_path

    @staticmethod
    def _build_merge_filter(
        num_clips: int,
        durations: list[float],
        all_have_audio: bool,
    ) -> tuple[str, list[str]]:
        """Constroi filter_complex do FFmpeg para merge com fadewhite.

        Suporta 2 ou 3 clips.
        """
        td = TRANSITION_DURATION

        if num_clips == 2:
            offset1 = max(0, durations[0] - td)
            if all_have_audio:
                fc = (
                    f"[0:v][1:v]xfade=transition=fadewhite:duration={td}:offset={offset1}[v];"
                    f"[0:a][1:a]acrossfade=d={td}[a]"
                )
                maps = ["-map", "[v]", "-map", "[a]"]
            else:
                fc = f"[0:v][1:v]xfade=transition=fadewhite:duration={td}:offset={offset1}[v]"
                maps = ["-map", "[v]", "-an"]

        elif num_clips == 3:
            offset1 = max(0, durations[0] - td)
            merged_12_duration = durations[0] + durations[1] - td
            offset2 = max(0, merged_12_duration - td)

            if all_have_audio:
                fc = (
                    f"[0:v][1:v]xfade=transition=fadewhite:duration={td}:offset={offset1}[vt1];"
                    f"[vt1][2:v]xfade=transition=fadewhite:duration={td}:offset={offset2}[v];"
                    f"[0:a][1:a]acrossfade=d={td}[at1];"
                    f"[at1][2:a]acrossfade=d={td}[a]"
                )
                maps = ["-map", "[v]", "-map", "[a]"]
            else:
                fc = (
                    f"[0:v][1:v]xfade=transition=fadewhite:duration={td}:offset={offset1}[vt1];"
                    f"[vt1][2:v]xfade=transition=fadewhite:duration={td}:offset={offset2}[v]"
                )
                maps = ["-map", "[v]", "-an"]

        else:
            # Fallback para >3 clips: concat simples sem transicao
            fc = "".join(f"[{i}:v][{i}:a]" for i in range(num_clips))
            fc += f"concat=n={num_clips}:v=1:a=1[v][a]"
            maps = ["-map", "[v]", "-map", "[a]"]

        return fc, maps

    @staticmethod
    def _get_clip_duration(video_path: str) -> float:
        """Retorna duracao do video em segundos."""
        try:
            cmd = [
                "ffprobe", "-v", "quiet",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                video_path,
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0 and result.stdout.strip():
                return float(result.stdout.strip())
        except (ValueError, Exception):
            pass
        return 10.0  # fallback

    @staticmethod
    def _has_audio_stream(video_path: str) -> bool:
        """Verifica se o video tem stream de audio."""
        try:
            cmd = [
                "ffprobe", "-v", "quiet", "-select_streams", "a",
                "-show_entries", "stream=index",
                "-of", "csv=p=0",
                video_path,
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            return bool(result.stdout.strip())
        except Exception:
            return False

    @staticmethod
    def _get_timecodes(instruction: Instruction) -> tuple[str, str]:
        """Extrai start_time e end_time da instrucao no formato MM:SS."""
        start_time = ""
        end_time = ""

        tc = instruction.timecode
        if tc:
            start_time = VideoProcessor._format_timecode(tc.start)
            end_time = VideoProcessor._format_timecode(tc.end)
        elif instruction.clips:
            first_clip = instruction.clips[0]
            if first_clip.timecode:
                start_time = VideoProcessor._format_timecode(first_clip.timecode.start)
                end_time = VideoProcessor._format_timecode(first_clip.timecode.end)

        return start_time, end_time

    @staticmethod
    def _format_timecode(tc: str) -> str:
        """Converte timecode MMSS para formato MM:SS aceito pelo downloader.

        Ex: "0034" -> "00:34", "0130" -> "01:30", "3840" -> "38:40"
        """
        tc = tc.strip()
        if ":" in tc:
            return tc  # Ja esta formatado

        # Formato MMSS
        if len(tc) == 4 and tc.isdigit():
            return f"{tc[:2]}:{tc[2:]}"
        elif len(tc) == 3 and tc.isdigit():
            return f"0{tc[0]}:{tc[1:]}"
        elif len(tc) == 2 and tc.isdigit():
            return f"00:{tc}"

        return tc
