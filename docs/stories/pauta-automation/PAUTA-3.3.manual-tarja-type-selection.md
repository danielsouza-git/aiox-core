# Story PAUTA-3.3: Manual Tarja Type Selection in GUI

**Status:** Ready for Review

**Project:** Pauta Automation
**Epic:** Epic 3 - Geracao Automatica de Tarjas
**Story Number:** PAUTA-3.3

## Community Origin

(N/A — Internal story)

## Story

**As a** produtor do programa,
**I want** selecionar manualmente o tipo de conteudo da tarja (Giro/Cobertura/Mira/Superchats) na GUI,
**so that** o sistema use o template e configuracoes corretos conforme minha escolha, sem auto-detectar incorretamente.

## Acceptance Criteria

1. **GUI contém seletor de tipo:** A view Lower/Tarjas na interface (app.js + app.py) exibe radio buttons para selecionar o tipo de conteudo da tarja: "Giro de Noticias", "Cobertura Especial", "Na Mira do Marcos", "Superchats & Doacoes" (identico ao lower_novo39qr.py linhas 96-103).

2. **Auto-deteccao removida:** O metodo `_detect_tarja_type()` em `src/parser/instruction_classifier.py` (linhas 507, 516-517) NAO tenta auto-detectar "superchat"/"doacao" no texto do documento. A deteccao de SUPERCHATS e completamente removida do parser.

3. **Tipo vem da GUI:** O `tarja_processor.py` recebe o tipo de tarja selecionado pelo usuario na GUI (via parametro passado pelo PautaBridge), nao o tipo auto-detectado pelo parser.

4. **SUPERCHATS usa template especial:** Quando o usuario seleciona "Superchats & Doacoes":
   - Template: `superchats e doacoes.png` (linha 79 do lower_novo39qr.py)
   - `show_tipo=False` (nao renderiza label de tipo)
   - `max_width=1590` (largura reduzida para QR code, linha 57-59)
   - Output name default: "lt1" (linha 76)

5. **Outros tipos funcionam normalmente:** Tipos "Giro", "Cobertura", "Mira" continuam funcionando como antes, usando os templates e configuracoes existentes.

6. **Testes atualizados:** Testes em `tests/test_parser/test_instruction_classifier.py` que validavam a auto-deteccao de SUPERCHATS sao removidos ou modificados para refletir que tipo de tarja agora vem da GUI.

7. **Workflow completo:** Fluxo de ponta a ponta: usuario abre pauta → parser detecta tarjas → tarjas aparecem na view Lower → usuario seleciona tipo manualmente → clica processar → PNG gerado com template correto.

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Disabled
>
> CodeRabbit CLI is not enabled in `core-config.yaml`.
> Quality validation will use manual review process only.
> To enable, set `coderabbit_integration.enabled: true` in core-config.yaml

## Tasks / Subtasks

- [x] **Task 1: Remover auto-deteccao de SUPERCHATS do parser** (AC: 2)
  - [x] Editar `src/parser/instruction_classifier.py` linha 516-517
  - [x] Remover logica de deteccao de "superchat"/"doacao" do metodo `_detect_tarja_type()`
  - [x] Tipo de tarja retornado pelo parser deve ser apenas: GIRO, COBERTURA, MIRA (sem SUPERCHATS)

- [x] **Task 2: Adicionar seletor de tipo na GUI** (AC: 1)
  - [x] Editar `ui/app.js` para adicionar radio buttons de tipo na view Lower
  - [x] Adicionar HTML para radio buttons: Giro, Cobertura, Mira, Superchats
  - [x] Estilizar radio buttons seguindo design system (dark mode, colors navy/cyan)
  - [x] Adicionar listeners para capturar selecao do usuario

  - [x] Editar `src/gui/app.py` (PautaBridge)
  - [x] Adicionar metodo `set_tarja_type(tipo)` no PautaBridge
  - [x] Expor metodo via `js_api` para comunicacao Python↔JS
  - [x] Armazenar tipo selecionado por tarja (dict ou atributo)

- [x] **Task 3: Passar tipo selecionado para tarja_processor** (AC: 3)
  - [x] Editar `src/processors/tarja_processor.py` — nenhuma modificacao necessaria (ja le instruction.tarja_type)
  - [x] Verificar fluxo: GUI -> set_tarja_type -> instruction.tarja_type -> TarjaProcessor.process() — OK
  - [x] Tipo vem da GUI via PautaBridge.set_tarja_type() que atualiza instruction.tarja_type
  - [x] Verificar que `TarjaType.SUPERCHATS` ja existe em `src/core/models.py` (enum) — existe na linha 39

