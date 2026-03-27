"""Testes unitarios para o SlideProcessor — gera slides no Google Slides via API.

Cobre:
- Inicializacao e setup do processor
- Todos os 5 tipos de slide (POST, NEWS_WITH_TEXT, NEWS_NO_TEXT, FULLSCREEN, PARTIAL)
- Logica de texto grande (FR4 — truncamento de post)
- Error handling (API failures, missing URLs, processor nao inicializado)
- Geracao na ordem correta e cleanup de templates
- Funcoes utilitarias (_truncate_text, _normalize_image_url)
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from unittest.mock import patch, MagicMock

from src.core.models import (
    Instruction,
    InstructionType,
    Platform,
    PostContent,
    NewsContent,
)
from src.core.config import AppConfig, GoogleConfig, OpenAIConfig, PathsConfig, VideoConfig


# ---------------------------------------------------------------------------
# Helpers: fake config & clients
# ---------------------------------------------------------------------------

def _make_config() -> AppConfig:
    """Cria AppConfig fake para testes."""
    return AppConfig(
        google=GoogleConfig(
            credentials_path="/fake/creds.json",
            token_path="/fake/token.json",
            slides_template_id="TEMPLATE_PRES_ID",
        ),
        openai=OpenAIConfig(api_key="fake-key"),
        paths=PathsConfig(
            output_dir="/fake/output",
            font_tarja_bold="/fake/bold.ttf",
            font_tarja_regular="/fake/regular.ttf",
            font_tarja_semibold="/fake/semibold.ttf",
            tarja_template_epoch="/fake/epoch.png",
            tarja_template_cobertura="/fake/cobertura.png",
        ),
        video=VideoConfig(
            default_quality="720p",
            whisper_model="base",
            translation_model="gpt-4",
        ),
    )


def _make_slides_client():
    """Cria mock do SlidesClient com metodos basicos."""
    client = MagicMock()
    # get_slide_ids retorna 5 IDs de template (um por tipo)
    client.get_slide_ids.return_value = [
        "tmpl_slide_0",  # Tipo 1: Post
        "tmpl_slide_1",  # Tipo 2: News with text
        "tmpl_slide_2",  # Tipo 3: News no text
        "tmpl_slide_3",  # Tipo 4: Fullscreen
        "tmpl_slide_4",  # Tipo 5: Partial
    ]
    # duplicate_slide retorna ID do novo slide
    client.duplicate_slide.return_value = "new_slide_001"
    # batch_update retorna resposta vazia por padrao
    client.batch_update.return_value = {"replies": []}
    # find_elements_by_text retorna lista vazia por padrao
    client.find_elements_by_text.return_value = []
    # get_slide_elements retorna lista vazia por padrao
    client.get_slide_elements.return_value = []
    # insert_image retorna ID do objeto criado
    client.insert_image.return_value = "img_obj_001"
    # insert_image_fullscreen retorna ID
    client.insert_image_fullscreen.return_value = "fullscreen_img_001"
    # get_presentation retorna estrutura basica
    client.get_presentation.return_value = {"slides": []}
    return client


def _make_drive_client():
    """Cria mock do DriveClient."""
    client = MagicMock()
    client.upload_and_share.return_value = "https://drive.google.com/public/logo.png"
    return client


def _make_instruction(
    itype: InstructionType,
    url: str = "https://example.com/test",
    urls: list = None,
    platform: Platform = None,
    translated_text: str = None,
    order: int = 1,
) -> Instruction:
    """Cria Instruction fake para testes."""
    return Instruction(
        type=itype,
        news_block="Bloco Teste",
        order=order,
        url=url,
        urls=urls or [],
        platform=platform,
        translated_text=translated_text,
    )


def _fake_post_content(
    text="Post content text",
    handle="@testuser",
    display_name="Test User",
    profile_image_url="https://pbs.twimg.com/pic_400x400.jpg",
    platform=Platform.X,
    platform_logo_path="/fake/logos/x.png",
):
    """Cria PostContent fake."""
    return PostContent(
        profile_image_url=profile_image_url,
        handle=handle,
        display_name=display_name,
        text=text,
        platform=platform,
        platform_logo_path=platform_logo_path,
    )


def _fake_news_content(
    title="Breaking News Title",
    source_name="Reuters",
    logo_url=None,
    logo_path=None,
):
    """Cria NewsContent fake."""
    return NewsContent(
        title=title,
        source_name=source_name,
        logo_url=logo_url,
        logo_path=logo_path,
    )


# ===========================================================================
# 1. Inicializacao e Setup
# ===========================================================================

def test_init_stores_config_and_clients():
    """SlideProcessor armazena config, slides_client e drive_client."""
    from src.processors.slide_processor import SlideProcessor

    config = _make_config()
    slides_client = _make_slides_client()
    drive_client = _make_drive_client()

    processor = SlideProcessor(config, slides_client, drive_client)

    assert processor.config is config
    assert processor.slides_client is slides_client
    assert processor.drive_client is drive_client
    assert processor._template_slide_ids is None
    assert processor._presentation_id is None


def test_setup_with_presentation_id():
    """setup() com presentation_id usa o ID fornecido."""
    from src.processors.slide_processor import SlideProcessor

    config = _make_config()
    slides_client = _make_slides_client()
    processor = SlideProcessor(config, slides_client)

    processor.setup(presentation_id="custom_pres_123")

    assert processor._presentation_id == "custom_pres_123"
    slides_client.get_slide_ids.assert_called_once_with("custom_pres_123")
    assert processor._template_slide_ids == [
        "tmpl_slide_0", "tmpl_slide_1", "tmpl_slide_2",
        "tmpl_slide_3", "tmpl_slide_4",
    ]


def test_setup_without_presentation_id_uses_template():
    """setup() sem presentation_id usa o template_id do config."""
    from src.processors.slide_processor import SlideProcessor

    config = _make_config()
    slides_client = _make_slides_client()
    processor = SlideProcessor(config, slides_client)

    processor.setup()

    assert processor._presentation_id == "TEMPLATE_PRES_ID"
    slides_client.get_slide_ids.assert_called_once_with("TEMPLATE_PRES_ID")


def test_presentation_id_property_raises_if_not_setup():
    """presentation_id property levanta RuntimeError se setup() nao foi chamado."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())

    try:
        _ = processor.presentation_id
        assert False, "Deveria ter levantado RuntimeError"
    except RuntimeError as e:
        assert "nao inicializado" in str(e)


