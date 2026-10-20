import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/adminService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lankatrip_token'));
  const [loading, setLoading] = useState(true);

  // Load current user profile on app load if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('lankatrip_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('lankatrip_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updateData) => {
    const res = await userService.updateProfile(updateData);
    setUser((prev) => ({ ...prev, ...res.data }));
    return res.data;
  };

  const isFavorite = (destinationId) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some((fav) => {
      const id = typeof fav === 'string' ? fav : fav._id;
      return id === destinationId;
    });
  };

  const toggleFavorite = async (destinationId) => {
    if (!user) throw new Error('Please log in to save favorites');

    const currentlyFav = isFavorite(destinationId);
    if (currentlyFav) {
      await userService.removeFavorite(destinationId);
      setUser((prev) => ({
        ...prev,
        favorites: prev.favorites.filter((fav) => {
          const id = typeof fav === 'string' ? fav : fav._id;
          return id !== destinationId;
        }),
      }));
    } else {
      await userService.addFavorite(destinationId);
      setUser((prev) => ({
        ...prev,
        favorites: [...prev.favorites, destinationId],
      }));
    }
    return !currentlyFav;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    isFavorite,
    toggleFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
