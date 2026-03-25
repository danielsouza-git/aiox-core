"""Testes unitarios para o parser de estrutura da pauta."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from src.parser.structure_parser import parse_structure


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _el(text, heading=None, table_column=None, links=None, is_bold=False):
    """Cria um elemento simulando a saida do Google Docs parser."""
    element = {"text": text}
    if heading is not None:
        element["heading"] = heading
    if table_column is not None:
        element["table_column"] = table_column
    if links is not None:
        element["links"] = links
    if is_bold:
        element["is_bold"] = True
    return element


# ---------------------------------------------------------------------------
# 1. H1 cria bloco
# ---------------------------------------------------------------------------

def test_h1_creates_block():
    """H1 heading cria novo bloco de noticia."""
    elements = [
        _el("Crise na Economia", heading="HEADING_1"),
        _el("Texto da materia sobre economia"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    assert blocks[0].title == "Crise na Economia"
    assert "Texto da materia" in blocks[0].raw_text


def test_h1_with_responsible():
    """H1 com [Responsavel] extrai nome."""
    elements = [
        _el("Crise na Economia [Igor]", heading="HEADING_1"),
        _el("Conteudo do bloco"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    assert blocks[0].title == "Crise na Economia"
    assert blocks[0].responsible == "Igor"


# ---------------------------------------------------------------------------
# 2. Separador divide blocos
# ---------------------------------------------------------------------------

def test_separator_splits_blocks():
    """Linhas de tracos '---' separam blocos."""
    elements = [
        _el("Primeira Noticia", heading="HEADING_1"),
        _el("Conteudo da primeira"),
        _el("---"),
        _el("Segunda Noticia", heading="HEADING_1"),
        _el("Conteudo da segunda"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 2
    assert blocks[0].title == "Primeira Noticia"
    assert blocks[1].title == "Segunda Noticia"


def test_separator_long_dashes():
    """Separador com tracos longos tambem funciona."""
    elements = [
        _el("Noticia A", heading="HEADING_1"),
        _el("Texto A"),
        _el("————————————"),
        _el("Noticia B", heading="HEADING_1"),
        _el("Texto B"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 2


def test_separator_equals():
    """Separador com sinais de igual."""
    elements = [
        _el("Noticia A", heading="HEADING_1"),
        _el("Texto A"),
        _el("\u2550\u2550\u2550\u2550\u2550\u2550\u2550"),
        _el("Noticia B", heading="HEADING_1"),
        _el("Texto B"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 2


# ---------------------------------------------------------------------------
# 3. Extracao de responsavel
# ---------------------------------------------------------------------------

def test_responsible_extraction():
    """[Nome] no final do titulo e extraido como responsible."""
    elements = [
        _el("Reforma Tributaria [Angela]", heading="HEADING_1"),
        _el("Detalhes da reforma"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    assert blocks[0].responsible == "Angela"
    assert blocks[0].title == "Reforma Tributaria"


def test_responsible_with_accent():
    """Responsavel com acento e extraido corretamente."""
    elements = [
        _el("Pol\u00edtica Externa [Jos\u00e9]", heading="HEADING_1"),
        _el("Texto sobre politica"),
    ]
    blocks = parse_structure(elements)
    assert blocks[0].responsible == "Jos\u00e9"


# ---------------------------------------------------------------------------
# 4. H1 "PAUTA" ignorado
# ---------------------------------------------------------------------------

def test_pauta_h1_ignored():
    """H1 'PAUTA' nao cria bloco (e cabecalho do documento)."""
    elements = [
        _el("PAUTA", heading="HEADING_1"),
        _el("Primeira Noticia Real", heading="HEADING_1"),
        _el("Conteudo da primeira noticia"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    assert blocks[0].title == "Primeira Noticia Real"


def test_pauta_h1_with_intermediate_text():
    """H1 'PAUTA' com texto intermediario: texto vira bloco generico."""
    elements = [
        _el("PAUTA", heading="HEADING_1"),
        _el("Texto de cabecalho"),
        _el("Primeira Noticia Real", heading="HEADING_1"),
        _el("Conteudo da primeira noticia"),
    ]
    blocks = parse_structure(elements)
    # "Texto de cabecalho" cria bloco generico via _looks_like_title
    # Depois "Primeira Noticia Real" cria segundo bloco
    assert len(blocks) == 2
    assert blocks[1].title == "Primeira Noticia Real"


def test_pauta_case_insensitive():
    """H1 'Pauta' em qualquer case e ignorado (comparacao upper)."""
    elements = [
        _el("Pauta", heading="HEADING_1"),
        _el("Noticia de Verdade", heading="HEADING_1"),
        _el("Conteudo"),
    ]
    blocks = parse_structure(elements)
    # "Pauta" upper -> "PAUTA", ignorado
    assert len(blocks) == 1
    assert blocks[0].title == "Noticia de Verdade"


# ---------------------------------------------------------------------------
# 5. Tabela: coluna 0 = instrucoes, coluna 1 = roteiro
# ---------------------------------------------------------------------------

def test_table_columns():
    """Coluna 0 = instrucoes normais, coluna 1 = prefixo [ROTEIRO]."""
    elements = [
        _el("Economia [Igor]", heading="HEADING_1"),
        _el("Mostrar postagem: https://x.com/user/1", table_column=0),
        _el("Aqui o ancora fala sobre economia", table_column=1),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    raw = blocks[0].raw_text
    # Coluna 0 aparece sem prefixo
    assert "Mostrar postagem" in raw
    # Coluna 1 aparece com prefixo [ROTEIRO]
    assert "[ROTEIRO]" in raw
    assert "ancora fala" in raw


def test_table_column_zero_enriched_with_links():
    """Coluna 0 com links de imagem inline sao adicionados ao texto."""
    elements = [
        _el("Materia [Igor]", heading="HEADING_1"),
        _el(
            "Mostrar imagem: 1",
            table_column=0,
            links=[{"text": "[image]", "url": "https://example.com/img.png"}],
        ),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    assert "https://example.com/img.png" in blocks[0].raw_text


# ---------------------------------------------------------------------------
# 6. Multiplos blocos
# ---------------------------------------------------------------------------

def test_multiple_blocks():
    """Multiplos H1s criam multiplos blocos."""
    elements = [
        _el("Noticia Um", heading="HEADING_1"),
        _el("Conteudo um"),
        _el("Noticia Dois", heading="HEADING_1"),
        _el("Conteudo dois"),
        _el("Noticia Tres", heading="HEADING_1"),
        _el("Conteudo tres"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 3
    assert blocks[0].title == "Noticia Um"
    assert blocks[1].title == "Noticia Dois"
    assert blocks[2].title == "Noticia Tres"


def test_multiple_blocks_preserve_content():
    """Cada bloco contem apenas seu proprio conteudo."""
    elements = [
        _el("Bloco A", heading="HEADING_1"),
        _el("Conteudo exclusivo de A"),
        _el("Bloco B", heading="HEADING_1"),
        _el("Conteudo exclusivo de B"),
    ]
    blocks = parse_structure(elements)
    assert "exclusivo de A" in blocks[0].raw_text
    assert "exclusivo de B" in blocks[1].raw_text
    assert "exclusivo de B" not in blocks[0].raw_text
    assert "exclusivo de A" not in blocks[1].raw_text


# ---------------------------------------------------------------------------
# 7. Titulo inline com [Responsavel]
# ---------------------------------------------------------------------------

def test_inline_block_title():
    """Titulo com [Responsavel] dentro de bloco existente cria novo bloco."""
    elements = [
        _el("Primeiro Bloco", heading="HEADING_1"),
        _el("Instrucao do primeiro bloco"),
        # Sem heading, mas com [Responsavel] — deve criar novo bloco
        _el("Segundo Bloco Inline [Marcos]"),
        _el("Instrucao do segundo bloco"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 2
    assert blocks[0].title == "Primeiro Bloco"
    assert blocks[1].title == "Segundo Bloco Inline"
    assert blocks[1].responsible == "Marcos"


def test_inline_block_saves_previous():
    """Bloco inline salva conteudo do bloco anterior corretamente."""
    elements = [
        _el("Bloco Original [Igor]", heading="HEADING_1"),
        _el("Conteudo do original"),
        _el("Bloco Novo [Angela]"),
        _el("Conteudo do novo"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 2
    assert "Conteudo do original" in blocks[0].raw_text
    assert "Conteudo do novo" in blocks[1].raw_text


# ---------------------------------------------------------------------------
# Testes adicionais: edge cases
# ---------------------------------------------------------------------------

def test_empty_elements():
    """Lista vazia de elementos retorna lista vazia de blocos."""
    blocks = parse_structure([])
    assert len(blocks) == 0


def test_text_before_first_heading():
    """Texto que parece titulo antes do primeiro H1 cria bloco generico."""
    elements = [
        _el("Noticia sem heading formal"),
        _el("Conteudo da noticia"),
    ]
    blocks = parse_structure(elements)
    # _looks_like_title retorna True para texto curto nao-URL
    assert len(blocks) == 1
    assert blocks[0].title == "Noticia sem heading formal"


def test_separator_without_following_block():
    """Separador sem bloco seguinte salva bloco anterior."""
    elements = [
        _el("Unica Noticia", heading="HEADING_1"),
        _el("Conteudo"),
        _el("---"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    assert blocks[0].title == "Unica Noticia"
    assert "Conteudo" in blocks[0].raw_text


def test_h2_creates_block_if_no_current():
    """H2/H3 cria bloco se nao existe bloco atual."""
    elements = [
        _el("Subtitulo como titulo", heading="HEADING_2"),
        _el("Conteudo do sub-bloco"),
    ]
    blocks = parse_structure(elements)
    assert len(blocks) == 1
    assert blocks[0].title == "Subtitulo como titulo"


def test_links_without_image_tag():
    """Links normais (nao [image]) sao adicionados ao texto se ausentes."""
    elements = [
        _el("Materia", heading="HEADING_1"),
        _el(
            "Mostrar reportagem",
            table_column=0,
            links=[{"text": "link", "url": "https://reuters.com/article"}],
        ),
    ]
    blocks = parse_structure(elements)
    assert "https://reuters.com/article" in blocks[0].raw_text


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    print("=== Testes: structure_parser ===\n")

    tests = [
        ("1a. H1 cria bloco", test_h1_creates_block),
        ("1b. H1 com responsavel", test_h1_with_responsible),
        ("2a. Separador divide blocos", test_separator_splits_blocks),
        ("2b. Separador tracos longos", test_separator_long_dashes),
        ("2c. Separador igual", test_separator_equals),
        ("3a. Extracao responsavel", test_responsible_extraction),
        ("3b. Responsavel com acento", test_responsible_with_accent),
        ("4a. PAUTA H1 ignorado", test_pauta_h1_ignored),
        ("4a2. PAUTA com texto intermediario", test_pauta_h1_with_intermediate_text),
        ("4b. PAUTA case insensitive", test_pauta_case_insensitive),
        ("5a. Tabela colunas", test_table_columns),
        ("5b. Tabela links imagem", test_table_column_zero_enriched_with_links),
        ("6a. Multiplos blocos", test_multiple_blocks),
        ("6b. Conteudo isolado", test_multiple_blocks_preserve_content),
        ("7a. Titulo inline", test_inline_block_title),
        ("7b. Inline salva anterior", test_inline_block_saves_previous),
        ("8. Elementos vazios", test_empty_elements),
        ("9. Texto antes de H1", test_text_before_first_heading),
        ("10. Separador sem bloco seguinte", test_separator_without_following_block),
        ("11. H2 cria bloco", test_h2_creates_block_if_no_current),
        ("12. Links normais adicionados", test_links_without_image_tag),
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
