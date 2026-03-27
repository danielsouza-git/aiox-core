"""Fachada publica do parser — URL do Google Docs → PautaResult."""

from src.core.models import PautaResult
from src.google_api.docs_client import DocsClient
from src.parser.structure_parser import parse_structure
from src.parser.instruction_classifier import classify_instructions


class PautaParser:
    """Parser principal que transforma uma pauta do Google Docs em PautaResult."""

    def __init__(self, docs_client: DocsClient):
        self.docs_client = docs_client

    def parse(self, doc_url_or_id: str) -> PautaResult:
        """Parseia pauta completa a partir de URL ou ID do Google Docs.

        Args:
            doc_url_or_id: URL do Google Docs ou ID direto do documento.

        Returns:
            PautaResult com todos os blocos de noticias e instrucoes classificadas.
        """
        # Extrai ID do documento
        doc_id = DocsClient.extract_doc_id(doc_url_or_id)
        if not doc_id:
            doc_id = doc_url_or_id  # Assume que ja e o ID

        # Le documento com formatacao
        elements = self.docs_client.extract_text_with_links(doc_id)

        # Extrai titulo do documento
        doc = self.docs_client.get_document_content(doc_id)
        doc_title = doc.get("title", "Pauta sem titulo")

        # Extrai blocos de noticias
        news_blocks = parse_structure(elements)

        # Classifica instrucoes em cada bloco
        global_order = 0
        for block in news_blocks:
            instructions, global_order = classify_instructions(block, global_order)
            block.instructions = instructions

        return PautaResult(
            doc_title=doc_title,
            news_blocks=news_blocks,
        )

    def parse_from_text(self, text: str, title: str = "Pauta") -> PautaResult:
        """Parseia pauta a partir de texto bruto (para testes ou modo offline).

        Args:
            text: Texto completo da pauta.
            title: Titulo do documento.

        Returns:
            PautaResult com todos os blocos e instrucoes.
        """
        # Converte texto para formato de elementos simplificado
        elements = []
        for line in text.split("\n"):
            is_bold = False
            stripped = line.strip()
            alpha = [c for c in stripped if c.isalpha()]
            if alpha:
                upper_ratio = sum(1 for c in alpha if c.isupper()) / len(alpha)
                is_bold = upper_ratio > 0.8

            elements.append({
                "text": line.rstrip(),  # Preserva indentacao, remove trailing whitespace
                "heading": None,
                "links": [],
                "is_bold": is_bold,
            })

        # Extrai blocos
        news_blocks = parse_structure(elements)

        # Classifica instrucoes
        global_order = 0
        for block in news_blocks:
            instructions, global_order = classify_instructions(block, global_order)
            block.instructions = instructions

        return PautaResult(
            doc_title=title,
            news_blocks=news_blocks,
        )
