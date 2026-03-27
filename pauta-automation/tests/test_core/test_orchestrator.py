"""Testes unitarios para o Orchestrator — coordenacao de processors."""

import os
import sys
import threading

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from unittest.mock import patch, MagicMock, PropertyMock

from src.core.events import EventBus, EventType, ProcessingEvent
from src.core.models import (
    Instruction,
    InstructionType,
    ProcessingStatus,
)


# ---------------------------------------------------------------------------
# Helpers — config fake e instrucoes de teste
# ---------------------------------------------------------------------------

def _make_config():
    """Cria AppConfig fake com todos os campos necessarios."""
    config = MagicMock()
    config.google.credentials_path = "/fake/creds.json"
    config.google.token_path = "/fake/token.json"
    return config


def _make_instruction(itype: InstructionType, order: int = 1,
                      enabled: bool = True, news_block: str = "Bloco 1") -> Instruction:
    """Cria Instruction de teste com tipo e ordem configuravel."""
    return Instruction(
        type=itype,
        news_block=news_block,
        order=order,
        enabled=enabled,
    )


def _make_slide_instruction(order: int = 1) -> Instruction:
    return _make_instruction(InstructionType.SLIDE_POST, order=order)


def _make_tarja_instruction(order: int = 1) -> Instruction:
    return _make_instruction(InstructionType.TARJA, order=order)


def _make_video_instruction(order: int = 1) -> Instruction:
    return _make_instruction(InstructionType.VIDEO_SUBTITLE, order=order)


# ---------------------------------------------------------------------------
# Patches necessarios para isolar o Orchestrator de dependencias externas
# ---------------------------------------------------------------------------

TARJA_PATCH = "src.core.orchestrator.TarjaProcessor"
VIDEO_PATCH = "src.core.orchestrator.VideoProcessor"


def _create_orchestrator(config=None, event_bus=None):
    """Cria Orchestrator com processors mockados (tarja + video).

    SlideProcessor usa lazy init, entao nao precisa de patch no __init__.
    """
    from src.core.orchestrator import Orchestrator

    if config is None:
        config = _make_config()
    if event_bus is None:
        event_bus = EventBus()

    with patch(TARJA_PATCH) as MockTarja, \
         patch(VIDEO_PATCH) as MockVideo:
        mock_tarja = MagicMock()
        mock_video = MagicMock()
        MockTarja.return_value = mock_tarja
        MockVideo.return_value = mock_video

        orch = Orchestrator(config, event_bus)

    # Substituir os processors reais pelos mocks
    orch.tarja_processor = mock_tarja
    orch.video_processor = mock_video

    return orch, mock_tarja, mock_video


def _collect_events(event_bus: EventBus) -> list[ProcessingEvent]:
    """Drena todos os eventos da fila do EventBus."""
    return event_bus.poll()


# ===========================================================================
# 1. Inicializacao
# ===========================================================================

def test_orchestrator_init_stores_config_and_event_bus():
    """Orchestrator armazena config e event_bus corretamente."""
    config = _make_config()
    event_bus = EventBus()
    orch, _, _ = _create_orchestrator(config, event_bus)

    assert orch.config is config
    assert orch.event_bus is event_bus


def test_orchestrator_init_sets_cancelled_false():
    """Orchestrator inicia com _cancelled = False."""
    orch, _, _ = _create_orchestrator()
    assert orch._cancelled is False


def test_orchestrator_init_slide_processor_is_none():
    """SlideProcessor comeca como None (lazy init)."""
    orch, _, _ = _create_orchestrator()
    assert orch._slide_processor is None


def test_orchestrator_enabled_processors_defaults():
    """ENABLED_PROCESSORS tem slides, tarjas e videos habilitados por default."""
    from src.core.orchestrator import Orchestrator
    assert Orchestrator.ENABLED_PROCESSORS["slides"] is True
    assert Orchestrator.ENABLED_PROCESSORS["tarjas"] is True
    assert Orchestrator.ENABLED_PROCESSORS["videos"] is True