- [x] **Task 4: Implementar logica especial para SUPERCHATS** (AC: 4)
  - [x] No `tarja_processor.py`, quando `tipo_selecionado == TarjaType.SUPERCHATS`:
    - [x] Usar template `superchats e doacoes.png` (linha 255: config.paths.tarja_template_superchats)
    - [x] Configurar `show_tipo=False` (linha 256)
    - [x] Configurar `max_width=1590` (linha 257: MAX_WIDTH_QR)
    - [x] Se output name nao fornecido, usar default "lt1" (linha 359: _auto_name retorna lt{counter})
  - [x] Garantir que outros tipos (GIRO, COBERTURA, MIRA) usam logica existente — OK, linha 258-259

- [x] **Task 5: Atualizar testes** (AC: 6)
  - [x] Editar `tests/test_parser/test_instruction_classifier.py`
  - [x] Nenhum teste de auto-deteccao de SUPERCHATS existia para remover
  - [x] Adicionados 2 testes que confirmam SUPERCHATS NAO e auto-detectado
  - [x] test_tarja_type_superchats_not_auto_detected: bloco com "superchat" no titulo -> COBERTURA
  - [x] test_tarja_type_superchat_in_responsible_not_detected: "superchat" no responsible -> nao SUPERCHATS
  - [x] Todos 38 testes passam (pytest + runner standalone)

- [ ] **Task 6: Teste de workflow completo** (AC: 7)
  - [ ] Teste manual end-to-end (requer execucao do app com pywebview):
    1. Abrir pauta no app
    2. Verificar que tarjas aparecem na view Lower
    3. Selecionar tipo "Superchats & Doacoes" nos radio buttons
    4. Clicar processar
    5. Confirmar PNG gerado com template correto (superchats e doacoes.png)
    6. Confirmar max_width=1590 aplicado
    7. Confirmar label de tipo NAO renderizado

## Dev Notes

### Referencia: lower_novo39qr.py

O comportamento correto esta implementado no app legado `lower_novo39qr.py`:

**Radio buttons de tipo** (linhas 96-103):
```python
tk.Radiobutton(tipo_frame, text="Giro de Notícias", variable=self.epoch_tipo_conteudo,
              value="giro", command=lambda: self.update_tarja_text("epoch"), font=("TkDefaultFont", 12)).pack(side=tk.LEFT, padx=(0, 20))
tk.Radiobutton(tipo_frame, text="Cobertura Especial", variable=self.epoch_tipo_conteudo,
              value="cobertura", command=lambda: self.update_tarja_text("epoch"), font=("TkDefaultFont", 12)).pack(side=tk.LEFT, padx=(0, 20))
tk.Radiobutton(tipo_frame, text="Na Mira do Marcos", variable=self.epoch_tipo_conteudo,
              value="mira", command=lambda: self.update_tarja_text("epoch"), font=("TkDefaultFont", 12)).pack(side=tk.LEFT, padx=(0, 20))
tk.Radiobutton(tipo_frame, text="Superchats & Doações", variable=self.epoch_tipo_conteudo,
              value="superchats", command=lambda: self.update_tarja_text("epoch"), font=("TkDefaultFont", 12)).pack(side=tk.LEFT)
```

**Template SUPERCHATS** (linha 79):
```python
self.epoch_qr_image_path = tk.StringVar(
    value="D:/EPOCH/Epoch Times/epoch news/assets/superchats e doacoes.png"
)
```

**max_width reduzido para SUPERCHATS** (linhas 57-59):
```python
self.max_width_epoch_qr = 1590 # Limite reduzido com QR Code ativo no Epoch News
```

**Logica de renderizacao** (referencias no codigo existente):
- Quando `tipo_conteudo == "superchats"`: usa `epoch_qr_image_path`, `max_width_epoch_qr`, `show_tipo=False`
- Linhas 242-243: deteccao do tipo selecionado
- Linhas 271-272: aplicacao de `max_width` baseado no tipo

### Arquivos Relevantes

| Arquivo | Modificacao | Notas |
|---------|------------|-------|
| `src/parser/instruction_classifier.py` | Remover auto-deteccao SUPERCHATS | Linhas 507, 516-517 |
| `src/processors/tarja_processor.py` | Receber tipo da GUI | Ja suporta TarjaType.SUPERCHATS |
| `src/gui/app.py` | Adicionar metodo `set_tarja_type()` | PautaBridge |
| `ui/app.js` | Adicionar radio buttons na view Lower | Frontend |
| `ui/index.html` | Layout para radio buttons | Se necessario |
| `ui/styles.css` | Estilo dos radio buttons | Design system AIOS |
| `src/core/models.py` | Enum TarjaType | Ja existe SUPERCHATS |
| `src/core/orchestrator.py` | Passar tipo selecionado | Se necessario |
| `tests/test_parser/test_instruction_classifier.py` | Remover/atualizar testes | Auto-deteccao removida |

