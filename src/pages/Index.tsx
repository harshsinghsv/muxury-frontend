import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

// Using existing image as a proxy for the promo image
import productBag from "@/assets/product-bag.jpg";

const Index = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <div className="px-5 md:px-12 lg:px-24 xl:px-32 pt-2 pb-6">
      {/* Greeting */}
      <p className="font-['DM_Sans'] text-sm text-[#999999] mt-2 md:mt-8">Hi! Jhones Cortal</p>
      <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#343434] leading-tight mt-1 mb-5 md:mb-10">
        Discover Your<br />Modern Clothing
      </h1>

      {/* Promo carousel */}
      <div className="rounded-3xl bg-[#F0EDED] px-5 md:px-10 pt-5 md:pt-10 overflow-hidden relative min-h-[130px] md:min-h-[240px] mb-4 md:mb-8 flex flex-col justify-center">
        <p className="font-['Playfair_Display'] text-2xl md:text-4xl font-bold text-[#CA8385]">75% Off</p>
        <p className="font-['DM_Sans'] text-sm md:text-lg text-[#343434] md:mt-2">On everything today</p>
        <p className="font-['DM_Sans'] text-[10px] md:text-sm text-[#999999] md:mt-1">Only valid until 24 June 2024</p>
        <button className="mt-3 md:mt-6 bg-[#CA8385] text-white text-xs md:text-sm font-['DM_Sans'] px-5 md:px-8 py-2 md:py-3 rounded-full mb-4 md:mb-10 active:scale-95 transition-transform w-max">Get Now</button>
        <img src={productBag} className="absolute right-0 bottom-0 h-28 md:h-56 object-contain mix-blend-multiply md:mr-10" alt="Promo" />
      </div>

      {/* Carousel dots */}
      <div className="flex justify-center gap-2 mb-6 md:mb-12">
        <span className="w-6 h-2 bg-[#CA8385] rounded-full" />
        <span className="w-2 h-2 bg-[#EBEBEB] rounded-full" />
        <span className="w-2 h-2 bg-[#EBEBEB] rounded-full" />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2 className="font-['DM_Sans'] text-xs md:text-sm font-bold tracking-widest uppercase text-[#343434]">Most Popular</h2>
        <Link to="/shop" className="font-['DM_Sans'] text-sm md:text-base text-[#CA8385] hover:underline underline-offset-4">See All</Link>
      </div>

      {/* 2-col product grid (mobile) -> 3-col (md) -> 4-col (lg) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Index;
