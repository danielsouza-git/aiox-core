"""Cliente Google Drive API — upload de imagens para uso no Slides API."""

import logging
import os

from googleapiclient.http import MediaFileUpload

logger = logging.getLogger(__name__)

# Pasta fixa no Google Drive para logos de veiculos
LOGOS_FOLDER_ID = "1cJTNmy7pTTamRxXMJIdD7m-I-5z_Etn5"


class DriveClient:
    """Upload de arquivos para Google Drive com compartilhamento publico.

    O Google Slides API exige URLs publicamente acessiveis para createImage.
    Esta classe faz upload de arquivos locais para o Drive e os torna publicos.
    Logos sao armazenados numa pasta fixa do Drive para evitar duplicatas.
    """

    def __init__(self, service):
        """Args: service — objeto retornado por build_drive_service()."""
        self.service = service
        self._cache: dict[str, str] = {}  # {filename: public_url}
        self._load_existing_logos()

    def _load_existing_logos(self) -> None:
        """Lista logos ja existentes na pasta do Drive e preenche o cache."""
        try:
            page_token = None
            while True:
                response = self.service.files().list(
                    q=f"'{LOGOS_FOLDER_ID}' in parents and trashed = false",
                    fields="nextPageToken, files(id, name)",
                    pageSize=200,
                    pageToken=page_token,
                    supportsAllDrives=True,
                    includeItemsFromAllDrives=True,
                ).execute()

                for item in response.get("files", []):
                    name = item["name"]
                    file_id = item["id"]
                    public_url = f"https://drive.google.com/uc?id={file_id}&export=download"
                    self._cache[name] = public_url

                page_token = response.get("nextPageToken")
                if not page_token:
                    break

            logger.info(
                "Drive logos cache: %d logos encontrados na pasta", len(self._cache)
            )
        except Exception as e:
            logger.warning("Falha ao listar logos existentes no Drive: %s", e)

    def upload_and_share(self, file_path: str) -> str:
        """Upload arquivo para Drive e retorna URL publica para Slides API.

        Se o arquivo ja existe na pasta do Drive, retorna URL existente.

        Args:
            file_path: Caminho local do arquivo (PNG, JPG, etc.)

        Returns:
            URL publica no formato que o Google Slides API aceita.
        """
        filename = os.path.basename(file_path)
        drive_name = f"pauta-logo-{filename}"

        # Cache: ja existe no Drive
        if drive_name in self._cache:
            logger.debug("Logo cache hit: %s", drive_name)
            return self._cache[drive_name]

        # Upload para a pasta de logos
        file_metadata = {
            "name": drive_name,
            "parents": [LOGOS_FOLDER_ID],
        }
        media = MediaFileUpload(file_path, resumable=False)
        uploaded = self.service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id",
        ).execute()

        file_id = uploaded["id"]
        logger.info("Logo uploaded para Drive: %s → %s", drive_name, file_id)

        # Tornar publico (anyone can view)
        self.service.permissions().create(
            fileId=file_id,
            body={"type": "anyone", "role": "reader"},
        ).execute()

        # URL publica compativel com Google Slides API
        public_url = f"https://drive.google.com/uc?id={file_id}&export=download"

        self._cache[drive_name] = public_url
        return public_url
