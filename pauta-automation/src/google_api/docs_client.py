"""Cliente para leitura de Google Docs."""

import re
from typing import Optional


class DocsClient:
    """Le conteudo de Google Docs via API."""

    def __init__(self, service):
        self.service = service

    def get_document_content(self, doc_id: str) -> dict:
        """Retorna o documento completo com estrutura de elementos."""
        return self.service.documents().get(documentId=doc_id).execute()

    def extract_text_with_links(self, doc_id: str) -> list[dict]:
        """Extrai texto com formatacao e links do documento.

        Retorna lista de elementos, cada um com:
        - text: texto do paragrafo
        - heading: nivel do heading (HEADING_1, etc.) ou None
        - links: lista de {text, url} encontrados no paragrafo
        - is_bold: se todo o texto e bold
        - table_column: indice da coluna (0=esquerda, 1=direita) se veio de tabela
        """
        document = self.get_document_content(doc_id)
        body = document.get("body", {})
        content = body.get("content", [])
        elements = []

        for structural_element in content:
            # Paragrafos normais
            paragraph = structural_element.get("paragraph")
            if paragraph:
                elem = self._parse_paragraph(paragraph, document)
                elements.append(elem)
                continue

            # Tabelas (B-rolls na coluna esquerda, roteiro na direita)
            table = structural_element.get("table")
            if table:
                table_elements = self._parse_table(table, document)
                elements.extend(table_elements)

        return elements

    def _parse_paragraph(self, paragraph: dict, document: dict) -> dict:
        """Parseia um paragrafo do Google Docs em elemento estruturado."""
        paragraph_text = ""
        links = []
        bold_chars = 0
        total_chars = 0
        heading = None

        # Detecta heading
        style = paragraph.get("paragraphStyle", {})
        named_style = style.get("namedStyleType", "")
        if named_style.startswith("HEADING_"):
            heading = named_style

        # Processa elementos do paragrafo
        for element in paragraph.get("elements", []):
            text_run = element.get("textRun")
            if not text_run:
                continue

            text = text_run.get("content", "")
            paragraph_text += text

            text_style = text_run.get("textStyle", {})
            total_chars += len(text.strip())

            # Detecta bold
            if text_style.get("bold", False):
                bold_chars += len(text.strip())

            # Detecta links
            link = text_style.get("link", {})
            url = link.get("url")
            if url:
                links.append({"text": text.strip(), "url": url})

        # Inline objects (imagens)
        for element in paragraph.get("elements", []):
            if "inlineObjectElement" in element:
                inline_id = element["inlineObjectElement"].get("inlineObjectId")
                if inline_id:
                    inline_objects = document.get("inlineObjects", {})
                    obj = inline_objects.get(inline_id, {})
                    embedded = obj.get("inlineObjectProperties", {}).get(
                        "embeddedObject", {}
                    )
                    image_url = embedded.get("imageProperties", {}).get(
                        "contentUri"
                    )
                    if image_url:
                        links.append({"text": "[image]", "url": image_url})

        cleaned_text = paragraph_text.strip()
        if not cleaned_text:
            return {
                "text": "",
                "heading": heading,
                "links": links,
                "is_bold": False,
            }

        is_bold = total_chars > 0 and bold_chars / total_chars > 0.8

        return {
            "text": cleaned_text,
            "heading": heading,
            "links": links,
            "is_bold": is_bold,
        }

    def _parse_table(self, table: dict, document: dict) -> list[dict]:
        """Parseia tabela do Google Docs.

        Tabela na pauta tem duas colunas:
        - Coluna 0 (esquerda): B-rolls/instrucoes de video
        - Coluna 1 (direita): Roteiro/script do apresentador
        """
        elements = []
        for row in table.get("tableRows", []):
            cells = row.get("tableCells", [])
            for col_index, cell in enumerate(cells):
                for cell_content in cell.get("content", []):
                    paragraph = cell_content.get("paragraph")
                    if paragraph:
                        elem = self._parse_paragraph(paragraph, document)
                        if elem["text"]:
                            elem["table_column"] = col_index
                            elements.append(elem)
        return elements

    @staticmethod
    def extract_doc_id(url: str) -> Optional[str]:
        """Extrai o ID do documento a partir de uma URL do Google Docs."""
        patterns = [
            r"/document/d/([a-zA-Z0-9_-]+)",
            r"id=([a-zA-Z0-9_-]+)",
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
