import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import RatingStars from "./RatingStars";
import { toast } from "sonner";

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const inWishlist = isInWishlist(product.id);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes.length > 0 && product.sizes[0] !== "One Size") {
            toast.error("Please select a size");
            return;
        }
        addToCart(product, quantity, selectedSize || product.sizes[0]);
        toast.success(`${product.name} added to cart`);
        onClose();
    };

    const handleWishlistToggle = () => {
        toggleWishlist(product.id);
        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm animate-fade-in" />

            {/* Modal */}
            <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-muted transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative aspect-square md:aspect-auto md:h-full bg-muted">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {discount > 0 && (
                            <span className="absolute top-4 left-4 px-3 py-1 bg-destructive text-destructive-foreground text-sm font-medium rounded">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8 flex flex-col max-h-[50vh] md:max-h-[80vh] overflow-y-auto">
                        {/* Category */}
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            {product.category}
                        </p>

                        {/* Name */}
                        <h2 className="font-display text-2xl lg:text-3xl font-medium mb-3">
                            {product.name}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <RatingStars rating={product.rating} />
                            <span className="text-sm text-muted-foreground">
                                ({product.reviewsCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-semibold">
                                ${product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                    ${product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Size selector */}
                        {product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-3">Size</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${selectedSize === size
                                                    ? "border-gold bg-gold/10 text-gold"
                                                    : "border-border hover:border-gold/50"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <p className="text-sm font-medium mb-3">Quantity</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="p-2 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                    className="p-2 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Stock status */}
                        <p className={`text-sm mb-6 ${product.stock <= 5 ? "text-destructive" : "text-green-600"}`}>
                            {product.stock <= 5 ? `Only ${product.stock} left!` : "In Stock"}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-cream rounded-md font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50"
                            >
                                <ShoppingBag size={18} />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                className={`p-3 border rounded-md transition-colors ${inWishlist
                                        ? "border-gold bg-gold/10 text-gold"
                                        : "border-border hover:border-gold"
                                    }`}
                                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart size={20} className={inWishlist ? "fill-gold" : ""} />
                            </button>
                        </div>

                        {/* View full details */}
                        <Link
                            to={`/product/${product.id}`}
                            onClick={onClose}
                            className="text-center text-sm text-gold hover:underline mt-4"
                        >
                            View Full Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
