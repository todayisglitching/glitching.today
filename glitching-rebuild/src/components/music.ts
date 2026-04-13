import { USER_CONFIG, Track } from '../data/config';

export function createMusicPlayer() {
  const audio = document.getElementById('bg-audio') as HTMLAudioElement;
  const volumeSlider = document.getElementById('volume-control') as HTMLInputElement;

  let tracks: Track[] = [...USER_CONFIG.tracks];
  let currentIndex = 0;

  function getTracks(): Track[] {
    return tracks;
  }

  function getCurrentIndex(): number {
    return currentIndex;
  }

  function loadTrack(index: number, autoplay = false): void {
    const track = tracks[index];
    if (!track) return;

    currentIndex = index;
    audio.src = track.url;

    const titleEl = document.getElementById('song-title');
    const artistEl = document.getElementById('song-artist');
    const selectEl = document.getElementById('track-select') as HTMLSelectElement;

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (selectEl) selectEl.value = track.id;

    if (autoplay) {
      audio.play().catch(() => {});
    }
  }

  function play(): void {
    audio.play().catch(() => {});
  }

  function pause(): void {
    audio.pause();
  }

  function togglePlay(): boolean {
    if (audio.paused) {
      play();
      return true;
    } else {
      pause();
      return false;
    }
  }

  function toggleMute(): boolean {
    audio.muted = !audio.muted;
    return audio.muted;
  }

  function next(): void {
    const idx = (currentIndex + 1) % tracks.length;
    loadTrack(idx, true);
  }

  function prev(): void {
    const idx = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(idx, true);
  }

  function selectTrack(trackId: string): void {
    const idx = tracks.findIndex((t) => t.id === trackId);
    if (idx === -1) return;
    loadTrack(idx, true);
  }

  function setupEvents(): void {
    if (volumeSlider) {
      volumeSlider.oninput = () => {
        audio.volume = Number(volumeSlider.value);
        if (audio.muted && audio.volume > 0) {
          audio.muted = false;
        }
      };
    }

    audio.ontimeupdate = () => {
      const bar = document.getElementById('progress-fill');
      if (!audio.duration) {
        if (bar) bar.style.width = '0%';
        return;
      }
      const pct = (audio.currentTime / audio.duration) * 100;
      if (bar) bar.style.width = `${pct}%`;
    };

    audio.onended = () => next();

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.onclick = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        if (audio.duration) {
          audio.currentTime = pct * audio.duration;
        }
      };
    }
  }

  function init(): void {
    setupEvents();
    audio.volume = volumeSlider ? Number(volumeSlider.value) : 0.05;
    currentIndex = Math.floor(Math.random() * tracks.length);
    loadTrack(currentIndex, false);
  }

  return {
    init,
    getTracks,
    getCurrentIndex,
    loadTrack,
    togglePlay,
    toggleMute,
    next,
    prev,
    selectTrack,
    isPlaying: () => !audio.paused,
    isMuted: () => audio.muted,
  };
}
