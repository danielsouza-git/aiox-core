/* Pauta Automation — Frontend Logic */

// ── State ──
let parsedItems = [];
let isProcessing = false;
let pollTimer = null;

// ── API helper ──
function api() {
  return window.pywebview ? window.pywebview.api : null;
}

// ── Navigation ──
const sidebarButtons = document.querySelectorAll(".sidebar__item[data-view]");
const views = document.querySelectorAll(".view");

function showView(viewId) {
  views.forEach(v => v.classList.remove("view--active"));
  sidebarButtons.forEach(b => b.classList.remove("sidebar__item--active"));

  const view = document.getElementById("view-" + viewId);
  const btn = document.querySelector(`.sidebar__item[data-view="${viewId}"]`);
  if (view) view.classList.add("view--active");
  if (btn) btn.classList.add("sidebar__item--active");
}

sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

// ── Tabs ──
const tabButtons = document.querySelectorAll(".tabs__btn[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel");

function showTab(tabId) {
  tabPanels.forEach(p => p.classList.remove("tab-panel--active"));
  tabButtons.forEach(b => b.classList.remove("tabs__btn--active"));
  const panel = document.getElementById("panel-" + tabId);
  const btn = document.querySelector(`.tabs__btn[data-tab="${tabId}"]`);
  if (panel) panel.classList.add("tab-panel--active");
  if (btn) btn.classList.add("tabs__btn--active");
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

// ── Input mode toggle ──
const radioUrl = document.querySelector('input[name="inputMode"][value="url"]');
const radioText = document.querySelector('input[name="inputMode"][value="text"]');
const urlInput = document.getElementById("url-input");
const textInput = document.getElementById("text-input");

function onInputModeChange() {
  if (radioUrl.checked) {
    urlInput.style.display = "";
    textInput.style.display = "none";
  } else {
    urlInput.style.display = "none";
    textInput.style.display = "";
  }
}
radioUrl.addEventListener("change", onInputModeChange);
radioText.addEventListener("change", onInputModeChange);

// ── Parse ──
const btnParse = document.getElementById("btnParse");
const btnParseText = document.getElementById("btnParseText");
const parseStatus = document.getElementById("parseStatus");

function showParseStatus(msg, level) {
  parseStatus.style.display = "";
  parseStatus.textContent = msg;
  parseStatus.className = "status-msg" + (level ? " status-msg--" + level : "");
}

function hideParseStatus() {
  parseStatus.style.display = "none";
}

btnParse.addEventListener("click", async () => {
  const url = document.getElementById("docUrl").value.trim();
  if (!url) { showParseStatus("Insira a URL do Google Docs.", "err"); return; }

  const pyApi = api();
  if (!pyApi) {
    showParseStatus("Aguardando inicializacao...", "err");
    return;
  }

  btnParse.disabled = true;
  showParseStatus("Parseando pauta...", "");
  try {
    const result = await pyApi.parse_url(url);
    if (result.status === "error") {
      showParseStatus(result.message, "err");
    } else {
      onParseComplete(result);
    }
  } catch (e) {
    showParseStatus("Erro: " + (e.message || e), "err");
  } finally {
    btnParse.disabled = false;
  }
});

btnParseText.addEventListener("click", async () => {
  const text = document.getElementById("docText").value.trim();
  if (!text) { showParseStatus("Cole o texto da pauta.", "err"); return; }

  const pyApi = api();
  if (!pyApi) {
    showParseStatus("Aguardando inicializacao...", "err");
    return;
  }

  btnParseText.disabled = true;
  showParseStatus("Parseando texto...", "");
  try {
    const result = await pyApi.parse_text(text);
    if (result.status === "error") {
      showParseStatus(result.message, "err");
    } else {
      onParseComplete(result);
    }
  } catch (e) {
    showParseStatus("Erro: " + (e.message || e), "err");
  } finally {
    btnParseText.disabled = false;
  }
});

// ── Parse complete ──
function onParseComplete(result) {
  parsedItems = result.items || [];
  showParseStatus(`${parsedItems.length} itens detectados.`, "ok");

  const slides = parsedItems.filter(i => i.type.startsWith("slide_"));
  const tarjas = parsedItems.filter(i => i.type === "tarja");
  const videos = parsedItems.filter(i => i.type.startsWith("video_"));

  // Update tab counts
  updateTabCount("all", parsedItems.length);
  updateTabCount("lower", tarjas.length);
  updateTabCount("slides", slides.length);
  updateTabCount("videos", videos.length);

  // Show items card
  document.getElementById("home-items").style.display = "";
  document.getElementById("home-progress").style.display = "none";

  // Summary
  const summaryEl = document.getElementById("homeSummary");
  summaryEl.innerHTML = buildSummaryStat(slides.length, "Slides", "var(--badge-slide)")
    + buildSummaryStat(tarjas.length, "Tarjas", "var(--badge-tarja)")
    + buildSummaryStat(videos.length, "Videos", "var(--badge-video)");

  // Render items in "Todos" tab
  renderItemsList("homeItemsList", parsedItems, true);

  // Render items in section tabs
  renderSectionItems("lowerItemsList", tarjas, "tarja");
  renderSectionItems("slidesItemsList", slides, "slide");
  renderSectionItems("videosItemsList", videos, "video");

  // Enable process buttons
  updateSelectedCount();
  document.getElementById("btnProcess").disabled = false;
  document.getElementById("btnProcessTop").disabled = false;
  if (tarjas.length > 0) { document.getElementById("btnProcessLower").disabled = false; updateSectionCount("lower"); }
  if (slides.length > 0) { document.getElementById("btnProcessSlides").disabled = false; updateSectionCount("slides"); }
  if (videos.length > 0) { document.getElementById("btnProcessVideos").disabled = false; updateSectionCount("videos"); }

  // Populate standalone sidebar views
  renderViewItems("lowerViewList", tarjas, "tarja");
  renderViewItems("slidesViewList", slides, "slide");
  renderViewItems("videosViewList", videos, "video");

  // Update view counts
  const lowerCount = document.getElementById("lower-view-count");
  const slidesCount = document.getElementById("slides-view-count");
  const videosCount = document.getElementById("videos-view-count");
  if (lowerCount) lowerCount.textContent = tarjas.length;
  if (slidesCount) slidesCount.textContent = slides.length;
  if (videosCount) videosCount.textContent = videos.length;

  // Update sidebar badges
  updateBadge("lower", tarjas.length);
  updateBadge("slides", slides.length);
  updateBadge("videos", videos.length);

  // Slides summary by type
  if (slides.length > 0) {
    const slidesByType = {};
    slides.forEach(s => { slidesByType[s.type] = (slidesByType[s.type] || 0) + 1; });
    let shtml = "";
    for (const [t, c] of Object.entries(slidesByType)) {
      shtml += buildSummaryStat(c, getBadgeLabel(t), "var(--badge-slide)");
    }
    document.getElementById("slides-view-summary").innerHTML = shtml;
  }

  // Videos summary
  if (videos.length > 0) {
    const videoSub = videos.filter(v => v.type === "video_sub").length;
    const videoOnly = videos.filter(v => v.type === "video_only").length;
    let vhtml = "";
    if (videoSub > 0) vhtml += buildSummaryStat(videoSub, "Com Legenda", "var(--badge-video)");
    if (videoOnly > 0) vhtml += buildSummaryStat(videoOnly, "Sem Legenda", "var(--badge-video)");
    document.getElementById("videos-view-summary").innerHTML = vhtml;
  }

  // Enable view process buttons
  if (tarjas.length > 0) document.getElementById("btnProcessLowerView").disabled = false;
  if (slides.length > 0) document.getElementById("btnProcessSlidesView").disabled = false;
  if (videos.length > 0) document.getElementById("btnProcessVideosView").disabled = false;

  // Show "Todos" tab by default
  showTab("all");
}

function buildSummaryStat(value, label, color) {
  return `<div class="summary__stat">
    <div class="summary__stat-value" style="color:${color}">${value}</div>
    <div class="summary__stat-label">${label}</div>
  </div>`;
}

function updateTabCount(tab, count) {
  const el = document.getElementById("tab-count-" + tab);
  if (el) el.textContent = count;
}

// ── Render items ──
function getBadgeClass(type) {
  if (type.startsWith("slide_")) return "item-badge--slide";
  if (type === "tarja") return "item-badge--tarja";
  if (type.startsWith("video_")) return "item-badge--video";
  return "";
}

function getBadgeLabel(type) {
  const labels = {
    slide_post: "Post", slide_news_text: "Noticia+", slide_news: "Noticia",
    slide_full: "Fullscreen", slide_partial: "Parcial",
    tarja: "Tarja",
    video_sub: "Video+Leg", video_only: "Video",
  };
  return labels[type] || type;
}

function getItemDesc(item) {
  if (item.tarja_title) return item.tarja_title + (item.tarja_subtitle ? " | " + item.tarja_subtitle : "");
  if (item.url) return item.url;
  return item.description || item.type;
}

function renderItemsList(containerId, items, withCheckbox) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  let currentBlock = "";
  items.forEach(item => {
    // Block header
    if (item.news_block && item.news_block !== currentBlock) {
      currentBlock = item.news_block;
      const header = document.createElement("div");
      header.className = "block-header";
      header.textContent = currentBlock;
      container.appendChild(header);
    }

    const row = document.createElement("div");
    row.className = "item-row";
    row.id = "item-" + item.id;

    let html = "";
    if (withCheckbox) {
      html += `<input type="checkbox" data-id="${item.id}" ${item.enabled ? "checked" : ""} onchange="toggleItem('${item.id}', this.checked)" />`;
    }
    html += `<span class="item-badge ${getBadgeClass(item.type)}">${getBadgeLabel(item.type)}</span>`;
    html += `<span class="item-desc" title="${escapeHtml(getItemDesc(item))}">${escapeHtml(getItemDesc(item))}</span>`;

    if (item.timecode) {
      html += `<span class="item-meta">${item.timecode}</span>`;
    }

    html += `<span class="item-status" id="status-${item.id}"></span>`;
    html += `<span class="item-progress" id="progress-${item.id}"></span>`;
    html += `<button class="btn btn--ghost btn--sm item-retry" id="retry-${item.id}" onclick="retryItem('${item.id}')">Retry</button>`;

    row.innerHTML = html;
    container.appendChild(row);
  });

  if (items.length === 0) {
    container.innerHTML = `<p style="color:var(--text-soft); font-size:0.88rem;">Nenhum item detectado.</p>`;
  }
}

