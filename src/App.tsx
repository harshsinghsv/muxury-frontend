import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import StatusBar from "@/components/StatusBar";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <TooltipProvider>
              <BrowserRouter>
                <div className="max-w-[390px] mx-auto min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-x-hidden shadow-2xl">
                  <Toaster />
                  <Sonner />

                  <StatusBar />
                  <Header />

                  <main className="flex-1 overflow-y-auto pb-24 [-webkit-overflow-scrolling:touch]">
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
                      <Route path="/about" element={<Index />} />
                      <Route path="/contact" element={<Index />} />

                      {/* 404 catch-all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>

                  <BottomNav />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
