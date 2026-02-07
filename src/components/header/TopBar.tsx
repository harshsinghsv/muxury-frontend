import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface TopBarProps {
    onSearchClick: () => void;
}

const TopBar = ({ onSearchClick }: TopBarProps) => {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { isAuthenticated } = useAuth();

    return (
        <div className="bg-[#2C3E50] text-white py-3">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-2xl font-bold tracking-wide">LUXE</h1>
                    </Link>

                    {/* Search Bar - Takes 40-50% width */}
                    <div className="flex-1 max-w-2xl mx-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more"
                                onClick={onSearchClick}
                                readOnly
                                className="w-full px-4 py-2.5 pr-12 rounded-sm text-sm text-gray-900 bg-white focus:outline-none cursor-pointer"
                            />
                            <button
                                onClick={onSearchClick}
                                className="absolute right-0 top-0 bottom-0 px-6 bg-[#FFB700] hover:bg-[#FFA500] transition-colors"
                                aria-label="Search"
                            >
                                <Search size={18} className="text-gray-900" />
                            </button>
                        </div>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-6">
                        {/* Account */}
                        <Link
                            to={isAuthenticated ? "/profile" : "/login"}
                            className="flex items-center gap-2 hover:text-[#FFB700] transition-colors"
                        >
                            <User size={20} />
                            <span className="hidden lg:block text-sm font-medium">
                                {isAuthenticated ? "Account" : "Login"}
                            </span>
                        </Link>

                        {/* Wishlist */}
                        <Link
                            to="/profile"
                            className="relative flex items-center gap-2 hover:text-[#FFB700] transition-colors"
                        >
                            <Heart size={20} />
                            <span className="hidden lg:block text-sm font-medium">Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FFB700] text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-2 hover:text-[#FFB700] transition-colors"
                        >
                            <ShoppingCart size={20} />
                            <span className="hidden lg:block text-sm font-medium">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FFB700] text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
