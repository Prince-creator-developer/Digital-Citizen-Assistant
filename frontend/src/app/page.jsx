'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Mic, Sparkles, Filter, Users, Heart, GraduationCap, Award, Tractor, ShieldCheck, Zap } from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import apiService from '../services/api';

export default function Home() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [searchMeta, setSearchMeta] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSearch = params.get('search');
      const urlCategory = params.get('category');
      if (urlCategory) {
        setSelectedCategory(urlCategory);
      }
      if (urlSearch) {
        setSearchQuery(urlSearch);
        fetchSchemes(urlSearch);
        return;
      }
    }
    fetchSchemes();
  }, [selectedCategory]);

  const fetchSchemes = async (queryText = searchQuery, category = selectedCategory) => {
    setLoading(true);
    try {
      const isSpecificQuery = Boolean(queryText && queryText.trim().length > 0);
      const categoryParam = isSpecificQuery ? null : (category === 'ALL' ? null : category);

      // Use category-specific query text for better results if no specific search query
      const categoryQueries = {
        'Farmers': 'agricultural farmer crop income subsidy irrigation',
        'Elders': 'senior citizen old age pension elderly welfare assistance',
        'Children': 'child education scholarship girl savings meal school',
        'BPL': 'below poverty line BPL ration food housing employment insurance',
        'Women': 'women maternity health empowerment entrepreneurship welfare',
        'Artisans': 'artisan craftsperson handicraft weaver skill toolkit loan',
      };

      const effectiveQuery = isSpecificQuery
        ? queryText.trim()
        : (categoryParam ? categoryQueries[categoryParam] : 'government welfare schemes for Indian citizens');

      const res = await apiService.unifiedEvaluate(effectiveQuery, {
        age: 42,
        annual_income: 140000,
        occupation: categoryParam === 'Farmers' ? 'Farmer' : categoryParam === 'Artisans' ? 'Artisan' : 'Citizen',
        category: 'BPL',
        state: 'Uttar Pradesh',
        gender: categoryParam === 'Women' ? 'Female' : 'Any',
      }, categoryParam);

      setSchemes(res.matched_schemes || []);
      setSearchMeta({
        latency: res.latency_ms,
        vectorLatency: res.vector_search_latency_ms,
        filterApplied: res.category_filter_applied,
        sources: res.live_web_sources
      });
    } catch (err) {
      console.warn('Error in fetchSchemes, using fallback:', err);
      const fallbackRes = await apiService.getSchemes(selectedCategory);
      setSchemes(Array.isArray(fallbackRes) ? fallbackRes : []);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSelectedCategory('ALL');
    fetchSchemes(searchQuery, 'ALL');
  };

  const categoryPills = [
    { id: 'ALL', label: t('category_all'), icon: Filter },
    { id: 'Farmers', label: t('category_farmers'), icon: Tractor },
    { id: 'Elders', label: t('category_elders'), icon: Users },
    { id: 'Children', label: t('category_children'), icon: GraduationCap },
    { id: 'BPL', label: t('category_bpl'), icon: ShieldCheck },
    { id: 'Women', label: t('category_women'), icon: Heart },
    { id: 'Artisans', label: t('category_artisans'), icon: Award },
  ];

  return (
    <div className="space-y-8">
      
      {/* Voice-First Hero Banner */}
      <section className="bg-gradient-to-r from-govblue-900 via-slate-900 to-govblue-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border-2 border-saffron-500/30">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-saffron-500/20 text-saffron-300 text-xs font-bold rounded-full border border-saffron-500/30">
            <Sparkles className="w-4 h-4 text-saffron-400" />
            <span>{t('hero_badge')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t('hero_title')}
          </h2>
          
          <p className="text-sm text-slate-300">
            {t('hero_subtitle')}
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-saffron-500/50 outline-none shadow-lg"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-3.5 bg-saffron-500 hover:bg-saffron-600 text-govblue-900 font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                {t('search_btn')}
              </button>
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center gap-1.5"
              >
                <Mic className="w-5 h-5 animate-pulse" />
                <span>{t('voice_btn_text')}</span>
              </button>
            </div>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400">{t('quick_search_label')}</span>
            {[
              { label: t('quick_chip_1'), query: "Show all eligible schemes for me" },
              { label: t('quick_chip_2'), query: "Farmer crop & income subsidy" },
              { label: t('quick_chip_3'), query: "Old age pension for senior citizens" },
              { label: t('quick_chip_4'), query: "BPL free ration food grains" },
              { label: t('quick_chip_5'), query: "Sukanya girl child savings" }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setSearchQuery(chip.label); fetchSchemes(chip.query); }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {categoryPills.map((pill) => {
          const IconComp = pill.icon;
          const active = selectedCategory === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setSelectedCategory(pill.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap border ${
                active
                  ? 'bg-govblue-900 text-white border-govblue-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <IconComp className={`w-4 h-4 ${active ? 'text-saffron-500' : 'text-slate-500'}`} />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </section>

      {/* Performance Latency Bar */}
      {searchMeta && (
        <div className="bg-slate-900 text-slate-300 px-5 py-3 rounded-2xl border border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Zap className="w-4 h-4" /> Latency: {searchMeta.latency} ms
            </span>
            <span>Vector Match: {searchMeta.vectorLatency} ms</span>
            <span className="text-saffron-400">Filter: {searchMeta.filterApplied}</span>
          </div>

          <span className="text-slate-400">{t('api_engine_active')}</span>
        </div>
      )}

      {/* Schemes Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-govblue-900 flex items-center gap-2">
            {t('targeted_schemes')} ({schemes.length})
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {t('vector_active')}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </section>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptReceived={(text) => {
          setSearchQuery(text);
          setSelectedCategory('ALL');
          fetchSchemes(text, 'ALL');
          setIsVoiceOpen(false);
        }}
      />

    </div>
  );
}
