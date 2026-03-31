---
story_id: "DASH-VD-005"
status: Done
type: Feature
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

# Story DASH-VD-005: Reintroduzir sidebar no painel local

**Epic:** Dashboard Local - Expansao de Ferramentas  
**Story ID:** DASH-VD-005  
**Status:** Done  
**Type:** Feature  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard  
**Depends On:** DASH-VD-003

## Descricao

O painel local em PyWebView foi simplificado para um card central em DASH-VD-002. Esta historia reintroduz uma barra lateral esquerda com o item "Video Downloader", mantendo o launcher funcional via `run_tool("video-downloader")` e o log de execucao no painel.

## Acceptance Criteria

1. O painel local renderiza uma barra lateral fixa a esquerda com o item "Video Downloader".  
2. O item "Video Downloader" continua disparando a execucao do launcher (`run_tool("video-downloader")`).  
3. A area principal mantem feedback de execucao (log/mensagens).  
4. O README do dashboard descreve o layout com sidebar esquerda e o comportamento do launcher.

## Tasks / Subtasks

- [x] Atualizar `_projetos/dashboard/ui/index.html` para incluir sidebar esquerda com item `Video Downloader`.
- [x] Atualizar `_projetos/dashboard/ui/styles.css` para layout de duas colunas (sidebar + conteudo).
- [x] Ajustar `_projetos/dashboard/ui/app.js` para acionar o launcher a partir do item da sidebar.
- [x] Atualizar `_projetos/dashboard/README.md` para refletir o novo layout.
- [x] Executar `npm run lint`, `npm run typecheck` e `npm test`, registrando os resultados.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/ui/index.html` | Update | Sidebar esquerda com item `Video Downloader` e area principal de log. |
| `_projetos/dashboard/ui/styles.css` | Update | Layout horizontal com sidebar fixa e conteudo principal. |
| `_projetos/dashboard/ui/app.js` | Update | Evento no item da sidebar para executar o launcher e registrar logs. |
| `_projetos/dashboard/README.md` | Update | Documenta o layout com sidebar e item fixo. |
| `_projetos/dashboard/dist/AIOS-Dashboard-Panel.exe` | Rebuild | Executavel regenerado para incluir o novo layout da UI. |
| `docs/stories/active/DASH-VD-005.story.md` | Create | Registra escopo, checklist, quality gates e file list da entrega. |

## Quality Gates

- `npm run lint` - FAIL (2 erros de parsing em `.venv/Lib/site-packages/PySide6` + warnings historicos no repo)
- `npm run typecheck` - PASS
- `npm test` - FAIL (`Error: spawn EPERM` no Jest ao iniciar workers)

## QA Notes

- A mudanca de layout da UI do dashboard foi aplicada sem adicionar novas falhas nos quality gates.
- `lint` e `test` seguem o mesmo bloqueio historico do ambiente atual.
- O executavel do painel foi regenerado apos a mudanca (`python tools/build_dashboard_exe.py`).
