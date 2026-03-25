"""Teste funcional do TarjaProcessor — gera PNGs reais para validacao visual.

Uses pytest fixtures from conftest.py to provide mock configs, template images,
and fonts so tests don't depend on external files (user desktop, font dirs).
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest

from src.core.models import TarjaType
from src.processors.tarja_processor import TarjaProcessor


def test_tarja_giro(tarja_test_config, mock_fonts):
    """Testa geracao de tarja tipo GIRO."""
    processor = TarjaProcessor(tarja_test_config)

    output = processor.generate(
        tarja_title="RUSSIA SE DIZ 'PRONTA' PARA FIM DE RESTRICAO NUCLEAR",
        tarja_subtitle='Tratado "START" expira na quinta-feira; Vice-ministro diz nao visar extensao',
        tarja_type=TarjaType.GIRO,
        output_name="test_giro",
    )

    assert os.path.exists(output), f"PNG nao gerado: {output}"
    file_size = os.path.getsize(output)
    assert file_size > 0, f"PNG vazio ({file_size} bytes)"
    print(f"  GIRO OK: {output} ({file_size:,} bytes)")


def test_tarja_cobertura(tarja_test_config, mock_fonts):
    """Testa geracao de tarja tipo COBERTURA."""
    processor = TarjaProcessor(tarja_test_config)

    output = processor.generate(
        tarja_title="EXPLOSAO EM FABRICA DEIXA 12 MORTOS",
        tarja_subtitle="Incidente ocorreu na madrugada desta terca-feira em Sao Paulo",
        tarja_type=TarjaType.COBERTURA,
        output_name="test_cobertura",
    )

    assert os.path.exists(output), f"PNG nao gerado: {output}"
    file_size = os.path.getsize(output)
    assert file_size > 0, f"PNG vazio ({file_size} bytes)"
    print(f"  COBERTURA OK: {output} ({file_size:,} bytes)")


def test_tarja_mira(tarja_test_config, mock_fonts):
    """Testa geracao de tarja tipo MIRA (usa template Epoch)."""
    processor = TarjaProcessor(tarja_test_config)

    output = processor.generate(
        tarja_title="GOVERNO ANUNCIA NOVO PACOTE ECONOMICO",
        tarja_subtitle="Medidas incluem corte de impostos e incentivo a exportacao",
        tarja_type=TarjaType.MIRA,
        output_name="test_mira",
    )

    assert os.path.exists(output), f"PNG nao gerado: {output}"
    file_size = os.path.getsize(output)
    assert file_size > 0, f"PNG vazio ({file_size} bytes)"
    print(f"  MIRA OK: {output} ({file_size:,} bytes)")


def test_tarja_texto_longo(tarja_test_config, mock_fonts):
    """Testa auto-ajuste de fonte com texto longo."""
    processor = TarjaProcessor(tarja_test_config)

    output = processor.generate(
        tarja_title="EUA ANUNCIAM NOVA POLITICA PARA RELACOES COM A CHINA",
        tarja_subtitle="Declaracao foi feita durante coletiva na Casa Branca nesta segunda",
        tarja_type=TarjaType.GIRO,
        output_name="test_texto_longo",
    )

    assert os.path.exists(output), f"PNG nao gerado: {output}"
    print(f"  TEXTO LONGO OK: {output} ({os.path.getsize(output):,} bytes)")


def test_tarja_sem_subtitulo(tarja_test_config, mock_fonts):
    """Testa tarja sem linha de apoio."""
    processor = TarjaProcessor(tarja_test_config)

    output = processor.generate(
        tarja_title="NOTICIA SEM SUBTITULO",
        tarja_subtitle="",
        tarja_type=TarjaType.GIRO,
        output_name="test_sem_subtitulo",
    )

    assert os.path.exists(output), f"PNG nao gerado: {output}"
    print(f"  SEM SUBTITULO OK: {output} ({os.path.getsize(output):,} bytes)")


def test_auto_naming(tarja_test_config, mock_fonts):
    """Testa nomeacao automatica (giro.png para header, lt1.png, lt2.png)."""
    processor = TarjaProcessor(tarja_test_config)

    # Giro header (titulo especifico "MANCHETES DO BRASIL E DO MUNDO") deve gerar "giro.png"
    out1 = processor.generate(
        tarja_title="MANCHETES DO BRASIL E DO MUNDO",
        tarja_subtitle="Subtitulo",
        tarja_type=TarjaType.GIRO,
    )
    assert out1.endswith("giro.png"), f"Esperava giro.png, obteve: {out1}"
    print(f"  AUTO GIRO HEADER: {os.path.basename(out1)}")

    # Cobertura (sem output_name) deve gerar "lt1.png"
    out2 = processor.generate(
        tarja_title="TESTE AUTO NOME COBERTURA",
        tarja_subtitle="Subtitulo",
        tarja_type=TarjaType.COBERTURA,
    )
    assert "lt1.png" in out2, f"Esperava lt1.png, obteve: {out2}"
    print(f"  AUTO COBERTURA: {os.path.basename(out2)}")

    # Mira (sem output_name) deve gerar "lt2.png"
    out3 = processor.generate(
        tarja_title="TESTE AUTO NOME MIRA",
        tarja_subtitle="Subtitulo",
        tarja_type=TarjaType.MIRA,
    )
    assert "lt2.png" in out3, f"Esperava lt2.png, obteve: {out3}"
    print(f"  AUTO MIRA: {os.path.basename(out3)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
