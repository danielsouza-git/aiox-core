"""Bridge Python-JS para pywebview — Pauta Automation."""

from __future__ import annotations

import logging
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

                    # Download
                    self._event_bus.emit(ProcessingEvent(
                        type=EventType.PROGRESS,
                        instruction_id=event_id,
                        message="Baixando video...",
                        progress=0.0,
                    ))

                    downloaded_path = VideoDownloaderEngine.download(
                        url=url,
                        quality=quality,
                        output_dir=str(output_path),
                        filename=custom_name,
                        progress_callback=on_progress,
                    )

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
                            clip_output = output_path / f"{custom_name}_clip{i+1}.mp4"
                            clipped = VideoDownloaderEngine.clip_video(
                                video_path=downloaded_path,
                                start_time=clip["start"],
                                end_time=clip["end"],
                                output_path=str(clip_output),
                            )

                            # Repeat if needed
                            if clip.get("repeat", 1) > 1:
                                repeat_output = output_path / f"{custom_name}_clip{i+1}_repeat.mp4"
                                clipped = VideoDownloaderEngine.repeat_clip(
                                    video_path=clipped,
                                    repeat_count=clip["repeat"],
                                    output_path=str(repeat_output),
                                )

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
                            VideoDownloaderEngine.merge_clips(
                                clip_paths=clipped_paths,
                                output_path=str(final_output),
                                transition="fadewhite",
                                transition_duration=1.0,
                            )
                            final_path = str(final_output)
                        else:
                            final_path = clipped_paths[0] if clipped_paths else downloaded_path
                    else:
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

                            srt_result_path = processor.transcribe(
                                video_path=final_path,
                                output_path=str(output_path / f"{custom_name}.srt"),
                                model=self.config.video.whisper_model,
                            )

                            # Translate
                            processor.translate(
                                srt_path=srt_result_path,
                                target_language="pt",
                                output_path=str(output_path / f"{custom_name}_pt.srt"),
                                model=self.config.video.translation_model,
                            )

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
        self, video_path: str, srt_path: str, style: dict[str, Any]
    ) -> dict[str, Any]:
        """Embute legendas no video com estilo customizado.

        Args:
            video_path: Caminho do arquivo de video.
            srt_path: Caminho do arquivo SRT.
            style: Dict com font_size, bold, color, outline_width, position.

        Returns:
            Status dict.
        """
        try:
            from src.processors.video_downloader.subtitle_processor import SubtitleProcessor
            from src.processors.video_downloader.srt_utils import SubtitleStyle

            # Convert style dict to SubtitleStyle
            subtitle_style = SubtitleStyle(
                font_name="Arial",
                font_size=style.get("font_size", 21),
                bold=style.get("bold", True),
                color=style.get("color", "&H00FFFFFF"),  # JS will send in ASS format
                outline_width=style.get("outline_width", 2),
                position=style.get("position", "bottom"),
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
