# Pauta Automation System — Architecture Document

**Versao:** 2.0
**Data:** 2026-03-25
**Autor:** Aria (Architect Agent)
**PRD Referencia:** `docs/prd-pauta-automation.md` (v1.1)

---

## 1. Visao Geral da Arquitetura

### Principio Arquitetural

**Pipeline Unidirecional com Modulos Independentes + pywebview Bridge Pattern**

```
Google Docs --> Parser --> Instruction Queue --> Processors --> Output Files
                                                  |-- SlideProcessor  --> Google Slides
                                                  |-- TarjaProcessor  --> PNG files
                                                  +-- VideoProcessor  --> MP4 files

GUI (HTML/CSS/JS)  <-- pywebview bridge (PautaBridge) -->  Python Backend
     |                     |                                    |
     polling               js_api                           EventBus
```

Cada processor e um modulo independente que recebe uma instrucao tipada e produz um output. Falha em um processor nao afeta os demais (NFR2, NFR6). A GUI comunica-se com o backend Python exclusivamente via a bridge `PautaBridge` exposta como `js_api` do pywebview.

### Decisoes Arquiteturais Chave

| Decisao | Escolha | Rationale |
|---------|---------|-----------|
| Concorrencia | Threading (ThreadPoolExecutor, max_workers=3) | GUI responsiva + processamento paralelo de slides/tarjas/videos. Processors sao predominantemente I/O bound (API calls, FFmpeg, downloads) |
| State Management | Dataclasses + Enum | Simples, tipado, sem dependencia externa |
| Config | JSON file (config.json) | Ja usado nos apps existentes do usuario. Paths relativos ancorados no diretorio do config |
| GUI Framework | pywebview >= 4.0 (EdgeChromium/CEF) | Interface moderna HTML/CSS/JS, dark mode, design system AIOS Dashboard. Substitui CustomTkinter da v1.0 |
| Frontend | Vanilla JS SPA | Sem framework JS externo — navegacao por sidebar, routing interno, polling de eventos |
| Design System | AIOS Dashboard (dark mode) | CSS Grid, cores navy/cyan/blue, componentes consistentes |
| Bridge Pattern | PautaBridge (js_api) | Classe Python exposta ao JS via pywebview, metodos chamados assincronamente |
| Packaging | PyInstaller --onefile (.exe) | Distribuicao simplificada — um unico executavel de ~48 MB |

---

## 2. Estrutura de Modulos

