'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // { id, name, email, ... }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('dca_token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('dca_user') : null;
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    const res = await axios.post(`${API_BASE}/api/v1/auth/login`, form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = res.data;
    setToken(data.access_token);
    const userObj = { id: data.user_id, name: data.user_name, email: data.user_email };
    setUser(userObj);
    localStorage.setItem('dca_token', data.access_token);
    localStorage.setItem('dca_user', JSON.stringify(userObj));
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await axios.post(`${API_BASE}/api/v1/auth/register`, payload);
    const data = res.data;
    setToken(data.access_token);
    const userObj = { id: data.user_id, name: data.user_name, email: data.user_email };
    setUser(userObj);
    localStorage.setItem('dca_token', data.access_token);
    localStorage.setItem('dca_user', JSON.stringify(userObj));
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dca_token');
    localStorage.removeItem('dca_user');
  }, []);

  const getProfile = useCallback(async () => {
    if (!token) return null;
    const res = await axios.get(`${API_BASE}/api/v1/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }, [token]);

  const updateProfile = useCallback(async (payload) => {
    if (!token) return null;
    const res = await axios.put(`${API_BASE}/api/v1/auth/profile`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, getProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
