import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send httpOnly refresh cookie
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token storage in memory (not localStorage — XSS protection)
let _accessToken: string | null = null;
let _isRefreshing = false;
let _refreshSubscribers: Array<(token: string | null) => void> = [];

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (_isRefreshing) {
        return new Promise((resolve, reject) => {
          _refreshSubscribers.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      originalRequest._retry = true;
      _isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        _refreshSubscribers.forEach((cb) => cb(data.accessToken));
        _refreshSubscribers = [];
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        setAccessToken(null);
        _refreshSubscribers.forEach((cb) => cb(null));
        _refreshSubscribers = [];
        return Promise.reject(error);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
