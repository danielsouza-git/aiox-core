# Pauta Automation System — Product Requirements Document (PRD)

**Versao:** 1.1
**Data:** 2026-03-01
**Autor:** Morgan (PM Agent)
**Status:** Draft — Aguardando aprovacao

---

## 1. Goals and Background Context

### Goals

- Automatizar 100% do processo de producao de conteudo a partir da pauta do Google Docs
- Eliminar trabalho manual repetitivo: copiar/colar URLs, timecodes, textos, fotos de perfil
- Gerar slides no Google Slides automaticamente via API
- Gerar tarjas (lower thirds) como PNG automaticamente
- Baixar e processar videos (com e sem legenda) automaticamente
- Entregar todos os assets prontos para upload no StreamYard
- Aplicacao desktop Python com pywebview (HTML/CSS/JS) e .exe executavel

### Background Context

O usuario produz um programa jornalistico (Epoch News) cuja preparacao envolve processar uma pauta escrita em Google Docs. Hoje, o processo e manual: ler a pauta, identificar cada instrucao (legendar video, criar slide, gerar tarja), abrir ferramentas separadas (Video Downloader, app de tarja, Google Slides) e processar item por item. O formato da pauta e consistente entre edicoes, o que torna a automacao viavel.

Ja existem duas ferramentas proprias que resolvem partes do problema:
- **Video Downloader** (Python/pywebview) — download, corte, legendagem com Whisper/GPT
- **App de Tarja** (Python/Tkinter/PIL) — gera PNGs de lower thirds com texto sobre imagem template

O objetivo e criar um sistema unificado que parseia a pauta e orquestra todas as ferramentas automaticamente.

### Change Log

| Data | Versao | Descricao | Autor |
|------|--------|-----------|-------|
| 2026-02-15 | 1.0 | PRD inicial baseado em SOPs extraidos | Morgan (PM) |
| 2026-03-01 | 1.1 | Migrar GUI de pywebview para pywebview (HTML/CSS/JS). Sidebar com Lower/Slides/Video Downloader. Items parseados populam seções da sidebar. EXE via PyInstaller. | Morgan (PM) |

---

## 2. Requirements

### Functional Requirements

**FR1: Parser de Pauta (Google Docs)**
O sistema deve parsear o conteudo de um Google Docs e extrair automaticamente todas as instrucoes de producao, classificando cada uma por tipo: slide, tarja, video com legenda, video sem legenda.

**FR2: Deteccao de Tipo de Instrucao**
O parser deve identificar automaticamente:
- `Mostrar postagem: [link]` → Slide Tipo 1 (Postagem)
- `Mostrar reportagem/materia: [link]` com texto traduzido → Slide Tipo 2 (Noticia COM texto)
- `Mostrar reportagem/materia: [link]` sem texto traduzido → Slide Tipo 3 (Noticia SEM texto)
- `Mostrar imagem: [numero]` no giro de noticias → Slide Tipo 4 (Fullscreen)
- `Mostrar imagens em sequencia: 1, 2, 3...` → Slide Tipo 5 (Parcial/Multiplas)
- Texto em CAIXA ALTA com titulo + subtitulo (formato tarja) → Tarja
- `legendar` + timecodes → Video com legenda
- `Mostrar video` / `B-ROLL` / `Mostrar apenas o video` → Video sem legenda

**FR3: Geracao de Slides via Google Slides API**
O sistema deve criar slides automaticamente no Google Slides usando os templates existentes:

- **Tipo 1 (Postagem):** Extrair do link da postagem: foto de perfil (circular), @ da conta, texto da postagem, logo da plataforma (X, Truth, Instagram, Telegram). Posicionar conforme template.
- **Tipo 2 (Noticia COM texto):** Extrair titulo da noticia do link, logo do veiculo, texto traduzido da pauta. Posicionar conforme template.
- **Tipo 3 (Noticia SEM texto):** Extrair titulo da noticia do link, logo do veiculo. Posicionar conforme template.
- **Tipo 4 (Fullscreen):** Inserir imagem ocupando 100% do slide.
- **Tipo 5 (Parcial/Multiplas):** Posicionar imagens sobre o background do template.

**FR4: Regra de Texto Grande (Slides)**
Quando o texto da postagem nao couber no slide:
1. Diminuir o tamanho da fonte progressivamente
2. Se ainda nao couber, cortar o texto mantendo o sentido

