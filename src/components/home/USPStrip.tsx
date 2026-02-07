import { Truck, RotateCcw, Shield, Headphones, CheckCircle } from "lucide-react";

const usps = [
    {
        icon: Truck,
        title: "Free Shipping",
        subtitle: "On orders above $100",
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        subtitle: "30-day return policy",
    },
    {
        icon: Shield,
        title: "Secure Payments",
        subtitle: "100% protected transactions",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        subtitle: "Dedicated customer service",
    },
    {
        icon: CheckCircle,
        title: "Verified Products",
        subtitle: "100% authentic guarantee",
    },
];

const USPStrip = () => {
    return (
        <div className="bg-[#FDF5E6] border-y border-gray-200 py-4">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {usps.map((usp, index) => {
                        const Icon = usp.icon;
                        return (
                            <div key={index} className="flex items-center gap-3">
                                <Icon size={32} className="text-[#FFB700] flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="font-semibold text-sm text-[#2C3E50]">{usp.title}</p>
                                    <p className="text-xs text-gray-600">{usp.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default USPStrip;
