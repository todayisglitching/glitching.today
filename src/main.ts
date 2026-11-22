// ============================================================
// glitching.today — entry point
// ============================================================

import './styles/main.css';

import { TRANSLATIONS, detectBrowserLanguage, type Lang, type Strings } from './data/i18n';
import { createDiscordSync } from './components/discord';
import { renderApp, updatePresence, updateClock, type AppHandle } from './components/sections';

const root = document.getElementById('app')!;

const discord = createDiscordSync();
let lang: Lang = 'ru';
let strings: Strings = TRANSLATIONS.ru;
let app: AppHandle | null = null;

// ---------- theme ----------

type Theme = 'dark' | 'light' | 'auto';

function systemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function updateThemeIcon(theme: 'dark' | 'light'): void {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  icon.innerHTML = theme === 'light'
    ? '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    : '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor"/>';
}

function applyTheme(theme: Theme): void {
  const resolved = theme === 'auto' ? systemTheme() : theme;
  document.documentElement.setAttribute('data-theme', resolved);
  localStorage.setItem('glitching.theme', theme);
  updateThemeIcon(resolved);
}

function initTheme(): void {
  const saved = localStorage.getItem('glitching.theme') as Theme | null;
  applyTheme(saved ?? 'dark');

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (localStorage.getItem('glitching.theme') === 'auto') applyTheme('auto');
  });
}

function cycleTheme(): void {
  const current = (localStorage.getItem('glitching.theme') as Theme | null) ?? 'dark';
  const next: Theme = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
  applyTheme(next);
}

// ---------- render ----------

function render(): void {
  app?.destroy();
  app = renderApp(root, lang, strings, discord.getState());
  const stored = (localStorage.getItem('glitching.theme') as Theme | null) ?? 'dark';
  updateThemeIcon(stored === 'auto' ? systemTheme() : stored);
  updatePresence(discord.getState(), strings);
  updateClock();
}

function setLang(next: Lang): void {
  if (next === lang) return;
  lang = next;
  strings = TRANSLATIONS[lang];
  document.documentElement.lang = lang;
  localStorage.setItem('glitching.lang', lang);
  render();
}

// ---------- events (делегирование — переживает перерисовку) ----------

root.addEventListener('click', (event) => {
  const target = event.target as Element;

  const langBtn = target.closest<HTMLButtonElement>('[data-lang]');
  if (langBtn?.dataset.lang === 'ru' || langBtn?.dataset.lang === 'en') {
    setLang(langBtn.dataset.lang);
    return;
  }

  if (target.closest('#theme-toggle')) {
    cycleTheme();
  }
});

// ---------- init ----------

async function init(): Promise<void> {
  initTheme();

  lang = detectBrowserLanguage();
  strings = TRANSLATIONS[lang];
  document.documentElement.lang = lang;

  render();

  updateClock();
  setInterval(updateClock, 10_000);

  await discord.sync();
  updatePresence(discord.getState(), strings);

  setInterval(() => {
    updatePresence(discord.getState(), strings);
  }, 5_000);
}

void init();
