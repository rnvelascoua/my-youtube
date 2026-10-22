# MyYouTube - Full Stack YouTube Clone (WMD3A)

A modern, responsive YouTube-like UI built with **Vite + React (JavaScript)** and integrated with a **Spring Boot REST API** backend (`Song` entity).

---

## 📁 Project Structure

```text
MY_YOUTUBE/
├── frontend/             # Vite + React JavaScript YouTube UI
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, CategoryPills, VideoGrid, WatchPage, UploadModal, etc.
│   │   ├── data/         # Mock data & preset playlists
│   │   ├── services/     # API connector for Spring Boot (/reyes/songs) & LocalStorage fallback
│   │   ├── utils/        # YouTube ID parsing, embed URL generator, view formatter
│   │   ├── App.jsx       # Root state management & router logic
│   │   ├── App.css       # YouTube UI styles & dark/light theme
│   │   └── index.css     # CSS reset & YouTube design tokens
│   ├── package.json
│   └── vite.config.js    # Vite configuration with proxy to Spring Boot
└── song/                 # Spring Boot Maven backend
    ├── src/main/java/com/velasco/song/
    │   ├── Song.java           # Entity (id, title, artist, genre, album, url)
    │   ├── SongController.java # REST Controller (/reyes/songs)
    │   └── SongRepository.java # JPA Repository
    └── pom.xml
```

---

## 🚀 How to Run

### 1. Run Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Run Backend (Spring Boot)
Ensure PostgreSQL is running on `localhost:5432` with database `db_song`:
```bash
cd song
./mvnw spring-boot:run
```
Backend runs at **[http://localhost:8080](http://localhost:8080)**.

> **Note:** The frontend automatically checks if the Spring Boot API is accessible. If Spring Boot is offline, it seamlessly runs in **Local Mode** with localStorage persistence and interactive YouTube playback!

---

## ✨ Features

- **Authentic YouTube Dark/Light Theme**: Pixel-perfect YouTube design with collapsible sidebar, signature red accents, and smooth animations.
- **Real YouTube Embed Video Player**: Plays any valid YouTube URL directly inside the app with full controls.
- **Top Navigation Bar**:
  - Search bar with clear button & voice search simulation
  - `+ Create` button to upload new songs/videos
  - Notifications panel with unread indicators
  - User profile menu with dark/light mode toggle
  - API connection indicator (`API Connected` or `Local Mode`)
- **Interactive Sidebar**: Full expanded mode (Home, Shorts, Subscriptions, History, Liked Videos, Explore) and compact mini mode.
- **Category Filter Pills**: Filter videos dynamically by categories (Music, Chillhop, Rock, Pop, Programming, etc.).
- **Interactive Watch Page**:
  - 16:9 responsive video player
  - Channel info with interactive "Subscribe / Subscribed" button
  - Interactive Like / Dislike counters
  - Share (copies link) and Download buttons
  - Expandable description box showing Spring Boot `Song` entity fields
  - Interactive comments section (add new comments, like comments)
  - "Up Next" related videos sidebar
- **YouTube Studio Upload Modal**:
  - Add new videos with title, artist, genre, album, and YouTube URL
  - Auto-extracts YouTube video ID and displays instant thumbnail preview
  - Quick 1-click sample presets (Chill Lo-Fi, Bohemian Rhapsody, Spring Boot Tutorial)
  - Saves to Spring Boot REST API (`POST /reyes/songs`) and updates UI instantly.
