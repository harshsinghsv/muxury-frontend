import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, Heart, ChevronRight, Settings, MapPin, CreditCard, LogOut, Lock, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductById } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { COPY } from "@/config/constants";
import OrderSkeleton from "@/components/OrderSkeleton";

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



    // Sidebar navigation sections corresponding to reference design
    const navSections = [
        {
            title: COPY.profile.sections.personalInfo,
            items: [
                { id: 'profile', icon: User, label: COPY.profile.menu.profile, action: () => {} },
                { id: 'change-password', icon: Lock, label: COPY.profile.menu.changePassword, action: () => navigate("/change-password") },
                { id: 'address', icon: MapPin, label: COPY.profile.menu.address, action: () => {} },
                { id: 'payment', icon: CreditCard, label: COPY.profile.menu.payment, action: () => {} },
            ]
        },
        {
            title: COPY.profile.sections.general,
            items: [
                { id: 'orders', icon: Package, label: COPY.profile.orders.title, action: () => setView("orders") },
                { id: 'wishlist', icon: Heart, label: COPY.profile.wishlist.title, action: () => setView("wishlist") },
                { id: 'notification', icon: Bell, label: COPY.profile.menu.notification, action: () => {} },
                { id: 'settings', icon: Settings, label: COPY.profile.menu.settings, action: () => {} },
            ]
        }
    ];

    const { data: realOrders, isLoading: ordersLoading } = useOrders();
    const ordersList = realOrders || [];

    // Main content area renderer
    const renderContent = () => {
        if (view === "orders" || (window.innerWidth >= 768 && view === "menu")) {
            return (
                <div className="w-full">
                    {window.innerWidth >= 768 && <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-6">{COPY.profile.orders.title}</h2>}
                    {ordersLoading ? (
                        <div>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <OrderSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ordersList.length > 0 ? ordersList.map((order: OrderSummary) => (
                                <div key={order.id} className="bg-white rounded-2xl p-5 md:p-6 border border-[#EBEBEB] shadow-sm">
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div>
                                            <p className="font-['Playfair_Display'] text-lg md:text-xl font-bold text-[#343434] mb-1">{order.id}</p>
                                            <p className="font-['DM_Sans'] text-xs md:text-sm text-[#999999]">{COPY.profile.orders.placedOn} {new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-['DM_Sans'] text-xs md:text-sm font-bold text-[#CA8385] bg-[#FAF8F7] px-3 md:px-4 py-1.5 rounded-full">{order.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-[#EBEBEB]">
                                        <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999]">{order.items} {order.items === 1 ? COPY.profile.orders.item : COPY.profile.orders.items}</p>
                                        <p className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-[#343434]">₹{order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-2xl">
                                    <Package size={48} className="mx-auto text-[#EBEBEB] mb-4" />
                                    <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">{COPY.profile.orders.emptyState.title}</h3>
                                    <p className="font-['DM_Sans'] text-[#999999] text-sm">{COPY.profile.orders.emptyState.description}</p>
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
                    {window.innerWidth >= 768 && <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-6">{COPY.profile.wishlist.title}</h2>}
                    {wishlistProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {wishlistProducts.map(product => <ProductCard key={product!.id} product={product!} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-2xl">
                            <Heart size={48} className="mx-auto text-[#EBEBEB] mb-4" />
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">{COPY.profile.wishlist.emptyState.title}</h2>
                            <p className="font-['DM_Sans'] text-sm text-[#999999]">{COPY.profile.wishlist.emptyState.description}</p>
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
                {/* Mobile Header removed as global App <Header/> renders for this route now */}
                <main className="px-5">{renderContent()}</main>
            </div>
        );
    }

    if (view === "wishlist" && window.innerWidth < 768) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
                {/* Mobile Header removed as global App <Header/> renders for this route now */}
                <main className="px-5">{renderContent()}</main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white md:bg-[#FAFAFA] flex flex-col pb-24 md:pb-12 z-0">
            <main className="px-5 md:px-12 lg:px-24 xl:px-32 pt-2 md:pt-12 md:pb-12 h-full">

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between mb-12">
                    <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#343434]">{COPY.profile.title}</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#EBEBEB] text-[#CA8385] font-['DM_Sans'] font-medium hover:bg-white transition-colors">
                        <LogOut size={18} />
                        {COPY.profile.signOut}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Sidebar / Mobile Main Menu */}
                    <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
                        {/* User Profile Info */}
                        <div className="flex flex-col items-center mb-8 md:bg-white md:p-6 md:rounded-3xl md:border md:border-[#EBEBEB] md:shadow-sm mt-4 md:mt-0">
                            <div className="w-[100px] h-[100px] md:w-20 md:h-20 rounded-full bg-[#343434] overflow-hidden flex items-center justify-center mb-4 md:mb-5 border border-[#EBEBEB]">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-['Playfair_Display'] text-4xl md:text-2xl text-white">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <h2 className="font-['DM_Sans'] text-xl font-medium text-[#343434] mb-1">{user.firstName} {user.lastName}</h2>
                            <p className="font-['DM_Sans'] text-[15px] font-medium text-[#343434] break-all">@{user.email.split('@')[0]}</p>
                        </div>

                        <div className="border-b opacity-50 border-[#EBEBEB] w-full mb-8 md:hidden -mx-5 px-5"></div>

                        {/* Navigation Sections */}
                        <div className="flex flex-col gap-8 md:gap-6 md:bg-white md:rounded-3xl md:border md:border-[#EBEBEB] md:shadow-sm md:p-4">
                            {navSections.map((section, idx) => (
                                <div key={idx} className="flex flex-col w-full">
                                    <h3 className="font-['DM_Sans'] text-[15px] font-bold text-[#343434] mb-4 md:px-2">{section.title}</h3>
                                    <div className="flex flex-col">
                                        {section.items.map((item, itemIdx) => {
                                            const Icon = item.icon;
                                            const isActive = window.innerWidth >= 768 && (view === item.id || (view === 'menu' && item.id === 'orders'));

                                            return (
                                                <div key={item.id} className="w-full">
                                                    <button
                                                        onClick={item.action}
                                                        className={`w-full flex items-center gap-5 py-4 transition-colors ${isActive && window.innerWidth >= 768 ? 'bg-[#FAF8F7] rounded-xl px-2' : 'hover:bg-[#FAF8F7] active:bg-[#FAF8F7] md:px-2 md:rounded-xl'}`}
                                                    >
                                                        <Icon size={20} className="text-[#343434] stroke-[1.5]" />
                                                        <span className="font-['DM_Sans'] text-[15px] font-medium text-[#343434]">
                                                            {item.label}
                                                        </span>
                                                    </button>
                                                    {itemIdx < section.items.length - 1 && (
                                                        <div className="border-b opacity-50 border-[#EBEBEB] ml-10"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {idx < navSections.length - 1 && (
                                        <div className="border-b opacity-50 border-[#EBEBEB] mt-8 w-full md:hidden"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Logout (Hidden on Desktop) */}
                        <div className="md:hidden mt-12 mb-8 flex justify-center">
                            <button onClick={handleLogout} className="font-['DM_Sans'] text-[15px] font-medium text-[#EF5050] active:scale-95 transition-transform px-6 py-3 min-h-[44px]">
                                {COPY.profile.signOut}
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