```
pauta-automation/
|-- main.py                          # Entry point - lanca GUI pywebview
|-- config.json                      # Configuracoes do usuario (GITIGNORED)
|-- config.example.json              # Template de configuracao
|-- requirements.txt                 # 10 dependencias Python
|-- spec/
|   +-- Pauta-Automation.spec        # PyInstaller --onefile spec
|-- tools/
|   +-- build_exe.py                 # Script de build do .exe
|
|-- ui/                              # Frontend (SPA) — ~2500 LOC total
|   |-- index.html (~430)            # Layout com sidebar + 5 views (Home, Lower, Slides, Videos, Settings)
|   |-- styles.css (538)             # Dark mode CSS, AIOS Dashboard design system
|   +-- app.js (~950)                # Bridge JS, routing, event polling, view rendering
|
|-- src/
|   |-- __init__.py
|   |
|   |-- core/                        # Nucleo — sem dependencia de GUI
|   |   |-- __init__.py
|   |   |-- models.py (121)          # Dataclasses e Enums (Instruction, PautaResult, NewsBlock)
|   |   |-- config.py (147)          # AppConfig, load/save config.json, path resolution
|   |   |-- events.py (42)           # EventBus thread-safe (Queue — processors --> GUI)
|   |   +-- orchestrator.py (218)    # ThreadPoolExecutor, 3 processors em paralelo, cancelamento
|   |
|   |-- parser/                      # Parser de pauta (Google Docs --> Instruction[])
|   |   |-- __init__.py
|   |   |-- pauta_parser.py (~80)    # Fachada: URL ou texto --> PautaResult
|   |   |-- structure_parser.py (195)# Extrai blocos de noticias (delimitadores, headings)
|   |   +-- instruction_classifier.py (601)  # Classifica instrucoes por tipo (regex patterns)
|   |
|   |-- extractors/                  # Extracao de conteudo externo
|   |   |-- __init__.py
|   |   |-- social_media.py (382)    # X, Truth, Instagram, Telegram (scraping/oEmbed)
|   |   +-- news_extractor.py (476)  # Titulo + logo de artigos de noticia
|   |
|   |-- processors/                  # Processors de cada tipo de output
|   |   |-- __init__.py
|   |   |-- base.py                  # Interface base com callback de progresso
|   |   |-- slide_processor.py (1025)# Gera 5 tipos de slides via Google Slides API
|   |   |-- tarja_processor.py (411) # Gera PNGs de tarja com Pillow
|   |   +-- video_processor.py (485) # Wrapper do Video Downloader externo
|   |
|   |-- google_api/                  # Integracao com Google APIs
|   |   |-- __init__.py
|   |   |-- auth.py (92)             # OAuth2 + API key dual auth
|   |   |-- docs_client.py (149)     # Google Docs read operations
|   |   |-- slides_client.py (346)   # Google Slides write (duplicate, replace, reorder)
|   |   +-- drive_client.py          # Google Drive operations
|   |
|   +-- gui/                         # Bridge Python-JS para pywebview
|       |-- __init__.py
|       +-- app.py (332)             # PautaBridge (js_api) + create_app()
|
|-- tests/
|   |-- __init__.py
|   |-- test_tarja.py                # Testes unitarios do TarjaProcessor
|   |-- test_tarja_integration.py    # Testes de integracao com imagens reais
|   +-- test_parser/
|       |-- __init__.py
|       |-- test_instruction_classifier.py  # 15+ testes do classifier
|       +-- test_structure_parser.py        # 7+ testes do structure parser
|
|-- assets/
|   +-- logos/                       # Logos de plataformas (X, Truth, Instagram, Telegram)
|
+-- config/
    |-- credentials.json             # Google OAuth2 credentials
    +-- token.json                   # Token OAuth2 persistido
```

**Total:** ~5000+ LOC Python + ~2500 LOC frontend (HTML/CSS/JS)

---

## 3. Modelos de Dados (models.py)

```python
# Enums centrais
class InstructionType(Enum):
    SLIDE_POST = "slide_post"            # Tipo 1: Postagem
    SLIDE_NEWS_WITH_TEXT = "slide_news_text"  # Tipo 2: Noticia COM texto
    SLIDE_NEWS_NO_TEXT = "slide_news"     # Tipo 3: Noticia SEM texto
    SLIDE_FULLSCREEN = "slide_full"      # Tipo 4: Fullscreen
    SLIDE_PARTIAL = "slide_partial"      # Tipo 5: Parcial/Multiplas
    TARJA = "tarja"
    VIDEO_SUBTITLE = "video_sub"         # Video com legenda
    VIDEO_ONLY = "video_only"            # Video sem legenda

class ProcessingStatus(Enum):
    PENDING | PROCESSING | COMPLETED | ERROR

class Platform(Enum):
    X | TRUTH | INSTAGRAM | TELEGRAM | UNKNOWN

class TarjaType(Enum):
    GIRO | COBERTURA | MIRA


# Dataclasses principais
@dataclass
class Instruction:
    """Unidade atomica de trabalho extraida da pauta."""
    type: InstructionType
    news_block: str
    order: int
    id: str                              # Auto-gerado (uuid[:8])
    status: ProcessingStatus
    # Campos opcionais por tipo: url, urls, text, translated_text,
    # timecode, clips, merge, tarja_title, tarja_subtitle, tarja_type,
    # platform, enabled

@dataclass
class NewsBlock:
    """Bloco de noticia extraido da pauta."""
    title: str
    responsible: Optional[str]
    raw_text: str
    instructions: list[Instruction]

@dataclass
class PautaResult:
    """Resultado completo do parsing da pauta."""
    doc_title: str
    news_blocks: list[NewsBlock]
    # Property: instructions -> todas as instrucoes ordenadas por 'order'

@dataclass
class PostContent:
    """Conteudo extraido de postagem de rede social."""
    profile_image_url, handle, display_name, text, platform, platform_logo_path

@dataclass
class NewsContent:
    """Conteudo extraido de artigo de noticia."""
    title, source_name, logo_url, logo_path
```

