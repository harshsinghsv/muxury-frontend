import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getFeaturedProducts, products } from "@/data/products";

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();
  // New arrivals: latest 4 items with isNew flag, excluding featured ones
  const newArrivals = products
    .filter((p) => p.isNew && !p.isFeatured)
    .slice(0, 4);

  return (
    <>
      {/* Featured Collection */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-body text-sm tracking-luxury uppercase text-accent-primary mb-3">
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

      {/* Divider Banner */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="font-body text-sm tracking-luxury uppercase text-accent-foreground/70 mb-4">
            Crafted for Excellence
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-primary-foreground max-w-2xl mx-auto leading-relaxed">
            Where timeless elegance meets modern sophistication
          </h2>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-body text-sm tracking-luxury uppercase text-accent-primary mb-3">
              Just Arrived
            </p>
            <h2 className="section-title text-foreground">New Arrivals</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((product) => (
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
    </>
  );
};

export default FeaturedProducts;