function renderSectionItems(containerId, items, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    const noun = type === "tarja" ? "tarja" : type === "slide" ? "slide" : "video";
    container.innerHTML = `<p style="color:var(--text-soft); font-size:0.88rem;">Nenhum ${noun} detectado. Parseie uma pauta primeiro.</p>`;
    return;
  }

  container.innerHTML = "";
  items.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.id = "section-item-" + item.id;
    if (type === "tarja") row.style.cursor = "pointer";

    let html = `<input type="checkbox" data-id="${item.id}" data-section="${type}" ${item.enabled ? "checked" : ""} onchange="toggleSectionItem('${item.id}', '${type}', this.checked)" />`;
    html += `<span class="item-badge ${getBadgeClass(item.type)}">${getBadgeLabel(item.type)}</span>`;
    html += `<span class="item-desc" title="${escapeHtml(getItemDesc(item))}">${escapeHtml(getItemDesc(item))}</span>`;
    if (item.tarja_type) html += `<span class="item-meta">${item.tarja_type}</span>`;
    if (item.timecode) html += `<span class="item-meta">${item.timecode}</span>`;

    // Reorder buttons for slides
    if (type === "slide") {
      const isFirst = idx === 0;
      const isLast = idx === items.length - 1;
      html += `<span class="reorder-btns">`;
      html += `<button class="reorder-btn" onclick="moveSlide('${item.id}', -1)" title="Mover para cima"${isFirst ? " disabled" : ""}>&#9650;</button>`;
      html += `<button class="reorder-btn" onclick="moveSlide('${item.id}', 1)" title="Mover para baixo"${isLast ? " disabled" : ""}>&#9660;</button>`;
      html += `</span>`;
    }

    html += `<span class="item-status" id="sec-status-${item.id}"></span>`;
    html += `<span class="item-progress" id="sec-progress-${item.id}"></span>`;
    html += `<button class="btn btn--ghost btn--sm item-retry" id="sec-retry-${item.id}" onclick="retryItem('${item.id}')">Retry</button>`;

    row.innerHTML = html;

    // Click to edit tarja (but not on checkbox)
    if (type === "tarja") {
      row.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
        openTarjaEdit(item.id);
      });
    }

    container.appendChild(row);
  });
}

// ── Select all / toggle ──
const selectAllCb = document.getElementById("selectAll");

selectAllCb.addEventListener("change", () => {
  const checked = selectAllCb.checked;
  parsedItems.forEach(item => item.enabled = checked);
  document.querySelectorAll('#homeItemsList input[type="checkbox"]').forEach(cb => cb.checked = checked);

  // Sync with section tab checkboxes
  document.querySelectorAll('.tab-panel input[type="checkbox"][data-id]').forEach(cb => cb.checked = checked);

  // Sync with standalone view checkboxes
  document.querySelectorAll('#lowerViewList input[type="checkbox"]').forEach(cb => cb.checked = checked);
  document.querySelectorAll('#slidesViewList input[type="checkbox"]').forEach(cb => cb.checked = checked);
  document.querySelectorAll('#videosViewList input[type="checkbox"]').forEach(cb => cb.checked = checked);

  // Sync section master checkboxes (tabs)
  const selectAllLower = document.getElementById("selectAllLower");
  const selectAllSlides = document.getElementById("selectAllSlides");
  const selectAllVideos = document.getElementById("selectAllVideos");
  if (selectAllLower) selectAllLower.checked = checked;
  if (selectAllSlides) selectAllSlides.checked = checked;
  if (selectAllVideos) selectAllVideos.checked = checked;

  // Sync view master checkboxes
  const lowerViewAll = document.getElementById("lowerViewSelectAll");
  const slidesViewAll = document.getElementById("slidesViewSelectAll");
  const videosViewAll = document.getElementById("videosViewSelectAll");
  if (lowerViewAll) lowerViewAll.checked = checked;
  if (slidesViewAll) slidesViewAll.checked = checked;
  if (videosViewAll) videosViewAll.checked = checked;

  // Update section counts
  updateSectionCount("lower");
  updateSectionCount("slides");
  updateSectionCount("videos");

  updateSelectedCount();
});

function toggleItem(id, checked) {
  const item = parsedItems.find(i => i.id === id);
  if (item) item.enabled = checked;

  // Sync with section tab checkboxes
  const sectionCb = document.querySelector(`.tab-panel input[data-id="${id}"]`);
  if (sectionCb) sectionCb.checked = checked;

  // Sync with view checkboxes
  const viewContainers = ["lowerViewList", "slidesViewList", "videosViewList"];
  for (const cid of viewContainers) {
    const viewCb = document.querySelector(`#${cid} input[data-id="${id}"]`);
    if (viewCb) { viewCb.checked = checked; break; }
  }

  // Update section counts
  if (item) {
    if (item.type === "tarja") updateSectionCount("lower");
    else if (item.type.startsWith("slide_")) updateSectionCount("slides");
    else if (item.type.startsWith("video_")) updateSectionCount("videos");
  }

  updateSelectedCount();
}

function updateSelectedCount() {
  const count = parsedItems.filter(i => i.enabled).length;
  document.getElementById("selectedCount").textContent = `${count} de ${parsedItems.length} selecionados`;
}

function setProcessButtonsEnabled(enabled) {
  const btnProcessLower = document.getElementById("btnProcessLower");
  const btnProcessSlides = document.getElementById("btnProcessSlides");
  const btnProcessVideos = document.getElementById("btnProcessVideos");
  const btnProcessLowerView = document.getElementById("btnProcessLowerView");
  const btnProcessSlidesView = document.getElementById("btnProcessSlidesView");
  const btnProcessVideosView = document.getElementById("btnProcessVideosView");

  btnProcess.disabled = !enabled;
  btnProcessTop.disabled = !enabled;
  if (btnProcessLower) btnProcessLower.disabled = !enabled;
  if (btnProcessSlides) btnProcessSlides.disabled = !enabled;
  if (btnProcessVideos) btnProcessVideos.disabled = !enabled;
  if (btnProcessLowerView) btnProcessLowerView.disabled = !enabled;
  if (btnProcessSlidesView) btnProcessSlidesView.disabled = !enabled;
  if (btnProcessVideosView) btnProcessVideosView.disabled = !enabled;
}

// ── Processing ──
const btnProcess = document.getElementById("btnProcess");
const btnProcessTop = document.getElementById("btnProcessTop");
const btnCancel = document.getElementById("btnCancel");

// Top button triggers same as bottom
btnProcessTop.addEventListener("click", () => btnProcess.click());

