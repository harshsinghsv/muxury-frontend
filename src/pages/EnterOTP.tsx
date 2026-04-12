/**
 * EnterOTP — Unified OTP verification page.
 *
 * Handles both registration (purpose=register) and login (purpose=login).
 * Reads ?purpose=register|login&phone=xxx from query params.
 * After successful OTP → navigates to ?next= URL or home.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const RESEND_COOLDOWN = 30; // seconds
const OTP_LENGTH = 6;

const EnterOTP = () => {
    const [searchParams] = useSearchParams();
    const phone = searchParams.get("phone") || "";
    const purpose = (searchParams.get("purpose") || "login") as "register" | "login";
    const next = searchParams.get("next") || "/";

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const navigate = useNavigate();
    const { verifyOtp, resendOtp } = useAuth();

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Resend countdown
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    // If no phone in URL, redirect to login
    useEffect(() => {
        if (!phone) navigate("/login", { replace: true });
    }, [phone, navigate]);

    // ─── OTP input handlers ────────────────────────────────────────────────

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const digit = value.slice(-1); // take last character (handle paste case per-digit)
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!text) return;
        const newOtp = Array(OTP_LENGTH).fill("");
        text.split("").forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        // Focus the last filled input or the next empty one
        const lastIdx = Math.min(text.length, OTP_LENGTH - 1);
        inputRefs.current[lastIdx]?.focus();
    };

    // ─── Verify ───────────────────────────────────────────────────────────

    const handleVerify = useCallback(async () => {
        const otpStr = otp.join("");
        if (otpStr.length !== OTP_LENGTH) {
            toast.error(`Please enter all ${OTP_LENGTH} digits`);
            return;
        }
        setLoading(true);
        try {
            await verifyOtp(phone, otpStr, purpose);
            toast.success(purpose === "register" ? "Account verified! Welcome to Muxury." : "Login successful!");
            navigate(next, { replace: true });
        } catch (err: any) {
            toast.error(err.message || "Invalid OTP. Please try again.");
            // Clear OTP on error
            setOtp(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    }, [otp, phone, purpose, next, verifyOtp, navigate]);

    // Submit on Enter key
    useEffect(() => {
        const handleEnter = (e: KeyboardEvent) => {
            if (e.key === "Enter" && otp.join("").length === OTP_LENGTH && !loading) {
                handleVerify();
            }
        };
        window.addEventListener("keydown", handleEnter);
        return () => window.removeEventListener("keydown", handleEnter);
    }, [otp, loading, handleVerify]);

    // ─── Resend ───────────────────────────────────────────────────────────

    const handleResend = async () => {
        try {
            await resendOtp(phone);
            setResendCooldown(RESEND_COOLDOWN);
            setOtp(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
            toast.success("New OTP sent!");
        } catch (err: any) {
            toast.error(err.message || "Failed to resend OTP");
        }
    };

    const maskedPhone = phone ? `+91 ●●●●●${phone.slice(-5)}` : "";

    return (
        <div className="min-h-screen flex md:flex-row bg-[#FAFAFA]">
            {/* Editorial Side */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial"
                    className="absolute inset-0 w-full h-full object-cover object-center grayscale-[30%]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10">
                        Muxury.
                    </Link>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 pb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 hover:bg-[#F5F0EE] rounded-full transition-colors"
                    aria-label="Go back"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-2">
                    Enter OTP
                </h1>
                <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999] mb-8 md:mb-12 leading-relaxed">
                    We sent a 6-digit code to{" "}
                    <span className="font-bold text-[#343434]">{maskedPhone}</span>
                    <br />
                    <button
                        type="button"
                        onClick={() => navigate(purpose === "register" ? "/register" : "/login")}
                        className="text-sm text-[#CA8385] underline hover:text-[#343434] transition-colors mt-1 inline-block"
                    >
                        Change phone number
                    </button>
                </p>

                {/* OTP Boxes */}
                <div className="flex justify-between gap-2 md:gap-3 mb-8 md:mb-12" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            aria-label={`OTP digit ${index + 1}`}
                            className={`w-12 h-14 md:w-16 md:h-16 rounded-2xl border text-center text-2xl md:text-3xl font-bold font-['DM_Sans'] text-[#343434] focus:outline-none transition-all ${
                                digit
                                    ? "border-[#343434] bg-white shadow-sm"
                                    : "border-[#E5E5E5] bg-white focus:border-[#343434]"
                            }`}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading || otp.join("").length !== OTP_LENGTH}
                    className="w-full h-14 md:h-16 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base md:text-lg transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Verifying...
                        </span>
                    ) : "Verify OTP"}
                </button>

                {/* Resend */}
                <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                    Didn't receive code?{" "}
                    {resendCooldown > 0 ? (
                        <span className="text-[#CCCCCC]">Resend in {resendCooldown}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors"
                        >
                            Resend Code
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
};

export default EnterOTP;
