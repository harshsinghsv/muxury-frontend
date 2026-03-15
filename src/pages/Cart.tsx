import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/Icon";
import { COPY } from "@/config/constants";

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
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 md:pb-12 z-0">


            <main className="flex-1 px-5 md:px-12 lg:px-24 xl:px-32 md:pt-12">
                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between mb-8">
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434]">{COPY.cart.title}</h1>
                    <span className="font-['DM_Sans'] text-[#999999]">{items.length} {COPY.cart.itemsSuffix}</span>
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-center mt-20 bg-white md:bg-transparent rounded-3xl md:border md:border-[#EBEBEB] md:py-32">
                        <div className="w-20 h-20 bg-[#F5F0EE] rounded-full flex items-center justify-center mb-6">
                            <Icon name="bag" size="w-8 h-8" className="text-[#CA8385]" />
                        </div>
                        <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-2">{COPY.cart.emptyState.title}</h2>
                        <p className="font-['DM_Sans'] text-[#999999] text-base mb-8 max-w-sm">
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
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                        {/* Cart Items List */}
                        <div className="flex flex-col gap-5 md:w-2/3">
                            {items.map((item) => (
                                <div
                                    key={`${item.product.id}-${item.selectedSize}`}
                                    className="flex gap-4 md:gap-6 items-center bg-white p-3 md:p-5 rounded-2xl border border-[#EBEBEB] group"
                                >
                                    {/* Product Image */}
                                    <Link
                                        to={`/product/${item.product.id}`}
                                        className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] flex-shrink-0 bg-[#F5F0EE] overflow-hidden rounded-xl"
                                    >
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-['Playfair_Display'] text-sm md:text-xl font-bold text-[#343434] truncate mb-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="font-['DM_Sans'] text-xs md:text-sm text-[#999999] mb-1">
                                                    Size: <span className="text-[#343434] font-medium">{item.selectedSize}</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                                className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center text-[#999999] hover:text-[#CA8385] hover:bg-white border border-[#EBEBEB] md:border-transparent hover:border-[#CA8385] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#CA8385]"
                                            >
                                                <Icon name="close" size="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 md:mt-2">
                                            <span className="font-['DM_Sans'] font-bold text-[#343434] text-sm md:text-lg">
                                                ₹{item.product.price.toFixed(2)}
                                            </span>
                                            {/* Stepper */}
                                            <div className="flex items-center bg-[#F5F0EE] md:bg-white md:border md:border-[#EBEBEB] rounded-full px-2 lg:px-3 py-1 lg:py-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity - 1)}
                                                    className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-[#343434] bg-white rounded-full shadow-sm md:shadow-none md:border md:border-[#EBEBEB] active:scale-95 transition-transform hover:border-[#343434] focus:outline-none focus:ring-2 focus:ring-[#CA8385]"
                                                >
                                                    <Icon name="close" size="w-3 h-3 md:w-4 md:h-4" />
                                                </button>
                                                <span className="font-['DM_Sans'] text-[#343434] text-base md:text-sm font-medium w-10 md:w-12 text-center block">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity + 1)}
                                                    className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-white bg-[#343434] rounded-full shadow-sm md:shadow-none active:scale-95 transition-transform hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#343434]"
                                                >
                                                    <Icon name="plus" size="w-3 h-3 md:w-4 md:h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary (Desktop Side / Mobile Sticky Bottom) */}
                        <div className="md:w-1/3 flex-shrink-0">
                            <div className="sticky top-[120px] bg-white rounded-t-3xl md:rounded-3xl border border-[#EBEBEB] p-5 md:p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-sm z-20 fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] md:static md:w-auto md:translate-x-0">
                                <h3 className="hidden md:block font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-6">{COPY.cart.summary.title}</h3>

                                <div className="hidden md:flex items-center justify-between mb-4">
                                    <span className="font-['DM_Sans'] text-sm text-[#999999]">{COPY.cart.summary.subtotal} ({items.length} {COPY.cart.itemsSuffix})</span>
                                    <span className="font-['DM_Sans'] text-sm font-medium text-[#343434]">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="hidden md:flex items-center justify-between mb-6 pb-6 border-b border-[#EBEBEB]">
                                    <span className="font-['DM_Sans'] text-sm text-[#999999]">{COPY.cart.summary.shipping}</span>
                                    <span className="font-['DM_Sans'] text-sm font-medium text-[#CA8385]">{COPY.cart.summary.shippingCalculated}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4 flex-row md:mb-8">
                                    <span className="font-['DM_Sans'] text-sm font-medium text-[#999999] md:text-base md:text-[#343434]">{COPY.cart.summary.totalTax}</span>
                                    <span className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#343434]">₹{subtotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full h-14 md:h-16 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium text-sm md:text-base flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                >
                                    {COPY.cart.summary.checkoutCta}
                                    <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 ml-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
