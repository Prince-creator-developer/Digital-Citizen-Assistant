'use client';
import React from 'react';
import EligibilityForm from '../../components/EligibilityForm';

export default function EligibilityPage() {
  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-govblue-900">
          पात्रता मूल्यांकन केंद्र (AI Eligibility Checker)
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          अपनी बुनियादी जानकारी दर्ज करें और AI एल्गोरिदम (Groq Llama 3) द्वारा तुरंत जानें कि आप किन योजनाओं के लिए पात्र हैं।
        </p>
      </div>

      <EligibilityForm />
    </div>
  );
}
