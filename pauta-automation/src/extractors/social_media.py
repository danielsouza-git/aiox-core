"""Extrator de conteudo de postagens de redes sociais.

Suporta: X (Twitter), Truth Social, Instagram, Telegram.
Estrategia: oEmbed API quando disponivel, scraping como fallback.
"""

import os
import re
import tempfile
from typing import Optional

import httpx
from bs4 import BeautifulSoup

from src.core.models import Platform, PostContent


# Timeout padrao para requests HTTP
HTTP_TIMEOUT = 15.0

# Headers para simular browser
BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8",
}

# Diretorio para assets de logos de plataformas
ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "assets", "platform_logos")


def extract_post_content(url: str, platform: Platform) -> PostContent:
    """Extrai conteudo de uma postagem de rede social.

    Args:
        url: URL da postagem.
        platform: Plataforma detectada.

    Returns:
        PostContent com foto de perfil, handle, texto, etc.

    Raises:
        ExtractionError: Se nao conseguir extrair conteudo minimo.
    """
    extractors = {
        Platform.X: _extract_x,
        Platform.TRUTH: _extract_truth,
        Platform.INSTAGRAM: _extract_instagram,
        Platform.TELEGRAM: _extract_telegram,
    }

    extractor = extractors.get(platform)
    if not extractor:
        raise ExtractionError(f"Plataforma nao suportada: {platform}")

    try:
        return extractor(url)
    except ExtractionError:
        raise
    except Exception as e:
        raise ExtractionError(f"Falha ao extrair conteudo de {platform.value}: {e}")


class ExtractionError(Exception):
    """Erro ao extrair conteudo de postagem."""
    pass


# ──────────────────────────────────────────────
# X (Twitter)
# ──────────────────────────────────────────────

def _extract_x(url: str) -> PostContent:
    """Extrai conteudo de postagem do X/Twitter.

    Estrategia:
    1. Syndication API (publish.twitter.com) — mais confiavel
    2. Fallback: Nitter instance
    """
    # Normaliza URL (twitter.com → x.com)
    url = url.replace("twitter.com", "x.com")

    # Tenta syndication API (oEmbed-like)
    try:
        return _extract_x_via_syndication(url)
    except Exception:
        pass

    # Fallback: tenta nitter
    try:
        return _extract_x_via_nitter(url)
    except Exception:
        pass

    # Ultimo fallback: retorna dados parciais extraidos da URL
    return _extract_x_from_url(url)


def _extract_x_via_syndication(url: str) -> PostContent:
    """Usa a syndication API do Twitter para extrair tweet."""
    # Extrai tweet ID da URL
    tweet_id = _extract_tweet_id(url)
    if not tweet_id:
        raise ExtractionError("Nao conseguiu extrair tweet ID da URL")

    syndication_url = f"https://cdn.syndication.twimg.com/tweet-result?id={tweet_id}&token=x"

    with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
        resp = client.get(syndication_url)
        if resp.status_code != 200:
            raise ExtractionError(f"Syndication API retornou {resp.status_code}")

        data = resp.json()

    user = data.get("user", {})
    text = data.get("text", "")

    # Limpa entidades do texto (remove t.co links no final)
    text = re.sub(r"\s*https://t\.co/\S+\s*$", "", text).strip()

    return PostContent(
        profile_image_url=user.get("profile_image_url_https", "").replace("_normal", "_400x400"),
        handle=f"@{user.get('screen_name', '')}",
        display_name=user.get("name", ""),
        text=text,
        platform=Platform.X,
        platform_logo_path=_get_platform_logo_path(Platform.X),
    )


