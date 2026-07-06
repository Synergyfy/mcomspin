'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCreateBusinessCampaign, useUpdateBusinessGame, useUpdateBusinessCampaign, useBusinessCampaigns, useBusinessGame } from '@/services/business';
import { uploadToCloudinary } from '@/services/cloudinary';
import { 
  ArrowLeft, 
  ArrowRight, 
  Image as ImageIcon, 
  Settings2, 
  Gift, 
  Rocket, 
  Camera, 
  Plus, 
  CheckCircle2, 
  Gamepad2, 
  Trophy, 
  CalendarDays,
  Target
} from 'lucide-react';

type RewardSlot = {
  id: string;
  label: string;
  hasReward: boolean;
  rewardType: 'Discount' | 'Voucher' | 'FreeProduct' | 'Cashback' | 'Points';
  rewardValue: number;
  quantity: number;
};

export default function CreateCampaignWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const createCampaign = useCreateBusinessCampaign();
  const updateCampaign = useUpdateBusinessCampaign();
  const { data: campaignsData } = useBusinessCampaigns();
  const { data: gameData } = useBusinessGame();
  const updateGame = useUpdateBusinessGame();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [winProbability, setWinProbability] = useState(30);
  const [dailyDropLimit, setDailyDropLimit] = useState(500);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [slots, setSlots] = useState<RewardSlot[]>([]);
  
  // Image Upload State
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'banner') {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  React.useEffect(() => {
    if (editId && campaignsData) {
      const campaigns = (campaignsData as any[]) ?? [];
      const campaign = campaigns.find(c => c.id === editId);
      if (campaign) {
        setCampaignName(campaign.name || '');
        setCampaignDesc(campaign.description || '');
        if (campaign.startDate) setStartDate(campaign.startDate.split('T')[0]);
        if (campaign.endDate) setEndDate(campaign.endDate.split('T')[0]);
        if (campaign.imageUrl && !bannerFile) setBannerPreview(campaign.imageUrl);
        if (campaign.metadata?.thumbnailUrl && !thumbnailFile) setThumbnailPreview(campaign.metadata.thumbnailUrl);
      }
    }
  }, [editId, campaignsData, bannerFile, thumbnailFile]);

  React.useEffect(() => {
    if (editId && gameData) {
      const config = (gameData as any)?.config;
      if (config) {
        if (config.winProbability) setWinProbability(config.winProbability);
        if (config.dailyDropLimit) setDailyDropLimit(config.dailyDropLimit);
        if (config.boxes && slots.length === 0) {
          setSlots(config.boxes.map((b: any) => ({
            id: crypto.randomUUID(),
            label: b.label || '',
            hasReward: b.hasReward || false,
            rewardType: b.rewardType || 'Discount',
            rewardValue: b.rewardValue || 0,
            quantity: b.quantity || 1
          })));
        }
      }
    }
  }, [editId, gameData]);

  const addSlot = () => setSlots([...slots, {
    id: crypto.randomUUID(),
    label: '',
    hasReward: false,
    rewardType: 'Discount' as const,
    rewardValue: 0,
    quantity: 1,
  }]);

  const updateSlot = (id: string, patch: Partial<RewardSlot>) =>
    setSlots(slots.map(s => s.id === id ? { ...s, ...patch } : s));

  const removeSlot = (id: string) =>
    setSlots(slots.filter(s => s.id !== id));

  const nextStep = () => {
    setError('');
    if (step === 1 && !campaignName.trim()) { setError('Campaign name is required'); return; }
    if (step === 2) {
      if (!startDate) { setError('Start date is required'); return; }
      if (!endDate) { setError('End date is required'); return; }
      if (new Date(endDate) <= new Date(startDate)) { setError('End date must be after start date'); return; }
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => { setError(''); setStep(prev => Math.max(prev - 1, 1)); };

  const handleLaunch = async (status: 'Active' | 'Draft' = 'Active') => {
    setError('');
    if (!campaignName.trim()) { setError('Campaign name is required'); return; }
    if (!startDate) { setError('Start date is required'); return; }
    if (!endDate) { setError('End date is required'); return; }
    if (new Date(endDate) <= new Date(startDate)) { setError('End date must be after start date'); return; }
    setIsSubmitting(true);
    try {
      let bannerUrl = '';
      let thumbnailUrl = '';
      
      if (bannerFile) {
        bannerUrl = await uploadToCloudinary(bannerFile, 'campaigns');
      }
      if (thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'campaigns');
      }

      const existingCampaign = editId ? (campaignsData as any[])?.find(c => c.id === editId) : null;
      const mergedMetadata = {
        ...(existingCampaign?.metadata || {}),
        ...(thumbnailUrl ? { thumbnailUrl } : {})
      };

      let campaignId = editId;

      if (editId) {
        await updateCampaign.mutateAsync({
          id: editId,
          name: campaignName,
          description: campaignDesc,
          status: status,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          ...(bannerUrl ? { imageUrl: bannerUrl } : {}),
          metadata: mergedMetadata
        });
      } else {
        const campaign = await createCampaign.mutateAsync({
          name: campaignName,
          description: campaignDesc,
          type: 'HighStreet',
          status: status,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          ...(bannerUrl ? { imageUrl: bannerUrl } : {}),
          metadata: mergedMetadata
        });
        campaignId = campaign.id ?? campaign._id;
      }

      await updateGame.mutateAsync({
        config: {
          winProbability,
          dailyDropLimit,
          boxes: slots.map((s, i) => ({
            index: i,
            hasReward: s.hasReward,
            label: s.label,
            ...(s.hasReward ? { rewardType: s.rewardType, rewardValue: s.rewardValue } : {}),
            quantity: s.quantity,
          })),
        },
        isActive: true,
        campaignIds: [campaignId],
      });

      router.push(`/dashboard/campaign/${campaignId}`);
    } catch (err: any) {
      console.error('Launch Error:', err);
      setError(err?.response?.data?.message?.[0] ?? err?.response?.data?.message ?? err?.message ?? 'Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col pb-24">
      <main className="flex-grow w-full max-w-2xl mx-auto px-container-margin pt-stack-md animate-fade-in-up">
        {/* Step Indicator */}
        <div className="mb-stack-lg">
          <div className="flex justify-between items-end mb-base">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">Step {step} of {totalSteps}</span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
                {step === 1 && "Campaign Information"}
                {step === 2 && "Game Mechanics"}
                {step === 3 && "Reward Allocation"}
                {step === 4 && "Review & Launch"}
              </h2>
            </div>
            {step < 4 && (
              <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-primary/10 shadow-sm flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <span className="font-label-md font-bold text-primary">Ball Drop</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-stack-lg">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                  s <= step ? 'bg-primary shadow-[0_0_8px_rgba(162,63,0,0.5)]' : 'bg-surface-container-highest'
                }`} 
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium mb-4">{error}</div>
        )}

        {/* STEP 1: CAMPAIGN INFORMATION */}
        {step === 1 && (
          <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_10px_20px_-10px_rgba(53,16,0,0.15)] border border-surface-container-high relative overflow-hidden">
            <form className="space-y-stack-md relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2 group">
                <label className="font-label-md font-bold text-on-surface-variant block px-1" htmlFor="campaign-name">Campaign Name</label>
                <input 
                  className="w-full h-14 px-4 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none text-on-surface font-medium group-focus-within:scale-[1.01]" 
                  id="campaign-name" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Solstice Grand Drop" 
                  type="text"
                />
              </div>

              <div className="space-y-2 group">
                <label className="font-label-md font-bold text-on-surface-variant block px-1" htmlFor="campaign-desc">Description</label>
                <textarea 
                  className="w-full p-4 rounded-xl bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none text-on-surface font-medium resize-none group-focus-within:scale-[1.01]" 
                  id="campaign-desc" 
                  value={campaignDesc}
                  onChange={(e) => setCampaignDesc(e.target.value)}
                  placeholder="Describe the excitement! What can customers win?" 
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="space-y-2">
                  <label className="font-label-md font-bold text-on-surface-variant block px-1">Campaign Banner</label>
                  <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} />
                  <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="group relative flex flex-col items-center justify-center w-full aspect-video rounded-xl bg-surface-container-high border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-highest transition-all cursor-pointer overflow-hidden"
                  >
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-label-sm font-semibold text-on-surface-variant">Upload Banner (16:9)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label-md font-bold text-on-surface-variant block px-1">Thumbnail</label>
                  <input type="file" accept="image/*" className="hidden" ref={thumbnailInputRef} onChange={(e) => handleFileChange(e, 'thumbnail')} />
                  <div 
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="group relative flex flex-col items-center justify-center w-full aspect-square md:aspect-video rounded-xl bg-surface-container-high border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-highest transition-all cursor-pointer overflow-hidden"
                  >
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-label-sm font-semibold text-on-surface-variant">Upload Square</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: GAME MECHANICS */}
        {step === 2 && (
          <div className="space-y-stack-md">
            <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_10px_20px_-10px_rgba(53,16,0,0.15)] border border-surface-container-high">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" /> Physics Configuration
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-label-md font-bold text-on-surface-variant">Base Win Probability</label>
                    <span className="font-bold text-primary">{winProbability}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={winProbability}
                    onChange={(e) => setWinProbability(Number(e.target.value))}
                    className="w-full accent-primary" 
                  />
                  <p className="text-xs text-on-surface-variant mt-2 font-medium">Controls pegboard bounce friction and slot magnetism.</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-label-md font-bold text-on-surface-variant">Daily Total Drop Limit</label>
                    <span className="font-bold text-primary">{dailyDropLimit}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="5000" 
                    step="100"
                    value={dailyDropLimit}
                    onChange={(e) => setDailyDropLimit(Number(e.target.value))}
                    className="w-full accent-primary" 
                  />
                  <p className="text-xs text-on-surface-variant mt-2 font-medium">Cap the total number of plays across all users per day to protect inventory.</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_10px_20px_-10px_rgba(53,16,0,0.15)] border border-surface-container-high">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> Active Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-sm font-bold text-on-surface-variant block mb-1">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 rounded-lg bg-surface-container-low border-none font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="font-label-sm font-bold text-on-surface-variant block mb-1">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-3 rounded-lg bg-surface-container-low border-none font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REWARD ALLOCATION */}
        {step === 3 && (
          <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_10px_20px_-10px_rgba(53,16,0,0.15)] border border-surface-container-high relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" /> Pegboard Slots
              </h3>
              <button onClick={addSlot} className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4" /> Add Slot
              </button>
            </div>

            <div className="space-y-4">
              {slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low border border-dashed border-outline-variant/30 rounded-xl text-center">
                  <Gift className="w-10 h-10 text-outline-variant mb-3" />
                  <p className="font-bold text-on-surface-variant">No reward slots configured</p>
                  <p className="text-sm text-on-surface-variant/70">Click &quot;Add Slot&quot; above to configure prizes for your pegboard.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div key={slot.id} className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={slot.label}
                          onChange={(e) => updateSlot(slot.id, { label: e.target.value })}
                          placeholder="Slot label (e.g. Small Win)"
                          className="flex-1 h-10 px-3 rounded-lg bg-surface-container border border-outline-variant/30 outline-none focus:border-primary text-sm font-medium"
                        />
                        <button onClick={() => removeSlot(slot.id)} className="text-red-400 hover:text-red-600 text-sm font-bold px-2">Delete</button>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                          <input type="checkbox" checked={slot.hasReward} onChange={(e) => updateSlot(slot.id, { hasReward: e.target.checked })} className="accent-primary" />
                          Has reward
                        </label>
                        {slot.hasReward && (
                          <>
                            <select value={slot.rewardType} onChange={(e) => updateSlot(slot.id, { rewardType: e.target.value as RewardSlot['rewardType'] })} className="h-9 px-2 rounded-lg bg-surface-container border border-outline-variant/30 outline-none text-sm">
                              <option value="Discount">Discount</option>
                              <option value="Voucher">Voucher</option>
                              <option value="FreeProduct">Free Product</option>
                              <option value="Cashback">Cashback</option>
                              <option value="Points">Points</option>
                            </select>
                            <input type="number" value={slot.rewardValue} onChange={(e) => updateSlot(slot.id, { rewardValue: Number(e.target.value) })} placeholder="Value" className="w-24 h-9 px-3 rounded-lg bg-surface-container border border-outline-variant/30 outline-none text-sm" />
                            <input type="number" value={slot.quantity} onChange={(e) => updateSlot(slot.id, { quantity: Number(e.target.value) })} placeholder="Qty" className="w-20 h-9 px-3 rounded-lg bg-surface-container border border-outline-variant/30 outline-none text-sm" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & LAUNCH */}
        {step === 4 && (
          <div className="space-y-stack-md">
            <div className="bg-gradient-to-br from-primary/10 to-tertiary/10 p-8 rounded-2xl border-2 border-primary/20 text-center relative overflow-hidden shadow-lg">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_16px_rgba(162,63,0,0.3)]">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-2xl font-black text-on-surface mb-2">Ready for Liftoff</h3>
              <p className="text-on-surface-variant font-medium">
                {campaignName || 'Your Campaign'} is configured and ready to be launched to your audience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex items-start gap-3">
                <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Win Probability</h4>
                  <p className="text-on-surface-variant text-sm font-medium">{winProbability}% Base Rate</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex items-start gap-3">
                <Gamepad2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Daily Limits</h4>
                  <p className="text-on-surface-variant text-sm font-medium">{dailyDropLimit} Drops/day</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex items-start gap-3 col-span-2">
                <Trophy className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Rewards Active</h4>
                  <p className="text-on-surface-variant text-sm font-medium">{slots.length} slot{slots.length !== 1 ? 's' : ''} configured</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-container-margin bg-gradient-to-t from-surface via-surface/95 to-transparent z-40 pb-8">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="w-full md:w-1/3 h-14 bg-surface text-on-surface-variant font-label-md font-bold rounded-full border-2 border-outline-variant hover:border-primary hover:text-primary transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          )}
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              disabled={isSubmitting}
              className="flex-1 h-14 bg-primary text-white font-label-md font-bold rounded-full shadow-[0_4px_0_0_#7b2f00] flex items-center justify-center gap-2 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#7b2f00] active:translate-y-[3px] active:shadow-[0_1px_0_0_#7b2f00] transition-all uppercase tracking-widest disabled:opacity-50 disabled:active:translate-y-0"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleLaunch('Draft')}
                disabled={isSubmitting}
                className="flex-1 h-14 bg-white text-stone-900 border-2 border-stone-200 font-label-md font-bold rounded-full flex items-center justify-center gap-2 hover:border-stone-400 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button 
                onClick={() => handleLaunch('Active')}
                disabled={isSubmitting}
                className="flex-1 h-14 bg-primary text-white font-label-md font-bold rounded-full shadow-[0_4px_0_0_#7b2f00] flex items-center justify-center gap-2 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#7b2f00] active:translate-y-[3px] active:shadow-[0_1px_0_0_#7b2f00] transition-all uppercase tracking-widest disabled:opacity-50 disabled:active:translate-y-0"
              >
                {isSubmitting ? 'Launching...' : <><Rocket className="w-5 h-5" /> Launch Campaign</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
