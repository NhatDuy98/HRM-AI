export type UserRole = "SUPER_ADMIN" | "UNIT_ADMIN" | "STAFF_USER";

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: "ACTIVE" | "LOCKED";
    unit?: string;
    avatar?: string;
}

export const ADMIN_ACCOUNTS: SystemUser[] = [
    {
        id: "admin-001",
        name: "Nguyen Van A",
        email: "admin@union.vn",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random"
    },
    {
        id: "admin-002",
        name: "Tran Thi B",
        email: "unit-admin@union.vn",
        role: "UNIT_ADMIN",
        status: "ACTIVE",
        unit: "Union Branch 1",
        avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random"
    }
];

export const USER_ACCOUNTS: SystemUser[] = [
    {
        id: "user-001",
        name: "Le Van C",
        email: "levanc@union.vn",
        unit: "Union Branch 1",
        role: "STAFF_USER",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=random"
    },
    {
        id: "user-002",
        name: "Pham Thi D",
        email: "phamthid@union.vn",
        unit: "Union Branch 2",
        role: "STAFF_USER",
        status: "LOCKED",
        avatar: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=random"
    },
    // Added extra users to populate list for pagination demo
    {
        id: "user-003",
        name: "Nguyen Thi E",
        email: "nguyenthie@union.vn",
        unit: "Union Branch 1",
        role: "STAFF_USER",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Thi+E&background=random"
    },
    {
        id: "user-004",
        name: "Hoang Van F",
        email: "hoangvanf@union.vn",
        unit: "Financial Services",
        role: "STAFF_USER",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Hoang+Van+F&background=random"
    }
];

export const ALL_USERS = [...ADMIN_ACCOUNTS, ...USER_ACCOUNTS];
