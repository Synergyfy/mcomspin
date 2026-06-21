'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerRewards, useRedeemReward } from '@/services/customer';
import QRCode from '@/components/QRCode';
import { 
  QrCode, 
  Ticket, 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Keyboard,
  Store,
  ChevronRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

function RedemptionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rewardId = searchParams.get('rewardId');
  const { data: walletData, isLoading: walletLoading } = useCustomerRewards();
  const redeemMutation = useRedeemReward();
  
  const [reward, setReward] = useState<any>(null);
  const [method, setMethod] = useState<'qr' | 'code' | 'nfc' | 'pos'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const walletList = React.useMemo(() => {
    if (!walletData || typeof walletData !== 'object') return [];
    const available = (walletData as any).available || [];
    const redeemed = (walletData as any).redeemed || [];
    const expired = (walletData as any).expired || [];
    return [...available, ...redeemed, ...expired].map((item: any) => {
      const reward = item.reward || {};
      const business = reward.inventories?.[0]?.business || {};
      const code = `MCS-${(reward.name || '').substring(0, 3).toUpperCase()}-${item.id.slice(0, 8)}`;
      return {
        id: item.id,
        title: reward.name || '',
        provider: business.name || 'MCOM Partner',
        providerLogo: business.logoUrl || 'MA',
        type: reward.type?.toLowerCase() || 'voucher',
        value: reward.value || '',
        details: reward.description || '',
        code: code,
        qrCode: code,
        expiry: item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : 'N/A',
        status: item.status,
      };
    });
  }, [walletData]);

  useEffect(() => {
    if (rewardId) {
      const found = walletList.find((r: any) => r.id === rewardId);
      if (found) setReward(found);
    }
  }, [rewardId, walletList]);

  const handleRedeem = () => {
    if (!reward) return;
    setIsProcessing(true);
    redeemMutation.mutate(
      { rewardId: reward.id },
      {
        onSuccess: () => {
          setIsProcessing(false);
          setIsSuccess(true);
        },
        onError: (err: any) => {
          setIsProcessing(false);
          alert(err?.response?.data?.message || 'Redemption failed. Please try again.');
        },
      },
    );
  };

  if (walletLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!reward && !isSuccess) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 uppercase mb-2">Reward Not Found</h1>
        <p className="text-stone-500 mb-8 max-w-xs">We couldn't locate the reward you're trying to redeem. It may have already been used or expired.</p>
        <Link href="/customer/wallet" className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
          Return to Wallet
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h1 className="text-3xl font-black text-stone-900 uppercase mb-2">Redeemed Successfully</h1>
        <p className="text-stone-500 mb-12 max-w-sm">Your reward from <span className="font-bold text-stone-900">{reward?.provider}</span> has been processed. The merchant has been notified.</p>
        
        <div className="w-full max-w-xs space-y-4">
          <Link href="/customer/wallet" className="block w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-orange-500/20">
            Back to Winnings
          </Link>
          <Link href="/customer/history" className="block w-full text-stone-400 font-black uppercase tracking-widest text-[10px] py-2 hover:text-stone-600 transition-colors">
            View Transaction History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-left">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-6 py-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Step 13: Redemption</p>
            <h1 className="text-xl font-black text-stone-900 uppercase">Redeem Reward</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full p-6 space-y-8">
        {/* Reward Summary Card */}
        <section className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8">
          <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-2xl font-black text-orange-500 uppercase">{reward?.provider.substring(0, 2)}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{reward?.provider}</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 leading-tight uppercase">{reward?.title}</h2>
            <div className="text-xl font-black text-orange-500">{reward?.value}</div>
            <p className="text-stone-500 text-sm font-medium leading-relaxed pt-2">{reward?.details}</p>
          </div>
        </section>

        {/* Redemption Methods Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em]">Select Method</h3>
            <div className="flex items-center gap-2 text-orange-500">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Valid Today</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'qr', label: 'QR Scan', icon: QrCode },
              { id: 'code', label: 'Voucher', icon: Keyboard },
              { id: 'nfc', label: 'NFC Tap', icon: Smartphone },
              { id: 'pos', label: 'POS Auth', icon: Zap },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all gap-2 ${
                  method === m.id 
                    ? 'bg-stone-900 border-stone-900 text-white shadow-xl scale-[1.02]' 
                    : 'bg-white border-stone-100 text-stone-400 hover:border-orange-200'
                }`}
              >
                <m.icon className={`w-6 h-6 ${method === m.id ? 'text-orange-500' : 'text-stone-300'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Method Content */}
        <section className="bg-white border border-stone-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {method === 'qr' && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center space-y-8"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-orange-500/5 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all" />
                  <div className="relative bg-white border-2 border-stone-50 rounded-[2.5rem] p-3 shadow-inner flex items-center justify-center w-56 h-56">
                    <QRCode value={reward?.code || reward?.qrCode || 'MCOM-REWARD'} size={180} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">Merchant Action</p>
                  <h4 className="text-lg font-black text-stone-900 uppercase">Present QR to Staff</h4>
                  <p className="text-stone-400 text-xs font-medium max-w-[240px]">Ask the business staff to scan this code with their MCOM scanner.</p>
                </div>
              </motion.div>
            )}

            {method === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center space-y-8"
              >
                <div className="w-full space-y-4">
                  <div className="text-5xl font-mono font-black text-stone-900 tracking-tighter uppercase mb-8">
                    {reward?.code}
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Enter merchant validation code"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 px-6 py-5 rounded-2xl text-center font-mono font-bold text-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all"
                    />
                    <p className="text-stone-400 text-[9px] font-black uppercase tracking-widest">Manual merchant override only</p>
                  </div>
                </div>
              </motion.div>
            )}

            {method === 'nfc' && (
              <motion.div
                key="nfc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center space-y-8 py-4"
              >
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-40 h-40 bg-orange-50 rounded-full flex items-center justify-center shadow-inner relative"
                >
                   <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-ping opacity-20" />
                   <Smartphone className="w-16 h-16 text-orange-500" />
                </motion.div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-stone-900 uppercase leading-none">Ready to Tap</h4>
                  <p className="text-stone-400 text-xs font-medium max-w-[240px]">Hold your device near the MCOM NFC point at the counter.</p>
                </div>
              </motion.div>
            )}

            {method === 'pos' && (
              <motion.div
                key="pos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center space-y-8 py-10"
              >
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-4 h-4 bg-orange-500 rounded-full" 
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-stone-900 uppercase">Awaiting Terminal</h4>
                  <p className="text-stone-400 text-xs font-medium max-w-[240px]">This reward will auto-redeem when the POS system completes your order.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Action Button */}
          <div className="mt-12">
            <button 
              onClick={handleRedeem}
              disabled={isProcessing}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 ${
                isProcessing 
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                  : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Confirm Redemption
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Terms/Footer */}
        <footer className="text-center space-y-6 pb-12">
          <div className="bg-white border border-stone-100 rounded-3xl p-6">
            <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest leading-relaxed">
              By confirming, you agree that this reward will be marked as used and cannot be undone. <br /> Fraudulent redemption attempts are logged by the MCOM Mall Security Engine.
            </p>
          </div>
          <Link href="/customer/history" className="inline-flex items-center gap-2 text-stone-400 hover:text-orange-500 transition-colors">
             <span className="text-[10px] font-black uppercase tracking-widest">Transaction Guidelines</span>
             <ExternalLink className="w-3 h-3" />
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default function RedemptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center uppercase font-black tracking-widest text-stone-300">Syncing Vault...</div>}>
      <RedemptionPageContent />
    </Suspense>
  );
}
