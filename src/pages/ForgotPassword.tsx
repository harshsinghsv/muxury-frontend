import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 z-0 pb-10">
                <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 active:scale-95 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-2 md:mb-4">
                    Forgot Password
                </h1>
                <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999] mb-8 md:mb-12">
                    Recover your account password
                </p>

                <form onSubmit={handleNext} className="flex-1 flex flex-col">
                    <div className="mb-8 md:mb-10">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-14 md:h-16 px-4 md:px-6 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm md:text-base font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="example@gmail.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-14 md:h-16 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base md:text-lg active:scale-95 transition-transform mt-auto md:mt-0 hover:bg-black"
                    >
                        Next
                    </button>

                    <p className="hidden md:block text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-8">
                        Remembered your password? <Link to="/login" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
