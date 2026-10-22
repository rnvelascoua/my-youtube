import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { getEmbedUrl, formatViews, getThumbnailUrl } from '../utils/youtubeHelper';
import CommentsSection from './CommentsSection';

export default function WatchPage({
  video,
  allVideos,
  onBack,
  onSelectRelatedVideo,
  onUpdateVideo
}) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const embedUrl = getEmbedUrl(video.url);
  const relatedVideos = allVideos.filter((v) => v.id !== video.id);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(video.url || window.location.href);
    alert('Video URL copied to clipboard!');
  };

  const handleAddComment = (commentText) => {
    const newCommentObj = {
      id: Date.now(),
      user: 'Velasco (WMD3A)',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: commentText,
      timeAgo: 'Just now',
      likes: 0
    };

    const updatedComments = [newCommentObj, ...(video.comments || [])];
    if (onUpdateVideo) {
      onUpdateVideo({ ...video, comments: updatedComments });
    }
  };

  return (
    <div className="watch-page-container">
      {/* Top bar back button */}
      <div className="watch-top-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back to Feed</span>
        </button>
      </div>

      <div className="watch-content-layout">
        {/* Left Column: Player, Video Info, Description, Comments */}
        <div className="watch-main-column">
          {/* 16:9 Video Player */}
          <div className="video-player-frame">
            {embedUrl && embedUrl.includes('youtube.com') ? (
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="yt-iframe"
              />
            ) : video.url && video.url.endsWith('.mp4') ? (
              <video
                src={video.url}
                controls
                autoPlay
                className="yt-iframe"
              />
            ) : (
              <iframe
                src={embedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="yt-iframe"
              />
            )}
          </div>

          {/* Video Title */}
          <h1 className="watch-title">{video.title}</h1>

          {/* Channel Row & Actions */}
          <div className="watch-channel-action-row">
            {/* Channel info */}
            <div className="channel-sub-info">
              <img
                src={
                  video.channelAvatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                }
                alt={video.artist}
                className="watch-channel-avatar"
              />
              <div className="channel-names-box">
                <div className="channel-title-row">
                  <span className="channel-artist-name">{video.artist || 'Artist'}</span>
                  {video.verified !== false && (
                    <CheckCircle2 size={14} className="verified-badge-icon" />
                  )}
                </div>
                <span className="subscribers-count">
                  {isSubscribed ? 'Subscribed' : `${video.subscribers || '1.2M'} subscribers`}
                </span>
              </div>

              <button
                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Action buttons: Like/Dislike, Share, Download, Save */}
            <div className="watch-action-buttons">
              <div className="like-dislike-pill">
                <button
                  className={`pill-action-btn like-btn ${isLiked ? 'active' : ''}`}
                  onClick={handleLike}
                >
                  <ThumbsUp size={18} />
                  <span>{isLiked ? 'Liked' : video.likes || 'Like'}</span>
                </button>
                <div className="pill-divider" />
                <button
                  className={`pill-action-btn dislike-btn ${isDisliked ? 'active' : ''}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown size={18} />
                </button>
              </div>

              <button className="pill-action-btn" onClick={handleShare}>
                <Share2 size={18} />
                <span>Share</span>
              </button>

              <button className="pill-action-btn" onClick={() => alert('Download started!')}>
                <Download size={18} />
                <span>Download</span>
              </button>

              <button className="pill-action-btn save-btn">
                <Bookmark size={18} />
                <span>Save</span>
              </button>

              <button className="pill-action-btn more-btn">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div
            className={`watch-description-box ${isDescExpanded ? 'expanded' : ''}`}
            onClick={() => setIsDescExpanded(!isDescExpanded)}
          >
            <div className="desc-meta-header">
              <span className="desc-views">{formatViews(video.views)}</span>
              <span className="desc-date">{video.timeAgo || 'Recently'}</span>
              {video.genre && <span className="desc-genre-tag">#{video.genre}</span>}
              {video.album && <span className="desc-album-tag">#{video.album}</span>}
            </div>

            <p className="desc-text">
              {video.description ||
                `Enjoy this music track "${video.title}" by ${video.artist}. From the album "${video.album || 'Unknown'}". Part of WMD3A Java YouTube platform.`}
            </p>

            <div className="desc-backend-details">
              <strong>Spring Boot Song Entity Fields:</strong>
              <div className="details-grid">
                <div><span>Title:</span> {video.title}</div>
                <div><span>Artist:</span> {video.artist}</div>
                <div><span>Genre:</span> {video.genre || 'N/A'}</div>
                <div><span>Album:</span> {video.album || 'N/A'}</div>
                <div><span>URL:</span> {video.url}</div>
              </div>
            </div>

            <button
              className="desc-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsDescExpanded(!isDescExpanded);
              }}
            >
              {isDescExpanded ? 'Show less' : '...more'}
            </button>
          </div>

          {/* Comments Section */}
          <CommentsSection
            comments={video.comments || []}
            onAddComment={handleAddComment}
          />
        </div>

        {/* Right Column: Up Next / Related Videos */}
        <div className="watch-sidebar-column">
          <h3 className="related-heading">Up Next</h3>
          <div className="related-videos-list">
            {relatedVideos.map((item) => (
              <div
                key={item.id}
                className="related-video-card"
                onClick={() => onSelectRelatedVideo(item)}
              >
                <div className="related-thumb-wrap">
                  <img
                    src={getThumbnailUrl(item.url, item.thumbnail)}
                    alt={item.title}
                    className="related-thumb-img"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60';
                    }}
                  />
                  <span className="related-duration">{item.duration || '3:30'}</span>
                </div>
                <div className="related-info-wrap">
                  <h4 className="related-title" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="related-channel">{item.artist}</div>
                  <div className="related-views">
                    {formatViews(item.views)} • {item.timeAgo || 'Recently'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
