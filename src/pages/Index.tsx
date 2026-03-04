import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

// Using existing image as a proxy for the promo image
import productBag from "@/assets/product-bag.jpg";

const Index = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <div className="px-5 pt-2 pb-6">
      {/* Greeting */}
      <p className="font-['DM_Sans'] text-sm text-[#999999] mt-2">Hi! Jhones Cortal</p>
      <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434] leading-tight mt-1 mb-5">
        Discover Your<br />Modern Clothing
      </h1>

      {/* Promo carousel */}
      <div className="rounded-3xl bg-[#F0EDED] px-5 pt-5 overflow-hidden relative min-h-[130px] mb-4">
        <p className="font-['Playfair_Display'] text-2xl font-bold text-[#CA8385]">75% Off</p>
        <p className="font-['DM_Sans'] text-sm text-[#343434]">On everything today</p>
        <p className="font-['DM_Sans'] text-[10px] text-[#999999]">Only valid until 24 June 2024</p>
        <button className="mt-3 bg-[#CA8385] text-white text-xs font-['DM_Sans'] px-5 py-2 rounded-full mb-4 active:scale-95 transition-transform">Get Now</button>
        <img src={productBag} className="absolute right-0 bottom-0 h-28 object-contain mix-blend-multiply" alt="Promo" />
      </div>

      {/* Carousel dots */}
      <div className="flex justify-center gap-2 mb-6">
        <span className="w-6 h-2 bg-[#CA8385] rounded-full" />
        <span className="w-2 h-2 bg-[#EBEBEB] rounded-full" />
        <span className="w-2 h-2 bg-[#EBEBEB] rounded-full" />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-['DM_Sans'] text-xs font-bold tracking-widest uppercase text-[#343434]">Most Popular</h2>
        <Link to="/shop" className="font-['DM_Sans'] text-sm text-[#CA8385]">See All</Link>
      </div>

      {/* 2-col product grid */}
      <div className="grid grid-cols-2 gap-4">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Index;
