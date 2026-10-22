import { INITIAL_VIDEOS } from '../data/mockVideos';

const STORAGE_KEY = 'my_youtube_videos';

// Ensure mock videos have unique string IDs (e.g., 'mock-1') so they never collide
// with database numeric IDs (e.g., 2, 3, 4) in React keys or delete actions
const SAFE_MOCK_VIDEOS = INITIAL_VIDEOS.map((video) => ({
  ...video,
  id: typeof video.id === 'string' && video.id.startsWith('mock-') ? video.id : `mock-${video.id}`,
  isDatabaseItem: false
}));

// Determine candidate backend endpoints to query
function getCandidateEndpoints() {
  const endpoints = [];

  // 1. Direct localhost:8080 (fastest & most reliable when running locally in development)
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    endpoints.push('http://localhost:8080/reyes/songs');
  }

  // 2. If explicit environment variable is set (Render build or local .env)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    const withoutProto = clean.replace(/^https?:\/\//i, '');
    // If Render host without domain (e.g. "youtube-backend-xq6q" or "youtube-backend-xq6q:8080")
    if (!withoutProto.includes('.') && !withoutProto.includes('localhost')) {
      const hostOnly = withoutProto.split(':')[0];
      clean = `https://${hostOnly}.onrender.com`;
    } else if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }
    endpoints.push(`${clean}/reyes/songs`);
  }

  // 3. Known Render production deployment backend
  endpoints.push('https://youtube-backend-xq6q.onrender.com/reyes/songs');

  // 4. Relative proxy path
  endpoints.push('/reyes/songs');

  // Remove duplicates while preserving priority order
  return [...new Set(endpoints)];
}

// Active working endpoint (cached once successfully connected)
let activeEndpoint = null;

function getDefaultEndpoint() {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:8080/reyes/songs';
  }
  return 'https://youtube-backend-xq6q.onrender.com/reyes/songs';
}

// Load stored videos or fallback to safe mock items
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
    console.warn('[YouTube API] Failed to read localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAFE_MOCK_VIDEOS));
  return SAFE_MOCK_VIDEOS;
}

export function saveLocalVideos(videos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (e) {
    console.error('[YouTube API] Failed to save to localStorage:', e);
  }
}

// Format a backend song entity into a full YouTube video card object
function formatBackendSong(song, index) {
  return {
    id: song.id,
    title: song.title || 'Untitled Video',
    artist: song.artist || 'Unknown Artist',
    genre: song.genre || 'Music',
    album: song.album || '',
    url: song.url || '',
    views: 450000 + (song.id ? song.id * 8500 : 1000),
    timeAgo: 'Database',
    duration: '3:45',
    channelAvatar: `https://images.unsplash.com/photo-${1534528741775 + (index % 10)}?w=100&auto=format&fit=crop&q=80`,
    subscribers: '1.2M',
    likes: '45K',
    verified: true,
    isDatabaseItem: true,
    description: `Artist: ${song.artist}\nAlbum: ${song.album || 'N/A'}\nGenre: ${song.genre || 'N/A'}\nOriginal URL: ${song.url}\n(Loaded directly from PostgreSQL database via Spring Boot REST API)`,
    comments: [
      {
        id: 9001 + index,
        user: 'DatabaseSync',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        text: `Persisted in Spring Boot backend at /reyes/songs/${song.id}`,
        timeAgo: 'Just now',
        likes: 12
      }
    ]
  };
}

// Fetch all songs/videos from Spring Boot backend with auto-fallback
export async function fetchVideos() {
  const candidates = getCandidateEndpoints();
  console.log('[YouTube API] Probing candidates:', candidates);

  for (const url of candidates) {
    try {
      console.log('[YouTube API] Attempting fetch from:', url);
      const controller = new AbortController();
      // Allow up to 12s in case Render free tier is waking from sleep
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const backendSongs = await res.json();
        console.log('[YouTube API] Successfully received songs from backend:', backendSongs);

        if (Array.isArray(backendSongs)) {
          activeEndpoint = url;
          const formattedBackend = backendSongs.map(formatBackendSong);

          // Combine: Put database songs first, followed by default mock videos
          const combined = [...formattedBackend, ...SAFE_MOCK_VIDEOS];
          return {
            data: formattedBackend.length > 0 ? combined : SAFE_MOCK_VIDEOS,
            source: 'backend',
            endpoint: url,
            count: formattedBackend.length
          };
        }
      } else {
        console.warn(`[YouTube API] Endpoint ${url} returned HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn(`[YouTube API] Fetch failed for ${url}:`, err.message || err);
    }
  }

  console.warn('[YouTube API] Could not reach Spring Boot backend on any candidate. Using local storage fallback.');
  return {
    data: getLocalVideos(),
    source: 'local',
    endpoint: null,
    count: 0
  };
}

// Create a new song/video
export async function createVideo(videoData) {
  const targetUrl = activeEndpoint || getDefaultEndpoint();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
      console.log('[YouTube API] Created song on backend:', savedSong);
      return {
        ...formatBackendSong(savedSong, 0),
        duration: videoData.duration || '3:30',
        source: 'backend'
      };
    }
  } catch (e) {
    console.warn('[YouTube API] Backend POST failed, saving locally:', e);
  }

  // Local storage fallback
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

// Delete a song/video
export async function deleteVideo(id) {
  const targetUrl = activeEndpoint || getDefaultEndpoint();

  // If numeric ID, attempt backend DELETE
  if (typeof id === 'number' || !isNaN(Number(id))) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      await fetch(`${targetUrl}/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log(`[YouTube API] Deleted song #${id} on backend`);
    } catch (e) {
      console.warn(`[YouTube API] Backend DELETE failed for #${id}:`, e);
    }
  }

  const current = getLocalVideos();
  const updated = current.filter((v) => v.id !== id);
  saveLocalVideos(updated);
  return updated;
}
