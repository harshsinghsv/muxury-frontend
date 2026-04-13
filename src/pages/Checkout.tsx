import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { COPY } from "@/config/constants";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";
import { Buildings, MapPoint, SafeSquare, Card, Wallet, Smartphone, ShieldCheck } from "@solar-icons/react";

const DUMMY_ORDER_ID = "MUX-" + Math.floor(100000 + Math.random() * 900000);

const Checkout = () => {
    const navigate = useNavigate();
    const { items, subtotal, mrpTotal, itemDiscount, shipping, total, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    
    // UI states
    const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NB" | "EMI" | "COD">("UPI");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showRazorpayMock, setShowRazorpayMock] = useState(false);

    // Form logic
    const handlePlaceOrder = async () => {
        if (paymentMethod === "COD") {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setOrderComplete(true);
                clearCart();
                toast.success("Order placed successfully via COD");
            }, 1500);
        } else {
            // Trigger Dummy Razorpay
            setShowRazorpayMock(true);
        }
    };

    const handleMockPaymentSuccess = () => {
        setShowRazorpayMock(false);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOrderComplete(true);
            clearCart();
            toast.success("Payment successful!");
        }, 800);
    };

    if (items.length === 0 && !orderComplete) {
        navigate("/cart");
        return null;
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center z-0">
                <div className="w-20 h-20 bg-[#46D27E] rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434] mb-3">
                    {COPY.checkout.success.title}
                </h1>
                <p className="font-['DM_Sans'] text-[#999999] text-sm md:text-base mb-8 max-w-[280px] md:max-w-md">
                    {COPY.checkout.success.description}
                </p>
                <div className="bg-[#FAF8F7] w-full max-w-sm rounded-2xl p-6 mb-8 border border-[#EBEBEB]">
                    <p className="font-['DM_Sans'] text-xs text-[#999999] uppercase tracking-wider mb-1">
                        Track your order with ID
                    </p>
                    <p className="font-['Playfair_Display'] text-lg text-[#343434] font-medium">
                        {DUMMY_ORDER_ID}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="w-full max-w-xs bg-[#343434] text-white font-['DM_Sans'] text-sm md:text-base font-medium py-4 min-h-[44px] rounded-full active:scale-95 transition-transform hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#343434] focus:ring-offset-2"
                >
                    {COPY.checkout.success.cta}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 md:pb-12 z-0 relative">

            {/* Fake Razorpay Modal */}
            {showRazorpayMock && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="bg-[#191D26] p-5 flex items-center justify-between text-white">
                            <div>
                                <h4 className="font-semibold text-lg font-['DM_Sans']">Muxury India</h4>
                                <p className="text-sm opacity-80">Order {DUMMY_ORDER_ID}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-xl">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <p className="text-sm text-gray-500 font-['DM_Sans'] text-center">Do not refresh. Simulating Razorpay gateway...</p>
                            
                            <div className="border border-[#EBEBEB] p-4 rounded-lg flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#343434]">Test Mode Payment</p>
                                    <p className="text-xs text-gray-500">Approve to simulate success</p>
                                </div>
                            </div>

                            <button onClick={handleMockPaymentSuccess} className="w-full bg-[#1A8BEF] py-3 text-white font-bold rounded shadow active:scale-95 transition-transform mt-2">
                                Simulate Success
                            </button>
                            <button onClick={() => setShowRazorpayMock(false)} className="w-full bg-gray-200 py-3 text-gray-700 font-bold rounded shadow active:scale-95 transition-transform">
                                Cancel Payment
                            </button>
                        </div>
                        <div className="bg-gray-100 p-2 text-center text-xs text-gray-400">Secured by Razorpay</div>
                    </div>
                </div>
            )}


            <main className="flex-1 px-5 md:px-12 lg:px-24 xl:px-32 md:pt-12">
                {/* Desktop Header */}
                <div className="hidden md:block mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-['DM_Sans'] text-sm text-[#999999] hover:text-[#343434] transition-colors mb-6 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#999999] rounded">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        {COPY.checkout.backToCart}
                    </button>
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#343434]">{COPY.checkout.title}</h1>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Forms Section */}
                    <div className="md:w-3/5 flex flex-col gap-6 md:gap-8 border-b-2 md:border-b-0 pb-8 border-[#EBEBEB]">
                        
                        {/* 1. Email & Phone (Auth Sync) */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 md:p-8 shadow-sm">
                            <h2 className="font-['Playfair_Display'] text-lg md:text-xl font-bold text-[#343434] mb-4 border-b border-[#EBEBEB] pb-3">1. Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="email" placeholder="Email Address" defaultValue="demo@muxury.com" className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] font-['DM_Sans'] text-sm focus:outline-none focus:border-[#343434]" />
                                <input type="tel" placeholder="Mobile Number" defaultValue={user?.phone || ""} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] font-['DM_Sans'] text-sm focus:outline-none focus:border-[#343434]" />
                            </div>
                        </div>

                        {/* 2. Shipping Address */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-4 border-b border-[#EBEBEB] pb-3">
                                <h2 className="font-['Playfair_Display'] text-lg md:text-xl font-bold text-[#343434]">2. Shipping Address</h2>
                            </div>
                            
                            {!showAddressForm ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-[#343434] bg-[#FAFAFA]">
                                        <div className="w-5 h-5 rounded-full border-[6px] border-[#343434] bg-white flex-shrink-0 mt-1 cursor-pointer"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <p className="font-['DM_Sans'] text-sm md:text-base font-bold text-[#343434]">Home</p>
                                                <span className="font-['DM_Sans'] text-[10px] bg-[#EBEBEB] px-2 py-0.5 rounded text-[#343434]">DEFAULT</span>
                                            </div>
                                            <p className="font-['DM_Sans'] text-xs md:text-sm text-[#999999] leading-relaxed mt-1">
                                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Harsh Singh"}<br />
                                                Flat 402, Radiant Heights, Outer Ring Road<br />
                                                Bengaluru, Karnataka - 560103
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAddressForm(true)} className="mt-2 text-sm font-bold text-[#CA8385] flex items-center justify-center gap-2 border border-[#EBEBEB] rounded-xl h-12">
                                        + Add New Address
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] md:col-span-2 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#343434]" />
                                    <input type="text" placeholder="Pincode" maxLength={6} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] font-['DM_Sans'] text-sm focus:outline-none focus:border-[#343434]" />
                                    <input type="text" placeholder="City / District" className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] font-['DM_Sans'] text-sm bg-[#fafafa] focus:outline-none focus:border-[#343434]" readOnly />
                                    <input type="text" placeholder="State" className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] font-['DM_Sans'] text-sm bg-[#fafafa] focus:outline-none focus:border-[#343434]" readOnly />
                                    <input type="text" placeholder="Street Address / Room No." className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] md:col-span-2 font-['DM_Sans'] text-sm focus:outline-none focus:border-[#343434]" />
                                    <div className="flex gap-4 md:col-span-2 mt-2">
                                        <button onClick={() => setShowAddressForm(false)} className="flex-1 h-12 bg-white border border-[#EBEBEB] text-[#343434] rounded-xl font-bold">Cancel</button>
                                        <button onClick={() => setShowAddressForm(false)} className="flex-1 h-12 bg-[#343434] text-white rounded-xl font-bold">Save Address</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Payment Method */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm overflow-hidden">
                            <div className="p-5 md:p-8 border-b border-[#EBEBEB]">
                                <h2 className="font-['Playfair_Display'] text-lg md:text-xl font-bold text-[#343434]">3. Payment Method</h2>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 bg-[#FAF8F7] border-r border-[#EBEBEB] flex flex-col font-['DM_Sans']">
                                    <button onClick={() => setPaymentMethod("UPI")} className={`p-4 flex items-center gap-3 text-sm font-bold ${paymentMethod === "UPI" ? 'bg-white text-[#CA8385] border-l-4 border-[#CA8385]' : 'text-[#999999] hover:bg-white'} border-b border-[#EBEBEB]`}>
                                        <Smartphone size={20}/> UPI
                                    </button>
                                    <button onClick={() => setPaymentMethod("CARD")} className={`p-4 flex items-center gap-3 text-sm font-bold ${paymentMethod === "CARD" ? 'bg-white text-[#CA8385] border-l-4 border-[#CA8385]' : 'text-[#999999] hover:bg-white'} border-b border-[#EBEBEB]`}>
                                        <Card size={20}/> Cards
                                    </button>
                                    <button onClick={() => setPaymentMethod("NB")} className={`p-4 flex items-center gap-3 text-sm font-bold ${paymentMethod === "NB" ? 'bg-white text-[#CA8385] border-l-4 border-[#CA8385]' : 'text-[#999999] hover:bg-white'} border-b border-[#EBEBEB]`}>
                                        <SafeSquare size={20}/> Net Banking
                                    </button>
                                    <button onClick={() => setPaymentMethod("EMI")} className={`p-4 flex items-center gap-3 text-sm font-bold ${paymentMethod === "EMI" ? 'bg-white text-[#CA8385] border-l-4 border-[#CA8385]' : 'text-[#999999] hover:bg-white'} border-b border-[#EBEBEB]`}>
                                        <Wallet size={20}/> EMI
                                    </button>
                                    <button onClick={() => setPaymentMethod("COD")} className={`p-4 flex items-center gap-3 text-sm font-bold ${paymentMethod === "COD" ? 'bg-white text-[#CA8385] border-l-4 border-[#CA8385]' : 'text-[#999999] hover:bg-white'}`}>
                                        <Buildings size={20}/> Cash on Delivery
                                    </button>
                                </div>
                                <div className="md:w-2/3 p-5 md:p-8 min-h-[200px] flex items-center justify-center bg-white">
                                    {paymentMethod === "UPI" && (
                                        <div className="text-center w-full">
                                            <p className="text-sm font-bold mb-4">Pay instantly using UPI apps</p>
                                            <div className="flex justify-center gap-3 mb-4 opacity-50">
                                                <div className="px-3 py-1 border border-gray-200 rounded font-bold text-xs">GPay</div>
                                                <div className="px-3 py-1 border border-gray-200 rounded font-bold text-xs">PhonePe</div>
                                                <div className="px-3 py-1 border border-gray-200 rounded font-bold text-xs">Paytm</div>
                                            </div>
                                            <p className="text-xs text-[#999999]">You will be redirected to Razorpay Gateway</p>
                                        </div>
                                    )}
                                    {paymentMethod === "CARD" && (
                                        <div className="text-center w-full">
                                            <p className="text-sm font-bold mb-2">Credit / Debit Cards</p>
                                            <p className="text-xs text-[#999999]">Visa, MasterCard, RuPay, Maestro supported.</p>
                                        </div>
                                    )}
                                    {paymentMethod === "NB" && (
                                        <div className="text-center w-full">
                                            <p className="text-sm font-bold mb-2">Net Banking</p>
                                            <p className="text-xs text-[#999999]">All major Indian banks supported.</p>
                                        </div>
                                    )}
                                    {paymentMethod === "EMI" && (
                                        <div className="text-center w-full">
                                            <p className="text-sm font-bold mb-2">EMI Options</p>
                                            <p className="text-xs text-[#999999]">Available on HDFC, ICICI, SBI, and others.</p>
                                        </div>
                                    )}
                                    {paymentMethod === "COD" && (
                                        <div className="text-center w-full">
                                            <div className="mx-auto w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <p className="text-sm font-bold mb-2">Cash on Delivery Available</p>
                                            <p className="text-xs text-[#999999]">Pay with cash upon delivery of your order.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="md:w-2/5 flex flex-col">
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 md:p-8 shadow-sm md:sticky md:top-[120px]">
                            <h2 className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-[#343434] mb-6 border-b border-[#EBEBEB] pb-4">Order Summary</h2>

                            <div className="flex flex-col gap-4 mb-6 max-h-[250px] overflow-y-auto pr-2 border-b border-[#EBEBEB] pb-6">
                                {items.map((item) => (
                                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4">
                                        <div className="w-16 h-20 bg-[#F5F0EE] overflow-hidden flex-shrink-0 relative rounded border border-gray-100">
                                            <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#343434] text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-['DM_Sans'] text-sm font-bold text-[#343434] truncate mb-0.5">{item.product.name}</h3>
                                            <p className="font-['DM_Sans'] text-xs text-[#999999] mb-1">Size: {item.selectedSize}</p>
                                            <span className="font-['DM_Sans'] text-sm font-bold text-[#343434]">₹{(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Detailed Totals Matching Cart */}
                            <div className="font-['DM_Sans']">
                                <div className="flex justify-between mb-3 text-sm text-[#343434]">
                                    <span>Total MRP</span>
                                    <span>₹{mrpTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between mb-3 text-sm text-[#46D27E]">
                                    <span>Discount on MRP</span>
                                    <span>-₹{itemDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between mb-4 pb-4 border-b border-[#EBEBEB] text-sm text-[#343434]">
                                    <span>Shipping Fee</span>
                                    <span className={shipping === 0 ? "text-[#46D27E] font-bold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                                </div>
                                
                                <div className="flex items-center justify-between font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-8">
                                    <span>Total Amount</span>
                                    <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>

                                <LoadingButton
                                    onClick={handlePlaceOrder}
                                    loading={loading}
                                    loadingText="Processing..."
                                    className="w-full !mt-8 shadow-md"
                                >
                                    {paymentMethod === "COD" ? "Place Order" : `Pay ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                </LoadingButton>
                                <p className="text-center font-['DM_Sans'] text-xs text-[#999999] mt-3">Secured by Razorpay</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
