import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        <div className="min-h-screen flex md:flex-row bg-[#FAFAFA]">
            {/* Desktop Editorial Image Side */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial"
                    className="absolute inset-0 w-full h-full object-cover object-center grayscale-[30%]"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10">Muxury.</Link>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 z-0 pb-10 relative">
                <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 active:scale-95 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-2 md:mb-4">
                    Enter OTP
                </h1>
                <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999] mb-8 md:mb-12">
                    We have just sent you a 4 digit code via your email <br className="hidden md:block" /><span className="font-bold text-[#343434]">example@gmail.com</span>
                </p>

                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-3 mt-2 mb-8 md:mb-12 px-2 md:px-0">
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
                                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border text-center text-2xl md:text-3xl font-bold font-['DM_Sans'] text-[#343434] focus:outline-none transition-colors ${digit ? 'border-[#EBEBEB] bg-white shadow-sm' : 'border-[#CA8385] bg-transparent'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleContinue}
                        className="w-full h-14 md:h-16 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base md:text-lg active:scale-95 transition-transform mt-auto md:mt-0 hover:bg-black"
                    >
                        Continue
                    </button>

                    <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                        Didn't receive code? <button className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">Resend Code</button>
                    </p>
                </div>

                {/* OTP Terms Modal */}
                {showTerms && (
                    <div className="md:absolute md:inset-0 fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-5 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                            <p className="text-sm md:text-base font-['DM_Sans'] text-[#343434] leading-relaxed mb-6 md:mb-8 text-center">
                                I agree to the <span className="underline font-medium hover:text-[#CA8385] cursor-pointer">Terms of Service</span> and <span className="underline font-medium hover:text-[#CA8385] cursor-pointer">Conditions of Use</span> including consent to electronic communications and I affirm that the information provided is my own.
                            </p>
                            <button
                                onClick={handleAgree}
                                className="w-full h-12 md:h-14 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium mb-3 active:scale-95 transition-transform hover:bg-black"
                            >
                                Agree and continue
                            </button>
                            <button
                                onClick={() => setShowTerms(false)}
                                className="w-full h-12 md:h-14 text-[#CA8385] font-['DM_Sans'] text-sm md:text-base font-medium active:scale-[0.98] transition-transform hover:bg-[#FAF8F7] rounded-full"
                            >
                                Disagree
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnterOTP;
