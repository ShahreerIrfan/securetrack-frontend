import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = "http://localhost:8000/api";

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Concurrent 401s should share one refresh call, not each fire their own.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  // Plain axios, not `api` - avoids re-entering this same response
  // interceptor if the refresh call itself ever 401s.
  const { data } = await axios.post<{ access: string }>(`${BASE_URL}/auth/refresh/`, {
    refresh: refreshToken,
  });
  useAuthStore.getState().setAccessToken(data.access);
  return data.access;
}

// A 401 from these means "wrong credentials" / "invalid refresh token",
// not "access token expired" - retrying them via refresh is nonsensical
// (login/register need no token at all) and would mask the real error
// (e.g. "wrong password") behind "No refresh token available".
const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH = ["/auth/login/", "/auth/register/", "/auth/refresh/"];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const isExemptEndpoint = AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.some((path) =>
      originalRequest?.url?.includes(path),
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isExemptEndpoint
    ) {
      originalRequest._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newAccessToken = await refreshPromise;
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
