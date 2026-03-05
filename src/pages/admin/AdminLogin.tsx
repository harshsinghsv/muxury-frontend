import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { AdminIcon, icons } from "@/components/admin/AdminIcons";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, user } = useAuth();

    // If already logged in and an admin, redirect to dashboard
    if (user && user.role === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back, Admin");
            navigate("/admin/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F4F0] p-4 sm:p-8">
            <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl p-8 sm:p-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                        <AdminIcon d={icons.settings} size={28} stroke="#fff" sw={2} />
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-2">
                        Muxury Portal
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Admin Authentication
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-charcoal mb-2 uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-[#FDFBF9] border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-charcoal shadow-sm"
                                placeholder="admin@muxury.com"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <AdminIcon d={icons.users} size={18} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-charcoal mb-2 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-12 py-3.5 bg-[#FDFBF9] border border-[#DDD] rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-charcoal shadow-sm"
                                placeholder="Enter your password"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <AdminIcon d={icons.dashboard} size={18} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-charcoal transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-charcoal text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-black disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : "Secure Login"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-xs font-semibold text-muted-foreground hover:text-charcoal transition-colors uppercase tracking-wider"
                    >
                        ← Back to Store
                    </button>
                </div>

            </div>
        </div>
    );
}