---

## 4. Fluxo de Dados

### 4.1 Pipeline Principal

```
[1] INPUT
    Usuario cola link do Google Docs (ou texto) na Home
         |
[2] PARSE (PautaBridge.parse_url / parse_text)
    google_api/docs_client.py  -->  Texto bruto com formatacao
    parser/structure_parser.py -->  Lista de NewsBlock
    parser/instruction_classifier.py  -->  Instructions tipadas dentro de cada NewsBlock
    parser/pauta_parser.py     -->  PautaResult (fachada)
         |
    PautaBridge serializa resultado --> JSON --> app.js
         |
[3] DISTRIBUTE (app.js - onParseComplete)
    Frontend distribui items nas views:
    |-- Home: resumo geral + tabs (Todos/Lower/Slides/Videos)
    |-- Lower view: tarjas com checkboxes, edicao inline
    |-- Slides view: slides com badges por tipo
    +-- Videos view: videos com timecodes
    Badges na sidebar atualizados com contagens
         |
[4] REVIEW
    Usuario pode: marcar/desmarcar items, editar tarjas, processar por secao ou tudo
         |
[5] PROCESS (PautaBridge.start_processing --> Orchestrator)
    Thread separada (daemon) com ThreadPoolExecutor(max_workers=3):
    |-- Thread 1: SlideProcessor (lazy init) --> Google Slides API
    |-- Thread 2: TarjaProcessor --> Pillow --> PNGs no Desktop
    +-- Thread 3: VideoProcessor --> Video Downloader --> MP4s no Desktop
         |
    Cada processor emite eventos via EventBus (Queue thread-safe)
         |
[6] POLL (app.js - setInterval 500ms)
    Frontend chama PautaBridge.poll_events() a cada 500ms
    Recebe eventos: PROGRESS, COMPLETED, ERROR, ALL_DONE
    Atualiza status em 3 niveis: progress panel, section tabs, standalone views
         |
[7] OUTPUT
    Resumo final: X slides criados, Y tarjas geradas, Z videos processados
    Itens com erro podem ser reprocessados individualmente
```

### 4.2 Comunicacao GUI <--> Backend (Bridge Pattern)

```
+---------------------+          pywebview           +---------------------+
|    Frontend (JS)    |  <========================>  |   Backend (Python)  |
+---------------------+          js_api              +---------------------+
|                     |                              |                     |
| window.pywebview.   |   --- parse_url(url) --->    | PautaBridge         |
|   api.parse_url()   |   <-- {status, items[]} --   |   .parse_url()      |
|                     |                              |                     |
| api.start_processing|   --- start_processing() ->  |   .start_processing |
|   (ids[])           |   <-- {status: "ok"} ---     |   (ids[])           |
|                     |                              |                     |
| setInterval(500ms)  |   --- poll_events() ----->   |   .poll_events()    |
|   api.poll_events() |   <-- [{type, id, ...}] --   |   EventBus.poll()   |
|                     |                              |                     |
| api.get_config()    |   --- get/save_config() -->  |   .get_config()     |
| api.save_config()   |   <-- {status, data} -----   |   .save_config()    |
|                     |                              |                     |
| api.update_instruction| --- update_instruction() -> |   .update_instruction|
| api.retry_item()    |   --- retry_item() -------->  |   .retry_item()     |
| api.cancel_processing| --- cancel_processing() ->  |   .cancel()         |
| api.browse_file()   |   --- browse_file() ------> |   .browse_file()    |
| api.browse_directory|   --- browse_directory() --> |   .browse_directory()|
+---------------------+                              +---------------------+
```

### 4.3 Fluxo do Orchestrator (detalhado)

