import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import Icon from "@/components/Icon";
import { COPY } from "@/config/constants";

type LoginTab = "email" | "phone";
type EmailStep = "input" | "otp";
type PhoneStep = "input" | "otp";

const Login = () => {
    const [tab, setTab] = useState<LoginTab>("email");
    const [searchParams] = useSearchParams();

    // Email login state (OTP-based)
    const [email, setEmail] = useState("");
    const [emailStep, setEmailStep] = useState<EmailStep>("input");
    const [emailOtp, setEmailOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

    // Phone login state
    const [phone, setPhone] = useState("");
    const [phoneStep, setPhoneStep] = useState<PhoneStep>("input");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [phoneLoading, setPhoneLoading] = useState(false);

    // Banner
    const [showEmailVerifiedBanner, setShowEmailVerifiedBanner] = useState(false);

    const navigate = useNavigate();
    const { loginEmailSendOtp, loginEmailVerifyOtp, loginPhoneSendOtp, loginPhoneVerifyOtp } = useAuth();

    // Show email verified banner if redirected from email verification
    useEffect(() => {
        if (searchParams.get("emailVerified") === "true") {
            setShowEmailVerifiedBanner(true);
            const t = setTimeout(() => setShowEmailVerifiedBanner(false), 8000);
            return () => clearTimeout(t);
        }
    }, [searchParams]);

    // ─── Email login — Send OTP ───────────────────────────────────────────

    const handleEmailSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setErrors({ email: "Email is required" });
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setErrors({ email: "Please enter a valid email" });
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            await loginEmailSendOtp(email);
            setEmailStep("otp");
            toast.success("Login code sent to " + email);
        } catch (error: any) {
            toast.error(error.message || "Failed to send login code");
        } finally {
            setLoading(false);
        }
    };

    // ─── Email login — Verify OTP ─────────────────────────────────────────

    const handleEmailVerifyOtp = async () => {
        if (emailOtp.length !== 6) {
            toast.error("Please enter a 6-digit code");
            return;
        }
        setLoading(true);
        try {
            await loginEmailVerifyOtp(email, emailOtp);
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    // ─── Phone login — Send OTP ───────────────────────────────────────────

    const handlePhoneSendOtp = async () => {
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            setErrors({ phone: "Enter a valid 10-digit Indian mobile number" });
            return;
        }
        setErrors({});
        setPhoneLoading(true);
        try {
            await loginPhoneSendOtp(phone);
            setPhoneStep("otp");
            toast.success("OTP sent to +91 " + phone);
        } catch (error: any) {
            toast.error(error.message || "Failed to send OTP");
        } finally {
            setPhoneLoading(false);
        }
    };

    // ─── Phone login — Verify OTP ─────────────────────────────────────────

    const handlePhoneVerifyOtp = async () => {
        if (phoneOtp.length !== 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }
        setPhoneLoading(true);
        try {
            await loginPhoneVerifyOtp(phone, phoneOtp);
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Invalid OTP");
        } finally {
            setPhoneLoading(false);
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
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 active:scale-95 transition-transform hover:bg-[#F5F0EE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#343434]"
                    aria-label="Go back"
                >
                    <Icon name="back" size="w-6 h-6" />
                </button>

                {/* Email Verified Banner */}
                {showEmailVerifiedBanner && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-['DM_Sans'] text-center animate-in fade-in">
                        ✅ Email verified! You can now log in.
                    </div>
                )}

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-6 md:mb-8">
                    {COPY.auth.login.title}
                </h1>

                {/* Tab Switcher */}
                <div className="flex mb-8 border-b border-[#E5E5E5]">
                    <button
                        type="button"
                        onClick={() => { setTab("email"); setEmailStep("input"); setEmailOtp(""); }}
                        className={`flex-1 pb-3 text-sm font-semibold font-['DM_Sans'] transition-colors border-b-2 min-h-[44px] ${
                            tab === "email"
                                ? "text-[#343434] border-[#343434]"
                                : "text-[#999999] border-transparent hover:text-[#343434]"
                        }`}
                    >
                        Email Login
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTab("phone"); setPhoneStep("input"); setPhoneOtp(""); }}
                        className={`flex-1 pb-3 text-sm font-semibold font-['DM_Sans'] transition-colors border-b-2 min-h-[44px] ${
                            tab === "phone"
                                ? "text-[#343434] border-[#343434]"
                                : "text-[#999999] border-transparent hover:text-[#343434]"
                        }`}
                    >
                        Phone Login
                    </button>
                </div>

                {/* ─── Email Tab ─────────────────────────────────────────── */}
                {tab === "email" && (
                    <div className="flex-1 flex flex-col">
                        {emailStep === "input" && (
                            <form onSubmit={handleEmailSendOtp} className="flex-1 flex flex-col" noValidate>
                                <FormField
                                    label={COPY.auth.login.emailLabel}
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
                                        placeholder={COPY.auth.login.emailPlaceholder}
                                        error={!!errors.email}
                                        aria-label="Email address"
                                        aria-required="true"
                                        aria-invalid={!!errors.email}
                                    />
                                </FormField>

                                <LoadingButton
                                    type="submit"
                                    loading={loading}
                                    loadingText="Sending code..."
                                    className="w-full mt-auto md:mt-4 min-h-[44px]"
                                    disabled={loading}
                                >
                                    Get Login Code
                                </LoadingButton>

                                <p className="text-center mt-4 text-xs text-[#999999] font-['DM_Sans']">
                                    We'll send a 6-digit code to your email
                                </p>

                                <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                                    {COPY.auth.login.noAccount} <Link to="/register" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors min-h-[44px] inline-flex items-center -my-2 py-2">{COPY.auth.login.signUpLink}</Link>
                                </p>
                            </form>
                        )}

                        {emailStep === "otp" && (
                            <>
                                <p className="text-sm font-['DM_Sans'] text-[#999999] mb-4">
                                    Code sent to <strong className="text-[#343434]">{email}</strong>
                                </p>

                                <FormField label="Enter Code" required>
                                    <Input
                                        type="text"
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="Enter 6-digit code"
                                        aria-label="Email login code"
                                        className="text-center tracking-[0.5em] text-lg font-mono"
                                        maxLength={6}
                                    />
                                </FormField>

                                <LoadingButton
                                    type="button"
                                    loading={loading}
                                    loadingText="Verifying..."
                                    className="w-full mt-auto md:mt-4 min-h-[44px]"
                                    disabled={loading || emailOtp.length !== 6}
                                    onClick={handleEmailVerifyOtp}
                                >
                                    Login
                                </LoadingButton>

                                <button
                                    type="button"
                                    onClick={() => { setEmailStep("input"); setEmailOtp(""); }}
                                    className="mt-4 text-sm font-['DM_Sans'] text-[#343434] underline hover:text-[#CA8385] transition-colors min-h-[44px]"
                                >
                                    Change email
                                </button>

                                <button
                                    type="button"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        try { await loginEmailSendOtp(email); toast.success("Code resent!"); } catch { toast.error("Failed to resend code"); }
                                    }}
                                    className="mt-2 text-sm font-['DM_Sans'] text-[#999999] hover:text-[#CA8385] transition-colors min-h-[44px]"
                                >
                                    Resend code
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ─── Phone Tab ────────────────────────────────────────── */}
                {tab === "phone" && (
                    <div className="flex-1 flex flex-col">
                        {phoneStep === "input" && (
                            <>
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
                                            maxLength={10}
                                            className="flex-1"
                                        />
                                    </div>
                                </FormField>

                                <LoadingButton
                                    type="button"
                                    loading={phoneLoading}
                                    loadingText="Sending OTP..."
                                    className="w-full mt-auto md:mt-4 min-h-[44px]"
                                    disabled={phoneLoading}
                                    onClick={handlePhoneSendOtp}
                                >
                                    Get OTP
                                </LoadingButton>
                            </>
                        )}

                        {phoneStep === "otp" && (
                            <>
                                <p className="text-sm font-['DM_Sans'] text-[#999999] mb-4">
                                    OTP sent to <strong className="text-[#343434]">+91 {phone}</strong>
                                </p>

                                <FormField label="Enter OTP" required>
                                    <Input
                                        type="text"
                                        value={phoneOtp}
                                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="Enter 6-digit OTP"
                                        aria-label="Login OTP"
                                        className="text-center tracking-[0.5em] text-lg font-mono"
                                        maxLength={6}
                                    />
                                </FormField>

                                <LoadingButton
                                    type="button"
                                    loading={phoneLoading}
                                    loadingText="Verifying..."
                                    className="w-full mt-auto md:mt-4 min-h-[44px]"
                                    disabled={phoneLoading || phoneOtp.length !== 6}
                                    onClick={handlePhoneVerifyOtp}
                                >
                                    Login
                                </LoadingButton>

                                <button
                                    type="button"
                                    onClick={() => { setPhoneStep("input"); setPhoneOtp(""); }}
                                    className="mt-4 text-sm font-['DM_Sans'] text-[#343434] underline hover:text-[#CA8385] transition-colors min-h-[44px]"
                                >
                                    Change phone number
                                </button>
                            </>
                        )}

                        <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                            {COPY.auth.login.noAccount} <Link to="/register" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors min-h-[44px] inline-flex items-center -my-2 py-2">{COPY.auth.login.signUpLink}</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
