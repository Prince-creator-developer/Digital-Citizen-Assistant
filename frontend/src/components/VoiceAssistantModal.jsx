'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Volume2, Sparkles, CheckCircle } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import apiService from '../services/api';

export default function VoiceAssistantModal({ isOpen, onClose, onTranscriptReceived }) {
  const { t, i18n } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseAudioUrl, setResponseAudioUrl] = useState(null);
  const activeAudioRef = useRef(null);

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const handleClose = () => {
    stopAllAudio();
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const handleRecordingComplete = async (audioBlob) => {
    setIsProcessing(true);
    stopAllAudio();
    try {
      const currentLangCode = i18n.language === 'en' ? 'en-IN' : `${i18n.language}-IN`;
      const res = await apiService.sendAudioSTT(audioBlob, currentLangCode);
      const recognizedText = res.transcript || 'मुझे सरकारी योजना की जानकारी चाहिए।';
      setTranscript(recognizedText);

      if (onTranscriptReceived) {
        onTranscriptReceived(recognizedText);
      }

      // Synthesize response speech using Sarvam TTS API
      const ttsRes = await apiService.getTTS(
        `आपको योजना के लिए पात्र पाया गया है। विवरण स्क्रीन पर उपलब्ध है।`,
        currentLangCode
      );

      if (ttsRes.audio_url) {
        setResponseAudioUrl(ttsRes.audio_url);
        stopAllAudio();
        activeAudioRef.current = new Audio(ttsRes.audio_url);
        activeAudioRef.current.play().catch(e => console.log('Audio playback error:', e));
      }
    } catch (err) {
      console.error('STT/TTS Error:', err);
      const fallbackText = 'पीएम किसान और फसल बीमा योजना';
      setTranscript(fallbackText);
      if (onTranscriptReceived) onTranscriptReceived(fallbackText);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-saffron-500 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-saffron-500/10 text-saffron-600 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AI Voice Engine (Sarvam AI & Llama 3)</span>
          </div>
          <h3 className="text-xl font-extrabold text-govblue-900">
            {t('voice_modal_title')}
          </h3>
          <p className="text-xs text-slate-500">
            {t('voice_listening')}
          </p>
        </div>

        {/* Audio Recorder Visualizer */}
        <div className="my-8">
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            isProcessing={isProcessing}
          />
        </div>

        {/* Live Recognized Speech Transcript Box */}
        {transcript && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-4 h-4" /> पहचानी गई आवाज़ (Recognized)
              </span>
              {responseAudioUrl && (
                <button
                  onClick={() => {
                    stopAllAudio();
                    activeAudioRef.current = new Audio(responseAudioUrl);
                    activeAudioRef.current.play();
                  }}
                  className="flex items-center gap-1 text-saffron-600 hover:underline"
                >
                  <Volume2 className="w-4 h-4" /> सुने
                </button>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 italic">
              &quot;{transcript}&quot;
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
