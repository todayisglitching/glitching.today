// ============================================================
// ЛЮДИ И СВЯЗИ — формат для карты рукопожатий
// ============================================================
//
// Степень («рукопожатие») считается от ME через BFS по CONNECTIONS:
// 1 = знакомы напрямую, 2 = через одного человека, 3 = через двоих и так далее.
// То есть цифра в карточке — расстояние в людях, а не число рук из фразы
// «знаком через 3 руки» (3 посредника = 4-я степень).
//
// Поле degree фиксирует степень вручную (перебивает BFS) — на случай, если
// цепочка в CONNECTIONS ещё не разложена полностью.
//
// Соцсети: можно писать ник — шаблон платформы соберёт ссылку, а можно
// сразу готовый URL, он пройдёт как есть.
//
// Чтобы добавить человека:
//   1. добавь объект в PEOPLE
//   2. добавь связи в CONNECTIONS (пары id)
// ============================================================

export interface Localized {
  ru: string;
  en: string;
}

export interface Person {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  group?: string;
  /** Ручная степень рукопожатия (перебивает BFS). */
  degree?: number;
  /** Ссылки: платформа → ник, id или готовый URL. Пустые не рисуются. */
  socials?: Partial<Record<Platform, string>>;
  how?: Localized;
  tags?: string[];
}

export interface Group {
  id: string;
  label: Localized;
  color: string;
  /** Порядок соцсетей в карточке: сначала важное для этой группы. */
  socials: Platform[];
}

// ---------- соцсети ----------

export type Platform =
  | 'youtube'
  | 'twitch'
  | 'telegram'
  | 'discord'
  | 'twitter'
  | 'instagram'
  | 'github'
  | 'website'
  | 'yandex_music'
  | 'spotify'
  | 'soundcloud'
  | 'zvuk'
  | 'vk_music';

export interface PlatformTemplate {
  id: Platform;
  label: string;
  url: (value: string) => string | null;
}

const stripAt = (value: string): string => value.replace(/^@/, '').trim();
const isUrl = (value: string): boolean => /^https?:\/\//.test(value);

/** Собрать ссылку из ника или вернуть готовый URL как есть. */
function template(base: string, value: string): string {
  return isUrl(value) ? value : `${base}${stripAt(value)}`;
}

/** Поиск по названию, если вместо ссылки дали просто текст. */
function search(base: string, value: string): string {
  return isUrl(value) ? value : `${base}${encodeURIComponent(stripAt(value))}`;
}

export const PLATFORMS: Record<Platform, PlatformTemplate> = {
  youtube: { id: 'youtube', label: 'YouTube', url: (v) => template('https://youtube.com/@', v) },
  twitch: { id: 'twitch', label: 'Twitch', url: (v) => template('https://twitch.tv/', v) },
  telegram: { id: 'telegram', label: 'Telegram', url: (v) => template('https://t.me/', v) },
  discord: {
    id: 'discord',
    label: 'Discord',
    url: (v) => {
      if (isUrl(v)) return v;
      if (/^\d+$/.test(v)) return `https://discord.com/users/${v}`;
      return null;
    },
  },
  twitter: { id: 'twitter', label: 'X', url: (v) => template('https://x.com/', v) },
  instagram: { id: 'instagram', label: 'Instagram', url: (v) => template('https://instagram.com/', v) },
  github: { id: 'github', label: 'GitHub', url: (v) => template('https://github.com/', v) },
  website: {
    id: 'website',
    label: 'Website',
    url: (v) => (isUrl(v) ? v : v.includes('.') ? `https://${stripAt(v)}` : null),
  },
  yandex_music: {
    id: 'yandex_music',
    label: 'Яндекс Музыка',
    url: (v) => search('https://music.yandex.ru/search?text=', v),
  },
  spotify: {
    id: 'spotify',
    label: 'Spotify',
    url: (v) => search('https://open.spotify.com/search/', v),
  },
  soundcloud: {
    id: 'soundcloud',
    label: 'SoundCloud',
    url: (v) => search('https://soundcloud.com/search?q=', v),
  },
  zvuk: {
    id: 'zvuk',
    label: 'Звук',
    url: (v) => search('https://zvuk.com/search?query=', v),
  },
  vk_music: {
    id: 'vk_music',
    label: 'VK Музыка',
    url: (v) => search('https://vk.com/audio?q=', v),
  },
};

