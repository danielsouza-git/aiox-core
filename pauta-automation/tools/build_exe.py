"""Build Pauta Automation into a single executable with PyInstaller."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


def _data_entry(source: Path, target: str) -> str:
    sep = ";" if os.name == "nt" else ":"
    return f"{source}{sep}{target}"


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    dist_dir = root / "dist"
    build_dir = root / "build"
    spec_dir = root / "spec"

    dist_dir.mkdir(exist_ok=True)
    build_dir.mkdir(exist_ok=True)
    spec_dir.mkdir(exist_ok=True)

    ui_dir = root / "ui"
    assets_dir = root / "assets"
    config_dir = root / "config"

    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--onefile",
        "--windowed",
        "--clean",
        "--noconfirm",
        "--name", "Pauta-Automation",
        "--distpath", str(dist_dir),
        "--workpath", str(build_dir),
        "--specpath", str(spec_dir),
        "--hidden-import", "webview",
        "--collect-submodules", "webview",
        "--hidden-import", "src.google_api.auth",
        "--hidden-import", "src.google_api.docs_client",
        "--hidden-import", "src.google_api.slides_client",
        "--hidden-import", "src.google_api.drive_client",
        "--hidden-import", "src.parser.pauta_parser",
        "--hidden-import", "src.processors.slide_processor",
        "--hidden-import", "src.processors.tarja_processor",
        "--hidden-import", "src.processors.video_processor",
        "--hidden-import", "src.extractors.news_extractor",
        "--hidden-import", "src.core.orchestrator",
        "--hidden-import", "src.core.models",
        "--hidden-import", "clr",
        "--hidden-import", "clr_loader",
        "--add-data", _data_entry(ui_dir, "ui"),
    ]

    if assets_dir.exists():
        cmd.extend(["--add-data", _data_entry(assets_dir, "assets")])

    if config_dir.exists():
        cmd.extend(["--add-data", _data_entry(config_dir, "config")])

    cmd.append(str(root / "main.py"))

    print("Executando:", " ".join(cmd))
    subprocess.run(cmd, check=True)
    print(f"\nExecutable: {dist_dir / 'Pauta-Automation.exe'}")


if __name__ == "__main__":
    main()
