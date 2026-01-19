import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { AuthService } from "@/services/auth.service";

export function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const response = await AuthService.login({ username, password });

                // Store Access Token (In real app, maybe HttpOnly cookie or secure storage)
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("user", JSON.stringify(response.user));

                // Navigate based on role (Simple logic for now)
                if (response.user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/profile");
                }
            } catch (err: any) {
                console.error("Login failed", err);
                setErrors({
                    password: err.message || "Invalid credentials. Please try again."
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center font-sans text-slate-900 p-4">
            {/* Main Card */}
            <div className="w-full max-w-[420px] bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 p-8 pt-10 pb-8">
                {/* Header - Logo & Title */}
                <div className="flex flex-col items-center mb-8">
                    {/* Custom Logo Placeholder (3 stacked shapes) */}
                    <div className="flex flex-col gap-[3px] mb-4">
                        <div className="w-8 h-4 bg-[#0FA3B1] rounded-full" />
                        <div className="w-8 h-4 bg-[#0FA3B1] rounded-full" />
                        <div className="w-8 h-4 bg-[#0FA3B1] rounded-full" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
                        HRMS Login
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Trade Union & Public Organization Portal
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Username or Email"
                        type="text"
                        placeholder="e.g. employee@union.org"
                        icon={<User className="h-4 w-4" />}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (errors.username) setErrors({ ...errors, username: undefined });
                        }}
                        error={errors.username}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="........"
                        icon={<Lock className="h-4 w-4" />}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        error={errors.password}
                    />

                    <div className="flex items-center justify-between pt-1">
                        <Checkbox
                            id="remember_me"
                            label="Remember Me"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <Button
                            type="button"
                            variant="link"
                            className="px-0 h-auto text-xs font-semibold"
                            tabIndex={-1} // Optional: skip tab stop if preferred
                        >
                            Forgot Password?
                        </Button>
                    </div>

                    <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                        Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[10px] items-center justify-center font-bold tracking-widest text-slate-300 uppercase flex gap-1">
                        Authorized Access Only
                    </p>
                </div>
            </div>

            {/* Footer Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                    Secure Enterprise Gateway
                </span>
            </div>

            {/* Page Footer */}
            <footer className="fixed bottom-0 w-full p-6 border-t border-slate-100/50 bg-[#f8fafc]/80 backdrop-blur-sm hidden md:flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-slate-800 transition-colors">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-slate-800 transition-colors">
                        Security Policy
                    </a>
                    <a href="#" className="hover:text-slate-800 transition-colors">
                        IT Support
                    </a>
                </div>
                <div>
                    © 2024 Trade Union Public Organization. Enterprise HRMS v4.2
                </div>
            </footer>
        </div>
    );
}
