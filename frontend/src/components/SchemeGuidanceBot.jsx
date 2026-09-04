'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Volume2, VolumeX, ChevronRight, ChevronLeft, ExternalLink,
  Sparkles, CheckCircle2, Play, Pause, Loader2, Copy, Check,
  Bot, HelpCircle, Minimize2, Maximize2, FileText, User, CreditCard,
  Building2, ShieldCheck, Zap, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

// 22 Official Indian Languages (8th Schedule)
const BOT_LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी (Hindi)', short: 'hi' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', short: 'kn' },
  { code: 'en-IN', label: 'English (India)', short: 'en' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', short: 'ta' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', short: 'te' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', short: 'mr' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', short: 'bn' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', short: 'gu' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)', short: 'pa' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)', short: 'or' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', short: 'ml' },
  { code: 'ur-IN', label: 'اردو (Urdu)', short: 'ur' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)', short: 'as' },
  { code: 'mai-IN', label: 'मैथिली (Maithili)', short: 'mai' },
  { code: 'sa-IN', label: 'संस्कृतम् (Sanskrit)', short: 'sa' },
  { code: 'ks-IN', label: 'کٲشُر (Kashmiri)', short: 'ks' },
  { code: 'ne-IN', label: 'नेपाली (Nepali)', short: 'ne' },
  { code: 'sd-IN', label: 'سنڌي (Sindhi)', short: 'sd' },
  { code: 'kok-IN', label: 'कोंकणी (Konkani)', short: 'kok' },
  { code: 'doi-IN', label: 'डोगरी (Dogri)', short: 'doi' },
  { code: 'mni-IN', label: 'মৈতৈಲೋন্ (Manipuri)', short: 'mni' },
  { code: 'brx-IN', label: 'बड़ो (Bodo)', short: 'brx' },
];

