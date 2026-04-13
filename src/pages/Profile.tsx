import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Box, Heart, Settings, MapPoint, Card, Logout, Lock, Bell, CheckCircle } from "@solar-icons/react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { COPY } from "@/config/constants";
import OrderSkeleton from "@/components/OrderSkeleton";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";

import { useOrders, OrderSummary } from "@/hooks/useOrders";

type ViewState = "menu" | "orders" | "wishlist" | "profile" | "address" | "payment" | "notification" | "settings";

const MOCK_ADDRESSES = [
    { id: 1, name: "Home", isDefault: true, street: "Flat 402, Marina Towers", city: "Mumbai", state: "Maharashtra", pin: "400021" }
];

const MOCK_CARDS = [
    { id: 1, type: "VISA", last4: "4242", name: "HARSH SINGH", exp: "12/26", isDefault: true }
];

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, updateProfile } = useAuth();
    const { items: wishlistIds, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [view, setView] = useState<ViewState>("menu");
    const { data: realOrders, isLoading: ordersLoading } = useOrders();

    // Functional states
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileUpdates, setProfileUpdates] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [profileLoading, setProfileLoading] = useState(false);

    const [settings, setSettings] = useState({ orderUpdates: true, promoOffers: false });

    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [cards, setCards] = useState(MOCK_CARDS);
    const [isAddingCard, setIsAddingCard] = useState(false);

    if (!user) {
        navigate("/login");
        return null;
    }

    const wishlistProducts = wishlistIds.map(id => getProductById(id)).filter(Boolean);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleProfileEdit = () => {
        setProfileUpdates({ firstName: user.firstName, lastName: user.lastName, email: user.email || "", phone: user.phone });
        setIsEditingProfile(true);
    };

    const handleProfileSave = async (e: FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            await updateProfile(profileUpdates);
            toast.success("Profile updated successfully!");
            setIsEditingProfile(false);
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleMockAddAddress = (e: FormEvent) => {
        e.preventDefault();
        toast.promise(new Promise(res => setTimeout(res, 800)), {
            loading: "Saving address...",
            success: () => {
                setAddresses([...addresses, { id: Date.now(), name: "Work", isDefault: false, street: "Tech Park, Phase 1", city: "Bangalore", state: "Karnataka", pin: "560100" }]);
                setIsAddingAddress(false);
                return "Address saved successfully!";
            },
            error: "Failed to save address"
        });
    };

    const handleMockAddCard = (e: FormEvent) => {
        e.preventDefault();
        toast.promise(new Promise(res => setTimeout(res, 800)), {
            loading: "Verifying card...",
            success: () => {
                setCards([...cards, { id: Date.now(), type: "MASTERCARD", last4: "8899", name: user.firstName.toUpperCase(), exp: "05/28", isDefault: false }]);
                setIsAddingCard(false);
                return "Card added securely!";
            },
            error: "Failed to add card"
        });
    };

    const navSections = [
        {
            title: COPY.profile.sections.personalInfo,
            items: [
                { id: 'profile', icon: User, label: COPY.profile.menu.profile, action: () => setView("profile") },
                { id: 'change-password', icon: Lock, label: COPY.profile.menu.changePassword, action: () => navigate("/change-password") },
                { id: 'address', icon: MapPoint, label: COPY.profile.menu.address, action: () => setView("address") },
                { id: 'payment', icon: Card, label: COPY.profile.menu.payment, action: () => setView("payment") },
            ]
        },
        {
            title: COPY.profile.sections.general,
            items: [
                { id: 'orders', icon: Box, label: COPY.profile.orders.title, action: () => setView("orders") },
                { id: 'wishlist', icon: Heart, label: COPY.profile.wishlist.title, action: () => setView("wishlist") },
                { id: 'notification', icon: Bell, label: COPY.profile.menu.notification, action: () => setView("notification") },
                { id: 'settings', icon: Settings, label: COPY.profile.menu.settings, action: () => setView("settings") },
            ]
        }
    ];

    const ordersList = realOrders || [];

    const renderContent = () => {
        if (view === "orders" || (window.innerWidth >= 768 && view === "menu")) {
            return (
                <div className="w-full animate-fade-in">
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
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="font-['DM_Sans'] text-xs md:text-sm font-bold text-[#CA8385] bg-[#FAF8F7] px-3 md:px-4 py-1.5 rounded-full">{order.status}</span>
                                            <button onClick={() => toast.success(`Tracking link sent for ${order.id} to your email!`)} className="text-xs font-bold text-[#343434] underline hover:text-[#CA8385]">Track Package</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between flex-wrap gap-4 items-center pt-4 md:pt-6 border-t border-[#EBEBEB]">
                                        <div className="flex gap-2 items-center">
                                            <div className="w-10 h-10 bg-[#FAF8F7] rounded-lg flex items-center justify-center text-xs font-bold">x{order.items}</div>
                                            <p className="font-['DM_Sans'] text-sm md:text-base text-[#999999]">Items via Premium Shipping</p>
                                        </div>
                                        <p className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-[#343434]">₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-2xl">
                                    <Box size={48} className="mx-auto text-[#EBEBEB] mb-4"  weight="Outline"/>
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
                <div className="w-full animate-fade-in">
                    {window.innerWidth >= 768 && <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-6">{COPY.profile.wishlist.title}</h2>}
                    {wishlistProducts.length > 0 ? (
                        <div className="space-y-4">
                            {wishlistProducts.map(product => (
                                <div key={product!.id} className="flex gap-4 p-4 md:p-6 bg-white border border-[#EBEBEB] rounded-2xl relative shadow-sm">
                                    <div className="w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                                        <img src={product!.images[0]} className="w-full h-full object-cover" alt={product!.name} />
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="font-['DM_Sans'] text-base md:text-lg font-bold text-[#343434] mb-1 pr-6">{product!.name}</h3>
                                            <p className="font-['DM_Sans'] text-sm text-[#999999] capitalize">{product!.category}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <p className="font-['Playfair_Display'] text-lg font-bold text-[#343434]">₹{product!.price.toLocaleString('en-IN')}</p>
                                            <p className="font-['DM_Sans'] text-xs text-[#999999] line-through">₹{(product!.price * 1.5).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <button 
                                                onClick={() => { 
                                                    addToCart(product!, 1, product!.sizes[0]); 
                                                    toggleWishlist(product!.id); 
                                                    toast.success("Moved to Cart"); 
                                                }}
                                                className="flex-1 bg-[#343434] text-white text-sm font-bold font-['DM_Sans'] py-2.5 rounded-xl hover:bg-black transition-colors"
                                            >
                                                Move to Cart
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    toggleWishlist(product!.id);
                                                    toast.success("Removed from Wishlist");
                                                }}
                                                className="px-4 py-2.5 border border-[#EBEBEB] text-[#999999] text-sm font-bold rounded-xl hover:text-[#EF5050] hover:border-[#EF5050] transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-2xl">
                            <Heart size={48} className="mx-auto text-[#EBEBEB] mb-4"  weight="Outline"/>
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#343434] mb-2">{COPY.profile.wishlist.emptyState.title}</h2>
                            <p className="font-['DM_Sans'] text-sm text-[#999999]">{COPY.profile.wishlist.emptyState.description}</p>
                        </div>
                    )}
                </div>
            );
        }

        if (["profile", "address", "payment", "notification", "settings"].includes(view)) {
            let config = { title: '' };
            if (view === "profile") config = { title: COPY.profile.menu.profile };
            if (view === "address") config = { title: COPY.profile.menu.address };
            if (view === "payment") config = { title: COPY.profile.menu.payment };
            if (view === "notification") config = { title: COPY.profile.menu.notification };
            if (view === "settings") config = { title: COPY.profile.menu.settings };

            return (
                <div className="w-full animate-fade-in">
                    {window.innerWidth >= 768 && <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-6">{config.title}</h2>}
                    
                    {view === "profile" && (
                        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#343434]">Personal Details</h3>
                                {!isEditingProfile ? (
                                    <button onClick={handleProfileEdit} className="text-sm font-['DM_Sans'] text-[#343434] font-bold underline hover:text-[#CA8385]">Edit</button>
                                ) : (
                                    <button onClick={() => setIsEditingProfile(false)} className="text-sm font-['DM_Sans'] text-[#999999] font-bold hover:text-[#EF5050]">Cancel</button>
                                )}
                            </div>
                            
                            {!isEditingProfile ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="font-['DM_Sans'] text-xs text-[#999999] mb-1">First Name</p>
                                        <p className="font-['DM_Sans'] text-sm md:text-base font-medium text-[#343434]">{user.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="font-['DM_Sans'] text-xs text-[#999999] mb-1">Last Name</p>
                                        <p className="font-['DM_Sans'] text-sm md:text-base font-medium text-[#343434]">{user.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="font-['DM_Sans'] text-xs text-[#999999] mb-1">Email</p>
                                        <p className="font-['DM_Sans'] text-sm md:text-base font-medium text-[#343434]">{user.email || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="font-['DM_Sans'] text-xs text-[#999999] mb-1">Phone Number</p>
                                        <p className="font-['DM_Sans'] text-sm md:text-base font-medium text-[#343434]">{user.phone}</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleProfileSave} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="font-['DM_Sans'] text-xs text-[#343434] font-bold mb-1 block">First Name</label>
                                            <input type="text" required value={profileUpdates.firstName} onChange={e => setProfileUpdates(p => ({...p, firstName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] focus:border-[#343434] focus:outline-none placeholder-[#999999]" />
                                        </div>
                                        <div>
                                            <label className="font-['DM_Sans'] text-xs text-[#343434] font-bold mb-1 block">Last Name</label>
                                            <input type="text" required value={profileUpdates.lastName} onChange={e => setProfileUpdates(p => ({...p, lastName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] focus:border-[#343434] focus:outline-none placeholder-[#999999]" />
                                        </div>
                                        <div>
                                            <label className="font-['DM_Sans'] text-xs text-[#343434] font-bold mb-1 block">Email</label>
                                            <input type="email" required value={profileUpdates.email} onChange={e => setProfileUpdates(p => ({...p, email: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] focus:border-[#343434] focus:outline-none placeholder-[#999999]" />
                                        </div>
                                        <div>
                                            <label className="font-['DM_Sans'] text-xs text-[#343434] font-bold mb-1 block">Phone Number</label>
                                            <input type="text" required value={profileUpdates.phone} onChange={e => setProfileUpdates(p => ({...p, phone: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] focus:border-[#343434] focus:outline-none placeholder-[#999999]" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <LoadingButton type="submit" loading={profileLoading} className="px-8 min-h-[44px]">Save Changes</LoadingButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {view === "settings" && (
                        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 md:p-8 space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-[#EBEBEB]">
                                <div>
                                    <p className="font-['DM_Sans'] font-bold text-[#343434] text-base mb-1">Order Updates</p>
                                    <p className="font-['DM_Sans'] text-sm text-[#999999]">Receive SMS & Email updates on orders</p>
                                </div>
                                <div onClick={() => { setSettings(p => ({...p, orderUpdates: !p.orderUpdates})); toast.success("Preferences updated"); }} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.orderUpdates ? 'bg-[#343434]' : 'bg-[#EBEBEB]'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${settings.orderUpdates ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-[#EBEBEB]">
                                <div>
                                    <p className="font-['DM_Sans'] font-bold text-[#343434] text-base mb-1">Promotional Offers</p>
                                    <p className="font-['DM_Sans'] text-sm text-[#999999]">Get exclusive subscriber deals</p>
                                </div>
                                <div onClick={() => { setSettings(p => ({...p, promoOffers: !p.promoOffers})); toast.success("Preferences updated"); }} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.promoOffers ? 'bg-[#343434]' : 'bg-[#EBEBEB]'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${settings.promoOffers ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-[#EBEBEB]">
                                <div>
                                    <p className="font-['DM_Sans'] font-bold text-[#343434] text-base mb-1">Language</p>
                                </div>
                                <select className="text-sm font-['DM_Sans'] font-bold text-[#343434] bg-transparent focus:outline-none cursor-pointer hover:text-[#CA8385]">
                                    <option>English (IN)</option>
                                    <option>Hindi</option>
                                    <option>English (US)</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center pb-6">
                                <div>
                                    <p className="font-['DM_Sans'] font-bold text-[#343434] text-base mb-1">Currency</p>
                                </div>
                                <select disabled className="text-sm font-['DM_Sans'] font-bold text-[#999999] bg-transparent focus:outline-none cursor-not-allowed">
                                    <option>INR (₹)</option>
                                </select>
                            </div>
                            <button onClick={() => toast.error("Account deletion requires an active support ticket.")} className="w-full py-3 border border-[#EF5050] text-[#EF5050] font-['DM_Sans'] font-bold rounded-lg hover:bg-red-50 transition-colors">
                                Deactivate Account
                            </button>
                        </div>
                    )}

                    {view === "notification" && (
                        <div className="space-y-4">
                            <div className="bg-[#FAF8F7] border border-[#CA8385]/30 rounded-2xl p-5 md:p-6 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CA8385]"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-['DM_Sans'] font-bold text-[#343434] text-base">Flash Sale Live!</h4>
                                    <span className="font-['DM_Sans'] text-xs text-[#CA8385] font-bold">New</span>
                                </div>
                                <p className="font-['DM_Sans'] text-sm text-[#999999] mb-3">Shop the new Outerwear collection with exclusive Muxury discounts.</p>
                                <p className="font-['DM_Sans'] text-xs text-[#CCCCCC]">1 hour ago</p>
                            </div>
                            <div className="bg-white border border-[#343434] rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#343434]"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-['DM_Sans'] font-bold text-[#343434] text-base">Order Delivered</h4>
                                </div>
                                <p className="font-['DM_Sans'] text-sm text-[#999999] mb-3">Your order MUX-2024-001 has been securely delivered to your front desk. Enjoy!</p>
                                <p className="font-['DM_Sans'] text-xs text-[#CCCCCC]">2 days ago</p>
                            </div>
                        </div>
                    )}

                    {view === "address" && (
                        <div>
                            {addresses.map((addr) => (
                                <div key={addr.id} className="bg-white border border-[#EBEBEB] hover:border-[#343434] transition-colors rounded-2xl p-6 md:p-8 mb-4 relative">
                                    {addr.isDefault && <span className="absolute top-6 right-6 font-['DM_Sans'] text-xs font-bold text-[#CA8385] bg-[#FAF8F7] px-3 py-1 rounded-full">Default</span>}
                                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#343434] mb-4">{addr.name}</h3>
                                    <p className="font-['DM_Sans'] text-sm text-[#343434] font-medium mb-1">{user.firstName} {user.lastName}</p>
                                    <p className="font-['DM_Sans'] text-sm text-[#999999] mb-6">{addr.street}<br />{addr.city}, {addr.state} {addr.pin}<br />India</p>
                                    <div className="flex gap-4">
                                        <button className="text-sm font-['DM_Sans'] text-[#343434] font-bold underline hover:text-[#CA8385]">Edit</button>
                                        <button onClick={() => {setAddresses(addresses.filter(a => a.id !== addr.id)); toast.success("Address removed")}} className="text-sm font-['DM_Sans'] text-[#999999] font-bold hover:text-[#EF5050]">Remove</button>
                                    </div>
                                </div>
                            ))}

                            {!isAddingAddress ? (
                                <button onClick={() => setIsAddingAddress(true)} className="w-full py-4 border border-dashed border-[#CCCCCC] rounded-2xl text-[#999999] hover:border-[#343434] hover:text-[#343434] transition-colors font-['DM_Sans'] font-bold flex items-center justify-center gap-2">
                                    <span>+</span> Add New Address
                                </button>
                            ) : (
                                <form onSubmit={handleMockAddAddress} className="bg-[#FAF8F7] p-6 rounded-2xl border border-[#EBEBEB] space-y-4">
                                    <h4 className="font-['Playfair_Display'] font-bold text-[#343434]">New Address</h4>
                                    <input type="text" required placeholder="Street / Building Name" className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB]" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" required placeholder="City" className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB]" />
                                        <input type="text" required placeholder="Pincode" maxLength={6} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB]" />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="submit" className="bg-[#343434] text-white px-6 py-2 rounded-full font-['DM_Sans'] font-bold">Save changes</button>
                                        <button type="button" onClick={() => setIsAddingAddress(false)} className="px-6 py-2 rounded-full font-['DM_Sans'] font-bold text-[#999999]">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {view === "payment" && (
                        <div>
                            {cards.map(card => (
                                <div key={card.id} className="bg-[#343434] rounded-2xl p-6 md:p-8 mb-4 relative overflow-hidden flex flex-col justify-between h-[180px]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                                    <div className="flex justify-between items-start z-10">
                                        <span className="font-['DM_Sans'] text-white font-bold tracking-widest text-lg italic">{card.type}</span>
                                        {card.isDefault && <span className="font-['DM_Sans'] text-xs font-bold text-[#343434] bg-white px-3 py-1 rounded-full">Default</span>}
                                    </div>
                                    <div className="z-10">
                                        <p className="font-['DM_Sans'] text-[#CCCCCC] font-mono text-sm tracking-[4px] mb-2">**** **** **** {card.last4}</p>
                                        <div className="flex justify-between items-end">
                                            <p className="font-['DM_Sans'] text-white font-medium text-sm">{card.name}</p>
                                            <p className="font-['DM_Sans'] text-[#CCCCCC] text-xs">{card.exp}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!isAddingCard ? (
                                <button onClick={() => setIsAddingCard(true)} className="w-full py-4 border border-dashed border-[#CCCCCC] rounded-2xl text-[#999999] hover:border-[#343434] hover:text-[#343434] transition-colors font-['DM_Sans'] font-bold flex items-center justify-center gap-2">
                                    <span>+</span> Add Payment Method
                                </button>
                            ) : (
                                <form onSubmit={handleMockAddCard} className="bg-white p-6 rounded-2xl border border-[#EBEBEB] space-y-4 shadow-sm">
                                    <h4 className="font-['Playfair_Display'] font-bold text-[#343434]">Secure Card Details</h4>
                                    <input type="text" required placeholder="Card Number (Dummy)" maxLength={16} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB] font-mono placeholder:font-['DM_Sans']" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" required placeholder="MM/YY" maxLength={5} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB]" />
                                        <input type="password" required placeholder="CVV" maxLength={3} className="w-full h-12 px-4 rounded-xl border border-[#EBEBEB]" />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="submit" className="bg-black text-white px-6 py-2 rounded-full font-['DM_Sans'] font-bold flex items-center gap-2"><CheckCircle size={18}/> Verify Card</button>
                                        <button type="button" onClick={() => setIsAddingCard(false)} className="px-6 py-2 rounded-full font-['DM_Sans'] font-bold text-[#999999]">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };


    // Mobile views
    if (view !== "menu" && window.innerWidth < 768) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 z-0">
                <div className="px-5 py-4 flex items-center gap-4 bg-white border-b border-[#EBEBEB]">
                    <button onClick={() => setView('menu')} className="p-2 -ml-2 text-[#343434]">← Back</button>
                    <span className="font-['Playfair_Display'] font-bold text-lg text-[#343434] capitalize">{view}</span>
                </div>
                <main className="px-5 pt-6">{renderContent()}</main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white md:bg-[#FAFAFA] flex flex-col pb-24 md:pb-12 z-0">
            <main className="px-5 md:px-12 lg:px-24 xl:px-32 pt-2 md:pt-12 md:pb-12 h-full">

                <div className="hidden md:flex items-center justify-between mb-12">
                    <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#343434]">{COPY.profile.title}</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#EBEBEB] text-[#CA8385] font-['DM_Sans'] font-medium hover:bg-white transition-colors">
                        <Logout size={18}  weight="Outline"/>
                        {COPY.profile.signOut}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
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
                            <p className="font-['DM_Sans'] text-[15px] font-medium text-[#343434] break-all">@{user.email?.split('@')[0] || "user"}</p>
                        </div>

                        <div className="border-b opacity-50 border-[#EBEBEB] w-full mb-8 md:hidden -mx-5 px-5"></div>

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

                        <div className="md:hidden mt-12 mb-8 flex justify-center">
                            <button onClick={handleLogout} className="font-['DM_Sans'] text-[15px] font-medium text-[#EF5050] active:scale-95 transition-transform px-6 py-3 min-h-[44px]">
                                {COPY.profile.signOut}
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:block md:w-2/3 lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
