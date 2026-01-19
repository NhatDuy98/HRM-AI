import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-500 text-center max-w-md mb-8">
                You do not have permission to view this page. Please contact your system administrator if you believe this is an error.
            </p>
            <div className="flex gap-4">
                <Link to="/profile">
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
