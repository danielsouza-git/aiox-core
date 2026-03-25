"""Testes unitarios para o extrator de conteudo de noticias."""

import os
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from unittest.mock import patch, MagicMock

from src.extractors.news_extractor import (
    extract_news_content,
    download_logo,
    _extract_title,
    _extract_source_name,
    _extract_logo_url,
    _clean_title,
    _fallback_from_url,
    _is_valid_title,
    _is_good_slug_title,
    _resolve_url,
    KNOWN_SOURCES,
    NewsExtractionError,
)
from src.core.models import NewsContent
from bs4 import BeautifulSoup


# ---------------------------------------------------------------------------
# Fake HTML builders
# ---------------------------------------------------------------------------

def _html_with_og_title(title, site_name=None, logo_href=None):
    """Retorna HTML com og:title e opcionais og:site_name e apple-touch-icon.
    Inclui body com conteudo para ultrapassar o threshold de 200 chars
    em extract_news_content.
    """
    parts = [
        "<html><head>",
        f'<meta property="og:title" content="{title}">',
    ]
    if site_name:
        parts.append(f'<meta property="og:site_name" content="{site_name}">')
    if logo_href:
        parts.append(f'<link rel="apple-touch-icon" href="{logo_href}">')
    padding = '<p>' + 'x' * 200 + '</p>'
    parts.append(f"</head><body>{padding}</body></html>")
    return "\n".join(parts)


def _html_with_title_tag(title):
    """Retorna HTML apenas com <title> tag.
    Inclui body com conteudo para ultrapassar o threshold de 200 chars
    em extract_news_content.
    """
    padding = '<p>' + 'x' * 200 + '</p>'
    return f"<html><head><title>{title}</title></head><body>{padding}</body></html>"


def _html_with_h1(text, title_tag=None):
    """Retorna HTML com <h1> e opcionalmente <title>."""
    head = ""
    if title_tag:
        head = f"<title>{title_tag}</title>"
    return f"<html><head>{head}</head><body><h1>{text}</h1></body></html>"


def _html_with_jsonld(headline):
    """Retorna HTML com JSON-LD schema.org."""
    import json
    ld = json.dumps({"@type": "NewsArticle", "headline": headline})
    return f"""
    <html><head>
        <script type="application/ld+json">{ld}</script>
    </head><body></body></html>
    """


def _html_with_icons(icons):
    """Retorna HTML com <link rel="icon"> tags.
    icons: list of (rel, href, sizes) tuples.
    """
    parts = ["<html><head>"]
    for rel, href, sizes in icons:
        sizes_attr = f' sizes="{sizes}"' if sizes else ""
        parts.append(f'<link rel="{rel}" href="{href}"{sizes_attr}>')
    parts.append("</head><body></body></html>")
    return "\n".join(parts)


def _html_empty():
    """Retorna HTML minimo sem titulo."""
    return "<html><head></head><body><p>No content</p></body></html>"


# ---------------------------------------------------------------------------
# Helper para mock do httpx.Client
# ---------------------------------------------------------------------------

def _mock_client_get(response_text="", status_code=200, headers=None):
    """Cria mock do httpx.Client context manager."""
    mock_response = MagicMock()
    mock_response.text = response_text
    mock_response.status_code = status_code
    mock_response.content = response_text.encode("utf-8") if isinstance(response_text, str) else b""
    mock_response.headers = headers or {"content-type": "text/html"}

    mock_client = MagicMock()
    mock_client.get.return_value = mock_response
    mock_client.__enter__ = MagicMock(return_value=mock_client)
    mock_client.__exit__ = MagicMock(return_value=False)

    return mock_client


# ===========================================================================
# 1. _extract_title — prioridade de estrategias
# ===========================================================================

def test_extract_title_og_title():
    """og:title tem prioridade maxima."""
    html = _html_with_og_title("OG Title Here")
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_title(soup) == "OG Title Here"


def test_extract_title_twitter_title():
    """twitter:title funciona como alternativa a og:title."""
    html = '<html><head><meta name="twitter:title" content="Twitter Card Title"></head><body></body></html>'
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_title(soup) == "Twitter Card Title"


def test_extract_title_jsonld():
    """JSON-LD headline e usado quando meta tags ausentes."""
    html = _html_with_jsonld("JSON-LD Headline Article")
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_title(soup) == "JSON-LD Headline Article"


def test_extract_title_h1_fallback():
    """<h1> e usado como fallback estrutural."""
    html = _html_with_h1("H1 Article Title")
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_title(soup) == "H1 Article Title"