```
Orchestrator.process_all(instructions[])
    |
    |-- Agrupa por tipo (respeita ENABLED_PROCESSORS toggle):
    |   slides = [i for i if type starts with "slide_"]
    |   tarjas = [i for i if type == TARJA]
    |   videos = [i for i if type starts with "video_"]
    |
    |-- ThreadPoolExecutor(max_workers=3):
    |   |-- Future 1: _process_slides_batch(slides)
    |   |       |-- Lazy init SlideProcessor (auth Google APIs)
    |   |       +-- _process_batch(slide_processor, slides)
    |   |
    |   |-- Future 2: _process_batch(tarja_processor, tarjas)
    |   +-- Future 3: _process_batch(video_processor, videos)
    |
    |-- Para cada instrucao em cada batch:
    |   |-- Verifica _cancelled flag
    |   |-- status = PROCESSING, emit PROGRESS(0.0)
    |   |-- processor.process(instruction, on_progress_callback)
    |   |-- status = COMPLETED, emit COMPLETED
    |   +-- Excecao: status = ERROR, emit ERROR, continua proximo item
    |
    +-- emit ALL_DONE com contagem final
```

---

## 5. Arquitetura da GUI (pywebview + SPA)

### 5.1 Camada Python (PautaBridge)

O arquivo `src/gui/app.py` define a classe `PautaBridge` que serve como bridge entre Python e JavaScript:

```python
class PautaBridge:
    """Expoe metodos Python ao JavaScript via pywebview js_api."""

    # Metodos expostos ao JS:
    # - parse_url(url) / parse_text(text) -> dict
    # - start_processing(ids[]) -> dict
    # - poll_events() -> list[dict]
    # - cancel_processing() -> dict
    # - retry_item(id) -> dict
    # - update_instruction(id, updates) -> dict
    # - get_config() / save_config(dict) -> dict
    # - browse_file(types) / browse_directory() -> str | None

def create_app():
    # Resolve UI path (frozen vs source)
    # Cria window pywebview com js_api=bridge
    # Titulo: "Pauta Automation -- Epoch News"
    # Tamanho: 1100x750, min 900x600
```

**Detalhes de path resolution no PyInstaller:**
- Em modo frozen (`sys.frozen`): `base_dir = Path(sys._MEIPASS)`
- Em modo source: `base_dir = Path(__file__).parent.parent.parent` (raiz do projeto)
- UI sempre em `base_dir / "ui" / "index.html"`

### 5.2 Camada Frontend (HTML/CSS/JS)

**Layout (index.html):**
- CSS Grid: sidebar fixa (258px) + area de conteudo flexivel (1fr)
- 5 views SPA: Home, Lower, Slides, Videos, Settings
- Sidebar com badges dinamicos que mostram contagem de itens por tipo
- Dark mode com design system AIOS Dashboard

**Views:**

| View | Conteudo | Funcionalidades |
|------|----------|-----------------|
| Home | Input URL/texto, resumo geral, tabs (Todos/Lower/Slides/Videos), progress panel | Parsear, checkboxes, processar tudo, barra de progresso global |
| Lower | Lista de tarjas | Checkboxes, edicao inline (titulo/subtitulo/tipo), processar por secao |
| Slides | Lista de slides com badges por tipo | Checkboxes, summary por tipo (Post/Noticia+/Noticia/Full/Parcial), processar por secao |
| Videos | Lista de videos com timecodes | Checkboxes, badges (Com/Sem Legenda), processar por secao |
| Settings | Formularios de configuracao | Google APIs, OpenAI, paths, fontes, templates, video quality |

**Navegacao (app.js):**
- `showView(viewId)` — troca view ativa (CSS class toggle)
- `showTab(tabId)` — troca tab dentro da Home
- Event listeners nos botoes da sidebar

**Polling de eventos:**
- `setInterval` a cada 500ms chama `api().poll_events()`
- Eventos atualizam status em 3 niveis: progress panel, section tabs na Home, standalone views
- `handleEvent(event)` — dispatcher central que atualiza DOM conforme tipo do evento

**Sincronizacao bidirecional:**
- Checkboxes sincronizam entre Home tabs, section tabs e standalone views
- Select all funciona em todos os niveis (global, por secao, por view)

### 5.3 Design System

```
Cores:
  --bg-deep: #09111d (fundo principal)
  --brand-cyan: #1ec8ff (destaques, items ativos)
  --brand-blue: #1f6bff (botoes primarios)
  --success: #36d399 (verde — concluido)
  --danger: #fb7185 (rosa — erro)
  --text-soft: rgba(255,255,255,0.6)

Tipografia:
  Bahnschrift / Segoe UI Variable (UI geral)
  Trebuchet MS (headings)

Componentes:
  Botoes: border-radius 12px
  Cards: padding 14-16px, background semi-transparente
  Sidebar: background gradient escuro, borda direita cyan
  Transicoes: 220ms ease
  Status badges: verde/rosa/cyan conforme estado
```

