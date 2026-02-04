import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-gown.jpg";

const Hero = () => {
  return (
    <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant woman in champagne evening gown on marble staircase"
          className="w-full h-full object-cover object-top"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
        <div className="max-w-lg">
          <p className="font-body text-sm tracking-luxury uppercase text-gold mb-4">
            New Collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-cream leading-tight mb-6">
            Elegance
            <br />
            Refined.
          </h2>
          <p className="font-body text-cream/80 text-lg mb-8 max-w-md">
            Discover the new collection. Crafted with precision, designed for the discerning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/collections"
              className="btn-gold"
            >
              Shop Collection
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 font-body text-sm font-medium tracking-luxury uppercase transition-all duration-300 bg-transparent border border-cream/50 text-cream hover:bg-cream/10"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
