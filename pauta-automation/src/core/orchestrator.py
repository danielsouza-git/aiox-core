"""Orchestrator — coordena execucao de todos os processors."""

import logging
from concurrent.futures import ThreadPoolExecutor, Future

from src.core.config import AppConfig
from src.core.events import EventBus, EventType, ProcessingEvent
from src.core.models import (
    Instruction,
    InstructionType,
    ProcessingStatus,
)
from src.processors.tarja_processor import TarjaProcessor
from src.processors.video_processor import VideoProcessor

logger = logging.getLogger(__name__)


class Orchestrator:
    """Coordena a execucao de todos os processors em threads separadas."""

    # Controle de processors habilitados — mude para True/False conforme necessidade
    ENABLED_PROCESSORS = {
        "slides": True,
        "tarjas": True,
        "videos": True,
    }

    def __init__(self, config: AppConfig, event_bus: EventBus):
        self.config = config
        self.event_bus = event_bus
        self.tarja_processor = TarjaProcessor(config)
        self.video_processor = VideoProcessor(config)
        self._slide_processor = None
        self._cancelled = False

    @property
    def slide_processor(self):
        """Lazy init do SlideProcessor (requer slides_client com auth)."""
        if self._slide_processor is None:
            try:
                from src.google_api.auth import build_slides_service, build_drive_service
                from src.google_api.slides_client import SlidesClient
                from src.google_api.drive_client import DriveClient
                from src.processors.slide_processor import SlideProcessor

                creds_path = self.config.google.credentials_path
                token_path = self.config.google.token_path

                slides_service = build_slides_service(creds_path, token_path)
                slides_client = SlidesClient(slides_service)

                drive_service = build_drive_service(creds_path, token_path)
                drive_client = DriveClient(drive_service)

                self._slide_processor = SlideProcessor(
                    self.config, slides_client, drive_client
                )
                self._slide_processor.setup()
            except Exception as e:
                logger.error("Falha ao inicializar SlideProcessor: %s", e)
                raise
        return self._slide_processor

    def cancel(self):
        """Sinaliza cancelamento do processamento."""
        self._cancelled = True

    def process_all(self, instructions: list[Instruction]) -> None:
        """Processa todas as instrucoes habilitadas em paralelo por tipo.

        Slides, tarjas e videos rodam em threads separadas.
        Falha em um item nao bloqueia os demais.
        """
        self._cancelled = False
        enabled = [i for i in instructions if i.enabled]

        if not enabled:
            self.event_bus.emit(ProcessingEvent(
                type=EventType.ALL_DONE,
                instruction_id="",
                message="Nenhuma instrucao habilitada",
            ))
            return

        # Agrupa por tipo de processor (respeita ENABLED_PROCESSORS)
        ep = self.ENABLED_PROCESSORS
        slides = [i for i in enabled if i.type.value.startswith("slide_")] if ep.get("slides") else []
        tarjas = [i for i in enabled if i.type == InstructionType.TARJA] if ep.get("tarjas") else []
        videos = [i for i in enabled if i.type.value.startswith("video_")] if ep.get("videos") else []

        skipped = len(enabled) - len(slides) - len(tarjas) - len(videos)
        if skipped:
            logger.info("%d instrucoes ignoradas (processor desabilitado)", skipped)

        with ThreadPoolExecutor(max_workers=3) as executor:
            futures: list[Future] = []

            if slides:
                futures.append(
                    executor.submit(self._process_slides_batch, slides)
                )

            if tarjas:
                futures.append(
                    executor.submit(self._process_batch, self.tarja_processor, tarjas)
                )

            if videos:
                futures.append(
                    executor.submit(self._process_batch, self.video_processor, videos)
                )

            # Aguarda todos
            for future in futures:
                try:
                    future.result()
                except Exception as e:
                    logger.error("Erro em batch: %s", e)

        # Contagem final
        completed = sum(1 for i in enabled if i.status == ProcessingStatus.COMPLETED)
        errors = sum(1 for i in enabled if i.status == ProcessingStatus.ERROR)

        self.event_bus.emit(ProcessingEvent(
            type=EventType.ALL_DONE,
            instruction_id="",
            message=f"{completed} concluidos, {errors} erros de {len(enabled)} itens",
        ))

    def process_single(self, instruction: Instruction) -> None:
        """Processa uma unica instrucao (para reprocessamento)."""
        instruction.status = ProcessingStatus.PENDING
        instruction.error_message = None

        if instruction.type.value.startswith("slide_"):
            self._process_one(self.slide_processor, instruction)
        elif instruction.type == InstructionType.TARJA:
            self._process_one(self.tarja_processor, instruction)
        elif instruction.type.value.startswith("video_"):
            self._process_one(self.video_processor, instruction)

    def _process_slides_batch(self, instructions: list[Instruction]) -> None:
        """Processa batch de slides (inicializa slide_processor uma vez)."""
        try:
            processor = self.slide_processor
        except Exception as e:
            # Marca todos como erro se nao conseguir inicializar
            for instr in instructions:
                instr.status = ProcessingStatus.ERROR
                instr.error_message = f"SlideProcessor init falhou: {e}"
                self.event_bus.emit(ProcessingEvent(
                    type=EventType.ERROR,
                    instruction_id=instr.id,
                    message=instr.error_message,
                ))
            return

        self._process_batch(processor, instructions)

    def _process_batch(self, processor, instructions: list[Instruction]) -> None:
        """Processa uma lista de instrucoes sequencialmente com um processor."""
        for instruction in instructions:
            if self._cancelled:
                instruction.status = ProcessingStatus.ERROR
                instruction.error_message = "Cancelado pelo usuario"
                self.event_bus.emit(ProcessingEvent(
                    type=EventType.ERROR,
                    instruction_id=instruction.id,
                    message="Cancelado",
                ))
                continue

            self._process_one(processor, instruction)

    def _process_one(self, processor, instruction: Instruction) -> None:
        """Processa uma unica instrucao com tratamento de erro."""
        try:
            instruction.status = ProcessingStatus.PROCESSING
            self.event_bus.emit(ProcessingEvent(
                type=EventType.PROGRESS,
                instruction_id=instruction.id,
                progress=0.0,
                message="Iniciando...",
            ))

            def on_progress(value: float):
                self.event_bus.emit(ProcessingEvent(
                    type=EventType.PROGRESS,
                    instruction_id=instruction.id,
                    progress=value,
                ))

            output = processor.process(instruction, on_progress)
            instruction.output_path = output
            instruction.status = ProcessingStatus.COMPLETED

            self.event_bus.emit(ProcessingEvent(
                type=EventType.COMPLETED,
                instruction_id=instruction.id,
                output_path=output,
                message="Concluido",
            ))

        except Exception as e:
            instruction.status = ProcessingStatus.ERROR
            instruction.error_message = str(e)
            self.event_bus.emit(ProcessingEvent(
                type=EventType.ERROR,
                instruction_id=instruction.id,
                message=str(e),
            ))
            logger.error(
                "Erro ao processar %s [%s]: %s",
                instruction.id, instruction.type.value, e,
            )
