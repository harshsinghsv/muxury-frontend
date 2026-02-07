import { Link } from "react-router-dom";
import productDress1 from "@/assets/product-dress-1.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";
import productBag from "@/assets/product-bag.jpg";

const categories = [
    {
        name: "Women's Fashion",
        slug: "women",
        image: productDress1,
        itemCount: "2,345",
    },
    {
        name: "Men's Fashion",
        slug: "men",
        image: productSuit1,
        itemCount: "1,876",
    },
    {
        name: "Accessories",
        slug: "accessories",
        image: productBag,
        itemCount: "987",
    },
];

const CategoryGrid = () => {
    return (
        <section className="py-20 bg-bg-primary">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2
                            className="font-light mb-3 text-text-primary"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "48px",
                                letterSpacing: "0.02em"
                            }}
                        >
                            Discover Our Collections
                        </h2>
                        <div className="bg-accent-primary" style={{ width: "80px", height: "2px" }} />
                    </div>
                    <Link
                        to="/shop"
                        className="text-accent-primary hover:text-accent-muted transition-colors font-medium uppercase tracking-wider"
                        style={{ fontSize: "13px" }}
                    >
                        View All Categories
                    </Link>
                </div>

                {/* Image-based Category Grid - 3 categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            to={`/shop?category=${category.slug}`}
                            className="group bg-bg-elevated transition-all duration-500 overflow-hidden relative border border-accent-primary/20"
                            style={{
                                borderRadius: "0px",
                                height: "400px"
                            }}
                        >
                            {/* Image Section */}
                            <div
                                className="absolute inset-0 overflow-hidden"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    style={{
                                        filter: "brightness(0.7)"
                                    }}
                                />

                                {/* Gradient Overlay */}
                                <div
                                    className="absolute inset-0 transition-opacity duration-500"
                                    style={{
                                        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)"
                                    }}
                                />
                            </div>

                            {/* Text Content - Overlaid */}
                            <div
                                className="absolute bottom-0 left-0 right-0 p-8 z-10"
                            >
                                <div
                                    className="font-light mb-2 transition-transform duration-500 group-hover:-translate-y-2 text-text-primary"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "32px",
                                        letterSpacing: "0.02em"
                                    }}
                                >
                                    {category.name}
                                </div>
                                <div
                                    className="uppercase tracking-widest transition-opacity duration-500 text-accent-primary"
                                    style={{
                                        fontSize: "12px",
                                        letterSpacing: "0.15em"
                                    }}
                                >
                                    {category.itemCount} Items
                                </div>

                                {/* Gold underline appears on hover */}
                                <div
                                    className="mt-4 bg-accent-primary transition-all duration-500 group-hover:w-16"
                                    style={{
                                        width: "0px",
                                        height: "2px"
                                    }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
