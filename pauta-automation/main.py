"""Ponto de entrada do Pauta Automation System."""

import sys
import os
import traceback

# Adiciona diretorio raiz ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Crash log em local previsivel (Desktop do usuario)
_CRASH_LOG = os.path.join(
    os.path.expanduser("~"), "Desktop", "pauta-automation-crash.log"
)


def main():
    """Inicia a aplicacao."""
    try:
        if len(sys.argv) > 1 and sys.argv[1] == "--test":
            _run_test()
        else:
            _run_gui()
    except Exception as e:
        msg = f"CRASH: {e}\n\n{traceback.format_exc()}"
        print(msg, file=sys.stderr)
        print(msg)
        try:
            with open(_CRASH_LOG, "w", encoding="utf-8") as f:
                f.write(msg)
            print(f"\nCrash log saved to: {_CRASH_LOG}")
        except Exception:
            pass
        input("\nPress Enter to exit...")
        sys.exit(1)


def _run_gui():
    """Inicia a interface grafica com pywebview."""
    from src.gui.app import create_app

    create_app()


def _run_test():
    """Executa teste basico do parser com texto de exemplo."""
    from src.parser.pauta_parser import PautaParser

    sample = """PAUTA

Porta-voz russo: "estamos prontos para mundo sem limites nucleares" [Igor]
Mostrar reportagem: https://www.reuters.com/world/nuclear
Mostrar video (38:40-39:45 — legendar): www.armed-services.senate.gov/hearings/test

B-ROLL: https://x.com/ZelenskyyUa/status/123456

 RÚSSIA SE DIZ "PRONTA" PARA FIM DE RESTRIÇÃO NUCLEAR
Tratado "START" expira na quinta-feira; Vice-ministro diz não visar extensão

————————————————————————————————————————————

Apreensão de material biológico em Las Vegas [Angela]
Mostrar postagem: https://x.com/RepKiley/status/2018514131876213199
Legendar congressista Kiley TC 4:38 ao 5:26

Mostrar imagem: 1
Mostrar imagens em sequência: 1, 2, 3
"""

    parser = PautaParser(docs_client=None)
    result = parser.parse_from_text(sample)

    print(f"Titulo: {result.doc_title}")
    print(f"Blocos de noticias: {len(result.news_blocks)}")
    print()

    for block in result.news_blocks:
        print(f"--- {block.title} [{block.responsible or 'N/A'}] ---")
        for instr in block.instructions:
            print(f"  [{instr.type.value}] url={instr.url or 'N/A'}")
            if instr.tarja_title:
                print(f"    tarja: {instr.tarja_title}")
                print(f"    subtitulo: {instr.tarja_subtitle}")
            if instr.timecode:
                print(f"    timecode: {instr.timecode.start}-{instr.timecode.end}")
            if instr.clips:
                for clip in instr.clips:
                    if clip.timecode:
                        print(f"    clip: {clip.timecode.start}-{clip.timecode.end}")
        print()

    print(f"Total de instrucoes: {len(result.instructions)}")

    # Contagem por tipo
    from collections import Counter
    counts = Counter(i.type.value for i in result.instructions)
    for type_name, count in sorted(counts.items()):
        print(f"  {type_name}: {count}")


if __name__ == "__main__":
    main()
