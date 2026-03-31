---
story_id: "DASH-VD-004"
status: Done
type: Feature
lead: "@dev"
points: 5
priority: Medium
clickup:
  task_id: ""
  epic_task_id: ""
  list: "Backlog"
  url: ""
  last_sync: ""
---

# Story DASH-VD-004: Exemplos de dashboards nativos

**Epic:** Dashboard Local - Experimentos  
**Story ID:** DASH-VD-004  
**Status:** Done  
**Type:** Feature  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard

## Descrição

Documentamos e validamos a coleção de demos nativas: cada pasta (`tkinter_dashboard`, `qt_dashboard`, `wx_dashboard`, `kivy_dashboard`, `dearpygui_dashboard`, `toga_dashboard`, `pysimplegui_dashboard`, `pygame_dashboard`, `panda3d_dashboard`) contém um `main.py` com uma barra lateral fixa e um botão/texto “Video Downloader”; isso foi confirmado pelo README atualizado (incluindo os comandos por toolkit) e pelo `requirements.txt` compartilhado. A história agora registra os quality gates executados após a entrega.

## Acceptance Criteria

1. Cada script usa um layout com uma coluna lateral esquerda e um widget/texto/controle chamado “Video Downloader” fixado nessa coluna.  
2. Há um README no `_projetos/dashboard` que lista cada exemplo, suas dependências e o comando para executá-lo, além do `requirements.txt` com todas as bibliotecas necessárias.  
3. Os exemplos estão separados em subpastas nomeadas por toolkit e mantêm o mesmo formato de sidebar+conteúdo.  
4. A story descreve as tarefas executadas, lista os arquivos criados/atualizados e registra o resultado dos quality gates.

## Tasks / Subtasks

- [x] Confirmar que cada pasta de toolkit contém um `main.py` com sidebar + item “Video Downloader”.  
- [x] Garantir que o `README.md` documenta cada exemplo/ comando e que `requirements.txt` lista as dependências necessárias.  
- [x] Registrar os quality gates (`npm run lint`, `npm run typecheck`, `npm test`) e adicionar os resultados nesta história.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/README.md` | Update | Lista cada toolkit com o comando correspondente e menciona o `requirements.txt`. |
| `_projetos/dashboard/requirements.txt` | Update | Mantém a catalogação de dependências para todos os toolkits (inclui `pywebview`, o resto já existia). |
| `_projetos/dashboard/tkinter_dashboard/main.py` | Verified | Confirmação de sidebar com “Video Downloader”. |
| `_projetos/dashboard/qt_dashboard/main.py` | Verified | “Video Downloader” presente + sidebar. |
| `_projetos/dashboard/wx_dashboard/main.py` | Verified | Sidebar + “Video Downloader”. |
| `_projetos/dashboard/kivy_dashboard/main.py` | Verified | Sidebar + “Video Downloader”. |
| `_projetos/dashboard/dearpygui_dashboard/main.py` | Verified | Sidebar/interação lateral com “Video Downloader”. |
| `_projetos/dashboard/toga_dashboard/main.py` | Verified | Aplicativo Toga com botão “Video Downloader”. |
| `_projetos/dashboard/pysimplegui_dashboard/main.py` | Verified | Coluna lateral com o item. |
| `_projetos/dashboard/pygame_dashboard/main.py` | Verified | Desenha sidebar e texto “Video Downloader”. |
| `_projetos/dashboard/panda3d_dashboard/main.py` | Verified | DirectFrame lateral e botão “Video Downloader”. |
| `docs/stories/active/DASH-VD-004.story.md` | Update | Registra o escopo final e os resultados dos quality gates. |

## Quality Gates

- `npm run lint` — FAIL (mesmos avisos históricos + dois erros de parsing em `.venv/Lib/site-packages/PySide6` nos arquivos `TraceUtils.js` e `testlogger.js`).  
- `npm run typecheck` — PASS.  
- `npm test` — FAIL (`Error: spawn EPERM` ao criar workers do Jest no Windows).

## QA Notes

- `npm run lint` continua listando warnings antigos e os dois erros nos arquivos PySide6 do `.venv`; nada novo foi introduzido pela coleção de demos.  
- `npm test` falha imediatamente com `Error: spawn EPERM` durante o spawn dos workers, comportamento já conhecido no ambiente Windows.  
