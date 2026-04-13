export type Lang = "ru" | "en" | "fr";

export interface TabLabels {
  games: string;
  media: string;
  portfolio: string;
  about: string;
}

export interface Translations {
  tabs: TabLabels;
  online: string;
  idle: string;
  dnd: string;
  offline: string;
  unknown: string;
  sidebarLinks: string;
  music: string;
  boardTitle: string;
  rotationTitle: string;
  rotationSub: string;
  likeTitle: string;
  likeSub: string;
  favTitle: string;
  favSub: string;
  wishlistTitle: string;
  wishlistSub: string;
  mediaTitle: string;
  mediaSub: string;
  portfolioTitle: string;
  portfolioSub: string;
  aboutLead: string;
  aboutBody: string;
  statusPrefix: string;
  liveNow: string;
  bioHeadline: string;
  visitSite: string;
  noLink: string;
}

export const TRANSLATIONS: Record<Lang, Translations> = {
  ru: {
    tabs: { games: "Игры", media: "Медиа", portfolio: "Портфолио", about: "Обо мне" },
    online: "В сети",
    idle: "Отошел",
    dnd: "Не беспокоить",
    offline: "Не в сети",
    unknown: "---",
    sidebarLinks: "Connections",
    music: "Music",
    boardTitle: "Игры",
    rotationTitle: "В ротации",
    rotationSub: "До 5 игр",
    likeTitle: "Нравятся",
    likeSub: "До 20 игр",
    favTitle: "Любимая",
    favSub: "1 игра",
    wishlistTitle: "Хочу поиграть",
    wishlistSub: "До 20 игр",
    mediaTitle: "Фильмы и сериалы",
    mediaSub: "Просмотренное",
    portfolioTitle: "Портфолио",
    portfolioSub: "Проекты и работы",
    aboutLead: "Фантаст, геймдиз, product manager и просто #BigBrain.",
    aboutBody: "Прокачиваю комьюнити, игры и контент. Люблю глитч, неон и интерфейсы с характером.",
    statusPrefix: "Discord",
    liveNow: "Сейчас",
    bioHeadline: "bio",
    visitSite: "открыть",
    noLink: "нет ссылки",
  },
  en: {
    tabs: { games: "Games", media: "Media", portfolio: "Portfolio", about: "About" },
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
    unknown: "---",
    sidebarLinks: "Connections",
    music: "Music",
    boardTitle: "Games",
    rotationTitle: "In rotation",
    rotationSub: "Up to 5 games",
    likeTitle: "Games I like",
    likeSub: "Up to 20 games",
    favTitle: "Favorite",
    favSub: "1 game",
    wishlistTitle: "Want to play",
    wishlistSub: "Up to 20 games",
    mediaTitle: "Movies & Series",
    mediaSub: "Watched",
    portfolioTitle: "Portfolio",
    portfolioSub: "Projects & work",
    aboutLead: "Fantasy writer, game designer, product manager and #BigBrain.",
    aboutBody: "Building communities, games and content. I like glitch, neon and interfaces with a pulse.",
    statusPrefix: "Discord",
    liveNow: "Now",
    bioHeadline: "bio",
    visitSite: "visit",
    noLink: "no link",
  },
  fr: {
    tabs: { games: "Jeux", media: "M\u00e9dias", portfolio: "Portfolio", about: "Profil" },
    online: "En ligne",
    idle: "Absent",
    dnd: "Ne pas d\u00e9ranger",
    offline: "Hors ligne",
    unknown: "---",
    sidebarLinks: "Connexions",
    music: "Musique",
    boardTitle: "Jeux",
    rotationTitle: "En rotation",
    rotationSub: "Jusqu'\u00e0 5 jeux",
    likeTitle: "Jeux que j'aime",
    likeSub: "Jusqu'\u00e0 20 jeux",
    favTitle: "Favori",
    favSub: "1 jeu",
    wishlistTitle: "Je veux jouer",
    wishlistSub: "Jusqu'\u00e0 20 jeux",
    mediaTitle: "Films et s\u00e9ries",
    mediaSub: "Vu",
    portfolioTitle: "Portfolio",
    portfolioSub: "Projets et travaux",
    aboutLead: "Auteur de science-fiction, game designer, product manager et #BigBrain.",
    aboutBody: "Je construis des communaut\u00e9s, des jeux et du contenu. J'aime le glitch, le n\u00e9on et les interfaces vivantes.",
    statusPrefix: "Discord",
    liveNow: "En ce moment",
    bioHeadline: "bio",
    visitSite: "visiter",
    noLink: "pas de lien",
  },
};

export function detectBrowserLanguage(): Lang {
  const saved = localStorage.getItem("glitching.lang");
  if (saved && saved in TRANSLATIONS) return saved as Lang;

  const langs = [...(navigator.languages || []), navigator.language || ""].map((l) => l.toLowerCase());
  if (langs.some((l) => l.startsWith("fr"))) return "fr";
  if (langs.some((l) => l.startsWith("en"))) return "en";
  return "ru";
}
