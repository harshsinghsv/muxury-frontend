import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { products, categories } from "@/data/products";

const ITEMS_PER_PAGE = 8;

const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get filter values from URL
    const selectedCategory = searchParams.get("category") || "";
    const sortBy = searchParams.get("sort") || "newest";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 10000;
    const currentPage = Number(searchParams.get("page")) || 1;

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Category filter
        if (selectedCategory) {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Price filter
        result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

        // Sorting
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
            default:
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
        }

        return result;
    }, [selectedCategory, sortBy, minPrice, maxPrice]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const updateFilter = (key: string, value: string | number) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, String(value));
        } else {
            newParams.delete(key);
        }
        if (key !== "page") {
            newParams.set("page", "1");
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    const hasActiveFilters = selectedCategory || minPrice > 0 || maxPrice < 10000;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                {/* Page header */}
                <div className="text-center mb-10">
                    <p className="text-sm tracking-luxury uppercase text-gold mb-2">
                        Our Collection
                    </p>
                    <h1 className="font-display text-3xl lg:text-4xl font-medium text-foreground">
                        Shop All
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-lg">Filters</h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gold hover:underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Category filter */}
                            <div>
                                <h3 className="font-medium mb-3">Category</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat.slug}
                                                onChange={() =>
                                                    updateFilter("category", selectedCategory === cat.slug ? "" : cat.slug)
                                                }
                                                className="w-4 h-4 text-gold focus:ring-gold"
                                            />
                                            <span className="text-sm">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price range */}
                            <div>
                                <h3 className="font-medium mb-3">Price Range</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice || ""}
                                            onChange={(e) => updateFilter("minPrice", e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice < 10000 ? maxPrice : ""}
                                            onChange={(e) => updateFilter("maxPrice", e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile filter button */}
                    <div className="lg:hidden flex items-center justify-between mb-4">
                        <button
                            onClick={() => setFiltersOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-border rounded-md"
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                            {hasActiveFilters && (
                                <span className="w-5 h-5 bg-gold text-charcoal text-xs rounded-full flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </button>

                        {/* Sort dropdown */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => updateFilter("sort", e.target.value)}
                                className="appearance-none px-4 py-2 pr-8 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Mobile filters modal */}
                    {filtersOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
                            <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-semibold text-lg">Filters</h2>
                                    <button onClick={() => setFiltersOpen(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Category filter */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-3">Category</h3>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category-mobile"
                                                    checked={selectedCategory === cat.slug}
                                                    onChange={() => updateFilter("category", selectedCategory === cat.slug ? "" : cat.slug)}
                                                    className="w-4 h-4 text-gold focus:ring-gold"
                                                />
                                                <span className="text-sm">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price range */}
                                <div className="mb-6">
                                    <h3 className="font-medium mb-3">Price Range</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice || ""}
                                            onChange={(e) => updateFilter("minPrice", e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice < 10000 ? maxPrice : ""}
                                            onChange={(e) => updateFilter("maxPrice", e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 py-2 border border-border rounded-md"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => setFiltersOpen(false)}
                                        className="flex-1 py-2 bg-charcoal text-cream rounded-md"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products grid */}
                    <div className="flex-1">
                        {/* Desktop sort & results count */}
                        <div className="hidden lg:flex items-center justify-between mb-6">
                            <p className="text-muted-foreground">
                                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => updateFilter("sort", e.target.value)}
                                    className="px-3 py-1.5 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Products */}
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : paginatedProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        <button
                                            onClick={() => updateFilter("page", currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => updateFilter("page", i + 1)}
                                                className={`w-10 h-10 rounded-md transition-colors ${currentPage === i + 1
                                                        ? "bg-charcoal text-cream"
                                                        : "border border-border hover:bg-muted"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => updateFilter("page", currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
                                <button
                                    onClick={clearFilters}
                                    className="text-gold hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Shop;
