import { API_CONFIG } from "@/config/api.config";
import { httpClient, mockDelay } from "@/lib/api-client";

// Types
export interface LoginRequest {
    username: string;
    password: string;
}

export type UserRole = "ADMIN" | "USER";

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    createdAt?: string; // Matching backend response
    isLogin?: boolean;
    status?: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

// Mock Data
const MOCK_USERS: Record<string, User> = {
    "admin": {
        id: "8b8f287b-887d-4372-8989-f971bea22f8c",
        username: "admin",
        name: "Administrator",
        email: "admin@example.com",
        role: "ADMIN",
        avatar: "https://i.pravatar.cc/150?u=admin",
        createdAt: "2026-01-19T15:17:38.759Z",
        isLogin: true,
        status: "active"
    },
    "user": {
        id: "staff-001",
        username: "user",
        name: "Regular User",
        email: "user@example.com",
        role: "USER",
        avatar: "https://i.pravatar.cc/150?u=user",
        createdAt: "2026-01-20T10:00:00.000Z",
        isLogin: true,
        status: "active"
    }
};

export const AuthService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        if (API_CONFIG.IS_MOCK) {
            // Mock Implementation
            await mockDelay(800);

            const user = MOCK_USERS[credentials.username];

            if (user && credentials.password === "password") {
                return {
                    accessToken: "mock-jwt-token-" + Math.random().toString(36).substring(7),
                    user
                };
            }

            throw {
                response: {
                    status: 401,
                    data: { message: "Invalid credentials" }
                }
            };
        } else {
            // Real Implementation
            return httpClient.post<LoginResponse>("/auth/login", credentials);
        }
    },

    logout: async (): Promise<void> => {
        if (API_CONFIG.IS_MOCK) {
            // Cleanup local storage is done by the caller (Provider) usually, 
            // but if there was a server-side logout (revoke token), do it here.
            await mockDelay(200);
        } else {
            // Optional: Call server logout
            // await httpClient.post("/auth/logout");
        }
    }
};
