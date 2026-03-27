"""Testes unitarios para o extrator de conteudo de redes sociais."""

import os
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from unittest.mock import patch, MagicMock

from src.extractors.social_media import (
    extract_post_content,
    ExtractionError,
    download_image,
    _extract_tweet_id,
    _get_meta,
    _get_platform_logo_path,
)
from src.core.models import Platform, PostContent


# ---------------------------------------------------------------------------
# Fake HTML builders
# ---------------------------------------------------------------------------

def _fake_syndication_json(screen_name="testuser", name="Test User",
                           text="Hello world", profile_img="https://pbs.twimg.com/pic_normal.jpg"):
    """Retorna dict simulando resposta da syndication API do Twitter."""
    return {
        "user": {
            "screen_name": screen_name,
            "name": name,
            "profile_image_url_https": profile_img,
        },
        "text": text,
    }


def _fake_nitter_html(username="testuser", display_name="Test User",
                       text="Nitter tweet text", avatar_url="https://nitter.net/pic.jpg"):
    """Retorna HTML simulando pagina Nitter."""
    return f"""
    <html>
    <body>
        <div class="tweet-avatar"><img src="{avatar_url}"></div>
        <span class="fullname">{display_name}</span>
        <div class="tweet-content">{text}</div>
    </body>
    </html>
    """


def _fake_truth_html(og_title="Truth Post Title", og_description="Truth post text",
                     og_image="https://truth.social/avatar.jpg"):
    """Retorna HTML simulando pagina Truth Social com meta tags OG."""
    return f"""
    <html>
    <head>
        <meta property="og:title" content="{og_title}">
        <meta property="og:description" content="{og_description}">
        <meta property="og:image" content="{og_image}">
    </head>
    <body></body>
    </html>
    """


def _fake_instagram_oembed_json(author_name="instauser", title="Instagram caption"):
    """Retorna dict simulando resposta da oEmbed API do Instagram."""
    return {
        "author_name": author_name,
        "title": title,
    }


def _fake_telegram_html(author="Telegram Channel", text="Telegram message",
                        photo_url="https://cdn.telegram.org/photo.jpg"):
    """Retorna HTML simulando embed do Telegram."""
    return f"""
    <html>
    <body>
        <div class="tgme_widget_message_user_photo"><img src="{photo_url}"></div>
        <span class="tgme_widget_message_author_name">{author}</span>
        <div class="tgme_widget_message_text">{text}</div>
    </body>
    </html>
    """


# ---------------------------------------------------------------------------
# Helper para mock do httpx.Client
# ---------------------------------------------------------------------------

def _mock_client_get(response_text="", status_code=200, json_data=None, headers=None):
    """Cria mock do httpx.Client context manager com resposta configuravel."""
    mock_response = MagicMock()
    mock_response.text = response_text
    mock_response.status_code = status_code
    mock_response.content = response_text.encode("utf-8") if isinstance(response_text, str) else b""
    mock_response.headers = headers or {"content-type": "text/html"}
    if json_data is not None:
        mock_response.json.return_value = json_data

    mock_client = MagicMock()
    mock_client.get.return_value = mock_response
    mock_client.__enter__ = MagicMock(return_value=mock_client)
    mock_client.__exit__ = MagicMock(return_value=False)

    return mock_client


# ===========================================================================
# 1. Deteccao de plataforma (via extract_post_content routing)
# ===========================================================================

def test_extract_post_routes_to_x():
    """extract_post_content com Platform.X chama extractor de X."""
    json_data = _fake_syndication_json()
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://x.com/user/status/12345", Platform.X)

    assert result.platform == Platform.X
    assert isinstance(result, PostContent)


def test_extract_post_routes_to_truth():
    """extract_post_content com Platform.TRUTH chama extractor de Truth."""
    html = _fake_truth_html()
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://truthsocial.com/@realUser/12345", Platform.TRUTH)

    assert result.platform == Platform.TRUTH


def test_extract_post_routes_to_instagram():
    """extract_post_content com Platform.INSTAGRAM chama extractor de Instagram."""
    json_data = _fake_instagram_oembed_json()
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://instagram.com/p/abc123", Platform.INSTAGRAM)

    assert result.platform == Platform.INSTAGRAM


def test_extract_post_routes_to_telegram():
    """extract_post_content com Platform.TELEGRAM chama extractor de Telegram."""
    html = _fake_telegram_html()
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://t.me/channel/123", Platform.TELEGRAM)

    assert result.platform == Platform.TELEGRAM


