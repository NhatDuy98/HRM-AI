import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";

import { DashboardLayout } from "./components/layout/DashboardLayout";
import { UserProfilePage } from "./pages/UserProfilePage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { ProfessionalPage } from "./pages/ProfessionalPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { RoleGuard } from "./components/auth/RoleGuard";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { SystemConfigurationPage } from "./pages/admin/SystemConfigurationPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        element: <DashboardLayout />,
        children: [
            {
                path: "/profile",
                element: <UserProfilePage />,
            },
            {
                path: "/professional",
                element: <ProfessionalPage />,
            },
            {
                path: "/documents",
                element: <DocumentsPage />,
            },
            // Admin Routes
            {
                element: <RoleGuard allowedRoles={["ADMIN"]} />,
                children: [
                    {
                        path: "/admin",
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: "/admin/users",
                        element: <UserManagementPage />,
                    },
                    {
                        path: "/admin/configuration",
                        element: <SystemConfigurationPage />,
                    }
                ]
            }
        ],
    },
    {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