btnProcess.addEventListener("click", async () => {
  const enabledIds = parsedItems.filter(i => i.enabled).map(i => i.id);
  if (enabledIds.length === 0) return;

  isProcessing = true;
  setProcessButtonsEnabled(false);
  document.getElementById("home-progress").style.display = "";
  document.getElementById("processSummary").style.display = "none";

  // Copy items to progress list
  const enabledItems = parsedItems.filter(i => i.enabled);
  renderItemsList("progressItemsList", enabledItems, false);

  // Reset progress bar
  setGlobalProgress(0);

  try {
    await api().start_processing(enabledIds);
    startPolling();
  } catch (e) {
    showParseStatus("Erro ao iniciar: " + (e.message || e), "err");
    isProcessing = false;
    setProcessButtonsEnabled(true);
  }
});

btnCancel.addEventListener("click", async () => {
  try {
    await api().cancel_processing();
  } catch (e) { /* ignore */ }
});

// ── Event polling ──
function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(pollEvents, 200);
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}

async function pollEvents() {
  if (!api() || !isProcessing) return;
  try {
    const events = await api().poll_events();
    if (!events || events.length === 0) return;
    events.forEach(handleEvent);
  } catch (e) { /* ignore polling errors */ }
}

function handleEvent(evt) {
  const statusEl = document.getElementById("status-" + evt.instruction_id);
  const progressEl = document.getElementById("progress-" + evt.instruction_id);
  const retryEl = document.getElementById("retry-" + evt.instruction_id);
  const secStatusEl = document.getElementById("sec-status-" + evt.instruction_id);
  const secProgressEl = document.getElementById("sec-progress-" + evt.instruction_id);
  const viewStatusEl = document.getElementById("view-status-" + evt.instruction_id);
  const viewProgressEl = document.getElementById("view-progress-" + evt.instruction_id);

  switch (evt.type) {
    case "progress":
      if (statusEl) statusEl.textContent = "\u2699\uFE0F";
      if (progressEl) progressEl.textContent = Math.round((evt.progress || 0) * 100) + "%";
      if (secStatusEl) secStatusEl.textContent = "\u2699\uFE0F";
      if (secProgressEl) secProgressEl.textContent = Math.round((evt.progress || 0) * 100) + "%";
      if (viewStatusEl) viewStatusEl.textContent = "\u2699\uFE0F";
      if (viewProgressEl) viewProgressEl.textContent = Math.round((evt.progress || 0) * 100) + "%";
      break;

    case "completed":
      if (statusEl) statusEl.textContent = "\u2705";
      if (progressEl) progressEl.textContent = "OK";
      if (progressEl) progressEl.style.color = "var(--ok)";
      if (secStatusEl) secStatusEl.textContent = "\u2705";
      if (secProgressEl) { secProgressEl.textContent = "OK"; secProgressEl.style.color = "var(--ok)"; }
      if (viewStatusEl) viewStatusEl.textContent = "\u2705";
      if (viewProgressEl) { viewProgressEl.textContent = "OK"; viewProgressEl.style.color = "var(--ok)"; }
      updateGlobalProgress();
      break;

    case "error":
      if (statusEl) statusEl.textContent = "\u274C";
      if (progressEl) { progressEl.textContent = evt.message || "Erro"; progressEl.style.color = "var(--err)"; }
      if (retryEl) retryEl.style.display = "";
      if (secStatusEl) secStatusEl.textContent = "\u274C";
      if (secProgressEl) { secProgressEl.textContent = evt.message || "Erro"; secProgressEl.style.color = "var(--err)"; }
      if (viewStatusEl) viewStatusEl.textContent = "\u274C";
      if (viewProgressEl) { viewProgressEl.textContent = evt.message || "Erro"; viewProgressEl.style.color = "var(--err)"; }
      updateGlobalProgress();
      break;

    case "all_done":
      isProcessing = false;
      stopPolling();
      setProcessButtonsEnabled(true);
      showProcessSummary(evt.message);
      break;
  }
}

function updateGlobalProgress() {
  const enabled = parsedItems.filter(i => i.enabled);
  const doneIds = new Set();
  document.querySelectorAll("#progressItemsList .item-status").forEach(el => {
    if (el.textContent === "\u2705" || el.textContent === "\u274C") {
      const id = el.id.replace("status-", "");
      doneIds.add(id);
    }
  });
  const pct = enabled.length > 0 ? doneIds.size / enabled.length : 0;
  setGlobalProgress(pct);
}

function setGlobalProgress(pct) {
  document.getElementById("globalProgress").style.width = Math.round(pct * 100) + "%";
  document.getElementById("globalProgressText").textContent = Math.round(pct * 100) + "%";
}

function showProcessSummary(message) {
  const el = document.getElementById("processSummary");
  el.style.display = "";
  el.innerHTML = `<div class="summary__stat">
    <div class="summary__stat-label" style="font-size:0.92rem;">${escapeHtml(message || "Processamento concluido.")}</div>
  </div>`;
}

// ── Retry ──
async function retryItem(id) {
  const retryEl = document.getElementById("retry-" + id);
  if (retryEl) retryEl.style.display = "none";

  const statusEl = document.getElementById("status-" + id);
  const progressEl = document.getElementById("progress-" + id);
  if (statusEl) statusEl.textContent = "\u23F3";
  if (progressEl) { progressEl.textContent = ""; progressEl.style.color = ""; }

  try {
    await api().retry_item(id);
    startPolling();
  } catch (e) {
    if (statusEl) statusEl.textContent = "\u274C";
    if (progressEl) progressEl.textContent = e.message || "Erro";
  }
}

// ── Settings ──
const btnSaveSettings = document.getElementById("btnSaveSettings");
const settingsStatus = document.getElementById("settingsStatus");

// Load settings when settings view is shown
const settingsBtn = document.querySelector('.sidebar__item[data-view="settings"]');
settingsBtn.addEventListener("click", loadSettings);

async function loadSettings() {
  if (!api()) return;
  try {
    const cfg = await api().get_config();
    if (!cfg) return;

    setField("cfg-google-api_key", cfg.google?.api_key);
    setField("cfg-google-credentials_path", cfg.google?.credentials_path);
    setField("cfg-google-token_path", cfg.google?.token_path);
    setField("cfg-google-slides_template_id", cfg.google?.slides_template_id);
    setField("cfg-openai-api_key", cfg.openai?.api_key);
    setField("cfg-paths-output_dir", cfg.paths?.output_dir);
    setField("cfg-paths-font_tarja_bold", cfg.paths?.font_tarja_bold);
    setField("cfg-paths-font_tarja_regular", cfg.paths?.font_tarja_regular);
    setField("cfg-paths-font_tarja_semibold", cfg.paths?.font_tarja_semibold);
    setField("cfg-paths-tarja_template_epoch", cfg.paths?.tarja_template_epoch);
    setField("cfg-paths-tarja_template_cobertura", cfg.paths?.tarja_template_cobertura);

    const qualityEl = document.getElementById("cfg-video-default_quality");
    if (qualityEl && cfg.video?.default_quality) qualityEl.value = cfg.video.default_quality;
  } catch (e) { /* ignore */ }
}

