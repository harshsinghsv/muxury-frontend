import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { Refresh, Heart, Share, MapPoint, ShieldCheck, Tag, ChatSquare2 } from "@solar-icons/react";
import { COPY } from "@/config/constants";
import { getProductReviews } from "@/data/products";

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(id || "");
    const { addToCart } = useCart();
    const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("#C8A882");
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    
    // Pincode mock
    const [pincode, setPincode] = useState("");
    const [deliveryMsg, setDeliveryMsg] = useState("");

    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex justify-center items-center">
                <Refresh className="w-8 h-8 text-[#CA8385] animate-spin" weight="Outline" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center pb-20">
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-2">{COPY.productDetails.notFound.title}</h1>
                <p className="font-['DM_Sans'] text-[#999999] mb-6">{COPY.productDetails.notFound.description}</p>
                <button onClick={() => navigate("/shop")} className="bg-[#343434] text-white px-6 py-3 min-h-[44px] rounded-full font-['DM_Sans'] text-sm hover:bg-black transition-colors">
                    {COPY.productDetails.notFound.cta}
                </button>
            </div>
        );
    }

    const needsSizeSelection = product.sizes.length > 0 && product.sizes[0] !== "One Size";
    const colors = ['#C8A882', '#4A4E5A', '#343434', '#FFFFFF'];
    const isWishlisted = wishlistItems.includes(product.id);
    const originalPrice = product.originalPrice || product.price * 1.35;
    const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
    const savings = originalPrice - product.price;

    const stockMsg = product.stock === 0 ? "Out of Stock" : product.stock < 5 ? `Only ${product.stock} left in stock!` : "In Stock";
    const stockColor = product.stock === 0 ? "text-[#EF5050]" : product.stock < 5 ? "text-[#E6B15C]" : "text-[#46D27E]";

    const handleAddToCart = (buyNow = false) => {
        if (needsSizeSelection && !selectedSize) {
            toast.error(COPY.productDetails.toast.selectSize);
            return;
        }
        if (buyNow) setIsBuying(true);
        else setIsAdding(true);

        setTimeout(() => {
            addToCart(product, quantity, selectedSize || product.sizes[0] || "One Size");
            if (buyNow) setIsBuying(false);
            else setIsAdding(false);
            
            if (buyNow) {
                navigate("/checkout");
            } else {
                toast.success(COPY.productDetails.toast.addedToCart);
            }
        }, 400);
    };

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist(product.id);
            toast.success("Added to wishlist");
        }
    };

    const checkPincode = () => {
        if (pincode.length !== 6) {
            toast.error("Enter a valid 6-digit Indian PIN Code");
            return;
        }
        setDeliveryMsg(`Delivery by ${new Date(Date.now() + 86400000 * 3).toLocaleDateString()} to ${pincode}`);
    };

    const reviews = getProductReviews(product.id);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-12 z-0 relative md:pt-12 md:max-w-6xl md:mx-auto md:px-5">
            <div className="md:flex md:gap-12 lg:gap-20">
                {/* Image Section */}
                <div className="md:w-1/2 flex-shrink-0">
                    <div className="relative w-full md:rounded-3xl overflow-hidden md:h-[calc(100vh-160px)] md:sticky md:top-[120px]" style={{ height: window.innerWidth < 768 ? '55vh' : undefined }}>
                        <img src={product.images[selectedImage]} className="w-full h-full object-cover" alt="Product" />

                        {/* Mobile Floating header overlaid on image */}
                        <div className="md:hidden absolute top-12 left-0 right-0 flex items-center justify-between px-5">
                            <button onClick={() => navigate(-1)} className="w-11 h-11 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </button>
                            <h1 className="font-['Playfair_Display'] text-lg font-medium text-white drop-shadow">{COPY.productDetails.title}</h1>
                            <button onClick={toggleWishlist} className="w-11 h-11 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform">
                                <Heart size={20} className={isWishlisted ? "text-[#CA8385]" : "text-white"} weight={isWishlisted ? "Bold" : "Outline"} />
                            </button>
                        </div>

                        {/* Prev/Next arrows & Thumbnails */}
                        {product.images.length > 1 && (
                            <>
                                <button onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/60 md:bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors">‹</button>
                                <button onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/60 md:bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors">›</button>

                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                                    {product.images.map((img, i) => (
                                        <button key={i} onClick={() => setSelectedImage(i)} className={`w-12 h-16 rounded-md overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-[#CA8385]' : 'border-transparent shadow-sm'}`}>
                                            <img src={img} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                        
                        {/* Desktop Wishlist & Share buttons */}
                        <div className="hidden md:flex absolute top-5 right-5 gap-3">
                            <button onClick={() => toast.success("Link copied to clipboard")} className="w-11 h-11 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white hover:text-[#CA8385] transition-colors shadow-sm">
                                <Share size={20} weight="Outline" />
                            </button>
                            <button onClick={toggleWishlist} className="w-11 h-11 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors shadow-sm">
                                <Heart size={20} className={isWishlisted ? "text-[#CA8385]" : "text-[#343434] hover:text-[#CA8385]"} weight={isWishlisted ? "Bold" : "Outline"} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 md:pt-8 bg-white md:bg-transparent rounded-t-3xl -mt-6 md:mt-0 relative px-5 pt-5 pb-28 md:pb-0 min-h-[50vh] flex flex-col">

                    {/* Desktop breadcrumb */}
                    <div className="hidden md:flex items-center gap-2 font-['DM_Sans'] text-sm text-[#999999] mb-6">
                        <button onClick={() => navigate('/shop')} className="hover:text-[#343434] transition-colors">{COPY.productDetails.breadcrumbs.home}</button>
                        <span>/</span>
                        <span className="text-[#343434] capitalize">{product.category}</span>
                        <span>/</span>
                        <span className="text-[#343434] truncate">{product.name}</span>
                    </div>

                    <p className="font-['DM_Sans'] text-xs font-bold tracking-widest uppercase text-[#CA8385] mb-2">{product.category}</p>
                    <h2 className="font-['Playfair_Display'] text-2xl md:text-4xl font-bold text-[#343434] mb-3">{product.name}</h2>
                    
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#EBEBEB]">
                        <div className="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E6B15C" stroke="#E6B15C" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span className="font-['DM_Sans'] text-sm font-bold text-[#343434]">{product.rating}</span>
                            <span className="font-['DM_Sans'] text-xs text-[#CA8385] cursor-pointer hover:underline">({product.reviewsCount} {COPY.productDetails.labels.reviews})</span>
                        </div>
                        <span className="text-[#EBEBEB]">|</span>
                        <span className={`font-['DM_Sans'] text-sm font-bold ${stockColor}`}>{stockMsg}</span>
                    </div>

                    <div className="mb-6">
                        <div className="flex gap-3 items-baseline mb-1">
                            <span className="font-['Playfair_Display'] text-3xl font-bold text-[#343434]">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="font-['DM_Sans'] text-lg text-[#999999] line-through">₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="font-['DM_Sans'] text-sm font-bold text-[#46D27E] ml-1">{discountPercent}% OFF</span>
                        </div>
                        <p className="font-['DM_Sans'] text-xs text-[#46D27E] my-1 font-medium bg-[#46D27E]/10 w-fit px-2 py-1 rounded">You save ₹{savings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="font-['DM_Sans'] text-xs text-[#999999] mt-2">Inclusive of all taxes</p>
                    </div>

                    {needsSizeSelection && (
                        <>
                            <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3">{COPY.productDetails.labels.size}</p>
                            <div className="flex gap-3 flex-wrap mb-8">
                                {product.sizes.map(size => (
                                    <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 md:w-14 md:h-14 rounded-full font-['DM_Sans'] text-sm font-medium transition-colors border ${selectedSize === size ? 'bg-[#343434] text-white border-[#343434] shadow-md' : 'bg-white text-[#343434] border-[#EBEBEB] hover:border-[#CA8385]'}`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="flex gap-6 mb-8">
                        <div>
                            <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3">Quantity</p>
                            <div className="flex items-center gap-4 h-14 bg-white border border-[#EBEBEB] rounded-full px-5">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#343434] hover:text-[#CA8385] text-lg font-medium">−</button>
                                <span className="font-['DM_Sans'] text-base font-bold text-[#343434] w-4 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-[#343434] hover:text-[#CA8385] text-lg font-medium">+</button>
                            </div>
                        </div>

                        <div>
                            <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3">{COPY.productDetails.labels.color}</p>
                            <div className="flex gap-2 items-center h-14">
                                {colors.map(color => (
                                    <button key={color} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'border-2 border-[#343434]' : 'border border-transparent hover:scale-110'}`}>
                                        <span className="w-8 h-8 rounded-full border border-[#EBEBEB]" style={{ backgroundColor: color }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pincode Check */}
                    <div className="mb-8">
                        <p className="font-['DM_Sans'] text-sm font-bold text-[#343434] mb-3 flex items-center gap-2"><MapPoint size={18} /> Delivery Options</p>
                        <div className="flex gap-2 h-14 w-full">
                            <input 
                                type="text"
                                placeholder="Enter 6-digit Pincode"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 px-5 rounded-xl border border-[#EBEBEB] bg-white text-[#343434] text-sm font-['DM_Sans'] focus:outline-none focus:border-[#343434]"
                            />
                            <button onClick={checkPincode} className="px-6 bg-[#343434] text-white rounded-xl font-['DM_Sans'] text-sm font-bold hover:bg-black transition-colors">
                                Check
                            </button>
                        </div>
                        {deliveryMsg && <p className="font-['DM_Sans'] text-xs font-bold text-[#46D27E] mt-3">{deliveryMsg}</p>}
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 py-6 border-y border-[#EBEBEB]">
                        <div className="flex flex-col flex-1 items-center gap-2 text-center">
                            <div className="w-10 h-10 bg-[#FAF8F7] text-[#CA8385] rounded-full flex items-center justify-center"><ShieldCheck size={20} weight="Outline" /></div>
                            <span className="font-['DM_Sans'] text-xs font-bold text-[#343434]">100% Authentic</span>
                        </div>
                        <div className="flex flex-col flex-1 items-center gap-2 text-center">
                            <div className="w-10 h-10 bg-[#FAF8F7] text-[#CA8385] rounded-full flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg></div>
                            <span className="font-['DM_Sans'] text-xs font-bold text-[#343434]">Secure Payment</span>
                        </div>
                        <div className="flex flex-col flex-1 items-center gap-2 text-center">
                            <div className="w-10 h-10 bg-[#FAF8F7] text-[#CA8385] rounded-full flex items-center justify-center"><Refresh size={20} weight="Outline" /></div>
                            <span className="font-['DM_Sans'] text-xs font-bold text-[#343434]">Easy Returns</span>
                        </div>
                        <div className="flex flex-col flex-1 items-center gap-2 text-center">
                            <div className="w-10 h-10 bg-[#FAF8F7] text-[#CA8385] rounded-full flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>
                            <span className="font-['DM_Sans'] text-xs font-bold text-[#343434]">Free Delivery</span>
                        </div>
                    </div>

                    <div className="pt-2 mb-10">
                        <p className="font-['DM_Sans'] text-base font-bold text-[#343434] mb-4">Product Details</p>
                        <p className="font-['DM_Sans'] text-sm text-[#999999] leading-relaxed mb-6">
                            {product.description}
                        </p>
                        
                        <table className="w-full font-['DM_Sans'] text-sm">
                            <tbody>
                                <tr className="border-b border-[#EBEBEB]">
                                    <td className="py-3 text-[#999999] w-1/3">Brand</td>
                                    <td className="py-3 font-medium text-[#343434]">Muxury Exclusive</td>
                                </tr>
                                <tr className="border-b border-[#EBEBEB]">
                                    <td className="py-3 text-[#999999] w-1/3">Type</td>
                                    <td className="py-3 font-medium text-[#343434] capitalize">{product.category}</td>
                                </tr>
                                <tr className="border-b border-[#EBEBEB]">
                                    <td className="py-3 text-[#999999] w-1/3">Country of Origin</td>
                                    <td className="py-3 font-medium text-[#343434]">India</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Reviews */}
                    <div className="mb-10 pt-4 border-t border-[#EBEBEB]">
                        <p className="font-['DM_Sans'] text-base font-bold text-[#343434] mb-6 flex items-center gap-2"><ChatSquare2 size={20}/> Customer Reviews ({product.reviewsCount})</p>
                        {reviews.length > 0 ? reviews.map(r => (
                            <div key={r.id} className="mb-5 pb-5 border-b border-[#EBEBEB] last:border-0">
                                <div className="flex items-center gap-1 mb-2">
                                    {[1,2,3,4,5].map(star => (
                                        <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= r.rating ? "#CA8385" : "none"} stroke={star <= r.rating ? "#CA8385" : "#EBEBEB"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    ))}
                                </div>
                                <p className="font-['DM_Sans'] text-sm text-[#343434] mb-2">{r.comment}</p>
                                <div className="flex items-center gap-3">
                                    <p className="font-['DM_Sans'] text-xs font-bold text-[#999999]">{r.userName}</p>
                                    <span className="w-1 h-1 rounded-full bg-[#EBEBEB]"></span>
                                    <p className="font-['DM_Sans'] text-xs text-[#999999]">{new Date(r.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="font-['DM_Sans'] text-sm text-[#999999]">No reviews yet.</p>
                        )}
                    </div>


                    {/* Desktop Add to Cart / Buy Now */}
                    <div className="hidden md:flex gap-4 mt-auto">
                        <button
                            onClick={() => handleAddToCart(false)}
                            disabled={isAdding || product.stock === 0}
                            className="flex-1 h-14 flex items-center justify-center gap-2 bg-white border-2 border-[#343434] rounded-full text-[#343434] font-['DM_Sans'] font-bold active:scale-95 transition-all hover:bg-[#FAF8F7] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            {isAdding ? COPY.productDetails.actions.adding : COPY.productDetails.actions.addToCart}
                        </button>
                        <button
                            onClick={() => handleAddToCart(true)}
                            disabled={isBuying || product.stock === 0}
                            className="flex-1 h-14 flex items-center justify-center gap-2 bg-[#CA8385] rounded-full text-white font-['DM_Sans'] font-bold active:scale-95 transition-all hover:bg-[#b57375] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {isBuying ? "Processing..." : "Buy it Now"}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Sticky bottom bar */}
            <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-[#EBEBEB] p-4 flex gap-3 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => handleAddToCart(false)}
                    disabled={isAdding || product.stock === 0}
                    className="flex-1 flex items-center justify-center bg-white border border-[#343434] rounded-full min-h-[50px] text-[#343434] font-['DM_Sans'] font-bold text-sm active:scale-95 transition-transform disabled:opacity-50"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                    onClick={() => handleAddToCart(true)}
                    disabled={isBuying || product.stock === 0}
                    className="flex-1 flex items-center justify-center bg-[#CA8385] rounded-full min-h-[50px] text-white font-['DM_Sans'] font-bold text-sm active:scale-95 transition-transform disabled:opacity-50"
                >
                    {isBuying ? "Processing..." : "Buy Now"}
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
