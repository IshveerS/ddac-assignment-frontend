'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load token from localStorage on mount (client-side only)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessTokenState(token);
    setIsHydrated(true);
  }, []);

  const setAccessToken = (token: string) => {
    setAccessTokenState(token);
    localStorage.setItem('accessToken', token);
  };

  const clearAuth = () => {
    setAccessTokenState(null);
    localStorage.removeItem('accessToken');
  };

  if (!isHydrated) {
    return <>{children}</>; // Avoid hydration mismatch
  }

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated: !!accessToken, setAccessToken, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