function setField(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

btnSaveSettings.addEventListener("click", async () => {
  const cfg = {
    google: {
      api_key: val("cfg-google-api_key"),
      credentials_path: val("cfg-google-credentials_path"),
      token_path: val("cfg-google-token_path"),
      slides_template_id: val("cfg-google-slides_template_id"),
    },
    openai: {
      api_key: val("cfg-openai-api_key"),
    },
    paths: {
      output_dir: val("cfg-paths-output_dir"),
      font_tarja_bold: val("cfg-paths-font_tarja_bold"),
      font_tarja_regular: val("cfg-paths-font_tarja_regular"),
      font_tarja_semibold: val("cfg-paths-font_tarja_semibold"),
      tarja_template_epoch: val("cfg-paths-tarja_template_epoch"),
      tarja_template_cobertura: val("cfg-paths-tarja_template_cobertura"),
    },
    video: {
      default_quality: val("cfg-video-default_quality"),
    },
  };

  try {
    const result = await api().save_config(cfg);
    settingsStatus.style.display = "";
    settingsStatus.textContent = result?.message || "Salvo!";
    settingsStatus.className = "status-msg status-msg--ok";
    setTimeout(() => { settingsStatus.style.display = "none"; }, 3000);
  } catch (e) {
    settingsStatus.style.display = "";
    settingsStatus.textContent = "Erro: " + (e.message || e);
    settingsStatus.className = "status-msg status-msg--err";
  }
});

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

// ── File/Dir dialogs ──
async function browseFile(fieldId, fileTypes) {
  if (!api()) return;
  try {
    const path = await api().browse_file(fileTypes || "");
    if (path) document.getElementById(fieldId).value = path;
  } catch (e) { /* ignore */ }
}

async function browseDir(fieldId) {
  if (!api()) return;
  try {
    const path = await api().browse_directory();
    if (path) document.getElementById(fieldId).value = path;
  } catch (e) { /* ignore */ }
}

// ── Section select all / toggle ──
function getItemsForSection(section) {
  if (section === "lower") return parsedItems.filter(i => i.type === "tarja");
  if (section === "slides") return parsedItems.filter(i => i.type.startsWith("slide_"));
  if (section === "videos") return parsedItems.filter(i => i.type.startsWith("video_"));
  return [];
}

function toggleSelectAllSection(section, checked) {
  const items = getItemsForSection(section);
  items.forEach(i => i.enabled = checked);
  const containerId = section === "lower" ? "lowerItemsList" : section === "slides" ? "slidesItemsList" : "videosItemsList";
  const viewContainerId = section === "lower" ? "lowerViewList" : section === "slides" ? "slidesViewList" : "videosViewList";
  document.querySelectorAll(`#${containerId} input[type="checkbox"]`).forEach(cb => cb.checked = checked);
  document.querySelectorAll(`#${viewContainerId} input[type="checkbox"]`).forEach(cb => cb.checked = checked);
  // Sync home checkboxes
  items.forEach(i => {
    const homeCb = document.querySelector(`#homeItemsList input[data-id="${i.id}"]`);
    if (homeCb) homeCb.checked = checked;
  });
  updateSectionCount(section);
  updateSelectedCount();
}

function toggleSectionItem(id, section, checked) {
  const item = parsedItems.find(i => i.id === id);
  if (item) item.enabled = checked;
  // Sync home checkbox
  const homeCb = document.querySelector(`#homeItemsList input[data-id="${id}"]`);
  if (homeCb) homeCb.checked = checked;
  // Sync view checkbox
  const viewCb = document.querySelector(`#${section === "lower" ? "lowerViewList" : section === "slides" ? "slidesViewList" : "videosViewList"} input[data-id="${id}"]`);
  if (viewCb) viewCb.checked = checked;
  updateSectionCount(section);
  updateSelectedCount();
}

function updateSectionCount(section) {
  const items = getItemsForSection(section);
  const count = items.filter(i => i.enabled).length;
  const suffix = section.charAt(0).toUpperCase() + section.slice(1);
  const el = document.getElementById("selectedCount" + suffix);
  if (el) el.textContent = `${count} de ${items.length}`;
}

// ── Process by section ──
async function processSection(section) {
  const items = getItemsForSection(section);
  const enabledIds = items.filter(i => i.enabled).map(i => i.id);
  if (enabledIds.length === 0) return;

  isProcessing = true;
  setProcessButtonsEnabled(false);

  document.getElementById("home-progress").style.display = "";
  document.getElementById("processSummary").style.display = "none";
  const enabledItems = items.filter(i => i.enabled);
  renderItemsList("progressItemsList", enabledItems, false);
  setGlobalProgress(0);

  try {
    await api().start_processing(enabledIds);
    startPolling();
  } catch (e) {
    showParseStatus("Erro ao iniciar: " + (e.message || e), "err");
    isProcessing = false;
    setProcessButtonsEnabled(true);
  }
}

// ── Tarja edit ──
function openTarjaEdit(id) {
  const item = parsedItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById("edit-tarja-id").value = id;
  document.getElementById("edit-tarja-title").value = item.tarja_title || "";
  document.getElementById("edit-tarja-subtitle").value = item.tarja_subtitle || "";
  document.getElementById("edit-tarja-type").value = item.tarja_type || "giro";
  document.getElementById("lower-edit").style.display = "";
}

function closeTarjaEdit() {
  document.getElementById("lower-edit").style.display = "none";
}

async function saveTarjaEdit() {
  const id = document.getElementById("edit-tarja-id").value;
  const title = document.getElementById("edit-tarja-title").value.trim();
  const subtitle = document.getElementById("edit-tarja-subtitle").value.trim();
  const tarjaType = document.getElementById("edit-tarja-type").value;

  // Update local state
  const item = parsedItems.find(i => i.id === id);
  const previousState = item ? { title: item.tarja_title, subtitle: item.tarja_subtitle, type: item.tarja_type } : null;

  if (item) {
    item.tarja_title = title;
    item.tarja_subtitle = subtitle;
    item.tarja_type = tarjaType;
  }

  // Update backend
  try {
    const result = await api().update_instruction(id, {
      tarja_title: title,
      tarja_subtitle: subtitle,
      tarja_type: tarjaType,
    });
    if (result && result.status === "error") {
      // Revert local state
      if (item && previousState) {
        item.tarja_title = previousState.title;
        item.tarja_subtitle = previousState.subtitle;
        item.tarja_type = previousState.type;
      }
      showParseStatus("Erro ao salvar edicao: " + result.message, "err");
      return;
    }
  } catch (e) {
    // Revert local state
    if (item && previousState) {
      item.tarja_title = previousState.title;
      item.tarja_subtitle = previousState.subtitle;
      item.tarja_type = previousState.type;
    }
    showParseStatus("Erro ao salvar edicao: " + (e.message || e), "err");
    return;
  }

  // Re-render lower list (tab + view)
  const tarjas = parsedItems.filter(i => i.type === "tarja");
  renderSectionItems("lowerItemsList", tarjas, "tarja");
  renderViewItems("lowerViewList", tarjas, "tarja");
  updateSectionCount("lower");

  // Update home list description
  const homeDesc = document.querySelector(`#item-${id} .item-desc`);
  if (homeDesc) {
    const desc = title + (subtitle ? " | " + subtitle : "");
    homeDesc.textContent = desc;
    homeDesc.title = desc;
  }

  closeTarjaEdit();
}

// ── Utility ──
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ── View-level rendering (standalone sidebar views) ──
function renderViewItems(containerId, items, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    const noun = type === "tarja" ? "tarja" : type === "slide" ? "slide" : "video";
    container.innerHTML = `<p style="color:var(--text-soft); font-size:0.88rem;">Nenhum ${noun} detectado. Parseie uma pauta primeiro.</p>`;
    return;
  }

  container.innerHTML = "";
  items.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.id = "view-item-" + item.id;
    if (type === "tarja") row.style.cursor = "pointer";

    let html = `<input type="checkbox" data-id="${item.id}" data-view-section="${type}" ${item.enabled ? "checked" : ""} onchange="toggleViewItem('${item.id}', '${type}', this.checked)" />`;
    html += `<span class="item-badge ${getBadgeClass(item.type)}">${getBadgeLabel(item.type)}</span>`;
    html += `<span class="item-desc" title="${escapeHtml(getItemDesc(item))}">${escapeHtml(getItemDesc(item))}</span>`;
    if (item.tarja_type) html += `<span class="item-meta">${item.tarja_type}</span>`;
    if (item.timecode) html += `<span class="item-meta">${item.timecode}</span>`;

    // Reorder buttons for slides
    if (type === "slide") {
      const isFirst = idx === 0;
      const isLast = idx === items.length - 1;
      html += `<span class="reorder-btns">`;
      html += `<button class="reorder-btn" onclick="moveSlide('${item.id}', -1)" title="Mover para cima"${isFirst ? " disabled" : ""}>&#9650;</button>`;
      html += `<button class="reorder-btn" onclick="moveSlide('${item.id}', 1)" title="Mover para baixo"${isLast ? " disabled" : ""}>&#9660;</button>`;
      html += `</span>`;
    }

    html += `<span class="item-status" id="view-status-${item.id}"></span>`;
    html += `<span class="item-progress" id="view-progress-${item.id}"></span>`;
    html += `<button class="btn btn--ghost btn--sm item-retry" id="view-retry-${item.id}" onclick="retryItem('${item.id}')">Retry</button>`;

    // Add action buttons for video items (Story 6.4 + 6.5)
    if (type === "video") {
      html += `<button class="btn btn--ghost btn--sm btn--video-action" onclick="openInDownloader('${item.id}', event)" title="Abrir no downloader">Open in Downloader</button>`;
      html += `<button class="btn btn--ghost btn--sm btn--video-action" onclick="openSubtitleEditorForVideo('${item.id}', event)" title="Editar legendas">Edit Subtitles</button>`;
    }

    row.innerHTML = html;

    if (type === "tarja") {
      row.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
        openTarjaViewEdit(item.id);
      });
    }

    container.appendChild(row);
  });
}

