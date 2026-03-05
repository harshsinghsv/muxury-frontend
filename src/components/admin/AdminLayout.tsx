import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminIcon, icons } from "./AdminIcons";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
    children: ReactNode;
    pageTitle: string;
}

const navItems = [
    { id: "/admin/dashboard", label: "Dashboard", icon: icons.dashboard },
    { id: "/admin/products", label: "Products", icon: icons.products },
    { id: "/admin/orders", label: "Orders", icon: icons.orders },
    { id: "/admin/categories", label: "Categories", icon: icons.categories },
    { id: "/admin/users", label: "Customers", icon: icons.users },
];

export default function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const SidebarContent = () => (
        <>
            <div className="px-6 pb-7 border-b border-white/10">
                <Link to="/" className="flex items-center gap-3 w-max">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-[#8B5E5F] flex items-center justify-center">
                        <span className="text-white font-display font-bold text-base">M</span>
                    </div>
                    <div>
                        <p className="font-display font-bold text-white tracking-wide leading-none">Muxury</p>
                        <p className="font-sans text-[10px] text-gold uppercase tracking-widest mt-1 leading-none">Admin Panel</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
                {navItems.map(item => {
                    const isActive = location.pathname.startsWith(item.id);
                    return (
                        <Link
                            key={item.id}
                            to={item.id}
                            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${isActive ? "bg-gold/15" : "hover:bg-white/5"
                                }`}
                        >
                            <AdminIcon
                                d={item.icon}
                                size={18}
                                stroke={isActive ? "#CA8385" : "#666"}
                                sw={isActive ? 2.2 : 1.8}
                            />
                            <span
                                className={`font-sans text-sm ${isActive ? "font-semibold text-[#F5F0EB]" : "text-[#888]"
                                    }`}
                            >
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="ml-auto w-1 h-1 rounded-full bg-gold" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-[#8B5E5F] flex items-center justify-center text-white text-xs font-bold">
                        {user?.firstName?.[0] || "A"}
                        {user?.lastName?.[0] || "K"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[13px] font-semibold text-[#F5F0EB] truncate">
                            {user?.firstName || "Admin"}
                        </p>
                        <p className="text-[11px] text-[#666] truncate">{user?.role || "Owner"}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3.5 py-2 w-full rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                    <AdminIcon d={icons.logout} size={16} stroke="#666" />
                    <span className="font-sans text-[13px] text-[#666]">Sign out</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen font-sans bg-[#F7F4F0]">
            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden lg:flex w-60 bg-[#1C1C1E] flex-col py-7 fixed inset-y-0 left-0 z-50 overflow-y-auto shadow-xl">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar (Slide-over) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1C1E] flex flex-col py-7 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 lg:ml-60">
                <header className="bg-white border-b border-[#F0EDE8] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted"
                        >
                            <AdminIcon d={icons.menu} size={22} stroke="#1a1a1a" />
                        </button>
                        <div>
                            <h1 className="font-display text-xl md:text-2xl font-bold text-[#1a1a1a] leading-tight">
                                {pageTitle}
                            </h1>
                            <p className="font-sans text-xs md:text-[13px] text-[#999] mt-0.5 hidden sm:block">
                                {new Date().toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            target="_blank"
                            className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors text-charcoal"
                        >
                            <AdminIcon d={icons.eye} size={15} stroke="#343434" />
                            View Store
                        </Link>
                        <button className="w-10 h-10 border-1.5 border-[#EBEBEB] rounded-xl bg-white flex items-center justify-center relative hover:bg-muted transition-colors">
                            <AdminIcon d={icons.bell} size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold border border-white" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
