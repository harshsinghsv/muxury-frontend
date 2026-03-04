import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Home Header Pattern
  if (location.pathname === '/') {
    return (
      <header className="flex items-center justify-between px-5 py-4 bg-transparent shrink-0">
        <button className="w-9 h-9 flex flex-col justify-center gap-[5px] active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
          <span className="w-5 h-[2px] bg-[#343434] rounded-full" />
          <span className="w-5 h-[2px] bg-[#343434] rounded-full" />
          <span className="w-3 h-[2px] bg-[#343434] rounded-full" />
        </button>
        <div className="flex items-center gap-3 relative">
          <button onClick={() => navigate('/shop')} className="w-9 h-9 flex items-center justify-center relative active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button onClick={() => navigate('/cart')} className="w-9 h-9 flex items-center justify-center relative active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#CA8385] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#EBEBEB] active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Avatar" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>
    );
  }

  // Transactional / Center Title Pattern 
  const isCentered = ['/cart', '/wishlist', '/orders'].includes(location.pathname);
  if (isCentered) {
    let title = 'Title';
    if (location.pathname === '/cart') title = 'My Cart';
    if (location.pathname === '/wishlist') title = 'Saved Items';
    if (location.pathname === '/orders') title = 'My Orders';

    return (
      <header className="flex items-center justify-between px-5 py-4 bg-transparent shrink-0">
        <div className="w-9 h-9" />
        <h1 className="font-['Playfair_Display'] text-lg font-medium text-[#343434]">{title}</h1>
        <button onClick={() => navigate('/shop')} className="w-9 h-9 flex items-center justify-center active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </header>
    );
  }

  // Auth & Onboarding pages don't have this header (it's embedded)
  const isAuth = ['/login', '/register', '/forgot-password', '/enter-otp', '/create-new-password'].includes(location.pathname);
  if (isAuth) return null;

  // Product detail has overlay header
  if (location.pathname.startsWith('/product/')) return null;

  // Sub-page Pattern (Back Arrow left + Playfair title center)
  let title = '';
  if (location.pathname.startsWith('/shop')) title = 'Category';
  if (location.pathname.startsWith('/profile')) title = 'Profile';
  if (location.pathname.startsWith('/checkout')) title = 'Payment';
  if (location.pathname.startsWith('/change-password')) title = 'Change Password';

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-transparent shrink-0">
      <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-start active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1 className="font-['Playfair_Display'] text-lg font-medium text-[#343434]">{title}</h1>
      <div className="w-9 h-9"></div>
    </header>
  );
}