// ── Slide reordering ──
function moveSlide(id, direction) {
  const slides = parsedItems.filter(i => i.type.startsWith("slide_"));
  const slideIndex = slides.findIndex(i => i.id === id);
  if (slideIndex < 0) return;

  const targetIndex = slideIndex + direction;
  if (targetIndex < 0 || targetIndex >= slides.length) return;

  // Find positions in the global parsedItems array
  const globalIndexA = parsedItems.findIndex(i => i.id === slides[slideIndex].id);
  const globalIndexB = parsedItems.findIndex(i => i.id === slides[targetIndex].id);

  // Swap in parsedItems
  const temp = parsedItems[globalIndexA];
  parsedItems[globalIndexA] = parsedItems[globalIndexB];
  parsedItems[globalIndexB] = temp;

  // Update order fields to reflect new positions
  const updatedSlides = parsedItems.filter(i => i.type.startsWith("slide_"));
  updatedSlides.forEach((s, idx) => { s.order = idx; });

  // Re-render both slide lists (tab + view)
  renderSectionItems("slidesItemsList", updatedSlides, "slide");
  renderViewItems("slidesViewList", updatedSlides, "slide");

  // Re-render "Todos" tab to reflect new order
  renderItemsList("homeItemsList", parsedItems, true);

  // Preserve section counts
  updateSectionCount("slides");
  updateSelectedCount();
}

function updateBadge(section, count) {
  const badge = document.getElementById("badge-" + section);
  if (badge) {
    badge.textContent = count;
    badge.setAttribute("data-count", count);
  }
}

function toggleSelectAllView(section, checked) {
  const items = getItemsForSection(section);
  items.forEach(i => i.enabled = checked);

  const viewContainerId = section === "lower" ? "lowerViewList" : section === "slides" ? "slidesViewList" : "videosViewList";
  document.querySelectorAll(`#${viewContainerId} input[type="checkbox"]`).forEach(cb => cb.checked = checked);

  // Sync home and tab checkboxes
  items.forEach(i => {
    const homeCb = document.querySelector(`#homeItemsList input[data-id="${i.id}"]`);
    if (homeCb) homeCb.checked = checked;
    const secCb = document.querySelector(`.tab-panel input[data-id="${i.id}"]`);
    if (secCb) secCb.checked = checked;
  });

  updateSectionCount(section);
  updateSelectedCount();
}

function toggleViewItem(id, section, checked) {
  const item = parsedItems.find(i => i.id === id);
  if (item) item.enabled = checked;

  const homeCb = document.querySelector(`#homeItemsList input[data-id="${id}"]`);
  if (homeCb) homeCb.checked = checked;
  const secCb = document.querySelector(`.tab-panel input[data-id="${id}"]`);
  if (secCb) secCb.checked = checked;

  updateSectionCount(section);
  updateSelectedCount();
}

function processView(section) {
  processSection(section);
}

// ── Tarja view edit ──
function openTarjaViewEdit(id) {
  const item = parsedItems.find(i => i.id === id);
  if (!item) return;
  document.getElementById("edit-view-tarja-id").value = id;
  document.getElementById("edit-view-tarja-title").value = item.tarja_title || "";
  document.getElementById("edit-view-tarja-subtitle").value = item.tarja_subtitle || "";
  document.getElementById("edit-view-tarja-type").value = item.tarja_type || "giro";
  document.getElementById("lower-view-edit").style.display = "";
}

function closeTarjaViewEdit() {
  document.getElementById("lower-view-edit").style.display = "none";
}

async function saveTarjaViewEdit() {
  const id = document.getElementById("edit-view-tarja-id").value;
  const title = document.getElementById("edit-view-tarja-title").value.trim();
  const subtitle = document.getElementById("edit-view-tarja-subtitle").value.trim();
  const tarjaType = document.getElementById("edit-view-tarja-type").value;

  const item = parsedItems.find(i => i.id === id);
  const previousState = item ? { title: item.tarja_title, subtitle: item.tarja_subtitle, type: item.tarja_type } : null;

  if (item) {
    item.tarja_title = title;
    item.tarja_subtitle = subtitle;
    item.tarja_type = tarjaType;
  }

  try {
    const result = await api().update_instruction(id, {
      tarja_title: title,
      tarja_subtitle: subtitle,
      tarja_type: tarjaType,
    });
    if (result && result.status === "error") {
      if (item && previousState) {
        item.tarja_title = previousState.title;
        item.tarja_subtitle = previousState.subtitle;
        item.tarja_type = previousState.type;
      }
      showParseStatus("Erro ao salvar edicao: " + result.message, "err");
      return;
    }
  } catch (e) {
    if (item && previousState) {
      item.tarja_title = previousState.title;
      item.tarja_subtitle = previousState.subtitle;
      item.tarja_type = previousState.type;
    }
    showParseStatus("Erro ao salvar edicao: " + (e.message || e), "err");
    return;
  }

  // Re-render all tarja lists
  const tarjas = parsedItems.filter(i => i.type === "tarja");
  renderSectionItems("lowerItemsList", tarjas, "tarja");
  renderViewItems("lowerViewList", tarjas, "tarja");
  updateSectionCount("lower");

  const homeDesc = document.querySelector(`#item-${id} .item-desc`);
  if (homeDesc) {
    const desc = title + (subtitle ? " | " + subtitle : "");
    homeDesc.textContent = desc;
    homeDesc.title = desc;
  }

  closeTarjaViewEdit();
}

// ── Global tarja type ──
let globalTarjaType = "giro";

function onGlobalTarjaTypeChange(value) {
  globalTarjaType = value;

  // Sync both radio groups (tab panel + standalone view)
  document.querySelectorAll('input[name="tarjaTypeGlobal"]').forEach(r => { r.checked = (r.value === value); });
  document.querySelectorAll('input[name="tarjaTypeView"]').forEach(r => { r.checked = (r.value === value); });

  // Apply to all tarja items
  const tarjas = parsedItems.filter(i => i.type === "tarja");
  tarjas.forEach(item => {
    item.tarja_type = value;
    // Update backend via bridge
    if (api()) {
      api().update_instruction(item.id, { tarja_type: value });
    }
  });

  // Notify backend of global type selection
  if (api() && api().set_tarja_type) {
    api().set_tarja_type(value);
  }

  // Re-render tarja lists to show updated type badges
  renderSectionItems("lowerItemsList", tarjas, "tarja");
  renderViewItems("lowerViewList", tarjas, "tarja");
  updateSectionCount("lower");
}

// ── Video Downloader Standalone ──

// State
let isDownloading = false;
let downloadPollTimer = null;
let currentDownloadInstructionId = null; // Story 6.5: Track pauta instruction being downloaded

// Toggle form visibility
function toggleDownloadForm() {
  const container = document.getElementById("download-form-container");
  const btn = document.getElementById("btnToggleDownloadForm");
  if (container.style.display === "none") {
    container.style.display = "";
    btn.textContent = "Recolher";
  } else {
    container.style.display = "none";
    btn.textContent = "Expandir";
  }
}

// Browse for local video file
async function browseVideoFile() {
  if (!api() || !api().browse_file) return;
  try {
    const path = await api().browse_file("Video (*.mp4;*.mkv;*.avi;*.mov;*.webm)");
    if (path) {
      document.getElementById("download-url").value = path;
    }
  } catch (e) {
    console.error("Error browsing file:", e);
  }
}

// Toggle clip inputs enable/disable
function toggleClipInputs(clipNum) {
  const checkbox = document.getElementById(`clip${clipNum}-enable`);
  const start = document.getElementById(`clip${clipNum}-start`);
  const end = document.getElementById(`clip${clipNum}-end`);
  const repeat = document.getElementById(`clip${clipNum}-repeat`);

  const enabled = checkbox.checked;
  start.disabled = !enabled;
  end.disabled = !enabled;
  repeat.disabled = !enabled;

  // Update merge checkbox availability
  updateMergeCheckboxState();
}

// Update merge checkbox (enabled when 2+ clips configured)
function updateMergeCheckboxState() {
  const clip1Enabled = true; // Clip 1 always enabled
  const clip2Enabled = document.getElementById("clip2-enable").checked;
  const clip3Enabled = document.getElementById("clip3-enable").checked;

  const enabledCount = [clip1Enabled, clip2Enabled, clip3Enabled].filter(Boolean).length;
  const mergeCheckbox = document.getElementById("download-merge");

  if (enabledCount >= 2) {
    mergeCheckbox.disabled = false;
  } else {
    mergeCheckbox.disabled = true;
    mergeCheckbox.checked = false;
  }
}

