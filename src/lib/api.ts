import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Placeholder: will attach the Bearer access token from the auth store
// and handle silent token refresh on 401 (added once the auth store exists).
api.interceptors.request.use((config) => {
  return config;
});

export default api;
