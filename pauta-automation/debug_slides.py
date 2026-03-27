"""Debug: mostra URLs de imagens extraidas para slides."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.core.config import load_config
from src.google_api.auth import build_docs_service
from src.google_api.docs_client import DocsClient
from src.parser.structure_parser import parse_structure
from src.parser.instruction_classifier import classify_instructions

DOC_URL = "https://docs.google.com/document/d/1gFf7ik37j-ByM3MwelCjtgHZwdmkWDbhI4inBfHw7lg/edit?usp=sharing"

config = load_config()
project_dir = os.path.dirname(os.path.abspath(__file__))
creds_path = config.google.credentials_path
token_path = config.google.token_path
if not os.path.isabs(creds_path):
    creds_path = os.path.join(project_dir, creds_path)
if not os.path.isabs(token_path):
    token_path = os.path.join(project_dir, token_path)

service = build_docs_service(creds_path, token_path)
docs_client = DocsClient(service)
doc_id = DocsClient.extract_doc_id(DOC_URL)
elements = docs_client.extract_text_with_links(doc_id)

blocks = parse_structure(elements)

global_order = 0
for block in blocks:
    instructions, global_order = classify_instructions(block, global_order)
    block.instructions = instructions

# Mostra URLs completas de slides
for block in blocks:
    for instr in block.instructions:
        if not instr.type.value.startswith("slide_"):
            continue
        print(f"\n[{instr.type.value}] block='{instr.news_block[:25]}'")
        if instr.url:
            print(f"  url: {instr.url}")
        for u in (instr.urls or []):
            print(f"  urls[]: {u}")
