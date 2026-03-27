"""Extrator de conteudo de artigos de noticias.

Extrai titulo e logo/favicon de URLs de noticias.
"""

import json
import os
import re
import tempfile
from typing import Optional
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

from src.core.models import NewsContent


HTTP_TIMEOUT = 15.0

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,"
              "image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
}

# Mapeamento de dominios conhecidos para nomes legiveis
KNOWN_SOURCES = {
    "reuters.com": "Reuters",
    "ft.com": "Financial Times",
    "nytimes.com": "The New York Times",
    "washingtonpost.com": "The Washington Post",
    "bbc.com": "BBC",
    "bbc.co.uk": "BBC",
    "cnn.com": "CNN",
    "foxnews.com": "Fox News",
    "theguardian.com": "The Guardian",
    "apnews.com": "Associated Press",
    "bloomberg.com": "Bloomberg",
    "wsj.com": "The Wall Street Journal",
    "politico.com": "Politico",
    "thehill.com": "The Hill",
    "axios.com": "Axios",
    "nbcnews.com": "NBC News",
    "abcnews.go.com": "ABC News",
    "cbsnews.com": "CBS News",
    "aljazeera.com": "Al Jazeera",
    "epochtimes.com": "The Epoch Times",
    "theepochtimes.com": "The Epoch Times",
    "ntd.com": "NTD",
}


class NewsExtractionError(Exception):
    """Erro ao extrair conteudo de noticia."""
    pass


def extract_news_content(url: str) -> NewsContent:
    """Extrai titulo e informacoes do veiculo de uma URL de noticia.

    Cadeia de fallback:
    1. httpx GET com headers de browser → parse HTML (meta tags, JSON-LD, h1)
    2. Se HTTP nao-200 mas tem body → parse mesmo assim (paywall retorna og:title)
    3. Se titulo nao extraido → Playwright com Chrome real
    4. Se tudo falhar → monta titulo a partir do slug da URL

    Args:
        url: URL do artigo.

    Returns:
        NewsContent com titulo, nome do veiculo e URL do logo.
    """
    import logging
    logger = logging.getLogger(__name__)

    html = None
    try:
        with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
            resp = client.get(url)
            html = resp.text
            if resp.status_code != 200:
                logger.info("URL retornou %d: %s", resp.status_code, url[:80])
    except httpx.RequestError as e:
        logger.warning("Falha no request HTTP para %s: %s", url[:80], e)

    # Tenta parsear HTML (funciona mesmo em 403/paywall se o body tem meta tags)
    if html and len(html) > 200:
        soup = BeautifulSoup(html, "html.parser")
        title = _extract_title(soup)
        source_name = _extract_source_name(soup, url)
        logo_url = _extract_logo_url(soup, url)

        if title and _is_valid_title(title, url):
            return NewsContent(
                title=title,
                source_name=source_name,
                logo_url=logo_url,
            )

    # Fallback: tenta montar titulo a partir do slug da URL
    # Muitos sites (WhiteHouse, etc) tem slugs legiveis que geram bons titulos
    url_result = _fallback_from_url(url, "HTML sem titulo")
    if _is_good_slug_title(url_result.title):
        logger.info("Titulo extraido do slug da URL: %s", url_result.title)
        return url_result

    # Ultimo fallback: Chrome real (para sites com JS-only rendering ou bot detection)
    logger.info("Slug insuficiente, tentando Chrome real: %s", url[:80])
    result = _fetch_via_browser(url)
    if result.title and _is_valid_title(result.title, url):
        return result

    # Se Chrome tambem falhou, usa o que temos do slug
    return url_result


def _fetch_via_browser(url: str) -> NewsContent:
    """Fallback via Chrome real para sites com bot detection (NYTimes, etc).

    Usa Playwright com channel='chrome' para abrir o Chrome instalado no sistema.
    Mais lento (~5s) mas passa por paywalls e bot detection.
    """
    import logging
    logger = logging.getLogger(__name__)
    logger.info("Tentando fetch via Chrome real para: %s", url)

    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False, channel="chrome")
            context = browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/122.0.0.0 Safari/537.36"
                ),
            )
            page = context.new_page()
            page.goto(url, wait_until="domcontentloaded", timeout=25000)

            # Espera um pouco para JS renderizar o titulo
            page.wait_for_timeout(2000)

            html = page.content()
            browser.close()

        if html and len(html) > 500:
            soup = BeautifulSoup(html, "html.parser")
            title = _extract_title(soup)
            source_name = _extract_source_name(soup, url)
            logo_url = _extract_logo_url(soup, url)

            if title and _is_valid_title(title, url):
                logger.info("Chrome real extraiu titulo: %s", title[:80])
                return NewsContent(
                    title=title,
                    source_name=source_name,
                    logo_url=logo_url,
                )

    except Exception as e:
        logger.warning("Fallback via Chrome falhou: %s", e)

    return _fallback_from_url(url, "Chrome real tambem falhou")



