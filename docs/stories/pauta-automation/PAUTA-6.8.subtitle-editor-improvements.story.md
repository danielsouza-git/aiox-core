# Story PAUTA-6.8: Subtitle Editor Improvements — Auto-Embed, Background Strip, Live Preview

**Epic:** PAUTA-6 Video Downloader Migration
**Status:** Ready for Review
**Priority:** High
**Complexity:** Medium
**Estimated Effort:** 8h
**Dependencies:** Story 6.7 (DONE)

---

## Story

**Como** produtor do programa,
**Quero** que as legendas sejam automaticamente queimadas no video, com faixa de fundo visivel e preview em tempo real durante edicao,
**Para que** o video final fique pronto para uso sem etapas manuais extras, e a legenda seja legivel em qualquer cenario de fundo.

---

## Description

Tres melhorias no subtitle editor e pipeline de legendas:

1. **Auto-Embed**: Legendas sao automaticamente queimadas (burned-in) no video quando o usuario salva no editor. O botao "Salvar SRT" isolado deixa de existir — a acao padrao sempre gera o video com legendas embutidas. Dois arquivos .srt soltos no diretorio sem embed nao devem mais ocorrer.

2. **Background Strip**: Faixa semi-transparente atras do texto da legenda (opaque box). Usa `BorderStyle=3` no ASS ao inves de `BorderStyle=1` (outline only). Controle no editor com checkbox "Faixa de fundo" + color picker para cor da faixa.

3. **Live Preview**: Ao editar o texto de uma legenda no editor, o overlay no video atualiza em tempo real. Ao selecionar uma legenda na lista, o overlay mostra o texto mesmo que o video esteja pausado ou em outro ponto.

---

## Acceptance Criteria

### Task 1: Auto-Embed on Save

- [x] 1.1 Remover botao "Salvar SRT" do footer do `subtitle-editor.html`
- [x] 1.2 Botao "Salvar" (antigo "Salvar e Embutir") vira a acao principal e unica de save
- [x] 1.3 Ao clicar "Salvar", fluxo automatico: salvar SRT → gerar ASS → embed via FFmpeg → progresso exibido
- [x] 1.4 Apos embed, arquivos .srt e .ass permanecem no diretorio (para re-edicao futura) mas o video contem legendas queimadas
- [x] 1.5 Botao "Exportar SRT" (secundario, ghost style) permite salvar apenas o SRT sem embed, para casos de uso onde o usuario precisa do arquivo .srt isolado

### Task 2: Background Strip (Faixa de Fundo)

- [x] 2.1 Adicionar campo `background_color` ao dataclass `SubtitleStyle` em `srt_utils.py` (default: `&H80000000` — preto 50% transparente)
- [x] 2.2 Adicionar campo `border_style` ao dataclass `SubtitleStyle` (default: `3` — opaque box)
- [x] 2.3 Em `generate_ass()`, usar `BorderStyle={style.border_style}` e `BackColour={style.background_color}` na linha de estilo
- [x] 2.4 No `subtitle-editor.html`, adicionar checkbox "Faixa de fundo" no style panel (default: checked)
- [x] 2.5 No `subtitle-editor.html`, adicionar color picker "Cor da faixa" no style panel (default: preto)
- [x] 2.6 No `subtitle-editor.html`, adicionar slider "Opacidade da faixa" (0-100%, default: 50%)
- [x] 2.7 Atualizar overlay CSS do preview para mostrar background quando checkbox ativa: `background: rgba(r,g,b,opacity); padding: 4px 12px; border-radius: 4px`
- [x] 2.8 Passar `background_color` no `embedStyle` ao chamar `embed_subtitles_standalone()`

### Task 3: Live Preview no Editor

- [x] 3.1 Na funcao `onTextInput()`, apos atualizar `subtitles[idx].text`, verificar se `video.currentTime` esta dentro do range `[start_seconds, end_seconds]` da legenda editada — se sim, atualizar `overlay.textContent` imediatamente
- [x] 3.2 Ao clicar em uma legenda na lista (evento click no `.sub-entry`), alem de dar seek no video, mostrar o texto da legenda no overlay independente da posicao do video
- [x] 3.3 Criar funcao `updateOverlayForEntry(idx)` que atualiza overlay com texto, estilo e posicao da legenda selecionada
- [x] 3.4 O overlay de preview reflete TODOS os controles de estilo (cor, faixa, tamanho, posicao) em tempo real ao mover sliders/checkboxes

### Task 4: Testes

- [x] 4.1 Testes unitarios para `SubtitleStyle` com novos campos `background_color` e `border_style`
- [x] 4.2 Testes para `generate_ass()` verificando `BorderStyle=3` e `BackColour` correto no output ASS
- [x] 4.3 Testes para `generate_ass()` com `BorderStyle=1` quando background desabilitado
- [x] 4.4 Atualizar testes existentes que validam output ASS para incluir novos campos

---

## Technical Notes

### ASS Format — BorderStyle

```
BorderStyle=1  →  Outline only (atual)
BorderStyle=3  →  Opaque box (background strip)
```

Linha de estilo ASS atualizada:
```
Style: Default,Arial,21,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,3,2,0,2,10,10,20,1
```
O campo `BackColour` (&H80000000) controla cor e transparencia da faixa.

### Overlay CSS para Preview

```css
.subtitle-overlay.with-background {
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 4px;
}
```

### Live Preview — onTextInput Update

```javascript
function onTextInput(textarea) {
  const idx = parseInt(textarea.dataset.idx, 10);
  subtitles[idx].text = textarea.value;
  hasUnsavedChanges = true;
  // Live preview update
  updateOverlayForEntry(idx);
}
```

---

## File List

| Arquivo | Acao | Notas |
|---------|------|-------|
| `pauta-automation/ui/subtitle-editor.html` | MODIFY | Tasks 1, 2, 3 — botoes, style panel, live preview |
| `pauta-automation/src/processors/video_downloader/srt_utils.py` | MODIFY | Task 2 — SubtitleStyle + generate_ass() |
| `pauta-automation/src/gui/app.py` | MODIFY | Task 1 — embed_subtitles_standalone style params |
| `pauta-automation/tests/test_srt_utils.py` | MODIFY | Task 4 — novos testes |
| `docs/stories/pauta-automation/PAUTA-6.8.subtitle-editor-improvements.story.md` | CREATE | Esta story |

---

## QA Gate Criteria

- [ ] Todos os testes existentes passam (489+)
- [ ] Novos testes para BorderStyle/BackColour passam
- [ ] Ruff 0 issues
- [ ] Video final tem legendas queimadas (nao dependem de .srt externo)
- [ ] Faixa de fundo visivel atras da legenda no video final
- [ ] Editar texto no editor atualiza preview em tempo real
- [ ] Selecionar legenda mostra overlay mesmo com video pausado

---

## Out of Scope

- Mudar fonte (mantém Arial)
- Suporte a multiplas tracks de legenda
- Exportar para formatos alem de SRT/ASS
- Arrastar legendas na timeline (drag & drop)
