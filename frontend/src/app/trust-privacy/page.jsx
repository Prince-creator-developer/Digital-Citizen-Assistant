'use client';
import React, { useState } from 'react';
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
  Trash2, 
  ExternalLink, 
  Scale, 
  HelpCircle,
  Cpu,
  Fingerprint
} from 'lucide-react';

export default function TrustPrivacyPage() {
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const lang = i18n.language || 'en';

  const charterAudioTexts = {
    en: "Digital Citizen Assistant Privacy & Trust Charter. We guarantee: First, your voice and personal data are strictly used to find eligible government welfare schemes. Second, Aadhaar numbers are masked according to UIDAI guidelines. Third, we never request bank PINs or OTPs. Fourth, you have the complete right to erase all your data anytime under the Digital Personal Data Protection Act 2023.",
    hi: "डिजिटल नागरिक सहायक डेटा सुरक्षा और विश्वास घोषणापत्र। हमारी गारंटी: पहला, आपकी आवाज़ और दस्तावेज़ केवल सरकारी योजनाओं की पात्रता जांचने के लिए उपयोग किए जाते हैं। दूसरा, आधार नंबर यूआईडीएआई नियमों के तहत पूरी तरह सुरक्षित और मास्क रहता है। तीसरा, हम कभी भी बैंक पिन या ओटीपी नहीं मांगते। चौथा, डीपीसपी 2023 कानून के तहत आपको किसी भी समय अपना पूरा डेटा मिटाने का पूर्ण अधिकार है।",
    kn: "ಡಿಜಿಟಲ್ ನಾಗರಿಕ ಸಹಾಯಕ ಡೇಟಾ ಭದ್ರತೆ ಮತ್ತು ನಂಬಿಕೆಯ ನೀತಿ. ನಮ್ಮ ಗ್ಯಾರಂಟಿ: ಮೊದಲನೆಯದಾಗಿ, ನಿಮ್ಮ ಧ್ವನಿ ಮತ್ತು ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಕೇವಲ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಅರ್ಹತೆ ಹುಡುಕಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ಎರಡನೆಯದಾಗಿ, ಯುಐಡಿಎಐ ನಿಯಮಾವಳಿಯಂತೆ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಮರೆಮಾಚಲಾಗುತ್ತದೆ. ಮೂರನೆಯದಾಗಿ, ನಾವು ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಪಿನ್ ಅಥವಾ ಓಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ. ನಾಲ್ಕನೆಯದಾಗಿ, ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ 2023 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಿಹಾಕುವ ಹಕ್ಕು ನಿಮಗಿದೆ."
  };

  const handleSpeakCharter = () => {
    if ('speechSynthesis' in window) {
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
      a_hi: "डीपीसपी (DPDP) कानून 2023 की धारा 12 के तहत आपको अपना डेटा मिटाने का पूरा अधिकार है। आप नीचे दिए गए बटन पर क्लिक करके किसी भी समय अपना सत्र और डेटा मिटा सकते हैं।",
      a_kn: "ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ (DPDP) ಕಾಯ್ದೆ 2023 ರ ಸೆಕ್ಷನ್ 12 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಿಹಾಕುವ ಹಕ್ಕು ನಿಮಗಿದೆ."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-govblue-900 via-govblue-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border-b-4 border-saffron-500">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Act 2023 & MeitY Aligned Transparency</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {lang === 'hi' ? 'डेटा सुरक्षा, गोपनीयता और नागरिक विश्वास घोषणापत्र' :
               lang === 'kn' ? 'ಡೇಟಾ ಭದ್ರತೆ, ಗೌಪ್ಯತೆ ಮತ್ತು ನಾಗರಿಕ ನಂಬಿಕೆಯ ನೀತಿ' :
               'Data Security, Privacy & Citizen Trust Charter'}
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'hi' ? 'हम समझते हैं कि आपका डेटा और पहचान अमूल्य है। जानिए कि आपका डेटा कहाँ जाता है, कैसे सुरक्षित रहता है, और हम आपके अधिकारों की कैसे रक्षा करते हैं।' :
               lang === 'kn' ? 'ನಿಮ್ಮ ಡೇಟಾ ಮತ್ತು ಗೌಪ್ಯತೆಯು ಅತ್ಯಂತ ಅಮೂಲ್ಯವಾಗಿದೆ. ನಿಮ್ಮ ವಿವರಗಳು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತವೆ ಮತ್ತು ನಾವು ಅದನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುತ್ತೇವೆ ಎಂಬುದನ್ನು ಇಲ್ಲಿ ಪಾರದರ್ಶಕವಾಗಿ ನೋಡಿ.' :
               'We believe that transparency is the foundation of public trust. Here is an open, plain-language breakdown of exactly where your data travels, how it is safeguarded, and your sovereign rights under Indian law.'}
            </p>

            {/* Listen Audio Button */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={handleSpeakCharter}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                  isSpeaking 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-saffron-500 hover:bg-saffron-600 text-govblue-900'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isSpeaking 
                    ? (lang === 'hi' ? 'आवाज़ बंद करें (Stop)' : lang === 'kn' ? 'ನಿಲ್ಲಿಸಿ (Stop)' : 'Stop Audio')
                    : (lang === 'hi' ? '🔊 विश्वास घोषणापत्र सुनें (Audio)' : lang === 'kn' ? '🔊 ಭದ್ರತಾ ನೀತಿ ಆಲಿಸಿ (Audio)' : '🔊 Listen to Privacy Charter (Audio)')}
                </span>
              </button>

              <span className="text-xs text-slate-400">
                🎙️ Available in 22 Official Indian Languages
              </span>
            </div>
          </div>
        </div>

        {/* Visual Data Journey Map */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-govblue-900">
              {lang === 'hi' ? '🔍 आपके डेटा की पारदर्शी यात्रा (Data Lifecycle Map)' :
               lang === 'kn' ? '🔍 ನಿಮ್ಮ ಡೇಟಾದ ಪಾರದರ್ಶಕ ಚಕ್ರ (Data Lifecycle Map)' :
               '🔍 The Transparent Citizen Data Journey'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'hi' ? 'कोई छिपा हुआ सर्वर नहीं, कोई थर्ड-पार्टी विज्ञापन ट्रैकर नहीं।' :
               lang === 'kn' ? 'ಯಾವುದೇ ಗುಪ್ತ ಸರ್ವರ್ ಇಲ್ಲ, ಜಾಹೀರಾತು ಟ್ರ್ಯಾಕರ್‌ಗಳಿಲ್ಲ.' :
               'No hidden monetization, no third-party ad tracking, no secret biometric storage.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3 shadow-md">
                  1
                </div>
                <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-sm mb-1">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'hi' ? 'ध्वनि और संवाद' : lang === 'kn' ? 'ಧ್ವನಿ ಮತ್ತು ಇನ್‌ಪುಟ್' : 'Voice & Input'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'आपकी बोली डिवाइस पर ही टेक्स्ट में बदलती है। कोई बायोमेट्रिक वॉयस रिकॉर्डिंग सेव नहीं की जाती।' :
                   lang === 'kn' ? 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಸಾಧನದಲ್ಲೇ ಪಠ್ಯವಾಗಿ ಪರಿವರ್ತಿಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಆಡಿಯೋ ರೆಕಾರ್ಡ್ ಉಳಿಯುವುದಿಲ್ಲ.' :
                   'Voice queries are converted to text in real-time. No raw acoustic audio or voiceprints are persistently stored.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200/60 text-[11px] font-bold text-blue-700">
                ✓ Web Speech & Fast Inference
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-3 shadow-md">
                  2
                </div>
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-sm mb-1">
                  <Fingerprint className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'मास्क्ड OCR वॉल्ट' : lang === 'kn' ? 'ಮಾಸ್ಕ್ ಮಾಡಿದ OCR' : 'Masked OCR Vault'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'आधार/आय प्रमाण पत्र के संवेदनशील नंबर (जैसे प्रथम 8 अंक) तुरंत मास्क (XXXX-XXXX-1234) हो जाते हैं।' :
                   lang === 'kn' ? 'ಆಧಾರ್ ಮತ್ತು ಆದಾಯ ಪತ್ರದ ಮೊದಲ 8 ಅಂಕಿಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮರೆಮಾಚಲಾಗುತ್ತದೆ.' :
                   'OCR extracts demographic criteria. Aadhaar numbers are masked to XXXX-XXXX-1234 adhering to UIDAI guidelines.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] font-bold text-emerald-700">
                ✓ UIDAI Masking Compliant
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow-md">
                  3
                </div>
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-sm mb-1">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'hi' ? 'AI वेक्टर मैचिंग' : lang === 'kn' ? 'AI ಅರ್ಹತಾ ಮ್ಯಾಚ್' : 'AI Eligibility Match'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'नागरिक के मानदंडों की तुलना सीधे ओपन गवर्नमेंट डेटा (OGD) के 47+ योजनाओं से की जाती है।' :
                   lang === 'kn' ? 'ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಅಧಿಕೃತ ಸರ್ಕಾರದ 47+ ಯೋಜನೆಗಳ ಮಾನದಂಡಗಳೊಂದಿಗೆ ತಕ್ಷಣ ಹೋಲಿಸಲಾಗುತ್ತದೆ.' :
                   'Criteria (age, income, occupation) is compared against verified Open Government Data (data.gov.in) schemes.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] font-bold text-amber-700">
                ✓ Open Govt Scheme Rules
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold mb-3 shadow-md">
                  4
                </div>
                <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-sm mb-1">
                  <ExternalLink className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'hi' ? 'सरकारी पोर्टल' : lang === 'kn' ? 'ಅಧಿಕೃತ .gov.in' : 'Official .gov.in'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' ? 'अंतिम आवेदन केवल आधिकारिक .gov.in या .nic.in पोर्टल पर होता है। कोई निजी कमीशन नहीं।' :
                   lang === 'kn' ? 'ಅಂತಿಮ ಅರ್ಜಿಯನ್ನು ಅಧಿಕೃತ .gov.in ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಮಾತ್ರ ಸಲ್ಲಿಸಲಾಗುತ್ತದೆ.' :
                   'You are redirected to authenticated government domains (.gov.in / .nic.in). No intermediary transaction fees.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-purple-200/60 text-[11px] font-bold text-purple-700">
                ✓ Verified GOI Endpoints
              </div>
            </div>
          </div>
        </div>

        {/* 4 Ironclad Citizen Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-govblue-900">
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
              {lang === 'hi' ? 'सभी सरकारी कल्याणकारी योजनाएं (जैसे PM-KISAN, वृद्धावस्था पेंशन, सुकन्या समृद्धि) भारत के नागरिकों के लिए बिना किसी अतिरिक्त सेवा शुल्क के उपलब्ध हैं।' :
               lang === 'kn' ? 'ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು (ಉದಾ: ಪಿಎಂ-ಕಿಸಾನ್, ವೃದ್ಧಾಪ್ಯ ವೇತನ) ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಸೇವಾ ಶುಲ್ಕವಿಲ್ಲದೆ ಉಚಿತವಾಗಿ ದೊರೆಯುತ್ತವೆ.' :
               'Every government welfare scheme indexed on this platform is accessible free of charge. We will never ask for payment to unlock or apply for schemes.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <EyeOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-govblue-900">
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

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-govblue-900">
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

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-govblue-900">
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

        {/* Interactive 1-Click Erasure Action Box (DPDP Act Sec 12 Live Proof) */}
        <div className="bg-gradient-to-r from-slate-900 to-govblue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-saffron-400 font-extrabold text-xs tracking-wider uppercase">
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
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'स्थानीय डेटा साफ़ करें' : lang === 'kn' ? 'ಡೇಟಾ ಅಳಿಸಿ' : '1-Click Purge Session'}</span>
          </button>
        </div>

        {/* Official Terms & Conditions Summary */}
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

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm">
                1. Information Advisory Only (सूचनात्मक परामर्श)
              </h4>
              <p>
                The Digital Citizen Assistant is an assistive AI tool designed to facilitate discovery of government schemes. All eligibility evaluations are advisory in nature based on official Open Government Data. Final approval, benefit disbursement, and beneficiary selection remain the sole authority of the respective Ministry or Department of the Government of India / State Governments.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm">
                2. No Commercial Intermediation (गैर-व्यावसायिक नीति)
              </h4>
              <p>
                This platform does not process commercial transactions, charge service fees, or sell citizen information. Any third-party demanding money claiming association with this project is fraudulent.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm">
                3. User Responsibility & Accuracy (नागरिक कर्तव्य)
              </h4>
              <p>
                Users are encouraged to verify that uploaded documents and stated income/caste details are authentic before submitting official applications on government portals. Misrepresentation on official government portals may attract statutory penalties under the Indian Penal Code and Information Technology Act 2000.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
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
                    className="w-full text-left p-4 sm:p-5 font-bold text-sm text-govblue-900 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100 transition-colors"
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

        {/* Compliance Footer Seals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span className="text-xs font-extrabold text-slate-800">DPDP Act 2023</span>
            <span className="text-[10px] text-slate-400">Consent & Erasure Ready</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
            <Server className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-extrabold text-slate-800">MeitY OGD Data</span>
            <span className="text-[10px] text-slate-400">data.gov.in Direct Schema</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
            <EyeOff className="w-6 h-6 text-purple-600" />
            <span className="text-xs font-extrabold text-slate-800">UIDAI Masking</span>
            <span className="text-[10px] text-slate-400">First 8 Digits Redacted</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-saffron-600" />
            <span className="text-xs font-extrabold text-slate-800">100% Free & Open</span>
            <span className="text-[10px] text-slate-400">Civic Tech For India</span>
          </div>
        </div>

      </div>
    </div>
  );
}
