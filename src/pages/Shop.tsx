import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/data/products";
import ProductSkeleton from "@/components/ProductSkeleton";
import { COPY } from "@/config/constants";
import Icon from "@/components/Icon";

const PAGE_SIZE = 8;

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Active Params
    const categoryQuery = searchParams.get("category");
    const activeCategory = categoryQuery
        ? COPY.shop.categories.find(c => c.toLowerCase() === categoryQuery.toLowerCase()) || "All"
        : "All";

    const searchQuery = searchParams.get("search") || "";
    const sortQuery = searchParams.get("sort") || "Recommended";
    const ratingQuery = searchParams.get("minRating");
    const minRating = ratingQuery ? parseFloat(ratingQuery) : 0;

    const { data: productsData, isLoading, error } = useProducts({
        category: categoryQuery !== "All" && categoryQuery ? categoryQuery : undefined
    });

    const baseProducts = productsData || [];

    // Local Filtering & Sorting
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...baseProducts];

        // 1. Search Query
        if (searchQuery) {
            const sq = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(sq) || 
                p.description.toLowerCase().includes(sq) ||
                p.category.toLowerCase().includes(sq)
            );
        }

        // 2. Rating Filter
        if (minRating > 0) {
            result = result.filter(p => p.rating >= minRating);
        }

        // 3. Sorting
        if (sortQuery === 'Lowest Price') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortQuery === 'Highest Price') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortQuery === 'Newest') {
            result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        }

        return result;
    }, [baseProducts, searchQuery, minRating, sortQuery]);

    const visibleProducts = filteredAndSortedProducts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAndSortedProducts.length;

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [categoryQuery, searchQuery, sortQuery, ratingQuery]);

    const handleParamChange = (key: string, value: string | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === null || value === "All") {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeFilterChip = (type: 'category' | 'search' | 'rating') => {
        if (type === 'category') handleParamChange('category', null);
        if (type === 'search') handleParamChange('search', null);
        if (type === 'rating') handleParamChange('minRating', null);
    };

    return (
        <div className="pb-24 md:flex md:gap-8 md:px-12 lg:px-24 xl:px-32 md:pt-12 min-h-screen">

            {/* Desktop Sidebar Filter */}
            <aside className="hidden md:block w-64 flex-shrink-0 animate-fade-in">
                <div className="sticky top-[100px]">
                    <div className="mb-8">
                        <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-4">Categories</h3>
                        <div className="flex flex-col gap-2">
                            {COPY.shop.categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleParamChange('category', cat)}
                                    className={`text-left font-['DM_Sans'] text-sm hover:text-[#CA8385] transition-colors min-h-[40px] flex items-center ${activeCategory === cat ? "text-[#CA8385] font-bold" : "text-[#343434]"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-4">{COPY.shop.filters.sortBy}</h3>
                        <div className="flex flex-col gap-3">
                            {COPY.shop.sortOptions.map(opt => (
                                <label key={opt} onClick={() => handleParamChange('sort', opt === 'Recommended' ? null : opt)} className="flex items-center gap-3 cursor-pointer group min-h-[30px]">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${sortQuery === opt ? 'border-[#CA8385]' : 'border-[#EBEBEB] group-hover:border-[#CA8385]'}`}>
                                        {sortQuery === opt && <div className="w-2 h-2 rounded-full bg-[#CA8385]" />}
                                    </div>
                                    <span className={`font-['DM_Sans'] text-sm transition-colors ${sortQuery === opt ? 'text-[#CA8385] font-bold' : 'text-[#343434] group-hover:text-[#CA8385]'}`}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-4">Rating</h3>
                        <div className="flex flex-col gap-3">
                            {[4, 3, 2].map(rating => (
                                <label key={rating} onClick={() => handleParamChange('minRating', rating.toString())} className="flex items-center gap-3 cursor-pointer group min-h-[30px]">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${minRating === rating ? 'border-[#CA8385] bg-[#CA8385]' : 'border-[#EBEBEB] group-hover:border-[#CA8385]'}`}>
                                        {minRating === rating && <Icon name="close" size="w-3 h-3" color="white" />}
                                    </div>
                                    <span className={`font-['DM_Sans'] text-sm flex items-center transition-colors ${minRating === rating ? 'text-[#CA8385] font-bold' : 'text-[#343434]'}`}>
                                        {rating} Stars & Up
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                {/* Mobile Filter & Categories Header */}
                <div className="md:hidden bg-[#FAFAFA] pb-3 mb-2 px-5 sticky top-0 z-20 pt-1 -mt-2 shadow-sm">
                    {/* Search Mock Bar row for Mobile */}
                    <div className="mb-4 pt-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={searchQuery || ""}
                                placeholder={COPY.shop.searchPlaceholder}
                                onClick={() => setIsFilterOpen(true)}
                                className="flex-1 h-12 px-5 rounded-2xl border border-[#EBEBEB] bg-white text-[#343434] placeholder-[#999999] text-sm font-['DM_Sans'] focus:outline-none"
                            />
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="w-12 h-12 flex items-center justify-center bg-white border border-[#EBEBEB] rounded-2xl text-[#343434]"
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

                    {/* Category Pills Mobile */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 snap-x">
                        {COPY.shop.categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleParamChange('category', cat)}
                                className={`snap-start px-5 py-2.5 min-h-[44px] rounded-full font-['DM_Sans'] text-sm font-medium whitespace-nowrap transition-all focus:outline-none ${activeCategory === cat
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
                <main className="px-5 md:px-0">
                    <div className="flex flex-col gap-4 mb-4 md:mb-6">
                        <div className="flex items-center justify-between font-['DM_Sans'] text-sm md:text-base font-bold text-[#343434]">
                            <h2>{activeCategory === "All" ? COPY.shop.allProducts : activeCategory} ({filteredAndSortedProducts.length})</h2>
                        </div>
                        
                        {/* Active Filter Chips */}
                        {(searchQuery || categoryQuery || minRating > 0) && (
                            <div className="flex flex-wrap gap-2 animate-fade-in">
                                {searchQuery && (
                                    <div className="flex items-center gap-2 bg-[#FAF8F7] border border-[#CA8385]/30 px-3 py-1.5 rounded-full">
                                        <span className="font-['DM_Sans'] text-xs text-[#343434]">Search: <span className="font-bold">"{searchQuery}"</span></span>
                                        <button onClick={() => removeFilterChip('search')} className="text-[#CA8385] hover:text-[#EF5050]"><Icon name="close" size="w-3 h-3" /></button>
                                    </div>
                                )}
                                {categoryQuery && categoryQuery !== "All" && (
                                    <div className="flex items-center gap-2 bg-[#FAF8F7] border border-[#CA8385]/30 px-3 py-1.5 rounded-full">
                                        <span className="font-['DM_Sans'] text-xs text-[#343434]">Category: <span className="font-bold">{activeCategory}</span></span>
                                        <button onClick={() => removeFilterChip('category')} className="text-[#CA8385] hover:text-[#EF5050]"><Icon name="close" size="w-3 h-3" /></button>
                                    </div>
                                )}
                                {minRating > 0 && (
                                    <div className="flex items-center gap-2 bg-[#FAF8F7] border border-[#CA8385]/30 px-3 py-1.5 rounded-full">
                                        <span className="font-['DM_Sans'] text-xs text-[#343434]">Rating: <span className="font-bold">{minRating}★ +</span></span>
                                        <button onClick={() => removeFilterChip('rating')} className="text-[#CA8385] hover:text-[#EF5050]"><Icon name="close" size="w-3 h-3" /></button>
                                    </div>
                                )}
                                <button onClick={() => setSearchParams(new URLSearchParams())} className="font-['DM_Sans'] text-xs text-[#999999] hover:underline ml-2">Clear all</button>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">Failed to load products. Please try again.</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                {visibleProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            
                            {/* Pagination / Load More */}
                            {hasMore && (
                                <div className="mt-12 flex justify-center">
                                    <button 
                                        onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                                        className="px-8 py-4 bg-white border border-[#343434] text-[#343434] font-['DM_Sans'] font-bold rounded-full hover:bg-[#343434] hover:text-white transition-colors"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {filteredAndSortedProducts.length === 0 && !isLoading && (
                        <div className="text-center py-20 bg-white md:bg-transparent rounded-3xl md:border md:border-[#EBEBEB] mt-8 animate-fade-in">
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">{COPY.shop.emptyState.title}</h2>
                            <p className="font-['DM_Sans'] text-sm text-[#999999] mb-6">{COPY.shop.emptyState.description}</p>
                            <button
                                onClick={() => setSearchParams(new URLSearchParams())}
                                className="bg-[#343434] text-white font-['DM_Sans'] text-sm font-medium px-6 py-3 min-h-[44px] rounded-full hover:bg-black transition-colors"
                            >
                                {COPY.shop.emptyState.cta}
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Bottom Sheet */}
            {isFilterOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white rounded-t-3xl p-6 transition-transform animate-slide-up h-[85vh] flex flex-col">
                        <div className="w-10 h-1 bg-[#EBEBEB] rounded-full mx-auto mb-4 shrink-0" />
                        <div className="flex items-center justify-between mb-5 shrink-0">
                            <h2 className="font-['Playfair_Display'] text-xl font-medium text-[#343434]">{COPY.shop.filters.title}</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="w-11 h-11 flex items-center justify-center rounded-full active:bg-[#F5F5F5] transition-colors">
                                <Icon name="close" size="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-8">
                            <div>
                                <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3">{COPY.shop.filters.sortBy}</p>
                                <div className="flex flex-col gap-2">
                                    {COPY.shop.sortOptions.map(opt => (
                                        <button 
                                            key={opt} 
                                            onClick={() => handleParamChange('sort', opt === 'Recommended' ? null : opt)}
                                            className={`w-full text-left px-5 py-4 rounded-xl border font-['DM_Sans'] text-sm transition-colors ${sortQuery === opt ? 'border-[#CA8385] bg-[#FAF8F7] text-[#CA8385] font-bold' : 'border-[#EBEBEB] text-[#343434]'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3">Minimum Rating</p>
                                <div className="flex gap-2">
                                    {[4, 3, 2].map(rating => (
                                        <button 
                                            key={rating} 
                                            onClick={() => handleParamChange('minRating', rating.toString())}
                                            className={`flex-1 py-3 rounded-xl border font-['DM_Sans'] text-sm transition-colors ${minRating === rating ? 'border-[#CA8385] bg-[#CA8385] text-white font-bold' : 'border-[#EBEBEB] text-[#343434]'}`}
                                        >
                                            {rating}★ +
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 shrink-0 pt-4 border-t border-[#EBEBEB]">
                            <button className="flex-1 h-14 border border-[#343434] rounded-full font-['DM_Sans'] font-medium text-[#343434] active:bg-[#F5F5F5] transition-all" onClick={() => { setSearchParams(new URLSearchParams()); setIsFilterOpen(false); }}>{COPY.shop.filters.reset}</button>
                            <button className="flex-1 h-14 bg-[#343434] rounded-full font-['DM_Sans'] font-medium text-white active:bg-black transition-all" onClick={() => setIsFilterOpen(false)}>{COPY.shop.filters.apply}</button>
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
