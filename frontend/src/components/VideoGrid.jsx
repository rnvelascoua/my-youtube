import React from 'react';
import VideoCard from './VideoCard';
import { Film } from 'lucide-react';

export default function VideoGrid({
  videos,
  isLoading,
  onSelectVideo,
  onDeleteVideo,
  openUploadModal
}) {
  if (isLoading) {
    return (
      <div className="video-grid-skeleton">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-thumb" />
            <div className="skeleton-details">
              <div className="skeleton-avatar" />
              <div className="skeleton-lines">
                <div className="skeleton-line title" />
                <div className="skeleton-line meta" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <Film size={48} />
        </div>
        <h3>No videos found</h3>
        <p>Try searching with another keyword or upload a new song to your collection.</p>
        <button className="create-btn empty-upload-btn" onClick={openUploadModal}>
          Upload a Video / Song
        </button>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onSelectVideo={onSelectVideo}
          onDeleteVideo={onDeleteVideo}
        />
      ))}
    </div>
  );
}
