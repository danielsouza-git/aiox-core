"""Cliente Google Slides API — duplica slides e substitui conteudo.

Estrategia: nunca cria slides do zero. Sempre duplica um slide template
existente e substitui os elementos (texto, imagens).
"""

import logging
import time
from typing import Optional

logger = logging.getLogger(__name__)

# Retry config para rate limit (429)
MAX_RETRIES = 5
RETRY_BASE_DELAY = 20  # segundos — rate limit e por minuto


# Constantes de unidade EMU (English Metric Units)
# Google Slides usa EMU: 1 inch = 914400 EMU, 1 pt = 12700 EMU
EMU_PER_PT = 12700
EMU_PER_INCH = 914400

# Dimensoes padrao de slide (16:9, 10x5.625 inches)
SLIDE_WIDTH_EMU = 9144000   # 10 inches
SLIDE_HEIGHT_EMU = 5143500  # 5.625 inches


class SlidesClient:
    """Interface para operacoes no Google Slides API."""

    def __init__(self, service):
        """Args: service — objeto retornado por build_slides_service()."""
        self.service = service

    def _execute_with_retry(self, request):
        """Executa request com retry automatico para rate limit (429).

        Usa exponential backoff: 20s, 40s, 60s, 80s, 100s
        """
        for attempt in range(MAX_RETRIES + 1):
            try:
                return request.execute()
            except Exception as e:
                error_str = str(e)
                is_rate_limit = "429" in error_str or "rateLimitExceeded" in error_str
                if is_rate_limit and attempt < MAX_RETRIES:
                    delay = RETRY_BASE_DELAY * (attempt + 1)
                    logger.warning(
                        "Rate limit (429), aguardando %ds antes de retry (%d/%d). "
                        "Dica: considere reduzir slides simultaneos.",
                        delay, attempt + 1, MAX_RETRIES,
                    )
                    time.sleep(delay)
                    continue
                raise

    def _batch_update(self, presentation_id: str, requests: list[dict]) -> dict:
        """Executa batchUpdate com retry para rate limit."""
        req = self.service.presentations().batchUpdate(
            presentationId=presentation_id,
            body={"requests": requests},
        )
        return self._execute_with_retry(req)

    def get_presentation(self, presentation_id: str) -> dict:
        """Retorna dados completos da apresentacao."""
        return self.service.presentations().get(
            presentationId=presentation_id
        ).execute()

    def get_slide_ids(self, presentation_id: str) -> list[str]:
        """Retorna IDs de todos os slides da apresentacao."""
        pres = self.get_presentation(presentation_id)
        return [slide["objectId"] for slide in pres.get("slides", [])]

    def get_slide_elements(self, presentation_id: str, slide_id: str) -> list[dict]:
        """Retorna elementos de um slide especifico."""
        pres = self.get_presentation(presentation_id)
        for slide in pres.get("slides", []):
            if slide["objectId"] == slide_id:
                return slide.get("pageElements", [])
        return []

    def duplicate_slide(self, presentation_id: str, slide_id: str) -> str:
        """Duplica um slide e retorna o ID do novo slide."""
        requests = [{
            "duplicateObject": {
                "objectId": slide_id,
            }
        }]

        response = self._batch_update(presentation_id, requests)

        replies = response.get("replies", [])
        if replies:
            return replies[0]["duplicateObject"]["objectId"]

        raise RuntimeError("Falha ao duplicar slide — sem reply")

    def replace_text(
        self,
        presentation_id: str,
        slide_id: str,
        placeholder: str,
        new_text: str,
    ) -> None:
        """Substitui texto de placeholder em um slide."""
        requests = [{
            "replaceAllText": {
                "containsText": {
                    "text": placeholder,
                    "matchCase": True,
                },
                "replaceText": new_text,
                "pageObjectIds": [slide_id],
            }
        }]

        self._batch_update(presentation_id, requests)

    def replace_text_with_style(
        self,
        presentation_id: str,
        element_id: str,
        new_text: str,
        font_size_pt: Optional[int] = None,
        bold: Optional[bool] = None,
        font_family: Optional[str] = None,
        color_rgb: Optional[tuple[float, float, float]] = None,
    ) -> None:
        """Substitui texto de um elemento com estilo customizado."""
        requests = []

        requests.append({
            "deleteText": {
                "objectId": element_id,
                "textRange": {"type": "ALL"},
            }
        })

        requests.append({
            "insertText": {
                "objectId": element_id,
                "insertionIndex": 0,
                "text": new_text,
            }
        })

        style = {}
        fields = []

        if font_size_pt is not None:
            style["fontSize"] = {"magnitude": font_size_pt, "unit": "PT"}
            fields.append("fontSize")

        if bold is not None:
            style["bold"] = bold
            fields.append("bold")

        if font_family is not None:
            style["fontFamily"] = font_family
            fields.append("fontFamily")

        if color_rgb is not None:
            style["foregroundColor"] = {
                "opaqueColor": {
                    "rgbColor": {
                        "red": color_rgb[0],
                        "green": color_rgb[1],
                        "blue": color_rgb[2],
                    }
                }
            }
            fields.append("foregroundColor")

        if style:
            requests.append({
                "updateTextStyle": {
                    "objectId": element_id,
                    "style": style,
                    "textRange": {"type": "ALL"},
                    "fields": ",".join(fields),
                }
            })

        self._batch_update(presentation_id, requests)

    def insert_image(
        self,
        presentation_id: str,
        slide_id: str,
        image_url: str,
        x_emu: int,
        y_emu: int,
        width_emu: int,
        height_emu: int,
        replace_element_id: Optional[str] = None,
    ) -> str:
        """Insere imagem em um slide."""
        requests = []

        if replace_element_id:
            requests.append({
                "deleteObject": {"objectId": replace_element_id}
            })

        requests.append({
            "createImage": {
                "url": image_url,
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {
                        "width": {"magnitude": width_emu, "unit": "EMU"},
                        "height": {"magnitude": height_emu, "unit": "EMU"},
                    },
                    "transform": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "translateX": x_emu,
                        "translateY": y_emu,
                        "unit": "EMU",
                    },
                },
            }
        })

        response = self._batch_update(presentation_id, requests)

        image_object_id = ""
        replies = response.get("replies", [])
        for reply in replies:
            if "createImage" in reply:
                image_object_id = reply["createImage"]["objectId"]
                break

        return image_object_id

    def set_image_border(
        self,
        presentation_id: str,
        image_object_id: str,
        weight_pt: float = 2.0,
        color_rgb: tuple[float, float, float] = (0.0, 0.0, 0.0),
    ) -> None:
        """Adiciona borda a uma imagem."""
        requests = [{
            "updateImageProperties": {
                "objectId": image_object_id,
                "imageProperties": {
                    "outline": {
                        "outlineFill": {
                            "solidFill": {
                                "color": {
                                    "rgbColor": {
                                        "red": color_rgb[0],
                                        "green": color_rgb[1],
                                        "blue": color_rgb[2],
                                    }
                                }
                            }
                        },
                        "weight": {"magnitude": weight_pt, "unit": "PT"},
                        "dashStyle": "SOLID",
                    }
                },
                "fields": "outline",
            }
        }]

        self._batch_update(presentation_id, requests)

    def insert_image_fullscreen(
        self,
        presentation_id: str,
        slide_id: str,
        image_url: str,
    ) -> str:
        """Insere imagem ocupando 100% do slide (Tipo 4)."""
        return self.insert_image(
            presentation_id=presentation_id,
            slide_id=slide_id,
            image_url=image_url,
            x_emu=0,
            y_emu=0,
            width_emu=SLIDE_WIDTH_EMU,
            height_emu=SLIDE_HEIGHT_EMU,
        )

    def delete_slide(self, presentation_id: str, slide_id: str) -> None:
        """Deleta um slide da apresentacao."""
        requests = [{
            "deleteObject": {"objectId": slide_id}
        }]

        self._batch_update(presentation_id, requests)

    def move_slide(
        self,
        presentation_id: str,
        slide_id: str,
        insertion_index: int,
    ) -> None:
        """Move slide para uma posicao especifica."""
        requests = [{
            "updateSlidesPosition": {
                "slideObjectIds": [slide_id],
                "insertionIndex": insertion_index,
            }
        }]

        self._batch_update(presentation_id, requests)

    def batch_update(self, presentation_id: str, requests: list[dict]) -> dict:
        """Executa multiplas operacoes em batch (ate 100 por request)."""
        return self._batch_update(presentation_id, requests)

    def find_elements_by_text(
        self,
        presentation_id: str,
        slide_id: str,
        search_text: str,
    ) -> list[dict]:
        """Encontra elementos de texto que contem um placeholder.

        Returns:
            Lista de dicts com 'objectId', 'text', 'transform', 'size'.
        """
        elements = self.get_slide_elements(presentation_id, slide_id)
        results = []

        for el in elements:
            if "shape" in el and "text" in el.get("shape", {}):
                full_text = ""
                for text_el in el["shape"]["text"].get("textElements", []):
                    if "textRun" in text_el:
                        full_text += text_el["textRun"].get("content", "")

                if search_text in full_text:
                    results.append({
                        "objectId": el["objectId"],
                        "text": full_text.strip(),
                        "transform": el.get("transform", {}),
                        "size": el.get("size", {}),
                    })

        return results
