'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerStore, CustomerReward } from '@/store/customer-store';
import { 
  Shirt, 
  Sprout, 
  Zap, 
  Utensils, 
  Ticket, 
  Banknote, 
  Tag, 
  Package, 
  Calendar,
  Flame,
  Settings,
  Gift,
  Sparkles,
  Heart
} from 'lucide-react';

/* ─── MOCK DATA FOR THE CUSTOMER EXPERIENCE ─── */
const interestsList = [
  { id: 'fashion', label: 'Luxury Fashion' },
  { id: 'wellness', label: 'Spas & Wellness' },
  { id: 'tech', label: 'Premium Electronics' },
  { id: 'dining', label: 'Fine Dining & Culinary' },
  { id: 'events', label: 'VIP Events & Concerts' },
];

const categoryList = [
  { id: 'voucher', label: 'Direct Cash Vouchers' },
  { id: 'discount', label: 'Exclusive Discounts' },
  { id: 'product', label: 'Free Physical Products' },
  { id: 'appointment', label: 'Priority Spa Bookings' },
];

const getInterestIcon = (id: string, className = "w-5 h-5") => {
  switch (id) {
    case 'fashion': return <Shirt className={className} />;
    case 'wellness': return <Sprout className={className} />;
    case 'tech': return <Zap className={className} />;
    case 'dining': return <Utensils className={className} />;
    case 'events': return <Ticket className={className} />;
    default: return <Sparkles className={className} />;
  }
};

const getCategoryIcon = (id: string, className = "w-5 h-5") => {
  switch (id) {
    case 'voucher': return <Banknote className={className} />;
    case 'discount': return <Tag className={className} />;
    case 'product': return <Package className={className} />;
    case 'appointment': return <Calendar className={className} />;
    default: return <Gift className={className} />;
  }
};

const mockMarketplacePartners = [
  {
    name: 'Meridian Apparel',
    category: 'Luxury Fashion',
    avatar: 'MA',
    color: 'from-rose-50 to-rose-100/50',
    border: 'hover:border-rose-300',
    textColor: 'text-rose-600',
    description: 'High-end styling and premium sustainable garments.',
    offersCount: 3,
    activeCampaign: 'Summer Lead Blitz',
  },
  {
    name: 'Elara Wellness',
    category: 'Spa Services',
    avatar: 'EW',
    color: 'from-teal-50 to-teal-100/50',
    border: 'hover:border-teal-300',
    textColor: 'text-teal-600',
    description: 'Bespoke therapeutic massage, skin therapy, and organic tea bars.',
    offersCount: 2,
    activeCampaign: 'Partner Spotlight Q3',
  },
  {
    name: 'Vantage Electronics',
    category: 'Consumer Tech',
    avatar: 'VE',
    color: 'from-indigo-50 to-indigo-100/50',
    border: 'hover:border-indigo-300',
    textColor: 'text-indigo-600',
    description: 'Premium smart home adapters, wireless chargers, and audio peripherals.',
    offersCount: 4,
    activeCampaign: 'Tech Core Stock Release',
  },
  {
    name: 'Soleil Dining Group',
    category: 'Hospitality',
    avatar: 'SD',
    color: 'from-amber-50 to-amber-100/50',
    border: 'hover:border-amber-300',
    textColor: 'text-amber-600',
    description: 'Michelin-starred tasting tables, custom wine pairings, and elite lounges.',
    offersCount: 2,
    activeCampaign: 'Gourmet Lounge Rotating Spotlight',
  },
];

const spinPrizes = [
  { title: '20% Off Styling Session', provider: 'Meridian Apparel', providerLogo: 'MA', type: 'discount' as const, value: '20% Off', details: 'Valid on custom styling appointments.' },
  { title: 'Complimentary Detox Facial', provider: 'Elara Wellness', providerLogo: 'EW', type: 'appointment' as const, value: 'Free Facial', details: 'Full 30-min organic botanical skin clearing session.' },
  { title: 'Premium Multi-Adapter Charger', provider: 'Vantage Electronics', providerLogo: 'VE', type: 'product' as const, value: 'Free Charger', details: 'Grab our ultra-slim multi-socket home charger.' },
  { title: '£50 Gourmet Tasting Credit', provider: 'Soleil Dining Group', providerLogo: 'SD', type: 'voucher' as const, value: '£50 Credit', details: 'Applied instantly to your dine-in table balance.' },
  { title: 'VIP Apparel Showcase Pass', provider: 'Meridian Apparel', providerLogo: 'MA', type: 'exclusive' as const, value: 'VIP Entry', details: 'Priority seat booking at the upcoming fashion show.' },
  { title: 'Signature Organic Massage', provider: 'Elara Wellness', providerLogo: 'EW', type: 'appointment' as const, value: 'Free Massage', details: 'Full 45-min therapeutic thermal stone massage.' },
];

