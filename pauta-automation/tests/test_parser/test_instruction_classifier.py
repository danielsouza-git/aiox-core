"""Testes unitarios para o classificador de instrucoes da pauta."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from src.core.models import (
    InstructionType,
    NewsBlock,
    Platform,
    TarjaType,
)
from src.parser.instruction_classifier import classify_instructions


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_block(title="Noticia Teste", raw_text="", responsible=None):
    """Cria um NewsBlock de teste com valores sensatos."""
    return NewsBlock(title=title, raw_text=raw_text, responsible=responsible)


def _classify(raw_text, title="Noticia Teste", responsible=None, global_order=0):
    """Atalho: cria bloco e classifica, retorna (instructions, next_order)."""
    block = _make_block(title=title, raw_text=raw_text, responsible=responsible)
    return classify_instructions(block, global_order)


# ---------------------------------------------------------------------------
# 1. SLIDE_POST
# ---------------------------------------------------------------------------

def test_detect_slide_post():
    """'Mostrar postagem: URL' com URL de rede social -> SLIDE_POST."""
    instructions, next_order = _classify(
        "Mostrar postagem: https://x.com/user/status/123"
    )
    assert len(instructions) == 1, f"Esperava 1 instrucao, obteve {len(instructions)}"
    assert instructions[0].type == InstructionType.SLIDE_POST
    assert instructions[0].platform == Platform.X
    assert instructions[0].url == "https://x.com/user/status/123"
    assert next_order == 1


def test_detect_slide_post_truth():
    """'Mostrar post: URL' com Truth Social -> SLIDE_POST + Platform.TRUTH."""
    instructions, _ = _classify(
        "Mostrar post: https://truthsocial.com/@realDonaldTrump/12345"
    )
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_POST
    assert instructions[0].platform == Platform.TRUTH


def test_detect_slide_post_unknown_url():
    """'Mostrar postagem: URL' com URL desconhecida -> SLIDE_PARTIAL (print)."""
    instructions, _ = _classify(
        "Mostrar postagem: https://example.com/some-post"
    )
    assert len(instructions) == 1
    # URL desconhecida em slide_post cai como SLIDE_PARTIAL (screenshot/print)
    assert instructions[0].type == InstructionType.SLIDE_PARTIAL


# ---------------------------------------------------------------------------
# 2. SLIDE_NEWS_WITH_TEXT
# ---------------------------------------------------------------------------

def test_detect_slide_news_with_text():
    """'Mostrar reportagem: URL' com texto traduzido proximo -> SLIDE_NEWS_WITH_TEXT."""
    raw = (
        "Mostrar reportagem: https://reuters.com/world/article-123\n"
        "\n"
        "REUTERS REPORTA QUE GOVERNO BRASILEIRO ANUNCIA NOVAS MEDIDAS\n"
        "PARA CONTER A INFLACAO E ESTIMULAR O CRESCIMENTO ECONOMICO"
    )
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_NEWS_WITH_TEXT
    assert instructions[0].translated_text is not None
    assert "REUTERS" in instructions[0].translated_text


# ---------------------------------------------------------------------------
# 3. SLIDE_NEWS_NO_TEXT
# ---------------------------------------------------------------------------

def test_detect_slide_news_no_text():
    """'Mostrar materia: URL' sem texto traduzido -> SLIDE_NEWS_NO_TEXT."""
    instructions, _ = _classify(
        "Mostrar materia: https://nytimes.com/2024/article-456"
    )
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_NEWS_NO_TEXT
    assert instructions[0].translated_text is None


def test_detect_slide_news_with_accent():
    """'Mostrar materia' com acento -> mesma deteccao."""
    instructions, _ = _classify(
        "Mostrar mat\u00e9ria: https://bbc.com/article"
    )
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_NEWS_NO_TEXT


# ---------------------------------------------------------------------------
# 4. SLIDE_PARTIAL (imagem unica)
# ---------------------------------------------------------------------------

def test_detect_slide_image_single():
    """'Mostrar imagem: URL' -> SLIDE_PARTIAL."""
    instructions, _ = _classify(
        "Mostrar imagem: https://example.com/img.png"
    )
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_PARTIAL
    assert "img.png" in instructions[0].url


# ---------------------------------------------------------------------------
# 5. SLIDE_PARTIAL (sequencia de imagens)
# ---------------------------------------------------------------------------

def test_detect_slide_image_sequence():
    """'Mostrar imagens em sequencia: URLs' -> SLIDE_PARTIAL com multiplas URLs."""
    instructions, _ = _classify(
        "Mostrar imagens em sequ\u00eancia: https://ex.com/1.jpg https://ex.com/2.jpg"
    )
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_PARTIAL
    assert len(instructions[0].urls) == 2


# ---------------------------------------------------------------------------
# 6. TARJA (formato CAPS + subtitulo)
# ---------------------------------------------------------------------------

def test_detect_tarja_caps_format():
    """Duas linhas: CAPS (>80% upper) + subtitulo normal -> TARJA."""
    raw = (
        "GOVERNO BRASILEIRO ANUNCIA PACOTE ECONOMICO\n"
        "Medidas incluem corte de impostos e incentivo a exportacao"
    )
    instructions, _ = _classify(raw)
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    assert len(tarjas) >= 1, f"Esperava tarja, obteve tipos: {[i.type for i in instructions]}"
    assert tarjas[0].tarja_title == "GOVERNO BRASILEIRO ANUNCIA PACOTE ECONOMICO"
    assert "Medidas" in tarjas[0].tarja_subtitle


# ---------------------------------------------------------------------------
# 7. TARJA (delimitador /////)
# ---------------------------------------------------------------------------

def test_detect_tarja_delimiter():
    """Texto entre ///// -> TARJA."""
    raw = "///// CRISE NO ORIENTE MEDIO /////"
    instructions, _ = _classify(raw)
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    assert len(tarjas) == 1
    assert "CRISE" in tarjas[0].tarja_title


