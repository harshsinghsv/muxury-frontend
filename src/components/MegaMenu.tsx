import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Product } from "@/data/products";

interface MegaMenuProps {
    isOpen: boolean;
    activeCategory: string | null;
    onClose: () => void;
    featuredProduct?: Product;
}

const MegaMenu = ({ isOpen, activeCategory, onClose, featuredProduct }: MegaMenuProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute top-full left-0 w-full bg-background border-t border-border shadow-2xl z-40 animate-fade-in-down origin-top"
            onMouseLeave={onClose}
        >
            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Main Categories */}
                    <div className="col-span-3 border-r border-border pr-6">
                        <h3 className="font-display text-lg font-medium mb-4 text-primary">Shop</h3>
                        <ul className="space-y-3">
                            {[
                                { name: "New Arrivals", href: "/shop?filter=new", isNew: true },
                                { name: "Best Sellers", href: "/shop?sort=rating" },
                                { name: "Clothing", href: "/shop?category=clothing" },
                                { name: "Dresses", href: "/shop?category=women" },
                                { name: "Suiting", href: "/shop?category=men" },
                                { name: "Accessories", href: "/shop?category=accessories" },
                                { name: "Sale", href: "/shop?filter=sale", isSale: true },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        onClick={onClose}
                                        className={`group flex items-center justify-between text-sm transition-colors ${item.isSale ? "text-destructive font-medium" : "text-muted-foreground hover:text-primary"
                                            }`}
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                                        {item.isNew && (
                                            <span className="text-[10px] font-bold uppercase text-gold bg-gold/10 px-1.5 py-0.5 rounded">New</span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Link
                                to="/shop"
                                onClick={onClose}
                                className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
                            >
                                View All Products <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Sub-categories / Collections */}
                    <div className="col-span-5 px-6">
                        <h3 className="font-display text-lg font-medium mb-4 text-primary">Collections</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Occasion</h4>
                                <ul className="space-y-2">
                                    {["Evening Wear", "Workwear", "Vacation", "Weekend"].map((item) => (
                                        <li key={item}>
                                            <Link to="/shop" onClick={onClose} className="text-sm text-foreground/80 hover:text-gold transition-colors">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Trending</h4>
                                <ul className="space-y-2">
                                    {["Quiet Luxury", "Monochrome", "Sustainable", "Gift Guide"].map((item) => (
                                        <li key={item}>
                                            <Link to="/shop" onClick={onClose} className="text-sm text-foreground/80 hover:text-gold transition-colors">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Featured Visual */}
                    <div className="col-span-4 pl-6 border-l border-border">
                        <Link to="/shop?filter=new" onClick={onClose} className="group block relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                            {/* Fallback image if featuredProduct not provided */}
                            <img
                                src={featuredProduct?.images[0] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"}
                                alt="Featured Collection"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent p-6 flex flex-col justify-end">
                                <span className="text-xs font-bold uppercase tracking-wider text-gold mb-1">Editor's Pick</span>
                                <h4 className="font-display text-xl text-cream mb-2">The Summer Edit</h4>
                                <span className="text-sm text-cream/90 underline decoration-gold underline-offset-4 group-hover:text-gold transition-colors">
                                    Shop the Look
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
