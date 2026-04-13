import { useMemo } from "react";
import { Link } from "react-router-dom";

export type StaticPageType = "about" | "privacy" | "terms" | "shipping" | "returns" | "faq";

interface StaticPageProps {
    type: StaticPageType;
}

const STATIC_CONTENT: Record<StaticPageType, { title: string, content: React.ReactNode }> = {
    about: {
        title: "About Us",
        content: (
            <div className="space-y-6 text-[#999999]">
                <p>Welcome to Muxury, your number one source for all things fashion. We're dedicated to giving you the very best of modern clothing, with a focus on dependability, customer service, and uniqueness.</p>
                <p>Founded in 2024, Muxury has come a long way from its beginnings. When we first started out, our passion for eco-friendly design drove us to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online store.</p>
                <p>We now serve customers all over the world, and are thrilled to be a part of the quirky, eco-friendly, fair-trade wing of the fashion industry.</p>
                <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to <Link to="/contact" className="text-[#CA8385] hover:underline">contact us</Link>.</p>
            </div>
        )
    },
    privacy: {
        title: "Privacy Policy",
        content: (
            <div className="space-y-6 text-[#999999]">
                <h3 className="font-['Playfair_Display'] text-xl text-[#343434]">1. Information We Collect</h3>
                <p>We collect information you provide directly to us. For example, we collect information when you create an account, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us.</p>
                
                <h3 className="font-['Playfair_Display'] text-xl text-[#343434] mt-8">2. Use of Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, such as to process transactions, send you technical notices, updates, security alerts, and support and administrative messages.</p>
            </div>
        )
    },
    terms: {
        title: "Terms & Conditions",
        content: (
            <div className="space-y-6 text-[#999999]">
                <p>Please read these terms and conditions carefully before using Our Service.</p>
                
                <h3 className="font-['Playfair_Display'] text-xl text-[#343434] mt-8">Acceptance of Terms</h3>
                <p>By accessing this Website, accessible from Muxury.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
            </div>
        )
    },
    shipping: {
        title: "Shipping Policy",
        content: (
            <div className="space-y-6 text-[#999999]">
                <h3 className="font-['Playfair_Display'] text-xl text-[#343434]">Domestic Shipping Rates and Estimates</h3>
                <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Standard Delivery (3-5 business days) - ₹15.00</li>
                    <li>Express Delivery (1-2 business days) - ₹30.00</li>
                    <li>Free shipping for all orders over ₹100.00</li>
                </ul>
                
                <h3 className="font-['Playfair_Display'] text-xl text-[#343434] mt-8">International Shipping</h3>
                <p>We currently only ship within India. Stay tuned as we expand our operations globally.</p>
            </div>
        )
    },
    returns: {
        title: "Returns & Exchanges",
        content: (
            <div className="space-y-6 text-[#999999]">
                <p>We accept returns up to 30 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.</p>
                <p>In the event that your order arrives damaged in any way, please email us as soon as possible with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.</p>
            </div>
        )
    },
    faq: {
        title: "Frequently Asked Questions",
        content: (
            <div className="space-y-6 text-[#999999]">
                <div className="border border-[#EBEBEB] rounded-xl p-5 mb-4">
                    <h4 className="font-bold text-[#343434] mb-2 font-['DM_Sans']">How do I track my order?</h4>
                    <p>Once your order has shipped, you will receive an email containing your tracking number and a link to trace its journey.</p>
                </div>
                <div className="border border-[#EBEBEB] rounded-xl p-5 mb-4">
                    <h4 className="font-bold text-[#343434] mb-2 font-['DM_Sans']">What happens if a product is out of stock?</h4>
                    <p>We frequently restock our most popular items. You can click 'Notify Me' on the product page to get an email minute the product returns.</p>
                </div>
                <div className="border border-[#EBEBEB] rounded-xl p-5 mb-4">
                    <h4 className="font-bold text-[#343434] mb-2 font-['DM_Sans']">Do you offer gift wrapping?</h4>
                    <p>Every Muxury order arrives in our signature premium packaging, making every unboxing experience feel like a gift.</p>
                </div>
            </div>
        )
    }
};

const StaticPage = ({ type }: StaticPageProps) => {
    const page = useMemo(() => STATIC_CONTENT[type], [type]);

    return (
        <div className="px-5 md:px-12 lg:px-24 xl:px-48 pt-12 pb-24 min-h-screen bg-white">
            <div className="max-w-3xl mx-auto animate-fade-in shadow-xl shadow-[#EBEBEB]/50 p-6 md:p-12 rounded-3xl border border-[#EBEBEB]">
                <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#343434] mb-8 pb-8 border-b border-[#EBEBEB]">
                    {page.title}
                </h1>
                <div className="font-['DM_Sans'] leading-relaxed text-sm md:text-base">
                    {page.content}
                </div>
            </div>
        </div>
    );
};

export default StaticPage;
