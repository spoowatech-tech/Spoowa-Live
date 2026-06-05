import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, toggleWishlist as apiToggleWishlist } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const data = await getWishlist();
      setItems(data.items);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      window.location.href = '/auth';
      return false;
    }
    setLoading(true);
    try {
      const result = await apiToggleWishlist(productId);
      
      // Optimistic update
      if (result.added) {
         toast.success('Added to wishlist!');
         // Just refetch to keep data accurate, or could manually add to state
         await fetchWishlist();
      } else {
         toast.success('Removed from wishlist');
         setItems(prev => prev.filter(i => i.product_id !== productId));
      }
      return result.added;
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return items.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      items, 
      loading, 
      toggleWishlist, 
      isInWishlist,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