# ===========================================================================
# 2. process_all — todos os 3 tipos
# ===========================================================================

def test_process_all_three_types():
    """process_all processa slides, tarjas e videos quando todos presentes."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    slide_instr = _make_slide_instruction(order=1)
    tarja_instr = _make_tarja_instruction(order=2)
    video_instr = _make_video_instruction(order=3)

    # Mock slide_processor via property override
    mock_slide = MagicMock()
    mock_slide.process.return_value = "/output/slide.png"
    orch._slide_processor = mock_slide

    mock_tarja.process.return_value = "/output/tarja.png"
    mock_video.process.return_value = "/output/video.mp4"

    orch.process_all([slide_instr, tarja_instr, video_instr])

    # Verifica que cada processor foi chamado
    mock_slide.process.assert_called_once()
    mock_tarja.process.assert_called_once()
    mock_video.process.assert_called_once()

    # Verifica status das instrucoes
    assert slide_instr.status == ProcessingStatus.COMPLETED
    assert tarja_instr.status == ProcessingStatus.COMPLETED
    assert video_instr.status == ProcessingStatus.COMPLETED


def test_process_all_emits_all_done_event():
    """process_all emite evento ALL_DONE no final."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction()
    mock_tarja.process.return_value = "/output/tarja.png"

    orch.process_all([tarja_instr])

    events = _collect_events(event_bus)
    all_done_events = [e for e in events if e.type == EventType.ALL_DONE]
    assert len(all_done_events) == 1
    assert "1 concluidos" in all_done_events[0].message


def test_process_all_output_paths_set():
    """process_all define output_path nas instrucoes concluidas."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction()
    mock_tarja.process.return_value = "/output/tarja_final.png"

    orch.process_all([tarja_instr])

    assert tarja_instr.output_path == "/output/tarja_final.png"


# ===========================================================================
# 3. process_all — apenas 1 tipo (so tarjas)
# ===========================================================================

def test_process_all_only_tarjas():
    """process_all com apenas tarjas nao toca slide/video processors."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    t1 = _make_tarja_instruction(order=1)
    t2 = _make_tarja_instruction(order=2)

    mock_tarja.process.return_value = "/output/tarja.png"

    orch.process_all([t1, t2])

    assert mock_tarja.process.call_count == 2
    mock_video.process.assert_not_called()
    # slide_processor nunca foi acessado (lazy init)
    assert orch._slide_processor is None


def test_process_all_only_videos():
    """process_all com apenas videos nao toca tarja/slide processors."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    v1 = _make_video_instruction(order=1)
    mock_video.process.return_value = "/output/video.mp4"

    orch.process_all([v1])

    mock_video.process.assert_called_once()
    mock_tarja.process.assert_not_called()
    assert orch._slide_processor is None


# ===========================================================================
# 4. Isolamento de falhas — um processor falha, outros continuam
# ===========================================================================

def test_process_all_tarja_fails_video_continues():
    """Quando tarja_processor falha, video_processor continua normalmente."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction(order=1)
    video_instr = _make_video_instruction(order=2)

    mock_tarja.process.side_effect = RuntimeError("Tarja rendering failed")
    mock_video.process.return_value = "/output/video.mp4"

    orch.process_all([tarja_instr, video_instr])

    # Tarja falhou
    assert tarja_instr.status == ProcessingStatus.ERROR
    assert "Tarja rendering failed" in tarja_instr.error_message

    # Video continuou
    assert video_instr.status == ProcessingStatus.COMPLETED
    assert video_instr.output_path == "/output/video.mp4"


