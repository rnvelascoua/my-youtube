import React, { useState } from 'react';
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  X,
  Upload,
  Radio,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Server
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onSearch,
  toggleSidebar,
  openUploadModal,
  backendConnected,
  isDarkMode,
  toggleTheme,
  onResetToHome
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchTerm('synthwave');
      onSearch('synthwave');
    }, 1500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="yt-navbar">
      {/* Left: Hamburger & Logo */}
      <div className="nav-left">
        <button
          className="icon-btn hover-bg"
          onClick={toggleSidebar}
          aria-label="Toggle navigation drawer"
          title="Guide"
        >
          <Menu size={20} />
        </button>

        <div className="yt-brand" onClick={onResetToHome} title="YouTube Home">
          <div className="yt-logo-box">
            <svg viewBox="0 0 24 24" className="yt-icon-svg" fill="#FF0000">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <span className="yt-logo-text">
            YouTube<span className="yt-country-badge">PRO</span>
          </span>
        </div>
      </div>

      {/* Middle: Search bar & Voice search */}
      <div className="nav-middle">
        <form className="search-form" onSubmit={handleFormSubmit}>
          <div className="search-input-wrap">
            <input
              type="text"
              placeholder="Search songs, artists, videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn" title="Search">
            <Search size={19} />
          </button>
        </form>

        <button
          type="button"
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceSearch}
          title="Search with your voice"
        >
          <Mic size={18} />
          {isListening && <span className="listening-pulse" />}
        </button>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="nav-right">
        {/* Backend status chip */}
        <div
          className={`backend-status-pill ${backendConnected ? 'connected' : 'local'}`}
          title={
            backendConnected
              ? 'Connected to Spring Boot backend (/reyes/songs)'
              : 'Using Local Storage mode (Spring Boot offline)'
          }
        >
          <Server size={13} />
          <span>{backendConnected ? 'API Connected' : 'Local Mode'}</span>
        </div>

        {/* Create / Upload button */}
        <button
          className="create-btn"
          onClick={openUploadModal}
          title="Create or upload song"
        >
          <Upload size={17} />
          <span className="create-text">Create</span>
        </button>

        {/* Notifications toggle */}
        <div className="dropdown-wrapper">
          <button
            className="icon-btn hover-bg notif-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="notif-badge">3</span>
          </button>

          {showNotifications && (
            <div className="dropdown-panel notif-panel">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="dropdown-link">Settings</span>
              </div>
              <div className="notif-list">
                <div className="notif-item unread">
                  <div className="notif-avatar-dot" />
                  <div className="notif-content">
                    <p className="notif-text">
                      <strong>Lofi Girl</strong> is currently streaming synthwave radio.
                    </p>
                    <span className="notif-time">2 hours ago</span>
                  </div>
                </div>
                <div className="notif-item unread">
                  <div className="notif-avatar-dot" />
                  <div className="notif-content">
                    <p className="notif-text">
                      <strong>Java Guides</strong> uploaded a new Spring Boot tutorial.
                    </p>
                    <span className="notif-time">1 day ago</span>
                  </div>
                </div>
                <div className="notif-item">
                  <div className="notif-content">
                    <p className="notif-text">
                      Welcome to your YouTube clone for WMD3A Java!
                    </p>
                    <span className="notif-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar */}
        <div className="dropdown-wrapper">
          <button
            className="avatar-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Account"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="User profile"
              className="user-avatar-img"
            />
          </button>

          {showUserMenu && (
            <div className="dropdown-panel user-menu-panel">
              <div className="user-info-row">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="User avatar"
                  className="user-avatar-large"
                />
                <div className="user-info-text">
                  <div className="user-display-name">Velasco (WMD3A)</div>
                  <div className="user-handle">@student-dev</div>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <button className="menu-row-btn" onClick={toggleTheme}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>Appearance: {isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
              <button className="menu-row-btn" onClick={openUploadModal}>
                <Video size={18} />
                <span>YouTube Studio</span>
              </button>
              <button className="menu-row-btn">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button className="menu-row-btn">
                <HelpCircle size={18} />
                <span>Help & Feedback</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