def _extract_x_via_nitter(url: str) -> PostContent:
    """Fallback: usa instancia Nitter para extrair tweet."""
    tweet_id = _extract_tweet_id(url)
    if not tweet_id:
        raise ExtractionError("Nao conseguiu extrair tweet ID")

    # Extrai username da URL
    match = re.search(r"(?:x|twitter)\.com/([^/]+)/status", url)
    username = match.group(1) if match else ""

    # Tenta instancias nitter conhecidas
    nitter_instances = [
        "nitter.privacydev.net",
        "nitter.poast.org",
    ]

    for instance in nitter_instances:
        try:
            nitter_url = f"https://{instance}/{username}/status/{tweet_id}"
            with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
                resp = client.get(nitter_url)
                if resp.status_code != 200:
                    continue

            soup = BeautifulSoup(resp.text, "html.parser")

            # Extrai dados do HTML do Nitter
            content_el = soup.select_one(".tweet-content")
            avatar_el = soup.select_one(".tweet-avatar img")
            name_el = soup.select_one(".fullname")

            text = content_el.get_text(strip=True) if content_el else ""
            avatar_url = avatar_el.get("src", "") if avatar_el else ""
            display_name = name_el.get_text(strip=True) if name_el else ""

            if text:
                return PostContent(
                    profile_image_url=avatar_url,
                    handle=f"@{username}",
                    display_name=display_name,
                    text=text,
                    platform=Platform.X,
                    platform_logo_path=_get_platform_logo_path(Platform.X),
                )
        except Exception:
            continue

    raise ExtractionError("Nenhuma instancia Nitter funcionou")


def _extract_x_from_url(url: str) -> PostContent:
    """Ultimo fallback: extrai dados minimos da URL."""
    match = re.search(r"(?:x|twitter)\.com/([^/]+)/status", url)
    username = match.group(1) if match else "unknown"

    return PostContent(
        profile_image_url="",
        handle=f"@{username}",
        display_name=username,
        text="[Texto nao extraido — verifique manualmente]",
        platform=Platform.X,
        platform_logo_path=_get_platform_logo_path(Platform.X),
    )


def _extract_tweet_id(url: str) -> Optional[str]:
    """Extrai tweet ID de URL do X/Twitter."""
    match = re.search(r"/status/(\d+)", url)
    return match.group(1) if match else None


# ──────────────────────────────────────────────
# Truth Social
# ──────────────────────────────────────────────

def _extract_truth(url: str) -> PostContent:
    """Extrai conteudo de postagem do Truth Social via scraping."""
    with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
        resp = client.get(url)
        if resp.status_code != 200:
            raise ExtractionError(f"Truth Social retornou {resp.status_code}")

    soup = BeautifulSoup(resp.text, "html.parser")

    # Tenta extrair via meta tags (Open Graph)
    og_title = _get_meta(soup, "og:title") or ""
    og_description = _get_meta(soup, "og:description") or ""
    og_image = _get_meta(soup, "og:image") or ""

    # Extrai username da URL
    match = re.search(r"truthsocial\.com/@([^/]+)", url)
    username = match.group(1) if match else "unknown"

    text = og_description or og_title or "[Texto nao extraido]"

    return PostContent(
        profile_image_url=og_image,
        handle=f"@{username}",
        display_name=username,
        text=text,
        platform=Platform.TRUTH,
        platform_logo_path=_get_platform_logo_path(Platform.TRUTH),
    )


# ──────────────────────────────────────────────
# Instagram
# ──────────────────────────────────────────────

def _extract_instagram(url: str) -> PostContent:
    """Extrai conteudo de postagem do Instagram via oEmbed API."""
    # oEmbed API do Instagram
    oembed_url = f"https://api.instagram.com/oembed?url={url}"

    try:
        with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
            resp = client.get(oembed_url)
            if resp.status_code == 200:
                data = resp.json()
                author = data.get("author_name", "")
                title = data.get("title", "")

                return PostContent(
                    profile_image_url="",  # oEmbed nao retorna avatar
                    handle=f"@{author}" if author else "@unknown",
                    display_name=author,
                    text=title or "[Texto nao extraido]",
                    platform=Platform.INSTAGRAM,
                    platform_logo_path=_get_platform_logo_path(Platform.INSTAGRAM),
                )
    except Exception:
        pass

    # Fallback: extrai username da URL
    match = re.search(r"instagram\.com/([^/]+)", url)
    username = match.group(1) if match else "unknown"

    return PostContent(
        profile_image_url="",
        handle=f"@{username}",
        display_name=username,
        text="[Texto nao extraido — verifique manualmente]",
        platform=Platform.INSTAGRAM,
        platform_logo_path=_get_platform_logo_path(Platform.INSTAGRAM),
    )


