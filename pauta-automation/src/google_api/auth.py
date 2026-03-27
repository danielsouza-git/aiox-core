"""Authentication para Google APIs — suporta API key e OAuth2."""

import os
from googleapiclient.discovery import build


SCOPES = [
    "https://www.googleapis.com/auth/documents.readonly",
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.readonly",
]

# Diretorio raiz do projeto (pauta-automation/)
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Cache de credenciais para evitar refresh multiplos na mesma sessao
_cached_creds = None


def _resolve_path(path: str) -> str:
    """Resolve path relativo ao diretorio raiz do projeto."""
    if os.path.isabs(path):
        return path
    return os.path.join(_PROJECT_ROOT, path)


def build_docs_service_with_key(api_key: str):
    """Cria servico Google Docs API usando API key (somente leitura)."""
    return build("docs", "v1", developerKey=api_key)


def build_docs_service(credentials_path: str, token_path: str):
    """Cria servico Google Docs API usando OAuth2."""
    creds = get_credentials(credentials_path, token_path)
    return build("docs", "v1", credentials=creds)


def build_slides_service(credentials_path: str, token_path: str):
    """Cria servico Google Slides API usando OAuth2."""
    creds = get_credentials(credentials_path, token_path)
    return build("slides", "v1", credentials=creds)


def build_drive_service(credentials_path: str, token_path: str):
    """Cria servico Google Drive API usando OAuth2."""
    creds = get_credentials(credentials_path, token_path)
    return build("drive", "v3", credentials=creds)


def get_credentials(credentials_path: str, token_path: str):
    """Obtem credenciais OAuth2, abrindo browser se necessario.

    Usa cache em memoria para evitar refresh multiplos na mesma sessao.
    Resolve paths relativos ao diretorio raiz do projeto para funcionar
    independente do CWD.
    """
    global _cached_creds
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow

    credentials_path = _resolve_path(credentials_path)
    token_path = _resolve_path(token_path)

    if _cached_creds and _cached_creds.valid:
        return _cached_creds

    creds = None

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(credentials_path):
                raise FileNotFoundError(
                    f"Arquivo de credenciais nao encontrado: {credentials_path}. "
                    "Baixe o credentials.json do Google Cloud Console."
                )
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)

        # Salva token para proximas execucoes
        os.makedirs(os.path.dirname(token_path), exist_ok=True)
        with open(token_path, "w") as token_file:
            token_file.write(creds.to_json())

    _cached_creds = creds
    return creds
