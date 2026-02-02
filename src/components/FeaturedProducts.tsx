import ProductCard from "./ProductCard";
import productDress1 from "@/assets/product-dress-1.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";
import productDress2 from "@/assets/product-dress-2.jpg";
import productBag from "@/assets/product-bag.jpg";
import productDress3 from "@/assets/product-dress-3.jpg";
import productSuit2 from "@/assets/product-suit-2.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";

const products = [
  {
    id: "1",
    name: "Silk Evening Gown",
    price: 2450,
    image: productDress1,
    category: "Dresses",
    isNew: true,
  },
  {
    id: "2",
    name: "Tailored Navy Suit",
    price: 1890,
    image: productSuit1,
    category: "Menswear",
    isNew: true,
  },
  {
    id: "3",
    name: "Golden Wrap Dress",
    price: 1650,
    image: productDress2,
    category: "Dresses",
    isNew: false,
  },
  {
    id: "4",
    name: "Designer Tote Bag",
    price: 980,
    image: productBag,
    category: "Accessories",
    isNew: true,
  },
];

const newArrivals = [
  {
    id: "5",
    name: "Velvet Evening Gown",
    price: 2890,
    image: productDress3,
    category: "Dresses",
    isNew: true,
  },
  {
    id: "6",
    name: "Black Tuxedo",
    price: 2250,
    image: productSuit2,
    category: "Menswear",
    isNew: true,
  },
  {
    id: "7",
    name: "Designer Sunglasses",
    price: 450,
    image: productSunglasses,
    category: "Accessories",
    isNew: true,
  },
  {
    id: "8",
    name: "Silk Evening Gown",
    price: 2650,
    image: productDress1,
    category: "Dresses",
    isNew: false,
  },
];

const FeaturedProducts = () => {
  return (
    <>
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
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider Banner */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="font-body text-sm tracking-luxury uppercase text-gold mb-4">
            Crafted for Excellence
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-primary-foreground max-w-2xl mx-auto leading-relaxed">
            Where timeless elegance meets modern sophistication
          </h2>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 lg:py-24 bg-cream-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-body text-sm tracking-luxury uppercase text-gold mb-3">
              Just Arrived
            </p>
            <h2 className="section-title text-foreground">New Arrivals</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/shop" className="btn-luxury-outline">
              View All Products
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;
