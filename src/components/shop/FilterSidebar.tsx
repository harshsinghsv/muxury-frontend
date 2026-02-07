import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
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
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full text-left"
            >
                <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">{title}</h3>
                {expandedSections[section as keyof typeof expandedSections] ? (
                    <ChevronUp size={16} />
                ) : (
                    <ChevronDown size={16} />
                )}
            </button>
            {expandedSections[section as keyof typeof expandedSections] && (
                <div className="mt-3">{children}</div>
            )}
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#FFB700] hover:underline font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Active Filters */}
            {(selectedFilters.categories.length > 0 || selectedFilters.brands.length > 0) && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {[...selectedFilters.categories, ...selectedFilters.brands].map((filter) => (
                        <span
                            key={filter}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs rounded-sm"
                        >
                            {filter}
                            <button onClick={() => { }} className="hover:text-red-600">
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Category */}
            <FilterSection title="Category" section="category">
                <div className="space-y-2">
                    {["Women", "Men", "Kids", "Accessories"].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedFilters.categories.includes(cat)}
                                onChange={() => handleCheckboxChange("categories", cat)}
                                className="w-4 h-4 accent-[#FFB700]"
                            />
                            <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" section="price">
                <div className="space-y-3">
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
                        className="w-full accent-[#FFB700]"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${selectedFilters.priceRange[0]}</span>
                        <span>${selectedFilters.priceRange[1]}</span>
                    </div>
                </div>
            </FilterSection>

            {/* Brand */}
            <FilterSection title="Brand" section="brand">
                <div className="space-y-2">
                    {["Nike", "Adidas", "Puma", "Zara", "H&M", "Levi's"].map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedFilters.brands.includes(brand)}
                                onChange={() => handleCheckboxChange("brands", brand)}
                                className="w-4 h-4 accent-[#FFB700]"
                            />
                            <span className="text-sm text-gray-700">{brand}</span>
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
                            className={`px-3 py-1.5 border text-sm font-medium transition-colors ${selectedFilters.sizes.includes(size)
                                    ? "border-[#FFB700] bg-[#FFB700] text-gray-900"
                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Color */}
            <FilterSection title="Color" section="color">
                <div className="flex flex-wrap gap-2">
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
                            className={`w-8 h-8 rounded-full border-2 transition-all ${selectedFilters.colors.includes(color.name)
                                    ? "border-[#FFB700] scale-110"
                                    : "border-gray-300"
                                }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Discount */}
            <FilterSection title="Discount" section="discount">
                <div className="space-y-2">
                    {[10, 20, 30, 40, 50].map((discount) => (
                        <label key={discount} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="discount"
                                checked={selectedFilters.minDiscount === discount}
                                onChange={() => setSelectedFilters(prev => ({ ...prev, minDiscount: discount }))}
                                className="w-4 h-4 accent-[#FFB700]"
                            />
                            <span className="text-sm text-gray-700">{discount}% and above</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Customer Rating */}
            <FilterSection title="Customer Rating" section="rating">
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                checked={selectedFilters.minRating === rating}
                                onChange={() => setSelectedFilters(prev => ({ ...prev, minRating: rating }))}
                                className="w-4 h-4 accent-[#FFB700]"
                            />
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < rating ? "fill-[#FFB700] text-[#FFB700]" : "text-gray-300"}
                                    />
                                ))}
                                <span className="text-sm text-gray-700 ml-1">& above</span>
                            </div>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Apply Button */}
            <button
                onClick={applyFilters}
                className="w-full mt-6 py-3 bg-[#FFB700] hover:bg-[#FFA500] text-gray-900 font-semibold rounded-sm transition-colors"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default FilterSidebar;
