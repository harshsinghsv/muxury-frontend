import { useState } from "react";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { Star } from "lucide-react";

interface FilterSidebarProps {
    onFilterChange: (filters: any) => void;
}

const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        brand: true,
        size: true,
        color: true,
        discount: true,
        rating: true,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        categories: [] as string[],
        priceRange: [0, 1000],
        brands: [] as string[],
        sizes: [] as string[],
        colors: [] as string[],
        minDiscount: 0,
        minRating: 0,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheckboxChange = (filterType: string, value: string) => {
        setSelectedFilters(prev => {
            const key = filterType as keyof typeof prev;
            const currentValues = prev[key] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [key]: newValues };
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            categories: [],
            priceRange: [0, 1000],
            brands: [],
            sizes: [],
            colors: [],
            minDiscount: 0,
            minRating: 0,
        });
    };

    const applyFilters = () => {
        onFilterChange(selectedFilters);
    };

    const FilterSection = ({ title, section, children }: any) => (
        <div className="border-b border-white/10 py-5">
            <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full text-left group"
            >
                <h3
                    className="font-light text-sm text-white uppercase tracking-widest group-hover:text-[#C9A961] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {title}
                </h3>
                {expandedSections[section as keyof typeof expandedSections] ? (
                    <ChevronUp size={14} className="text-[#C9A961]" />
                ) : (
                    <ChevronDown size={14} className="text-gray-500" />
                )}
            </button>
            {expandedSections[section as keyof typeof expandedSections] && (
                <div className="mt-4">{children}</div>
            )}
        </div>
    );

    return (
        <div className="bg-[#0F0F0F] border border-white/10 p-6 sticky top-20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal size={18} className="text-[#C9A961]" />
                    <h2
                        className="font-light text-lg text-white"
                        style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.02em" }}
                    >
                        Filters
                    </h2>
                </div>
                <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#C9A961] hover:text-[#D4AF77] font-medium uppercase tracking-wider transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Active Filters */}
            {(selectedFilters.categories.length > 0 || selectedFilters.brands.length > 0 || selectedFilters.sizes.length > 0 || selectedFilters.colors.length > 0) && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {[...selectedFilters.categories, ...selectedFilters.brands, ...selectedFilters.sizes, ...selectedFilters.colors].map((filter) => (
                        <span
                            key={filter}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C9A961]/10 border border-[#C9A961]/30 text-[#C9A961] text-xs"
                        >
                            {filter}
                            <button
                                onClick={() => { }}
                                className="hover:text-white transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Category */}
            <FilterSection title="Category" section="category">
                <div className="space-y-3">
                    {["Women", "Men", "Kids", "Accessories"].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedFilters.categories.includes(cat)}
                                onChange={() => handleCheckboxChange("categories", cat)}
                                className="w-4 h-4 accent-[#C9A961] bg-transparent border border-gray-600 rounded-none"
                            />
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" section="price">
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={selectedFilters.priceRange[1]}
                        onChange={(e) =>
                            setSelectedFilters(prev => ({
                                ...prev,
                                priceRange: [0, parseInt(e.target.value)],
                            }))
                        }
                        className="w-full accent-[#C9A961] bg-transparent"
                    />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#C9A961] font-medium">₹{selectedFilters.priceRange[0]}</span>
                        <span className="text-gray-500">—</span>
                        <span className="text-[#C9A961] font-medium">₹{selectedFilters.priceRange[1]}</span>
                    </div>
                    <div className="pt-2">
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={selectedFilters.priceRange[0]}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]] }))}
                                className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A961]"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={selectedFilters.priceRange[1]}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value) || 1000] }))}
                                className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A961]"
                            />
                        </div>
                    </div>
                </div>
            </FilterSection>

            {/* Brand */}
            <FilterSection title="Brand" section="brand">
                <div className="space-y-3">
                    {["Nike", "Adidas", "Puma", "Zara", "H&M", "Levi's"].map((brand) => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedFilters.brands.includes(brand)}
                                onChange={() => handleCheckboxChange("brands", brand)}
                                className="w-4 h-4 accent-[#C9A961] bg-transparent border border-gray-600 rounded-none"
                            />
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{brand}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Size */}
            <FilterSection title="Size" section="size">
                <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <button
                            key={size}
                            onClick={() => handleCheckboxChange("sizes", size)}
                            className={`px-4 py-2 border text-sm font-medium transition-all duration-300 ${selectedFilters.sizes.includes(size)
                                    ? "border-[#C9A961] bg-[#C9A961] text-[#0F0F0F]"
                                    : "border-white/20 text-gray-400 hover:border-[#C9A961] hover:text-white"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Color */}
            <FilterSection title="Color" section="color">
                <div className="flex flex-wrap gap-3">
                    {[
                        { name: "Black", hex: "#000000" },
                        { name: "White", hex: "#FFFFFF" },
                        { name: "Red", hex: "#EF4444" },
                        { name: "Blue", hex: "#3B82F6" },
                        { name: "Green", hex: "#10B981" },
                        { name: "Yellow", hex: "#F59E0B" },
                    ].map((color) => (
                        <button
                            key={color.name}
                            onClick={() => handleCheckboxChange("colors", color.name)}
                            className={`w-9 h-9 transition-all duration-300 ${selectedFilters.colors.includes(color.name)
                                    ? "ring-2 ring-[#C9A961] ring-offset-2 ring-offset-[#0F0F0F] scale-110"
                                    : "hover:scale-110"
                                }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Discount */}
            <FilterSection title="Discount" section="discount">
                <div className="space-y-3">
                    {[10, 20, 30, 40, 50].map((discount) => (
                        <label key={discount} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="discount"
                                checked={selectedFilters.minDiscount === discount}
                                onChange={() => setSelectedFilters(prev => ({ ...prev, minDiscount: discount }))}
                                className="w-4 h-4 accent-[#C9A961] bg-transparent border border-gray-600 rounded-none"
                            />
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{discount}% and above</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Customer Rating */}
            <FilterSection title="Customer Rating" section="rating">
                <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                checked={selectedFilters.minRating === rating}
                                onChange={() => setSelectedFilters(prev => ({ ...prev, minRating: rating }))}
                                className="w-4 h-4 accent-[#C9A961] bg-transparent border border-gray-600 rounded-none"
                            />
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < rating ? "fill-[#C9A961] text-[#C9A961]" : "text-gray-600"}
                                    />
                                ))}
                                <span className="text-sm text-gray-400 group-hover:text-white ml-1 transition-colors">& above</span>
                            </div>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Apply Button */}
            <button
                onClick={applyFilters}
                className="w-full mt-6 py-4 bg-[#C9A961] hover:bg-[#D4AF77] text-[#0F0F0F] font-semibold uppercase tracking-wider text-sm transition-colors duration-300"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                Apply Filters
            </button>
        </div>
    );
};

export default FilterSidebar;
