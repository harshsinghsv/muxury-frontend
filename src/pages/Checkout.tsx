import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Check, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ShippingForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

const Checkout = () => {
    const navigate = useNavigate();
    const { items, subtotal, tax, shipping, total, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("card");

    const [form, setForm] = useState<ShippingForm>({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ").slice(1).join(" ") || "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
    });

    const [errors, setErrors] = useState<Partial<ShippingForm>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof ShippingForm]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ShippingForm> = {};

        if (!form.firstName.trim()) newErrors.firstName = "First name is required";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!form.address.trim()) newErrors.address = "Address is required";
        if (!form.city.trim()) newErrors.city = "City is required";
        if (!form.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
        setOrderId(newOrderId);
        clearCart();
        setOrderComplete(true);
        setLoading(false);
    };

    if (items.length === 0 && !orderComplete) {
        navigate("/cart");
        return null;
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h1 className="font-display text-2xl lg:text-3xl font-medium mb-4">
                            Order Confirmed!
                        </h1>
                        <p className="text-muted-foreground mb-2">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>
                        <p className="font-medium mb-8">
                            Order ID: <span className="text-gold">{orderId}</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate("/shop")}
                                className="px-6 py-3 bg-charcoal text-cream rounded-md hover:bg-charcoal-light transition-colors"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate("/profile")}
                                className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors"
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <button
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Cart
                </button>

                <h1 className="font-display text-2xl lg:text-3xl font-medium mb-8">
                    Checkout
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Shipping form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact info */}
                            <section>
                                <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            First Name <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.firstName ? "border-destructive" : "border-border"
                                                }`}
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Last Name <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.lastName ? "border-destructive" : "border-border"
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Email <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.email ? "border-destructive" : "border-border"
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Shipping address */}
                            <section>
                                <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Street Address <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="123 Main Street, Apt 4B"
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.address ? "border-destructive" : "border-border"
                                                }`}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-destructive mt-1">{errors.address}</p>
                                        )}
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                City <span className="text-destructive">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.city ? "border-destructive" : "border-border"
                                                    }`}
                                            />
                                            {errors.city && (
                                                <p className="text-sm text-destructive mt-1">{errors.city}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={form.state}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                ZIP Code <span className="text-destructive">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={form.zipCode}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.zipCode ? "border-destructive" : "border-border"
                                                    }`}
                                            />
                                            {errors.zipCode && (
                                                <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-gold bg-background"
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                            <option>Australia</option>
                                            <option>Germany</option>
                                            <option>France</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Payment method */}
                            <section>
                                <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === "card"
                                                ? "border-gold bg-gold/5"
                                                : "border-border hover:border-gold/50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-gold focus:ring-gold"
                                        />
                                        <CreditCard size={20} />
                                        <span className="font-medium">Credit / Debit Card</span>
                                    </label>
                                    <label
                                        className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === "paypal"
                                                ? "border-gold bg-gold/5"
                                                : "border-border hover:border-gold/50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paypal"
                                            checked={paymentMethod === "paypal"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-gold focus:ring-gold"
                                        />
                                        <span className="font-bold text-blue-600">Pay</span>
                                        <span className="font-bold text-blue-800">Pal</span>
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Demo mode: No real payment will be processed
                                </p>
                            </section>
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 p-6 border border-border rounded-lg bg-muted/30">
                                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                                {/* Items list */}
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div
                                            key={`${item.product.id}-${item.selectedSize}`}
                                            className="flex gap-3"
                                        >
                                            <div className="w-12 h-14 rounded overflow-hidden bg-muted flex-shrink-0">
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.selectedSize} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium">
                                                ${(item.product.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-border pt-4 space-y-3 text-sm">
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
                                </div>

                                <div className="border-t border-border my-4 pt-4">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>${total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Place Order"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