def test_process_all_video_fails_tarja_continues():
    """Quando video_processor falha, tarja_processor continua normalmente."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction(order=1)
    video_instr = _make_video_instruction(order=2)

    mock_tarja.process.return_value = "/output/tarja.png"
    mock_video.process.side_effect = RuntimeError("FFmpeg crashed")

    orch.process_all([tarja_instr, video_instr])

    assert tarja_instr.status == ProcessingStatus.COMPLETED
    assert video_instr.status == ProcessingStatus.ERROR
    assert "FFmpeg crashed" in video_instr.error_message


def test_process_all_slide_init_fails_others_continue():
    """Quando SlideProcessor init falha, tarjas e videos continuam."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    slide_instr = _make_slide_instruction(order=1)
    tarja_instr = _make_tarja_instruction(order=2)
    video_instr = _make_video_instruction(order=3)

    # Simula falha na inicializacao do slide_processor (lazy property)
    # Override _slide_processor to None and make slide_processor property raise
    orch._slide_processor = None
    with patch.object(type(orch), 'slide_processor', new_callable=PropertyMock) as mock_prop:
        mock_prop.side_effect = RuntimeError("Google auth failed")

        mock_tarja.process.return_value = "/output/tarja.png"
        mock_video.process.return_value = "/output/video.mp4"

        orch.process_all([slide_instr, tarja_instr, video_instr])

    # Slide falhou
    assert slide_instr.status == ProcessingStatus.ERROR
    assert "SlideProcessor init falhou" in slide_instr.error_message

    # Outros continuaram
    assert tarja_instr.status == ProcessingStatus.COMPLETED
    assert video_instr.status == ProcessingStatus.COMPLETED


def test_process_all_reports_error_count_in_all_done():
    """ALL_DONE event reporta contagem correta de erros."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    t1 = _make_tarja_instruction(order=1)
    t2 = _make_tarja_instruction(order=2)

    mock_tarja.process.side_effect = [
        RuntimeError("fail 1"),
        "/output/ok.png",
    ]

    # Need to handle the side_effect properly - first call raises, second returns
    call_count = [0]
    def process_side_effect(instr, on_progress):
        call_count[0] += 1
        if call_count[0] == 1:
            raise RuntimeError("fail 1")
        return "/output/ok.png"

    mock_tarja.process.side_effect = process_side_effect

    orch.process_all([t1, t2])

    events = _collect_events(event_bus)
    all_done = [e for e in events if e.type == EventType.ALL_DONE][0]
    assert "1 concluidos" in all_done.message
    assert "1 erros" in all_done.message


# ===========================================================================
# 5. EventBus recebe eventos de progresso
# ===========================================================================

def test_process_all_emits_progress_events():
    """process_all emite PROGRESS events durante processamento."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction()
    mock_tarja.process.return_value = "/output/tarja.png"

    orch.process_all([tarja_instr])

    events = _collect_events(event_bus)
    progress_events = [e for e in events if e.type == EventType.PROGRESS]
    assert len(progress_events) >= 1
    assert progress_events[0].instruction_id == tarja_instr.id


def test_process_all_emits_completed_event_per_instruction():
    """process_all emite COMPLETED event para cada instrucao bem-sucedida."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    t1 = _make_tarja_instruction(order=1)
    t2 = _make_tarja_instruction(order=2)
    mock_tarja.process.return_value = "/output/tarja.png"

    orch.process_all([t1, t2])

    events = _collect_events(event_bus)
    completed_events = [e for e in events if e.type == EventType.COMPLETED]
    assert len(completed_events) == 2


def test_process_all_emits_error_event_on_failure():
    """process_all emite ERROR event quando processor falha."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction()
    mock_tarja.process.side_effect = RuntimeError("Rendering failed")

    orch.process_all([tarja_instr])

    events = _collect_events(event_bus)
    error_events = [e for e in events if e.type == EventType.ERROR]
    assert len(error_events) >= 1
    assert error_events[0].instruction_id == tarja_instr.id
    assert "Rendering failed" in error_events[0].message


