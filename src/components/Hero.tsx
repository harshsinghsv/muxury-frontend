import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-gown.jpg";
import productDress1 from "@/assets/product-dress-1.jpg";
import productDress2 from "@/assets/product-dress-2.jpg";
import productDress3 from "@/assets/product-dress-3.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";

const heroSlides = [
  {
    image: heroImage,
    title: "Elegance Refined",
    subtitle: "Discover our curated collection of luxury fashion",
    cta: "Browse Lookbook"
  },
  {
    image: productDress1,
    title: "Evening Elegance",
    subtitle: "Exquisite gowns for unforgettable moments",
    cta: "Shop Dresses"
  },
  {
    image: productSuit1,
    title: "Tailored Perfection",
    subtitle: "Sophisticated menswear crafted with precision",
    cta: "Shop Suits"
  },
  {
    image: productDress2,
    title: "Timeless Beauty",
    subtitle: "Classic designs that transcend trends",
    cta: "Explore Collection"
  },
  {
    image: productDress3,
    title: "Modern Luxury",
    subtitle: "Contemporary fashion for the discerning",
    cta: "View New Arrivals"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full"
            style={{
              objectFit: "contain",
              objectPosition: "center"
            }}
          />

          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center z-20">
        <div className="max-w-2xl">
          {/* Animated content */}
          <div
            key={currentSlide}
            className="animate-fade-in-up"
          >
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block px-0 py-0 text-white text-sm font-normal tracking-wide">
                New Collection 2024
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-light text-white leading-[1.1] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "72px",
                letterSpacing: "0.02em"
              }}
            >
              {heroSlides[currentSlide].title}
            </h1>

            {/* Subheadline */}
            <p
              className="text-white/90 mb-10 max-w-md"
              style={{
                fontSize: "16px",
                lineHeight: "1.6"
              }}
            >
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* CTA Button */}
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-10 py-4 bg-transparent text-white font-medium uppercase text-sm transition-all duration-300 hover:bg-white/10"
              style={{
                border: "1.5px solid white",
                borderRadius: "0px",
                letterSpacing: "0.12em"
              }}
            >
              {heroSlides[currentSlide].cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${index === currentSlide
              ? "w-12 bg-white"
              : "w-3 bg-white/40 hover:bg-white/60"
              }`}
            style={{ height: "3px" }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
