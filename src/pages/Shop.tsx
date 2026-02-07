import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Grid3x3, List, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { products, Product } from "@/data/products";

const Shop = () => {
    const [searchParams] = useSearchParams();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("relevance");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const category = searchParams.get("category");
    const filter = searchParams.get("filter");

    // Filter products based on URL params
    let filteredProducts = products;
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (filter === "sale") {
        filteredProducts = filteredProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    if (filter === "new") {
        filteredProducts = filteredProducts.filter(p => p.isNew);
    }

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const handleFilterChange = (filters: any) => {
        console.log("Filters applied:", filters);
        // Apply filters logic here
    };

    return (
        <div className="min-h-screen pb-16 md:pb-0 bg-[#1A1A1A]">
            <Header />

            <main className="container mx-auto px-4 lg:px-6 py-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-[#FFB700]">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/shop" className="hover:text-[#FFB700]">Shop</Link>
                    {category && (
                        <>
                            <ChevronRight size={14} />
                            <span className="text-gray-900 font-medium capitalize">{category}</span>
                        </>
                    )}
                </nav>

                <div className="flex gap-6">
                    {/* Filter Sidebar - 25% */}
                    <aside className="hidden lg:block w-1/4 flex-shrink-0">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </aside>

                    {/* Main Content - 75% */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="bg-white border border-gray-200 p-4 mb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                                        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "All Products"}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} results
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Mobile Filter Button */}
                                    <button
                                        onClick={() => setMobileFiltersOpen(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50"
                                    >
                                        <SlidersHorizontal size={16} />
                                        Filters
                                    </button>

                                    {/* Sort */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="text-sm border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#FFB700]"
                                        >
                                            <option value="relevance">Relevance</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="newest">Newest First</option>
                                            <option value="discount">Discount</option>
                                            <option value="rating">Customer Rating</option>
                                        </select>
                                    </div>

                                    {/* View Toggle */}
                                    <div className="hidden md:flex items-center gap-1 border border-gray-300 rounded-sm">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                        >
                                            <Grid3x3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                        >
                                            <List size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className={`grid gap-3 mb-6 ${viewMode === "grid"
                            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            : "grid-cols-1"
                            }`}>
                            {currentProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onQuickView={setQuickViewProduct}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="bg-white border border-gray-200 p-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                {/* Items per page */}
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600">Show:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(parseInt(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border border-gray-300 rounded-sm px-3 py-1.5 focus:outline-none focus:border-[#FFB700]"
                                    >
                                        <option value="24">24</option>
                                        <option value="48">48</option>
                                        <option value="96">96</option>
                                    </select>
                                    <span className="text-gray-600">per page</span>
                                </div>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-10 h-10 rounded-sm text-sm font-medium transition-colors ${currentPage === pageNum
                                                        ? "bg-[#FFB700] text-gray-900"
                                                        : "border border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        {totalPages > 5 && <span className="px-2">...</span>}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </div>
    );
};

export default Shop;
