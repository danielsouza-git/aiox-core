"""Processor de slides — gera slides no Google Slides via API.

Suporta os 5 tipos de slide:
- Tipo 1: Postagem (rede social)
- Tipo 2: Noticia COM texto traduzido
- Tipo 3: Noticia SEM texto
- Tipo 4: Fullscreen (imagem 100%)
- Tipo 5: Parcial/Multiplas imagens

Estrategia: duplica slides template e substitui conteudo via placeholders.
"""

import logging
import os
import re
import time
from typing import Callable, Optional
from urllib.parse import urlparse

from src.core.config import AppConfig
from src.core.models import (
    Instruction,
    InstructionType,
    Platform,
)
from src.extractors.social_media import (
    ExtractionError,
    extract_post_content,
)
from src.extractors.news_extractor import (
    NewsExtractionError,
    extract_news_content,
)
from src.google_api.slides_client import SlidesClient
from src.processors.base import BaseProcessor

# Diretorio de logos locais
LOGOS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "assets", "logos",
)

logger = logging.getLogger(__name__)

# Indices dos slides template na apresentacao (0-indexed)
# O template tem 5 slides, um para cada tipo
TEMPLATE_SLIDE_INDEX = {
    InstructionType.SLIDE_POST: 0,          # Tipo 1: Postagem
    InstructionType.SLIDE_NEWS_WITH_TEXT: 1, # Tipo 2: Noticia COM texto
    InstructionType.SLIDE_NEWS_NO_TEXT: 2,   # Tipo 3: Noticia SEM texto
    InstructionType.SLIDE_FULLSCREEN: 3,     # Tipo 4: Fullscreen
    InstructionType.SLIDE_PARTIAL: 4,        # Tipo 5: Parcial
}

# Placeholders usados nos templates
# Estes textos devem estar nos slides template do Google Slides
PLACEHOLDERS = {
    "post_text": "{{post_text}}",
    "handle": "{{handle}}",
    "display_name": "{{display_name}}",
    "news_title": "{{news_title}}",
    "translated_text": "{{translated_text}}",
}

# Tamanho maximo de texto para postagem antes de reduzir fonte
POST_TEXT_MAX_CHARS = 280


# Delay entre slides para evitar rate limit (60 writes/min)
# Cada slide usa ~4-5 write requests. Com 4s entre slides: ~15 slides/min (margem segura)
SLIDE_THROTTLE_SECONDS = 4.0


