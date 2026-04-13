import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import { AltArrowLeft, Eye, EyeClosed } from "@solar-icons/react";

type LoginMode = "phone" | "email";

const Login = () => {
    const [mode, setMode] = useState<LoginMode>("phone");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithEmail } = useAuth();
    
    const from = (location.state as any)?.from?.pathname || "/";
    const isFromCheckout = from.includes("/checkout");

    const validate = () => {
        const e: typeof errors = {};
        if (!identifier) {
            e.identifier = mode === "phone" ? "Phone number is required" : "Email is required";
        } else if (mode === "phone" && !/^[6-9]\d{9}$/.test(identifier)) {
            e.identifier = "Enter a valid 10-digit Indian mobile number";
        } else if (mode === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
            e.identifier = "Enter a valid email address";
        }
        
        if (!password) e.password = "Password is required";
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            if (mode === "phone") {
                await login(identifier, password);
                navigate(`/verify-otp?purpose=login&phone=${encodeURIComponent(identifier)}&next=${encodeURIComponent(from)}`);
            } else {
                await loginWithEmail(identifier, password);
                navigate(from);
                toast.success("Welcome back to Muxury!");
            }
        } catch (err: any) {
            const msg = err.message || "Login failed";
            if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("no account") || msg.toLowerCase().includes("not found")) {
                toast.error(mode === "phone" ? "No account found. Redirecting..." : "Invalid email or password.");
                if (mode === "phone") {
                    setTimeout(() => navigate("/register"), 1500);
                }
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-['DM_Sans']">
            {/* High-End Editorial Left Side */}
            <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative bg-[#F5F5F5] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600"
                    alt="Muxury Editorial"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[15%]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-12 lg:p-16 flex flex-col justify-between text-white z-10">
                    <Link to="/" className="font-['Playfair_Display'] text-4xl font-bold tracking-tight" aria-label="Muxury Home">
                        Muxury.
                    </Link>
                    <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl leading-[1.1] max-w-md drop-shadow-md">
                        Enter the world of modern luxury.
                    </h2>
                </div>
            </div>

            {/* Stark Neutral Form Right Side */}
            <div className="w-full md:w-[55%] lg:w-[50%] h-screen flex flex-col items-center justify-center relative px-6 py-10 overflow-y-auto">
                
                {/* Mobile Header Overlay */}
                <div className="md:hidden absolute top-8 left-6 right-6 flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors text-[#343434]">
                        <AltArrowLeft size={24} />
                    </button>
                    <Link to="/" className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">Muxury.</Link>
                </div>

                <div className="w-full max-w-[400px] flex flex-col mt-12 md:mt-0 relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="hidden md:flex absolute -top-16 -left-4 w-10 h-10 items-center justify-center hover:bg-neutral-100 rounded-full transition-colors text-[#343434]"
                    >
                        <AltArrowLeft size={24} />
                    </button>

                    <h1 className="font-['Playfair_Display'] text-4xl md:text-[42px] font-bold text-[#343434] mb-3 tracking-tight">
                        Sign In
                    </h1>
                    <p className="text-base text-[#757575] mb-8">
                        Welcome back to your Muxury account.
                    </p>

                    {/* Elite Tabs */}
                    <div className="flex bg-[#F5F5F5] rounded-xl p-1.5 mb-8">
                        <button 
                            onClick={() => { setMode("phone"); setIdentifier(""); setErrors({}); }} 
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === "phone" ? 'bg-white text-[#343434] shadow-sm' : 'text-[#999999]'}`}
                        >
                            Mobile Number
                        </button>
                        <button 
                            onClick={() => { setMode("email"); setIdentifier(""); setErrors({}); }} 
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === "email" ? 'bg-white text-[#343434] shadow-sm' : 'text-[#999999]'}`}
                        >
                            Email Address
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                        {/* Premium Input */}
                        <FormField label={mode === "phone" ? "Mobile Number" : "Email Address"} error={errors.identifier} required>
                            {mode === "phone" ? (
                                <div className="flex items-center gap-3">
                                    <span className="h-14 w-[72px] flex items-center justify-center text-[15px] font-bold text-[#343434] bg-[#F5F5F5] rounded-xl border border-transparent select-none shrink-0">
                                        +91
                                    </span>
                                    <Input
                                        type="tel"
                                        value={identifier}
                                        onChange={(e) => { setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, identifier: undefined })); }}
                                        placeholder="9876543210"
                                        error={!!errors.identifier}
                                        maxLength={10}
                                        className="flex-1 h-14 bg-white border-[#EBEBEB] focus:border-[#343434] rounded-xl text-[15px] px-4"
                                    />
                                </div>
                            ) : (
                                <Input
                                    type="email"
                                    value={identifier}
                                    onChange={(e) => { setIdentifier(e.target.value); setErrors(p => ({ ...p, identifier: undefined })); }}
                                    placeholder="name@example.com"
                                    error={!!errors.identifier}
                                    className="h-14 bg-white border-[#EBEBEB] focus:border-[#343434] rounded-xl text-[15px] px-4"
                                />
                            )}
                        </FormField>

                        <FormField label="Password" error={errors.password} required>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                                    placeholder="Enter your password"
                                    error={!!errors.password}
                                    className="h-14 bg-white border-[#EBEBEB] focus:border-[#343434] rounded-xl text-[15px] px-4 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#343434] transition-colors"
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                                </button>
                            </div>
                        </FormField>

                        <div className="flex justify-end -mt-2 mb-2">
                            <Link to="/forgot-password" className="text-sm font-bold text-[#757575] hover:text-[#343434] transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <LoadingButton
                            type="submit"
                            loading={loading}
                            loadingText="Authenticating..."
                            className="w-full h-14 bg-[#343434] text-white text-base font-bold rounded-xl active:scale-[0.98] transition-transform"
                            disabled={loading}
                        >
                            {mode === "phone" ? "Get OTP" : "Sign In"}
                        </LoadingButton>

                        {isFromCheckout && (
                            <>
                                <div className="relative my-4 text-center">
                                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-[#E0E0E0]"></span>
                                    <span className="relative bg-white px-3 text-xs font-bold tracking-widest text-[#999999] uppercase">OR</span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => navigate("/checkout")}
                                    className="w-full h-14 bg-white border-[1.5px] border-[#343434] text-[#343434] rounded-xl font-bold hover:bg-[#F5F5F5] transition-colors"
                                >
                                    Continue as Guest
                                </button>
                            </>
                        )}
                    </form>

                    <p className="text-center text-[15px] text-[#757575] mt-10">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#343434] font-bold hover:underline underline-offset-4">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