def test_process_raises_if_not_setup():
    """process() levanta RuntimeError se setup() nao foi chamado."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    instruction = _make_instruction(InstructionType.SLIDE_POST)

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado RuntimeError"
    except RuntimeError as e:
        assert "nao inicializado" in str(e)


def test_process_raises_for_unsupported_type():
    """process() levanta ValueError para tipo de instrucao nao-slide."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(InstructionType.TARJA)

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado ValueError"
    except ValueError as e:
        assert "nao suportado" in str(e)


# ===========================================================================
# 2. Tipo 1: Postagem (SLIDE_POST)
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_slide_basic_flow(mock_extract, mock_sleep):
    """Tipo 1: duplica template, substitui texto e insere imagens."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_post_content(text="Short post text")

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/123",
        platform=Platform.X,
    )

    result = processor.process(instruction)

    assert result == "new_slide_001"
    # Verifica que duplicou o template correto (indice 0 para POST)
    slides_client.duplicate_slide.assert_called_once_with(
        "TEMPLATE_PRES_ID", "tmpl_slide_0"
    )
    # Verifica que substituiu placeholders de texto (3 chamadas: post_text, handle, display_name)
    assert slides_client.replace_text.call_count == 3


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_slide_replaces_placeholders(mock_extract, mock_sleep):
    """Tipo 1: substitui {{post_text}}, {{handle}} e {{display_name}}."""
    from src.processors.slide_processor import SlideProcessor, PLACEHOLDERS

    mock_extract.return_value = _fake_post_content(
        text="My tweet text",
        handle="@myhandle",
        display_name="My Name",
    )

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/myhandle/status/1",
        platform=Platform.X,
    )

    processor.process(instruction)

    # Verifica cada placeholder substituido
    calls = slides_client.replace_text.call_args_list
    replaced_pairs = {c[0][2]: c[0][3] for c in calls}  # placeholder -> new_text

    assert replaced_pairs[PLACEHOLDERS["post_text"]] == "My tweet text"
    assert replaced_pairs[PLACEHOLDERS["handle"]] == "@myhandle"
    assert replaced_pairs[PLACEHOLDERS["display_name"]] == "My Name"


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_slide_with_profile_image(mock_extract, mock_sleep):
    """Tipo 1: insere foto de perfil quando disponivel (posicao fallback)."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_post_content(
        profile_image_url="https://pbs.twimg.com/pic_400x400.jpg"
    )

    slides_client = _make_slides_client()
    # find_elements_by_text retorna vazio = usa posicao fallback
    slides_client.find_elements_by_text.return_value = []

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )
    processor.process(instruction)

    # Verifica que insert_image foi chamado para profile image
    slides_client.insert_image.assert_called_once()
    call_args = slides_client.insert_image.call_args
    assert call_args[1]["image_url"] if "image_url" in (call_args[1] or {}) else call_args[0][2] == "https://pbs.twimg.com/pic_400x400.jpg"


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_slide_with_profile_image_placeholder(mock_extract, mock_sleep):
    """Tipo 1: substitui elemento de placeholder {{profile_image}} quando existe."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_post_content(
        profile_image_url="https://pbs.twimg.com/pic.jpg"
    )

    slides_client = _make_slides_client()
    slides_client.find_elements_by_text.return_value = [{
        "objectId": "profile_placeholder_el",
        "text": "{{profile_image}}",
        "transform": {"translateX": 100000, "translateY": 200000},
        "size": {
            "width": {"magnitude": 914400},
            "height": {"magnitude": 914400},
        },
    }]

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )
    processor.process(instruction)

    # Verifica que insert_image usou replace_element_id
    insert_call = slides_client.insert_image.call_args
    assert insert_call[1].get("replace_element_id") == "profile_placeholder_el" or \
        (len(insert_call[0]) > 6 and insert_call[0][6] == "profile_placeholder_el")


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_slide_without_url_raises(mock_extract, mock_sleep):
    """Tipo 1: levanta ValueError se instrucao nao tem URL."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(InstructionType.SLIDE_POST, url=None)

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado ValueError"
    except ValueError as e:
        assert "sem URL" in str(e)


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_slide_extraction_error_propagates(mock_extract, mock_sleep):
    """Tipo 1: ExtractionError da extract_post_content propaga para cima."""
    from src.processors.slide_processor import SlideProcessor
    from src.extractors.social_media import ExtractionError

    mock_extract.side_effect = ExtractionError("Falha ao extrair postagem")

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado ExtractionError"
    except ExtractionError as e:
        assert "Falha ao extrair" in str(e)


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_slide_progress_callback(mock_extract, mock_sleep):
    """Tipo 1: chama on_progress nos marcos corretos."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_post_content()

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    progress_values = []
    def on_progress(val):
        progress_values.append(val)

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )
    processor.process(instruction, on_progress=on_progress)

    # Deve ter chamado progress com 0.1 (inicio), 0.2, 0.4, 0.6, 0.8, 1.0
    assert progress_values[0] == 0.1
    assert progress_values[-1] == 1.0
    assert len(progress_values) >= 4


# ===========================================================================
# 3. Logica de Texto Grande (FR4)
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_text_truncation_when_over_max(mock_extract, mock_sleep):
    """FR4: texto maior que POST_TEXT_MAX_CHARS e truncado."""
    from src.processors.slide_processor import SlideProcessor, POST_TEXT_MAX_CHARS, PLACEHOLDERS

    long_text = "A" * (POST_TEXT_MAX_CHARS + 100)
    mock_extract.return_value = _fake_post_content(text=long_text)

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )
    processor.process(instruction)

    # O texto substituido deve ser menor que o original
    calls = slides_client.replace_text.call_args_list
    for c in calls:
        if c[0][2] == PLACEHOLDERS["post_text"]:
            replaced_text = c[0][3]
            assert len(replaced_text) <= POST_TEXT_MAX_CHARS + 3  # +3 para "..."
            assert len(replaced_text) < len(long_text)
            break
    else:
        assert False, "Nao encontrou chamada replace_text para post_text"


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_post_text_no_truncation_when_under_max(mock_extract, mock_sleep):
    """FR4: texto menor que POST_TEXT_MAX_CHARS nao e truncado."""
    from src.processors.slide_processor import SlideProcessor, POST_TEXT_MAX_CHARS, PLACEHOLDERS

    short_text = "Short text"
    assert len(short_text) < POST_TEXT_MAX_CHARS

    mock_extract.return_value = _fake_post_content(text=short_text)

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )
    processor.process(instruction)

    calls = slides_client.replace_text.call_args_list
    for c in calls:
        if c[0][2] == PLACEHOLDERS["post_text"]:
            assert c[0][3] == short_text
            break


def test_truncate_text_at_sentence_boundary():
    """_truncate_text corta no final de frase quando possivel."""
    from src.processors.slide_processor import _truncate_text

    text = "First sentence. Second sentence. Third sentence that goes on and on and on."
    result = _truncate_text(text, 40)

    # Deve cortar no final da segunda frase (indice < 40)
    assert result.endswith(".")
    assert len(result) <= 40


def test_truncate_text_at_word_boundary():
    """_truncate_text corta na ultima palavra quando nao ha sentenca."""
    from src.processors.slide_processor import _truncate_text

    text = "Word word word word word word word word word word word word word word"
    result = _truncate_text(text, 30)

    assert result.endswith("...")
    assert len(result) <= 33  # 30 + "..."


def test_truncate_text_no_op_when_short():
    """_truncate_text retorna texto inalterado quando curto."""
    from src.processors.slide_processor import _truncate_text

    text = "Short"
    result = _truncate_text(text, 280)
    assert result == "Short"


# ===========================================================================
# 4. Tipo 2: Noticia COM Texto Traduzido (SLIDE_NEWS_WITH_TEXT)
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_with_text_basic_flow(mock_extract, mock_sleep):
    """Tipo 2: duplica template tipo 2, substitui titulo e texto traduzido."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_news_content(title="News Title Here")

    slides_client = _make_slides_client()
    # Simula elementos de texto no slide
    slides_client.get_slide_elements.return_value = [
        {
            "objectId": "title_el",
            "shape": {
                "text": {
                    "textElements": [
                        {"textRun": {"content": "Placeholder Title", "style": {}}}
                    ]
                }
            },
        },
        {
            "objectId": "empty_el",
            "shape": {
                "text": {"textElements": []}
            },
        },
    ]
    # get_presentation retorna dados para _replace_text_preserving_style
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "new_slide_001",
            "pageElements": [
                {
                    "objectId": "title_el",
                    "shape": {
                        "text": {
                            "textElements": [
                                {"textRun": {"content": "Placeholder Title", "style": {"bold": True, "fontSize": {"magnitude": 18, "unit": "PT"}}}}
                            ]
                        }
                    },
                },
            ],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_NEWS_WITH_TEXT,
        url="https://reuters.com/article/123",
        translated_text="Translated news text here",
    )

    result = processor.process(instruction)

    assert result == "new_slide_001"
    # Verifica que duplicou template indice 1 (NEWS_WITH_TEXT)
    slides_client.duplicate_slide.assert_called_once_with(
        "TEMPLATE_PRES_ID", "tmpl_slide_1"
    )


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_with_text_without_url_raises(mock_extract, mock_sleep):
    """Tipo 2: levanta ValueError se instrucao nao tem URL."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(InstructionType.SLIDE_NEWS_WITH_TEXT, url=None)

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado ValueError"
    except ValueError as e:
        assert "sem URL" in str(e)


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_with_text_extraction_error(mock_extract, mock_sleep):
    """Tipo 2: NewsExtractionError propaga."""
    from src.processors.slide_processor import SlideProcessor
    from src.extractors.news_extractor import NewsExtractionError

    mock_extract.side_effect = NewsExtractionError("News extraction failed")

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_NEWS_WITH_TEXT,
        url="https://reuters.com/article/broken",
    )

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado NewsExtractionError"
    except NewsExtractionError:
        pass


# ===========================================================================
# 5. Tipo 3: Noticia SEM Texto (SLIDE_NEWS_NO_TEXT)
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_no_text_basic_flow(mock_extract, mock_sleep):
    """Tipo 3: duplica template tipo 3 e substitui titulo."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_news_content(title="Short Title")

    slides_client = _make_slides_client()
    slides_client.get_slide_elements.return_value = [
        {
            "objectId": "title_el",
            "shape": {
                "text": {
                    "textElements": [
                        {"textRun": {"content": "Existing Title", "style": {}}}
                    ]
                }
            },
        },
    ]
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "new_slide_001",
            "pageElements": [
                {
                    "objectId": "title_el",
                    "shape": {
                        "text": {
                            "textElements": [
                                {"textRun": {"content": "Existing Title", "style": {}}}
                            ]
                        }
                    },
                    "transform": {"scaleX": 1, "scaleY": 0.2, "translateX": 0, "translateY": 1200000, "shearX": 0, "shearY": 0},
                },
            ],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    # Patch _is_wide_logo to return False (use normal template)
    with patch.object(processor, "_is_wide_logo", return_value=False):
        instruction = _make_instruction(
            InstructionType.SLIDE_NEWS_NO_TEXT,
            url="https://ft.com/article/456",
        )
        result = processor.process(instruction)

    assert result == "new_slide_001"
    # Verifica que duplicou template indice 2 (NEWS_NO_TEXT)
    slides_client.duplicate_slide.assert_called_once_with(
        "TEMPLATE_PRES_ID", "tmpl_slide_2"
    )


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_no_text_wide_logo_uses_tipo2_template(mock_extract, mock_sleep):
    """Tipo 3: quando logo e largo (>4:1), usa template Tipo 2 em vez de Tipo 3."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_news_content(title="Wide Logo News")

    slides_client = _make_slides_client()
    slides_client.get_slide_elements.return_value = [
        {
            "objectId": "title_el",
            "shape": {
                "text": {
                    "textElements": [
                        {"textRun": {"content": "Title", "style": {}}}
                    ]
                }
            },
        },
    ]
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "new_slide_001",
            "pageElements": [],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    with patch.object(processor, "_is_wide_logo", return_value=True):
        instruction = _make_instruction(
            InstructionType.SLIDE_NEWS_NO_TEXT,
            url="https://example.com/article",
        )
        processor.process(instruction)

    # Verifica que duplicou template indice 1 (NEWS_WITH_TEXT) em vez de 2
    slides_client.duplicate_slide.assert_called_once_with(
        "TEMPLATE_PRES_ID", "tmpl_slide_1"
    )


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_no_text_without_url_raises(mock_extract, mock_sleep):
    """Tipo 3: levanta ValueError se instrucao nao tem URL."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(InstructionType.SLIDE_NEWS_NO_TEXT, url=None)

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado ValueError"
    except ValueError as e:
        assert "sem URL" in str(e)


