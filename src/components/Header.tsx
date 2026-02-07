import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-[#2C2C2C]">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Logo Section - Centered */}
        <div className="flex justify-center py-8 border-b border-[#C9A961]/30">
          <Link to="/" className="flex flex-col items-center">
            <h1
              className="text-[#C9A961] font-light"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "36px",
                letterSpacing: "0.2em",
                lineHeight: "1",
                fontWeight: 300
              }}
            >
              MUXURY
            </h1>
            <span
              className="text-[#C9A961] font-light mt-1"
              style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                fontWeight: 300
              }}
            >
              CLOTHING
            </span>
          </Link>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between py-5">
          {/* Desktop Navigation - Left aligned */}
          <nav className="hidden md:flex items-center gap-12 flex-1">
            <Link
              to="/shop"
              className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                fontWeight: 400
              }}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                fontWeight: 400
              }}
            >
              About
            </Link>
            <Link
              to="/shop"
              className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                fontWeight: 400
              }}
            >
              Atelier
            </Link>
            <Link
              to="/contact"
              className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                fontWeight: 400
              }}
            >
              Contact
            </Link>
          </nav>

          {/* Spacer for mobile */}
          <div className="md:hidden flex-1"></div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist - Desktop only */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#999999] hover:text-[#C9A961] transition-colors hidden md:block"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A961] text-[#1A1A1A] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Account - Desktop only */}
            <Link
              to="/account"
              className="p-2 text-[#999999] hover:text-[#C9A961] transition-colors hidden md:block"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-[#999999] hover:text-[#C9A961] transition-colors"
            >
              <ShoppingCart size={18} strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A961] text-[#1A1A1A] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#999999] hover:text-[#C9A961] transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#C9A961]/20">
            <nav className="flex flex-col gap-3 pt-4">
              <Link
                to="/shop"
                className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase py-2"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase py-2"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/shop"
                className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase py-2"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Atelier
              </Link>
              <Link
                to="/contact"
                className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase py-2"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/wishlist"
                className="text-[#999999] hover:text-[#C9A961] transition-colors uppercase py-2"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Wishlist ({wishlistItems.length})
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
