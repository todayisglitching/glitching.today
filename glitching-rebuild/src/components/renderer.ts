// ============================================================
// Renderer — builds all UI from data
// ============================================================

import { USER_CONFIG, Game, MovieShow, PortfolioItem } from '../data/config';
import { Lang, Translations } from '../data/i18n';
import { getIcon } from './icons';
import type { ActivityInfo, DiscordState } from './discord';

// ---------- DOM helpers ----------

function el(tag: string, cls?: string, html?: string): HTMLElement {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function formatTime(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ---------- Status label mapping ----------

export function statusLabel(status: string, t: Translations): string {
  switch (status) {
    case 'online': return t.online;
    case 'idle': return t.idle;
    case 'dnd': return t.dnd;
    case 'offline': return t.offline;
    default: return t.unknown;
  }
}

// ---------- Activity card HTML ----------

export function activityCardHTML(act: ActivityInfo): string {
  if (act.type === 'none') return '';

  if (act.type === 'listening') {
    const hasCover = !!act.coverUrl;
    const hasProgress = act.elapsed !== undefined && act.duration !== undefined;
    const progressPct = hasProgress ? (act.elapsed! / act.duration!) * 100 : 0;
    const startTs = hasProgress ? Date.now() - act.elapsed! : 0;

    return `
      <div class="activity-card" data-activity-type="listening">
        <div class="activity-card-header">Listening to ${act.appName}</div>
        <div class="activity-card-body">
          ${hasCover ? `<img class="activity-card-art" src="${act.coverUrl}" alt="cover" onerror="this.style.display='none'">` : ''}
          <div class="activity-card-info">
            <div class="activity-card-title">${act.trackName || act.appName}</div>
            ${act.artistName ? `<div class="activity-card-artist">${act.artistName}</div>` : ''}
            ${hasProgress ? `
            <div class="activity-card-progress" data-start="${startTs}" data-duration="${act.duration!}">
              <span class="activity-card-time">${formatTime(act.elapsed!)}</span>
              <div class="activity-card-bar"><div class="activity-card-bar-fill" style="width:${progressPct}%"></div></div>
              <span class="activity-card-time">${formatTime(act.duration!)}</span>
            </div>` : ''}
          </div>
        </div>
      </div>`;
  }

  return `
    <div class="activity-card" data-activity-type="${act.type}">
      <div class="activity-card-body">
        ${act.coverUrl ? `<img class="activity-card-art" src="${act.coverUrl}" alt="cover" onerror="this.style.display='none'">` : ''}
        <div class="activity-card-info">
          <div class="activity-card-title">${act.appName}</div>
          ${act.details ? `<div class="activity-card-details">${act.details}</div>` : ''}
          ${act.state ? `<div class="activity-card-state">${act.state}</div>` : ''}
        </div>
      </div>
    </div>`;
}

// ---------- Progress bar ticker ----------

let progressInterval: ReturnType<typeof setInterval> | null = null;

export function startProgressTicker(): void {
  if (progressInterval) return;
  progressInterval = setInterval(() => {
    const bar = document.querySelector('.activity-card-progress') as HTMLElement | null;
    if (!bar) return;
    const start = Number(bar.dataset.start);
    const duration = Number(bar.dataset.duration);
    if (!start || !duration) return;
    const elapsed = Date.now() - start;
    const pct = Math.min(100, Math.max(0, (elapsed / duration) * 100));
    const fill = bar.querySelector('.activity-card-bar-fill') as HTMLElement | null;
    if (fill) fill.style.width = `${pct}%`;
    const timeEl = bar.querySelector('.activity-card-time:first-child') as HTMLElement | null;
    if (timeEl) timeEl.textContent = formatTime(elapsed);
  }, 1000);
}

export function stopProgressTicker(): void {
  if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
}

// ---------- Widget card helper ----------

function card(title: string, subtitle: string, body: HTMLElement | string): HTMLElement {
  const c = el('div', 'widget-card');
  const header = el('div', 'widget-card-header');
  const t = el('span', 'widget-card-title');
  t.textContent = title;
  header.appendChild(t);
  if (subtitle) { const s = el('span', 'widget-card-subtitle'); s.textContent = subtitle; header.appendChild(s); }
  c.appendChild(header);
  const bodyEl = el('div', 'widget-card-body');
  if (typeof body === 'string') bodyEl.innerHTML = body;
  else bodyEl.appendChild(body);
  c.appendChild(bodyEl);
  return c;
}

// ---------- Game rendering ----------

function renderGameGrid(games: Game[]): HTMLElement {
  const grid = el('div', 'game-grid');
  for (const g of games) {
    const c = el('div', 'game-card');
    const img = document.createElement('img');
    img.className = 'game-thumb';
    img.src = g.img;
    img.alt = g.name;
    img.loading = 'lazy';
    img.onerror = () => { (img as HTMLImageElement).src = USER_CONFIG.fallbackAvatar; (img as HTMLImageElement).style.filter = 'grayscale(1)'; };
    c.appendChild(img);
    grid.appendChild(c);
  }
  return grid;
}

function renderRotationList(title: string, subtitle: string, games: Game[]): HTMLElement {
  const wrap = card(title, subtitle, '');
  const list = el('div', 'rotation-list');
  for (const g of games) {
    const row = el('div', 'rotation-item');
    const tags = (g.tags || []).map((t) => `<span class="chip">${t}</span>`).join('');
    row.innerHTML = `
      <img class="rotation-thumb" src="${g.img}" alt="${g.name}" loading="lazy" onerror="this.src='${USER_CONFIG.fallbackAvatar}';this.style.filter='grayscale(1)'">
      <div><p class="rotation-name">${g.name}</p><div class="rotation-tags">${tags}</div></div>`;
    list.appendChild(row);
  }
  wrap.querySelector('.widget-card-body')!.appendChild(list);
  return wrap;
}

function renderFavGame(title: string, subtitle: string, lang: Lang): HTMLElement {
  const fav = USER_CONFIG.favoriteGame;
  const reason = lang === 'fr' ? fav.reasonFr : lang === 'en' ? fav.reasonEn : fav.reasonRu;
  const tags = (fav.tags || []).map((t) => `<span class="chip">${t}</span>`).join('');
  const wrap = card(title, subtitle, '');
  wrap.querySelector('.widget-card-body')!.innerHTML = `
    <div class="fav-game">
      <img class="fav-thumb" src="${fav.img}" alt="${fav.name}" loading="lazy" onerror="this.src='${USER_CONFIG.fallbackAvatar}';this.style.filter='grayscale(1)'">
      <div class="fav-info">
        <p class="fav-name">${fav.name}</p><p class="fav-reason">${reason}</p>
        <div class="fav-tags">${tags}</div>
      </div>
    </div>`;
  return wrap;
}

// ---------- Media rendering ----------

function renderMediaGrid(items: MovieShow[]): HTMLElement {
  const grid = el('div', 'game-grid');
  for (const m of items) {
    const c = el('div', 'game-card media-card');
    const img = document.createElement('img');
    img.className = 'game-thumb';
    img.src = m.img; img.alt = m.title; img.loading = 'lazy';
    img.onerror = () => { (img as HTMLImageElement).src = USER_CONFIG.fallbackAvatar; (img as HTMLImageElement).style.filter = 'grayscale(1)'; };
    c.appendChild(img);
    const overlay = el('div', 'media-overlay');
    overlay.innerHTML = `<span class="media-title">${m.title}</span>`;
    if (m.year) { const y = el('span', 'media-year'); y.textContent = m.year; overlay.appendChild(y); }
    c.appendChild(overlay);
    grid.appendChild(c);
  }
  return grid;
}

// ---------- Portfolio rendering ----------

function renderPortfolio(items: PortfolioItem[], t: Translations): HTMLElement {
  const wrap = card(t.portfolioTitle, t.portfolioSub, '');
  const list = el('div', 'portfolio-list');
  for (const p of items) {
    const row = el('div', 'portfolio-item');
    const tags = (p.tags || []).map((t) => `<span class="chip">${t}</span>`).join('');
    const link = p.url
      ? `<a class="portfolio-link" href="${p.url}" target="_blank">${t.visitSite} ${getIcon('external-link')}</a>`
      : `<span class="portfolio-link" style="opacity:0.3">${t.noLink}</span>`;
    row.innerHTML = `<div class="portfolio-info"><p class="portfolio-title">${p.title}</p><p class="portfolio-desc">${p.description}</p><div class="portfolio-tags">${tags}</div></div><div class="portfolio-action">${link}</div>`;
    list.appendChild(row);
  }
  wrap.querySelector('.widget-card-body')!.appendChild(list);
  return wrap;
}

// ---------- Skills ----------

function renderSkills(): HTMLElement {
  const wrap = el('div', 'skills-section');
  for (const cat of USER_CONFIG.skills) {
    const section = el('div', 'skill-category');
    const header = el('div', 'skill-category-header');
    header.innerHTML = `<span class="skill-icon">${getIcon(cat.icon)}</span> ${cat.label}`;
    section.appendChild(header);
    const chips = el('div', 'skill-chips');
    for (const s of cat.skills) chips.innerHTML += `<span class="chip skill-chip">${s}</span>`;
    section.appendChild(chips);
    wrap.appendChild(section);
  }
  return wrap;
}

// ============================================================
// SIDEBAR — full initial render
// ============================================================

export function renderSidebar(
  sidebar: HTMLElement,
  t: Translations,
  music: ReturnType<typeof import('./music').createMusicPlayer>,
  ds: DiscordState
): void {
  const statusText = statusLabel(ds.status, t);
  const decoHtml = ds.avatarDecorationUrl
    ? `<img class="avatar-decoration" src="${ds.avatarDecorationUrl}" alt="decoration">`
    : '';
  const tracks = music.getTracks();
  const trackOptions = tracks.map((tr) => `<option value="${tr.id}">${tr.title} — ${tr.artist}</option>`).join('');
  const currentTrack = tracks[music.getCurrentIndex()];

  sidebar.innerHTML = `
    <div class="card profile-card">
      <div class="card-body" style="padding-bottom:0">
        <div class="profile-avatar-wrap">
          ${decoHtml}
          <img id="pfp-el" class="profile-avatar" src="${ds.avatarUrl}" alt="avatar">
        </div>
        <h1 class="profile-handle">${USER_CONFIG.handle}</h1>
        <div class="profile-status">
          <span class="presence-dot ${ds.status}" id="presence-dot"></span>
          <span id="status-text">${statusText}</span>
        </div>
      </div>
      <div id="activity-container">${activityCardHTML(ds.activity)}</div>
    </div>

    <div class="card">
      <div class="card-body" style="padding:14px 18px">
        <div style="font-size:13px;color:var(--text);margin-bottom:4px">${USER_CONFIG.bioText}</div>
        <div style="font-size:11px;color:var(--text-muted)">
          <a target="_blank" href="${USER_CONFIG.bioUrl}" class="bio-url-link">${USER_CONFIG.bioUrl}</a>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">${t.sidebarLinks}</span></div>
      <div class="card-body" style="padding:8px 10px">
        <div class="links-list">
          ${USER_CONFIG.links.map((l) => `
            <a class="link-row" href="${l.url}" target="_blank">
              <span class="link-row-left">${getIcon(l.icon)} ${l.name}</span>
              ${getIcon('external-link')}
            </a>`).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">${t.music}</span></div>
      <div class="card-body">
        <div class="player-controls">
          <button class="player-btn" id="btn-prev">${getIcon('skip-back')}</button>
          <button class="player-btn" id="btn-play">${getIcon(music.isPlaying() ? 'pause' : 'play')}</button>
          <button class="player-btn" id="btn-next">${getIcon('skip-forward')}</button>
          <button class="player-btn" id="btn-mute" style="margin-left:auto">${getIcon(music.isMuted() ? 'volume-x' : 'volume-2')}</button>
        </div>
        <div class="player-info">
          <div class="player-song-title" id="song-title">${currentTrack?.title || ''}</div>
          <div class="player-song-artist" id="song-artist">${currentTrack?.artist || ''}</div>
        </div>
        <select class="player-select" id="track-select">${trackOptions}</select>
        <div class="player-volume">
          <span class="volume-icon">${getIcon('volume-2')}</span>
          <input type="range" class="volume-slider" id="volume-control" min="0" max="0.3" step="0.005" value="0.05">
        </div>
        <div class="player-progress" id="progress-bar"><div class="player-progress-fill" id="progress-fill"></div></div>
      </div>
    </div>
  `;

  bindMusicEvents(music);
  if (ds.activity.type === 'listening' && ds.activity.elapsed !== undefined) startProgressTicker();
  else stopProgressTicker();
}

// ============================================================
// SIDEBAR — incremental update (no flicker)
// Only touches DOM elements that actually changed
// ============================================================

let prev: { status: string; avatar: string; decoration: string; activityKey: string } = {
  status: '', avatar: '', decoration: '', activityKey: '',
};

export function updateSidebar(ds: DiscordState, t: Translations): void {
  // 1. Avatar
  const avatarEl = document.getElementById('pfp-el') as HTMLImageElement | null;
  if (avatarEl && ds.avatarUrl !== prev.avatar) { avatarEl.src = ds.avatarUrl; prev.avatar = ds.avatarUrl; }

  // 2. Avatar decoration
  const decoContainer = document.querySelector('.profile-avatar-wrap');
  const existingDeco = decoContainer?.querySelector('.avatar-decoration') as HTMLImageElement | null;
  if (ds.avatarDecorationUrl) {
    if (ds.avatarDecorationUrl !== prev.decoration) {
      if (existingDeco) existingDeco.src = ds.avatarDecorationUrl;
      else if (decoContainer) {
        const img = document.createElement('img');
        img.className = 'avatar-decoration';
        img.src = ds.avatarDecorationUrl;
        img.alt = 'decoration';
        decoContainer.insertBefore(img, decoContainer.firstChild);
      }
      prev.decoration = ds.avatarDecorationUrl;
    }
  } else if (existingDeco) { existingDeco.remove(); prev.decoration = ''; }

  // 3. Status
  if (ds.status !== prev.status) {
    const dotEl = document.getElementById('presence-dot');
    if (dotEl) dotEl.className = `presence-dot ${ds.status}`;
    const statusEl = document.getElementById('status-text');
    if (statusEl) statusEl.textContent = statusLabel(ds.status, t);
    prev.status = ds.status;
  }

  // 4. Activity — compare a simple key
  const act = ds.activity;
  const actKey = act.type === 'none' ? 'none'
    : `${act.type}:${act.appName}:${act.trackName || ''}:${act.artistName || ''}:${act.details || ''}`;
  if (actKey !== prev.activityKey) {
    const container = document.getElementById('activity-container');
    if (container) container.innerHTML = activityCardHTML(act);
    prev.activityKey = actKey;
    if (act.type === 'listening' && act.elapsed !== undefined) startProgressTicker();
    else stopProgressTicker();
  }
}

export function resetUpdateCache(): void {
  prev = { status: '', avatar: '', decoration: '', activityKey: '' };
}

// ============================================================
// Music events
// ============================================================

function bindMusicEvents(
  music: ReturnType<typeof import('./music').createMusicPlayer>
): void {
  const btnPrev = document.getElementById('btn-prev');
  const btnPlay = document.getElementById('btn-play');
  const btnNext = document.getElementById('btn-next');
  const btnMute = document.getElementById('btn-mute');
  const trackSelect = document.getElementById('track-select') as HTMLSelectElement;
  const volumeSlider = document.getElementById('volume-control') as HTMLInputElement;

  btnPrev?.addEventListener('click', () => { music.prev(); });
  btnPlay?.addEventListener('click', () => { music.togglePlay(); });
  btnNext?.addEventListener('click', () => { music.next(); });
  btnMute?.addEventListener('click', () => { music.toggleMute(); });
  trackSelect?.addEventListener('change', () => { music.selectTrack(trackSelect.value); });
  if (volumeSlider) {
    volumeSlider.oninput = () => {
      const audio = document.getElementById('bg-audio') as HTMLAudioElement;
      audio.volume = Number(volumeSlider.value);
      if (audio.muted && audio.volume > 0) audio.muted = false;
    };
  }
}

// ============================================================
// CONTENT — games, media, portfolio, about tabs
// ============================================================

export function renderContent(content: HTMLElement, t: Translations, lang: Lang): void {
  content.innerHTML = '';

  const nav = el('nav', 'nav-tabs');
  const tabs = [
    { id: 'games', label: t.tabs.games },
    { id: 'media', label: t.tabs.media },
    { id: 'portfolio', label: t.tabs.portfolio },
    { id: 'about', label: t.tabs.about },
  ];
  for (let i = 0; i < tabs.length; i++) {
    const btn = el('button', `nav-tab${i === 0 ? ' active' : ''}`);
    btn.textContent = tabs[i].label;
    btn.dataset.tab = tabs[i].id;
    btn.addEventListener('click', () => showTab(tabs[i].id));
    nav.appendChild(btn);
  }
  content.appendChild(nav);

  const gamesTab = el('div', 'tab-content active');
  gamesTab.id = 'content-games';
  gamesTab.appendChild(renderRotationList(t.rotationTitle, t.rotationSub, USER_CONFIG.gamesRotation));
  gamesTab.appendChild(card(t.likeTitle, t.likeSub, renderGameGrid(USER_CONFIG.gamesLike)));
  gamesTab.appendChild(renderFavGame(t.favTitle, t.favSub, lang));
  gamesTab.appendChild(card(t.wishlistTitle, t.wishlistSub, renderGameGrid(USER_CONFIG.wantToPlay)));
  content.appendChild(gamesTab);

  const mediaTab = el('div', 'tab-content');
  mediaTab.id = 'content-media';
  mediaTab.appendChild(card(t.mediaTitle, t.mediaSub, renderMediaGrid(USER_CONFIG.moviesShows)));
  content.appendChild(mediaTab);

  const portfolioTab = el('div', 'tab-content');
  portfolioTab.id = 'content-portfolio';
  portfolioTab.appendChild(renderPortfolio(USER_CONFIG.portfolio, t));
  content.appendChild(portfolioTab);

  const aboutTab = el('div', 'tab-content');
  aboutTab.id = 'content-about';
  aboutTab.innerHTML = `<div class="widget-card"><div class="widget-card-body" style="padding:18px"><p class="about-text">${t.aboutLead}</p><p class="about-body">${t.aboutBody}</p></div></div>`;
  aboutTab.appendChild(renderSkills());
  content.appendChild(aboutTab);
}

function showTab(tabId: string): void {
  document.querySelectorAll('.tab-content').forEach((e) => e.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach((e) => e.classList.remove('active'));
  const tabContent = document.getElementById(`content-${tabId}`);
  const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (tabContent) tabContent.classList.add('active');
  if (tabBtn) tabBtn.classList.add('active');
}
