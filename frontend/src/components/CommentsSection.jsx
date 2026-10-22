import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export default function CommentsSection({ comments = [], onAddComment }) {
  const [newComment, setNewComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [likedComments, setLikedComments] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(newComment.trim());
    setNewComment('');
    setIsFocused(false);
  };

  const toggleLike = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <section className="comments-section">
      <div className="comments-header">
        <h3>
          <MessageSquare size={20} />
          <span>{comments.length} Comments</span>
        </h3>
        <span className="comments-sort">Sort by</span>
      </div>

      {/* Add comment input */}
      <div className="add-comment-row">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
          alt="Current user"
          className="comment-user-avatar"
        />
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setIsFocused(true)}
            rows={isFocused ? 2 : 1}
            className="comment-input"
          />
          {isFocused && (
            <div className="comment-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setNewComment('');
                  setIsFocused(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="submit-comment-btn"
              >
                Comment
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Comments list */}
      <div className="comments-list">
        {comments.map((comment) => {
          const isLiked = !!likedComments[comment.id];
          const likeCount = (comment.likes || 0) + (isLiked ? 1 : 0);

          return (
            <div key={comment.id} className="comment-item">
              <img
                src={
                  comment.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                }
                alt={comment.user}
                className="comment-avatar"
              />
              <div className="comment-body">
                <div className="comment-author-row">
                  <span className="comment-author">@{comment.user || 'user'}</span>
                  <span className="comment-time">{comment.timeAgo || 'Just now'}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-reactions">
                  <button
                    className={`reaction-btn ${isLiked ? 'active' : ''}`}
                    onClick={() => toggleLike(comment.id)}
                  >
                    <ThumbsUp size={14} />
                    <span>{likeCount > 0 ? likeCount : ''}</span>
                  </button>
                  <button className="reaction-btn">
                    <ThumbsDown size={14} />
                  </button>
                  <button className="reply-btn">Reply</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
