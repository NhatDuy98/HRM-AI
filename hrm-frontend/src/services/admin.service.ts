import { API_CONFIG } from "@/config/api.config";
import { httpClient, mockDelay } from "@/lib/api-client";
import type { ListResponse } from "@/types/api";

import type { UserRole } from "@/services/auth.service";

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: "ACTIVE" | "LOCKED";
    unit?: string;
    avatar?: string;
}

export interface DashboardStat {
    id: string;
    label: string;
    value: string | number;
    subValue?: string;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    subText?: string;
    type: 'basic' | 'progress' | 'segmented';
    iconType: 'users' | 'active' | 'inactive' | 'new';
}

export interface StaffMovementRow {
    department: string;
    inbound: number;
    outbound: number;
    netGrowth: number;
    churnRate: string;
    status: 'STABLE' | 'EXPANDING' | 'CRITICAL';
}

// Initial Mock Data (Moved from mocks/adminData.ts to act as DB)
let MOCK_USERS: SystemUser[] = [
    {
        id: "admin-001",
        name: "Nguyen Van A",
        email: "admin@union.vn",
        role: "ADMIN",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random"
    },
    {
        id: "admin-002",
        name: "Tran Thi B",
        email: "unit-admin@union.vn",
        role: "ADMIN",
        status: "ACTIVE",
        unit: "Union Branch 1",
        avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random"
    },
    {
        id: "user-001",
        name: "Le Van C",
        email: "levanc@union.vn",
        unit: "Union Branch 1",
        role: "USER",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=random"
    },
    {
        id: "user-002",
        name: "Pham Thi D",
        email: "phamthid@union.vn",
        unit: "Union Branch 2",
        role: "USER",
        status: "LOCKED",
        avatar: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=random"
    },
    {
        id: "user-003",
        name: "Nguyen Thi E",
        email: "nguyenthie@union.vn",
        unit: "Union Branch 1",
        role: "USER",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Thi+E&background=random"
    },
    {
        id: "user-004",
        name: "Hoang Van F",
        email: "hoangvanf@union.vn",
        unit: "Financial Services",
        role: "USER",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Hoang+Van+F&background=random"
    }
];

export const AdminService = {
    // GET /api/v1/admin/users
    getUsers: async (): Promise<ListResponse<SystemUser>> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            return {
                data: [...MOCK_USERS],
                meta: {
                    page: 1,
                    limit: 100,
                    total: MOCK_USERS.length,
                    totalPage: 1
                }
            };
        }
        return httpClient.get<ListResponse<SystemUser>>("/admin/users");
    },

    // POST /api/v1/admin/users
    createUser: async (user: Omit<SystemUser, "id" | "avatar">): Promise<SystemUser> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(800);
            const newUser: SystemUser = {
                ...user,
                id: `user-${Date.now()}`,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
            };
            MOCK_USERS.unshift(newUser);
            return newUser;
        }
        return httpClient.post<SystemUser>("/admin/users", user);
    },

    // PATCH /api/v1/admin/users/:id
    updateUser: async (id: string, updates: Partial<SystemUser>): Promise<SystemUser> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(500);
            MOCK_USERS = MOCK_USERS.map(u => u.id === id ? { ...u, ...updates } : u);
            const updated = MOCK_USERS.find(u => u.id === id);
            if (!updated) throw new Error("User not found");
            return updated;
        }
        return httpClient.patch<SystemUser>(`/admin/users/${id}`, updates);
    },

    // DELETE /api/v1/admin/users/:id
    deleteUser: async (id: string): Promise<void> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
            return;
        }
        return httpClient.delete(`/admin/users/${id}`);
    },

    // Mock "Switch User" (Development Feature)
    impersonateUser: async (id: string): Promise<SystemUser> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(300);
            const user = MOCK_USERS.find(u => u.id === id);
            if (!user) throw new Error("User not found");
            return user;
        }
        // Admin likely hits an endpoint to get a token for another user, 
        // effectively logging in as them. 
        // Return type might be LoginResponse in real app, but here we expect User object for context switch.
        // Assuming backend supports this:
        return httpClient.post<SystemUser>(`/admin/impersonate/${id}`);
    },

    // GET /api/v1/admin/dashboard/stats
    getDashboardStats: async (): Promise<DashboardStat[]> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(600);
            return [
                {
                    id: 'total-personnel',
                    label: 'TOTAL PERSONNEL',
                    value: '12,842',
                    trend: '+2.4%',
                    trendDirection: 'up',
                    subText: 'Vs. previous period',
                    type: 'basic',
                    iconType: 'users'
                },
                {
                    id: 'active-status',
                    label: 'ACTIVE STATUS',
                    value: '11,204',
                    subValue: '87.2% Rate',
                    type: 'progress',
                    iconType: 'active'
                },
                {
                    id: 'inactive-retired',
                    label: 'INACTIVE/RETIRED',
                    value: '1,638',
                    trend: '↑ 0.8%',
                    trendDirection: 'neutral',
                    subText: 'Natural attrition cycle',
                    type: 'basic',
                    iconType: 'inactive'
                },
                {
                    id: 'new-registrations',
                    label: 'NEW REGISTRATIONS',
                    value: '482',
                    subValue: 'This Quarter',
                    type: 'segmented',
                    iconType: 'new'
                }
            ];
        }
        return httpClient.get<DashboardStat[]>("/admin/dashboard/stats");
    },

    // GET /api/v1/admin/dashboard/movement
    getStaffMovement: async (): Promise<StaffMovementRow[]> => {
        if (API_CONFIG.IS_MOCK) {
            await mockDelay(700);
            return [
                {
                    department: 'Administrative Services',
                    inbound: 24,
                    outbound: 8,
                    netGrowth: 16,
                    churnRate: '3.2%',
                    status: 'STABLE'
                },
                {
                    department: 'Technical & Engineering',
                    inbound: 42,
                    outbound: 12,
                    netGrowth: 30,
                    churnRate: '1.8%',
                    status: 'EXPANDING'
                },
                {
                    department: 'Legal Affairs',
                    inbound: 6,
                    outbound: 14,
                    netGrowth: -8,
                    churnRate: '9.4%',
                    status: 'CRITICAL'
                },
                {
                    department: 'Research & Development',
                    inbound: 18,
                    outbound: 4,
                    netGrowth: 14,
                    churnRate: '2.1%',
                    status: 'STABLE'
                }
            ];
        }
        return httpClient.get<StaffMovementRow[]>("/admin/dashboard/movement");
    }
};
