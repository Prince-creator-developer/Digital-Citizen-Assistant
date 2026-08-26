'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Volume2, VolumeX, ChevronRight, ChevronLeft, ExternalLink,
  Mic, Sparkles, CheckCircle2, Play, Pause, Loader2
} from 'lucide-react';

// Hardcoded step guides per scheme category for offline use + Gemini enhancement
const SCHEME_GUIDES = {
  default: [
    { step: 1, text: 'सबसे पहले सरकारी वेबसाइट खोलें।', textEn: 'Step 1: Open the official government website.' },
    { step: 2, text: 'अपना आधार नंबर तैयार रखें।', textEn: 'Step 2: Keep your Aadhaar number ready.' },
    { step: 3, text: 'मोबाइल नंबर और बैंक खाता विवरण तैयार रखें।', textEn: 'Step 3: Keep mobile number and bank account details ready.' },
    { step: 4, text: '"New Registration" या "नया पंजीकरण" बटन पर क्लिक करें।', textEn: 'Step 4: Click "New Registration" button.' },
    { step: 5, text: 'सभी जानकारी सावधानी से भरें और Submit करें।', textEn: 'Step 5: Fill all details carefully and submit.' },
    { step: 6, text: 'आवेदन संख्या नोट करें और रसीद डाउनलोड करें।', textEn: 'Step 6: Note your application number and download receipt.' },
  ],
  'pm-kisan': [
    { step: 1, text: 'pmkisan.gov.in वेबसाइट खोलें।', textEn: 'Open pmkisan.gov.in' },
    { step: 2, text: '"Farmer Corner" में "New Farmer Registration" पर क्लिक करें।', textEn: 'Click "New Farmer Registration" in Farmer Corner.' },
    { step: 3, text: 'आधार नंबर और मोबाइल नंबर दर्ज करें।', textEn: 'Enter your Aadhaar number and mobile number.' },
    { step: 4, text: 'राज्य, जिला, तहसील और गाँव चुनें।', textEn: 'Select State, District, Tehsil, and Village.' },
    { step: 5, text: 'बैंक खाता नंबर और IFSC कोड दर्ज करें।', textEn: 'Enter bank account number and IFSC code.' },
    { step: 6, text: 'जमीन का विवरण भरें (खसरा/खाता नंबर)।', textEn: 'Fill land details (Khasra/Khata number).' },
    { step: 7, text: 'Submit करें। ₹6,000 सीधे बैंक में आएंगे।', textEn: 'Submit. ₹6,000 will be credited directly to your bank.' },
  ],
  'pmjay': [
    { step: 1, text: 'pmjay.gov.in खोलें।', textEn: 'Open pmjay.gov.in' },
    { step: 2, text: '"Am I Eligible" बटन पर क्लिक करें।', textEn: 'Click "Am I Eligible" button.' },
    { step: 3, text: 'मोबाइल नंबर और राज्य दर्ज करें।', textEn: 'Enter mobile number and state.' },
    { step: 4, text: 'OTP सत्यापन करें।', textEn: 'Complete OTP verification.' },
    { step: 5, text: 'अपना नाम SECC सूची में खोजें।', textEn: 'Search your name in SECC list.' },
    { step: 6, text: 'नजदीकी आयुष्मान मित्र केंद्र जाएं और गोल्डन कार्ड बनवाएं।', textEn: 'Visit nearest Ayushman Mitra centre to get Golden Card.' },
  ],
  'pmuy': [
    { step: 1, text: 'pmuy.gov.in वेबसाइट या नजदीकी LPG वितरक के पास जाएं।', textEn: 'Visit pmuy.gov.in or nearest LPG distributor.' },
    { step: 2, text: 'BPL / PMAY / SECC सूची में नाम जांचें।', textEn: 'Check name in BPL/PMAY/SECC list.' },
    { step: 3, text: 'आधार कार्ड, राशन कार्ड और बैंक पासबुक की फोटोकॉपी लाएं।', textEn: 'Bring Aadhaar, Ration Card, and bank passbook copies.' },
    { step: 4, text: 'आवेदन पत्र भरें और जमा करें।', textEn: 'Fill application form and submit.' },
    { step: 5, text: 'मुफ्त LPG कनेक्शन और पहला सिलेंडर मिलेगा।', textEn: 'Free LPG connection and first cylinder will be provided.' },
  ],
};

function getGuideForScheme(schemeTitle) {
  const title = (schemeTitle || '').toLowerCase();
  if (title.includes('kisan') || title.includes('pmkisan')) return SCHEME_GUIDES['pm-kisan'];
  if (title.includes('pmjay') || title.includes('jan arogya') || title.includes('ayushman')) return SCHEME_GUIDES['pmjay'];
  if (title.includes('ujjwala') || title.includes('pmuy')) return SCHEME_GUIDES['pmuy'];
  return SCHEME_GUIDES.default;
}

