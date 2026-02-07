import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const TrendingSection = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Get products sorted by rating (simulating trending)
    const trendingProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-16 lg:py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <Flame className="text-gold" size={24} />
                        <div>
                            <p className="text-sm tracking-luxury uppercase text-gold mb-1">
                                What's Hot
                            </p>
                            <h2 className="font-display text-2xl lg:text-3xl font-medium">
                                Trending Now
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/shop"
                            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-gold transition-colors"
                        >
                            View All
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll("left")}
                                disabled={!canScrollLeft}
                                className="p-2 border border-border rounded-full hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                disabled={!canScrollRight}
                                className="p-2 border border-border rounded-full hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable products */}
                <div className="relative">
                    {/* Gradient fade left */}
                    {canScrollLeft && (
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    )}

                    {/* Gradient fade right */}
                    {canScrollRight && (
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                    )}

                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    >
                        {trendingProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="flex-shrink-0 w-[280px] animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;
