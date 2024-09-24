import axios from "axios";

export const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

ApiClient.interceptors.response.use((response) => {
  return {
    ...response,
    data: response.data,
    status: response.status,
    headers: response.headers,
  };
});

ApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
