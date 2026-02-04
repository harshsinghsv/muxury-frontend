import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();

    const [form, setForm] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate("/", { replace: true });
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        } else if (form.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email address";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        const success = await register(form.name, form.email, form.password);
        setLoading(false);

        if (success) {
            toast.success("Account created successfully!");
            navigate("/");
        } else {
            toast.error("Failed to create account. Please try again.");
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
                            Create Account
                        </h1>
                        <p className="text-muted-foreground">
                            Join us for exclusive access and rewards
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name field */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.name ? "border-destructive" : "border-border"
                                        }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name}</p>
                            )}
                        </div>

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
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
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

                        {/* Confirm Password field */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.confirmPassword ? "border-destructive" : "border-border"
                                        }`}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <p className="text-sm text-muted-foreground">
                            By creating an account, you agree to our{" "}
                            <button type="button" className="text-gold hover:underline">
                                Terms of Service
                            </button>{" "}
                            and{" "}
                            <button type="button" className="text-gold hover:underline">
                                Privacy Policy
                            </button>
                            .
                        </p>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-charcoal text-cream font-medium rounded-md hover:bg-charcoal-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
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
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login link */}
                    <Link
                        to="/login"
                        className="block w-full py-3 border border-border text-center font-medium rounded-md hover:bg-muted transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;
