---
story_id: "DASH-VD-002"
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

# Story DASH-VD-002: Simplificar dashboard para abrir diretamente o Video Downloader

**Epic:** Dashboard Local - Expansão de Ferramentas  
**Story ID:** DASH-VD-002  
**Status:** Done  
**Type:** Feature  
**Lead:** @dev (Dex)  
**Repository:** _projetos/dashboard  
**Depends On:** DASH-VD-001

## Descrição

O item `Video Downloader` já existia na lista Tools, mas o dashboard ainda exibia as seções Tools, Runner e Snapshot e exigia seleção manual. Esta entrega eliminou todos os elementos auxiliares: o HTML agora só contém o cartão central com o botão “Executar Video Downloader”, o JavaScript dispara exclusivamente `run_tool("video-downloader")` e o README descreve que o painel funciona como um launcher direto que abre a interface CustomTkinter em um processo separado.

## Acceptance Criteria

1. O HTML do dashboard não mostra mais as seções Tools, Runner, Snapshot ou qualquer menu lateral; sobram apenas o card com instruções do Video Downloader e o botão de abertura.  
2. O JavaScript do painel não tenta renderizar listas de ferramentas, runner ou snapshot, apenas gerencia o botão “Abrir Video Downloader” e loga o resultado da execução.  
3. O README reflete a nova UI simplificada e explica que o botão “Executar Video Downloader” dispara a ferramenta em subprocesso.  
4. A história registra a perda dessas seções e o foco total na experiência de abrir a interface do downloader.

## Tasks / Subtasks

- [x] Reescrever `_projetos/dashboard/ui/index.html` para exibir apenas o cartão de execução direta.  
- [x] Substituir `_projetos/dashboard/ui/app.js` por uma versão que dispara somente `run_tool("video-downloader")` e registra o log no card.  
- [x] Atualizar `_projetos/dashboard/ui/styles.css` para um layout centrado e minimalista (card, botão, log).  
- [x] Documentar o fluxo simplificado no `_projetos/dashboard/README.md`.  
- [x] Executar `npm run lint`, `npm run typecheck` e `npm test`, registrando os resultados nesta história.

## File List

| File | Action | Notes |
| --- | --- | --- |
| `_projetos/dashboard/ui/index.html` | Update | Novo layout centrado com o cartão do Video Downloader e o botão de execução direta. |
| `_projetos/dashboard/ui/styles.css` | Update | Tema escuro minimalista, card centralizado e log simplificado. |
| `_projetos/dashboard/ui/app.js` | Update | Botão único dispara `run_tool("video-downloader")` via PyWebView e escreve mensagens no log. |
| `_projetos/dashboard/README.md` | Update | Documenta o launcher direto, a relação com `tools/registry.json` e o botão principal. |
| `docs/stories/active/DASH-VD-002.story.md` | Update | Registra a simplificação e os resultados dos quality gates. |

## Quality Gates

- `npm run lint` — FAIL (mesmos warnings históricos espalhados pelo core/testes e dois erros de parsing nos arquivos gerados do PySide6 dentro do `.venv/Lib/site-packages`; o mesmo comportamento já observado anteriormente).  
- `npm run typecheck` — PASS.  
- `npm test` — FAIL (`Error: spawn EPERM` ao criar workers do Jest no Windows).

## QA Notes

- `npm run lint` continua listando avisos antigos e os dois erros localizados em `TraceUtils.js` e `testlogger.js` sob o `.venv` (PySide6). Não foram gerados novos pontos diretamente ligados ao código alterado aqui.  
- `npm test` não conclui porque o Jest falha ao iniciar workers com `Error: spawn EPERM` antes de executar qualquer suíte; já era um bloqueio repetível neste ambiente Windows.  