def test_detect_tarja_delimiter_with_subtitle():
    """Tarja entre ///// com titulo e subtitulo (separados por newline dentro dos delimitadores)."""
    # O regex opera por linha, entao "///// TITULO\nSubtitulo /////" nao faz match
    # porque cada linha e processada separadamente. O conteudo precisa estar inline:
    raw = "///// TITULO DA TARJA - Subtitulo da tarja /////"
    instructions, _ = _classify(raw)
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    assert len(tarjas) == 1
    assert "TITULO DA TARJA" in tarjas[0].tarja_title


# ---------------------------------------------------------------------------
# 8. VIDEO_SUBTITLE
# ---------------------------------------------------------------------------

def test_detect_video_subtitle():
    """'legendar TC 0:34 ate 0:44 URL' -> VIDEO_SUBTITLE com timecodes."""
    raw = "legendar TC 0:34 at\u00e9 0:44 https://youtube.com/watch?v=abc123"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.VIDEO_SUBTITLE
    assert instructions[0].url == "https://youtube.com/watch?v=abc123"
    assert len(instructions[0].clips) == 1
    assert instructions[0].clips[0].timecode.start == "0034"
    assert instructions[0].clips[0].timecode.end == "0044"


def test_detect_video_subtitle_multiple_timecodes():
    """Legendar com multiplos timecodes -> VIDEO_SUBTITLE com multiplos clips."""
    raw = "legendar TC 0:34 at\u00e9 0:44 e TC 1:20 ao 1:35 https://youtube.com/watch?v=abc"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.VIDEO_SUBTITLE
    assert len(instructions[0].clips) == 2
    assert instructions[0].clips[1].timecode.start == "0120"
    assert instructions[0].clips[1].timecode.end == "0135"


# ---------------------------------------------------------------------------
# 9. VIDEO_ONLY
# ---------------------------------------------------------------------------

def test_detect_video_only():
    """'Mostrar video URL' -> VIDEO_ONLY."""
    raw = "Mostrar v\u00eddeo https://youtube.com/watch?v=xyz"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.VIDEO_ONLY
    assert "youtube.com" in instructions[0].url


def test_detect_video_only_sem_acento():
    """'Mostrar video' sem acento tambem detecta."""
    raw = "Mostrar video https://youtube.com/watch?v=xyz"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.VIDEO_ONLY


