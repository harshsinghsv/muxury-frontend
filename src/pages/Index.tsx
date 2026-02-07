import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { getFeaturedProducts, getNewArrivals, products, Product } from "@/data/products";
import { ChevronRight } from "lucide-react";

// Import available product images for category grid
import productDress1 from "@/assets/product-dress-1.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";
import productBag from "@/assets/product-bag.jpg";
import productDress2 from "@/assets/product-dress-2.jpg";
import productSuit2 from "@/assets/product-suit-2.jpg";
import productDress3 from "@/assets/product-dress-3.jpg";

const categoryProducts = [
  {
    id: 1,
    name: "Luxury Outerwear",
    image: productSuit2,
    category: "Outerwear"
  },
  {
    id: 2,
    name: "Designer Bag",
    image: productBag,
    category: "Accessories"
  },
  {
    id: 3,
    name: "Premium Suit",
    image: productSuit1,
    category: "Men's Fashion"
  },
  {
    id: 4,
    name: "Evening Dress",
    image: productDress1,
    category: "Women's Fashion"
  },
  {
    id: 5,
    name: "Elegant Gown",
    image: productDress2,
    category: "Formal Wear"
  },
  {
    id: 6,
    name: "Designer Dress",
    image: productDress3,
    category: "Evening Wear"
  },
];

const Index = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const saleProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="min-h-screen bg-[#2C2C2C]">
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Product Category Grid - 2 rows x 3 columns */}
        <section className="py-20 bg-[#1A1A1A]">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categoryProducts.map((product) => (
                <Link
                  key={product.id}
                  to="/shop"
                  className="group relative overflow-hidden bg-[#0F0F0F]"
                  style={{
                    borderRadius: "0px",
                    aspectRatio: "1/1"
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />

                  {/* Subtle dark overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Category name appears on hover at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3
                      className="text-white font-light"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "24px",
                        letterSpacing: "0.02em"
                      }}
                    >
                      {product.category}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-[#0F0F0F]">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2
                  className="font-light mb-3 text-white"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "48px",
                    letterSpacing: "0.02em"
                  }}
                >
                  Curated Selection
                </h2>
                <div className="bg-[#C9A961]" style={{ width: "80px", height: "2px" }} />
              </div>
              <Link
                to="/shop"
                className="flex items-center gap-2 text-[#C9A961] hover:text-[#D4AF77] transition-colors font-medium uppercase tracking-wider"
                style={{ fontSize: "13px" }}
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
              }}
            >
              {featuredProducts.slice(0, 12).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-20 bg-[#1A1A1A]">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2
                  className="font-light mb-3 text-white"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "48px",
                    letterSpacing: "0.02em"
                  }}
                >
                  New Arrivals
                </h2>
                <div className="bg-[#C9A961]" style={{ width: "80px", height: "2px" }} />
              </div>
              <Link
                to="/shop?filter=new"
                className="flex items-center gap-2 text-[#C9A961] hover:text-[#D4AF77] transition-colors font-medium uppercase tracking-wider"
                style={{ fontSize: "13px" }}
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
              }}
            >
              {newArrivals.slice(0, 12).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Exclusive Offers Section */}
        <section className="py-20 bg-[#0F0F0F]">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2
                  className="font-light mb-3 text-white"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "48px",
                    letterSpacing: "0.02em"
                  }}
                >
                  Exclusive Offers
                </h2>
                <div className="bg-[#C9A961]" style={{ width: "80px", height: "2px" }} />
              </div>
              <Link
                to="/shop?filter=sale"
                className="flex items-center gap-2 text-[#C9A961] hover:text-[#D4AF77] transition-colors font-medium uppercase tracking-wider"
                style={{ fontSize: "13px" }}
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"
              }}
            >
              {saleProducts.slice(0, 12).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-br from-[#C9A961] to-[#B8975A]">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2
              className="font-light mb-3 text-[#1A1A1A]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "42px",
                letterSpacing: "0.02em"
              }}
            >
              Join Our Exclusive Circle
            </h2>
            <p className="text-[#1A1A1A]/80 mb-8 text-base">
              Be the first to discover new collections and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white text-[#1A1A1A] focus:outline-none placeholder:text-[#999999]"
                style={{ borderRadius: "0px" }}
              />
              <button className="px-10 py-4 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white font-semibold uppercase tracking-wider transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Index;
