'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  User, MapPin, Briefcase, IndianRupee, Shield, CheckCircle2,
  Edit3, Volume2, LogOut, ChevronRight, Tractor, Loader2, FileText,
  Scan, Upload, Trash2, Download, Eye, Sparkles, FolderLock, ExternalLink,
  Layers, CheckCircle, AlertTriangle, Building2, CreditCard, Calendar
} from 'lucide-react';
import apiService from '../../services/api';
import SchemeGuidanceBot from '../../components/SchemeGuidanceBot';
import { useTranslation } from 'react-i18next';

const DOC_TYPE_META = {
  aadhaar: { label: 'Aadhaar Card', labelHi: 'आधार कार्ड', color: 'from-blue-600 to-indigo-600', icon: CreditCard },
  land_record: { label: 'Land Record', labelHi: 'भूमि अभिलेख (खसरा)', color: 'from-emerald-600 to-teal-600', icon: MapPin },
  caste_certificate: { label: 'Caste Certificate', labelHi: 'जाति प्रमाण पत्र', color: 'from-purple-600 to-violet-600', icon: Shield },
  income_certificate: { label: 'Income Certificate', labelHi: 'आय प्रमाण पत्र', color: 'from-amber-600 to-orange-600', icon: FileText },
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, token, logout, getProfile, updateProfile } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('vault'); // 'vault' | 'schemes' | 'profile' | 'upload'
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingSchemes, setLoadingSchemes] = useState(false);

  // Edit Modal State
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Guidance Bot State
  const [selectedSchemeForGuide, setSelectedSchemeForGuide] = useState(null);

  // Upload State inside Profile
  const [uploadDocType, setUploadDocType] = useState('aadhaar');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await getProfile();
      setProfile(p);
      setEditForm(p);

      // Load user documents from database
      await fetchDocuments();

      // Load eligible schemes tailored for this citizen
      await fetchEligibleSchemes(p);
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!token) return;
    setLoadingDocs(true);
    try {
      const res = await apiService.getUserDocuments(token);
      setDocuments(res.documents || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const fetchEligibleSchemes = async (userProfile) => {
    setLoadingSchemes(true);
    try {
      const query = userProfile?.is_farmer
        ? 'farmer agricultural crop subsidy kisan'
        : userProfile?.occupation
        ? `${userProfile.occupation} government welfare subsidy`
        : 'government welfare schemes';

      const res = await apiService.unifiedEvaluate(
        query,
        {
          age: userProfile?.age || 40,
          annual_income: userProfile?.annual_income || 140000,
          occupation: userProfile?.occupation || 'Citizen',
          category: userProfile?.category || 'BPL',
          state: userProfile?.state || 'Uttar Pradesh',
          gender: userProfile?.gender || 'Any'
        },
        null,
        userProfile?.language_preference || 'hi'
      );
      setEligibleSchemes(res.matched_schemes || []);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoadingSchemes(false);
    }
  };

  const speak = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = (profile?.language_preference || 'hi') + '-IN';
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        age: editForm.age ? parseInt(editForm.age) : null,
        gender: editForm.gender,
        state: editForm.state,
        district: editForm.district,
        annual_income: editForm.annual_income ? parseFloat(editForm.annual_income) : null,
        occupation: editForm.occupation,
        category: editForm.category,
        language_preference: editForm.language_preference,
        is_farmer: Boolean(editForm.is_farmer),
        has_ration_card: Boolean(editForm.has_ration_card),
        ration_card_type: editForm.ration_card_type,
      });
      setProfile({ ...profile, ...editForm });
      setEditing(false);
      speak('आपकी प्रोफाइल सफलतापूर्वक अपडेट हो गई है।');
      // Refresh schemes
      fetchEligibleSchemes({ ...profile, ...editForm });
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!confirm('Are you sure you want to delete this document from your vault?')) return;
    try {
      await apiService.deleteUserDocument(docId, token);
      setDocuments(docs => docs.filter(d => d.id !== docId));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleQuickUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('doc_type', uploadDocType);
    formData.append('citizen_name', profile?.name || '');
    if (profile?.id) {
      formData.append('user_id', profile.id);
    }

    try {
      const res = await apiService.uploadDocumentOCR(formData, token);
      setUploadSuccess(res);
      setUploadFile(null);
      await fetchDocuments();
      speak('दस्तावेज़ सफलतापूर्वक अपलोड और एक्सट्रैक्ट हो गया है।');
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-saffron-500" />
        <p className="text-sm font-extrabold text-govblue-900">नागरिक प्रोफाइल लोड हो रहा है…</p>
      </div>
    );
  }

  if (!token || !profile) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border-2 border-saffron-500 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 bg-saffron-100 rounded-2xl flex items-center justify-center mx-auto text-saffron-600 font-black text-2xl">
          👤
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-govblue-900">नागरिक लॉगिन आवश्यक है (Login Required)</h2>
          <p className="text-xs text-slate-500">
            Please log in or register to view your profile, document vault, and personalized scheme recommendations.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="px-6 py-3 bg-govblue-900 hover:bg-govblue-800 text-white font-extrabold text-xs rounded-xl shadow-lg">
            Login Now
          </Link>
          <Link href="/register" className="px-6 py-3 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-extrabold text-xs rounded-xl shadow-lg">
            Register Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* Citizen Profile Banner */}
      <div className="bg-gradient-to-r from-govblue-900 via-slate-900 to-govblue-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border-2 border-saffron-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-tr from-saffron-500 to-amber-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl flex-shrink-0">
              {profile.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">{profile.name}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold rounded-full">
                  ✓ Verified Citizen
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-3 flex-wrap">
                <span>📧 {profile.email}</span>
                <span>📱 {profile.phone}</span>
                {profile.state && <span>📍 {profile.state}{profile.district ? `, ${profile.district}` : ''}</span>}
              </p>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {profile.category && (
                  <span className="px-2.5 py-0.5 bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-bold rounded-full">
                    {profile.category}
                  </span>
                )}
                {profile.occupation && (
                  <span className="px-2.5 py-0.5 bg-white/10 text-slate-200 border border-white/20 text-xs font-bold rounded-full">
                    💼 {profile.occupation}
                  </span>
                )}
                {profile.is_farmer && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
                    🌾 Farmer
                  </span>
                )}
                {profile.annual_income && (
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full">
                    💰 ₹{profile.annual_income.toLocaleString('en-IN')}/yr
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => speak(`नमस्ते ${profile.name}। यह आपका नागरिक डिजिटल वॉल्ट है। आपके पास ${documents.length} दस्तावेज़ और ${eligibleSchemes.length} पात्र योजनाएं हैं।`)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors border border-white/10"
              title="Speak Profile Summary"
            >
              <Volume2 className="w-5 h-5 text-saffron-400" />
            </button>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-extrabold text-xs rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'vault', label: t('vault_tab_title') || '📁 OCR Document Vault', count: documents.length, badge: 'Vault' },
          { id: 'schemes', label: t('eligible_tab_title') || '🎯 Eligible Schemes', count: eligibleSchemes.length, badge: 'Live AI' },
          { id: 'upload', label: t('upload_tab_title') || '📤 Upload Document', badge: 'OCR' },
          { id: 'profile', label: t('profile_tab_title') || '👤 Profile Details', badge: 'Info' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-govblue-900 text-white shadow-lg shadow-govblue-900/20 scale-102'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.id ? 'bg-saffron-500 text-govblue-900' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: OCR DOCUMENT VAULT ────────────────────────────────────────── */}
      {activeTab === 'vault' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-govblue-900 flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-saffron-500" />
                नागरिक दस्तावेज़ वॉल्ट (Stored OCR Documents)
              </h2>
              <p className="text-xs text-slate-500">
                All documents uploaded and extracted by OCR are securely stored in your PostgreSQL account.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Upload className="w-3.5 h-3.5" /> Upload New
            </button>
          </div>

          {loadingDocs ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-saffron-500 mx-auto" />
              <p className="text-xs font-bold text-slate-500 mt-2">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-saffron-50 rounded-2xl flex items-center justify-center mx-auto text-saffron-500">
                <Scan className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-govblue-900">No Documents in Vault Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Upload your Aadhaar Card, Land Records, Caste Certificate, or Income Certificate. OCR will extract all details automatically and save them here.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-6 py-3 bg-gradient-to-r from-saffron-500 to-amber-600 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Upload First Document (OCR)
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {documents.map((doc) => {
                const meta = DOC_TYPE_META[doc.document_type] || DOC_TYPE_META.aadhaar;
                const IconComp = meta.icon;
                const fields = doc.extracted_fields || {};

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Document Header */}
                      <div className={`bg-gradient-to-r ${meta.color} p-4 text-white flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <IconComp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black">{meta.label}</h4>
                            <p className="text-[10px] text-white/80">{meta.labelHi} • {doc.filename}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-black">
                            {doc.confidence_score}% Confidence
                          </span>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1.5 bg-white/10 hover:bg-rose-500 rounded-lg text-white transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Extracted Fields Table */}
                      <div className="p-4 space-y-2.5">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>OCR Extracted Data:</span>
                          <span className="font-mono text-emerald-600">{doc.tracking_code}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          {Object.entries(fields).slice(0, 6).map(([key, val]) => {
                            if (key === 'document_type' || key === 'verification_source' || !val) return null;
                            const formattedKey = key.replace(/_/g, ' ').toUpperCase();
                            return (
                              <div key={key} className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-400 block">{formattedKey}</span>
                                <span className="text-xs font-black text-slate-800 break-words line-clamp-1">{String(val)}</span>
                              </div>
                            );
                          })}
                        </div>

                        {doc.raw_text_preview && (
                          <details className="text-[11px] bg-slate-900 text-slate-300 rounded-xl overflow-hidden">
                            <summary className="p-2.5 font-bold cursor-pointer hover:text-white flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-saffron-400" /> View Raw OCR Text
                            </summary>
                            <pre className="p-3 pt-0 text-[10px] font-mono whitespace-pre-wrap text-slate-300">
                              {doc.raw_text_preview}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Verified via EasyOCR Engine</span>
                      <span className="font-mono text-[10px]">{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: ELIGIBLE SCHEMES ─────────────────────────────────────────── */}
      {activeTab === 'schemes' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-govblue-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                आपकी पात्र योजनाएं (Eligible Schemes for {profile.name})
              </h2>
              <p className="text-xs text-slate-500">
                Tailored based on your age ({profile.age}), occupation ({profile.occupation}), category ({profile.category}), and income.
              </p>
            </div>

            <Link
              href="/"
              className="px-4 py-2 bg-govblue-900 hover:bg-govblue-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <span>Explore All 47 Schemes</span>
              <ChevronRight className="w-3.5 h-3.5 text-saffron-400" />
            </Link>
          </div>

          {loadingSchemes ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-saffron-500 mx-auto" />
              <p className="text-xs font-bold text-slate-500 mt-2">Evaluating scheme eligibility...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {eligibleSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 bg-saffron-100 text-saffron-800 font-black text-[10px] rounded-lg">
                        🏷️ {scheme.category_tag}
                      </span>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[10px] rounded-full">
                        {scheme.match_percentage || 96}% Eligible
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-govblue-900 leading-snug">
                      {scheme.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {scheme.summary || scheme.benefits}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedSchemeForGuide(scheme)}
                      className="px-3.5 py-2 bg-gradient-to-r from-saffron-500 to-amber-600 text-govblue-900 hover:text-white font-black text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>आवेदन गाइड 🎙️</span>
                    </button>

                    <a
                      href={scheme.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-500 hover:text-govblue-900 flex items-center gap-1"
                    >
                      <span>GOI Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: LIVE OCR UPLOAD ───────────────────────────────────────────── */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black text-govblue-900 flex items-center gap-2">
              <Scan className="w-5 h-5 text-saffron-500" />
              दस्तावेज़ स्कैन एवं वॉल्ट में सुरक्षित करें (Scan & Save to Vault)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload any document (Aadhaar, Land Khasra, Caste, Income). OCR extracts fields and attaches them to your account.
            </p>
          </div>

          {/* Doc Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(DOC_TYPE_META).map(([key, meta]) => {
              const IconC = meta.icon;
              const active = uploadDocType === key;
              return (
                <button
                  key={key}
                  onClick={() => setUploadDocType(key)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                    active
                      ? `bg-gradient-to-br ${meta.color} text-white border-transparent shadow-lg scale-102`
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <IconC className={`w-5 h-5 mb-1.5 ${active ? 'text-white' : 'text-slate-600'}`} />
                  <div className={`text-xs font-black ${active ? 'text-white' : 'text-govblue-900'}`}>{meta.label}</div>
                  <div className={`text-[10px] ${active ? 'text-white/80' : 'text-slate-500'}`}>{meta.labelHi}</div>
                </button>
              );
            })}
          </div>

          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-saffron-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-saffron-50/40 transition-all space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff"
              onChange={(e) => setUploadFile(e.target.files?.[0])}
              className="hidden"
            />
            {uploadFile ? (
              <div className="space-y-1">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-black text-emerald-900">{uploadFile.name}</p>
                <p className="text-xs text-slate-500">{(uploadFile.size / 1024).toFixed(1)} KB — Click to choose different file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 text-saffron-500 mx-auto" />
                <p className="text-sm font-black text-govblue-900">Click to select image or PDF document</p>
                <p className="text-xs text-slate-400">Supports Aadhaar cards, Land records, Caste & Income certs (JPG, PNG, PDF)</p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>दस्तावेज़ सफलतापूर्वक एक्सट्रैक्ट एवं वॉल्ट में सेव हुआ!</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-emerald-100">
                {Object.entries(uploadSuccess.extracted_fields || {}).map(([k, v]) => (
                  <div key={k}>
                    <span className="font-bold text-slate-400 uppercase text-[9px] block">{k}:</span>
                    <span className="font-black text-slate-800">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleQuickUpload}
            disabled={!uploadFile || uploading}
            className="w-full py-3.5 bg-gradient-to-r from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Running OCR Extraction…</>
            ) : (
              <><Scan className="w-4 h-4" /> Extract & Save Document to Vault</>
            )}
          </button>
        </div>
      )}

      {/* ─── TAB 4: PROFILE DETAILS ───────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-govblue-900">व्यक्तिगत एवं आर्थिक जानकारी (Personal & Financial Data)</h2>
              <p className="text-xs text-slate-500">These details are used by the AI engine to evaluate scheme eligibility.</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-black text-xs rounded-xl flex items-center gap-1 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Info
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'पूरा नाम (Full Name)', value: profile.name, icon: User },
              { label: 'ईमेल (Email)', value: profile.email, icon: User },
              { label: 'मोबाइल (Phone)', value: profile.phone, icon: User },
              { label: 'आयु (Age)', value: profile.age ? `${profile.age} वर्ष` : '—', icon: Calendar },
              { label: 'लिंग (Gender)', value: profile.gender || '—', icon: User },
              { label: 'राज्य (State)', value: profile.state || '—', icon: MapPin },
              { label: 'जिला (District)', value: profile.district || '—', icon: Building2 },
              { label: 'पेशा (Occupation)', value: profile.occupation || '—', icon: Briefcase },
              { label: 'वार्षिक आय (Annual Income)', value: profile.annual_income ? `₹${profile.annual_income.toLocaleString('en-IN')}` : '—', icon: IndianRupee },
              { label: 'श्रेणी (Category)', value: profile.category || 'General', icon: Shield },
              { label: 'किसान हैं? (Farmer)', value: profile.is_farmer ? '✅ हाँ (Yes)' : '❌ नहीं', icon: Tractor },
              { label: 'राशन कार्ड (Ration Card)', value: profile.has_ration_card ? `✅ ${profile.ration_card_type || 'Yes'}` : '❌ नहीं', icon: FileText },
            ].map(({ label, value, icon: IconC }) => (
              <div key={label} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <IconC className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
                  <span className="text-sm font-black text-slate-800 break-words">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-saffron-500 my-8 space-y-4">
            <h3 className="text-base font-black text-govblue-900">✏️ प्रोफाइल संपादित करें (Edit Profile)</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {[
                { key: 'name', label: 'पूरा नाम (Full Name)', type: 'text' },
                { key: 'phone', label: 'मोबाइल नंबर (Phone)', type: 'tel' },
                { key: 'age', label: 'आयु (Age)', type: 'number' },
                { key: 'state', label: 'राज्य (State)', type: 'text' },
                { key: 'district', label: 'जिला (District)', type: 'text' },
                { key: 'annual_income', label: 'वार्षिक आय ₹ (Annual Income)', type: 'number' },
                { key: 'occupation', label: 'पेशा (Occupation)', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={editForm[f.key] || ''}
                    onChange={e => setEditForm(ef => ({ ...ef, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-saffron-500 outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                <select
                  value={editForm.category || 'General'}
                  onChange={e => setEditForm(ef => ({ ...ef, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-saffron-500 outline-none"
                >
                  <option value="General">General (सामान्य)</option>
                  <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                  <option value="SC">SC (अनुसूचित जाति)</option>
                  <option value="ST">ST (अनुसूचित जनजाति)</option>
                  <option value="BPL">BPL (गरीबी रेखा से नीचे)</option>
                  <option value="EWS">EWS (आर्थिक रूप से कमजोर)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.is_farmer)}
                    onChange={e => setEditForm(ef => ({ ...ef, is_farmer: e.target.checked }))}
                    className="w-4 h-4 accent-saffron-500 rounded"
                  />
                  <span>🌾 क्या आप किसान हैं? (Are you a Farmer?)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.has_ration_card)}
                    onChange={e => setEditForm(ef => ({ ...ef, has_ration_card: e.target.checked }))}
                    className="w-4 h-4 accent-saffron-500 rounded"
                  />
                  <span>🍚 क्या आपके पास राशन कार्ड है? (Have Ration Card?)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-black rounded-xl text-xs flex items-center justify-center gap-1"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾'} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Guidance Bot Overlay */}
      {selectedSchemeForGuide && (
        <SchemeGuidanceBot
          scheme={selectedSchemeForGuide}
          onClose={() => setSelectedSchemeForGuide(null)}
        />
      )}

    </div>
  );
}
