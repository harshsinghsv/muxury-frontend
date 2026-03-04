import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        toast.success("Password changed successfully");
        navigate(-1);
    };

    const hasLength = newPassword.length >= 8;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-10 z-0">
            <div className="px-5 pt-8">
                <h2 className="font-['DM_Sans'] text-sm text-[#999999] mb-8 leading-relaxed">
                    Your new password must be different from previous used passwords.
                </h2>

                <form onSubmit={handleSave} className="flex flex-col flex-1">
                    {/* Current Password field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full h-14 px-4 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="w-full h-px bg-[#EBEBEB] my-6"></div>

                    {/* New Password field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-14 px-4 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="••••••••"
                        />
                        {newPassword && (
                            <p className={`flex items-center gap-2 text-xs font-['DM_Sans'] mt-2 ${hasLength ? 'text-[#46D27E]' : 'text-[#999999]'}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                There must be at least 8 characters
                            </p>
                        )}
                    </div>

                    {/* Confirm Password field */}
                    <div className="mb-8 mt-2">
                        <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-14 px-4 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-14 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-base active:scale-95 transition-transform mt-6"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
