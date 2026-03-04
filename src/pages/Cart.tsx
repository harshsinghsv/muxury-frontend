import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const Cart = () => {
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity, subtotal } = useCart();

    const isEmpty = items.length === 0;

    const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
        if (newQuantity > 0) {
            updateQuantity(productId, size, newQuantity);
        }
    };

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
                    My Cart
                </h1>
                <button className="w-10 h-10 border border-[#EBEBEB] rounded-full flex items-center justify-center bg-white active:scale-95 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
            </div>

            <main className="flex-1 px-5">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-center mt-20">
                        <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">Your cart is empty</h2>
                        <p className="font-['DM_Sans'] text-[#999999] text-sm mb-8">
                            Looks like you haven't added anything yet.
                        </p>
                        <Link
                            to="/shop"
                            className="bg-[#343434] text-white font-['DM_Sans'] text-sm font-medium px-8 py-3.5 rounded-full"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {/* Cart Items List */}
                        {items.map((item) => (
                            <div
                                key={`${item.product.id}-${item.selectedSize}`}
                                className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-[#EBEBEB]"
                            >
                                {/* Product Image */}
                                <Link
                                    to={`/product/${item.product.id}`}
                                    className="w-[80px] h-[80px] flex-shrink-0 bg-[#F5F0EE] overflow-hidden rounded-xl"
                                >
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-['Playfair_Display'] text-sm font-bold text-[#343434] truncate">
                                                {item.product.name}
                                            </h3>
                                            <p className="font-['DM_Sans'] text-xs text-[#999999] mb-1">
                                                Size: {item.selectedSize}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                            className="w-6 h-6 rounded-full bg-[#FAF8F7] flex items-center justify-center text-[#343434] active:scale-95 transition-transform"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-['DM_Sans'] font-bold text-[#343434] text-sm">
                                            ₹{item.product.price.toFixed(2)}
                                        </span>
                                        {/* Stepper */}
                                        <div className="flex items-center bg-[#F5F0EE] rounded-full px-2 py-1">
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center text-[#343434] bg-white rounded-full shadow-sm active:scale-95 transition-transform"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                            <span className="font-['DM_Sans'] text-[#343434] text-sm font-medium w-8 text-center block">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center text-white bg-[#343434] rounded-full shadow-sm active:scale-95 transition-transform"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Total Sticky Bottom Footer */}
            {!isEmpty && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white rounded-t-3xl border-t border-[#EBEBEB] p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-['DM_Sans'] text-sm font-medium text-[#999999]">Total (Inc. Tax)</span>
                        <span className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => navigate("/checkout")}
                        className="w-full h-14 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-black"
                    >
                        Checkout
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
