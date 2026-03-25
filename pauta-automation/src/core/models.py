"""Modelos de dados centrais do Pauta Automation System."""

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
import uuid


class InstructionType(Enum):
    SLIDE_POST = "slide_post"
    SLIDE_NEWS_WITH_TEXT = "slide_news_text"
    SLIDE_NEWS_NO_TEXT = "slide_news"
    SLIDE_FULLSCREEN = "slide_full"
    SLIDE_PARTIAL = "slide_partial"
    TARJA = "tarja"
    VIDEO_SUBTITLE = "video_sub"
    VIDEO_ONLY = "video_only"


class ProcessingStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"


class Platform(Enum):
    X = "x"
    TRUTH = "truth"
    INSTAGRAM = "instagram"
    TELEGRAM = "telegram"
    UNKNOWN = "unknown"


class TarjaType(Enum):
    GIRO = "giro"
    COBERTURA = "cobertura"
    MIRA = "mira"
    SUPERCHATS = "superchats"


@dataclass
class TimeCode:
    start: str
    end: str


@dataclass
class VideoClip:
    url: str
    timecode: Optional[TimeCode] = None


@dataclass
class Instruction:
    """Unidade atomica de trabalho extraida da pauta."""
    type: InstructionType
    news_block: str
    order: int
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    status: ProcessingStatus = ProcessingStatus.PENDING
    error_message: Optional[str] = None
    output_path: Optional[str] = None

    # Campos especificos por tipo
    url: Optional[str] = None
    urls: list[str] = field(default_factory=list)
    text: Optional[str] = None
    translated_text: Optional[str] = None
    timecode: Optional[TimeCode] = None
    clips: list[VideoClip] = field(default_factory=list)
    merge: bool = False
    tarja_title: Optional[str] = None
    tarja_subtitle: Optional[str] = None
    tarja_type: Optional[TarjaType] = None
    platform: Optional[Platform] = None
    enabled: bool = True


@dataclass
class PostContent:
    """Conteudo extraido de uma postagem de rede social."""
    profile_image_url: str
    handle: str
    display_name: str
    text: str
    platform: Platform
    platform_logo_path: str


@dataclass
class NewsContent:
    """Conteudo extraido de um artigo de noticia."""
    title: str
    source_name: str
    logo_url: Optional[str] = None
    logo_path: Optional[str] = None


@dataclass
class NewsBlock:
    """Bloco de noticia extraido da pauta."""
    title: str
    responsible: Optional[str] = None
    raw_text: str = ""
    instructions: list[Instruction] = field(default_factory=list)


@dataclass
class PautaResult:
    """Resultado completo do parsing da pauta."""
    doc_title: str
    news_blocks: list[NewsBlock] = field(default_factory=list)

    @property
    def instructions(self) -> list[Instruction]:
        """Retorna todas as instrucoes de todos os blocos, ordenadas."""
        all_instructions = []
        for block in self.news_blocks:
            all_instructions.extend(block.instructions)
        return sorted(all_instructions, key=lambda i: i.order)
