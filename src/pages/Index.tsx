import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { COPY } from "@/config/constants";
import ProductSkeleton from "@/components/ProductSkeleton";

import productBag from "@/assets/product-bag.jpg";
import productDress1 from "@/assets/product-dress-1.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";
import productDress2 from "@/assets/product-dress-2.jpg";
import productSuit2 from "@/assets/product-suit-2.jpg";

// Hero Banner Data
const HERO_BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
    subtitle: "Spring / Summer 2026",
    title: "ELEVATE YOUR\nEVERYDAY WARDROBE",
    cta: "Shop Now"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600",
    subtitle: "The Essentials Edit",
    title: "REFINED MINIMALISM\nFOR MODERN LIVING",
    cta: "Explore Collection"
  }
];

// Top Brands Data
const TOP_BRANDS = [
  "ALLEN SOLLY", "RAYMOND", "VAN HEUSEN", "PETER ENGLAND", "FABINDIA", "LOUIS PHILIPPE"
];

// Trust Badges SVG Components
const TrustBadgeSvg = {
  Delivery: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2l1.56 5.24A2 2 0 0 1 21 15v3a2 2 0 0 1-2 2h-2"/><circle cx="8" cy="18" r="3"/><circle cx="16" cy="18" r="3"/><line x1="11" y1="18" x2="13" y2="18"/><line x1="5" y1="6" x2="15" y2="6"/><polyline points="15 6 15 11 20 11"/></svg>,
  Return: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><path d="M10 15h4M12 13v4"/></svg>, // Mock return
  Secure: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Authentic: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 12l2 2 4-4"/></svg>
};

