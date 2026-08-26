'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

// All 22 Official Indian Languages (8th Schedule of Indian Constitution)
const languages = [
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'en', name: 'English (India)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'mai', name: 'मैथिली (Maithili)' },
  { code: 'sa', name: 'संस्कृतम् (Sanskrit)' },
  { code: 'ks', name: 'کٲشُر (Kashmiri)' },
  { code: 'ne', name: 'नेपाली (Nepali)' },
  { code: 'sd', name: 'سنڌي (Sindhi)' },
  { code: 'kok', name: 'कोंकणी (Konkani)' },
  { code: 'doi', name: 'डोगरी (Dogri)' },
  { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'brx', name: 'बड़ो (Bodo)' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-white">
      <Globe className="w-4 h-4 text-saffron-500 flex-shrink-0" />
      <select
        value={i18n.language || 'hi'}
        onChange={handleLanguageChange}
        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer text-white max-w-[130px]"
        title="Select Language (भाषा चुनें)"
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
