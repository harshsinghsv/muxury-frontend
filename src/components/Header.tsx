import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Auth pages logic
  const isAuth = ['/login', '/register', '/forgot-password', '/enter-otp', '/create-new-password'].includes(location.pathname);

  // Shared Desktop Header
  const desktopHeader = isAuth ? null : (
    <header className="hidden md:flex items-center justify-between px-12 lg:px-24 xl:px-32 py-6 bg-white shrink-0 border-b border-[#EBEBEB] sticky top-0 z-50">
      <Link to="/" className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">
        Muxury.
      </Link>
      <nav className="flex items-center gap-10 font-['DM_Sans'] text-sm font-medium text-[#343434]">
        <Link to="/" className="hover:text-[#CA8385] transition-colors">Home</Link>
        <Link to="/shop" className="hover:text-[#CA8385] transition-colors">Collection</Link>
        <Link to="/about" className="hover:text-[#CA8385] transition-colors">Our Story</Link>
      </nav>
      <div className="flex items-center gap-5 relative">
        <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FAF8F7] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FAF8F7] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <button onClick={() => navigate('/cart')} className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center relative hover:bg-[#FAF8F7] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#CA8385] rounded-full text-white text-[10px] flex items-center justify-center font-bold items-center">
              {cartItemsCount}
            </span>
          )}
        </button>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#EBEBEB]">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Avatar" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );

  const renderMobileHeader = () => {
    // Auth & Onboarding pages don't have this header (it's embedded)
    if (isAuth) return null;

    // Product detail has overlay header
    if (location.pathname.startsWith('/product/')) return null;

    // Home Header Pattern
    if (location.pathname === '/') {
      return (
        <header className="flex md:hidden items-center justify-between px-5 py-4 bg-transparent shrink-0">
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
        <header className="flex md:hidden items-center justify-between px-5 py-4 bg-transparent shrink-0">
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

    // Sub-page Pattern (Back Arrow left + Playfair title center)
    let title = '';
    if (location.pathname.startsWith('/shop')) title = 'Category';
    if (location.pathname.startsWith('/profile')) title = 'Profile';
    if (location.pathname.startsWith('/checkout')) title = 'Payment';
    if (location.pathname.startsWith('/change-password')) title = 'Change Password';

    return (
      <header className="flex md:hidden items-center justify-between px-5 py-4 bg-transparent shrink-0">
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

  return (
    <>
      {desktopHeader}
      {renderMobileHeader()}
    </>
  );
}