// Reusable Category Section
const CategorySection = ({ title, categoryName }: { title: string, categoryName: string }) => {
  const { data, isLoading, error } = useProducts({ category: categoryName });
  const products = (data || []).slice(0, 4);

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="mb-10 md:mb-16 mt-16 md:mt-20 px-5 md:px-12 lg:px-24 xl:px-32">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2 className="font-['DM_Sans'] text-sm md:text-base font-bold tracking-widest uppercase text-[#343434]">{title}</h2>
        <Link to={`/shop?category=${encodeURIComponent(categoryName.toLowerCase())}`} className="min-h-[44px] min-w-[44px] flex items-center justify-end font-['DM_Sans'] text-sm md:text-base text-[#CA8385] hover:underline underline-offset-4 font-bold">
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
  const { recentlyViewed } = useRecentlyViewed();
  const { data: popularData, isLoading: popularLoading } = useProducts({ isFeatured: true });
  const { data: dealsData } = useProducts({ category: "Outerwear" }); // Using Outerwear as mock deals
  
  const featuredProducts = (popularData || []).slice(0, 4);
  const dealProducts = (dealsData || []).slice(0, 4);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h: h.toString().padStart(2, '0'), m: m.toString().padStart(2, '0'), s: s.toString().padStart(2, '0') };
  };

  const { h, m, s } = formatTime(timeLeft);
  const greeting = user?.firstName ? `${COPY.home.hero.greeting} ${user.firstName}` : "";

  return (
    <div className="pt-4 md:pt-8 pb-6 w-full overflow-hidden">
      {/* Dynamic Hero Banner Carousel */}
      <div className="px-5 md:px-12 lg:px-24 xl:px-32">
          <div className="relative w-full h-[60vh] md:h-[70vh] bg-[#EBEBEB] overflow-hidden group rounded-2xl md:rounded-3xl shadow-sm">
        {HERO_BANNERS.map((banner, index) => (
            <div 
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                <img src={banner.image} className="w-full h-full object-cover object-top grayscale-[10%]" alt="Hero Banner" />
                <div className="absolute inset-0 bg-black/30"></div>
                
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-32 max-w-4xl">
                    <p className="font-['DM_Sans'] text-white/80 text-xs md:text-sm tracking-[0.2em] uppercase mb-4 translate-y-4 animate-fade-in-up">
                        {banner.subtitle}
                    </p>
                    <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 translate-y-4 animate-fade-in-up md:whitespace-pre-line">
                        {banner.title}
                    </h1>
                    <div>
                        <Link to="/shop" className="inline-flex h-12 md:h-14 items-center justify-center bg-white text-[#343434] font-['DM_Sans'] font-bold text-sm px-8 rounded-full hover:bg-[#343434] hover:text-white transition-colors active:scale-95">
                            {banner.cta}
                        </Link>
                    </div>
                </div>
            </div>
        ))}
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {HERO_BANNERS.map((_, idx) => (
                <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/40'}`}
                />
            ))}
        </div>
        </div>
      </div>

      {greeting && (
         <p className="font-['DM_Sans'] text-sm text-[#999999] mt-6 px-5 md:px-12 lg:px-24 xl:px-32">{greeting}</p>
      )}

      {/* Trust Badges */}
      <div className="px-5 md:px-12 lg:px-24 xl:px-32 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 border border-[#EBEBEB] rounded-2xl shadow-sm">
            {[
                { title: "Free Delivery", desc: "On orders over ₹100", icon: TrustBadgeSvg.Delivery },
                { title: "Easy Returns", desc: "14-day return policy", icon: TrustBadgeSvg.Return },
                { title: "Secure Payment", desc: "100% secure checkout", icon: TrustBadgeSvg.Secure },
                { title: "100% Authentic", desc: "Sourced from brands", icon: TrustBadgeSvg.Authentic },
            ].map((feature, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 p-2">
                    <div className="w-12 h-12 bg-[#F5F0EE] text-[#CA8385] rounded-full flex items-center justify-center shrink-0">
                        <feature.icon />
                    </div>
                    <div>
                        <h4 className="font-['DM_Sans'] font-bold text-[#343434] text-sm md:text-base">{feature.title}</h4>
                        <p className="font-['DM_Sans'] text-xs text-[#999999] mt-0.5">{feature.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Structured Category Grid */}
      <div className="px-5 md:px-12 lg:px-24 xl:px-32 mb-10 md:mb-16 mt-16 md:mt-20">
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#343434] mb-8 text-center md:text-left">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            {[
              { name: "Outerwear", image: productSuit1 },
              { name: "Accessories", image: productSunglasses },
              { name: "Men's", image: productSuit2 },
              { name: "Women's", image: productDress1 },
              { name: "Dresses", image: productDress2 },
              { name: "Suits", image: productSuit1 },
              { name: "Bags", image: productBag },
              { name: "All", image: productSunglasses },
            ].map((cat, idx) => (
              <Link 
                key={idx} 
                to={cat.name === "All" ? "/shop" : `/shop?category=${encodeURIComponent(cat.name.toLowerCase())}`} 
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F7] relative border border-[#EBEBEB] group-hover:border-[#CA8385] transition-colors">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {cat.name === "All" && (
                    <div className="absolute inset-0 bg-[#343434]/80 flex items-center justify-center text-white font-bold text-sm">See All</div>
                  )}
                </div>
                <span className="font-['DM_Sans'] text-xs md:text-sm text-center text-[#343434] font-medium group-hover:text-[#CA8385] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
        </div>
      </div>

      {/* Sale / Deals Section with Countdown Timer */}
      {dealProducts.length > 0 && (
          <div className="bg-[#FAF8F7] py-16 px-5 md:px-12 lg:px-24 xl:px-32 mb-16 border-y border-[#EBEBEB]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div>
                    <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#343434] mb-2 text-center md:text-left">Deals of the Day</h2>
                    <p className="font-['DM_Sans'] text-[#999999] text-center md:text-left">Grab these limited time offers before they expire.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-[#EBEBEB] shadow-sm">
                    <span className="font-['DM_Sans'] font-bold text-[#EF5050] text-sm uppercase">Ends in:</span>
                    <div className="flex items-center gap-1">
                        <div className="bg-[#343434] text-white w-10 h-10 flex items-center justify-center rounded font-bold text-lg">{h}</div>
                        <span className="font-bold text-[#343434]">:</span>
                        <div className="bg-[#343434] text-white w-10 h-10 flex items-center justify-center rounded font-bold text-lg">{m}</div>
                        <span className="font-bold text-[#343434]">:</span>
                        <div className="bg-[#EF5050] text-white w-10 h-10 flex items-center justify-center rounded font-bold text-lg">{s}</div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 relative">
              {dealProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
      )}

      {/* Popular Items */}
      <div className="px-5 md:px-12 lg:px-24 xl:px-32 mb-16">
          <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-[#EBEBEB] pb-4">
            <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#343434]">Most Popular</h2>
            <Link to="/shop" className="font-['DM_Sans'] text-sm md:text-base text-[#CA8385] font-bold hover:underline">
              See All
            </Link>
          </div>

          {popularLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
      </div>

      {/* Top Brands Grid */}
      <div className="px-5 md:px-12 lg:px-24 xl:px-32 mb-16">
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#343434] mb-8 text-center md:text-left">Shop by Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {TOP_BRANDS.map((brand, idx) => (
                  <Link to="/shop" key={idx} className="bg-white border border-[#EBEBEB] h-24 flex items-center justify-center rounded-xl hover:border-[#CA8385] hover:shadow-md transition-all group">
                      <span className="font-['Playfair_Display'] text-lg font-bold text-[#999999] group-hover:text-[#343434] transition-colors">{brand}</span>
                  </Link>
              ))}
          </div>
      </div>

      {/* Recently Viewed Products */}
      {recentlyViewed && recentlyViewed.length > 0 && (
          <div className="bg-[#FAF8F7] py-16 px-5 md:px-12 lg:px-24 xl:px-32 border-t border-[#EBEBEB]">
            <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#343434] mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {recentlyViewed.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
      )}

      {/* Specific Content Categories */}
      {["Women's Fashion", "Men's Fashion"].map((cat) => (
         <CategorySection key={cat} title={`${cat} Highlights`} categoryName={cat} />
      ))}
    </div>
  );
};

export default Index;
