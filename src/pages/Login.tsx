import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // Redirect if already authenticated
    if (isAuthenticated) {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
        navigate(from, { replace: true });
        return null;
    }

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        const success = await login(email, password);
        setLoading(false);

        if (success) {
            toast.success("Welcome back!");
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
            navigate(from, { replace: true });
        } else {
            toast.error("Invalid email or password");
            setErrors({ password: "Invalid credentials" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-12 lg:py-20">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-2xl lg:text-3xl font-medium mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                                    }}
                                    placeholder="you@example.com"
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.email ? "border-destructive" : "border-border"
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.password ? "border-destructive" : "border-border"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot password link */}
                        <div className="text-right">
                            <button type="button" className="text-sm text-gold hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-charcoal text-cream font-medium rounded-md hover:bg-charcoal-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-4 text-sm text-muted-foreground">
                                Don't have an account?
                            </span>
                        </div>
                    </div>

                    {/* Register link */}
                    <Link
                        to="/register"
                        className="block w-full py-3 border border-border text-center font-medium rounded-md hover:bg-muted transition-colors"
                    >
                        Create Account
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
