'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Volume2 } from 'lucide-react';

// All 22 Official Indian Languages (8th Schedule of Constitution of India)
const languages = [
  { code: 'hi', name: 'हिंदी (Hindi)', speech: 'हिंदी भाषा चुनी गई है। मैं आपकी सहायता के लिए तैयार हूँ।', langCode: 'hi-IN' },
  { code: 'en', name: 'English (India)', speech: 'English language selected. Ready to assist you.', langCode: 'en-IN' },
  { code: 'bn', name: 'বাংলা (Bengali)', speech: 'বাংলা ভাষা নির্বাচিত হয়েছে।', langCode: 'bn-IN' },
  { code: 'te', name: 'తెలుగు (Telugu)', speech: 'తెలుగు భాష ఎంచుకోబడింది.', langCode: 'te-IN' },
  { code: 'mr', name: 'मराठी (Marathi)', speech: 'मराठी भाषा निवडली आहे.', langCode: 'mr-IN' },
  { code: 'ta', name: 'தமிழ் (Tamil)', speech: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது.', langCode: 'ta-IN' },
  { code: 'ur', name: 'اردو (Urdu)', speech: 'اردو زبان منتخب کی گئی ہے۔', langCode: 'ur-IN' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', speech: 'ગુજરાતી ભાષા પસંદ કરી છે.', langCode: 'gu-IN' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', speech: 'ಕನ್ನಡ ಭಾಷೆ ಆಯ್ಕೆಯಾಗಿದೆ.', langCode: 'kn-IN' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', speech: 'ଓଡ଼ିଆ ଭାଷା ମନୋନୀତ ହୋଇଛି।', langCode: 'or-IN' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', speech: 'മലയാളം ഭാഷ തിരഞ്ഞെടുത്തു.', langCode: 'ml-IN' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', speech: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ ਹੈ।', langCode: 'pa-IN' },
  { code: 'as', name: 'অসমীয়া (Assamese)', speech: 'অসমীয়া ভাষা বাছনি কৰা হৈছে।', langCode: 'as-IN' },
  { code: 'mai', name: 'मैथिली (Maithili)', speech: 'मैथिली भाषा चुनल गेल अछि।', langCode: 'hi-IN' },
  { code: 'sa', name: 'संस्कृतम् (Sanskrit)', speech: 'संस्कृतभाषा चीयते।', langCode: 'hi-IN' },
  { code: 'ks', name: 'کٲشُر (Kashmiri)', speech: 'کٲشُر زَبانہِ پؠٹھ کٲم۔', langCode: 'ur-IN' },
  { code: 'ne', name: 'नेपाली (Nepali)', speech: 'नेपाली भाषा चयन गरिएको छ।', langCode: 'hi-IN' },
  { code: 'sd', name: 'سنڌي (Sindhi)', speech: 'سنڌي ٻولي چونڊجي وئي آهي.', langCode: 'ur-IN' },
  { code: 'kok', name: 'कोंकणी (Konkani)', speech: 'कोंकणी भास विंचली.', langCode: 'hi-IN' },
  { code: 'doi', name: 'डोगरी (Dogri)', speech: 'डोगरी भाषा चुणी गेई ऐ।', langCode: 'hi-IN' },
  { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)', speech: 'মৈতৈলোন খাঙ্ক্রে।', langCode: 'bn-IN' },
  { code: 'brx', name: 'बड़ो (Bodo)', speech: 'बड़ो राव सायखनाय जाबाय।', langCode: 'hi-IN' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);

    // Speak aloud native language confirmation via Web Speech API
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const match = languages.find(l => l.code === lang) || languages[0];
      const utterance = new SpeechSynthesisUtterance(match.speech);
      utterance.lang = match.langCode;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const voiceMatch = voices.find(v => v.lang.startsWith(match.code));
      if (voiceMatch) utterance.voice = voiceMatch;

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all">
      <Globe className="w-4 h-4 text-saffron-500 flex-shrink-0 animate-spin-slow" />
      <select
        value={i18n.language || 'hi'}
        onChange={handleLanguageChange}
        className="bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer text-white max-w-[140px]"
        title="Select Language & Speak Confirmation (भाषा चुनें)"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-govblue-900 text-white font-bold">
            {lang.name}
          </option>
        ))}
      </select>
      <Volume2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
    </div>
  );
}
