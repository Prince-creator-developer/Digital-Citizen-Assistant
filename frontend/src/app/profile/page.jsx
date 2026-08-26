'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  User, MapPin, Briefcase, IndianRupee, Shield, CheckCircle2,
  Edit3, Volume2, LogOut, ChevronRight, Tractor, Loader2, FileText
} from 'lucide-react';

export default function ProfilePage() {
  const { user, token, logout, getProfile, updateProfile } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    getProfile().then(p => { setProfile(p); setEditForm(p); }).finally(() => setLoading(false));
  }, [token]);

  const speak = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = (profile?.language_preference || 'hi') + '-IN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: editForm.name, age: editForm.age, gender: editForm.gender,
        state: editForm.state, district: editForm.district,
        annual_income: editForm.annual_income, occupation: editForm.occupation,
        category: editForm.category, language_preference: editForm.language_preference,
        is_farmer: editForm.is_farmer, has_ration_card: editForm.has_ration_card,
      });
      setProfile({ ...profile, ...editForm });
      setEditing(false);
      speak('प्रोफाइल सफलतापूर्वक अपडेट हो गई।');
    } finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-saffron-500" />
    </div>
  );

  if (!profile) return null;

  const eligibleCategories = [];
  if (profile.is_farmer) eligibleCategories.push('Farmers');
  if (profile.annual_income < 150000) eligibleCategories.push('BPL');
  if (profile.age >= 60) eligibleCategories.push('Elders');
  if (profile.gender === 'Female') eligibleCategories.push('Women');
  if (profile.category === 'SC' || profile.category === 'ST' || profile.category === 'OBC') eligibleCategories.push('Artisans');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-govblue-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-saffron-500/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-tr from-saffron-500 to-amber-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg flex-shrink-0">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">{profile.name}</h1>
            <p className="text-slate-300 text-sm">{profile.email} • {profile.phone}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.category && (
                <span className="px-2 py-0.5 bg-saffron-500/20 text-saffron-300 rounded-full text-xs font-bold">{profile.category}</span>
              )}
              {profile.state && (
                <span className="px-2 py-0.5 bg-white/10 text-white rounded-full text-xs font-bold">📍 {profile.state}</span>
              )}
              {profile.is_farmer && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold">🌾 Farmer</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => speak(`नमस्ते ${profile.name}। आपकी प्रोफाइल पर आपकी जानकारी और पात्र योजनाएं दिखाई गई हैं।`)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors" title="Voice Info">
              <Volume2 className="w-4 h-4" />
            </button>
            <button onClick={() => setEditing(true)}
              className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-extrabold text-xs rounded-xl flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={handleLogout}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
        {!profile.profile_complete && (
          <div className="relative z-10 mt-4 bg-amber-500/20 border border-amber-500/30 text-amber-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            ⚠️ प्रोफाइल अधूरी है। पूरी करने से ज्यादा योजनाएं मिलेंगी। Complete your profile to get more schemes.
          </div>
        )}
      </div>

      {/* Eligible Scheme Categories */}
      <div>
        <h2 className="text-lg font-extrabold text-govblue-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> आपकी पात्र योजना श्रेणियाँ (Eligible Categories)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {eligibleCategories.length > 0 ? eligibleCategories.map(cat => (
            <Link key={cat} href={`/?category=${cat}`}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all group">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-govblue-900 text-sm group-hover:text-saffron-600">{cat}</p>
                <p className="text-xs text-slate-500">योजनाएं देखें →</p>
              </div>
            </Link>
          )) : (
            <div className="col-span-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-sm text-amber-800">
              कृपया प्रोफाइल पूरी करें ताकि पात्र योजनाएं दिखाई जा सकें। Please complete your profile.
            </div>
          )}
          <Link href="/"
            className="bg-govblue-900 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all group">
            <FileText className="w-6 h-6 text-saffron-400 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-white text-sm">All Schemes</p>
              <p className="text-xs text-slate-400">सभी योजनाएं →</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div>
        <h2 className="text-lg font-extrabold text-govblue-900 mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-saffron-500" /> व्यक्तिगत जानकारी (Personal Info)
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: User, label: 'नाम (Name)', value: profile.name },
            { icon: MapPin, label: 'राज्य (State)', value: `${profile.state || '—'}${profile.district ? ', ' + profile.district : ''}` },
            { icon: Briefcase, label: 'पेशा (Occupation)', value: profile.occupation || '—' },
            { icon: IndianRupee, label: 'वार्षिक आय (Income)', value: profile.annual_income ? `₹${profile.annual_income.toLocaleString('en-IN')}` : '—' },
            { icon: Shield, label: 'श्रेणी (Category)', value: profile.category || '—' },
            { icon: User, label: 'आयु / लिंग', value: `${profile.age || '—'} वर्ष / ${profile.gender || '—'}` },
            { icon: Tractor, label: 'किसान हैं?', value: profile.is_farmer ? '✅ हाँ (Yes)' : '❌ नहीं (No)' },
            { icon: FileText, label: 'राशन कार्ड', value: profile.has_ration_card ? `✅ ${profile.ration_card_type || 'Yes'}` : '❌ नहीं' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
              <Icon className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-saffron-500 my-8 space-y-4">
            <h3 className="text-lg font-extrabold text-govblue-900">✏️ प्रोफाइल संपादित करें (Edit Profile)</h3>
            {[
              { key: 'name', label: 'नाम', type: 'text' },
              { key: 'age', label: 'आयु (Age)', type: 'number' },
              { key: 'state', label: 'राज्य (State)', type: 'text' },
              { key: 'district', label: 'जिला (District)', type: 'text' },
              { key: 'annual_income', label: 'वार्षिक आय ₹', type: 'number' },
              { key: 'occupation', label: 'पेशा (Occupation)', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-slate-700 mb-1">{f.label}</label>
                <input type={f.type} value={editForm[f.key] || ''} onChange={e => setEditForm(ef => ({ ...ef, [f.key]: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-sm">रद्द करें (Cancel)</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾'} सेव करें (Save)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
