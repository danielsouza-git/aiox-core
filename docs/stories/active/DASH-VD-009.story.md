---
story_id: "DASH-VD-009"
status: Done
type: Refactor
lead: "@dev"
points: 2
priority: High
clickup:
  task_id: ""
  epic_task_id: ""
  list: "Backlog"
  url: ""
  last_sync: ""
---

# Story DASH-VD-009: Remover funcionalidades do Video Downloader e manter apenas o item na sidebar

**Epic:** Dashboard Local - Simplificacao  
**Story ID:** DASH-VD-009  
**Status:** Done  
**Type:** Refactor  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard  
**Depends On:** DASH-VD-008

## Descricao

O dashboard deve continuar exibindo apenas o painel com sidebar e item `Video Downloader`, mas sem qualquer funcionalidade de download, transcricao, edicao de legenda ou processamento de arquivos.

## Acceptance Criteria

1. O painel PyWebView continua abrindo com sidebar e item `Video Downloader`.  
2. Nao existe acao funcional de download/legenda no frontend nem no bridge Python.  
3. Artefatos/dependencias do downloader sao removidos do dashboard, mantendo apenas o necessario para abrir o painel.  
4. Story atualizada com checklist, file list e quality gates.

## Tasks / Subtasks

- [x] Simplificar `_projetos/dashboard/app.py` para bridge minimo sem metodos de downloader/legenda.
- [x] Simplificar UI (`_projetos/dashboard/ui/index.html`, `_projetos/dashboard/ui/app.js`, `_projetos/dashboard/ui/styles.css`) para manter apenas sidebar + item `Video Downloader` + conteudo informativo.
- [x] Remover `_projetos/dashboard/video_downloader/` e referencias ao downloader em scripts/docs.
- [x] Atualizar `_projetos/dashboard/requirements.txt`, `_projetos/dashboard/tools/registry.json`, `_projetos/dashboard/tools/build_dashboard_exe.py` e `_projetos/dashboard/README.md`.
- [x] Executar quality gates (`npm run lint`, `npm run typecheck`, `npm test`) e registrar resultados.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/app.py` | Update | Bridge reduzido para fluxo sem funcionalidades de downloader. |
| `_projetos/dashboard/ui/index.html` | Update | Mantem apenas sidebar com item `Video Downloader` e painel informativo. |
| `_projetos/dashboard/ui/app.js` | Update | Remove chamadas de execucao; apenas seleciona item e registra status local. |
| `_projetos/dashboard/ui/styles.css` | Update | Estilos simplificados para layout com sidebar e painel estatico. |
| `_projetos/dashboard/tools/registry.json` | Update | Item `video-downloader` mantido apenas como entrada visual do painel. |
| `_projetos/dashboard/tools/build_dashboard_exe.py` | Update | Remove inclusao/collect de artefatos do downloader. |
| `_projetos/dashboard/requirements.txt` | Update | Mantem apenas dependencia necessaria do painel (PyWebView). |
| `_projetos/dashboard/README.md` | Update | Documenta painel sem funcionalidades ativas de downloader. |
| `_projetos/dashboard/tools/video_downloader.py` | Delete | Entrypoint legado de launcher removido. |
| `_projetos/dashboard/video_downloader/` | Delete | Core/artefatos do downloader removidos. |
| `_projetos/dashboard/dist/AIOS-Dashboard-Panel.exe` | Delete | Binario antigo removido para evitar distribuir build com funcionalidades legadas. |
| `_projetos/dashboard/spec/AIOS-Dashboard-Panel.spec` | Delete | Spec antigo removido (referenciava artefatos do downloader). |
| `docs/stories/active/DASH-VD-009.story.md` | Create | Registro da historia, checklist, file list e quality gates. |

## Quality Gates

- `npm run lint` - FAIL (2 erros de parsing em `.venv/Lib/site-packages/PySide6` + warnings historicos no repo)
- `npm run typecheck` - PASS
- `npm test` - FAIL (`Error: spawn EPERM` ao iniciar workers do Jest)

## QA Notes

- Fluxo de download/legendas removido do frontend e do bridge Python; painel permanece apenas com item visual na sidebar.
- `python -m py_compile _projetos/dashboard/app.py` executado com sucesso.
- Os fails de `lint` e `test` continuam os mesmos bloqueios historicos do ambiente/repo.
