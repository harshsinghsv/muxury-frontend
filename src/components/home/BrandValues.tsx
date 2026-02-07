import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const values = [
    {
        icon: Truck,
        title: "Free Shipping",
        description: "Complimentary delivery on orders over $100",
    },
    {
        icon: Shield,
        title: "Secure Payment",
        description: "Your transactions are protected",
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        description: "30-day hassle-free return policy",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "We're here whenever you need us",
    },
];

const BrandValues = () => {
    return (
        <section className="py-16 lg:py-20 bg-charcoal text-cream">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div
                                key={value.title}
                                className="text-center p-6 group animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors">
                                    <Icon size={24} className="text-gold" />
                                </div>
                                <h3 className="font-display text-lg font-medium mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-sm text-cream/70">{value.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BrandValues;