def _fallback_from_url(url: str, reason: str) -> NewsContent:
    """Fallback quando o fetch falha (403, timeout, etc).

    Tenta montar NewsContent a partir do dominio (KNOWN_SOURCES) e da URL.
    Assim o slide ainda e criado, mesmo sem conseguir acessar a pagina.
    """
    import logging
    logger = logging.getLogger(__name__)
    logger.warning("Fetch falhou (%s), usando fallback para: %s", reason, url)

    parsed = urlparse(url)
    domain = parsed.netloc.lower().replace("www.", "")
    base_url = f"{parsed.scheme}://{parsed.netloc}"

    # Nome do veiculo via KNOWN_SOURCES
    source_name = None
    for known_domain, name in KNOWN_SOURCES.items():
        if domain.endswith(known_domain):
            source_name = name
            break
    if not source_name:
        parts = domain.split(".")
        source_name = parts[-2].capitalize() if len(parts) >= 2 else domain

    # Titulo: tenta extrair da URL (ultimo segmento do path, slugified)
    path_parts = [p for p in parsed.path.strip("/").split("/") if p]
    if path_parts:
        slug = path_parts[-1]
        # Remove extensao (.html, .htm)
        for ext in [".html", ".htm", ".php"]:
            if slug.lower().endswith(ext):
                slug = slug[: -len(ext)]
        # Remove datas no formato YYYY-MM-DD do final do slug
        slug = re.sub(r"[-_]?\d{4}[-_]\d{2}[-_]\d{2}$", "", slug)
        # Remove IDs numericos puros no final (ex: "-12345")
        slug = re.sub(r"[-_]\d{6,}$", "", slug)
        # Converte slug para titulo legivel: "trump-harvard-payment" -> "Trump Harvard Payment"
        title = slug.replace("-", " ").replace("_", " ").strip().title()
    else:
        title = "[Titulo nao disponivel]"

    # Logo: favicon padrao
    logo_url = f"{base_url}/favicon.ico"

    return NewsContent(
        title=title,
        source_name=source_name,
        logo_url=logo_url,
    )


def _is_valid_title(title: str, url: str) -> bool:
    """Verifica se o titulo extraido e real (nao generico/placeholder).

    Rejeita titulos que sao:
    - Placeholders do nosso sistema
    - Apenas o dominio do site (ex: "nytimes.com")
    - Mensagens de erro genericas
    - Muito curtos (<5 chars)
    """
    if not title or len(title) < 5:
        return False

    invalid = [
        "[Titulo nao extraido]",
        "[Titulo nao disponivel]",
    ]
    if title in invalid:
        return False

    # Rejeita se e apenas o dominio
    parsed = urlparse(url)
    domain = parsed.netloc.lower().replace("www.", "")
    if title.lower().strip(".") in (domain, domain.split(".")[0]):
        return False

    # Rejeita mensagens de erro comuns
    error_phrases = [
        "page not found", "not found", "404",
        "access denied", "forbidden", "403",
        "just a moment", "checking your browser",
        "are you a robot", "captcha",
        "we can't find that page",
        "try searching",
        "something went wrong",
        "error loading",
        "unavailable",
        "application error",
        "server error",
        "internal error",
    ]
    title_lower = title.lower()
    for phrase in error_phrases:
        if phrase in title_lower:
            return False

    return True


def _is_good_slug_title(title: str) -> bool:
    """Verifica se o titulo gerado do slug da URL e legivel o suficiente.

    Rejeita slugs que sao IDs, hashes ou muito curtos.
    Aceita slugs com palavras reais (>= 3 palavras, maioria com 3+ letras).
    """
    if not title or title == "[Titulo nao disponivel]":
        return False

    words = title.split()
    if len(words) < 3:
        return False

    # Maioria das palavras devem ser alfabeticas (nao IDs/hashes)
    alpha_words = sum(1 for w in words if w.isalpha() and len(w) >= 2)
    return alpha_words >= len(words) * 0.6


def _extract_title(soup: BeautifulSoup) -> str:
    """Extrai titulo do artigo via multiplas estrategias.

    Prioridade:
    1. og:title / twitter:title (meta tags — funciona em ~90% dos sites)
    2. JSON-LD schema.org headline (funciona em sites com paywall como NYTimes, WSJ)
    3. <h1> tag (fallback estrutural)
    4. <title> tag (ultimo recurso, pode conter sufixo do site)
    """
    # 1. Meta tags (mais confiavel)
    for prop in ["og:title", "twitter:title"]:
        tag = soup.find("meta", property=prop) or soup.find("meta", attrs={"name": prop})
        if tag and tag.get("content"):
            return _clean_title(tag["content"].strip())

    # 2. JSON-LD schema.org (sites com paywall costumam ter isso)
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "")
            # Pode ser um objeto ou lista de objetos
            items = data if isinstance(data, list) else [data]
            for item in items:
                headline = item.get("headline") or item.get("name")
                if headline and isinstance(headline, str) and len(headline) > 5:
                    return _clean_title(headline.strip())
        except (json.JSONDecodeError, AttributeError):
            continue

    # 3. Tag h1 (fallback estrutural — geralmente e o titulo do artigo)
    h1 = soup.find("h1")
    if h1:
        text = h1.get_text(strip=True)
        if len(text) > 5:
            return _clean_title(text)

    # 4. Tag <title> (ultimo recurso)
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.get_text(strip=True)
        return _clean_title(title)

    return "[Titulo nao extraido]"


