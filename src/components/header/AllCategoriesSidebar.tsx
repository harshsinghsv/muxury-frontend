import { Link } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";

interface AllCategoriesSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const allCategories = [
    {
        name: "Women",
        subcategories: ["Dresses", "Tops & Shirts", "Jeans & Trousers", "Skirts", "Jackets", "Activewear", "Footwear", "Accessories"],
    },
    {
        name: "Men",
        subcategories: ["Shirts", "T-Shirts", "Jeans & Trousers", "Suits & Blazers", "Jackets", "Activewear", "Footwear", "Accessories"],
    },
    {
        name: "Kids",
        subcategories: ["Boys Clothing", "Girls Clothing", "Infants", "Footwear", "Accessories", "School Wear"],
    },
    {
        name: "Accessories",
        subcategories: ["Bags & Handbags", "Jewelry", "Watches", "Sunglasses", "Belts", "Scarves", "Hats"],
    },
    {
        name: "Brands",
        subcategories: ["Premium Brands", "Budget Brands", "Luxury", "Sustainable", "Local Brands"],
    },
    {
        name: "Sale",
        subcategories: ["Up to 50% Off", "Up to 70% Off", "Clearance", "Flash Deals", "End of Season"],
    },
];

const AllCategoriesSidebar = ({ isOpen, onClose }: AllCategoriesSidebarProps) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#2C3E50] text-white px-4 py-4 flex items-center justify-between">
                    <h2 className="font-semibold text-lg">All Categories</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Categories List */}
                <div className="py-2">
                    {allCategories.map((category) => (
                        <div key={category.name} className="border-b border-gray-200">
                            <Link
                                to={`/shop?category=${category.name.toLowerCase()}`}
                                onClick={onClose}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-900">{category.name}</span>
                                <ChevronRight size={18} className="text-gray-400" />
                            </Link>

                            {/* Subcategories */}
                            <div className="bg-gray-50 py-2">
                                {category.subcategories.map((sub) => (
                                    <Link
                                        key={sub}
                                        to={`/shop?category=${category.name.toLowerCase()}`}
                                        onClick={onClose}
                                        className="block px-8 py-2 text-sm text-gray-700 hover:text-[#FFB700] hover:bg-white transition-colors"
                                    >
                                        {sub}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AllCategoriesSidebar;
