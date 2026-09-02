'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift } from 'lucide-react';
import { useCustomerStore } from '@/store/customer-store';
import { useCustomerDashboard, usePlayGame, useDropBall, useClaimReward } from '@/services/customer';
import { motion, AnimatePresence } from 'framer-motion';

function getRewardIcon(name: string) {
  const n = name?.toLowerCase() || '';
  if (n.includes('haircut') || n.includes('style') || n.includes('salon'))
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.601a8.983 8.283 0 0 1 3.361-6.865 8.213 8.213 0 0 0 3 2.478Z" /></svg>;
  if (n.includes('voucher') || n.includes('gift') || n.includes('card'))
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12c1.38 0 2.5 1.12 2.5 2.5v7c0 1.38-1.12 2.5-2.5 2.5h-12A2.5 2.5 0 0 1 3 15.5v-7A2.5 2.5 0 0 1 5.5 6z" /></svg>;
  if (n.includes('discount') || n.includes('sale') || n.includes('off'))
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>;
  if (n.includes('drink') || n.includes('coffee') || n.includes('cafe'))
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.601a8.983 8.283 0 0 1 3.361-6.865 8.213 8.213 0 0 0 3 2.478Z" /></svg>;
  if (n.includes('cash') || n.includes('cashback') || n.includes('money'))
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 3v.75m0 3v.75m0 3V15m15 0h.008v.008H18.75V15Zm0-2.25h.008v.008H18.75V12.75Zm0-2.25h.008v.008H18.75V10.5Zm0-2.25h.008v.008H18.75V8.25Zm0-2.25h.008v.008H18.75V6Zm-9 13.5V4.5a2.25 2.25 0 0 1 2.25-2.25h1.348c.548 0 1.088.112 1.59.332 1.014.442 1.531 1.503 1.3 2.584l-.538 2.512a2.25 2.25 0 0 0-.07.548V13.5" /></svg>;
  if (n.includes('point') || n.includes('loyalty') || n.includes('star'))
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>;
  return <Gift className="w-5 h-5" />;
}

