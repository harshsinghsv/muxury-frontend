import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Truck, AlertCircle } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isNew = product.isNew;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = product.sizes[0] || "One Size";
    addToCart(product, 1, size);
    toast.success("Added to cart");
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Generate full stars only
  const fullStars = Math.round(product.rating);
  const emptyStars = 5 - fullStars;

  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-bg-elevated transition-all duration-500 group border border-accent-primary/15 hover:border-accent-primary/40"
      style={{
        borderRadius: "0px",
        boxShadow: isHovered ? "var(--shadow-strong)" : "var(--shadow-soft)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Fixed Height, Dark Background */}
      <div
        className="relative bg-bg-secondary flex items-center justify-center overflow-hidden"
        style={{ height: "320px", width: "100%" }}
      >
        {/* Product Image - object-fit: contain to prevent cropping */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="transition-transform duration-700"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            objectFit: "contain",
            objectPosition: "center",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            filter: isHovered ? "brightness(1.05)" : "brightness(1)"
          }}
          loading="lazy"
        />

        {/* NEW Badge - Only for new products, top-left */}
        {isNew && (
          <div
            className="absolute uppercase font-semibold text-accent-foreground bg-accent-primary"
            style={{
              top: "15px",
              left: "15px",
              fontSize: "11px",
              padding: "6px 14px",
              borderRadius: "0px",
              zIndex: 10,
              letterSpacing: "0.08em"
            }}
          >
            NEW
          </div>
        )}

        {/* Wishlist Heart - Top Right */}
        <button
          onClick={handleWishlistToggle}
          className="absolute flex items-center justify-center transition-all duration-300 hover:scale-110 bg-bg-elevated/90 backdrop-blur-sm border border-accent-primary/20"
          style={{
            top: "15px",
            right: "15px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            zIndex: 10
          }}
        >
          <Heart
            size={18}
            className={inWishlist ? "fill-destructive text-destructive" : "text-text-primary"}
          />
        </button>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-bg-primary/80"
          >
            <span className="font-medium text-text-secondary" style={{ fontSize: "16px" }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Content - 20px padding for luxury spacing */}
      <div style={{ padding: "20px 16px" }}>
        {/* Category Label */}
        <div
          className="uppercase font-medium text-text-secondary"
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            marginBottom: "8px"
          }}
        >
          {product.category}
        </div>

        {/* Product Title - Elegant serif font */}
        <h3
          className="line-clamp-2 group-hover:text-accent-primary transition-colors duration-300 text-text-primary"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "1.4",
            marginBottom: "12px",
            minHeight: "44px",
            letterSpacing: "0.01em"
          }}
        >
          {product.name}
        </h3>

        {/* Rating & Review Count */}
        <div className="flex items-center" style={{ marginBottom: "12px" }}>
          <div className="flex items-center" style={{ fontSize: "14px" }}>
            {[...Array(fullStars)].map((_, i) => (
              <span key={`full-${i}`} className="text-accent-primary">★</span>
            ))}
            {[...Array(emptyStars)].map((_, i) => (
              <span key={`empty-${i}`} className="text-muted-foreground/40">★</span>
            ))}
          </div>
          <span className="text-text-secondary" style={{ fontSize: "12px", marginLeft: "6px" }}>
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price Section - Horizontal Layout */}
        <div className="flex items-baseline flex-wrap" style={{ marginBottom: "12px" }}>
          <span
            className="font-semibold text-text-primary"
            style={{
              fontSize: "20px",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            ${product.price}
          </span>
          {hasDiscount && (
            <>
              <span
                className="line-through text-text-secondary"
                style={{
                  fontSize: "14px",
                  marginLeft: "8px"
                }}
              >
                ${product.originalPrice}
              </span>
              <span
                className="font-medium text-accent-primary"
                style={{
                  fontSize: "13px",
                  marginLeft: "8px"
                }}
              >
                {discountPercent}% off
              </span>
            </>
          )}
        </div>

        {/* Delivery Info */}
        <div className="flex items-center" style={{ marginBottom: "8px" }}>
          <Truck size={14} className="text-accent-primary" style={{ marginRight: "4px" }} />
          <span className="text-text-secondary" style={{ fontSize: "12px" }}>
            Free Delivery
          </span>
        </div>

        {/* Low Stock Warning */}
        {isLowStock && (
          <div className="flex items-center" style={{ marginBottom: "12px" }}>
            <AlertCircle size={12} className="text-destructive" style={{ marginRight: "4px" }} />
            <span className="text-destructive font-medium" style={{ fontSize: "12px" }}>
              Only {product.stock} left in stock
            </span>
          </div>
        )}

        {/* Add to Cart Button - Luxury gold styling */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center font-semibold transition-all duration-400 disabled:cursor-not-allowed uppercase"
          style={{
            height: "44px",
            backgroundColor: product.stock === 0 ? "hsl(var(--bg-secondary))" : "transparent",
            color: product.stock === 0 ? "hsl(var(--text-secondary))" : "hsl(var(--accent-primary))",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "0px",
            border: product.stock === 0 ? "1px solid hsl(var(--border-subtle))" : "1.5px solid hsl(var(--accent-primary))",
            letterSpacing: "0.1em"
          }}
          onMouseEnter={(e) => {
            if (product.stock > 0) {
              e.currentTarget.style.backgroundColor = "hsl(var(--accent-primary))";
              e.currentTarget.style.color = "hsl(var(--accent-foreground))";
              e.currentTarget.style.borderColor = "hsl(var(--accent-primary))";
            }
          }}
          onMouseLeave={(e) => {
            if (product.stock > 0) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "hsl(var(--accent-primary))";
              e.currentTarget.style.borderColor = "hsl(var(--accent-primary))";
            }
          }}
          onMouseDown={(e) => {
            if (product.stock > 0) {
              e.currentTarget.style.transform = "scale(0.98)";
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <ShoppingCart size={16} style={{ marginRight: "8px" }} />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
