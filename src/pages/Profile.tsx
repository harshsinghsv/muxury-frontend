import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Package, Heart, ChevronRight, Settings, MapPin, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductById } from "@/data/products";
import ProductCard from "@/components/ProductCard";

import { useOrders, OrderSummary } from "@/hooks/useOrders";
import { Loader2 } from "lucide-react";

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

    // Helper component for mobile view headers
    const MobileHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
        <div className="md:hidden flex items-center justify-between px-5 pt-8 mb-6">
            <button onClick={onBack} className="w-10 h-10 border border-[#EBEBEB] rounded-full flex items-center justify-center bg-white active:scale-95 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <h1 className="font-['Playfair_Display'] text-xl font-bold text-[#343434]">{title}</h1>
            <div className="w-10"></div>
        </div>
    );

    // Sidebar navigation items
    const navItems = [
        { id: 'profile', icon: User, label: 'Personal Information' },
        { id: 'orders', icon: Package, label: 'My Orders', action: () => setView("orders") },
        { id: 'wishlist', icon: Heart, label: 'My Wishlist', action: () => setView("wishlist") },
        { id: 'address', icon: MapPin, label: 'Shipping Address' },
        { id: 'payment', icon: CreditCard, label: 'Payment Methods' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const { data: realOrders, isLoading: ordersLoading } = useOrders();
    const ordersList = realOrders || [];

    // Main content area renderer
    const renderContent = () => {
        if (view === "orders" || (window.innerWidth >= 768 && view === "menu")) {
            return (
                <div className="w-full">
                    {window.innerWidth >= 768 && <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-6">My Orders</h2>}
                    {ordersLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-[#CA8385] animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ordersList.length > 0 ? ordersList.map((order: OrderSummary) => (
                                <div key={order.id} className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBEBEB] shadow-sm">
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div>
                                            <p className="font-['Playfair_Display'] text-lg md:text-xl font-bold text-[#343434] mb-1">{order.id}</p>
                                            <p className="font-['DM_Sans'] text-xs md:text-sm text-[#999999]">Placed on {new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-['DM_Sans'] text-xs md:text-sm font-bold text-[#CA8385] bg-[#FAF8F7] px-3 md:px-4 py-1.5 rounded-full">{order.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-[#EBEBEB]">
                                        <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999]">{order.items} {order.items === 1 ? 'Item' : 'Items'}</p>
                                        <p className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-[#343434]">₹{order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-2xl">
                                    <Package size={48} className="mx-auto text-[#EBEBEB] mb-4" />
                                    <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">No orders yet</h3>
                                    <p className="font-['DM_Sans'] text-[#999999] text-sm">When you place an order, it will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        if (view === "wishlist") {
            return (
                <div className="w-full">
                    {window.innerWidth >= 768 && <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-6">My Wishlist</h2>}
                    {wishlistProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {wishlistProducts.map(product => <ProductCard key={product!.id} product={product!} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-2xl">
                            <Heart size={48} className="mx-auto text-[#EBEBEB] mb-4" />
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">Wishlist is empty</h2>
                            <p className="font-['DM_Sans'] text-sm text-[#999999]">Save your favorite pieces to view them later.</p>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };


    // Mobile views
    if (view === "orders" && window.innerWidth < 768) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
                <MobileHeader title="My Orders" onBack={() => setView("menu")} />
                <main className="px-5">{renderContent()}</main>
            </div>
        );
    }

    if (view === "wishlist" && window.innerWidth < 768) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
                <MobileHeader title="My Wishlist" onBack={() => setView("menu")} />
                <main className="px-5">{renderContent()}</main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 md:pb-12 z-0">
            {/* Mobile Header for Main Menu */}
            <div className="md:hidden">
                <MobileHeader title="Profile" onBack={() => navigate(-1)} />
            </div>

            <main className="px-5 md:px-12 lg:px-24 xl:px-32 md:pt-12 md:pb-12 h-full">

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between mb-12">
                    <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#343434]">My Account</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#EBEBEB] text-[#CA8385] font-['DM_Sans'] font-medium hover:bg-white transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Sidebar / Mobile Main Menu */}
                    <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
                        {/* User Profile Card */}
                        <div className="flex flex-col items-center md:items-start mb-8 md:mb-10 md:bg-white md:p-6 md:rounded-3xl md:border md:border-[#EBEBEB] md:shadow-sm">
                            <div className="w-24 h-24 md:w-20 md:h-20 rounded-full bg-[#343434] flex items-center justify-center mb-4 md:mb-5">
                                <span className="font-['Playfair_Display'] text-3xl md:text-2xl text-white">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </span>
                            </div>
                            <h2 className="font-['Playfair_Display'] text-2xl md:text-xl font-bold text-[#343434] mb-1">{user.firstName} {user.lastName}</h2>
                            <p className="font-['DM_Sans'] text-sm md:text-sm text-[#999999] break-all">{user.email}</p>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-2 mb-6 shadow-sm">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = window.innerWidth >= 768 && (view === item.id || (view === 'menu' && item.id === 'orders'));

                                return (
                                    <button
                                        key={item.id}
                                        onClick={item.action}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isActive ? 'bg-[#343434]' : 'hover:bg-[#FAF8F7] active:bg-[#FAF8F7]'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-white/10' : 'bg-[#FAF8F7]'}`}>
                                                <Icon size={18} className={isActive ? 'text-white' : 'text-[#343434]'} />
                                            </div>
                                            <span className={`font-['DM_Sans'] font-medium transition-colors ${isActive ? 'text-white' : 'text-[#343434]'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        {(!isActive || window.innerWidth < 768) && <ChevronRight size={18} className="text-[#999999]" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mobile Logout (Hidden on Desktop) */}
                        <div className="md:hidden bg-white rounded-2xl border border-[#EBEBEB] p-2">
                            <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 active:bg-[#FAF8F7] transition-colors rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#F5F0EE] flex items-center justify-center">
                                        <LogOut size={18} className="text-[#CA8385]" />
                                    </div>
                                    <span className="font-['DM_Sans'] font-bold text-[#CA8385]">Log Out</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Main Content Area */}
                    <div className="hidden md:block md:w-2/3 lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
