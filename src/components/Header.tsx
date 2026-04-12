import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/Icon";
import { useAuth } from "@/context/AuthContext";
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { user, isAuthenticated } = useAuth();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth pages logic
  const isAuth = ['/login', '/register', '/forgot-password', '/enter-otp', '/create-new-password'].includes(location.pathname);

  // Shared Desktop Header
  const desktopHeader = isAuth ? null : (
    <header className="hidden rounded-lg md:flex items-center justify-between px-12 lg:px-24 xl:px-32 py-6 bg-white shrink-0 border-b border-[#EBEBEB] sticky top-0 z-50">
      <Link to="/" className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">
        Muxury.
      </Link>
      <nav className="flex items-center gap-10 font-['DM_Sans'] text-sm font-medium text-[#343434]">
        <Link to="/" className="hover:text-[#CA8385] transition-colors">Home</Link>
        <Link to="/shop" className="hover:text-[#CA8385] transition-colors">Collection</Link>
      </nav>
      <div className="flex items-center gap-5 relative">
        <button onClick={() => navigate('/shop')} className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FAF8F7] transition-colors">
          <Icon name="buy" size="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FAF8F7] transition-colors">
          <Icon name="heart" size="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/cart')} className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center relative hover:bg-[#FAF8F7] transition-colors">
          <Icon name="bag" size="w-5 h-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#CA8385] rounded-full text-white text-[10px] flex items-center justify-center font-bold items-center">
              {cartItemsCount}
            </span>
          )}
        </button>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#FAF8F7] text-[#343434] hover:bg-[#EBEBEB] transition-colors font-medium">
          {isAuthenticated && user?.firstName ? (
            <span>{user.firstName.charAt(0).toUpperCase()}</span>
          ) : (
            <CgProfile size={18} />
          )}
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
          <button onClick={() => setIsSidebarOpen(true)} className="min-w-[44px] min-h-[44px] w-11 h-11 flex flex-col justify-center items-center gap-[5px] active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent] focus:outline-none">
            <span className="w-5 h-[2px] bg-[#343434] rounded-full" />
            <span className="w-5 h-[2px] bg-[#343434] rounded-full" />
            <span className="w-3 h-[2px] bg-[#343434] rounded-full" />
          </button>
          <div className="flex items-center gap-2 relative">
            <button onClick={() => navigate('/shop')} className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center relative active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
              <Icon name="buy" size="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/cart')} className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center relative active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent]">
              <Icon name="bag" size="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#CA8385] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/profile')} className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full overflow-hidden active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent] flex items-center justify-center bg-[#FAF8F7] text-[#343434] font-medium">
              {isAuthenticated && user?.firstName ? (
                <span>{user.firstName.charAt(0).toUpperCase()}</span>
              ) : (
                <CgProfile size={24} />
              )}
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
        <header className="flex md:hidden items-center justify-between px-5 py-4 bg-transparent shrink-0 relative">
          <div className="min-w-[44px] min-h-[44px]" />
          <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
          <button onClick={() => navigate('/shop')} className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent] hover:text-[#CA8385]">
            <Icon name="buy" size="w-5 h-5" />
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
      <header className="flex md:hidden items-center justify-between px-5 py-4 bg-transparent shrink-0 relative">
        <button onClick={() => navigate(-1)} className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-start active:scale-95 transition-transform [-webkit-tap-highlight-color:transparent] hover:text-[#CA8385] relative z-10">
          <Icon name="back" size="w-6 h-6" />
        </button>
        <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
        <div className="min-w-[44px] min-h-[44px]"></div>
      </header>
    );
  }

  return (
    <>
      {desktopHeader}
      {renderMobileHeader()}
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar drawer */}
          <div className="relative w-[300px] max-w-[80vw] h-full bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB]">
               <Link to="/" onClick={() => setIsSidebarOpen(false)} className="font-['Playfair_Display'] text-2xl font-bold text-[#343434]">
                Muxury.
               </Link>
               <button 
                 onClick={() => setIsSidebarOpen(false)} 
                 className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FAF8F7] active:scale-95 transition-colors focus:outline-none"
               >
                 <Icon name="close" size="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="font-['DM_Sans'] text-lg font-medium text-[#343434] active:text-[#CA8385]">Home</Link>
                <Link to="/shop" onClick={() => setIsSidebarOpen(false)} className="font-['DM_Sans'] text-lg font-medium text-[#343434] active:text-[#CA8385]">Collection</Link>
              </div>
              
              <div className="w-8 h-px bg-[#EBEBEB]" />
              
              <div className="flex flex-col gap-6">
                <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="font-['DM_Sans'] text-lg font-medium text-[#343434] active:text-[#CA8385] flex items-center justify-between">
                  My Account
                  <Icon name="profile" size="w-5 h-5" />
                </Link>
                <Link to="/orders" onClick={() => setIsSidebarOpen(false)} className="font-['DM_Sans'] text-lg font-medium text-[#343434] active:text-[#CA8385] flex items-center justify-between">
                  My Orders
                  <Icon name="document" size="w-5 h-5" />
                </Link>
                <Link to="/wishlist" onClick={() => setIsSidebarOpen(false)} className="font-['DM_Sans'] text-lg font-medium text-[#343434] active:text-[#CA8385] flex items-center justify-between">
                  Saved Items
                  <Icon name="heart" size="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="p-6 border-t border-[#EBEBEB] bg-white">
               {isAuthenticated && user ? (
                 <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-[#343434] text-white font-medium border border-white shrink-0">
                      {user.avatar ? (
                          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <span>{user.firstName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-['DM_Sans'] font-bold text-[#343434] text-sm truncate">{user.firstName} {user.lastName}</span>
                      <span className="font-['DM_Sans'] text-[#999999] text-xs truncate">{user.email}</span>
                    </div>
                 </div>
               ) : (
                 <Link to="/login" onClick={() => setIsSidebarOpen(false)} className="w-full h-12 bg-[#343434] text-white flex items-center justify-center rounded-full font-['DM_Sans'] font-medium text-sm active:scale-95 transition-transform">
                   Sign In / Register
                 </Link>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
