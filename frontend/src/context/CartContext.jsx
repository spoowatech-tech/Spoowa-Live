import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart as apiGetCart, createCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, getRegions } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const items = cart?.items || [];
  
  // Derive summary from Medusa cart
  const summary = {
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: cart?.item_subtotal || 0,
    total: cart?.total || 0,
    discount: cart?.discount_total || 0,
    shipping: cart?.shipping_total || 0,
    tax: cart?.tax_total || 0,
  };

  const fetchCart = useCallback(async () => {
    try {
      const data = await apiGetCart();
      if (data?.cart) {
        setCart(data.cart);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (variantId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await apiAddToCart(variantId, quantity);
      if (data?.cart) {
        setCart(data.cart);
      }
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineItemId, quantity) => {
    if (quantity <= 0) {
      return remove(lineItemId);
    }

    try {
      const data = await apiUpdateCartItem(lineItemId, quantity);
      if (data?.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const remove = async (lineItemId) => {
    try {
      const data = await apiRemoveFromCart(lineItemId);
      if (data?.cart) {
        setCart(data.cart);
      } else {
        // Refetch cart after deletion
        await fetchCart();
      }
      toast.success('Item removed');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const clearCartState = () => {
    setCart(null);
    localStorage.removeItem('medusa_cart_id');
  };

  // Format price helper (Medusa stores prices in smallest unit, e.g. cents/paise)
  const formatPrice = (amount, currencyCode = 'inr') => {
    if (amount == null) return '₹0';
    const val = amount / 100; // Convert from paise to rupees
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <CartContext.Provider value={{ 
      cart,
      items,
      summary,
      loading,
      addToCart,
      updateQuantity,
      remove,
      fetchCart,
      clearCartState,
      formatPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