const GiftBox = ({ reward, isRevealed, label, color }: { reward?: any, isRevealed?: boolean, label?: string, color?: string }) => {
  return (
    <div className="relative group perspective-1000 w-full h-full">
      {/* 3D Box Container */}
      <div className="relative w-full h-full transition-transform duration-500 preserve-3d">
        {/* Box Shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/40 blur-md rounded-full" />
        
        {/* Box Body */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${color || 'from-orange-500 to-orange-700'} border-t border-white/20 shadow-xl flex items-center justify-center overflow-hidden`}>
          {/* Ribbons */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-full bg-yellow-400/80 shadow-inner" />
            <div className="w-full h-4 bg-yellow-400/80 shadow-inner" />
          </div>
          
          {/* Label or Reward Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
            {isRevealed && reward ? (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-white drop-shadow-md mb-1">
                  {getRewardIcon(reward?.name)}
                </div>
                <span className="text-[10px] font-black text-white leading-tight uppercase drop-shadow-sm">
                  {reward.name}
                </span>
              </motion.div>
            ) : (
              <span className="text-white/90 font-black text-xl drop-shadow-lg">
                {label || '?'}
              </span>
            )}
          </div>

          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Box Lid (slightly larger) */}
        <div className={`absolute -top-1 -left-1 -right-1 h-6 rounded-t-xl rounded-b-md bg-gradient-to-b ${color || 'from-orange-400 to-orange-600'} border-t border-white/30 shadow-lg z-20`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-sm shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default function PlayPage() {
  const { profile, completeOnboarding } = useCustomerStore();
  const { data: dashboardData } = useCustomerDashboard();
  const playGame = usePlayGame();
  const dropBall = useDropBall();
  const claimReward = useClaimReward();

  const dash = dashboardData as any;
  const campaign = dash?.featuredCampaigns?.[0] ?? dash?.trendingRewards?.[0] ?? null;
  const [step, setStep] = useState<'landing' | 'eligibility' | 'checking' | 'confirmed' | 'token_check' | 'game_prep' | 'reward_reveal' | 'box_shuffle' | 'ready'>('landing');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [prepStatus, setPrepStatus] = useState('Initializing board...');
  const [boxes, setBoxes] = useState([0, 1, 2, 3, 4, 5]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const isRegistered = profile.onboardingCompleted;

  const handleStartPlaying = () => {
    if (isRegistered) {
      setStep('token_check');
    } else {
      setStep('eligibility');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    completeOnboarding(formData.name, formData.email, [], []);
    setStep('checking');
  };

  useEffect(() => {
    if (step === 'checking') {
      const timer = setTimeout(() => {
        setStep('token_check');
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (step === 'game_prep') {
      const statuses = [
        'Loading physics engine...',
        'Secretly assigning rewards...',
        'Syncing campaign rules...',
        'Ready to play!'
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < statuses.length - 1) {
          setPrepStatus(statuses[++i]);
        } else {
          clearInterval(interval);
          setTimeout(() => setStep('reward_reveal'), 800);
        }
      }, 1000);
      return () => clearInterval(interval);
    }

    if (step === 'reward_reveal') {
      const timer = setTimeout(() => {
        setStep('box_shuffle');
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (step === 'box_shuffle') {
      const shuffleInterval = setInterval(() => {
        setBoxes(prev => {
          const next = [...prev];
          const i = Math.floor(Math.random() * next.length);
          const j = Math.floor(Math.random() * next.length);
          [next[i], next[j]] = [next[j], next[i]];
          return next;
        });
      }, 400);

      const endShuffle = setTimeout(() => {
        clearInterval(shuffleInterval);
        setStep('ready'); // Transition to Step 7 (Moving Ball)
      }, 4000);

      return () => { clearInterval(shuffleInterval); clearTimeout(endShuffle); };
    }
  }, [step]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500 text-sm font-bold">Loading campaign...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-200">
      <AnimatePresence mode="wait">
        
        {/* Step 2: Landing Screen */}
        {step === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Hero Section */}
            <div className="relative h-[40vh] overflow-hidden">
              <img 
                src={campaign?.storeImage || campaign?.imageUrl || '/placeholder-store.jpg'} 
                alt={campaign?.businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 font-bold text-2xl shadow-xl mb-4">
                  {campaign?.businessLogo}
                </div>
                <h1 className="text-white text-3xl font-extrabold tracking-tight drop-shadow-md">
                  {campaign?.businessName}
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 -mt-10 relative z-10">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-stone-200/50">
                <div className="text-center mb-8">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-orange-500 uppercase block mb-2">Exclusive Campaign</span>
                  <h2 className="text-2xl font-black text-stone-900 mb-3">{campaign?.title}</h2>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {campaign?.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 text-center">Win Amazing Rewards</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(campaign?.rewards || []).map((reward: any, i: number) => (
                      <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-stone-50 border border-stone-100 transition-transform hover:scale-[1.02]">
                        <span className={`w-10 h-10 rounded-xl ${reward.color || 'bg-orange-500'} flex items-center justify-center text-white mb-2 shadow-sm`}>
                          {getRewardIcon(reward.name)}
                        </span>
                        <span className="text-[11px] font-bold text-stone-800 text-center">{reward.name}</span>
                        <span className="text-[9px] text-stone-400 text-center">{reward.provider}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleStartPlaying}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black tracking-widest text-sm uppercase transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]"
                >
                  Start Playing & Win
                </button>
              </div>
            </div>

            <footer className="py-8 text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Powered by MCOM Mall Ecosystem
            </footer>
          </motion.div>
        )}

        {/* Step 3: Eligibility Check (Registration) */}
        {step === 'eligibility' && (
          <motion.div 
            key="eligibility"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center p-6 bg-stone-50"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-stone-200 max-w-md w-full">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-stone-900 mb-2">Claim Your Entry</h2>
                <p className="text-stone-500 text-sm">Register quickly to unlock your daily game tokens and save your winnings.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-100 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-100 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-5 rounded-2xl font-black tracking-widest text-sm uppercase transition-all shadow-xl active:scale-[0.98]"
                >
                  Verify & Play
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Loading / Checking Step */}
        {step === 'checking' && (
          <motion.div 
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50"
          >
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-stone-200 rounded-full" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full"
              />
            </div>
            <h2 className="text-xl font-black text-stone-900 uppercase tracking-widest">Checking Eligibility</h2>
            <p className="text-stone-400 text-xs font-bold mt-2">Connecting to MCOM Reward Engine...</p>
          </motion.div>
        )}

        {/* Step 4: Confirmed / Token Check */}
        {(step === 'confirmed' || step === 'token_check') && (
          <motion.div 
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6 bg-stone-50"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-stone-200 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-stone-900 mb-2">Access Granted</h2>
              <p className="text-stone-500 text-sm mb-8">Your account is verified. Let's check your available tokens.</p>
              
              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block mb-1">Play Balance</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-orange-500">{profile.availableSpins}</span>
                    <span className="text-xs font-bold text-stone-400">Tokens</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-bold text-stone-600 bg-orange-100 px-2 py-0.5 rounded-full">1 Daily Ready</span>
                  <span className="text-[10px] font-bold text-stone-400">{profile.availableSpins > 1 ? `+${profile.availableSpins - 1} Bonus` : 'No Bonus'}</span>
                </div>
              </div>

              {profile.availableSpins > 0 ? (
                <button 
                  onClick={() => {
                    setStep('game_prep');
                    playGame.mutate(
                      { campaignId: campaign?.id },
                      {
                        onSuccess: (res: any) => {
                          if (res?.sessionId) {
                            setSessionId(res.sessionId);
                          }
                        },
                        onError: () => {
                          setStep('token_check');
                          alert('Failed to start game. Please try again.');
                        },
                      }
                    );
                  }}
                  disabled={playGame.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black tracking-widest text-sm uppercase transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] disabled:opacity-50"
                >
                  {playGame.isPending ? 'Starting...' : 'Prepare Game Board'}
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-red-500 bg-red-50 py-3 rounded-xl">No tokens remaining for today.</p>
                  <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                    Check back tomorrow for your daily token or make a purchase at any MCOM store to unlock more!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 5: Game Prep */}
        {step === 'game_prep' && (
          <motion.div 
            key="game_prep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6"
          >
            {/* Visual Board Mockup */}
            <div className="relative w-full max-w-sm aspect-[3/4] mb-12 flex flex-col justify-between">
              {/* Pegs structure visualization */}
              <div className="flex-1 grid grid-cols-7 gap-4 p-8">
                {Array.from({ length: 35 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    transition={{ delay: i * 0.02 }}
                    className="w-2 h-2 bg-white rounded-full mx-auto"
                  />
                ))}
              </div>

              {/* Reward Boxes visualization */}
              <div className="grid grid-cols-6 gap-2 px-4 h-20">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((box, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="relative"
                  >
                    <GiftBox label={box} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                <h2 className="text-white text-xl font-black uppercase tracking-[0.2em]">{prepStatus}</h2>
              </div>
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Please stay on this page</p>
            </div>
          </motion.div>
        )}

        {/* Step 5: Reward Reveal */}
        {step === 'reward_reveal' && (
          <motion.div 
            key="reward_reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6"
          >
            <h2 className="text-white text-2xl font-black uppercase tracking-[0.2em] mb-4">The Rewards...</h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-12">Take a look before we hide them!</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-xl">
              {(campaign?.rewards || []).map((reward: any, i: number) => (
                <div key={i} className="h-32">
                  <GiftBox reward={reward} isRevealed={true} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 6: Box Shuffle */}
        {step === 'box_shuffle' && (
          <motion.div 
            key="box_shuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6"
          >
            <h2 className="text-white text-2xl font-black uppercase tracking-[0.2em] mb-12">Watch Closely...</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-xl">
              {boxes.map((boxIndex, i) => (
                <motion.div
                  key={boxIndex}
                  layoutId={`box-${boxIndex}`}
                  className="h-32"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <GiftBox label={String.fromCharCode(65 + boxIndex)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Transition to Ready (Step 7 Start) */}
        {step === 'ready' && (
          <motion.div 
            key="ready"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 text-center"
          >
             <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
              className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <h2 className="text-white text-4xl font-black mb-4 uppercase italic tracking-tighter">Get Ready!</h2>
            <p className="text-stone-400 text-sm font-bold uppercase tracking-widest mb-12">Shuffling reward boxes...</p>
            
            <Link 
              href={`/customer/active-games?campaignId=${campaign?.id ?? ''}${sessionId ? `&sessionId=${sessionId}` : ''}`} 
              className="bg-white text-stone-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-transform hover:scale-105 active:scale-95"
            >
              Start Gameplay
            </Link>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