---

## 6. Integracao com Google APIs

### 6.1 Autenticacao (auth.py)

Suporta dual auth: OAuth2 (para operacoes que requerem consent) e API Key (para leitura simples).

```python
# Escopos necessarios:
SCOPES = [
    "https://www.googleapis.com/auth/documents.readonly",   # Ler Google Docs
    "https://www.googleapis.com/auth/presentations",         # Ler/Escrever Slides
    "https://www.googleapis.com/auth/drive.readonly",        # Acessar arquivos no Drive
]

# Fluxo:
# 1. Carrega credentials.json (OAuth2 client) ou usa API key
# 2. Tenta carregar token.json (token persistido)
# 3. Se token expirado: renova automaticamente
# 4. Se token invalido ou inexistente: abre browser para OAuth consent
# 5. Persiste token renovado em token.json

# Funcoes: build_docs_service(), build_slides_service(), build_drive_service()
```

### 6.2 Google Docs Client (docs_client.py)

```python
class DocsClient:
    def get_document_content(doc_id: str) -> dict:
        """Retorna documento completo com estrutura de elementos."""
        # Usa documents().get() com includeTabsContent=True
        # Preserva: formatacao (bold, italic), links, headings
```

### 6.3 Google Slides Client (slides_client.py)

```python
class SlidesClient:
    def duplicate_slide(presentation_id, slide_index) -> str
    def update_text(presentation_id, slide_id, placeholder_id, new_text, font_size=None)
    def insert_image(presentation_id, slide_id, placeholder_id, image_url)
    def reorder_slides(presentation_id, slide_ids, new_order)
    def delete_template_slides(presentation_id, template_slide_ids)
```

### 6.4 Drive Client (drive_client.py)

```python
class DriveClient:
    # Operacoes de copia e acesso a arquivos no Google Drive
    # Usado pelo SlideProcessor para duplicar template de apresentacao
```

### 6.5 Estrategia de Placeholders

1. Template no Google Slides tem 5 slides (um por tipo) com placeholders nomeados
2. Em runtime: duplicar o slide do tipo correto, substituir conteudo nos placeholders
3. Apos gerar todos os slides: remover os slides template originais

---

## 7. Sistema de Eventos e Concorrencia

### 7.1 Modelo de Concorrencia

```
Main Thread (pywebview GUI)
    |
    |-- Worker Thread (daemon=True, iniciado por PautaBridge.start_processing)
    |   |
    |   +-- ThreadPoolExecutor (max_workers=3)
    |       |-- Worker 1: Slides (I/O bound — Google APIs)
    |       |-- Worker 2: Tarjas (CPU bound — Pillow)
    |       +-- Worker 3: Videos (I/O bound — FFmpeg + download)
    |
    +-- Event Queue (Queue — thread-safe)
        JS polls via PautaBridge.poll_events() a cada 500ms
```

**Por que Threading e nao Multiprocessing:**
- pywebview requer que o window rode na main thread
- Os processors sao predominantemente I/O bound (API calls, FFmpeg, downloads)
- Threading com GIL e suficiente para este caso de uso
- Queue do Python e thread-safe nativamente

### 7.2 Sistema de Eventos (events.py)

```python
class EventType(Enum):
    PROGRESS = "progress"      # Item em andamento (com valor 0.0-1.0)
    COMPLETED = "completed"    # Item concluido (com output_path)
    ERROR = "error"            # Item com erro (com message)
    ALL_DONE = "all_done"      # Todos os itens processados

@dataclass
class ProcessingEvent:
    type: EventType
    instruction_id: str
    message: Optional[str]
    progress: Optional[float]  # 0.0 a 1.0
    output_path: Optional[str]

class EventBus:
    """Fila thread-safe para comunicacao processors --> GUI."""
    _queue: Queue[ProcessingEvent]
    emit(event)       # Chamado pelos processors (worker threads)
    poll() -> list     # Chamado pelo PautaBridge (main thread, via JS polling)
```

