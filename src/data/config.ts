export interface Link {
  name: string;
  url: string;
  icon: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface Game {
  name: string;
  img: string;
  tags?: string[];
}

export interface FavoriteGame extends Game {
  reasonRu: string;
  reasonEn: string;
  reasonFr: string;
}

export interface MovieShow {
  title: string;
  img: string;
  year?: string;
  type?: "movie" | "series";
}

export interface PortfolioItem {
  title: string;
  description: string;
  url?: string;
  tags?: string[];
  image?: string;
}

export interface SkillCategory {
  label: string;
  icon: string;
  skills: string[];
}

export interface UserConfig {
  handle: string;
  userTag: string;
  bioText: string;
  bioUrl: string;
  discordId: string;
  fallbackAvatar: string;
  links: Link[];
  tracks: Track[];
  gamesRotation: Game[];
  gamesLike: Game[];
  favoriteGame: FavoriteGame;
  wantToPlay: Game[];
  moviesShows: MovieShow[];
  portfolio: PortfolioItem[];
  skills: SkillCategory[];
}

export const USER_CONFIG: UserConfig = {
  handle: "hEllO, 1'm ev3ry)",
  userTag: "@todayisglitching",
  bioText: "Hello! I'm every / ❤️ have",
  bioUrl: "https://glitching.today/",
  discordId: "882580439162826753",
  fallbackAvatar: "/static/images/avatar.gif",
  links: [
    { name: "Discord", url: "https://discord.com/users/882580439162826753", icon: "message-square" },
    { name: "Telegram", url: "https://t.me/everyofflineuser", icon: "send" },
    { name: "Bluesky", url: "https://bsky.app/profile/everyofflineuser.bsky.social", icon: "cloud" },
    { name: "Github", url: "https://github.com/todayisglitching", icon: "github" },
    { name: "Twitch", url: "https://twitch.tv/everyofflineuser", icon: "tv" },
  ],
  tracks: [
    { id: "mirrors", title: "mirrors demo - happy version", artist: "SWOX, s0rrow", url: "/static/audio/song.mp3" },
    { id: "check", title: "check", artist: "bbno$", url: "/static/audio/song1.flac" },
    { id: "girls", title: "GIRLS", artist: "Chri$Tian Gate$", url: "/static/audio/song2.flac" },
    { id: "menace", title: "menace", artist: "Mazie", url: "/static/audio/song3.flac" },
    { id: "smellyjelly", title: "Smelly Jelly", artist: "Gezebelle Gaburgably", url: "/static/audio/song4.flac" },
    { id: "thread", title: "Hanging by a Thread", artist: "Des Rocks", url: "/static/audio/song5.mp3" },
  ],
  gamesRotation: [
    { name: "Ena: Dream BBQ", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/2134320/library_600x900_2x.jpg", tags: ["Casual", "Love it"] },
    { name: "GeoGuessr: Steam Edition", img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3478870/5c1dfeac6425e5523d1e7533822367c74bf9524e/library_capsule.jpg", tags: ["Casual", "Love it", "Looking for tips", "Looking for discuss", "Open to play"] },
    { name: "Minecraft", img: "https://upload.wikimedia.org/wikipedia/ru/f/f4/Minecraft_Cover_Art.png", tags: ["Casual", "Open to play", "Love it"] },
  ],
  gamesLike: [
    { name: "Garry's Mod", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/4000/library_600x900_2x.jpg" },
    { name: "Entropy : Zero 2", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1583720/library_600x900_2x.jpg" },
    { name: "Half-Life", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/70/library_600x900_2x.jpg" },
    { name: "Half-Life 2", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/220/library_600x900_2x.jpg" },
    { name: "Phasmophobia", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/library_600x900_2x.jpg" },
    { name: "Lethal Company", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/library_600x900_2x.jpg" },
    { name: "Factorio", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/427520/library_600x900_2x.jpg" },
  ],
  favoriteGame: {
    name: "Abiotic Factor",
    img: "https://cdn.cloudflare.steamstatic.com/steam/apps/427410/library_600x900_2x.jpg",
    reasonRu: "Потому что ее прошел хумас",
    reasonEn: "Because NikeTheHuman passed it",
    reasonFr: "Parce que NikeTheHuman l'a réussi",
    tags: ["Intermediate", "Open to play", "Obsessed"],
  },
  wantToPlay: [
    { name: "Minecraft Dungeons", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1672970/library_600x900_2x.jpg" },
    { name: "RUST", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/library_600x900_2x.jpg" },
    { name: "Ready or Not", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/library_600x900_2x.jpg" },
    { name: "DayZ", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/221100/library_600x900_2x.jpg" },
    { name: "Party Animals", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1260320/library_600x900_2x.jpg" },
    { name: "Delta Force", img: "https://cdn.cloudflare.steamstatic.com/steam/apps/2507950/library_600x900_2x.jpg" },
  ],
  moviesShows: [
    { title: "The Amazing Digital Circius", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/lpfrgfomX8uNFxv4VaEzvJGs9TK.jpg", year: "2023", type: "series" },
    { title: "Murder Drones", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/z6fAKaN2F9jogQIdcHUHNVsiFNV.jpg", year: "2021", type: "series" },
    { title: "Spider-Man: Across the Spider-Verse", img: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", year: "2023", type: "movie" },
    { title: "Helluva Boss", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/fhM8qhAWaqtLj56UZIZrBAKNBoB.jpg", year: "2020", type: "series" },
    { title: "Hazbin Hotel", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/aVYHMW8pdzJ9qG1OGRMKyGy9xor.jpg", year: "2024", type: "series" },
    { title: "The Boys", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/in1R2dDc421JxsoRWaIIAqVI2KE.jpg", year: "2019", type: "series" },
    { title: "Loki", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg", year: "2021", type: "series" },
    { title: "Adventure Time: Fionna and Cake", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/fi1b6U1kp73xheECzqwzMn8u3mX.jpg", year: "2023", type: "series" },
    { title: "Zootopia 2", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/oJ7g2CifqpStmoYQyaLQgEU32qO.jpg", year: "2025", type: "movie" },
    { title: "The Secret Life of Pets 2", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/s9xg4V5EDKiphgIksVJ9gewBM11.jpg", year: "2019", type: "movie" },
    { title: "Penguins of Madagascar", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/dXbpNrPDZDMEbujFoOxmMNQVMHa.jpg", year: "2014", type: "movie" },
    { title: "Zootopia", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg", year: "2016", type: "movie" },
    { title: "Adventure Time", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/qk3eQ8jW4opJ48gFWYUXWaMT4l.jpg", year: "2010", type: "series" },
    { title: "Adventure Time: Distant Lands", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/qoxFg9236pkpkBuUbqudPTIHlnW.jpg", year: "2020", type: "series" },
    { title: "The Truman Show", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/vuza0WqY239yBXOadKlGwJsZJFE.jpg", year: "1998", type: "movie" },
    { title: "The Wolf of Wall Street", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg", year: "2013", type: "movie" },
    { title: "21", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/efG8Po57alqSlhqHU1lXJ3duG6t.jpg", year: "2008", type: "movie" },
    { title: "House", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg", year: "2004", type: "series" },
    { title: "Knives Out", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/pThyQovXQrw2m0s9x82twj48Jq4.jpg", year: "2019", type: "movie" },
    { title: "Knights of Guinevere", img: "https://images-ext-1.discordapp.net/external/npcw04sU-jC5VoYINYD3WdumgaixQk9LTY5Q96MspcY/https/m.media-amazon.com/images/M/MV5BNzYxYTNiYjctOGMyNC00NzAzLWJkZmQtNGZjYjM5OThmMjc4XkEyXkFqcGc%40._V1_FMjpg_UX1000_.jpg?format=webp&width=615&height=869", year: "2025", type: "series" },
    { title: "Iron Man", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", year: "2008", type: "movie" },
    { title: "Iron Man 2", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg", year: "2010", type: "movie" },
    { title: "Iron Man 3", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg", year: "2013", type: "movie" },
    { title: "Spider-Man", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/kjdJntyBeEvqm9w97QGBdxPptzj.jpg", year: "2002", type: "movie" },
    { title: "Spider-Man: No Way Home", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", year: "2021", type: "movie" },
    { title: "Spider-Man: Homecoming", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg", year: "2017", type: "movie" },
    { title: "Spider-Man 3", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/qFmwhVUoUSXjkKRmca5yGDEXBIj.jpg", year: "2007", type: "movie" },
    { title: "Spider-Man: Far From Home", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg", year: "2019", type: "movie" },
    { title: "The Amazing Spider-Man", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/jexoNYnPd6vVrmygwF6QZmWPFdu.jpg", year: "2012", type: "movie" },
    { title: "Spider-Man: Into the Spider-Verse", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", year: "2018", type: "movie" },
    { title: "Spider-Man 2", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/eg8XHjA7jkM3ulBLnfGTczR9ytI.jpg", year: "2004", type: "movie" },
    { title: "The Amazing Spider-Man 2", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/bU7nTmvmy0h3VUP01v1T2imgH6N.jpg", year: "2014", type: "movie" },
    { title: "The Avengers", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg", year: "2012", type: "movie" },
    { title: "Avengers: Endgame", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg", year: "2019", type: "movie" },
    { title: "Avengers: Infinity War", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", year: "2018", type: "movie" },
    { title: "Avengers: Age of Ultron", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg", year: "2015", type: "movie" },
    { title: "tick, tick... BOOM!", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/DPmfcuR8fh8ROYXgdjrAjSGA0o.jpg", year: "2021", type: "movie" },
    { title: "My Mom's Penguins", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/k19JcFzUiBFw8I4eldLxLkkXavb.jpg", year: "2021", type: "series" },
    { title: "Breaking Bad", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg", year: "2008", type: "series" },
    { title: "Awakenings", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/9gztZXuHLG6AJ0fgqGd7Q43cWRI.jpg", year: "1990", type: "movie" },
    { title: "Hancock", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/7DyuV2G0hLEqHeueDfOqhZ2DVut.jpg", year: "2008", type: "movie" },
    { title: "Rush Hour 3", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/mp9CzKxLa2i7yblMXUrzVfGqsCo.jpg", year: "2007", type: "movie" },
    { title: "Under the Dome", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/fwH0ePhd7m3swtCuFeubtR49ZTd.jpg", year: "2013", type: "series" },
    { title: "Five Nights at Freddy's", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/7BpNtNfxuocYEVREzVMO75hso1l.jpg", year: "2023", type: "movie" },
    { title: "Five Nights at Freddy's 2", img: "https://www.themoviedb.org/t/p/w600_and_h900_face/udAxQEORq2I5wxI97N2TEqdhzBE.jpg", year: "2025", type: "movie" },
    /*{ title: "", img: "", year: "", type: "movie" },
    { title: "", img: "", year: "", type: "movie" },
    { title: "", img: "", year: "", type: "movie" },
    { title: "", img: "", year: "", type: "movie" },
    { title: "", img: "", year: "", type: "movie" },
    { title: "", img: "", year: "", type: "movie" },
    { title: "", img: "", year: "", type: "movie" },*/
  ],
  portfolio: [
    {
      title: "glitching.today",
      description: "Personal website & portfolio. Built with Vite + TypeScript.",
      url: "https://glitching.today",
      tags: ["web", "design"],
    },
    {
      title: "Null",
      description: "No description now... :3",
      tags: ["gamedev", "godot"],
    },
    {
      title: "SCP: Event Classified",
      description: "SCP: EVENT CLASSIFIED is a multiplayer horror shooter that allows players to take on a role of a soldier, prisoner, scientist and even a monster. Fight other players or unite with them to survive in this secret facility with game sessions up to 120 players.",
      url: "https://store.steampowered.com/app/1955030/SCP_EVENT_CLASSIFIED/",
      tags: ["gamedev", "unity"],
    },
    {
      title: "SocialQuest",
      description: "SocialQuest — A server for dating, games, and communication. Find new friends, play, and chat in a friendly atmosphere!",
      url: "https://discord.gg/DsE8fWMq9D",
      tags: ["bots", "discord", "server"],
    },
    {
      title: "Questy",
      description: "Dating bot...",
      url: "https://discord.com/oauth2/authorize?client_id=1436194442221719584",
      tags: ["bots", "discord"],
    },
    {
      title: "Brick MC",
      description: "Community management and content creation.",
      url: "https://discord.gg/knwhWN982P",
      tags: ["community", "content", "plugins"],
    },
    {
      title: "USmart",
      description: "Hackaton project for solve problem with Smart Home.",
      url: "https://github.com/todayisglitching/hackaton-template",
      tags: ["hackaton", "fastdev", "asp.net", "web"],
    },
    {
      title: "Aetherius",
      description: "Minecraft server on C++.",
      url: "https://github.com/SocialQuestDev/aetherius",
      tags: ["minecraft", "packets", "c++", "async"],
    },
  ],
  skills: [
    {
      label: "Languages",
      icon: "code",
      skills: ["TypeScript", "JavaScript", "Python", "C#", "Lua", "HTML/CSS", "Rust", "C++", "C"],
    },
    {
      label: "Frameworks",
      icon: "box",
      skills: ["Vite", "React", "Next.js", "Unity", "Godot", "Node.js", "Bun", "ASP.NET"],
    },
    {
      label: "Tools",
      icon: "wrench",
      skills: ["Git", "Figma", "Blender", "Linux", "Docker", "Obsidian", "Visual Studio Code", "Any Product JetBrains"],
    },
  ],
};
