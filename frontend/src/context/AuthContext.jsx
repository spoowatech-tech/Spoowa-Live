import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, loginUser, registerUser, logoutUser, isLoggedIn } from '../services/api';
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
          logoutUser();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    toast.success('Logged in successfully!');
    return data;
  };

  const register = async (name, email, password, confirmPassword) => {
    const data = await registerUser(name, email, password, confirmPassword);
    setUser(data.user);
    toast.success('Account created successfully!');
    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
