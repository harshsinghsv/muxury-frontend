import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { products, Product } from "@/data/products";

const CATEGORIES = ["All", "Outerwear", "Accessories", "Men's Fashion", "Women's Fashion"];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Active category
    const categoryQuery = searchParams.get("category");
    const activeCategory = categoryQuery
        ? CATEGORIES.find(c => c.toLowerCase() === categoryQuery.toLowerCase()) || "All"
        : "All";

    // Apply filters
    let filteredProducts = products;
    if (activeCategory !== "All") {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    const handleCategoryClick = (cat: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (cat === "All") {
            newParams.delete("category");
        } else {
            newParams.set("category", cat.toLowerCase());
        }
        setSearchParams(newParams);
    };

    return (
        <div className="pb-24">
            {/* Header & Sticky Filter Bar */}
            <div className="bg-[#FAFAFA] pt-2 pb-3 mb-2 px-5 sticky top-[68px] z-20">
                {/* Search / Filter Row */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full h-14 px-12 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm font-['DM_Sans'] focus:outline-none focus:border-[#CA8385] transition-colors"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#343434]"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 snap-x">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`snap-start px-5 py-2.5 rounded-full font-['DM_Sans'] text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                ? "bg-[#CA8385] text-white"
                                : "bg-white border border-[#EBEBEB] text-[#343434]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <main className="px-5">
                <div className="flex items-center justify-between font-['DM_Sans'] text-xs font-bold tracking-widest uppercase text-[#343434] mb-4">
                    <h2>Products ({filteredProducts.length})</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">No items found</h2>
                        <p className="font-['DM_Sans'] text-sm text-[#999999] mb-6">Try adjusting your filters.</p>
                        <button
                            onClick={() => handleCategoryClick("All")}
                            className="bg-[#343434] text-white font-['DM_Sans'] text-sm font-medium px-6 py-3 rounded-full"
                        >
                            View All Collection
                        </button>
                    </div>
                )}
            </main>

            {/* Filter Bottom Sheet (Muxury strict pattern) */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/20" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white rounded-t-3xl p-6 transition-transform">
                        <div className="w-10 h-1 bg-[#EBEBEB] rounded-full mx-auto mb-4" />
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-['Playfair_Display'] text-xl font-medium text-[#343434]">Filter</h2>
                            <button onClick={() => setIsFilterOpen(false)}>
                                {/* Filter close empty or × icon */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3">Sort By</p>
                        {/* Fake sort options for visual */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['Recommended', 'Newest', 'Lowest Price'].map(opt => (
                                <button key={opt} className="px-4 py-2 border border-[#EBEBEB] rounded-full font-['DM_Sans'] text-sm text-[#343434]">{opt}</button>
                            ))}
                        </div>

                        <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3">Price Range</p>
                        {/* Fake slider */}
                        <div className="w-full h-1 bg-[#EBEBEB] rounded-full relative mb-8 mt-4">
                            <div className="absolute left-1/4 right-1/4 h-full bg-[#CA8385] rounded-full">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#CA8385] rounded-full shadow-sm" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-[#CA8385] rounded-full shadow-sm" />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 h-14 border border-[#343434] rounded-full font-['DM_Sans'] font-medium text-[#343434] active:scale-95 transition-transform" onClick={() => setIsFilterOpen(false)}>Reset</button>
                            <button className="flex-1 h-14 bg-[#343434] rounded-full font-['DM_Sans'] font-medium text-white active:scale-95 transition-transform" onClick={() => setIsFilterOpen(false)}>Apply</button>
                        </div>
                    </div>
                </div>
            )}

            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </div>
    );
};

export default Shop;
