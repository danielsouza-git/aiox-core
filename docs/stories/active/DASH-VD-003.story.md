---
story_id: "DASH-VD-003"
status: Done
type: Feature
lead: "@dev"
points: 5
priority: High
clickup:
  task_id: ""
  epic_task_id: ""
  list: "Backlog"
  url: ""
  last_sync: ""
---

# Story DASH-VD-003: Gerar executável para abrir o painel

**Epic:** Dashboard Local - Expansão de Ferramentas  
**Story ID:** DASH-VD-003  
**Status:** Done  
**Type:** Feature  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard  
**Depends On:** DASH-VD-002

## Descrição

Criamos o builder `tools/build_dashboard_exe.py`, que invoca `PyInstaller --onefile` com `--hidden-import webview`, inclui os diretórios `ui/`, `tools/`, `video_downloader/` e `docs/stories/` como dados e coloca o `.exe` resultante em `_projetos/dashboard/dist/AIOS-Dashboard-Panel.exe`. O README agora documenta o workflow de instalação do PyInstaller e explica que o executável mantém o botão “Executar Video Downloader” e o `AIOS_ROOT_DIR` apontando para o repositório.

## Acceptance Criteria

1. Existe um script `tools/build_dashboard_exe.py` que chama PyInstaller com `--onefile`, inclui `ui/`, `tools/`, `video_downloader/` e `docs/stories/` como dados e grava o executável em `_projetos/dashboard/dist/AIOS-Dashboard-Panel.exe`.  
2. O README do dashboard descreve o comando `python tools/build_dashboard_exe.py` e explica como usar o `.exe` gerado.  
3. O painel em `app.py` ainda expõe a ponte Python-JS e o botão continua disparando `run_tool("video-downloader")`, mesmo quando é executado a partir do `.exe`.  
4. A história lista as tarefas executadas e registra os resultados dos quality gates.

## Tasks / Subtasks

- [x] Criar `tools/build_dashboard_exe.py` com PyInstaller, adicionando os dados e configurando o runtime temporário.  
- [x] Atualizar `_projetos/dashboard/README.md` para documentar o builder e o `.exe`.  
- [x] Registrar os quality gates (`npm run lint`, `npm run typecheck`, `npm test`) e atualizar esta história.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/tools/build_dashboard_exe.py` | Create | Script que executa PyInstaller (`--onefile`, `--hidden-import webview`, `--runtime-tmpdir`). |
| `_projetos/dashboard/README.md` | Update | Explica o builder, a presença do `.exe` em `dist/` e a necessidade de PyInstaller. |
| `docs/stories/active/DASH-VD-003.story.md` | Update | Captura esse escopo e os resultados de QA. |

## Quality Gates

- `npm run lint` — FAIL (mesmos warnings espalhados pelo codebase e dois erros de parsing dentro de `.venv/Lib/site-packages/PySide6` em `TraceUtils.js` e `testlogger.js`; nenhum novo erro cruza o código alterado).  
- `npm run typecheck` — PASS.  
- `npm test` — FAIL (`jest` falha com `Error: spawn EPERM` ao tentar iniciar workers no Windows).

## QA Notes

- `npm run lint` continua apontando as mesmas centenas de avisos antigos e os dois erros no artefato PySide6 dentro do `.venv`; o comando termina com fail pela presença contínua desses arquivos binários.  
- `npm test` não conclui porque o Jest não consegue spawnar workers (`Error: spawn EPERM`), reprodução conhecida no ambiente Windows.  
- O builder gera `_projetos/dashboard/dist/AIOS-Dashboard-Panel.exe` e permanece compatível com `app.py`, já que o botão do UI chama `run_tool("video-downloader")` via `DashboardBridge`.
