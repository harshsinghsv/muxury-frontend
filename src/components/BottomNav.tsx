import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { items } = useCart();

    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    let activeTab = 'home';
    if (location.pathname.startsWith('/shop')) activeTab = 'category';
    else if (location.pathname.startsWith('/cart')) activeTab = 'cart';
    else if (location.pathname.startsWith('/wishlist') || location.pathname.startsWith('/saved')) activeTab = 'saved';
    else if (location.pathname.startsWith('/orders') || location.pathname.startsWith('/profile')) activeTab = 'orders';

    const tabs = [
        {
            id: 'home',
            path: '/',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            )
        },
        {
            id: 'category',
            path: '/shop',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                </svg>
            )
        },
        {
            id: 'cart',
            path: '/cart',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
            )
        },
        {
            id: 'saved',
            path: '/wishlist',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            )
        },
        {
            id: 'orders',
            path: '/orders',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            )
        }
    ];

    const showNav = ['/', '/shop', '/cart', '/wishlist', '/orders', '/profile'].includes(location.pathname);
    if (!showNav) return null;

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-[#EBEBEB] flex items-center justify-around px-4 py-3 pb-6 z-40">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className={`flex flex-col items-center gap-1 [-webkit-tap-highlight-color:transparent] ${activeTab === tab.id ? 'text-[#343434]' : 'text-[#999999]'}`}
                >
                    {tab.id === 'cart'
                        ? <div className="bg-[#343434] rounded-full p-3 -mt-6 shadow-xl relative text-white">
                            {tab.icon}
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#CA8385] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                                    {cartItemsCount}
                                </span>
                            )}
                        </div>
                        : tab.icon
                    }
                    {activeTab === tab.id && tab.id !== 'cart' && (
                        <span className="w-1 h-1 rounded-full bg-[#CA8385]" />
                    )}
                </button>
            ))}
        </nav>
    );
}
