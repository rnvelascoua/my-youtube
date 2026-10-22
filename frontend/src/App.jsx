import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategoryPills from './components/CategoryPills';
import VideoGrid from './components/VideoGrid';
import WatchPage from './components/WatchPage';
import UploadModal from './components/UploadModal';
import { CATEGORIES } from './data/mockVideos';
import { fetchVideos, createVideo, deleteVideo, saveLocalVideos } from './services/songApi';
import './App.css';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Apply dark mode class to root body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  // Load videos on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await fetchVideos();
      setVideos(res.data);
      setBackendConnected(res.source === 'backend');
      setIsLoading(false);
    }
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    if (selectedVideo) {
      setSelectedVideo(null); // Return to grid when clicking a category
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (selectedVideo) {
      setSelectedVideo(null);
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    setSelectedVideo(null);
  };

  const handleResetToHome = () => {
    setSelectedVideo(null);
    setActiveCategory('All');
    setSearchTerm('');
    setActiveTab('Home');
  };

  const handleUploadSuccess = async (formData) => {
    const created = await createVideo(formData);
    setVideos((prev) => [created, ...prev]);
    showToast(`"${formData.title}" published successfully!`);
  };

  const handleDeleteVideo = async (id) => {
    const updated = await deleteVideo(id);
    setVideos(updated);
    if (selectedVideo && selectedVideo.id === id) {
      setSelectedVideo(null);
    }
    showToast('Video removed.');
  };

  const handleUpdateVideo = (updatedVideo) => {
    const updatedList = videos.map((v) => (v.id === updatedVideo.id ? updatedVideo : v));
    setVideos(updatedList);
    setSelectedVideo(updatedVideo);
    saveLocalVideos(updatedList);
  };

  // Filter videos by category and search
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Search matching
      const matchesSearch =
        !searchTerm.trim() ||
        video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.album?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.genre?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category matching
      let matchesCategory = true;
      if (activeCategory !== 'All') {
        if (activeCategory === 'Recently uploaded') {
          matchesCategory = true;
        } else {
          matchesCategory =
            video.genre?.toLowerCase() === activeCategory.toLowerCase() ||
            (activeCategory === 'Music' &&
              ['pop', 'rock', 'hip hop', 'chillhop', 'r&b / soul', 'music'].includes(
                video.genre?.toLowerCase()
              ));
        }
      }

      // Sidebar tab filtering
      if (activeTab === 'Shorts') {
        // Sample filter for shorts
        return matchesSearch && video.duration && !video.duration.includes(':') && video.duration !== 'Live';
      }

      return matchesSearch && matchesCategory;
    });
  }, [videos, searchTerm, activeCategory, activeTab]);

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Top YouTube Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        openUploadModal={() => setIsUploadOpen(true)}
        backendConnected={backendConnected}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        onResetToHome={handleResetToHome}
      />

      <div className="main-layout">
        {/* Sidebar (Full or Mini) - auto hidden in watch mode on small screens */}
        {!selectedVideo && (
          <Sidebar
            isOpen={sidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onResetToHome={handleResetToHome}
          />
        )}

        {/* Main Content Area */}
        <main className={`content-viewport ${selectedVideo ? 'watch-mode' : ''} ${!sidebarOpen ? 'mini-sidebar' : ''}`}>
          {selectedVideo ? (
            <WatchPage
              video={selectedVideo}
              allVideos={videos}
              onBack={handleBackToFeed}
              onSelectRelatedVideo={handleSelectVideo}
              onUpdateVideo={handleUpdateVideo}
            />
          ) : (
            <div className="feed-wrapper">
              {/* Category Pills Bar */}
              <CategoryPills
                categories={CATEGORIES}
                selectedCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
              />

              {/* Video Grid */}
              <VideoGrid
                videos={filteredVideos}
                isLoading={isLoading}
                onSelectVideo={handleSelectVideo}
                onDeleteVideo={handleDeleteVideo}
                openUploadModal={() => setIsUploadOpen(true)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Upload/Add Video Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
