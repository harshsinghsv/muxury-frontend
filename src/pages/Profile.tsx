import { useNavigate } from "react-router-dom";
import { User, Mail, Package, LogOut, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductById } from "@/data/products";
import ProductCard from "@/components/ProductCard";

// Mock order data
const mockOrders = [
    {
        id: "ORD-M8K2X9",
        date: "2024-01-15",
        status: "Delivered",
        total: 3420,
        items: 2,
    },
    {
        id: "ORD-N4P7Q1",
        date: "2024-01-05",
        status: "Delivered",
        total: 980,
        items: 1,
    },
    {
        id: "ORD-R2S5T8",
        date: "2023-12-20",
        status: "Delivered",
        total: 5340,
        items: 3,
    },
];

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { items: wishlistIds } = useWishlist();

    const wishlistProducts = wishlistIds
        .map((id) => getProductById(id))
        .filter(Boolean);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Profile header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                                <User size={28} className="text-gold" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-medium">{user.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail size={14} />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="p-4 border border-border rounded-lg text-center">
                            <p className="text-2xl font-semibold">{mockOrders.length}</p>
                            <p className="text-sm text-muted-foreground">Orders</p>
                        </div>
                        <div className="p-4 border border-border rounded-lg text-center">
                            <p className="text-2xl font-semibold">{wishlistIds.length}</p>
                            <p className="text-sm text-muted-foreground">Wishlist</p>
                        </div>
                        <div className="p-4 border border-border rounded-lg text-center">
                            <p className="text-2xl font-semibold">
                                ${mockOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">Total Spent</p>
                        </div>
                    </div>

                    {/* Order history */}
                    <section className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Package size={20} className="text-gold" />
                            <h2 className="font-semibold text-lg">Order History</h2>
                        </div>

                        {mockOrders.length > 0 ? (
                            <div className="border border-border rounded-lg overflow-hidden">
                                <div className="hidden sm:grid grid-cols-5 gap-4 p-4 bg-muted/50 text-sm font-medium">
                                    <span>Order ID</span>
                                    <span>Date</span>
                                    <span>Items</span>
                                    <span>Status</span>
                                    <span className="text-right">Total</span>
                                </div>
                                {mockOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="grid sm:grid-cols-5 gap-2 sm:gap-4 p-4 border-t border-border first:border-0"
                                    >
                                        <div>
                                            <span className="sm:hidden text-xs text-muted-foreground">Order: </span>
                                            <span className="font-medium text-gold">{order.id}</span>
                                        </div>
                                        <div>
                                            <span className="sm:hidden text-xs text-muted-foreground">Date: </span>
                                            <span>{new Date(order.date).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="sm:hidden text-xs text-muted-foreground">Items: </span>
                                            <span>{order.items} item{order.items !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div>
                                            <span className="sm:hidden text-xs text-muted-foreground">Status: </span>
                                            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="sm:text-right">
                                            <span className="sm:hidden text-xs text-muted-foreground">Total: </span>
                                            <span className="font-medium">${order.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-border rounded-lg">
                                <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground">No orders yet</p>
                            </div>
                        )}
                    </section>

                    {/* Wishlist */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Heart size={20} className="text-gold" />
                            <h2 className="font-semibold text-lg">My Wishlist</h2>
                        </div>

                        {wishlistProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                                {wishlistProducts.map((product) => (
                                    <ProductCard key={product!.id} product={product!} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-border rounded-lg">
                                <Heart size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                                <button
                                    onClick={() => navigate("/shop")}
                                    className="text-gold hover:underline"
                                >
                                    Browse products
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
