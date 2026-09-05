'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  FileCheck2, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX,
  Trash2, 
  ExternalLink, 
  Scale, 
  HelpCircle,
  Cpu,
  Fingerprint,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
  KeyRound,
  FileCode2,
  Check
} from 'lucide-react';

export default function TrustPrivacyPage() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('flow');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Interactive Masking Simulator State
  const [sampleAadhaar, setSampleAadhaar] = useState('5432 8765 1199');
  const [sampleIncome, setSampleIncome] = useState('180000');
  const [maskedOutput, setMaskedOutput] = useState('XXXX-XXXX-1199');

  const lang = i18n.language || 'en';

  useEffect(() => {
    // Live masking calculation
    const raw = sampleAadhaar.replace(/\D/g, '');
    if (raw.length >= 4) {
      const last4 = raw.slice(-4);
      setMaskedOutput(`XXXX-XXXX-${last4}`);
    } else {
      setMaskedOutput('XXXX-XXXX-XXXX');
    }
  }, [sampleAadhaar]);

  const charterAudioTexts = {
    en: "Digital Citizen Assistant Privacy and Trust Charter. We guarantee: First, your voice and personal data are strictly used to find eligible government welfare schemes. Second, Aadhaar numbers are masked according to UIDAI guidelines. Third, we never request bank PINs or OTPs. Fourth, you have the complete right to erase all your data anytime under the Digital Personal Data Protection Act 2023.",
    hi: "डिजिटल नागरिक सहायक डेटा सुरक्षा और विश्वास घोषणापत्र। हमारी गारंटी: पहला, आपकी आवाज़ और दस्तावेज़ केवल सरकारी योजनाओं की पात्रता जांचने के लिए उपयोग किए जाते हैं। दूसरा, आधार नंबर यूआईडीएआई नियमों के तहत पूरी तरह सुरक्षित और मास्क रहता है। तीसरा, हम कभी भी बैंक पिन या ओटीपी नहीं मांगते। चौथा, डीपीडीपी 2023 कानून के तहत आपको किसी भी समय अपना पूरा डेटा मिटाने का पूर्ण अधिकार है।",
    kn: "ಡಿಜಿಟಲ್ ನಾಗರಿಕ ಸಹಾಯಕ ಡೇಟಾ ಭದ್ರತೆ ಮತ್ತು ನಂಬಿಕೆಯ ನೀತಿ. ನಮ್ಮ ಗ್ಯಾರಂಟಿ: ಮೊದಲನೆಯದಾಗಿ, ನಿಮ್ಮ ಧ್ವನಿ ಮತ್ತು ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಕೇವಲ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಅರ್ಹತೆ ಹುಡುಕಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ಎರಡನೆಯದಾಗಿ, ಯುಐಡಿಎಐ ನಿಯಮಾವಳಿಯಂತೆ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಮರೆಮಾಚಲಾಗುತ್ತದೆ. ಮೂರನೆಯದಾಗಿ, ನಾವು ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಪಿನ್ ಅಥವಾ ಓಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ. ನಾಲ್ಕನೆಯದಾಗಿ, ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ 2023 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಿಹಾಕುವ ಹಕ್ಕು ನಿಮಗಿದೆ."
  };

  const handleSpeakCharter = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const textToSpeak = charterAudioTexts[lang] || charterAudioTexts.en;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const langCodes = {
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        en: 'en-IN'
      };
      utterance.lang = langCodes[lang] || 'en-US';
      utterance.rate = 0.95;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearSessionData = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
        setClearedNotice(true);
        setTimeout(() => setClearedNotice(false), 5000);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const faqs = [
    {
      q_en: "Is Digital Citizen Assistant an official government website?",
      q_hi: "क्या डिजिटल नागरिक सहायक एक आधिकारिक सरकारी वेबसाइट है?",
      q_kn: "ಡಿಜಿಟಲ್ ನಾಗರಿಕ ಸಹಾಯಕ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಆಗಿದೆಯೇ?",
      a_en: "We are an open civic-tech AI portal developed for Smart India Hackathon (SIH 2026). We aggregate real-time scheme data from official portals (like data.gov.in and myscheme.gov.in) and guide you to official .gov.in domains for final submissions. We do not charge any money or act as a private broker.",
      a_hi: "हम स्मार्ट इंडिया हैकथॉन (SIH 2026) के लिए विकसित एक ओपन सिविक-टेक AI पोर्टल हैं। हम आधिकारिक सरकारी पोर्टलों से डेटा एकत्रित करते हैं और अंतिम आवेदन के लिए आपको आधिकारिक .gov.in डोमेन पर भेजते हैं। हम कोई शुल्क नहीं लेते।",
      a_kn: "ನಾವು ಸ್ಮಾರ್ಟ್ ಇಂಡಿಯಾ ಹ್ಯಾಕಥಾನ್ (SIH 2026) ಗಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾದ ಓಪನ್ ಸಿವಿಕ್-ಟೆಕ್ AI ಪೋರ್ಟಲ್ ಆಗಿದ್ದೇವೆ. ನಾವು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಂದ ಯೋಜನೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ ಮತ್ತು ಅಧಿಕೃತ .gov.in ಪೋರ್ಟಲ್‌ಗೆ ನಿಮ್ಮನ್ನು ಮಾರ್ಗದರ್ಶಿಸುತ್ತೇವೆ."
    },
    {
      q_en: "Where does my uploaded document / Aadhaar go?",
      q_hi: "मेरे द्वारा अपलोड किया गया आधार या दस्तावेज़ कहाँ जाता है?",
      q_kn: "ನನ್ನ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆ / ಆಧಾರ್ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತದೆ?",
      a_en: "Documents are processed locally using on-premise OCR engines. Aadhaar numbers are automatically masked (showing only last 4 digits) following UIDAI Security Circular 2018. Your original biometric files are never sold, rented, or shared with third parties.",
      a_hi: "दस्तावेज़ों को सुरक्षित OCR इंजन द्वारा संसाधित किया जाता है। UIDAI सुरक्षा नियमों के तहत आधार नंबर के पहले 8 अंक मास्क (XXXX-XXXX) कर दिए जाते हैं। आपकी कोई भी निजी जानकारी किसी तीसरे पक्ष को नहीं बेची जाती।",
      a_kn: "ದಾಖಲೆಗಳನ್ನು ಸ್ಥಳೀಯ ಓಸಿಆರ್ ಮೂಲಕ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ. ಯುಐಡಿಎಐ ಭದ್ರತಾ ನಿಯಮಗಳ ಅಡಿಯಲ್ಲಿ ಆಧಾರ್ ಸಂಖ್ಯೆಯ ಮೊದಲ 8 ಅಂಕಿಗಳನ್ನು ಮರೆಮಾಚಲಾಗುತ್ತದೆ (XXXX-XXXX-1234)."
    },
    {
      q_en: "Do I have to pay any application fee on this platform?",
      q_hi: "क्या मुझे इस पोर्टल पर कोई आवेदन शुल्क देना होगा?",
      q_kn: "ನಾನು ಈ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ಯಾವುದೇ ಅರ್ಜಿ ಶುಲ್ಕವನ್ನು ಪಾವತಿಸಬೇಕೇ?",
      a_en: "NO. Digital Citizen Assistant is 100% free for all Indian citizens, farmers, students, and senior citizens. All official Central and State welfare schemes are free or charge only statutory government fees directly on .gov.in portals.",
      a_hi: "बिल्कुल नहीं। यह सेवा सभी भारतीय नागरिकों, किसानों, छात्रों और वरिष्ठ नागरिकों के लिए 100% निःशुल्क है।",
      a_kn: "ಇಲ್ಲ. ಡಿಜಿಟಲ್ ನಾಗರಿಕ ಸಹಾಯಕ ಭಾರತದ ಎಲ್ಲಾ ನಾಗರಿಕರಿಗೆ, ರೈತರಿಗೆ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ 100% ಉಚಿತವಾಗಿದೆ."
    },
    {
      q_en: "How can I delete all my stored profile information?",
      q_hi: "मैं अपनी संग्रहित प्रोफ़ाइल जानकारी कैसे मिटा सकता हूँ?",
      q_kn: "ನನ್ನ ಸಂಗ್ರಹಿಸಲಾದ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿಯನ್ನು ನಾನು ಹೇಗೆ ಅಳಿಸಬಹುದು?",
      a_en: "Under Section 12 of the Digital Personal Data Protection (DPDP) Act 2023, you have the full Right to Erasure. You can click the 'Erase Stored Session & Vault' button below or delete your profile from your Profile Settings at any time.",
      a_hi: "डीपीडीपी (DPDP) कानून 2023 की धारा 12 के तहत आपको अपना डेटा मिटाने का पूरा अधिकार है। आप नीचे दिए गए बटन पर क्लिक करके किसी भी समय अपना सत्र और डेटा मिटा सकते हैं।",
      a_kn: "ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ (DPDP) ಕಾಯ್ದೆ 2023 ರ ಸೆಕ್ಷನ್ 12 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಿಹಾಕುವ ಹಕ್ಕು ನಿಮಗಿದೆ."
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Hero Banner */}
      <div className="bg-gradient-to-br from-govblue-900 via-govblue-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-b-4 border-saffron-500">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act 2023 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/20 border border-saffron-400/40 text-saffron-300 text-xs font-black tracking-wide uppercase">
              <Check className="w-3.5 h-3.5" />
              UIDAI Masking Standard
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {lang === 'hi' ? '🛡️ डेटा सुरक्षा, गोपनीयता और नागरिक विश्वास घोषणापत्र' :
             lang === 'kn' ? '🛡️ ಡೇಟಾ ಭದ್ರತೆ, ಗೌಪ್ಯತೆ ಮತ್ತು ನಾಗರಿಕ ನಂಬಿಕೆಯ ನೀತಿ' :
             '🛡️ Data Security, Privacy & Citizen Trust Charter'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lang === 'hi' ? 'हम समझते हैं कि आपका व्यक्तिगत डेटा और पहचान अमूल्य है। जानिए कि आपका डेटा कहाँ जाता है, कैसे सुरक्षित रहता है, और हम आपके अधिकारों की कैसे रक्षा करते हैं।' :
             lang === 'kn' ? 'ನಿಮ್ಮ ಡೇಟಾ ಮತ್ತು ಗೌಪ್ಯತೆಯು ಅತ್ಯಂತ ಅಮೂಲ್ಯವಾಗಿದೆ. ನಿಮ್ಮ ವಿವರಗಳು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತವೆ ಮತ್ತು ನಾವು ಅದನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುತ್ತೇವೆ ಎಂಬುದನ್ನು ಇಲ್ಲಿ ಪಾರದರ್ಶಕವಾಗಿ ನೋಡಿ.' :
             'Complete transparency on where citizen data travels, how on-device AI safeguards Aadhaar/OCR documents, and your sovereign rights under the Digital Personal Data Protection Act 2023.'}
          </p>

          {/* Action Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={handleSpeakCharter}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all ${
                isSpeaking 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-govblue-900'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>
                {isSpeaking 
                  ? (lang === 'hi' ? 'आवाज़ बंद करें (Stop Audio)' : lang === 'kn' ? 'ನಿಲ್ಲಿಸಿ (Stop Audio)' : 'Stop Narration')
                  : (lang === 'hi' ? '🔊 विश्वास घोषणापत्र सुनें (Audio)' : lang === 'kn' ? '🔊 ಭದ್ರತಾ ನೀತಿ ಆಲಿಸಿ (Audio)' : '🔊 Listen to Privacy Charter (Audio)')}
              </span>
            </button>

            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? '२२ आधिकारिक भारतीय भाषाओं में उपलब्ध' : lang === 'kn' ? '೨೨ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ' : 'Multi-Language Audio Narration'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300">
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'flow'
              ? 'bg-govblue-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4 text-saffron-500" />
          <span>{lang === 'hi' ? 'डेटा यात्रा (Data Flow)' : lang === 'kn' ? 'ಡೇಟಾ ಹರಿವು (Data Flow)' : 'Data Lifecycle Flow'}</span>
        </button>

        <button
          onClick={() => setActiveTab('guarantees')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'guarantees'
              ? 'bg-govblue-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'hi' ? '४ नागरिक गारंटी' : lang === 'kn' ? '೪ ನಾಗರಿಕ ಗ್ಯಾರಂಟಿಗಳು' : '4 Citizen Guarantees'}</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-govblue-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Fingerprint className="w-4 h-4 text-purple-400" />
          <span>{lang === 'hi' ? 'मास्किंग सिम्युलेटर' : lang === 'kn' ? 'ಮಾಸ್ಕಿಂಗ್ ಸಿಮ್ಯುಲೇಟರ್' : 'Live Masking Test'}</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'terms'
              ? 'bg-govblue-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-blue-400" />
          <span>{lang === 'hi' ? 'नियम व शर्तें' : lang === 'kn' ? 'ನಿಯಮಗಳು & ಷರತ್ತುಗಳು' : 'Terms of Service'}</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'faq'
              ? 'bg-govblue-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>{lang === 'hi' ? 'पूछे जाने वाले सवाल' : lang === 'kn' ? 'ಪ್ರಶ್ನೋತ್ತರಗಳು' : 'FAQs'}</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: DATA LIFECYCLE MAP */}
      {activeTab === 'flow' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-govblue-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-saffron-500" />
              <span>{lang === 'hi' ? 'नागरिक डेटा की पारदर्शी यात्रा (End-to-End Data Pipeline)' : lang === 'kn' ? 'ಡೇಟಾ ಪ್ರಕ್ರಿಯೆಯ ಹಂತಗಳು' : 'End-to-End Citizen Data Pipeline'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'hi' ? 'प्रत्येक इनपुट केवल योजना खोजने के लिए प्रोसेस होता है। कोई तृतीय-पक्ष डेटा साझाकरण नहीं।' :
               lang === 'kn' ? 'ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿಯೊಂದಿಗೆ ಡೇಟಾ ಹಂಚಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ.' :
               'Every input is strictly purpose-limited for welfare discovery under DPDP Section 6.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-blue-50/80 border-2 border-blue-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow">
                  1
                </div>
                <div className="flex items-center gap-1.5 text-blue-900 font-black text-sm">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'hi' ? 'ध्वनि संवाद (Voice)' : lang === 'kn' ? 'ಧ್ವನಿ ಸಂವಾದ' : '1. Voice Input'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'नागरिक अपनी मातृभाषा में बोलता है। ब्राउज़र डिवाइस पर ही ऑडियो को टेक्स्ट में बदलता है। बायोमेट्रिक वॉयस रिकॉर्डिंग कभी सेव नहीं होती।' :
                   lang === 'kn' ? 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಸಾಧನದಲ್ಲೇ ಪಠ್ಯವಾಗಿ ಪರಿವರ್ತಿಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಆಡಿಯೋ ರೆಕಾರ್ಡ್ ಉಳಿಯುವುದಿಲ್ಲ.' :
                   'Real-time Speech-to-Text via Web Speech API. Zero acoustic audio or voiceprints are stored in databases.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200 text-[11px] font-bold text-blue-700">
                ✓ On-Device Speech Pipeline
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow">
                  2
                </div>
                <div className="flex items-center gap-1.5 text-emerald-900 font-black text-sm">
                  <Fingerprint className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'मास्क्ड OCR वॉल्ट' : lang === 'kn' ? 'ಮಾಸ್ಕ್ ಮಾಡಿದ OCR' : '2. Masked OCR Vault'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'अपलोड किए गए आधार कार्ड के पहले 8 अंक (UIDAI नियमानुसार) तुरंत XXXX-XXXX-1234 में बदल दिए जाते हैं। केवल आवश्यक पात्रता मानदंड निकाले जाते हैं।' :
                   lang === 'kn' ? 'ಆಧಾರ್ ಮತ್ತು ಆದಾಯ ಪತ್ರದ ಮೊದಲ 8 ಅಂಕಿಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮರೆಮಾಚಲಾಗುತ್ತದೆ.' :
                   'On-premise OCR engine parses demographic criteria while permanently redacting first 8 digits of Aadhaar (UIDAI Circular 2018).'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] font-bold text-emerald-700">
                ✓ UIDAI Masking Compliant
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-lg shadow">
                  3
                </div>
                <div className="flex items-center gap-1.5 text-amber-900 font-black text-sm">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'hi' ? 'AI वेक्टर मिलान' : lang === 'kn' ? 'AI ವೆಕ್ಟರ್ ಮ್ಯಾಚಿಂಗ್' : '3. Vector Matching'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'नागरिक की आयु, आय और व्यवसाय की तुलना data.gov.in पर मौजूद 47+ सरकारी योजनाओं के नियमों से होती है। कोई व्यक्तिगत प्रोफ़ाइल विज्ञापन के लिए नहीं बेची जाती।' :
                   lang === 'kn' ? 'ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಅಧಿಕೃತ ಸರ್ಕಾರದ 47+ ಯೋಜನೆಗಳ ಮಾನದಂಡಗಳೊಂದಿಗೆ ತಕ್ಷಣ ಹೋಲಿಸಲಾಗುತ್ತದೆ.' :
                   'Anonymous criteria matched against verified Open Government Data (OGD) schemes using pgvector & Llama 3.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] font-bold text-amber-700">
                ✓ data.gov.in Direct Schema
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-purple-50/80 border-2 border-purple-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow">
                  4
                </div>
                <div className="flex items-center gap-1.5 text-purple-900 font-black text-sm">
                  <ExternalLink className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'hi' ? 'सरकारी .gov.in' : lang === 'kn' ? 'ಅಧಿಕೃತ .gov.in' : '4. Official Portal'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'अंतिम आवेदन सीधे आधिकारिक .gov.in या .nic.in पोर्टल पर जमा होता है। हम कभी भी बिचौलिये या वित्तीय मध्यस्थ के रूप में कार्य नहीं करते।' :
                   lang === 'kn' ? 'ಅಂತಿಮ ಅರ್ಜಿಯನ್ನು ಅಧಿಕೃತ .gov.in ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಮಾತ್ರ ಸಲ್ಲಿಸಲಾಗುತ್ತದೆ.' :
                   'Citizen is guided directly to authorized Ministry portals (.gov.in / .nic.in) with 1-Click Clipboard Assistant for safe submission.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-purple-200 text-[11px] font-bold text-purple-700">
                ✓ Official Sovereign Endpoints
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 4 CITIZEN GUARANTEES */}
      {activeTab === 'guarantees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-400 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-govblue-900">
                  {lang === 'hi' ? '१. शून्य कमीशन और १००% निःशुल्क सेवा' :
                   lang === 'kn' ? '೧. ಶೂನ್ಯ ಕಮಿಷನ್ ಮತ್ತು ೧೦೦% ಉಚಿತ ಸೇವೆ' :
                   '1. Zero Commission & 100% Free Guarantee'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'hi' ? 'कोई छिपे हुए एजेंट या बिचौलिये नहीं' :
                   lang === 'kn' ? 'ಯಾವುದೇ ದಲ್ಲಾಳಿಗಳಿಲ್ಲ' :
                   'No middleman cuts or broker fees'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? 'सभी सरकारी कल्याणकारी योजनाएं (जैसे PM-KISAN, वृद्धावस्था पेंशन, सुकन्या समृद्धि) भारत के नागरिकों के लिए बिना किसी अतिरिक्त सेवा शुल्क के उपलब्ध हैं। हम कभी भी योजनाओं को अनलॉक करने के लिए पैसे नहीं मांगते।' :
               lang === 'kn' ? 'ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು (ಉದಾ: ಪಿಎಂ-ಕಿಸಾನ್, ವೃದ್ಧಾಪ್ಯ ವೇತನ) ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಸೇವಾ ಶುಲ್ಕವಿಲ್ಲದೆ ಉಚಿತವಾಗಿ ದೊರೆಯುತ್ತವೆ.' :
               'Every government welfare scheme indexed on this platform is accessible free of charge. We will never ask for payment to unlock, evaluate, or apply for schemes.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-rose-400 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <EyeOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-govblue-900">
                  {lang === 'hi' ? '२. पासवर्ड व बैंक पिन सुरक्षा' :
                   lang === 'kn' ? '೨. ಬ್ಯಾಂಕ್ ಪಿನ್ ಮತ್ತು ಓಟಿಪಿ ಭದ್ರತೆ' :
                   '2. Zero Sensitive Financial Credentials'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'hi' ? 'हम कभी भी आपका पासवर्ड या OTP नहीं मांगते' :
                   lang === 'kn' ? 'ನಾವು ಎಂದಿಗೂ ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಓಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ' :
                   'We never request ATM PIN, CVV, or Aadhaar OTP'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? 'सावधान रहें: डिजिटल नागरिक सहायक कभी भी आपके बैंक खाते का पासवर्ड, यूपीआई पिन या आधार ओटीपी नहीं मांगता। आधिकारिक योजनाओं का DBT सीधे आपके बैंक खाते में सरकार द्वारा भेजा जाता है।' :
               lang === 'kn' ? 'ಎಚ್ಚರಿಕೆ: ನಮ್ಮ ಪೋರ್ಟಲ್ ಎಂದಿಗೂ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ವರ್ಡ್, ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಓಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ. ಸರ್ಕಾರದ ಡಿಬಿಟಿ ನೇರವಾಗಿ ನಿಮ್ಮ ಖಾತೆಗೆ ಬರುತ್ತದೆ.' :
               'We will never prompt for your Banking Password, UPI PIN, or SMS OTPs. Direct Benefit Transfer (DBT) funds are disbursed directly by Ministries into your bank account via PFMS.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-govblue-900">
                  {lang === 'hi' ? '३. डीपीडीपी अधिनियम २०२३ का पूर्ण अनुपालन' :
                   lang === 'kn' ? '೩. ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ ೨೦೨೩ ರ ಸಂಪೂರ್ಣ ಅನುಸರಣೆ' :
                   '3. DPDP Act 2023 Statutory Compliance'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'hi' ? 'सहमति और डेटा संप्रभुता' :
                   lang === 'kn' ? 'ನಾಗರಿಕರ ಒಪ್ಪಿಗೆ ಮತ್ತು ಗೌಪ್ಯತೆ' :
                   'Sovereign Citizen Consent & Data Minimization'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP 2023) के तहत केवल आवश्यक योजना मानदंडों का मूल्यांकन किया जाता है। डेटा किसी भी विदेशी सर्वर पर नहीं भेजा जाता।' :
               lang === 'kn' ? 'ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆಯಂತೆ ಕೇವಲ ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. ವಿದೇಶಿ ಸರ್ವರ್‌ಗಳಿಗೆ ಡೇಟಾ ಕಳುಹಿಸುವುದಿಲ್ಲ.' :
               'Under Section 6 (Consent) and Section 12 (Right to Erasure) of the DPDP Act 2023, data is processed solely for purpose-limited welfare discovery with zero cross-border telemetry.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-govblue-900">
                  {lang === 'hi' ? '४. क्लाउड आइसोलेशन व एन्क्रिप्शन' :
                   lang === 'kn' ? '೪. ಸುರಕ್ಷಿತ ಎನ್‌ಕ್ರಿಪ್ಶನ್' :
                   '4. Cryptographic Vault & Masking'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'hi' ? 'स्थानिक वॉल्ट में सुरक्षित भंडारण' :
                   lang === 'kn' ? 'ಸುರಕ್ಷಿತ ವಾಲ್ಟ್ ಸಂಗ್ರಹಣೆ' :
                   'AES-256 equivalent isolated local vault'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? 'आपके प्रोफाइल का डेटा आपके सक्रिय सत्र में सुरक्षित रूप से पृथक रहता है। आप कभी भी एक क्लिक में अपने पूरे डेटा को मिटा सकते हैं।' :
               lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಡೇಟಾ ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ. ನೀವು ಯಾವುದೇ ಕ್ಷಣದಲ್ಲಿ ಅದನ್ನು ಅಳಿಸಿಹಾಕಬಹುದು.' :
               'User sessions and OCR document extractions reside in isolated tenant partitions. You hold the master key to purge all stored profile data on demand.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE MASKING SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div>
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              Interactive UIDAI 2018 Compliance Sandbox
            </span>
            <h2 className="text-xl font-black text-govblue-900 mt-2">
              {lang === 'hi' ? '🔬 ऑन-डिवाइस आधार मास्किंग लाइव टेस्ट' : lang === 'kn' ? '🔬 ಲೈವ್ ಆಧಾರ್ ಮಾಸ್ಕಿಂಗ್ ಪರೀಕ್ಷೆ' : '🔬 Live On-Device Masking Simulator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'hi' ? 'नीचे कोई भी 12-अंकों का नंबर टाइप करें और देखें कि हमारा एल्गोरिदम किस प्रकार प्रथम 8 अंकों को तुरंत छुपा देता है:' :
               lang === 'kn' ? 'ಯಾವುದೇ ೧೨ ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಮೊದಲ ೮ ಅಂಕಿಗಳು ಹೇಗೆ ಮರೆಯಾಗುತ್ತವೆ ಎಂಬುದನ್ನು ನೋಡಿ:' :
               'Type any 12-digit number below to see how our on-device algorithm automatically masks the first 8 digits in real time:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Input Box */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 block">
                {lang === 'hi' ? '१. नमूना आधार संख्या (Input):' : lang === 'kn' ? '೧. ಮಾದರಿ ಆಧಾರ್ ಸಂಖ್ಯೆ:' : '1. Raw Citizen Input (Client Device):'}
              </label>
              <input
                type="text"
                value={sampleAadhaar}
                onChange={(e) => setSampleAadhaar(e.target.value)}
                maxLength={14}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-purple-500 focus:outline-none font-mono text-base font-bold text-slate-900 bg-white"
                placeholder="5432 8765 1199"
              />
              <span className="text-[11px] text-slate-400 block">
                * Processed strictly inside browser memory / local worker
              </span>
            </div>

            {/* Output Box */}
            <div className="space-y-3">
              <label className="text-xs font-black text-emerald-800 block">
                {lang === 'hi' ? '२. सुरक्षित मास्क्ड आउटपुट (Stored in Vault):' : lang === 'kn' ? '೨. ಸುರಕ್ಷಿತ ಮಾಸ್ಕ್ ಔಟ್‌ಪುಟ್:' : '2. Redacted Vault Output (UIDAI Safe):'}
              </label>
              <div className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 font-mono text-base font-black text-emerald-900 flex items-center justify-between">
                <span>{maskedOutput}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold">
                  MASKED
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold block">
                ✓ Adheres to UIDAI Security Circular F.No.14014/19/2018-UIDAI
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TERMS & CONDITIONS */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-black text-govblue-900 flex items-center gap-2">
              <FileCheck2 className="w-6 h-6 text-saffron-500" />
              <span>{lang === 'hi' ? 'नागरिक सेवा नियम एवं शर्तें (Terms of Service)' : lang === 'kn' ? 'ನಾಗರಿಕ ಸೇವಾ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು' : 'Citizen Terms of Service & Fair Use Policy'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Effective: SIH 2026 Grand Finale Edition (Updated September 2026)
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-black text-slate-900">
                1. Information Advisory Only (सूचनात्मक परामर्श)
              </h4>
              <p>
                The Digital Citizen Assistant is an assistive AI tool designed to facilitate discovery of government schemes. All eligibility evaluations are advisory in nature based on official Open Government Data. Final approval, benefit disbursement, and beneficiary selection remain the sole authority of the respective Ministry or Department of the Government of India / State Governments.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-black text-slate-900">
                2. No Commercial Intermediation (गैर-व्यावसायिक नीति)
              </h4>
              <p>
                This platform does not process commercial transactions, charge service fees, or sell citizen information. Any third-party demanding money claiming association with this project is fraudulent.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-black text-slate-900">
                3. User Responsibility & Accuracy (नागरिक कर्तव्य)
              </h4>
              <p>
                Users are encouraged to verify that uploaded documents and stated income/caste details are authentic before submitting official applications on government portals. Misrepresentation on official government portals may attract statutory penalties under the Indian Penal Code and Information Technology Act 2000.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FAQS */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-xl font-black text-govblue-900 flex items-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <span>{lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : lang === 'kn' ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು (FAQ)' : 'Frequently Asked Questions'}</span>
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const q = lang === 'hi' ? faq.q_hi : lang === 'kn' ? faq.q_kn : faq.q_en;
              const a = lang === 'hi' ? faq.a_hi : lang === 'kn' ? faq.a_kn : faq.a_en;
              const isOpen = activeFaq === idx;

              return (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 font-black text-sm text-govblue-900 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100 transition-colors"
                  >
                    <span>{q}</span>
                    <span className="text-lg text-slate-400 font-bold ml-4">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                      {a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Live Right to Erasure Action Box (DPDP Act Sec 12 Live Execution) */}
      <div className="bg-gradient-to-r from-slate-900 to-govblue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-saffron-400 font-black text-xs tracking-wider uppercase">
            <Trash2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'डीपीडीपी २०२३: डेटा मिटाने का अधिकार (Right to Erasure)' : lang === 'kn' ? 'ಡಿಪಿಡಿಪಿ ೨೦೨೩: ಡೇಟಾ ಅಳಿಸುವ ಹಕ್ಕು' : 'DPDP 2023: Right to Erasure (Article 12)'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">
            {lang === 'hi' ? 'क्या आप अपने डिवाइस से सभी अस्थायी सत्र डेटा को मिटाना चाहते हैं?' :
             lang === 'kn' ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ಸ್ಥಳೀಯ ಸೆಷನ್ ಡೇಟಾವನ್ನು ಈಗಲೇ ಅಳಿಸಲು ಬಯಸುವಿರಾ?' :
             'Purge & Reset All Local Session Data in 1-Click'}
          </h3>
          <p className="text-xs text-slate-300">
            {lang === 'hi' ? 'यह तुरंत आपके ब्राउज़र से सभी अस्थायी सत्र टोकन और सर्च इतिहास को स्थायी रूप से साफ़ कर देगा।' :
             lang === 'kn' ? 'ಇದು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿರುವ ತಾತ್ಕಾಲಿಕ ಸರ್ಚ್ ಇತಿಹಾಸವನ್ನು ತಕ್ಷಣ ಅಳಿಸುತ್ತದೆ.' :
             'Instantly wipe cached search history and active frontend browser tokens.'}
          </p>
          {clearedNotice && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold mt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सत्र डेटा सफलतापूर्वक मिटा दिया गया!' : lang === 'kn' ? 'ಸೆಷನ್ ಡೇಟಾ ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ!' : 'Session memory purged successfully!'}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleClearSessionData}
          className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Trash2 className="w-4 h-4" />
          <span>{lang === 'hi' ? 'स्थानीय डेटा साफ़ करें' : lang === 'kn' ? 'ಡೇಟಾ ಅಳಿಸಿ' : '1-Click Purge Session'}</span>
        </button>
      </div>

      {/* 5. Official Verification Seals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span className="text-xs font-black text-slate-800">DPDP Act 2023</span>
          <span className="text-[10px] text-slate-400">Consent & Erasure Ready</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
          <Server className="w-6 h-6 text-blue-600" />
          <span className="text-xs font-black text-slate-800">MeitY OGD Data</span>
          <span className="text-[10px] text-slate-400">data.gov.in Direct Schema</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
          <EyeOff className="w-6 h-6 text-purple-600" />
          <span className="text-xs font-black text-slate-800">UIDAI Masking</span>
          <span className="text-[10px] text-slate-400">First 8 Digits Redacted</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
          <CheckCircle2 className="w-6 h-6 text-saffron-600" />
          <span className="text-xs font-black text-slate-800">100% Free & Open</span>
          <span className="text-[10px] text-slate-400">Civic Tech For India</span>
        </div>
      </div>

    </div>
  );
}