def test_extract_title_title_tag_fallback():
    """<title> tag e o ultimo recurso."""
    html = _html_with_title_tag("Page Title - News Site")
    soup = BeautifulSoup(html, "html.parser")
    title = _extract_title(soup)
    assert "Page Title" in title


def test_extract_title_no_title():
    """Retorna placeholder quando nenhum titulo encontrado."""
    html = _html_empty()
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_title(soup) == "[Titulo nao extraido]"


def test_extract_title_og_over_h1():
    """og:title tem prioridade sobre h1."""
    html = """
    <html><head>
        <meta property="og:title" content="OG Title">
    </head><body><h1>H1 Title</h1></body></html>
    """
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_title(soup) == "OG Title"


def test_extract_title_jsonld_list():
    """JSON-LD pode ser uma lista de objetos."""
    import json
    ld = json.dumps([
        {"@type": "WebPage", "name": "Page Name"},
        {"@type": "NewsArticle", "headline": "Article Headline"},
    ])
    html = f'<html><head><script type="application/ld+json">{ld}</script></head><body></body></html>'
    soup = BeautifulSoup(html, "html.parser")
    # Deve pegar o primeiro com headline ou name
    title = _extract_title(soup)
    assert title in ("Page Name", "Article Headline")


# ===========================================================================
# 2. _clean_title — remocao de sufixo
# ===========================================================================

def test_clean_title_removes_site_suffix():
    """Remove sufixo do site quando parte esquerda e substancial."""
    assert _clean_title("Biden signs new executive order on climate | Reuters") == "Biden signs new executive order on climate"


def test_clean_title_keeps_short_titles():
    """Nao remove separador quando parte esquerda e curta (<=15 chars)."""
    result = _clean_title("Biden - Trump: debate")
    assert "Biden" in result
    assert "Trump" in result


def test_clean_title_handles_multiple_separators():
    """Remove apenas o ultimo separador."""
    result = _clean_title("First part | Second part | Site Name")
    assert "First part | Second part" == result


def test_clean_title_no_separator():
    """Titulo sem separador permanece inalterado."""
    assert _clean_title("Simple Title Without Separator") == "Simple Title Without Separator"


# ===========================================================================
# 3. _extract_source_name — identificacao de veiculo
# ===========================================================================

def test_source_name_known_domain_reuters():
    """reuters.com -> Reuters."""
    soup = BeautifulSoup("<html><head></head></html>", "html.parser")
    assert _extract_source_name(soup, "https://www.reuters.com/article/123") == "Reuters"


def test_source_name_known_domain_nytimes():
    """nytimes.com -> The New York Times."""
    soup = BeautifulSoup("<html><head></head></html>", "html.parser")
    assert _extract_source_name(soup, "https://www.nytimes.com/2024/article") == "The New York Times"


def test_source_name_known_domain_bbc():
    """bbc.com -> BBC."""
    soup = BeautifulSoup("<html><head></head></html>", "html.parser")
    assert _extract_source_name(soup, "https://www.bbc.com/news/article") == "BBC"


def test_source_name_known_domain_bbc_couk():
    """bbc.co.uk -> BBC."""
    soup = BeautifulSoup("<html><head></head></html>", "html.parser")
    assert _extract_source_name(soup, "https://www.bbc.co.uk/news/article") == "BBC"


def test_source_name_from_og_site_name():
    """Usa og:site_name quando dominio nao e conhecido."""
    html = '<html><head><meta property="og:site_name" content="Folha de S.Paulo"></head></html>'
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_source_name(soup, "https://www.folha.uol.com.br/article") == "Folha de S.Paulo"


def test_source_name_from_application_name():
    """Usa application-name quando og:site_name ausente."""
    html = '<html><head><meta name="application-name" content="InfoMoney"></head></html>'
    soup = BeautifulSoup(html, "html.parser")
    assert _extract_source_name(soup, "https://www.infomoney.com.br/article") == "InfoMoney"


def test_source_name_fallback_domain():
    """Fallback para dominio formatado quando sem meta tags."""
    soup = BeautifulSoup("<html><head></head></html>", "html.parser")
    assert _extract_source_name(soup, "https://www.examplenews.com/article") == "Examplenews"


def test_all_known_sources_mapped():
    """Verifica que KNOWN_SOURCES contem veiculos principais."""
    assert "reuters.com" in KNOWN_SOURCES
    assert "nytimes.com" in KNOWN_SOURCES
    assert "cnn.com" in KNOWN_SOURCES
    assert "foxnews.com" in KNOWN_SOURCES
    assert "bbc.com" in KNOWN_SOURCES
    assert "bloomberg.com" in KNOWN_SOURCES
    assert "wsj.com" in KNOWN_SOURCES


