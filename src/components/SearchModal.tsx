import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { products } from "@/data/products";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const popularSearches = ["Dresses", "Bags", "Suits", "Evening Gown", "Accessories"];

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, [isOpen]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const filteredProducts = query.trim().length >= 2
        ? products.filter(
            (p) =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
        : [];

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) return;

        // Save to recent searches
        const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));

        // Navigate to shop with search
        onClose();
        navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    };

    const handleProductClick = (productId: string, productName: string) => {
        // Save to recent
        const updated = [productName, ...recentSearches.filter((s) => s !== productName)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));

        onClose();
        navigate(`/product/${productId}`);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-md animate-fade-in" />

            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-auto mt-20 bg-background rounded-xl shadow-2xl animate-fade-in-down overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                    <Search size={20} className="text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                        placeholder="Search for products, categories..."
                        className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ESC
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.length >= 2 ? (
                        /* Search results */
                        <div className="p-4">
                            {filteredProducts.length > 0 ? (
                                <>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {filteredProducts.length} results for "{query}"
                                    </p>
                                    <div className="space-y-2">
                                        {filteredProducts.map((product, index) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleProductClick(product.id, product.name)}
                                                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors animate-fade-in-up group"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <div className="w-14 h-16 rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-medium group-hover:text-gold transition-colors">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">${product.price.toLocaleString()}</p>
                                                    {product.originalPrice && (
                                                        <p className="text-sm text-muted-foreground line-through">
                                                            ${product.originalPrice.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <ArrowRight size={16} className="text-muted-foreground group-hover:text-gold transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleSearch(query)}
                                        className="w-full mt-4 py-3 text-center text-gold hover:underline"
                                    >
                                        View all results for "{query}"
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No results found for "{query}"</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Try a different search term
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Default state */
                        <div className="p-4 space-y-6">
                            {/* Recent searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock size={14} />
                                            Recent Searches
                                        </div>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-gold hover:underline"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search) => (
                                            <button
                                                key={search}
                                                onClick={() => {
                                                    setQuery(search);
                                                    handleSearch(search);
                                                }}
                                                className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-gold hover:text-charcoal transition-colors"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular searches */}
                            <div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <TrendingUp size={14} />
                                    Popular Searches
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((search) => (
                                        <button
                                            key={search}
                                            onClick={() => {
                                                setQuery(search);
                                                handleSearch(search);
                                            }}
                                            className="px-4 py-2 border border-border rounded-full text-sm hover:border-gold hover:text-gold transition-colors"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick links */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-3">Quick Links</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {["New Arrivals", "Best Sellers", "Sale", "Collections"].map((link) => (
                                        <button
                                            key={link}
                                            onClick={() => {
                                                onClose();
                                                navigate("/shop");
                                            }}
                                            className="p-3 text-left text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                                        >
                                            {link}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
