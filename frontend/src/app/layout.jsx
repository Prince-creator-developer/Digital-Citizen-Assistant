'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import { Mic } from 'lucide-react';
import '../i18n';
import './globals.css';

export default function RootLayout({ children }) {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <html lang="hi">
      <body className="antialiased font-sans min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Global Floating Voice Mic Action Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="group relative flex items-center space-x-2 px-5 py-3.5 bg-gradient-to-tr from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-white"
          >
            <Mic className="w-6 h-6 animate-pulse" />
            <span className="hidden sm:inline">बोलकर खोजें (Voice Assistant)</span>
          </button>
        </div>

        {/* Voice Assistant Modal */}
        <VoiceAssistantModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
        />

        {/* Government Branding Footer */}
        <footer className="bg-govblue-900 text-slate-400 py-6 border-t-4 border-emerald-500">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs space-y-2">
            <p className="font-extrabold text-white">
              DECODE SIH 2026 | TRACK: BHARAT PRAGATI | Presented by Team Valerion Coders
            </p>
            <p className="text-slate-400">
              Designed for Rural & Semi-Urban Indian Citizens • Powered by Sarvam AI, Groq Llama 3, Tavily & n8n
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
