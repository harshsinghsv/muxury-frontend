import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=450&fit=crop",
        title: "MEGA SALE",
        subtitle: "Up to 70% Off on All Categories",
        cta: "Shop Now",
        link: "/shop?filter=sale",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=450&fit=crop",
        title: "NEW ARRIVALS",
        subtitle: "Fresh Styles Just Landed",
        cta: "Explore Collection",
        link: "/shop?filter=new",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=450&fit=crop",
        title: "SUMMER COLLECTION",
        subtitle: "Beat the Heat in Style",
        cta: "View Products",
        link: "/shop",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=450&fit=crop",
        title: "ACCESSORIES SALE",
        subtitle: "Complete Your Look - 50% Off",
        cta: "Shop Accessories",
        link: "/shop?category=accessories",
    },
];

const BannerCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div
            className="relative h-[400px] bg-gray-200 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4 lg:px-6">
                            <div className="max-w-xl">
                                <h2 className="text-5xl font-bold text-white mb-3 tracking-tight">
                                    {banner.title}
                                </h2>
                                <p className="text-xl text-white mb-6">
                                    {banner.subtitle}
                                </p>
                                <Link
                                    to={banner.link}
                                    className="inline-block px-8 py-3 bg-[#FFB700] hover:bg-[#FFA500] text-gray-900 font-semibold rounded-sm transition-colors"
                                >
                                    {banner.cta}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                aria-label="Next slide"
            >
                <ChevronRight size={24} className="text-gray-900" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-white w-6" : "bg-white/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