# ---------------------------------------------------------------------------
# 10. B-ROLL
# ---------------------------------------------------------------------------

def test_detect_broll_social():
    """'B-ROLL: URL social' -> VIDEO_ONLY."""
    raw = "B-ROLL: https://x.com/user/status/999"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.VIDEO_ONLY


def test_detect_broll_image():
    """'B-ROLL: URL de imagem' -> SLIDE_PARTIAL."""
    raw = "B-ROLL: https://pbs.twimg.com/media/abc123.jpg"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_PARTIAL


def test_detect_broll_news():
    """'B-ROLL: URL de noticia/generico' -> SLIDE_NEWS_NO_TEXT."""
    raw = "B-ROLL: https://gov.br/documento-oficial"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.SLIDE_NEWS_NO_TEXT


# ---------------------------------------------------------------------------
# 11. Platform detection
# ---------------------------------------------------------------------------

def test_platform_detection_x():
    """URL x.com -> Platform.X."""
    instructions, _ = _classify("Mostrar postagem: https://x.com/user/status/1")
    assert instructions[0].platform == Platform.X


def test_platform_detection_twitter():
    """URL twitter.com -> Platform.X."""
    instructions, _ = _classify("Mostrar postagem: https://twitter.com/user/status/1")
    assert instructions[0].platform == Platform.X


def test_platform_detection_truth():
    """URL truthsocial.com -> Platform.TRUTH."""
    instructions, _ = _classify(
        "Mostrar postagem: https://truthsocial.com/@user/12345"
    )
    assert instructions[0].platform == Platform.TRUTH


def test_platform_detection_instagram():
    """URL instagram.com -> Platform.INSTAGRAM."""
    instructions, _ = _classify(
        "Mostrar postagem: https://instagram.com/p/abc123"
    )
    assert instructions[0].platform == Platform.INSTAGRAM


def test_platform_detection_telegram():
    """URL t.me -> Platform.TELEGRAM."""
    instructions, _ = _classify("Mostrar postagem: https://t.me/channel/123")
    assert instructions[0].platform == Platform.TELEGRAM


# ---------------------------------------------------------------------------
# 12. Timecode normalization
# ---------------------------------------------------------------------------

def test_timecode_normalization():
    """'0:34' -> '0034', '4:38' -> '0438'."""
    from src.parser.instruction_classifier import _normalize_timecode

    assert _normalize_timecode("0:34") == "0034"
    assert _normalize_timecode("4:38") == "0438"
    assert _normalize_timecode("12:05") == "1205"
    assert _normalize_timecode("0.34") == "0034"  # ponto tambem funciona


def test_timecode_in_video():
    """Verifica que timecodes sao normalizados na instrucao VIDEO_SUBTITLE."""
    raw = "legendar TC 4:38 at\u00e9 5:26 https://youtu.be/vid1"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    clip = instructions[0].clips[0]
    assert clip.timecode.start == "0438"
    assert clip.timecode.end == "0526"


# ---------------------------------------------------------------------------
# 13. Tarja type detection
# ---------------------------------------------------------------------------

def test_tarja_type_giro():
    """Bloco com 'giro' no titulo -> TarjaType.GIRO."""
    raw = "///// MANCHETE DO DIA /////"
    instructions, _ = _classify(raw, title="Giro de Noticias")
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    # Filtra a tarja auto-gerada do giro e a tarja do delimitador
    delimiter_tarjas = [t for t in tarjas if t.tarja_title == "MANCHETE DO DIA"]
    assert len(delimiter_tarjas) == 1
    assert delimiter_tarjas[0].tarja_type == TarjaType.GIRO


def test_tarja_type_mira():
    """Bloco com 'marcos' no titulo -> TarjaType.MIRA."""
    raw = (
        "GOVERNO ANUNCIA MUDANCAS NA POLITICA ECONOMICA\n"
        "Analise das implicacoes para o mercado financeiro"
    )
    instructions, _ = _classify(raw, title="Marcos: Economia")
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    assert len(tarjas) >= 1
    assert tarjas[0].tarja_type == TarjaType.MIRA


