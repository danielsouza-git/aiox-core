"""Utilitario temporario: verifica quais links de pautas nao tem logo local.

Uso:
    python check_logos.py <url_google_doc_1> [url_google_doc_2] ...
    python check_logos.py <url_pasta_google_drive>

Aceita URLs de Google Docs individuais OU de pasta do Google Drive.
Para pastas, recursivamente encontra todos os Google Docs dentro.
Abre cada Google Doc, extrai todos os links de noticias,
e lista apenas os que NAO tem logo em assets/logos/.
Os links sao clicaveis no terminal.
"""

import os
import re
import sys
from urllib.parse import urlparse

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGOS_DIR = os.path.join(BASE_DIR, "assets", "logos")
CREDENTIALS_PATH = os.path.join(BASE_DIR, "config", "credentials.json")
TOKEN_PATH = os.path.join(BASE_DIR, "config", "token.json")

# Dominios ignorados (nao sao veiculos de noticia)
IGNORED_DOMAINS = {
    "docs.google.com",
    "drive.google.com",
    "youtube.com",
    "www.youtube.com",
    "youtu.be",
    "twitter.com",
    "x.com",
    "instagram.com",
    "www.instagram.com",
    "facebook.com",
    "www.facebook.com",
    "t.me",
    "telegram.org",
    "tiktok.com",
    "www.tiktok.com",
    "linkedin.com",
    "www.linkedin.com",
    "bit.ly",
    "goo.gl",
    "open.spotify.com",
    "chatgpt.com",
    "en.wikipedia.org",
    "streamyard.com",
    "dailymotion.com",
    "www.dailymotion.com",
}


def has_local_logo(news_url: str) -> bool:
    """Replica a logica de _get_local_logo do slide_processor."""
    parsed = urlparse(news_url)
    domain = parsed.netloc.lower().replace("www.", "")

    candidates = [
        domain,
        domain.rsplit(".", 1)[0],
    ]
    if domain.count(".") > 1:
        candidates.append(domain.split(".")[0])

    for name in candidates:
        for ext in [".png", ".jpg", ".jpeg", ".webp", ".PNG", ".JPG"]:
            path = os.path.join(LOGOS_DIR, f"{name}{ext}")
            if os.path.exists(path):
                return True
    return False


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".bmp"}

# Dominios que hospedam imagens/CDN (nao sao veiculos)
IMAGE_HOSTS = {
    "pbs.twimg.com",
    "img.theepochtimes.com",
    "cdn.pixabay.com",
    "images.unsplash.com",
    "i.imgur.com",
    "blogger.googleusercontent.com",
    "gettyimages.com",
    "www.gettyimages.com",
    "gettyimages.com.br",
    "www.gettyimages.com.br",
    "img-s-msn-com.akamaized.net",
    "content.api.news",
    "static.poder360.com.br",
    "medias.itatiaia.com.br",
    "storage.courtlistener.com",
    "lh7-rt.googleusercontent.com",
    "cdn.jwplayer.com",
    "images.wsj.net",
    "mediaassets.kshb.com",
    "image.mfa.go.th",
}