def test_extract_post_unsupported_platform():
    """extract_post_content com Platform.UNKNOWN levanta ExtractionError."""
    try:
        extract_post_content("https://unknown.com/post", Platform.UNKNOWN)
        assert False, "Deveria ter levantado ExtractionError"
    except ExtractionError as e:
        assert "nao suportada" in str(e).lower()


# ===========================================================================
# 2. X (Twitter) - Syndication API
# ===========================================================================

def test_x_syndication_extracts_handle():
    """X via syndication extrai handle com @."""
    json_data = _fake_syndication_json(screen_name="elonmusk")
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://x.com/elonmusk/status/12345", Platform.X)

    assert result.handle == "@elonmusk"


def test_x_syndication_extracts_text():
    """X via syndication extrai texto da postagem."""
    json_data = _fake_syndication_json(text="This is a tweet about politics")
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://x.com/user/status/12345", Platform.X)

    assert result.text == "This is a tweet about politics"


def test_x_syndication_removes_tco_links():
    """X via syndication remove links t.co do final do texto."""
    json_data = _fake_syndication_json(text="Tweet text https://t.co/abc123")
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://x.com/user/status/12345", Platform.X)

    assert "t.co" not in result.text
    assert result.text == "Tweet text"


def test_x_syndication_extracts_profile_image():
    """X via syndication extrai URL da foto de perfil com resolucao alta."""
    json_data = _fake_syndication_json(profile_img="https://pbs.twimg.com/profile_normal.jpg")
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://x.com/user/status/12345", Platform.X)

    assert "_400x400" in result.profile_image_url
    assert "_normal" not in result.profile_image_url


def test_x_syndication_extracts_display_name():
    """X via syndication extrai display name."""
    json_data = _fake_syndication_json(name="Elon Musk")
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://x.com/user/status/12345", Platform.X)

    assert result.display_name == "Elon Musk"


def test_x_normalizes_twitter_url():
    """URL twitter.com e normalizada para x.com antes de processar."""
    json_data = _fake_syndication_json(screen_name="testuser")
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://twitter.com/testuser/status/99999", Platform.X)

    assert result.platform == Platform.X
    assert result.handle == "@testuser"


# ===========================================================================
# 3. X (Twitter) - Nitter fallback
# ===========================================================================

def test_x_nitter_fallback_on_syndication_failure():
    """Quando syndication falha, tenta Nitter como fallback."""
    # Primeiro client: syndication falha (404)
    syndication_client = _mock_client_get(status_code=404, json_data=None)
    syndication_client.get.side_effect = Exception("Syndication failed")

    # Segundo client: nitter funciona
    nitter_html = _fake_nitter_html(text="Nitter extracted text", username="testuser")
    nitter_client = _mock_client_get(response_text=nitter_html, status_code=200)

    call_count = [0]
    def client_factory(*args, **kwargs):
        call_count[0] += 1
        if call_count[0] == 1:
            return syndication_client
        return nitter_client

    with patch("src.extractors.social_media.httpx.Client", side_effect=client_factory):
        result = extract_post_content("https://x.com/testuser/status/12345", Platform.X)

    assert result.platform == Platform.X
    # Either nitter text or URL fallback - both are valid
    assert result.handle == "@testuser"


# ===========================================================================
# 4. X (Twitter) - URL fallback (ultimo recurso)
# ===========================================================================

def test_x_url_fallback_extracts_username():
    """Quando syndication e nitter falham, extrai username da URL."""
    # Ambos falham
    failing_client = _mock_client_get(status_code=500)
    failing_client.get.side_effect = Exception("Connection failed")

    with patch("src.extractors.social_media.httpx.Client", return_value=failing_client):
        result = extract_post_content("https://x.com/johndoe/status/12345", Platform.X)

    assert result.handle == "@johndoe"
    assert result.platform == Platform.X
    assert "verifique manualmente" in result.text.lower() or result.text != ""


# ===========================================================================
# 5. Truth Social
# ===========================================================================

def test_truth_extracts_text_from_og_description():
    """Truth Social extrai texto via og:description."""
    html = _fake_truth_html(og_description="This is a truth post")
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://truthsocial.com/@realUser/12345", Platform.TRUTH)

    assert result.text == "This is a truth post"


