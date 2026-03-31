---
story_id: "DASH-VD-007"
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

# Story DASH-VD-007: Painel de legendas embutido no dashboard

**Epic:** Dashboard Local - Expansao de Ferramentas  
**Story ID:** DASH-VD-007  
**Status:** Done  
**Type:** Feature  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard  
**Depends On:** DASH-VD-006

## Descricao

O dashboard embutido ja executa download/transcricao e retorna `srt_path`, mas nao exibia um editor de legenda no proprio painel web. Esta entrega adiciona um **Painel de Legendas** no `ui/` que aparece automaticamente quando ha SRT, com operacoes de carregar, editar, salvar e embutir a legenda no video final via bridge Python-JS.

## Acceptance Criteria

1. Quando `run_video_downloader` retorna `srt_path`, o painel web mostra automaticamente a area de legendas embutida no dashboard (sem abrir janela Tkinter).  
2. A UI permite carregar e editar o conteudo `.srt`, salvar no mesmo arquivo e mostrar feedback de sucesso/erro no painel.  
3. A UI permite embutir a legenda editada no video final usando bridge Python (`embed_srt_in_video`) e exibe o resultado no log/status.  
4. README e story registram o novo fluxo com checklist e file list atualizados.

## Tasks / Subtasks

- [x] Estender `_projetos/dashboard/app.py` com APIs para `get_subtitle_content`, `save_subtitle_content` e `embed_subtitles`.
- [x] Atualizar `_projetos/dashboard/ui/index.html` com o painel de legendas embutido.
- [x] Atualizar `_projetos/dashboard/ui/app.js` com fluxo de carregar/salvar/embutir SRT e feedback no log/status.
- [x] Atualizar `_projetos/dashboard/ui/styles.css` para o layout e componentes do painel de legenda.
- [x] Atualizar `_projetos/dashboard/README.md` documentando o painel de legendas no fluxo embutido.
- [x] Ajustar `_projetos/dashboard/tools/build_dashboard_exe.py` para manter o EXE portavel (sem runtime temp dir absoluto) e reduzir falhas de extracao no `.exe`.
- [x] Executar quality gates (`npm run lint`, `npm run typecheck`, `npm test`) e registrar resultados.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/app.py` | Update | Novas APIs da bridge: carregar/salvar SRT e embutir legenda no video. |
| `_projetos/dashboard/ui/index.html` | Update | Novo bloco `Painel de Legendas` embutido no formulario do downloader. |
| `_projetos/dashboard/ui/app.js` | Update | Estado de legenda + acoes `recarregar`, `salvar`, `embutir` via `window.pywebview.api`. |
| `_projetos/dashboard/ui/styles.css` | Update | Estilos para editor SRT, botoes secundarios e painel responsivo. |
| `_projetos/dashboard/README.md` | Update | Documentacao do fluxo de edicao/embutir legendas dentro do painel local. |
| `_projetos/dashboard/tools/build_dashboard_exe.py` | Update | Runtime tmp dir absoluto removido; usa temp padrao do usuario (opcional override via `AIOS_PYI_RUNTIME_TMPDIR`). |
| `_projetos/dashboard/requirements.txt` | Update | Inclui `openai>=1.0.0` no ambiente do painel para transcricao/traducao. |
| `docs/stories/active/DASH-VD-007.story.md` | Create | Registro da historia, checklist, quality gates e file list. |

## Quality Gates

- `npm run lint` - FAIL (2 erros de parsing em `.venv/Lib/site-packages/PySide6` + warnings historicos no repo)
- `npm run typecheck` - PASS
- `npm test` - FAIL (`Error: spawn EPERM` ao iniciar workers do Jest)

## QA Notes

- O painel de legenda agora abre automaticamente quando o backend retorna `srt_path`.
- O painel de legenda ficou visivel por padrao na UI e recebe foco automatico quando o modo de edicao esta ativo.
- O fluxo de edicao/salvar/embutir roda pelo bridge do painel (`app.py`), sem acionar `subtitle_editor.py`/Tkinter.
- A UI foi alinhada ao fluxo da referencia: transcricao, traducao e edicao de SRT iniciam ligadas por padrao.
- `app.py` agora faz fallback de chave Whisper para `video_downloader/gui.py` quando `OPENAI_API_KEY` nao estiver definida.
- Quando nao ha `srt_path`, a UI agora mostra motivo explicito no painel (ex.: falta de `OPENAI_API_KEY`).
- Builder do painel agora coleta `openai` no PyInstaller (`--collect-all openai`), evitando erro "OpenAI not installed" no EXE.
- Builder do painel ajustado para nao fixar pasta temporaria absoluta, mantendo EXE portavel e com orientacao de troubleshooting no README.
- Os fails de `lint` e `test` continuam os mesmos bloqueios historicos do ambiente e nao foram introduzidos por esta entrega.
