export type Lang = 'ru' | 'en';

export interface Strings {
  nav: {
    about: string;
    projects: string;
    map: string;
    media: string;
    contact: string;
  };
  hero: {
    role: string;
    location: string;
    availability: string;
    bio: string;
    contact: string;
    map: string;
  };
  about: {
    title: string;
    lead: string;
    p1: string;
    p2: string;
    p3: string;
    factsTitle: string;
    factAge: string;
    factCity: string;
    factWork: string;
    factLang: string;
    skillsTitle: string;
  };
  projects: {
    title: string;
    sub: string;
    open: string;
    noLink: string;
  };
  map: {
    title: string;
    sub: string;
    hint: string;
    legendTitle: string;
    direct: string;
    second: string;
    far: string;
    handshake: string;
    handshakeFew: string;
    handshakeMany: string;
    me: string;
    mutualTitle: string;
    noMutual: string;
    close: string;
    zoomIn: string;
    zoomOut: string;
    reset: string;
  };
  media: {
    title: string;
    sub: string;
    gamesTitle: string;
    rotation: string;
    likeTitle: string;
    favTitle: string;
    wishlistTitle: string;
    watchTitle: string;
    watchSub: string;
  };
  contact: {
    title: string;
    sub: string;
  };
  footer: {
    built: string;
    rights: string;
  };
  status: {
    online: string;
    idle: string;
    dnd: string;
    offline: string;
    unknown: string;
  };
  common: {
    now: string;
    visit: string;
  };
}