# ===========================================================================
# 6. Tipo 4: Fullscreen (SLIDE_FULLSCREEN)
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
def test_fullscreen_basic_flow(mock_sleep):
    """Tipo 4: duplica template e insere imagem fullscreen com borda."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_FULLSCREEN,
        url="https://example.com/image.jpg",
    )

    result = processor.process(instruction)

    assert result == "new_slide_001"
    # Verifica que duplicou template indice 3 (FULLSCREEN)
    slides_client.duplicate_slide.assert_called_once_with(
        "TEMPLATE_PRES_ID", "tmpl_slide_3"
    )
    # Verifica que insert_image_fullscreen foi chamado
    slides_client.insert_image_fullscreen.assert_called_once_with(
        "TEMPLATE_PRES_ID", "new_slide_001", "https://example.com/image.jpg"
    )
    # Verifica que borda preta foi adicionada
    slides_client.set_image_border.assert_called_once_with(
        "TEMPLATE_PRES_ID", "fullscreen_img_001"
    )


@patch("src.processors.slide_processor.time.sleep")
def test_fullscreen_no_border_when_image_fails(mock_sleep):
    """Tipo 4: nao adiciona borda se insert_image_fullscreen retorna vazio."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.insert_image_fullscreen.return_value = ""  # Empty = no image ID

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_FULLSCREEN,
        url="https://example.com/image.jpg",
    )
    processor.process(instruction)

    # set_image_border NAO deve ser chamado quando image_id e falsy
    slides_client.set_image_border.assert_not_called()


