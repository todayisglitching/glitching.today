// ============================================================
// Main entry point
// ============================================================

import './styles/main.css';

import { Lang, TRANSLATIONS, detectBrowserLanguage } from './data/i18n';
import { createDiscordSync } from './components/discord';
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
const discord = createDiscordSync();
let currentLang: Lang = 'ru';
let splashDismissed = false;

// ---------- Theme management ----------
function getSystemThemePreference(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: 'dark' | 'light' | 'auto'): void {
  const html = document.documentElement;
  
  if (theme === 'auto') {
    const systemPref = getSystemThemePreference();
    html.setAttribute('data-theme', systemPref);
    html.classList.remove('light-theme', 'dark-theme');
    localStorage.setItem('glitching.theme', 'auto');
    updateThemeIcon(systemPref);
  } else {
    html.setAttribute('data-theme', theme);
    html.classList.remove('light-theme', 'dark-theme');
    html.classList.add(`${theme}-theme`);
    localStorage.setItem('glitching.theme', theme);
    updateThemeIcon(theme);
  }
}

function updateThemeIcon(theme: 'dark' | 'light'): void {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  
  if (theme === 'light') {
    icon.innerHTML = '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="currentColor" stroke-width="2" fill="none"/>';
  } else {
    icon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor"/>';
  }
}

function initTheme(): void {
  const savedTheme = localStorage.getItem('glitching.theme') as 'dark' | 'light' | 'auto' | null;
  
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // First visit - check system preference
    const systemPref = getSystemThemePreference();
    applyTheme(systemPref);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem('glitching.theme');
    if (currentTheme === 'auto') {
      applyTheme('auto');
    }
  });
}

// ---------- Boot sequence ----------

const BOOT_LINES = [
  { text: 'loading...', cls: '' },
  { text: 'profile data        <span class="ok">✓</span>', cls: 'ok' },
  { text: 'discord uplink      <span class="ok">✓</span>', cls: 'ok' },
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
}

bootBtn.addEventListener('click', dismissSplash);
splashEl.addEventListener('click', (e) => {
  if (e.target === splashEl && !splashDismissed) dismissSplash();
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('glitching.theme') as 'dark' | 'light' | 'auto' | null;
    const newTheme = currentTheme === 'light' ? 'dark' : (currentTheme === 'dark' ? 'auto' : 'light');
    applyTheme(newTheme);
  });
}

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
  renderSidebar(sidebarEl, t, ds);
  renderContent(contentEl, t, lang);
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  const b = btn as HTMLButtonElement;
  b.addEventListener('click', () => setLanguage(b.dataset.lang as Lang));
});

// ---------- Init ----------

async function init(): Promise<void> {
  // Initialize theme early to prevent flash
  initTheme();
  
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particles');
    if (container) {
      createParticles(container);
    }
  });
  console.debug(document.getElementById('particles'));
  await playBootSequence();

  currentLang = detectBrowserLanguage();
  await discord.sync();

  updateClock();
  setInterval(updateClock, 1000);

  // Full initial render
  resetUpdateCache();
  const t = TRANSLATIONS[currentLang];
  const ds = discord.getState();
  renderSidebar(sidebarEl, t, ds);
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
