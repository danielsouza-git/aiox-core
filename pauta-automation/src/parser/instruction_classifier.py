"""Classificador de instrucoes — identifica tipo de cada instrucao na pauta."""

import re
from src.core.models import (
    Instruction,
    InstructionType,
    NewsBlock,
    Platform,
    TarjaType,
    TimeCode,
    VideoClip,
)

# Patterns de deteccao
PATTERNS = {
    "slide_post": re.compile(
        r"(?i)mostrar\s+(postagem|post)\s*:?\s*", re.IGNORECASE
    ),
    "slide_news": re.compile(
        r"(?i)mostrar\s+(reportagem|mat[eé]ria)\s*:?\s*", re.IGNORECASE
    ),
    "slide_image_single": re.compile(
        r"(?i)mostrar\s+imagem\s*:?\s*", re.IGNORECASE
    ),
    "slide_image_sequence": re.compile(
        r"(?i)mostrar\s+imagens\s+em\s+sequ[eê]ncia\s*:?\s*", re.IGNORECASE
    ),
    "video_subtitle": re.compile(
        r"(?i)legendar", re.IGNORECASE
    ),
    "video_show": re.compile(
        r"(?i)(mostrar\s+(apenas\s+o\s+)?v[ií]deo)", re.IGNORECASE
    ),
    "broll": re.compile(
        r"(?i)b-?roll\s*:?\s*", re.IGNORECASE
    ),
    "tarja_delimiter": re.compile(
        r"/{5,}(.+?)/{5,}", re.DOTALL
    ),
}

# Timecodes: "TC 0:34 até 0:44", "TC 4:38 ao 5:26", "(38:40-39:45)"
TIMECODE_PATTERN = re.compile(
    r"(?:TC\s+)?(\d{1,2}[:.]\d{2})\s*(?:at[eé]|ao|[-–])\s*(\d{1,2}[:.]\d{2})",
    re.IGNORECASE,
)

# URLs
URL_PATTERN = re.compile(r"https?://[^\s\]\"]+")

# Plataformas por URL
PLATFORM_PATTERNS = {
    Platform.X: re.compile(r"(?:twitter\.com|x\.com)/", re.IGNORECASE),
    Platform.TRUTH: re.compile(r"truthsocial\.com/", re.IGNORECASE),
    Platform.INSTAGRAM: re.compile(r"instagram\.com/", re.IGNORECASE),
    Platform.TELEGRAM: re.compile(r"t\.me/", re.IGNORECASE),
}

# Linhas que sao instrucoes (nao tarjas)
INSTRUCTION_KEYWORDS = re.compile(
    r"(?i)^(mostrar|legendar|b-?roll|TC\s+\d)",
)


