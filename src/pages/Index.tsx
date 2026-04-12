import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { COPY } from "@/config/constants";
import ProductSkeleton from "@/components/ProductSkeleton";

import productBag from "@/assets/product-bag.jpg";
import productDress1 from "@/assets/product-dress-1.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productDress2 from "@/assets/product-dress-2.jpg";
import productSuit2 from "@/assets/product-suit-2.jpg";

const CategorySection = ({ title, categoryName }: { title: string, categoryName: string }) => {
  const { data, isLoading, error } = useProducts({ category: categoryName });
  const products = (data || []).slice(0, 4);

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="mb-10 md:mb-16 mt-16 md:mt-20">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2 className="font-['DM_Sans'] text-xs md:text-sm font-bold tracking-widest uppercase text-[#343434]">{title}</h2>
        <Link to={`/shop?category=${encodeURIComponent(categoryName.toLowerCase())}`} className="min-h-[44px] min-w-[44px] flex items-center justify-end font-['DM_Sans'] text-sm md:text-base text-[#CA8385] hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#CA8385] rounded">
          {COPY.home.sections.seeAll || "See All"}
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Failed to load items.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();
  const { data: productsData, isLoading, error } = useProducts({ isFeatured: true });
  const featuredProducts = (productsData || []).slice(0, 4);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const greeting = user?.firstName ? `${COPY.home.hero.greeting} ${user.firstName}` : COPY.home.hero.guestGreeting;

  return (
    <div className="px-5 md:px-12 lg:px-24 xl:px-32 pt-2 pb-6">
      {/* Greeting */}
      <p className="font-['DM_Sans'] text-sm text-[#999999] mt-2 md:mt-8">{greeting}</p>
      <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#343434] leading-tight mt-1 mb-5 md:mb-10 w-full whitespace-pre-line">
        {COPY.home.hero.title}
      </h1>

      {/* Categories Row (Myntra-style) */}
      <div className="mb-10 md:mb-16 mt-6 md:mt-10 relative">
        <h2 className="font-['Playfair_Display'] text-xl md:text-2xl font-bold text-[#343434] mb-6 md:mb-8">{COPY.home.sections.categories || "Shop by Category"}</h2>
        
        {/* Desktop left arrow */}
        <button 
          onClick={() => scroll('left')} 
          className="hidden md:flex absolute left-[-20px] top-[60%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center text-[#343434] hover:text-[#CA8385] opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-[#EBEBEB] focus:outline-none"
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="group relative">
          <div ref={scrollRef} className="flex overflow-x-auto hide-scrollbar gap-5 md:gap-10 pb-4 snap-x">
            {[
              { name: "Outerwear", image: productSuit1 },
              { name: "Accessories", image: productSunglasses },
              { name: "Men's Fashion", image: productSuit2 },
              { name: "Women's Fashion", image: productDress1 },
              { name: "Dresses", image: productDress2 },
              { name: "Suits", image: productSuit1 },
              { name: "Bags", image: productBag },
            ].map((category, idx) => (
              <Link 
                key={idx} 
                to={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`} 
                className="flex flex-col items-center gap-3 group/item min-w-[80px] md:min-w-[110px] shrink-0 snap-center"
              >
                <div className="w-[80px] h-[80px] md:w-[110px] md:h-[110px] rounded-full overflow-hidden p-[2px] border border-[#EBEBEB] group-hover/item:border-[#CA8385] transition-colors shadow-sm bg-white">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF8F7] relative">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" 
                    />
                  </div>
                </div>
                <span className="font-['DM_Sans'] text-xs md:text-sm text-center text-[#343434] group-hover/item:text-[#CA8385] transition-colors font-medium">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop right arrow */}
          <button 
            onClick={() => scroll('right')} 
            className="hidden md:flex absolute right-[-20px] top-[40%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center text-[#343434] hover:text-[#CA8385] opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-[#EBEBEB] focus:outline-none"
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2 className="font-['DM_Sans'] text-xs md:text-sm font-bold tracking-widest uppercase text-[#343434]">{COPY.home.sections.popular}</h2>
        <Link to="/shop" className="min-h-[44px] min-w-[44px] flex items-center justify-end font-['DM_Sans'] text-sm md:text-base text-[#CA8385] hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#CA8385] rounded">
          {COPY.home.sections.seeAll}
        </Link>
      </div>

      {/* 2-col product grid (mobile) -> 3-col (md) -> 4-col (lg) */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Failed to load popular items.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Sections for Each Category */}
      {["Outerwear", "Accessories", "Men's Fashion", "Women's Fashion", "Dresses", "Suits", "Bags"].map((cat) => (
         <CategorySection key={cat} title={cat} categoryName={cat} />
      ))}
    </div>
  );
};

export default Index;
