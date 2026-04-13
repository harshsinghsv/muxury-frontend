import { useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/Icon";

const Contact = () => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            toast.success("Message sent! We'll get back to you within 24 hours.");
            (e.target as HTMLFormElement).reset();
        }, 1000);
    };

    return (
        <div className="px-5 md:px-12 lg:px-24 xl:px-48 pt-12 pb-24 min-h-screen">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 animate-fade-in">
                {/* Left Side Info */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#343434] mb-4">
                            Get in Touch
                        </h1>
                        <p className="font-['DM_Sans'] text-[#999999] leading-relaxed">
                            We'd love to hear from you. Our friendly team is always here to chat.
                        </p>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-[#EBEBEB]">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#EBEBEB] shrink-0">
                                <Icon name="avatar" size="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-['DM_Sans'] font-bold text-[#343434] mb-1">Chat to us</h3>
                                <p className="font-['DM_Sans'] text-sm text-[#999999] mb-1">Our friendly team is here to help.</p>
                                <a href="mailto:hello@muxury.com" className="font-['DM_Sans'] text-sm font-medium text-[#CA8385] hover:underline">hello@muxury.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#EBEBEB] shrink-0">
                                <Icon name="home" size="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-['DM_Sans'] font-bold text-[#343434] mb-1">Office</h3>
                                <p className="font-['DM_Sans'] text-sm text-[#999999] mb-1">Come say hello at our India HQ.</p>
                                <p className="font-['DM_Sans'] text-sm font-medium text-[#CA8385]">100 Muxury Avenue, Mumbai, IN</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="flex-1 bg-white p-6 md:p-10 rounded-3xl border border-[#EBEBEB] shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block font-['DM_Sans'] text-sm font-bold text-[#343434] mb-2">First Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="First name"
                                    className="w-full bg-[#FAF8F7] border border-[#EBEBEB] rounded-xl px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#CA8385] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block font-['DM_Sans'] text-sm font-bold text-[#343434] mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@email.com"
                                    className="w-full bg-[#FAF8F7] border border-[#EBEBEB] rounded-xl px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#CA8385] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block font-['DM_Sans'] text-sm font-bold text-[#343434] mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Leave us a message..."
                                    className="w-full bg-[#FAF8F7] border border-[#EBEBEB] rounded-xl px-4 py-3 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#CA8385] transition-colors resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#343434] text-white font-['DM_Sans'] font-bold rounded-xl py-4 hover:bg-black transition-colors disabled:opacity-70"
                        >
                            {submitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
