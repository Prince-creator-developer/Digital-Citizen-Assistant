'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-white">
      <Globe className="w-4 h-4 text-saffron-500" />
      <select
        value={i18n.language || 'hi'}
        onChange={handleLanguageChange}
        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-white"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-govblue-900 text-white">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
