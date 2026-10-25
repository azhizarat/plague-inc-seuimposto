// ==UserScript==
// @name         Plague Inc. Brasil 2026 - SeuImposto (#presidente)
// @namespace    https://seuimposto.com/
// @version      1.1.0
// @description  Transforma a apuração presidencial de seuimposto.com em uma partida de Plague Inc. (☣️ Infecção Vermelha vs 🧪 Cura Azul)
// @author       Antigravity
// @match        https://seuimposto.com/*
// @downloadURL  https://raw.githubusercontent.com/azhizarat/plague-inc-seuimposto/main/plague-inc-seuimposto.user.js
// @updateURL    https://raw.githubusercontent.com/azhizarat/plague-inc-seuimposto/main/plague-inc-seuimposto.user.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const BIOHAZARD_SVG = `<svg viewBox="0 0 100 100" width="18" height="18" fill="currentColor"><circle cx="50" cy="50" r="9"/><path d="M50 10a22 22 0 0 0-19 33c5-3 11-5 19-5s14 2 19 5a22 22 0 0 0-19-33zm-34 58a22 22 0 0 0 38 11c-2-5-3-12 0-19-4-7-10-11-19-11a22 22 0 0 0-19 19zm68 0a22 22 0 0 0-19-19c-9 0-15 4-19 11 3 7 2 14 0 19a22 22 0 0 0 38-11z"/><circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="18 14"/></svg>`;
  const CURE_FLASK_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 2h6v2h-1v3.3l4.6 8.3A3.5 3.5 0 0 1 15.5 21h-7a3.5 3.5 0 0 1-3.1-5.4L10 7.3V4H9V2zm3 9.5L8.2 18h7.6L12 11.5z"/></svg>`;

  const HEADLINES = [
    '☣️ OMS declara estado de emergência fiscal após mutação da Cepa L-13 no Planalto',
    '🧪 Laboratórios F-22 aceleram testes clínicos de contenção antes das 17h',
    '🚢 Groenlândia e Madagascar fecham todos os portos até o fim da apuração do TSE',
    '🧬 Nova transmissão via "Imposto Sindical Aéreo" aumenta infectividade em 40%',
    '🏥 Cientistas alertam: 158,7 milhões de hospedeiros expostos às urnas eletrônicas',
    '⚠️ Sintoma "Refrigeração de Picanha" sofre mutação espontânea para "Taxa das Blusinhas"',
    '🧪 Equipe de Cura F-22 solicita bloqueio de fronteiras no Sudeste e Sul'
  ];

  let dnaPoints = 13;

  // 1. Patch global data objects used by Preact
  function patchGlobals() {
    if (window.LOGOS_PARTIDOS) {
      window.LOGOS_PARTIDOS.PT = BIOHAZARD_SVG;
      window.LOGOS_PARTIDOS.PL = CURE_FLASK_SVG;
    }
    if (window.PARTIDOS) {
      if (window.PARTIDOS.PT) {
        Object.assign(window.PARTIDOS.PT, {
          sg: '☣️ CEPA-13',
          nome: 'Patógeno Vermelho (Infectados)',
          cor: '#ff1e27',
          txt: '#ff3b42',
          deep: '#5c0005'
        });
      }
      if (window.PARTIDOS.PL) {
        Object.assign(window.PARTIDOS.PL, {
          sg: '🧪 CURA-22',
          nome: 'Esforço Global de Cura',
          cor: '#00a8ff',
          txt: '#38b6ff',
          deep: '#003566'
        });
      }
    }
  }

  // 2. Inject Plague Inc. HUD CSS via Constructable Stylesheets (bypasses strict style-src CSP)
  const cssText = `
    :root {
      --bg: #080506 !important;
      --panel: rgba(18, 10, 12, 0.92) !important;
      --panel-2: rgba(28, 14, 17, 0.95) !important;
      --panel-3: rgba(42, 18, 22, 0.95) !important;
      --glass: rgba(16, 9, 11, 0.94) !important;
      --line: rgba(255, 42, 55, 0.22) !important;
      --line-2: rgba(255, 42, 55, 0.38) !important;
      --line-3: rgba(0, 168, 255, 0.45) !important;
      --apur: #ff1e27 !important;
    }

    .hud {
      background:
        radial-gradient(circle at 52% 52%, rgba(95, 8, 14, 0.28) 0%, rgba(10, 14, 20, 0.92) 60%, #050304 100%) !important;
    }

    /* Tactical scanline overlay over map */
    .hud::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      background: repeating-linear-gradient(
        0deg,
        rgba(255, 0, 20, 0.025) 0px,
        rgba(255, 0, 20, 0.025) 1px,
        transparent 1px,
        transparent 3px
      );
    }

    /* Brand Logo Replacement */
    .hudtop .brand a.pbrand .plogo {
      display: none !important;
    }
    .plague-brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 900;
      letter-spacing: 0.06em;
      color: #ff2a37;
      text-shadow: 0 0 10px rgba(255, 30, 39, 0.55);
      font-size: 16px;
    }
    .plague-brand-sub {
      color: #a6a39c;
      font-weight: 600;
      font-size: 11px;
    }

    /* Plague Inc. cards with bio-tactical border */
    .card {
      border: 1px solid rgba(255, 45, 55, 0.28) !important;
      box-shadow: 0 0 24px rgba(0, 0, 0, 0.85), inset 0 0 18px rgba(255, 30, 39, 0.06) !important;
    }

    /* Race Banner: Infection (Left) vs Cure (Right) */
    section.rbanner {
      background: linear-gradient(90deg, rgba(60, 6, 10, 0.88) 0%, rgba(16, 12, 14, 0.95) 50%, rgba(4, 34, 62, 0.88) 100%) !important;
      border: 1px solid rgba(255, 50, 60, 0.4) !important;
    }

    /* Candidate Avatars with Biohazard / Cure Glow */
    .rbanner .rb-face:first-of-type .av {
      box-shadow: 0 0 16px #ff1e27, inset 0 0 8px #ff1e27 !important;
      border: 2px solid #ff1e27 !important;
    }
    .rbanner .rb-face:last-of-type .av {
      box-shadow: 0 0 16px #00a8ff, inset 0 0 8px #00a8ff !important;
      border: 2px solid #00a8ff !important;
    }

    /* Subtitles under candidate names */
    .rbanner .rb-nm:not(.r)::after {
      content: "☣️ PATÓGENO · INFECTADOS";
      display: block;
      font-size: 10px;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: #ff4d54;
      margin-top: 2px;
      text-shadow: 0 0 6px rgba(255, 30, 39, 0.6);
    }
    .rbanner .rb-nm.r::after {
      content: "🧪 PESQUISA DE CURA · OMS";
      display: block;
      font-size: 10px;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: #38b6ff;
      margin-top: 2px;
      text-shadow: 0 0 6px rgba(0, 168, 255, 0.6);
    }

    /* Tug-of-war bar styled like Plague Inc Infection / Cure bar */
    .rb-bar .rb-track {
      background: #140b0d !important;
      border: 1px solid rgba(255, 255, 255, 0.18) !important;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.9) !important;
    }
    .rb-bar .rb-track i.l {
      background: linear-gradient(90deg, #7a0008, #ff1e27) !important;
      box-shadow: 0 0 14px rgba(255, 30, 39, 0.75) !important;
    }
    .rb-bar .rb-track i.r {
      background: linear-gradient(270deg, #003e75, #00a8ff) !important;
      box-shadow: 0 0 14px rgba(0, 168, 255, 0.75) !important;
    }

    /* Countdown headline replacement immune to Preact ticks */
    .rb-head .ln:first-child {
      font-size: 0 !important;
    }
    .rb-head .ln:first-child::after {
      content: "☣️ Paciente Zero detectado · Disseminação em ";
      font-size: 15px;
      color: #ff6b70;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .rb-head .ln.nb {
      color: #ff1e27 !important;
      text-shadow: 0 0 10px rgba(255, 30, 39, 0.65);
    }

    /* Map Canvas Bio-Radar look */
    canvas.map {
      filter: sepia(0.28) hue-rotate(-38deg) saturate(1.55) contrast(1.08);
    }

    /* State Markers on the map look like Plague Inc contagion nodes */
    .marks .mk {
      border: 1px solid rgba(255, 45, 55, 0.55) !important;
      background: rgba(32, 8, 12, 0.88) !important;
      color: #ffb3b6 !important;
      box-shadow: 0 0 8px rgba(255, 30, 39, 0.35) !important;
    }
    .marks .mk:hover {
      background: #ff1e27 !important;
      color: #fff !important;
      box-shadow: 0 0 14px #ff1e27 !important;
    }

    /* Legend Dot */
    .plague-legend-dot {
      background: #ff1e27 !important;
      box-shadow: 0 0 6px #ff1e27 !important;
    }

    /* News Ticker in Header (matches original a.spon absolute centering) */
    #plague-ticker {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 5;
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(90deg, rgba(115, 8, 16, 0.92), rgba(45, 8, 12, 0.92));
      border: 1px solid rgba(255, 60, 70, 0.55);
      border-radius: 999px;
      padding: 4px 14px;
      color: #ffe5e7;
      font-size: 12px;
      font-weight: 600;
      max-width: 520px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 0 14px rgba(255, 30, 39, 0.35);
    }
    #plague-ticker .ticker-tag {
      background: #ff1e27;
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 999px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    #plague-ticker-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* DNA Counter Pill */
    #plague-dna-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(95, 8, 15, 0.9);
      border: 1px solid #ff3b42;
      color: #fff;
      padding: 4px 11px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 0 12px rgba(255, 30, 39, 0.45);
      cursor: pointer;
      user-select: none;
      margin-right: 6px;
    }
    #plague-dna-pill:hover {
      transform: scale(1.04);
      background: #b80d18;
    }

    /* Interactive Biohazard / Cure Bubbles on the Map */
    .plague-bubble {
      position: absolute;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 45;
      animation: plaguePulse 1.6s infinite ease-in-out;
      user-select: none;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .plague-bubble.dna {
      background: radial-gradient(circle at 35% 30%, #ff6b72, #d90f19 65%, #6e0006);
      border: 2px solid #ff9ea2;
      color: #fff;
      box-shadow: 0 0 18px #ff1e27;
    }
    .plague-bubble.cure {
      background: radial-gradient(circle at 35% 30%, #7ad4ff, #0088e0 65%, #003466);
      border: 2px solid #b3e7ff;
      color: #fff;
      box-shadow: 0 0 18px #00a8ff;
    }
    .plague-bubble:hover {
      transform: scale(1.22);
    }
    .plague-pop-text {
      position: absolute;
      font-size: 13px;
      font-weight: 800;
      pointer-events: none;
      z-index: 50;
      animation: plagueFloatUp 0.9s ease-out forwards;
    }
    .plague-pop-text.dna {
      color: #ff4d54;
      text-shadow: 0 0 8px rgba(255, 30, 39, 0.8);
    }
    .plague-pop-text.cure {
      color: #38b6ff;
      text-shadow: 0 0 8px rgba(0, 168, 255, 0.8);
    }
    @keyframes plaguePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes plagueFloatUp {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-28px) scale(1.15); }
    }
  `;

  function injectStyles() {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    } catch (_) {
      const style = document.createElement('style');
      style.textContent = cssText;
      document.head.appendChild(style);
    }
  }

  // Helper that mutates existing Text node in-place so Preact VDOM keeps its reference
  function setPreactSafeText(el, newText) {
    if (!el) return;
    const textNodes = [];
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) textNodes.push(node);
    }
    if (textNodes.length > 0) {
      if (textNodes[0].nodeValue !== newText) textNodes[0].nodeValue = newText;
      for (let i = 1; i < textNodes.length; i++) textNodes[i].nodeValue = '';
    } else if (el.textContent !== newText) {
      el.textContent = newText;
    }
  }

  // 3. Apply Plague Inc. DOM enhancements & labels
  function applyPlagueDOM() {
    patchGlobals();

    // Brand logo -> PLAGUE INC.
    const brandLink = document.querySelector('.hudtop .brand a.pbrand');
    if (brandLink && !brandLink.querySelector('.plague-brand-badge')) {
      const badge = document.createElement('span');
      badge.className = 'plague-brand-badge';
      badge.innerHTML = `${BIOHAZARD_SVG} PLAGUE INC. <small class="plague-brand-sub">BR-2026</small>`;
      brandLink.appendChild(badge);
    }

    // Mode switch buttons
    const switchBtns = document.querySelectorAll('.hudtop .switch button');
    if (switchBtns[0]) setPreactSafeText(switchBtns[0], '☣️ Cepa Principal');
    if (switchBtns[1]) setPreactSafeText(switchBtns[1], '🧬 Focos Estaduais');

    // Replace sponsor with Plague Inc. World News Ticker
    const spon = document.querySelector('.hudtop a.spon');
    if (spon && !document.getElementById('plague-ticker')) {
      const ticker = document.createElement('div');
      ticker.id = 'plague-ticker';
      ticker.innerHTML = `<span class="ticker-tag">NOTÍCIAS</span><span id="plague-ticker-text">${HEADLINES[0]}</span>`;
      spon.replaceWith(ticker);
    }

    // Add DNA points badge in top-right status bar
    const status = document.querySelector('.hudtop .status');
    if (status && !document.getElementById('plague-dna-pill')) {
      const dnaPill = document.createElement('div');
      dnaPill.id = 'plague-dna-pill';
      dnaPill.title = 'Clique nas bolhas de Biohazard/Cura no mapa para coletar DNA!';
      dnaPill.innerHTML = `🧬 <span id="plague-dna-val">${dnaPoints}</span> PTS DNA`;
      dnaPill.addEventListener('click', () => spawnBubble(true));
      status.prepend(dnaPill);
    }

    // Replace party icons in race banner with Biohazard & Cure Flask
    const leftLogo = document.querySelector('.rbanner .rb-nm:not(.r) .plg');
    if (leftLogo && !leftLogo.dataset.plagueSvg) {
      leftLogo.dataset.plagueSvg = '1';
      leftLogo.innerHTML = BIOHAZARD_SVG;
    }
    const rightLogo = document.querySelector('.rbanner .rb-nm.r .plg');
    if (rightLogo && !rightLogo.dataset.plagueSvg) {
      rightLogo.dataset.plagueSvg = '1';
      rightLogo.innerHTML = CURE_FLASK_SVG;
    }

    // Progress bar label ("0% apurado · faltam 158,7 milhões")
    const rbApl = document.querySelector('.rbanner .rb-apl');
    if (rbApl) {
      for (const node of rbApl.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('apurado')) {
          node.nodeValue = ' da população infectada ';
        }
      }
      const rbLeft = rbApl.querySelector('.rb-left');
      if (rbLeft) {
        rbLeft.querySelectorAll('.sr, [aria-hidden="true"]').forEach((el) => {
          if (el.textContent.includes('faltam')) {
            setPreactSafeText(el, el.textContent.replace('faltam', 'hospedeiros sadios:'));
          }
        });
      }
    }

    // Left sidebar headers (Projeção & 1º Turno -> Contágio & Mutações)
    setPreactSafeText(document.querySelector('.ns-jan .nsh h3'), '☣️ Projeção de Contágio');
    setPreactSafeText(document.querySelector('.ns-jan .in-sub'), 'Taxa final de infecção vs. esforço de cura');
    setPreactSafeText(document.querySelector('.ns-cmp .nsh h3'), '🧬 Mutações desde a 1ª Onda');
    setPreactSafeText(document.querySelector('.ns-cmp .in-sub'), 'Transmissão registrada nos focos apurados');

    // Map legend & controls
    const legendSpan = document.querySelector('.mapleg .legend span');
    if (legendSpan && legendSpan.textContent.includes('Aguardando os votos')) {
      legendSpan.innerHTML = `<i class="plague-legend-dot"></i> Incubando patógeno · Aguardando boletins`;
    }
    const mapBtns = document.querySelectorAll('.maptop .seg2 button');
    if (mapBtns[0]) setPreactSafeText(mapBtns[0], '☣️ Focos Locais');
    if (mapBtns[1]) setPreactSafeText(mapBtns[1], '🧪 Taxa de Exame');

    // Right sidebar (Chat or Region view)
    const chatTitle = document.querySelector('.chat .hd h3');
    if (chatTitle && chatTitle.firstChild && chatTitle.firstChild.nodeType === Node.TEXT_NODE) {
      if (!chatTitle.firstChild.nodeValue.includes('OMS')) {
        chatTitle.firstChild.nodeValue = '📡 Rádio de Emergência OMS ';
      }
    }
    setPreactSafeText(document.querySelector('.regc .hd h3'), '☣️ Contágio por Região');
    setPreactSafeText(document.querySelector('.feedc .hd h3'), '🧬 Relatórios de Surto');

    // Footer text ("pessoas acompanhando" -> "epidemiologistas acompanhando")
    setPreactSafeText(document.querySelector('.footbar .fvivo .vp'), 'epidemiologistas ');
    setPreactSafeText(document.querySelector('.footbar a.fonte'), 'Dados da OMS / TSE');
  }

  // 4. Spawn clickable Biohazard / Cure bubbles over the map
  function spawnBubble(force = false) {
    const hud = document.querySelector('.hud');
    if (!hud) return;
    const existing = hud.querySelectorAll('.plague-bubble');
    if (!force && existing.length >= 3) return;

    const isCure = Math.random() < 0.38;
    const bubble = document.createElement('div');
    bubble.className = `plague-bubble ${isCure ? 'cure' : 'dna'}`;
    bubble.innerHTML = isCure ? CURE_FLASK_SVG : BIOHAZARD_SVG;

    // Position inside central map area
    const left = 420 + Math.floor(Math.random() * 520);
    const top = 250 + Math.floor(Math.random() * 440);
    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
    bubble.title = isCure ? 'Estourar Bolha de Pesquisa de Cura (+2 DNA)' : 'Coletar Bolha de Biohazard (+3 DNA)';

    bubble.addEventListener('click', (e) => {
      e.stopPropagation();
      const gain = isCure ? 2 : 3;
      dnaPoints += gain;
      const valEl = document.getElementById('plague-dna-val');
      if (valEl) valEl.textContent = String(dnaPoints);

      const pop = document.createElement('div');
      pop.className = `plague-pop-text ${isCure ? 'cure' : 'dna'}`;
      pop.style.left = `${left}px`;
      pop.style.top = `${top}px`;
      pop.textContent = isCure ? `+${gain} DNA (Cura atrasada!)` : `+${gain} DNA ☣️`;
      hud.appendChild(pop);
      setTimeout(() => pop.remove(), 900);
      bubble.remove();
    });

    hud.appendChild(bubble);
    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, 9000);
  }

  // Initial execution + observer
  injectStyles();
  applyPlagueDOM();
  setTimeout(() => {
    spawnBubble(true);
    spawnBubble(true);
  }, 600);

  let headlineIdx = 0;
  setInterval(() => {
    headlineIdx = (headlineIdx + 1) % HEADLINES.length;
    const tickerText = document.getElementById('plague-ticker-text');
    if (tickerText) tickerText.textContent = HEADLINES[headlineIdx];
  }, 6500);

  setInterval(() => spawnBubble(false), 5000);

  const observer = new MutationObserver(() => applyPlagueDOM());
  observer.observe(document.body, { childList: true, subtree: true });
})();
