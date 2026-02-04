import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Truck, Shield, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuantitySelector from "@/components/QuantitySelector";
import RatingStars from "@/components/RatingStars";
import ProductCard from "@/components/ProductCard";
import { getProductById, getProductsByCategory, getProductReviews, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const product = getProductById(id || "");
    const reviews = getProductReviews(id || "");

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

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

    const relatedProducts = getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 4);

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes.length > 0 && product.sizes[0] !== "One Size") {
            toast.error("Please select a size");
            return;
        }
        addToCart(product, quantity, selectedSize || product.sizes[0]);
        toast.success(`${product.name} added to cart`);
    };

    const handleToggleWishlist = () => {
        toggleWishlist(product.id);
        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-foreground transition-colors"
                    >
                        Home
                    </button>
                    <span>/</span>
                    <button
                        onClick={() => navigate("/shop")}
                        className="hover:text-foreground transition-colors"
                    >
                        Shop
                    </button>
                    <span>/</span>
                    <span className="text-foreground">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-24 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-gold" : "border-transparent"
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="space-y-6">
                        {/* Category & badges */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground uppercase tracking-wider">
                                {product.category}
                            </span>
                            {product.isNew && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-gold text-charcoal rounded">
                                    NEW
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded">
                                    -{discountPercent}% OFF
                                </span>
                            )}
                        </div>

                        {/* Name & rating */}
                        <div>
                            <h1 className="font-display text-2xl lg:text-3xl font-medium text-foreground mb-2">
                                {product.name}
                            </h1>
                            <RatingStars rating={product.rating} showCount={product.reviewsCount} />
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-semibold">
                                ${product.price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-muted-foreground line-through">
                                    ${product.originalPrice!.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>

                        {/* Size selector */}
                        {product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                            <div>
                                <label className="block font-medium mb-3">
                                    Size <span className="text-destructive">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-12 px-4 py-2 border rounded-md font-medium transition-colors ${selectedSize === size
                                                    ? "border-gold bg-gold/10 text-gold"
                                                    : "border-border hover:border-gold"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <label className="block font-medium mb-3">Quantity</label>
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                max={product.stock}
                            />
                        </div>

                        {/* Stock status */}
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full ${product.stock > 10
                                        ? "bg-green-500"
                                        : product.stock > 0
                                            ? "bg-amber-500"
                                            : "bg-destructive"
                                    }`}
                            />
                            <span className="text-sm">
                                {product.stock > 10
                                    ? "In Stock"
                                    : product.stock > 0
                                        ? `Only ${product.stock} left`
                                        : "Out of Stock"}
                            </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-cream font-medium rounded-md hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={18} />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-md font-medium transition-colors ${inWishlist
                                        ? "border-destructive text-destructive"
                                        : "border-border hover:border-gold"
                                    }`}
                            >
                                <Heart size={18} className={inWishlist ? "fill-current" : ""} />
                                {inWishlist ? "Wishlisted" : "Wishlist"}
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Truck size={20} className="text-gold" />
                                <div>
                                    <p className="text-sm font-medium">Free Shipping</p>
                                    <p className="text-xs text-muted-foreground">On orders over $100</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-gold" />
                                <div>
                                    <p className="text-sm font-medium">Secure Payment</p>
                                    <p className="text-xs text-muted-foreground">100% protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews section */}
                <section className="mt-16 pt-16 border-t border-border">
                    <h2 className="font-display text-2xl font-medium mb-8">
                        Customer Reviews ({product.reviewsCount})
                    </h2>

                    {reviews.length > 0 ? (
                        <div className="space-y-6 max-w-2xl">
                            {reviews.map((review) => (
                                <div key={review.id} className="pb-6 border-b border-border last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{review.userName}</span>
                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                    </div>
                                    <RatingStars rating={review.rating} size={14} />
                                    <p className="text-muted-foreground mt-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    )}
                </section>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16 pt-16 border-t border-border">
                        <h2 className="font-display text-2xl font-medium mb-8">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
