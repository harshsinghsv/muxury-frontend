import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface MobileNavProps {
    onSearchClick: () => void;
    onCartClick: () => void;
}

const MobileNav = ({ onSearchClick, onCartClick }: MobileNavProps) => {
    const location = useLocation();
    const { items: cartItems } = useCart();
    const { items: wishlistItems } = useWishlist();
    const { isAuthenticated } = useAuth();

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Search, label: "Search", action: onSearchClick },
        { icon: ShoppingBag, label: "Cart", action: onCartClick, badge: cartCount },
        { icon: Heart, label: "Wishlist", path: "/profile", badge: wishlistItems.length },
        { icon: User, label: "Account", path: isAuthenticated ? "/profile" : "/login" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border md:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = item.path && location.pathname === item.path;
                    const Icon = item.icon;

                    if (item.action) {
                        return (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className="flex flex-col items-center justify-center flex-1 h-full relative group"
                            >
                                <div className="relative">
                                    <Icon
                                        size={22}
                                        className={`transition-colors ${isActive ? "text-gold" : "text-muted-foreground group-active:text-gold"
                                            }`}
                                    />
                                    {item.badge && item.badge > 0 && (
                                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {item.badge > 9 ? "9+" : item.badge}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`text-[10px] mt-1 transition-colors ${isActive ? "text-gold font-medium" : "text-muted-foreground"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.path!}
                            className="flex flex-col items-center justify-center flex-1 h-full relative group"
                        >
                            <div className="relative">
                                <Icon
                                    size={22}
                                    className={`transition-colors ${isActive ? "text-gold" : "text-muted-foreground group-active:text-gold"
                                        }`}
                                />
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {item.badge > 9 ? "9+" : item.badge}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`text-[10px] mt-1 transition-colors ${isActive ? "text-gold font-medium" : "text-muted-foreground"
                                    }`}
                            >
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