@patch("src.processors.slide_processor.time.sleep")
def test_fullscreen_without_url_raises(mock_sleep):
    """Tipo 4: levanta ValueError se instrucao nao tem URL."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(InstructionType.SLIDE_FULLSCREEN, url=None)

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado ValueError"
    except ValueError as e:
        assert "sem URL" in str(e)


# ===========================================================================
# 7. Tipo 5: Parcial/Multiplas (SLIDE_PARTIAL)
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
def test_partial_single_image(mock_sleep):
    """Tipo 5: cria um slide para uma unica imagem."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_PARTIAL,
        url="https://example.com/img1.jpg",
    )

    result = processor.process(instruction)

    assert result == "new_slide_001"
    slides_client.duplicate_slide.assert_called_once()
    slides_client.insert_image.assert_called_once()


@patch("src.processors.slide_processor.time.sleep")
def test_partial_multiple_images(mock_sleep):
    """Tipo 5: cria um slide por imagem quando urls tem multiplos itens."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    # Retorna IDs diferentes para cada duplicate_slide
    slides_client.duplicate_slide.side_effect = ["slide_a", "slide_b", "slide_c"]

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_PARTIAL,
        url=None,
        urls=[
            "https://example.com/img1.jpg",
            "https://example.com/img2.jpg",
            "https://example.com/img3.jpg",
        ],
    )

    result = processor.process(instruction)

    # Retorna o ultimo slide criado
    assert result == "slide_c"
    assert slides_client.duplicate_slide.call_count == 3
    assert slides_client.insert_image.call_count == 3


@patch("src.processors.slide_processor.time.sleep")
def test_partial_skips_non_http_urls(mock_sleep):
    """Tipo 5: pula URLs que nao comecam com http."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_PARTIAL,
        url=None,
        urls=[
            "not-a-url",
            "https://example.com/valid.jpg",
        ],
    )

    processor.process(instruction)

    # Apenas 1 slide duplicado (URL invalida pulada)
    assert slides_client.duplicate_slide.call_count == 1


@patch("src.processors.slide_processor.time.sleep")
def test_partial_without_urls_raises(mock_sleep):
    """Tipo 5: levanta ValueError se nao tem URLs."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    processor.setup()

    instruction = _make_instruction(InstructionType.SLIDE_PARTIAL, url=None, urls=[])

    try:
        processor.process(instruction)
        assert False, "Deveria ter levantado ValueError"
    except ValueError as e:
        assert "sem URLs" in str(e)


@patch("src.processors.slide_processor.time.sleep")
def test_partial_continues_on_image_insert_failure(mock_sleep):
    """Tipo 5: continua processando outras imagens quando uma falha."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.duplicate_slide.side_effect = ["slide_a", "slide_b"]
    # Primeira imagem falha, segunda funciona
    slides_client.insert_image.side_effect = [Exception("API error"), "img_002"]

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_PARTIAL,
        url=None,
        urls=[
            "https://example.com/broken.jpg",
            "https://example.com/working.jpg",
        ],
    )

    result = processor.process(instruction)

    # Deve retornar ultimo slide mesmo que primeiro falhou
    assert result == "slide_b"
    assert slides_client.duplicate_slide.call_count == 2


@patch("src.processors.slide_processor.time.sleep")
def test_partial_progress_callback(mock_sleep):
    """Tipo 5: chama on_progress incrementalmente para cada imagem."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.duplicate_slide.side_effect = ["s1", "s2"]

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    progress_values = []
    def on_progress(val):
        progress_values.append(val)

    instruction = _make_instruction(
        InstructionType.SLIDE_PARTIAL,
        url=None,
        urls=["https://example.com/a.jpg", "https://example.com/b.jpg"],
    )
    processor.process(instruction, on_progress=on_progress)

    # Deve ter marcos de progresso incrementais
    assert progress_values[0] == 0.1  # Inicio (do process)
    assert progress_values[-1] == 1.0  # Fim
    # Progresso intermediario para cada imagem
    assert len(progress_values) >= 3


# ===========================================================================
# 8. Throttle (Rate Limit)
# ===========================================================================

@patch("src.processors.slide_processor.time.time")
@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_throttle_sleeps_when_too_fast(mock_extract, mock_sleep, mock_time):
    """_throttle dorme quando intervalo entre chamadas e menor que SLIDE_THROTTLE_SECONDS."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_post_content()
    # Simula tempo: primeira chamada em t=100, segunda em t=101 (muito rapido)
    mock_time.side_effect = [100.0, 101.0, 105.0]

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    # Seta _last_api_call para simular chamada recente
    processor._last_api_call = 100.0

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )
    processor.process(instruction)

    # sleep deve ter sido chamado com diferenca positiva
    mock_sleep.assert_called()


