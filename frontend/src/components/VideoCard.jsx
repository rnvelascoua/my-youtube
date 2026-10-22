import React, { useState } from 'react';
import { CheckCircle2, MoreVertical, Clock, Share2, Trash2 } from 'lucide-react';
import { getThumbnailUrl, formatViews } from '../utils/youtubeHelper';

export default function VideoCard({ video, onSelectVideo, onDeleteVideo }) {
  const [showMenu, setShowMenu] = useState(false);
  const thumbnailUrl = getThumbnailUrl(video.url, video.thumbnail);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm(`Delete "${video.title}"?`)) {
      onDeleteVideo(video.id);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    navigator.clipboard?.writeText(video.url || window.location.href);
    alert('Video link copied to clipboard!');
  };

  return (
    <div className="yt-card" onClick={() => onSelectVideo(video)}>
      {/* Thumbnail area */}
      <div className="card-thumb-wrap">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="card-thumb-img"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60';
          }}
        />
        <span className={`duration-badge ${video.duration === 'Live' ? 'live' : ''}`}>
          {video.duration || '3:45'}
        </span>
      </div>

      {/* Info area */}
      <div className="card-info-wrap">
        <div className="channel-avatar-wrap">
          <img
            src={
              video.channelAvatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
            }
            alt={video.artist}
            className="channel-avatar"
          />
        </div>

        <div className="card-text-wrap">
          <h3 className="card-title" title={video.title}>
            {video.title}
          </h3>

          <div className="card-channel-name">
            <span>{video.artist || 'Unknown Artist'}</span>
            {video.verified !== false && (
              <CheckCircle2 size={13} className="verified-badge-icon" />
            )}
          </div>

          <div className="card-meta">
            <span>{formatViews(video.views)}</span>
            <span className="meta-bullet">•</span>
            <span>{video.timeAgo || 'Recently'}</span>
          </div>

          {video.album && (
            <div className="card-tags">
              <span className="card-tag album-tag">Album: {video.album}</span>
              {video.genre && <span className="card-tag genre-tag">{video.genre}</span>}
            </div>
          )}
        </div>

        {/* 3-dot options menu */}
        <div className="card-options-wrap">
          <button
            className="card-options-btn"
            onClick={handleMenuClick}
            title="Action menu"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="card-menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <button className="card-menu-item" onClick={handleShare}>
                <Share2 size={15} />
                <span>Share</span>
              </button>
              <button
                className="card-menu-item delete-item"
                onClick={handleDelete}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
