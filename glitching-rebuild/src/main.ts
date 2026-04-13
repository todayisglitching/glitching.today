// ============================================================
// Main entry point
// ============================================================

import './styles/main.css';

import { Lang, TRANSLATIONS, detectBrowserLanguage } from './data/i18n';
import { createDiscordSync } from './components/discord';
import { createMusicPlayer } from './components/music';
import { renderSidebar, renderContent, updateSidebar, resetUpdateCache, statusLabel } from './components/renderer';
import { createParticles } from './components/particles';

// ---------- DOM refs ----------
const splashEl = document.getElementById('splash-screen')!;
const bootBtn = document.getElementById('boot-btn')!;
const bootSequenceEl = document.getElementById('boot-sequence')!;
const bootPromptEl = document.getElementById('boot-prompt')!;
const topBarEl = document.getElementById('top-bar')!;
const mainLayoutEl = document.getElementById('main-layout')!;
const sidebarEl = document.getElementById('sidebar')!;
const contentEl = document.getElementById('content')!;
const clockEl = document.getElementById('sys-clock')!;

// ---------- Modules ----------
const music = createMusicPlayer();
const discord = createDiscordSync();
let currentLang: Lang = 'ru';
let splashDismissed = false;

// ---------- Boot sequence ----------

const BOOT_LINES = [
  { text: 'loading...', cls: '' },
  { text: 'profile data        <span class="ok">✓</span>', cls: 'ok' },
  { text: 'discord uplink      <span class="ok">✓</span>', cls: 'ok' },
  { text: 'audio ready         <span class="ok">✓</span>', cls: 'ok' },
  { text: '<span class="warn">ready.</span>', cls: 'warn' },
];

async function playBootSequence(): Promise<void> {
  for (const line of BOOT_LINES) {
    await new Promise((r) => setTimeout(r, 200));
    const el = document.createElement('div');
    el.className = `boot-line ${line.cls}`;
    el.innerHTML = line.text;
    bootSequenceEl.appendChild(el);
    void el.offsetWidth;
    el.classList.add('visible');
  }
  await new Promise((r) => setTimeout(r, 300));
  bootPromptEl.style.display = 'block';
}

function dismissSplash(): void {
  if (splashDismissed) return;
  splashDismissed = true;
  splashEl.style.opacity = '0';
  splashEl.style.visibility = 'hidden';
  topBarEl.style.display = 'flex';
  mainLayoutEl.style.display = 'grid';
  music.init();
  music.togglePlay();
}

bootBtn.addEventListener('click', dismissSplash);
splashEl.addEventListener('click', (e) => {
  if (e.target === splashEl && !splashDismissed) dismissSplash();
});

// ---------- Clock (Yakutsk UTC+9) ----------

function updateClock(): void {
  const yakutsk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Yakutsk' }));
  clockEl.textContent = [
    String(yakutsk.getHours()).padStart(2, '0'),
    String(yakutsk.getMinutes()).padStart(2, '0'),
    String(yakutsk.getSeconds()).padStart(2, '0'),
  ].join(':');
}

// ---------- Language ----------

function setLanguage(lang: Lang, persist = true): void {
  if (!(lang in TRANSLATIONS)) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  if (persist) localStorage.setItem('glitching.lang', lang);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    (btn as HTMLButtonElement).classList.toggle('active', (btn as HTMLButtonElement).dataset.lang === lang);
  });

  // Full re-render on language change
  resetUpdateCache();
  const t = TRANSLATIONS[lang];
  const ds = discord.getState();
  renderSidebar(sidebarEl, t, music, ds);
  renderContent(contentEl, t, lang);
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  const b = btn as HTMLButtonElement;
  b.addEventListener('click', () => setLanguage(b.dataset.lang as Lang));
});

// ---------- Init ----------

async function init(): Promise<void> {
  createParticles(document.getElementById('particles')!);
  await playBootSequence();

  currentLang = detectBrowserLanguage();
  await discord.sync();

  updateClock();
  setInterval(updateClock, 1000);

  // Full initial render
  resetUpdateCache();
  const t = TRANSLATIONS[currentLang];
  const ds = discord.getState();
  renderSidebar(sidebarEl, t, music, ds);
  renderContent(contentEl, t, currentLang);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    (btn as HTMLButtonElement).classList.toggle('active', (btn as HTMLButtonElement).dataset.lang === currentLang);
  });

  // Incremental updates — only changed DOM elements, no flicker
  setInterval(() => {
    const ds2 = discord.getState();
    updateSidebar(ds2, TRANSLATIONS[currentLang]);
  }, 5000);
}

init();