def test_process_one_emits_progress_then_completed():
    """_process_one emite PROGRESS(0.0) seguido de COMPLETED na sequencia."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction()
    mock_tarja.process.return_value = "/output/tarja.png"

    orch._process_one(mock_tarja, tarja_instr)

    events = _collect_events(event_bus)
    types = [e.type for e in events]
    assert EventType.PROGRESS in types
    assert EventType.COMPLETED in types
    # PROGRESS vem antes de COMPLETED
    assert types.index(EventType.PROGRESS) < types.index(EventType.COMPLETED)


# ===========================================================================
# 6. ThreadPoolExecutor — paralelismo
# ===========================================================================

def test_process_all_uses_thread_pool():
    """process_all usa ThreadPoolExecutor para processar batches em paralelo."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction(order=1)
    video_instr = _make_video_instruction(order=2)

    # Rastreia threads usadas
    threads_used = []

    def tarja_process(instr, on_progress):
        threads_used.append(("tarja", threading.current_thread().name))
        return "/output/tarja.png"

    def video_process(instr, on_progress):
        threads_used.append(("video", threading.current_thread().name))
        return "/output/video.mp4"

    mock_tarja.process.side_effect = tarja_process
    mock_video.process.side_effect = video_process

    orch.process_all([tarja_instr, video_instr])

    # Verifica que ambos foram processados
    assert len(threads_used) == 2
    tarja_thread = [t[1] for t in threads_used if t[0] == "tarja"][0]
    video_thread = [t[1] for t in threads_used if t[0] == "video"][0]

    # Ambos devem rodar em threads do pool (nao na main thread)
    main_thread = threading.current_thread().name
    assert tarja_thread != main_thread or video_thread != main_thread


def test_process_all_max_workers_three():
    """process_all configura ThreadPoolExecutor com max_workers=3."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    tarja_instr = _make_tarja_instruction()
    mock_tarja.process.return_value = "/output/tarja.png"

    with patch("src.core.orchestrator.ThreadPoolExecutor") as MockPool:
        mock_executor = MagicMock()
        mock_future = MagicMock()
        mock_future.result.return_value = None
        mock_executor.submit.return_value = mock_future
        mock_executor.__enter__ = MagicMock(return_value=mock_executor)
        mock_executor.__exit__ = MagicMock(return_value=False)
        MockPool.return_value = mock_executor

        orch.process_all([tarja_instr])

        MockPool.assert_called_once_with(max_workers=3)


# ===========================================================================
# 7. Lista vazia de instrucoes
# ===========================================================================

def test_process_all_empty_list():
    """process_all com lista vazia emite ALL_DONE imediatamente."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    orch.process_all([])

    events = _collect_events(event_bus)
    assert len(events) == 1
    assert events[0].type == EventType.ALL_DONE
    assert "Nenhuma instrucao habilitada" in events[0].message


