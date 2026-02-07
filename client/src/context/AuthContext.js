/**
 * Authentication Context
 * 
 * Manages user authentication state across the application.
 * Provides login, logout, and user data to all components.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch current user data
  const fetchUser = React.useCallback(async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);

      // Handle network errors
      if (!error.response) {
        return {
          success: false,
          message: 'Network error. Please check if the server is running on port 5000.'
        };
      }

      // Handle specific error messages from server
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Registration failed';

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