### Problema Atual

No pauta-automation, o `instruction_classifier.py` (linha 516) tenta **auto-detectar** "superchat"/"doacao" no texto do documento Google Docs para classificar o tipo de tarja. Isso esta **ERRADO** porque:

1. Tipo SUPERCHATS nao e detectavel apenas por palavras-chave no texto
2. Usuario pode querer criar tarja de superchat sem essas palavras no doc
3. Auto-deteccao pode classificar erroneamente outras tarjas como SUPERCHATS
4. No app legado (lower_novo39qr.py), tipo e sempre **selecao manual do usuario**

### Solucao

1. Remover tentativa de auto-detectar SUPERCHATS do parser
2. Adicionar radio buttons na GUI (igual lower_novo39qr.py)
3. Usuario seleciona tipo manualmente
4. Tipo selecionado e passado para tarja_processor via PautaBridge
5. tarja_processor aplica configuracoes corretas baseado no tipo recebido

### Design System Reference

Reutilizar design system do AIOS Dashboard (`_projetos/dashboard/ui/styles.css`):
- Dark mode: `--bg-deep: #09111d`, `--brand-cyan: #1ec8ff`
- Radio buttons: border-radius 50%, hover effect, selected state com fill cyan
- Labels: Tipografia Bahnschrift/Segoe UI Variable, 14px
- Spacing: padding 8px entre radio buttons

### Testing

**Unit tests:**
- `test_instruction_classifier.py`: Verificar que SUPERCHATS NAO e retornado pelo parser
- `test_tarja_processor.py`: Verificar que tipo SUPERCHATS usa template correto, max_width=1590, show_tipo=False

**Integration tests:**
- GUI → PautaBridge → tarja_processor: tipo selecionado chega corretamente
- Workflow completo: pauta → Lower view → selecao manual → PNG gerado

**Manual tests:**
- Abrir pauta real, processar tarja SUPERCHATS, confirmar PNG correto
- Testar todos os 4 tipos: Giro, Cobertura, Mira, Superchats

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-25 | 1.0 | Story criada — Manual tarja type selection | River (SM) |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (Dex)

### Debug Log References

- All 38 tests pass (pytest --noconftest + standalone runner)
- ruff lint: All checks passed on modified files
- No pre-existing test covered SUPERCHATS auto-detection, so no tests were removed

### Completion Notes List

1. Removed SUPERCHATS auto-detection from `_detect_tarja_type()` in instruction_classifier.py (2 lines removed: line 516-517)
2. Added "Superchats & Doacoes" option to both `<select>` dropdowns in edit panels (tab + view)
3. Added global tarja type radio buttons in Lower tab panel and standalone Lower view (HTML + CSS + JS)
4. Added `set_tarja_type(tipo)` method to PautaBridge with `_selected_tarja_type` attribute
5. JS `onGlobalTarjaTypeChange()` syncs both radio groups, updates all tarja items, calls backend
6. tarja_processor.py already handles SUPERCHATS correctly (template, show_tipo=False, max_width=1590)
7. Orchestrator flow unchanged — type flows via instruction.tarja_type from GUI to processor
8. Added 2 new tests confirming SUPERCHATS is NOT auto-detected by parser
9. Task 6 (manual E2E test) requires running the app with pywebview — left unchecked

### File List

| File | Action | Notes |
|------|--------|-------|
| `pauta-automation/src/parser/instruction_classifier.py` | Modified | Removed SUPERCHATS auto-detection from `_detect_tarja_type()` |
| `pauta-automation/src/gui/app.py` | Modified | Added `set_tarja_type()` method, `_selected_tarja_type` attribute |
| `pauta-automation/ui/index.html` | Modified | Added radio buttons (2 locations), "superchats" option in selects (2 locations) |
| `pauta-automation/ui/styles.css` | Modified | Added `.tarja-type-selector` styles (dark mode, brand-cyan accent) |
| `pauta-automation/ui/app.js` | Modified | Added `onGlobalTarjaTypeChange()`, `globalTarjaType` state |
| `pauta-automation/tests/test_parser/test_instruction_classifier.py` | Modified | Added 2 tests for SUPERCHATS non-detection |
| `docs/stories/pauta-automation/PAUTA-3.3.manual-tarja-type-selection.md` | Modified | Updated task checkboxes, Dev Agent Record |