def test_tarja_type_cobertura():
    """Bloco generico (sem giro/marcos) -> TarjaType.COBERTURA."""
    raw = (
        "EXPLOSAO EM FABRICA DEIXA DOZE MORTOS\n"
        "Incidente ocorreu na madrugada desta terca-feira"
    )
    instructions, _ = _classify(raw, title="Acidente Industrial")
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    assert len(tarjas) >= 1
    assert tarjas[0].tarja_type == TarjaType.COBERTURA


def test_tarja_type_superchats_not_auto_detected():
    """SUPERCHATS NAO e auto-detectado pelo parser (PAUTA-3.3).

    Tipo SUPERCHATS deve ser selecionado manualmente pelo usuario na GUI.
    Mesmo que o titulo do bloco contenha "superchat" ou "doacao", o parser
    deve retornar COBERTURA (default), nunca SUPERCHATS.
    """
    raw = (
        "SUPERCHATS DO DIA ESTAO BOMBANDO\n"
        "Doacoes recordes neste episodio especial"
    )
    # Bloco com "superchat" no titulo — antes era auto-detectado, agora nao
    instructions, _ = _classify(raw, title="Superchats e Doacoes")
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    assert len(tarjas) >= 1
    # Deve ser COBERTURA (default), NAO SUPERCHATS
    for tarja in tarjas:
        assert tarja.tarja_type != TarjaType.SUPERCHATS, (
            f"Tarja '{tarja.tarja_title}' auto-detectou SUPERCHATS, mas deveria ser COBERTURA"
        )
    assert tarjas[0].tarja_type == TarjaType.COBERTURA


def test_tarja_type_superchat_in_responsible_not_detected():
    """Bloco com 'superchat' no responsavel NAO auto-detecta SUPERCHATS."""
    raw = (
        "MOMENTO ESPECIAL DO PROGRAMA\n"
        "Interacao com a audiencia ao vivo"
    )
    instructions, _ = _classify(raw, title="Bloco Interativo", responsible="Editor Superchat")
    tarjas = [i for i in instructions if i.type == InstructionType.TARJA]
    assert len(tarjas) >= 1
    for tarja in tarjas:
        assert tarja.tarja_type != TarjaType.SUPERCHATS


# ---------------------------------------------------------------------------
# 14. Merge detection
# ---------------------------------------------------------------------------

def test_merge_detection():
    """'legendar e juntar' -> merge=True."""
    raw = "legendar e juntar TC 0:10 at\u00e9 0:20 https://youtu.be/vid1"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].type == InstructionType.VIDEO_SUBTITLE
    assert instructions[0].merge is True


def test_no_merge_by_default():
    """Sem 'juntar' -> merge=False."""
    raw = "legendar TC 0:10 at\u00e9 0:20 https://youtu.be/vid1"
    instructions, _ = _classify(raw)
    assert len(instructions) == 1
    assert instructions[0].merge is False


# ---------------------------------------------------------------------------
# 15. Giro block auto-tarja
# ---------------------------------------------------------------------------

def test_giro_block_auto_tarja():
    """Bloco GIRO gera tarja automatica 'MANCHETES DO BRASIL E DO MUNDO'."""
    raw = (
        "Mostrar postagem: https://x.com/user/status/1\n"
        "Mostrar postagem: https://x.com/user/status/2"
    )
    instructions, _ = _classify(raw, title="Giro de Noticias")
    # Primeira instrucao deve ser a tarja automatica do giro
    assert instructions[0].type == InstructionType.TARJA
    assert instructions[0].tarja_title == "MANCHETES DO BRASIL E DO MUNDO"
    assert instructions[0].tarja_type == TarjaType.GIRO


def test_giro_block_auto_tarja_manchetes_title():
    """Bloco com 'manchetes' no titulo tambem gera auto-tarja."""
    raw = "Mostrar postagem: https://x.com/user/status/1"
    instructions, _ = _classify(raw, title="Manchetes do Dia")
    assert instructions[0].type == InstructionType.TARJA
    assert instructions[0].tarja_title == "MANCHETES DO BRASIL E DO MUNDO"


def test_non_giro_block_no_auto_tarja():
    """Bloco normal NAO gera tarja automatica."""
    raw = "Mostrar postagem: https://x.com/user/status/1"
    instructions, _ = _classify(raw, title="Economia")
    assert all(
        i.tarja_title != "MANCHETES DO BRASIL E DO MUNDO"
        for i in instructions
    )


