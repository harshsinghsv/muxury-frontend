import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0F0F0F] text-white border-t border-[#C9A961]/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About/Company */}
          <div>
            <h3 className="font-medium text-base mb-6 uppercase tracking-wider" style={{ color: "#C9A961", letterSpacing: "0.12em" }}>About LUXE</h3>
            <ul className="space-y-3 text-sm text-[#CCCCCC]">
              <li><Link to="/about" className="hover:text-[#C9A961] transition-colors duration-300">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-[#FFB700] transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-[#FFB700] transition-colors">Press & News</Link></li>
              <li><Link to="/corporate" className="hover:text-[#FFB700] transition-colors">Corporate Information</Link></li>
              <li><Link to="/terms" className="hover:text-[#FFB700] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#FFB700] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-[#FFB700] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-[#FFB700] transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h3 className="font-medium text-base mb-6 uppercase tracking-wider" style={{ color: "#C9A961", letterSpacing: "0.12em" }}>Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/help" className="hover:text-[#FFB700] transition-colors">Help Center</Link></li>
              <li><Link to="/track-order" className="hover:text-[#FFB700] transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-[#FFB700] transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/shipping-info" className="hover:text-[#FFB700] transition-colors">Shipping Info</Link></li>
              <li><Link to="/size-guide" className="hover:text-[#FFB700] transition-colors">Size Guide</Link></li>
              <li><Link to="/contact" className="hover:text-[#FFB700] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-[#FFB700] transition-colors">FAQs</Link></li>
              <li><a href="tel:1-800-LUXE-SHOP" className="hover:text-[#FFB700] transition-colors">1-800-LUXE-SHOP</a></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-medium text-base mb-6 uppercase tracking-wider" style={{ color: "#C9A961", letterSpacing: "0.12em" }}>Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/shop?category=women" className="hover:text-[#FFB700] transition-colors">Women</Link></li>
              <li><Link to="/shop?category=men" className="hover:text-[#FFB700] transition-colors">Men</Link></li>
              <li><Link to="/shop?category=kids" className="hover:text-[#FFB700] transition-colors">Kids</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-[#FFB700] transition-colors">Accessories</Link></li>
              <li><Link to="/shop?filter=new" className="hover:text-[#FFB700] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?filter=sale" className="hover:text-[#FFB700] transition-colors">Sale</Link></li>
              <li><Link to="/brands" className="hover:text-[#FFB700] transition-colors">Brands</Link></li>
              <li><Link to="/shop" className="hover:text-[#FFB700] transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="font-medium text-base mb-6 uppercase tracking-wider" style={{ color: "#C9A961", letterSpacing: "0.12em" }}>Connect With Us</h3>

            {/* Social Media */}
            <div className="flex gap-3 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-[#FFB700] rounded transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-[#FFB700] rounded transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-[#FFB700] rounded transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-[#FFB700] rounded transition-colors">
                <Youtube size={20} />
              </a>
            </div>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-sm text-gray-300 mb-3">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-sm text-gray-900 text-sm focus:outline-none"
                />
                <button className="px-4 py-2 bg-[#FFB700] hover:bg-[#FFA500] text-gray-900 font-semibold rounded-sm transition-colors">
                  <Mail size={16} />
                </button>
              </div>
            </div>

            {/* App Download */}
            <div>
              <p className="text-sm text-gray-300 mb-3">Download Our App</p>
              <div className="flex flex-col gap-2">
                <a href="#" className="inline-block">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-10"
                  />
                </a>
                <a href="#" className="inline-block">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="Download on the App Store"
                    className="h-10"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © 2026 LUXE. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex gap-2">
                {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"].map((method) => (
                  <div key={method} className="px-3 py-1 bg-white rounded text-xs font-semibold text-gray-900">
                    {method}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>🔒 SSL Secure</span>
              <span>•</span>
              <span>✓ Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