// Validate MMSS time format
function validateMMSS(value) {
  if (!value || value.length !== 4) return false;
  if (!/^\d{4}$/.test(value)) return false;

  const mm = parseInt(value.substring(0, 2), 10);
  const ss = parseInt(value.substring(2, 4), 10);

  if (mm < 0 || mm > 99) return false;
  if (ss < 0 || ss > 59) return false;

  return true;
}

// Start standalone download
async function startStandaloneDownload() {
  const url = document.getElementById("download-url").value.trim();
  if (!url) {
    showDownloadStatus("Insira uma URL ou selecione um arquivo.", "err");
    return;
  }

  // Validate clip 1 times if provided
  const clip1Start = document.getElementById("clip1-start").value.trim();
  const clip1End = document.getElementById("clip1-end").value.trim();

  if (clip1Start && !validateMMSS(clip1Start)) {
    showDownloadStatus("Clip 1 - Inicio invalido. Use formato MMSS (ex: 0130 para 1m30s).", "err");
    return;
  }
  if (clip1End && !validateMMSS(clip1End)) {
    showDownloadStatus("Clip 1 - Fim invalido. Use formato MMSS (ex: 0230 para 2m30s).", "err");
    return;
  }

  // Validate clip 2 if enabled
  if (document.getElementById("clip2-enable").checked) {
    const clip2Start = document.getElementById("clip2-start").value.trim();
    const clip2End = document.getElementById("clip2-end").value.trim();
    if (!clip2Start || !validateMMSS(clip2Start)) {
      showDownloadStatus("Clip 2 - Inicio invalido ou vazio.", "err");
      return;
    }
    if (!clip2End || !validateMMSS(clip2End)) {
      showDownloadStatus("Clip 2 - Fim invalido ou vazio.", "err");
      return;
    }
  }

  // Validate clip 3 if enabled
  if (document.getElementById("clip3-enable").checked) {
    const clip3Start = document.getElementById("clip3-start").value.trim();
    const clip3End = document.getElementById("clip3-end").value.trim();
    if (!clip3Start || !validateMMSS(clip3Start)) {
      showDownloadStatus("Clip 3 - Inicio invalido ou vazio.", "err");
      return;
    }
    if (!clip3End || !validateMMSS(clip3End)) {
      showDownloadStatus("Clip 3 - Fim invalido ou vazio.", "err");
      return;
    }
  }

  // Build params
  const params = {
    url: url,
    quality: document.getElementById("download-quality").value,
    clips: [],
    merge: document.getElementById("download-merge").checked,
    video_only: document.getElementById("download-video-only").checked,
    custom_name: document.getElementById("download-custom-name").value.trim() || null,
    instruction_id: currentDownloadInstructionId || null,
  };

  // Clip 1
  if (clip1Start && clip1End) {
    params.clips.push({
      start: clip1Start,
      end: clip1End,
      repeat: parseInt(document.getElementById("clip1-repeat").value, 10) || 1,
    });
  }

  // Clip 2
  if (document.getElementById("clip2-enable").checked) {
    params.clips.push({
      start: document.getElementById("clip2-start").value.trim(),
      end: document.getElementById("clip2-end").value.trim(),
      repeat: parseInt(document.getElementById("clip2-repeat").value, 10) || 1,
    });
  }

  // Clip 3
  if (document.getElementById("clip3-enable").checked) {
    params.clips.push({
      start: document.getElementById("clip3-start").value.trim(),
      end: document.getElementById("clip3-end").value.trim(),
      repeat: parseInt(document.getElementById("clip3-repeat").value, 10) || 1,
    });
  }

  // Call bridge
  const pyApi = api();
  if (!pyApi || !pyApi.download_video) {
    showDownloadStatus("API nao disponivel.", "err");
    return;
  }

  document.getElementById("btnStartDownload").disabled = true;
  showDownloadStatus("Iniciando download...", "");
  document.getElementById("download-progress-container").style.display = "";
  setDownloadProgress(0, "Preparando...");
  isDownloading = true;

  try {
    const result = await pyApi.download_video(params);
    if (result.status === "error") {
      showDownloadStatus(result.message, "err");
      isDownloading = false;
      document.getElementById("btnStartDownload").disabled = false;
    } else {
      // Start polling for progress
      startDownloadPolling();
    }
  } catch (e) {
    showDownloadStatus("Erro: " + (e.message || e), "err");
    isDownloading = false;
    document.getElementById("btnStartDownload").disabled = false;
  }
}

// Download polling
function startDownloadPolling() {
  if (downloadPollTimer) clearInterval(downloadPollTimer);
  downloadPollTimer = setInterval(pollDownloadEvents, 200);
}

function stopDownloadPolling() {
  if (downloadPollTimer) {
    clearInterval(downloadPollTimer);
    downloadPollTimer = null;
  }
}

async function pollDownloadEvents() {
  if (!api() || !isDownloading) return;
  try {
    const events = await api().poll_events();
    if (!events || events.length === 0) return;
    events.forEach(handleDownloadEvent);
  } catch (e) {
    // Ignore polling errors
  }
}

function handleDownloadEvent(evt) {
  // Filter: only handle events for standalone download or linked instruction
  const expectedId = currentDownloadInstructionId || "standalone_download";
  if (evt.instruction_id !== expectedId) return;

  // Event types match EventType enum values: "progress", "completed", "error"
  if (evt.type === "progress") {
    const pct = Math.round((evt.progress || 0) * 100);
    setDownloadProgress(pct / 100, evt.message || `Baixando... ${pct}%`);

    // Update video item status in Videos view (Story 6.5)
    if (currentDownloadInstructionId) {
      updateVideoItemStatus(currentDownloadInstructionId, "processing", evt.message);
    }
  } else if (evt.type === "completed") {
    setDownloadProgress(1, "Download concluido!");
    showDownloadStatus("Download concluido com sucesso.", "ok");
    isDownloading = false;
    stopDownloadPolling();
    document.getElementById("btnStartDownload").disabled = false;

    // Bidirectional status sync (Story 6.5)
    if (currentDownloadInstructionId) {
      syncInstructionStatus(currentDownloadInstructionId, "completed", evt.output_path);
      updateVideoItemStatus(currentDownloadInstructionId, "completed", "OK");
      currentDownloadInstructionId = null;
    }

    // Refresh history
    loadDownloadHistory();
  } else if (evt.type === "error") {
    setDownloadProgress(0, "Erro");
    showDownloadStatus(evt.message || "Erro no download.", "err");
    isDownloading = false;
    stopDownloadPolling();
    document.getElementById("btnStartDownload").disabled = false;

    // Bidirectional status sync (Story 6.5)
    if (currentDownloadInstructionId) {
      syncInstructionStatus(currentDownloadInstructionId, "error", null);
      updateVideoItemStatus(currentDownloadInstructionId, "error", evt.message || "Erro");
      currentDownloadInstructionId = null;
    }

    // Refresh history
    loadDownloadHistory();
  }
}

function setDownloadProgress(pct, statusText) {
  document.getElementById("downloadProgress").style.width = Math.round(pct * 100) + "%";
  document.getElementById("downloadProgressText").textContent = Math.round(pct * 100) + "%";
  document.getElementById("downloadStatus").textContent = statusText;
}

function showDownloadStatus(msg, level) {
  const el = document.getElementById("downloadStatus");
  el.textContent = msg;
  el.className = "status-msg" + (level ? " status-msg--" + level : "");
  el.style.display = "";
}

// Load download history
async function loadDownloadHistory() {
  const pyApi = api();
  if (!pyApi || !pyApi.get_download_history) return;

  try {
    const history = await pyApi.get_download_history();
    renderDownloadHistory(history || []);
  } catch (e) {
    console.error("Error loading download history:", e);
  }
}

// Render download history
function renderDownloadHistory(history) {
  const container = document.getElementById("download-history-list");
  if (!history || history.length === 0) {
    container.innerHTML = `<p style="color:var(--text-soft); font-size:0.85rem;">Nenhum download realizado ainda.</p>`;
    return;
  }

  container.innerHTML = "";
  history.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    const statusClass = item.status === "completed" ? "ok" : item.status === "error" ? "error" : "progress";
    const statusLabel = item.status === "completed" ? "OK" : item.status === "error" ? "ERRO" : "Em andamento";

    div.innerHTML = `
      <span class="history-item__filename" title="${escapeHtml(item.filename)}">${escapeHtml(item.filename)}</span>
      <span class="history-item__timestamp">${formatTimestamp(item.timestamp)}</span>
      <span class="history-item__status history-item__status--${statusClass}">${statusLabel}</span>
    `;

    container.appendChild(div);
  });
}