### 7.3 Cancelamento

O Orchestrator suporta cancelamento via flag `_cancelled`:
- `PautaBridge.cancel_processing()` chama `orchestrator.cancel()`
- Antes de processar cada item, o batch verifica a flag
- Items cancelados recebem status ERROR com mensagem "Cancelado pelo usuario"

---

## 8. Processors

### 8.1 SlideProcessor (slide_processor.py — 1025 linhas)

Gera slides automaticamente no Google Slides usando a API. Suporta 5 tipos de template:

| Tipo | Descricao | Dados Necessarios |
|------|-----------|-------------------|
| 1 (Postagem) | Post de rede social | foto_perfil, handle, texto, platform_logo |
| 2 (Noticia COM texto) | Artigo com traducao | logo_veiculo, titulo, texto_traduzido |
| 3 (Noticia SEM texto) | Artigo sem traducao | logo_veiculo, titulo |
| 4 (Fullscreen) | Imagem 100% | imagem |
| 5 (Parcial) | Multiplas imagens | imagens[] |

**Dependencias:**
- SlidesClient (Google Slides API)
- DriveClient (para duplicar template)
- Extractors (social_media.py, news_extractor.py)

**Inicializacao lazy:** Carregado sob demanda no Orchestrator para evitar auth desnecessaria se nenhum slide precisar ser processado.

### 8.2 TarjaProcessor (tarja_processor.py — 411 linhas)

Gera PNGs de lower thirds usando Pillow. Reutiliza a logica de renderizacao do app de tarja existente.

**Configuracoes por tipo:**

| Propriedade | Epoch News | Cobertura Especial |
|------------|-----------|-------------------|
| Posicao tarja (x, y) | 271, 885 | 207, 837 |
| Posicao apoio (x, y) | 271, 1010 | 209, 950 |
| Cor texto tarja | Preto (0,0,0) | Preto (0,0,0) |
| Cor texto apoio | Branco (255,255,255) | Preto (0,0,0) |
| Fonte tarja | Poppins-Bold (87→40) | Poppins-Bold (87→40) |
| Fonte apoio | Poppins-Regular (40→25) | Poppins-Regular (40→25) |

### 8.3 VideoProcessor (video_processor.py — 485 linhas)

Wrapper que integra com o Video Downloader externo. Pipeline:

```
Video com legenda:  Download --> Clip --> 16:9 --> Whisper --> GPT --> ASS --> Embed
Video sem legenda:  Download --> Clip --> 16:9
Multi-clip:         Processar cada clip --> Merge com fadewhite 1s
```

---

## 9. Extracao de Conteudo Externo

### 9.1 Social Media Extractor (social_media.py — 382 linhas)

| Plataforma | Metodo | Retorna |
|-----------|--------|---------|
| X (Twitter) | httpx + oEmbed / scraping | profile_image, handle, text |
| Truth Social | httpx + BeautifulSoup | profile_image, handle, text |
| Instagram | httpx + oEmbed API | profile_image, handle, caption |
| Telegram | httpx + embed page | channel_image, channel_name, text |

### 9.2 News Extractor (news_extractor.py — 476 linhas)

Extrai titulo e logo de artigos de noticia:
- Titulo: meta tags (og:title, twitter:title) ou `<title>`
- Logo: favicon de alta resolucao ou logo conhecida por dominio

### 9.3 Fallback Chain

```
Tentativa 1: oEmbed API (quando disponivel)
    | falhou
Tentativa 2: Scraping direto com httpx + BeautifulSoup
    | falhou
Tentativa 3: Retorna dados parciais (texto sem foto, ou vice-versa)
    | falhou
Tentativa 4: Marca instrucao como ERROR, usuario pode reprocessar
```

---

## 10. Parser de Pauta

### 10.1 Arquitetura do Parser

```
PautaParser (fachada)
    |-- parse(url) --> DocsClient.get_content() --> parse_from_text()
    +-- parse_from_text(text)
        |-- StructureParser.parse(text) --> NewsBlock[]
        +-- InstructionClassifier.classify(block) --> Instruction[]
```

