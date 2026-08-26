'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Volume2, VolumeX, ChevronRight, ChevronLeft, ExternalLink,
  Sparkles, CheckCircle2, Play, Pause, Loader2, Copy, Check,
  Bot, HelpCircle, Minimize2, Maximize2, FileText, User, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// 22 Official Indian Languages
const BOT_LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'ur-IN', label: 'اردو (Urdu)' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)' },
  { code: 'mai-IN', label: 'मैथिली (Maithili)' },
  { code: 'sa-IN', label: 'संस्कृतम् (Sanskrit)' },
  { code: 'ks-IN', label: 'کٲشُر (Kashmiri)' },
  { code: 'ne-IN', label: 'नेपाली (Nepali)' },
  { code: 'sd-IN', label: 'سنڌي (Sindhi)' },
  { code: 'kok-IN', label: 'कोंकणी (Konkani)' },
  { code: 'doi-IN', label: 'डोगरी (Dogri)' },
  { code: 'mni-IN', label: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'brx-IN', label: 'बड़ो (Bodo)' },
];

const SCHEME_STEP_TEMPLATES = {
  default: [
    { step: 1, text: 'सरकारी पोर्टल लिंक पर क्लिक करें और वेबसाइट खोलें।', textEn: 'Step 1: Open the official government website.' },
    { step: 2, text: 'अपना 12 अंकों का आधार कार्ड और मोबाइल नंबर तैयार रखें।', textEn: 'Step 2: Keep your Aadhaar number and active mobile ready.' },
    { step: 3, text: 'पोर्टल पर "New Registration" या "नया पंजीकरण" विकल्प चुनें।', textEn: 'Step 3: Click "New Registration" on the official portal.' },
    { step: 4, text: 'बैंक खाता नंबर और IFSC कोड दर्ज करें जिससे DBT लाभ मिल सके।', textEn: 'Step 4: Enter your Bank Account and IFSC code for direct DBT transfer.' },
    { step: 5, text: 'आवश्यक दस्तावेज (आधार, भूमि/आय प्रमाण) अपलोड करें।', textEn: 'Step 5: Upload required documents (Aadhaar, Land/Income cert).' },
    { step: 6, text: 'आवेदन फॉर्म सबमिट करें और पावती संख्या (Acknowledgement No.) नोट करें।', textEn: 'Step 6: Submit the application and save the Acknowledgement Number.' },
  ],
  kisan: [
    { step: 1, text: 'आधिकारिक वेबसाइट (pmkisan.gov.in) खोलें।', textEn: 'Step 1: Open pmkisan.gov.in portal.' },
    { step: 2, text: '"Farmers Corner" सेक्शन में "New Farmer Registration" पर क्लिक करें।', textEn: 'Step 2: Click "New Farmer Registration" under Farmers Corner.' },
    { step: 3, text: 'ग्रामीण या शहरी किसान चुनें और अपना आधार नंबर दर्ज करें।', textEn: 'Step 3: Select Rural/Urban Farmer and enter your 12-digit Aadhaar number.' },
    { step: 4, text: 'मोबाइल नंबर पर आया हुआ OTP दर्ज करके सत्यापन पूरा करें।', textEn: 'Step 4: Verify via the OTP sent to your registered mobile number.' },
    { step: 5, text: 'राज्य, जिला, ब्लॉक और गाँव चुनें। अपनी भूमि का खसरा/खतौनी नंबर भरें।', textEn: 'Step 5: Fill State, District, Village and Land Khasra/Khatauni numbers.' },
    { step: 6, text: 'बैंक खाता और IFSC कोड भरें। सालाना ₹6,000 की 3 किस्तें सीधे बैंक में आएंगी।', textEn: 'Step 6: Enter bank details. ₹6,000 yearly in 3 DBT installments.' },
    { step: 7, text: 'सबमिट करें और रजिस्ट्रेशन स्लिप प्रिंट या सेव करें।', textEn: 'Step 7: Submit and download your registration confirmation receipt.' },
  ],
  pmjay: [
    { step: 1, text: 'राष्ट्रीय स्वास्थ्य प्राधिकरण पोर्टल (pmjay.gov.in) खोलें।', textEn: 'Step 1: Open National Health Authority portal (pmjay.gov.in).' },
    { step: 2, text: '"Am I Eligible" या "पात्रता जांचें" बटन पर क्लिक करें।', textEn: 'Step 2: Click "Am I Eligible" button on the homepage.' },
    { step: 3, text: 'अपना 10 अंकों का मोबाइल नंबर और कैप्चा कोड भरकर OTP मंगाएं।', textEn: 'Step 3: Enter your 10-digit mobile number to request OTP.' },
    { step: 4, text: 'अपना राज्य चुनें और नाम, राशन कार्ड या आधार से SECC सूची में खोजें।', textEn: 'Step 4: Select state and search family in SECC list via Ration Card or Aadhaar.' },
    { step: 5, text: 'नाम मिलने पर नजदीकी CSC या सरकारी अस्पताल में आयुष्मान मित्र से संपर्क करें।', textEn: 'Step 5: If eligible, visit nearest CSC/Hospital Ayushman Mitra desk.' },
    { step: 6, text: 'बायोमेट्रिक ई-केवाईसी करवाकर ₹5 लाख मुफ्त इलाज का गोल्डन कार्ड बनवाएं।', textEn: 'Step 6: Complete biometric e-KYC to receive ₹5 Lakh Ayushman Golden Card.' },
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
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [language, setLanguage] = useState('hi-IN');
  const [copiedField, setCopiedField] = useState(null);

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

  const speakStep = useCallback((stepIdx) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    stopSpeech();

    const target = steps[stepIdx];
    if (!target) return;

    const speechText = language.startsWith('hi') ? target.text : target.textEn;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language;
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (match) utterance.voice = match;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (autoPlayRef.current && stepIdx < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(s => s + 1);
          speakStep(stepIdx + 1);
        }, 1500);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [steps, language, stopSpeech]);

  // Auto-speak first step
  useEffect(() => {
    if (steps.length > 0 && autoPlay && !minimized) {
      const timer = setTimeout(() => speakStep(0), 500);
      return () => clearTimeout(timer);
    }
  }, [steps, autoPlay, minimized]);

  const handleStepChange = (idx) => {
    setCurrentStep(idx);
    speakStep(idx);
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openGovPortal = () => {
    stopSpeech();
    window.open(scheme.application_link || 'https://www.india.gov.in', '_blank', 'noopener,noreferrer');
    const msg = language.startsWith('hi')
      ? 'सरकारी पोर्टल नए टैब में खुल गया है। आप इस गाइड को देखते हुए फॉर्म भर सकते हैं।'
      : 'Official portal opened in a new tab. Follow this guide to fill your application.';
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = language;
    u.rate = 0.88;
    window.speechSynthesis?.speak(u);
  };

  const currentStepData = steps[currentStep] || steps[0];
  const progressPercent = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  if (!scheme) return null;

  // Minimized Floating Widget
  if (minimized) {
    return (
      <div className="fixed bottom-6 left-6 z-50 animate-bounce">
        <div className="bg-gradient-to-r from-govblue-900 to-slate-900 border-2 border-saffron-500 rounded-2xl p-3 text-white shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 bg-saffron-500 rounded-xl flex items-center justify-center text-govblue-900 font-black">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black truncate max-w-[160px]">{scheme.title}</p>
            <p className="text-[10px] text-saffron-400 font-bold">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <button
            onClick={() => setMinimized(false)}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            title="Expand Assistant"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => { stopSpeech(); onClose(); }}
            className="p-1.5 bg-white/10 hover:bg-rose-500 rounded-lg text-white"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-saffron-500 overflow-hidden my-6">

        {/* Bot Header */}
        <div className="bg-gradient-to-r from-govblue-900 via-slate-900 to-govblue-900 px-6 py-4 flex items-center justify-between text-white border-b-2 border-saffron-500">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-saffron-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg text-govblue-900">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-tight">AI योजना आवेदन सहायक (GOI Apply Assistant)</h3>
                <span className="px-2 py-0.5 bg-emerald-500 text-white font-black text-[9px] rounded-full uppercase">
                  Voice Active
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

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-saffron-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Language & Audio Controls */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">🌐 गाइड भाषा (Language):</span>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                stopSpeech();
              }}
              className="text-xs font-black bg-white border border-slate-300 rounded-xl px-3 py-1 text-govblue-900 outline-none cursor-pointer"
            >
              {BOT_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="w-4 h-4 accent-saffron-500 rounded"
            />
            <span>Auto-Advance</span>
          </label>
        </div>

        {/* Step Visualizer */}
        <div className="p-6 space-y-5">

          {/* Current Step Card */}
          {currentStepData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-govblue-900 text-saffron-400 font-black text-sm flex items-center justify-center shadow-md">
                    {currentStep + 1}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    चरण {currentStep + 1} / {steps.length}
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
                    <><VolumeX className="w-4 h-4" /> <span>रोकें (Pause)</span></>
                  ) : (
                    <><Volume2 className="w-4 h-4" /> <span>सुनें (Speak)</span></>
                  )}
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-200/80 rounded-3xl p-5 space-y-2 shadow-sm">
                <p className="text-base sm:text-lg font-black text-govblue-900 leading-relaxed">
                  {language.startsWith('hi') ? currentStepData.text : currentStepData.textEn}
                </p>
                {language.startsWith('hi') && (
                  <p className="text-xs text-slate-500 italic font-medium">
                    {currentStepData.textEn}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quick Copy Citizen Data Drawer (Helper for illiterates / easy autofill) */}
          {user && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Copy className="w-3 h-3 text-saffron-500" /> फॉर्म भरने के लिए आपका डेटा (Click to Copy into GOI Form):
              </span>
              <div className="flex flex-wrap gap-2">
                {user.name && (
                  <button
                    onClick={() => copyToClipboard(user.name, 'name')}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:border-saffron-500 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    <span>Name: {user.name}</span>
                    {copiedField === 'name' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                )}
                {user.phone && (
                  <button
                    onClick={() => copyToClipboard(user.phone, 'phone')}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:border-saffron-500 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    <span>Mobile: {user.phone}</span>
                    {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                )}
                {user.state && (
                  <button
                    onClick={() => copyToClipboard(user.state, 'state')}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:border-saffron-500 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    <span>State: {user.state}</span>
                    {copiedField === 'state' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step Navigation Dots */}
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
                title={`Go to Step ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => handleStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> पिछला (Prev)
          </button>

          <button
            onClick={openGovPortal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>GOI Official Portal खोलें</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => handleStepChange(currentStep + 1)}
              className="px-4 py-2.5 bg-govblue-900 hover:bg-govblue-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md"
            >
              <span>अगला (Next)</span>
              <ChevronRight className="w-4 h-4 text-saffron-400" />
            </button>
          ) : (
            <button
              onClick={openGovPortal}
              className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-black text-xs rounded-xl flex items-center gap-1 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" /> Complete
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
