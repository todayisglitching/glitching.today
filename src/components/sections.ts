// ============================================================
// Страница-визитка: hero, о себе, проекты, карта, игры, контакты
// ============================================================

import { USER_CONFIG, Game, MovieShow } from '../data/config';
import { PROJECTS } from '../data/projects';
import { GROUPS, PEOPLE } from '../data/people';
import type { Lang, Strings } from '../data/i18n';
import { getIcon } from './icons';
import { createMap } from './map';
import type { DiscordState } from './discord';

const FALLBACK = USER_CONFIG.fallbackImage;

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function img(src: string, alt: string, cls: string): string {
  return `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy"
    onerror="this.onerror=null;this.src='${FALLBACK}';this.style.filter='grayscale(1)'">`;
}

function statusText(ds: DiscordState, strings: Strings): string {
  return strings.status[ds.status] ?? strings.status.unknown;
}

function activityLine(ds: DiscordState, strings: Strings): string {
  const act = ds.activity;
  if (act.type === 'none') return '';
  const parts = [act.appName];
  if (act.trackName) parts.push(act.trackName);
  else if (act.details) parts.push(act.details);
  if (act.artistName) parts.push(act.artistName);
  return `<p class="hero-activity"><span class="hero-activity-label">${esc(strings.common.now)}</span> ${esc(parts.join(' · '))}</p>`;
}

function renderHeader(lang: Lang, strings: Strings): string {
  const nav = [
    ['about', strings.nav.about],
    ['projects', strings.nav.projects],
    ['map', strings.nav.map],
    ['media', strings.nav.media],
    ['contact', strings.nav.contact],
  ];
  return `
    <header class="site-header">
      <a class="brand" href="#top">glitching<span>.today</span></a>
      <nav class="site-nav" id="site-nav">
        ${nav.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <div class="lang-switcher">
          <button class="lang-btn${lang === 'ru' ? ' active' : ''}" data-lang="ru">RU</button>
          <span class="lang-sep">/</span>
          <button class="lang-btn${lang === 'en' ? ' active' : ''}" data-lang="en">EN</button>
        </div>
        <button class="icon-btn" id="theme-toggle" aria-label="Toggle theme">
          <svg id="theme-icon" viewBox="0 0 24 24" width="17" height="17">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor"/>
          </svg>
        </button>
        <button class="icon-btn nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">
          <span></span><span></span>
        </button>
      </div>
    </header>`;
}

