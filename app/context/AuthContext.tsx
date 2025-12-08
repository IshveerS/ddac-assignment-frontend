'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  accessToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOrganizer: boolean;
  setSession: (token: string, role: string | null) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  });
  const [role, setRoleState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('role');
  });

  const setSession = (token: string, newRole: string | null) => {
    setAccessTokenState(token);
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      if (newRole) {
        localStorage.setItem('role', newRole);
      } else {
        localStorage.removeItem('role');
      }
    }
  };

  const clearAuth = () => {
    setAccessTokenState(null);
    setRoleState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
    }
  };

  const normalizedRole = role?.toLowerCase() ?? null;
  const isAdmin = normalizedRole === 'admin';
  const isOrganizer = normalizedRole === 'organizer';

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        role: normalizedRole,
        isAuthenticated: !!accessToken,
        isAdmin,
        isOrganizer,
        setSession,
        clearAuth,
      }}
    >
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