### 10.2 Deteccao de Blocos (structure_parser.py — 195 linhas)

```python
# Delimitadores de bloco:
# - Linha de tracos: "--------" ou "---" (3+ tracos)
# - Linha de barras: "////////" (5+ barras)
# - Heading H1 no Google Docs
# - Titulo em CAIXA ALTA com [Responsavel]
```

### 10.3 Classificacao de Instrucoes (instruction_classifier.py — 601 linhas)

Usa regex patterns para classificar cada linha/bloco dentro de um NewsBlock:

```python
PATTERNS = {
    "slide_post": r"(?i)mostrar\s+postagem[:\s]",
    "slide_news": r"(?i)mostrar\s+(reportagem|mat[eé]ria)[:\s]",
    "slide_image_single": r"(?i)mostrar\s+imagem[:\s]",
    "slide_image_sequence": r"(?i)mostrar\s+imagens\s+em\s+sequ[eê]ncia[:\s]",
    "video_subtitle": r"(?i)legendar",
    "video_only": r"(?i)(mostrar\s+(apenas\s+o\s+)?v[ií]deo|b-roll)[:\s]",
    "timecode": r"(?i)tc\s+(\d{1,2}[:\.]?\d{2})\s*(at[eé]|ao|-)\s*(\d{1,2}[:\.]?\d{2})",
}

# Tarjas: detectadas por formato (texto em CAIXA ALTA + subtitulo)
# Regra: >80% caracteres uppercase na primeira linha + linha seguinte em caixa normal
```

---

## 11. Configuracao (config.py)

### 11.1 Estrutura de Config

```python
@dataclass
class AppConfig:
    google: GoogleConfig     # credentials_path, token_path, slides_template_id, api_key
    openai: OpenAIConfig     # api_key
    paths: PathsConfig       # output_dir, font_tarja_*, tarja_template_*
    video: VideoConfig       # default_quality, whisper_model, translation_model
```

### 11.2 Path Resolution (config.py)

```
Em modo source:
  1. Relativo ao modulo: src/core/../../config.json (raiz do projeto)
  2. Diretorio de trabalho atual

Em modo frozen (PyInstaller --onefile):
  1. Junto ao executavel: dist/config.json
  2. Um nivel acima: dist/../config.json
  3. Dentro do bundle: sys._MEIPASS/config.json
  4. Diretorio de trabalho atual
```

Paths relativos no JSON sao ancorados no diretorio do proprio config.json.

### 11.3 config.json (exemplo)

```json
{
  "google": {
    "credentials_path": "config/credentials.json",
    "token_path": "config/token.json",
    "slides_template_id": "1JyJNOJmu7YPCnDI2kJFwCQkdOkOXxrN742Y09Y403So",
    "api_key": ""
  },
  "openai": {
    "api_key": "sk-proj-..."
  },
  "paths": {
    "output_dir": "C:/Users/mrapa/Desktop",
    "font_tarja_bold": "D:/EPOCH/Epoch Times/Fontes/Poppins-Bold.ttf",
    "font_tarja_regular": "D:/EPOCH/Epoch Times/Fontes/Poppins-Regular.ttf",
    "font_tarja_semibold": "D:/EPOCH/Epoch Times/Fontes/Poppins-SemiBold.ttf",
    "tarja_template_epoch": "C:/Users/mrapa/Desktop/lower python.png",
    "tarja_template_cobertura": "C:/Users/mrapa/Desktop/lower qr ce sem logo.png"
  },
  "video": {
    "default_quality": "1080p",
    "whisper_model": "whisper-1",
    "translation_model": "gpt-4.1-mini"
  }
}
```

---

## 12. Empacotamento como .exe

### 12.1 Estrategia: PyInstaller --onefile

```
Output: dist/Pauta-Automation.exe (~48 MB)
```

**Spec file:** `spec/Pauta-Automation.spec`

**Dados incluidos no bundle:**
- `config.json` (copiado para raiz do bundle)
- `ui/` (index.html, styles.css, app.js)
- `assets/` (logos de plataformas)
- `config/` (credentials.json, token.json)

**Hidden imports:**
- webview, clr, clr_loader (pywebview EdgeChromium)
- Todos os modulos src.* (google_api, parser, processors, extractors, core)
- collect_submodules('webview')

