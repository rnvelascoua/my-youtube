import { INITIAL_VIDEOS } from '../data/mockVideos';

const STORAGE_KEY = 'my_youtube_videos';

const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '/reyes/songs';

  envUrl = envUrl.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(envUrl)) {
    envUrl = `https://${envUrl}`;
  }
  return `${envUrl}/reyes/songs`;
};

const API_BASE_URL = getBaseUrl();

// Load stored videos or fallback to initial
export function getLocalVideos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VIDEOS));
  return INITIAL_VIDEOS;
}

export function saveLocalVideos(videos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Fetch all songs/videos: attempts Spring Boot backend first, falls back to localStorage
export async function fetchVideos() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
    const res = await fetch(API_BASE_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const backendSongs = await res.json();
      if (Array.isArray(backendSongs) && backendSongs.length > 0) {
        // Merge backend fields with mock visual enhancements
        const merged = backendSongs.map((song, index) => ({
          id: song.id || Date.now() + index,
          title: song.title || 'Untitled Video',
          artist: song.artist || 'Unknown Artist',
          genre: song.genre || 'Music',
          album: song.album || '',
          url: song.url || '',
          views: 120000 + (song.id ? song.id * 8500 : 5000),
          timeAgo: 'Just now',
          duration: '3:45',
          channelAvatar: `https://images.unsplash.com/photo-${1534528741775 + (index % 10)}?w=100&auto=format&fit=crop&q=80`,
          subscribers: '1.2M',
          likes: '45K',
          verified: true,
          description: `Album: ${song.album || 'N/A'} | Genre: ${song.genre || 'N/A'} - Provided by Spring Boot REST API.`,
          comments: []
        }));
        return { data: merged, source: 'backend' };
      }
    }
  } catch (err) {
    // Backend offline or unreachable, fall back to local
  }
  return { data: getLocalVideos(), source: 'local' };
}

// Create video/song
export async function createVideo(videoData) {
  // Try sending to backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: videoData.title,
        artist: videoData.artist,
        genre: videoData.genre,
        album: videoData.album,
        url: videoData.url
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const savedSong = await res.json();
      return {
        ...videoData,
        id: savedSong.id || Date.now(),
        source: 'backend'
      };
    }
  } catch (e) {
    // Backend unavailable, handle locally
  }

  // Local storage save
  const current = getLocalVideos();
  const newVideo = {
    ...videoData,
    id: Date.now(),
    views: 0,
    timeAgo: 'Just now',
    duration: videoData.duration || '3:30',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    subscribers: '1 Subscriber',
    likes: '0',
    verified: false,
    comments: [],
    source: 'local'
  };
  saveLocalVideos([newVideo, ...current]);
  return newVideo;
}

// Delete video/song
export async function deleteVideo(id) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch (e) {
    // Ignore error if offline
  }

  const current = getLocalVideos();
  const updated = current.filter(v => v.id !== id);
  saveLocalVideos(updated);
  return updated;
}
