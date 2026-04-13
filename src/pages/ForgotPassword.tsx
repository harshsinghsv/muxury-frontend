import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import LoadingButton from "@/components/LoadingButton";
import Icon from "@/components/Icon";

const ForgotPassword = () => {
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ identifier?: string }>({});
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!identifier) newErrors.identifier = "Email or Phone is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await resetPassword(identifier);
            navigate(`/verify-otp?purpose=reset&phone=${encodeURIComponent(identifier)}`);
        } catch (error) {
            console.error("Failed to reset password:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex md:flex-row bg-[#FAFAFA]">
            {/* Desktop Editorial Image Side */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-[#e0dede]">
                <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200"
                    alt="Muxury Editorial - Password recovery"
                    className="absolute inset-0 w-full h-full object-cover object-center grayscale-[30%]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-between text-white">
                    <Link to="/" className="font-['Playfair_Display'] text-3xl font-bold tracking-wide mix-blend-difference z-10" aria-label="Muxury Home">Muxury.</Link>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen bg-gradient-to-b md:bg-none from-[#F5F0EE] via-[#FAF8F7] to-white md:bg-white flex flex-col px-5 md:px-12 lg:px-20 z-0 pb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center mt-6 md:mt-12 mb-8 md:mb-12 active:scale-95 transition-transform hover:bg-[#F5F0EE] rounded-full"
                    aria-label="Go back"
                >
                    <Icon name="back" size="w-6 h-6" />
                </button>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#343434] mb-2 md:mb-4">
                    Forgot Password
                </h1>
                <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999] mb-8 md:mb-12">
                    Recover your account password
                </p>

                <form onSubmit={handleNext} className="flex-1 flex flex-col" noValidate>
                    <FormField
                        label="Email or Mobile Number"
                        error={errors.identifier}
                        required
                    >
                        <Input
                            type="text"
                            value={identifier}
                            onChange={(e) => {
                                setIdentifier(e.target.value);
                                if (errors.identifier) setErrors({ ...errors, identifier: undefined });
                            }}
                            placeholder="example@gmail.com or 9876543210"
                            error={!!errors.identifier}
                            aria-label="Email or phone"
                            aria-required="true"
                            aria-invalid={!!errors.identifier}
                        />
                    </FormField>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Sending OTP..."
                        className="w-full mt-auto md:mt-4"
                        disabled={loading}
                    >
                        Next
                    </LoadingButton>

                    <p className="text-center text-sm md:text-base font-['DM_Sans'] text-[#999999] mt-6 md:mt-8">
                        Remembered your password? <Link to="/login" className="text-[#343434] font-bold hover:text-[#CA8385] transition-colors">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
