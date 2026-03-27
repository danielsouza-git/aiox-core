"""Processor de tarjas — gera PNGs de lower thirds.

Logica extraida da aba Epoch News do app de tarja (lower_novo39qr.py).
Reutiliza exatamente as mesmas posicoes, fontes, cores e algoritmos
de auto-ajuste de tamanho.

Suporta 4 tipos (todos com posicoes Epoch News):
- GIRO: template Epoch, tipo "GIRO DE NOTICIAS"
- COBERTURA: template Epoch, tipo "COBERTURA ESPECIAL"
- MIRA: template Epoch, tipo "NA MIRA DO MARCOS"
- SUPERCHATS: template Superchats, sem tipo, max_width reduzido (1590)
"""

import logging
import os
from dataclasses import dataclass
from typing import Callable, Optional
from PIL import Image, ImageDraw, ImageFont

from src.core.config import AppConfig
from src.core.models import Instruction, TarjaType
from src.processors.base import BaseProcessor

logger = logging.getLogger(__name__)


@dataclass
class TarjaConfig:
    """Configuracao de posicoes e cores para um tipo de tarja."""
    x_pos_tarja: int
    y_pos_tarja: int
    x_pos_apoio: int
    y_pos_apoio: int
    x_pos_tipo: Optional[int]
    y_pos_tipo: Optional[int]
    font_color_tarja: tuple[int, int, int]
    font_color_apoio: tuple[int, int, int]
    font_color_tipo: Optional[tuple[int, int, int]]
    show_tipo: bool
    max_width: int
    template_path: str


# Configuracoes extraidas do app original (lower_novo39qr.py)
EPOCH_CONFIG = TarjaConfig(
    x_pos_tarja=271,
    y_pos_tarja=885,
    x_pos_apoio=271,
    y_pos_apoio=1010,
    x_pos_tipo=271,
    y_pos_tipo=832,
    font_color_tarja=(0, 0, 0),
    font_color_apoio=(255, 255, 255),
    font_color_tipo=(233, 236, 238),
    show_tipo=True,
    max_width=1850,
    template_path="",  # Preenchido em runtime
)

# Max width reduzido quando Superchats ativo (aba Epoch News)
MAX_WIDTH_QR = 1590

# Tamanhos de fonte (identicos ao app original)
FONT_SIZE_TARJA_MAX = 87
FONT_SIZE_TARJA_MIN = 40
FONT_SIZE_APOIO_MAX = 40
FONT_SIZE_APOIO_MIN = 25
FONT_SIZE_TIPO = 40

# Mapeamento tipo de conteudo → texto exibido
TIPO_TEXTS = {
    TarjaType.GIRO: "GIRO DE NOTÍCIAS",
    TarjaType.COBERTURA: "COBERTURA ESPECIAL",
    TarjaType.MIRA: "NA MIRA DO MARCOS",
}


