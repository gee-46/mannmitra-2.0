import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../lib/api';

interface AuthContextType {
  user: { name: string; id?: number } | null;
  error: string | null;
  login: (name: string, pass: string) => void;
  signup: (name: string, pass: string) => void;
  logout: () => void;
  clearError: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; id?: number } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (name: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authAPI.login(name, pass);
      setUser({ name: result.username, id: result.id });
      localStorage.setItem('token', result.token);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'login_failed';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authAPI.signup(name, pass);
      setUser({ name: result.username, id: result.id });
      localStorage.setItem('token', result.token);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'signup_failed';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, error, login, signup, logout, clearError, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