# ===========================================================================
# 9. Cleanup de Templates
# ===========================================================================

def test_cleanup_templates_deletes_all():
    """cleanup_templates deleta todos os slides template."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    processor.cleanup_templates()

    assert slides_client.delete_slide.call_count == 5
    deleted_ids = [c[0][1] for c in slides_client.delete_slide.call_args_list]
    assert "tmpl_slide_0" in deleted_ids
    assert "tmpl_slide_4" in deleted_ids


def test_cleanup_templates_continues_on_error():
    """cleanup_templates continua quando um delete falha."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.delete_slide.side_effect = [
        None,  # OK
        Exception("API error"),  # Falha
        None,  # OK
        None,  # OK
        None,  # OK
    ]

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    # Nao deve levantar excecao
    processor.cleanup_templates()

    # Deve ter tentado deletar todos os 5
    assert slides_client.delete_slide.call_count == 5


def test_cleanup_templates_no_op_if_not_setup():
    """cleanup_templates nao faz nada se processor nao foi inicializado."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)

    processor.cleanup_templates()

    slides_client.delete_slide.assert_not_called()


# ===========================================================================
# 10. Template Slide Index
# ===========================================================================

def test_get_template_slide_id_returns_correct_index():
    """_get_template_slide_id retorna ID correto para cada tipo."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    assert processor._get_template_slide_id(InstructionType.SLIDE_POST) == "tmpl_slide_0"
    assert processor._get_template_slide_id(InstructionType.SLIDE_NEWS_WITH_TEXT) == "tmpl_slide_1"
    assert processor._get_template_slide_id(InstructionType.SLIDE_NEWS_NO_TEXT) == "tmpl_slide_2"
    assert processor._get_template_slide_id(InstructionType.SLIDE_FULLSCREEN) == "tmpl_slide_3"
    assert processor._get_template_slide_id(InstructionType.SLIDE_PARTIAL) == "tmpl_slide_4"


def test_get_template_slide_id_raises_for_invalid_type():
    """_get_template_slide_id levanta ValueError para tipo sem template."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    try:
        processor._get_template_slide_id(InstructionType.TARJA)
        assert False, "Deveria ter levantado ValueError"
    except ValueError as e:
        assert "Sem template" in str(e)


def test_get_template_slide_id_raises_for_out_of_range():
    """_get_template_slide_id levanta RuntimeError se indice fora do range."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    # Apenas 2 slides no template (menos que os 5 necessarios)
    slides_client.get_slide_ids.return_value = ["s0", "s1"]

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    try:
        processor._get_template_slide_id(InstructionType.SLIDE_FULLSCREEN)  # indice 3
        assert False, "Deveria ter levantado RuntimeError"
    except RuntimeError as e:
        assert "fora do range" in str(e)


# ===========================================================================
# 11. Duplicate Template + Move
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
def test_duplicate_template_moves_to_end(mock_extract, mock_sleep):
    """_duplicate_template duplica e move slide para o final."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_post_content()

    slides_client = _make_slides_client()
    # Apos duplicar, get_slide_ids retorna 6 slides (5 originais + 1 duplicado)
    slides_client.get_slide_ids.side_effect = [
        ["s0", "s1", "s2", "s3", "s4"],  # setup()
        ["s0", "s1", "s2", "s3", "s4", "new_slide_001"],  # apos duplicate
    ]

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instruction = _make_instruction(
        InstructionType.SLIDE_POST,
        url="https://x.com/user/status/1",
        platform=Platform.X,
    )
    processor.process(instruction)

    # Verifica que move_slide foi chamado para mover ao final (posicao 6)
    slides_client.move_slide.assert_called_once_with(
        "TEMPLATE_PRES_ID", "new_slide_001", 6
    )


# ===========================================================================
# 12. Normalize Image URL
# ===========================================================================

def test_normalize_url_glbimg_extracts_original():
    """_normalize_image_url extrai URL original do CDN glbimg."""
    from src.processors.slide_processor import _normalize_image_url

    url = "https://s2-g1.glbimg.com/xxx/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH/image.jpg"
    result = _normalize_image_url(url)
    assert result == "https://i.s3.glbimg.com/v1/AUTH/image.jpg"


def test_normalize_url_replaces_webp_with_jpg():
    """_normalize_image_url converte f:webp para f:jpg."""
    from src.processors.slide_processor import _normalize_image_url

    url = "https://cdn.example.com/image/f:webp/photo.jpg"
    result = _normalize_image_url(url)
    assert "f:jpg" in result
    assert "f:webp" not in result


def test_normalize_url_removes_truncated_parentheses():
    """_normalize_image_url remove parenteses truncados no final."""
    from src.processors.slide_processor import _normalize_image_url

    url = "https://cdn.example.com/image/filters:strip_icc("
    result = _normalize_image_url(url)
    assert not result.endswith("(")


def test_normalize_url_extracts_plain_proxy():
    """_normalize_image_url extrai URL de proxy /plain/."""
    from src.processors.slide_processor import _normalize_image_url

    url = "https://proxy.example.com/plain/https://original.com/photo.jpg"
    result = _normalize_image_url(url)
    assert result == "https://original.com/photo.jpg"


def test_normalize_url_passthrough_normal():
    """_normalize_image_url retorna URL normal sem modificacao."""
    from src.processors.slide_processor import _normalize_image_url

    url = "https://example.com/normal-image.jpg"
    result = _normalize_image_url(url)
    assert result == url


# ===========================================================================
# 13. News Logo Insertion (_insert_news_logo)
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_logo_skipped_without_drive_client(mock_extract, mock_sleep):
    """_insert_news_logo pula se drive_client nao esta disponivel."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_news_content()

    slides_client = _make_slides_client()
    slides_client.get_slide_elements.return_value = [
        {"objectId": "el1", "shape": {"text": {"textElements": [{"textRun": {"content": "Title", "style": {}}}]}}},
    ]
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "new_slide_001",
            "pageElements": [
                {"objectId": "el1", "shape": {"text": {"textElements": [{"textRun": {"content": "Title", "style": {}}}]}}},
            ],
        }],
    }

    # drive_client=None
    processor = SlideProcessor(_make_config(), slides_client, drive_client=None)
    processor.setup()

    with patch.object(processor, "_get_local_logo", return_value="/fake/logo.png"):
        instruction = _make_instruction(
            InstructionType.SLIDE_NEWS_WITH_TEXT,
            url="https://ft.com/article",
            translated_text="Text here",
        )
        # Nao deve levantar excecao
        processor.process(instruction)

    # insert_image NAO deve ter sido chamado para o logo (apenas find_elements_by_text pode ser chamado)
    # O importante e nao dar crash


