import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { AdminService, type SystemUser } from "@/services/admin.service";
import type { UserRole } from "@/services/auth.service";

interface AdminContextType {
    currentUser: SystemUser | null;
    currentRole: UserRole | null;
    allUsers: SystemUser[];
    isLoading: boolean;
    loginAs: (userId: string) => Promise<void>;
    updateUserStatus: (userId: string, status: "ACTIVE" | "LOCKED") => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    addUser: (user: Omit<SystemUser, "id" | "avatar">) => Promise<void>;
    editUser: (user: SystemUser) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
    const [allUsers, setAllUsers] = useState<SystemUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const response = await AdminService.getUsers();
            setAllUsers(response.data);
            // Default to first admin for dev convenience if not set
            if (!currentUser && response.data.length > 0) {
                // Try to find a SUPER_ADMIN
                // In a real app, strict checks would be:
                // if (user.role !== 'ADMIN') throw new Error("Unauthorized");
                const admin = response.data.find(u => u.role === "ADMIN") || response.data[0];
                setCurrentUser(admin);
            }
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Derived state
    const currentRole = useMemo(() => currentUser?.role || null, [currentUser]);

    const loginAs = async (userId: string) => {
        setIsLoading(true); // fast transition
        try {
            const user = await AdminService.impersonateUser(userId);
            setCurrentUser(user);
        } catch (error) {
            console.error("Login as failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserStatus = async (userId: string, status: "ACTIVE" | "LOCKED") => {
        try {
            await AdminService.updateUser(userId, { status });
            // Optimistic or re-fetch? Re-fetch is safer but slower. 
            // Let's do local update for responsiveness.
            setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
        } catch (error) {
            console.error("Update status failed", error);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            await AdminService.deleteUser(userId);
            setAllUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Delete user failed", error);
        }
    };

    const addUser = async (user: Omit<SystemUser, "id" | "avatar">) => {
        try {
            const newUser = await AdminService.createUser(user);
            setAllUsers(prev => [newUser, ...prev]);
        } catch (error) {
            console.error("Add user failed", error);
        }
    };

    const editUser = async (updatedUser: SystemUser) => {
        try {
            const result = await AdminService.updateUser(updatedUser.id, updatedUser);
            setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? result : u));
        } catch (error) {
            console.error("Edit user failed", error);
        }
    };

    return (
        <AdminContext.Provider
            value={{
                currentUser,
                currentRole,
                allUsers,
                isLoading,
                loginAs,
                updateUserStatus,
                deleteUser,
                addUser,
                editUser
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
