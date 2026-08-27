import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('wayfare_token');
      if (token) {
        try {
          const profile = await api.auth.getProfile();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid, clearing token.');
          localStorage.removeItem('wayfare_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await api.auth.login(credentials);
    if (data.token) {
      localStorage.setItem('wayfare_token', data.token);
    }
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await api.auth.register(userData);
    if (data.token) {
      localStorage.setItem('wayfare_token', data.token);
    }
    setUser(data);
    return data;
  };

  const demoLogin = async () => {
    const data = await api.auth.demoLogin();
    if (data.token) {
      localStorage.setItem('wayfare_token', data.token);
    }
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('wayfare_token');
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    const updated = await api.auth.updateProfile(updatedData);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
