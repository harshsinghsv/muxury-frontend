import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuantitySelector from "@/components/QuantitySelector";
import { useCart } from "@/context/CartContext";

const Cart = () => {
    const navigate = useNavigate();
    const {
        items,
        removeFromCart,
        updateQuantity,
        subtotal,
        tax,
        shipping,
        total,
    } = useCart();

    const isEmpty = items.length === 0;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <h1 className="font-display text-2xl lg:text-3xl font-medium mb-8">
                    Shopping Cart
                </h1>

                {isEmpty ? (
                    <div className="text-center py-16">
                        <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-6" />
                        <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-cream rounded-md hover:bg-charcoal-light transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Cart items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={`${item.product.id}-${item.selectedSize}`}
                                    className="flex gap-4 p-4 border border-border rounded-lg"
                                >
                                    {/* Product image */}
                                    <Link
                                        to={`/product/${item.product.id}`}
                                        className="w-24 h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted"
                                    >
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <Link
                                                    to={`/product/${item.product.id}`}
                                                    className="font-medium hover:text-gold transition-colors line-clamp-1"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                {item.selectedSize && (
                                                    <p className="text-sm text-muted-foreground mt-0.5">
                                                        Size: {item.selectedSize}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeFromCart(item.product.id, item.selectedSize)
                                                }
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            <QuantitySelector
                                                value={item.quantity}
                                                onChange={(qty) =>
                                                    updateQuantity(item.product.id, item.selectedSize, qty)
                                                }
                                                max={item.product.stock}
                                            />
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ${(item.product.price * item.quantity).toLocaleString()}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        ${item.product.price.toLocaleString()} each
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Continue shopping link */}
                            <div className="pt-4">
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 text-gold hover:underline"
                                >
                                    <ArrowLeft size={16} />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 p-6 border border-border rounded-lg bg-muted/30">
                                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax (10%)</span>
                                        <span>${tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>
                                            {shipping === 0 ? (
                                                <span className="text-green-600">Free</span>
                                            ) : (
                                                `$${shipping.toLocaleString()}`
                                            )}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Free shipping on orders over $100
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-border my-4 pt-4">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>${total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
                                >
                                    Proceed to Checkout
                                </button>

                                {/* Trust message */}
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Secure checkout powered by industry-leading encryption
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