# ===========================================================================
# 4. _extract_logo_url — extracao de logo/favicon
# ===========================================================================

def test_logo_url_apple_touch_icon():
    """Prioriza apple-touch-icon quando presente."""
    html = _html_with_icons([("apple-touch-icon", "/apple-icon-180x180.png", "180x180")])
    soup = BeautifulSoup(html, "html.parser")
    result = _extract_logo_url(soup, "https://www.reuters.com/article")
    assert result == "https://www.reuters.com/apple-icon-180x180.png"


def test_logo_url_icon_link():
    """Usa <link rel="icon"> quando apple-touch-icon ausente."""
    html = _html_with_icons([("icon", "/favicon-32x32.png", "32x32")])
    soup = BeautifulSoup(html, "html.parser")
    result = _extract_logo_url(soup, "https://www.cnn.com/article")
    assert result == "https://www.cnn.com/favicon-32x32.png"


def test_logo_url_largest_icon():
    """Seleciona o icone com maior resolucao."""
    html = _html_with_icons([
        ("icon", "/favicon-16x16.png", "16x16"),
        ("icon", "/favicon-32x32.png", "32x32"),
        ("icon", "/favicon-96x96.png", "96x96"),
    ])
    soup = BeautifulSoup(html, "html.parser")
    result = _extract_logo_url(soup, "https://example.com/article")
    assert "96x96" in result


def test_logo_url_fallback_favicon():
    """Fallback para /favicon.ico quando nenhum link encontrado."""
    html = "<html><head></head><body></body></html>"
    soup = BeautifulSoup(html, "html.parser")
    result = _extract_logo_url(soup, "https://www.reuters.com/article")
    assert result == "https://www.reuters.com/favicon.ico"


# ===========================================================================
# 5. _resolve_url — resolucao de URLs relativas
# ===========================================================================

def test_resolve_url_absolute():
    """URL absoluta permanece inalterada."""
    assert _resolve_url("https://cdn.example.com/icon.png", "https://example.com") == "https://cdn.example.com/icon.png"


def test_resolve_url_protocol_relative():
    """URL com // recebe https:."""
    assert _resolve_url("//cdn.example.com/icon.png", "https://example.com") == "https://cdn.example.com/icon.png"


def test_resolve_url_root_relative():
    """URL com / e concatenada com base_url."""
    assert _resolve_url("/images/icon.png", "https://example.com") == "https://example.com/images/icon.png"


def test_resolve_url_path_relative():
    """URL sem / e concatenada com base_url/."""
    assert _resolve_url("icon.png", "https://example.com") == "https://example.com/icon.png"


# ===========================================================================
# 6. _is_valid_title — validacao de titulo
# ===========================================================================

def test_valid_title_normal():
    """Titulo normal e valido."""
    assert _is_valid_title("Biden signs executive order on immigration", "https://reuters.com/article") is True


def test_valid_title_rejects_placeholder():
    """Rejeita placeholders do sistema."""
    assert _is_valid_title("[Titulo nao extraido]", "https://example.com") is False
    assert _is_valid_title("[Titulo nao disponivel]", "https://example.com") is False


def test_valid_title_rejects_domain():
    """Rejeita titulo que e apenas o dominio."""
    assert _is_valid_title("reuters.com", "https://reuters.com/article") is False
    assert _is_valid_title("reuters", "https://reuters.com/article") is False


def test_valid_title_rejects_short():
    """Rejeita titulos muito curtos (<5 chars)."""
    assert _is_valid_title("Hi", "https://example.com") is False
    assert _is_valid_title("", "https://example.com") is False


def test_valid_title_rejects_error_pages():
    """Rejeita titulos de paginas de erro."""
    assert _is_valid_title("Page Not Found", "https://example.com") is False
    assert _is_valid_title("403 Forbidden", "https://example.com") is False
    assert _is_valid_title("Just a moment... Checking your browser", "https://example.com") is False
    assert _is_valid_title("Something went wrong", "https://example.com") is False


def test_valid_title_accepts_titles_with_numbers():
    """Aceita titulos com numeros que nao sao de erro."""
    assert _is_valid_title("Top 10 economic policies of 2024", "https://example.com") is True


# ===========================================================================
# 7. _is_good_slug_title — validacao de titulo gerado do slug
# ===========================================================================