export default function CustomerPortal() {
  const {
    profile,
    wallet,
    notifications,
    activity,
    activeView,
    revealedReward,
    onboardingStep,
    completeOnboarding,
    setOnboardingStep,
    setView,
    decrementSpins,
    unlockReward,
    redeemReward,
    setRevealedReward,
    addPoints,
    markNotificationsRead,
  } = useCustomerStore();

  /* ─── INTERACTION STATE ─── */
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [selectedWalletReward, setSelectedWalletReward] = useState<CustomerReward | null>(null);
  const [activePartnerStorefront, setActivePartnerStorefront] = useState<typeof mockMarketplacePartners[0] | null>(null);
  const [walletFilter, setWalletFilter] = useState<'all' | 'active' | 'redeemed'>('all');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  /* ─── INITIAL LOGIC ─── */
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleStartOnboarding = () => {
    setOnboardingStep(1);
  };

  const handleNextStep = () => {
    if (onboardingStep === 1 && (!nameInput || !emailInput)) {
      alert('Please enter your name and email to proceed.');
      return;
    }
    setOnboardingStep(onboardingStep + 1);
  };

  const handleFinishOnboarding = () => {
    completeOnboarding(nameInput, emailInput, selectedInterests, selectedCategories);
    setOnboardingStep(4); // Welcome unlock page
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  /* ─── SPIN THE ENGINE WHEEL ─── */
  const handleSpin = () => {
    if (profile.availableSpins <= 0 || isSpinning) return;
    setIsSpinning(true);
    decrementSpins();

    const randomPrizeIndex = Math.floor(Math.random() * spinPrizes.length);
    const targetPrize = spinPrizes[randomPrizeIndex];
    
    // Smooth deceleration calculation
    const baseSpins = 4; // 4 full rotations
    const degPerSlice = 360 / spinPrizes.length;
    const finalDeg = baseSpins * 360 + (360 - (randomPrizeIndex * degPerSlice + degPerSlice / 2));
    
    setRotationDegrees(prev => prev + finalDeg);

    setTimeout(() => {
      setIsSpinning(false);
      // Inject reward directly into the Zustand wallet and trigger Reveal modal
      unlockReward(targetPrize);
    }, 4500); // 4.5s cinematic deceleration
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-body relative overflow-x-hidden flex flex-col justify-between selection:bg-[#f97316]/10 selection:text-[#f97316]">
      {/* Glow overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#f97316]/[0.02] to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-[-100px] w-[400px] h-[400px] bg-gradient-to-t from-[#f97316]/[0.02] to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* ─── HEADER / NAVIGATION ─── */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#eee] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left">
            <span className="w-3 h-3 bg-[#f97316] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-lg tracking-tight text-[#1a1a1a]">MComSpin</span>
            <span className="text-[10px] bg-stone-100 text-[#888] font-bold px-2 py-0.5 rounded-full border border-stone-200">CLIENT</span>
          </button>

          {/* Nav Items */}
          {profile.onboardingCompleted ? (
            <nav className="hidden md:flex items-center gap-6 text-[12px] font-bold uppercase tracking-[0.1em] text-[#666]">
              <button onClick={() => setView('dashboard')} className={`hover:text-[#1a1a1a] transition-colors ${activeView === 'dashboard' ? 'text-[#f97316]' : ''}`}>My Hub</button>
              <button onClick={() => setView('rewards')} className={`hover:text-[#1a1a1a] transition-colors ${activeView === 'rewards' ? 'text-[#f97316]' : ''}`}>Rewards</button>
              <button onClick={() => setView('spin')} className={`hover:text-[#1a1a1a] transition-colors ${activeView === 'spin' ? 'text-[#f97316]' : ''} flex items-center gap-1.5`}>
                Play Spin 
                {profile.availableSpins > 0 && (
                  <span className="bg-[#f97316] text-white px-1.5 py-0.5 rounded-full text-[9px] font-extrabold animate-pulse">{profile.availableSpins}</span>
                )}
              </button>
              <button onClick={() => setView('partners')} className={`hover:text-[#1a1a1a] transition-colors ${activeView === 'partners' ? 'text-[#f97316]' : ''}`}>Partners</button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[12px] text-[#888] font-medium">Explore premium partner campaigns</span>
            </div>
          )}

          {/* User Widgets (Streak, Notifications, Account) */}
          <div className="flex items-center gap-3">
            {profile.onboardingCompleted && (
              <>
                {/* Streak Badge */}
                <div className="flex items-center gap-1.5 bg-[#fafaf9] border border-[#eee] rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#1a1a1a] shadow-sm select-none">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  <span>{profile.streakDays} Day Streak</span>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotificationsDropdown(!showNotificationsDropdown);
                      markNotificationsRead();
                    }}
                    className="p-2 hover:bg-stone-50 border border-[#eee] rounded-full transition-colors relative"
                  >
                    <svg className="w-4 h-4 text-[#555]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.041 9.041 0 01-1.857-.082c-1.8-.096-3.182-1.634-3.182-3.418v-3.9a4.5 4.5 0 019 0v3.9c0 1.784-1.382 3.322-3.182 3.418z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5a4.5 4.5 0 00-4.5 4.5v3a3 3 0 003 3h10.5a3 3 0 003-3v-3a4.5 4.5 0 00-4.5-4.5" />
                    </svg>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f97316] rounded-full ring-2 ring-white animate-ping" />
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotificationsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#eee] shadow-xl p-4 space-y-3 z-50 text-left"
                      >
                        <div className="flex items-center justify-between border-b border-[#f5f5f3] pb-2">
                          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1a1a1a]">Ecosystem Alerts</span>
                          <button onClick={() => setShowNotificationsDropdown(false)} className="text-[10px] text-[#bbb] hover:text-[#555] font-bold">Close</button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2.5">
                          {notifications.map(n => (
                            <div key={n.id} className="p-2.5 rounded-xl border border-stone-50 bg-[#fafaf9] flex items-start gap-3">
                              <span className="text-base mt-0.5">
                                {n.type === 'reward' ? (
                                  <Gift className="w-4 h-4 text-orange-500" />
                                ) : n.type === 'streak' ? (
                                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                ) : (
                                  <Settings className="w-4 h-4 text-[#888]" />
                                )}
                              </span>
                              <div className="space-y-0.5">
                                <p className="text-[12px] font-bold text-[#1a1a1a] leading-tight">{n.title}</p>
                                <p className="text-[11px] text-[#888] leading-normal">{n.description}</p>
                                <p className="text-[9px] text-[#bbb] font-semibold">{n.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Profile CTA */}
            {profile.onboardingCompleted ? (
              <button
                onClick={() => setView('profile')}
                className="w-9 h-9 rounded-full overflow-hidden border border-[#eee] hover:border-[#f97316] transition-colors shadow-sm"
              >
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </button>
            ) : (
              <button
                onClick={handleStartOnboarding}
                className="bg-[#1a1a1a] hover:bg-[#f97316] text-white text-[11px] font-bold uppercase tracking-[0.12em] px-4.5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT SUITE ─── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Onboarding Dialog Override */}
        {onboardingStep > 0 && onboardingStep < 4 && (
          <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl border border-[#eee] shadow-xl p-8 space-y-6 relative overflow-hidden">
              {/* Decorative design nodes */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f97316]/[0.03] rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#f97316]/[0.02] rounded-full blur-lg pointer-events-none" />

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-[#888] uppercase tracking-wider">
                  <span>Step {onboardingStep} of 3</span>
                  <span>{onboardingStep === 1 ? 'Details' : onboardingStep === 2 ? 'Interests' : 'Categories'}</span>
                </div>
                <div className="h-1 bg-[#f5f5f3] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#f97316] transition-all duration-300 rounded-full" 
                    style={{ width: `${(onboardingStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Input details */}
              {onboardingStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-xl font-display font-bold text-[#1a1a1a]">Join MComSpin</h2>
                    <p className="text-[#888] text-[13px] mt-1">Unlock curated business rewards and premium interactive experiences.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Preferred Name</label>
                      <input 
                        type="text" 
                        placeholder="Your Name"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="you@email.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Interests selection */}
              {onboardingStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-xl font-display font-bold text-[#1a1a1a]">Your Personal Interests</h2>
                    <p className="text-[#888] text-[13px] mt-1">Select topics you love to help us source premium partner campaigns.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {interestsList.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`flex items-center gap-3.5 p-3 rounded-xl border text-left transition-all ${
                          selectedInterests.includes(item.id)
                            ? 'border-[#f97316] bg-orange-50/30'
                            : 'border-[#eee] bg-[#fafaf9] hover:bg-stone-50'
                        }`}
                      >
                        {getInterestIcon(item.id, "w-5 h-5 text-[#f97316]")}
                        <span className="text-[13px] font-bold text-[#1a1a1a]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Preferred categories */}
              {onboardingStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-xl font-display font-bold text-[#1a1a1a]">Reward Categories</h2>
                    <p className="text-[#888] text-[13px] mt-1">What types of commerce rewards do you prefer to collect?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {categoryList.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCategory(item.id)}
                        className={`flex items-center gap-3.5 p-3 rounded-xl border text-left transition-all ${
                          selectedCategories.includes(item.id)
                            ? 'border-[#f97316] bg-orange-50/30'
                            : 'border-[#eee] bg-[#fafaf9] hover:bg-stone-50'
                        }`}
                      >
                        {getCategoryIcon(item.id, "w-5 h-5 text-[#f97316]")}
                        <span className="text-[13px] font-bold text-[#1a1a1a]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Nav actions */}
              <div className="flex gap-3 pt-3 border-t border-[#f5f5f3]">
                {onboardingStep > 1 && (
                  <button
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#666] border border-[#eee] rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={onboardingStep === 3 ? handleFinishOnboarding : handleNextStep}
                  className="flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white bg-[#1a1a1a] hover:bg-[#f97316] rounded-xl transition-all shadow-md"
                >
                  {onboardingStep === 3 ? 'Finalize Profile' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Reward Unlock Override */}
        {onboardingStep === 4 && (
          <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-white rounded-3xl border border-[#eee] shadow-2xl p-8 space-y-6 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-center">
                <Gift className="w-12 h-12 text-[#f97316] animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#f97316] uppercase">Welcome Reward Unlocked</p>
                <h2 className="text-2xl font-display font-bold text-[#1a1a1a]">You Are Now Connected!</h2>
                <p className="text-[#888] text-[13px]">We pre-loaded your profile with a Welcome Gift from our Luxury Fashion partner.</p>
              </div>

              {/* Visual Card */}
              <div className="p-5 rounded-2xl border border-dashed border-[#f97316]/30 bg-orange-50/20 max-w-sm mx-auto space-y-3 relative">
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-[#f97316] text-white px-2 py-0.5 rounded uppercase">Voucher</span>
                <p className="text-[12px] font-bold text-[#888]">Meridian Apparel</p>
                <h3 className="text-xl font-display font-extrabold text-[#1a1a1a]">£15 Storewide Off</h3>
                <p className="text-[11px] text-[#888]">Auto-added to your wallet. You also received +1 Bonus Spin!</p>
              </div>

              <button
                onClick={() => {
                  setOnboardingStep(0);
                  setView('dashboard');
                }}
                className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-md"
              >
                Go to My Dashboard
              </button>
            </motion.div>
          </div>
        )}


        {/* ─── VIEW 1: PUBLIC HOMEPAGE / LANDING ─── */}
        {activeView === 'home' && (
          <div className="space-y-20">
            {/* HERO SECTION */}
            <div className="text-center space-y-8 py-10 relative">
              <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
              
              <div className="space-y-4 max-w-3xl mx-auto relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.2em] bg-white border border-[#eee] px-4 py-1.5 rounded-full text-[#f97316] uppercase shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-[#f97316]" />
                  Premium Gamified Commerce
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-[#1a1a1a] leading-[1.08] mt-3">
                  Discover Connected <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-amber-600">Business Rewards.</span>
                </h1>
                <p className="text-[#888] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                  Join a high-end collaborative ecosystem where top-tier brands coordinate gamified surprises, premium physical vouchers, and storefront perks.
                </p>
              </div>

              {/* Hero Call-To-Action */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
                {profile.onboardingCompleted ? (
                  <button
                    onClick={() => setView('dashboard')}
                    className="bg-[#1a1a1a] hover:bg-[#f97316] text-white text-[11px] font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-xl transition-all shadow-lg active:scale-98"
                  >
                    Open Member Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleStartOnboarding}
                      className="bg-[#1a1a1a] hover:bg-[#f97316] text-white text-[11px] font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-xl transition-all shadow-lg active:scale-98"
                    >
                      Start Exploring
                    </button>
                    <button
                      onClick={() => {
                        // Quick onboarding demo login
                        completeOnboarding('Jane Doe', 'jane@business.com', ['fashion', 'wellness'], ['voucher', 'product']);
                        setOnboardingStep(4);
                      }}
                      className="bg-white border border-[#eee] text-[#1a1a1a] hover:border-[#1a1a1a] text-[11px] font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-xl transition-all shadow-sm active:scale-98"
                    >
                      Quick Demo Entry
                    </button>
                  </>
                )}
              </div>

              {/* Floating Cards Graphic */}
              <div className="pt-10 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto opacity-90 select-none pointer-events-none">
                {[
                  { title: '£50 Gourmet Credit', provider: 'Soleil Dining', color: 'border-amber-200' },
                  { title: 'Free Signature Facial', provider: 'Elara Wellness', color: 'border-teal-200' },
                  { title: 'VIP Apparel Pass', provider: 'Meridian Apparel', color: 'border-rose-200' },
                ].map((card, i) => (
                  <div 
                    key={i} 
                    className={`bg-white rounded-2xl border ${card.color} shadow-sm px-6 py-4 flex flex-col items-start gap-1 w-60 transform ${
                      i === 0 ? '-rotate-2 translate-y-2' : i === 2 ? 'rotate-2 translate-y-3' : ''
                    } transition-transform`}
                  >
                    <span className="text-[10px] text-[#bbb] font-extrabold uppercase tracking-wider">{card.provider}</span>
                    <p className="text-[13px] font-bold text-[#1a1a1a]">{card.title}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] text-[#bbb] font-bold uppercase">Ready to Reveal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PARTNER BRANDS GRID */}
            <div className="space-y-6 max-w-4xl mx-auto text-center">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">Ecosystem network</p>
                <h2 className="text-2xl font-display font-bold text-[#1a1a1a]">Participating Establishments</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockMarketplacePartners.map((item) => (
                  <div key={item.name} className="bg-white rounded-2xl border border-[#eee] p-5 shadow-sm text-center space-y-2 hover:border-[#f97316]/20 transition-all">
                    <span className="w-10 h-10 rounded-xl bg-stone-50 border border-[#eee] flex items-center justify-center font-bold text-[13px] mx-auto text-[#666]">
                      {item.avatar}
                    </span>
                    <h3 className="text-[13px] font-bold text-[#1a1a1a]">{item.name}</h3>
                    <p className="text-[#888] text-[11px]">{item.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* ─── VIEW 2: CUSTOMER DASHBOARD ─── */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Hub Welcome Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-white border border-[#eee] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={profile.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border border-[#eee]" />
                <div className="space-y-0.5">
                  <p className="text-[#888] text-[12px] font-semibold">Welcome back,</p>
                  <h1 className="text-xl font-display font-bold text-[#1a1a1a]">{profile.name || 'Ecosystem Explorer'}</h1>
                  <p className="text-[#888] text-[11px]">Rank: Silver Tier • streak score +{profile.totalPoints} points</p>
                </div>
              </div>

              {/* Mini counters */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[#888] text-[10px] uppercase font-bold tracking-wider">Available Spins</p>
                  <p className="text-xl font-display font-extrabold text-[#f97316] mt-0.5">{profile.availableSpins}</p>
                </div>
                <div className="h-6 w-px bg-[#eee]" />
                <div className="text-center">
                  <p className="text-[#888] text-[10px] uppercase font-bold tracking-wider">Saved Rewards</p>
                  <p className="text-xl font-display font-extrabold text-[#1a1a1a] mt-0.5">
                    {wallet.filter(w => w.status === 'active').length}
                  </p>
                </div>
                <div className="h-6 w-px bg-[#eee]" />
                <div className="text-center">
                  <button
                    onClick={() => setView('spin')}
                    disabled={profile.availableSpins <= 0}
                    className="bg-[#1a1a1a] hover:bg-[#f97316] disabled:bg-stone-100 disabled:text-[#aaa] text-white text-[10px] font-extrabold uppercase tracking-[0.1em] px-4.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:scale-100"
                  >
                    Spin Wheel Now
                  </button>
                </div>
              </div>
            </div>

            {/* Main Area: Wallet & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Wallet Section (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                  <h2 className="text-base font-display font-semibold text-[#1a1a1a]">My Digital Reward Wallet</h2>
                  <div className="flex items-center bg-[#f5f5f3] rounded-lg p-0.5 gap-0.5">
                    {(['all', 'active', 'redeemed'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setWalletFilter(tab)}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-[0.08em] transition-all ${
                          walletFilter === tab ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#888]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wallet Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wallet
                    .filter(w => {
                      if (walletFilter === 'active') return w.status === 'active';
                      if (walletFilter === 'redeemed') return w.status === 'redeemed';
                      return true;
                    })
                    .map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedWalletReward(item)}
                        className={`bg-white rounded-2xl border p-5 flex flex-col justify-between h-40 cursor-pointer hover:shadow-md hover:border-[#f97316]/20 transition-all text-left relative ${
                          item.status === 'redeemed' ? 'border-[#eee] opacity-60' : 'border-[#eee]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-stone-100 text-[#666] font-bold px-2 py-0.5 rounded border border-[#eee] uppercase">
                              {item.provider}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              item.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-200 text-stone-500'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <h3 className="text-[14px] font-bold text-[#1a1a1a] mt-2 leading-tight">{item.title}</h3>
                          <p className="text-[#888] text-[11px] truncate">{item.details}</p>
                        </div>

                        <div className="border-t border-[#f5f5f3] pt-3 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#bbb]">CODE: {item.code}</span>
                          <span className="text-[10px] text-[#f97316] font-semibold flex items-center gap-0.5">
                            Reveal QR 
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063 1.06l-.041.02a.75.75 0 11-1.063-1.06zm0 0v-4.5m0 4.5h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Activity / Progress (4 cols) */}
              <div className="lg:col-span-4 space-y-6 text-left">
                <h2 className="text-base font-display font-semibold text-[#1a1a1a] border-b border-[#eee] pb-3">Ecosystem Streaks</h2>
                
                {/* Timeline activity log */}
                <div className="bg-white rounded-2xl border border-[#eee] p-5 space-y-4">
                  <h3 className="text-[11px] font-bold text-[#888] uppercase tracking-wider">Activity Feed</h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {activity.map(act => (
                      <div key={act.id} className="flex gap-3 text-left">
                        <span className="text-base mt-0.5">
                          {act.type === 'redeem' ? (
                            <Ticket className="w-4 h-4 text-orange-500 animate-pulse" />
                          ) : act.type === 'spin' ? (
                            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                          ) : (
                            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                          )}
                        </span>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold text-[#1a1a1a] leading-tight">{act.description}</p>
                          <p className="text-[9px] text-[#bbb] font-semibold">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ─── VIEW 3: REWARDS CENTER ─── */}
        {activeView === 'rewards' && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Rewards Center</p>
              <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Explore Reward Library</h1>
              <p className="text-[#888] text-[13px]">Intelligent discounts, appointments, and physically stocked items from luxury partners.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spinPrizes.map((prize, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#eee] p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-stone-50 border border-[#eee] text-[#666] font-bold px-2 py-0.5 rounded uppercase">
                        {prize.provider}
                      </span>
                      <span className="text-[9px] text-[#bbb] font-bold uppercase tracking-wider">Expires 30d</span>
                    </div>
                    <h3 className="text-base font-display font-bold text-[#1a1a1a]">{prize.title}</h3>
                    <p className="text-[12px] text-[#888] leading-relaxed">{prize.details}</p>
                  </div>

                  <div className="border-t border-[#f5f5f3] pt-4 flex items-center justify-between">
                    <span className="text-[14px] font-display font-bold text-[#f97316]">{prize.value}</span>
                    <button 
                      onClick={() => {
                        // Directly try to claim/unlock
                        unlockReward(prize);
                      }}
                      className="text-[10px] font-bold uppercase tracking-[0.1em] px-3.5 py-2 bg-[#1a1a1a] hover:bg-[#f97316] text-white rounded-xl transition-all shadow-sm"
                    >
                      Unlock Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── VIEW 4: ACTIVE SPIN ENGINE ─── */}
        {activeView === 'spin' && (
          <div className="space-y-8 animate-fadeIn text-center max-w-2xl mx-auto">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Ecosystem engine</p>
              <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Interactive Reward Spin</h1>
              <p className="text-[#888] text-[13px]">You have <span className="text-[#f97316] font-bold">{profile.availableSpins} spins</span> available. Decoiler deceleration is pre-calibrated.</p>
            </div>

            {/* Spinner Wheel Wrapper */}
            <div className="py-8 flex flex-col items-center justify-center relative select-none">
              
              {/* Spinner wheel indicator needle */}
              <div 
                className="absolute -top-1.5 z-20 w-8 h-10 drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)] transition-transform duration-150 active:scale-95"
              >
                <svg viewBox="0 0 30 40" className="w-full h-full" fill="none">
                  <path 
                    d="M15,0 L30,12 L22,35 L15,40 L8,35 L0,12 Z" 
                    fill="url(#needleGrad)" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M15,4 L26,13 L19,32 L15,36 L11,32 L4,13 Z" 
                    fill="#f97316" 
                  />
                  <circle cx="15" cy="13" r="3.5" fill="#ffffff" />
                  <defs>
                    <linearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Wheel element */}
              <div className="relative w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] rounded-full border-[12px] border-white ring-4 ring-orange-50/50 shadow-2xl bg-[#fafaf9] overflow-hidden flex items-center justify-center">
                <div 
                  className="w-full h-full rounded-full transition-transform duration-[4500ms] ease-[cubic-bezier(0.1,0.8,0.1,1)] relative"
                  style={{ transform: `rotate(${rotationDegrees}deg)` }}
                >
                  {/* Wheel slices using SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {spinPrizes.map((prize, idx) => {
                      const angle = 360 / spinPrizes.length;
                      const rotate = idx * angle;
                      const radStart = (rotate * Math.PI) / 180;
                      const radEnd = ((rotate + angle) * Math.PI) / 180;
                      const x1 = 50 + 50 * Math.cos(radStart);
                      const y1 = 50 + 50 * Math.sin(radStart);
                      const x2 = 50 + 50 * Math.cos(radEnd);
                      const y2 = 50 + 50 * Math.sin(radEnd);
                      
                      return (
                        <g key={idx}>
                          <path
                            d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                            fill={idx % 2 === 0 ? '#ffffff' : '#fff7ed'}
                            stroke="#f5f5f3"
                            strokeWidth="0.3"
                          />
                          {/* Radial text layout */}
                          <g transform={`rotate(${rotate + angle / 2} 50 50)`}>
                            {/* Segment divider accent */}
                            <line x1="50" y1="50" x2="98" y2="50" stroke="#fddfcc" strokeWidth="0.25" strokeDasharray="1, 1" />
                            
                            {/* Provider code near the outer rim */}
                            <text
                              x="88"
                              y="51"
                              fill="#f97316"
                              fontSize="2.2"
                              fontWeight="900"
                              textAnchor="end"
                              className="font-display tracking-wider"
                            >
                              {prize.providerLogo}
                            </text>
                            
                            {/* Reward Value closer to the center */}
                            <text
                              x="78"
                              y="51"
                              fill="#292524"
                              fontSize="2.5"
                              fontWeight="800"
                              textAnchor="end"
                              className="font-display"
                            >
                              {prize.value}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                    
                    {/* Golden/Orange Rim Indicator Lights */}
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="1, 3.5" className="opacity-90 animate-pulse-ring" />
                  </svg>
                  
                  {/* Premium center cap with metallic gradient & border */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-white to-[#fff7ed] border-[3px] border-white shadow-xl rounded-full flex items-center justify-center font-display font-extrabold text-[10px] text-[#f97316] z-10 uppercase tracking-widest ring-2 ring-orange-100">
                    MSpin
                  </div>
                </div>
              </div>

              {/* Action Spin Button */}
              <button
                onClick={handleSpin}
                disabled={profile.availableSpins <= 0 || isSpinning}
                className="mt-8 bg-[#1a1a1a] hover:bg-[#f97316] disabled:bg-stone-100 disabled:text-[#aaa] text-white text-[11px] font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-xl transition-all shadow-md active:scale-95 disabled:scale-100 flex items-center gap-2"
              >
                {isSpinning ? 'Decelerating...' : 'Spin Wheel'}
                {!isSpinning && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}


        {/* ─── VIEW 5: PARTNER MARKETPLACE & INTEGRATIONS ─── */}
        {activeView === 'partners' && (
          <div className="space-y-10 animate-fadeIn text-left">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Collaborative Commerce</p>
              <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Connected Partner Directory</h1>
              <p className="text-[#888] text-[13px]">Explore active storefronts and unlock targeted merchant benefits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockMarketplacePartners.map((item) => (
                <div key={item.name} className="bg-white rounded-3xl border border-[#eee] p-6 hover:shadow-md transition-all flex flex-col justify-between gap-5 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="w-12 h-12 rounded-2xl bg-stone-50 border border-[#eee] flex items-center justify-center font-display font-bold text-[14px] text-[#666]">
                        {item.avatar}
                      </span>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-display font-bold text-[#1a1a1a]">{item.name}</h3>
                        <p className="text-[12px] text-[#888]">{item.category}</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#888] leading-relaxed">{item.description}</p>
                  </div>

                  <div className="border-t border-[#f5f5f3] pt-4 flex items-center justify-between">
                    <span className="text-[11px] bg-orange-50 text-[#f97316] font-bold px-2.5 py-1 rounded-lg uppercase">
                      {item.offersCount} Active Offers
                    </span>
                    <button 
                      onClick={() => setActivePartnerStorefront(item)}
                      className="text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#f97316] text-white rounded-xl transition-all shadow-sm"
                    >
                      Visit Storefront
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ─── VIEW 6: CUSTOMER PROFILE ─── */}
        {activeView === 'profile' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#eee] p-8 shadow-sm space-y-6 text-left animate-fadeIn">
            <div className="text-center space-y-3 pb-6 border-b border-[#f5f5f3]">
              <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-3xl object-cover border border-[#eee] mx-auto shadow-sm" />
              <div className="space-y-0.5">
                <h2 className="text-xl font-display font-bold text-[#1a1a1a]">{profile.name || 'Member'}</h2>
                <p className="text-[12px] text-[#888]">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Onboarding Preferences</h3>
              
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#888] uppercase">Selected Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.categories.map(cat => (
                    <span key={cat} className="text-[11px] bg-stone-50 border border-[#eee] text-[#666] px-2.5 py-1 rounded-lg font-bold uppercase">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#888] uppercase">Monetization Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map(int => (
                    <span key={int} className="text-[11px] bg-stone-50 border border-[#eee] text-[#666] px-2.5 py-1 rounded-lg font-bold uppercase">
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                useCustomerStore.getState().resetCustomerSession();
                setView('home');
              }}
              className="w-full py-3.5 border border-[#eee] hover:border-red-200 hover:bg-red-50/20 text-[#666] hover:text-red-500 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] transition-all text-center"
            >
              Sign Out & Reset Profile
            </button>
          </div>
        )}

      </main>

      {/* ─── SIMULATED STOREFRONT PANEL (IFRAME MODAL) ─── */}
      <AnimatePresence>
        {activePartnerStorefront && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a1a1a]/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#eee] flex flex-col h-[550px] relative text-left"
            >
              {/* Browser bar */}
              <div className="bg-[#fafaf9] px-4 py-3 border-b border-[#eee] flex items-center justify-between gap-4">
                <div className="flex gap-1.5 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white border border-[#eee] text-[#888] text-[10px] font-medium py-1 px-4 rounded-lg text-center font-mono w-[380px] truncate shadow-inner">
                  https://www.{activePartnerStorefront.name.toLowerCase().replace(' ', '')}.com/shop
                </div>
                <button
                  onClick={() => setActivePartnerStorefront(null)}
                  className="text-[11px] font-bold text-[#888] hover:text-[#1a1a1a] uppercase tracking-wide"
                >
                  Close
                </button>
              </div>

              {/* Web simulator viewport */}
              <div className="flex-1 p-8 bg-[#fafaf9] flex flex-col justify-between relative overflow-y-auto">
                <div className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold tracking-widest text-[#f97316] uppercase">{activePartnerStorefront.category}</span>
                    <h2 className="text-2xl font-display font-extrabold text-[#1a1a1a]">{activePartnerStorefront.name}</h2>
                    <p className="text-[13px] text-[#888] leading-relaxed">{activePartnerStorefront.description}</p>
                  </div>

                  <div className="h-px bg-[#eee]" />

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-[#eee] p-4 rounded-2xl space-y-2 shadow-sm">
                      <div className="w-full h-24 bg-stone-50 border border-stone-100 rounded-xl" />
                      <p className="text-[12px] font-bold text-[#1a1a1a]">Premium Collection Item A</p>
                      <p className="text-[11px] text-[#f97316] font-bold">£149.00</p>
                    </div>
                    <div className="bg-white border border-[#eee] p-4 rounded-2xl space-y-2 shadow-sm">
                      <div className="w-full h-24 bg-stone-50 border border-stone-100 rounded-xl" />
                      <p className="text-[12px] font-bold text-[#1a1a1a]">Premium Collection Item B</p>
                      <p className="text-[11px] text-[#f97316] font-bold">£219.00</p>
                    </div>
                  </div>
                </div>

                {/* Embedded Widget Embed Simulator */}
                <div className="absolute bottom-6 right-6 z-25">
                  <div className="bg-white border border-[#eee] shadow-xl p-4 rounded-2xl w-[220px] space-y-3.5 border-t-4 border-t-[#f97316] animate-bounce">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#1a1a1a]">MComSpin Embed</span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#555] leading-normal">You have saved rewards in your wallet!</p>
                    <button 
                      onClick={() => {
                        setActivePartnerStorefront(null);
                        setView('dashboard');
                      }}
                      className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-2 rounded-lg text-[9px] font-bold uppercase tracking-[0.08em] transition-all"
                    >
                      Redeem via Wallet
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ─── REWARD WALLET MODAL DETAIL (QR CODE VIEW) ─── */}
      <AnimatePresence>
        {selectedWalletReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a1a1a]/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-sm w-full bg-white rounded-3xl border border-[#eee] shadow-2xl p-6 text-center space-y-5 relative overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b border-[#f5f5f3] pb-3">
                <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">{selectedWalletReward.provider}</span>
                <button onClick={() => setSelectedWalletReward(null)} className="text-[10px] text-[#bbb] hover:text-[#555] font-bold uppercase">Close</button>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-lg font-display font-extrabold text-[#1a1a1a]">{selectedWalletReward.title}</h3>
                <p className="text-[#888] text-[12px] leading-relaxed max-w-[280px] mx-auto">{selectedWalletReward.details}</p>
              </div>

              {/* QR Barcode placeholder */}
              <div className="bg-[#fafaf9] border border-[#eee] rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 max-w-[180px] mx-auto shadow-inner">
                {/* Visual grid layout matching a QR code */}
                <div className="grid grid-cols-5 gap-1.5 w-24 h-24 bg-white p-2 border border-[#eee] rounded-lg">
                  {[...Array(25)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${
                        i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24 
                          ? 'bg-[#1a1a1a]' 
                          : 'bg-white'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-[#aaa] uppercase tracking-wide">ID: {selectedWalletReward.code}</span>
              </div>

              {selectedWalletReward.status === 'active' ? (
                <button
                  onClick={() => {
                    redeemReward(selectedWalletReward.id);
                    setSelectedWalletReward(null);
                  }}
                  className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-all shadow-md"
                >
                  Mark as Redeemed at Counter
                </button>
              ) : (
                <div className="bg-stone-50 border border-[#eee] text-[#bbb] py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em] text-center">
                  Reward Already Claimed
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ─── DYNAMIC REVEAL MODAL ─── */}
      <AnimatePresence>
        {revealedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a1a1a]/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.85, rotate: 2 }}
              className="max-w-md w-full bg-white rounded-3xl border border-[#eee] shadow-2xl p-8 text-center space-y-6 relative overflow-hidden"
            >
              {/* Confetti or spark glow */}
              <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#f97316]/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex justify-center items-center gap-1.5 text-[#f97316] animate-bounce">
                <Sparkles className="w-8 h-8 text-amber-400" />
                <Gift className="w-14 h-14" />
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#f97316] uppercase">Reward Successfully Unlocked</span>
                <h2 className="text-2xl font-display font-extrabold text-[#1a1a1a]">Surprise Claimed!</h2>
                <p className="text-[#888] text-[13px]">Your spin decycled correctly. Grab your partner coupon below.</p>
              </div>

              {/* Premium Voucher Card View */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-[#f97316]/40 bg-orange-50/20 max-w-sm mx-auto space-y-3 relative text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#888] uppercase tracking-wide">{revealedReward.provider}</span>
                  <span className="text-[10px] bg-[#f97316] text-white px-2 py-0.5 rounded font-bold uppercase shadow-sm">{revealedReward.type}</span>
                </div>
                <h3 className="text-xl font-display font-black text-[#1a1a1a]">{revealedReward.title}</h3>
                <p className="text-[12px] text-[#888] leading-relaxed">{revealedReward.details}</p>
                <div className="border-t border-dashed border-[#f97316]/20 pt-3 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-[#bbb]">CODE: {revealedReward.code}</span>
                  <span className="text-[10px] text-[#f97316] font-bold uppercase">{revealedReward.value}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRevealedReward(null);
                    setView('dashboard');
                  }}
                  className="flex-1 bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-all shadow-md"
                >
                  Save to Wallet
                </button>
                <button
                  onClick={() => {
                    // Instantly visit partner storefront
                    const partner = mockMarketplacePartners.find(p => p.name === revealedReward.provider);
                    if (partner) {
                      setRevealedReward(null);
                      setActivePartnerStorefront(partner);
                    } else {
                      setRevealedReward(null);
                      setView('dashboard');
                    }
                  }}
                  className="flex-1 border border-[#eee] hover:border-[#1a1a1a] text-[#1a1a1a] py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-all bg-white"
                >
                  Visit Storefront
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ─── PREMIUM CLIENT MOBILE BOTTOM NAV (APP FEEL) ─── */}
      {profile.onboardingCompleted && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#eee] fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-40 shadow-lg px-2 select-none">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeView === 'dashboard' ? 'text-[#f97316]' : 'text-[#888]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Hub</span>
          </button>

          <button 
            onClick={() => setView('rewards')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeView === 'rewards' ? 'text-[#f97316]' : 'text-[#888]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Library</span>
          </button>

          {/* Floating center Spin Wheel button */}
          <button 
            onClick={() => setView('spin')}
            className="w-12 h-12 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center text-white shadow-md shadow-[#f97316]/20 -translate-y-4 border-4 border-white active:scale-95 transition-transform relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {profile.availableSpins > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#f97316] border border-[#f97316] w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                {profile.availableSpins}
              </span>
            )}
          </button>

          <button 
            onClick={() => setView('partners')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeView === 'partners' ? 'text-[#f97316]' : 'text-[#888]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Shops</span>
          </button>

          <button 
            onClick={() => setView('profile')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeView === 'profile' ? 'text-[#f97316]' : 'text-[#888]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Account</span>
          </button>
        </div>
      )}

      {/* ─── Sleek minimal footer ─── */}
      <footer className={`bg-white border-t border-[#eee] py-6 text-center select-none ${
        profile.onboardingCompleted ? 'mb-16 md:mb-0' : ''
      }`}>
        <p className="inline-flex items-center gap-1 text-[11px] text-[#bbb]">
          MComSpin Collaborative Gamification Network © 2026. Made with <Heart className="w-3 h-3 text-[#f97316] fill-[#f97316] shrink-0" /> for businesses & customers.
        </p>
      </footer>
    </div>
  );
}