def classify_instructions(block: NewsBlock, global_order: int) -> tuple[list[Instruction], int]:
    """Classifica instrucoes dentro de um bloco de noticia.

    Retorna (lista de instrucoes, proximo valor de global_order).
    """
    instructions: list[Instruction] = []
    order = global_order
    lines = block.raw_text.split("\n")
    is_giro = _is_giro_block(block)

    # Se bloco GIRO, gera tarja automatica com conteudo do roteiro
    if is_giro:
        roteiro_content = _extract_giro_roteiro_content(lines)
        instr = Instruction(
            type=InstructionType.TARJA,
            news_block=block.title,
            order=order,
            tarja_title="MANCHETES DO BRASIL E DO MUNDO",
            tarja_subtitle="",
            tarja_type=TarjaType.GIRO,
            text=roteiro_content,  # Conteudo do roteiro para gerar linha de apoio via GPT
        )
        instructions.append(instr)
        order += 1

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # Ignora linhas de roteiro (coluna direita da tabela)
        if stripped.startswith("[ROTEIRO]"):
            i += 1
            continue

        # Detecta tarjas (blocos entre /////)
        tarja_match = PATTERNS["tarja_delimiter"].search(stripped)
        if tarja_match:
            tarja_text = tarja_match.group(1).strip()
            if tarja_text:
                instr = _create_tarja_instruction(tarja_text, block, order)
                if instr:
                    instructions.append(instr)
                    order += 1
            i += 1
            continue

        # Detecta tarjas por formato: linha em CAIXA ALTA + linha seguinte em caixa normal
        # Nao detecta se a linha e uma instrucao (mostrar, legendar, etc.)
        if _is_tarja_format(line, lines, i):
            title = stripped
            subtitle = lines[i + 1].strip() if i + 1 < len(lines) else ""
            # Pula subtitulo se for instrucao ou roteiro
            if subtitle.startswith("[ROTEIRO]") or INSTRUCTION_KEYWORDS.match(subtitle):
                subtitle = ""
                skip = 1
            else:
                skip = 2
            instr = Instruction(
                type=InstructionType.TARJA,
                news_block=block.title,
                order=order,
                tarja_title=title,
                tarja_subtitle=subtitle,
                tarja_type=_detect_tarja_type(block, subtitle),
            )
            instructions.append(instr)
            order += 1
            i += skip
            continue

        # Detecta tarjas inline: TITULO EM CAPS seguido de subtitulo na mesma linha
        inline_tarja = _try_split_inline_tarja(stripped)
        if inline_tarja:
            title, subtitle = inline_tarja
            instr = Instruction(
                type=InstructionType.TARJA,
                news_block=block.title,
                order=order,
                tarja_title=title,
                tarja_subtitle=subtitle,
                tarja_type=_detect_tarja_type(block, subtitle),
            )
            instructions.append(instr)
            order += 1
            i += 1
            continue

        # Detecta slides de postagem
        if PATTERNS["slide_post"].search(stripped):
            urls = _extract_urls(stripped, lines, i)
            for url in urls:
                platform = _detect_platform(url)
                if platform == Platform.UNKNOWN:
                    # URL nao e de plataforma conhecida — trata como imagem (print de post)
                    instr = Instruction(
                        type=InstructionType.SLIDE_PARTIAL,
                        news_block=block.title,
                        order=order,
                        url=url,
                        urls=[url],
                    )
                else:
                    instr = Instruction(
                        type=InstructionType.SLIDE_POST,
                        news_block=block.title,
                        order=order,
                        url=url,
                        platform=platform,
                    )
                instructions.append(instr)
                order += 1
            i += 1
            continue

        # Detecta slides de imagem em sequencia
        if PATTERNS["slide_image_sequence"].search(stripped):
            urls = _extract_urls(stripped, lines, i)
            instr = Instruction(
                type=InstructionType.SLIDE_PARTIAL,
                news_block=block.title,
                order=order,
                urls=urls,
            )
            instructions.append(instr)
            order += 1
            i += 1
            continue

        # Detecta slides de imagem unica — sempre usa SLIDE_PARTIAL
        if PATTERNS["slide_image_single"].search(stripped):
            urls = _extract_urls(stripped, lines, i)
            for url in urls:
                instr = Instruction(
                    type=InstructionType.SLIDE_PARTIAL,
                    news_block=block.title,
                    order=order,
                    url=url,
                    urls=[url],
                )
                instructions.append(instr)
                order += 1
            i += 1
            continue

        # Detecta slides de noticia
        if PATTERNS["slide_news"].search(stripped):
            urls = _extract_urls(stripped, lines, i)
            # Verifica se tem texto traduzido proximo
            translated = _find_translated_text(lines, i)
            for url in urls:
                instr_type = (
                    InstructionType.SLIDE_NEWS_WITH_TEXT
                    if translated
                    else InstructionType.SLIDE_NEWS_NO_TEXT
                )
                instr = Instruction(
                    type=instr_type,
                    news_block=block.title,
                    order=order,
                    url=url,
                    translated_text=translated,
                )
                instructions.append(instr)
                order += 1
            i += 1
            continue

        # Detecta video com legenda
        if PATTERNS["video_subtitle"].search(stripped):
            urls = _extract_urls(stripped, lines, i)
            timecodes = TIMECODE_PATTERN.findall(stripped)
            merge = "juntar" in stripped.lower() or "e juntar" in stripped.lower()

            clips = []
            for tc_start, tc_end in timecodes:
                clips.append(VideoClip(
                    url=urls[0] if urls else "",
                    timecode=TimeCode(
                        start=_normalize_timecode(tc_start),
                        end=_normalize_timecode(tc_end),
                    ),
                ))

            if clips:
                instr = Instruction(
                    type=InstructionType.VIDEO_SUBTITLE,
                    news_block=block.title,
                    order=order,
                    url=urls[0] if urls else None,
                    clips=clips,
                    merge=merge,
                    timecode=clips[0].timecode if clips else None,
                )
                instructions.append(instr)
                order += 1
            elif urls:
                instr = Instruction(
                    type=InstructionType.VIDEO_SUBTITLE,
                    news_block=block.title,
                    order=order,
                    url=urls[0],
                )
                instructions.append(instr)
                order += 1
            i += 1
            continue

        # Detecta "Mostrar video" (sempre video)
        if PATTERNS["video_show"].search(stripped):
            urls = _extract_urls(stripped, lines, i)
            timecodes = TIMECODE_PATTERN.findall(stripped)
            for url in urls:
                tc = None
                if timecodes:
                    tc = TimeCode(
                        start=_normalize_timecode(timecodes[0][0]),
                        end=_normalize_timecode(timecodes[0][1]),
                    )
                instr = Instruction(
                    type=InstructionType.VIDEO_ONLY,
                    news_block=block.title,
                    order=order,
                    url=url,
                    timecode=tc,
                )
                instructions.append(instr)
                order += 1

        # Detecta B-ROLL — classifica pela URL (nem todo B-roll e video)
        elif PATTERNS["broll"].search(stripped):
            urls = _extract_urls(stripped, lines, i)
            timecodes = TIMECODE_PATTERN.findall(stripped)
            for url in urls:
                instr = _classify_broll_url(url, block, order, timecodes)
                instructions.append(instr)
                order += 1
            i += 1
            continue

        i += 1

    return instructions, order


