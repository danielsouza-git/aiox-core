"""Debug: mostra o que o parser extrai do Google Docs."""
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

# Resolve paths
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

print("=" * 80)
print("INSTRUCOES CLASSIFICADAS (com fix)")
print("=" * 80)

global_order = 0
for block in blocks:
    instructions, global_order = classify_instructions(block, global_order)
    block.instructions = instructions
    for instr in instructions:
        extra = ""
        if instr.tarja_title:
            extra = f"\n    title='{instr.tarja_title}'\n    sub='{instr.tarja_subtitle}'"
        if instr.text:
            preview = instr.text[:200].replace('\n', ' | ')
            extra += f"\n    roteiro_content='{preview}...'"
        if instr.url:
            extra += f"\n    url={instr.url[:60]}"
        print(f"  [{instr.type.value:15s}] block='{instr.news_block[:30]}'{extra}")

tarjas = [i for b in blocks for i in b.instructions if i.type.value == "tarja"]
print(f"\nTotal tarjas: {len(tarjas)}")
for t in tarjas:
    print(f"  - '{t.tarja_title}' | sub='{t.tarja_subtitle}' | has_roteiro={'yes' if t.text else 'no'}")
