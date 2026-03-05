import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const Checkout = () => {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState("");

    const loadRazorpay = () => new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const api = (await import('@/lib/api')).default;
            const { toast } = await import('sonner');

            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Failed to load payment portal. Are you online?");
                setLoading(false);
                return;
            }

            // 1. Sync cart to backend temporarily
            await api.delete('/cart/clear').catch(() => null);
            for (const item of items) {
                await api.post('/cart/items', { productId: item.product.id, quantity: item.quantity });
            }

            // 2. Create Order
            const orderPayload = {
                shippingAddress: {
                    fullName: "Jhones Cortal",
                    street: "1901 Thornridge Cir.",
                    city: "Shiloh",
                    state: "MH",
                    postalCode: "81063",
                    country: "India",
                    phone: "5551234567"
                },
                paymentMethod: "RAZORPAY",
                notes: ""
            };

            const orderRes = await api.post('/orders', orderPayload);
            const createdOrderId = orderRes.data.data.order.id;
            const createdOrderNumber = orderRes.data.data.order.orderNumber;

            // 3. Initiate Razorpay Payment
            const rpRes = await api.post('/payment/create-order', { orderId: createdOrderId });
            const { razorpayOrderId, amount, currency, key, orderNumber } = rpRes.data.data;

            const options = {
                key,
                amount,
                currency,
                name: "Muxury",
                description: `Order ${orderNumber}`,
                order_id: razorpayOrderId,
                handler: async (response: any) => {
                    try {
                        await api.post('/payment/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: createdOrderId
                        });
                        setOrderId(createdOrderNumber);
                        clearCart();
                        setOrderComplete(true);
                        toast.success("Payment successful!");
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Payment verification failed.");
                    }
                },
                theme: { color: "#343434" }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || "Payment failed");
            });
            rzp.open();

        } catch (error: any) {
            const { toast } = await import('sonner');
            toast.error(error.response?.data?.message || "Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0 && !orderComplete) {
        navigate("/cart");
        return null;
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center z-0">
                <div className="w-20 h-20 bg-[#CA8385] rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434] mb-3">
                    Order Confirmed
                </h1>
                <p className="font-['DM_Sans'] text-[#999999] text-sm md:text-base mb-8 max-w-[280px] md:max-w-md">
                    Your beautifully crafted order will be on its way to you shortly. A confirmation email has been sent.
                </p>
                <div className="bg-[#FAF8F7] w-full max-w-sm rounded-2xl p-6 mb-8 border border-[#EBEBEB]">
                    <p className="font-['DM_Sans'] text-xs text-[#999999] uppercase tracking-wider mb-1">
                        Order Number
                    </p>
                    <p className="font-['Playfair_Display'] text-lg text-[#343434] font-medium">
                        {orderId}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="w-full max-w-xs bg-[#343434] text-white font-['DM_Sans'] text-sm md:text-base font-medium py-4 rounded-full active:scale-95 transition-transform hover:bg-black"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 md:pb-12 z-0">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-5 pt-8 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 border border-[#EBEBEB] rounded-full flex items-center justify-center bg-white active:scale-95 transition-transform"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <h1 className="font-['Playfair_Display'] text-xl font-bold text-[#343434]">
                    Checkout
                </h1>
                <div className="w-10"></div>
            </div>

            <main className="flex-1 px-5 md:px-12 lg:px-24 xl:px-32 md:pt-12">
                {/* Desktop Header */}
                <div className="hidden md:block mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-['DM_Sans'] text-sm text-[#999999] hover:text-[#343434] transition-colors mb-6">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to Cart
                    </button>
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434]">Checkout</h1>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Forms Section */}
                    <div className="md:w-3/5 flex flex-col gap-6 md:gap-8">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-[#343434]">Shipping Address</h2>
                                <button type="button" className="text-[#CA8385] font-['DM_Sans'] text-sm font-medium hover:underline">Edit</button>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-[#343434] bg-[#FAFAFA]">
                                <div className="w-5 h-5 rounded-full border-[6px] border-[#343434] bg-white flex-shrink-0 mt-1"></div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-['DM_Sans'] text-sm md:text-base font-bold text-[#343434]">Home</p>
                                        <span className="font-['DM_Sans'] text-[10px] bg-[#EBEBEB] px-2 py-0.5 rounded text-[#343434]">Default</span>
                                    </div>
                                    <p className="font-['DM_Sans'] text-xs md:text-sm text-[#999999] leading-relaxed mt-2 md:max-w-md">
                                        Jhones Cortal<br />
                                        1901 Thornridge Cir. Shiloh, Hawaii 81063<br />
                                        +1 (555) 123-4567
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Stub */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-[#343434]">Payment Method</h2>
                                <button type="button" className="text-[#CA8385] font-['DM_Sans'] text-sm font-medium hover:underline">Change</button>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-[#EBEBEB] bg-white">
                                <div className="w-12 h-8 bg-[#F5F5F5] rounded border border-[#EBEBEB] flex items-center justify-center font-bold italic text-[#1434CB]">VISA</div>
                                <div className="flex-1">
                                    <p className="font-['DM_Sans'] text-sm font-bold text-[#343434]">•••• •••• •••• 4242</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="md:w-2/5 flex flex-col">
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 md:p-8 shadow-sm sticky top-[120px]">
                            <h2 className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-[#343434] mb-6">Order Summary</h2>

                            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-4 border-b border-[#FAF8F7] pb-4 last:border-0 last:pb-0">
                                        <div className="w-16 h-20 md:w-20 md:h-24 rounded-xl bg-[#F5F0EE] overflow-hidden flex-shrink-0 relative">
                                            <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#343434] text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-['Playfair_Display'] text-sm md:text-base font-bold text-[#343434] leading-tight mb-1">{item.product.name}</h3>
                                            <p className="font-['DM_Sans'] text-xs text-[#999999] mb-2">Size: {item.selectedSize}</p>
                                            <span className="font-['DM_Sans'] text-sm font-bold text-[#343434]">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full h-px bg-[#EBEBEB] mb-6"></div>

                            {/* Totals */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-['DM_Sans'] text-sm text-[#999999]">Subtotal</span>
                                <span className="font-['DM_Sans'] text-sm font-medium text-[#343434]">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#EBEBEB]">
                                <span className="font-['DM_Sans'] text-sm text-[#999999]">Delivery</span>
                                <span className="font-['DM_Sans'] text-sm font-medium text-[#343434]">₹10.00</span>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <span className="font-['DM_Sans'] text-base font-bold text-[#343434]">Total Payment</span>
                                <span className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#343434]">₹{(subtotal + 10).toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-14 md:h-16 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-sm md:text-base flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-black"
                            >
                                {loading ? "Processing..." : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