IMAGE_URL_PATTERN = re.compile(
    r"\.(?:png|jpg|jpeg|webp|gif|bmp|svg|ico)(?:\?|$)|"
    r"(?:pbs\.twimg\.com|i\.imgur\.com|glbimg\.com|metroimg\.com|theepochtimes\.com/_next/image)",
    re.IGNORECASE,
)

# Plataformas de rede social (URLs que em B-ROLL sao video)
SOCIAL_PLATFORM_PATTERN = re.compile(
    r"(?:twitter\.com|x\.com|instagram\.com|t\.me|truthsocial\.com|youtube\.com|youtu\.be)/",
    re.IGNORECASE,
)


def _classify_broll_url(
    url: str, block: NewsBlock, order: int, timecodes: list[tuple]
) -> Instruction:
    """Classifica URL de B-ROLL pelo tipo de conteudo.

    - Rede social → video_only
    - URL de imagem → slide_partial
    - Outros (noticias, governo, etc.) → slide_news
    """
    if SOCIAL_PLATFORM_PATTERN.search(url):
        tc = None
        if timecodes:
            tc = TimeCode(
                start=_normalize_timecode(timecodes[0][0]),
                end=_normalize_timecode(timecodes[0][1]),
            )
        return Instruction(
            type=InstructionType.VIDEO_ONLY,
            news_block=block.title,
            order=order,
            url=url,
            timecode=tc,
        )

    if IMAGE_URL_PATTERN.search(url):
        return Instruction(
            type=InstructionType.SLIDE_PARTIAL,
            news_block=block.title,
            order=order,
            url=url,
            urls=[url],
        )

    # Default: pagina web (noticia, governo, documento) → slide_news
    return Instruction(
        type=InstructionType.SLIDE_NEWS_NO_TEXT,
        news_block=block.title,
        order=order,
        url=url,
    )