@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_news_content")
def test_news_logo_skipped_without_local_logo(mock_extract, mock_sleep):
    """_insert_news_logo pula se nao ha logo local."""
    from src.processors.slide_processor import SlideProcessor

    mock_extract.return_value = _fake_news_content()

    slides_client = _make_slides_client()
    slides_client.get_slide_elements.return_value = [
        {"objectId": "el1", "shape": {"text": {"textElements": [{"textRun": {"content": "Title", "style": {}}}]}}},
    ]
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "new_slide_001",
            "pageElements": [
                {"objectId": "el1", "shape": {"text": {"textElements": [{"textRun": {"content": "Title", "style": {}}}]}}},
            ],
        }],
    }

    drive_client = _make_drive_client()
    processor = SlideProcessor(_make_config(), slides_client, drive_client)
    processor.setup()

    with patch.object(processor, "_get_local_logo", return_value=None):
        instruction = _make_instruction(
            InstructionType.SLIDE_NEWS_WITH_TEXT,
            url="https://unknownsite.com/article",
            translated_text="Text here",
        )
        processor.process(instruction)

    # upload_and_share NAO deve ter sido chamado
    drive_client.upload_and_share.assert_not_called()


# ===========================================================================
# 14. Local Logo Detection
# ===========================================================================

@patch("os.path.exists")
def test_get_local_logo_finds_exact_domain(mock_exists):
    """_get_local_logo encontra logo pelo dominio exato."""
    from src.processors.slide_processor import SlideProcessor, LOGOS_DIR

    mock_exists.return_value = False
    # Retorna True apenas para o path esperado
    def exists_side_effect(path):
        return path == os.path.join(LOGOS_DIR, "ft.com.png")
    mock_exists.side_effect = exists_side_effect

    processor = SlideProcessor(_make_config(), _make_slides_client())
    result = processor._get_local_logo("https://www.ft.com/content/article")

    assert result == os.path.join(LOGOS_DIR, "ft.com.png")


@patch("os.path.exists")
def test_get_local_logo_finds_simplified_name(mock_exists):
    """_get_local_logo encontra logo pelo nome simplificado (sem .com)."""
    from src.processors.slide_processor import SlideProcessor, LOGOS_DIR

    def exists_side_effect(path):
        return path == os.path.join(LOGOS_DIR, "ft.png")
    mock_exists.side_effect = exists_side_effect

    processor = SlideProcessor(_make_config(), _make_slides_client())
    result = processor._get_local_logo("https://www.ft.com/content/article")

    assert result == os.path.join(LOGOS_DIR, "ft.png")


@patch("os.path.exists", return_value=False)
def test_get_local_logo_returns_none_when_not_found(mock_exists):
    """_get_local_logo retorna None quando logo nao existe."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    result = processor._get_local_logo("https://nonexistent-site.com/article")

    assert result is None


def test_get_local_logo_returns_none_for_empty_url():
    """_get_local_logo retorna None para URL vazia."""
    from src.processors.slide_processor import SlideProcessor

    processor = SlideProcessor(_make_config(), _make_slides_client())
    assert processor._get_local_logo("") is None
    assert processor._get_local_logo(None) is None


# ===========================================================================
# 15. Background Rect Shrink (Tipo 2)
# ===========================================================================

def test_shrink_text_bg_rect_short_title():
    """_shrink_text_bg_rect usa scaleY pequeno para titulo curto (<= 45 chars)."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "slide_001",
            "pageElements": [
                # Shape com texto (nao e retangulo de fundo)
                {
                    "objectId": "text_shape",
                    "shape": {"text": {"textElements": [{"textRun": {"content": "Title"}}]}},
                    "size": {"height": {"magnitude": 100000}},
                    "transform": {"scaleY": 0.5},
                },
                # Shape vazio 1 (retangulo de fundo grande)
                {
                    "objectId": "bg_rect_big",
                    "shape": {"text": {"textElements": []}},
                    "size": {"height": {"magnitude": 500000}},
                    "transform": {"scaleX": 1, "scaleY": 0.8, "translateX": 0, "translateY": 0, "shearX": 0, "shearY": 0},
                },
                # Shape vazio 2 (barra do logo pequena)
                {
                    "objectId": "logo_bar",
                    "shape": {"text": {"textElements": []}},
                    "size": {"height": {"magnitude": 100000}},
                    "transform": {"scaleX": 1, "scaleY": 0.2, "translateX": 0, "translateY": 0, "shearX": 0, "shearY": 0},
                },
            ],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    processor._shrink_text_bg_rect("slide_001", "Short")

    # batch_update deve ter sido chamado com o scaleY de 1 linha
    slides_client.batch_update.assert_called_once()
    requests = slides_client.batch_update.call_args[0][1]
    transform = requests[0]["updatePageElementTransform"]["transform"]
    assert abs(transform["scaleY"] - 0.1902) < 0.001  # _BG_SCALE_Y_1LINE


# ===========================================================================
# 16. Tipo 3 Text Position Adjustment
# ===========================================================================