# ──────────────────────────────────────────────
# Telegram
# ──────────────────────────────────────────────

def _extract_telegram(url: str) -> PostContent:
    """Extrai conteudo de postagem do Telegram via embed page."""
    # Normaliza URL para embed
    embed_url = url.rstrip("/")
    if "?embed" not in embed_url:
        embed_url += "?embed=1"

    with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
        resp = client.get(embed_url)
        if resp.status_code != 200:
            raise ExtractionError(f"Telegram retornou {resp.status_code}")

    soup = BeautifulSoup(resp.text, "html.parser")

    # Extrai dados do embed
    text_el = soup.select_one(".tgme_widget_message_text")
    author_el = soup.select_one(".tgme_widget_message_author_name")
    photo_el = soup.select_one(".tgme_widget_message_user_photo img")

    text = text_el.get_text(strip=True) if text_el else ""
    author = author_el.get_text(strip=True) if author_el else ""
    photo_url = photo_el.get("src", "") if photo_el else ""

    # Extrai channel name da URL
    match = re.search(r"t\.me/([^/]+)", url)
    channel = match.group(1) if match else "unknown"

    return PostContent(
        profile_image_url=photo_url,
        handle=f"@{channel}",
        display_name=author or channel,
        text=text or "[Texto nao extraido]",
        platform=Platform.TELEGRAM,
        platform_logo_path=_get_platform_logo_path(Platform.TELEGRAM),
    )


# ──────────────────────────────────────────────
# Utilidades
# ──────────────────────────────────────────────

def _get_meta(soup: BeautifulSoup, property_name: str) -> Optional[str]:
    """Extrai conteudo de uma meta tag."""
    tag = soup.find("meta", property=property_name) or soup.find("meta", attrs={"name": property_name})
    return tag.get("content") if tag else None


def _get_platform_logo_path(platform: Platform) -> str:
    """Retorna path do logo da plataforma."""
    logo_map = {
        Platform.X: "x.png",
        Platform.TRUTH: "truth.png",
        Platform.INSTAGRAM: "instagram.png",
        Platform.TELEGRAM: "telegram.png",
    }
    filename = logo_map.get(platform, "")
    return os.path.join(ASSETS_DIR, filename) if filename else ""


def download_image(url: str, output_dir: Optional[str] = None) -> Optional[str]:
    """Baixa imagem de URL e salva em arquivo temporario.

    Args:
        url: URL da imagem.
        output_dir: Diretorio de destino. Se None, usa temp.

    Returns:
        Path do arquivo baixado, ou None se falhar.
    """
    if not url:
        return None

    try:
        with httpx.Client(timeout=HTTP_TIMEOUT, headers=BROWSER_HEADERS, follow_redirects=True) as client:
            resp = client.get(url)
            if resp.status_code != 200:
                return None

        # Detecta extensao
        content_type = resp.headers.get("content-type", "")
        ext = ".png"
        if "jpeg" in content_type or "jpg" in content_type:
            ext = ".jpg"
        elif "webp" in content_type:
            ext = ".webp"

        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            path = os.path.join(output_dir, f"img_{id(url) % 100000}{ext}")
        else:
            fd, path = tempfile.mkstemp(suffix=ext)
            os.close(fd)

        with open(path, "wb") as f:
            f.write(resp.content)

        return path

    except Exception:
        return None