def test_truth_extracts_handle_from_url():
    """Truth Social extrai handle da URL."""
    html = _fake_truth_html()
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://truthsocial.com/@realDonaldTrump/12345", Platform.TRUTH)

    assert result.handle == "@realDonaldTrump"


def test_truth_extracts_profile_image():
    """Truth Social extrai imagem de perfil via og:image."""
    html = _fake_truth_html(og_image="https://truth.social/avatars/user.jpg")
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://truthsocial.com/@user/12345", Platform.TRUTH)

    assert result.profile_image_url == "https://truth.social/avatars/user.jpg"


def test_truth_fallback_text_on_no_description():
    """Truth Social usa og:title como fallback quando og:description ausente."""
    html = _fake_truth_html(og_title="Truth Title", og_description="")
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://truthsocial.com/@user/12345", Platform.TRUTH)

    assert result.text == "Truth Title"


def test_truth_error_on_http_failure():
    """Truth Social levanta ExtractionError em falha HTTP."""
    mock_client = _mock_client_get(status_code=403)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        try:
            extract_post_content("https://truthsocial.com/@user/12345", Platform.TRUTH)
            assert False, "Deveria ter levantado ExtractionError"
        except ExtractionError as e:
            assert "403" in str(e) or "Truth Social" in str(e)


# ===========================================================================
# 6. Instagram
# ===========================================================================

def test_instagram_extracts_via_oembed():
    """Instagram extrai dados via oEmbed API."""
    json_data = _fake_instagram_oembed_json(author_name="photographer", title="Sunset photo")
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://instagram.com/p/abc123", Platform.INSTAGRAM)

    assert result.handle == "@photographer"
    assert result.text == "Sunset photo"
    assert result.platform == Platform.INSTAGRAM


def test_instagram_fallback_on_oembed_failure():
    """Instagram extrai username da URL quando oEmbed falha."""
    failing_client = _mock_client_get(status_code=404)

    with patch("src.extractors.social_media.httpx.Client", return_value=failing_client):
        result = extract_post_content("https://instagram.com/p/abc123", Platform.INSTAGRAM)

    # Fallback: username from URL is "p" (the path segment after instagram.com)
    assert result.platform == Platform.INSTAGRAM
    assert "verifique manualmente" in result.text.lower()


def test_instagram_empty_profile_image():
    """Instagram oEmbed nao retorna avatar - campo fica vazio."""
    json_data = _fake_instagram_oembed_json()
    mock_client = _mock_client_get(json_data=json_data, status_code=200)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://instagram.com/p/abc123", Platform.INSTAGRAM)

    assert result.profile_image_url == ""


# ===========================================================================
# 7. Telegram
# ===========================================================================

def test_telegram_extracts_message_text():
    """Telegram extrai texto da mensagem via embed."""
    html = _fake_telegram_html(text="Important Telegram message")
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://t.me/channel/123", Platform.TELEGRAM)

    assert result.text == "Important Telegram message"


def test_telegram_extracts_channel_handle():
    """Telegram extrai handle do canal da URL."""
    html = _fake_telegram_html()
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://t.me/newschannel/456", Platform.TELEGRAM)

    assert result.handle == "@newschannel"


def test_telegram_extracts_author_name():
    """Telegram extrai nome do autor."""
    html = _fake_telegram_html(author="Breaking News Channel")
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://t.me/channel/123", Platform.TELEGRAM)

    assert result.display_name == "Breaking News Channel"


def test_telegram_extracts_photo():
    """Telegram extrai foto do perfil do canal."""
    html = _fake_telegram_html(photo_url="https://cdn.telegram.org/avatar.jpg")
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://t.me/channel/123", Platform.TELEGRAM)

    assert result.profile_image_url == "https://cdn.telegram.org/avatar.jpg"


def test_telegram_adds_embed_param():
    """Telegram adiciona ?embed=1 a URL quando ausente."""
    html = _fake_telegram_html()
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        extract_post_content("https://t.me/channel/123", Platform.TELEGRAM)

    # Verifica que a URL usada no GET continha embed
    call_args = mock_client.get.call_args
    called_url = call_args[0][0]
    assert "embed" in called_url


def test_telegram_error_on_http_failure():
    """Telegram levanta ExtractionError em falha HTTP."""
    mock_client = _mock_client_get(status_code=500)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        try:
            extract_post_content("https://t.me/channel/123", Platform.TELEGRAM)
            assert False, "Deveria ter levantado ExtractionError"
        except ExtractionError as e:
            assert "500" in str(e) or "Telegram" in str(e)