function renderHero(ds: DiscordState, strings: Strings): string {
  const avatar = ds.avatarUrl || FALLBACK;
  return `
    <section class="hero" id="top">
      <div class="hero-backdrop" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="hero-eyebrow">
            <span class="hero-dot"></span>${esc(strings.hero.availability)} · ${esc(strings.hero.location)}
          </p>
          <h1 class="hero-name">${esc(USER_CONFIG.name)}</h1>
          <p class="hero-handles">${USER_CONFIG.handles.map((h) => `<span>@${esc(h)}</span>`).join('<i>/</i>')}</p>
          <p class="hero-role">${esc(strings.hero.role)}</p>
          <p class="hero-bio">${esc(strings.hero.bio)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#contact">${esc(strings.hero.contact)}</a>
            <a class="btn btn-ghost" href="#map">${esc(strings.hero.map)} <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div class="hero-card">
          <div class="hero-avatar-wrap">
            <img class="hero-avatar" id="hero-avatar" src="${esc(avatar)}" alt="${esc(USER_CONFIG.name)}">
            <span class="hero-presence presence-dot ${ds.status}" id="hero-presence"></span>
          </div>
          <div class="hero-status">
            <span class="hero-status-name" id="hero-status">${esc(statusText(ds, strings))}</span>
            <span class="hero-time" id="sys-clock">--:--</span>
          </div>
          <div id="hero-activity">${activityLine(ds, strings)}</div>
          <div class="hero-socials">
            ${USER_CONFIG.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="me noopener" aria-label="${esc(l.name)}" title="${esc(l.name)}">${getIcon(l.icon)}</a>`).join('')}
          </div>
        </div>
      </div>
    </section>`;
}

function renderAbout(strings: Strings): string {
  const facts = [
    strings.about.factAge,
    strings.about.factCity,
    strings.about.factWork,
    strings.about.factLang,
  ];
  return `
    <section class="section" id="about">
      <div class="section-head">
        <h2>${esc(strings.about.title)}</h2>
      </div>
      <div class="about-grid">
        <div class="about-copy">
          <p class="about-lead">${esc(strings.about.lead)}</p>
          <p>${esc(strings.about.p1)}</p>
          <p>${esc(strings.about.p2)}</p>
          <p>${esc(strings.about.p3)}</p>
        </div>
        <aside class="about-facts">
          <h3>${esc(strings.about.factsTitle)}</h3>
          <ul>${facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        </aside>
      </div>
      <div class="skills">
        <h3 class="skills-title">${esc(strings.about.skillsTitle)}</h3>
        ${USER_CONFIG.skills.map((cat) => `
          <div class="skill-row">
            <span class="skill-label">${getIcon(cat.icon)} ${esc(cat.label)}</span>
            <div class="skill-chips">${cat.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
          </div>`).join('')}
      </div>
    </section>`;
}

function renderProjects(lang: Lang, strings: Strings): string {
  return `
    <section class="section" id="projects">
      <div class="section-head">
        <h2>${esc(strings.projects.title)}</h2>
        <p class="section-sub">${esc(strings.projects.sub)}</p>
      </div>
      <div class="project-grid">
        ${PROJECTS.map((p) => {
          const link = p.url
            ? `<a class="project-link" href="${esc(p.url)}" target="_blank" rel="noopener">
                ${esc(strings.projects.open)} ${getIcon('external-link')}
              </a>`
            : `<span class="project-link is-muted">${esc(strings.projects.noLink)}</span>`;
          return `
            <article class="project-card${p.featured ? ' is-featured' : ''}">
              <div class="project-top">
                <h3>${esc(p.title)}</h3>
                ${p.year ? `<span class="project-year">${esc(p.year)}</span>` : ''}
              </div>
              <p class="project-desc">${esc(p.description[lang])}</p>
              <div class="project-tags">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
              <div class="project-foot">${link}</div>
            </article>`;
        }).join('')}
      </div>
    </section>`;
}

function renderMapSection(lang: Lang, strings: Strings): string {
  return `
    <section class="section section-map" id="map">
      <div class="section-head">
        <h2>${esc(strings.map.title)}</h2>
        <p class="section-sub">${esc(strings.map.sub)}</p>
      </div>
      <div class="map-shell" id="map-shell">
        <div class="map-canvas" id="map-canvas"></div>
        <div class="map-controls">
          <button type="button" data-map-action="in" aria-label="${esc(strings.map.zoomIn)}">+</button>
          <button type="button" data-map-action="out" aria-label="${esc(strings.map.zoomOut)}">−</button>
          <button type="button" data-map-action="reset" aria-label="${esc(strings.map.reset)}">⟲</button>
        </div>
        <div class="map-legend">
          <span class="map-legend-title">${esc(strings.map.legendTitle)}</span>
          <span class="map-legend-item"><i class="legend-dot" style="--d:1"></i>${esc(strings.map.direct)}</span>
          <span class="map-legend-item"><i class="legend-dot" style="--d:2"></i>${esc(strings.map.second)}</span>
          <span class="map-legend-item"><i class="legend-dot" style="--d:3"></i>${esc(strings.map.far)}</span>
        </div>
        <div class="map-groups">
          ${GROUPS.filter((g) => PEOPLE.some((p) => p.group === g.id))
            .map((g) => `<span class="map-group-item" style="--group:${g.color}"><i></i>${esc(g.label[lang])}</span>`)
            .join('')}
        </div>
        <aside class="map-card" id="map-card" aria-live="polite"></aside>
      </div>
    </section>`;
}

function renderGameStrip(games: Game[]): string {
  return `
    <div class="game-strip">
      ${games.map((g) => `
        <div class="game-tile" title="${esc(g.name)}">
          ${img(g.img, g.name, 'game-cover')}
          <span class="game-name">${esc(g.name)}</span>
        </div>`).join('')}
    </div>`;
}

function renderGameGrid(games: Game[]): string {
  return `
    <div class="game-grid">
      ${games.map((g) => `<div class="game-card" title="${esc(g.name)}">${img(g.img, g.name, 'game-cover')}</div>`).join('')}
    </div>`;
}

// TMDB напрямую не отдаёт постеры (для РФ), поэтому идём через image-прокси.
function poster(src: string): string {
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}`;
}

function renderMedia(items: MovieShow[]): string {
  return `
    <div class="media-grid">
      ${items.map((m) => `
        <div class="media-card" title="${esc(m.title)}">
          ${img(poster(m.img), m.title, 'media-cover')}
          <span class="media-name">${esc(m.title)}</span>
          ${m.year ? `<span class="media-year">${esc(m.year)}</span>` : ''}
        </div>`).join('')}
    </div>`;
}

