import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 max-w-md w-full flex flex-col items-center">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
                <p className="text-slate-500 mb-8">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                        variant="link"
                        onClick={() => navigate(-1)}
                        className="w-full text-slate-600"
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={() => navigate("/")}
                        className="w-full"
                    >
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
