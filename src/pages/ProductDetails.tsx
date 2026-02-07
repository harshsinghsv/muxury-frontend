import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Heart, ShoppingBag, Truck, Shield, ArrowLeft, RotateCcw,
    Check, Clock, Ruler, ChevronDown, ChevronUp, Users, Star,
    Package, RefreshCw, CreditCard, Sparkles
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuantitySelector from "@/components/QuantitySelector";
import RatingStars from "@/components/RatingStars";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import { getProductById, getProductsByCategory, getProductReviews, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { toast } from "sonner";

const SIZE_GUIDE = {
    XS: { chest: "32-34", waist: "24-26", hips: "34-36" },
    S: { chest: "34-36", waist: "26-28", hips: "36-38" },
    M: { chest: "36-38", waist: "28-30", hips: "38-40" },
    L: { chest: "38-40", waist: "30-32", hips: "40-42" },
    XL: { chest: "40-42", waist: "32-34", hips: "42-44" },
};

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const product = getProductById(id || "");
    const reviews = getProductReviews(id || "");

    const { addToRecentlyViewed, getCompleteTheLook, getAlsoBought } = useRecentlyViewed();

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const [stickyVisible, setStickyVisible] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    // Track view and scroll for sticky bar
    useEffect(() => {
        if (product) {
            addToRecentlyViewed(product.id);
        }

        const handleScroll = () => {
            setStickyVisible(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [product, addToRecentlyViewed]);

    if (!product) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate("/shop")}
                        className="inline-flex items-center gap-2 text-gold hover:underline"
                    >
                        <ArrowLeft size={18} />
                        Back to Shop
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    // Get intelligent recommendations
    const completeTheLook = getCompleteTheLook(product.id, 3);
    const alsoBought = getAlsoBought(product.id, 4);
    const relatedProducts = getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 4);

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;
    const savings = hasDiscount ? product.originalPrice! - product.price : 0;
    const inWishlist = isInWishlist(product.id);
    const needsSizeSelection = product.sizes.length > 0 && product.sizes[0] !== "One Size";
    const isLowStock = product.stock <= 5 && product.stock > 0;

    // Delivery estimate
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    const handleAddToCart = () => {
        if (needsSizeSelection && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        setIsAdding(true);

        setTimeout(() => {
            addToCart(product, quantity, selectedSize || product.sizes[0]);
            setIsAdding(false);
            setJustAdded(true);
            toast.success(`${product.name} added to cart`, {
                action: {
                    label: "View Cart",
                    onClick: () => navigate("/cart"),
                },
            });
            setTimeout(() => setJustAdded(false), 3000);
        }, 400);
    };

    const handleToggleWishlist = () => {
        toggleWishlist(product.id);
        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    };

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            <Header />

            <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                    <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                    <span>/</span>
                    <Link to={`/shop?category=${product.category}`} className="hover:text-foreground transition-colors capitalize">
                        {product.category}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-32">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
                    {/* Image gallery */}
                    <div className="space-y-3">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                {product.isNew && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gold text-charcoal rounded">
                                        New
                                    </span>
                                )}
                                {hasDiscount && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-destructive text-white rounded">
                                        -{discountPercent}%
                                    </span>
                                )}
                            </div>
                            {/* Social proof badge */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-charcoal/80 backdrop-blur-sm rounded text-cream text-xs">
                                <Users size={12} />
                                <span>127 people viewing</span>
                            </div>
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all ${selectedImage === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="space-y-5">
                        {/* Category & rating */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-1">
                                <RatingStars rating={product.rating} size={14} />
                                <Link to="#reviews" className="text-xs text-muted-foreground hover:underline">
                                    ({product.reviewsCount} reviews)
                                </Link>
                            </div>
                        </div>

                        {/* Name */}
                        <h1 className="font-display text-2xl lg:text-3xl font-medium text-foreground">
                            {product.name}
                        </h1>

                        {/* Price block */}
                        <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="text-2xl font-bold">${product.price.toLocaleString()}</span>
                            {hasDiscount && (
                                <>
                                    <span className="text-lg text-muted-foreground line-through">
                                        ${product.originalPrice!.toLocaleString()}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                                        Save ${savings.toLocaleString()}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {product.description}
                        </p>

                        {/* Size selector with guide */}
                        {needsSizeSelection && (
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <label className="text-sm font-medium">
                                        Size <span className="text-destructive">*</span>
                                    </label>
                                    <button
                                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                                        className="text-xs text-gold hover:underline flex items-center gap-1"
                                    >
                                        <Ruler size={12} />
                                        Size Guide
                                        {showSizeGuide ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                </div>

                                {/* Size guide dropdown */}
                                {showSizeGuide && (
                                    <div className="mb-3 p-3 bg-muted rounded-lg text-xs animate-fade-in">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-muted-foreground">
                                                    <th className="text-left py-1">Size</th>
                                                    <th className="text-center py-1">Chest (in)</th>
                                                    <th className="text-center py-1">Waist (in)</th>
                                                    <th className="text-center py-1">Hips (in)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(SIZE_GUIDE).map(([size, measurements]) => (
                                                    <tr key={size} className={selectedSize === size ? "font-medium text-gold" : ""}>
                                                        <td className="py-1">{size}</td>
                                                        <td className="text-center py-1">{measurements.chest}</td>
                                                        <td className="text-center py-1">{measurements.waist}</td>
                                                        <td className="text-center py-1">{measurements.hips}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-12 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${selectedSize === size
                                                    ? "border-gold bg-gold/10 text-gold"
                                                    : "border-border hover:border-charcoal"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Quantity</label>
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                max={product.stock}
                            />
                            {isLowStock && (
                                <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                    <Clock size={12} />
                                    Only {product.stock} left!
                                </span>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || isAdding}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-medium transition-all ${justAdded
                                        ? "bg-green-500 text-white"
                                        : "bg-charcoal text-cream hover:bg-charcoal-light"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {justAdded ? (
                                    <>
                                        <Check size={18} />
                                        Added to Cart
                                    </>
                                ) : isAdding ? (
                                    <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingBag size={18} />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`flex items-center justify-center gap-2 px-5 py-3.5 border rounded-lg font-medium transition-all ${inWishlist
                                        ? "border-gold bg-gold/10 text-gold"
                                        : "border-border hover:border-gold"
                                    }`}
                            >
                                <Heart size={18} className={inWishlist ? "fill-current" : ""} />
                            </button>
                        </div>

                        {/* Delivery & Trust */}
                        <div className="space-y-3 pt-4 border-t border-border">
                            {/* Delivery promise */}
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Truck size={18} className="text-gold flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Get it by <span className="text-gold">{deliveryDateStr}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Free shipping on orders over $100
                                    </p>
                                </div>
                            </div>

                            {/* Promise badges */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 bg-muted/50 rounded-lg">
                                    <RotateCcw size={16} className="mx-auto text-muted-foreground mb-1" />
                                    <p className="text-[10px] font-medium">30-Day Returns</p>
                                </div>
                                <div className="p-2 bg-muted/50 rounded-lg">
                                    <Shield size={16} className="mx-auto text-muted-foreground mb-1" />
                                    <p className="text-[10px] font-medium">Secure Checkout</p>
                                </div>
                                <div className="p-2 bg-muted/50 rounded-lg">
                                    <CreditCard size={16} className="mx-auto text-muted-foreground mb-1" />
                                    <p className="text-[10px] font-medium">Pay in 4</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complete the Look - Cross-sell */}
                {completeTheLook.length > 0 && (
                    <section className="mt-14 pt-10 border-t border-border">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles size={18} className="text-gold" />
                            <h2 className="font-display text-xl font-medium">Complete the Look</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {completeTheLook.map((p) => (
                                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews section */}
                <section id="reviews" className="mt-14 pt-10 border-t border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl font-medium">
                            Customer Reviews ({product.reviewsCount})
                        </h2>
                        <div className="flex items-center gap-2">
                            <RatingStars rating={product.rating} size={16} />
                            <span className="font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="space-y-5 max-w-2xl">
                            {reviews.map((review) => (
                                <div key={review.id} className="pb-5 border-b border-border last:border-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-medium text-sm">{review.userName}</span>
                                        <span className="text-xs text-muted-foreground">{review.date}</span>
                                    </div>
                                    <RatingStars rating={review.rating} size={12} />
                                    <p className="text-muted-foreground text-sm mt-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>
                    )}
                </section>

                {/* Customers Also Bought */}
                {alsoBought.length > 0 && (
                    <section className="mt-14 pt-10 border-t border-border">
                        <div className="flex items-center gap-2 mb-6">
                            <Users size={18} className="text-gold" />
                            <h2 className="font-display text-xl font-medium">Customers Also Bought</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {alsoBought.map((p) => (
                                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Sticky Add to Cart Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg transform transition-transform duration-300 ${stickyVisible ? "translate-y-0" : "translate-y-full"
                } md:block hidden`}>
                <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img src={product.images[0]} alt="" className="w-12 h-14 rounded object-cover" />
                        <div>
                            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                            <p className="text-gold font-semibold">${product.price.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {needsSizeSelection && (
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-gold"
                            >
                                <option value="">Select Size</option>
                                {product.sizes.map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        )}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAdding}
                            className="px-6 py-2.5 bg-gold text-charcoal font-medium rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
                        >
                            {justAdded ? "Added!" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </div>
    );
};

export default ProductDetails;
