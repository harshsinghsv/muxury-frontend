import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            navigate("/enter-otp");
        }
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
                Forgot Password
            </h1>
            <p className="font-['DM_Sans'] text-sm text-[#999999] mb-8">
                Recover your account password
            </p>

            <form onSubmit={handleNext} className="flex-1 flex flex-col">
                <div className="mb-8">
                    <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 px-4 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                        placeholder="example@gmail.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full h-14 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base active:scale-95 transition-transform mt-auto"
                >
                    Next
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