class SlideProcessor(BaseProcessor):
    """Gera slides no Google Slides duplicando templates e substituindo conteudo."""

    def __init__(self, config: AppConfig, slides_client: SlidesClient, drive_client=None):
        self.config = config
        self.slides_client = slides_client
        self.drive_client = drive_client
        self._template_slide_ids: Optional[list[str]] = None
        self._presentation_id: Optional[str] = None
        self._last_api_call: float = 0

    def setup(self, presentation_id: Optional[str] = None) -> None:
        """Inicializa o processor carregando IDs dos slides template.

        Args:
            presentation_id: ID da apresentacao. Se None, cria copia do template.
        """
        template_id = self.config.google.slides_template_id

        if presentation_id:
            self._presentation_id = presentation_id
        else:
            # Duplica a apresentacao template para trabalhar em copia
            self._presentation_id = template_id

        # Carrega IDs dos slides template
        self._template_slide_ids = self.slides_client.get_slide_ids(
            self._presentation_id
        )
        logger.info(
            "SlideProcessor inicializado: presentation=%s, %d slides template",
            self._presentation_id,
            len(self._template_slide_ids),
        )

    @property
    def presentation_id(self) -> str:
        if not self._presentation_id:
            raise RuntimeError("SlideProcessor nao inicializado. Chame setup() primeiro.")
        return self._presentation_id

    def process(self, instruction: Instruction, on_progress: Optional[Callable] = None) -> str:
        """Gera slide a partir de uma instrucao.

        Args:
            instruction: Instrucao do tipo SLIDE_*.
            on_progress: Callback de progresso (0.0 a 1.0).

        Returns:
            ID do slide criado.
        """
        if not self._template_slide_ids:
            raise RuntimeError("SlideProcessor nao inicializado. Chame setup() primeiro.")

        handlers = {
            InstructionType.SLIDE_POST: self._process_post,
            InstructionType.SLIDE_NEWS_WITH_TEXT: self._process_news_with_text,
            InstructionType.SLIDE_NEWS_NO_TEXT: self._process_news_no_text,
            InstructionType.SLIDE_FULLSCREEN: self._process_fullscreen,
            InstructionType.SLIDE_PARTIAL: self._process_partial,
        }

        handler = handlers.get(instruction.type)
        if not handler:
            raise ValueError(f"Tipo de instrucao nao suportado: {instruction.type}")

        if on_progress:
            on_progress(0.1)

        # Throttle entre slides para respeitar rate limit da API
        self._throttle()

        slide_id = handler(instruction, on_progress)

        if on_progress:
            on_progress(1.0)

        return slide_id

    def _throttle(self) -> None:
        """Garante intervalo minimo entre chamadas para evitar rate limit."""
        now = time.time()
        elapsed = now - self._last_api_call
        if elapsed < SLIDE_THROTTLE_SECONDS:
            time.sleep(SLIDE_THROTTLE_SECONDS - elapsed)
        self._last_api_call = time.time()

    def _get_template_slide_id(self, instruction_type: InstructionType) -> str:
        """Retorna o ID do slide template para o tipo de instrucao."""
        index = TEMPLATE_SLIDE_INDEX.get(instruction_type)
        if index is None:
            raise ValueError(f"Sem template para tipo: {instruction_type}")
        if index >= len(self._template_slide_ids):
            raise RuntimeError(
                f"Template slide index {index} fora do range "
                f"(apresentacao tem {len(self._template_slide_ids)} slides)"
            )
        return self._template_slide_ids[index]

    def _duplicate_template(self, instruction_type: InstructionType) -> str:
        """Duplica o slide template correto e move para o final da apresentacao."""
        template_id = self._get_template_slide_id(instruction_type)
        new_slide_id = self.slides_client.duplicate_slide(
            self.presentation_id, template_id
        )

        # Move para o final para manter ordem correta
        all_slides = self.slides_client.get_slide_ids(self.presentation_id)
        self.slides_client.move_slide(
            self.presentation_id, new_slide_id, len(all_slides)
        )

        logger.info("Slide duplicado e movido ao final: template=%s, novo=%s", template_id, new_slide_id)
        return new_slide_id

    # ──────────────────────────────────────────────
    # Tipo 1: Postagem (rede social)
    # ──────────────────────────────────────────────

    def _process_post(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Gera slide Tipo 1 (Postagem de rede social).

        Layout: Foto perfil circular (esquerda) + nome/@ + caixa branca com texto (direita)
                + logo plataforma (inferior direito).
        """
        url = instruction.url
        if not url:
            raise ValueError("Instrucao SLIDE_POST sem URL")

        platform = instruction.platform or Platform.UNKNOWN

        # 1. Extrai conteudo da postagem
        if on_progress:
            on_progress(0.2)

        try:
            post = extract_post_content(url, platform)
        except ExtractionError as e:
            logger.warning("Falha ao extrair postagem %s: %s", url, e)
            raise

        # 2. Duplica slide template
        if on_progress:
            on_progress(0.4)

        new_slide_id = self._duplicate_template(InstructionType.SLIDE_POST)

        # 3. Substitui placeholders de texto
        if on_progress:
            on_progress(0.6)

        text = post.text
        if len(text) > POST_TEXT_MAX_CHARS:
            # Regra de texto grande: corta mantendo sentido
            text = _truncate_text(text, POST_TEXT_MAX_CHARS)

        replacements = {
            PLACEHOLDERS["post_text"]: text,
            PLACEHOLDERS["handle"]: post.handle,
            PLACEHOLDERS["display_name"]: post.display_name,
        }

        for placeholder, value in replacements.items():
            self.slides_client.replace_text(
                self.presentation_id, new_slide_id, placeholder, value
            )

        # 4. Insere foto de perfil (se disponivel)
        if on_progress:
            on_progress(0.8)

        if post.profile_image_url:
            self._insert_profile_image(new_slide_id, post.profile_image_url)

        # 5. Insere logo da plataforma
        if post.platform_logo_path:
            self._insert_platform_logo(new_slide_id, post.platform_logo_path)

        return new_slide_id

    def _insert_profile_image(self, slide_id: str, image_url: str) -> None:
        """Insere foto de perfil no slide de postagem."""
        if not image_url:
            return

        # Busca placeholder de imagem de perfil no slide
        elements = self.slides_client.find_elements_by_text(
            self.presentation_id, slide_id, "{{profile_image}}"
        )

        if elements:
            element = elements[0]
            transform = element.get("transform", {})
            size = element.get("size", {})

            x_emu = int(transform.get("translateX", 0))
            y_emu = int(transform.get("translateY", 0))
            width = size.get("width", {})
            height = size.get("height", {})
            w_emu = int(width.get("magnitude", 914400))
            h_emu = int(height.get("magnitude", 914400))

            self.slides_client.insert_image(
                self.presentation_id,
                slide_id,
                image_url,
                x_emu, y_emu, w_emu, h_emu,
                replace_element_id=element["objectId"],
            )
        else:
            # Fallback: posicao padrao (canto esquerdo)
            self.slides_client.insert_image(
                self.presentation_id,
                slide_id,
                image_url,
                x_emu=457200,    # ~0.5 inch
                y_emu=1371600,   # ~1.5 inch
                width_emu=914400,  # 1 inch
                height_emu=914400, # 1 inch
            )

    def _insert_platform_logo(self, slide_id: str, logo_path: str) -> None:
        """Insere logo da plataforma no slide."""
        # Logo da plataforma precisa ser uma URL publica para a API
        # Como temos apenas path local, vamos buscar o placeholder
        elements = self.slides_client.find_elements_by_text(
            self.presentation_id, slide_id, "{{platform_logo}}"
        )

        if elements:
            # Remove o placeholder (sera preenchido manualmente ou via Drive)
            logger.info(
                "Logo da plataforma: placeholder encontrado mas imagem local "
                "nao pode ser inserida via API. Requer upload ao Drive primeiro."
            )

    # ──────────────────────────────────────────────
    # Tipo 2: Noticia COM texto traduzido
    # ──────────────────────────────────────────────

    def _process_news_with_text(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Gera slide Tipo 2 (Noticia com texto traduzido).

        Layout: Caixa branca centralizada. Topo: logo veiculo. Abaixo: texto traduzido.
        """
        url = instruction.url
        if not url:
            raise ValueError("Instrucao SLIDE_NEWS_WITH_TEXT sem URL")

        # 1. Extrai conteudo da noticia
        if on_progress:
            on_progress(0.2)

        try:
            news = extract_news_content(url)
        except NewsExtractionError as e:
            logger.warning("Falha ao extrair noticia %s: %s", url, e)
            raise

        # 2. Duplica slide template
        if on_progress:
            on_progress(0.4)

        new_slide_id = self._duplicate_template(InstructionType.SLIDE_NEWS_WITH_TEXT)

        # 3. Substitui textos nos elementos do slide
        if on_progress:
            on_progress(0.6)

        translated_text = instruction.translated_text or ""
        text_elements = self._get_text_elements(new_slide_id)

        # Elemento com texto existente = titulo da noticia
        # Elementos vazios: primeiro = titulo do veiculo, segundo = texto traduzido
        filled = [e for e in text_elements if e["text"]]
        empty = [e for e in text_elements if not e["text"]]

        if filled:
            self._replace_text_preserving_style(filled[0]["objectId"], news.title)

        if empty and translated_text:
            # Primeiro vazio apos o logo area = texto traduzido
            # Se tem 2 vazios: [0]=area nome veiculo, [1]=area texto traduzido
            target = empty[-1] if len(empty) > 1 else empty[0]
            self._replace_text_preserving_style(target["objectId"], translated_text)

        # 4. Reduz retangulo branco de texto (menos espaco em branco)
        self._shrink_text_bg_rect(new_slide_id, news.title)

        # 5. Insere logo do veiculo
        if on_progress:
            on_progress(0.8)

        self._insert_news_logo(new_slide_id, url)

        return new_slide_id

    # ──────────────────────────────────────────────
    # Tipo 3: Noticia SEM texto
    # ──────────────────────────────────────────────

    def _is_wide_logo(self, news_url: str) -> bool:
        """Verifica se o logo local e largo (ratio > 4:1) e precisa de template maior."""
        local_logo = self._get_local_logo(news_url)
        if not local_logo:
            return False
        try:
            from PIL import Image
            img = Image.open(local_logo)
            w, h = img.size
            return (w / h) > 4.0
        except Exception:
            return False

    def _process_news_no_text(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Gera slide Tipo 3 (Noticia sem texto traduzido).

        Se o logo e largo (ratio > 4:1), usa template Tipo 2 (que tem mais espaco).
        Layout normal: Barra branca horizontal. Esquerda: logo. Direita: titulo.
        """
        url = instruction.url
        if not url:
            raise ValueError("Instrucao SLIDE_NEWS_NO_TEXT sem URL")

        # 1. Extrai conteudo
        if on_progress:
            on_progress(0.2)

        try:
            news = extract_news_content(url)
        except NewsExtractionError as e:
            logger.warning("Falha ao extrair noticia %s: %s", url, e)
            raise

        # 2. Duplica slide — Tipo 2 se logo e largo, Tipo 3 se nao
        if on_progress:
            on_progress(0.4)

        use_wide = self._is_wide_logo(url)
        if use_wide:
            logger.info("Logo largo detectado, usando template Tipo 2 para: %s", url[:60])
            new_slide_id = self._duplicate_template(InstructionType.SLIDE_NEWS_WITH_TEXT)
        else:
            new_slide_id = self._duplicate_template(InstructionType.SLIDE_NEWS_NO_TEXT)

        # 3. Substitui titulo
        if on_progress:
            on_progress(0.6)

        text_elements = self._get_text_elements(new_slide_id)
        filled = [e for e in text_elements if e["text"]]

        if filled:
            self._replace_text_preserving_style(filled[0]["objectId"], news.title)

            # Ajusta posicao e tamanho da caixa de texto (Tipo 3 apenas)
            if not use_wide:
                self._adjust_tipo3_text_position(new_slide_id, filled[0]["objectId"], news.title)
        else:
            logger.warning("Nenhum elemento de texto encontrado no slide %s", new_slide_id)

        # 4. Reduz retangulo branco se usando Tipo 2
        if use_wide:
            self._shrink_text_bg_rect(new_slide_id, news.title)

        # 5. Insere logo
        if on_progress:
            on_progress(0.8)

        self._insert_news_logo(new_slide_id, url)

        return new_slide_id

    def _replace_text_preserving_style(self, element_id: str, new_text: str) -> None:
        """Substitui texto de um elemento preservando o estilo original (cor, fonte, etc).

        Le o estilo do texto existente antes de deletar, depois aplica ao novo texto.
        """
        # 1. Le estilo original do elemento
        pres = self.slides_client.get_presentation(self.presentation_id)
        original_style = None
        for slide in pres.get("slides", []):
            for el in slide.get("pageElements", []):
                if el["objectId"] != element_id:
                    continue
                if "shape" in el and "text" in el.get("shape", {}):
                    for te in el["shape"]["text"].get("textElements", []):
                        if "textRun" in te and te["textRun"].get("style"):
                            original_style = te["textRun"]["style"]
                            break
                break
            if original_style:
                break

        # 2. Substitui texto
        requests = [
            {"deleteText": {"objectId": element_id, "textRange": {"type": "ALL"}}},
            {"insertText": {"objectId": element_id, "insertionIndex": 0, "text": new_text}},
        ]

        # 3. Reaplica estilo original
        if original_style:
            style = {}
            fields = []

            if "foregroundColor" in original_style:
                style["foregroundColor"] = original_style["foregroundColor"]
                fields.append("foregroundColor")

            if "bold" in original_style:
                style["bold"] = original_style["bold"]
                fields.append("bold")

            if "fontFamily" in original_style:
                style["fontFamily"] = original_style["fontFamily"]
                fields.append("fontFamily")

            if "fontSize" in original_style:
                style["fontSize"] = original_style["fontSize"]
                fields.append("fontSize")

            if "backgroundColor" in original_style and original_style["backgroundColor"]:
                style["backgroundColor"] = original_style["backgroundColor"]
                fields.append("backgroundColor")

            if style:
                requests.append({
                    "updateTextStyle": {
                        "objectId": element_id,
                        "style": style,
                        "textRange": {"type": "ALL"},
                        "fields": ",".join(fields),
                    }
                })

        self.slides_client.batch_update(self.presentation_id, requests)

    def _get_text_elements(self, slide_id: str) -> list[dict]:
        """Retorna elementos de texto (shapes) de um slide com seu conteudo.

        Returns:
            Lista de dicts com 'objectId' e 'text'.
        """
        elements = self.slides_client.get_slide_elements(self.presentation_id, slide_id)
        results = []
        for el in elements:
            if "shape" not in el:
                continue
            text = ""
            if "text" in el.get("shape", {}):
                for te in el["shape"]["text"].get("textElements", []):
                    if "textRun" in te:
                        text += te["textRun"].get("content", "")
            results.append({
                "objectId": el["objectId"],
                "text": text.strip(),
            })
        return results

    def _get_image_elements(self, slide_id: str) -> list[dict]:
        """Retorna elementos de imagem de um slide.

        Returns:
            Lista de dicts com 'objectId', 'transform', 'size'.
        """
        elements = self.slides_client.get_slide_elements(self.presentation_id, slide_id)
        results = []
        for el in elements:
            if "image" not in el:
                continue
            results.append({
                "objectId": el["objectId"],
                "transform": el.get("transform", {}),
                "size": el.get("size", {}),
            })
        return results

    # Tipo 2: scaleY do retangulo de texto baseado no numero de linhas
    # Referencia: slides 6 e 7 definidos pelo usuario
    _BG_SCALE_Y_1LINE = 0.1902  # 1 linha de titulo
    _BG_SCALE_Y_2LINE = 0.3118  # 2 linhas de titulo
    _BG_SCALE_Y_3LINE = 0.4334  # 3 linhas (extrapolado)

    # Tipo 3: posicao e tamanho da caixa de texto baseado no numero de linhas
    # Referencia: slides 6, 7 e 8 definidos pelo usuario
    _T3_TEXT = {
        1: {"scaleY": 0.1796, "translateY": 1276324},  # 1 linha
        2: {"scaleY": 0.2976, "translateY": 1099324},  # 2 linhas
        3: {"scaleY": 0.4156, "translateY": 922324},    # 3 linhas
    }

    def _adjust_tipo3_text_position(self, slide_id: str, text_element_id: str, title: str) -> None:
        """Ajusta posicao e tamanho da caixa de texto no slide Tipo 3.

        Move o texto para cima e aumenta a caixa conforme o numero de linhas,
        para centralizar visualmente no slide.
        Referencia: slides 6 (1 linha), 7 (2 linhas), 8 (3 linhas) do template.
        """
        title_len = len(title) if title else 0
        if title_len <= 35:
            lines = 1
        elif title_len <= 70:
            lines = 2
        else:
            lines = 3

        params = self._T3_TEXT.get(lines, self._T3_TEXT[2])

        # Le transform atual do elemento
        pres = self.slides_client.get_presentation(self.presentation_id)
        for slide in pres.get("slides", []):
            if slide["objectId"] != slide_id:
                continue
            for el in slide.get("pageElements", []):
                if el["objectId"] != text_element_id:
                    continue
                transform = el.get("transform", {})

                requests = [{
                    "updatePageElementTransform": {
                        "objectId": text_element_id,
                        "applyMode": "ABSOLUTE",
                        "transform": {
                            "scaleX": transform.get("scaleX", 1),
                            "scaleY": params["scaleY"],
                            "translateX": transform.get("translateX", 0),
                            "translateY": params["translateY"],
                            "shearX": transform.get("shearX", 0),
                            "shearY": transform.get("shearY", 0),
                            "unit": "EMU",
                        },
                    }
                }]
                self.slides_client.batch_update(self.presentation_id, requests)
                logger.info(
                    "Texto Tipo 3 ajustado no slide %s: %d linhas, scaleY=%.4f, Y=%d",
                    slide_id, lines, params["scaleY"], params["translateY"],
                )
                return

    def _shrink_text_bg_rect(self, slide_id: str, title: str = "") -> None:
        """Reduz a altura do retangulo branco de texto no slide Tipo 2.

        Ajusta baseado no numero de linhas do titulo:
        - 1 linha (titulo curto): scaleY = 0.19
        - 2 linhas (titulo medio): scaleY = 0.31
        - 3+ linhas (titulo longo): scaleY = 0.43
        """
        # Estima numero de linhas (~40 chars por linha no template)
        title_len = len(title) if title else 0
        if title_len <= 45:
            target_scale_y = self._BG_SCALE_Y_1LINE
        elif title_len <= 90:
            target_scale_y = self._BG_SCALE_Y_2LINE
        else:
            target_scale_y = self._BG_SCALE_Y_3LINE

        pres = self.slides_client.get_presentation(self.presentation_id)
        for slide in pres.get("slides", []):
            if slide["objectId"] != slide_id:
                continue

            # Encontra shapes vazios (sem texto) — candidatos a retangulo de fundo
            empty_shapes = []
            for el in slide.get("pageElements", []):
                if "shape" not in el:
                    continue
                text = ""
                for te in el["shape"].get("text", {}).get("textElements", []):
                    if "textRun" in te:
                        text += te["textRun"].get("content", "")
                if text.strip():
                    continue
                s = el.get("size", {})
                t = el.get("transform", {})
                real_h = s.get("height", {}).get("magnitude", 0) * abs(t.get("scaleY", 1))
                empty_shapes.append((el, real_h))

            if len(empty_shapes) < 2:
                return

            # O maior shape vazio = retangulo de texto (nao a barra do logo)
            empty_shapes.sort(key=lambda x: x[1], reverse=True)
            rect_el = empty_shapes[0][0]
            rect_id = rect_el["objectId"]

            transform = rect_el.get("transform", {})
            old_scale_y = transform.get("scaleY", 1)

            requests = [{
                "updatePageElementTransform": {
                    "objectId": rect_id,
                    "applyMode": "ABSOLUTE",
                    "transform": {
                        "scaleX": transform.get("scaleX", 1),
                        "scaleY": target_scale_y,
                        "translateX": transform.get("translateX", 0),
                        "translateY": transform.get("translateY", 0),
                        "shearX": transform.get("shearX", 0),
                        "shearY": transform.get("shearY", 0),
                        "unit": "EMU",
                    },
                }
            }]
            self.slides_client.batch_update(self.presentation_id, requests)
            logger.info(
                "Retangulo de texto ajustado no slide %s: scaleY %.4f → %.4f (titulo %d chars)",
                slide_id, old_scale_y, target_scale_y, title_len,
            )
            return

    def _get_local_logo(self, news_url: str) -> Optional[str]:
        """Verifica se existe logo local para o dominio da URL.

        Procura em assets/logos/ por arquivo com nome do dominio.
        Ex: ft.com → assets/logos/ft.png
        """
        if not news_url:
            return None

        parsed = urlparse(news_url)
        domain = parsed.netloc.lower().replace("www.", "")

        # Tenta nome exato (ft.com.png) e simplificado (ft.png)
        candidates = [
            domain,                          # ft.com
            domain.rsplit(".", 1)[0],        # ft
        ]
        # Para dominios com subdominios: presidencia.gob.sv → presidencia
        if domain.count(".") > 1:
            candidates.append(domain.split(".")[0])

        for name in candidates:
            for ext in [".png", ".jpg", ".jpeg", ".webp"]:
                path = os.path.join(LOGOS_DIR, f"{name}{ext}")
                if os.path.exists(path):
                    return path
        return None

    def _detect_logo_bg_color(self, logo_path: str) -> Optional[tuple[float, float, float]]:
        """Detecta cor de fundo do logo lendo pixel do canto superior esquerdo.

        Returns:
            Tupla (r, g, b) normalizada 0-1 para Google Slides API, ou None se branco.
        """
        try:
            from PIL import Image
            img = Image.open(logo_path).convert("RGB")
            r, g, b = img.getpixel((0, 0))
            # Se for branco (ou quase branco), nao precisa mudar
            if r > 250 and g > 250 and b > 250:
                return None
            return (r / 255.0, g / 255.0, b / 255.0)
        except Exception as e:
            logger.warning("Falha ao detectar cor de fundo do logo: %s", e)
            return None

    def _update_logo_bg_shape(self, slide_id: str, color_rgb: tuple[float, float, float]) -> None:
        """Altera a cor de fundo do retangulo atras do logo.

        O retangulo de fundo e o shape vazio (sem texto) no slide.
        """
        pres = self.slides_client.get_presentation(self.presentation_id)
        for slide in pres.get("slides", []):
            if slide["objectId"] != slide_id:
                continue
            for el in slide.get("pageElements", []):
                if "shape" not in el:
                    continue
                # Shape vazio (sem texto) = retangulo de fundo
                text = ""
                for te in el["shape"].get("text", {}).get("textElements", []):
                    if "textRun" in te:
                        text += te["textRun"].get("content", "")
                if text.strip():
                    continue
                # Encontrou shape vazio — altera cor de fundo
                shape_id = el["objectId"]
                requests = [{
                    "updateShapeProperties": {
                        "objectId": shape_id,
                        "shapeProperties": {
                            "shapeBackgroundFill": {
                                "solidFill": {
                                    "color": {
                                        "rgbColor": {
                                            "red": color_rgb[0],
                                            "green": color_rgb[1],
                                            "blue": color_rgb[2],
                                        }
                                    },
                                    "alpha": 1,
                                }
                            }
                        },
                        "fields": "shapeBackgroundFill.solidFill.color",
                    }
                }]
                self.slides_client.batch_update(self.presentation_id, requests)
                logger.info(
                    "Cor de fundo do retangulo alterada no slide %s: rgb=(%.2f,%.2f,%.2f)",
                    slide_id, *color_rgb,
                )
                return

    def _insert_news_logo(self, slide_id: str, news_url: str) -> None:
        """Substitui a imagem de logo no slide pelo logo do veiculo.

        Prioridade:
        1. Logo local (assets/logos/) → upload para Drive → URL publica
        2. Se nao tem logo local → pula (nao usa favicon)

        Tambem detecta cor de fundo do logo e ajusta o retangulo no slide.
        """
        # Tenta logo local
        local_logo = self._get_local_logo(news_url)
        if not local_logo:
            logger.info("Sem logo local para %s, pulando", news_url[:60] if news_url else "?")
            return

        if not self.drive_client:
            logger.warning("DriveClient nao disponivel, pulando logo")
            return

        # Detecta cor de fundo do logo e ajusta retangulo
        bg_color = self._detect_logo_bg_color(local_logo)
        if bg_color:
            try:
                self._update_logo_bg_shape(slide_id, bg_color)
            except Exception as e:
                logger.warning("Falha ao alterar cor de fundo: %s", e)

        # Upload para Drive e obtem URL publica
        try:
            logo_url = self.drive_client.upload_and_share(local_logo)
        except Exception as e:
            logger.warning("Falha no upload do logo para Drive: %s", e)
            return

        image_elements = self._get_image_elements(slide_id)
        if not image_elements:
            logger.info("Nenhum elemento de imagem encontrado no slide %s", slide_id)
            return

        # O logo e tipicamente o menor elemento de imagem (nao o background)
        def _area(el):
            s = el.get("size", {})
            t = el.get("transform", {})
            w = s.get("width", {}).get("magnitude", 0) * abs(t.get("scaleX", 1))
            h = s.get("height", {}).get("magnitude", 0) * abs(t.get("scaleY", 1))
            return w * h

        sorted_imgs = sorted(image_elements, key=_area)
        logo_element = sorted_imgs[0]  # Menor imagem = logo

        transform = logo_element.get("transform", {})
        size = logo_element.get("size", {})

        x_emu = int(transform.get("translateX", 0))
        y_emu = int(transform.get("translateY", 0))

        # Tamanho real = size * scale
        scale_x = abs(transform.get("scaleX", 1))
        scale_y = abs(transform.get("scaleY", 1))
        w_emu = int(size.get("width", {}).get("magnitude", 914400) * scale_x)
        h_emu = int(size.get("height", {}).get("magnitude", 914400) * scale_y)

        logger.info(
            "Inserindo logo no slide %s: %s size=%dx%d EMU pos=%d,%d",
            slide_id, os.path.basename(local_logo), w_emu, h_emu, x_emu, y_emu,
        )

        try:
            self.slides_client.insert_image(
                self.presentation_id,
                slide_id,
                logo_url,
                x_emu, y_emu, w_emu, h_emu,
                replace_element_id=logo_element["objectId"],
            )
        except Exception as e:
            logger.warning("Falha ao inserir logo no slide %s: %s", slide_id, e)

    # ──────────────────────────────────────────────
    # Tipo 4: Fullscreen
    # ──────────────────────────────────────────────

    def _process_fullscreen(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Gera slide Tipo 4 (Imagem fullscreen).

        Layout: Imagem ocupa 100% do slide com borda preta.
        """
        url = instruction.url
        if not url:
            raise ValueError("Instrucao SLIDE_FULLSCREEN sem URL")

        # 1. Duplica slide
        if on_progress:
            on_progress(0.3)

        new_slide_id = self._duplicate_template(InstructionType.SLIDE_FULLSCREEN)

        # 2. Insere imagem fullscreen
        if on_progress:
            on_progress(0.6)

        image_id = self.slides_client.insert_image_fullscreen(
            self.presentation_id, new_slide_id, url
        )

        # 3. Adiciona borda preta
        if image_id:
            self.slides_client.set_image_border(
                self.presentation_id, image_id
            )

        return new_slide_id

    # ──────────────────────────────────────────────
    # Tipo 5: Parcial/Multiplas
    # ──────────────────────────────────────────────

    def _process_partial(self, instruction: Instruction, on_progress: Optional[Callable]) -> str:
        """Gera slides Tipo 5 — uma imagem por slide sobre background.

        Cria um slide duplicado para cada imagem, com borda preta.
        Se uma imagem falhar (inacessivel, formato invalido), pula e continua.
        """
        urls = instruction.urls or ([instruction.url] if instruction.url else [])
        if not urls:
            raise ValueError("Instrucao SLIDE_PARTIAL sem URLs")

        from src.google_api.slides_client import SLIDE_WIDTH_EMU, SLIDE_HEIGHT_EMU

        last_slide_id = ""
        for i, url in enumerate(urls):
            if not url.startswith("http"):
                logger.warning("URL de imagem invalida (nao HTTP): %s", url)
                continue

            # Normaliza URL (webp → jpg, extrai de CDN proxy)
            url = _normalize_image_url(url)

            # Throttle entre imagens individuais
            self._throttle()

            # Duplica template para cada imagem
            new_slide_id = self._duplicate_template(InstructionType.SLIDE_PARTIAL)

            # Insere imagem centralizada (80% do slide)
            w = int(SLIDE_WIDTH_EMU * 0.8)
            h = int(SLIDE_HEIGHT_EMU * 0.8)
            x = (SLIDE_WIDTH_EMU - w) // 2
            y = (SLIDE_HEIGHT_EMU - h) // 2

            try:
                image_id = self.slides_client.insert_image(
                    self.presentation_id,
                    new_slide_id,
                    url,
                    x_emu=x, y_emu=y,
                    width_emu=w, height_emu=h,
                )

                # Adiciona borda preta
                if image_id:
                    self.slides_client.set_image_border(
                        self.presentation_id, image_id
                    )
            except Exception as e:
                logger.warning(
                    "Falha ao inserir imagem no slide (mantendo slide sem imagem): "
                    "url=%s erro=%s",
                    url[:80], e,
                )

            last_slide_id = new_slide_id

            if on_progress:
                progress = 0.1 + (0.8 * (i + 1) / len(urls))
                on_progress(progress)

        return last_slide_id

    def cleanup_templates(self) -> None:
        """Remove os slides template originais apos gerar todos os slides finais."""
        if not self._template_slide_ids:
            return

        for slide_id in self._template_slide_ids:
            try:
                self.slides_client.delete_slide(self.presentation_id, slide_id)
            except Exception as e:
                logger.warning("Falha ao deletar slide template %s: %s", slide_id, e)


def _truncate_text(text: str, max_chars: int) -> str:
    """Corta texto mantendo sentido (no limite de frase mais proximo)."""
    if len(text) <= max_chars:
        return text

    # Tenta cortar no final de uma frase
    truncated = text[:max_chars]
    last_period = truncated.rfind(".")
    last_excl = truncated.rfind("!")
    last_question = truncated.rfind("?")
    last_sentence = max(last_period, last_excl, last_question)

    if last_sentence > max_chars * 0.5:
        return truncated[:last_sentence + 1]

    # Fallback: corta na ultima palavra completa
    last_space = truncated.rfind(" ")
    if last_space > 0:
        return truncated[:last_space] + "..."

    return truncated + "..."


def _normalize_image_url(url: str) -> str:
    """Normaliza URL de imagem para formato compativel com Google Slides API.

    - Converte CDN webp para jpg (Google Slides nao suporta webp)
    - Extrai URL original de proxies de imagem
    - Limpa URLs truncadas (parenteses/filtros incompletos)
    """
    # glbimg CDN: extrai URL da imagem original antes de limpar
    # s2-g1.glbimg.com/.../filters:strip_icc()/i.s3.glbimg.com/... → i.s3.glbimg.com/...
    glb_match = re.search(r"(i\.s3\.glbimg\.com/.+)", url)
    if glb_match:
        return "https://" + glb_match.group(1)

    # Remove parenteses/filtros truncados no final (ex: filters:strip_icc( )
    url = re.sub(r"\([^)]*$", "", url).rstrip("/")

    # CDN metroimg: f:webp → f:jpg
    if "f:webp" in url:
        url = url.replace("f:webp", "f:jpg")

    # Imgproxy pattern: /plain/https://... → extrai URL original
    plain_match = re.search(r"/plain/(https?://[^\s]+)$", url)
    if plain_match:
        original = plain_match.group(1)
        # Se a URL original e uma imagem direta, usa ela
        if any(ext in original.lower() for ext in [".jpg", ".jpeg", ".png", ".gif"]):
            return original

    return url


