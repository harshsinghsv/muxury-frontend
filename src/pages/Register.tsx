import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import Icon from "@/components/Icon";
import { COPY } from "@/config/constants";

type Step = "form" | "verify";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string }>({});

    // Verification step state
    const [step, setStep] = useState<Step>("form");
    const [userId, setUserId] = useState("");
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [emailResendCooldown, setEmailResendCooldown] = useState(0);

    const navigate = useNavigate();
    const { register, verifyPhone, resendOtp, resendEmail } = useAuth();

    // ─── Resend cooldown timers ────────────────────────────────────────────

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    useEffect(() => {
        if (emailResendCooldown <= 0) return;
        const t = setTimeout(() => setEmailResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [emailResendCooldown]);

    // ─── Form validation ──────────────────────────────────────────────────

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!name) newErrors.name = "Full name is required";
        else if (name.trim().length < 2) newErrors.name = "Please enter your full name";
        if (!email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";
        if (!phone) newErrors.phone = "Phone number is required";
        else if (!/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Enter a valid 10-digit Indian mobile number";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ─── Register submit ──────────────────────────────────────────────────

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const names = name.split(" ");
            const firstName = names[0];
            const lastName = names.length > 1 ? names.slice(1).join(" ") : ".";

            const result = await register({
                firstName,
                lastName,
                email,
                password,
                phone,
            });

            setUserId(result.userId);
            setStep("verify");
            setResendCooldown(30);
            toast.success("Account created! Please verify your phone and email.");
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // ─── Verify OTP ───────────────────────────────────────────────────────

    const handleVerifyOtp = useCallback(async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }

        setOtpLoading(true);
        try {
            const { bothVerified } = await verifyPhone(userId, otp);
            setPhoneVerified(true);
            toast.success("Phone verified!");

            if (bothVerified) {
                toast.success("Both verified! Redirecting to login...");
                setTimeout(() => navigate("/login?emailVerified=true"), 1500);
            }
        } catch (error: any) {
            toast.error(error.message || "Invalid OTP");
        } finally {
            setOtpLoading(false);
        }
    }, [otp, userId, verifyPhone, navigate]);

    // ─── Resend OTP ───────────────────────────────────────────────────────

    const handleResendOtp = async () => {
        try {
            await resendOtp(userId);
            setResendCooldown(30);
            toast.success("New OTP sent!");
        } catch (error: any) {
            toast.error(error.message || "Failed to resend OTP");
        }
    };

    // ─── Resend Email ─────────────────────────────────────────────────────

    const handleResendEmail = async () => {
        try {
            await resendEmail(email);
            setEmailResendCooldown(60);
            toast.success("Verification email sent!");
        } catch (error: any) {
            toast.error(error.message || "Failed to resend email");
        }
    };

    // ─── Verification Screen ──────────────────────────────────────────────

    if (step === "verify") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-5">
                <div className="w-full max-w-md">
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434] mb-2 text-center">
                        Verify Your Account
                    </h1>
                    <p className="text-center text-sm font-['DM_Sans'] text-[#999999] mb-8">
                        We've sent a verification code to +91 {phone}
                    </p>

                    {/* Phone OTP Section */}
                    {!phoneVerified ? (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0F0F0] mb-4">
                            <h2 className="text-sm font-semibold font-['DM_Sans'] text-[#343434] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#343434] text-white text-xs flex items-center justify-center">1</span>
                                Verify Phone Number
                            </h2>

                            <div className="flex gap-3 mb-4">
                                <Input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    aria-label="Phone OTP"
                                    className="flex-1 text-center tracking-[0.5em] text-lg font-mono"
                                    maxLength={6}
                                />
                            </div>

                            <LoadingButton
                                type="button"
                                loading={otpLoading}
                                loadingText="Verifying..."
                                className="w-full min-h-[44px] mb-3"
                                disabled={otpLoading || otp.length !== 6}
                                onClick={handleVerifyOtp}
                            >
                                Verify OTP
                            </LoadingButton>

                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0}
                                className="w-full text-sm font-['DM_Sans'] text-[#343434] hover:text-[#CA8385] transition-colors min-h-[44px] disabled:text-[#CCCCCC] disabled:cursor-not-allowed"
                            >
                                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 mb-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z" fill="currentColor"/></svg>
                                <span className="font-semibold font-['DM_Sans']">Phone verified ✓</span>
                            </div>
                        </div>
                    )}

                    {/* Email Verification Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0F0F0]">
                        <h2 className="text-sm font-semibold font-['DM_Sans'] text-[#343434] mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#343434] text-white text-xs flex items-center justify-center">2</span>
                            Verify Email
                        </h2>
                        <p className="text-sm font-['DM_Sans'] text-[#999999] mb-4">
                            We've sent a verification link to <strong className="text-[#343434]">{email}</strong>.
                            Click the link in your email to complete registration.
                        </p>
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            disabled={emailResendCooldown > 0}
                            className="w-full text-sm font-['DM_Sans'] text-[#343434] underline hover:text-[#CA8385] transition-colors min-h-[44px] disabled:text-[#CCCCCC] disabled:cursor-not-allowed disabled:no-underline"
                        >
                            {emailResendCooldown > 0 ? `Resend email in ${emailResendCooldown}s` : "Resend verification email"}
                        </button>
                    </div>

                    {phoneVerified && (
                        <p className="text-center text-sm font-['DM_Sans'] text-[#999999] mt-6">
                            Phone is verified. Now click the link in your email to finish registration.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ─── Registration Form ────────────────────────────────────────────────

    return (
        <div className="min-h-screen flex md:flex-row-reverse bg-[#FAFAFA]">
            {/* Desktop Editorial Image Side (Reversed for Register) */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1550614000-4b95d466f1fc?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial - Timeless fashion collection"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10 text-right" aria-label="Muxury Home">Muxury.</Link>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 z-0 pb-10 overflow-y-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 active:scale-95 transition-transform hover:bg-[#F5F0EE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#343434]"
                    aria-label="Go back"
                >
                    <Icon name="back" size="w-6 h-6" />
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-8 md:mb-12">
                    {COPY.auth.register.title}
                </h1>

                <form onSubmit={handleRegister} className="flex-1 flex flex-col" noValidate>
                    {/* Name field */}
                    <FormField
                        label={COPY.auth.register.nameLabel}
                        error={errors.name}
                        required
                    >
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            placeholder={COPY.auth.register.namePlaceholder}
                            error={!!errors.name}
                            aria-label="Full name"
                            aria-required="true"
                            aria-invalid={!!errors.name}
                        />
                    </FormField>

                    {/* Email field */}
                    <FormField
                        label={COPY.auth.register.emailLabel}
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
                            placeholder={COPY.auth.register.emailPlaceholder}
                            error={!!errors.email}
                            aria-label="Email address"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                        />
                    </FormField>

                    {/* Phone field */}
                    <FormField
                        label="Phone Number"
                        error={errors.phone}
                        required
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-['DM_Sans'] text-[#343434] bg-[#F5F0EE] px-3 py-3 rounded-lg border border-[#E5E5E5] select-none">
                                +91
                            </span>
                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                                }}
                                placeholder="9876543210"
                                error={!!errors.phone}
                                aria-label="Phone number"
                                aria-required="true"
                                aria-invalid={!!errors.phone}
                                maxLength={10}
                                className="flex-1"
                            />
                        </div>
                    </FormField>

                    {/* Password field */}
                    <FormField
                        label={COPY.auth.register.passwordLabel}
                        error={errors.password}
                        helpText={COPY.auth.register.passwordHelp}
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
                                placeholder={COPY.auth.register.passwordPlaceholder}
                                error={!!errors.password}
                                aria-label="Password"
                                aria-required="true"
                                aria-invalid={!!errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#343434] transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#343434] rounded"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <Icon name="show" size="w-5 h-5" />
                            </button>
                        </div>
                    </FormField>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText={COPY.auth.register.loading}
                        className="w-full mt-auto md:mt-4 min-h-[44px]"
                        disabled={loading}
                    >
                        {COPY.auth.register.submit}
                    </LoadingButton>

                    <p className="text-center text-xs md:text-sm font-['DM_Sans'] text-[#999999] mt-6 md:mt-8 leading-relaxed px-4 md:px-0 min-h-[44px] flex items-center justify-center flex-wrap gap-x-1">
                        {COPY.auth.register.terms} <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">{COPY.auth.register.termsLink}</span> {COPY.auth.register.and} <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">{COPY.auth.register.conditionsLink}</span>
                    </p>

                    <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                        {COPY.auth.register.hasAccount} <Link to="/login" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors min-h-[44px] inline-flex items-center -my-2 py-2">{COPY.auth.register.signInLink}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