def test_process_all_all_disabled():
    """process_all com todas instrucoes disabled emite ALL_DONE."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    t1 = _make_instruction(InstructionType.TARJA, enabled=False)
    v1 = _make_instruction(InstructionType.VIDEO_SUBTITLE, enabled=False)

    orch.process_all([t1, v1])

    events = _collect_events(event_bus)
    all_done = [e for e in events if e.type == EventType.ALL_DONE]
    assert len(all_done) == 1
    assert "Nenhuma instrucao habilitada" in all_done[0].message

    # Processors nao devem ter sido chamados
    mock_tarja.process.assert_not_called()
    mock_video.process.assert_not_called()


# ===========================================================================
# 8. Cancelamento
# ===========================================================================

def test_cancel_sets_cancelled_flag():
    """cancel() seta _cancelled = True."""
    orch, _, _ = _create_orchestrator()

    assert orch._cancelled is False
    orch.cancel()
    assert orch._cancelled is True


def test_process_all_resets_cancelled_flag():
    """process_all reseta _cancelled para False no inicio."""
    orch, mock_tarja, _ = _create_orchestrator()
    mock_tarja.process.return_value = "/output/t.png"

    orch._cancelled = True
    orch.process_all([_make_tarja_instruction()])

    # _cancelled foi resetado no inicio de process_all
    # (o processamento ocorreu normalmente)
    events = _collect_events(orch.event_bus)
    completed = [e for e in events if e.type == EventType.COMPLETED]
    assert len(completed) == 1


def test_process_batch_skips_on_cancel():
    """_process_batch marca instrucoes como ERROR quando cancelado."""
    event_bus = EventBus()
    orch, mock_tarja, _ = _create_orchestrator(event_bus=event_bus)

    t1 = _make_tarja_instruction(order=1)
    t2 = _make_tarja_instruction(order=2)

    # Simula cancelamento apos primeiro item
    call_count = [0]
    def process_then_cancel(instr, on_progress):
        call_count[0] += 1
        if call_count[0] == 1:
            orch._cancelled = True  # Cancela apos primeiro processamento
            return "/output/ok.png"
        return "/output/should_not_reach.png"

    mock_tarja.process.side_effect = process_then_cancel

    orch._process_batch(mock_tarja, [t1, t2])

    # Primeiro foi processado normalmente
    assert t1.status == ProcessingStatus.COMPLETED

    # Segundo foi cancelado
    assert t2.status == ProcessingStatus.ERROR
    assert "Cancelado" in t2.error_message


# ===========================================================================
# 9. process_single — reprocessamento individual
# ===========================================================================

def test_process_single_tarja():
    """process_single processa uma instrucao de tarja individualmente."""
    event_bus = EventBus()
    orch, mock_tarja, _ = _create_orchestrator(event_bus=event_bus)

    instr = _make_tarja_instruction()
    instr.status = ProcessingStatus.ERROR  # Estava em erro
    instr.error_message = "Previous error"

    mock_tarja.process.return_value = "/output/tarja_retry.png"

    orch.process_single(instr)

    assert instr.status == ProcessingStatus.COMPLETED
    assert instr.output_path == "/output/tarja_retry.png"
    assert instr.error_message is None  # Limpo no inicio (pelo process_single)
    # Na verdade, process_single reseta status para PENDING, entao _process_one
    # seta para PROCESSING e depois COMPLETED. error_message e resetado para None.


def test_process_single_video():
    """process_single processa uma instrucao de video individualmente."""
    event_bus = EventBus()
    orch, _, mock_video = _create_orchestrator(event_bus=event_bus)

    instr = _make_video_instruction()
    mock_video.process.return_value = "/output/video_retry.mp4"

    orch.process_single(instr)

    assert instr.status == ProcessingStatus.COMPLETED
    mock_video.process.assert_called_once()


def test_process_single_resets_status():
    """process_single reseta status para PENDING e error_message para None."""
    event_bus = EventBus()
    orch, mock_tarja, _ = _create_orchestrator(event_bus=event_bus)

    instr = _make_tarja_instruction()
    instr.status = ProcessingStatus.ERROR
    instr.error_message = "Old error"

    mock_tarja.process.return_value = "/output/ok.png"

    # Vamos interceptar o momento logo apos process_single resetar os campos
    original_process_one = orch._process_one
    reset_status = []

    def capture_reset(processor, instruction):
        reset_status.append(instruction.status)
        return original_process_one(processor, instruction)

    orch._process_one = capture_reset
    orch.process_single(instr)

    # Ao chamar _process_one, status ja tinha sido resetado para PENDING
    assert reset_status[0] == ProcessingStatus.PENDING


def test_process_single_slide():
    """process_single com slide chama slide_processor."""
    event_bus = EventBus()
    orch, _, _ = _create_orchestrator(event_bus=event_bus)

    mock_slide = MagicMock()
    mock_slide.process.return_value = "/output/slide.png"
    orch._slide_processor = mock_slide

    instr = _make_slide_instruction()
    orch.process_single(instr)

    assert instr.status == ProcessingStatus.COMPLETED
    mock_slide.process.assert_called_once()


# ===========================================================================
# 10. ENABLED_PROCESSORS — processadores desabilitados
# ===========================================================================

def test_disabled_slides_processor_skips_slides():
    """Instrucoes de slides sao ignoradas quando slides esta desabilitado."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    # Desabilita slides
    original = orch.ENABLED_PROCESSORS.copy()
    orch.ENABLED_PROCESSORS = {"slides": False, "tarjas": True, "videos": True}

    slide_instr = _make_slide_instruction(order=1)
    tarja_instr = _make_tarja_instruction(order=2)

    mock_tarja.process.return_value = "/output/tarja.png"

    orch.process_all([slide_instr, tarja_instr])

    # Slide nao foi processado (status permanece PENDING)
    assert slide_instr.status == ProcessingStatus.PENDING
    # Tarja foi processada
    assert tarja_instr.status == ProcessingStatus.COMPLETED

    # Restaurar original (class-level attribute)
    orch.ENABLED_PROCESSORS = original


