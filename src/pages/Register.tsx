import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import Icon from "@/components/Icon";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const navigate = useNavigate();
    const { register } = useAuth();

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!name) newErrors.name = "Full name is required";
        else if (name.trim().length < 2) newErrors.name = "Please enter your full name";
        if (!email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const names = name.split(" ");
            const firstName = names[0];
            // If they only enter one name, fallback to a dot so backend requirement is met
            const lastName = names.length > 1 ? names.slice(1).join(" ") : ".";

            await register({
                firstName,
                lastName,
                email,
                password
            });
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex md:flex-row-reverse bg-[#FAFAFA]">
            {/* Desktop Editorial Image Side (Reversed for Register) */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1550614000-4b95d466f1fc?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial - Timeless fashion collection"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10 text-right" aria-label="Muxury Home">Muxury.</Link>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 z-0 pb-10 overflow-y-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 active:scale-95 transition-transform hover:bg-[#F5F0EE] rounded-full"
                    aria-label="Go back"
                >
                    <Icon name="back" size="w-6 h-6" />
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-8 md:mb-12">
                    Create Account 🎉
                </h1>

                <form onSubmit={handleRegister} className="flex-1 flex flex-col" noValidate>
                    {/* Name field */}
                    <FormField
                        label="Full Name"
                        error={errors.name}
                        required
                    >
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            placeholder="John Doe"
                            error={!!errors.name}
                            aria-label="Full name"
                            aria-required="true"
                            aria-invalid={!!errors.name}
                        />
                    </FormField>

                    {/* Email field */}
                    <FormField
                        label="Email"
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
                            placeholder="example@gmail.com"
                            error={!!errors.email}
                            aria-label="Email address"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                        />
                    </FormField>

                    {/* Password field */}
                    <FormField
                        label="Password"
                        error={errors.password}
                        helpText="At least 6 characters"
                        required
                    >
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                placeholder="Create a password"
                                error={!!errors.password}
                                aria-label="Password"
                                aria-required="true"
                                aria-invalid={!!errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#343434] transition-colors p-1"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <Icon name="show" size="w-5 h-5" />
                            </button>
                        </div>
                    </FormField>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Creating account..."
                        className="w-full mt-auto md:mt-4"
                        disabled={loading}
                    >
                        Create an account
                    </LoadingButton>

                    <p className="text-center text-xs md:text-sm font-['DM_Sans'] text-[#999999] mt-6 md:mt-8 leading-relaxed px-4 md:px-0">
                        By signing up you agree to our <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">Terms</span> and <span className="underline font-bold text-[#343434] cursor-pointer hover:text-[#CA8385]">Conditions of Use</span>
                    </p>

                    <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                        Already have an account? <Link to="/login" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
