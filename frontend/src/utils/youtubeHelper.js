export function extractYouTubeId(url) {
  if (!url) return null;
  
  // Clean trimmed url
  const trimmed = url.trim();

  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function getEmbedUrl(url) {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
  }
  // Return url as is if already embed or direct link
  return url;
}

export function getThumbnailUrl(url, customThumbnail) {
  if (customThumbnail && customThumbnail.startsWith('http')) {
    return customThumbnail;
  }
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60';
}

export function formatViews(views) {
  if (views == null) return '0 views';
  const num = typeof views === 'string' ? parseInt(views.replace(/[^0-9]/g, ''), 10) || 0 : views;
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B views';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
  }
  return `${num} views`;
}

export function formatDuration(duration) {
  if (!duration) return '3:45';
  if (typeof duration === 'number') {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return duration;
}
