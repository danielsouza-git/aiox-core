---
story_id: "DASH-VD-006"
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

# Story DASH-VD-006: Abrir Video Downloader dentro do painel

**Epic:** Dashboard Local - Expansao de Ferramentas  
**Story ID:** DASH-VD-006  
**Status:** Done  
**Type:** Feature  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard

## Descricao

Atualmente o item `Video Downloader` da sidebar dispara `run_tool("video-downloader")`, que abre um processo externo com interface Tkinter. Esta historia move a experiencia para dentro do painel PyWebView, exibindo o formulario de Video Downloader na area principal e executando o fluxo via bridge Python-JS.

## Acceptance Criteria

1. Ao clicar em `Video Downloader` na sidebar, o conteudo do downloader abre dentro do painel local (sem janela Tkinter externa).  
2. O formulario no painel contem URL, destino e qualidade e aciona a API Python pelo bridge do PyWebView.  
3. O feedback de sucesso/erro aparece na propria UI do painel (status e log).  
4. O README documenta que o Video Downloader principal agora roda embutido no painel.

## Tasks / Subtasks

- [x] Atualizar `_projetos/dashboard/app.py` para expor endpoint de execucao do downloader via bridge.
- [x] Atualizar `_projetos/dashboard/ui/index.html` para incluir o formulario do downloader na area principal.
- [x] Atualizar `_projetos/dashboard/ui/styles.css` para o layout do formulario embutido.
- [x] Atualizar `_projetos/dashboard/ui/app.js` para carregar o downloader no painel e chamar a bridge Python.
- [x] Atualizar `_projetos/dashboard/README.md` refletindo que o downloader roda no painel.
- [x] Executar quality gates (`npm run lint`, `npm run typecheck`, `npm test`) e registrar resultados.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/app.py` | Update | Bridge com metodo para executar fluxo do downloader no painel. |
| `_projetos/dashboard/ui/index.html` | Update | Conteudo principal com formulario do Video Downloader. |
| `_projetos/dashboard/ui/styles.css` | Update | Estilos para formulario embutido e estado ativo da sidebar. |
| `_projetos/dashboard/ui/app.js` | Update | Interacao do formulario + chamadas para API Python via PyWebView. |
| `_projetos/dashboard/tools/registry.json` | Update | Descricao ajustada para fluxo embutido no painel. |
| `_projetos/dashboard/README.md` | Update | Documentacao do fluxo embutido no painel. |
| `_projetos/dashboard/dist/AIOS-Dashboard-Panel.exe` | Rebuild | Executavel regenerado com a nova UI embutida. |
| `docs/stories/active/DASH-VD-006.story.md` | Create | Registro da historia, checklist e quality gates. |

## Quality Gates

- `npm run lint` - FAIL (mesmos 2 erros de parsing em `.venv/Lib/site-packages/PySide6` + warnings historicos)
- `npm run typecheck` - PASS
- `npm test` - FAIL (`Error: spawn EPERM` ao iniciar workers do Jest)

## QA Notes

- O clique em `Video Downloader` agora abre formulario embutido no painel, sem subprocesso Tkinter.
- `python tools/build_dashboard_exe.py` executado para refletir a alteracao no binario.
- Bloqueios de `lint` e `test` permanecem os mesmos do ambiente global do repositorio.