function renderMediaSection(lang: Lang, strings: Strings): string {
  const fav = USER_CONFIG.favoriteGame;
  const reason = lang === 'ru' ? fav.reasonRu : fav.reasonEn;
  return `
    <section class="section" id="media">
      <div class="section-head">
        <h2>${esc(strings.media.title)}</h2>
        <p class="section-sub">${esc(strings.media.sub)}</p>
      </div>

      <div class="media-block">
        <div class="media-block-head">
          <h3>${esc(strings.media.gamesTitle)}</h3>
        </div>
        <div class="fav-game">
          ${img(fav.img, fav.name, 'fav-cover')}
          <div class="fav-info">
            <span class="fav-label">${esc(strings.media.favTitle)}</span>
            <h4>${esc(fav.name)}</h4>
            <p>${esc(reason)}</p>
          </div>
        </div>

        <h4 class="media-subtitle">${esc(strings.media.rotation)}</h4>
        ${renderGameStrip(USER_CONFIG.gamesRotation)}

        <h4 class="media-subtitle">${esc(strings.media.likeTitle)}</h4>
        ${renderGameGrid(USER_CONFIG.gamesLike)}

        <h4 class="media-subtitle">${esc(strings.media.wishlistTitle)}</h4>
        ${renderGameGrid(USER_CONFIG.wantToPlay)}
      </div>

      <div class="media-block">
        <div class="media-block-head">
          <h3>${esc(strings.media.watchTitle)}</h3>
          <span class="section-sub">${esc(strings.media.watchSub)}</span>
        </div>
        ${renderMedia(USER_CONFIG.moviesShows)}
      </div>
    </section>`;
}

function renderContact(strings: Strings): string {
  return `
    <section class="section section-contact" id="contact">
      <div class="section-head">
        <h2>${esc(strings.contact.title)}</h2>
        <p class="section-sub">${esc(strings.contact.sub)}</p>
      </div>
      <div class="contact-grid">
        ${USER_CONFIG.links.map((l) => `
          <a class="contact-card" href="${esc(l.url)}" target="_blank" rel="me noopener">
            <span class="contact-icon">${getIcon(l.icon)}</span>
            <span class="contact-name">${esc(l.name)}</span>
            <span class="contact-arrow">${getIcon('external-link')}</span>
          </a>`).join('')}
      </div>
    </section>`;
}

function renderFooter(strings: Strings): string {
  return `
    <footer class="site-footer">
      <span>© ${new Date().getFullYear()} ${esc(strings.footer.rights)}</span>
      <span>${esc(strings.footer.built)}</span>
      <a href="#top">${esc(strings.map.me)} ↑</a>
    </footer>`;
}

export interface AppHandle {
  destroy(): void;
}

export function renderApp(
  root: HTMLElement,
  lang: Lang,
  strings: Strings,
  ds: DiscordState
): AppHandle {
  root.innerHTML = `
    ${renderHeader(lang, strings)}
    <main>
      ${renderHero(ds, strings)}
      ${renderAbout(strings)}
      ${renderProjects(lang, strings)}
      ${renderMapSection(lang, strings)}
      ${renderMediaSection(lang, strings)}
      ${renderContact(strings)}
    </main>
    ${renderFooter(strings)}
  `;

  const canvas = root.querySelector<HTMLElement>('#map-canvas');
  const card = root.querySelector<HTMLElement>('#map-card');
  const map = canvas && card ? createMap(canvas, card, { lang, strings }) : null;

  // мобильное меню
  const navToggle = root.querySelector<HTMLButtonElement>('#nav-toggle');
  const nav = root.querySelector<HTMLElement>('#site-nav');
  const onNavToggle = (): void => {
    const open = nav?.classList.toggle('is-open') ?? false;
    navToggle?.setAttribute('aria-expanded', String(open));
  };
  navToggle?.addEventListener('click', onNavToggle);

  const onNavClick = (event: MouseEvent): void => {
    if ((event.target as Element).closest('a')) {
      nav?.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  };
  nav?.addEventListener('click', onNavClick);

  // плавное появление секций
  const revealEls = [...root.querySelectorAll<HTMLElement>('.section, .project-card, .contact-card')];
  let observer: IntersectionObserver | null = null;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (const el of revealEls) observer.observe(el);
  } else {
    for (const el of revealEls) el.classList.add('is-visible');
  }

  return {
    destroy(): void {
      map?.destroy();
      observer?.disconnect();
      navToggle?.removeEventListener('click', onNavToggle);
      nav?.removeEventListener('click', onNavClick);
    },
  };
}

/** Точечное обновление статуса Discord без перерисовки страницы. */
export function updatePresence(ds: DiscordState, strings: Strings): void {
  const avatar = document.getElementById('hero-avatar') as HTMLImageElement | null;
  if (avatar && ds.avatarUrl && avatar.getAttribute('src') !== ds.avatarUrl) avatar.src = ds.avatarUrl;

  const presence = document.getElementById('hero-presence');
  if (presence) presence.className = `hero-presence presence-dot ${ds.status}`;

  const status = document.getElementById('hero-status');
  if (status) status.textContent = statusText(ds, strings);

  const activity = document.getElementById('hero-activity');
  if (activity) activity.innerHTML = activityLine(ds, strings);
}

export function updateClock(): void {
  const clock = document.getElementById('sys-clock');
  if (!clock) return;
  const yakutsk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Yakutsk' }));
  clock.textContent = [
    String(yakutsk.getHours()).padStart(2, '0'),
    String(yakutsk.getMinutes()).padStart(2, '0'),
  ].join(':');
}
