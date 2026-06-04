import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart, applyCoupon as apiApplyCoupon, clearCart, placeOrder as apiPlaceOrder } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, totalMrp: 0, subtotal: 0, discount: 0, shipping: 0, total: 0 });
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setSummary({ totalItems: 0, totalMrp: 0, subtotal: 0, discount: 0, shipping: 0, total: 0 });
      return;
    }
    try {
      const data = await getCart();
      setItems(data.items);
      setSummary(data.summary);
      
      // Re-apply coupon if exists and cart changed
      if (coupon && data.summary.total > 0) {
         try {
           const result = await apiApplyCoupon(coupon.code, data.summary.total);
           setCoupon(result);
         } catch {
           setCoupon(null);
         }
      } else if (data.summary.total === 0) {
         setCoupon(null);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }, [user, coupon]);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      return false;
    }
    setLoading(true);
    try {
      await apiAddToCart(productId, quantity);
      await fetchCart();
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const remove = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
      toast.success('Item removed');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const applyCoupon = async (code) => {
    if (!code) {
       setCoupon(null);
       return;
    }
    try {
      const result = await apiApplyCoupon(code, summary.total);
      setCoupon({ ...result.coupon, discountAmount: result.discountAmount });
      toast.success(result.message || 'Coupon applied!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to apply coupon');
      return false;
    }
  };
  
  const removeCoupon = () => {
    setCoupon(null);
    toast.success('Coupon removed');
  };

  const placeOrder = async (addressId = null) => {
     try {
        setLoading(true);
        const data = await apiPlaceOrder(addressId, coupon?.code, coupon?.discountAmount);
        toast.success(data.message || 'Order placed successfully!');
        setCoupon(null);
        await fetchCart();
        return data;
     } catch (error) {
        toast.error(error.message || 'Failed to place order');
        throw error;
     } finally {
        setLoading(false);
     }
  };

  // Calculate final total with coupon
  const finalTotal = summary.total - (coupon?.discountAmount || 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      summary: { ...summary, finalTotal }, 
      coupon,
      loading, 
      addToCart, 
      updateQuantity, 
      remove,
      applyCoupon,
      removeCoupon,
      placeOrder,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
