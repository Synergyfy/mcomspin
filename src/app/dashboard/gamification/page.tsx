'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Gamepad2, 
  Palette, 
  Trophy, 
  Target, 
  Sparkles, 
  Wand2, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Layers,
  Layout,
  MousePointer2,
  Settings2
} from 'lucide-react';

/* ─── Types & Config ─── */
type ThemeType = 'Barber' | 'Beauty' | 'Retail' | 'Restaurant' | 'Event' | 'High Street' | 'Youth' | 'MCOM';
type RewardStyle = 'Visual Reveal' | 'Instant Pop' | 'Mystery Box' | 'Classic Slot';
type CampaignGoal = 'Traffic Boost' | 'Lead Gen' | 'Inventory Clear' | 'Brand Awareness';

const themeConfigs: Record<ThemeType, { description: string; color: string }> = {
  'Barber': { description: 'Sleek, masculine textures with sharp reveal animations.', color: 'bg-stone-800' },
  'Beauty': { description: 'Soft palettes, elegant transitions, and glow effects.', color: 'bg-pink-400' },
  'Retail': { description: 'Modern, high-contrast style for storefront engagement.', color: 'bg-blue-500' },
  'Restaurant': { description: 'Warm, appetising visuals with steam and flare effects.', color: 'bg-orange-500' },
  'Event': { description: 'High energy, flashing lights, and celebration-heavy UX.', color: 'bg-violet-600' },
  'High Street': { description: 'Community-focused, bright, and highly legible designs.', color: 'bg-emerald-500' },
  'Youth': { description: 'Bold gradients, glitch effects, and fast-paced motion.', color: 'bg-yellow-400' },
  'MCOM': { description: 'The signature platform style. Professional and premium.', color: 'bg-[#f97316]' },
};

