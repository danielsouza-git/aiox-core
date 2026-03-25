"""Sistema de eventos thread-safe para comunicacao processors - GUI."""

from dataclasses import dataclass
from enum import Enum
from queue import Queue
from typing import Optional


class EventType(Enum):
    PROGRESS = "progress"
    COMPLETED = "completed"
    ERROR = "error"
    ALL_DONE = "all_done"


@dataclass
class ProcessingEvent:
    type: EventType
    instruction_id: str
    message: Optional[str] = None
    progress: Optional[float] = None
    output_path: Optional[str] = None


class EventBus:
    """Fila thread-safe para comunicacao processors - GUI."""

    def __init__(self):
        self._queue: Queue[ProcessingEvent] = Queue()

    def emit(self, event: ProcessingEvent):
        self._queue.put(event)

    def poll(self) -> list[ProcessingEvent]:
        events = []
        while not self._queue.empty():
            try:
                events.append(self._queue.get_nowait())
            except Exception:
                break
        return events