// Format timestamp
function formatTimestamp(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (e) {
    return "";
  }
}

// Load history when Videos view is shown
const videosBtn = document.querySelector('.sidebar__item[data-view="videos"]');
if (videosBtn) {
  videosBtn.addEventListener("click", () => {
    setTimeout(loadDownloadHistory, 100);
  });
}

// ── Subtitle Editor ──
let currentSRTPath = null;
let currentVideoPath = null;
let subtitleEntries = [];
let currentSubtitleStyle = {
  font_size: 21,
  bold: true,
  color: "#ffffff",
  outline_width: 2,
  position: "bottom"
};

// Open subtitle editor for a video item (from UI)
async function openSubtitleEditorForVideo(itemId, event) {
  if (event) event.stopPropagation();

  const pyApi = api();
  if (!pyApi) {
    alert("API nao disponivel.");
    return;
  }

  try {
    // Story 6.5: Try tracked output paths first
    if (pyApi.get_output_paths) {
      const paths = await pyApi.get_output_paths(itemId);
      if (paths.status === "ok" && paths.srt) {
        openSubtitleEditor(paths.srt);
        return;
      }
    }

    // Fallback: prompt user to select the SRT file
    const srtPath = await pyApi.browse_file("SRT (*.srt)");
    if (!srtPath) return; // User cancelled

    openSubtitleEditor(srtPath);
  } catch (e) {
    alert("Erro: " + (e.message || e));
  }
}

// Open subtitle editor
async function openSubtitleEditor(srtPath) {
  const pyApi = api();
  if (!pyApi) {
    alert("API nao disponivel.");
    return;
  }

  try {
    // Load SRT
    const srtResult = await pyApi.load_srt(srtPath);
    if (srtResult.status !== "ok") {
      alert("Erro ao carregar SRT: " + srtResult.message);
      return;
    }

    // Get video path
    const videoResult = await pyApi.get_video_path_for_srt(srtPath);
    if (videoResult.status !== "ok") {
      alert("Erro ao obter path do video: " + videoResult.message);
      return;
    }

    // Store paths and entries
    currentSRTPath = srtPath;
    currentVideoPath = videoResult.video_path;
    subtitleEntries = srtResult.entries;

    // Load video
    const videoElement = document.getElementById("subtitle-video");
    const sourceElement = document.getElementById("subtitle-video-source");

    // Convert Windows path to file:// URL
    const fileUrl = "file:///" + currentVideoPath.replace(/\\/g, "/");
    sourceElement.src = fileUrl;
    videoElement.load();

    // Render subtitle entries
    renderSubtitleEntries();

    // Setup video timeupdate listener
    videoElement.addEventListener("timeupdate", onVideoTimeUpdate);

    // Show modal
    document.getElementById("subtitle-editor-modal").style.display = "";

    // Update counter
    document.getElementById("subtitle-count").textContent = subtitleEntries.length;

  } catch (e) {
    alert("Erro: " + (e.message || e));
  }
}

// Close subtitle editor
function closeSubtitleEditor() {
  const modal = document.getElementById("subtitle-editor-modal");
  modal.style.display = "none";

  // Stop video
  const video = document.getElementById("subtitle-video");
  video.pause();
  video.currentTime = 0;
  video.removeEventListener("timeupdate", onVideoTimeUpdate);

  // Clear overlay
  document.getElementById("subtitle-overlay").textContent = "";

  // Reset state
  currentSRTPath = null;
  currentVideoPath = null;
  subtitleEntries = [];
}

// Render subtitle entries in the list
function renderSubtitleEntries() {
  const container = document.getElementById("subtitle-entries-list");
  if (!subtitleEntries || subtitleEntries.length === 0) {
    container.innerHTML = '<p style="color:var(--text-soft); font-size:0.85rem;">Nenhuma legenda encontrada.</p>';
    return;
  }

  container.innerHTML = "";
  subtitleEntries.forEach((entry, idx) => {
    const div = document.createElement("div");
    div.className = "subtitle-entry";
    div.dataset.index = idx;

    const startTime = formatSRTTimestamp(entry.start_seconds);
    const endTime = formatSRTTimestamp(entry.end_seconds);

    div.innerHTML = `
      <div class="subtitle-entry__header">
        <span class="subtitle-entry__index">#${entry.index}</span>
        <span class="subtitle-entry__timecode">${startTime} → ${endTime}</span>
      </div>
      <textarea class="subtitle-entry__text-input" data-idx="${idx}">${escapeHtml(entry.text)}</textarea>
    `;

    // Click to seek
    div.addEventListener("click", () => {
      const video = document.getElementById("subtitle-video");
      video.currentTime = entry.start_seconds;
    });

    // Update text on change
    const textarea = div.querySelector("textarea");
    textarea.addEventListener("input", (e) => {
      subtitleEntries[idx].text = e.target.value;
    });

    container.appendChild(div);
  });
}

