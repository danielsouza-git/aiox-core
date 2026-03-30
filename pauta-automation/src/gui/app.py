"""Bridge Python-JS para pywebview — Pauta Automation."""

from __future__ import annotations

import json
import logging
import os
import sys
import threading
from pathlib import Path
from typing import Any, Optional

import webview

from src.core.config import (
    AppConfig, GoogleConfig, OpenAIConfig, PathsConfig, VideoConfig,
    load_config, save_config,
)
from src.core.events import EventBus, EventType, ProcessingEvent
from src.core.models import PautaResult

logger = logging.getLogger(__name__)


class PautaBridge:
    """Expoe metodos Python ao JavaScript via pywebview js_api."""

    def __init__(self, root_dir: Path) -> None:
        self._root_dir = root_dir
        self._event_bus = EventBus()
        self._config: Optional[AppConfig] = None
        self._orchestrator = None
        self._pauta_result: Optional[PautaResult] = None
        self._window: Optional[webview.Window] = None
        self._selected_tarja_type = None  # Set by GUI via set_tarja_type()
        self._output_paths: dict[str, dict[str, str]] = {}  # instruction_id -> {video, srt}

    def set_window(self, window: webview.Window) -> None:
        self._window = window

    @property
    def config(self) -> AppConfig:
        if self._config is None:
            try:
                self._config = load_config()
            except FileNotFoundError:
                self._config = AppConfig(
                    google=GoogleConfig(
                        credentials_path="config/credentials.json",
                        token_path="config/token.json",
                        slides_template_id="",
                    ),
                    openai=OpenAIConfig(api_key=""),
                    paths=PathsConfig(
                        output_dir="",
                        font_tarja_bold="",
                        font_tarja_regular="",
                        font_tarja_semibold="",
                        tarja_template_epoch="",
                        tarja_template_cobertura="",
                        tarja_template_superchats="",
                    ),
                    video=VideoConfig(
                        default_quality="1080p",
                        whisper_model="whisper-1",
                        translation_model="gpt-4.1-mini",
                    ),
                )
        return self._config

    # ── Parsing ──

    def parse_url(self, url: str) -> dict[str, Any]:
        """Parseia uma pauta a partir da URL do Google Docs."""
        try:
            from src.google_api.auth import build_docs_service
            from src.google_api.docs_client import DocsClient
            from src.parser.pauta_parser import PautaParser

            creds = self.config.google.credentials_path
            token = self.config.google.token_path
            service = build_docs_service(creds, token)
            docs_client = DocsClient(service)
            parser = PautaParser(docs_client=docs_client)
            result = parser.parse(url)
            return self._serialize_result(result)
        except Exception as e:
            logger.error("Erro ao parsear URL: %s", e)
            return {"status": "error", "message": str(e)}

    def parse_text(self, text: str) -> dict[str, Any]:
        """Parseia uma pauta a partir de texto colado."""
        try:
            from src.parser.pauta_parser import PautaParser

            parser = PautaParser(docs_client=None)
            result = parser.parse_from_text(text)
            return self._serialize_result(result)
        except Exception as e:
            logger.error("Erro ao parsear texto: %s", e)
            return {"status": "error", "message": str(e)}

    def _serialize_result(self, result: PautaResult) -> dict[str, Any]:
        """Converte PautaResult para dict serializavel."""
        self._pauta_result = result
        items = []
        for instr in result.instructions:
            item: dict[str, Any] = {
                "id": instr.id,
                "type": instr.type.value,
                "news_block": instr.news_block,
                "order": instr.order,
                "enabled": instr.enabled,
                "description": "",
                "url": instr.url,
                "tarja_title": instr.tarja_title,
                "tarja_subtitle": instr.tarja_subtitle,
            }
            if instr.timecode:
                item["timecode"] = f"{instr.timecode.start}-{instr.timecode.end}"
                item["timecode_start"] = instr.timecode.start
                item["timecode_end"] = instr.timecode.end
            if instr.clips:
                item["clips"] = [
                    {
                        "url": c.url,
                        "start": c.timecode.start if c.timecode else "",
                        "end": c.timecode.end if c.timecode else "",
                    }
                    for c in instr.clips
                ]
            item["merge"] = instr.merge
            if instr.tarja_type:
                item["tarja_type"] = instr.tarja_type.value
            if instr.tarja_title:
                item["description"] = instr.tarja_title
            elif instr.url:
                item["description"] = instr.url
            items.append(item)
        return {"status": "ok", "items": items}

    # ── Processing ──

    def start_processing(self, instruction_ids: list[str]) -> dict[str, Any]:
        """Inicia processamento dos itens selecionados em thread separada."""
        if self._pauta_result is None:
            return {"status": "error", "message": "Nenhuma pauta parseada."}

        try:
            from src.core.orchestrator import Orchestrator

            # Marca enabled conforme selecao
            id_set = set(instruction_ids)
            for instr in self._pauta_result.instructions:
                instr.enabled = instr.id in id_set

            self._orchestrator = Orchestrator(self.config, self._event_bus)
            enabled = [i for i in self._pauta_result.instructions if i.enabled]

            thread = threading.Thread(
                target=self._orchestrator.process_all,
                args=(enabled,),
                daemon=True,
            )
            thread.start()
            return {"status": "ok"}
        except Exception as e:
            logger.error("Erro ao iniciar processamento: %s", e)
            return {"status": "error", "message": str(e)}

    def poll_events(self) -> list[dict[str, Any]]:
        """Retorna eventos pendentes do EventBus."""
        events = self._event_bus.poll()
        return [
            {
                "type": evt.type.value,
                "instruction_id": evt.instruction_id,
                "message": evt.message,
                "progress": evt.progress,
                "output_path": evt.output_path,
            }
            for evt in events
        ]

    def cancel_processing(self) -> dict[str, Any]:
        """Cancela processamento em andamento."""
        if self._orchestrator:
            self._orchestrator.cancel()
        return {"status": "ok"}

    def retry_item(self, instruction_id: str) -> dict[str, Any]:
        """Reprocessa um item individual."""
        if not self._orchestrator or not self._pauta_result:
            return {"status": "error", "message": "Orchestrator nao inicializado."}

        instr = next(
            (i for i in self._pauta_result.instructions if i.id == instruction_id),
            None,
        )
        if not instr:
            return {"status": "error", "message": "Instrucao nao encontrada."}

        thread = threading.Thread(
            target=self._orchestrator.process_single,
            args=(instr,),
            daemon=True,
        )
        thread.start()
        return {"status": "ok"}

    # ── Tarja type selection ──

    def set_tarja_type(self, tipo: str) -> dict[str, Any]:
        """Armazena o tipo de tarja selecionado globalmente pelo usuario na GUI.

        Args:
            tipo: Valor do tipo selecionado ("giro", "cobertura", "mira", "superchats").

        Returns:
            Status dict.
        """
        from src.core.models import TarjaType

        try:
            tarja_type = TarjaType(tipo)
        except ValueError:
            return {"status": "error", "message": f"Tipo invalido: {tipo}"}

        self._selected_tarja_type = tarja_type
        logger.info("Tipo de tarja selecionado pelo usuario: %s", tarja_type.value)

        # Atualiza todas as tarjas parseadas com o tipo selecionado
        if self._pauta_result:
            from src.core.models import InstructionType
            for instr in self._pauta_result.instructions:
                if instr.type == InstructionType.TARJA:
                    instr.tarja_type = tarja_type

        return {"status": "ok", "tarja_type": tarja_type.value}

    # ── Update instruction ──

    def update_instruction(self, instruction_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        """Atualiza campos de uma instrucao (ex: tarja_title, tarja_subtitle, tarja_type)."""
        if not self._pauta_result:
            return {"status": "error", "message": "Nenhuma pauta parseada."}

        instr = next(
            (i for i in self._pauta_result.instructions if i.id == instruction_id),
            None,
        )
        if not instr:
            return {"status": "error", "message": "Instrucao nao encontrada."}

        if "tarja_title" in updates:
            instr.tarja_title = updates["tarja_title"]
        if "tarja_subtitle" in updates:
            instr.tarja_subtitle = updates["tarja_subtitle"]
        if "tarja_type" in updates:
            from src.core.models import TarjaType
            try:
                instr.tarja_type = TarjaType(updates["tarja_type"])
            except ValueError:
                pass

        return {"status": "ok"}

    # ── Settings ──

    def get_config(self) -> dict[str, Any]:
        """Retorna configuracao atual como dict."""
        cfg = self.config
        return {
            "google": {
                "api_key": cfg.google.api_key,
                "credentials_path": cfg.google.credentials_path,
                "token_path": cfg.google.token_path,
                "slides_template_id": cfg.google.slides_template_id,
            },
            "openai": {"api_key": cfg.openai.api_key},
            "paths": {
                "output_dir": cfg.paths.output_dir,
                "font_tarja_bold": cfg.paths.font_tarja_bold,
                "font_tarja_regular": cfg.paths.font_tarja_regular,
                "font_tarja_semibold": cfg.paths.font_tarja_semibold,
                "tarja_template_epoch": cfg.paths.tarja_template_epoch,
                "tarja_template_cobertura": cfg.paths.tarja_template_cobertura,
                "tarja_template_superchats": cfg.paths.tarja_template_superchats,
            },
            "video": {
                "default_quality": cfg.video.default_quality,
                "whisper_model": cfg.video.whisper_model,
                "translation_model": cfg.video.translation_model,
            },
        }

    def save_config(self, config_dict: dict[str, Any]) -> dict[str, Any]:
        """Salva configuracao a partir do dict recebido do JS."""
        try:
            g = config_dict.get("google", {})
            o = config_dict.get("openai", {})
            p = config_dict.get("paths", {})
            v = config_dict.get("video", {})

            self._config = AppConfig(
                google=GoogleConfig(
                    credentials_path=g.get("credentials_path", "config/credentials.json"),
                    token_path=g.get("token_path", "config/token.json"),
                    slides_template_id=g.get("slides_template_id", ""),
                    api_key=g.get("api_key", ""),
                ),
                openai=OpenAIConfig(api_key=o.get("api_key", "")),
                paths=PathsConfig(
                    output_dir=p.get("output_dir", ""),
                    font_tarja_bold=p.get("font_tarja_bold", ""),
                    font_tarja_regular=p.get("font_tarja_regular", ""),
                    font_tarja_semibold=p.get("font_tarja_semibold", ""),
                    tarja_template_epoch=p.get("tarja_template_epoch", ""),
                    tarja_template_cobertura=p.get("tarja_template_cobertura", ""),
                    tarja_template_superchats=p.get("tarja_template_superchats", ""),
                ),
                video=VideoConfig(
                    default_quality=v.get("default_quality", "1080p"),
                    whisper_model=v.get("whisper_model", "whisper-1"),
                    translation_model=v.get("translation_model", "gpt-4.1-mini"),
                ),
            )
            save_config(self._config)
            return {"status": "ok", "message": "Configuracoes salvas."}
        except Exception as e:
            logger.error("Erro ao salvar config: %s", e)
            return {"status": "error", "message": str(e)}

    # ── File dialogs ──

    def browse_file(self, file_types: str = "") -> Optional[str]:
        """Abre dialogo de selecao de arquivo."""
        if not self._window:
            return None
        result = self._window.create_file_dialog(
            webview.OPEN_DIALOG,
            file_types=(file_types,) if file_types else (),
        )
        if result and len(result) > 0:
            return str(result[0])
        return None

    def browse_directory(self) -> Optional[str]:
        """Abre dialogo de selecao de diretorio."""
        if not self._window:
            return None
        result = self._window.create_file_dialog(webview.FOLDER_DIALOG)
        if result and len(result) > 0:
            return str(result[0])
        return None

    # ── Video Downloader Standalone ──

    def download_video(self, params: dict[str, Any]) -> dict[str, Any]:
        """Inicia download standalone de video em thread separada.

        Args:
            params: Dict com url, quality, clips (list), merge (bool), video_only (bool),
                    custom_name, instruction_id (optional for pauta integration).

        Returns:
            Status dict.
        """
        if not hasattr(self, "_download_history"):
            self._download_history: list[dict[str, Any]] = []

        try:
            from datetime import datetime, timezone
            from src.processors.video_downloader.engine import VideoDownloaderEngine

            url = params.get("url", "")
            quality = params.get("quality", "1080p")
            clips = params.get("clips", [])
            merge = params.get("merge", False)
            video_only = params.get("video_only", False)
            custom_name = params.get("custom_name") or "video_download"
            instruction_id = params.get("instruction_id")

            if not url:
                return {"status": "error", "message": "URL vazia."}

            # Detect local file path BEFORE spawning worker thread.
            # Windows paths (D:\..., C:/..., \\server\...) must NOT be sent to yt-dlp.
            # Check drive letter pattern (e.g. "D:\..." or "D:/...") without regex,
            # since the pywebview bridge may alter backslashes during JSON serialization.
            is_local_file = False
            if len(url) >= 3 and url[0].isalpha() and url[1] == ':' and url[2] in ('\\', '/'):
                is_local_file = True
            elif url.startswith('\\\\') or url.startswith('//'):
                # UNC path (\\server\share or //server/share)
                is_local_file = True
            elif os.path.isabs(url) and os.path.exists(url):
                # Fallback: any absolute path that actually exists on disk
                is_local_file = True
            logger.info(
                "download_video url=%r is_local_file=%s", url, is_local_file,
            )

            # Determine output path
            output_dir = self.config.paths.output_dir or str(self._root_dir / "output")
            output_path = Path(output_dir)
            output_path.mkdir(parents=True, exist_ok=True)

            # Add to history (in-progress)
            history_entry = {
                "filename": custom_name,
                "status": "in_progress",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            self._download_history.append(history_entry)
            if len(self._download_history) > 10:
                self._download_history = self._download_history[-10:]

            # Resolve event ID for EventBus
            event_id = instruction_id or "standalone_download"

            # Define worker function
            def worker() -> None:
                try:
                    # Progress callback
                    def on_progress(pct: float, msg: str) -> None:
                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id=event_id,
                            message=msg,
                            progress=pct,
                        ))

                    # Download (ou usar arquivo local)
                    if is_local_file:
                        # Arquivo local selecionado — copiar para output_dir
                        # (identico ao original: cria working copy, nunca altera o original)
                        import shutil

                        if not os.path.exists(url):
                            raise RuntimeError(
                                f"Arquivo local nao encontrado: {url}"
                            )
                        logger.info("Arquivo local detectado: %s", url)
                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id=event_id,
                            message="Copiando arquivo local...",
                            progress=0.05,
                        ))

                        # Criar copia de trabalho no output_dir
                        base_name = Path(url).stem
                        work_name = custom_name if custom_name else base_name
                        work_path = output_path / f"{work_name}_work.mp4"
                        shutil.copy2(url, str(work_path))
                        downloaded_path = str(work_path)
                        logger.info("Copia de trabalho criada: %s", downloaded_path)

                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id=event_id,
                            message="Arquivo local copiado.",
                            progress=0.1,
                        ))
                    else:
                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id=event_id,
                            message="Baixando video...",
                            progress=0.0,
                        ))

                        dl_success, dl_message, downloaded_path = VideoDownloaderEngine.download(
                            url=url,
                            quality=quality,
                            output_dir=str(output_path),
                            filename=custom_name,
                            progress_callback=on_progress,
                        )
                        if not dl_success:
                            raise RuntimeError(f"Download falhou: {dl_message}")
                        if not downloaded_path or not os.path.exists(downloaded_path):
                            raise RuntimeError(f"Video nao encontrado apos download: {downloaded_path}")

                    # Clip if needed
                    if clips:
                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id=event_id,
                            message="Processando clips...",
                            progress=0.5,
                        ))

                        clipped_paths = []
                        for i, clip in enumerate(clips):
                            clip_ok, clip_result = VideoDownloaderEngine.clip_video(
                                video_path=downloaded_path,
                                start_time=clip["start"],
                                end_time=clip["end"],
                            )
                            if not clip_ok:
                                raise RuntimeError(f"Clip {i+1} falhou: {clip_result}")
                            clipped = clip_result

                            # Adjust aspect ratio to 16:9 (same as original)
                            ar_ok, ar_result = VideoDownloaderEngine.adjust_aspect_ratio(
                                video_path=clipped,
                            )
                            if ar_ok:
                                clipped = ar_result

                            # Repeat if needed
                            if clip.get("repeat", 1) > 1:
                                repeat_ok, repeat_result = VideoDownloaderEngine.repeat_clip(
                                    video_path=clipped,
                                    count=clip["repeat"],
                                )
                                if not repeat_ok:
                                    raise RuntimeError(f"Repeat clip {i+1} falhou: {repeat_result}")
                                clipped = repeat_result

                            clipped_paths.append(clipped)

                        # Merge if needed
                        if merge and len(clipped_paths) > 1:
                            self._event_bus.emit(ProcessingEvent(
                                type=EventType.PROGRESS,
                                instruction_id=event_id,
                                message="Mesclando clips...",
                                progress=0.8,
                            ))

                            final_output = output_path / f"{custom_name}_merged.mp4"
                            merge_ok, merge_result = VideoDownloaderEngine.merge_clips(
                                clip_paths=clipped_paths,
                                output_path=str(final_output),
                            )
                            if not merge_ok:
                                raise RuntimeError(f"Merge falhou: {merge_result}")
                            final_path = merge_result
                        else:
                            final_path = clipped_paths[0] if clipped_paths else downloaded_path
                    else:
                        # No clips — adjust aspect ratio on full video
                        ar_ok, ar_result = VideoDownloaderEngine.adjust_aspect_ratio(
                            video_path=downloaded_path,
                        )
                        if ar_ok:
                            downloaded_path = ar_result
                        final_path = downloaded_path

                    # Transcription/subtitle (if not video_only)
                    srt_result_path = None
                    if not video_only:
                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id=event_id,
                            message="Transcrevendo audio...",
                            progress=0.9,
                        ))

                        from src.processors.video_downloader.subtitle_processor import SubtitleProcessor

                        api_key = self.config.openai.api_key
                        if not api_key:
                            logger.warning("OpenAI API key nao configurada, pulando transcricao.")
                        else:
                            processor = SubtitleProcessor(api_key=api_key)

                            transcribe_ok, srt_result = processor.transcribe(
                                video_path=final_path,
                                language="en",
                            )

                            if transcribe_ok:
                                srt_result_path = srt_result
                                # Translate
                                translate_ok, translated_result = processor.translate(
                                    srt_path=srt_result_path,
                                    target_lang="pt-BR",
                                )
                                if not translate_ok:
                                    logger.warning("Traducao falhou: %s", translated_result)
                            else:
                                srt_result_path = None
                                logger.warning("Transcricao falhou: %s", srt_result)

                    # Rename _work file to final name BEFORE opening editor
                    base_name = Path(url if is_local_file else final_path).stem
                    final_name = custom_name if custom_name else base_name
                    # Remove _work suffix if present
                    if final_path.endswith("_work.mp4"):
                        renamed_path = str(output_path / f"{final_name}.mp4")
                        os.rename(final_path, renamed_path)
                        final_path = renamed_path
                        logger.info("Renomeado para: %s", final_path)

                    # Open subtitle editor after transcription (Story 6.7)
                    # instead of auto-embedding. User edits then triggers embed via Save.
                    if srt_result_path and not video_only:
                        self._editor_srt_path = srt_result_path
                        self._editor_video_path = final_path
                        self.open_subtitle_editor(srt_result_path, final_path)

                    # Update history entry
                    history_entry["status"] = "completed"
                    history_entry["filename"] = Path(final_path).name

                    # Track output paths for pauta integration (Story 6.5)
                    if instruction_id:
                        tracked: dict[str, str] = {"video": final_path}
                        if srt_result_path:
                            tracked["srt"] = srt_result_path
                        self._output_paths[instruction_id] = tracked

                    # Emit completion
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.COMPLETED,
                        instruction_id=event_id,
                        message=f"Concluido: {Path(final_path).name}",
                        output_path=final_path,
                    ))

                except Exception as e:
                    logger.error("Erro no download standalone: %s", e)
                    history_entry["status"] = "error"
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.ERROR,
                        instruction_id=event_id,
                        message=str(e),
                    ))

            # Start worker thread
            thread = threading.Thread(target=worker, daemon=True)
            thread.start()

            return {"status": "ok"}

        except Exception as e:
            logger.error("Erro ao iniciar download: %s", e)
            return {"status": "error", "message": str(e)}

    def get_download_history(self) -> list[dict[str, Any]]:
        """Retorna historico de downloads (ultimos 10, in-memory).

        Returns:
            Lista de dicts com filename, status, timestamp.
        """
        if not hasattr(self, "_download_history"):
            self._download_history = []

        return self._download_history

    # ── Instruction Details (Story 6.5) ──

    def get_instruction_details(self, instruction_id: str) -> dict[str, Any]:
        """Retorna dados completos de uma instrucao para pre-fill no downloader.

        Args:
            instruction_id: ID da instrucao.

        Returns:
            Dict com status e dados da instrucao.
        """
        if not self._pauta_result:
            return {"status": "error", "message": "Nenhuma pauta parseada."}

        instr = next(
            (i for i in self._pauta_result.instructions if i.id == instruction_id),
            None,
        )
        if not instr:
            return {"status": "error", "message": "Instrucao nao encontrada."}

        result: dict[str, Any] = {
            "status": "ok",
            "id": instr.id,
            "type": instr.type.value,
            "url": instr.url,
            "merge": instr.merge,
            "enabled": instr.enabled,
            "processing_status": instr.status.value,
            "output_path": instr.output_path,
        }
        if instr.timecode:
            result["timecode"] = {
                "start": instr.timecode.start,
                "end": instr.timecode.end,
            }
        if instr.clips:
            result["clips"] = [
                {
                    "url": c.url,
                    "start": c.timecode.start if c.timecode else "",
                    "end": c.timecode.end if c.timecode else "",
                }
                for c in instr.clips
            ]
        return result

    def update_instruction_status(
        self, instruction_id: str, status: str, output_path: Optional[str] = None
    ) -> dict[str, Any]:
        """Atualiza status de uma instrucao apos download via standalone form.

        Args:
            instruction_id: ID da instrucao.
            status: Novo status ("completed" ou "error").
            output_path: Caminho do arquivo de saida (opcional).

        Returns:
            Status dict.
        """
        if not self._pauta_result:
            return {"status": "error", "message": "Nenhuma pauta parseada."}

        from src.core.models import ProcessingStatus

        instr = next(
            (i for i in self._pauta_result.instructions if i.id == instruction_id),
            None,
        )
        if not instr:
            return {"status": "error", "message": "Instrucao nao encontrada."}

        try:
            instr.status = ProcessingStatus(status)
        except ValueError:
            return {"status": "error", "message": f"Status invalido: {status}"}

        if output_path:
            instr.output_path = output_path

        return {"status": "ok"}

    def get_output_paths(self, instruction_id: str) -> dict[str, Any]:
        """Retorna paths de saida rastreados para uma instrucao.

        Args:
            instruction_id: ID da instrucao.

        Returns:
            Dict com status e paths (video, srt).
        """
        paths = self._output_paths.get(instruction_id)
        if not paths:
            return {"status": "error", "message": "Nenhum path rastreado."}
        return {"status": "ok", **paths}

    # ── Subtitle Editor ──

    def load_srt(self, srt_path: str) -> dict[str, Any]:
        """Carrega conteudo de arquivo SRT e retorna como lista de entries.

        Args:
            srt_path: Caminho para o arquivo SRT.

        Returns:
            Dict com status e entries (lista de dicts).
        """
        try:
            from src.processors.video_downloader.srt_utils import parse_srt

            entries = parse_srt(srt_path)
            return {
                "status": "ok",
                "entries": [
                    {
                        "index": e.index,
                        "start_seconds": e.start_seconds,
                        "end_seconds": e.end_seconds,
                        "text": e.text,
                    }
                    for e in entries
                ],
            }
        except Exception as e:
            logger.error("Erro ao carregar SRT: %s", e)
            return {"status": "error", "message": str(e)}

    def save_srt(self, srt_path: str, entries: list[dict[str, Any]]) -> dict[str, Any]:
        """Salva entries editadas de volta no arquivo SRT.

        Args:
            srt_path: Caminho do arquivo SRT de destino.
            entries: Lista de dicts com index, start_seconds, end_seconds, text.

        Returns:
            Status dict.
        """
        try:
            from src.processors.video_downloader.srt_utils import SubtitleEntry, write_srt

            subtitle_entries = [
                SubtitleEntry(
                    index=e["index"],
                    start_seconds=e["start_seconds"],
                    end_seconds=e["end_seconds"],
                    text=e["text"],
                )
                for e in entries
            ]
            write_srt(subtitle_entries, srt_path)
            return {"status": "ok", "message": "SRT salvo com sucesso."}
        except Exception as e:
            logger.error("Erro ao salvar SRT: %s", e)
            return {"status": "error", "message": str(e)}

    def get_video_path_for_srt(self, srt_path: str) -> dict[str, Any]:
        """Retorna caminho do video correspondente ao SRT.

        Args:
            srt_path: Caminho do arquivo SRT.

        Returns:
            Dict com status e video_path.
        """
        try:
            video_path = srt_path.replace(".srt", ".mp4")
            if not Path(video_path).exists():
                return {"status": "error", "message": "Video nao encontrado."}
            return {"status": "ok", "video_path": video_path}
        except Exception as e:
            logger.error("Erro ao obter path do video: %s", e)
            return {"status": "error", "message": str(e)}

    def embed_subtitles_standalone(
        self, video_path: str, srt_path: str, style: dict[str, Any],
        audio_boost: float | None = None,
    ) -> dict[str, Any]:
        """Embute legendas no video com estilo customizado.

        Args:
            video_path: Caminho do arquivo de video.
            srt_path: Caminho do arquivo SRT.
            style: Dict com font_size, bold, color, outline_width, position.
            audio_boost: Audio volume multiplier (e.g. 1.5 for 150%). None = no change.

        Returns:
            Status dict.
        """
        try:
            from src.processors.video_downloader.subtitle_processor import SubtitleProcessor
            from src.processors.video_downloader.srt_utils import SubtitleStyle

            # Convert style dict to SubtitleStyle
            subtitle_style = SubtitleStyle(
                font_name="Arial",
                font_size=style.get("font_size", 80),
                bold=style.get("bold", True),
                color=style.get("color", "&H00FFFFFF"),  # JS will send in ASS format
                outline_width=style.get("outline_width", 2),
                position=style.get("position", "bottom"),
                border_style=style.get("border_style", 3),
                background_color=style.get("background_color", "&H00000000"),
            )

            # Determine output path
            output_path = video_path.replace(".mp4", "_subtitled.mp4")

            # Define worker function
            def worker() -> None:
                try:
                    # Progress callback
                    def on_progress(pct: float, msg: str) -> None:
                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id="subtitle_embed",
                            message=msg,
                            progress=pct,
                        ))

                    api_key = self.config.openai.api_key
                    processor = SubtitleProcessor(api_key=api_key)

                    # Generate ASS
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.PROGRESS,
                        instruction_id="subtitle_embed",
                        message="Gerando arquivo ASS...",
                        progress=0.1,
                    ))
                    success, ass_path_or_error = processor.generate_ass_file(srt_path, subtitle_style)
                    if not success:
                        raise RuntimeError(f"Erro ao gerar ASS: {ass_path_or_error}")

                    # Embed subtitles
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.PROGRESS,
                        instruction_id="subtitle_embed",
                        message="Embutindo legendas...",
                        progress=0.3,
                    ))
                    success, result = processor.embed_subtitles(
                        video_path=video_path,
                        subtitle_path=ass_path_or_error,
                        output_path=output_path,
                        progress_callback=on_progress,
                        audio_boost=audio_boost,
                    )
                    if not success:
                        raise RuntimeError(f"Erro ao embutir legendas: {result}")

                    # Emit completion
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.COMPLETED,
                        instruction_id="subtitle_embed",
                        message=f"Legendas embutidas: {Path(output_path).name}",
                        output_path=output_path,
                    ))

                except Exception as e:
                    logger.error("Erro ao embutir legendas: %s", e)
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.ERROR,
                        instruction_id="subtitle_embed",
                        message=str(e),
                    ))

            # Start worker thread
            thread = threading.Thread(target=worker, daemon=True)
            thread.start()

            return {"status": "ok"}

        except Exception as e:
            logger.error("Erro ao iniciar embed de legendas: %s", e)
            return {"status": "error", "message": str(e)}


    # ── Subtitle Editor Window (Story 6.7) ──

    def _start_editor_server(
        self, video_path: str, editor_html_path: str
    ) -> tuple[str, str]:
        """Start a local HTTP server for the subtitle editor.

        Serves both the editor HTML and the video from the same origin
        to avoid cross-origin issues (file:// to http:// is blocked
        by WebView2/EdgeChromium). Supports HTTP Range requests which
        are required by Chromium for video playback.

        Returns:
            Tuple of (editor_url, video_url).
        """
        import http.server
        import mimetypes
        from urllib.parse import quote, unquote

        video_dir = str(Path(video_path).parent)
        video_name = Path(video_path).name
        html_abs = str(Path(editor_html_path).resolve())

        class EditorHandler(http.server.BaseHTTPRequestHandler):
            # Use HTTP/1.1 for keep-alive connections — reduces latency
            # between Range requests and prevents AV desync
            protocol_version = "HTTP/1.1"

            def _resolve_path(self):
                clean = unquote(self.path).split('?')[0].split('#')[0]
                if clean in ('/', '/subtitle-editor.html'):
                    return html_abs
                return os.path.join(video_dir, os.path.basename(clean))

            def do_HEAD(self):
                self._serve(head_only=True)

            def do_GET(self):
                self._serve(head_only=False)

            def _serve(self, head_only=False):
                fpath = self._resolve_path()
                if not os.path.isfile(fpath):
                    self.send_error(404)
                    return

                file_size = os.path.getsize(fpath)
                ctype = mimetypes.guess_type(fpath)[0] or 'application/octet-stream'
                range_header = self.headers.get('Range')

                if range_header and range_header.startswith('bytes='):
                    try:
                        spec = range_header[6:]  # strip 'bytes='
                        parts = spec.split('-', 1)
                        start = int(parts[0]) if parts[0] else 0
                        end = int(parts[1]) if parts[1] else file_size - 1
                        end = min(end, file_size - 1)

                        if start >= file_size or start > end:
                            self.send_response(416)
                            self.send_header('Content-Range', f'bytes */{file_size}')
                            self.end_headers()
                            return

                        length = end - start + 1
                        self.send_response(206)
                        self.send_header('Content-Type', ctype)
                        self.send_header('Content-Length', str(length))
                        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                        self.send_header('Accept-Ranges', 'bytes')
                        self.send_header('Cache-Control', 'public, max-age=3600')
                        self.end_headers()

                        if not head_only:
                            with open(fpath, 'rb') as f:
                                f.seek(start)
                                remaining = length
                                while remaining > 0:
                                    chunk = f.read(min(65536, remaining))
                                    if not chunk:
                                        break
                                    self.wfile.write(chunk)
                                    remaining -= len(chunk)
                    except (ValueError, IndexError):
                        self.send_error(400)
                else:
                    self.send_response(200)
                    self.send_header('Content-Type', ctype)
                    self.send_header('Content-Length', str(file_size))
                    self.send_header('Accept-Ranges', 'bytes')
                    self.send_header('Cache-Control', 'public, max-age=3600')
                    self.end_headers()

                    if not head_only:
                        with open(fpath, 'rb') as f:
                            while True:
                                chunk = f.read(65536)
                                if not chunk:
                                    break
                                self.wfile.write(chunk)

            def log_message(self, format, *args):
                pass  # Suppress HTTP request logs

        self._video_server = http.server.HTTPServer(
            ('127.0.0.1', 0), EditorHandler
        )
        port = self._video_server.server_address[1]

        server_thread = threading.Thread(
            target=self._video_server.serve_forever, daemon=True
        )
        server_thread.start()
        logger.info(
            "Editor server started on port %d (html=%s, video=%s)",
            port, html_abs, video_dir,
        )

        editor_url = f"http://127.0.0.1:{port}/subtitle-editor.html"
        video_url = f"http://127.0.0.1:{port}/{quote(video_name)}"
        return editor_url, video_url

    def _stop_video_server(self) -> None:
        """Stop the local video HTTP server if running."""
        server = getattr(self, "_video_server", None)
        if server:
            server.shutdown()
            self._video_server = None
            logger.info("Video server stopped")

    def open_subtitle_editor(self, srt_path: str, video_path: str) -> dict[str, Any]:
        """Open subtitle editor in a new pywebview window.

        Parses the SRT file and passes subtitle data + video URL to JS
        via evaluate_js on the new window. Video is served via local HTTP
        server because WebView2 blocks file:// protocol.

        Args:
            srt_path: Path to the SRT file to edit.
            video_path: Path to the corresponding video file.

        Returns:
            Status dict.
        """
        try:
            from src.processors.video_downloader.srt_utils import parse_srt

            entries = parse_srt(srt_path)
            subtitle_data = [
                {
                    "index": e.index,
                    "start_seconds": e.start_seconds,
                    "end_seconds": e.end_seconds,
                    "text": e.text,
                }
                for e in entries
            ]

            if getattr(sys, 'frozen', False):
                base_dir = Path(sys._MEIPASS)
            else:
                base_dir = self._root_dir

            editor_html = base_dir / "ui" / "subtitle-editor.html"
            if not editor_html.exists():
                return {"status": "error", "message": f"Editor HTML nao encontrado: {editor_html}"}

            video_filename = Path(video_path).name

            # Serve HTML + video from same HTTP origin (WebView2 blocks
            # file:// and cross-origin file-to-http requests)
            editor_url, video_url = self._start_editor_server(
                video_path, str(editor_html)
            )

            def on_loaded() -> None:
                """Inject data into the editor window after DOM is ready."""
                try:
                    js_data = json.dumps(subtitle_data, ensure_ascii=False)
                    js_video_url = json.dumps(video_url, ensure_ascii=False)
                    js_video_path = json.dumps(str(video_path), ensure_ascii=False)
                    js_srt = json.dumps(str(srt_path), ensure_ascii=False)
                    self._editor_window.evaluate_js(
                        f"window.subtitle_data = {js_data};"
                        f"window.video_url = {js_video_url};"
                        f"window.video_path = {js_video_path};"
                        f"window.srt_path = {js_srt};"
                        f"if (typeof initEditor === 'function') initEditor();"
                    )
                except Exception as e:
                    logger.error("Erro ao injetar dados no editor: %s", e)

            self._editor_window = webview.create_window(
                title=f"Subtitle Editor \u2014 {video_filename}",
                url=editor_url,
                js_api=self,
                width=1200,
                height=800,
                min_size=(800, 600),
                on_top=False,
            )
            self._editor_window.events.loaded += on_loaded

            return {"status": "ok"}
        except Exception as e:
            logger.error("Erro ao abrir editor de legendas: %s", e)
            return {"status": "error", "message": str(e)}

    def save_subtitles(
        self, subtitles: list[dict[str, Any]], style: dict[str, Any] | None = None,
        audio_boost: float | None = None,
    ) -> dict[str, Any]:
        """Save edited subtitles, generate ASS, and embed into video.

        Args:
            subtitles: List of subtitle dicts with index, start_seconds, end_seconds, text.
            style: Optional style dict with font_size, bold, color (ASS format),
                   outline_width, position.
            audio_boost: Audio volume multiplier (e.g. 1.5 for 150%). None = no change.

        Returns:
            Status dict.
        """
        try:
            from src.processors.video_downloader.srt_utils import (
                SubtitleEntry,
                SubtitleStyle,
                write_srt,
            )

            # Determine paths from the editor context
            srt_path = getattr(self, "_editor_srt_path", None)
            video_path = getattr(self, "_editor_video_path", None)
            if not srt_path or not video_path:
                return {"status": "error", "message": "Paths nao configurados para o editor."}

            # Convert to SubtitleEntry objects
            entries = [
                SubtitleEntry(
                    index=e["index"],
                    start_seconds=e["start_seconds"],
                    end_seconds=e["end_seconds"],
                    text=e["text"],
                )
                for e in subtitles
            ]

            # Write SRT
            write_srt(entries, srt_path)

            # Build style
            subtitle_style = SubtitleStyle(
                font_name="Arial",
                font_size=style.get("font_size", 80) if style else 80,
                bold=style.get("bold", True) if style else True,
                color=style.get("color", "&H00FFFFFF") if style else "&H00FFFFFF",
                outline_width=style.get("outline_width", 2) if style else 2,
                position=style.get("position", "bottom") if style else "bottom",
            )

            # Generate ASS and embed in background thread
            def worker() -> None:
                try:
                    from src.processors.video_downloader.subtitle_processor import SubtitleProcessor

                    api_key = self.config.openai.api_key
                    processor = SubtitleProcessor(api_key=api_key)

                    # Generate ASS
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.PROGRESS,
                        instruction_id="subtitle_embed",
                        message="Gerando arquivo ASS...",
                        progress=0.1,
                    ))
                    success, ass_path_or_error = processor.generate_ass_file(
                        srt_path, subtitle_style
                    )
                    if not success:
                        raise RuntimeError(f"Erro ao gerar ASS: {ass_path_or_error}")

                    # Embed
                    output_path = video_path.replace(".mp4", "_subtitled.mp4")
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.PROGRESS,
                        instruction_id="subtitle_embed",
                        message="Embutindo legendas...",
                        progress=0.3,
                    ))

                    def on_progress(pct: float, msg: str) -> None:
                        self._event_bus.emit(ProcessingEvent(
                            type=EventType.PROGRESS,
                            instruction_id="subtitle_embed",
                            message=msg,
                            progress=pct,
                        ))

                    success, result = processor.embed_subtitles(
                        video_path=video_path,
                        subtitle_path=ass_path_or_error,
                        output_path=output_path,
                        progress_callback=on_progress,
                        audio_boost=audio_boost,
                    )
                    if not success:
                        raise RuntimeError(f"Erro ao embutir legendas: {result}")

                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.COMPLETED,
                        instruction_id="subtitle_embed",
                        message=f"Legendas embutidas: {Path(output_path).name}",
                        output_path=output_path,
                    ))
                except Exception as e:
                    logger.error("Erro ao salvar legendas: %s", e)
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.ERROR,
                        instruction_id="subtitle_embed",
                        message=str(e),
                    ))

            thread = threading.Thread(target=worker, daemon=True)
            thread.start()

            return {"status": "ok"}
        except Exception as e:
            logger.error("Erro ao salvar legendas: %s", e)
            return {"status": "error", "message": str(e)}

    def cancel_editor(self) -> dict[str, Any]:
        """Close the subtitle editor window without saving.

        Returns:
            Status dict.
        """
        try:
            editor_window = getattr(self, "_editor_window", None)
            if editor_window:
                editor_window.destroy()
                self._editor_window = None
            self._stop_video_server()
        except Exception as e:
            logger.error("Erro ao fechar editor: %s", e)
        return {"status": "ok"}


def create_app() -> None:
    """Cria e inicia a aplicacao pywebview."""
    if getattr(sys, 'frozen', False):
        base_dir = Path(sys._MEIPASS)
    else:
        base_dir = Path(__file__).resolve().parent.parent.parent  # pauta-automation/
    ui_path = base_dir / "ui" / "index.html"

    if not ui_path.exists():
        raise FileNotFoundError(f"UI nao encontrada: {ui_path}")

    bridge = PautaBridge(root_dir=base_dir)

    window = webview.create_window(
        title="Pauta Automation — Epoch News",
        url=str(ui_path),
        js_api=bridge,
        width=1100,
        height=750,
        min_size=(900, 600),
    )
    bridge.set_window(window)
    webview.start()
