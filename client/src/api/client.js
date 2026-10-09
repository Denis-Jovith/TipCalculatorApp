import axios from 'axios';

// VITE_API_URL points at a separate API subdomain (e.g. https://djbportfolio-api.djb.co.tz)
// when set at build time. Left unset, calls stay relative to whatever domain served the page —
// the right default for local dev and for a same-domain Nginx `/api` proxy setup.
const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export const api = axios.create({
  baseURL: `${apiOrigin}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('portfolio_admin_token')) {
      localStorage.removeItem('portfolio_admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
