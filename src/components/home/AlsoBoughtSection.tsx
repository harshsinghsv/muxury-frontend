import { Link } from "react-router-dom";
import { Users, TrendingUp, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

interface AlsoBoughtSectionProps {
    products: Product[];
    onQuickView?: (product: Product) => void;
}

const AlsoBoughtSection = ({ products, onQuickView }: AlsoBoughtSectionProps) => {
    if (products.length === 0) return null;

    return (
        <section className="py-10 lg:py-14 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold/10 rounded-full">
                            <Users className="text-gold" size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-xl lg:text-2xl font-medium">
                                Customers Also Bought
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Popular pairings from our community
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/shop"
                        className="hidden sm:flex items-center gap-1 text-sm text-gold hover:underline"
                    >
                        Explore More
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Social proof banner */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">847 customers</span> bought these together this week
                    </span>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onQuickView={onQuickView}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AlsoBoughtSection;
