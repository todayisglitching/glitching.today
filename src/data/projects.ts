export interface Project {
  title: string;
  year?: string;
  url?: string;
  tags: string[];
  featured?: boolean;
  description: {
    ru: string;
    en: string;
  };
}

export const PROJECTS: Project[] = [
  {
    title: 'Aetherius',
    year: '2025',
    url: 'https://github.com/SocialQuestDev/aetherius',
    tags: ['C++20', 'Asio', 'EnTT', 'Luau', '.NET'],
    featured: true,
    description: {
      ru: 'Ядро игрового сервера Minecraft нового поколения: асинхронная сеть на Asio, data-oriented ECS и гибридный скриптинг. 10k+ изменённых строк — ради отсутствия GC-пауз и нормальной многопоточности.',
      en: 'A next-gen Minecraft server core: async networking on Asio, data-oriented ECS and hybrid scripting. 10k+ lines changed — to kill GC pauses and fix multithreading.',
    },
  },
  {
    title: 'SCP: Secret Laboratory',
    year: '2022—2025',
    tags: ['C#', 'plugins', 'CCU'],
    featured: true,
    description: {
      ru: 'Плагины и серверная логика для крупных проектов (Hazbin SCPSL, Distorting). Стабильность под высоким пиковым онлайном.',
      en: 'Plugins and server logic for large projects (Hazbin SCPSL, Distorting). Stability under high peak CCU.',
    },
  },
  {
    title: "Garry's Mod",
    year: '2021—2024',
    url: 'https://github.com/todayisglitching',
    tags: ['GLua', 'gamemodes'],
    description: {
      ru: 'Кастомные скрипты, небольшие игровые режимы и интеграции клиент/сервер для нишевых проектов на 10–15 CCU.',
      en: 'Custom scripts, small gamemodes and client/server integrations for niche projects at 10–15 CCU.',
    },
  },
  {
    title: 'Strikebreaker',
    year: '2025',
    tags: ['C#', 'Unity', 'gamejam'],
    description: {
      ru: 'Сюжетный шутер, сделанный на Gamejam III. Отвечал за геймплейную логику, прогрессию уровней и C#-скриптинг.',
      en: 'A story-driven shooter built at Gamejam III. Owned gameplay logic, level progression and C# scripting.',
    },
  },
  {
    title: 'GeoGuessr for Linux',
    year: '2024',
    url: 'https://github.com/todayisglitching/geoguessr4linux',
    tags: ['JavaScript', 'reverse engineering'],
    description: {
      ru: 'Реверс исходных файлов и переработка сборки, чтобы GeoGuessr нативно запускался на Linux.',
      en: 'Reversed the source files and reworked the build so GeoGuessr runs natively on Linux.',
    },
  },
  {
    title: 'Rust Mini-Browser',
    year: '2024',
    url: 'https://github.com/everyofflineuser/browser',
    tags: ['Rust', 'WebKit'],
    description: {
      ru: 'Лёгкий функциональный десктопный браузер для Linux на WebKit, полностью на Rust.',
      en: 'A lightweight functional desktop browser for Linux on WebKit, written entirely in Rust.',
    },
  },
  {
    title: 'Smart Home (Bluetooth)',
    year: '2024',
    url: 'https://github.com/todayisglitching/hackaton-template',
    tags: ['TypeScript', 'C#', 'IoT', 'hackathon'],
    description: {
      ru: 'Рабочий прототип умного дома, который общается с железом по Bluetooth. Хакатон USmart.',
      en: 'A working smart home prototype talking to hardware over Bluetooth. USmart hackathon.',
    },
  },
  {
    title: 'BigMarket backend',
    year: '2024',
    url: 'https://github.com/todayisglitching/bigmarket',
    tags: ['TypeScript', 'REST', 'Laravel'],
    description: {
      ru: 'Микросервисный бэкенд для хакатона: структурированные REST-эндпоинты и маршрутизация данных.',
      en: 'A microservice backend for a hackathon: structured REST endpoints and data routing.',
    },
  },
  {
    title: 'Co-op Horror Prototype',
    year: '2025',
    url: 'https://github.com/everyofflineuser/lcgame',
    tags: ['Unity', 'C#', 'FMOD'],
    description: {
      ru: 'Прототип кооперативного хоррора по мотивам Lethal Company: процедурное взаимодействие и кооперативные игровые циклы.',
      en: 'A co-op horror prototype inspired by Lethal Company: procedural interaction and co-op gameplay loops.',
    },
  },
  {
    title: 'SocialQuest',
    url: 'https://discord.gg/DsE8fWMq9D',
    tags: ['Discord', 'community'],
    description: {
      ru: 'Сервер для знакомств, игр и общения. Комьюнити-менеджмент, боты и ивенты.',
      en: 'A server for dating, games and chatting. Community management, bots and events.',
    },
  },
  {
    title: 'Questy',
    url: 'https://discord.com/oauth2/authorize?client_id=1436194442221719584',
    tags: ['Discord', 'bot'],
    description: {
      ru: 'Дейтинг-бот для Discord: анкеты, мэтчи и модерация.',
      en: 'A Discord dating bot: profiles, matches and moderation.',
    },
  },
  {
    title: 'Brick MC',
    url: 'https://discord.gg/knwhWN982P',
    tags: ['Minecraft', 'plugins'],
    description: {
      ru: 'Комьюнити и контент: плагины, настройка сервера, работа с игроками.',
      en: 'Community and content: plugins, server setup, player operations.',
    },
  },
  {
    title: 'Extenvil Studio',
    year: '2023—2024',
    tags: ['founder', 'game dev'],
    description: {
      ru: 'Основал независимую игровую студию. Проект закрылся из-за масштаба, но дал опыт прототипирования и управления командой.',
      en: 'Founded an indie game studio. It closed due to scope, but taught me prototyping and team leadership.',
    },
  },
];