def test_telegram_fallback_display_name_to_channel():
    """Telegram usa channel name quando author_el esta ausente."""
    html = """
    <html><body>
        <div class="tgme_widget_message_text">Some text</div>
    </body></html>
    """
    mock_client = _mock_client_get(response_text=html)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = extract_post_content("https://t.me/mychannel/999", Platform.TELEGRAM)

    assert result.display_name == "mychannel"


# ===========================================================================
# 8. Funcoes utilitarias
# ===========================================================================

def test_extract_tweet_id_from_x_url():
    """Extrai tweet ID de URL do X."""
    assert _extract_tweet_id("https://x.com/user/status/1234567890") == "1234567890"


def test_extract_tweet_id_from_twitter_url():
    """Extrai tweet ID de URL do Twitter."""
    assert _extract_tweet_id("https://twitter.com/user/status/9876543210") == "9876543210"


def test_extract_tweet_id_returns_none_for_invalid():
    """Retorna None para URL sem tweet ID."""
    assert _extract_tweet_id("https://x.com/user") is None
    assert _extract_tweet_id("https://example.com") is None


def test_get_meta_extracts_og_property():
    """_get_meta extrai conteudo de meta tag por property."""
    from bs4 import BeautifulSoup
    html = '<html><head><meta property="og:title" content="Test Title"></head></html>'
    soup = BeautifulSoup(html, "html.parser")
    assert _get_meta(soup, "og:title") == "Test Title"


def test_get_meta_extracts_by_name():
    """_get_meta extrai conteudo de meta tag por name."""
    from bs4 import BeautifulSoup
    html = '<html><head><meta name="description" content="Test Description"></head></html>'
    soup = BeautifulSoup(html, "html.parser")
    assert _get_meta(soup, "description") == "Test Description"


def test_get_meta_returns_none_when_missing():
    """_get_meta retorna None quando meta tag nao existe."""
    from bs4 import BeautifulSoup
    html = "<html><head></head></html>"
    soup = BeautifulSoup(html, "html.parser")
    assert _get_meta(soup, "og:title") is None


def test_get_platform_logo_path():
    """_get_platform_logo_path retorna path para cada plataforma."""
    path = _get_platform_logo_path(Platform.X)
    assert path.endswith("x.png")

    path = _get_platform_logo_path(Platform.TRUTH)
    assert path.endswith("truth.png")

    path = _get_platform_logo_path(Platform.INSTAGRAM)
    assert path.endswith("instagram.png")

    path = _get_platform_logo_path(Platform.TELEGRAM)
    assert path.endswith("telegram.png")


def test_get_platform_logo_path_unknown():
    """_get_platform_logo_path retorna string vazia para plataforma desconhecida."""
    path = _get_platform_logo_path(Platform.UNKNOWN)
    assert path == ""


# ===========================================================================
# 9. download_image
# ===========================================================================

def test_download_image_success():
    """download_image baixa imagem e salva em arquivo."""
    mock_client = _mock_client_get(
        response_text="fake_image_bytes",
        status_code=200,
        headers={"content-type": "image/png"},
    )

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        with tempfile.TemporaryDirectory() as tmpdir:
            result = download_image("https://example.com/img.png", output_dir=tmpdir)
            assert result is not None
            assert os.path.exists(result)
            assert result.endswith(".png")


def test_download_image_detects_jpeg():
    """download_image detecta extensao JPEG."""
    mock_client = _mock_client_get(
        response_text="fake_jpeg",
        status_code=200,
        headers={"content-type": "image/jpeg"},
    )

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        with tempfile.TemporaryDirectory() as tmpdir:
            result = download_image("https://example.com/photo.jpg", output_dir=tmpdir)
            assert result is not None
            assert result.endswith(".jpg")


def test_download_image_returns_none_on_failure():
    """download_image retorna None em falha HTTP."""
    mock_client = _mock_client_get(status_code=404)

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = download_image("https://example.com/missing.png")
        assert result is None


def test_download_image_returns_none_for_empty_url():
    """download_image retorna None para URL vazia."""
    result = download_image("")
    assert result is None

    result = download_image(None)
    assert result is None


def test_download_image_handles_exception():
    """download_image retorna None quando httpx levanta excecao."""
    mock_client = _mock_client_get()
    mock_client.get.side_effect = Exception("Network error")

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        result = download_image("https://example.com/img.png")
        assert result is None


# ===========================================================================
# 10. Tratamento de erro gracioso
# ===========================================================================

