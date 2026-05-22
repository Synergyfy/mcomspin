'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function LandingPage() {
  /* ─── State ─── */
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeResult, setPrizeResult] = useState<string | null>(null);
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);
  const [probValue, setProbValue] = useState(65);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Intersection observer for scroll-reveal */
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const sectionClass = (id: string) =>
    visibleSections.has(id)
      ? 'opacity-100 translate-y-0 transition-all duration-[900ms] ease-out'
      : 'opacity-0 translate-y-8 transition-all duration-[900ms] ease-out';

  /* ─── Teaser wheel data ─── */
  const teaserPrizes: { labelTop: string; labelBottom: string; icon: string }[] = [
    { labelTop: 'LEADS', labelBottom: 'CAPTURED', icon: 'users' },
    { labelTop: 'STOCK', labelBottom: 'CLEARED', icon: 'box' },
    { labelTop: 'SLOTS', labelBottom: 'BOOKED', icon: 'clock' },
    { labelTop: 'TRAFFIC', labelBottom: 'ROUTED', icon: 'route' },
    { labelTop: 'REVENUE', labelBottom: 'EARNED', icon: 'dollar' },
    { labelTop: 'VOUCHER', labelBottom: 'ISSUED', icon: 'ticket' },
  ];

  /* ─── Partner rotation data ─── */
  const partners = [
    { name: 'Meridian Apparel', category: 'Luxury Fashion & Excess Stock', leads: 412, conversion: '18.4%', revenue: '$32,490' },
    { name: 'Elara Wellness', category: 'Premium Spa & Booking Services', leads: 589, conversion: '22.1%', revenue: '$45,800' },
    { name: 'Vantage Electronics', category: 'Consumer Tech & Voucher Programs', leads: 304, conversion: '14.8%', revenue: '$21,900' },
    { name: 'Soleil Dining Group', category: 'Hospitality & Experience Packages', leads: 622, conversion: '26.3%', revenue: '$62,700' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePartnerIndex((prev) => (prev + 1) % partners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  /* ─── Teaser spin handler ─── */
  const handleTeaserSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrizeResult(null);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const sectorAngle = 60;
    const targetSectorIndex = Math.floor(Math.random() * 6);
    const targetAngle = extraSpins * 360 + (360 - targetSectorIndex * sectorAngle);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const outcomes = [
        'Lead captured and routed to Meridian Apparel CRM — 120 new prospects queued',
        'Inventory clearance triggered — 45 surplus items moved through Vantage Electronics',
        'High-value booking slot reserved — Elara Wellness timetable updated',
        'Customer session redirected — storefront traffic routed to Meridian Apparel',
        'Partner collaboration verified — $2,400 in B2B ecosystem revenue recorded',
        'Digital voucher allocated and logged — partner ledger updated automatically',
      ];
      setPrizeResult(outcomes[targetSectorIndex]);
    }, 4500);
  };

  /* ─── Icon helper ─── */
  const getIcon = (type: string) => {
    const cls = "w-4 h-4";
    switch (type) {
      case 'users':
        return (<svg className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>);
      case 'box':
        return (<svg className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);
      case 'clock':
        return (<svg className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
      case 'route':
        return (<svg className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>);
      case 'dollar':
        return (<svg className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
      case 'ticket':
        return (<svg className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#f97316] selection:text-white relative overflow-hidden font-body">

      {/* ═══════════════════════════════════════════════════
          AMBIENT BACKGROUND GLOWS
      ═══════════════════════════════════════════════════ */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#f97316]/[0.04] rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#f97316]/[0.03] rounded-full blur-[180px] pointer-events-none" />

      {/* ═══════════════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-[#e8e8e5]/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#f97316] rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)]" />
            <span className="font-display font-bold text-lg tracking-tight text-[#1a1a1a]">MComSpin</span>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#888]">
            <a href="#how-it-works" className="hover:text-[#f97316] transition-colors duration-200">How It Works</a>
            <a href="#engine" className="hover:text-[#f97316] transition-colors duration-200">Engine</a>
            <a href="#partners" className="hover:text-[#f97316] transition-colors duration-200">Partners</a>
            <a href="#embed" className="hover:text-[#f97316] transition-colors duration-200">Embed</a>
            <a href="#analytics" className="hover:text-[#f97316] transition-colors duration-200">Analytics</a>
            <Link href="/customer" className="text-[#f97316] font-bold hover:text-orange-600 transition-colors duration-200 flex items-center gap-1">
              Customer Hub
              <span className="text-[9px] bg-orange-100 text-[#f97316] px-1.5 py-0.5 rounded font-extrabold tracking-normal">NEW</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth" className="hidden sm:inline-flex text-[11px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] hover:text-[#f97316] transition-colors">
              Sign In
            </Link>
            <Link href="/auth" className="text-[11px] font-bold tracking-[0.12em] bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full hover:bg-[#f97316] transition-all duration-300 uppercase">
              Get Started
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e8e8e5] bg-white px-6 py-4 space-y-3">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#555] hover:text-[#f97316]">How It Works</a>
            <a href="#engine" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#555] hover:text-[#f97316]">Engine</a>
            <a href="#partners" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#555] hover:text-[#f97316]">Partners</a>
            <a href="#embed" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#555] hover:text-[#f97316]">Embed</a>
            <a href="#analytics" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#555] hover:text-[#f97316]">Analytics</a>
            <Link href="/customer" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-bold text-[#f97316] hover:text-orange-600 transition-colors">
              Customer Hub (Premium Flow) <Zap className="w-3.5 h-3.5 fill-[#f97316] text-[#f97316]" />
            </Link>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={setSectionRef('hero')}
        className={`px-6 lg:px-12 pt-24 pb-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 ${sectionClass('hero')}`}
      >
        {/* Left — Copy */}
        <div className="flex flex-col items-start space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f97316]/[0.07] border border-[#f97316]/[0.12]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Engagement Infrastructure</span>
          </div>

          <h1 className="text-[2.75rem] lg:text-[3.75rem] font-display font-black tracking-[-0.025em] leading-[1.08] luxury-text-gradient">
            Turn Controlled Engagement Into Predictable Revenue
          </h1>

          <p className="text-[#666] text-[15px] lg:text-base leading-[1.75] max-w-lg">
            MComSpin is a business engagement and monetization platform. Embed controlled gamification into your commerce environment to automate lead capture, distribute rewards intelligently, and build collaborative partner ecosystems — all from a single infrastructure layer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/play" className="flex items-center justify-center text-[11px] font-bold tracking-[0.15em] bg-[#f97316] text-white px-8 py-4 rounded-full hover:bg-[#ea580c] hover:shadow-lg hover:shadow-[#f97316]/20 transition-all duration-300 uppercase">
              See It In Action
            </Link>
            <a href="#how-it-works" className="flex items-center justify-center text-[11px] font-bold tracking-[0.15em] border border-[#e0e0e0] bg-white text-[#1a1a1a] px-8 py-4 rounded-full hover:border-[#f97316]/30 hover:bg-[#fefcfa] transition-all duration-300 uppercase">
              Explore Platform
            </a>
          </div>

          {/* Trust metrics */}
          <div className="grid grid-cols-3 gap-10 pt-10 border-t border-[#eee] w-full">
            <div>
              <p className="text-2xl lg:text-3xl font-black font-display text-[#1a1a1a]">100%</p>
              <p className="text-[10px] text-[#999] font-semibold mt-1.5 uppercase tracking-[0.12em] leading-snug">Automated<br />Lead Routing</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black font-display text-[#1a1a1a]">Weekly</p>
              <p className="text-[10px] text-[#999] font-semibold mt-1.5 uppercase tracking-[0.12em] leading-snug">Partner<br />Spotlight Cycles</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black font-display text-[#1a1a1a]">86%</p>
              <p className="text-[10px] text-[#999] font-semibold mt-1.5 uppercase tracking-[0.12em] leading-snug">Inventory<br />Clearance Rate</p>
            </div>
          </div>
        </div>

        {/* Right — Interactive Micro-Demo Wheel */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Background ecosystem cards */}
          <div className="absolute -top-4 -left-4 z-20 bg-white border border-[#eee] shadow-lg shadow-black/[0.04] p-3.5 rounded-xl flex items-center gap-3 select-none pointer-events-none animate-luxury-float">
            <div className="w-2 h-2 rounded-full bg-[#f97316]" />
            <div>
              <span className="text-[8px] font-bold text-[#aaa] uppercase tracking-[0.12em] block">Lead Velocity</span>
              <span className="text-[11px] font-extrabold text-[#1a1a1a]">+18.4% this week</span>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 z-20 bg-white border border-[#eee] shadow-lg shadow-black/[0.04] p-3.5 rounded-xl flex items-center gap-3 select-none pointer-events-none animate-luxury-float" style={{ animationDelay: '3s' }}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-[8px] font-bold text-[#aaa] uppercase tracking-[0.12em] block">Routing Queue</span>
              <span className="text-[11px] font-extrabold text-[#1a1a1a]">3 partners active</span>
            </div>
          </div>

          {/* Wheel container */}
          <div className="w-full max-w-[420px] p-7 rounded-2xl border border-[#e8e8e5] bg-white shadow-xl shadow-black/[0.04] relative z-10">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#f97316]/20 rounded-tl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#f97316]/20 rounded-br-2xl pointer-events-none" />

            <div className="text-center mb-5">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#aaa] uppercase">Interactive Demo</span>
              <h3 className="text-sm font-display font-extrabold mt-1 text-[#1a1a1a]">Controlled Engagement Preview</h3>
            </div>

            {/* Spinner */}
            <div className="relative w-[260px] h-[260px] mx-auto flex items-center justify-center select-none">
              {/* Outer subtle ring */}
              <div className="absolute inset-0 rounded-full border border-[#eee] bg-[#fafaf9]" />

              {/* Watch-face ticks */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 animate-[spin_180s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#eee" strokeWidth="0.15" />
                {Array.from({ length: 60 }).map((_, idx) => {
                  const angle = idx * 6;
                  const isMajor = idx % 5 === 0;
                  const isSector = idx % 10 === 0;
                  const r1 = isMajor ? (isSector ? 44.5 : 45.2) : 46;
                  const r2 = 48;
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line
                      key={idx}
                      x1={50 + r1 * Math.cos(rad)}
                      y1={50 + r1 * Math.sin(rad)}
                      x2={50 + r2 * Math.cos(rad)}
                      y2={50 + r2 * Math.sin(rad)}
                      stroke={isSector ? '#f97316' : isMajor ? '#999' : '#ddd'}
                      strokeWidth={isSector ? '0.4' : isMajor ? '0.25' : '0.15'}
                    />
                  );
                })}
              </svg>

              {/* Pointer */}
              <div className="absolute -top-[14px] z-30 flex flex-col items-center pointer-events-none drop-shadow-md">
                <div className="w-3.5 h-1 bg-[#1a1a1a] rounded-t-sm" />
                <svg width="14" height="24" viewBox="0 0 18 30" fill="none">
                  <path d="M9 28L1 1L17 1L9 28Z" fill="#1a1a1a" />
                  <path d="M9 22L3.5 3L14.5 3L9 22Z" fill="#f97316" />
                  <circle cx="9" cy="3" r="1" fill="white" />
                </svg>
              </div>

              {/* Inner bezel + spinning dial */}
              <div className="relative w-[215px] h-[215px] rounded-full bg-white border-[3px] border-[#1a1a1a] shadow-[0_6px_20px_rgba(0,0,0,0.06),inset_0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center z-10 overflow-hidden">
                <div
                  className="w-full h-full rounded-full overflow-hidden transition-transform ease-out relative"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: isSpinning ? '4.5s' : '0s',
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <defs>
                      <radialGradient id="lw" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="100%" stopColor="#f5f5f0" />
                      </radialGradient>
                      <radialGradient id="dw" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#2a2a2a" />
                        <stop offset="100%" stopColor="#161616" />
                      </radialGradient>
                    </defs>
                    <path d="M50,50 L50,0 A50,50 0 0,1 93.3,25 Z" fill="url(#lw)" stroke="#eee" strokeWidth="0.3" />
                    <path d="M50,50 L93.3,25 A50,50 0 0,1 93.3,75 Z" fill="url(#dw)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                    <path d="M50,50 L93.3,75 A50,50 0 0,1 50,100 Z" fill="url(#lw)" stroke="#eee" strokeWidth="0.3" />
                    <path d="M50,50 L50,100 A50,50 0 0,1 6.7,75 Z" fill="url(#dw)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                    <path d="M50,50 L6.7,75 A50,50 0 0,1 6.7,25 Z" fill="url(#lw)" stroke="#eee" strokeWidth="0.3" />
                    <path d="M50,50 L6.7,25 A50,50 0 0,1 50,0 Z" fill="url(#dw)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                  </svg>

                  {teaserPrizes.map((prize, idx) => {
                    const labelAngle = idx * 60 + 30;
                    const isDark = idx % 2 === 1;
                    return (
                      <div
                        key={idx}
                        className="absolute top-0 left-1/2 h-1/2 origin-bottom -translate-x-1/2 flex flex-col items-center justify-start pt-4 select-none"
                        style={{ transform: `rotate(${labelAngle}deg)`, width: '65px' }}
                      >
                        <div className={`p-1.5 rounded-full border shadow-sm mb-1 ${isDark ? 'bg-[#1a1a1a] border-white/10 text-[#ffa15f]' : 'bg-[#fafaf9] border-[#eee] text-[#f97316]'}`}>
                          {getIcon(prize.icon)}
                        </div>
                        <span className={`text-[7px] font-black tracking-[0.06em] text-center uppercase leading-tight ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                          {prize.labelTop}
                        </span>
                        <span className={`w-3 h-[1px] my-0.5 ${isDark ? 'bg-white/15' : 'bg-[#ddd]'}`} />
                        <span className={`text-[5px] font-black tracking-[0.15em] text-center uppercase ${isDark ? 'text-[#ffa15f]' : 'text-[#f97316]'}`}>
                          {prize.labelBottom}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sapphire glass */}
                <div className="absolute inset-0 rounded-full pointer-events-none z-[15] bg-gradient-to-tr from-transparent via-white/[0.06] to-white/[0.15]" />

                {/* Center hub */}
                <div className="absolute w-11 h-11 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] flex items-center justify-center border-[3px] border-[#1a1a1a] z-20">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-stone-50 to-stone-200 border border-stone-300 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-[#1a1a1a] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full shadow-[0_0_6px_#f97316] animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spin button */}
            <div className="mt-5 flex flex-col items-center w-full">
              <button
                onClick={handleTeaserSpin}
                disabled={isSpinning}
                className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl font-bold tracking-[0.12em] text-[11px] uppercase transition-all duration-300 disabled:bg-[#aaa] disabled:cursor-not-allowed shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSpinning ? 'Processing...' : 'Activate Engagement Demo'}
                {!isSpinning && (
                  <svg className="w-3.5 h-3.5 text-[#f97316] group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              <div className="w-full mt-4 min-h-[48px] flex items-center justify-center">
                {prizeResult ? (
                  <div className="text-center p-3.5 rounded-xl bg-[#f97316]/[0.06] border border-[#f97316]/[0.12] w-full animate-fade-in-up">
                    <p className="text-[9px] uppercase font-bold tracking-[0.15em] text-[#f97316]">Ecosystem Event Recorded</p>
                    <p className="text-xs font-semibold mt-1 text-[#1a1a1a] leading-relaxed">{prizeResult}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#aaa] text-center leading-relaxed">
                    {isSpinning ? 'Evaluating active partner allocations...' : 'Outcomes are determined by backend probability weights, not chance.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — THE PROBLEM
      ═══════════════════════════════════════════════════ */}
      <section
        id="problem"
        ref={setSectionRef('problem')}
        className={`py-28 px-6 lg:px-12 bg-[#fafaf9] border-y border-[#eee] ${sectionClass('problem')}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">The Growth Bottleneck</span>
            <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.02em] text-[#1a1a1a] leading-tight">
              Traditional Marketing Leaves Revenue on the Table
            </h2>
            <p className="text-[#777] text-[15px] leading-[1.75]">
              Businesses pour capital into disconnected campaigns, static loyalty programs, and isolated storefronts. The result: low conversion, wasted inventory, and zero collaboration between complementary brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Wasted Capacity',
                desc: 'Unused booking slots, quiet retail hours, and surplus stock cost businesses thousands every week. Legacy tools cannot redistribute these assets dynamically to meet real-time demand.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>,
              },
              {
                title: 'High-Friction Lead Capture',
                desc: 'Customers skip cold sign-up forms and generic newsletters. Without an immediate value exchange, prospects stay anonymous — and acquisition costs keep climbing.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
              },
              {
                title: 'Siloed Partnerships',
                desc: 'Local businesses spend marketing budgets independently, competing for the same audience. They share customers but never share infrastructure, traffic, or lead intelligence.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.128a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-[#eee] shadow-sm hover:shadow-md hover:translate-y-[-3px] transition-all duration-300 space-y-5">
                <div className="w-10 h-10 rounded-xl bg-[#f97316]/[0.08] flex items-center justify-center text-[#f97316]">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold font-display text-[#1a1a1a] uppercase tracking-[0.08em]">{item.title}</h3>
                <p className="text-[#888] text-[13px] leading-[1.7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={setSectionRef('how-it-works')}
        className={`py-28 px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-16 ${sectionClass('how-it-works')}`}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Platform Architecture</span>
          <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.02em] text-[#1a1a1a] leading-tight">
            Six Steps From Asset to Revenue
          </h2>
          <p className="text-[#777] text-[15px] leading-[1.75]">
            A unified commerce pipeline that ingests merchant assets, activates customer engagement, and distributes qualified opportunities across your entire partner network.
          </p>
        </div>

        <div className="relative p-6 lg:p-10 border border-[#eee] rounded-2xl bg-[#fafaf9]/50 overflow-hidden">
          {/* Flow line */}
          <div className="absolute inset-0 z-0 pointer-events-none hidden md:flex items-center">
            <svg width="100%" height="4" className="mx-16">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="#f97316" strokeOpacity="0.15" strokeWidth="2" className="animate-flow-dash" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 relative z-10">
            {[
              { step: '01', title: 'Contribute', desc: 'Businesses pool stock, booking slots, and promotional assets into the shared network.' },
              { step: '02', title: 'Structure', desc: 'Assets are organized into weighted reward tiers inside the centralized engine.' },
              { step: '03', title: 'Calibrate', desc: 'Administrators configure probability weights, frequency caps, and distribution rules.' },
              { step: '04', title: 'Engage', desc: 'Customers interact through embedded storefront widgets and controlled engagement loops.' },
              { step: '05', title: 'Route', desc: 'Captured leads and qualified prospects are automatically routed to the right partner.' },
              { step: '06', title: 'Convert', desc: 'Revenue is recorded, partner payouts are verified, and the cycle begins again.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-[#eee] shadow-sm flex flex-col items-center text-center min-h-[165px] hover:shadow-md transition-shadow">
                <span className="text-[10px] font-extrabold text-[#f97316] mb-3">{item.step}</span>
                <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-[0.1em] mb-2">{item.title}</h4>
                <p className="text-[11px] text-[#999] leading-[1.6]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — GAMIFICATION ENGINE
      ═══════════════════════════════════════════════════ */}
      <section
        id="engine"
        ref={setSectionRef('engine')}
        className={`py-28 px-6 lg:px-12 bg-[#fafaf9] border-y border-[#eee] ${sectionClass('engine')}`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-7">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Probability Engine</span>
            <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.02em] text-[#1a1a1a] leading-tight">
              Complete Control Over Every Outcome
            </h2>
            <p className="text-[#777] text-[15px] leading-[1.75]">
              This is not random. MComSpin gives network administrators sovereign control over outcome probabilities. Adjust reward frequency, weight featured partners, set engagement caps, and fine-tune distribution logic — all through a real-time administrative console.
            </p>

            {/* Interactive slider */}
            <div className="space-y-4 bg-white p-6 rounded-xl border border-[#eee] shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.1em] uppercase">
                <span className="text-[#1a1a1a]">Spotlight Priority Weight</span>
                <span className="text-[#f97316]">{probValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={probValue}
                onChange={(e) => setProbValue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#f97316]"
              />
              <div className="flex justify-between text-[9px] text-[#aaa] uppercase tracking-[0.1em] font-bold">
                <span>Balanced</span>
                <span>Medium</span>
                <span>Maximum</span>
              </div>
            </div>
          </div>

          {/* Right — Config panel mockup */}
          <div>
            <div className="bg-white p-7 rounded-2xl border border-[#eee] shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-[#eee] pb-4">
                <div>
                  <h3 className="text-sm font-bold font-display text-[#1a1a1a] uppercase tracking-[0.06em]">Probability Configuration</h3>
                  <p className="text-[10px] text-[#aaa] mt-0.5">Live outcome allocations across reward pool</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'Gift Voucher Distribution', weight: '15%', featured: false },
                  { label: 'Lead Routing Dispatch', weight: `${probValue}%`, featured: true },
                  { label: 'Surplus Stock Clearance', weight: '15%', featured: false },
                  { label: 'Booking Slot Allocation', weight: `${Math.max(0, 100 - 30 - probValue)}%`, featured: false },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-3.5 rounded-xl border transition-all duration-300 ${
                      row.featured
                        ? 'bg-[#f97316]/[0.05] border-[#f97316]/[0.15]'
                        : 'bg-[#fafaf9] border-[#eee]'
                    }`}
                  >
                    <span className={`font-semibold uppercase tracking-[0.08em] text-[10px] ${row.featured ? 'text-[#f97316] font-bold' : 'text-[#555]'}`}>
                      {row.label}{row.featured ? ' (Featured)' : ''}
                    </span>
                    <span className={`font-bold ${row.featured ? 'text-[#f97316] text-[13px]' : 'text-[#888]'}`}>{row.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — PARTNER ROTATION
      ═══════════════════════════════════════════════════ */}
      <section
        id="partners"
        ref={setSectionRef('partners')}
        className={`py-28 px-6 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center ${sectionClass('partners')}`}
      >
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Collaborative Rotation</span>
          <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.02em] text-[#1a1a1a] leading-tight">
            Every Partner Gets the Spotlight
          </h2>
          <p className="text-[#777] text-[15px] leading-[1.75]">
            Multiple businesses contribute assets into a single shared network. Each week, the system automatically shifts the spotlight to a new featured partner — routing all captured leads, foot traffic, and digital conversions their way.
          </p>
          <p className="text-[#777] text-[15px] leading-[1.75]">
            Over time, every contributing business benefits from the collective engagement of the entire ecosystem. Shared investment, distributed returns.
          </p>
          <div className="p-4 bg-[#fafaf9] border-l-[3px] border-[#f97316] rounded-r-xl">
            <h4 className="text-[10px] font-extrabold text-[#1a1a1a] uppercase tracking-[0.12em]">Round-Robin Equity</h4>
            <p className="text-[13px] text-[#888] mt-1 leading-relaxed">
              Each partner receives a concentrated surge in qualified leads during their spotlight window, powered by the collective traffic of the entire network.
            </p>
          </div>
        </div>

        {/* Spotlight simulation */}
        <div className="lg:col-span-7 w-full">
          <div className="bg-[#fafaf9] p-6 lg:p-8 rounded-2xl border border-[#eee] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#eee] pb-4">
              <span className="text-[11px] font-bold tracking-[0.12em] text-[#888] uppercase">Spotlight Rotation</span>
              <span className="px-2.5 py-1 rounded-md bg-[#f97316]/[0.08] border border-[#f97316]/[0.15] text-[9px] font-bold text-[#f97316] tracking-[0.12em] uppercase">Live Simulation</span>
            </div>

            <div className="space-y-3">
              {partners.map((partner, index) => {
                const isActive = index === activePartnerIndex;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                      isActive
                        ? 'border-[#f97316] bg-white shadow-md animate-spotlight'
                        : 'border-[#eee] bg-transparent opacity-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#f97316] animate-pulse' : 'bg-[#ccc]'}`} />
                        <h4 className="font-bold font-display text-sm text-[#1a1a1a]">{partner.name}</h4>
                      </div>
                      <p className="text-[11px] text-[#aaa] mt-0.5 ml-4">{partner.category}</p>
                    </div>
                    <div className="flex items-center gap-6 text-xs ml-4 sm:ml-0">
                      <div>
                        <span className="text-[9px] text-[#aaa] font-semibold uppercase tracking-[0.1em] block">Leads</span>
                        <span className={`font-bold ${isActive ? 'text-[#f97316]' : 'text-[#1a1a1a]'}`}>{partner.leads}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#aaa] font-semibold uppercase tracking-[0.1em] block">Conversion</span>
                        <span className="font-bold text-[#1a1a1a]">{partner.conversion}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#aaa] font-semibold uppercase tracking-[0.1em] block">Revenue</span>
                        <span className="font-black text-[#1a1a1a]">{partner.revenue}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — STOREFRONT EMBED
      ═══════════════════════════════════════════════════ */}
      <section
        id="embed"
        ref={setSectionRef('embed')}
        className={`py-28 px-6 lg:px-12 bg-[#fafaf9] border-y border-[#eee] ${sectionClass('embed')}`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Mockup */}
          <div className="lg:col-span-7 w-full order-2 lg:order-1">
            <div className="bg-white rounded-xl border border-[#eee] shadow-xl overflow-hidden relative">
              {/* Browser bar */}
              <div className="bg-[#fafaf9] border-b border-[#eee] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ddd]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ddd]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ddd]" />
                </div>
                <span className="text-[10px] text-[#aaa] font-mono tracking-wide">https://store.example.com/checkout</span>
                <div className="w-4" />
              </div>

              {/* Storefront mockup */}
              <div className="p-8 space-y-5 relative min-h-[360px] bg-white flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#f0f0f0] pb-4">
                    <span className="font-display font-black text-sm uppercase tracking-[0.06em] text-[#1a1a1a]">EXAMPLE STORE</span>
                    <span className="text-[11px] text-[#999] font-semibold font-mono">CART / 2 ITEMS</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#666]">Premium Cashmere Blazer</span>
                      <span className="font-bold text-[#1a1a1a]">$340.00</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#666]">Silk-Blend Waistcoat</span>
                      <span className="font-bold text-[#1a1a1a]">$110.00</span>
                    </div>
                    <div className="border-t border-[#f0f0f0] pt-3 flex justify-between items-center text-sm">
                      <span className="font-bold text-[#1a1a1a]">ORDER TOTAL</span>
                      <span className="font-black text-[#1a1a1a]">$450.00</span>
                    </div>
                  </div>
                </div>

                {/* MComSpin widget */}
                <div className="w-full flex items-center justify-between p-4 rounded-xl border border-[#eee] bg-[#fafaf9] mt-6">
                  <div>
                    <h5 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.06em]">MComSpin Engagement Active</h5>
                    <p className="text-[9px] text-[#aaa]">Complete your purchase to unlock partner rewards</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <button className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-[0.1em] mt-3">
                  Proceed to Payment
                </button>
              </div>

              {/* Floating widget callout */}
              <div className="absolute top-1/3 right-4 bg-white border-l-[3px] border-l-[#f97316] border border-[#eee] shadow-2xl p-4 rounded-r-xl max-w-[180px] select-none text-left space-y-1.5 animate-luxury-float z-30">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
                  <span className="text-[8px] font-bold text-[#f97316] uppercase tracking-[0.1em]">Live Widget</span>
                </div>
                <p className="text-[9px] text-[#888] leading-relaxed">
                  Embedded checkout integrations generate 4.8× higher immediate lead capture volume.
                </p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-5 space-y-7 order-1 lg:order-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Storefront Integration</span>
            <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.02em] text-[#1a1a1a] leading-tight">
              Drop In. Light Up. Convert.
            </h2>
            <p className="text-[#777] text-[15px] leading-[1.75]">
              MComSpin integrates directly into your existing checkout flow. A lightweight embed widget activates engagement at the point of purchase — no redesign required, no customer friction added.
            </p>
            <p className="text-[#777] text-[15px] leading-[1.75]">
              Customers receive instant value. You capture profile data, feed qualified leads back into the partner network, and increase storefront interaction on autopilot.
            </p>
            <ul className="space-y-2.5">
              {['Single-line embed integration', 'Custom styling and brand theming', 'Physical POS terminal support'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-[#555] font-semibold uppercase tracking-[0.08em]">
                  <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 7 — ANALYTICS
      ═══════════════════════════════════════════════════ */}
      <section
        id="analytics"
        ref={setSectionRef('analytics')}
        className={`py-28 px-6 lg:px-12 max-w-7xl mx-auto space-y-16 ${sectionClass('analytics')}`}
      >
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Performance Intelligence</span>
          <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.02em] text-[#1a1a1a] leading-tight">
            Every Metric. Real Time. One Dashboard.
          </h2>
          <p className="text-[#777] text-[15px] leading-[1.75]">
            Track lead velocity, partner conversions, asset utilization, and ecosystem revenue — all from a single pane of glass built for operators who need clarity, not clutter.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Ecosystem Net Revenue', value: '$162,890', change: '+24.1% velocity growth', positive: true },
            { label: 'Routed High-Intent Leads', value: '12,480', change: '94.8% routing accuracy', positive: false },
            { label: 'Inventory Clearance Rate', value: '86.2%', change: '4,920 assets liquidated', positive: true },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#eee] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[155px]">
              <div className="flex items-center justify-between text-[#aaa]">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]">{kpi.label}</span>
                <svg className="w-4 h-4 text-[#f97316]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black font-display text-[#1a1a1a]">{kpi.value}</p>
                <p className={`text-[10px] font-bold mt-1.5 uppercase tracking-[0.1em] ${kpi.positive ? 'text-emerald-500' : 'text-[#999]'}`}>
                  {kpi.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="p-6 lg:p-8 border border-[#eee] rounded-2xl bg-white shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <span className="text-xs font-bold tracking-[0.1em] text-[#1a1a1a] uppercase">Lead Conversion Velocity</span>
            <span className="text-[10px] text-[#aaa] uppercase font-semibold tracking-[0.08em]">Weeks 1–8</span>
          </div>

          <div className="h-[200px] w-full relative">
            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="800" y2="50" stroke="#eee" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#eee" strokeWidth="0.5" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#eee" strokeWidth="0.5" />
              <path d="M 0 170 Q 114 150 228 110 T 456 90 T 684 40 L 800 20 L 800 200 L 0 200 Z" fill="url(#cg)" />
              <path d="M 0 170 Q 114 150 228 110 T 456 90 T 684 40 L 800 20" fill="none" stroke="#f97316" strokeWidth="2.5" />
              <circle cx="228" cy="110" r="4" fill="#f97316" stroke="white" strokeWidth="1.5" />
              <circle cx="456" cy="90" r="4" fill="#f97316" stroke="white" strokeWidth="1.5" />
              <circle cx="684" cy="40" r="4" fill="#f97316" stroke="white" strokeWidth="1.5" />
              <circle cx="800" cy="20" r="4" fill="#f97316" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 8 — FINAL CTA
      ═══════════════════════════════════════════════════ */}
      <section
        id="cta"
        ref={setSectionRef('cta')}
        className={`py-32 px-6 lg:px-12 text-center bg-white relative overflow-hidden border-t border-[#eee] ${sectionClass('cta')}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f97316]/[0.02] to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Get Started</span>
          <h2 className="text-4xl lg:text-[3.5rem] font-display font-black tracking-[-0.03em] leading-[1.08] luxury-text-gradient">
            Build Your Engagement Ecosystem
          </h2>
          <p className="text-[#777] text-[15px] leading-[1.75] max-w-lg mx-auto">
            Join the next generation of collaborative commerce. Deploy controlled gamification infrastructure that automates lead capture, distributes rewards, and grows revenue across your entire partner network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/play" className="w-full sm:w-auto text-[11px] font-bold tracking-[0.15em] bg-[#f97316] text-white py-4 px-10 rounded-full hover:bg-[#ea580c] hover:shadow-lg hover:shadow-[#f97316]/20 transition-all duration-300 uppercase">
              See the Platform Live
            </Link>
            <a href="mailto:hello@mcomspin.com?subject=Strategy%20Demo" className="w-full sm:w-auto text-[11px] font-bold tracking-[0.15em] border border-[#e0e0e0] bg-white text-[#1a1a1a] py-4 px-10 rounded-full hover:border-[#f97316]/30 hover:bg-[#fefcfa] transition-all duration-300 uppercase">
              Book a Strategy Demo
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer className="py-14 px-6 lg:px-12 border-t border-[#eee] bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#f97316] rounded-full" />
            <span className="font-display font-bold text-sm text-[#1a1a1a]">MComSpin</span>
          </div>
          <p className="text-[11px] text-[#aaa] font-medium text-center lg:text-right">
            &copy; {new Date().getFullYear()} MComSpin. Business Engagement Infrastructure. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
