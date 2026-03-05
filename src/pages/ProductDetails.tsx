import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import StatusBar from "@/components/StatusBar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useProduct(id || "");
    const { addToCart } = useCart();

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("#C8A882");
    const [selectedImage, setSelectedImage] = useState(0);

    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-[#CA8385] animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center pb-20">
                <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-2">Product Not Found</h1>
                <p className="font-['DM_Sans'] text-[#999999] mb-6">This item may be out of stock or removed.</p>
                <button
                    onClick={() => navigate("/shop")}
                    className="bg-[#343434] text-white px-6 py-3 rounded-full font-['DM_Sans'] text-sm hover:bg-black transition-colors"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    const needsSizeSelection = product.sizes.length > 0 && product.sizes[0] !== "One Size";
    const colors = ['#C8A882', '#4A4E5A', '#343434', '#FFFFFF'];

    const handleAddToCart = () => {
        if (needsSizeSelection && !selectedSize) {
            toast.error("Please select a size");
            return;
        }
        setIsAdding(true);
        setTimeout(() => {
            addToCart(product, 1, selectedSize || product.sizes[0] || "One Size");
            setIsAdding(false);
            toast.success("Added to cart");
        }, 400);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-12 z-0 relative md:pt-12 md:max-w-6xl md:mx-auto md:px-5">
            <div className="md:flex md:gap-12 lg:gap-20">
                {/* Image Section */}
                <div className="md:w-1/2 flex-shrink-0">
                    <div className="relative w-full md:rounded-3xl overflow-hidden md:h-[calc(100vh-160px)] md:sticky md:top-[120px]" style={{ height: window.innerWidth < 768 ? '55vh' : undefined }}>
                        <img src={product.images[selectedImage]} className="w-full h-full object-cover" alt="Product" />

                        {/* Mobile Floating header overlaid on image */}
                        <div className="md:hidden absolute top-0 left-0 right-0">
                            <StatusBar />
                        </div>
                        <div className="md:hidden absolute top-12 left-0 right-0 flex items-center justify-between px-5">
                            <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </button>
                            <h1 className="font-['Playfair_Display'] text-lg font-medium text-white drop-shadow">Detail</h1>
                            <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>
                        </div>

                        {/* Prev/Next arrows */}
                        {product.images.length > 1 && (
                            <>
                                <button onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/60 md:bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors">‹</button>
                                <button onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/60 md:bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors">›</button>

                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                                    {product.images.map((_, i) => (
                                        <span key={i} className={`rounded-full transition-all ${i === selectedImage ? 'w-5 h-1.5 bg-[#CA8385]' : 'w-1.5 h-1.5 bg-white/60 md:bg-white/80'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 md:pt-8 bg-white md:bg-transparent rounded-t-3xl -mt-6 md:mt-0 relative px-5 pt-5 pb-28 md:pb-0 min-h-[50vh] flex flex-col">

                    {/* Desktop breadcrumb & navigation */}
                    <div className="hidden md:flex items-center gap-2 font-['DM_Sans'] text-sm text-[#999999] mb-8">
                        <button onClick={() => navigate('/shop')} className="hover:text-[#343434] transition-colors">Shop</button>
                        <span>/</span>
                        <span className="text-[#343434]">{product.category}</span>
                        <span>/</span>
                        <span className="text-[#343434] truncate">{product.name}</span>
                    </div>

                    <div className="flex items-start justify-between mb-1 md:mb-4">
                        <div>
                            <h2 className="font-['Playfair_Display'] text-xl md:text-4xl font-bold text-[#343434] md:mb-2">{product.name}</h2>
                            <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999]">Leziam Fashion</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-3 md:mb-8">
                        <div className="flex items-center gap-2">
                            <span className="font-['DM_Sans'] text-2xl md:text-3xl font-bold text-[#343434]">₹{product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                            <div className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#CA8385" stroke="#CA8385" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <span className="font-['DM_Sans'] text-sm font-bold text-[#343434]">{product.rating}</span>
                                <span className="font-['DM_Sans'] text-xs text-[#999999]">({product.reviewsCount} Reviews)</span>
                            </div>
                        </div>
                    </div>

                    {needsSizeSelection && (
                        <>
                            <p className="font-['DM_Sans'] text-sm md:text-base font-bold text-[#343434] mb-3">Size</p>
                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6 md:mb-10">
                                {/* Size Picker */}
                                <div className="flex gap-3 flex-wrap">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full font-['DM_Sans'] text-sm md:text-base font-medium transition-colors border ${selectedSize === size ? 'bg-[#CA8385] text-white border-[#CA8385]' : 'bg-white text-[#343434] border-[#EBEBEB] hover:border-[#CA8385]'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {/* Color Swatch */}
                                <div className="flex gap-2 items-center md:ml-auto md:pl-8 md:border-l border-[#EBEBEB]">
                                    <span className="font-['DM_Sans'] text-sm md:text-base font-bold text-[#343434] mr-2">Color</span>
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'border-2 border-[#343434]' : 'border border-transparent hover:scale-110'}`}
                                        >
                                            <span className="w-8 h-8 rounded-full border border-[#EBEBEB]" style={{ backgroundColor: color }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="border-t border-[#EBEBEB] pt-6 md:pt-8 mb-6">
                        <p className="font-['DM_Sans'] text-sm md:text-base font-bold text-[#343434] mb-3">Description</p>
                        <p className="font-['DM_Sans'] text-sm text-[#999999] leading-relaxed mb-6 md:mb-10">
                            {product.description}
                        </p>
                    </div>

                    {/* Desktop Add to Cart */}
                    <div className="hidden md:block mt-auto pb-12">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock === 0}
                            className="w-full h-14 md:text-base flex items-center justify-center gap-2 bg-[#343434] rounded-full text-white font-['DM_Sans'] font-medium active:scale-95 transition-transform hover:bg-black"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            {isAdding ? "Adding..." : "Add to cart"}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Sticky bottom bar */}
            <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-[#EBEBEB] px-5 py-4 flex items-center justify-between z-50">
                <div className="flex flex-col">
                    <span className="font-['DM_Sans'] text-xs text-[#999999]">Total Price</span>
                    <span className="font-['Playfair_Display'] text-xl font-bold text-[#343434]">₹{product.price.toFixed(2)}</span>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock === 0}
                    className="flex items-center justify-center gap-2 bg-[#343434] rounded-full px-8 py-3.5 text-white font-['DM_Sans'] font-medium text-sm active:scale-95 transition-transform"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    {isAdding ? "Adding..." : "Add to cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