// Format seconds to SRT timestamp HH:MM:SS,mmm
function formatSRTTimestamp(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

// Video timeupdate handler — highlight current subtitle
function onVideoTimeUpdate() {
  const video = document.getElementById("subtitle-video");
  const currentTime = video.currentTime;

  // Find current entry
  let currentEntry = null;
  let currentIdx = -1;
  for (let i = 0; i < subtitleEntries.length; i++) {
    const e = subtitleEntries[i];
    if (currentTime >= e.start_seconds && currentTime <= e.end_seconds) {
      currentEntry = e;
      currentIdx = i;
      break;
    }
  }

  // Update overlay
  const overlay = document.getElementById("subtitle-overlay");
  if (currentEntry) {
    overlay.textContent = currentEntry.text;
  } else {
    overlay.textContent = "";
  }

  // Highlight entry in list
  const entries = document.querySelectorAll(".subtitle-entry");
  entries.forEach((div, idx) => {
    if (idx === currentIdx) {
      div.classList.add("active");
    } else {
      div.classList.remove("active");
    }
  });
}

// Video speed controls
function setVideoSpeed(speed) {
  const video = document.getElementById("subtitle-video");
  video.playbackRate = speed;
}

// Update font size
function updateFontSize(value) {
  currentSubtitleStyle.font_size = parseInt(value);
  document.getElementById("font-size-value").textContent = value;
  applyStyleToOverlay();
}

// Update font color
function updateFontColor(value) {
  currentSubtitleStyle.color = value;
  applyStyleToOverlay();
}

// Update outline
function updateOutline(checked) {
  currentSubtitleStyle.outline_width = checked ? 2 : 0;
  applyStyleToOverlay();
}

// Update bold
function updateBold(checked) {
  currentSubtitleStyle.bold = checked;
  applyStyleToOverlay();
}

// Update position
function updatePosition(value) {
  currentSubtitleStyle.position = value;
  const overlay = document.getElementById("subtitle-overlay");
  if (value === "top") {
    overlay.classList.add("position-top");
  } else {
    overlay.classList.remove("position-top");
  }
}

// Apply current style to overlay
function applyStyleToOverlay() {
  const overlay = document.getElementById("subtitle-overlay");
  overlay.style.fontSize = currentSubtitleStyle.font_size + "px";
  overlay.style.color = currentSubtitleStyle.color;
  overlay.style.fontWeight = currentSubtitleStyle.bold ? "bold" : "normal";

  if (currentSubtitleStyle.outline_width > 0) {
    const w = currentSubtitleStyle.outline_width;
    overlay.style.textShadow = `
      -${w}px -${w}px 0 #000,
       ${w}px -${w}px 0 #000,
      -${w}px  ${w}px 0 #000,
       ${w}px  ${w}px 0 #000
    `;
  } else {
    overlay.style.textShadow = "none";
  }
}

// Save SRT
async function saveSRT() {
  const pyApi = api();
  if (!pyApi || !currentSRTPath) {
    alert("Nenhum SRT carregado.");
    return;
  }

  const statusEl = document.getElementById("subtitle-action-status");
  statusEl.style.display = "";
  statusEl.textContent = "Salvando...";
  statusEl.className = "status-msg";

  try {
    const result = await pyApi.save_srt(currentSRTPath, subtitleEntries);
    if (result.status === "ok") {
      statusEl.textContent = "SRT salvo com sucesso!";
      statusEl.className = "status-msg status-msg--ok";
      setTimeout(() => { statusEl.style.display = "none"; }, 3000);
    } else {
      statusEl.textContent = "Erro: " + result.message;
      statusEl.className = "status-msg status-msg--err";
    }
  } catch (e) {
    statusEl.textContent = "Erro: " + (e.message || e);
    statusEl.className = "status-msg status-msg--err";
  }
}

// Embed subtitles
async function embedSubtitles() {
  const pyApi = api();
  if (!pyApi || !currentSRTPath || !currentVideoPath) {
    alert("Nenhum video/SRT carregado.");
    return;
  }

  // Convert color to ASS BGR format
  const hexColor = currentSubtitleStyle.color;
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const assColor = `&H00${b.toString(16).padStart(2, '0').toUpperCase()}${g.toString(16).padStart(2, '0').toUpperCase()}${r.toString(16).padStart(2, '0').toUpperCase()}`;

  const style = {
    font_size: currentSubtitleStyle.font_size,
    bold: currentSubtitleStyle.bold,
    color: assColor,
    outline_width: currentSubtitleStyle.outline_width,
    position: currentSubtitleStyle.position
  };

  // Show progress container
  const progressContainer = document.getElementById("subtitle-embed-progress");
  const progressBar = document.getElementById("subtitleEmbedProgress");
  const progressText = document.getElementById("subtitleEmbedProgressText");
  const statusEl = document.getElementById("subtitleEmbedStatus");

  progressContainer.style.display = "";
  progressBar.style.width = "0%";
  progressText.textContent = "0%";
  statusEl.textContent = "Iniciando...";
  statusEl.className = "status-msg";

  try {
    const result = await pyApi.embed_subtitles_standalone(currentVideoPath, currentSRTPath, style);
    if (result.status !== "ok") {
      statusEl.textContent = "Erro: " + result.message;
      statusEl.className = "status-msg status-msg--err";
      return;
    }

    // Poll for progress
    const pollInterval = setInterval(async () => {
      const events = await pyApi.poll_events();
      events.forEach(evt => {
        if (evt.instruction_id !== "subtitle_embed") return;

        if (evt.type === "embed_progress") {
          const pct = Math.round(evt.progress * 100);
          progressBar.style.width = pct + "%";
          progressText.textContent = pct + "%";
          statusEl.textContent = evt.message;
        } else if (evt.type === "embed_complete") {
          clearInterval(pollInterval);
          progressBar.style.width = "100%";
          progressText.textContent = "100%";
          statusEl.textContent = evt.message;
          statusEl.className = "status-msg status-msg--ok";
          setTimeout(() => { progressContainer.style.display = "none"; }, 5000);
        } else if (evt.type === "embed_error") {
          clearInterval(pollInterval);
          statusEl.textContent = "Erro: " + evt.message;
          statusEl.className = "status-msg status-msg--err";
        }
      });
    }, 200);

  } catch (e) {
    statusEl.textContent = "Erro: " + (e.message || e);
    statusEl.className = "status-msg status-msg--err";
  }
}

// ── Pauta Integration — Video Items to Downloader (Story 6.5) ──

// Open a parsed video item in the download form with pre-filled fields
function openInDownloader(itemId, event) {
  if (event) event.stopPropagation();

  const item = parsedItems.find(i => i.id === itemId);
  if (!item) return;

  // Navigate to Videos sidebar view
  showView("videos");

  // Pre-fill and expand the download form
  prefillDownloadForm(item);

  // Scroll the form into view
  const formContainer = document.getElementById("download-form-container");
  if (formContainer) {
    formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Reset download form to default state
function resetDownloadForm() {
  document.getElementById("download-url").value = "";
  document.getElementById("download-custom-name").value = "";
  document.getElementById("download-video-only").checked = false;
  document.getElementById("clip1-start").value = "";
  document.getElementById("clip1-end").value = "";
  document.getElementById("clip1-repeat").value = "1";

  // Disable and reset clip 2
  const clip2Enable = document.getElementById("clip2-enable");
  clip2Enable.checked = false;
  document.getElementById("clip2-start").value = "";
  document.getElementById("clip2-end").value = "";
  document.getElementById("clip2-repeat").value = "1";
  document.getElementById("clip2-start").disabled = true;
  document.getElementById("clip2-end").disabled = true;
  document.getElementById("clip2-repeat").disabled = true;

  // Disable and reset clip 3
  const clip3Enable = document.getElementById("clip3-enable");
  clip3Enable.checked = false;
  document.getElementById("clip3-start").value = "";
  document.getElementById("clip3-end").value = "";
  document.getElementById("clip3-repeat").value = "1";
  document.getElementById("clip3-start").disabled = true;
  document.getElementById("clip3-end").disabled = true;
  document.getElementById("clip3-repeat").disabled = true;

  // Reset merge
  document.getElementById("download-merge").checked = false;
  document.getElementById("download-merge").disabled = true;

  // Clear instruction link
  currentDownloadInstructionId = null;
}

// Pre-fill download form from a parsed instruction item
function prefillDownloadForm(item) {
  // Reset first
  resetDownloadForm();

  // Expand form if collapsed
  const container = document.getElementById("download-form-container");
  container.style.display = "";
  const toggleBtn = document.getElementById("btnToggleDownloadForm");
  if (toggleBtn) toggleBtn.textContent = "Recolher";

  // URL
  document.getElementById("download-url").value = item.url || "";

  // Video only flag
  document.getElementById("download-video-only").checked = (item.type === "video_only");

  // Clip 1 from timecode
  if (item.timecode_start) {
    document.getElementById("clip1-start").value = item.timecode_start;
  }
  if (item.timecode_end) {
    document.getElementById("clip1-end").value = item.timecode_end;
  }

  // Multi-clip from clips array
  if (item.clips && item.clips.length > 0) {
    // Clip 1 from first clip
    const clip0 = item.clips[0];
    if (clip0.start) document.getElementById("clip1-start").value = clip0.start;
    if (clip0.end) document.getElementById("clip1-end").value = clip0.end;

    // Clip 2
    if (item.clips.length >= 2) {
      const clip1 = item.clips[1];
      document.getElementById("clip2-enable").checked = true;
      document.getElementById("clip2-start").disabled = false;
      document.getElementById("clip2-end").disabled = false;
      document.getElementById("clip2-repeat").disabled = false;
      if (clip1.start) document.getElementById("clip2-start").value = clip1.start;
      if (clip1.end) document.getElementById("clip2-end").value = clip1.end;
    }

    // Clip 3
    if (item.clips.length >= 3) {
      const clip2 = item.clips[2];
      document.getElementById("clip3-enable").checked = true;
      document.getElementById("clip3-start").disabled = false;
      document.getElementById("clip3-end").disabled = false;
      document.getElementById("clip3-repeat").disabled = false;
      if (clip2.start) document.getElementById("clip3-start").value = clip2.start;
      if (clip2.end) document.getElementById("clip3-end").value = clip2.end;
    }
  }

  // Merge
  document.getElementById("download-merge").checked = item.merge || false;
  updateMergeCheckboxState();

  // Store instruction ID for bidirectional sync
  currentDownloadInstructionId = item.id;
}

// Sync instruction status back to Python bridge
async function syncInstructionStatus(instructionId, status, outputPath) {
  const pyApi = api();
  if (!pyApi || !pyApi.update_instruction_status) return;

  try {
    await pyApi.update_instruction_status(instructionId, status, outputPath || null);
  } catch (e) {
    console.error("Error syncing instruction status:", e);
  }
}

// Update video item status display in Videos view
function updateVideoItemStatus(instructionId, status, message) {
  const statusEl = document.getElementById("view-status-" + instructionId);
  const progressEl = document.getElementById("view-progress-" + instructionId);

  if (status === "processing") {
    if (statusEl) statusEl.textContent = "\u2699\uFE0F";
    if (progressEl) { progressEl.textContent = message || ""; progressEl.style.color = ""; }
  } else if (status === "completed") {
    if (statusEl) statusEl.textContent = "\u2705";
    if (progressEl) { progressEl.textContent = message || "OK"; progressEl.style.color = "var(--ok)"; }
  } else if (status === "error") {
    if (statusEl) statusEl.textContent = "\u274C";
    if (progressEl) { progressEl.textContent = message || "Erro"; progressEl.style.color = "var(--err)"; }
  }
}

// ── Initialization ──
window.addEventListener('pywebviewready', () => {
  btnParse.disabled = false;
  btnParseText.disabled = false;

  // Initialize merge checkbox state
  updateMergeCheckboxState();
});
