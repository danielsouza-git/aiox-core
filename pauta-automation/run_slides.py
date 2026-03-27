"""Gera slides a partir de uma pauta do Google Docs.

Uso: python run_slides.py <google_docs_url>
"""

import sys
import os
import logging

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("run_slides")


def main():
    if len(sys.argv) < 2:
        print("Uso: python run_slides.py <google_docs_url>")
        sys.exit(1)

    doc_url = sys.argv[1]
    logger.info("Processando pauta: %s", doc_url[:80])

    # 1. Carrega config
    from src.core.config import load_config

    config = load_config()
    project_dir = os.path.dirname(os.path.abspath(__file__))
    creds_path = config.google.credentials_path
    token_path = config.google.token_path
    if not os.path.isabs(creds_path):
        creds_path = os.path.join(project_dir, creds_path)
    if not os.path.isabs(token_path):
        token_path = os.path.join(project_dir, token_path)

    # 2. Inicializa servicos Google
    from src.google_api.auth import build_docs_service, build_slides_service, build_drive_service
    from src.google_api.docs_client import DocsClient
    from src.google_api.slides_client import SlidesClient
    from src.google_api.drive_client import DriveClient

    docs_service = build_docs_service(creds_path, token_path)
    docs_client = DocsClient(docs_service)

    slides_service = build_slides_service(creds_path, token_path)
    slides_client = SlidesClient(slides_service)

    drive_service = build_drive_service(creds_path, token_path)
    drive_client = DriveClient(drive_service)

    # 3. Parseia a pauta
    from src.parser.pauta_parser import PautaParser

    parser = PautaParser(docs_client)
    result = parser.parse(doc_url)

    logger.info("Documento: %s", result.doc_title)
    logger.info("Blocos de noticias: %d", len(result.news_blocks))

    # 4. Filtra instrucoes de slides
    slide_instructions = [
        i for i in result.instructions
        if i.type.value.startswith("slide_")
    ]

    if not slide_instructions:
        logger.warning("Nenhuma instrucao de slide encontrada na pauta!")
        print("\nInstrucoes encontradas:")
        for i in result.instructions:
            print(f"  [{i.type.value}] {i.news_block[:50] if i.news_block else 'N/A'}")
        sys.exit(0)

    logger.info("Slides a gerar: %d", len(slide_instructions))
    for i, instr in enumerate(slide_instructions):
        logger.info(
            "  %d. [%s] %s — url=%s",
            i + 1,
            instr.type.value,
            instr.news_block[:40] if instr.news_block else "?",
            (instr.url or "N/A")[:60],
        )

    # 5. Inicializa slide processor
    from src.processors.slide_processor import SlideProcessor

    slide_processor = SlideProcessor(config, slides_client, drive_client)
    slide_processor.setup()

    template_id = config.google.slides_template_id
    logger.info("Template de slides: %s", template_id)
    logger.info("Apresentacao: https://docs.google.com/presentation/d/%s/edit", template_id)

    # 6. Gera slides
    created = 0
    errors = 0
    for i, instr in enumerate(slide_instructions):
        try:
            logger.info(
                "Gerando slide %d/%d: [%s] %s",
                i + 1, len(slide_instructions),
                instr.type.value,
                instr.news_block[:40] if instr.news_block else "?",
            )
            slide_id = slide_processor.process(instr)
            created += 1
            logger.info("  -> Slide criado: %s", slide_id)
        except Exception as e:
            errors += 1
            logger.error("  -> ERRO: %s", e)

    # 7. Remove slides template
    logger.info("Removendo slides template...")
    slide_processor.cleanup_templates()

    # 8. Resumo
    print(f"\n{'='*50}")
    print(f"CONCLUIDO: {created} slides criados, {errors} erros")
    print(f"Apresentacao: https://docs.google.com/presentation/d/{template_id}/edit")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
