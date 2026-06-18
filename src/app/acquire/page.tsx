'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard-store';
import { 
  CheckCircle2, 
  Star, 
  Rocket, 
  BarChart2, 
  User, 
  Camera, 
  Image as ImageIcon, 
  Palette, 
  Eye, 
  ArrowRight,
  ArrowLeft,
  Building2,
  Mail,
  Lock,
  CreditCard,
  Landmark,
  Wallet,
  MapPin,
  Calendar,
  Edit3,
  Check,
  Play
} from 'lucide-react';

export default function AcquirePage() {
  const router = useRouter();
  const { login } = useDashboardStore();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 10;

  // Form State
  const [selectedPlan, setSelectedPlan] = useState<string>('GROWTH');
  const [businessName, setBusinessName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [primaryColor, setPrimaryColor] = useState<string>('#a23f00'); // default brand color
  const [logoName, setLogoName] = useState<string>('');
  const [locationsCount, setLocationsCount] = useState<number>(12);
  const [billingFreq, setBillingFreq] = useState<string>('annual');
  
  // Interactive State for Branding Preview
  const [ballDropping, setBallDropping] = useState<boolean>(false);
  const [droppedBallPath, setDroppedBallPath] = useState<number>(0);

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleLaunch = () => {
    login(email || 'admin@arcadenexus.com', password || 'password');
    // Go to success
    nextStep();
  };

  const handleFinish = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Top Header */}
      <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md shadow-sm h-16 flex justify-between items-center px-container-margin border-b border-outline-variant/30">
        <div className="font-display text-headline-md font-bold text-primary tracking-tighter">
          MCOMSpin
        </div>
        <div className="flex items-center gap-4">
          <div className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-widest hidden md:block">
            Step {step} of {totalSteps}
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant">
            <User className="w-5 h-5 text-on-surface-variant" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-surface-container-highest fixed top-16 z-50">
        <div 
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-container-margin py-stack-lg animate-fade-in flex flex-col justify-center">
        
        {/* STEP 1: PLAN SELECTION */}
        {step === 1 && (
          <div className="space-y-stack-lg max-w-5xl mx-auto">
            <div className="text-center space-y-2">
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-display font-bold tracking-tight text-on-surface">Select Your Power Plan</h1>
              <p className="text-body-md text-on-surface-variant">Fuel your arcade growth with unlimited drops and priority support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {/* FREE */}
              <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-sm transition-transform active:scale-95 flex flex-col">
                <div className="mb-stack-md">
                  <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Free</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-headline-lg font-display font-bold">£0</span>
                    <span className="text-body-sm text-on-surface-variant ml-1">/mo</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-stack-lg flex-1 text-body-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>5 Daily Drops</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Basic Leaderboard</span></li>
                </ul>
                <button onClick={nextStep} className="w-full py-3 bg-surface-container-high text-primary font-bold text-label-md rounded-lg border-2 border-primary/20 hover:border-primary transition-colors">
                  Select Plan
                </button>
              </div>

              {/* STARTER */}
              <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-sm transition-transform active:scale-95 flex flex-col">
                <div className="mb-stack-md">
                  <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Starter</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-headline-lg font-display font-bold">£29</span>
                    <span className="text-body-sm text-on-surface-variant ml-1">/mo</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-stack-lg flex-1 text-body-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>50 Daily Drops</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Standard Support</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Full Leaderboard</span></li>
                </ul>
                <button onClick={nextStep} className="w-full py-3 bg-surface-container-high text-primary font-bold text-label-md rounded-lg border-2 border-primary/20 hover:border-primary transition-colors">
                  Select Plan
                </button>
              </div>

              {/* GROWTH (Popular) */}
              <div className="relative bg-surface-container-lowest border-2 border-primary p-stack-md rounded-xl shadow-[0_10px_20px_-5px_rgba(162,63,0,0.15)] scale-105 z-10 flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
                <div className="mb-stack-md mt-2">
                  <span className="text-label-sm font-bold text-primary uppercase tracking-wider">Growth</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-headline-lg font-display font-bold text-on-surface">£79</span>
                    <span className="text-body-sm text-on-surface-variant ml-1">/mo</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-stack-lg flex-1 text-body-sm font-medium">
                  <li className="flex items-center gap-2"><Star className="w-4 h-4 text-primary fill-primary" /> <span>Unlimited Drops</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Priority Response</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Advanced Analytics</span></li>
                </ul>
                <button onClick={() => { setSelectedPlan('GROWTH'); nextStep(); }} className="w-full py-3 bg-primary text-on-primary font-bold text-label-md rounded-lg shadow-[0_4px_0_0_#7b2f00] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#7b2f00] active:translate-y-[3px] active:shadow-[0_1px_0_0_#7b2f00] transition-all">
                  Select Plan
                </button>
              </div>

              {/* ENTERPRISE */}
              <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-sm transition-transform active:scale-95 flex flex-col">
                <div className="mb-stack-md">
                  <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Enterprise</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-headline-lg font-display font-bold">Custom</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-stack-lg flex-1 text-body-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Dedicated Manager</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>SLA Guarantee</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Custom Integration</span></li>
                </ul>
                <button onClick={nextStep} className="w-full py-3 bg-surface-container-high text-primary font-bold text-label-md rounded-lg border-2 border-primary/20 hover:border-primary transition-colors">
                  Select Plan
                </button>
              </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center bg-surface-container-low rounded-3xl p-stack-md md:p-12 border border-outline-variant/50">
              <div className="space-y-6">
                <h2 className="text-headline-md font-display font-bold text-on-surface">Why upgrade to Growth?</h2>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                    <Rocket className="w-6 h-6 text-on-primary-container" />
                  </div>
                  <div>
                    <p className="font-bold text-body-md text-on-surface">Uncapped Kinetic Potential</p>
                    <p className="text-label-sm text-on-surface-variant mt-1">Never run out of daily drops during peak high-traffic seasons.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center shrink-0">
                    <BarChart2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-body-md text-on-surface">Real-time Insights</p>
                    <p className="text-label-sm text-on-surface-variant mt-1">Deep dive into user behavior and conversion mechanics.</p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-surface shadow-lg border border-white/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-tertiary/20 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/50 font-bold">
                  Analytics Dashboard Preview
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STEP 2: SUBSCRIPTION CONFIRMATION */}
        {step === 2 && (
          <div className="max-w-md mx-auto space-y-8 w-full text-center">
            <div className="w-20 h-20 bg-primary-container rounded-full mx-auto flex items-center justify-center">
              <Check className="w-10 h-10 text-on-primary-container" />
            </div>
            <div className="space-y-2">
              <h1 className="text-headline-md font-display font-bold">Excellent Choice</h1>
              <p className="text-body-sm text-on-surface-variant">You've selected the <strong className="text-primary">{selectedPlan}</strong> plan.</p>
            </div>
            <button onClick={nextStep} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2">
              Continue Setup <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={prevStep} className="text-label-sm text-on-surface-variant font-bold uppercase hover:text-primary">Change Plan</button>
          </div>
        )}

        {/* STEP 3: BUSINESS INFORMATION */}
        {step === 3 && (
          <div className="max-w-md mx-auto space-y-8 w-full">
            <div className="space-y-2 text-center">
              <h1 className="text-headline-md font-display font-bold">Business Information</h1>
              <p className="text-body-sm text-on-surface-variant">Let's set up your merchant profile.</p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-5">
              <div className="space-y-1.5">
                <label className="text-label-sm font-bold text-on-surface-variant">Business Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-outline" />
                  <input 
                    type="text" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Arcade Nexus Enterprises" 
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm font-bold text-on-surface-variant">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-outline" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@arcadenexus.com" 
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-label-sm font-bold text-on-surface-variant">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-outline" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={prevStep} className="text-label-sm font-bold text-on-surface-variant uppercase hover:text-primary px-4 py-2">Back</button>
              <button onClick={nextStep} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-md hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT METHOD */}
        {step === 4 && (
          <div className="max-w-md mx-auto space-y-8 w-full">
            <div className="space-y-2 text-center">
              <h1 className="text-headline-md font-display font-bold">Select Payment Method</h1>
              <p className="text-body-sm text-on-surface-variant">Secured with bank-grade 256-bit encryption.</p>
            </div>

            <div className="space-y-4">
              <div 
                className={`p-4 rounded-xl border-2 flex flex-col gap-4 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-lowest'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-outline'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-bold">Card Payment</span>
                  </div>
                  <CreditCard className="w-5 h-5 text-on-surface-variant" />
                </div>
                {paymentMethod === 'card' && (
                  <div className="space-y-3 pt-2">
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-sm" />
                    <div className="flex gap-3">
                      <input type="text" placeholder="MM / YY" className="w-1/2 p-3 bg-surface border border-outline-variant rounded-lg text-sm" />
                      <input type="text" placeholder="CVC" className="w-1/2 p-3 bg-surface border border-outline-variant rounded-lg text-sm" />
                    </div>
                  </div>
                )}
              </div>

              <div 
                className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-lowest'}`}
                onClick={() => setPaymentMethod('bank')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-primary' : 'border-outline'}`}>
                    {paymentMethod === 'bank' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <span className="font-bold">Bank Transfer</span>
                </div>
                <Landmark className="w-5 h-5 text-on-surface-variant" />
              </div>

              <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest opacity-50 flex items-center justify-between cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-outline" />
                  <div className="flex flex-col">
                    <span className="font-bold">Digital Wallets</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Coming Soon</span>
                  </div>
                </div>
                <Wallet className="w-5 h-5 text-on-surface-variant" />
              </div>
            </div>

            <div className="bg-surface-container p-4 rounded-xl flex justify-between items-center">
              <span className="font-bold">Total Amount</span>
              <span className="text-xl font-display font-black text-primary">£79.00</span>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={prevStep} className="text-label-sm font-bold text-on-surface-variant uppercase hover:text-primary px-4 py-2">Back</button>
              <button onClick={nextStep} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-md hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: BRANDING SETUP */}
        {step === 5 && (
          <div className="w-full flex flex-col md:flex-row gap-stack-lg animate-fade-in">
            {/* Left: Setup Controls */}
            <div className="w-full md:w-1/2 flex flex-col gap-stack-lg">
              <section>
                <h1 className="text-headline-lg font-display font-bold text-on-surface">Branding Setup</h1>
                <p className="text-body-sm text-on-surface-variant mt-2">Personalize how your brand appears to users during their kinetic reward journey. This identity will be seen on every drop.</p>
              </section>

              <div className="grid grid-cols-1 gap-stack-md">
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-bold text-on-surface">Business Logo</label>
                  <div className="h-32 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container hover:border-primary transition-colors group">
                    <Camera className="w-8 h-8 text-outline mb-2 group-hover:scale-110 transition-transform group-hover:text-primary" />
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">SVG, PNG or JPG (Max 2MB)</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-bold text-on-surface">Cover Image</label>
                  <div className="h-48 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container hover:border-primary transition-colors group">
                    <ImageIcon className="w-8 h-8 text-outline mb-2 group-hover:scale-110 transition-transform group-hover:text-primary" />
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Recommended 1200x400px</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-bold text-on-surface">Primary Brand Color</label>
                  <div className="flex flex-wrap gap-3">
                    {['#a23f00', '#00629f', '#97471d', '#1A1C1E'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className={`w-12 h-12 rounded-full border-4 border-surface transition-all ${primaryColor === color ? 'shadow-[0_0_0_3px_#a23f00] scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button className="w-12 h-12 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                      <Palette className="w-5 h-5 text-on-surface-variant" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-stack-md flex items-center justify-between">
                <button onClick={prevStep} className="text-label-sm font-bold text-on-surface-variant uppercase hover:text-primary px-4 py-2">Back</button>
                <button onClick={nextStep} className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-[0_10px_20px_rgba(162,63,0,0.15)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="sticky top-24 bg-surface-container rounded-[2rem] p-6 shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="flex items-center gap-2 mb-6 text-primary">
                  <Eye className="w-5 h-5" />
                  <span className="text-label-sm font-bold uppercase tracking-widest text-on-surface">Live Preview</span>
                </div>

                <div className="bg-surface rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20 mx-auto max-w-[320px]">
                  <div className="h-40 relative bg-gradient-to-br from-surface-variant to-secondary-container">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-8 left-4 w-20 h-20 bg-white rounded-2xl shadow-lg p-2 border-2" style={{ borderColor: primaryColor }}>
                      <div className="w-full h-full bg-surface-container rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-outline" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-12 px-4 pb-6 flex flex-col gap-4">
                    <div>
                      <h3 className="text-xl font-display font-bold text-on-surface truncate">{businessName || 'Modern Commerce Inc.'}</h3>
                      <p className="text-body-sm text-on-surface-variant">Join our exclusive reward program.</p>
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/50 relative overflow-hidden h-48 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8e7164 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      
                      {/* Animated Ball Simulation */}
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all shadow-lg ${ballDropping ? 'animate-bounce' : ''}`}
                        style={{ backgroundColor: primaryColor }}
                      >
                        <div className="w-3 h-3 bg-white/40 rounded-full blur-[1px] -mt-2 -ml-2" />
                      </div>

                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                        <div className="w-12 h-8 bg-tertiary-container rounded-t-lg flex items-center justify-center text-[10px] font-bold text-white">£10</div>
                        <div className="w-14 h-8 bg-primary rounded-t-lg flex items-center justify-center text-[10px] font-bold text-white shadow-[0_-2px_10px_rgba(162,63,0,0.5)] z-20">JACKPOT</div>
                        <div className="w-12 h-8 bg-tertiary-container rounded-t-lg flex items-center justify-center text-[10px] font-bold text-white">£5</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        className="flex-1 py-3 text-white rounded-xl font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                        onClick={() => {
                          if (!ballDropping) {
                            setBallDropping(true);
                            setTimeout(() => setBallDropping(false), 1500);
                          }
                        }}
                      >
                        <Play className="w-4 h-4 fill-white" /> Play Now
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-center text-[10px] text-on-surface-variant italic px-8">
                  "This is how your customers will see your brand during the MCOMSpin game experience."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: LOCATION SETUP */}
        {step === 6 && (
          <div className="max-w-md mx-auto space-y-8 w-full">
            <div className="space-y-2 text-center">
              <h1 className="text-headline-md font-display font-bold">Location Setup</h1>
              <p className="text-body-sm text-on-surface-variant">How many physical or digital nodes will run the arcade?</p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/50 text-center space-y-6">
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={() => setLocationsCount(Math.max(1, locationsCount - 1))}
                  className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-xl font-bold"
                >
                  -
                </button>
                <span className="text-display-lg font-display font-black text-primary w-20">{locationsCount}</span>
                <button 
                  onClick={() => setLocationsCount(locationsCount + 1)}
                  className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-xl font-bold"
                >
                  +
                </button>
              </div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-widest font-bold">Total Active Nodes</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-sm font-bold text-on-surface-variant">Primary Hub Location (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-outline" />
                <input type="text" placeholder="e.g. 742 Evergreen Terrace" className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={prevStep} className="text-label-sm font-bold text-on-surface-variant uppercase hover:text-primary px-4 py-2">Back</button>
              <button onClick={nextStep} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-md hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: BILLING FREQUENCY */}
        {step === 7 && (
          <div className="max-w-md mx-auto space-y-8 w-full">
            <div className="space-y-2 text-center">
              <h1 className="text-headline-md font-display font-bold">Billing Frequency</h1>
              <p className="text-body-sm text-on-surface-variant">Choose your commitment cycle.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${billingFreq === 'monthly' ? 'border-primary bg-primary/5 shadow-md' : 'border-outline-variant bg-surface-container-lowest'}`}
                onClick={() => setBillingFreq('monthly')}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-on-surface">Monthly</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingFreq === 'monthly' ? 'border-primary' : 'border-outline'}`}>
                    {billingFreq === 'monthly' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                </div>
                <div className="text-headline-lg font-display font-bold">£79<span className="text-body-sm font-normal text-on-surface-variant">/mo</span></div>
              </div>

              <div 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${billingFreq === 'annual' ? 'border-primary bg-primary/5 shadow-md' : 'border-outline-variant bg-surface-container-lowest'}`}
                onClick={() => setBillingFreq('annual')}
              >
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">Save 20%</div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-on-surface">Annually</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingFreq === 'annual' ? 'border-primary' : 'border-outline'}`}>
                    {billingFreq === 'annual' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                </div>
                <div className="text-headline-lg font-display font-bold">£758<span className="text-body-sm font-normal text-on-surface-variant">/yr</span></div>
                <p className="text-xs text-on-surface-variant mt-2">Billed as one yearly payment. Equates to £63.16/mo.</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={prevStep} className="text-label-sm font-bold text-on-surface-variant uppercase hover:text-primary px-4 py-2">Back</button>
              <button onClick={nextStep} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-md hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: ONBOARDING REVIEW */}
        {step === 8 && (
          <div className="max-w-md mx-auto space-y-8 w-full">
            <div className="space-y-2 text-center">
              <h1 className="text-headline-md font-display font-bold">Review & Launch</h1>
              <p className="text-body-sm text-on-surface-variant">Verify your details before we activate your kinetic rewards network.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 shadow-sm relative">
                <button onClick={() => setStep(3)} className="absolute top-5 right-5 text-outline hover:text-primary"><Edit3 className="w-4 h-4" /></button>
                <div className="flex items-center gap-2 text-label-sm font-bold text-on-surface-variant uppercase tracking-widest mb-3"><Building2 className="w-4 h-4" /> Business Info</div>
                <p className="font-bold">{businessName || 'Arcade Nexus Enterprises'}</p>
                <p className="text-sm text-on-surface-variant">{email || 'admin@arcadenexus.com'}</p>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 shadow-sm relative flex items-center gap-4">
                <button onClick={() => setStep(5)} className="absolute top-5 right-5 text-outline hover:text-primary"><Edit3 className="w-4 h-4" /></button>
                <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: primaryColor }} />
                <div>
                  <div className="flex items-center gap-2 text-label-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1"><Palette className="w-4 h-4" /> Branding</div>
                  <p className="text-sm font-medium">Primary Theme Set</p>
                </div>
              </div>

              <div className="bg-primary text-on-primary p-5 rounded-xl shadow-[0_8px_20px_rgba(162,63,0,0.3)] relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-white/10">
                  <Star className="w-32 h-32 fill-current" />
                </div>
                <button onClick={() => setStep(1)} className="absolute top-5 right-5 text-white/70 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2"><Rocket className="w-4 h-4" /> Subscription Plan</div>
                <p className="text-2xl font-display font-black">{selectedPlan} TIER</p>
                <p className="text-sm mt-1">{billingFreq === 'annual' ? '£758 / year' : '£79 / month'}</p>
              </div>
            </div>

            <div className="bg-surface-container p-6 rounded-2xl text-center space-y-4">
              <p className="text-sm font-medium">By clicking launch, you agree to our Terms of Service and will begin your first billing cycle. Your kinetic pegboard will go live immediately.</p>
              <div className="flex flex-col gap-3">
                <button onClick={nextStep} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 text-lg">
                  Launch Your Arcade <Rocket className="w-5 h-5" />
                </button>
                <button onClick={prevStep} className="text-label-sm font-bold text-on-surface-variant uppercase hover:text-primary py-2 flex justify-center items-center gap-1"><ArrowLeft className="w-4 h-4" /> Previous Step</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: ONBOARDING COMPLETE */}
        {step === 9 && (
          <div className="max-w-sm mx-auto space-y-8 w-full text-center animate-fade-in">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center text-4xl font-display font-black">
                100%
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-display font-bold text-primary">Your MCOMSpin Account Is Ready!</h1>
              <p className="text-body-sm text-on-surface-variant">You're all set to launch your first Ball Drop campaign and start driving engagement with premium rewards.</p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/50 p-6 rounded-2xl shadow-sm space-y-4 text-left">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Onboarding Summary</div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-sm font-semibold">Business Profile Verified</span></div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-sm font-semibold">Billing Connected</span></div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-sm font-semibold">Brand Kit Uploaded</span></div>
            </div>

            <button onClick={nextStep} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 text-lg">
              Launch First Campaign <Rocket className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 10: SUBSCRIPTION SUCCESS */}
        {step === 10 && (
          <div className="max-w-md mx-auto space-y-8 w-full text-center animate-fade-in">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-headline-md font-display font-bold text-on-surface">Payment Successful</h1>
              <p className="text-body-md text-on-surface-variant">Your {selectedPlan} subscription is now active.</p>
            </div>
            
            <div className="p-6 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-sm text-left space-y-3">
              <div className="flex justify-between border-b border-outline-variant/30 pb-3">
                <span className="text-on-surface-variant">Amount Paid</span>
                <span className="font-bold">£{billingFreq === 'annual' ? '758.00' : '79.00'}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-3">
                <span className="text-on-surface-variant">Billing Cycle</span>
                <span className="font-bold capitalize">{billingFreq}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Next Invoice</span>
                <span className="font-bold">15 Jul 2026</span>
              </div>
            </div>

            <button onClick={handleFinish} className="w-full py-4 bg-surface-container-high text-primary rounded-xl font-bold border-2 border-primary/20 hover:border-primary transition-colors flex items-center justify-center gap-2">
              Go To Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
