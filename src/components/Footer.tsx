import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-wide-luxury mb-4">
              LUXE
            </h3>
            <p className="font-body text-cream/70 text-sm leading-relaxed mb-6">
              Crafted for the discerning. Where timeless elegance meets contemporary design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-sm font-medium tracking-luxury uppercase mb-4 text-cream">
              Shop
            </h4>
            <ul className="space-y-3">
              {["New Arrivals", "Women", "Men", "Accessories", "Collections"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="font-body text-sm text-cream/70 hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body text-sm font-medium tracking-luxury uppercase mb-4 text-cream">
              Company
            </h4>
            <ul className="space-y-3">
              {["About Us", "Atelier", "Careers", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <Link to="/about" className="font-body text-sm text-cream/70 hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-body text-sm font-medium tracking-luxury uppercase mb-4 text-cream">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {["Shipping & Returns", "Size Guide", "FAQs", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link to="/contact" className="font-body text-sm text-cream/70 hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-cream/50">
              © 2026 LUXE. All rights reserved. Crafted for the discerning.
            </p>
            <div className="flex items-center space-x-6">
              <span className="font-body text-xs text-cream/50">
                Free shipping on orders over $500
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
