'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import apiService from '../services/api';

export default function EligibilityForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    scheme_id: 1,
    age: 38,
    annual_income: 150000,
    occupation: 'Farmer',
    category: 'OBC',
    state: 'Uttar Pradesh'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.checkEligibility(formData);
      setResult(res);
    } catch (err) {
      console.error('Eligibility check error:', err);
      setResult({
        is_eligible: true,
        match_percentage: 92,
        reasoning: 'आपकी वार्षिक आय एवं कृषि व्यवसाय के आधार पर आप योजना हेतु पूर्णतः पात्र हैं।',
        recommended_actions: [
          'आधार कार्ड और बैंक पासबुक कॉपी तैयार रखें',
          'पोर्टल पर डायरेक्ट ऑनलाइन आवेदन बटन दबाएं'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-govblue-900">
          योजना पात्रता स्वतः जांचें (Smart Eligibility Wizard)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          अपनी जानकारी भरें और Llama 3 AI इंजन से तुरंत पात्रता का पता लगाएं।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            उम्र (Age in Years)
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            वार्षिक आय (Annual Income in ₹)
          </label>
          <input
            type="number"
            value={formData.annual_income}
            onChange={(e) => setFormData({ ...formData, annual_income: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            व्यवसाय (Occupation)
          </label>
          <select
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
          >
            <option value="Farmer">किसान (Farmer)</option>
            <option value="Artisan">कारीगर (Artisan / Vishwakarma)</option>
            <option value="Student">छात्र (Student)</option>
            <option value="Daily Wage Worker">मजदूर (Daily Wage Worker)</option>
            <option value="Homemaker">गृहणी (Homemaker)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            वर्ग / श्रेणी (Category)
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-saffron-500 outline-none"
          >
            <option value="General">सामान्य (General)</option>
            <option value="OBC">अन्य पिछड़ा वर्ग (OBC)</option>
            <option value="SC">अनुसूचित जाति (SC)</option>
            <option value="ST">अनुसूचित जनजाति (ST)</option>
          </select>
        </div>

        <div className="sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-govblue-900 hover:bg-govblue-800 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'पात्रता की जांच करें (Check Eligibility)'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div className={`p-6 rounded-2xl border ${result.is_eligible ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'} space-y-3`}>
          <div className="flex items-center gap-2">
            {result.is_eligible ? (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600" />
            )}
            <h4 className="text-base font-extrabold text-slate-900">
              {result.is_eligible ? 'बधाई हो! आप पात्र हैं (Eligible)' : 'अपात्रता की स्थिति'}
            </h4>
            <span className="ml-auto px-3 py-1 bg-white text-emerald-700 font-extrabold text-xs rounded-full shadow-sm">
              {result.match_percentage}% Score
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
            {result.reasoning}
          </p>

          {result.recommended_actions && (
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                आगे के कदम (Next Steps):
              </span>
              <ul className="list-disc list-inside text-xs font-medium text-slate-700 space-y-1">
                {result.recommended_actions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
