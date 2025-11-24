# MannMitra - Backend Setup & Persistent Database

## What's New
Your app now has a **full-stack backend** with a SQLite database that persists:
- ✅ User credentials (username & password, bcrypt-hashed)
- ✅ Moods & mood tracking history
- ✅ Journal entries
- ✅ All user data across sessions

## Quick Start (Windows PowerShell)

### Option 1: Run Both Servers Together
```powershell
# From project root
cd 'C:\Users\Dell\Downloads\mannmitra_mental_wellness_app_0i3urx_dualiteproject'

# Terminal 1: Start Backend
cd server
npm install  # only first time
npm run dev

# Terminal 2 (new terminal): Start Frontend
npm run dev
```

Then open: **http://localhost:5173**

### Option 2: Use the Startup Script
```powershell
# From project root
.\start-dev.ps1
```
This will start both servers automatically in separate windows.

## Project Structure

```
mannmitra_mental_wellness_app/
├── server/                          # Backend (Node.js + Express + SQLite)
│   ├── src/
│   │   ├── index.js                 # Main server entry
│   │   ├── database.js              # SQLite setup
│   │   ├── auth.js                  # JWT authentication
│   │   └── routes/
│   │       ├── auth.js              # Login/Signup endpoints
│   │       └── data.js              # Moods & Journal endpoints
│   ├── db/                          # SQLite database file (auto-created)
│   ├── package.json
│   └── .env
│
├── src/                             # Frontend (React + TypeScript + Vite)
│   ├── lib/
│   │   └── api.ts                   # API client for backend calls
│   ├── hooks/
│   │   └── useAuth.tsx              # Updated to use backend
│   ├── pages/
│   │   └── Dashboard.tsx, etc.
│   └── ...
│
├── .env.local                       # Frontend API URL
└── start-dev.ps1                    # PowerShell startup script
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
  ```json
  { "username": "john", "password": "pass123" }
  ```
- `POST /api/auth/login` - Log in
  ```json
  { "username": "john", "password": "pass123" }
  ```

### User Data (requires JWT token)
- `GET /api/moods` - Get all user moods
- `POST /api/moods` - Save a mood
  ```json
  { "mood": "happy", "intensity": 8, "notes": "Great day!" }
  ```
- `GET /api/journal` - Get all journal entries
- `POST /api/journal` - Save journal entry
  ```json
  { "title": "My Day", "content": "..." }
  ```
- `PUT /api/journal/{id}` - Update journal entry

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Moods Table
```sql
CREATE TABLE moods (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  mood TEXT NOT NULL,
  intensity INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Journal Entries Table
```sql
CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## How It Works

1. **Signup/Login:**
   - Frontend sends username + password to backend
   - Backend validates, creates user, returns JWT token
   - Frontend stores token in localStorage
   - All subsequent API calls include the token

2. **Data Persistence:**
   - Each user's moods and journal are keyed by `user_id` in the database
   - When user logs in again, their historical data loads automatically
   - Changes are immediately persisted to SQLite

3. **Security:**
   - Passwords are hashed with bcryptjs (salted)
   - JWT tokens expire after 7 days
   - API endpoints require valid token in Authorization header

## Environment Variables

### Backend (server/.env)
```
PORT=5000
JWT_SECRET=mannmitra-secret-key-change-in-production
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Test the Flow

1. Open http://localhost:5173
2. **Sign up** with new username/password
3. Log in → Dashboard loads
4. Add moods or journal entries
5. **Refresh page** → Data persists ✓
6. **Log out** (Settings dropdown)
7. **Log in again** with same credentials → Your moods & journals are there ✓

## Troubleshooting

### Backend won't start
- Check if port 5000 is in use: `netstat -ano | findstr :5000`
- Kill process: `taskkill /PID <PID> /F`
- Or change PORT in `server/.env`

### Frontend can't connect to backend
- Ensure backend is running on http://localhost:5000
- Check `VITE_API_URL` in `.env.local`
- Open browser console (F12) for API errors

### Database permission issues
- Delete `server/db/mannmitra.db` and restart backend
- Ensure write permissions in `server/db/` folder

## Next Steps (Optional)

- [ ] Connect to cloud database (PostgreSQL, MongoDB)
- [ ] Deploy backend to Heroku/Railway/Render
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Add email verification for signup
- [ ] Add password reset flow
- [ ] Add refresh token rotation for security

## Commands Reference

```powershell
# Backend
npm run dev --prefix server              # Start with auto-reload
npm start --prefix server                # Start production

# Frontend
npm run dev                               # Start dev server
npm run build                             # Build for production
npm run preview                           # Preview production build
npm run lint                              # Check code quality
```

---
**Database Location:** `server/db/mannmitra.db`
**Backend Logs:** Check backend terminal for debug info
**Frontend Logs:** Check browser console (F12)
