import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { Product } from "@/data/products";

interface RecentlyViewedSectionProps {
    onQuickView?: (product: Product) => void;
}

const RecentlyViewedSection = ({ onQuickView }: RecentlyViewedSectionProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Don't render if no items
    if (recentlyViewed.length === 0) return null;

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.6;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-10 lg:py-14 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clock className="text-gold" size={20} />
                        <div>
                            <h2 className="font-display text-xl lg:text-2xl font-medium">
                                Recently Viewed
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Pick up where you left off
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearRecentlyViewed}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            <X size={12} />
                            Clear
                        </button>
                        <div className="hidden sm:flex gap-1">
                            <button
                                onClick={() => scroll("left")}
                                disabled={!canScrollLeft}
                                className="p-1.5 border border-border rounded-full hover:border-gold hover:text-gold transition-colors disabled:opacity-30"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                disabled={!canScrollRight}
                                className="p-1.5 border border-border rounded-full hover:border-gold hover:text-gold transition-colors disabled:opacity-30"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable products */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    >
                        {recentlyViewed.map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-[200px] lg:w-[240px]">
                                <ProductCard product={product} onQuickView={onQuickView} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewedSection;