## QA Results

### Review Date: 2026-03-25

### Reviewed By: Quinn (Test Architect)

### AC Traceability

| AC | Status | Evidence |
|----|--------|----------|
| AC-1: GUI contains type selector | PASS | `ui/index.html` lines 112-130 (tab panel radio group `tarjaTypeGlobal` with 4 options: giro, cobertura, mira, superchats) and lines 362-380 (standalone view radio group `tarjaTypeView` with same 4 options). Both edit panels (`lower-edit` line 160-165, `lower-view-edit` lines 413-418) also have `<select>` with all 4 type options including superchats. |
| AC-2: Auto-detection removed | PASS | `src/parser/instruction_classifier.py` `_detect_tarja_type()` (lines 504-522) contains NO reference to "superchat" or "doacao" in its detection logic. Function only detects MIRA (by "marcos"/"mira"), GIRO (by "giro"/"manchetes"), and defaults to COBERTURA. Docstring at line 507-508 explicitly documents this design decision. Grep for "superchat" in the file returns only the docstring comment. |
| AC-3: Type comes from GUI | PASS | `src/gui/app.py` `set_tarja_type()` method (lines 198-224) receives type string from JS, validates against `TarjaType` enum, stores in `_selected_tarja_type`, and updates all parsed tarja instructions. JS `onGlobalTarjaTypeChange()` (app.js lines 1046-1072) calls both `update_instruction()` per-item AND `set_tarja_type()` on the backend. |
| AC-4: SUPERCHATS uses special template | PASS | `src/processors/tarja_processor.py` `_get_tarja_config()` (lines 245-261): when `tarja_type == TarjaType.SUPERCHATS`, sets `template_path = config.paths.tarja_template_superchats`, `show_tipo = False`, `max_width = MAX_WIDTH_QR (1590)`. `_auto_name()` (lines 354-359) returns `lt{counter}` for non-giro-header tarjas (matching "lt1" default). |
| AC-5: Other types work normally | PASS | `_get_tarja_config()` else branch (line 258-259) uses `tarja_template_epoch` with default `show_tipo=True` and `max_width=1850` for GIRO/COBERTURA/MIRA. No changes to these code paths. |
| AC-6: Tests updated | PASS | `tests/test_parser/test_instruction_classifier.py` has 2 new tests: `test_tarja_type_superchats_not_auto_detected` (lines 356-376) verifies block titled "Superchats e Doacoes" returns COBERTURA not SUPERCHATS; `test_tarja_type_superchat_in_responsible_not_detected` (lines 379-389) verifies "superchat" in responsible field does not trigger SUPERCHATS. Both pass. |
| AC-7: Workflow complete | PARTIAL | Code path verified: parse -> GUI radio buttons -> `onGlobalTarjaTypeChange` -> `set_tarja_type` -> updates `instruction.tarja_type` -> `TarjaProcessor.process()` reads `instruction.tarja_type`. Task 6 (manual E2E with pywebview) correctly marked as unchecked in story -- requires running the actual desktop app. |

### Test Results

- **pytest**: 38/38 passed (0.50s, `--noconftest` mode due to PIL dependency on CI)
- **ruff lint**: All checks passed (0 issues on `src/` and `tests/`)
- **TarjaType enum validation**: All 4 values (giro, cobertura, mira, superchats) accepted; invalid values raise ValueError

### Code Quality Assessment

**Strengths:**
- Clean separation of concerns: parser detects type from context, GUI overrides with user selection
- `set_tarja_type()` properly validates input against the TarjaType enum with clear error response
- Both radio groups in HTML (tab + standalone view) sync correctly via `onGlobalTarjaTypeChange()`
- CSS styles follow the project design system (dark mode, brand-cyan accent)
- Optimistic update pattern in JS with rollback on backend error (saveTarjaEdit, saveTarjaViewEdit)

**Observations (non-blocking):**
- `onGlobalTarjaTypeChange()` calls `update_instruction()` for each tarja item individually AND `set_tarja_type()` globally. The global call also updates all tarjas. This is slightly redundant but not harmful -- the global call ensures consistency even if individual calls fail.
- Task 6 (manual E2E test) is correctly left unchecked as it requires pywebview desktop runtime, which cannot be executed in CI/review environment.

### Gate Status

Gate: PASS -> docs/qa/gates/pauta-3.3-manual-tarja-type-selection.yml
