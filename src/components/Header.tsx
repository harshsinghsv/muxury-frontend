import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary">
      {/* Top bar with gold accent */}
      <div className="h-1 bg-gold w-full" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-primary-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display text-2xl lg:text-3xl font-semibold tracking-wide-luxury text-primary-foreground">
              LUXE
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="nav-link-light"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="hidden sm:block text-primary-foreground/80 hover:text-primary-foreground transition-colors" aria-label="Account">
              <User size={20} />
            </button>
            <button className="relative text-primary-foreground/80 hover:text-primary-foreground transition-colors" aria-label="Shopping bag">
              <ShoppingBag size={20} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-accent-foreground text-xs font-medium flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block nav-link-light py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