export const GROUPS: Group[] = [
  { id: 'cs', label: { ru: 'CS2 / CS:GO', en: 'CS2 / CS:GO' }, color: '#b99a5b', socials: ['youtube', 'telegram', 'twitter'] },
  { id: 'code', label: { ru: 'Программирование', en: 'Programming' }, color: '#7f9e88', socials: ['website', 'github', 'telegram', 'discord'] },
  { id: 'stream', label: { ru: 'Стримеры', en: 'Streamers' }, color: '#c0705f', socials: ['twitch', 'youtube', 'telegram', 'discord'] },
  { id: 'show', label: { ru: 'Шоумены', en: 'Showmen' }, color: '#8d7fae', socials: ['youtube', 'telegram', 'instagram'] },
  {
    id: 'music',
    label: { ru: 'Музыка', en: 'Music' },
    color: '#6e93a8',
    socials: ['yandex_music', 'spotify', 'soundcloud', 'zvuk', 'vk_music', 'telegram', 'instagram'],
  },
];

export const ME: Person = {
  id: 'me',
  name: 'Алексей Волков',
  handle: '@everyofflineuser',
  avatar: '/static/images/avatar.png',
};

// ---------- люди ----------

export const PEOPLE: Person[] = [
  // --- 1-е рукопожатие (друзья напрямую) ---
  {
    id: 'deelter',
    name: 'DeelTer',
    group: 'code',
    degree: 1,
    socials: { github: 'https://github.com/DeelTer' },
  },
  {
    id: 'ivan',
    name: 'Иван Свешнявкин',
    group: 'code',
    degree: 1,
    socials: { website: 'https://wexels.dev', github: 'https://github.com/wexelsdev' },
  },
  {
    id: 'mkd',
    name: 'MKD',
    group: 'cs',
    degree: 1,
    socials: { youtube: 'https://www.youtube.com/@MKD-Force' },
  },
  {
    id: 'lazar',
    name: 'lazar!',
    group: 'music',
    degree: 1,
    socials: {
      zvuk: 'https://zvuk.com/artist/213988875',
      spotify: 'https://open.spotify.com/search/lazar!',
      soundcloud: 'https://soundcloud.com/search?q=lazar!',
    },
  },
  {
    id: 'cxrsx',
    name: 'CXRSXDHXLL',
    group: 'music',
    degree: 1,
    socials: {
      spotify: 'https://open.spotify.com/search/CXRSXDHXLL',
      soundcloud: 'https://soundcloud.com/search?q=CXRSXDHXLL',
    },
  },

  // --- 2-е рукопожатие (через одного) ---
  {
    id: 'pyaterka',
    name: 'Пятёрка',
    group: 'stream',
    degree: 2,
    socials: {
      twitch: 'https://www.twitch.tv/5opka',
      youtube: 'https://www.youtube.com/@5opka',
      telegram: 'https://t.me/jopa5opki',
    },
  },
  {
    id: 'deposit',
    name: 'DepoSit',
    group: 'cs',
    degree: 2,
    socials: { youtube: 'https://www.youtube.com/@DepoSitorium' },
  },
  {
    id: 'ansimist',
    name: 'Ansimist',
    group: 'cs',
    degree: 2,
    socials: { youtube: 'https://www.youtube.com/@Ansimist' },
  },

  // --- 3-е рукопожатие ---
  {
    id: 'buster',
    name: 'Бустер',
    group: 'stream',
    degree: 3,
    socials: {
      twitch: 'https://www.twitch.tv/buster',
      youtube: 'https://www.youtube.com/@Buster',
      telegram: 'https://t.me/buster',
    },
  },
  {
    id: 'bratishkin',
    name: 'Братишкин',
    group: 'stream',
    degree: 3,
    socials: {
      twitch: 'https://www.twitch.tv/bratishkinoff',
      youtube: 'https://www.youtube.com/@bratishkinoff',
      telegram: 'https://t.me/bratishkinoff',
    },
  },
  {
    id: 'gabefollower',
    name: 'GabeFollower',
    group: 'cs',
    degree: 3,
    socials: {
      youtube: 'https://www.youtube.com/@gabefollower',
      twitter: 'https://x.com/gabefollower',
      telegram: 'https://t.me/gabefollower',
    },
  },

  // --- 4-е рукопожатие ---
  {
    id: 'medkit',
    name: 'Madk1d',
    group: 'music',
    degree: 4,
    socials: {
      telegram: 'https://t.me/madk1dmus',
      vk_music: 'https://vk.com/artist/madk1d',
      soundcloud: 'https://soundcloud.com/discover/sets/artist-stations:1250707696',
    },
  },
  {
    id: 'yanchik',
    name: 'Янчик',
    group: 'show',
    degree: 4,
    socials: {
      youtube: 'https://www.youtube.com/@yanski',
      instagram: 'https://www.instagram.com/ynchq',
    },
  },
  {
    id: 'satyr',
    name: 'Сатир',
    group: 'show',
    degree: 4,
    socials: {
      youtube: 'https://www.youtube.com/@SatyrShow',
      telegram: 'https://t.me/satyrshow',
    },
  },

  // --- 5-е рукопожатие ---
  {
    id: 'villain',
    name: 'Villain',
    group: 'music',
    degree: 5,
    socials: {
      instagram: 'https://www.instagram.com/villiancrazzyy',
      spotify: 'https://open.spotify.com/search/VILLIAN%20%D0%9A%D1%80%D0%B0%D1%81%D0%B8%D0%B2%D0%BE%D0%B5%20%D0%97%D0%BB%D0%BE',
      yandex_music: 'https://music.yandex.ru/search?text=VILLIAN',
      vk_music: 'https://vk.com/audio?q=VILLIAN',
    },
  },
];

