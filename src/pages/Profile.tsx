import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Package, Heart, ChevronRight, Settings, MapPin, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductById } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const mockOrders = [
    { id: "ORD-M8K2X9", date: "2024-01-15", status: "Delivered", total: 3420, items: 2 },
    { id: "ORD-N4P7Q1", date: "2024-01-05", status: "Delivered", total: 980, items: 1 }
];

type ViewState = "menu" | "orders" | "wishlist";

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { items: wishlistIds } = useWishlist();
    const [view, setView] = useState<ViewState>("menu");

    if (!user) {
        navigate("/login");
        return null;
    }

    const wishlistProducts = wishlistIds.map(id => getProductById(id)).filter(Boolean);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (view === "orders") {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
                <div className="flex items-center justify-between px-5 pt-8 mb-6">
                    <button onClick={() => setView("menu")} className="w-10 h-10 border border-[#EBEBEB] rounded-full flex items-center justify-center bg-white active:scale-95 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <h1 className="font-['Playfair_Display'] text-xl font-bold text-[#343434]">My Orders</h1>
                    <div className="w-10"></div>
                </div>
                <main className="px-5 space-y-4">
                    {mockOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl p-5 border border-[#EBEBEB]">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-['Playfair_Display'] text-lg font-bold text-[#343434]">{order.id}</p>
                                    <p className="font-['DM_Sans'] text-xs text-[#999999]">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <span className="font-['DM_Sans'] text-xs font-bold text-[#CA8385] bg-[#FAF8F7] px-3 py-1 rounded-full">{order.status}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-[#EBEBEB]">
                                <p className="font-['DM_Sans'] text-sm text-[#999999]">{order.items} Items</p>
                                <p className="font-['Playfair_Display'] text-lg font-bold text-[#343434]">₹{order.total.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        );
    }

    if (view === "wishlist") {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
                <div className="flex items-center justify-between px-5 pt-8 mb-6">
                    <button onClick={() => setView("menu")} className="w-10 h-10 border border-[#EBEBEB] rounded-full flex items-center justify-center bg-white active:scale-95 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <h1 className="font-['Playfair_Display'] text-xl font-bold text-[#343434]">My Wishlist</h1>
                    <div className="w-10"></div>
                </div>
                <main className="px-5">
                    {wishlistProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {wishlistProducts.map(product => <ProductCard key={product!.id} product={product!} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">Wishlist is empty</h2>
                            <p className="font-['DM_Sans'] text-sm text-[#999999]">Save your favorite pieces to view them later.</p>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
            <div className="flex items-center justify-between px-5 pt-8 mb-6">
                <button onClick={() => navigate(-1)} className="w-10 h-10 border border-[#EBEBEB] rounded-full flex items-center justify-center bg-white active:scale-95 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <h1 className="font-['Playfair_Display'] text-xl font-bold text-[#343434]">Profile</h1>
                <div className="w-10"></div>
            </div>

            <main className="px-5">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#343434] flex items-center justify-center mb-4">
                        <span className="font-['Playfair_Display'] text-3xl text-white">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                    </div>
                    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">{user.firstName} {user.lastName}</h2>
                    <p className="font-['DM_Sans'] text-sm text-[#999999]">{user.email}</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-2 mb-6">
                    <button className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center">
                                <User size={18} className="text-[#343434]" />
                            </div>
                            <span className="font-['DM_Sans'] font-medium text-[#343434]">Personal Information</span>
                        </div>
                        <ChevronRight size={18} className="text-[#999999]" />
                    </button>

                    <button onClick={() => setView("orders")} className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center">
                                <Package size={18} className="text-[#343434]" />
                            </div>
                            <span className="font-['DM_Sans'] font-medium text-[#343434]">My Orders</span>
                        </div>
                        <ChevronRight size={18} className="text-[#999999]" />
                    </button>

                    <button onClick={() => setView("wishlist")} className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center">
                                <Heart size={18} className="text-[#343434]" />
                            </div>
                            <span className="font-['DM_Sans'] font-medium text-[#343434]">My Wishlist</span>
                        </div>
                        <ChevronRight size={18} className="text-[#999999]" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center">
                                <MapPin size={18} className="text-[#343434]" />
                            </div>
                            <span className="font-['DM_Sans'] font-medium text-[#343434]">Shipping Address</span>
                        </div>
                        <ChevronRight size={18} className="text-[#999999]" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center">
                                <CreditCard size={18} className="text-[#343434]" />
                            </div>
                            <span className="font-['DM_Sans'] font-medium text-[#343434]">Payment Methods</span>
                        </div>
                        <ChevronRight size={18} className="text-[#999999]" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center">
                                <Settings size={18} className="text-[#343434]" />
                            </div>
                            <span className="font-['DM_Sans'] font-medium text-[#343434]">Settings</span>
                        </div>
                        <ChevronRight size={18} className="text-[#999999]" />
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-2">
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#F5F0EE] flex items-center justify-center">
                                <LogOut size={18} className="text-[#CA8385]" />
                            </div>
                            <span className="font-['DM_Sans'] font-bold text-[#CA8385]">Log Out</span>
                        </div>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Profile;
