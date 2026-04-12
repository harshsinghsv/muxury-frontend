import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import Icon from "@/components/Icon";

const Register = () => {
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; name?: string; password?: string; email?: string }>({});

    const navigate = useNavigate();
    const { register } = useAuth();

    // ─── Validation ───────────────────────────────────────────────────────

    const validate = () => {
        const e: typeof errors = {};
        if (!phone) e.phone = "Phone number is required";
        else if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
        if (!name.trim()) e.name = "Full name is required";
        else if (name.trim().length < 2) e.name = "Enter your full name";
        if (!password) e.password = "Password is required";
        else if (password.length < 8) e.password = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(password)) e.password = "Password must contain at least one uppercase letter";
        else if (!/[0-9]/.test(password)) e.password = "Password must contain at least one number";
        if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email address";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ─── Submit ───────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const names = name.trim().split(" ");
            const firstName = names[0];
            const lastName = names.length > 1 ? names.slice(1).join(" ") : ".";

            await register({
                phone,
                firstName,
                lastName,
                password,
                ...(email && { email }),
            });

            toast.success("Account created! Enter the OTP sent to your phone.");
            navigate(`/verify-otp?purpose=register&phone=${encodeURIComponent(phone)}`);
        } catch (err: any) {
            toast.error(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex md:flex-row-reverse bg-[#FAFAFA]">
            {/* Editorial Side */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1550614000-4b95d466f1fc?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10 text-right" aria-label="Muxury Home">
                        Muxury.
                    </Link>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 pb-10 overflow-y-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 hover:bg-[#F5F0EE] rounded-full transition-colors"
                    aria-label="Go back"
                >
                    <Icon name="back" size="w-6 h-6" />
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-2">
                    Create Account
                </h1>
                <p className="text-sm font-['DM_Sans'] text-[#999999] mb-8">
                    Join Muxury — your luxury fashion destination
                </p>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
                    {/* Phone — primary */}
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

                    {/* Full Name */}
                    <FormField label="Full Name" error={errors.name} required>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                            placeholder="Aditya Sharma"
                            error={!!errors.name}
                            aria-label="Full name"
                            aria-required="true"
                        />
                    </FormField>

                    {/* Password */}
                    <FormField label="Password" error={errors.password} helpText="Min. 8 characters, one uppercase, one number" required>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                                placeholder="Create a strong password"
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

                    {/* Email — optional */}
                    <FormField label="Email Address" error={errors.email} helpText="Optional — for order confirmations">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                            placeholder="you@example.com (optional)"
                            error={!!errors.email}
                            aria-label="Email address"
                        />
                    </FormField>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Creating account..."
                        className="w-full mt-4 min-h-[50px]"
                        disabled={loading}
                    >
                        Create Account
                    </LoadingButton>

                    <p className="text-center text-xs font-['DM_Sans'] text-[#999999] mt-4 leading-relaxed px-4">
                        By creating an account, you agree to our{" "}
                        <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">Terms of Service</span>
                        {" "}and{" "}
                        <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">Privacy Policy</span>
                    </p>

                    <p className="text-center text-sm font-['DM_Sans'] text-[#999999] mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