def is_news_url(url: str) -> bool:
    """Filtra URLs que sao provavelmente de noticias (nao imagens)."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        if not domain:
            return False
        if domain in IGNORED_DOMAINS:
            return False
        if domain in IMAGE_HOSTS:
            return False
        # Ignora URLs internas do Google
        if "google.com" in domain:
            return False
        # Precisa ter pelo menos um path (nao so homepage)
        if parsed.path in ("", "/"):
            return False
        # Ignora URLs que sao diretamente imagens
        path_lower = parsed.path.lower()
        if any(path_lower.endswith(ext) for ext in IMAGE_EXTENSIONS):
            return False
        # Ignora URLs com _next/image (CDN de imagens de sites)
        if "/_next/image" in parsed.path or "/image?" in parsed.path:
            return False
        return True
    except Exception:
        return False


def extract_links_from_doc(docs_client, doc_url: str) -> list[str]:
    """Extrai todos os links de um Google Doc."""
    from src.google_api.docs_client import DocsClient

    doc_id = DocsClient.extract_doc_id(doc_url)
    if not doc_id:
        print(f"  ERRO: Nao consegui extrair doc_id de: {doc_url}")
        return []

    elements = docs_client.extract_text_with_links(doc_id)
    links = []
    for elem in elements:
        for link in elem.get("links", []):
            url = link.get("url", "")
            if url and is_news_url(url):
                links.append(url)
    return links


def is_drive_folder_url(url: str) -> bool:
    """Verifica se a URL eh de uma pasta do Google Drive."""
    return "drive.google.com" in url and "/folders/" in url


def extract_folder_id(url: str) -> str | None:
    """Extrai o folder ID de uma URL do Google Drive."""
    match = re.search(r"/folders/([a-zA-Z0-9_-]+)", url)
    return match.group(1) if match else None


def list_docs_in_folder(drive_service, folder_id: str, path: str = "") -> list[dict]:
    """Lista recursivamente todos os Google Docs dentro de uma pasta do Drive.

    Returns:
        Lista de dicts com 'id', 'name' e 'path' de cada Google Doc.
    """
    docs = []
    page_token = None

    while True:
        response = drive_service.files().list(
            q=f"'{folder_id}' in parents and trashed = false",
            fields="nextPageToken, files(id, name, mimeType)",
            pageSize=100,
            pageToken=page_token,
            supportsAllDrives=True,
            includeItemsFromAllDrives=True,
        ).execute()

        for item in response.get("files", []):
            item_path = f"{path}/{item['name']}" if path else item["name"]

            if item["mimeType"] == "application/vnd.google-apps.folder":
                # Recurse into subfolder
                print(f"  Pasta: {item_path}/")
                docs.extend(list_docs_in_folder(drive_service, item["id"], item_path))
            elif item["mimeType"] == "application/vnd.google-apps.document":
                docs.append({"id": item["id"], "name": item["name"], "path": item_path})

        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return docs


def main():
    if len(sys.argv) < 2:
        print("Uso: python check_logos.py <url_doc_ou_pasta> [url_doc_2] ...")
        print()
        print("Exemplos:")
        print("  python check_logos.py https://docs.google.com/document/d/abc123/edit")
        print("  python check_logos.py https://drive.google.com/drive/u/0/folders/abc123")
        sys.exit(1)

    urls = sys.argv[1:]

    # Separa folders de docs
    folder_urls = [u for u in urls if is_drive_folder_url(u)]
    doc_urls = [u for u in urls if not is_drive_folder_url(u)]

    # Setup Google APIs
    from src.google_api.auth import build_docs_service, build_drive_service
    from src.google_api.docs_client import DocsClient

    print("Conectando ao Google APIs...")
    docs_service = build_docs_service(CREDENTIALS_PATH, TOKEN_PATH)
    docs_client = DocsClient(docs_service)

    # Se tem pastas, usa Drive API para encontrar docs
    if folder_urls:
        drive_service = build_drive_service(CREDENTIALS_PATH, TOKEN_PATH)

        for folder_url in folder_urls:
            folder_id = extract_folder_id(folder_url)
            if not folder_id:
                print(f"ERRO: Nao consegui extrair folder_id de: {folder_url}")
                continue

            print(f"\nEscaneando pasta do Drive: {folder_url[:80]}...")
            found_docs = list_docs_in_folder(drive_service, folder_id)
            print(f"  {len(found_docs)} Google Docs encontrados")

            for doc in found_docs:
                doc_urls.append(f"https://docs.google.com/document/d/{doc['id']}/edit")
                # Guarda o nome para exibir depois
                doc["url"] = doc_urls[-1]

    if not doc_urls:
        print("\nNenhum Google Doc encontrado.")
        sys.exit(0)

    print(f"\nTotal: {len(doc_urls)} docs para processar\n")

    # Coleta todos os links sem logo
    missing = {}  # domain -> list of urls

    for i, doc_url in enumerate(doc_urls, 1):
        print(f"[{i}/{len(doc_urls)}] Processando: {doc_url[:80]}...")
        links = extract_links_from_doc(docs_client, doc_url)
        print(f"  {len(links)} links de noticias encontrados")

        for url in links:
            if not has_local_logo(url):
                domain = urlparse(url).netloc.lower().replace("www.", "")
                if domain not in missing:
                    missing[domain] = []
                if url not in missing[domain]:
                    missing[domain].append(url)

    # Resultado
    if not missing:
        print("\n" + "=" * 60)
        print("TODOS os links ja tem logo local!")
        print("=" * 60)
        return

    # Logos existentes para referencia
    existing_logos = os.listdir(LOGOS_DIR) if os.path.exists(LOGOS_DIR) else []

    print("\n" + "=" * 60)
    print(f"LOGOS FALTANDO — {len(missing)} dominios sem logo")
    print("=" * 60)
    print(f"\nLogos existentes: {', '.join(sorted(existing_logos))}")
    print(f"Pasta: {LOGOS_DIR}\n")

    for domain in sorted(missing.keys()):
        urls = missing[domain]
        suggested_name = domain.rsplit(".", 1)[0]
        print(f"--- {domain} (salvar como: {suggested_name}.png) ---")
        for url in urls:
            print(f"  {url}")
        print()

    print(f"Total: {sum(len(v) for v in missing.values())} links de {len(missing)} dominios sem logo")
    print(f"\nPara resolver: baixe o logo de cada dominio e salve em:")
    print(f"  {LOGOS_DIR}/<nome>.png")


if __name__ == "__main__":
    main()
