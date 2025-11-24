# MannMitra — Mental Wellness Web App

A calm, accessible, full-stack mental wellness platform.

<p align="center">
  <strong>Mood tracking • Guided breathing • PMR • Journaling • Daily affirmations • Mini-games • Hand-gesture controls</strong>
</p>
<p align="center">
  Built with React + TypeScript + Node.js + SQLite
</p>

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Backend API](#backend-api)
- [Database Schema](#database-schema)
- [Camera & Hand Tracking](#camera--hand-tracking)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**MannMitra** is a full-stack mental wellness application offering calm, therapeutic micro-experiences including:

- Mood tracking
- Breathing & PMR guidance
- Journaling
- Daily affirmations
- Mini Snake game
- Optional hand-gesture control using MediaPipe

It is designed to be lightweight, privacy-respecting and accessible.

---

## Features

### 🧘‍♂️ Guided Wellness Tools
- Breathing exercises with customizable timers
- Ambient soundscapes (Rain, Forest, White Noise)
- Progressive Muscle Relaxation (PMR) with step-by-step guidance
- Optional voice assistant (planned)

### 📊 Mood & Journal Tracking
- Mood history with charts
- Persistent journal entries
- Local + backend synced storage

### 🌅 Daily Affirmations
- Beautiful affirmation cards
- Export as image
- Share via Web Share API

### 🎮 Mini Snake Game
- Play with keyboard
- OR optional hand-gesture control through camera
- Uses MediaPipe hand-pose detection

### ⚙️ Extras
- Settings page with preferences
- Language support: English + Hindi
- Accessibility improvements

---

## Architecture

```
mannmitra/
│
├── src/                    # Frontend (React + TS)
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── locales/
│
├── server/                 # Backend (Node + Express + SQLite)
│   ├── routes/
│   ├── db/
│   └── middleware/
│
├── public/
└── start-dev.ps1
```

- **Frontend → Backend communication** via REST API (JSON).
- **Backend uses SQLite** for persistent data.

---

## Technology Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (optional)
- MediaPipe (hand tracking)

### Backend
- Node.js
- Express
- SQLite (persistent DB)
- JWT authentication
- bcrypt password hashing

### Tooling
- ESLint
- PostCSS
- Vite dev server

---

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Install

```bash
cd 'C:\Users\Dell\Downloads\mannmitra_mental_wellness_app_0i3urx_dualiteproject'
npm install
npm install --prefix server
```

### Run

**Option A — Manual (2 terminals)**

_Backend_
```bash
cd server
npm run dev
```

_Frontend_
```bash
cd ..
npm run dev
```

**Option B — One-click script**
```bash
.\start-dev.ps1
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:5000](http://localhost:5000)

---

## Backend API

### Authentication

**Signup**
```http
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Login**
```http
POST /api/auth/login
Returns:
{
  "token": "jwt-token-here"
}
```

### Moods

**Get moods**
```http
GET /api/moods
```

**Add mood**
```http
POST /api/moods
{
  "mood": "happy",
  "timestamp": 1698452781
}
```

### Journal

**Get entries**
```http
GET /api/journal
```

**Add entry**
```http
POST /api/journal
{
  "title": "A calm day",
  "content": "Today I felt peaceful..."
}
```

---

## Database Schema

**users**
| id | email          | password | created_at |

**moods**
| id | user_id        | mood     | timestamp  |

**journal_entries**
| id | user_id        | title    | content    | created_at |

SQLite database location:  
`server/db/mannmitra.db`

---

## Camera & Hand Tracking

_MannMitra includes a robust camera system with:_

**Hooks**
- `useCamera`
- `useHandTracking`

**Features**
- Auto permission checks
- Device availability handling
- Error recovery (`restart()`, `stop()`)
- FPS & dimension constraints
- Landmarks processed for Snake game controls

**Common Issues**

| Issue                 | Fix                              |
|-----------------------|----------------------------------|
| Camera black          | Another app is using camera      |
| No hand detection     | Ensure WebGL is enabled          |
| Permission denied     | Use HTTPS or localhost           |
| Too sensitive gestures| Thresholds customizable in `useHandTracking.ts` |

---

## Development Notes

### Scripts

| Command            | Description             |
|--------------------|------------------------|
| npm run dev        | Start frontend         |
| npm run build      | Build frontend         |
| npm run preview    | Preview production build|
| npm run lint       | Lint code              |
| npm run dev (server)| Start backend         |

### Localization

Located in:
- `src/locales/en.json`
- `src/locales/hi.json`

---

## Troubleshooting

#### Camera not working
- Check permissions
- Stop other apps (Meet, Zoom)
- Use HTTPS or localhost
- Check browser console for:
  - WebGL errors
  - Failed to load model

#### Backend not running
- Port conflict → change PORT in `.env`
- Missing SQLite file → backend auto-creates on first run

#### CORS issues
- Ensure this exists in server:
  ```js
  app.use(cors());
  ```

---

## Roadmap

### Upcoming Features
- Ambient soundscapes integration
- PMR audio narration
- Advanced affirmation card designs
- Share → Instagram/Facebook/Reels
- Streaks & mindful gamification
- Focus Tool / Timer widget
- Optional cloud summaries (opt-in only)

### Long-term
- AI-generated mood insights
- Offline-first PWA
- WearOS/Android app version

---

## Contributing

1. Fork repo
2. Create new branch
3. Run:
   ```bash
   npm run lint
   npm run build
   ```
4. Submit Pull Request

_Add translations to both `en.json` and `hi.json` for any new UI text._

---

## License

[MIT](LICENSE)
