"""Interface base para processors."""

from abc import ABC, abstractmethod
from typing import Callable, Optional
from src.core.models import Instruction


class BaseProcessor(ABC):
    """Interface base que todos os processors devem implementar."""

    @abstractmethod
    def process(self, instruction: Instruction, on_progress: Optional[Callable] = None) -> str:
        """Processa uma instrucao e retorna o path do output.

        Args:
            instruction: Instrucao a ser processada.
            on_progress: Callback de progresso (0.0 a 1.0).

        Returns:
            Path do arquivo gerado.
        """
        pass