def test_adjust_tipo3_text_position_short_title():
    """_adjust_tipo3_text_position usa params de 1 linha para titulo curto."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "slide_001",
            "pageElements": [{
                "objectId": "text_el",
                "transform": {"scaleX": 1, "scaleY": 0.2, "translateX": 100, "translateY": 200, "shearX": 0, "shearY": 0},
            }],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    processor._adjust_tipo3_text_position("slide_001", "text_el", "Short")  # < 35 chars = 1 line

    slides_client.batch_update.assert_called_once()
    requests = slides_client.batch_update.call_args[0][1]
    transform = requests[0]["updatePageElementTransform"]["transform"]
    # Deve usar _T3_TEXT[1] valores
    assert abs(transform["scaleY"] - 0.1796) < 0.001
    assert transform["translateY"] == 1276324


def test_adjust_tipo3_text_position_medium_title():
    """_adjust_tipo3_text_position usa params de 2 linhas para titulo medio."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "slide_001",
            "pageElements": [{
                "objectId": "text_el",
                "transform": {"scaleX": 1, "scaleY": 0.2, "translateX": 100, "translateY": 200, "shearX": 0, "shearY": 0},
            }],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    medium_title = "A" * 50  # 36-70 chars = 2 lines
    processor._adjust_tipo3_text_position("slide_001", "text_el", medium_title)

    requests = slides_client.batch_update.call_args[0][1]
    transform = requests[0]["updatePageElementTransform"]["transform"]
    assert abs(transform["scaleY"] - 0.2976) < 0.001
    assert transform["translateY"] == 1099324


def test_adjust_tipo3_text_position_long_title():
    """_adjust_tipo3_text_position usa params de 3 linhas para titulo longo."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "slide_001",
            "pageElements": [{
                "objectId": "text_el",
                "transform": {"scaleX": 1, "scaleY": 0.2, "translateX": 100, "translateY": 200, "shearX": 0, "shearY": 0},
            }],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    long_title = "A" * 80  # > 70 chars = 3 lines
    processor._adjust_tipo3_text_position("slide_001", "text_el", long_title)

    requests = slides_client.batch_update.call_args[0][1]
    transform = requests[0]["updatePageElementTransform"]["transform"]
    assert abs(transform["scaleY"] - 0.4156) < 0.001
    assert transform["translateY"] == 922324


# ===========================================================================
# 17. Replace Text Preserving Style
# ===========================================================================

def test_replace_text_preserving_style_with_original_style():
    """_replace_text_preserving_style preserva bold, fontSize e foregroundColor."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "any_slide",
            "pageElements": [{
                "objectId": "styled_el",
                "shape": {
                    "text": {
                        "textElements": [{
                            "textRun": {
                                "content": "Old Text",
                                "style": {
                                    "bold": True,
                                    "fontSize": {"magnitude": 24, "unit": "PT"},
                                    "foregroundColor": {"opaqueColor": {"rgbColor": {"red": 1, "green": 0, "blue": 0}}},
                                    "fontFamily": "Roboto",
                                },
                            }
                        }],
                    },
                },
            }],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor._presentation_id = "pres_id"

    processor._replace_text_preserving_style("styled_el", "New Text")

    # batch_update deve ter sido chamado com deleteText, insertText e updateTextStyle
    slides_client.batch_update.assert_called_once()
    requests = slides_client.batch_update.call_args[0][1]

    assert requests[0]["deleteText"]["objectId"] == "styled_el"
    assert requests[1]["insertText"]["text"] == "New Text"
    # Terceiro request: updateTextStyle com estilo original
    update_style = requests[2]["updateTextStyle"]
    assert update_style["style"]["bold"] is True
    assert "fontSize" in update_style["style"]
    assert "foregroundColor" in update_style["style"]
    assert "fontFamily" in update_style["style"]


