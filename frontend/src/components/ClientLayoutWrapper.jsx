'use client';
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import VoiceAssistantModal from './VoiceAssistantModal';

export default function ClientLayoutWrapper() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="group relative flex items-center space-x-2 px-5 py-3.5 bg-gradient-to-tr from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-white"
        >
          <Mic className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline">बोलकर खोजें (Voice Assistant)</span>
        </button>
      </div>

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptReceived={(text) => {
          if (typeof window !== 'undefined' && window.location.pathname !== '/') {
            window.location.href = `/?search=${encodeURIComponent(text)}`;
          }
        }}
      />
    </>
  );
}
