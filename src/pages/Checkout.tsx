import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const Checkout = () => {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center z-0">
                <div className="w-20 h-20 bg-[#CA8385] rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434] mb-3">
                    Order Confirmed
                </h1>
                <p className="font-['DM_Sans'] text-[#999999] text-sm mb-8 max-w-[280px]">
                    Your beautifully crafted order will be on its way to you shortly.
                </p>
                <div className="bg-[#FAF8F7] w-full rounded-2xl p-6 mb-8 border border-[#EBEBEB]">
                    <p className="font-['DM_Sans'] text-xs text-[#999999] uppercase tracking-wider mb-1">
                        Order Number
                    </p>
                    <p className="font-['Playfair_Display'] text-lg text-[#343434] font-medium">
                        {orderId}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="w-full bg-[#343434] text-white font-['DM_Sans'] text-sm font-medium py-4 rounded-full active:scale-95 transition-transform"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-8 mb-6">
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

            <main className="flex-1 px-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-['Playfair_Display'] text-lg font-bold text-[#343434]">Shipping Address</h2>
                            <button type="button" className="text-[#CA8385] font-['DM_Sans'] text-sm font-medium">Edit</button>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center flex-shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div>
                                <p className="font-['DM_Sans'] text-sm font-bold text-[#343434]">Home</p>
                                <p className="font-['DM_Sans'] text-xs text-[#999999] leading-relaxed mt-1">
                                    1901 Thornridge Cir. Shiloh, Hawaii 81063
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order List */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                        <h2 className="font-['Playfair_Display'] text-lg font-bold text-[#343434] mb-4">Order List</h2>
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-xl bg-[#F5F0EE] overflow-hidden">
                                        <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-['Playfair_Display'] text-sm font-bold text-[#343434] truncate">{item.product.name}</h3>
                                        <p className="font-['DM_Sans'] text-xs text-[#999999]">Size: {item.selectedSize}</p>
                                    </div>
                                    <span className="font-['DM_Sans'] text-sm font-bold text-[#343434]">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Checkbox for delivery */}
                    <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 rounded border-[#EBEBEB] text-[#343434] focus:ring-[#343434]" />
                        <span className="font-['DM_Sans'] text-sm text-[#343434]">Same as shipping address</span>
                    </label>
                </form>
            </main>

            {/* Total Sticky Bottom Footer */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white rounded-t-3xl border-t border-[#EBEBEB] p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-['DM_Sans'] text-sm text-[#999999]">Subtotal</span>
                    <span className="font-['DM_Sans'] text-sm font-medium text-[#343434]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="font-['DM_Sans'] text-sm text-[#999999]">Delivery</span>
                    <span className="font-['DM_Sans'] text-sm font-medium text-[#343434]">₹10.00</span>
                </div>
                <div className="w-full h-px bg-[#EBEBEB] mb-4"></div>
                <div className="flex items-center justify-between mb-4">
                    <span className="font-['DM_Sans'] text-sm font-medium text-[#999999]">Total Payment</span>
                    <span className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">₹{(subtotal + 10).toFixed(2)}</span>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-14 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-black"
                >
                    {loading ? "Processing..." : "Place Order"}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