**FR5: Ordem dos Slides**
Os slides devem ser gerados na ordem em que aparecem na pauta, mas o usuario deve poder reordenar antes de finalizar.

**FR6: Geracao de Tarjas**
O sistema deve gerar PNGs de tarjas automaticamente, reutilizando a logica do app de tarja existente:
- Extrair da pauta: titulo em CAIXA ALTA (tarja principal) + subtitulo (linha de apoio)
- Aplicar sobre imagem template PNG usando fontes Poppins
- Detectar tipo de conteudo: Giro de Noticias, Cobertura Especial, Na Mira do Marcos
- Respeitar posicoes, cores e tamanhos de fonte do app existente
- Auto-ajuste de tamanho de fonte quando texto e longo
- Salvar PNGs no Desktop

**FR7: Processamento de Video com Legenda**
Quando a pauta indica `legendar`:
- Extrair URL e timecodes
- Acionar pipeline do Video Downloader: download → corte → 16:9 → Whisper → GPT → legenda queimada
- Detectar instrucoes de "juntar" trechos e configurar merge automaticamente
- Salvar MP4 no Desktop

**FR8: Processamento de Video sem Legenda**
Quando a pauta indica `Mostrar video` / `B-ROLL` / `Mostrar apenas o video`:
- Extrair URL e timecodes
- Acionar pipeline do Video Downloader com "Video only"
- Salvar MP4 no Desktop

**FR9: Dashboard de Progresso**
A interface deve mostrar o progresso de cada item sendo processado:
- Lista de todos os itens extraidos da pauta
- Status de cada um: pendente / processando / concluido / erro
- Possibilidade de reprocessar itens com erro

**FR15: Navegacao por Sidebar**
A interface deve ter uma barra lateral (sidebar) fixa com os seguintes itens de navegacao:
- **Home** — Tela principal com input do Google Docs e resumo geral
- **Lower** — Lista de tarjas detectadas/geradas
- **Slides** — Lista de slides detectados/gerados
- **Video Downloader** — Lista de videos detectados/processados

Ao parsear a pauta, os itens detectados devem ser automaticamente distribuidos nas secoes correspondentes da sidebar. Cada secao deve exibir seus itens com status individual (pendente/processando/concluido/erro).

**FR16: Visualizacao por Secao**
Cada secao da sidebar deve funcionar como uma view independente:
- **Lower:** Lista de tarjas com titulo, subtitulo, tipo e status. Preview do PNG gerado quando disponivel.
- **Slides:** Lista de slides com tipo, descricao e status. Link para abrir no Google Slides quando gerado.
- **Video Downloader:** Lista de videos com URL, timecodes, tipo (com/sem legenda) e status. Progresso individual por video.

**FR10: Revisao Pre-Processamento**
Antes de iniciar o processamento, o sistema deve exibir um resumo de tudo que vai ser feito (lista de slides, tarjas, videos) para o usuario confirmar.

**FR11: Integracao com Google Docs API**
O sistema deve acessar o Google Docs via API para ler a pauta automaticamente, sem necessidade de copiar/colar o conteudo.

**FR12: Configuracao de Credenciais**
O sistema deve ter uma tela de configuracoes para:
- Google API credentials (Docs + Slides)
- OpenAI API key (Whisper + GPT)
- Pasta de destino dos arquivos

**FR13: Extracao de Conteudo de Postagens**
Para slides Tipo 1, o sistema deve extrair automaticamente de postagens em redes sociais:
- Foto de perfil do autor
- @ (handle) da conta
- Texto da postagem
- Plataformas suportadas: X (Twitter), Truth Social, Instagram, Telegram

**FR14: Extracao de Conteudo de Noticias**
Para slides Tipo 2 e 3, o sistema deve extrair automaticamente:
- Titulo da noticia a partir do link (meta tags og:title ou <title>)
- Logo do veiculo de imprensa (favicon ou logo conhecida)

### Non-Functional Requirements

**NFR1: Performance**
O processamento de uma pauta completa (4-6 noticias, ~15-20 slides, ~4 tarjas, ~5-10 videos) deve completar em menos de 15 minutos.

**NFR2: Confiabilidade**
Falha em um item nao deve bloquear o processamento dos demais. Cada item deve ser processado de forma independente.

**NFR3: Usabilidade**
A interface deve ser simples e direta — colar link do Google Docs, revisar itens, clicar processar.

