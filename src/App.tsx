import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Customer Pages
import ExploreShops from "./pages/customer/ExploreShops";
import ShopDetails from "./pages/customer/ShopDetails";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";

// Shopkeeper Pages
import Dashboard from "./pages/shopkeeper/Dashboard";
import Products from "./pages/shopkeeper/Products";
import AddProduct from "./pages/shopkeeper/AddProduct";
import Customers from "./pages/shopkeeper/Customers";
import ShopkeeperOrders from "./pages/shopkeeper/Orders";
import ShopProfile from "./pages/shopkeeper/ShopProfile";

// Layouts
import { CustomerLayout } from "./components/Layout/CustomerLayout";
import { ShopkeeperLayout } from "./components/Layout/ShopkeeperLayout";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: 'customer' | 'shopkeeper';
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === 'customer' ? '/customer/explore' : '/shopkeeper/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

// Root redirect component
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const redirectPath = user?.role === 'customer' ? '/customer/explore' : '/shopkeeper/dashboard';
  return <Navigate to={redirectPath} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      
      {/* Customer Routes */}
      <Route path="/customer" element={
        <ProtectedRoute requiredRole="customer">
          <CustomerLayout />
        </ProtectedRoute>
      }>
        <Route path="explore" element={<ExploreShops />} />
        <Route path="shop/:shopId" element={<ShopDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Shopkeeper Routes */}
      <Route path="/shopkeeper" element={
        <ProtectedRoute requiredRole="shopkeeper">
          <ShopkeeperLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:productId" element={<AddProduct />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<ShopkeeperOrders />} />
        <Route path="profile" element={<ShopProfile />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
