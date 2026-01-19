import { useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useAdmin } from "@/contexts/AdminContext";
import { cn } from "@/lib/utils";
// import { AdminService } from "@/services/admin.service";
import type { SystemUser } from "@/services/admin.service";
import type { UserRole } from "@/services/auth.service";

// Role Logic
// Simply: ADMIN can manage USER.
// If target is ADMIN, strictness depends on requirements, but for now ADMIN can manage other ADMINs (except self)


export function UserManagementPage() {
    const { allUsers, currentUser, updateUserStatus, deleteUser, addUser, editUser, isLoading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [unitFilter, setUnitFilter] = useState("All Units");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal States
    const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
    const [userToEdit, setUserToEdit] = useState<SystemUser | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filtering
    const filteredUsers = allUsers.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
        const matchesUnit = unitFilter === "All Units" || user.unit === unitFilter;

        return matchesSearch && matchesRole && matchesUnit;
    });

    const pageSize = 10;
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Helpers
    const canManageUser = (targetUser: SystemUser) => {
        if (targetUser.id === currentUser?.id) return false;
        return currentUser?.role === "ADMIN";
    };

    const handleRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case "ADMIN":
                return "bg-purple-100 text-purple-700 border-purple-200"; // Admin logic
            case "USER":
                return "bg-blue-100 text-blue-700 border-blue-200"; // User logic
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    // Handlers
    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        try {
            await addUser({
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                role: formData.get("role") as UserRole,
                unit: formData.get("unit") as string,
                status: "ACTIVE"
            });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userToEdit) return;
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        try {
            await editUser({
                ...userToEdit,
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                role: formData.get("role") as UserRole,
                unit: formData.get("unit") as string,
            });
            setUserToEdit(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Admin User Management List</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Enterprise v4.2
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-1 gap-4 w-full">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search staff, code or email..."
                            className="pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#0FA3B1]/20"
                        value={unitFilter}
                        onChange={(e) => setUnitFilter(e.target.value)}
                    >
                        <option>All Units</option>
                        <option>Union Branch 1</option>
                        <option>Union Branch 2</option>
                        <option>Financial Services</option>
                        <option>Central Administration</option>
                    </select>

                    <select
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#0FA3B1]/20"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option>All Roles</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="UNIT_ADMIN">Unit Admin</option>
                        <option value="STAFF_USER">Staff User</option>
                    </select>
                </div>

                <Button
                    className="bg-[#0FA3B1] hover:bg-[#0e8a95] text-white gap-2"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Add New User
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold tracking-wider text-slate-400">Staff Code</th>
                                <th className="px-6 py-4 font-bold tracking-wider text-slate-400">Full Name</th>
                                <th className="px-6 py-4 font-bold tracking-wider text-slate-400">Unit</th>
                                <th className="px-6 py-4 font-bold tracking-wider text-slate-400">Role</th>
                                <th className="px-6 py-4 font-bold tracking-wider text-slate-400 text-center">Status</th>
                                <th className="px-6 py-4 font-bold tracking-wider text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => {
                                    const isEditable = canManageUser(user);
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-[#0FA3B1] font-semibold">
                                                {user.id.replace('user-', 'SC-').replace('admin-', 'AD-').toUpperCase().slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{user.name}</span>
                                                    <span className="text-xs text-slate-400">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {user.unit || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={cn("rounded-full px-3 py-0.5 border-0 font-bold text-[10px] uppercase tracking-wider", handleRoleBadgeColor(user.role))}>
                                                    {user.role.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => isEditable && updateUserStatus(user.id, user.status === "ACTIVE" ? "LOCKED" : "ACTIVE")}
                                                    disabled={!isEditable}
                                                    className={cn(
                                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0FA3B1] focus:ring-offset-2",
                                                        user.status === "ACTIVE" ? "bg-[#0FA3B1]" : "bg-slate-200",
                                                        !isEditable && "opacity-50 cursor-not-allowed"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                            user.status === "ACTIVE" ? "translate-x-6" : "translate-x-1"
                                                        )}
                                                    />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        disabled={!isEditable}
                                                        onClick={() => setUserToEdit(user)}
                                                        className={cn("p-1.5 text-slate-400 hover:text-[#0FA3B1] hover:bg-cyan-50 rounded transition-colors", !isEditable && "opacity-30 cursor-not-allowed")}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => isEditable && setUserToDelete(user)}
                                                        disabled={!isEditable}
                                                        className={cn("p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors", !isEditable && "opacity-30 cursor-not-allowed")}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-semibold">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of <span className="font-semibold">{filteredUsers.length}</span> users
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New User"
                className="max-w-lg"
            >
                <form onSubmit={handleAddUser} className="space-y-4 pt-4">
                    <Input name="name" label="Full Name" required placeholder="Nguyen Van A" />
                    <Input name="email" label="Email Address" type="email" required placeholder="user@union.vn" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                            <select name="unit" className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:border-[#0FA3B1] outline-none">
                                <option>Union Branch 1</option>
                                <option>Union Branch 2</option>
                                <option>Financial Services</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select name="role" className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:border-[#0FA3B1] outline-none">
                                <option value="STAFF_USER">Staff User</option>
                                <option value="UNIT_ADMIN">Unit Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create User"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={!!userToEdit}
                onClose={() => setUserToEdit(null)}
                title="Edit User"
                className="max-w-lg"
            >
                <form onSubmit={handleEditUser} className="space-y-4 pt-4">
                    <Input name="name" label="Full Name" defaultValue={userToEdit?.name} required />
                    <Input name="email" label="Email Address" type="email" defaultValue={userToEdit?.email} required />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                            <select name="unit" defaultValue={userToEdit?.unit} className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:border-[#0FA3B1] outline-none">
                                <option>Union Branch 1</option>
                                <option>Union Branch 2</option>
                                <option>Financial Services</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select name="role" defaultValue={userToEdit?.role} className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:border-[#0FA3B1] outline-none">
                                <option value="STAFF_USER">Staff User</option>
                                <option value="UNIT_ADMIN">Unit Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setUserToEdit(null)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                title="Delete User"
            >
                <div>
                    <p className="text-slate-600 mb-6">
                        Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={async () => {
                                if (userToDelete) {
                                    await deleteUser(userToDelete.id);
                                    setUserToDelete(null);
                                }
                            }}
                        >
                            Delete User
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
