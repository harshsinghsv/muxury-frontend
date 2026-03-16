import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Context Providers
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/admin/AdminRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import EnterOTP from "./pages/EnterOTP";
import CreateNewPassword from "./pages/CreateNewPassword";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import DashboardPage from "./pages/admin/Dashboard";
import ProductsAdminPage from "./pages/admin/ProductsAdmin";
import OrdersAdminPage from "./pages/admin/OrdersAdmin";
import CustomersAdminPage from "./pages/admin/CustomersAdmin";
import CategoriesAdminPage from "./pages/admin/CategoriesAdmin";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`w-full ${isAdminRoute ? 'max-w-none' : 'max-w-[1440px] px-0 2xl:px-12'} mx-auto min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-x-hidden shadow-2xl md:shadow-none`}>
      <Toaster />
      <Sonner />

      {!isAdminRoute && <Header />}

      <main className={`flex-1 overflow-y-auto ${!isAdminRoute ? 'pb-24' : ''} [-webkit-overflow-scrolling:touch]`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/enter-otp" element={<EnterOTP />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductsAdminPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrdersAdminPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><CustomersAdminPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoriesAdminPage /></AdminRoute>} />

          {/* Protected routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes that redirect to shop */}
          <Route path="/collections" element={<Shop />} />
          <Route path="/wishlist" element={<Profile />} />
          <Route path="/orders" element={<Profile />} />
          <Route path="/contact" element={<Index />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <TooltipProvider>
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </TooltipProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