def _extract_urls(line: str, lines: list[str], current_index: int) -> list[str]:
    """Extrai URLs da linha atual e da proxima (se a URL estiver na proxima linha)."""
    urls = URL_PATTERN.findall(line)
    # Verifica proxima linha tambem (URL pode estar na linha seguinte)
    if not urls and current_index + 1 < len(lines):
        next_line = lines[current_index + 1].strip()
        if next_line.startswith("http"):
            urls = URL_PATTERN.findall(next_line)
    return urls


def _detect_platform(url: str) -> Platform:
    """Detecta plataforma a partir da URL."""
    for platform, pattern in PLATFORM_PATTERNS.items():
        if pattern.search(url):
            return platform
    return Platform.UNKNOWN


def _is_giro_block(block: NewsBlock) -> bool:
    """Verifica se o bloco e do 'giro de noticias'."""
    title_lower = block.title.lower()
    return "giro" in title_lower or "manchetes" in title_lower


def _is_tarja_format(line: str, lines: list[str], index: int) -> bool:
    """Verifica se a linha + proxima formam uma tarja (CAPS + subtitulo).

    Tarja no documento: duas linhas consecutivas
    - Linha 1: CAIXA ALTA (>80% uppercase) = linha principal
    - Linha 2: caixa normal = linha de apoio
    """
    stripped = line.strip()
    if not stripped or len(stripped) < 10:
        return False

    # Nao e tarja se for instrucao (mostrar, legendar, etc.)
    if INSTRUCTION_KEYWORDS.match(stripped):
        return False

    # Nao e tarja se for roteiro
    if stripped.startswith("[ROTEIRO]"):
        return False

    # Verifica se >80% dos caracteres alfabeticos sao uppercase
    alpha_chars = [c for c in stripped if c.isalpha()]
    if not alpha_chars:
        return False

    upper_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
    if upper_ratio < 0.8:
        return False

    # Proxima linha deve existir e nao ser CAPS (e o subtitulo)
    if index + 1 < len(lines):
        next_line = lines[index + 1].strip()
        if next_line and not next_line.startswith("[ROTEIRO]"):
            next_alpha = [c for c in next_line if c.isalpha()]
            if next_alpha:
                next_upper_ratio = sum(1 for c in next_alpha if c.isupper()) / len(next_alpha)
                if next_upper_ratio < 0.5:
                    return True

    return False


def _try_split_inline_tarja(text: str) -> tuple[str, str] | None:
    """Detecta tarja inline: TITULO EM CAPS seguido de subtitulo na mesma linha.

    Ex: "MUSK UNE SPACEX E XAI: ANALISE Marcos: implicacoes saem dos negocios..."
    Retorna (titulo_caps, subtitulo) ou None se nao for tarja inline.
    """
    if not text or len(text) < 15:
        return None

    # Nao e tarja se for instrucao
    if INSTRUCTION_KEYWORDS.match(text):
        return None
    if text.startswith("[ROTEIRO]"):
        return None

    # Separa palavras e encontra onde a transicao CAPS → mixed acontece
    words = text.split()
    if len(words) < 3:
        return None

    caps_end = 0
    for idx, word in enumerate(words):
        # Remove pontuacao para checar case
        clean = ''.join(c for c in word if c.isalpha())
        if not clean:
            caps_end = idx + 1
            continue
        upper_ratio = sum(1 for c in clean if c.isupper()) / len(clean)
        if upper_ratio >= 0.8:
            caps_end = idx + 1
        else:
            break

    # Precisa ter pelo menos 3 palavras CAPS e algo depois
    if caps_end < 3 or caps_end >= len(words):
        return None

    title = " ".join(words[:caps_end])
    subtitle = " ".join(words[caps_end:])

    # Titulo precisa ter pelo menos 10 chars
    if len(title) < 10:
        return None

    return title, subtitle


