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
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] md:hidden bg-white border-t border-[#EBEBEB] flex items-center justify-around px-4 py-3 pb-6 z-40">
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
