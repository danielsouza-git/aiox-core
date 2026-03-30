"""Subtitle processing: Whisper transcription, GPT translation, and FFmpeg embedding.

Provides SubtitleProcessor for the full subtitle pipeline:
1. Transcribe video audio via OpenAI Whisper API
2. Translate SRT subtitles via GPT
3. Generate ASS styled subtitles from SRT
4. Embed (burn) subtitles into video via FFmpeg

Extracted and internalized from the external Video Downloader application at:
D:/EPOCH/ET_IA_e_Automacoes/epochnews_apps/videos/video_downloader/downloader.py

All logic preserved with improvements:
- API key passed as parameter (never hardcoded)
- Progress callback interface for UI integration
- Proper temp file cleanup
- Structured error handling
"""

import logging
import os
import shutil
import subprocess
import tempfile
from typing import Callable, Optional

from src.processors.video_downloader.srt_utils import (
    SubtitleEntry,
    SubtitleStyle,
    generate_ass,
    write_srt,
)

logger = logging.getLogger(__name__)


class SubtitleProcessor:
    """Processes subtitles: transcription, translation, ASS generation, embedding.

    Args:
        api_key: OpenAI API key for Whisper and GPT calls.
        whisper_model: Whisper model identifier (default: "whisper-1").
        translation_model: GPT model for translation (default: "gpt-4.1-mini").
    """

    def __init__(
        self,
        api_key: str,
        whisper_model: str = "whisper-1",
        translation_model: str = "gpt-4.1-mini",
    ) -> None:
        if not api_key:
            raise ValueError("OpenAI API key must be provided")
        self.api_key = api_key
        self.whisper_model = whisper_model
        self.translation_model = translation_model

    # ------------------------------------------------------------------
    # Transcribe
    # ------------------------------------------------------------------

    def transcribe(
        self,
        video_path: str,
        language: str = "en",
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> tuple[bool, str]:
        """Transcribe video audio using OpenAI Whisper API.

        Extracts audio from video, sends to Whisper API, and generates
        an SRT file from the transcription segments.

        Args:
            video_path: Path to the video file.
            language: Language code for transcription (e.g., "en", "pt").
            progress_callback: Called with (percentage, status_text).

        Returns:
            Tuple of (success, srt_path_or_error_message).
        """
        if not os.path.exists(video_path):
            return False, f"Video file not found: {video_path}"

        # Lazy import to avoid requiring openai at module level
        from openai import OpenAI

        client = OpenAI(api_key=self.api_key)

        with tempfile.TemporaryDirectory() as temp_dir:
            # Step 1: Extract audio
            if progress_callback:
                progress_callback(0.10, "Extracting audio from video...")

            audio_path = self._extract_audio(video_path, temp_dir)
            if audio_path is None:
                return False, "Failed to extract audio from video"

            if progress_callback:
                progress_callback(0.25, "Audio extracted. Checking file size...")

            # Step 2: Check 25MB limit and compress if needed
            audio_path = self._ensure_size_limit(audio_path, temp_dir)
            if audio_path is None:
                return False, "Failed to compress audio within 25MB limit"

            if progress_callback:
                progress_callback(0.50, "Calling Whisper API...")

            # Step 3: Call Whisper API
            try:
                with open(audio_path, "rb") as audio_file:
                    filename = os.path.basename(audio_path)
                    response = client.audio.transcriptions.create(
                        model=self.whisper_model,
                        file=(filename, audio_file.read()),
                        language=language,
                        response_format="verbose_json",
                        timestamp_granularities=["segment"],
                    )
            except Exception as e:
                logger.error("Whisper API error: %s", e)
                return False, f"Whisper API error: {e}"

            if progress_callback:
                progress_callback(0.75, "Generating SRT file...")

            # Step 4: Generate SRT from response
            srt_path = os.path.splitext(video_path)[0] + ".srt"

            # Access segments from the response
            segments = getattr(response, "segments", None)
            full_text = getattr(response, "text", "")

            if segments and len(segments) > 0:
                entries = []
                for i, seg in enumerate(segments, start=1):
                    start = seg.get("start", 0) if isinstance(seg, dict) else getattr(seg, "start", 0)
                    end = seg.get("end", 0) if isinstance(seg, dict) else getattr(seg, "end", 0)
                    text = seg.get("text", "").strip() if isinstance(seg, dict) else getattr(seg, "text", "").strip()
                    if text:
                        entries.append(SubtitleEntry(
                            index=i,
                            start_seconds=float(start),
                            end_seconds=float(end),
                            text=text,
                        ))

                if entries:
                    write_srt(entries, srt_path)
                else:
                    # Segments exist but no text -- fallback
                    self._write_fallback_srt(full_text, srt_path)
            elif full_text:
                # No segments -- create simple SRT from full text
                self._write_fallback_srt(full_text, srt_path)
            else:
                return False, "Whisper returned empty transcription"

        if progress_callback:
            progress_callback(1.0, "Transcription complete")

        return True, srt_path

    # ------------------------------------------------------------------
    # Translate
    # ------------------------------------------------------------------

    def translate(
        self,
        srt_path: str,
        target_lang: str = "pt-BR",
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> tuple[bool, str]:
        """Translate SRT subtitles using GPT.

        Args:
            srt_path: Path to the SRT file to translate.
            target_lang: Target language code (default: "pt-BR").
            progress_callback: Called with (percentage, status_text).

        Returns:
            Tuple of (success, translated_srt_path_or_error_message).
        """
        if not os.path.exists(srt_path):
            return False, f"SRT file not found: {srt_path}"

        if progress_callback:
            progress_callback(0.10, "Reading SRT content...")

        with open(srt_path, "r", encoding="utf-8") as f:
            srt_content = f.read()

        if not srt_content.strip():
            return False, "SRT file is empty"

        # Lazy import
        from openai import OpenAI

        client = OpenAI(api_key=self.api_key)

        system_prompt = (
            f"You are a professional subtitle translator. "
            f"Translate the following SRT subtitles to {target_lang}. "
            f"Keep exact SRT format, only translate text content. "
            f"Return ONLY the translated SRT content."
        )

        if progress_callback:
            progress_callback(0.30, f"Translating to {target_lang} via GPT...")

        try:
            response = client.chat.completions.create(
                model=self.translation_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": srt_content},
                ],
                temperature=0.3,
            )
        except Exception as e:
            logger.error("GPT translation error: %s", e)
            return False, f"Translation API error: {e}"

        translated_content = response.choices[0].message.content
        if not translated_content or not translated_content.strip():
            return False, "Translation returned empty content"

        if progress_callback:
            progress_callback(0.80, "Saving translated SRT...")

        # Save translated version with language suffix
        base = os.path.splitext(srt_path)[0]
        lang_suffix = target_lang.replace("-", "_").lower()
        translated_path = f"{base}_{lang_suffix}.srt"

        with open(translated_path, "w", encoding="utf-8") as f:
            f.write(translated_content)

        # Also overwrite the original SRT with the translation
        with open(srt_path, "w", encoding="utf-8") as f:
            f.write(translated_content)

        if progress_callback:
            progress_callback(1.0, "Translation complete")

        return True, srt_path

    # ------------------------------------------------------------------
    # Generate ASS
    # ------------------------------------------------------------------

    def generate_ass_file(
        self,
        srt_path: str,
        style: SubtitleStyle | None = None,
    ) -> tuple[bool, str]:
        """Generate an ASS subtitle file from SRT with styling.

        Args:
            srt_path: Path to the source SRT file.
            style: Optional SubtitleStyle configuration.

        Returns:
            Tuple of (success, ass_path_or_error_message).
        """
        try:
            ass_path = generate_ass(srt_path, style)
            return True, ass_path
        except Exception as e:
            logger.error("ASS generation error: %s", e)
            return False, f"ASS generation error: {e}"

    # ------------------------------------------------------------------
    # Embed subtitles
    # ------------------------------------------------------------------

    def embed_subtitles(
        self,
        video_path: str,
        subtitle_path: str,
        output_path: str | None = None,
        progress_callback: Optional[Callable[[float, str], None]] = None,
        audio_boost: float | None = None,
    ) -> tuple[bool, str]:
        """Burn subtitles into video using FFmpeg.

        Uses a temporary directory for Windows path safety during
        FFmpeg operations.

        Args:
            video_path: Path to the video file.
            subtitle_path: Path to the subtitle file (.srt or .ass).
            output_path: Optional output path. If None, replaces original.
            progress_callback: Called with (percentage, status_text).
            audio_boost: Audio volume multiplier (e.g. 1.5 for 150%). None = no change.

        Returns:
            Tuple of (success, output_path_or_error_message).
        """
        if not os.path.exists(video_path):
            return False, f"Video file not found: {video_path}"
        if not os.path.exists(subtitle_path):
            return False, f"Subtitle file not found: {subtitle_path}"

        if progress_callback:
            progress_callback(0.10, "Preparing to embed subtitles...")

        # Determine final output location
        if output_path is None:
            output_path = video_path

        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                # Copy files to temp dir for path safety
                temp_video = os.path.join(temp_dir, "input.mp4")
                temp_subs = os.path.join(
                    temp_dir,
                    "subs" + os.path.splitext(subtitle_path)[1],
                )
                temp_output = os.path.join(temp_dir, "output.mp4")

                shutil.copy2(video_path, temp_video)
                shutil.copy2(subtitle_path, temp_subs)

                # Build FFmpeg command
                ext = os.path.splitext(subtitle_path)[1].lower()
                sub_filename = os.path.basename(temp_subs)

                if ext == ".ass":
                    vf_filter = f"ass={sub_filename}"
                else:
                    vf_filter = f"subtitles={sub_filename}"

                cmd = [
                    "ffmpeg",
                    "-i", "input.mp4",
                    "-vf", vf_filter,
                    "-c:v", "libx264",
                ]

                # Apply audio volume boost if specified
                if audio_boost is not None and audio_boost != 1.0:
                    cmd.extend(["-af", f"volume={audio_boost}", "-c:a", "aac"])
                else:
                    cmd.extend(["-c:a", "copy"])

                cmd.extend(["-y", "output.mp4"])

                if progress_callback:
                    progress_callback(0.30, "Burning subtitles into video...")

                result = subprocess.run(
                    cmd,
                    cwd=temp_dir,
                    capture_output=True,
                    text=True,
                )

                if result.returncode != 0:
                    error_msg = result.stderr[:300] if result.stderr else "Unknown FFmpeg error"
                    return False, f"FFmpeg embed error: {error_msg}"

                if not os.path.exists(temp_output):
                    return False, "FFmpeg did not produce output file"

                # Copy result to final output
                if os.path.exists(output_path) and output_path != video_path:
                    os.remove(output_path)

                shutil.copy2(temp_output, output_path)

        except Exception as e:
            logger.error("Embed subtitles error: %s", e)
            return False, f"Error embedding subtitles: {e}"

        if progress_callback:
            progress_callback(1.0, "Subtitles embedded successfully")

        return True, output_path

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _extract_audio(self, video_path: str, temp_dir: str) -> str | None:
        """Extract audio from video as MP3, falling back to WAV.

        Args:
            video_path: Path to the video file.
            temp_dir: Temporary directory for audio files.

        Returns:
            Path to the extracted audio file, or None on failure.
        """
        mp3_path = os.path.join(temp_dir, "audio.mp3")

        # Try MP3 first
        cmd_mp3 = [
            "ffmpeg",
            "-i", video_path,
            "-vn",
            "-acodec", "libmp3lame",
            "-ab", "128k",
            "-y", mp3_path,
        ]

        result = subprocess.run(cmd_mp3, capture_output=True, text=True)
        if result.returncode == 0 and os.path.exists(mp3_path):
            return mp3_path

        logger.warning("MP3 extraction failed, falling back to WAV")

        # Fallback to WAV
        wav_path = os.path.join(temp_dir, "audio.wav")
        cmd_wav = [
            "ffmpeg",
            "-i", video_path,
            "-vn",
            "-acodec", "pcm_s16le",
            "-ar", "16000",
            "-ac", "1",
            "-y", wav_path,
        ]

        result = subprocess.run(cmd_wav, capture_output=True, text=True)
        if result.returncode == 0 and os.path.exists(wav_path):
            return wav_path

        logger.error("Both MP3 and WAV extraction failed")
        return None

    def _ensure_size_limit(
        self, audio_path: str, temp_dir: str, max_bytes: int = 25 * 1024 * 1024
    ) -> str | None:
        """Compress audio if it exceeds the Whisper API 25MB limit.

        Args:
            audio_path: Path to the audio file.
            temp_dir: Temporary directory for compressed file.
            max_bytes: Maximum file size in bytes.

        Returns:
            Path to the (possibly compressed) audio file, or None on failure.
        """
        if os.path.getsize(audio_path) <= max_bytes:
            return audio_path

        logger.info("Audio exceeds 25MB, compressing...")
        compressed_path = os.path.join(temp_dir, "audio_compressed.mp3")

        cmd = [
            "ffmpeg",
            "-i", audio_path,
            "-ab", "64k",
            "-ar", "16000",
            "-ac", "1",
            "-y", compressed_path,
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0 and os.path.exists(compressed_path):
            if os.path.getsize(compressed_path) <= max_bytes:
                return compressed_path
            logger.error("Compressed audio still exceeds 25MB")
            return None

        logger.error("Audio compression failed")
        return None

    @staticmethod
    def _write_fallback_srt(full_text: str, srt_path: str) -> None:
        """Create a simple SRT from full text when no segments available.

        Splits text into chunks of ~10 words, 4 seconds each.

        Args:
            full_text: Full transcription text.
            srt_path: Output SRT path.
        """
        words = full_text.strip().split()
        if not words:
            return

        entries: list[SubtitleEntry] = []
        chunk_size = 10
        duration_per_chunk = 4.0

        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i : i + chunk_size])
            idx = len(entries) + 1
            start = (idx - 1) * duration_per_chunk
            end = start + duration_per_chunk
            entries.append(
                SubtitleEntry(
                    index=idx,
                    start_seconds=start,
                    end_seconds=end,
                    text=chunk,
                )
            )

        write_srt(entries, srt_path)
