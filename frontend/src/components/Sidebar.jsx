import React from 'react';
import {
  Home,
  Flame,
  Tv,
  FolderSync,
  History,
  PlaySquare,
  Clock,
  ThumbsUp,
  Music2,
  Gamepad2,
  Newspaper,
  Radio,
  Settings,
  HelpCircle,
  Flag,
  Sparkles,
  ListMusic
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  activeTab,
  setActiveTab,
  onResetToHome
}) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    if (tab === 'Home') {
      onResetToHome();
    }
  };

  // Mini / Collapsed Sidebar View
  if (!isOpen) {
    return (
      <aside className="yt-sidebar yt-sidebar-mini">
        <button
          className={`mini-nav-item ${activeTab === 'Home' ? 'active' : ''}`}
          onClick={() => handleNav('Home')}
          title="Home"
        >
          <Home size={22} />
          <span>Home</span>
        </button>
        <button
          className={`mini-nav-item ${activeTab === 'Shorts' ? 'active' : ''}`}
          onClick={() => handleNav('Shorts')}
          title="Shorts"
        >
          <Sparkles size={22} />
          <span>Shorts</span>
        </button>
        <button
          className={`mini-nav-item ${activeTab === 'Subscriptions' ? 'active' : ''}`}
          onClick={() => handleNav('Subscriptions')}
          title="Subscriptions"
        >
          <Tv size={22} />
          <span>Subscriptions</span>
        </button>
        <button
          className={`mini-nav-item ${activeTab === 'You' ? 'active' : ''}`}
          onClick={() => handleNav('You')}
          title="You"
        >
          <FolderSync size={22} />
          <span>You</span>
        </button>
      </aside>
    );
  }

  // Expanded Full Sidebar View
  return (
    <aside className="yt-sidebar yt-sidebar-full">
      <div className="sidebar-scroll-container">
        {/* Main Section */}
        <div className="sidebar-group">
          <button
            className={`sidebar-row ${activeTab === 'Home' ? 'active' : ''}`}
            onClick={() => handleNav('Home')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Shorts' ? 'active' : ''}`}
            onClick={() => handleNav('Shorts')}
          >
            <Sparkles size={20} />
            <span>Shorts</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Subscriptions' ? 'active' : ''}`}
            onClick={() => handleNav('Subscriptions')}
          >
            <Tv size={20} />
            <span>Subscriptions</span>
          </button>
        </div>

        <hr className="sidebar-divider" />

        {/* You Section */}
        <div className="sidebar-group">
          <div className="sidebar-heading">You &gt;</div>
          <button
            className={`sidebar-row ${activeTab === 'History' ? 'active' : ''}`}
            onClick={() => handleNav('History')}
          >
            <History size={20} />
            <span>History</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Your Videos' ? 'active' : ''}`}
            onClick={() => handleNav('Your Videos')}
          >
            <PlaySquare size={20} />
            <span>Your Videos</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Watch Later' ? 'active' : ''}`}
            onClick={() => handleNav('Watch Later')}
          >
            <Clock size={20} />
            <span>Watch Later</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Liked Videos' ? 'active' : ''}`}
            onClick={() => handleNav('Liked Videos')}
          >
            <ThumbsUp size={20} />
            <span>Liked Videos</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Playlists' ? 'active' : ''}`}
            onClick={() => handleNav('Playlists')}
          >
            <ListMusic size={20} />
            <span>Playlists</span>
          </button>
        </div>

        <hr className="sidebar-divider" />

        {/* Subscriptions Channels */}
        <div className="sidebar-group">
          <div className="sidebar-heading">Subscriptions</div>
          <div className="channel-sub-row">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=50&auto=format&fit=crop&q=80"
              alt="Lofi Girl"
              className="sub-avatar"
            />
            <span className="sub-name">Lofi Girl</span>
            <span className="live-badge-dot" title="Streaming now" />
          </div>
          <div className="channel-sub-row">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&auto=format&fit=crop&q=80"
              alt="Java Guides"
              className="sub-avatar"
            />
            <span className="sub-name">Java Guides</span>
          </div>
          <div className="channel-sub-row">
            <img
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=50&auto=format&fit=crop&q=80"
              alt="Traversy Media"
              className="sub-avatar"
            />
            <span className="sub-name">Traversy Media</span>
          </div>
          <div className="channel-sub-row">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop&q=80"
              alt="Silk Sonic"
              className="sub-avatar"
            />
            <span className="sub-name">Silk Sonic</span>
          </div>
        </div>

        <hr className="sidebar-divider" />

        {/* Explore Section */}
        <div className="sidebar-group">
          <div className="sidebar-heading">Explore</div>
          <button
            className={`sidebar-row ${activeTab === 'Trending' ? 'active' : ''}`}
            onClick={() => handleNav('Trending')}
          >
            <Flame size={20} />
            <span>Trending</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Music' ? 'active' : ''}`}
            onClick={() => handleNav('Music')}
          >
            <Music2 size={20} />
            <span>Music</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Gaming' ? 'active' : ''}`}
            onClick={() => handleNav('Gaming')}
          >
            <Gamepad2 size={20} />
            <span>Gaming</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'News' ? 'active' : ''}`}
            onClick={() => handleNav('News')}
          >
            <Newspaper size={20} />
            <span>News</span>
          </button>
          <button
            className={`sidebar-row ${activeTab === 'Live' ? 'active' : ''}`}
            onClick={() => handleNav('Live')}
          >
            <Radio size={20} />
            <span>Live</span>
          </button>
        </div>

        <hr className="sidebar-divider" />

        {/* Settings & Help */}
        <div className="sidebar-group">
          <button className="sidebar-row">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="sidebar-row">
            <Flag size={20} />
            <span>Report history</span>
          </button>
          <button className="sidebar-row">
            <HelpCircle size={20} />
            <span>Help</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <p>About Press Copyright</p>
          <p>Contact us Creators</p>
          <p>Terms Privacy Policy & Safety</p>
          <p className="copyright">© 2026 YouTube LLC / WMD3A</p>
        </div>
      </div>
    </aside>
  );
}
