import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_CONFIG } from "@/config/api.config";

// --- Real API Client (Axios) ---
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage (matching AuthService logic)
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors (Optional: Global 401 redirect)
axiosInstance.interceptors.response.use(
    (response) => {
        // Unwrap response data if backend follows strict envelope
        // If backend returns { data: ..., meta: ... }, axios returns { data: { data: ..., meta: ... }, status: ... }
        // We usually want response.data
        return response.data;
    },
    (error) => {
        // Global Error Handling
        if (error.response) {
            // Server responded with non-2xx code
            if (error.response.status === 401) {
                // Handle unauthorized (e.g., clear token, redirect to login)
                // Note: Direct redirect might be abrupt, better to dispatch event or rely on auth context
                console.warn("Unauthorized: 401");
            }
        }
        return Promise.reject(error);
    }
);

export const httpClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) => axiosInstance.get<T, T>(url, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.post<T, T>(url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.put<T, T>(url, data, config),
    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.patch<T, T>(url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) => axiosInstance.delete<T, T>(url, config),
};

// Start of Selection
// Helper to simulate delay
export const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
