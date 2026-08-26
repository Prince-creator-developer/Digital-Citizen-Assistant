'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Volume2, ChevronRight, ChevronLeft, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
  'Puducherry','Chandigarh','Andaman & Nicobar','Lakshadweep','Dadra & Nagar Haveli'
];

const STEPS = [
  {
    id: 'basic', title: 'बुनियादी जानकारी', titleEn: 'Basic Info',
    hint: 'अपना नाम, ईमेल और पासवर्ड दर्ज करें।',
    fields: ['name', 'email', 'phone', 'password']
  },
  {
    id: 'personal', title: 'व्यक्तिगत विवरण', titleEn: 'Personal Details',
    hint: 'अपनी उम्र, लिंग और राज्य बताएं।',
    fields: ['age', 'gender', 'state', 'district']
  },
  {
    id: 'financial', title: 'आर्थिक जानकारी', titleEn: 'Financial Info',
    hint: 'आपकी आय और पेशे के आधार पर सही योजनाएं मिलेंगी।',
    fields: ['annual_income', 'occupation', 'category']
  },
  {
    id: 'extra', title: 'अतिरिक्त विवरण', titleEn: 'Additional Details',
    hint: 'यह जानकारी किसान और BPL योजनाओं के लिए जरूरी है।',
    fields: ['is_farmer', 'has_ration_card', 'language_preference']
  }
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    age: '', gender: 'Male', state: '', district: '',
    annual_income: '', occupation: '', category: 'General',
    is_farmer: false, has_ration_card: false,
    language_preference: 'hi', ration_card_type: ''
  });

  const speak = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = form.language_preference === 'hi' ? 'hi-IN' : 'en-IN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleNext = () => {
    setError('');
    if (step === 0) {
      if (!form.name.trim()) {
        setError('कृपया अपना पूरा नाम दर्ज करें (Please enter your name).');
        return;
      }
      if (!form.email.trim() || !form.email.includes('@')) {
        setError('कृपया सही ईमेल दर्ज करें (Please enter a valid email).');
        return;
      }
      if (!form.phone.trim() || form.phone.trim().length < 10) {
        setError('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें (Please enter a 10-digit mobile number).');
        return;
      }
      if (!form.password || form.password.length < 6) {
        setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Password must be at least 6 characters).');
        return;
      }
    } else if (step === 1) {
      if (!form.age || parseInt(form.age) < 18) {
        setError('कृपया वैध आयु (18+ वर्ष) दर्ज करें (Please enter a valid age, 18+).');
        return;
      }
      if (!form.state) {
        setError('कृपया अपना राज्य चुनें (Please select your state).');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || 'Male',
        state: form.state || null,
        district: form.district ? form.district.trim() : null,
        annual_income: form.annual_income ? parseFloat(form.annual_income) : null,
        occupation: form.occupation || 'Citizen',
        category: form.category || 'General',
        language_preference: form.language_preference || 'hi',
        is_farmer: Boolean(form.is_farmer),
        has_ration_card: Boolean(form.has_ration_card),
        ration_card_type: form.ration_card_type || null,
      };

      await register(payload);
      speak('बधाई हो! आपका खाता सफलतापूर्वक बन गया है।');
      router.push('/profile');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please check your details.';
      setError(msg);
      speak('पंजीकरण विफल। ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-govblue-900">नागरिक पंजीकरण</h1>
          <p className="text-sm text-slate-500">Citizen Registration — Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                i < step ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-govblue-900 text-white' :
                'bg-slate-200 text-slate-500'
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 rounded-full ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-govblue-900">{currentStep.title}</h2>
              <p className="text-xs text-slate-500">{currentStep.titleEn}</p>
            </div>
            <button onClick={() => speak(currentStep.hint)}
              className="flex items-center gap-1 text-xs text-saffron-600 hover:underline">
              <Volume2 className="w-3.5 h-3.5" /> सुनें
            </button>
          </div>

          <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
            💡 {currentStep.hint}
          </p>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-sm flex gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-3">
              {[
                { key: 'name', label: '👤 पूरा नाम (Full Name)', type: 'text', placeholder: 'जैसे: रामेश कुमार / Ramesh Kumar' },
                { key: 'email', label: '📧 ईमेल (Email)', type: 'email', placeholder: 'example@gmail.com' },
                { key: 'phone', label: '📱 मोबाइल नंबर (Mobile)', type: 'tel', placeholder: '10-digit number' },
                { key: 'password', label: '🔒 पासवर्ड (Password)', type: 'password', placeholder: 'Minimum 8 characters' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none" />
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🎂 आयु (Age in years)</label>
                <input type="number" min="18" max="100" value={form.age} onChange={e => set('age', e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">⚧ लिंग (Gender)</label>
                <select value={form.gender} onChange={e => set('gender', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none">
                  <option value="Male">पुरुष (Male)</option>
                  <option value="Female">महिला (Female)</option>
                  <option value="Other">अन्य (Other)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🗺️ राज्य (State)</label>
                <select value={form.state} onChange={e => set('state', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none">
                  <option value="">-- राज्य चुनें (Select State) --</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🏘️ जिला (District)</label>
                <input type="text" value={form.district} onChange={e => set('district', e.target.value)}
                  placeholder="e.g. Lucknow, Mysuru"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
            </div>
          )}

          {/* Step 2: Financial */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">💰 वार्षिक आय ₹ (Annual Income in ₹)</label>
                <input type="number" value={form.annual_income} onChange={e => set('annual_income', e.target.value)}
                  placeholder="e.g. 120000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none" />
                <p className="text-[10px] text-slate-400 mt-0.5">इस जानकारी से सही योजनाएं मिलती हैं।</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🧑‍💼 पेशा (Occupation)</label>
                <select value={form.occupation} onChange={e => set('occupation', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none">
                  <option value="">-- पेशा चुनें --</option>
                  <option value="Farmer">किसान (Farmer)</option>
                  <option value="Labour">मजदूर (Labour)</option>
                  <option value="Artisan">कारीगर (Artisan)</option>
                  <option value="Self-Employed">स्वरोजगार (Self-Employed)</option>
                  <option value="Government Employee">सरकारी कर्मचारी</option>
                  <option value="Private Employee">निजी कर्मचारी</option>
                  <option value="Student">छात्र (Student)</option>
                  <option value="Homemaker">गृहिणी (Homemaker)</option>
                  <option value="Retired">सेवानिवृत्त (Retired)</option>
                  <option value="Unemployed">बेरोजगार (Unemployed)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🏷️ श्रेणी (Category)</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none">
                  <option value="General">सामान्य (General)</option>
                  <option value="OBC">अन्य पिछड़ा वर्ग (OBC)</option>
                  <option value="SC">अनुसूचित जाति (SC)</option>
                  <option value="ST">अनुसूचित जनजाति (ST)</option>
                  <option value="BPL">गरीबी रेखा से नीचे (BPL)</option>
                  <option value="EWS">आर्थिक रूप से कमजोर (EWS)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Extra */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" checked={form.is_farmer} onChange={e => set('is_farmer', e.target.checked)}
                  className="w-5 h-5 accent-saffron-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800">🌾 क्या आप किसान हैं? (Are you a Farmer?)</p>
                  <p className="text-xs text-slate-500">PM-KISAN और फसल बीमा जैसी योजनाओं के लिए</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input type="checkbox" checked={form.has_ration_card} onChange={e => set('has_ration_card', e.target.checked)}
                  className="w-5 h-5 accent-saffron-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800">🍚 राशन कार्ड है? (Have Ration Card?)</p>
                  <p className="text-xs text-slate-500">AAY और PMGKAY जैसी योजनाओं के लिए</p>
                </div>
              </label>

              {form.has_ration_card && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">राशन कार्ड प्रकार (Ration Card Type)</label>
                  <select value={form.ration_card_type} onChange={e => set('ration_card_type', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none">
                    <option value="AAY">AAY (अन्त्योदय)</option>
                    <option value="PHH">PHH (प्राथमिकता परिवार)</option>
                    <option value="NPHH">NPHH (गैर-प्राथमिकता)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🌐 भाषा प्राथमिकता (Preferred Language)</label>
                <select value={form.language_preference} onChange={e => set('language_preference', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none">
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="or">ଓଡ଼ିଆ (Odia)</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl flex items-center justify-center gap-1">
                <ChevronLeft className="w-4 h-4" /> पिछला (Back)
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={handleNext}
                className="flex-1 py-3 bg-govblue-900 hover:bg-govblue-800 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-1">
                अगला (Next) <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-saffron-500 to-amber-600 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-1 disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> पंजीकरण हो रहा है…</> : '✅ पंजीकरण पूर्ण करें (Register)'}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-slate-500">
            पहले से खाता है?{' '}
            <Link href="/login" className="text-govblue-900 font-extrabold hover:text-saffron-600 underline">
              लॉगिन करें (Login)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