def test_good_slug_with_words():
    """Slug com 3+ palavras alfabeticas e bom."""
    assert _is_good_slug_title("Trump Harvard Payment Controversy") is True


def test_bad_slug_too_short():
    """Slug com menos de 3 palavras e ruim."""
    assert _is_good_slug_title("Short") is False
    assert _is_good_slug_title("Two Words") is False


def test_bad_slug_placeholder():
    """Placeholder nao e slug valido."""
    assert _is_good_slug_title("[Titulo nao disponivel]") is False


def test_bad_slug_empty():
    """String vazia nao e slug valido."""
    assert _is_good_slug_title("") is False
    assert _is_good_slug_title(None) is False


# ===========================================================================
# 8. _fallback_from_url — fallback quando fetch falha
# ===========================================================================

def test_fallback_known_source():
    """Fallback identifica veiculo conhecido por dominio."""
    result = _fallback_from_url("https://www.reuters.com/world/article-slug", "test")
    assert result.source_name == "Reuters"
    assert result.logo_url == "https://www.reuters.com/favicon.ico"


def test_fallback_title_from_slug():
    """Fallback gera titulo a partir do slug da URL."""
    result = _fallback_from_url("https://example.com/news/trump-harvard-payment", "test")
    assert "Trump" in result.title
    assert "Harvard" in result.title
    assert "Payment" in result.title


def test_fallback_strips_html_extension():
    """Fallback remove extensao .html do slug."""
    result = _fallback_from_url("https://example.com/news/article-title.html", "test")
    assert ".html" not in result.title


def test_fallback_unknown_source():
    """Fallback gera nome de veiculo a partir do dominio."""
    result = _fallback_from_url("https://www.obscurenews.com/article", "test")
    assert result.source_name == "Obscurenews"


def test_fallback_no_path():
    """Fallback com URL sem path retorna placeholder."""
    result = _fallback_from_url("https://reuters.com/", "test")
    assert result.title == "[Titulo nao disponivel]"


def test_fallback_removes_date_suffix():
    """Fallback remove datas YYYY-MM-DD do final do slug."""
    result = _fallback_from_url("https://example.com/article-title-2024-01-15", "test")
    assert "2024" not in result.title


def test_fallback_removes_numeric_ids():
    """Fallback remove IDs numericos longos do final do slug."""
    result = _fallback_from_url("https://example.com/article-title-1234567", "test")
    assert "1234567" not in result.title


# ===========================================================================
# 9. extract_news_content — integracao principal
# ===========================================================================

def test_extract_news_success_og_title():
    """Extracao bem-sucedida com og:title."""
    html = _html_with_og_title(
        "Brazil economy grows 3% in Q4",
        site_name="Reuters",
        logo_href="/apple-icon.png",
    )
    mock_client = _mock_client_get(response_text=html, status_code=200)

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with patch("src.extractors.news_extractor._fetch_via_browser"):
            result = extract_news_content("https://www.reuters.com/article/123")

    assert result.title == "Brazil economy grows 3% in Q4"
    assert result.source_name == "Reuters"
    assert result.logo_url is not None


def test_extract_news_success_title_tag():
    """Extracao com fallback para <title> tag."""
    html = _html_with_title_tag("Important News Article - CNN")
    mock_client = _mock_client_get(response_text=html, status_code=200)

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with patch("src.extractors.news_extractor._fetch_via_browser"):
            result = extract_news_content("https://www.cnn.com/2024/article")

    assert "Important News Article" in result.title
    assert result.source_name == "CNN"


def test_extract_news_paywall_with_meta():
    """Sites com paywall (403) mas com meta tags ainda extraem titulo."""
    html = _html_with_og_title("Paywall Article Title")
    mock_client = _mock_client_get(response_text=html, status_code=403)

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with patch("src.extractors.news_extractor._fetch_via_browser"):
            result = extract_news_content("https://www.wsj.com/articles/paywall-article")

    assert result.title == "Paywall Article Title"


def test_extract_news_http_failure_uses_url_fallback():
    """Quando HTTP falha completamente, usa fallback da URL."""
    import httpx as httpx_mod
    mock_client = _mock_client_get()
    mock_client.get.side_effect = httpx_mod.RequestError("Connection refused")

    def fake_browser(url):
        return _fallback_from_url(url, "browser also failed")

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with patch("src.extractors.news_extractor._fetch_via_browser", side_effect=fake_browser):
            result = extract_news_content("https://www.reuters.com/world/good-article-slug")

    assert isinstance(result, NewsContent)
    assert result.source_name == "Reuters"


