import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, Trash2, Truck, ArrowRight, Plus, Sparkles, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import QuantitySelector from "./QuantitySelector";
import { Product, products } from "@/data/products";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 100;

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const {
        items,
        removeFromCart,
        updateQuantity,
        subtotal,
        total,
        addToCart
    } = useCart();

    const { recentlyViewed, getAlsoBought } = useRecentlyViewed();

    const isEmpty = items.length === 0;
    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
    const hasUnlockedFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

    // Intelligent recommendations based on cart items
    const recommendations = useMemo(() => {
        const cartProductIds = items.map(item => item.product.id);

        // Get recommendations from cart items
        if (items.length > 0) {
            const lastCartItem = items[items.length - 1];
            return getAlsoBought(lastCartItem.product.id, 3)
                .filter(p => !cartProductIds.includes(p.id));
        }

        // If cart is empty but we have recent views, use those
        if (recentlyViewed.length > 0) {
            return recentlyViewed.slice(0, 3).filter(p => !cartProductIds.includes(p.id));
        }

        // Fallback: show some products
        return products.slice(0, 3).filter(p => !cartProductIds.includes(p.id));
    }, [items, recentlyViewed, getAlsoBought]);

    const handleQuickAdd = (product: Product) => {
        const size = product.sizes[0] || "One Size";
        addToCart(product, 1, size);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl animate-slide-in-right flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} />
                        <h2 className="font-display text-lg font-medium">
                            Your Cart ({items.length})
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Free shipping progress */}
                {!isEmpty && (
                    <div className="px-4 py-3 bg-gradient-to-r from-gold/10 to-gold/5 border-b border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck size={16} className={hasUnlockedFreeShipping ? "text-green-600" : "text-gold"} />
                            {hasUnlockedFreeShipping ? (
                                <p className="text-sm text-green-600 font-medium">
                                    🎉 You've unlocked free shipping!
                                </p>
                            ) : (
                                <p className="text-sm">
                                    Add <span className="font-semibold text-gold">${amountToFreeShipping.toFixed(0)}</span> for free shipping
                                </p>
                            )}
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${hasUnlockedFreeShipping ? "bg-green-500" : "bg-gold"
                                    }`}
                                style={{ width: `${shippingProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Cart content */}
                <div className="flex-1 overflow-y-auto">
                    {isEmpty ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                            <div className="p-4 bg-muted rounded-full mb-4">
                                <ShoppingBag size={32} className="text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Looks like you haven't added anything yet. Start shopping to fill it up!
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-charcoal text-cream font-medium rounded-lg hover:bg-charcoal-light transition-colors"
                            >
                                Start Shopping
                            </button>

                            {/* Recently viewed for empty cart */}
                            {recentlyViewed.length > 0 && (
                                <div className="mt-8 w-full text-left">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                                        Recently Viewed
                                    </p>
                                    <div className="space-y-2">
                                        {recentlyViewed.slice(0, 3).map(product => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                                            >
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-12 h-14 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                                    <p className="text-sm text-gold">${product.price}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleQuickAdd(product)}
                                                    className="p-2 bg-gold/10 text-gold rounded-full hover:bg-gold/20 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
                            {/* Cart items */}
                            {items.map((item, index) => (
                                <div
                                    key={`${item.product.id}-${item.selectedSize}`}
                                    className="flex gap-3 p-3 bg-muted/30 rounded-xl animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Link
                                        to={`/product/${item.product.id}`}
                                        onClick={onClose}
                                        className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                                    >
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-2">
                                            <Link
                                                to={`/product/${item.product.id}`}
                                                onClick={onClose}
                                                className="font-medium text-sm hover:text-gold transition-colors line-clamp-1"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <button
                                                onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                                className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {item.selectedSize && (
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Size: {item.selectedSize}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <QuantitySelector
                                                value={item.quantity}
                                                onChange={(qty) => updateQuantity(item.product.id, item.selectedSize, qty)}
                                                max={item.product.stock}
                                                size="sm"
                                            />
                                            <span className="font-semibold text-sm">
                                                ${(item.product.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* You might also like */}
                            {recommendations.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={14} className="text-gold" />
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                            You Might Also Like
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        {recommendations.map(product => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-12 h-14 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                                    <p className="text-sm text-gold">${product.price}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleQuickAdd(product)}
                                                    className="p-2 bg-gold/10 text-gold rounded-full hover:bg-gold/20 transition-colors"
                                                    title="Quick add"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer with totals */}
                {!isEmpty && (
                    <div className="border-t border-border p-4 space-y-4 bg-muted/30">
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">${subtotal.toLocaleString()}</span>
                        </div>

                        {/* Shipping */}
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className={hasUnlockedFreeShipping ? "text-green-600 font-medium" : ""}>
                                {hasUnlockedFreeShipping ? "Free" : "Calculated at checkout"}
                            </span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                            <span>Total</span>
                            <span>${total.toLocaleString()}</span>
                        </div>

                        {/* CTA buttons */}
                        <div className="space-y-2">
                            <Link
                                to="/checkout"
                                onClick={onClose}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-charcoal font-medium rounded-lg hover:bg-gold-light transition-colors"
                            >
                                Checkout
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/cart"
                                onClick={onClose}
                                className="flex items-center justify-center w-full py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors text-sm"
                            >
                                View Cart
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Package size={12} />
                                Free returns
                            </span>
                            <span className="flex items-center gap-1">
                                <Truck size={12} />
                                Fast delivery
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