**NFR4: Compatibilidade**
- Windows 10/11
- Python 3.10+
- pywebview >= 4.0 com EdgeChromium ou CEF renderer
- Distribuido como .exe (PyInstaller)

**NFR5: Reutilizacao de Codigo**
Maximizar reutilizacao do codigo existente do Video Downloader e App de Tarja, importando como modulos ou adaptando a logica.

**NFR6: Tolerancia a Erros**
Se um link estiver quebrado ou uma extracao falhar, o sistema deve logar o erro, pular o item e continuar com os demais.

---

## 3. User Interface Design Goals

### Overall UX Vision

Aplicacao desktop com interface moderna usando **pywebview** (HTML/CSS/JS, dark mode) seguindo o design system do AIOS Dashboard (`_projetos/dashboard/`). Layout com **sidebar fixa** a esquerda e **area de conteudo** a direita, funcionando como um "painel de controle" da producao. O usuario cola o link da pauta na Home, ve o resumo, confirma, e navega entre as secoes (Lower, Slides, Video Downloader) para acompanhar o progresso.

### Design System

Reutilizar o design system do AIOS Dashboard:
- **Layout:** CSS Grid com sidebar fixa (258px) + conteudo flexivel (1fr)
- **Cores:** Dark mode com `--bg-deep: #09111d`, `--brand-cyan: #1ec8ff`, `--brand-blue: #1f6bff`
- **Tipografia:** Bahnschrift / Segoe UI Variable para UI, Trebuchet MS para headings
- **Componentes:** Botoes com border-radius 12px, cards com 14-16px, transicoes 220ms ease
- **Status:** Verde (#36d399) sucesso, Rosa (#fb7185) erro, Cyan (#1ec8ff) ativo
- **Sidebar:** Background gradient escuro, borda direita cyan suave, itens com hover translateY(-1px)

### Key Interaction Paradigms

1. **Input unico:** O usuario fornece apenas o link do Google Docs na Home
2. **Sidebar como hub:** Navegar entre Lower, Slides e Video Downloader para ver itens por tipo
3. **Distribuicao automatica:** Ao parsear, itens populam automaticamente as secoes da sidebar
4. **Processamento paralelo visivel:** Status em tempo real por item em cada secao
5. **Acao em caso de erro:** Botao de reprocessar por item individual

### Core Screens and Views

1. **Home (tela inicial)**
   - Campo para colar link do Google Docs
   - Botao "Parsear Pauta"
   - Resumo geral apos parsing: contagem de itens por tipo (X slides, Y tarjas, Z videos)
   - Checkbox por item para incluir/excluir do processamento
   - Botao "Processar Tudo"
   - Barra de progresso geral durante processamento

2. **Lower (sidebar → Lower)**
   - Lista de tarjas detectadas na pauta
   - Cada item mostra: titulo, subtitulo, tipo (Giro/Cobertura/Mira), status
   - Preview do PNG gerado quando disponivel
   - Botao de reprocessar por item

3. **Slides (sidebar → Slides)**
   - Lista de slides detectados na pauta
   - Cada item mostra: tipo (1-5), descricao, URL fonte, status
   - Link para abrir no Google Slides quando gerado
   - Drag-and-drop para reordenar slides
   - Botao de reprocessar por item

4. **Video Downloader (sidebar → Video Downloader)**
   - Lista de videos detectados na pauta
   - Cada item mostra: URL, timecodes, tipo (com/sem legenda), status
   - Barra de progresso individual por video
   - Botao de reprocessar por item

5. **Configuracoes (sidebar → icone engrenagem)**
   - Google API credentials (path do JSON ou client ID/secret)
   - OpenAI API key
   - Pasta de destino dos arquivos
   - Caminhos das fontes Poppins
   - Caminho da imagem template de tarja
   - ID do Google Slides template
   - Configuracoes salvas em arquivo local (config.json)

### Accessibility
Nao aplicavel (uso interno individual).

### Branding
Seguir design system do AIOS Dashboard (dark mode, cores navy/cyan/blue). Referencia: `_projetos/dashboard/ui/styles.css`.

### Target Devices and Platforms
Desktop Only — Windows 10/11.

---

## 4. Technical Assumptions

### Repository Structure
Repositorio independente (fora do aios-core). Projeto Python standalone.

### Service Architecture
Monolito desktop — aplicacao unica com modulos internos.

### Stack Tecnica

| Componente | Tecnologia |
|-----------|-----------|
| Linguagem | Python 3.10+ |
| GUI | pywebview + HTML/CSS/JS (dark mode) |
| Google Docs API | google-api-python-client |
| Google Slides API | google-api-python-client |
| Download de videos | yt-dlp |
| Processamento de video | FFmpeg |
| Transcricao | OpenAI Whisper API |
| Traducao | GPT-4.1-mini |
| Geracao de tarjas | Pillow (PIL) |
| Scraping de postagens | httpx + BeautifulSoup (ou APIs oficiais) |
| Desktop wrapper | pywebview >= 4.0 |
| Frontend | HTML5 + CSS3 + Vanilla JS (design system AIOS Dashboard) |
| Empacotamento | PyInstaller (.exe) |

### Dependencias Externas

| Dependencia | Tipo | Notas |
|------------|------|-------|
| Google Cloud Project | API | Necessario OAuth2 para Docs + Slides |
| OpenAI API Key | API | Whisper + GPT (ja possui) |
| FFmpeg | Sistema | Ja instalado |
| Fontes Poppins | Arquivo | Ja possui em D:/EPOCH/Epoch Times/Fontes/ |
| Imagem template tarja | Arquivo | Ja possui (lower python.png) |
| Google Slides template | Arquivo | ID: 1JyJNOJmu7YPCnDI2kJFwCQkdOkOXxrN742Y09Y403So |

### Testing Requirements
Unit tests para o parser de pauta e logica de classificacao. Testes manuais para integracao com APIs e geracao visual.

### Additional Technical Assumptions

- O formato da pauta e consistente entre edicoes e pode ser parseado com regras deterministicas
- O Google Slides template tem IDs de placeholder estaveis que podem ser referenciados via API
- As postagens de redes sociais podem ser scrapeadas sem autenticacao (conteudo publico)
- O Video Downloader pode ser importado como modulo Python sem a GUI
- O app de tarja pode ter sua logica de renderizacao extraida como funcao reutilizavel

---

## 5. Epic List

### Epic 1: Foundation — Parser de Pauta e Infraestrutura
Estabelecer o projeto, configuracao de APIs, e o parser que transforma o Google Docs em uma lista estruturada de instrucoes de producao.

### Epic 2: Geracao Automatica de Slides
Implementar a criacao automatica de slides via Google Slides API para os 5 tipos de template.

### Epic 3: Geracao Automatica de Tarjas
Implementar a geracao automatica de PNGs de tarja a partir dos textos extraidos da pauta.

### Epic 4: Processamento Automatico de Videos
Integrar com o Video Downloader para processar videos (com e sem legenda) automaticamente a partir da pauta.

### Epic 5: Interface e Orquestracao
Construir a GUI unificada que permite revisar, reordenar, processar e acompanhar o progresso de todos os itens.

---

## 6. Epic Details

---

### Epic 1: Foundation — Parser de Pauta e Infraestrutura

**Goal:** Criar a base do projeto e o modulo de parsing que transforma uma pauta do Google Docs em uma estrutura de dados com todas as instrucoes de producao classificadas por tipo.

#### Story 1.1: Setup do Projeto e Configuracao de APIs

**Como** produtor do programa,
**Quero** um projeto Python configurado com acesso as APIs do Google,
**Para que** o sistema possa ler documentos e manipular slides programaticamente.

**Acceptance Criteria:**
1. Projeto Python criado com estrutura de pastas (src/, tests/, assets/, config/)
2. Dependencias instaladas: google-api-python-client, google-auth-oauthlib, customtkinter, pillow, httpx, beautifulsoup4
3. OAuth2 configurado para Google Docs API (escopo: readonly) e Google Slides API (escopo: read/write)
4. Fluxo de autenticacao funcional: usuario autoriza uma vez, token salvo para reutilizacao
5. Teste unitario confirma que consegue ler o conteudo de um Google Doc de teste
6. Arquivo de configuracao (config.json) para armazenar API keys e paths

#### Story 1.2: Parser de Pauta — Extracao de Estrutura

**Como** produtor do programa,
**Quero** que o sistema leia a pauta do Google Docs e identifique as noticias e suas instrucoes,
**Para que** eu nao precise ler e classificar manualmente cada item.

**Acceptance Criteria:**
1. Parser le o conteudo do Google Docs via API e extrai o texto completo com formatacao
2. Identifica blocos de noticias separados por delimitadores (linhas de tracos, H1s)
3. Para cada noticia, identifica: titulo, responsavel (ex: [Igor], [Angela], [Marcos]), tipo de conteudo
4. Retorna estrutura de dados organizada: lista de noticias, cada uma com suas instrucoes
5. Teste unitario com pauta de exemplo confirma parsing correto

#### Story 1.3: Parser de Pauta — Classificacao de Instrucoes

**Como** produtor do programa,
**Quero** que cada instrucao da pauta seja classificada automaticamente por tipo,
**Para que** o sistema saiba qual ferramenta acionar para cada item.

**Acceptance Criteria:**
1. Detecta instrucoes de slide: "Mostrar postagem", "Mostrar reportagem", "Mostrar materia", "Mostrar imagem", "Mostrar imagens em sequencia"
2. Detecta instrucoes de tarja: blocos com titulo em CAIXA ALTA + subtitulo (formato especifico)
3. Detecta instrucoes de video com legenda: "legendar" + timecodes
4. Detecta instrucoes de video sem legenda: "Mostrar video", "B-ROLL", "Mostrar apenas o video"
5. Classifica tipo de slide: Tipo 1 (postagem), Tipo 2 (noticia COM texto), Tipo 3 (noticia SEM texto), Tipo 4 (fullscreen), Tipo 5 (parcial/multiplas)
6. Extrai dados de cada instrucao: URLs, timecodes (formato MMSS), textos, instrucoes de juncao
7. Teste unitario com pauta real confirma classificacao correta de todos os tipos

---

### Epic 2: Geracao Automatica de Slides

**Goal:** Criar slides automaticamente no Google Slides usando a API, replicando os 5 tipos de template existentes com conteudo extraido de links de postagens e noticias.

#### Story 2.1: Extracao de Conteudo de Postagens (Redes Sociais)

**Como** produtor do programa,
**Quero** que o sistema extraia automaticamente foto de perfil, @, e texto de postagens,
**Para que** eu nao precise copiar cada elemento manualmente.

**Acceptance Criteria:**
1. Extrai de postagens do X (Twitter): foto de perfil, @handle, texto completo
2. Extrai de postagens do Truth Social: foto de perfil, @handle, texto completo
3. Extrai de postagens do Instagram: foto de perfil, @handle, texto/caption
4. Extrai de postagens do Telegram: foto do canal, nome do canal, texto
5. Retorna dados estruturados: { profile_image_url, handle, text, platform, platform_logo }
6. Trata erros graciosamente: se extracao falhar, retorna erro sem travar

#### Story 2.2: Extracao de Conteudo de Noticias

**Como** produtor do programa,
**Quero** que o sistema extraia titulo e logo de artigos de noticias,
**Para que** os slides de noticia sejam gerados automaticamente.

**Acceptance Criteria:**
1. Extrai titulo do artigo via meta tags (og:title, twitter:title) ou tag <title>
2. Identifica e extrai logo do veiculo (favicon de alta resolucao ou imagem conhecida)
3. Suporta os veiculos mais comuns: Reuters, Financial Times, NY Times, sites .gov
4. Fallback: se logo nao encontrada, usa texto do nome do veiculo
5. Teste com pelo menos 5 URLs reais de noticias diferentes

#### Story 2.3: Geracao de Slides Tipo 1 (Postagem)

**Como** produtor do programa,
**Quero** que slides de postagem sejam criados automaticamente no Google Slides,
**Para que** eu nao precise montar cada slide manualmente.

**Acceptance Criteria:**
1. Duplica o slide template Tipo 1 no Google Slides via API
2. Insere foto de perfil circular na posicao correta (lado esquerdo)
3. Insere nome e @ abaixo da foto
4. Insere texto da postagem na caixa branca (lado direito)
5. Insere logo da plataforma no canto inferior direito
6. Aplica regra de texto grande: reduz fonte se necessario, corta se ainda nao couber
7. Slide gerado visualmente identico ao template manual

#### Story 2.4: Geracao de Slides Tipos 2 e 3 (Noticia)

**Como** produtor do programa,
**Quero** que slides de noticia sejam criados automaticamente,
**Para que** a producao de slides de reportagem seja instantanea.

**Acceptance Criteria:**
1. Tipo 2 (COM texto): duplica template, insere logo do veiculo no topo, titulo, e texto traduzido da pauta
2. Tipo 3 (SEM texto): duplica template, insere logo do veiculo a esquerda, titulo a direita
3. Texto traduzido e extraido da propria pauta (nao precisa traduzir)
4. Se texto traduzido nao existir na pauta, classifica como Tipo 3 automaticamente
5. Slides gerados visualmente identicos aos templates manuais

#### Story 2.5: Geracao de Slides Tipos 4 e 5 (Imagem)

**Como** produtor do programa,
**Quero** que slides de imagem sejam criados automaticamente,
**Para que** imagens da pauta sejam inseridas nos slides sem trabalho manual.

**Acceptance Criteria:**
1. Tipo 4 (Fullscreen): duplica template, insere imagem ocupando 100% do slide
2. Tipo 5 (Parcial/Multiplas): duplica template, posiciona imagens sobre o background
3. Imagens sao extraidas dos links embutidos nos numeros da pauta
4. Regra de giro de noticias: imagens do giro → Tipo 4, demais → Tipo 5
5. Se imagem de baixa resolucao no fullscreen, alerta o usuario para considerar Tipo 5

---

### Epic 3: Geracao Automatica de Tarjas

**Goal:** Gerar PNGs de tarjas automaticamente a partir dos textos da pauta, reutilizando a logica do app de tarja existente.

#### Story 3.1: Modulo de Geracao de Tarja

**Como** produtor do programa,
**Quero** que tarjas sejam geradas automaticamente a partir da pauta,
**Para que** eu nao precise abrir o app de tarja e copiar/colar texto manualmente.

**Acceptance Criteria:**
1. Extrai logica de renderizacao do app de tarja existente como modulo reutilizavel
2. Recebe: tarja_principal (titulo), linha_de_apoio (subtitulo), tipo_conteudo (giro/cobertura/mira)
3. Gera PNG com texto sobre imagem template, respeitando:
   - Fontes Poppins (Bold, Regular, SemiBold)
   - Posicoes de texto identicas ao app original (epoch e cobertura)
   - Cores de texto identicas (preto tarja, branco apoio epoch, preto apoio cobertura)
   - Auto-ajuste de tamanho de fonte (max 87 → min 40 para tarja, max 40 → min 25 para apoio)
   - Ajuste de posicao Y proporcional a reducao de fonte
4. Gera automaticamente o texto do tipo ("GIRO DE NOTICIAS", "COBERTURA ESPECIAL", "NA MIRA DO MARCOS")
5. Salva PNG no Desktop com nome automatico (giro.png, lt1.png, lt2.png...)
6. Teste visual confirma que PNG gerado e identico ao do app original

#### Story 3.2: Deteccao de Tarjas na Pauta

**Como** produtor do programa,
**Quero** que o parser identifique automaticamente quais textos da pauta sao tarjas,
**Para que** todas as tarjas sejam geradas sem eu precisar indicar uma a uma.

**Acceptance Criteria:**
1. Detecta blocos de tarja na pauta: titulo em CAIXA ALTA seguido de subtitulo
2. Associa cada tarja a sua noticia correspondente
3. Determina tipo de conteudo baseado no contexto da noticia
4. Extrai titulo (primeira linha caps) e subtitulo (segunda linha) separadamente
5. Gera lista ordenada de tarjas para processamento

---

### Epic 4: Processamento Automatico de Videos

**Goal:** Integrar com o Video Downloader existente para processar todos os videos da pauta automaticamente.

#### Story 4.1: Modulo de Integracao com Video Downloader

**Como** produtor do programa,
**Quero** que videos sejam baixados e processados automaticamente,
**Para que** eu nao precise abrir o Video Downloader e configurar cada video manualmente.

**Acceptance Criteria:**
1. Importa a logica do Video Downloader como modulo (sem GUI)
2. Recebe: URL, timecodes (start/end), video_only (bool), merge (bool), clips (lista)
3. Executa pipeline completo: download → corte → 16:9 → (transcricao → traducao → legenda se nao video_only)
4. Suporta multi-clip com merge (fadewhite 1s)
5. Salva MP4 no Desktop
6. Retorna status de cada video: sucesso / erro com mensagem

#### Story 4.2: Processamento em Batch de Videos

**Como** produtor do programa,
**Quero** que todos os videos da pauta sejam processados sequencialmente,
**Para que** eu nao precise iniciar cada video individualmente.

**Acceptance Criteria:**
1. Processa lista de videos extraida pelo parser
2. Videos com legenda: pipeline completo (Whisper + GPT + embed)
3. Videos sem legenda: pipeline "video only"
4. Videos com instrucao de juncao: configura merge automaticamente
5. Progresso reportado por video (callback ou evento)
6. Falha em um video nao bloqueia os demais

---

### Epic 5: Interface e Orquestracao

**Goal:** Construir a interface grafica unificada com pywebview (HTML/CSS/JS, dark mode, sidebar) e o orquestrador que coordena todos os modulos, permitindo navegacao por tipo (Lower/Slides/Video), revisao, reordenacao e acompanhamento de progresso.

#### Story 5.1: Setup pywebview e Layout com Sidebar

**Como** produtor do programa,
**Quero** uma aplicacao desktop com pywebview e sidebar de navegacao,
**Para que** eu tenha uma interface moderna e organizada por tipo de conteudo.

**Acceptance Criteria:**
1. Aplicacao pywebview com bridge Python/JS (classe `PautaBridge` com `js_api`)
2. Frontend HTML/CSS/JS usando design system do AIOS Dashboard (dark mode, cores navy/cyan)
3. Layout CSS Grid: sidebar fixa 258px + area de conteudo flexivel (1fr)
4. Sidebar com itens: Home, Lower, Slides, Video Downloader, Configuracoes (icone engrenagem)
5. Navegacao SPA: clicar em item da sidebar carrega a view correspondente sem recarregar pagina
6. Item ativo na sidebar destacado com gradiente azul (`.sidebar__item--active`)
7. Janela pywebview com titulo "Pauta Automation", 1024x720px, min 900x600px
8. Responsividade: sidebar colapsa em tela < 1024px

#### Story 5.2: Home — Input, Parsing e Resumo

**Como** produtor do programa,
**Quero** uma tela Home onde eu cole o link da pauta e veja o resumo geral,
**Para que** eu possa revisar e iniciar o processamento.

**Acceptance Criteria:**
1. Campo para colar link do Google Docs
2. Botao "Parsear Pauta" que aciona o parser via bridge Python
3. Apos parsing, exibe resumo: contagem por tipo (X slides, Y tarjas, Z videos)
4. Itens detectados sao automaticamente distribuidos nas secoes Lower, Slides, Video Downloader
5. Checkbox por item para incluir/excluir do processamento
6. Botao "Processar Tudo" para iniciar processamento de todos os itens selecionados
7. Barra de progresso geral durante processamento (X de Y concluidos)
8. Ao finalizar, exibe resumo: X slides criados, Y tarjas geradas, Z videos processados

#### Story 5.3: Views por Secao (Lower, Slides, Video Downloader)

**Como** produtor do programa,
**Quero** ver os itens organizados por tipo ao navegar pela sidebar,
**Para que** eu acompanhe o progresso de cada categoria separadamente.

**Acceptance Criteria:**
1. **Lower:** Lista de tarjas com titulo, subtitulo, tipo (Giro/Cobertura/Mira), status (pendente/processando/concluido/erro). Preview do PNG quando gerado. Botao reprocessar por item.
2. **Slides:** Lista de slides com tipo (1-5), descricao, URL fonte, status. Link para abrir no Google Slides. Drag-and-drop para reordenar. Botao reprocessar por item.
3. **Video Downloader:** Lista de videos com URL, timecodes, tipo (com/sem legenda), status. Barra de progresso individual. Botao reprocessar por item.
4. Status em tempo real via bridge Python→JS (eventos ou polling)
5. Indicador visual por status: icone + cor (verde sucesso, rosa erro, cyan processando)
6. Log de erros expandivel por item
7. Contagem de itens no badge da sidebar (ex: "Slides (5)")

#### Story 5.4: Tela de Configuracoes

**Como** produtor do programa,
**Quero** configurar credenciais e caminhos uma unica vez,
**Para que** eu nao precise reconfigurar a cada uso.

**Acceptance Criteria:**
1. Campo para Google API credentials (path do JSON ou client ID/secret)
2. Campo para OpenAI API key
3. Campo para pasta de destino dos arquivos
4. Campo para caminhos das fontes Poppins
5. Campo para caminho da imagem template de tarja
6. Campo para ID do Google Slides template
7. Configuracoes salvas em arquivo local (config.json)
8. Validacao de campos ao salvar
9. Estilizacao seguindo design system (inputs dark, borders cyan, botao salvar azul)

#### Story 5.5: Empacotamento como .exe

**Como** produtor do programa,
**Quero** um arquivo .exe para abrir a aplicacao sem precisar do terminal,
**Para que** a experiencia de uso seja simples e direta.

**Acceptance Criteria:**
1. Aplicacao empacotada como .exe usando PyInstaller
2. Inclui todas as dependencias Python + assets frontend (HTML/CSS/JS)
3. pywebview bundled com CEF ou EdgeChromium como renderer
4. Nao requer Python instalado na maquina
5. Icone customizado para o executavel
6. Inicia sem console/terminal visivel
7. Funciona em Windows 10/11
8. Script de build (`tools/build_exe.py`) com spec file configurado

---

## 7. Checklist Results Report

*A ser preenchido apos validacao do PRD.*

---

## 8. Next Steps

### Architect Prompt
> @architect Analise o PRD em `docs/prd-pauta-automation.md` para o Pauta Automation System. Defina a arquitetura tecnica: estrutura de modulos, fluxo de dados entre parser/slides/tarjas/videos, integracao com Google APIs, estrategia de reutilizacao do codigo existente (Video Downloader + App de Tarja), e plano de empacotamento como .exe.

### Dev Prompt
> @dev Implemente o Pauta Automation System conforme PRD em `docs/prd-pauta-automation.md` e arquitetura definida pelo @architect. Comece pelo Epic 1 (Parser + Setup). Projeto Python standalone, GUI com pywebview, .exe via PyInstaller.

---

## Appendix A: Referencia dos Templates de Slide

| Tipo | Layout | Elementos |
|------|--------|-----------|
| 1. Postagem | Fundo cyan/cidade. Esquerda: foto perfil circular + nome + @. Direita: caixa branca com texto. Inferior direito: logo plataforma | foto_perfil, handle, texto, platform_logo |
| 2. Noticia COM texto | Fundo cyan/cidade. Caixa branca centralizada. Topo: logo veiculo. Abaixo: texto traduzido bold preto | logo_veiculo, titulo, texto_traduzido |
| 3. Noticia SEM texto | Fundo cyan/cidade. Barra branca horizontal. Esquerda: logo. Direita: titulo bold preto | logo_veiculo, titulo |
| 4. Fullscreen | Slide todo branco — imagem ocupa 100% | imagem |
| 5. Parcial/Multiplas | Fundo cyan/cidade com faixas diagonais | imagens[] |

**Google Slides Template ID:** `1JyJNOJmu7YPCnDI2kJFwCQkdOkOXxrN742Y09Y403So`

## Appendix B: Referencia do App de Tarja

| Propriedade | Epoch News | Cobertura Especial |
|------------|-----------|-------------------|
| Imagem template | lower python.png | lower qr ce sem logo.png |
| Posicao tarja (x, y) | 271, 885 | 207, 837 |
| Posicao apoio (x, y) | 271, 1010 | 209, 950 |
| Posicao tipo (x, y) | 271, 832 | N/A |
| Cor texto tarja | Preto (0,0,0) | Preto (0,0,0) |
| Cor texto apoio | Branco (255,255,255) | Preto (0,0,0) |
| Cor texto tipo | #e9ecee | N/A |
| Fonte tarja | Poppins-Bold | Poppins-Bold |
| Fonte apoio | Poppins-Regular | Poppins-Regular |
| Fonte tipo | Poppins-SemiBold | N/A |
| Tamanho tarja | 87 (max) → 40 (min) | 87 (max) → 40 (min) |
| Tamanho apoio | 40 (max) → 25 (min) | 40 (max) → 25 (min) |
| Tamanho tipo | 40 (fixo) | N/A |
| Largura maxima | 1850px | 1850px |

## Appendix C: Referencia do Video Downloader

| Funcionalidade | Detalhe |
|---------------|---------|
| Download | yt-dlp, suporta 1000+ sites |
| Qualidade padrao | 1080p |
| Formato de tempo | MMSS (0130 = 1:30) |
| Transcricao | OpenAI Whisper API |
| Traducao | GPT-4.1-mini, portugues BR |
| Legenda | ASS format, Arial Bold 21, branco sobre caixa preta |
| Multi-clip | Ate 3 clips, merge com fadewhite 1s |
| Saida | MP4 no Desktop |

## Appendix D: SOPs Documentados

Referencia completa: `docs/sops/manual-processos-operacionais.md`

---

*PRD v1.0 — Pauta Automation System*
*Autor: Morgan (PM Agent) | Synkra AIOS*
