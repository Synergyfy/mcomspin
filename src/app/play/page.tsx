'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeadData {
  name: string;
  email: string;
  phone: string;
}

interface Prize {
  id: string;
  title: string;
  provider: string;
  type: 'discount' | 'appointment' | 'voucher' | 'product';
  value: string;
  details: string;
  color: string;
  labelTop: string;
  labelBottom: string;
}

const getPrizeIcon = (type: 'discount' | 'appointment' | 'voucher' | 'product') => {
  switch (type) {
    case 'voucher':
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12c1.38 0 2.5 1.12 2.5 2.5v7c0 1.38-1.12 2.5-2.5 2.5h-12A2.5 2.5 0 013 15.5v-7A2.5 2.5 0 015.5 6z" />
        </svg>
      );
    case 'appointment':
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'product':
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'discount':
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.75a3 3 0 11-6 0 3 3 0 016 0zm-12 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function PlayPortal() {
  const [step, setStep] = useState<'gate' | 'play' | 'reveal' | 'claim'>('gate');
  const [lead, setLead] = useState<LeadData>({ name: '', email: '', phone: '' });
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [developerLogs, setDeveloperLogs] = useState<string[]>([]);
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);

  const partners = [
    { name: 'Sartorial Goods Co.', active: true },
    { name: 'Orchard & Co. Spas', active: false },
    { name: 'Apex Tech Vouchers', active: false },
    { name: 'Vanguard Fine Dining', active: false }
  ];

  const addLog = (msg: string) => {
    setDeveloperLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));
  };

  useEffect(() => {
    addLog('System Initialized: Loading Week 1 configuration...');
    addLog('Active round-robin recipient: Sartorial Goods Co.');
  }, []);

  const prizes: Prize[] = [
    { id: '1', title: '$100 Tailoring Voucher', provider: 'Sartorial Goods Co.', type: 'voucher', value: '$100', details: 'Valid on custom collections. Min spend $300.', color: '#f97316', labelTop: '$100', labelBottom: 'VOUCHER' },
    { id: '2', title: 'Luxury Hydrotherapy Session', provider: 'Orchard & Co. Spas', type: 'appointment', value: 'Complimentary', details: 'Full-service spa booking. Instant reservation token generated.', color: '#252525', labelTop: 'SPA', labelBottom: 'SESSION' },
    { id: '3', title: 'Premium Wireless Charger', provider: 'Apex Tech Vouchers', type: 'product', value: 'Free Item', details: 'Redeemable at tech terminal, excess stock inventory #AP-903.', color: '#f97316', labelTop: 'TECH', labelBottom: 'ITEM' },
    { id: '4', title: '50% Chef Tasting Table', provider: 'Vanguard Fine Dining', type: 'discount', value: '50% Off', details: 'Exquisite 6-course menu reservation for two guests.', color: '#252525', labelTop: '50% OFF', labelBottom: 'DINING' },
    { id: '5', title: '$50 Retail Gift Card', provider: 'Sartorial Goods Co.', type: 'voucher', value: '$50', details: 'Storewide shopping credit. Valid immediately.', color: '#f97316', labelTop: '$50', labelBottom: 'CREDIT' },
    { id: '6', title: 'Priority Consultation Slot', provider: 'Orchard & Co. Spas', type: 'appointment', value: 'VIP Booking', details: 'Direct matching with a senior physical therapist.', color: '#252525', labelTop: 'VIP', labelBottom: 'BOOKING' }
  ];

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name || !lead.email) {
      alert('Please fill out the required information to enter the prize portal.');
      return;
    }
    addLog(`Instant Gratification triggered. Lead Captured: ${lead.name} (${lead.email})`);
    addLog(`Data routing control established. Assigning session telemetry...`);
    setStep('play');
  };

  const triggerMainSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    addLog('Engagement request submitted to Backend Probability Engine...');

    const randomPercent = Math.random() * 100;
    let targetIndex = 0;

    if (randomPercent < 60) {
      targetIndex = Math.random() > 0.5 ? 0 : 4;
      addLog(`Probability override active: Spotlighting Featured Partner (60% weight matched)`);
    } else {
      const otherIndices = [1, 2, 3, 5];
      targetIndex = otherIndices[Math.floor(Math.random() * otherIndices.length)];
      addLog(`Standard probability distribution matched.`);
    }

    const extraSpins = 6 + Math.floor(Math.random() * 4); // 6 to 9 spins
    const sectorAngle = 60;
    
    // We want the wheel to spin clockwise and stop exactly at the pointer (at 0 degrees / top center)
    // The target slice needs to be at the top. Since slice indices go clockwise,
    // to align targetIndex at the top center, we must rotate the wheel by:
    // 360 - (targetIndex * 60)
    const targetAngle = extraSpins * 360 + (360 - (targetIndex * sectorAngle));

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = prizes[targetIndex];
      setSelectedPrize(prize);
      addLog(`Game outcome resolved: Selected [${prize.title}]`);
      addLog(`Lead automatically routed to: ${prize.provider}`);
      addLog(`Disbursing asset logic triggered. Excess Inventory log: ID-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep('reveal');
    }, 4500);
  };

  const handleRedeem = () => {
    addLog(`Routing conversion event telemetry to dashboard trackers...`);
    addLog(`Lead status updated: "Highly Motivated - Asset Distributed"`);
    setStep('claim');
  };

  return (
    <div className="min-h-screen bg-white text-[#252525] relative overflow-hidden luxury-gradient font-body">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#f97316]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#f97316]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e8e8e5] bg-white/85 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-4 h-4 bg-[#f97316] rounded-full animate-pulse block" />
          <Link href="/" className="font-display font-semibold text-lg tracking-tight text-[#252525]">mcomspin</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs font-bold tracking-widest text-[#727272] hover:text-[#252525] transition-colors">
            &larr; BACK TO SYSTEM CORE
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Column: Interactive Screen */}
        <div className="lg:col-span-8 bg-white/95 border border-[#e8e8e5] rounded-2xl p-6 lg:p-8 shadow-xl min-h-[560px] flex flex-col justify-between relative">
          
          {/* Step 1: Gate */}
          {step === 'gate' && (
            <div className="space-y-6 max-w-lg mx-auto py-8">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-[#f97316] uppercase">Step 01 / Instant Gratification Gate</span>
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-[#252525]">Verification & Data Capture</h2>
                <p className="text-[#727272] text-sm font-light">
                  To participate in the partner rewards ecosystem and spin for luxury business assets, verify your invitation.
                </p>
              </div>

              <form onSubmit={handleGateSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#727272]">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name" 
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e8e5] bg-white text-sm focus:outline-none focus:border-[#f97316] transition-colors text-[#252525]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#727272]">Corporate Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com" 
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e8e5] bg-white text-sm focus:outline-none focus:border-[#f97316] transition-colors text-[#252525]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#727272]">Mobile Number (Optional)</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e8e5] bg-white text-sm focus:outline-none focus:border-[#f97316] transition-colors text-[#252525]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#252525] text-white py-4 rounded-xl font-bold tracking-wide hover:bg-[#f97316] transition-all duration-300 shadow-lg shadow-black/10"
                >
                  ENTER PRIZE PORTAL
                </button>
              </form>

              <div className="pt-4 border-t border-[#e8e8e5] text-center">
                <p className="text-[10px] text-[#727272] leading-relaxed font-bold">
                  *By submitting, you agree to lead-routing assignment across participating round-robin partners.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: The Main Play Spin Board */}
          {step === 'play' && (
            <div className="flex flex-col items-center justify-center space-y-8 py-6">
              <div className="text-center space-y-1.5 max-w-md">
                <span className="text-[10px] font-bold tracking-widest text-[#f97316] uppercase bg-[#f97316]/10 px-2.5 py-0.5 rounded-full">Step 02 / Controlled Engagement Layer</span>
                <h2 className="text-xl lg:text-2xl font-display font-extrabold tracking-tight text-[#252525]">Spin the Live Reward Wheel</h2>
                <p className="text-[#727272] text-xs font-light">
                  Spotlight partner active: <span className="font-semibold text-[#252525]">Sartorial Goods Co. (60% Weighted Probability)</span>
                </p>
              </div>

              {/* Luxury Chronometer Outer Wrapper */}
              <div className="relative w-[348px] h-[348px] rounded-full bg-gradient-to-b from-stone-50 via-white to-stone-100 p-2.5 flex items-center justify-center border border-stone-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.08),inset_0_2px_4px_white,0_0_0_1px_rgba(0,0,0,0.02)] select-none transition-all duration-500 hover:shadow-[0_30px_70px_rgba(249,115,22,0.08),inset_0_2px_4px_white] hover:scale-[1.01] active:scale-[0.99]">
                
                {/* Concentric scale ring */}
                <div className="absolute inset-0 bg-[#fafaf7] rounded-full m-1 border border-stone-200/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]" />
                
                {/* Chronograph Watch Face Ticks */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100">
                  {/* Outer micro-tracks */}
                  <circle cx="50" cy="50" r="48.5" fill="none" stroke="#e8e8e5" strokeWidth="0.15" />
                  <circle cx="50" cy="50" r="45.5" fill="none" stroke="#e8e8e5" strokeWidth="0.15" />
                  
                  {/* 60 Chronograph ticks */}
                  {Array.from({ length: 60 }).map((_, idx) => {
                    const angle = idx * 6; // 360 / 60 = 6 deg
                    const isMajor = idx % 5 === 0;
                    const isSectorBoundary = idx % 10 === 0;
                    const r1 = isMajor ? (isSectorBoundary ? 44.5 : 45.2) : 45.8;
                    const r2 = 48.0;
                    
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 50 + r1 * Math.cos(rad);
                    const y1 = 50 + r1 * Math.sin(rad);
                    const x2 = 50 + r2 * Math.cos(rad);
                    const y2 = 50 + r2 * Math.sin(rad);
                    
                    return (
                      <line
                        key={idx}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isSectorBoundary ? '#f97316' : (isMajor ? '#252525' : '#e8e8e5')}
                        strokeWidth={isSectorBoundary ? '0.45' : (isMajor ? '0.3' : '0.2')}
                      />
                    );
                  })}
                </svg>

                {/* Elegant Bezel-Mounted Chrono-Pointer */}
                <div className="absolute -top-[16px] z-30 flex flex-col items-center select-none pointer-events-none filter drop-shadow-[0_5px_8px_rgba(0,0,0,0.18)]">
                  {/* Miniature mount bracket */}
                  <div className="w-5 h-2 bg-[#252525] rounded-t-sm border-b border-white/10" />
                  {/* Tapered chronometer hand */}
                  <svg width="18" height="30" viewBox="0 0 18 30" fill="none" className="transition-transform duration-300 hover:translate-y-0.5">
                    <path d="M9 28L1 1L17 1L9 28Z" fill="#252525" />
                    <path d="M9 23L3 3L15 3L9 23Z" fill="#f97316" />
                    <circle cx="9" cy="3" r="1.2" fill="white" />
                  </svg>
                </div>

                {/* Inner Bezel (Sleek Metallic Gunmetal Ring) */}
                <div className="relative w-[288px] h-[288px] rounded-full bg-white border-[4px] border-[#252525] shadow-[0_10px_30px_rgba(0,0,0,0.06),inset_0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center z-10 overflow-hidden">
                  
                  {/* Rotating Dial Container */}
                  <div 
                    className="w-full h-full rounded-full overflow-hidden transition-transform ease-out relative"
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      transitionDuration: isSpinning ? '4.5s' : '0s'
                    }}
                  >
                    {/* SVG wedge layout with concentric watch sub-tracks */}
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <defs>
                        {/* Light luxury sector radial gradient */}
                        <radialGradient id="lightWedge" cx="50%" cy="50%" r="50%" fx="50%" fy="10%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="60%" stopColor="#fafaf7" />
                          <stop offset="100%" stopColor="#f3f3eb" />
                        </radialGradient>
                        
                        {/* Dark luxury sector radial gradient */}
                        <radialGradient id="darkWedge" cx="50%" cy="50%" r="50%" fx="50%" fy="10%">
                          <stop offset="0%" stopColor="#2c2c2b" />
                          <stop offset="60%" stopColor="#1e1e1d" />
                          <stop offset="100%" stopColor="#111110" />
                        </radialGradient>
                      </defs>

                      {/* Wedges */}
                      <path d="M50,50 L50,0 A50,50 0 0,1 93.3,25 Z" fill="url(#lightWedge)" stroke="#e8e8e5" strokeWidth="0.3" />
                      <path d="M50,50 L93.3,25 A50,50 0 0,1 93.3,75 Z" fill="url(#darkWedge)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                      <path d="M50,50 L93.3,75 A50,50 0 0,1 50,100 Z" fill="url(#lightWedge)" stroke="#e8e8e5" strokeWidth="0.3" />
                      <path d="M50,50 L50,100 A50,50 0 0,1 6.7,75 Z" fill="url(#darkWedge)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                      <path d="M50,50 L6.7,75 A50,50 0 0,1 6.7,25 Z" fill="url(#lightWedge)" stroke="#e8e8e5" strokeWidth="0.3" />
                      <path d="M50,50 L6.7,25 A50,50 0 0,1 50,0 Z" fill="url(#darkWedge)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />

                      {/* Outer rim gold highlight inside the sectors */}
                      <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(249,115,22,0.08)" strokeWidth="0.5" />
                      
                      {/* Luxury watchface design accents inside the sectors */}
                      <circle cx="50" cy="50" r="41" fill="none" stroke="#e8e8e5" strokeOpacity="0.25" strokeWidth="0.2" strokeDasharray="0.8, 1.5" />
                      <circle cx="50" cy="50" r="32" fill="none" stroke="#e8e8e5" strokeOpacity="0.15" strokeWidth="0.2" />
                      <circle cx="50" cy="50" r="23" fill="none" stroke="#e8e8e5" strokeOpacity="0.25" strokeWidth="0.15" strokeDasharray="0.5, 1" />
                    </svg>

                    {/* Absolute Positioned Precise Labels */}
                    {prizes.map((prize, idx) => {
                      const sectorAngle = 60;
                      const labelAngle = idx * sectorAngle + (sectorAngle / 2);
                      const isDark = idx % 2 === 1;
                      return (
                        <div
                          key={idx}
                          className="absolute top-0 left-1/2 h-1/2 origin-bottom -translate-x-1/2 flex flex-col items-center justify-start pt-8 select-none"
                          style={{
                            transform: `rotate(${labelAngle}deg)`,
                            width: '90px',
                          }}
                        >
                          {/* Micro Icon Container with glowing ring */}
                          <div className={`p-2 rounded-full border shadow-md mb-2 flex items-center justify-center transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#252525] border-white/10 text-[#ffa15f] shadow-black/30' 
                              : 'bg-[#fafaf7] border-[#e8e8e5] text-[#f97316] shadow-stone-200'
                          }`}>
                            {getPrizeIcon(prize.type)}
                          </div>
                          
                          {/* Top Value Label (e.g. $100, SPA, 50% OFF) */}
                          <span className={`text-[11px] font-black tracking-[0.1em] text-center uppercase leading-tight font-display ${
                            isDark ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]' : 'text-[#252525]'
                          }`}>
                            {prize.labelTop}
                          </span>
                          
                          {/* Muted line separator */}
                          <span className={`w-5 h-[1.5px] my-1.5 rounded-full ${
                            isDark ? 'bg-white/10' : 'bg-[#e8e8e5]'
                          }`} />
                          
                          {/* Bottom Category Label (e.g. VOUCHER, SESSION) */}
                          <span className={`text-[7.5px] font-black tracking-[0.2em] text-center uppercase ${
                            isDark ? 'text-[#ffa15f]' : 'text-[#f97316]'
                          }`}>
                            {prize.labelBottom}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sapphire Glass Crystal Reflection Cover (Stationary / High-end watch finish) */}
                  <div className="absolute inset-0 rounded-full pointer-events-none z-15 bg-gradient-to-tr from-white/0 via-white/8 to-white/18 opacity-90 shadow-[inset_0_4px_12px_rgba(255,255,255,0.15),inset_0_-4px_12px_rgba(0,0,0,0.1)]" />
                  <div className="absolute inset-0 rounded-full pointer-events-none z-15 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_65%)]" />

                  {/* High-End Concentric Tourbillon Mechanical Central Hub */}
                  <div className="absolute w-[60px] h-[60px] rounded-full bg-white shadow-[0_10px_25px_rgba(0,0,0,0.18),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center border-[4px] border-[#252525] z-20">
                    <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-stone-50 to-stone-200 border border-stone-300 flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.1)]">
                      <div className="w-[24px] h-[24px] rounded-full bg-white border-[3px] border-[#252525] flex items-center justify-center relative shadow-sm">
                        {/* Core pin */}
                        <span className="w-[10px] h-[10px] bg-[#f97316] rounded-full shadow-[0_0_10px_#f97316] animate-pulse" />
                        {/* Rotating radial mechanical tourbillon detail */}
                        <span className="absolute inset-0.5 rounded-full border border-dashed border-[#e8e8e5] animate-[spin_20s_linear_infinite]" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>


              {/* Ultra-Premium Action Button */}
              <button 
                onClick={triggerMainSpin}
                disabled={isSpinning}
                className="w-full max-w-xs bg-[#252525] hover:bg-[#1e1e1d] text-white py-4 rounded-xl font-bold tracking-widest text-xs uppercase transition-all duration-300 disabled:bg-[#727272] disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.15)] border border-[#e8e8e5]/10 active:scale-[0.98] group flex items-center justify-center gap-2"
              >
                <span>{isSpinning ? 'Executing Engine Calculations...' : 'TRIGGER ENGAGEMENT SPIN'}</span>
                {!isSpinning && (
                  <svg className="w-4 h-4 text-[#f97316] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Reveal Reward */}
          {step === 'reveal' && selectedPrize && (
            <div className="space-y-8 max-w-xl mx-auto py-8 text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-[#f97316] uppercase">Instant Gratification Resolved</span>
                <h2 className="text-2xl lg:text-4xl font-display font-extrabold tracking-tight text-[#252525]">Reward Box Unlocked!</h2>
              </div>

              {/* Animated glassmorphic card reveal */}
              <div className="p-8 rounded-2xl border border-[#f97316] bg-[#fafaf7] relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#f97316]/10 rounded-full blur-xl pointer-events-none" />
                
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f97316] text-white uppercase tracking-wider">
                  {selectedPrize.value}
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl lg:text-2xl font-bold font-display text-[#252525]">{selectedPrize.title}</h3>
                  <p className="text-xs text-[#727272] tracking-wide uppercase">Contributed by: <span className="text-[#252525] font-semibold">{selectedPrize.provider}</span></p>
                </div>

                <p className="text-sm text-[#727272] font-light leading-relaxed">
                  {selectedPrize.details}
                </p>

                <div className="pt-4 border-t border-[#e8e8e5] flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleRedeem}
                    className="flex-1 bg-[#f97316] text-white py-3.5 rounded-xl font-bold hover:bg-[#ea580c] transition-colors shadow-md"
                  >
                    REDEEM REWARD NOW
                  </button>
                  <Link 
                    href="/dashboard"
                    className="flex-1 border border-[#e8e8e5] bg-white text-[#252525] py-3.5 rounded-xl font-bold hover:bg-[#fafaf7] transition-colors flex items-center justify-center text-sm"
                  >
                    View Partner Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Claim / Monetization validation */}
          {step === 'claim' && selectedPrize && (
            <div className="space-y-8 max-w-md mx-auto py-8 text-center">
              <div className="w-16 h-16 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full flex items-center justify-center mx-auto text-[#f97316]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-extrabold tracking-tight text-[#252525]">Reward Secured Successfully</h3>
                <p className="text-[#727272] text-sm font-light">
                  A high-intent conversion token has been disbursed to <span className="font-semibold text-[#252525]">{lead.email}</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#e8e8e5] bg-[#fafaf7] space-y-3 text-left text-xs">
                <p className="font-bold uppercase tracking-wider text-[9px] text-[#727272]">Automated Systems Telemetry</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#727272] block">Lead Status:</span>
                    <span className="font-semibold text-[#252525]">Active & Routed</span>
                  </div>
                  <div>
                    <span className="text-[#727272] block">Recipient Partner:</span>
                    <span className="font-semibold text-[#252525]">{selectedPrize.provider}</span>
                  </div>
                  <div>
                    <span className="text-[#727272] block">Stock Code:</span>
                    <span className="font-mono text-[#f97316] font-bold">MS-EXP-928</span>
                  </div>
                  <div>
                    <span className="text-[#727272] block">Week Rotation Index:</span>
                    <span className="font-semibold text-[#252525]">Spotlight Round 01</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => {
                    setStep('play');
                    setSelectedPrize(null);
                  }}
                  className="w-full bg-[#252525] text-white py-3.5 rounded-xl font-bold hover:bg-[#f97316] transition-colors"
                >
                  SPIN AGAIN FOR PARTNERS
                </button>
                <Link 
                  href="/dashboard"
                  className="block text-xs font-bold text-[#f97316] hover:underline"
                >
                  ENTER THE REAL BUSINESS DASHBOARD &rarr;
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Real-Time Business telemetry logger */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Partner spotlight panel */}
          <div className="bg-[#fafaf7] rounded-2xl border border-[#e8e8e5] p-6 shadow-sm">
            <h4 className="text-xs font-bold tracking-widest text-[#727272] uppercase mb-4">ACTIVE ROTATION FOCUS</h4>
            <div className="space-y-3">
              {partners.map((p, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all duration-300 ${
                    idx === activePartnerIndex 
                      ? 'border-[#f97316] bg-white font-bold text-[#252525]' 
                      : 'border-[#e8e8e5]/60 bg-transparent opacity-60 text-[#727272]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${idx === activePartnerIndex ? 'bg-[#f97316] animate-ping' : 'bg-[#727272]'}`} />
                    {p.name}
                  </span>
                  <span className="text-[10px] text-[#727272] uppercase">
                    {idx === activePartnerIndex ? ' spotlit recipient' : 'queued'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#e8e8e5] text-center">
              <span className="text-[10px] text-[#727272] italic">Ecosystem rotations are handled on automated backend crons weekly.</span>
            </div>
          </div>

          {/* Dev logs console widget */}
          <div className="bg-[#252525] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
            {/* Glossy top detail */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f97316] to-transparent" />
            
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold tracking-widest text-[#f97316] uppercase">Live Systems Engine Telemetry</h4>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="font-mono text-[10px] space-y-2.5 max-h-[220px] overflow-y-auto leading-relaxed">
              {developerLogs.map((log, idx) => (
                <div key={idx} className="border-b border-white/5 pb-1 last:border-0">
                  <span className="text-[#f97316] font-semibold">{log.slice(0, 10)}</span>
                  <span className="text-zinc-300">{log.slice(10)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Small footer */}
      <footer className="py-8 text-center text-xs text-[#727272] border-t border-[#e8e8e5] mt-12 bg-[#fafaf7]">
        <p>&copy; {new Date().getFullYear()} mcomspin Play System. Secured Partner Collaboration.</p>
      </footer>
    </div>
  );
}