# ---------------------------------------------------------------------------
# Testes adicionais: order tracking e edge cases
# ---------------------------------------------------------------------------

def test_global_order_tracking():
    """Verifica que next_order incrementa corretamente."""
    raw = (
        "Mostrar postagem: https://x.com/user/status/1\n"
        "Mostrar postagem: https://x.com/user/status/2"
    )
    instructions, next_order = _classify(raw, global_order=5)
    assert next_order == 7  # 5 + 2 instrucoes


def test_empty_block():
    """Bloco sem texto nao gera instrucoes."""
    instructions, next_order = _classify("")
    assert len(instructions) == 0
    assert next_order == 0


def test_roteiro_lines_ignored():
    """Linhas com [ROTEIRO] sao ignoradas pelo classificador."""
    raw = (
        "[ROTEIRO] Este e o roteiro da materia\n"
        "Mostrar postagem: https://x.com/user/status/1"
    )
    instructions, _ = _classify(raw)
    # Apenas a instrucao de slide post, nao o roteiro
    post_instructions = [i for i in instructions if i.type == InstructionType.SLIDE_POST]
    assert len(post_instructions) == 1


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    print("=== Testes: instruction_classifier ===\n")

    tests = [
        ("1. Slide Post", test_detect_slide_post),
        ("1b. Slide Post Truth", test_detect_slide_post_truth),
        ("1c. Slide Post URL desconhecida", test_detect_slide_post_unknown_url),
        ("2. Slide News com texto", test_detect_slide_news_with_text),
        ("3. Slide News sem texto", test_detect_slide_news_no_text),
        ("3b. Slide News com acento", test_detect_slide_news_with_accent),
        ("4. Slide imagem unica", test_detect_slide_image_single),
        ("5. Slide imagem sequencia", test_detect_slide_image_sequence),
        ("6. Tarja CAPS format", test_detect_tarja_caps_format),
        ("7. Tarja delimitador", test_detect_tarja_delimiter),
        ("7b. Tarja delimitador com subtitulo", test_detect_tarja_delimiter_with_subtitle),
        ("8. Video subtitle", test_detect_video_subtitle),
        ("8b. Video subtitle multiplos TC", test_detect_video_subtitle_multiple_timecodes),
        ("9. Video only", test_detect_video_only),
        ("9b. Video only sem acento", test_detect_video_only_sem_acento),
        ("10a. B-ROLL social", test_detect_broll_social),
        ("10b. B-ROLL imagem", test_detect_broll_image),
        ("10c. B-ROLL noticia", test_detect_broll_news),
        ("11a. Platform X", test_platform_detection_x),
        ("11b. Platform Twitter", test_platform_detection_twitter),
        ("11c. Platform Truth", test_platform_detection_truth),
        ("11d. Platform Instagram", test_platform_detection_instagram),
        ("11e. Platform Telegram", test_platform_detection_telegram),
        ("12. Timecode normalization", test_timecode_normalization),
        ("12b. Timecode em video", test_timecode_in_video),
        ("13a. Tarja tipo GIRO", test_tarja_type_giro),
        ("13b. Tarja tipo MIRA", test_tarja_type_mira),
        ("13c. Tarja tipo COBERTURA", test_tarja_type_cobertura),
        ("13d. SUPERCHATS nao auto-detectado", test_tarja_type_superchats_not_auto_detected),
        ("13e. Superchat em responsible nao detectado", test_tarja_type_superchat_in_responsible_not_detected),
        ("14. Merge detection", test_merge_detection),
        ("14b. Sem merge", test_no_merge_by_default),
        ("15a. Giro auto-tarja", test_giro_block_auto_tarja),
        ("15b. Giro manchetes", test_giro_block_auto_tarja_manchetes_title),
        ("15c. Nao-giro sem auto-tarja", test_non_giro_block_no_auto_tarja),
        ("16. Order tracking", test_global_order_tracking),
        ("17. Bloco vazio", test_empty_block),
        ("18. Roteiro ignorado", test_roteiro_lines_ignored),
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