def _create_tarja_instruction(text: str, block: NewsBlock, order: int) -> Instruction | None:
    """Cria instrucao de tarja a partir de texto entre delimitadores /////."""
    lines = text.strip().split("\n")
    if not lines:
        return None

    title = lines[0].strip()
    subtitle = lines[1].strip() if len(lines) > 1 else ""

    if not title:
        return None

    return Instruction(
        type=InstructionType.TARJA,
        news_block=block.title,
        order=order,
        tarja_title=title,
        tarja_subtitle=subtitle,
        tarja_type=_detect_tarja_type(block, subtitle),
    )


def _detect_tarja_type(block: NewsBlock, tarja_subtitle: str = "") -> TarjaType:
    """Detecta tipo de tarja baseado no contexto do bloco e conteudo.

    SUPERCHATS nao e detectado automaticamente — deve ser selecionado
    manualmente pelo usuario na GUI (AC-2, PAUTA-3.3).

    - MIRA: bloco com "marcos" ou "mira" no titulo, responsavel ou subtitulo da tarja
    - GIRO: bloco com "giro" ou "manchetes" no titulo
    - COBERTURA: default para todos os outros blocos
    """
    title_lower = block.title.lower()
    responsible_lower = (block.responsible or "").lower()
    subtitle_lower = tarja_subtitle.lower()

    if any("marcos" in s or "mira" in s for s in [title_lower, responsible_lower, subtitle_lower]):
        return TarjaType.MIRA
    if "giro" in title_lower or "manchetes" in title_lower:
        return TarjaType.GIRO
    return TarjaType.COBERTURA


def _find_translated_text(lines: list[str], current_index: int) -> str | None:
    """Procura texto traduzido proximo a instrucao de noticia."""
    for j in range(current_index + 1, min(current_index + 10, len(lines))):
        line = lines[j].strip()
        if not line:
            continue
        # Ignora roteiro
        if line.startswith("[ROTEIRO]"):
            continue
        alpha = [c for c in line if c.isalpha()]
        if alpha and sum(1 for c in alpha if c.isupper()) / len(alpha) > 0.8:
            text_lines = [line]
            for k in range(j + 1, len(lines)):
                next_line = lines[k].strip()
                if not next_line:
                    break
                if next_line.startswith("[ROTEIRO]"):
                    continue
                next_alpha = [c for c in next_line if c.isalpha()]
                if next_alpha and sum(1 for c in next_alpha if c.isupper()) / len(next_alpha) > 0.8:
                    text_lines.append(next_line)
                else:
                    break
            return "\n".join(text_lines)
    return None


def _extract_giro_roteiro_content(lines: list[str]) -> str:
    """Extrai conteudo do roteiro do bloco GIRO para gerar linha de apoio.

    Busca secoes delimitadas por ///////////// nas linhas [ROTEIRO]
    e retorna o conteudo resumido de cada secao.
    """
    sections: list[str] = []
    current_section_title = ""
    current_section_lines: list[str] = []

    for line in lines:
        stripped = line.strip()
        if not stripped.startswith("[ROTEIRO]"):
            continue

        roteiro_text = stripped[len("[ROTEIRO]"):].strip()
        if not roteiro_text:
            continue

        # Detecta delimitador de secao /////////////
        tarja_match = PATTERNS["tarja_delimiter"].search(roteiro_text)
        if tarja_match:
            # Salva secao anterior
            if current_section_title and current_section_lines:
                content = " ".join(current_section_lines[:3])  # Primeiras 3 linhas
                sections.append(f"[{current_section_title}] {content}")

            current_section_title = tarja_match.group(1).strip()
            current_section_lines = []
            continue

        # Acumula linhas da secao atual
        if current_section_title:
            current_section_lines.append(roteiro_text)

    # Salva ultima secao
    if current_section_title and current_section_lines:
        content = " ".join(current_section_lines[:3])
        sections.append(f"[{current_section_title}] {content}")

    return "\n".join(sections)


def _normalize_timecode(tc: str) -> str:
    """Normaliza timecode para formato MMSS."""
    tc = tc.replace(".", ":")
    if ":" in tc:
        parts = tc.split(":")
        if len(parts) == 2:
            minutes = int(parts[0])
            seconds = int(parts[1])
            return f"{minutes:02d}{seconds:02d}"
    return tc