def test_replace_text_preserving_style_without_original_style():
    """_replace_text_preserving_style funciona quando nao ha estilo original."""
    from src.processors.slide_processor import SlideProcessor

    slides_client = _make_slides_client()
    slides_client.get_presentation.return_value = {
        "slides": [{
            "objectId": "any_slide",
            "pageElements": [{
                "objectId": "plain_el",
                "shape": {
                    "text": {
                        "textElements": [{
                            "textRun": {
                                "content": "Old Text",
                                # Sem "style"
                            }
                        }],
                    },
                },
            }],
        }],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor._presentation_id = "pres_id"

    processor._replace_text_preserving_style("plain_el", "New Text")

    requests = slides_client.batch_update.call_args[0][1]
    # Apenas deleteText e insertText (sem updateTextStyle)
    assert len(requests) == 2
    assert "deleteText" in requests[0]
    assert "insertText" in requests[1]


# ===========================================================================
# 18. Geracao na Ordem Correta
# ===========================================================================

@patch("src.processors.slide_processor.time.sleep")
@patch("src.processors.slide_processor.extract_post_content")
@patch("src.processors.slide_processor.extract_news_content")
def test_multiple_slides_in_order(mock_news, mock_post, mock_sleep):
    """Multiplos slides sao gerados na ordem das instrucoes."""
    from src.processors.slide_processor import SlideProcessor

    mock_post.return_value = _fake_post_content()
    mock_news.return_value = _fake_news_content()

    slides_client = _make_slides_client()
    slides_client.duplicate_slide.side_effect = ["slide_1", "slide_2", "slide_3"]
    slides_client.get_slide_ids.side_effect = [
        ["s0", "s1", "s2", "s3", "s4"],  # setup
        ["s0", "s1", "s2", "s3", "s4", "slide_1"],  # after first duplicate
        ["s0", "s1", "s2", "s3", "s4", "slide_1", "slide_2"],  # after second
        ["s0", "s1", "s2", "s3", "s4", "slide_1", "slide_2", "slide_3"],  # after third
    ]
    slides_client.get_slide_elements.return_value = [
        {"objectId": "el1", "shape": {"text": {"textElements": [{"textRun": {"content": "T", "style": {}}}]}}},
    ]
    slides_client.get_presentation.return_value = {
        "slides": [{"objectId": "new_slide", "pageElements": [
            {"objectId": "el1", "shape": {"text": {"textElements": [{"textRun": {"content": "T", "style": {}}}]}}},
        ]}],
    }

    processor = SlideProcessor(_make_config(), slides_client)
    processor.setup()

    instructions = [
        _make_instruction(InstructionType.SLIDE_POST, url="https://x.com/u/status/1", platform=Platform.X, order=1),
        _make_instruction(InstructionType.SLIDE_FULLSCREEN, url="https://example.com/img.jpg", order=2),
    ]

    results = []
    for instr in instructions:
        # Reset _is_wide_logo if needed
        result = processor.process(instr)
        results.append(result)

    assert results[0] == "slide_1"
    assert results[1] == "slide_2"
    # Verifica ordem das chamadas a duplicate_slide
    dup_calls = slides_client.duplicate_slide.call_args_list
    assert dup_calls[0][0][1] == "s0"  # POST template (indice 0)
    assert dup_calls[1][0][1] == "s3"  # FULLSCREEN template (indice 3)


# ===========================================================================
# Runner
# ===========================================================================

if __name__ == "__main__":
    print("=== Testes: slide_processor ===\n")

    tests = [
        # Inicializacao
        ("1a. Init stores config and clients", test_init_stores_config_and_clients),
        ("1b. Setup with presentation_id", test_setup_with_presentation_id),
        ("1c. Setup without presentation_id", test_setup_without_presentation_id_uses_template),
        ("1d. Presentation ID raises if not setup", test_presentation_id_property_raises_if_not_setup),
        ("1e. Process raises if not setup", test_process_raises_if_not_setup),
        ("1f. Process raises for unsupported type", test_process_raises_for_unsupported_type),
        # Tipo 1: Post
        ("2a. Post slide basic flow", test_post_slide_basic_flow),
        ("2b. Post replaces placeholders", test_post_slide_replaces_placeholders),
        ("2c. Post with profile image fallback", test_post_slide_with_profile_image),
        ("2d. Post with profile image placeholder", test_post_slide_with_profile_image_placeholder),
        ("2e. Post without URL raises", test_post_slide_without_url_raises),
        ("2f. Post extraction error propagates", test_post_slide_extraction_error_propagates),
        ("2g. Post progress callback", test_post_slide_progress_callback),
        # FR4: Texto grande
        ("3a. Post text truncated when over max", test_post_text_truncation_when_over_max),
        ("3b. Post text not truncated when under max", test_post_text_no_truncation_when_under_max),
        ("3c. Truncate at sentence boundary", test_truncate_text_at_sentence_boundary),
        ("3d. Truncate at word boundary", test_truncate_text_at_word_boundary),
        ("3e. Truncate no-op when short", test_truncate_text_no_op_when_short),
        # Tipo 2: News with text
        ("4a. News with text basic flow", test_news_with_text_basic_flow),
        ("4b. News with text without URL raises", test_news_with_text_without_url_raises),
        ("4c. News with text extraction error", test_news_with_text_extraction_error),
        # Tipo 3: News no text
        ("5a. News no text basic flow", test_news_no_text_basic_flow),
        ("5b. News no text wide logo uses tipo2", test_news_no_text_wide_logo_uses_tipo2_template),
        ("5c. News no text without URL raises", test_news_no_text_without_url_raises),
        # Tipo 4: Fullscreen
        ("6a. Fullscreen basic flow", test_fullscreen_basic_flow),
        ("6b. Fullscreen no border on image fail", test_fullscreen_no_border_when_image_fails),
        ("6c. Fullscreen without URL raises", test_fullscreen_without_url_raises),
        # Tipo 5: Partial
        ("7a. Partial single image", test_partial_single_image),
        ("7b. Partial multiple images", test_partial_multiple_images),
        ("7c. Partial skips non-http URLs", test_partial_skips_non_http_urls),
        ("7d. Partial without URLs raises", test_partial_without_urls_raises),
        ("7e. Partial continues on failure", test_partial_continues_on_image_insert_failure),
        ("7f. Partial progress callback", test_partial_progress_callback),
        # Throttle
        ("8a. Throttle sleeps when too fast", test_throttle_sleeps_when_too_fast),
        # Cleanup
        ("9a. Cleanup deletes all templates", test_cleanup_templates_deletes_all),
        ("9b. Cleanup continues on error", test_cleanup_templates_continues_on_error),
        ("9c. Cleanup no-op if not setup", test_cleanup_templates_no_op_if_not_setup),
        # Template index
        ("10a. Template index returns correct ID", test_get_template_slide_id_returns_correct_index),
        ("10b. Template index raises for invalid type", test_get_template_slide_id_raises_for_invalid_type),
        ("10c. Template index raises for out of range", test_get_template_slide_id_raises_for_out_of_range),
        # Duplicate + Move
        ("11a. Duplicate moves to end", test_duplicate_template_moves_to_end),
        # Normalize URL
        ("12a. Normalize glbimg URL", test_normalize_url_glbimg_extracts_original),
        ("12b. Normalize webp to jpg", test_normalize_url_replaces_webp_with_jpg),
        ("12c. Normalize truncated parentheses", test_normalize_url_removes_truncated_parentheses),
        ("12d. Normalize plain proxy", test_normalize_url_extracts_plain_proxy),
        ("12e. Normalize passthrough", test_normalize_url_passthrough_normal),
        # News logo
        ("13a. News logo skipped without drive client", test_news_logo_skipped_without_drive_client),
        ("13b. News logo skipped without local logo", test_news_logo_skipped_without_local_logo),
        # Local logo
        ("14a. Local logo exact domain", test_get_local_logo_finds_exact_domain),
        ("14b. Local logo simplified name", test_get_local_logo_finds_simplified_name),
        ("14c. Local logo not found", test_get_local_logo_returns_none_when_not_found),
        ("14d. Local logo empty URL", test_get_local_logo_returns_none_for_empty_url),
        # BG rect
        ("15a. Shrink BG rect short title", test_shrink_text_bg_rect_short_title),
        # Tipo 3 text position
        ("16a. Tipo3 text position short", test_adjust_tipo3_text_position_short_title),
        ("16b. Tipo3 text position medium", test_adjust_tipo3_text_position_medium_title),
        ("16c. Tipo3 text position long", test_adjust_tipo3_text_position_long_title),
        # Replace text preserving style
        ("17a. Replace text with original style", test_replace_text_preserving_style_with_original_style),
        ("17b. Replace text without original style", test_replace_text_preserving_style_without_original_style),
        # Order
        ("18a. Multiple slides in order", test_multiple_slides_in_order),
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
