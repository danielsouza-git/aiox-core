"""Teste de integracao: Parser detecta tarjas, TarjaProcessor gera PNGs.

Uses pytest fixtures from conftest.py for mock configs, template images,
and fonts so tests don't depend on external files.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest

from src.parser.pauta_parser import PautaParser
from src.core.models import InstructionType, TarjaType
from src.processors.tarja_processor import TarjaProcessor


SAMPLE_PAUTA = """PAUTA

Porta-voz russo: "estamos prontos para mundo sem limites nucleares" [Igor]
Mostrar reportagem: https://www.reuters.com/world/nuclear
Mostrar video (38:40-39:45 — legendar): www.armed-services.senate.gov/hearings/test

B-ROLL: https://x.com/ZelenskyyUa/status/123456

 RUSSIA SE DIZ "PRONTA" PARA FIM DE RESTRICAO
Tratado "START" expira na quinta-feira

————————————————————————————————————————————

Apreensao de material biologico em Las Vegas [Angela]
Mostrar postagem: https://x.com/RepKiley/status/2018514131876213199

 FBI INVESTIGA MATERIAL BIOLOGICO EM LAS VEGAS
Agentes federais isolaram area proxima ao Strip

Mostrar imagem: 1

————————————————————————————————————————————

Na Mira do Marcos [Marcos]

 GOVERNO ESTUDA NOVAS MEDIDAS
Propostas incluem corte de impostos
"""


def test_parser_detects_tarjas():
    """Verifica que o parser identifica instrucoes TARJA corretamente."""
    parser = PautaParser(docs_client=None)
    result = parser.parse_from_text(SAMPLE_PAUTA)

    tarjas = [i for i in result.instructions if i.type == InstructionType.TARJA]

    print(f"Total instrucoes: {len(result.instructions)}")
    print(f"Tarjas detectadas: {len(tarjas)}")

    assert len(tarjas) >= 2, f"Esperava >= 2 tarjas, encontrou {len(tarjas)}"

    for t in tarjas:
        print(f"  Tarja: '{t.tarja_title}' / '{t.tarja_subtitle}' / tipo={t.tarja_type}")
        assert t.tarja_title, "Tarja sem titulo"

    print("  Parser detectou tarjas corretamente!")
    return tarjas


def test_tarja_type_detection():
    """Verifica que o tipo de tarja e detectado pelo contexto do bloco."""
    parser = PautaParser(docs_client=None)
    result = parser.parse_from_text(SAMPLE_PAUTA)

    tarjas = [i for i in result.instructions if i.type == InstructionType.TARJA]

    types_found = {t.tarja_type for t in tarjas}
    print(f"  Tipos encontrados: {types_found}")

    # SAMPLE_PAUTA contem "Na Mira do Marcos" (MIRA) e blocos normais (COBERTURA)
    has_cobertura = any(t.tarja_type == TarjaType.COBERTURA for t in tarjas)
    has_mira = any(t.tarja_type == TarjaType.MIRA for t in tarjas)

    assert has_cobertura, f"Nao detectou tarja tipo COBERTURA. Tipos: {types_found}"
    assert has_mira, f"Nao detectou tarja tipo MIRA. Tipos: {types_found}"
    print("  Tipos de tarja detectados corretamente!")


def test_end_to_end_generation(tarja_test_config, mock_fonts):
    """Teste end-to-end: parseia pauta e gera PNGs das tarjas."""
    parser = PautaParser(docs_client=None)
    result = parser.parse_from_text(SAMPLE_PAUTA)
    tarjas = [i for i in result.instructions if i.type == InstructionType.TARJA]

    processor = TarjaProcessor(tarja_test_config)

    generated = []
    for i, tarja in enumerate(tarjas):
        output = processor.process(tarja)
        assert os.path.exists(output), f"PNG nao gerado: {output}"
        size = os.path.getsize(output)
        print(f"  [{i+1}] {os.path.basename(output)} ({size:,} bytes) -- '{tarja.tarja_title}'")
        generated.append(output)

    assert len(generated) >= 2, f"Esperava >= 2 PNGs, gerou {len(generated)}"
    print(f"  {len(generated)} PNGs gerados com sucesso!")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
