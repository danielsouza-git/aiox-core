"""Parser de estrutura — extrai blocos de noticias da pauta."""

import re
from src.core.models import NewsBlock


# Delimitadores de bloco de noticia
BLOCK_SEPARATOR = re.compile(r"^[—\-]{3,}|^[═]{3,}", re.MULTILINE)

# Responsavel entre colchetes: [Igor], [Angela], [Marcos]
RESPONSIBLE_PATTERN = re.compile(r"\[([A-Za-zÀ-ÿ]+)\]\s*$")


def parse_structure(elements: list[dict]) -> list[NewsBlock]:
    """Extrai blocos de noticias a partir dos elementos do Google Docs.

    Estrutura esperada:
    - H1 "PAUTA" (ignorado ou bloco cabecalho)
    - H1 "Nome da Noticia" → inicio de bloco
    - Linhas de instrucoes (mostrar, legendar, etc.)
    - Tarja (duas linhas: CAPS + subtitulo)
    - Tabela (coluna 0 = B-rolls, coluna 1 = roteiro)
    - H1 "GIRO" → bloco especial com tarjas do giro
    - Separadores (tracos) tambem delimitam blocos
    """
    blocks: list[NewsBlock] = []
    current_block: NewsBlock | None = None
    current_lines: list[str] = []

    for element in elements:
        text = element.get("text", "")
        heading = element.get("heading")
        table_column = element.get("table_column")

        # Detecta separador de bloco (tracos)
        if _is_separator(text):
            if current_block and current_lines:
                current_block.raw_text = "\n".join(current_lines)
                blocks.append(current_block)
                current_block = None
                current_lines = []
            continue

        # H1 headings delimitam blocos de noticias
        if heading and heading == "HEADING_1":
            # Salva bloco anterior se existir
            if current_block and current_lines:
                current_block.raw_text = "\n".join(current_lines)
                blocks.append(current_block)

            title, responsible = _extract_title_and_responsible(text)

            # Ignora H1 "PAUTA" como bloco — e apenas cabecalho
            if title.strip().upper() == "PAUTA":
                current_block = None
                current_lines = []
                continue

            current_block = NewsBlock(
                title=title,
                responsible=responsible,
            )
            current_lines = []
            continue

        # Outros headings (H2, H3) como sub-delimitadores
        if heading and heading in ("HEADING_2", "HEADING_3"):
            if not current_block:
                title, responsible = _extract_title_and_responsible(text)
                current_block = NewsBlock(title=title, responsible=responsible)
                current_lines = []
                continue

        # Conteudo de tabela — marca com prefixo para o classifier
        if table_column is not None:
            if current_block:
                if table_column == 0:
                    # Coluna esquerda = B-rolls/instrucoes
                    enriched = _enrich_text_with_image_urls(text, element)
                    current_lines.append(enriched)
                else:
                    # Coluna direita = roteiro (ignorada pelo classifier)
                    current_lines.append(f"[ROTEIRO] {text}")
            continue

        # Detecta inicio de bloco por titulo com responsavel (sem heading)
        if not current_block and _is_block_title(text, element):
            title, responsible = _extract_title_and_responsible(text)
            current_block = NewsBlock(title=title, responsible=responsible)
            current_lines = [text]
            continue

        # Detecta novo bloco inline (titulo com [Responsavel] dentro de bloco existente)
        if current_block and RESPONSIBLE_PATTERN.search(text) and not text.startswith(" "):
            # Salva bloco anterior
            if current_lines:
                current_block.raw_text = "\n".join(current_lines)
                blocks.append(current_block)

            title, responsible = _extract_title_and_responsible(text)
            current_block = NewsBlock(title=title, responsible=responsible)
            current_lines = [text]
            continue

        # Acumula texto no bloco atual
        if current_block:
            enriched = _enrich_text_with_image_urls(text, element)
            current_lines.append(enriched)
        elif text.strip():
            # Texto antes do primeiro bloco — cria bloco generico
            if _looks_like_title(text):
                title, responsible = _extract_title_and_responsible(text)
                current_block = NewsBlock(title=title, responsible=responsible)
                current_lines = [text]

    # Salva ultimo bloco
    if current_block and current_lines:
        current_block.raw_text = "\n".join(current_lines)
        blocks.append(current_block)

    return blocks


def _enrich_text_with_image_urls(text: str, element: dict) -> str:
    """Adiciona URLs de imagens inline do Google Docs ao texto.

    Quando o doc tem 'Mostrar imagem: 1' com imagens embutidas,
    as URLs das imagens estao nos links do elemento mas nao no texto.
    Esta funcao as embute no texto para que o classifier possa extrair.
    """
    links = element.get("links", [])
    if not links:
        return text

    image_urls = [
        link["url"] for link in links
        if link.get("text") == "[image]" and link.get("url")
    ]

    if not image_urls:
        # Links normais (nao imagens) — tambem adiciona se nao estiverem no texto
        for link in links:
            url = link.get("url", "")
            if url and url.startswith("http") and url not in text:
                text = text + " " + url
        return text

    # Substitui referencias numericas por URLs de imagens
    return text + " " + " ".join(image_urls)


def _is_separator(text: str) -> bool:
    """Verifica se a linha e um separador de bloco."""
    stripped = text.strip()
    if not stripped:
        return False
    if re.match(r"^[—\-─═_]{3,}\s*$", stripped):
        return True
    return False


def _is_block_title(text: str, element: dict) -> bool:
    """Verifica se o texto parece ser titulo de um bloco de noticia."""
    if not text.strip():
        return False
    # Linhas com indentacao sao tarjas, nao titulos
    if text.startswith(" ") or text.startswith("\t"):
        return False
    # Tem responsavel: "Titulo da noticia [Igor]"
    if RESPONSIBLE_PATTERN.search(text):
        return True
    # E bold e curto (possivel titulo)
    if element.get("is_bold") and len(text) < 200:
        return True
    return False


def _looks_like_title(text: str) -> bool:
    """Heuristica para detectar se texto parece titulo."""
    stripped = text.strip()
    if not stripped:
        return False
    if len(stripped) < 200 and not stripped.startswith("http"):
        return True
    return False


def _extract_title_and_responsible(text: str) -> tuple[str, str | None]:
    """Extrai titulo e responsavel de uma linha."""
    match = RESPONSIBLE_PATTERN.search(text)
    if match:
        responsible = match.group(1)
        title = text[:match.start()].strip()
        return title, responsible
    return text.strip(), None
