'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Landmark, Database, Cpu } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { t } = useTranslation();
  const [highContrast, setHighContrast] = useState(false);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-govblue-900 text-white shadow-xl border-b-4 border-saffron-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Header */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 bg-gradient-to-tr from-saffron-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              {t('app_name')}
              <span className="text-[10px] bg-saffron-500 text-govblue-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                SIH 2026
              </span>
            </h1>
            <p className="text-xs text-slate-300 font-medium hidden sm:block">
              {t('app_tagline')}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-5 text-xs font-extrabold">
          <Link href="/" className="hover:text-saffron-500 transition-colors">
            {t('nav_home')}
          </Link>
          <Link href="/vector-search" className="hover:text-saffron-500 transition-colors flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-saffron-500" /> Vector Match
          </Link>
          <Link href="/eligibility" className="hover:text-saffron-500 transition-colors">
            {t('nav_eligibility')}
          </Link>
          <Link href="/automation" className="hover:text-saffron-500 transition-colors flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> n8n OCR
          </Link>
          <Link href="/tracking" className="hover:text-saffron-500 transition-colors">
            {t('nav_tracking')}
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleHighContrast}
            title={t('high_contrast')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-colors"
          >
            {highContrast ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>
          <LanguageSelector />
        </div>

      </div>
    </header>
  );
}
