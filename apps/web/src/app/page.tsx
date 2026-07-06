'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap, Users, Box, Clock, Route, HelpCircle, Trophy, BarChart3, ArrowRight, ShieldCheck, ArrowUpRight, Menu, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAdminPartners } from '@/services/admin';

/* ─── Types ─── */
interface PlinkoEvent {
  id: string;
  time: string;
  message: string;
  bin: string;
  type: string;
}

export default function LandingPage() {
  /* ─── Navigation State ─── */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ─── Interactive States ─── */
  const [probValue, setProbValue] = useState(65);
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);
  /* ─── Slideshow State ─── */
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  /* ─── Partners Data ─── */
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasToken(!!localStorage.getItem('accessToken'));
    }
  }, []);

  const { data: partnersData, isLoading: isQueryLoading } = useAdminPartners({
    enabled: hasToken,
  });

  const partners: any[] = (hasToken && partnersData ? (partnersData as any[]) : []);
  const isLoading = hasToken && isQueryLoading;

  useEffect(() => {
    if (partners.length === 0) return;
    const timer = setInterval(() => {
      setActivePartnerIndex((prev) => (prev + 1) % partners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [partners.length]);

  /* ─── Intersection Observer for reveal-on-scroll ─── */
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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
      ? 'opacity-100 translate-y-0 transition-all duration-[800ms] ease-out'
      : 'opacity-0 translate-y-6 transition-all duration-[800ms] ease-out';

  /* ─── Removed Plinko Engine ─── */

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#f97316] selection:text-white relative overflow-hidden font-body luxury-gradient">
      {/* Ambient Radial Backgrounds */}
      <div className="fixed top-0 right-0 w-[900px] h-[900px] bg-[#f97316]/[0.03] rounded-full blur-[240px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[700px] h-[700px] bg-[#f97316]/[0.02] rounded-full blur-[200px] pointer-events-none" />

      {/* ═══════════════════════════════════════════════════
          NAVIGATION BAR
      ═══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-[#e8e8e5]/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-2.5 h-2.5 bg-[#f97316] rounded-full shadow-[0_0_12px_rgba(249,115,22,0.6)] group-hover:scale-125 transition-transform duration-300" />
            <span className="font-display font-black text-xl tracking-tight text-[#1a1a1a] uppercase">MComSpin</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9 text-[11px] font-bold uppercase tracking-[0.18em] text-[#888]">
            {/* Nav removed per request - all links were just on-page anchors */}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/auth" className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] hover:text-[#f97316] transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/acquire" className="text-[11px] font-bold tracking-[0.15em] bg-[#1a1a1a] text-white px-6 py-3 rounded-xl hover:bg-[#f97316] hover:shadow-lg hover:shadow-black/10 transition-all duration-300 uppercase">
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-[#1a1a1a] hover:text-[#f97316] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e8e8e5] bg-white/95 backdrop-blur-md px-6 py-6 animate-fade-in-up">
            <div className="flex flex-col gap-3">
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="text-center text-[11px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] hover:text-[#f97316] transition-colors py-2">
                Sign In
              </Link>
              <Link href="/acquire" onClick={() => setMobileMenuOpen(false)} className="text-center text-[11px] font-bold tracking-[0.15em] bg-[#1a1a1a] text-white px-6 py-3 rounded-xl hover:bg-[#f97316] hover:shadow-lg hover:shadow-black/10 transition-all duration-300 uppercase">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={setSectionRef('hero')}
        className={`px-6 lg:px-12 pt-20 pb-28 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10 ${sectionClass('hero')}`}
      >
        {/* Left copy */}
        <div className="flex flex-col items-start space-y-8">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#f97316]/[0.06] border border-[#f97316]/[0.12]">
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
            <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#f97316] uppercase">Engagement Infrastructure</span>
          </div>

          <h1 className="text-[2.65rem] sm:text-5xl lg:text-[3.8rem] font-display font-black tracking-[-0.035em] leading-[1.05] luxury-text-gradient">
            Turn Controlled Gamification Into Predictable Revenue
          </h1>

          <p className="text-[#666] text-sm lg:text-[15px] leading-[1.75] max-w-lg">
            MComSpin integrates enterprise-grade gamification directly into your commerce environments. Capture high-intent profile data, optimize surplus asset allocation, and direct collaborative traffic within your partner ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-2 w-full sm:w-auto">
            <Link href="/play" className="flex items-center justify-center text-[11px] font-bold tracking-[0.15em] bg-[#f97316] text-white px-8 py-4 rounded-xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-[#f97316]/20 transition-all duration-300 uppercase">
              Launch Live Portal
            </Link>
            <a href="#how-it-works" className="flex items-center justify-center text-[11px] font-bold tracking-[0.15em] border border-[#e0e0e0] bg-white/85 text-[#1a1a1a] px-8 py-4 rounded-xl hover:border-[#f97316]/30 hover:bg-[#fafaf9] transition-all duration-300 uppercase">
              Explore Architecture
            </a>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-8 pt-10 border-t border-[#eee] w-full">
            <div>
              <p className="text-2xl lg:text-3xl font-black font-display text-[#1a1a1a]">100%</p>
              <p className="text-[9px] text-[#999] font-bold mt-1.5 uppercase tracking-[0.12em] leading-normal">Automated<br />Lead Dispatch</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black font-display text-[#1a1a1a]">Weekly</p>
              <p className="text-[9px] text-[#999] font-bold mt-1.5 uppercase tracking-[0.12em] leading-normal">Spotlight<br />Equity Cycles</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black font-display text-[#1a1a1a]">86.2%</p>
              <p className="text-[9px] text-[#999] font-bold mt-1.5 uppercase tracking-[0.12em] leading-normal">Surplus Asset<br />Liquidated</p>
            </div>
          </div>
        </div>

        {/* Right - Image Slideshow */}
        <div className="flex flex-col items-center justify-center relative w-full h-full min-h-[400px]">
          {/* Floating cards */}
          <div className="absolute -top-6 -left-6 z-20 bg-white/90 border border-[#eee] shadow-lg shadow-black/[0.03] px-4 py-3 rounded-xl flex items-center gap-3 pointer-events-none animate-luxury-float">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-[8px] font-bold text-[#aaa] uppercase tracking-[0.15em] block">Active Streams</span>
              <span className="text-[11px] font-black text-[#1a1a1a]">+1,840 conversions</span>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 z-20 bg-white/90 border border-[#eee] shadow-lg shadow-black/[0.03] px-4 py-3 rounded-xl flex items-center gap-3 pointer-events-none animate-luxury-float-delayed">
            <Zap className="w-3.5 h-3.5 text-[#f97316]" />
            <div>
              <span className="text-[8px] font-bold text-[#aaa] uppercase tracking-[0.15em] block">System Capacity</span>
              <span className="text-[11px] font-black text-[#1a1a1a]">Optimal Allocation</span>
            </div>
          </div>

          {/* Slideshow Wrapper */}
          <div className="w-full max-w-[500px] aspect-[4/5] sm:aspect-square rounded-2xl border border-[#e8e8e5] bg-white shadow-xl shadow-black/[0.04] p-2 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#f97316]/30 rounded-tl-2xl pointer-events-none z-10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#f97316]/30 rounded-br-2xl pointer-events-none z-10" />
            
            <div className="w-full h-full relative rounded-xl overflow-hidden bg-stone-100">
              {slides.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Showcase ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-[#f97316] w-6' : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — THE GROWTH BOTTLENECK
      ═══════════════════════════════════════════════════ */}
      <section
        id="problem"
        ref={setSectionRef('problem')}
        className={`py-28 px-6 lg:px-12 bg-[#fafaf9] border-y border-[#eee]/60 relative z-10 ${sectionClass('problem')}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">The Leakage</span>
            <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.03em] text-[#1a1a1a] leading-tight">
              Traditional Engagement Bleeds Merchant Value
            </h2>
            <p className="text-[#666] text-sm lg:text-[15px] leading-[1.75]">
              Most customer capture campaigns run on isolated silos. Customer data hits cold forms, surplus capacity lies dormant, and complementary brands spend independently on redundant user acquisition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Unutilized Stock & Slots',
                desc: 'Unallocated appointment slots, off-peak hours, and surplus inventory cost merchants billions. Legacy solutions lack the dynamic routing required to liquidate these assets programmatically.',
                icon: <Box className="w-5 h-5" />,
              },
              {
                title: 'Friction-Heavy Capture',
                desc: 'Cold forms and pop-up newsletters receive dwindling conversion. Without an immediate high-end gamification loop, shoppers remain anonymous and customer lifetime value stays flat.',
                icon: <Users className="w-5 h-5" />,
              },
              {
                title: 'Isolated Marketing Budgets',
                desc: 'Local storefronts and online stores buy traffic independently, paying maximum rates. Collaborative networks utilize shared infrastructure to swap leads at point of sale.',
                icon: <Route className="w-5 h-5" />,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-[#eee] shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 space-y-5">
                <div className="w-10 h-10 rounded-lg bg-[#f97316]/[0.06] flex items-center justify-center text-[#f97316]">
                  {item.icon}
                </div>
                <h3 className="text-xs font-bold font-display text-[#1a1a1a] uppercase tracking-[0.1em]">{item.title}</h3>
                <p className="text-[#888] text-xs lg:text-[13px] leading-[1.7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — PLATFORM FLOW / PROCESS
      ═══════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={setSectionRef('how-it-works')}
        className={`py-28 px-6 lg:px-12 max-w-7xl mx-auto space-y-16 ${sectionClass('how-it-works')}`}
      >
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Platform Architecture</span>
          <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.03em] text-[#1a1a1a] leading-tight">
            Six Steps From Asset to Revenue
          </h2>
          <p className="text-[#777] text-sm lg:text-[15px] leading-[1.75]">
            MComSpin provides a unified commerce loop that ingests merchant inventories, drives user action, and balances benefit returns throughout the partner web.
          </p>
        </div>

        <div className="relative p-6 lg:p-10 border border-[#eee] rounded-2xl bg-[#fafaf9]/50 overflow-hidden">
          {/* Connector Flow Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:flex items-center px-16">
            <svg width="100%" height="4">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="#f97316" strokeOpacity="0.1" strokeWidth="2" className="animate-flow-dash" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {[
              { step: '01', title: 'Asset Pooling', desc: 'Participating brands list idle inventories and premium vouchers into the network.' },
              { step: '02', title: 'Campaign Setup', desc: 'Assets are structured into themed campaigns using customizable Plinko setups.' },
              { step: '03', title: 'Calibration', desc: 'Set admin control values, probability allocations, and partner weight parameters.' },
              { step: '04', title: 'User Drop', desc: 'Customers access the Plinko gateway on checkout screens and play to unlock gifts.' },
              { step: '05', title: 'Lead Routing', desc: 'Captured client profiles are automatically distributed to the active spotlight partner.' },
              { step: '06', title: 'Conversions', desc: 'Physical check-ins are tracked, ROI calculations are generated, and loop repeats.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-[#eee] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
                <span className="text-[10px] font-black text-[#f97316] mb-3">{item.step}</span>
                <h4 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.1em] mb-2">{item.title}</h4>
                <p className="text-[11px] text-[#999] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — PROBABILITY CALIBRATION
      ═══════════════════════════════════════════════════ */}
      <section
        id="engine"
        ref={setSectionRef('engine')}
        className={`py-28 px-6 lg:px-12 bg-[#fafaf9] border-y border-[#eee]/60 ${sectionClass('engine')}`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Probability Engine</span>
            <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.03em] text-[#1a1a1a] leading-tight">
              Complete Sovereignty Over Every Outcome
            </h2>
            <p className="text-[#666] text-sm lg:text-[15px] leading-[1.75]">
              MComSpin is not random chance. Operators set precise allocation structures to ensure budget safety. Programmatically boost priority weights for spotlight partners, caps daily distributions, and direct conversions to active targets in real-time.
            </p>

            {/* Slider Widget */}
            <div className="space-y-4 bg-white p-6 rounded-xl border border-[#eee] shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.15em] uppercase">
                <span className="text-[#1a1a1a]">Spotlight Weight priority</span>
                <span className="text-[#f97316]">{probValue}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={probValue}
                onChange={(e) => setProbValue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#f97316]"
              />
              <div className="flex justify-between text-[8px] text-[#aaa] uppercase tracking-[0.15em] font-bold">
                <span>Balanced Distribution</span>
                <span>Spotlight Bias (L)</span>
                <span>Maximum Bias (R)</span>
              </div>
            </div>
          </div>

          {/* Right config preview */}
          <div>
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-[#eee] shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-[#eee] pb-4">
                <div>
                  <h3 className="text-xs font-bold font-display text-[#1a1a1a] uppercase tracking-[0.1em]">Allocation Matrix</h3>
                  <p className="text-[9px] text-[#aaa] mt-0.5">Live outcome allocations across active prize bins</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Featured B2B Voucher', weight: `${probValue > 60 ? '45%' : '15%'}`, featured: probValue > 60 },
                  { label: 'Lead Capture Gate Routing', weight: `${probValue}%`, featured: true },
                  { label: 'Surplus Excess Clearance', weight: `${Math.max(10, 100 - probValue - 20)}%`, featured: false },
                  { label: 'Booking Time Allocation', weight: '20%', featured: false },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-3.5 rounded-lg border transition-all duration-300 ${
                      row.featured
                        ? 'bg-[#f97316]/[0.05] border-[#f97316]/[0.2] shadow-sm'
                        : 'bg-[#fafaf9] border-[#eee]'
                    }`}
                  >
                    <span className={`font-bold uppercase tracking-[0.1em] text-[9px] ${row.featured ? 'text-[#f97316]' : 'text-[#666]'}`}>
                      {row.label} {row.featured && '(Featured)'}
                    </span>
                    <span className={`font-black text-xs ${row.featured ? 'text-[#f97316]' : 'text-[#1a1a1a]'}`}>{row.weight}</span>
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
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Round-Robin Equity</span>
          <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.03em] text-[#1a1a1a] leading-tight">
            Every Merchant Shares the Spotlight
          </h2>
          <p className="text-[#666] text-sm lg:text-[15px] leading-[1.75]">
            Ecosystem campaigns work best when everyone gains. The automated rotation engine shifts the spotlight target on program cycles, driving targeted peaks of consumer attention, store visits, and email list expansion to each member brand.
          </p>

          <div className="p-4 bg-[#fafaf9] border-l-2 border-[#f97316] rounded-r-lg">
            <h4 className="text-[10px] font-extrabold text-[#1a1a1a] uppercase tracking-[0.15em]">Ecosystem Network Effect</h4>
            <p className="text-[12px] text-[#888] mt-1.5 leading-relaxed">
              When checkout flows are linked, members gain access to pre-qualified buyers that standard search ads fail to reach efficiently.
            </p>
          </div>
        </div>

        {/* Live Spotlight Simulation Panel */}
        <div className="lg:col-span-7 w-full">
          <div className="bg-[#fafaf9] p-6 lg:p-8 border border-[#eee] rounded-xl shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#eee] pb-4">
              <span className="text-[9px] font-bold tracking-[0.15em] text-[#888] uppercase">Active Partner Rotation</span>
              <span className="px-2.5 py-1 rounded-sm bg-orange-100 border border-orange-200 text-[8px] font-black text-[#f97316] tracking-[0.15em] uppercase animate-pulse">Live Simulation</span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[#eee] bg-white/40 animate-pulse">
                    <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-stone-100 rounded w-1/4 mb-3" />
                    <div className="flex gap-6">
                      <div className="h-3 bg-stone-100 rounded w-12" />
                      <div className="h-3 bg-stone-100 rounded w-12" />
                      <div className="h-3 bg-stone-100 rounded w-12" />
                    </div>
                  </div>
                ))
              ) : partners.length === 0 ? (
                <div className="p-6 rounded-xl border border-[#eee] bg-white/40 text-center">
                  <p className="text-[11px] text-[#aaa] font-bold">No partners available yet.</p>
                  <p className="text-[9px] text-[#ccc] mt-1">Partner data will appear once configured.</p>
                </div>
              ) : (
                partners.map((partner, index) => {
                  const isActive = index === activePartnerIndex;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                        isActive
                          ? 'border-[#f97316] bg-white shadow-md'
                          : 'border-[#eee] bg-white/40 opacity-40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#f97316] animate-ping' : 'bg-[#ccc]'}`} />
                          <h4 className="font-black font-display text-sm tracking-tight text-[#1a1a1a]">{partner.name}</h4>
                        </div>
                        <p className="text-[10px] text-[#aaa] mt-0.5">{partner.category}</p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-[11px] font-semibold text-[#1a1a1a]">
                        <div>
                          <span className="text-[8px] text-[#aaa] font-bold uppercase tracking-[0.1em] block">Leads</span>
                          <span className={isActive ? 'text-[#f97316] font-black' : ''}>{partner.leads}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-[#aaa] font-bold uppercase tracking-[0.1em] block">Conversion</span>
                          <span>{partner.conversion}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-[#aaa] font-bold uppercase tracking-[0.1em] block">Revenue</span>
                          <span className="font-extrabold">{partner.revenue}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — EMBED DEMO
      ═══════════════════════════════════════════════════ */}
      <section
        id="embed"
        ref={setSectionRef('embed')}
        className={`py-28 px-6 lg:px-12 bg-[#fafaf9] border-y border-[#eee]/60 ${sectionClass('embed')}`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Mockup */}
          <div className="lg:col-span-7 w-full order-2 lg:order-1">
            <div className="bg-white rounded-xl border border-[#eee] shadow-xl overflow-hidden relative">
              {/* Browser navigation bar */}
              <div className="bg-[#fafaf9] border-b border-[#eee] px-4 py-3 flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eee]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eee]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eee]" />
                </div>
                <span className="text-[9px] text-[#aaa] font-mono tracking-wide">https://boutique.meridian.com/checkout</span>
                <div className="w-4" />
              </div>

              {/* Checkout mockup */}
              <div className="p-8 space-y-6 relative min-h-[350px] bg-white flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#eee] pb-4">
                    <span className="font-display font-black text-sm uppercase tracking-[0.1em] text-[#1a1a1a]">Checkout Details</span>
                    <span className="text-[10px] text-[#aaa] font-bold">2 items in cart</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#666]">Premium Wool Coat</span>
                      <span className="font-extrabold text-[#1a1a1a]">£290.00</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#666]">Silk Necktie</span>
                      <span className="font-extrabold text-[#1a1a1a]">£60.00</span>
                    </div>
                    <div className="border-t border-[#eee] pt-3 flex justify-between items-center text-sm">
                      <span className="font-bold text-[#1a1a1a]">Order Total</span>
                      <span className="font-black text-[#1a1a1a]">£350.00</span>
                    </div>
                  </div>
                </div>

                {/* Embedded Widget */}
                <div className="w-full flex items-center justify-between p-4 rounded-xl border border-orange-200 bg-[#f97316]/[0.03] mt-4 shadow-sm select-none">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#f97316]" />
                      <h5 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-[0.08em]">MComSpin Partner Bonus Active</h5>
                    </div>
                    <p className="text-[9px] text-[#888] pl-5">Complete purchase to drop ball and claim a free partner gift</p>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <button className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-[0.15em] mt-2 shadow-md hover:bg-[#f97316] transition-colors">
                  Complete Payment
                </button>
              </div>

              {/* Float badge */}
              <div className="absolute top-1/3 right-4 bg-white/95 border-l-2 border-l-[#f97316] border border-[#eee] shadow-xl p-4 rounded-r-lg max-w-[170px] select-none text-left space-y-1.5 animate-luxury-float z-30">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#f97316] animate-pulse" />
                  <span className="text-[8px] font-extrabold text-[#f97316] uppercase tracking-[0.1em]">Embed Widget</span>
                </div>
                <p className="text-[9px] text-[#888] leading-relaxed">
                  Easily integrate the widget using a simple API script injection.
                </p>
              </div>
            </div>
          </div>

          {/* Right copy */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Storefront Embeds</span>
            <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.03em] text-[#1a1a1a] leading-tight">
              Single Script. Zero Friction.
            </h2>
            <p className="text-[#666] text-sm lg:text-[15px] leading-[1.75]">
              MComSpin does not require complex codebase refactoring. Drop the secure, lightweight widget directly into order completion templates, shopping carts, or sign-up portals. Custom brand stylesheets match your branding instantly.
            </p>
            <p className="text-[#666] text-sm lg:text-[15px] leading-[1.75]">
              Provide post-purchase rewards seamlessly, converting standard sales receipts into powerful leads for other members of your network.
            </p>
            <ul className="space-y-2 pt-2">
              {['Asynchronous API loading', 'Fully isolated secure frame embeds', 'Modular styling configurations'].map((row, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[10px] font-bold text-[#555] uppercase tracking-[0.1em]">
                  <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
                  {row}
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
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Network Metrics</span>
          <h2 className="text-3xl lg:text-[2.75rem] font-display font-black tracking-[-0.03em] text-[#1a1a1a] leading-tight">
            Ecosystem Analytics at a Glance
          </h2>
          <p className="text-[#777] text-sm lg:text-[15px] leading-[1.75]">
            Track lead velocity metrics, partner conversions, asset utilization indices, and ecosystem net revenue pools using a clean, modern interface.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Ecosystem Net Revenue', value: '£162,490', change: '+24.1% velocity growth', positive: true },
            { label: 'Routed Consumer Profiles', value: '12,480', change: '94.8% routing accuracy', positive: true },
            { label: 'Inventory Clearance Rate', value: '86.2%', change: '4,920 assets liquidated', positive: true },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-[#eee] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[145px]">
              <div className="flex items-center justify-between text-[#aaa]">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{kpi.label}</span>
                <BarChart3 className="w-4 h-4 text-[#f97316]" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black font-display text-[#1a1a1a]">{kpi.value}</p>
                <p className="text-[9px] font-bold mt-1 text-emerald-500 uppercase tracking-[0.1em]">
                  {kpi.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Rendered SVG Chart */}
        <div className="p-6 lg:p-8 border border-[#eee] rounded-xl bg-white shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#1a1a1a] uppercase">Weekly Lead Velocity Index</span>
            <span className="text-[9px] text-[#aaa] uppercase font-bold tracking-[0.1em]">Week 1 - Week 8</span>
          </div>

          <div className="h-[200px] w-full relative">
            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="800" y2="50" stroke="#f6f6f3" strokeWidth="1" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#f6f6f3" strokeWidth="1" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#f6f6f3" strokeWidth="1" />
              <path d="M 0 160 Q 120 140 240 100 T 480 80 T 700 35 L 800 20 L 800 200 L 0 200 Z" fill="url(#chartGlow)" />
              <path d="M 0 160 Q 120 140 240 100 T 480 80 T 700 35 L 800 20" fill="none" stroke="#f97316" strokeWidth="2.5" />
              <circle cx="240" cy="100" r="4" fill="#f97316" stroke="white" strokeWidth="1.5" />
              <circle cx="480" cy="80" r="4" fill="#f97316" stroke="white" strokeWidth="1.5" />
              <circle cx="700" cy="35" r="4" fill="#f97316" stroke="white" strokeWidth="1.5" />
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
        className={`py-32 px-6 lg:px-12 text-center bg-white relative overflow-hidden border-t border-[#eee]/60 ${sectionClass('cta')}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f97316]/[0.01] to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#f97316] uppercase">Get Started</span>
          <h2 className="text-4xl lg:text-5xl font-display font-black tracking-[-0.03em] leading-[1.08] luxury-text-gradient">
            Build Your Engagement Ecosystem
          </h2>
          <p className="text-[#666] text-sm lg:text-[15px] leading-[1.75] max-w-lg mx-auto">
            Ready to integrate controlled gamification? Pool idle merchant assets, secure profile conversions, and drive collaborative revenue across your network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/play" className="w-full sm:w-auto text-[11px] font-bold tracking-[0.15em] bg-[#f97316] text-white py-4 px-10 rounded-xl hover:bg-[#ea580c] hover:shadow-lg hover:shadow-[#f97316]/20 transition-all duration-300 uppercase">
              Launch Play Portal
            </Link>
            <a href="mailto:hello@mcomspin.com?subject=Platform%20Demo" className="w-full sm:w-auto text-[11px] font-bold tracking-[0.15em] border border-[#e0e0e0] bg-white text-[#1a1a1a] py-4 px-10 rounded-xl hover:border-[#f97316]/30 hover:bg-[#fafaf9] transition-all duration-300 uppercase">
              Book Strategy Call
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
            <span className="font-display font-black text-sm tracking-wide text-[#1a1a1a] uppercase">MComSpin</span>
          </div>
          <p className="text-[11px] text-[#aaa] font-medium text-center lg:text-right">
            &copy; {new Date().getFullYear()} MComSpin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
