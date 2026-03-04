import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnterOTP = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [showTerms, setShowTerms] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value !== "" && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleContinue = () => {
        if (otp.every(digit => digit !== "")) {
            setShowTerms(true);
        }
    };

    const handleAgree = () => {
        setShowTerms(false);
        navigate("/create-new-password");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F0EE] via-[#FAF8F7] to-white flex flex-col px-5 z-0 pb-10">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center mt-6 mb-8 active:scale-95 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>

            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434] mb-2">
                Enter OTP
            </h1>
            <p className="font-['DM_Sans'] text-sm text-[#999999] mb-8">
                We have just sent you a 4 digit code via your email <span className="font-bold text-[#343434]">example@gmail.com</span>
            </p>

            <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-3 mt-2 mb-8 px-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-16 h-16 rounded-2xl border text-center text-2xl font-bold font-['DM_Sans'] text-[#343434] focus:outline-none transition-colors ${digit ? 'border-[#EBEBEB] bg-white' : 'border-[#CA8385] bg-transparent'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full h-14 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base active:scale-95 transition-transform mt-auto"
                >
                    Continue
                </button>

                <p className="text-center text-sm font-['DM_Sans'] text-[#999999] mt-6">
                    Didn't receive code? <button className="text-[#343434] font-bold">Resend Code</button>
                </p>
            </div>

            {/* OTP Terms Modal */}
            {showTerms && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-5 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <p className="text-sm font-['DM_Sans'] text-[#343434] leading-relaxed mb-6 text-center">
                            I agree to the <span className="underline font-medium">Terms of Service</span> and <span className="underline font-medium">Conditions of Use</span> including consent to electronic communications and I affirm that the information provided is my own.
                        </p>
                        <button
                            onClick={handleAgree}
                            className="w-full h-12 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium mb-3 active:scale-95 transition-transform"
                        >
                            Agree and continue
                        </button>
                        <button
                            onClick={() => setShowTerms(false)}
                            className="w-full h-12 text-[#CA8385] font-['DM_Sans'] text-sm font-medium active:scale-[0.98] transition-transform"
                        >
                            Disagree
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnterOTP;
