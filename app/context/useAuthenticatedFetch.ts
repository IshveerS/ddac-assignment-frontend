import { useAuth } from './AuthContext';

export const useAuthenticatedFetch = () => {
  const { accessToken } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});

    // Add authorization header if token exists
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include HttpOnly cookies (refresh token)
    });

    return response;
  };
};
