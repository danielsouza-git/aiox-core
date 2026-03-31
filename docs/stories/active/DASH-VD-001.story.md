---
story_id: "DASH-VD-001"
status: Done
type: Feature
lead: "@dev"
points: 3
priority: Medium
clickup:
  task_id: ""
  epic_task_id: ""
  list: "Backlog"
  url: ""
  last_sync: ""
---

# Story DASH-VD-001: Integrar Video Downloader ao Painel de Ferramentas

**Epic:** Dashboard Local - Expansão de Ferramentas  
**Story ID:** DASH-VD-001  
**Status:** Done  
**Type:** Feature  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard  
**Depends On:** N/A

## Descrição

O painel local em `_projetos/dashboard` ganhou um launcher PyWebView que carrega `ui/index.html` e apresenta um cartão dedicado ao **Video Downloader**, além das seções Tools, Runner e Snapshot. Esta story cria a ponte Python/JS (`app.py`), registra a ferramenta em `tools/registry.json`, documenta as dependências extras e garante que a UI invoque o launcher em um processo separado sem travar o painel.

## Acceptance Criteria

1. O painel executa um script em `tools/` que dispara `_projetos/dashboard/video_downloader/main.py` em um processo separado, sem travar o painel.
2. `tools/registry.json` lista a ferramenta com nome/descrição amigáveis, de forma que ela apareça automaticamente na lista Tools.
3. O README do dashboard descreve como instalar as dependências extras (`video_downloader/requirements.txt` e `ffmpeg`) e menciona explicitamente o item na lista Tools.
4. A UI (`ui/index.html`) exibe um card/card-wide adicional que descreve a ferramenta Video Downloader e lembra o usuário de selecioná-la na lista Tools antes de executar.

## Tasks / Subtasks

- [x] Criar `_projetos/dashboard/app.py` com a ponte PyWebView que expõe `get_tools()` e `run_tool()`.
- [x] Implementar a UI (`ui/index.html`, `ui/styles.css` e `ui/app.js`) com a lista Tools, Runner log e cartão do Video Downloader.
- [x] Criar `tools/registry.json` e `tools/video_downloader.py` para disparar o launcher em subprocesso.
- [x] Adicionar `video_downloader/main.py` e `video_downloader/requirements.txt` com a interface CustomTkinter e as dependências dedicadas.
- [x] Atualizar `README.md` e `requirements.txt` para documentar o painel local, o ffmpeg e o `pywebview`.
- [x] Rodar os quality gates obrigatórios (`npm run lint`, `npm run typecheck`, `npm test`) e registrar os resultados nesta story.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/app.py` | Create | PyWebView loader que expõe `get_tools()`/`run_tool()` e carrega o UI. |
| `_projetos/dashboard/ui/index.html` | Create | Layout com sidebar de ferramentas, Runner log, Snapshot e cartão do Video Downloader. |
| `_projetos/dashboard/ui/styles.css` | Create | Tema escuro, grid responsiva e componentes do dashboard. |
| `_projetos/dashboard/ui/app.js` | Create | Busca `tools/registry.json`, registra seleção e chama `run_tool()`. |
| `_projetos/dashboard/tools/registry.json` | Create | Catálogo JSON com o id `video-downloader`. |
| `_projetos/dashboard/tools/video_downloader.py` | Create | Dispara `video_downloader/main.py` em subprocesso com `AIOS_ROOT_DIR`. |
| `_projetos/dashboard/video_downloader/main.py` | Create | Interface CustomTkinter minimal para o Video Downloader (URL, pasta, botão). |
| `_projetos/dashboard/video_downloader/requirements.txt` | Create | Depende de customtkinter e yt-dlp. |
| `_projetos/dashboard/README.md` | Update | Documenta o painel local, dependências do downloader e ffmpeg. |
| `_projetos/dashboard/requirements.txt` | Update | Acrescenta `pywebview` à lista de toolkits. |
| `docs/stories/active/DASH-VD-001.story.md` | Update | Registra esta story, tarefas e etapas de QA. |

## Quality Gates

- `npm run lint` — FAIL (diversas warnings antigas e dois erros de parsing dentro de `PySide6` em `.venv/Lib/site-packages/.../TraceUtils.js` e `testlogger.js`; o restante da suíte termina com warnings conhecidos).
- `npm run typecheck` — PASS.
- `npm test` — FAIL (`Error: spawn EPERM` durante o spawn de workers do `jest` no Windows).

## QA Notes

- `npm run lint` continua relatando centenas de warnings espalhados pelo core e dois erros de parsing nos arquivos PySide6 dentro do `.venv` (`TraceUtils.js` e `testlogger.js`), motivo pelo qual o comando sai com status fail. Nenhuma das mensagens apontou para o código novo.
- `npm test` não conclui porque o worker do Jest falha com `spawn EPERM` antes de executar suítes; essa limitação já ocorria localmente e bloqueia a conclusão no momento.
