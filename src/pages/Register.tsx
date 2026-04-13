import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import { AltArrowLeft, Eye, EyeClosed } from "@solar-icons/react";

const Register = () => {
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; name?: string; password?: string; email?: string }>({});

    const navigate = useNavigate();
    const { register } = useAuth();

    const validate = () => {
        const e: typeof errors = {};
        if (!phone) e.phone = "Required";
        else if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Invalid 10-digit number";
        if (!name.trim()) e.name = "Required";
        else if (name.trim().length < 2) e.name = "Enter full name";
        if (!password) e.password = "Required";
        else if (password.length < 8) e.password = "Min 8 characters required";
        if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const names = name.trim().split(" ");
            const firstName = names[0];
            const lastName = names.length > 1 ? names.slice(1).join(" ") : ".";

            await register({
                phone,
                firstName,
                lastName,
                password,
                ...(email && { email }),
            });

            toast.success("Account created! Enter the OTP sent to your phone.");
            navigate(`/verify-otp?purpose=register&phone=${encodeURIComponent(phone)}`);
        } catch (err: any) {
            toast.error(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full flex-row-reverse bg-white font-['DM_Sans']">
            {/* High-End Editorial Left Side (Reversed) */}
            <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative bg-[#F5F5F5] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1550614000-4b95d466f1fc?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[10%]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-12 lg:p-16 flex flex-col justify-between text-white z-10 text-right">
                    <Link to="/" className="font-['Playfair_Display'] text-4xl font-bold tracking-tight" aria-label="Muxury Home">
                        Muxury.
                    </Link>
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

                <div className="w-full max-w-[400px] flex flex-col mt-8 md:mt-0 relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="hidden md:flex absolute -top-16 -left-4 w-10 h-10 items-center justify-center hover:bg-neutral-100 rounded-full transition-colors text-[#343434]"
                    >
                        <AltArrowLeft size={24} />
                    </button>

                    <h1 className="font-['Playfair_Display'] text-4xl md:text-[42px] font-bold text-[#343434] mb-3 tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-base text-[#757575] mb-8">
                        Join Muxury — your definitive luxury destination.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                        <FormField label="Phone Number" error={errors.phone} required>
                            <div className="flex items-center gap-3">
                                <span className="h-14 w-[72px] flex items-center justify-center text-[15px] font-bold text-[#343434] bg-[#F5F5F5] rounded-xl border border-transparent select-none shrink-0">
                                    +91
                                </span>
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, phone: undefined })); }}
                                    placeholder="9876543210"
                                    error={!!errors.phone}
                                    maxLength={10}
                                    className="flex-1 h-14 bg-white border-[#EBEBEB] focus:border-[#343434] rounded-xl text-[15px] px-4"
                                />
                            </div>
                        </FormField>

                        <FormField label="Full Name" error={errors.name} required>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                                placeholder="e.g. Aditya Sharma"
                                error={!!errors.name}
                                className="h-14 bg-white border-[#EBEBEB] focus:border-[#343434] rounded-xl text-[15px] px-4"
                            />
                        </FormField>

                        <FormField label="Password" error={errors.password} required>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                                    placeholder="Create a strong password"
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

                        <FormField label="Email Address (Optional)" error={errors.email}>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                                placeholder="you@example.com"
                                error={!!errors.email}
                                className="h-14 bg-white border-[#EBEBEB] focus:border-[#343434] rounded-xl text-[15px] px-4"
                            />
                        </FormField>

                        <LoadingButton
                            type="submit"
                            loading={loading}
                            loadingText="Creating account..."
                            className="w-full mt-2 h-14 bg-[#343434] text-white text-base font-bold rounded-xl active:scale-[0.98] transition-transform"
                            disabled={loading}
                        >
                            Create Account
                        </LoadingButton>

                        <p className="text-center text-[13px] text-[#999999] mt-3 leading-relaxed px-2">
                            By creating an account, you agree to our{" "}
                            <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">Terms of Service</span>
                            {" "}and{" "}
                            <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">Privacy Policy</span>
                        </p>

                        <p className="text-center text-[15px] text-[#757575] mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#343434] font-bold hover:underline underline-offset-4">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