**Opcoes:**
- `console=False` (windowed mode — sem terminal)
- `upx=True` (compressao)

### 12.2 Dependencias Externas ao .exe

| Dependencia | Incluida no .exe? | Notas |
|------------|-------------------|-------|
| Python runtime | Sim | Bundled pelo PyInstaller |
| pywebview + EdgeChromium | Sim | Hidden imports necessarios (clr, clr_loader) |
| Pillow | Sim | Incluido automaticamente |
| httpx + beautifulsoup4 | Sim | Incluido automaticamente |
| google-api-python-client | Sim | Incluido automaticamente |
| openai | Sim | Incluido automaticamente |
| yt-dlp | Sim | Incluido como Python package |
| FFmpeg | **NAO** | Deve estar no PATH do sistema |
| Fontes Poppins | **NAO** | Referenciadas via config.json (path externo) |
| Template tarja PNG | **NAO** | Referenciado via config.json (path externo) |
| config.json | Sim (bundle) + externo | Incluido no bundle mas usuario pode override com arquivo local |

### 12.3 Build

```bash
cd pauta-automation
python tools/build_exe.py
# Ou diretamente:
pyinstaller spec/Pauta-Automation.spec --clean
```

---

## 13. Reutilizacao de Codigo Existente

### 13.1 Video Downloader

**Estrategia:** Importar como dependencia externa (modulo Python separado no sistema).

O VideoProcessor serve como wrapper que:
1. Configura parametros do downloader a partir da Instruction
2. Delega o pipeline completo ao Video Downloader
3. Monitora progresso via callback
4. Retorna path do MP4 final

### 13.2 App de Tarja

**Estrategia:** Logica de renderizacao extraida como TarjaProcessor.

A logica de `add_text_to_image()` do app original foi reimplementada no TarjaProcessor com:
- Constantes de posicao/cor extraidas diretamente do app original
- Auto-ajuste de tamanho de fonte (get_best_font_size)
- Suporte a dois templates (Epoch News e Cobertura Especial)

---

## 14. Riscos e Mitigacoes

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| Scraping de redes sociais bloqueado | Slides Tipo 1 falham | Fallback chain (oEmbed -> scraping -> dados parciais -> erro com reprocessamento) |
| Google Slides API rate limit | Processamento lento | Batch requests, lazy init do SlideProcessor |
| Formato da pauta muda | Parser falha | Parser tolerante com regex flexiveis, classificacao "nao reconhecido" para revisao manual |
| pywebview renderer indisponivel | GUI nao abre | Fallback automatico: EdgeChromium -> CEF -> GTK (pywebview built-in) |
| PyInstaller hidden imports faltando | .exe crasha | Spec file com lista explicita, collect_submodules('webview') |
| Whisper timeout em videos longos | Video com legenda falha | Timeout configuravel, retry individual via botao de reprocessar |
| Config.json com paths invalidos | Processors falham | Validacao no save, mensagens de erro claras na UI Settings |

---

## 15. Diagrama de Dependencias entre Modulos

```
main.py
  +-- src/gui/app.py (PautaBridge, create_app)
        |-- src/core/config.py (AppConfig, load/save)
        |-- src/core/events.py (EventBus)
        |-- src/core/models.py (Instruction, PautaResult)
        |-- src/core/orchestrator.py (Orchestrator)
        |     |-- src/processors/slide_processor.py
        |     |     |-- src/google_api/slides_client.py
        |     |     |-- src/google_api/drive_client.py
        |     |     |-- src/extractors/social_media.py
        |     |     +-- src/extractors/news_extractor.py
        |     |-- src/processors/tarja_processor.py
        |     |     +-- Pillow (PIL)
        |     +-- src/processors/video_processor.py
        |           +-- Video Downloader (externo)
        |-- src/parser/pauta_parser.py
        |     |-- src/parser/structure_parser.py
        |     +-- src/parser/instruction_classifier.py
        +-- src/google_api/auth.py
              +-- src/google_api/docs_client.py
```

---

*Architecture Document v2.0 -- Pauta Automation System*
*Autor: Aria (Architect Agent) | Synkra AIOX*

-- Aria, arquitetando o futuro
