# MannMitra — Mental Wellness App

MannMitra is a full-stack web app focused on mental wellness: mood tracking, guided mindfulness exercises, journaling, small therapeutic games, and optional hand-gesture controls (for a camera-enabled experience). This single README consolidates project setup, features, technology stack, usage guides, troubleshooting notes, and future plans.

---

**Contents**
- Project overview
- Features
- Tech stack
- Quick start (frontend & backend)
- Camera & hand-tracking (usage + troubleshooting)
- Backend API & database summary
- Development notes & TODOs
- Future roadmap
- Appendix: original guides (merged)

---

**Project Overview**

This repository contains a Vite + React + TypeScript frontend in `src/` and a lightweight Node/Express backend in `server/` that uses SQLite for persistence. The app provides:
- Mood tracking and visualizations
- Guided breathing exercises and PMR (Progressive Muscle Relaxation)
- Daily affirmations (with share/download capability)
- A small Snake game with optional hand-gesture controls
- Chat and media pages for supportive resources

**Intended audience:** users seeking simple, accessible mental wellness tools.

---

**Features**

- Breathing exercises with timers and ambient soundscapes (Rain, Forest, White Noise).
- Progressive Muscle Relaxation (`PMR.tsx`) with guided steps and optional voice guidance.
- Mood tracker with history and persistence.
- Journal editor with persistent entries.
- Daily Affirmations with image generation (share/download via Canvas/Web Share API).
- Snake Game with keyboard and hand-gesture controls (MediaPipe / camera hooks).
- Settings, language support (English + Hindi), and accessibility improvements.

Files of note:
- Frontend: `src/` (pages, components, hooks, lib)
- Backend: `server/` (Express routes, SQLite DB in `server/db`)
- Camera system: `src/lib/camera.ts`, `src/hooks/useCamera.ts`, `src/hooks/useHandTracking.ts`

---

**Technology Stack**

- Frontend: React + TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, SQLite (lightweight persistence)
- Build & tooling: ESLint, PostCSS, Vite dev server
- Optional libs: MediaPipe / hand-pose detection for gesture controls

---

**Quick Start (Windows PowerShell)**

Prerequisites: Node.js (16+ recommended), npm

1) Install dependencies (project root)

```powershell
cd 'C:\Users\Dell\Downloads\mannmitra_mental_wellness_app_0i3urx_dualiteproject'
npm install
npm install --prefix server
```

2) Start dev servers (two terminals) or use the provided script

Option A — manual (two terminals):
```powershell
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend (project root)
cd ..
npm run dev
```

Option B — single script (PowerShell):
```powershell
.\start-dev.ps1
```

Open the frontend at `http://localhost:5173` and the backend runs on port `5000` (by default).

---

**Backend API & Database (summary)**

The backend (in `server/`) exposes authentication and user-data endpoints:
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — obtain JWT
- `GET/POST /api/moods` — list/save moods
- `GET/POST /api/journal` — list/save journal entries

Data persisted in SQLite tables: `users`, `moods`, `journal_entries`.

Environment variables (server/.env):
```
PORT=5000
JWT_SECRET=mannmitra-secret-key-change-in-production
NODE_ENV=development
```

Frontend env (in `.env.local`):
```
VITE_API_URL=http://localhost:5000/api
```

---

**Camera system & Hand Tracking**

The app includes a reusable camera system and `useCamera` hook (recommended) that handles permission checks, constraints, error recovery, and cleanup. The Snake game and hand-tracking features use `useHandTracking` which relies on the camera hook.

Key usage patterns:
- Use `useCamera({ width, height, frameRate })` in components and attach `videoRef` to a `<video>` element.
- Provide graceful fallback (keyboard) when camera or detection is unavailable.

Troubleshooting tips:
- Ensure camera permission is granted and no other app is using the camera.
- Use `localhost` or HTTPS; camera access is blocked on plain HTTP.
- Verify WebGL support in the browser and network access to any CDN used by models.

For detailed guidance, see the Appendix sections below (Camera System Guide, Hand Detection Troubleshooting, Hand Tracking Fixes).

---

**Development notes**

- Linting: `npm run lint`
- Build: `npm run build` (frontend)
- Preview production build: `npm run preview`
- Backend dev: `npm run dev` inside `server/`

Localization: `locales/en.json` and `locales/hi.json` store displayed strings — add keys for new UI text.

Persistence & sync: localStorage is used for some preferences; main user data is persisted via backend SQLite.

---

**Project TODOs & Future Roadmap**

Planned improvements (high level):
- Ambient soundscapes (integrated with breathing exercises) — UI + fade/duck when voice guidance plays
- PMR page with guided steps & optional TTS/recorded audio
- Share image export for Daily Affirmation using Canvas and Web Share API
- Dynamic contextual summaries (privacy-conscious; may be local or server-based)
- Focus tool widget, streaks & light gamification (opt-in)

Privacy & ethics:
- Be explicit about any data sent to external services (LLMs, analytics); require opt-in for cloud summarization.
- Avoid addictive gamification; keep rewards small and meaningful.

---

**How you can help / Contributing**

- Fork and open PRs for small issues.
- Run `npm run lint` and `npm run build` before submitting PRs.
- Add i18n strings to `locales/` when adding features.

---

**Appendix — Merged Original Guides**

Below are the original markdown documents that were consolidated into this README. They are included for reference and were merged into the sections above.

-- `SETUP_BACKEND.md` (Backend setup & persistent DB):

```
Your app now has a full-stack backend with a SQLite database that persists:
- User credentials (bcrypt-hashed)
- Moods & mood tracking history
- Journal entries

Quick start and API examples are available in the original file. Refer to the `server/` folder for routes and DB schema details.
```

-- `CAMERA_SYSTEM_GUIDE.md` (Camera system & usage):

```
The camera system provides a robust hook `useCamera` and `cameraManager` helpers. Use `useCamera` in components to get `videoRef`, `isReady`, `error`, and control functions (`stop`, `restart`). The camera manager exposes `initializeCamera` and helper functions like `testCamera` and `checkCameraPermissions`.
```

-- `HAND_DETECTION_TROUBLESHOOTING.md` (Hand detection troubleshooting):

```
Contains step-by-step debugging: check console errors, grant camera permissions, verify WebGL, test camera with system app, check HTTPS/localhost, try keyboard fallback, and sample console test snippets.
```

-- `HAND_TRACKING_FIXES.md` (Hand gesture fixes):

```
Documented fixes include using array indices for landmark access (reliable), raising movement thresholds, checking detection confidence, using angle-based direction detection with stability checks, and graceful error recovery.
```

-- `TODO.md` (Selected items merged above):

```
- Integrate Ambient Soundscapes
- Add PMR page and link
- Add share functionality for DailyAffirmation
- Implement contextual summaries, focus widget, and gamification
```

---

**Credits & license**
- See repository root for license (if present). If none, tell me which license you want and I can add it.

Contact / Maintainers: check `package.json` and `server/package.json` for author or reach out to the repository owner.

Thank you for using MannMitra — let me know if you'd like a different structure or to keep raw docs in an `docs/` folder instead of deleting them.
# Project Setup
    
    To run this project, follow these steps:
    
    1. Extract the zip file.
    2. Run `npm install` to install dependencies.
    3. Run `npm run dev` to start the development server.
    
    This project was generated through Alpha. For more information, visit [dualite.dev](https://dualite.dev).