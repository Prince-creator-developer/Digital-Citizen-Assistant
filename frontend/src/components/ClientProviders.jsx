'use client';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import '../i18n';

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
