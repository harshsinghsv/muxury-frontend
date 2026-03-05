import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex md:flex-row bg-[#FAFAFA]">
            {/* Desktop Editorial Image Side */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial"
                    className="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10">Muxury.</Link>
                    <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl leading-tight max-w-lg mb-8 drop-shadow-lg">
                        Refined minimalism for the modern wardrobe.
                    </h2>
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

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-8 md:mb-12">
                    Hi, Welcome Back! 👋
                </h1>

                <form onSubmit={handleLogin} className="flex-1 flex flex-col">
                    {/* Email field */}
                    <div className="mb-4 md:mb-6">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-14 md:h-16 px-4 md:px-6 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm md:text-base font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="example@gmail.com"
                        />
                    </div>

                    {/* Password field */}
                    <div className="mb-4 md:mb-6 relative">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-14 md:h-16 px-4 md:px-6 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm md:text-base font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="Enter Your Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 md:right-6 top-[38px] md:top-[42px] text-[#999999]"
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <label className="flex items-center gap-2 text-sm md:text-base font-['DM_Sans'] text-[#343434] cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 md:w-5 md:h-5 accent-[#343434] rounded cursor-pointer" /> Remember Me
                        </label>
                        <Link to="/forgot-password" className="text-sm md:text-base font-['DM_Sans'] text-[#343434] underline font-medium hover:text-[#CA8385] transition-colors">
                            Forgot Password
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 md:h-16 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base md:text-lg active:scale-95 transition-transform disabled:opacity-70 mt-auto md:mt-4 hover:bg-black"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                        Don't have an account? <Link to="/register" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
