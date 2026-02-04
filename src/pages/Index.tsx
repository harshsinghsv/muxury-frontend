import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getFeaturedProducts, getNewArrivals, categories } from "@/data/products";

// Category images - using product images as category covers
import productDress1 from "@/assets/product-dress-1.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";
import productBag from "@/assets/product-bag.jpg";

const categoryImages: Record<string, string> = {
  women: productDress1,
  men: productSuit1,
  accessories: productBag,
};

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  const displayCategories = categories.filter((c) =>
    ["women", "men", "accessories"].includes(c.slug)
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />

        {/* Featured Collection */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-body text-sm tracking-luxury uppercase text-gold mb-3">
                Curated Selection
              </p>
              <h2 className="section-title text-foreground">Featured Collection</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="py-16 lg:py-24 bg-cream-dark">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-body text-sm tracking-luxury uppercase text-gold mb-3">
                Browse By
              </p>
              <h2 className="section-title text-foreground">Shop Categories</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {displayCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-lg"
                >
                  <img
                    src={categoryImages[category.slug] || productDress1}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-cream mb-2">
                      {category.name}
                    </h3>
                    <span className="inline-flex items-center text-sm text-cream/80 group-hover:text-gold transition-colors">
                      Shop Now
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-20 lg:py-28 bg-primary">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="font-body text-sm tracking-luxury uppercase text-gold mb-4">
              Limited Time Offer
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-primary-foreground max-w-2xl mx-auto leading-relaxed mb-6">
              Up to 30% Off New Arrivals
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Discover the latest collection with exclusive discounts. Use code LUXE30 at checkout.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-gold text-charcoal font-medium rounded hover:bg-gold-light transition-colors"
            >
              Shop the Sale
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-body text-sm tracking-luxury uppercase text-gold mb-3">
                Just Arrived
              </p>
              <h2 className="section-title text-foreground">New Arrivals</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/shop" className="btn-luxury-outline">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