class TarjaProcessor(BaseProcessor):
    """Gera PNGs de tarja reutilizando a logica do app existente."""

    def __init__(self, config: AppConfig):
        self.config = config
        self._tarja_counter = 0

    def process(self, instruction: Instruction, on_progress: Optional[Callable] = None) -> str:
        """Gera PNG de tarja a partir de uma instrucao.

        Args:
            instruction: Instrucao do tipo TARJA com tarja_title, tarja_subtitle, tarja_type.
            on_progress: Callback de progresso.

        Returns:
            Path do PNG gerado (ou primeiro PNG se multiplos).
        """
        if on_progress:
            on_progress(0.1)

        tarja_type = instruction.tarja_type or TarjaType.GIRO
        title = instruction.tarja_title or ""
        subtitle = instruction.tarja_subtitle or ""

        # Se e tarja GIRO header sem subtitulo mas com conteudo do roteiro, gera via GPT
        if not subtitle and instruction.text and title == "MANCHETES DO BRASIL E DO MUNDO":
            if on_progress:
                on_progress(0.2)
            subtitle = self._generate_giro_subtitle(instruction.text)
            logger.info("Linha de apoio gerada via GPT: %s", subtitle)

        # Seleciona config e template
        tarja_config = self._get_tarja_config(tarja_type)

        if on_progress:
            on_progress(0.5)

        # Gera o PNG
        output_path = self._generate_png(
            title=title,
            subtitle=subtitle,
            tarja_type=tarja_type,
            tarja_config=tarja_config,
        )

        if on_progress:
            on_progress(1.0)

        return output_path

    def _generate_giro_subtitle(self, roteiro_content: str) -> str:
        """Gera linha de apoio para tarja GIRO usando GPT.

        Args:
            roteiro_content: Conteudo do roteiro do GIRO (secoes extraidas).

        Returns:
            Linha de apoio gerada (max 110 caracteres).
        """
        api_key = self.config.openai.api_key
        if not api_key:
            logger.warning("OpenAI API key nao configurada, linha de apoio ficara vazia")
            return ""

        try:
            from openai import OpenAI

            client = OpenAI(api_key=api_key)

            system_prompt = (
                "Atue como um jornalista sênior especializado na criação de linha de apoio para tarja.\n\n"
                "Com base no conteúdo fornecido pelo usuário, sua tarefa é criar a linha de apoio seguindo as diretrizes abaixo:\n\n"
                "Linha de apoio:\n"
                "- Gere 5 opções de linha de apoio.\n"
                "- A linha de apoio deve ser nesse formato: Irã e EUA iniciam negociações após tensão no Oriente Médio; "
                "Michelle Bachelet é indicada secretária-geral da ONU e+\n"
                "- Seja conciso. Deve ter no máximo 110 caracteres. No mínimo duas noticias separadas por ; e no final da linha de apoio colocar e+\n\n"
                "Regras importantes:\n"
                "- Evite qualquer viés político. O conteúdo deve ser neutro e imparcial, apolítico, sem tomar partido politico.\n"
                "- Não use perguntas nas manchetes ou textos da thumbnail.\n"
                "- As manchetes devem ser diretas.\n"
                "- Adapte o tom e o estilo conforme o tema fornecido, garantindo um resultado profissional.\n\n"
                "Respire fundo e desenvolva cada etapa com atenção e estratégia. "
                "Quero que escolha a melhor e responda SOMENTE com a linha de apoio escolhida, sem numeração, sem explicação, sem aspas."
            )

            response = client.chat.completions.create(
                model=self.config.video.translation_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": roteiro_content},
                ],
                temperature=0.7,
                max_tokens=150,
            )

            subtitle = response.choices[0].message.content.strip()

            # Valida minimo 2 noticias (deve ter ;)
            if ";" not in subtitle:
                logger.warning("Linha de apoio sem ';' (apenas 1 noticia): %s", subtitle)
                response2 = client.chat.completions.create(
                    model=self.config.video.translation_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": roteiro_content},
                        {"role": "assistant", "content": subtitle},
                        {"role": "user", "content": (
                            "A linha de apoio PRECISA ter no mínimo DUAS notícias separadas por ponto e vírgula (;) "
                            "e terminar com e+. Refaça seguindo este formato obrigatório: "
                            "Notícia 1; Notícia 2 e+"
                        )},
                    ],
                    temperature=0.7,
                    max_tokens=150,
                )
                subtitle = response2.choices[0].message.content.strip()

            # Garante max 110 caracteres
            if len(subtitle) > 110:
                truncated = subtitle[:110]
                last_semi = truncated.rfind(";")
                if last_semi > 20:
                    subtitle = truncated[:last_semi].strip() + " e+"
                else:
                    subtitle = truncated.rstrip() + " e+"

            # Garante que termina com e+
            if not subtitle.rstrip().endswith("e+"):
                subtitle = subtitle.rstrip()
                if subtitle.endswith(";"):
                    subtitle = subtitle[:-1].rstrip()
                subtitle += " e+"

            return subtitle

        except Exception as e:
            logger.error("Falha ao gerar linha de apoio via GPT: %s", e)
            return ""

    def generate(
        self,
        tarja_title: str,
        tarja_subtitle: str,
        tarja_type: TarjaType,
        output_name: Optional[str] = None,
    ) -> str:
        """API publica para gerar tarja sem precisar de Instruction.

        Args:
            tarja_title: Titulo principal (CAIXA ALTA).
            tarja_subtitle: Linha de apoio.
            tarja_type: Tipo de conteudo (giro, cobertura, mira, superchats).
            output_name: Nome do arquivo (sem extensao). Auto-gerado se None.

        Returns:
            Path do PNG gerado.
        """
        tarja_config = self._get_tarja_config(tarja_type)
        return self._generate_png(
            title=tarja_title,
            subtitle=tarja_subtitle,
            tarja_type=tarja_type,
            tarja_config=tarja_config,
            output_name=output_name,
        )

    def _get_tarja_config(self, tarja_type: TarjaType) -> TarjaConfig:
        """Retorna configuracao de posicoes/cores para o tipo de tarja.

        Todos os tipos usam posicoes da aba Epoch News (lower_novo39qr.py).
        - GIRO, COBERTURA, MIRA: template Epoch, show_tipo=True, max_width=1850
        - SUPERCHATS: template Superchats, show_tipo=False, max_width=1590
        """
        cfg = TarjaConfig(**vars(EPOCH_CONFIG))

        if tarja_type == TarjaType.SUPERCHATS:
            cfg.template_path = self.config.paths.tarja_template_superchats
            cfg.show_tipo = False
            cfg.max_width = MAX_WIDTH_QR
        else:
            cfg.template_path = self.config.paths.tarja_template_epoch

        return cfg

    def _generate_png(
        self,
        title: str,
        subtitle: str,
        tarja_type: TarjaType,
        tarja_config: TarjaConfig,
        output_name: Optional[str] = None,
    ) -> str:
        """Gera o PNG da tarja (logica core extraida do app original)."""
        # Abre imagem template
        if not os.path.exists(tarja_config.template_path):
            raise FileNotFoundError(
                f"Template de tarja nao encontrado: {tarja_config.template_path}"
            )

        with Image.open(tarja_config.template_path) as original_img:
            img = original_img.copy()

        draw = ImageDraw.Draw(img)

        # 1. Desenha texto do tipo (GIRO DE NOTICIAS, etc.) — apenas quando show_tipo
        if tarja_config.show_tipo and tarja_config.x_pos_tipo is not None:
            font_tipo = ImageFont.truetype(self.config.paths.font_tarja_semibold, FONT_SIZE_TIPO)
            tipo_text = TIPO_TEXTS.get(tarja_type, "GIRO DE NOTÍCIAS")

            metrics = self._get_text_metrics(tipo_text, font_tipo)
            if tarja_config.x_pos_tipo + metrics["width"] <= tarja_config.max_width:
                draw.text(
                    (tarja_config.x_pos_tipo, tarja_config.y_pos_tipo),
                    tipo_text,
                    font=font_tipo,
                    fill=tarja_config.font_color_tipo,
                )

        # 2. Desenha tarja principal (com auto-ajuste de tamanho)
        tarja_text = title.upper()
        best_font, adjusted_y = self._get_best_font_size_with_position(
            text=tarja_text,
            font_path=self.config.paths.font_tarja_bold,
            max_size=FONT_SIZE_TARJA_MAX,
            min_size=FONT_SIZE_TARJA_MIN,
            x_pos=tarja_config.x_pos_tarja,
            original_y_pos=tarja_config.y_pos_tarja,
            max_width=tarja_config.max_width,
        )

        if best_font is None:
            raise ValueError(f"Texto da tarja muito longo: '{tarja_text}'")

        draw.text(
            (tarja_config.x_pos_tarja, adjusted_y),
            tarja_text,
            font=best_font,
            fill=tarja_config.font_color_tarja,
        )

        # 3. Desenha linha de apoio (se preenchida)
        if subtitle.strip():
            best_font_apoio, adjusted_y_apoio = self._get_best_font_size_with_position(
                text=subtitle,
                font_path=self.config.paths.font_tarja_regular,
                max_size=FONT_SIZE_APOIO_MAX,
                min_size=FONT_SIZE_APOIO_MIN,
                x_pos=tarja_config.x_pos_apoio,
                original_y_pos=tarja_config.y_pos_apoio,
                max_width=tarja_config.max_width,
            )

            if best_font_apoio is None:
                raise ValueError(f"Texto da linha de apoio muito longo: '{subtitle}'")

            draw.text(
                (tarja_config.x_pos_apoio, adjusted_y_apoio),
                subtitle,
                font=best_font_apoio,
                fill=tarja_config.font_color_apoio,
            )

        # 4. Salva PNG
        if output_name is None:
            is_giro_header = (
                tarja_type == TarjaType.GIRO
                and title == "MANCHETES DO BRASIL E DO MUNDO"
            )
            output_name = self._auto_name(tarja_type, is_giro_header=is_giro_header)

        output_path = os.path.join(self.config.paths.output_dir, f"{output_name}.png")
        img.save(output_path, "PNG")

        return output_path

    def _auto_name(self, tarja_type: TarjaType, is_giro_header: bool = False) -> str:
        """Gera nome automatico para o arquivo de tarja."""
        if is_giro_header:
            return "giro"
        self._tarja_counter += 1
        return f"lt{self._tarja_counter}"

    @staticmethod
    def _get_text_metrics(text: str, font: ImageFont.FreeTypeFont) -> dict:
        """Calcula metricas do texto (identico ao app original)."""
        temp_img = Image.new("RGBA", (2000, 200), (255, 255, 255, 0))
        temp_draw = ImageDraw.Draw(temp_img)
        bbox = temp_draw.textbbox((0, 0), text, font=font)
        return {
            "width": bbox[2] - bbox[0],
            "height": bbox[3] - bbox[1],
            "bbox": bbox,
        }

    def _get_best_font_size_with_position(
        self,
        text: str,
        font_path: str,
        max_size: int,
        min_size: int,
        x_pos: int,
        original_y_pos: int,
        max_width: int,
    ) -> tuple[Optional[ImageFont.FreeTypeFont], Optional[int]]:
        """Encontra o melhor tamanho de fonte com ajuste de posicao Y.

        Logica identica ao app original:
        - Reduz fonte de 1 em 1 ate caber
        - Ajusta Y: a cada reducao de fonte, desloca +1 pixel para cada 1.4pt reduzidos
        """
        font_size = max_size

        while font_size >= min_size:
            try:
                current_font = ImageFont.truetype(font_path, font_size)
                metrics = self._get_text_metrics(text, current_font)

                if x_pos + metrics["width"] <= max_width:
                    font_reduction = max_size - font_size
                    y_adjustment = int(font_reduction // 1.4)
                    adjusted_y_pos = original_y_pos + y_adjustment
                    return current_font, adjusted_y_pos

            except Exception:
                pass

            font_size -= 1

        return None, None