export default function SchemeGuidanceBot({ scheme, onClose }) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('hi-IN');
  const utteranceRef = useRef(null);
  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  // Build steps — try Gemini, fallback to hardcoded
  useEffect(() => {
    const hardcoded = getGuideForScheme(scheme?.title);
    setSteps(hardcoded);
    setLoading(false);
    // Try to enhance with Gemini API
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (geminiKey && scheme) {
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful Indian government scheme guide for illiterate rural citizens.
              Generate 6-8 simple step-by-step registration instructions for: "${scheme.title}" (${scheme.department}).
              Official Portal: ${scheme.application_link}
              Each step should be very simple, in Hindi AND English.
              Format: Return a JSON array of objects like:
              [{"step": 1, "text": "Hindi instruction here", "textEn": "English instruction here"}, ...]
              Keep each step under 20 words. Use simple Hindi. Start with opening the portal.`
            }]
          }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
        })
      })
      .then(r => r.json())
      .then(data => {
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = raw.match(/\[[\s\S]*\]/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length > 0) setSteps(parsed);
        }
      })
      .catch(() => {/* keep hardcoded */});
    }
  }, [scheme]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speakStep = useCallback((stepIndex) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    stopSpeech();
    const step = steps[stepIndex];
    if (!step) return;
    const text = language.startsWith('hi') ? step.text : step.textEn;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = language;
    u.rate = 0.85;
    u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (match) u.voice = match;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => {
      setIsSpeaking(false);
      if (autoPlayRef.current && stepIndex < steps.length - 1) {
        setTimeout(() => { setCurrentStep(s => s + 1); speakStep(stepIndex + 1); }, 1200);
      }
    };
    u.onerror = () => setIsSpeaking(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [steps, language, stopSpeech]);

  // Auto-speak first step when loaded
  useEffect(() => {
    if (!loading && steps.length > 0 && autoPlay) {
      setTimeout(() => speakStep(0), 600);
    }
  }, [loading, steps]);

  // Speak when step changes manually
  const goToStep = (idx) => {
    setCurrentStep(idx);
    speakStep(idx);
  };

  const openPortal = () => {
    stopSpeech();
    window.open(scheme.application_link, '_blank', 'noopener');
    const finalText = language.startsWith('hi')
      ? 'सरकारी वेबसाइट खुल गई है। इस गाइड के अनुसार आवेदन करें।'
      : 'Government portal opened. Follow this guide to apply.';
    const u = new SpeechSynthesisUtterance(finalText);
    u.lang = language; u.rate = 0.85;
    window.speechSynthesis?.speak(u);
  };

  const step = steps[currentStep];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-saffron-500 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-govblue-900 to-slate-800 px-6 py-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-saffron-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-saffron-400 uppercase tracking-wider">AI Voice Guide • आवेदन सहायक</p>
            <h3 className="text-white font-extrabold text-sm truncate">{scheme?.title}</h3>
            <p className="text-slate-400 text-xs truncate">{scheme?.department}</p>
          </div>
          <button onClick={() => { stopSpeech(); onClose(); }}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200">
          <div className="h-full bg-gradient-to-r from-saffron-500 to-amber-500 transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>

        {/* Language + AutoPlay Controls */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">🌐 भाषा:</span>
            <select value={language} onChange={e => { setLanguage(e.target.value); stopSpeech(); }}
              className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none">
              <option value="hi-IN">हिंदी</option>
              <option value="en-IN">English</option>
              <option value="kn-IN">ಕನ್ನಡ</option>
              <option value="ta-IN">தமிழ்</option>
              <option value="te-IN">తెలుగు</option>
              <option value="mr-IN">मराठी</option>
              <option value="ml-IN">മലയാളം</option>
              <option value="bn-IN">বাংলা</option>
            </select>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={autoPlay} onChange={e => setAutoPlay(e.target.checked)} className="accent-saffron-500" />
            <span className="text-xs font-bold text-slate-600">Auto-play</span>
          </label>
        </div>

        {/* Step Content */}
        <div className="px-6 py-6 min-h-[200px] flex flex-col justify-center">
          {loading ? (
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-saffron-500 mx-auto" />
              <p className="text-sm text-slate-500">AI guide तैयार हो रही है…</p>
            </div>
          ) : step ? (
            <div className="space-y-4">
              {/* Step Number */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-amber-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                  {step.step}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>

              {/* Step Text */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
                <p className="text-lg font-extrabold text-govblue-900 leading-relaxed">
                  {language.startsWith('hi') ? step.text : step.textEn}
                </p>
                {language.startsWith('hi') && (
                  <p className="text-xs text-slate-500 italic">{step.textEn}</p>
                )}
              </div>

              {/* Voice Controls */}
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => isSpeaking ? stopSpeech() : speakStep(currentStep)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all ${
                    isSpeaking
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-saffron-500 text-white hover:bg-saffron-600'
                  }`}>
                  {isSpeaking ? <><VolumeX className="w-4 h-4" /> रोकें (Stop)</> : <><Volume2 className="w-4 h-4" /> सुनें (Listen)</>}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {steps.map((_, i) => (
            <button key={i} onClick={() => goToStep(i)}
              className={`rounded-full transition-all ${i === currentStep ? 'w-6 h-2.5 bg-saffron-500' : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'}`} />
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
          <button onClick={() => { if (currentStep > 0) goToStep(currentStep - 1); }}
            disabled={currentStep === 0}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" /> पिछला
          </button>

          <button onClick={openPortal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg">
            <ExternalLink className="w-4 h-4" /> GOI Portal खोलें
          </button>

          {currentStep < steps.length - 1 ? (
            <button onClick={() => goToStep(currentStep + 1)}
              className="px-4 py-2.5 bg-govblue-900 hover:bg-govblue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1">
              अगला <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={openPortal}
              className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Apply Now!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
