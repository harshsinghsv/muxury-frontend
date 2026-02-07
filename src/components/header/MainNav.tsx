import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MapPin, ChevronDown } from "lucide-react";
import CategoryMegaMenu from "./CategoryMegaMenu";
import { ThemeToggle } from "../ThemeToggle";

const categories = [
    { name: "Women", slug: "women", hasMenu: true },
    { name: "Men", slug: "men", hasMenu: true },
    { name: "Kids", slug: "kids", hasMenu: true },
    { name: "Accessories", slug: "accessories", hasMenu: true },
    { name: "Brands", slug: "brands", hasMenu: false },
    { name: "Sale", slug: "sale", hasMenu: false },
];

interface MainNavProps {
    onAllCategoriesClick: () => void;
}

const MainNav = ({ onAllCategoriesClick }: MainNavProps) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <div className="bg-bg-elevated text-text-primary border-t border-border-subtle">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-12">
                    {/* Left: All Categories + Main Nav */}
                    <div className="flex items-center gap-6">
                        {/* All Categories Button */}
                        <button
                            onClick={onAllCategoriesClick}
                            className="flex items-center gap-2 hover:text-accent-primary transition-colors font-medium text-sm"
                        >
                            <Menu size={18} />
                            <span>All Categories</span>
                        </button>

                        {/* Main Categories */}
                        <nav className="hidden md:flex items-center gap-6">
                            {categories.map((category) => (
                                <div
                                    key={category.slug}
                                    className="relative h-12 flex items-center"
                                    onMouseEnter={() => category.hasMenu && setActiveCategory(category.slug)}
                                    onMouseLeave={() => setActiveCategory(null)}
                                >
                                    <Link
                                        to={`/shop?category=${category.slug}`}
                                        className={`text-sm font-medium hover:text-accent-primary transition-colors ${category.slug === "sale" ? "text-accent-primary" : ""
                                            }`}
                                    >
                                        {category.name}
                                    </Link>

                                    {/* Mega Menu */}
                                    {category.hasMenu && activeCategory === category.slug && (
                                        <CategoryMegaMenu category={category.slug} />
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Right: Delivery Location & Theme Toggle */}
                    <div className="hidden lg:flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span className="text-text-secondary">Deliver to:</span>
                            <button className="font-medium hover:text-accent-primary transition-colors flex items-center gap-1">
                                <span>110001</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainNav;
