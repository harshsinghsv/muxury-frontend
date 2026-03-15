import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import Icon from "@/components/Icon";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState (false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const navigate = useNavigate();
    const { login } = useAuth();

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (error: any) {
            if (error.message.toLowerCase().includes("invalid email or password")) {
                toast.info("Account not found. Please sign up first.");
                navigate("/register");
            } else {
                toast.error(error.message || "Invalid credentials");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex md:flex-row bg-[#FAFAFA]">
            {/* Desktop Editorial Image Side */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial - Refined minimalism"
                    className="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10" aria-label="Muxury Home">Muxury.</Link>
                    <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl leading-tight max-w-lg mb-8 drop-shadow-lg">
                        Refined minimalism for the modern wardrobe.
                    </h2>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 z-0 pb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 active:scale-95 transition-transform hover:bg-[#F5F0EE] rounded-full"
                    aria-label="Go back"
                >
                    <Icon name="back" size="w-6 h-6" />
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-8 md:mb-12">
                    Hi, Welcome Back! 👋
                </h1>

                <form onSubmit={handleLogin} className="flex-1 flex flex-col" noValidate>
                    {/* Email field */}
                    <FormField
                        label="Email"
                        error={errors.email}
                        required
                    >
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            placeholder="example@gmail.com"
                            error={!!errors.email}
                            aria-label="Email address"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                        />
                    </FormField>

                    {/* Password field */}
                    <FormField
                        label="Password"
                        error={errors.password}
                        helpText="At least 6 characters"
                        required
                    >
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                placeholder="Enter your password"
                                error={!!errors.password}
                                aria-label="Password"
                                aria-required="true"
                                aria-invalid={!!errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#343434] transition-colors p-1"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <Icon name="show" size="w-5 h-5" />
                            </button>
                        </div>
                    </FormField>

                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <label className="flex items-center gap-2 text-sm md:text-base font-['DM_Sans'] text-[#343434] cursor-pointer hover:text-[#CA8385] transition-colors">
                            <input
                                type="checkbox"
                                className="w-4 h-4 md:w-5 md:h-5 accent-[#343434] rounded cursor-pointer"
                                aria-label="Remember me"
                            />
                            Remember Me
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-sm md:text-base font-['DM_Sans'] text-[#343434] underline font-medium hover:text-[#CA8385] transition-colors"
                        >
                            Forgot Password
                        </Link>
                    </div>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Logging in..."
                        className="w-full mt-auto md:mt-4"
                        disabled={loading}
                    >
                        Login
                    </LoadingButton>

                    <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                        Don't have an account? <Link to="/register" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
