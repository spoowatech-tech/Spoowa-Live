import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import About from './pages/About';
import TeamPage from './pages/TeamPage';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import ContactUs from './pages/ContactUs';
import RetailerDashboard from './pages/RetailerDashboard';
import DistributorDashboard from './pages/DistributorDashboard';

// RBAC Dashboard Pages
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import CityDistributorDashboard from './pages/dashboards/CityDistributorDashboard';
import GymDistributorDashboard from './pages/dashboards/GymDistributorDashboard';
import TrainerDashboard from './pages/dashboards/TrainerDashboard';
import CustomerAccount from './pages/dashboards/CustomerAccount';

// Application Pages
import TrainerApplicationPage from './pages/applications/TrainerApplicationPage';
import GymApplicationPage from './pages/applications/GymApplicationPage';
import ApplyForRolesPage from './pages/applications/ApplyForRolesPage';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Utility component to handle smooth scrolling to #hash anchors on page load or navigation
function ScrollToHashElement() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 120);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, pathname]);

  return null;
}

function App() {
  return (
    <GoogleOAuthProvider clientId="your_google_client_id_here">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToHashElement />
              <Toaster position="top-right" />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* Legacy Routes (preserved) */}
                <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
                <Route path="/distributor/dashboard" element={<DistributorDashboard />} />

                {/* Public Application Pages */}
                <Route path="/apply" element={<ApplyForRolesPage />} />
                <Route path="/apply/trainer" element={<TrainerApplicationPage />} />
                <Route path="/apply/gym" element={<GymApplicationPage />} />

                {/* RBAC Protected Dashboard Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute roles={['SUPER_ADMIN']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/city-distributor/dashboard" element={
                  <ProtectedRoute roles={['CITY_DISTRIBUTOR']}>
                    <CityDistributorDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/gym-distributor/dashboard" element={
                  <ProtectedRoute roles={['GYM_OR_AREA_DISTRIBUTOR']}>
                    <GymDistributorDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/trainer/dashboard" element={
                  <ProtectedRoute roles={['TRAINER_OR_RETAILER']}>
                    <TrainerDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/customer/account" element={
                  <ProtectedRoute roles={['CUSTOMER', 'SUPER_ADMIN', 'CITY_DISTRIBUTOR', 'GYM_OR_AREA_DISTRIBUTOR', 'TRAINER_OR_RETAILER']}>
                    <CustomerAccount />
                  </ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
