---
story_id: "DASH-VD-008"
status: Done
type: Refactor
lead: "@dev"
points: 3
priority: High
clickup:
  task_id: ""
  epic_task_id: ""
  list: "Backlog"
  url: ""
  last_sync: ""
---

# Story DASH-VD-008: Remover interfaces nao-PyWebView do dashboard

**Epic:** Dashboard Local - Simplificacao  
**Story ID:** DASH-VD-008  
**Status:** Done  
**Type:** Refactor  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard  
**Depends On:** DASH-VD-007

## Descricao

O projeto `_projetos/dashboard` mantinha multiplas interfaces desktop (Tkinter, Qt, wx, Kivy, Dear PyGui, Toga, PySimpleGUI, Pygame e Panda3D) em paralelo ao painel principal em PyWebView. Esta historia remove os artefatos de UI alternativa e padroniza a execucao no fluxo unico PyWebView.

## Acceptance Criteria

1. O dashboard fica restrito ao fluxo PyWebView (`app.py` + `ui/`), sem pastas de toolkits nativos alternativos.  
2. Scripts/specs/binarios relacionados aos exemplos nativos alternativos sao removidos do projeto de dashboard.  
3. `requirements.txt`, `video_downloader/requirements.txt` e `README.md` deixam de listar/documentar interfaces alternativas e refletem runtime PyWebView-only.  
4. Story registra checklist, file list e quality gates.

## Tasks / Subtasks

- [x] Remover pastas de interfaces nativas nao-PyWebView em `_projetos/dashboard/*_dashboard`.
- [x] Remover builder/specs/binarios nativos alternativos (`tools/build_native_dashboard_exes.py`, `spec/native`, `dist/native`, `build/native`).
- [x] Atualizar `_projetos/dashboard/app.py` para eliminar fallback legado dependente de GUI nao-PyWebView.
- [x] Atualizar `_projetos/dashboard/requirements.txt`, `_projetos/dashboard/video_downloader/requirements.txt` e `_projetos/dashboard/README.md` para runtime PyWebView-only.
- [x] Executar quality gates (`npm run lint`, `npm run typecheck`, `npm test`) e registrar resultados.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/app.py` | Update | Remove fallback de chave Whisper dependente de `video_downloader/gui.py`. |
| `_projetos/dashboard/README.md` | Update | Documentacao simplificada para fluxo unico PyWebView. |
| `_projetos/dashboard/requirements.txt` | Update | Remove dependencias de toolkits alternativos, mantendo apenas runtime do painel. |
| `_projetos/dashboard/video_downloader/requirements.txt` | Update | Remove dependencias de GUI legada; mantem core do downloader. |
| `_projetos/dashboard/tkinter_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/qt_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/wx_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/kivy_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/dearpygui_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/toga_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/pysimplegui_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/pygame_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/panda3d_dashboard/` | Delete | Interface alternativa removida. |
| `_projetos/dashboard/tools/build_native_dashboard_exes.py` | Delete | Builder de executaveis nativos alternativos removido. |
| `_projetos/dashboard/spec/native/` | Delete | Specs PyInstaller dos toolkits alternativos removidos. |
| `_projetos/dashboard/dist/native/` | Delete | Executaveis nativos alternativos removidos. |
| `_projetos/dashboard/build/native/` | Delete | Artefatos de build nativos alternativos removidos. |
| `_projetos/dashboard/video_downloader/main.py` | Delete | Entrypoint de GUI legada removido. |
| `_projetos/dashboard/video_downloader/gui.py` | Delete | Interface CustomTkinter/Tkinter removida. |
| `_projetos/dashboard/video_downloader/subtitle_editor.py` | Delete | Editor de legenda Tkinter legado removido. |
| `docs/stories/active/DASH-VD-008.story.md` | Create | Registro da historia com checklist, file list e quality gates. |

## Quality Gates

- `npm run lint` - FAIL (2 erros de parsing em `.venv/Lib/site-packages/PySide6` + warnings historicos no repo)
- `npm run typecheck` - PASS
- `npm test` - FAIL (`Error: spawn EPERM` ao iniciar workers do Jest)

## QA Notes

- Dashboard `_projetos/dashboard` ficou restrito ao fluxo PyWebView (`app.py` + `ui/` + `video_downloader/downloader.py`).
- Interfaces alternativas, specs e builders nativos foram removidos.
- `app.py` nao usa mais fallback legado de chave em `video_downloader/gui.py`; Whisper depende de `OPENAI_API_KEY`.
- `npm run lint` e `npm test` mantiveram os mesmos bloqueios historicos observados em outras stories do dashboard.