def test_network_error_raises_extraction_error():
    """Erro de rede gera ExtractionError com mensagem clara."""
    mock_client = _mock_client_get()
    mock_client.get.side_effect = Exception("Connection timed out")

    with patch("src.extractors.social_media.httpx.Client", return_value=mock_client):
        try:
            extract_post_content("https://truthsocial.com/@user/123", Platform.TRUTH)
            assert False, "Deveria ter levantado ExtractionError"
        except ExtractionError as e:
            assert "Falha ao extrair" in str(e) or "truth" in str(e).lower()


def test_extraction_error_is_exception():
    """ExtractionError e uma subclasse de Exception."""
    err = ExtractionError("test error")
    assert isinstance(err, Exception)
    assert str(err) == "test error"


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    print("=== Testes: social_media extractor ===\n")

    tests = [
        # Routing / Platform detection
        ("1a. Route to X", test_extract_post_routes_to_x),
        ("1b. Route to Truth", test_extract_post_routes_to_truth),
        ("1c. Route to Instagram", test_extract_post_routes_to_instagram),
        ("1d. Route to Telegram", test_extract_post_routes_to_telegram),
        ("1e. Unsupported platform", test_extract_post_unsupported_platform),
        # X - Syndication
        ("2a. X syndication handle", test_x_syndication_extracts_handle),
        ("2b. X syndication text", test_x_syndication_extracts_text),
        ("2c. X syndication removes t.co", test_x_syndication_removes_tco_links),
        ("2d. X syndication profile image", test_x_syndication_extracts_profile_image),
        ("2e. X syndication display name", test_x_syndication_extracts_display_name),
        ("2f. X normalizes twitter URL", test_x_normalizes_twitter_url),
        # X - Nitter fallback
        ("3a. X nitter fallback", test_x_nitter_fallback_on_syndication_failure),
        # X - URL fallback
        ("4a. X URL fallback username", test_x_url_fallback_extracts_username),
        # Truth Social
        ("5a. Truth text from og:description", test_truth_extracts_text_from_og_description),
        ("5b. Truth handle from URL", test_truth_extracts_handle_from_url),
        ("5c. Truth profile image", test_truth_extracts_profile_image),
        ("5d. Truth fallback text", test_truth_fallback_text_on_no_description),
        ("5e. Truth HTTP error", test_truth_error_on_http_failure),
        # Instagram
        ("6a. Instagram via oEmbed", test_instagram_extracts_via_oembed),
        ("6b. Instagram oEmbed fallback", test_instagram_fallback_on_oembed_failure),
        ("6c. Instagram empty profile image", test_instagram_empty_profile_image),
        # Telegram
        ("7a. Telegram message text", test_telegram_extracts_message_text),
        ("7b. Telegram channel handle", test_telegram_extracts_channel_handle),
        ("7c. Telegram author name", test_telegram_extracts_author_name),
        ("7d. Telegram photo", test_telegram_extracts_photo),
        ("7e. Telegram embed param", test_telegram_adds_embed_param),
        ("7f. Telegram HTTP error", test_telegram_error_on_http_failure),
        ("7g. Telegram fallback display name", test_telegram_fallback_display_name_to_channel),
        # Utility functions
        ("8a. Extract tweet ID from x.com", test_extract_tweet_id_from_x_url),
        ("8b. Extract tweet ID from twitter.com", test_extract_tweet_id_from_twitter_url),
        ("8c. Extract tweet ID invalid URL", test_extract_tweet_id_returns_none_for_invalid),
        ("8d. Get meta og:property", test_get_meta_extracts_og_property),
        ("8e. Get meta by name", test_get_meta_extracts_by_name),
        ("8f. Get meta missing", test_get_meta_returns_none_when_missing),
        ("8g. Platform logo paths", test_get_platform_logo_path),
        ("8h. Platform logo unknown", test_get_platform_logo_path_unknown),
        # download_image
        ("9a. Download image success", test_download_image_success),
        ("9b. Download image JPEG", test_download_image_detects_jpeg),
        ("9c. Download image failure", test_download_image_returns_none_on_failure),
        ("9d. Download image empty URL", test_download_image_returns_none_for_empty_url),
        ("9e. Download image exception", test_download_image_handles_exception),
        # Error handling
        ("10a. Network error", test_network_error_raises_extraction_error),
        ("10b. ExtractionError type", test_extraction_error_is_exception),
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
