import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryMegaMenuProps {
    category: string;
}

const megaMenuData: Record<string, any> = {
    women: {
        columns: [
            {
                title: "Clothing",
                items: ["Dresses", "Tops & Shirts", "Jeans & Trousers", "Skirts", "Jackets & Coats", "Activewear"],
            },
            {
                title: "Footwear",
                items: ["Heels", "Flats", "Sneakers", "Boots", "Sandals"],
            },
            {
                title: "Accessories",
                items: ["Bags & Handbags", "Jewelry", "Watches", "Sunglasses", "Belts"],
            },
            {
                title: "Trending",
                items: ["New Arrivals", "Best Sellers", "Sale Items", "Workwear", "Party Wear"],
            },
        ],
        featured: {
            image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
            title: "Summer Collection 2026",
            link: "/shop?category=women&filter=new",
        },
    },
    men: {
        columns: [
            {
                title: "Clothing",
                items: ["Shirts", "T-Shirts & Polos", "Jeans & Trousers", "Suits & Blazers", "Jackets", "Activewear"],
            },
            {
                title: "Footwear",
                items: ["Formal Shoes", "Sneakers", "Boots", "Sandals & Slippers", "Sports Shoes"],
            },
            {
                title: "Accessories",
                items: ["Watches", "Bags & Wallets", "Belts", "Sunglasses", "Ties & Cufflinks"],
            },
            {
                title: "Trending",
                items: ["New Arrivals", "Best Sellers", "Sale Items", "Formal Wear", "Casual Wear"],
            },
        ],
        featured: {
            image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=300&fit=crop",
            title: "Men's Essentials",
            link: "/shop?category=men&filter=new",
        },
    },
    kids: {
        columns: [
            {
                title: "Boys",
                items: ["T-Shirts & Shirts", "Jeans & Trousers", "Jackets", "Shoes", "Accessories"],
            },
            {
                title: "Girls",
                items: ["Dresses", "Tops & Shirts", "Jeans & Skirts", "Shoes", "Accessories"],
            },
            {
                title: "Infants",
                items: ["Bodysuits", "Rompers", "Sleepwear", "Shoes", "Accessories"],
            },
            {
                title: "Trending",
                items: ["New Arrivals", "School Wear", "Party Wear", "Sale Items"],
            },
        ],
        featured: {
            image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
            title: "Kids Collection",
            link: "/shop?category=kids&filter=new",
        },
    },
    accessories: {
        columns: [
            {
                title: "Bags",
                items: ["Handbags", "Backpacks", "Wallets", "Travel Bags", "Laptop Bags"],
            },
            {
                title: "Jewelry",
                items: ["Necklaces", "Earrings", "Bracelets", "Rings", "Watches"],
            },
            {
                title: "Fashion",
                items: ["Sunglasses", "Belts", "Scarves", "Hats & Caps", "Gloves"],
            },
            {
                title: "Trending",
                items: ["New Arrivals", "Best Sellers", "Sale Items", "Gift Sets"],
            },
        ],
        featured: {
            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop",
            title: "Accessorize Your Style",
            link: "/shop?category=accessories&filter=new",
        },
    },
};

const CategoryMegaMenu = ({ category }: CategoryMegaMenuProps) => {
    const data = megaMenuData[category];

    if (!data) return null;

    return (
        <div className="absolute top-full left-0 w-screen bg-bg-elevated shadow-lg z-50 border-t border-border-subtle">
            <div className="container mx-auto px-4 lg:px-6 py-6">
                <div className="grid grid-cols-5 gap-6">
                    {/* Columns */}
                    {data.columns.map((column: any, idx: number) => (
                        <div key={idx}>
                            <h3 className="font-semibold text-sm text-text-primary mb-3 uppercase tracking-wide">
                                {column.title}
                            </h3>
                            <ul className="space-y-2">
                                {column.items.map((item: string) => (
                                    <li key={item}>
                                        <Link
                                            to={`/shop?category=${category}`}
                                            className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Featured Section */}
                    <div className="col-span-1">
                        <Link to={data.featured.link} className="group block">
                            <div className="relative overflow-hidden rounded-sm mb-2">
                                <img
                                    src={data.featured.image}
                                    alt={data.featured.title}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h4 className="text-white font-semibold text-sm mb-1">{data.featured.title}</h4>
                                    <span className="text-white text-xs flex items-center gap-1">
                                        Shop Now <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryMegaMenu;
