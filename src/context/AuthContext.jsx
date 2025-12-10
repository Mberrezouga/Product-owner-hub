import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/localStorage';
import { loginWithGoogle, loginWithMicrosoft } from '../services/socialAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getFromStorage('po_hub_user');
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple login - in production, this would call an API
    const users = getFromStorage('po_hub_users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = { email: user.email, name: user.name, isGuest: false };
      setUser(userData);
      saveToStorage('po_hub_user', userData);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (name, email, password) => {
    const users = getFromStorage('po_hub_users') || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveToStorage('po_hub_users', users);

    const userData = { email, name, isGuest: false };
    setUser(userData);
    saveToStorage('po_hub_user', userData);
    return { success: true };
  };

  const loginAsGuest = () => {
    const guestUser = {
      email: 'guest@demo.com',
      name: 'Guest User',
      isGuest: true
    };
    setUser(guestUser);
    saveToStorage('po_hub_user', guestUser);
  };

  const socialLogin = async (provider) => {
    try {
      let result;
      
      if (provider === 'google') {
        result = await loginWithGoogle();
      } else if (provider === 'microsoft') {
        result = await loginWithMicrosoft();
      } else {
        return { success: false, error: 'Invalid provider' };
      }

      if (result.success && result.user) {
        const userData = {
          email: result.user.email,
          name: result.user.name,
          provider: result.user.provider,
          avatar: result.user.avatar,
          isGuest: false,
          isSocial: true,
        };
        setUser(userData);
        saveToStorage('po_hub_user', userData);
        return { success: true };
      }

      return result;
    } catch (error) {
      console.error('Social login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    removeFromStorage('po_hub_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginAsGuest,
    socialLogin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