const SCHEME_STEP_TEMPLATES = {
  default: [
    { step: 1, text: 'सरकारी पोर्टल लिंक पर क्लिक करें और वेबसाइट खोलें।', textEn: 'Step 1: Open the official government portal.', textKn: 'ಹಂತ 1: ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಲಿಂಕ್ ತೆರೆಯಿರಿ.' },
    { step: 2, text: 'अपना 12 अंकों का आधार कार्ड और मोबाइल नंबर तैयार रखें।', textEn: 'Step 2: Keep your 12-digit Aadhaar and active mobile ready.', textKn: 'ಹಂತ 2: ನಿಮ್ಮ 12 ಅಂಕಿಯ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಸಿದ್ಧವಾಗಿಡಿ.' },
    { step: 3, text: 'पोर्टल पर "New Registration" या "नया पंजीकरण" विकल्प चुनें।', textEn: 'Step 3: Click "New Registration" on the official portal.', textKn: 'ಹಂತ 3: ಪೋರ್ಟಲ್‌ನಲ್ಲಿ "New Registration" ಆಯ್ಕೆಮಾಡಿ.' },
    { step: 4, text: 'बैंक खाता नंबर और IFSC कोड दर्ज करें जिससे DBT लाभ मिल सके।', textEn: 'Step 4: Enter your Bank Account and IFSC code for direct DBT transfer.', textKn: 'ಹಂತ 4: ನೇರ ಡಿಬಿಟಿ ಲಾಭಕ್ಕಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ಮತ್ತು IFSC ಕೋಡ್ ನಮೂದಿಸಿ.' },
    { step: 5, text: 'आवश्यक दस्तावेज (आधार, भूमि/आय प्रमाण) अपलोड करें।', textEn: 'Step 5: Upload required documents (Aadhaar, Land/Income cert).', textKn: 'ಹಂತ 5: ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು (ಆಧಾರ್, ಆದಾಯ/ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ) ಅಪ್ಲೋಡ್ ಮಾಡಿ.' },
    { step: 6, text: 'आवेदन फॉर्म सबमिट करें और पावती संख्या (Acknowledgement No.) नोट करें।', textEn: 'Step 6: Submit the application and save the Acknowledgement Number.', textKn: 'ಹಂತ 6: ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಮತ್ತು ರಶೀದಿ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ.' },
  ],
  kisan: [
    { step: 1, text: 'आधिकारिक वेबसाइट (pmkisan.gov.in) खोलें।', textEn: 'Step 1: Open pmkisan.gov.in portal.', textKn: 'ಹಂತ 1: ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ (pmkisan.gov.in) ತೆರೆಯಿರಿ.' },
    { step: 2, text: '"Farmers Corner" सेक्शन में "New Farmer Registration" पर क्लिक करें।', textEn: 'Step 2: Click "New Farmer Registration" under Farmers Corner.', textKn: 'ಹಂತ 2: "Farmers Corner" ವಿಭಾಗದಲ್ಲಿ "New Farmer Registration" ಕ್ಲಿಕ್ ಮಾಡಿ.' },
    { step: 3, text: 'ग्रामीण या शहरी किसान चुनें और अपना आधार नंबर दर्ज करें।', textEn: 'Step 3: Select Rural/Urban Farmer and enter your 12-digit Aadhaar number.', textKn: 'ಹಂತ 3: ಗ್ರಾಮೀಣ ಅಥವಾ ನಗರ ರೈತ ಎಂದು ಆಯ್ಕೆಮಾಡಿ ಆಧಾರ್ ನಮೂದಿಸಿ.' },
    { step: 4, text: 'मोबाइल नंबर पर आया हुआ OTP दर्ज करके सत्यापन पूरा करें।', textEn: 'Step 4: Verify via the OTP sent to your registered mobile number.', textKn: 'ಹಂತ 4: ಮೊಬೈಲ್‌ಗೆ ಬಂದ OTP ನಮೂದಿಸಿ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ.' },
    { step: 5, text: 'राज्य, जिला, ब्लॉक और गाँव चुनें। अपनी भूमि का खसरा/खतौनी नंबर भरें।', textEn: 'Step 5: Fill State, District, Village and Land Khasra/Khatauni numbers.', textKn: 'ಹಂತ 5: ರಾಜ್ಯ, ಜಿಲ್ಲೆ, ಗ್ರಾಮ ಮತ್ತು ಭೂಮಿಯ ಖಸ್ರಾ/ಖತೌನಿ ಸಂಖ್ಯೆ ತುಂಬಿ.' },
    { step: 6, text: 'बैंक खाता और IFSC कोड भरें। सालाना ₹6,000 की 3 किस्तें सीधे बैंक में आएंगी।', textEn: 'Step 6: Enter bank details. ₹6,000 yearly in 3 DBT installments.', textKn: 'ಹಂತ 6: ಬ್ಯಾಂಕ್ ವಿವರ ನಮೂದಿಸಿ. ವಾರ್ಷಿಕ ₹6,000 ನೇರವಾಗಿ ಜಮೆಯಾಗುತ್ತದೆ.' },
    { step: 7, text: 'सबमिट करें और रजिस्ट्रेशन स्लिप प्रिंट या सेव करें।', textEn: 'Step 7: Submit and download your registration confirmation receipt.', textKn: 'ಹಂತ 7: ಸಲ್ಲಿಕೆ ಪೂರ್ಣಗೊಳಿಸಿ ದೃಢೀಕರಣ ರಶೀದಿ ಮುದ್ರಿಸಿ.' },
  ],
  pmjay: [
    { step: 1, text: 'राष्ट्रीय स्वास्थ्य प्राधिकरण पोर्टल (pmjay.gov.in) खोलें।', textEn: 'Step 1: Open National Health Authority portal (pmjay.gov.in).', textKn: 'ಹಂತ 1: ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಪ್ರಾಧಿಕಾರ ಪೋರ್ಟಲ್ (pmjay.gov.in) ತೆರೆಯಿರಿ.' },
    { step: 2, text: '"Am I Eligible" या "पात्रता जांचें" बटन पर क्लिक करें।', textEn: 'Step 2: Click "Am I Eligible" button on the homepage.', textKn: 'ಹಂತ 2: "Am I Eligible" ಅಥವಾ ಅರ್ಹತೆ ಪರೀಕ್ಷಿಸಿ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.' },
    { step: 3, text: 'अपना 10 अंकों का मोबाइल नंबर और कैप्चा कोड भरकर OTP मंगाएं।', textEn: 'Step 3: Enter your 10-digit mobile number to request OTP.', textKn: 'ಹಂತ 3: 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ OTP ಪಡೆಯಿರಿ.' },
    { step: 4, text: 'अपना राज्य चुनें और नाम, राशन कार्ड या आधार से SECC सूची में खोजें।', textEn: 'Step 4: Select state and search family in SECC list via Ration Card or Aadhaar.', textKn: 'ಹಂತ 4: ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ ಪಡಿತರ ಚೀಟಿ ಅಥವಾ ಆಧಾರ್ ಮೂಲಕ ಹೆಸರು ಹುಡುಕಿ.' },
    { step: 5, text: 'नाम मिलने पर नजदीकी CSC या सरकारी अस्पताल में आयुष्मान मित्र से संपर्क करें।', textEn: 'Step 5: If eligible, visit nearest CSC/Hospital Ayushman Mitra desk.', textKn: 'ಹಂತ 5: ಅರ್ಹರಾಗಿದ್ದರೆ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಅಥವಾ CSC ಕೇಂದ್ರ ಸಂಪರ್ಕಿಸಿ.' },
    { step: 6, text: 'बायोमेट्रिक ई-केवाईसी करवाकर ₹5 लाख मुफ्त इलाज का गोल्डन कार्ड बनवाएं।', textEn: 'Step 6: Complete biometric e-KYC to receive ₹5 Lakh Ayushman Golden Card.', textKn: 'ಹಂತ 6: ಬಯೋಮೆಟ್ರಿಕ್ ಇ-ಕೆವೈಸಿ ಮಾಡಿ ₹5 ಲಕ್ಷ ಉಚಿತ ಚಿಕಿತ್ಸೆಯ ಗೋಲ್ಡನ್ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ.' },
  ],
};

