import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const dealProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 10);

const DealsSection = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-20 bg-[#0F0F0F]">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2
                            className="font-light mb-3 text-white"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "48px",
                                letterSpacing: "0.02em"
                            }}
                        >
                            Exclusive Offers
                        </h2>
                        <div className="bg-[#C9A961]" style={{ width: "80px", height: "2px" }} />
                    </div>
                    <Link
                        to="/shop?filter=sale"
                        className="flex items-center gap-2 text-[#C9A961] hover:text-[#D4AF77] transition-colors font-medium uppercase tracking-wider"
                        style={{ fontSize: "13px" }}
                    >
                        View All Deals <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="relative">
                    {/* Scroll Buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#C9A961] hover:bg-[#D4AF77] text-[#1A1A1A] transition-all duration-300 shadow-lg"
                        aria-label="Scroll left"
                        style={{ borderRadius: "0px" }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#C9A961] hover:bg-[#D4AF77] text-[#1A1A1A] transition-all duration-300 shadow-lg"
                        aria-label="Scroll right"
                        style={{ borderRadius: "0px" }}
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Scrollable Container with Product Cards */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {dealProducts.map((product) => (
                            <div key={product.id} className="flex-shrink-0" style={{ width: "280px" }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealsSection;