/** Пары id — ненаправленные связи. */
const RAW_CONNECTIONS: Array<[string, string]> = [
  ['me', 'deelter'],
  ['me', 'ivan'],
  ['me', 'mkd'],
  ['me', 'lazar'],
  ['me', 'cxrsx'],

  // ветка DeelTer: DeelTer → Пятёрка → Бустер → Медкид → Виллаин
  ['deelter', 'pyaterka'],
  ['pyaterka', 'buster'],
  ['buster', 'medkit'],
  ['medkit', 'villain'],
  ['villain', 'buster'],

  // ветка DeelTer → Пятёрка → Братишкин → Янчик / Сатир
  ['pyaterka', 'bratishkin'],
  ['bratishkin', 'yanchik'],
  ['bratishkin', 'satyr'],
  ['satyr', 'yanchik'],
  ['bratishkin', 'buster'],

  // ветка MKD: MKD → DepoSit / Ansimist → GabeFollower
  ['mkd', 'deposit'],
  ['mkd', 'ansimist'],
  ['deposit', 'gabefollower'],
  ['deposit', 'ansimist'],
  ['ansimist', 'gabefollower'],
];

// Одна и та же пара могла попасть дважды — рёбра дедуплицируем.
function dedupe(edges: Array<[string, string]>): Array<[string, string]> {
  const seen = new Set<string>();
  return edges.filter(([a, b]) => {
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const CONNECTIONS = dedupe(RAW_CONNECTIONS);

// ---------- вычисления ----------

function buildAdjacency(): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  const add = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    adj.get(a)!.add(b);
  };
  for (const [a, b] of CONNECTIONS) {
    add(a, b);
    add(b, a);
  }
  return adj;
}

export const ADJACENCY = buildAdjacency();

export const BY_ID = new Map<string, Person>([ME, ...PEOPLE].map((p) => [p.id, p]));

export function computeDegrees(): Map<string, number> {
  const dist = new Map<string, number>([[ME.id, 0]]);
  const queue: string[] = [ME.id];
  while (queue.length) {
    const current = queue.shift()!;
    const d = dist.get(current)!;
    for (const next of ADJACENCY.get(current) ?? []) {
      if (!dist.has(next)) {
        dist.set(next, d + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

export const DEGREES = computeDegrees();

export function degreeOf(id: string): number {
  if (id === ME.id) return 0;
  // Заявленная степень важнее BFS: цепочка посредников может быть ещё не заполнена.
  const declared = BY_ID.get(id)?.degree;
  if (typeof declared === 'number') return declared;
  return DEGREES.get(id) ?? 99;
}

/** Общие знакомые: люди, с которыми знакомы и я, и этот человек. */
export function mutualsOf(id: string): Person[] {
  const mine = ADJACENCY.get(ME.id) ?? new Set<string>();
  const theirs = ADJACENCY.get(id) ?? new Set<string>();
  const result: Person[] = [];
  for (const other of theirs) {
    if (other === ME.id || other === id) continue;
    if (mine.has(other)) {
      const person = BY_ID.get(other);
      if (person) result.push(person);
    }
  }
  return result;
}

export function groupOf(id: string | undefined): Group | undefined {
  if (!id) return undefined;
  return GROUPS.find((g) => g.id === id);
}

export interface SocialLink {
  platform: Platform;
  label: string;
  value: string;
  href: string;
}

/**
 * Ссылки человека. Порядок задаёт группа: сначала то, что для неё важно
 * (стримерам — Twitch, музыкантам — Яндекс Музыка и т. д.), потом остальное.
 */
export function socialLinksOf(person: Person): SocialLink[] {
  const group = groupOf(person.group);
  const entries = Object.entries(person.socials ?? {}) as Array<[Platform, string]>;
  const order = group?.socials ?? [];
  const rank = (platform: Platform): number => {
    const index = order.indexOf(platform);
    return index === -1 ? order.length : index;
  };
  const sorted = entries
    .filter(([platform, value]) => Boolean(value) && Boolean(PLATFORMS[platform]))
    .sort(([a], [b]) => rank(a) - rank(b));

  const links: SocialLink[] = [];
  for (const [platform, value] of sorted) {
    const platformTemplate = PLATFORMS[platform];
    const href = platformTemplate.url(value);
    if (!href) continue;
    links.push({ platform, label: platformTemplate.label, value, href });
  }
  return links;
}
