import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import type { UserRole } from "@/services/auth.service";

interface RoleGuardProps {
    allowedRoles: UserRole[];
    children?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const { currentUser, isLoading } = useAdmin();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!currentUser) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(currentUser.role)) {
        // User authorized but wrong role
        return <Navigate to="/profile" replace />;
    }

    // Render children or Outlet if children is missing (for Layout route wrapping)
    return <>{children ? children : <Outlet />}</>;
}
