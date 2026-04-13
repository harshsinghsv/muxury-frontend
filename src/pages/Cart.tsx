import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { COPY } from "@/config/constants";
import { TrashBinMinimalistic, DangerCircle, CloseCircle, Tag } from "@solar-icons/react";
import { toast } from "sonner";
import Icon from "@/components/Icon";
import LoadingButton from "@/components/LoadingButton";

const Cart = () => {
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity, mrpTotal, itemDiscount, shipping, total } = useCart();
    
    // Mock Coupon Logic
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const isEmpty = items.length === 0;

    const handleQuantityChange = (productId: string, size: string, newQuantity: number, stock: number) => {
        if (newQuantity <= 0) return;
        if (newQuantity > stock) {
            toast.error(`Only ${stock} items available in stock`);
            return;
        }
        updateQuantity(productId, size, newQuantity);
    };

    const handleApplyCoupon = () => {
        if (!couponInput) return;
        if (couponInput.toUpperCase() === "MUXURY100") {
            setAppliedCoupon({ code: "MUXURY100", discount: 100 });
            toast.success("Coupon MUXURY100 applied successfully!");
        } else if (couponInput.toUpperCase() === "SALE200") {
            setAppliedCoupon({ code: "SALE200", discount: 200 });
            toast.success("Coupon SALE200 applied successfully!");
        } else {
            toast.error("Invalid or expired coupon code");
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput("");
        toast.info("Coupon removed");
    };

    const handleCheckoutRedirect = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            navigate("/checkout");
            setIsCheckingOut(false);
        }, 1000);
    };

    const finalTotal = total - (appliedCoupon?.discount || 0);

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 md:pb-12 z-0 relative">

            <main className="flex-1 px-5 md:px-12 lg:px-24 xl:px-32 md:pt-12">
                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between mb-8">
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434]">{COPY.cart.title}</h1>
                    <span className="font-['DM_Sans'] text-[#999999]">{items.length} {COPY.cart.itemsSuffix}</span>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden flex items-center mb-6 pt-4">
                    <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">My Cart ({items.length})</h1>
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-center mt-10 md:mt-20 bg-white md:bg-transparent rounded-3xl md:border md:border-[#EBEBEB] py-16 md:py-32">
                        <div className="w-20 h-20 bg-[#F5F0EE] rounded-full flex items-center justify-center mb-6">
                            <Icon name="bag" size="w-8 h-8" className="text-[#CA8385]" />
                        </div>
                        <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-2">{COPY.cart.emptyState.title}</h2>
                        <p className="font-['DM_Sans'] text-[#999999] text-sm md:text-base mb-8 max-w-xs md:max-w-sm">
                            {COPY.cart.emptyState.description}
                        </p>
                        <Link
                            to="/shop"
                            className="bg-[#343434] text-white font-['DM_Sans'] text-sm font-medium px-8 py-4 min-h-[44px] rounded-full hover:bg-black transition-colors focus:ring-2 focus:ring-[#343434] focus:ring-offset-2 outline-none"
                        >
                            {COPY.cart.emptyState.cta}
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 pb-20 md:pb-0">
                        {/* Cart Items List */}
                        <div className="flex flex-col gap-5 md:w-2/3">
                            {items.map((item) => {
                                const originalPrice = item.product.originalPrice || item.product.price * 1.35;
                                const itemSavings = (originalPrice - item.product.price) * item.quantity;
                                const isOutOfStock = item.product.stock === 0;

                                return (
                                    <div
                                        key={`${item.product.id}-${item.selectedSize}`}
                                        className={`flex gap-4 md:gap-6 items-start bg-white p-4 md:p-5 rounded-2xl border ${isOutOfStock ? 'border-[#EF5050]/30 bg-[#EF5050]/5' : 'border-[#EBEBEB]'} group`}
                                    >
                                        {/* Product Image */}
                                        <Link
                                            to={`/product/${item.product.id}`}
                                            className="w-[90px] h-[120px] md:w-[140px] md:h-[180px] flex-shrink-0 bg-[#F5F0EE] overflow-hidden rounded-xl"
                                        >
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className={`w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className={`font-['Playfair_Display'] text-base md:text-xl font-bold truncate mb-1 ${isOutOfStock ? 'text-[#999999]' : 'text-[#343434]'}`}>
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="font-['DM_Sans'] text-xs md:text-sm text-[#999999] mb-2">
                                                        Size: <span className="font-medium text-[#343434]">{item.selectedSize}</span> | Color: <span className="font-medium text-[#343434]">Default</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Price Section */}
                                            <div className="mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-['DM_Sans'] font-bold text-lg md:text-xl ${isOutOfStock ? 'text-[#999999]' : 'text-[#343434]'}`}>
                                                        ₹{item.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                    <span className="font-['DM_Sans'] text-sm text-[#999999] line-through">
                                                        ₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                                <p className="font-['DM_Sans'] text-xs font-bold text-[#46D27E] mt-1">
                                                    You save ₹{itemSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                            </div>

                                            {/* Actions & Alerts */}
                                            {isOutOfStock ? (
                                                <div className="mt-auto flex items-center justify-between">
                                                    <p className="flex items-center gap-1 font-['DM_Sans'] text-xs font-bold text-[#EF5050]">
                                                        <DangerCircle size={14} /> Out of Stock
                                                    </p>
                                                    <button onClick={() => removeFromCart(item.product.id, item.selectedSize)} className="text-[#999999] hover:text-[#CA8385] text-xs font-bold flex items-center gap-1">
                                                        <TrashBinMinimalistic size={16} /> Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between mt-auto">
                                                    {/* Stepper */}
                                                    <div className="flex items-center bg-white border border-[#EBEBEB] rounded-full h-10 px-3">
                                                        <button onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity - 1, item.product.stock)} className="text-[#343434] hover:text-[#CA8385] font-bold px-1">−</button>
                                                        <span className="font-['DM_Sans'] text-[#343434] text-sm font-bold w-8 text-center">{item.quantity}</span>
                                                        <button onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity + 1, item.product.stock)} className="text-[#343434] hover:text-[#CA8385] font-bold px-1">+</button>
                                                    </div>
                                                    
                                                    <button onClick={() => removeFromCart(item.product.id, item.selectedSize)} className="text-[#999999] hover:text-[#EF5050] p-2 rounded-full transition-colors active:bg-[#EF5050]/10">
                                                        <TrashBinMinimalistic size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Form & Totals */}
                        <div className="md:w-1/3 flex-shrink-0">
                            <div className="sticky top-[120px] mb-6">
                                
                                {/* Coupon Block */}
                                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 mb-5 shadow-sm">
                                    <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3 flex items-center gap-2"><Tag size={18} /> Apply Coupons</p>
                                    
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between bg-[#46D27E]/10 border border-[#46D27E]/30 rounded-xl p-3">
                                            <div className="flex items-center gap-2">
                                                <Tag size={18} className="text-[#46D27E]"/>
                                                <div>
                                                    <p className="font-['DM_Sans'] text-xs font-bold text-[#46D27E] uppercase">{appliedCoupon.code}</p>
                                                    <p className="font-['DM_Sans'] text-[10px] text-[#46D27E]">Saved ₹{appliedCoupon.discount}</p>
                                                </div>
                                            </div>
                                            <button onClick={removeCoupon} className="text-[#999999] hover:text-[#EF5050]">
                                                <CloseCircle size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter coupon code" 
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                className="flex-1 px-4 h-11 border border-[#EBEBEB] rounded-xl font-['DM_Sans'] text-sm uppercase focus:outline-none focus:border-[#343434]"
                                            />
                                            <button 
                                                onClick={handleApplyCoupon}
                                                className="px-5 bg-white border border-[#343434] text-[#343434] font-['DM_Sans'] text-sm font-bold rounded-xl hover:bg-[#FAF8F7] transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                    <p className="mt-3 font-['DM_Sans'] text-xs text-[#999999]">Hint: Try <span className="font-bold text-[#CA8385]">MUXURY100</span> or <span className="font-bold text-[#CA8385]">SALE200</span></p>
                                </div>

                                {/* Price Details */}
                                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-sm">
                                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#343434] mb-4 pb-4 border-b border-[#EBEBEB]">Price Details ({items.length} Items)</h3>

                                    <div className="font-['DM_Sans']">
                                        <div className="flex justify-between mb-3 text-sm text-[#343434]">
                                            <span>Total MRP</span>
                                            <span>₹{mrpTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between mb-3 text-sm text-[#46D27E]">
                                            <span>Discount on MRP</span>
                                            <span>-₹{itemDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between mb-3 text-sm text-[#CA8385]">
                                                <span>Coupon Discount</span>
                                                <span>-₹{appliedCoupon.discount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between mb-4 pb-4 border-b border-[#EBEBEB] text-sm text-[#343434]">
                                            <span>Shipping Fee</span>
                                            <span className={shipping === 0 ? "text-[#46D27E] font-bold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-4">
                                            <span>Total Amount</span>
                                            <span>₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>

                                        <p className="text-xs text-[#46D27E] font-bold mb-6 bg-[#46D27E]/10 px-3 py-2 rounded-lg text-center">
                                            You will save ₹{(itemDiscount + (appliedCoupon?.discount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} on this order
                                        </p>

                                        <LoadingButton
                                            onClick={handleCheckoutRedirect}
                                            loading={isCheckingOut}
                                            loadingText="Preparing Checkout..."
                                            className="w-full !mt-6 shadow-md"
                                        >
                                            Place Order
                                        </LoadingButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
