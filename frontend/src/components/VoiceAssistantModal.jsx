'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Mic, MicOff, Volume2, VolumeX, Sparkles, CheckCircle,
  Loader2, AlertTriangle, ChevronRight, ExternalLink, Award, ArrowRight
} from 'lucide-react';
import apiService from '../services/api';

// 22 Official Indian Languages (8th Schedule)
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

export default function VoiceAssistantModal({ isOpen, onClose, onTranscriptReceived, onSchemeSelect }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
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
    }, 120);
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

  // Auto-start listening on open
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setMatchedSchemes([]);
      setError(null);
      setTimeout(() => {
        startRecording();
      }, 300);
    } else {
      handleClose();
    }
  }, [isOpen]);

  const handleClose = () => {
    stopAllAudio();
    stopWaveAnimation();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsRecording(false);
    setIsSearching(false);
    if (onClose) onClose();
  };

  const speakText = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    stopAllAudio();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(selectedLang.split('-')[0]));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [selectedLang, stopAllAudio]);

  const executeVoiceSearch = async (queryText) => {
    if (!queryText || !queryText.trim()) return;
    setIsSearching(true);
    setError(null);

    try {
      const res = await apiService.unifiedEvaluate(
        queryText,
        {
          age: 40,
          annual_income: 140000,
          occupation: 'Citizen',
          category: 'BPL',
          state: 'Uttar Pradesh'
        },
        null,
        selectedLang.split('-')[0]
      );

      const schemes = res.matched_schemes || [];
      setMatchedSchemes(schemes);
      setSearchMeta({
        latency: res.latency_ms,
        count: schemes.length
      });

      // Prepare voice response announcing results
      if (schemes.length > 0) {
        const topScheme = schemes[0];
        const secondScheme = schemes[1];
        let speechMsg = '';

        if (selectedLang.startsWith('hi')) {
          speechMsg = `आपकी खोज के लिए हमें ${schemes.length} सरकारी योजनाएं मिली हैं। मुख्य योजना है: ${topScheme.title}। ${topScheme.summary ? topScheme.summary.slice(0, 100) : ''}`;
        } else if (selectedLang.startsWith('kn')) {
          speechMsg = `ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ${schemes.length} ಯೋಜನೆಗಳು ದೊರೆತಿವೆ: ${topScheme.title}`;
        } else if (selectedLang.startsWith('ta')) {
          speechMsg = `உங்கள் தேடலுக்கு ${schemes.length} திட்டங்கள் கிடைத்துள்ளன: ${topScheme.title}`;
        } else if (selectedLang.startsWith('te')) {
          speechMsg = `మీ శోధన కోసం ${schemes.length} పథకాలు కనుగొనబడ్డాయి: ${topScheme.title}`;
        } else {
          speechMsg = `Found ${schemes.length} government schemes for your query. Top scheme is: ${topScheme.title}.`;
        }

        speakText(speechMsg);
      } else {
        const noMsg = selectedLang.startsWith('hi')
          ? 'इस विषय पर कोई योजना नहीं मिली। कृपया पुनः प्रयास करें।'
          : 'No schemes found for this query. Please try another search.';
        speakText(noMsg);
      }

      // Notify parent page if callback available
      if (onTranscriptReceived) {
        onTranscriptReceived(queryText);
      }
    } catch (err) {
      console.error('Voice search error:', err);
      setError('योजनाएं खोजने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSearching(false);
    }
  };

  const startRecording = useCallback(() => {
    stopAllAudio();
    setError(null);
    setTranscript('');
    setMatchedSchemes([]);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Your browser does not support Web Speech API. Please use Chrome, Edge, or Brave.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      let capturedText = '';

      recognition.onstart = () => {
        setIsRecording(true);
        startWaveAnimation();
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }
        capturedText = final || interim;
        setTranscript(capturedText);
      };

      recognition.onerror = (e) => {
        setIsRecording(false);
        stopWaveAnimation();
        if (e.error !== 'no-speech') {
          setError(`Microphone error: ${e.error}. Please allow microphone access.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        stopWaveAnimation();
        const queryToSearch = capturedText.trim() || 'सरकारी योजनाएं किसान पेंशन राशन';
        setTranscript(queryToSearch);
        executeVoiceSearch(queryToSearch);
      };

      recognition.start();
    } catch (err) {
      setIsRecording(false);
      stopWaveAnimation();
      setError('Microphone initialization failed.');
    }
  }, [selectedLang, startWaveAnimation, stopWaveAnimation, stopAllAudio]);

  const handleManualSearch = (text) => {
    setTranscript(text);
    executeVoiceSearch(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-saffron-500 overflow-hidden my-6">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-govblue-900 via-slate-900 to-govblue-900 px-6 py-4 flex items-center justify-between text-white border-b-2 border-saffron-500">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-saffron-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-govblue-900" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                वॉइस स्कीम फाइंडर (Voice Assistant)
                <span className="text-[10px] bg-saffron-500 text-govblue-900 px-2 py-0.5 rounded-full uppercase font-black">
                  AI Live
                </span>
              </h2>
              <p className="text-xs text-slate-300">22 भारतीय भाषाएं • Llama 3 + PostgreSQL Vector Match</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selector Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">🌐 भाषा चुनें (Language):</span>
          <select
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              stopAllAudio();
            }}
            className="text-xs font-extrabold bg-white border border-slate-300 rounded-xl px-3 py-1 text-govblue-900 outline-none cursor-pointer"
          >
            {INDIAN_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Visualizer / Mic Status */}
        <div className="p-6 text-center space-y-4">
          
          {/* Animated Waveform Bars */}
          <div className="h-16 flex items-center justify-center space-x-2">
            {waveAmplitudes.map((amp, idx) => (
              <div
                key={idx}
                style={{ height: `${amp}px` }}
                className={`w-2.5 rounded-full transition-all duration-150 ${
                  isRecording
                    ? 'bg-gradient-to-t from-saffron-500 to-amber-400 shadow-md shadow-saffron-500/50'
                    : isSpeaking
                    ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Action Mic Button */}
          <div className="flex justify-center">
            <button
              onClick={isRecording ? () => recognitionRef.current?.stop() : startRecording}
              className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all ${
                isRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse scale-110'
                  : isSearching
                  ? 'bg-amber-500 text-white'
                  : 'bg-gradient-to-tr from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white hover:scale-105'
              }`}
            >
              {isSearching ? (
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              ) : isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

          {/* Status Text */}
          <p className="text-xs font-extrabold text-slate-500">
            {isRecording
              ? '🎙️ सुन रहे हैं… कृपया अपनी भाषा में बोलें (Listening... Speak now)'
              : isSearching
              ? '🔍 आपकी पात्रता एवं योजनाएं खोजी जा रही हैं… (Searching matching schemes...)'
              : isSpeaking
              ? '🔊 AI सहायक उत्तर दे रहा है (Voice response playing...)'
              : 'माइक दबाएं और बोलें (Tap mic to speak)'}
          </p>

          {/* Recognized Text Bubble */}
          {transcript && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left">
              <span className="text-[10px] font-extrabold uppercase text-amber-700 block">आपकी आवाज (Recognized Query):</span>
              <p className="text-sm font-extrabold text-govblue-900 mt-0.5">"{transcript}"</p>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Matched Schemes Results (Inside Modal) */}
          {matchedSchemes.length > 0 && (
            <div className="text-left space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-govblue-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  पात्र योजनाएं मिलीं (Matched Schemes: {matchedSchemes.length})
                </h4>
                {isSpeaking && (
                  <button
                    onClick={stopAllAudio}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <VolumeX className="w-3.5 h-3.5" /> आवाज रोकें (Mute)
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {matchedSchemes.map((scheme, idx) => (
                  <div
                    key={scheme.id || idx}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-extrabold text-govblue-900 leading-snug">
                        {scheme.title}
                      </h5>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold flex-shrink-0">
                        {scheme.match_percentage || 95}% Match
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {scheme.summary || scheme.benefits}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-md">
                        🏷️ {scheme.category_tag || 'Welfare'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {scheme.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Preset Queries */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5">त्वरित नमूना प्रश्न (Try Sample Queries):</span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                'किसान फसल बीमा एवं सब्सिडी',
                'वृद्धावस्था पेंशन 60+ वर्ष',
                'BPL मुफ्त राशन कार्ड योजना',
                'सुकन्या समृद्धि बालिका योजना'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleManualSearch(chip)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={startRecording}
            className="text-xs font-extrabold text-govblue-900 hover:text-saffron-600 flex items-center gap-1"
          >
            <Mic className="w-3.5 h-3.5 text-saffron-500" /> दोबारा बोलें (Speak Again)
          </button>

          <button
            onClick={() => {
              if (transcript && onTranscriptReceived) {
                onTranscriptReceived(transcript);
              }
              handleClose();
            }}
            className="px-4 py-2 bg-govblue-900 hover:bg-govblue-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <span>मुख्य पृष्ठ पर देखें (View on Dashboard)</span>
            <ArrowRight className="w-3.5 h-3.5 text-saffron-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
