import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Chat from './pages/Chat';
import Mindfulness from './pages/Mindfulness';
import BreathingExercise from './pages/BreathingExercise';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';
import { AnimatePresence } from 'framer-motion';
import Media from './pages/Media';
import Journal from './pages/Journal';
import Spinner from './components/ui/Spinner';

// Lazy load the heavy SnakeGame component
const SnakeGame = lazy(() => import('./pages/SnakeGame'));
const PMR = lazy(() => import('./pages/PMR'));

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="mood-tracker" element={<MoodTracker />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="media" element={<Media />} />
                  <Route path="mindfulness" element={<Mindfulness />} />
                  <Route path="mindfulness/breathing" element={<BreathingExercise />} />
                  <Route
                    path="mindfulness/pmr"
                    element={
                      <Suspense fallback={<Spinner />}>
                        <PMR />
                      </Suspense>
                    }
                  />
                  <Route
                    path="mindfulness/snake"
                    element={
                      <Suspense fallback={<Spinner />}>
                        <SnakeGame />
                      </Suspense>
                    }
                  />
                </Route>
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