def test_extract_news_empty_html_uses_fallback():
    """HTML muito curto (<200 chars) usa fallback."""
    mock_client = _mock_client_get(response_text="<html></html>", status_code=200)

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with patch("src.extractors.news_extractor._fetch_via_browser") as mock_browser:
            mock_browser.return_value = NewsContent(
                title="Browser Title",
                source_name="Source",
                logo_url=None,
            )
            with patch("src.extractors.news_extractor._is_good_slug_title", return_value=False):
                result = extract_news_content("https://example.com/article-slug")

    assert isinstance(result, NewsContent)


# ===========================================================================
# 10. download_logo
# ===========================================================================

def test_download_logo_success():
    """download_logo baixa logo e atualiza logo_path."""
    news = NewsContent(title="Test", source_name="Reuters", logo_url="https://reuters.com/favicon.ico")
    mock_client = _mock_client_get(
        response_text="fake_icon_bytes",
        status_code=200,
        headers={"content-type": "image/x-icon"},
    )

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = download_logo(news, output_dir=tmpdir)
            assert path is not None
            assert os.path.exists(path)
            assert news.logo_path == path


def test_download_logo_detects_ico():
    """download_logo detecta extensao .ico."""
    news = NewsContent(title="Test", source_name="CNN", logo_url="https://cnn.com/favicon.ico")
    mock_client = _mock_client_get(
        response_text="fake_icon",
        status_code=200,
        headers={"content-type": "image/x-icon"},
    )

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = download_logo(news, output_dir=tmpdir)
            assert path is not None
            assert path.endswith(".ico")


def test_download_logo_detects_svg():
    """download_logo detecta extensao SVG."""
    news = NewsContent(title="Test", source_name="Site", logo_url="https://site.com/logo.svg")
    mock_client = _mock_client_get(
        response_text="<svg></svg>",
        status_code=200,
        headers={"content-type": "image/svg+xml"},
    )

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = download_logo(news, output_dir=tmpdir)
            assert path is not None
            assert path.endswith(".svg")


def test_download_logo_returns_none_on_failure():
    """download_logo retorna None em falha HTTP."""
    news = NewsContent(title="Test", source_name="Site", logo_url="https://site.com/missing.png")
    mock_client = _mock_client_get(status_code=404)

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        path = download_logo(news)
        assert path is None


def test_download_logo_returns_none_when_no_url():
    """download_logo retorna None quando logo_url e None."""
    news = NewsContent(title="Test", source_name="Site", logo_url=None)
    path = download_logo(news)
    assert path is None


def test_download_logo_handles_exception():
    """download_logo retorna None quando httpx levanta excecao."""
    news = NewsContent(title="Test", source_name="Site", logo_url="https://site.com/logo.png")
    mock_client = _mock_client_get()
    mock_client.get.side_effect = Exception("Network timeout")

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        path = download_logo(news)
        assert path is None


def test_download_logo_safe_filename():
    """download_logo gera filename seguro a partir do source_name."""
    news = NewsContent(title="Test", source_name="The New York Times", logo_url="https://nyt.com/icon.png")
    mock_client = _mock_client_get(
        response_text="fake_png",
        status_code=200,
        headers={"content-type": "image/png"},
    )

    with patch("src.extractors.news_extractor.httpx.Client", return_value=mock_client):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = download_logo(news, output_dir=tmpdir)
            assert path is not None
            filename = os.path.basename(path)
            assert "logo_" in filename
            # Nao deve conter espacos ou caracteres especiais
            assert " " not in filename


# ===========================================================================
# 11. NewsExtractionError
# ===========================================================================

