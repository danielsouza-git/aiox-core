"""Carregamento e validacao de configuracao."""

import json
import os
import sys
from dataclasses import dataclass
from typing import Optional


@dataclass
class GoogleConfig:
    credentials_path: str
    token_path: str
    slides_template_id: str
    api_key: str = ""


@dataclass
class OpenAIConfig:
    api_key: str


@dataclass
class PathsConfig:
    output_dir: str
    font_tarja_bold: str
    font_tarja_regular: str
    font_tarja_semibold: str
    tarja_template_epoch: str
    tarja_template_cobertura: str
    tarja_template_superchats: str = ""


@dataclass
class VideoConfig:
    default_quality: str
    whisper_model: str
    translation_model: str


@dataclass
class AppConfig:
    google: GoogleConfig
    openai: OpenAIConfig
    paths: PathsConfig
    video: VideoConfig


def get_config_path() -> str:
    """Retorna o path do config.json.

    Em build frozen (PyInstaller), procura:
    1. Junto ao executavel (dist/config.json — copiado pelo usuario)
    2. Dentro do bundle (_MEIPASS/config.json — empacotado no .spec)
    3. No diretorio de trabalho atual

    Em modo source, procura:
    1. Relativo ao modulo (src/core/../../config.json = raiz do projeto)
    2. No diretorio de trabalho atual
    """
    if getattr(sys, "frozen", False):
        base_dir = os.path.dirname(os.path.abspath(sys.executable))
        candidates = [
            os.path.join(base_dir, "config.json"),
            os.path.join(base_dir, "..", "config.json"),
        ]
        # Em --onefile, dados empacotados ficam em sys._MEIPASS
        if hasattr(sys, "_MEIPASS"):
            candidates.append(os.path.join(sys._MEIPASS, "config.json"))
        candidates.append(os.path.join(os.getcwd(), "config.json"))
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        candidates = [
            os.path.join(base_dir, "..", "..", "config.json"),
            os.path.join(os.getcwd(), "config.json"),
        ]
    for path in candidates:
        normalized = os.path.normpath(path)
        if os.path.exists(normalized):
            return normalized
    return os.path.normpath(candidates[0])


def load_config(config_path: Optional[str] = None) -> AppConfig:
    """Carrega configuracao do arquivo JSON."""
    if config_path is None:
        config_path = get_config_path()

    if not os.path.exists(config_path):
        raise FileNotFoundError(
            f"Arquivo de configuracao nao encontrado: {config_path}. "
            "Copie config.example.json para config.json e preencha os valores."
        )

    with open(config_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    config_dir = os.path.dirname(os.path.abspath(config_path))
    google_data = data.get("google", {})

    # Se paths vierem relativos no JSON, ancora no diretorio do proprio config.json.
    for key in ("credentials_path", "token_path"):
        value = google_data.get(key)
        if value and not os.path.isabs(value):
            google_data[key] = os.path.normpath(os.path.join(config_dir, value))

    return AppConfig(
        google=GoogleConfig(**google_data),
        openai=OpenAIConfig(**data.get("openai", {})),
        paths=PathsConfig(**data.get("paths", {})),
        video=VideoConfig(**data.get("video", {})),
    )


def save_config(config: AppConfig, config_path: Optional[str] = None) -> None:
    """Salva configuracao no arquivo JSON."""
    if config_path is None:
        config_path = get_config_path()

    data = {
        "google": {
            "credentials_path": config.google.credentials_path,
            "token_path": config.google.token_path,
            "slides_template_id": config.google.slides_template_id,
            "api_key": config.google.api_key,
        },
        "openai": {
            "api_key": config.openai.api_key,
        },
        "paths": {
            "output_dir": config.paths.output_dir,
            "font_tarja_bold": config.paths.font_tarja_bold,
            "font_tarja_regular": config.paths.font_tarja_regular,
            "font_tarja_semibold": config.paths.font_tarja_semibold,
            "tarja_template_epoch": config.paths.tarja_template_epoch,
            "tarja_template_cobertura": config.paths.tarja_template_cobertura,
            "tarja_template_superchats": config.paths.tarja_template_superchats,
        },
        "video": {
            "default_quality": config.video.default_quality,
            "whisper_model": config.video.whisper_model,
            "translation_model": config.video.translation_model,
        },
    }

    os.makedirs(os.path.dirname(os.path.abspath(config_path)), exist_ok=True)
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
