import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

interface CompleteTheLookProps {
    products: Product[];
    title?: string;
    onQuickView?: (product: Product) => void;
}

const CompleteTheLook = ({
    products,
    title = "Complete the Look",
    onQuickView
}: CompleteTheLookProps) => {
    if (products.length === 0) return null;

    return (
        <section className="py-10 lg:py-14 bg-gradient-to-b from-cream-dark to-background">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-gold" size={20} />
                        <div>
                            <h2 className="font-display text-xl lg:text-2xl font-medium">
                                {title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Items that pair perfectly together
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/shop"
                        className="text-sm text-gold hover:underline flex items-center gap-1"
                    >
                        View All
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {products.slice(0, 3).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onQuickView={onQuickView}
                        />
                    ))}
                </div>

                {/* Bundle CTA */}
                <div className="mt-8 p-6 bg-charcoal rounded-xl text-center">
                    <p className="text-cream/80 text-sm mb-2">Buy all items together</p>
                    <p className="text-gold font-display text-2xl mb-4">
                        Save 15% on the bundle
                    </p>
                    <button className="px-6 py-2.5 bg-gold text-charcoal font-medium rounded hover:bg-gold-light transition-colors">
                        Add Bundle to Cart
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CompleteTheLook;