def test_news_extraction_error_is_exception():
    """NewsExtractionError e subclasse de Exception."""
    err = NewsExtractionError("test")
    assert isinstance(err, Exception)
    assert str(err) == "test"


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    print("=== Testes: news_extractor ===\n")

    tests = [
        # _extract_title
        ("1a. Title via og:title", test_extract_title_og_title),
        ("1b. Title via twitter:title", test_extract_title_twitter_title),
        ("1c. Title via JSON-LD", test_extract_title_jsonld),
        ("1d. Title via h1", test_extract_title_h1_fallback),
        ("1e. Title via <title> tag", test_extract_title_title_tag_fallback),
        ("1f. Title missing", test_extract_title_no_title),
        ("1g. OG over h1 priority", test_extract_title_og_over_h1),
        ("1h. JSON-LD list", test_extract_title_jsonld_list),
        # _clean_title
        ("2a. Clean title removes suffix", test_clean_title_removes_site_suffix),
        ("2b. Clean title keeps short", test_clean_title_keeps_short_titles),
        ("2c. Clean title multiple seps", test_clean_title_handles_multiple_separators),
        ("2d. Clean title no separator", test_clean_title_no_separator),
        # _extract_source_name
        ("3a. Source Reuters", test_source_name_known_domain_reuters),
        ("3b. Source NYTimes", test_source_name_known_domain_nytimes),
        ("3c. Source BBC .com", test_source_name_known_domain_bbc),
        ("3d. Source BBC .co.uk", test_source_name_known_domain_bbc_couk),
        ("3e. Source og:site_name", test_source_name_from_og_site_name),
        ("3f. Source application-name", test_source_name_from_application_name),
        ("3g. Source fallback domain", test_source_name_fallback_domain),
        ("3h. All known sources", test_all_known_sources_mapped),
        # _extract_logo_url
        ("4a. Logo apple-touch-icon", test_logo_url_apple_touch_icon),
        ("4b. Logo icon link", test_logo_url_icon_link),
        ("4c. Logo largest icon", test_logo_url_largest_icon),
        ("4d. Logo fallback favicon", test_logo_url_fallback_favicon),
        # _resolve_url
        ("5a. Resolve absolute", test_resolve_url_absolute),
        ("5b. Resolve protocol relative", test_resolve_url_protocol_relative),
        ("5c. Resolve root relative", test_resolve_url_root_relative),
        ("5d. Resolve path relative", test_resolve_url_path_relative),
        # _is_valid_title
        ("6a. Valid title normal", test_valid_title_normal),
        ("6b. Valid title rejects placeholder", test_valid_title_rejects_placeholder),
        ("6c. Valid title rejects domain", test_valid_title_rejects_domain),
        ("6d. Valid title rejects short", test_valid_title_rejects_short),
        ("6e. Valid title rejects error", test_valid_title_rejects_error_pages),
        ("6f. Valid title accepts numbers", test_valid_title_accepts_titles_with_numbers),
        # _is_good_slug_title
        ("7a. Good slug with words", test_good_slug_with_words),
        ("7b. Bad slug too short", test_bad_slug_too_short),
        ("7c. Bad slug placeholder", test_bad_slug_placeholder),
        ("7d. Bad slug empty", test_bad_slug_empty),
        # _fallback_from_url
        ("8a. Fallback known source", test_fallback_known_source),
        ("8b. Fallback title from slug", test_fallback_title_from_slug),
        ("8c. Fallback strips .html", test_fallback_strips_html_extension),
        ("8d. Fallback unknown source", test_fallback_unknown_source),
        ("8e. Fallback no path", test_fallback_no_path),
        ("8f. Fallback removes date", test_fallback_removes_date_suffix),
        ("8g. Fallback removes numeric ID", test_fallback_removes_numeric_ids),
        # extract_news_content integration
        ("9a. Extract news og:title", test_extract_news_success_og_title),
        ("9b. Extract news <title> tag", test_extract_news_success_title_tag),
        ("9c. Extract news paywall", test_extract_news_paywall_with_meta),
        ("9d. Extract news HTTP failure", test_extract_news_http_failure_uses_url_fallback),
        ("9e. Extract news empty HTML", test_extract_news_empty_html_uses_fallback),
        # download_logo
        ("10a. Download logo success", test_download_logo_success),
        ("10b. Download logo .ico", test_download_logo_detects_ico),
        ("10c. Download logo .svg", test_download_logo_detects_svg),
        ("10d. Download logo failure", test_download_logo_returns_none_on_failure),
        ("10e. Download logo no URL", test_download_logo_returns_none_when_no_url),
        ("10f. Download logo exception", test_download_logo_handles_exception),
        ("10g. Download logo safe filename", test_download_logo_safe_filename),
        # Error type
        ("11a. NewsExtractionError", test_news_extraction_error_is_exception),
    ]

    passed = 0
    failed = 0

    for name, test_fn in tests:
        try:
            test_fn()
            print(f"  PASS  {name}")
            passed += 1
        except Exception as e:
            print(f"  FAIL  {name}: {e}")
            failed += 1

    print(f"\n=== Resultado: {passed}/{passed + failed} testes passaram ===")
    if failed:
        print(f"FALHAS: {failed}")
        sys.exit(1)
    else:
        print("Todos os testes passaram!")
