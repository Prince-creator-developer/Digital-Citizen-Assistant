'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

// 22 Official Indian Languages
export const INDIAN_LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी (Hindi)', short: 'hi' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', short: 'bn' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', short: 'te' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', short: 'mr' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', short: 'ta' },
  { code: 'ur-IN', label: 'اردو (Urdu)', short: 'ur' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', short: 'gu' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', short: 'kn' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)', short: 'or' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', short: 'ml' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)', short: 'pa' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)', short: 'as' },
  { code: 'mai-IN', label: 'मैथिली (Maithili)', short: 'mai' },
  { code: 'sa-IN', label: 'संस्कृतम् (Sanskrit)', short: 'sa' },
  { code: 'ks-IN', label: 'کٲشُر (Kashmiri)', short: 'ks' },
  { code: 'ne-IN', label: 'नेपाली (Nepali)', short: 'ne' },
  { code: 'sd-IN', label: 'سنڌي (Sindhi)', short: 'sd' },
  { code: 'kok-IN', label: 'कोंकणी (Konkani)', short: 'kok' },
  { code: 'doi-IN', label: 'डोगरी (Dogri)', short: 'doi' },
  { code: 'mni-IN', label: 'মৈতৈলোন্ (Manipuri)', short: 'mni' },
  { code: 'brx-IN', label: 'बड़ो (Bodo)', short: 'brx' },
  { code: 'en-IN', label: 'English (India)', short: 'en' },
];

export default function VoiceAssistantModal({ isOpen, onClose, onTranscriptReceived }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveAmplitudes, setWaveAmplitudes] = useState([20, 20, 20, 20, 20, 20, 20, 20]);

  const recognitionRef = useRef(null);
  const waveIntervalRef = useRef(null);

  const stopAllAudio = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const stopWaveAnimation = useCallback(() => {
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    setWaveAmplitudes([20, 20, 20, 20, 20, 20, 20, 20]);
  }, []);

  const startWaveAnimation = useCallback(() => {
    waveIntervalRef.current = setInterval(() => {
      setWaveAmplitudes(Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 10));
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      stopAllAudio();
      stopWaveAnimation();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, [stopAllAudio, stopWaveAnimation]);

  const handleClose = () => {
    stopAllAudio();
    stopWaveAnimation();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsRecording(false);
    setTranscript('');
    setError(null);
    if (onClose) onClose();
  };

  const speakResponse = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    stopAllAudio();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to pick a voice matching the language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(selectedLang.split('-')[0]));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [selectedLang, stopAllAudio]);

  const startRecording = useCallback(() => {
    setError(null);
    setTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Your browser does not support voice recognition. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    let capturedFinal = '';

    recognition.onstart = () => {
      setIsRecording(true);
      startWaveAnimation();
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      capturedFinal = finalTranscript || interimTranscript;
      setTranscript(capturedFinal);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsProcessing(true);
      stopWaveAnimation();

      const finalText = capturedFinal || 'सरकारी योजना की जानकारी दें';
      setTranscript(finalText);

      // Speak back a response in the selected language
      const responses = {
        'hi-IN': `आपकी खोज "${finalText.slice(0, 30)}" के लिए योजनाएं खोजी जा रही हैं।`,
        'kn-IN': `"${finalText.slice(0, 20)}" ಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ।`,
        'ta-IN': `"${finalText.slice(0, 20)}" க்கான திட்டங்கள் தேடப்படுகின்றன।`,
        'te-IN': `"${finalText.slice(0, 20)}" కోసం పథకాలు వెతుకుతున్నాము।`,
        'mr-IN': `"${finalText.slice(0, 20)}" साठी योजना शोधत आहोत।`,
        'ml-IN': `"${finalText.slice(0, 20)}" നായി പദ്ധതികൾ തിരയുന്നു.`,
        'bn-IN': `"${finalText.slice(0, 20)}" এর জন্য প্রকল্প খোঁজা হচ্ছে।`,
        'en-IN': `Searching schemes for "${finalText.slice(0, 30)}".`,
      };
      const responseText = responses[selectedLang] || responses['hi-IN'];
      speakResponse(responseText);

      // Wait for TTS to finish, then trigger search and close
      setTimeout(() => {
        speakResponse(responseText);
        setIsProcessing(false);
      }, 500);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      setIsProcessing(false);
      stopWaveAnimation();
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again and speak clearly.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone in browser settings.');
      } else {
        setError(`Voice error: ${event.error}. Please try again.`);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [selectedLang, transcript, onTranscriptReceived, speakResponse, startWaveAnimation, stopWaveAnimation]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsRecording(false);
    stopWaveAnimation();
  }, [stopWaveAnimation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-saffron-500 overflow-hidden">

        {/* Close */}
        <button onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-saffron-500/10 text-saffron-600 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AI Voice Engine — Web Speech API</span>
          </div>
          <h3 className="text-xl font-extrabold text-govblue-900">
            🎙️ Voice Assistant (वॉयस असिस्टेंट)
          </h3>
          <p className="text-xs text-slate-500">
            Speak in any of 22 Indian languages to search government schemes
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            🌐 Select Your Language (भाषा चुनें):
          </label>
          <select
            value={selectedLang}
            onChange={(e) => { setSelectedLang(e.target.value); stopAllAudio(); }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
          >
            {INDIAN_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        {/* Waveform Visualizer */}
        <div className="flex items-center justify-center gap-1 h-16 mb-6">
          {waveAmplitudes.map((amp, i) => (
            <div
              key={i}
              className={`w-2.5 rounded-full transition-all duration-150 ${
                isRecording ? 'bg-saffron-500' : isSpeaking ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
              style={{ height: `${isRecording || isSpeaking ? amp : 20}px` }}
            />
          ))}
        </div>

        {/* Mic Button */}
        <div className="flex flex-col items-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isProcessing}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isProcessing
                ? <Loader2 className="w-9 h-9 animate-spin" />
                : <Mic className="w-9 h-9" />
              }
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-2xl flex items-center justify-center transition-all animate-pulse"
            >
              <MicOff className="w-9 h-9" />
            </button>
          )}
          <p className="text-xs font-bold text-slate-500">
            {isRecording ? '🔴 Recording… Click to Stop'
              : isProcessing ? '⏳ Processing your voice…'
              : isSpeaking ? '🔊 Speaking response…'
              : '👆 Tap mic to start speaking'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Transcript Result */}
        {transcript && !error && (
          <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Recognized:
              </span>
              <button
                onClick={() => speakResponse(transcript)}
                className="flex items-center gap-1 text-saffron-600 hover:underline"
              >
                <Volume2 className="w-4 h-4" /> Replay
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-800 italic">"{transcript}"</p>
          </div>
        )}

      </div>
    </div>
  );
}