function getTemplateForScheme(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('kisan') || t.includes('crop') || t.includes('krishi') || t.includes('fasal')) {
    return SCHEME_STEP_TEMPLATES.kisan;
  }
  if (t.includes('ayushman') || t.includes('pmjay') || t.includes('arogya') || t.includes('health')) {
    return SCHEME_STEP_TEMPLATES.pmjay;
  }
  return SCHEME_STEP_TEMPLATES.default;
}

export default function SchemeGuidanceBot({ scheme, onClose }) {
  const { user } = useAuth();
  const { t: tI18n, i18n } = useTranslation();
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [language, setLanguage] = useState(i18n?.language === 'kn' ? 'kn-IN' : (i18n?.language === 'en' ? 'en-IN' : 'hi-IN'));
  const [copiedField, setCopiedField] = useState(null);
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'simulator'

  // Simulator Form State
  const [simForm, setSimForm] = useState({
    fullName: user?.name || '',
    mobile: user?.phone || '',
    aadhaar: user?.aadhaar_last4 ? `XXXX-XXXX-${user.aadhaar_last4}` : '',
    state: user?.state || 'Bihar',
    district: user?.district || 'Patna',
    bankAcc: 'XXXX-XXXX-4402',
    ifsc: 'SBIN0001234'
  });
  const [simSubmitted, setSimSubmitted] = useState(false);

  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  useEffect(() => {
    if (!scheme) return;
    const template = getTemplateForScheme(scheme.title);
    setSteps(template);
    setCurrentStep(0);
  }, [scheme]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakStep = useCallback((stepIndex) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();

      const sData = steps[stepIndex];
      if (!sData) return;

      let textToRead = sData.text;
      if (language.startsWith('kn')) {
        textToRead = sData.textKn || sData.text;
      } else if (language.startsWith('en')) {
        textToRead = sData.textEn;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language;
      utterance.rate = 0.88;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (autoPlayRef.current && stepIndex < steps.length - 1) {
          setTimeout(() => {
            setCurrentStep(prev => {
              const next = prev + 1;
              speakStep(next);
              return next;
            });
          }, 1500);
        }
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [steps, language]);

  const handleStepChange = (newIdx) => {
    if (newIdx < 0 || newIdx >= steps.length) return;
    stopSpeech();
    setCurrentStep(newIdx);
    if (autoPlay) {
      setTimeout(() => speakStep(newIdx), 300);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openGovPortal = () => {
    stopSpeech();
    if (scheme?.application_link) {
      window.open(scheme.application_link, '_blank', 'noopener,noreferrer');
    }
  };

  const autofillSimFromVault = () => {
    setSimForm({
      fullName: user?.name || 'Ramesh Kumar',
      mobile: user?.phone || '9876543210',
      aadhaar: user?.aadhaar_last4 ? `XXXX-XXXX-${user.aadhaar_last4}` : '5544-3322-1100',
      state: user?.state || 'Uttar Pradesh',
      district: user?.district || 'Varanasi',
      bankAcc: '91880011223344',
      ifsc: 'SBIN0001234'
    });
  };

  if (!scheme) return null;

  const currentStepData = steps[currentStep] || steps[0];
  const progressPercent = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  // Minimized Floating Widget
  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-govblue-900 text-white rounded-3xl p-4 shadow-2xl border-4 border-saffron-500 max-w-xs animate-bounce-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-saffron-500 text-govblue-900 flex items-center justify-center font-black">
          <Bot className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white truncate">{scheme.title}</p>
          <p className="text-[10px] text-saffron-400 font-bold">Step {currentStep + 1} of {steps.length}</p>
        </div>
        <button
          onClick={() => setMinimized(false)}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          title="Expand"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => { stopSpeech(); onClose(); }}
          className="p-1.5 bg-rose-500/30 hover:bg-rose-500 rounded-xl text-white transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-saffron-500 overflow-hidden my-6">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-govblue-900 via-slate-900 to-govblue-900 px-6 py-4 flex items-center justify-between text-white border-b-2 border-saffron-500">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-saffron-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg text-govblue-900">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-tight">{tI18n('guidance_bot_title')}</h3>
                <span className="px-2 py-0.5 bg-emerald-500 text-white font-black text-[9px] rounded-full uppercase">
                  Voice Guide Active
                </span>
              </div>
              <p className="text-xs text-saffron-300 font-bold truncate max-w-sm">{scheme.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMinimized(true)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Minimize to Floating Bot"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { stopSpeech(); onClose(); }}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-500 flex items-center justify-center text-white transition-colors"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top View Selector Tabs */}
        <div className="px-6 pt-3 pb-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-govblue-900 text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Step-by-Step Voice Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-govblue-900 text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-saffron-500" />
              <span>Official Form Simulator</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                stopSpeech();
              }}
              className="text-xs font-black bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-govblue-900 outline-none cursor-pointer"
            >
              {BOT_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TAB 1: STEP-BY-STEP VOICE GUIDE */}
        {activeTab === 'guide' && (
          <div className="p-6 space-y-5">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Current Step Card */}
            {currentStepData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-govblue-900 text-saffron-400 font-black text-sm flex items-center justify-center shadow-md">
                      {currentStep + 1}
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>

                  <button
                    onClick={isSpeaking ? stopSpeech : () => speakStep(currentStep)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                      isSpeaking
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 animate-pulse'
                        : 'bg-saffron-500 hover:bg-saffron-600 text-govblue-900 shadow-md'
                    }`}
                  >
                    {isSpeaking ? (
                      <><VolumeX className="w-4 h-4" /> <span>Pause</span></>
                    ) : (
                      <><Volume2 className="w-4 h-4" /> <span>Speak Step</span></>
                    )}
                  </button>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-200/80 rounded-3xl p-5 space-y-2 shadow-sm">
                  <p className="text-base sm:text-lg font-black text-govblue-900 leading-relaxed">
                    {language.startsWith('kn')
                      ? (currentStepData.textKn || currentStepData.text)
                      : (language.startsWith('hi') ? currentStepData.text : currentStepData.textEn)}
                  </p>
                  {!language.startsWith('en') && (
                    <p className="text-xs text-slate-500 italic font-medium">
                      {currentStepData.textEn}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Copy Citizen Data Drawer */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Copy className="w-3.5 h-3.5 text-saffron-500" /> {tI18n('copy_data_label')}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard(user?.name || 'Ramesh Kumar', 'name')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-saffron-500 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Name: {user?.name || 'Ramesh Kumar'}</span>
                  {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button
                  onClick={() => copyToClipboard(user?.phone || '9876543210', 'phone')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-saffron-500 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Mobile: {user?.phone || '9876543210'}</span>
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button
                  onClick={() => copyToClipboard(user?.state || 'Bihar', 'state')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-saffron-500 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm"
                >
                  <span>State: {user?.state || 'Bihar'}</span>
                  {copiedField === 'state' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Step Dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {steps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => handleStepChange(idx)}
                  className={`transition-all rounded-full ${
                    idx === currentStep
                      ? 'w-7 h-2.5 bg-saffron-500 shadow-sm'
                      : idx < currentStep
                      ? 'w-2.5 h-2.5 bg-emerald-500'
                      : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={`Step ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SIMULATED OFFICIAL PORTAL APPLICATION FORM */}
        {activeTab === 'simulator' && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Simulated Official GOI Portal Application Form</span>
              </div>
              <button
                type="button"
                onClick={autofillSimFromVault}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs shadow transition-all flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" /> Auto-Fill from Vault
              </button>
            </div>

            {simSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-900">Application Successfully Submitted!</h4>
                <p className="text-xs text-slate-600">Acknowledgement No: <span className="font-mono font-bold text-govblue-900">GOV-2026-9482910</span></p>
                <p className="text-xs text-slate-500">Your direct DBT benefit has been linked with your Aadhaar and Bank account.</p>
                <button
                  type="button"
                  onClick={() => setSimSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-govblue-900 text-white font-bold text-xs rounded-xl"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSimSubmitted(true);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Applicant Full Name:</label>
                    <input
                      type="text"
                      value={simForm.fullName}
                      onChange={(e) => setSimForm({ ...simForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number:</label>
                    <input
                      type="text"
                      value={simForm.mobile}
                      onChange={(e) => setSimForm({ ...simForm, mobile: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Aadhaar Number:</label>
                    <input
                      type="text"
                      value={simForm.aadhaar}
                      onChange={(e) => setSimForm({ ...simForm, aadhaar: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">State:</label>
                    <input
                      type="text"
                      value={simForm.state}
                      onChange={(e) => setSimForm({ ...simForm, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank Account (DBT):</label>
                    <input
                      type="text"
                      value={simForm.bankAcc}
                      onChange={(e) => setSimForm({ ...simForm, bankAcc: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank IFSC Code:</label>
                    <input
                      type="text"
                      value={simForm.ifsc}
                      onChange={(e) => setSimForm({ ...simForm, ifsc: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-saffron-500 to-amber-600 hover:from-saffron-600 text-govblue-900 font-extrabold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Submit Scheme Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3">
          {activeTab === 'guide' ? (
            <>
              <button
                onClick={() => handleStepChange(currentStep - 1)}
                disabled={currentStep === 0}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> {tI18n('step_prev')}
              </button>

              <button
                onClick={openGovPortal}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all"
                title="Opens real official portal in new tab"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{tI18n('open_portal_btn')}</span>
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => handleStepChange(currentStep + 1)}
                  className="px-4 py-2.5 bg-govblue-900 hover:bg-govblue-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md"
                >
                  <span>{tI18n('step_next')}</span>
                  <ChevronRight className="w-4 h-4 text-saffron-400" />
                </button>
              ) : (
                <button
                  onClick={openGovPortal}
                  className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-black text-xs rounded-xl flex items-center gap-1 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" /> {tI18n('step_complete')}
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={openGovPortal}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{tI18n('open_portal_btn')}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
