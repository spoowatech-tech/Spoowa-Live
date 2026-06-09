import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginCustomer, getCustomerProfile, logoutCustomer, isLoggedIn, registerCustomer, storeSocialToken, createCustomerFromSocial } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (isLoggedIn()) {
        try {
          const data = await getCustomerProfile();
          setUser(data.customer);
        } catch (error) {
          console.error('Failed to load profile:', error);
          await logoutCustomer();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await loginCustomer(email, password);
    // After login, fetch customer profile
    const profile = await getCustomerProfile();
    setUser(profile.customer);
    toast.success('Logged in successfully!');
    return data;
  };

  const register = async ({ first_name, last_name, email, password }) => {
    // Medusa v2: first register via auth, then create customer
    // Step 1: Create auth identity
    const authData = await fetch('/auth/customer/emailpass/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!authData.ok) {
      const err = await authData.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }

    const { token } = await authData.json();
    localStorage.setItem('medusa_token', token);

    // Step 2: Create the customer record
    const customerData = await registerCustomer({ first_name, last_name, email, password });
    setUser(customerData.customer);
    toast.success('Account created successfully!');
    return customerData;
  };

  /**
   * Handle social OAuth callback.
   * Called by AuthCallback page after receiving a token from the backend.
   * 
   * Flow:
   * 1. Store the JWT token
   * 2. Fetch the customer profile
   * 3. If no customer exists (first-time social login), create one
   * 4. Set the user state
   */
  const handleSocialCallback = useCallback(async (token) => {
    // Store the token from OAuth callback
    storeSocialToken(token);

    try {
      // Try to fetch existing customer profile
      const profile = await getCustomerProfile();
      setUser(profile.customer);
      toast.success('Logged in successfully!');
    } catch (profileError) {
      // Customer doesn't exist yet (first-time social login)
      // Decode JWT token to get user info from Google/Facebook
      try {
        let profileData = {};
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          
          if (decoded.user_metadata) {
            profileData = {
              email: decoded.user_metadata.email,
              first_name: decoded.user_metadata.given_name || decoded.user_metadata.first_name || '',
              last_name: decoded.user_metadata.family_name || decoded.user_metadata.last_name || '',
            };
            // Fallback for full name splitting if given/family names aren't provided
            if (!profileData.first_name && decoded.user_metadata.name) {
              const parts = decoded.user_metadata.name.split(' ');
              profileData.first_name = parts[0];
              profileData.last_name = parts.slice(1).join(' ');
            }
          }
        }

        const customerData = await createCustomerFromSocial(profileData);
        setUser(customerData.customer);
        toast.success('Account created successfully!');
      } catch (createError) {
        console.error('Failed to create customer from social login:', createError);
        // Still logged in via auth, just no customer record yet
        toast.success('Logged in successfully, but profile creation failed.');
      }
    }
  }, []);

  const logout = async () => {
    await logoutCustomer();
    setUser(null);
    toast.success('Logged out');
  };

  // Simple role helpers (Medusa doesn't have RBAC roles like the old system)
  const isAdmin = () => false; // Admin is handled by Medusa's built-in admin panel

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin,
      handleSocialCallback,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

