'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, Volume2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const speak = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN'; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      speak('लॉगिन सफल रहा। आपका स्वागत है।');
      router.push('/profile');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your email and password.';
      setError(msg);
      speak('लॉगिन विफल। कृपया अपना ईमेल और पासवर्ड जांचें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-tr from-saffron-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Landmark className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-govblue-900">नागरिक लॉगिन</h1>
          <p className="text-sm text-slate-500">Citizen Login — Digital Citizen Assistant</p>
          <button onClick={() => speak('अपना ईमेल और पासवर्ड दर्ज करके लॉगिन करें।')}
            className="inline-flex items-center gap-1 text-xs text-saffron-600 hover:underline">
            <Volume2 className="w-3.5 h-3.5" /> सुनें (Listen)
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                📧 ईमेल पता (Email Address)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🔒 पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> लॉगिन हो रहा है…</> : '🔓 लॉगिन करें (Login)'}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500">
            नया खाता बनाएं?{' '}
            <Link href="/register" className="text-govblue-900 font-extrabold hover:text-saffron-600 underline">
              रजिस्टर करें (Register)
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          🔒 आपका डेटा सुरक्षित है। Your data is protected under Government Data Security Standards.
        </p>
      </div>
    </div>
  );
}