export const TRANSLATIONS: Record<Lang, Strings> = {
  ru: {
    nav: {
      about: 'О себе',
      projects: 'Проекты',
      map: 'Карта связей',
      media: 'Игры',
      contact: 'Контакты',
    },
    hero: {
      role: 'Gameplay, Systems & Network Developer',
      location: 'Якутск, Россия',
      availability: 'Открыт к удалённой работе',
      bio: 'Пишу асинхронные системы, сетевые протоколы и геймплей. C#, Rust, Lua, TypeScript. Люблю низкий уровень, чистый код и интерфейсы с характером.',
      contact: 'Написать мне',
      map: 'Посмотреть связи',
    },
    about: {
      title: 'О себе',
      lead: 'Разработчик на стыке бэкенда, сетей и игровых систем.',
      p1: 'Уверенно владею C#, Rust, Lua и TypeScript. Фокусируюсь на асинхронных, неблокирующих архитектурах и проектировании сетевых протоколов.',
      p2: 'Многолетний пользователь Arch Linux, настраиваю серверы на Ubuntu, разворачиваю WireGuard VPN, занимаюсь пентестингом и DevOps. Модифицирую мультиплеерные серверы Garry\'s Mod и SCP: Secret Laboratory.',
      p3: 'Прототипирую на Godot и Unity. Участвовал в инфобезу по РТК и «Коду будущему» — нашёл уязвимости и довёл их до разработчиков.',
      factsTitle: 'Коротко',
      factAge: '16 лет',
      factCity: 'Якутск',
      factWork: 'Удалённо / простые задачи офлайн',
      factLang: 'Русский, английский',
      skillsTitle: 'Стек',
    },
    projects: {
      title: 'Проекты',
      sub: 'То, что доведено до состояния «работает».',
      open: 'открыть',
      noLink: 'без ссылки',
    },
    map: {
      title: 'Карта связей',
      sub: 'Теория рукопожатий: чем светлее узел, тем ближе человек. Серые — знакомые знакомых.',
      hint: 'Наведи и потяни, чтобы двигать. Колесо — зум. Клик по человеку — карточка.',
      legendTitle: 'Дистанция',
      direct: 'напрямую',
      second: 'через 1 руку',
      far: 'через 2+ рук',
      handshake: 'через {n} руку',
      handshakeFew: 'через {n} руки',
      handshakeMany: 'через {n} рук',
      me: 'это я',
      mutualTitle: 'Общие знакомые',
      noMutual: 'Пока без общих знакомых',
      close: 'закрыть',
      zoomIn: 'Приблизить',
      zoomOut: 'Отдалить',
      reset: 'Сбросить вид',
    },
    media: {
      title: 'Игры и медиа',
      sub: 'Личное, вне работы.',
      gamesTitle: 'Игры',
      rotation: 'В ротации',
      likeTitle: 'Нравятся',
      favTitle: 'Любимая',
      wishlistTitle: 'Хочу поиграть',
      watchTitle: 'Фильмы и сериалы',
      watchSub: 'Что оставило отпечаток в моей личности',
    },
    contact: {
      title: 'Контакты',
      sub: 'Легче всего — в Discord или Telegram.',
    },
    footer: {
      built: 'собрано на Vite + TypeScript',
      rights: 'Алексей Волков',
    },
    status: {
      online: 'В сети',
      idle: 'Отошёл',
      dnd: 'Не беспокоить',
      offline: 'Не в сети',
      unknown: '---',
    },
    common: {
      now: 'Сейчас',
      visit: 'открыть',
    },
  },
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      map: 'Connections',
      media: 'Games',
      contact: 'Contact',
    },
    hero: {
      role: 'Gameplay, Systems & Network Developer',
      location: 'Yakutsk, Russia',
      availability: 'Open to remote work',
      bio: 'I build async systems, network protocols and gameplay. C#, Rust, Lua, TypeScript. I like low level, clean code and interfaces with character.',
      contact: 'Get in touch',
      map: 'See connections',
    },
    about: {
      title: 'About',
      lead: 'A developer at the intersection of backend, networking and game systems.',
      p1: 'Confident with C#, Rust, Lua and TypeScript. I focus on async, non-blocking architectures and network protocol design.',
      p2: 'A long-time Arch Linux user: I set up Ubuntu servers, deploy WireGuard VPNs, do pentesting and DevOps. I mod multiplayer servers for Garry\'s Mod and SCP: Secret Laboratory.',
      p3: 'I prototype in Godot and Unity. Took part in infosec programs by RTK and Code for the Future — found vulnerabilities and reported them to the developers.',
      factsTitle: 'Quick facts',
      factAge: '16 years old',
      factCity: 'Yakutsk',
      factWork: 'Remote / simple on-site tasks',
      factLang: 'Russian, English',
      skillsTitle: 'Stack',
    },
    projects: {
      title: 'Projects',
      sub: 'Things that actually work.',
      open: 'open',
      noLink: 'no link',
    },
    map: {
      title: 'Connections',
      sub: 'Six degrees: the brighter the node, the closer the person. Dim ones are friends of friends.',
      hint: 'Drag to move. Wheel to zoom. Click a person for details.',
      legendTitle: 'Distance',
      direct: 'direct',
      second: '1 hand away',
      far: '2+ hands',
      handshake: '{n} hand away',
      handshakeFew: '{n} hands away',
      handshakeMany: '{n} hands away',
      me: 'that\'s me',
      mutualTitle: 'Mutual connections',
      noMutual: 'No mutual connections yet',
      close: 'close',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      reset: 'Reset view',
    },
    media: {
      title: 'Games & media',
      sub: 'Personal stuff, off the clock.',
      gamesTitle: 'Games',
      rotation: 'In rotation',
      likeTitle: 'Loved',
      favTitle: 'Favorite',
      wishlistTitle: 'Want to play',
      watchTitle: 'Movies & series',
      watchSub: 'What i liked',
    },
    contact: {
      title: 'Contact',
      sub: 'Discord or Telegram is fastest.',
    },
    footer: {
      built: 'built with Vite + TypeScript',
      rights: 'Alexey Volkov',
    },
    status: {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do not disturb',
      offline: 'Offline',
      unknown: '---',
    },
    common: {
      now: 'Now',
      visit: 'open',
    },
  },
};

export function detectBrowserLanguage(): Lang {
  const saved = localStorage.getItem('glitching.lang');
  if (saved === 'ru' || saved === 'en') return saved;

  const langs = [...(navigator.languages || []), navigator.language || ''].map((l) => l.toLowerCase());
  if (langs.some((l) => l.startsWith('ru'))) return 'ru';
  return 'en';
}
