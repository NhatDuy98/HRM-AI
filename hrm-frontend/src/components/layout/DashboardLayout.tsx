import {
    User,
    Briefcase,
    FileText,
    Settings,
    Menu,
    X,
    UserCircle,
    LogOut,
    Users,
    LayoutDashboard,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import type { UserRole } from "@/services/auth.service";

// Sidebar Configuration
type SidebarItem = { icon: any; label: string; href: string };

const SHARED_ITEMS: SidebarItem[] = [
    { icon: User, label: "Personal Info", href: "/profile" },
    { icon: Briefcase, label: "Professional Info", href: "/professional" },
    { icon: FileText, label: "Documents", href: "/documents" },
];

const ADMIN_ITEMS: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
];

const SIDEBAR_CONFIG: Record<UserRole, { main: SidebarItem[]; admin?: SidebarItem[] }> = {
    ADMIN: {
        main: SHARED_ITEMS,
        admin: ADMIN_ITEMS,
    },
    USER: {
        main: SHARED_ITEMS,
    },
};

export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, currentRole, loginAs } = useAdmin();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        // In a real app, clear auth tokens here
        navigate("/");
    };

    // Close user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Helper for active state
    const isItemActive = (href: string) => {
        const pathname = location.pathname;
        if (href === "/admin") {
            // Dashboard: strict exact match to prevent being active on /admin/users
            return pathname === "/admin";
        }
        // Others: prefix match is fine (e.g. /profile matches /profile/edit)
        // Also handle potential trailing slashes if strictly necessary, but standard startsWith represents user request
        return pathname.startsWith(href);
    };

    const roleConfig = currentRole ? SIDEBAR_CONFIG[currentRole] : SIDEBAR_CONFIG.USER;

    return (
        <div className="h-screen bg-[#f8fafc] flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-[2px]">
                        <div className="w-5 h-2.5 bg-[#0FA3B1] rounded-full" />
                        <div className="w-5 h-2.5 bg-[#0FA3B1] rounded-full" />
                        <div className="w-5 h-2.5 bg-[#0FA3B1] rounded-full" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">HRMS Portal</span>
                </div>
                <button onClick={toggleSidebar}>
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 bg-white border-r border-slate-200 w-64 z-20 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex md:flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-[3px]">
                            <div className="w-6 h-3 bg-[#0FA3B1] rounded-full" />
                            <div className="w-6 h-3 bg-[#0FA3B1] rounded-full" />
                            <div className="w-6 h-3 bg-[#0FA3B1] rounded-full" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">HRMS Portal</span>
                    </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {/* Main Menu */}
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
                        Main Menu
                    </h3>
                    <nav className="space-y-1 mb-8">
                        {roleConfig.main.map((item) => {
                            const active = isItemActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        active
                                            ? "bg-cyan-50 text-[#0FA3B1]"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <div className={cn("p-1 rounded", active && "bg-[#0FA3B1]/10")}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Administration Menu (Conditional) */}
                    {roleConfig.admin && (
                        <>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
                                Administration
                            </h3>
                            <nav className="space-y-1 mb-8">
                                {roleConfig.admin.map((item) => {
                                    const active = isItemActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                                active
                                                    ? "bg-cyan-50 text-[#0FA3B1]"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <div className={cn("p-1 rounded", active && "bg-[#0FA3B1]/10")}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </>
                    )}

                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
                        System
                    </h3>
                    <nav className="space-y-1">
                        <Link
                            to="/admin/configuration"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isItemActive("/admin/configuration")
                                    ? "bg-cyan-50 text-[#0FA3B1]"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <div className="p-1">
                                <Settings className="h-4 w-4" />
                            </div>
                            Configuration
                        </Link>
                    </nav>
                </div>

                {/* Mobile Logout Button */}
                <div className="p-4 mt-auto border-t border-slate-100 md:hidden">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header (Desktop) */}
                <header className="h-16 bg-white border-b border-slate-200 hidden md:flex items-center justify-end px-8">
                    <div className="flex items-center gap-3 relative" ref={userMenuRef}>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">{currentUser?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentUser?.role.replace('_', ' ')}</p>
                        </div>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#0FA3B1] focus:ring-offset-2 overflow-hidden"
                        >
                            {currentUser?.avatar ? (
                                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="h-6 w-6" />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-medium text-slate-900">{currentUser?.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                                </div>
                                {/* Role Switcher for Demo */}
                                <div className="p-2 border-b border-slate-100">
                                    <p className="text-[10px] text-slate-400 uppercase mb-1 px-2">Switch Role (Demo)</p>
                                    <button onClick={() => loginAs('admin-001')} className="w-full text-left px-2 py-1 text-xs hover:bg-slate-50 rounded">Admin</button>
                                    <button onClick={() => loginAs('user-001')} className="w-full text-left px-2 py-1 text-xs hover:bg-slate-50 rounded">User</button>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div id="content-scroll-area" className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div >
    );
}
