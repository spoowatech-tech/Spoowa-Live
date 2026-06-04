import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, loginUser, signupRequest, signupVerify, googleLogin, logoutUser, isLoggedIn } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (isLoggedIn()) {
        try {
          const data = await getProfile();
          setUser(data.user);
        } catch (error) {
          console.error('Failed to load profile:', error);
          await logoutUser();
        }
      }
      setLoading(false);
    }
    loadUser();

    const handleUnauthorized = async () => {
      setUser(null);
      toast.error('Session expired. Please log in again.');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    toast.success('Logged in successfully!');
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const data = await googleLogin(credential);
    setUser(data.user);
    toast.success('Logged in with Google!');
    return data;
  };

  const requestSignup = async (name, email, password, phone) => {
    const data = await signupRequest(name, email, password, phone);
    toast.success('Verification code sent to ' + phone);
    return data;
  };

  const verifySignup = async (name, email, password, phone, code) => {
    const data = await signupVerify(name, email, password, phone, code);
    setUser(data.user);
    toast.success('Account created successfully!');
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, requestSignup, verifySignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