def test_disabled_tarjas_processor_skips_tarjas():
    """Instrucoes de tarjas sao ignoradas quando tarjas esta desabilitado."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    original = orch.ENABLED_PROCESSORS.copy()
    orch.ENABLED_PROCESSORS = {"slides": True, "tarjas": False, "videos": True}

    tarja_instr = _make_tarja_instruction(order=1)
    video_instr = _make_video_instruction(order=2)

    mock_video.process.return_value = "/output/video.mp4"

    orch.process_all([tarja_instr, video_instr])

    assert tarja_instr.status == ProcessingStatus.PENDING
    assert video_instr.status == ProcessingStatus.COMPLETED
    mock_tarja.process.assert_not_called()

    orch.ENABLED_PROCESSORS = original


# ===========================================================================
# 11. Instrucoes mistas habilitadas/desabilitadas
# ===========================================================================

def test_process_all_filters_disabled_instructions():
    """process_all ignora instrucoes com enabled=False."""
    event_bus = EventBus()
    orch, mock_tarja, _ = _create_orchestrator(event_bus=event_bus)

    enabled_instr = _make_tarja_instruction(order=1)
    disabled_instr = _make_instruction(InstructionType.TARJA, order=2, enabled=False)

    mock_tarja.process.return_value = "/output/tarja.png"

    orch.process_all([enabled_instr, disabled_instr])

    # Apenas a instrucao habilitada foi processada
    mock_tarja.process.assert_called_once()
    assert enabled_instr.status == ProcessingStatus.COMPLETED


# ===========================================================================
# 12. _process_one — tratamento de erro detalhado
# ===========================================================================

def test_process_one_sets_status_processing():
    """_process_one seta status para PROCESSING antes de chamar processor."""
    event_bus = EventBus()
    orch, mock_tarja, _ = _create_orchestrator(event_bus=event_bus)

    instr = _make_tarja_instruction()
    statuses = []

    def capture_status(instruction, on_progress):
        statuses.append(instruction.status)
        return "/output/ok.png"

    mock_tarja.process.side_effect = capture_status

    orch._process_one(mock_tarja, instr)

    assert statuses[0] == ProcessingStatus.PROCESSING


def test_process_one_passes_on_progress_callback():
    """_process_one passa callback on_progress que emite eventos."""
    event_bus = EventBus()
    orch, mock_tarja, _ = _create_orchestrator(event_bus=event_bus)

    instr = _make_tarja_instruction()

    def call_progress(instruction, on_progress):
        on_progress(0.5)
        on_progress(1.0)
        return "/output/ok.png"

    mock_tarja.process.side_effect = call_progress

    orch._process_one(mock_tarja, instr)

    events = _collect_events(event_bus)
    progress_events = [e for e in events if e.type == EventType.PROGRESS]
    # 1 initial (0.0) + 2 from callback (0.5, 1.0)
    assert len(progress_events) == 3
    assert progress_events[0].progress == 0.0
    assert progress_events[1].progress == 0.5
    assert progress_events[2].progress == 1.0


def test_process_one_error_preserves_error_message():
    """_process_one armazena str(exception) em instruction.error_message."""
    event_bus = EventBus()
    orch, mock_tarja, _ = _create_orchestrator(event_bus=event_bus)

    instr = _make_tarja_instruction()
    mock_tarja.process.side_effect = ValueError("Invalid font path: /missing/font.ttf")

    orch._process_one(mock_tarja, instr)

    assert instr.status == ProcessingStatus.ERROR
    assert "Invalid font path: /missing/font.ttf" in instr.error_message


# ===========================================================================
# 13. _process_slides_batch — inicializacao lazy
# ===========================================================================

def test_process_slides_batch_marks_all_error_on_init_failure():
    """_process_slides_batch marca todos como ERROR se slide_processor init falha."""
    event_bus = EventBus()
    orch, _, _ = _create_orchestrator(event_bus=event_bus)

    s1 = _make_slide_instruction(order=1)
    s2 = _make_slide_instruction(order=2)

    # Faz slide_processor property levantar excecao
    orch._slide_processor = None
    with patch.object(type(orch), 'slide_processor', new_callable=PropertyMock) as mock_prop:
        mock_prop.side_effect = RuntimeError("No Google credentials")

        orch._process_slides_batch([s1, s2])

    assert s1.status == ProcessingStatus.ERROR
    assert s2.status == ProcessingStatus.ERROR
    assert "SlideProcessor init falhou" in s1.error_message
    assert "SlideProcessor init falhou" in s2.error_message


def test_process_slides_batch_emits_error_events_on_init_failure():
    """_process_slides_batch emite ERROR event para cada slide quando init falha."""
    event_bus = EventBus()
    orch, _, _ = _create_orchestrator(event_bus=event_bus)

    s1 = _make_slide_instruction(order=1)
    s2 = _make_slide_instruction(order=2)

    orch._slide_processor = None
    with patch.object(type(orch), 'slide_processor', new_callable=PropertyMock) as mock_prop:
        mock_prop.side_effect = RuntimeError("Auth error")

        orch._process_slides_batch([s1, s2])

    events = _collect_events(event_bus)
    error_events = [e for e in events if e.type == EventType.ERROR]
    assert len(error_events) == 2


# ===========================================================================
# 14. Contagem final no ALL_DONE
# ===========================================================================

def test_process_all_all_done_message_counts():
    """ALL_DONE message contem contagem correta de concluidos e erros."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    t1 = _make_tarja_instruction(order=1)
    t2 = _make_tarja_instruction(order=2)
    v1 = _make_video_instruction(order=3)

    call_count = [0]
    def tarja_process(instr, on_progress):
        call_count[0] += 1
        if call_count[0] == 1:
            return "/output/ok.png"
        raise RuntimeError("fail")

    mock_tarja.process.side_effect = tarja_process
    mock_video.process.return_value = "/output/video.mp4"

    orch.process_all([t1, t2, v1])

    events = _collect_events(event_bus)
    all_done = [e for e in events if e.type == EventType.ALL_DONE][0]
    # 2 concluidos (t1 + v1), 1 erro (t2)
    assert "2 concluidos" in all_done.message
    assert "1 erros" in all_done.message


