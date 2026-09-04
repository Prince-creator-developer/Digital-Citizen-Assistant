import React from 'react';
import Navbar from '../components/Navbar';
import ClientProviders from '../components/ClientProviders';
import ClientLayoutWrapper from '../components/ClientLayoutWrapper';
import './globals.css';

export const metadata = {
  title: 'Digital Citizen Assistant — DSIH 2026',
  description: 'Multilingual Voice & AI Scheme Access Engine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="antialiased font-sans min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
        <ClientProviders>
          {/* Navigation Bar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Client-side Voice Floating Action Button */}
          <ClientLayoutWrapper />

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
        </ClientProviders>
      </body>
    </html>
  );
}