export default function GamificationSetupPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('MCOM');
  const [rewardStyle, setRewardStyle] = useState<RewardStyle>('Visual Reveal');
  const [campaignGoal, setCampaignGoal] = useState<CampaignGoal>('Traffic Boost');
  const [rewardQuantity, setRewardQuantity] = useState(4); // 2, 4, 6, 8 boxes

  return (
    <div className="space-y-10 pb-20">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Experience Control
          </span>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">
            Gamification Setup
          </h1>
          <p className="text-[#888] text-[14px] mt-1 max-w-xl">
            Configure how your customers experience rewards. Keep it simple or let an expert handle the complexity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column: Controls ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Theme Selector */}
          <section className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#f97316] flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[17px] font-display font-bold text-[#1a1a1a]">Theme Type</h2>
                <p className="text-[12px] text-[#888]">Match the visuals to your business category.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(themeConfigs) as ThemeType[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`relative p-4 rounded-2xl border-2 transition-all text-left group ${
                    selectedTheme === theme 
                      ? 'border-[#f97316] bg-[#f97316]/[0.02]' 
                      : 'border-[#f5f5f3] hover:border-[#eee] bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${themeConfigs[theme].color} mb-3 shadow-inner`} />
                  <span className={`block text-[13px] font-bold ${selectedTheme === theme ? 'text-[#1a1a1a]' : 'text-[#888]'}`}>
                    {theme}
                  </span>
                  {selectedTheme === theme && (
                    <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-[#f97316]" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-[#fafaf9] rounded-2xl border border-[#f0f0ee] flex items-start gap-3">
              <Info className="w-4 h-4 text-[#bbb] mt-0.5" />
              <p className="text-[12px] text-[#666] italic leading-relaxed">
                "{themeConfigs[selectedTheme].description}"
              </p>
            </div>
          </section>

          {/* Configuration Toggles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Reward Style */}
            <section className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-[16px] font-display font-bold text-[#1a1a1a]">Reward Style</h2>
              </div>
              <div className="space-y-2">
                {(['Visual Reveal', 'Instant Pop', 'Mystery Box', 'Classic Slot'] as RewardStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setRewardStyle(style)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      rewardStyle === style ? 'border-blue-500 bg-blue-50/30' : 'border-[#f5f5f3] hover:border-[#eee]'
                    }`}
                  >
                    <span className={`text-[13px] font-bold ${rewardStyle === style ? 'text-blue-700' : 'text-[#888]'}`}>{style}</span>
                    {rewardStyle === style && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Campaign Goal */}
            <section className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-[16px] font-display font-bold text-[#1a1a1a]">Campaign Goal</h2>
              </div>
              <div className="space-y-2">
                {(['Traffic Boost', 'Lead Gen', 'Inventory Clear', 'Brand Awareness'] as CampaignGoal[]).map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setCampaignGoal(goal)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      campaignGoal === goal ? 'border-emerald-500 bg-emerald-50/30' : 'border-[#f5f5f3] hover:border-[#eee]'
                    }`}
                  >
                    <span className={`text-[13px] font-bold ${campaignGoal === goal ? 'text-emerald-700' : 'text-[#888]'}`}>{goal}</span>
                    {campaignGoal === goal && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Box Count / Quantity Selector */}
          <section className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[17px] font-display font-bold text-[#1a1a1a]">Reward Quantity (Boxes)</h2>
                <p className="text-[12px] text-[#888]">Choose how many reward options are presented in the game grid.</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
              {[2, 4, 6, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setRewardQuantity(num)}
                  className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-lg font-bold transition-all ${
                    rewardQuantity === num 
                      ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                      : 'border-[#eee] text-[#ccc] hover:border-[#ddd]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* ── Right Column: Agent & Status ── */}
        <div className="space-y-6">
          
          {/* Preview Placeholder */}
          <div className="bg-[#1a1a1a] rounded-[32px] p-8 text-white h-[320px] relative overflow-hidden flex flex-col justify-center items-center text-center">
             <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className={`w-full h-full ${themeConfigs[selectedTheme].color}`} />
             </div>
             <div className="relative z-10 space-y-4">
                <Gamepad2 className="w-12 h-12 text-[#f97316] mx-auto animate-bounce" />
                <h3 className="text-xl font-display font-bold">Experience Preview</h3>
                <p className="text-[12px] text-white/50 max-w-[200px]">
                  Real-time preview of your "{selectedTheme}" setup will appear here during deployment.
                </p>
                <div className="pt-4 grid grid-cols-2 gap-2">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20" />
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20" />
                </div>
             </div>
          </div>

          {/* AGENT REQUEST SECTION — IMPORTANT */}
          <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-[32px] p-8 text-white shadow-xl shadow-orange-500/20">
            <Wand2 className="w-10 h-10 mb-6 text-white/90" />
            <h2 className="text-2xl font-display font-bold leading-tight">Request Full Setup by Agent</h2>
            <p className="text-white/80 text-[13px] mt-3 leading-relaxed">
              Don't have time to configure? Our experts will setup your branding, reward logic, and visual design for maximum engagement.
            </p>
            
            <ul className="mt-6 space-y-3">
              {[
                'Optimized Reward Logic',
                'Custom Branding Integration',
                'Strategic Goal Alignment',
                'Advanced Animation Tuning'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px] font-medium text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-white/50" />
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/dashboard/agent" className="block w-full mt-8">
              <button className="w-full bg-white text-[#f97316] py-4 rounded-2xl font-bold text-[14px] hover:bg-[#fafaf9] transition-all active:scale-95 flex items-center justify-center gap-2">
                Request Agent Setup
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-[32px] border border-[#eee] p-6">
            <h4 className="text-[11px] font-bold text-[#bbb] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings2 className="w-3 h-3" />
              Active Settings
            </h4>
            <div className="space-y-4">
               <div>
                  <p className="text-[10px] text-[#aaa]">Theme</p>
                  <p className="text-[13px] font-bold text-[#1a1a1a]">{selectedTheme}</p>
               </div>
               <div>
                  <p className="text-[10px] text-[#aaa]">Animation</p>
                  <p className="text-[13px] font-bold text-[#1a1a1a]">{rewardStyle}</p>
               </div>
               <div>
                  <p className="text-[10px] text-[#aaa]">Strategy</p>
                  <p className="text-[13px] font-bold text-[#1a1a1a]">{campaignGoal}</p>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
