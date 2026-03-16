import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "@/context/CartContext";
import Icon from '@/components/Icon';

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
            icon: <Icon name="home" size="w-6 h-6" />
        },
        {
            id: 'category',
            path: '/shop',
            icon: <Icon name="category" size="w-6 h-6" />
        },
        {
            id: 'cart',
            path: '/cart',
            icon: <Icon name="bag" size="w-6 h-6" />
        },
        {
            id: 'saved',
            path: '/wishlist',
            icon: <Icon name="heart" size="w-6 h-6" />
        },
        {
            id: 'orders',
            path: '/orders',
            icon: <Icon name="document" size="w-6 h-6" />
        }
    ];

    const showNav = ['/', '/shop', '/cart', '/wishlist', '/orders', '/profile'].includes(location.pathname);
    if (!showNav) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full md:hidden bg-white/95 backdrop-blur-md border-t border-[#EBEBEB] flex items-center justify-between px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className={`flex items-center justify-center w-12 h-12 [-webkit-tap-highlight-color:transparent] transition-colors relative ${activeTab === tab.id ? 'text-[#343434]' : 'text-[#999999] hover:text-[#CA8385]'}`}
                >
                    {tab.icon}
                    
                    {tab.id === 'cart' && cartItemsCount > 0 && (
                        <span className="absolute top-1 right-2 w-[18px] h-[18px] bg-[#CA8385] rounded-full text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
                            {cartItemsCount}
                        </span>
                    )}
                </button>
            ))}
        </nav>
    );
}
