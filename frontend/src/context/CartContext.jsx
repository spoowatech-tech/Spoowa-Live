import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart, applyCoupon as apiApplyCoupon, clearCart, placeOrder as apiPlaceOrder, getProductById } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, totalMrp: 0, subtotal: 0, discount: 0, shipping: 0, total: 0 });
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const getGuestCartItems = () => {
    try {
      return JSON.parse(localStorage.getItem('guest_cart')) || [];
    } catch {
      return [];
    }
  };

  const saveGuestCartItems = (newItems) => {
    localStorage.setItem('guest_cart', JSON.stringify(newItems));
  };

  const calculateGuestSummary = (guestItems) => {
    const totalItems = guestItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = guestItems.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0);
    const totalMrp = guestItems.reduce((sum, i) => {
      const mrp = Number(i.original_price) || Number(i.originalPrice) || Number(i.price);
      return sum + (mrp * i.quantity);
    }, 0);
    const discount = totalMrp - subtotal;
    const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 49;
    const total = subtotal + shipping;
    return { totalItems, totalMrp, subtotal, discount, shipping, total };
  };

  const fetchCart = useCallback(async () => {
    if (!user) {
      const guestItems = getGuestCartItems();
      setItems(guestItems);
      setSummary(calculateGuestSummary(guestItems));
      return;
    }
    
    // User is logged in: Check for guest cart to merge
    const guestItems = getGuestCartItems();
    if (guestItems.length > 0) {
       try {
         for (const item of guestItems) {
            await apiAddToCart(item.product_id, item.quantity).catch(e => console.error(e));
         }
         localStorage.removeItem('guest_cart');
       } catch (err) {
         console.error('Failed to merge guest cart', err);
       }
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
  }, [user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      setLoading(true);
      try {
        const guestItems = getGuestCartItems();
        const existing = guestItems.find(i => i.product_id === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          const { product } = await getProductById(productId);
          guestItems.push({
            id: 'guest_' + Date.now() + Math.random(),
            product_id: productId,
            quantity,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            original_price: Number(product.original_price || product.originalPrice || product.price),
            badge: product.badge,
            discount: product.discount,
            image: product.image,
            gradient: product.gradient,
            type: product.type
          });
        }
        saveGuestCartItems(guestItems);
        setItems(guestItems);
        setSummary(calculateGuestSummary(guestItems));
        toast.success('Added to cart!');
        return true;
      } catch (error) {
        toast.error('Failed to add to guest cart');
        return false;
      } finally {
        setLoading(false);
      }
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
    if (quantity <= 0) {
      return remove(productId);
    }
    
    if (!user) {
      const guestItems = getGuestCartItems();
      const existing = guestItems.find(i => i.product_id === productId);
      if (existing) {
        existing.quantity = quantity;
        saveGuestCartItems(guestItems);
        setItems(guestItems);
        setSummary(calculateGuestSummary(guestItems));
      }
      return;
    }

    try {
      await updateCartItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const remove = async (productId) => {
    if (!user) {
      let guestItems = getGuestCartItems();
      guestItems = guestItems.filter(i => i.product_id !== productId);
      saveGuestCartItems(guestItems);
      setItems(guestItems);
      setSummary(calculateGuestSummary(guestItems));
      toast.success('Item removed');
      return;
    }

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
     if (!user) {
        toast.error('Please log in to place an order');
        return;
     }
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