def _clean_title(title: str) -> str:
    """Remove sufixo do site e limita tamanho do titulo.

    So remove sufixo se a parte restante for substancial (>15 chars),
    para evitar cortar titulos que usam separadores no meio.
    Ex: "Biden - Trump: debate" NAO deve virar "Biden".
    """
    for sep in [" | ", " — ", " – ", " - "]:
        if sep in title:
            parts = title.rsplit(sep, 1)
            left = parts[0].strip()
            right = parts[1].strip() if len(parts) > 1 else ""
            # Remove sufixo se: parte esquerda e substancial E direita parece nome de site
            if len(left) > 15 and len(right) < 50:
                title = left
                break

    return title


def _extract_source_name(soup: BeautifulSoup, url: str) -> str:
    """Extrai nome do veiculo de noticias."""
    parsed = urlparse(url)
    domain = parsed.netloc.lower().replace("www.", "")

    # Verifica mapeamento conhecido
    for known_domain, name in KNOWN_SOURCES.items():
        if domain.endswith(known_domain):
            return name

    # Tenta meta tag og:site_name
    tag = soup.find("meta", property="og:site_name")
    if tag and tag.get("content"):
        return tag["content"].strip()

    # Tenta application-name
    tag = soup.find("meta", attrs={"name": "application-name"})
    if tag and tag.get("content"):
        return tag["content"].strip()

    # Fallback: usa dominio formatado
    parts = domain.split(".")
    if len(parts) >= 2:
        return parts[-2].capitalize()

    return domain


def _extract_logo_url(soup: BeautifulSoup, url: str) -> Optional[str]:
    """Extrai URL do logo do veiculo."""
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"

    # 1. Tenta apple-touch-icon (geralmente alta resolucao)
    icon = soup.find("link", rel=lambda x: x and "apple-touch-icon" in x)
    if icon and icon.get("href"):
        return _resolve_url(icon["href"], base_url)

    # 2. Tenta og:image (pode ser logo ou imagem do artigo)
    # Nao ideal pois geralmente e a imagem do artigo

    # 3. Tenta icon de alta resolucao
    for rel_value in ["icon", "shortcut icon"]:
        icons = soup.find_all("link", rel=lambda x: x and rel_value in str(x).lower())
        best_icon = None
        best_size = 0
        for ic in icons:
            sizes = ic.get("sizes", "0x0")
            try:
                size = int(sizes.split("x")[0])
            except (ValueError, IndexError):
                size = 0
            if size > best_size:
                best_size = size
                best_icon = ic
        if best_icon and best_icon.get("href"):
            return _resolve_url(best_icon["href"], base_url)

    # 4. Fallback: favicon padrao
    return f"{base_url}/favicon.ico"


def _resolve_url(href: str, base_url: str) -> str:
    """Resolve URL relativa para absoluta."""
    if href.startswith("http"):
        return href
    if href.startswith("//"):
        return f"https:{href}"
    if href.startswith("/"):
        return f"{base_url}{href}"
    return f"{base_url}/{href}"


def download_logo(news_content: NewsContent, output_dir: Optional[str] = None) -> Optional[str]:
    """Baixa logo do veiculo e salva localmente.

    Args:
        news_content: NewsContent com logo_url preenchido.
        output_dir: Diretorio de destino. Se None, usa temp.

    Returns:
        Path do arquivo baixado (atualiza news_content.logo_path).
    """
    if not news_content.logo_url:
        return None

    try:
        with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
            resp = client.get(news_content.logo_url)
            if resp.status_code != 200:
                return None

        content_type = resp.headers.get("content-type", "")
        ext = ".png"
        if "jpeg" in content_type or "jpg" in content_type:
            ext = ".jpg"
        elif "ico" in content_type or news_content.logo_url.endswith(".ico"):
            ext = ".ico"
        elif "svg" in content_type:
            ext = ".svg"

        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            safe_name = re.sub(r"[^a-zA-Z0-9]", "_", news_content.source_name.lower())
            path = os.path.join(output_dir, f"logo_{safe_name}{ext}")
        else:
            fd, path = tempfile.mkstemp(suffix=ext)
            os.close(fd)

        with open(path, "wb") as f:
            f.write(resp.content)

        news_content.logo_path = path
        return path

    except Exception:
        return None