# ===========================================================================
# 15. Tipos de instrucao — routing correto
# ===========================================================================

def test_instruction_type_slide_fullscreen_routes_to_slides():
    """SLIDE_FULLSCREEN e agrupado como slide (value starts with 'slide_')."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    mock_slide = MagicMock()
    mock_slide.process.return_value = "/output/slide.png"
    orch._slide_processor = mock_slide

    instr = _make_instruction(InstructionType.SLIDE_FULLSCREEN, order=1)
    orch.process_all([instr])

    mock_slide.process.assert_called_once()
    mock_tarja.process.assert_not_called()
    mock_video.process.assert_not_called()


def test_instruction_type_video_only_routes_to_videos():
    """VIDEO_ONLY e agrupado como video (value starts with 'video_')."""
    event_bus = EventBus()
    orch, mock_tarja, mock_video = _create_orchestrator(event_bus=event_bus)

    instr = _make_instruction(InstructionType.VIDEO_ONLY, order=1)
    mock_video.process.return_value = "/output/video.mp4"

    orch.process_all([instr])

    mock_video.process.assert_called_once()
    mock_tarja.process.assert_not_called()


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    print("=== Testes: Orchestrator ===\n")

    tests = [
        # 1. Inicializacao
        ("1a. Init stores config and event_bus", test_orchestrator_init_stores_config_and_event_bus),
        ("1b. Init sets cancelled false", test_orchestrator_init_sets_cancelled_false),
        ("1c. Init slide_processor is None", test_orchestrator_init_slide_processor_is_none),
        ("1d. ENABLED_PROCESSORS defaults", test_orchestrator_enabled_processors_defaults),
        # 2. process_all — todos os tipos
        ("2a. Process all three types", test_process_all_three_types),
        ("2b. Emits ALL_DONE event", test_process_all_emits_all_done_event),
        ("2c. Output paths set", test_process_all_output_paths_set),
        # 3. Apenas 1 tipo
        ("3a. Only tarjas", test_process_all_only_tarjas),
        ("3b. Only videos", test_process_all_only_videos),
        # 4. Isolamento de falhas
        ("4a. Tarja fails, video continues", test_process_all_tarja_fails_video_continues),
        ("4b. Video fails, tarja continues", test_process_all_video_fails_tarja_continues),
        ("4c. Slide init fails, others continue", test_process_all_slide_init_fails_others_continue),
        ("4d. Error count in ALL_DONE", test_process_all_reports_error_count_in_all_done),
        # 5. EventBus
        ("5a. Emits progress events", test_process_all_emits_progress_events),
        ("5b. Emits completed per instruction", test_process_all_emits_completed_event_per_instruction),
        ("5c. Emits error on failure", test_process_all_emits_error_event_on_failure),
        ("5d. Progress then completed sequence", test_process_one_emits_progress_then_completed),
        # 6. ThreadPoolExecutor
        ("6a. Uses thread pool", test_process_all_uses_thread_pool),
        ("6b. Max workers = 3", test_process_all_max_workers_three),
        # 7. Lista vazia
        ("7a. Empty list", test_process_all_empty_list),
        ("7b. All disabled", test_process_all_all_disabled),
        # 8. Cancelamento
        ("8a. Cancel sets flag", test_cancel_sets_cancelled_flag),
        ("8b. process_all resets cancelled", test_process_all_resets_cancelled_flag),
        ("8c. Batch skips on cancel", test_process_batch_skips_on_cancel),
        # 9. process_single
        ("9a. Single tarja", test_process_single_tarja),
        ("9b. Single video", test_process_single_video),
        ("9c. Single resets status", test_process_single_resets_status),
        ("9d. Single slide", test_process_single_slide),
        # 10. ENABLED_PROCESSORS
        ("10a. Disabled slides skips", test_disabled_slides_processor_skips_slides),
        ("10b. Disabled tarjas skips", test_disabled_tarjas_processor_skips_tarjas),
        # 11. Mistas
        ("11a. Filters disabled instructions", test_process_all_filters_disabled_instructions),
        # 12. _process_one detalhado
        ("12a. Sets PROCESSING status", test_process_one_sets_status_processing),
        ("12b. Passes on_progress callback", test_process_one_passes_on_progress_callback),
        ("12c. Error preserves message", test_process_one_error_preserves_error_message),
        # 13. _process_slides_batch
        ("13a. All ERROR on init failure", test_process_slides_batch_marks_all_error_on_init_failure),
        ("13b. Error events on init failure", test_process_slides_batch_emits_error_events_on_init_failure),
        # 14. Contagem final
        ("14a. ALL_DONE counts", test_process_all_all_done_message_counts),
        # 15. Routing de tipos
        ("15a. SLIDE_FULLSCREEN routes to slides", test_instruction_type_slide_fullscreen_routes_to_slides),
        ("15b. VIDEO_ONLY routes to videos", test_instruction_type_video_only_routes_to_videos),
    ]

    passed = 0
    failed = 0

    for name, test_fn in tests:
        try:
            test_fn()
            print(f"  PASS  {name}")
            passed += 1
        except Exception as e:
            print(f"  FAIL  {name}: {e}")
            failed += 1

    print(f"\n=== Resultado: {passed}/{passed + failed} testes passaram ===")
    if failed:
        print(f"FALHAS: {failed}")
        sys.exit(1)
    else:
        print("Todos os testes passaram!")
