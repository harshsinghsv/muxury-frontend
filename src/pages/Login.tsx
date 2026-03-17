import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import Icon from "@/components/Icon";

const Login = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    // If redirected from a protected page (e.g. /checkout), restore ?next=
    const from = (location.state as any)?.from?.pathname || "/";

    // ─── Validation ───────────────────────────────────────────────────────

    const validate = () => {
        const e: typeof errors = {};
        if (!phone) e.phone = "Phone number is required";
        else if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
        if (!password) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ─── Submit ───────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await login(phone, password);
            navigate(`/verify-otp?purpose=login&phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(from)}`);
        } catch (err: any) {
            const msg = err.message || "Login failed";
            // Account not found → go to register
            if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("no account")) {
                toast.error("No account found with this phone number.");
                setTimeout(() => navigate("/register"), 1500);
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex md:flex-row bg-[#FAFAFA]">
            {/* Editorial Side */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial"
                    className="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10" aria-label="Muxury Home">
                        Muxury.
                    </Link>
                    <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl leading-tight max-w-lg mb-8 drop-shadow-lg">
                        Refined minimalism for the modern wardrobe.
                    </h2>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 pb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 hover:bg-[#F5F0EE] rounded-full transition-colors"
                    aria-label="Go back"
                >
                    <Icon name="back" size="w-6 h-6" />
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-2">
                    Welcome Back
                </h1>
                <p className="text-sm font-['DM_Sans'] text-[#999999] mb-8 md:mb-10">
                    Sign in to your Muxury account
                </p>

                <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col gap-1">
                    {/* Phone */}
                    <FormField label="Phone Number" error={errors.phone} required>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-['DM_Sans'] text-[#343434] bg-[#F5F0EE] px-3 py-[13px] rounded-lg border border-[#E5E5E5] select-none whitespace-nowrap">
                                +91
                            </span>
                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, phone: undefined })); }}
                                placeholder="9876543210"
                                error={!!errors.phone}
                                aria-label="Phone number"
                                aria-required="true"
                                maxLength={10}
                                className="flex-1"
                            />
                        </div>
                    </FormField>

                    {/* Password */}
                    <FormField label="Password" error={errors.password} required>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                                placeholder="Your password"
                                error={!!errors.password}
                                aria-label="Password"
                                aria-required="true"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(s => !s)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#343434] transition-colors p-2"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <Icon name="show" size="w-5 h-5" />
                            </button>
                        </div>
                    </FormField>

                    <div className="flex justify-end mb-4">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-['DM_Sans'] text-[#343434] underline hover:text-[#CA8385] transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Sending OTP..."
                        className="w-full mt-auto min-h-[50px]"
                        disabled={loading}
                    >
                        Continue
                    </LoadingButton>

                    <p className="text-center text-sm font-['DM_Sans'] text-[#999999] mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
