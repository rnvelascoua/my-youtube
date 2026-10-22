import React, { useState } from 'react';
import { X, Upload, Film, Link as LinkIcon, Music, Disc, User, Sparkles } from 'lucide-react';
import { extractYouTubeId, getThumbnailUrl } from '../utils/youtubeHelper';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: 'Music',
    album: '',
    url: '',
    duration: '3:30'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleQuickFill = (preset) => {
    if (preset === 'lofi') {
      setFormData({
        title: 'Chill Lo-Fi Hip Hop Beats to Code and Relax',
        artist: 'Lofi Girl',
        genre: 'Chillhop',
        album: 'Lo-Fi Chill Sessions',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        duration: 'Live'
      });
    } else if (preset === 'rock') {
      setFormData({
        title: 'Queen - Bohemian Rhapsody (Official Video Remastered)',
        artist: 'Queen',
        genre: 'Rock',
        album: 'A Night at the Opera',
        url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
        duration: '5:55'
      });
    } else if (preset === 'java') {
      setFormData({
        title: 'Spring Boot REST API Full Course - CRUD Application',
        artist: 'Amigoscode',
        genre: 'Programming',
        album: 'Spring Framework Masterclass',
        url: 'https://www.youtube.com/watch?v=9SGDpanrc8U',
        duration: '2:15:00'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please provide a song/video title.');
      return;
    }
    if (!formData.artist.trim()) {
      setError('Please provide the artist or channel name.');
      return;
    }
    if (!formData.url.trim()) {
      setError('Please provide a valid YouTube URL or video link.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUploadSuccess(formData);
      onClose();
    } catch (err) {
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const detectedId = extractYouTubeId(formData.url);
  const previewThumbnail = detectedId ? getThumbnailUrl(formData.url) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Upload size={22} className="modal-icon" />
            <h2>Upload Video / Add Song</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Quick presets */}
        <div className="quick-fill-bar">
          <span className="quick-label">
            <Sparkles size={14} /> Quick Samples:
          </span>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handleQuickFill('lofi')}
          >
            Chill Lo-Fi
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handleQuickFill('rock')}
          >
            Bohemian Rhapsody
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handleQuickFill('java')}
          >
            Spring Boot Tutorial
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="modal-error-alert">{error}</div>}

          <div className="form-grid">
            <div className="form-field-group full-width">
              <label>
                <Film size={15} /> Video / Song Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Rick Astley - Never Gonna Give You Up"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field-group">
              <label>
                <User size={15} /> Artist / Channel Name *
              </label>
              <input
                type="text"
                name="artist"
                placeholder="e.g., Rick Astley"
                value={formData.artist}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field-group">
              <label>
                <Music size={15} /> Genre
              </label>
              <select name="genre" value={formData.genre} onChange={handleChange}>
                <option value="Music">Music</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Chillhop">Chillhop</option>
                <option value="R&B / Soul">R&B / Soul</option>
                <option value="Programming">Programming</option>
                <option value="Gaming">Gaming</option>
                <option value="Acoustic">Acoustic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field-group">
              <label>
                <Disc size={15} /> Album
              </label>
              <input
                type="text"
                name="album"
                placeholder="e.g., Whenever You Need Somebody"
                value={formData.album}
                onChange={handleChange}
              />
            </div>

            <div className="form-field-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                placeholder="e.g., 3:45 or Live"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div className="form-field-group full-width">
              <label>
                <LinkIcon size={15} /> YouTube URL / Video Link *
              </label>
              <input
                type="text"
                name="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.url}
                onChange={handleChange}
                required
              />
              <span className="field-hint">
                Supports any standard YouTube link, short link, or video ID.
              </span>
            </div>
          </div>

          {/* Thumbnail preview if YouTube ID parsed */}
          {previewThumbnail && (
            <div className="url-preview-box">
              <span className="preview-label">Detected YouTube Video Preview:</span>
              <div className="preview-card-compact">
                <img src={previewThumbnail} alt="Preview" className="preview-thumb-img" />
                <div className="preview-text">
                  <div className="preview-id-tag">YouTube ID: {detectedId}</div>
                  <div className="preview-ready-text">Ready for instant embed playback!</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="modal-footer">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="modal-submit-btn"
            >
              {isSubmitting ? 'Uploading...' : 'Publish to Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
