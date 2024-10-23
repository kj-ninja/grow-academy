import axios from "axios";
import { useAuthState } from "@/features/auth/stores/authStore";

export const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token
ApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle token refreshing
ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available.");
        }
        // todo: add to mutations
        const { data } = await ApiClient.post("/auth/refresh", { refreshToken });
        localStorage.setItem("token", data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return ApiClient(originalRequest);
      } catch (refreshError) {
        useAuthState.getState().logout(); // Log out if refresh fails
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
