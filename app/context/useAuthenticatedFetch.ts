import { useAuth } from './AuthContext';

// Wrapper to send auth headers and handle basic 401/403 redirects.
export const useAuthenticatedFetch = () => {
  const { accessToken } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include HttpOnly cookies (refresh token)
    });

    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return response;
  };
};
