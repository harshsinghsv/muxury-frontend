import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const CreateNewPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const navigate = useNavigate();

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password === confirmPassword) {
            toast.success("Password reset successfully");
            navigate("/login");
        } else {
            toast.error("Passwords do not match");
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
                    Create New Password
                </h1>
                <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999] mb-8 md:mb-12">
                    Enter your new password
                </p>

                <form onSubmit={handleReset} className="flex-1 flex flex-col">
                    {/* New Password */}
                    <div className="mb-4 md:mb-6 relative">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">New Password</label>
                        <input
                            type={showPassword1 ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-14 md:h-16 px-4 md:px-6 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm md:text-base font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="Enter Your Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword1(!showPassword1)}
                            className="absolute right-4 md:right-6 top-[38px] md:top-[42px] text-[#999999]"
                        >
                            {showPassword1 ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            )}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-8 md:mb-12 relative">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">Confirm Password</label>
                        <input
                            type={showPassword2 ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-14 md:h-16 px-4 md:px-6 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm md:text-base font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="Confirm Your Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute right-4 md:right-6 top-[38px] md:top-[42px] text-[#999999]"
                        >
                            {showPassword2 ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-14 md:h-16 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base md:text-lg active:scale-95 transition-transform mt-auto md:mt-0 hover:bg-black"
                    >
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNewPassword;
