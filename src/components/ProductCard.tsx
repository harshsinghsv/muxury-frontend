import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Indian E-Commerce standard: MRP and Discount
  const mrp = product.price * 1.5; // Mock 50% markup for MRP display
  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(isInWishlist(product.id) ? "Removed from saved items" : "Saved item");
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#F5F5F5] mb-2">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Heart Icon (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
        >
          {isInWishlist(product.id) ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#CA8385" stroke="#CA8385" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Product Details */}
      <div className="px-1 mt-3">
        <h3 className="font-['DM_Sans'] text-sm font-medium text-[#343434] truncate mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-['DM_Sans'] text-sm font-bold text-[#343434]">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          <p className="font-['DM_Sans'] text-[10px] text-[#999999] line-through">
            MRP ₹{mrp.toLocaleString('en-IN')}
          </p>
          <span className="font-['DM_Sans'] text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
            {discountPercent}% OFF
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
