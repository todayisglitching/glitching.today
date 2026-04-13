// ============================================================
// Discord API — Real-time presence via Lanyard
// WebSocket for live updates, REST for initial fetch
// ============================================================

import { USER_CONFIG } from '../data/config';

// ---------- Types ----------

interface DiscordUser {
  id: string;
  avatar: string | null;
  avatar_decoration_data?: { asset: string; sku_id: string } | null;
}

interface DiscordActivity {
  type?: number;
  name: string;
  details?: string;
  state?: string;
  emoji?: { name: string; id?: string | null };
  assets?: { large_image?: string };
  timestamps?: { start?: number; end?: number };
  application_id?: string;
}

interface SpotifyData {
  track: string;
  artists: string;
  album_art_url: string;
  timestamps: { start: number; end: number };
}

interface RawData {
  discord_status: string;
  discord_user: DiscordUser;
  activities: DiscordActivity[];
  spotify?: SpotifyData;
}

// Activity type constants from Discord
const TYPE_PLAYING = 0;
const TYPE_STREAMING = 1;
const TYPE_LISTENING = 2;
const TYPE_WATCHING = 3;
const TYPE_CUSTOM = 4;

const ACTIVITY_TYPES: Record<number, string> = {
  [TYPE_PLAYING]: 'playing',
  [TYPE_STREAMING]: 'streaming',
  [TYPE_LISTENING]: 'listening',
  [TYPE_WATCHING]: 'watching',
};

// ---------- Public types ----------

export type Status = 'online' | 'idle' | 'dnd' | 'offline';

export interface ActivityInfo {
  type: 'playing' | 'listening' | 'streaming' | 'watching' | 'none';
  appName: string;
  trackName?: string;
  artistName?: string;
  coverUrl?: string;
  elapsed?: number;
  duration?: number;
  details?: string;
  state?: string;
}

export interface DiscordState {
  status: Status;
  avatarUrl: string;
  avatarDecorationUrl: string | null;
  activity: ActivityInfo;
}

// ---------- Helpers ----------

function buildCoverUrl(
  applicationId: string | undefined,
  asset: string | undefined
): string | undefined {
  if (!asset) return undefined;

  // Discord mp:external/ proxy — MUST check BEFORE startsWith('http')
  // because asset can be a full CDN URL containing mp:external:
  // https://cdn.discordapp.com/app-assets/.../mp:external/<hash>/https/<actual-url>
  if (asset.includes('mp:external')) {
    const httpsIdx = asset.indexOf('/https/');
    if (httpsIdx !== -1) return `https://${asset.slice(httpsIdx + 7)}`;
    const httpIdx = asset.indexOf('/http/');
    if (httpIdx !== -1) return `http://${asset.slice(httpIdx + 6)}`;
  }

  // Direct external URL (Spotify album art, etc.)
  if (asset.startsWith('http')) return asset;

  // Standard Discord app asset key
  if (applicationId) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.png?size=256`;
  }

  return undefined;
}

function parseActivity(raw: DiscordActivity): ActivityInfo {
  const type = raw.type ?? 0;
  return {
    type: (ACTIVITY_TYPES[type] || 'playing') as ActivityInfo['type'],
    appName: raw.name,
    details: raw.details,
    state: raw.state,
    coverUrl: buildCoverUrl(raw.application_id, raw.assets?.large_image),
    ...(type === TYPE_LISTENING && raw.timestamps?.start && raw.timestamps?.end
      ? {
          trackName: raw.details || raw.name,
          artistName: raw.state || '',
          elapsed: Date.now() - raw.timestamps.start,
          duration: raw.timestamps.end - raw.timestamps.start,
        }
      : {}),
  };
}

function parseSpotify(raw: SpotifyData): ActivityInfo {
  const duration = raw.timestamps.end - raw.timestamps.start;
  return {
    type: 'listening',
    appName: 'Spotify',
    trackName: raw.track,
    artistName: raw.artists,
    coverUrl: raw.album_art_url,
    elapsed: Date.now() - raw.timestamps.start,
    duration,
  };
}

function parseRawData(data: RawData): DiscordState {
  const status: Status = (data.discord_status || 'offline') as Status;

  // Avatar URL
  let avatarUrl = USER_CONFIG.fallbackAvatar;
  if (data.discord_user?.avatar && data.discord_user?.id) {
    const uid = data.discord_user.id;
    const hash = data.discord_user.avatar;
    const ext = hash.startsWith('a_') ? 'gif' : 'png';
    avatarUrl = `https://cdn.discordapp.com/avatars/${uid}/${hash}.${ext}?size=256`;
  }

  // Avatar decoration
  let decorationUrl: string | null = null;
  const deco = data.discord_user?.avatar_decoration_data;
  if (deco?.asset) {
    decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${deco.asset}.png?size=128`;
  }

  // Activity — Spotify takes priority
  let activity: ActivityInfo;
  if (data.spotify) {
    activity = parseSpotify(data.spotify);
  } else {
    const realActivities = (data.activities || []).filter((a) => a.type !== TYPE_CUSTOM);
    activity = realActivities[0] ? parseActivity(realActivities[0]) : { type: 'none', appName: '' };
  }

  return { status, avatarUrl, avatarDecorationUrl: decorationUrl, activity };
}

// ---------- Public API ----------

export function createDiscordSync() {
  let state: DiscordState = {
    status: 'offline',
    avatarUrl: USER_CONFIG.fallbackAvatar,
    avatarDecorationUrl: null,
    activity: { type: 'none', appName: '' },
  };

  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  function updateFromRaw(data: RawData): void {
    state = parseRawData(data);
  }

  function connectWebSocket(): void {
    ws?.close();
    ws = null;
    if (reconnectTimer) clearTimeout(reconnectTimer);

    ws = new WebSocket('wss://api.lanyard.rest/socket');

    ws.onopen = () => {
      ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: USER_CONFIG.discordId } }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.op === 0 || msg.op === 1) {
          if (msg.d) updateFromRaw(msg.d as RawData);
        }
      } catch { /* ignore parse errors */ }
    };

    ws.onclose = () => {
      reconnectTimer = setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = () => ws?.close();
  }

  async function fetchREST(): Promise<void> {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_CONFIG.discordId}`);
      const json = await res.json();
      if (json.success && json.data) updateFromRaw(json.data);
    } catch { /* ignore */ }
  }

  async function sync(): Promise<void> {
    await fetchREST();
    connectWebSocket();
  }

  return { getState: () => state, sync };
}
