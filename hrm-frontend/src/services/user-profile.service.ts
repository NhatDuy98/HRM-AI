import type { UserRole } from "@/services/auth.service";
import { API_CONFIG } from "@/config/api.config";
import { httpClient, mockDelay } from "@/lib/api-client";
import type { ListResponse } from "@/types/api";

export interface UserProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    joinDate: string;
    avatar?: string;
    role: UserRole;
    location: string;
}

export interface SecurityInfo {
    mfaEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: number;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    ipAddress: string;
}

// Mock Data Storage
let MOCKED_PROFILE: UserProfile = {
    id: "user-001",
    username: "jdoe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    position: "Senior HR Specialist",
    department: "Human Resources",
    joinDate: "2022-03-15",
    role: "USER",
    location: "New York Branch",
    avatar: "https://i.pravatar.cc/150?u=jdoe"
};

const MOCKED_SECURITY: SecurityInfo = {
    mfaEnabled: true,
    lastPasswordChange: "2023-11-10",
    activeSessions: 2
};

const MOCKED_AUDIT_LOGS: AuditLog[] = [
    { id: "log-1", action: "LOGIN", details: "Successful login from Chrome/Mac", timestamp: "2024-01-20T09:00:00Z", ipAddress: "192.168.1.1" },
    { id: "log-2", action: "PROFILE_UPDATE", details: "Changed phone number", timestamp: "2024-01-15T14:30:00Z", ipAddress: "192.168.1.1" },
    { id: "log-3", action: "DOCUMENT_UPLOAD", details: "Uploaded 'Resume_v2.pdf'", timestamp: "2024-01-10T11:15:00Z", ipAddress: "192.168.1.1" }
];

export const UserProfileService = {
    getProfile: async (): Promise<UserProfile> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(500);
            return { ...MOCKED_PROFILE };
        }
        const response = await httpClient.get<UserProfile & { fullName?: string }>("/user-profile/profile");
        // Map backend fullName to firstName/lastName if missing
        if (response.fullName && (!response.firstName || !response.lastName)) {
            const parts = response.fullName.split(' ');
            return {
                ...response,
                firstName: parts[0] || "",
                lastName: parts.slice(1).join(' ') || ""
            };
        }
        return response;
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(800);
            MOCKED_PROFILE = { ...MOCKED_PROFILE, ...data };
            return { ...MOCKED_PROFILE };
        }
        return httpClient.patch<UserProfile>("/user-profile/profile", data);
    },

    getSecurityInfo: async (): Promise<SecurityInfo> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(400);
            return { ...MOCKED_SECURITY };
        }
        return httpClient.get<SecurityInfo>("/user-profile/security");
    },

    getAuditLogs: async (): Promise<AuditLog[]> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            return [...MOCKED_AUDIT_LOGS];
        }
        const response = await httpClient.get<ListResponse<AuditLog>>("/user-profile/audit-logs");
        return response.data;
    }
};
