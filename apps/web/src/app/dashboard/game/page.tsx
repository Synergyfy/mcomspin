'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useBusinessGame, useUpdateBusinessGame, useBusinessCampaigns, useBusinessRewards } from '@/services/business';

const PEG_DENSITY_OPTIONS = [
  { value: 'low', label: 'Low', pegsPerRow: 4 },
  { value: 'medium', label: 'Medium', pegsPerRow: 6 },
  { value: 'high', label: 'High', pegsPerRow: 8 },
] as const;

const BALL_SPEED_OPTIONS = [
  { value: 'slow', label: 'Slow', ms: 300 },
  { value: 'normal', label: 'Normal', ms: 180 },
  { value: 'fast', label: 'Fast', ms: 100 },
] as const;

const SHUFFLE_SPEED_OPTIONS = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
] as const;

const LAYOUT_OPTIONS = [2, 4, 6, 8];

function generateDefaultBoxes(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    hasReward: i === Math.floor(count / 2),
    label: i === Math.floor(count / 2) ? 'Win' : 'Try Again',
    rewardType: i === Math.floor(count / 2) ? 'Discount' : null,
    rewardValue: i === Math.floor(count / 2) ? 10 : null,
    rewardId: null,
    rewardName: null,
  }));
}

export default function BallDropGamePage() {
  const { data: gameData, isLoading } = useBusinessGame();
  const updateGame = useUpdateBusinessGame();
  const { data: campaignsData } = useBusinessCampaigns();
  const { data: rewardsData } = useBusinessRewards();

  const [isActive, setIsActive] = useState(true);
  const [boxCount, setBoxCount] = useState(4);
  const [boxes, setBoxes] = useState<any[]>(() => generateDefaultBoxes(4));
  const [pegDensity, setPegDensity] = useState('medium');
  const [ballSpeed, setBallSpeed] = useState('normal');
  const [bounceAmount, setBounceAmount] = useState(0.6);
  const [shuffleEnabled, setShuffleEnabled] = useState(true);
  const [shuffleSpeed, setShuffleSpeed] = useState('normal');
  const [dailyLimit, setDailyLimit] = useState(5);
  const [weeklyLimit, setWeeklyLimit] = useState(20);
  const [assignedCampaignIds, setAssignedCampaignIds] = useState<string[]>([]);

  const [ballAnimating, setBallAnimating] = useState(false);
  const [ballRow, setBallRow] = useState(-1);
  const [ballCol, setBallCol] = useState(0);
  const [resultBox, setResultBox] = useState<number | null>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [savedMsg, setSavedMsg] = useState<'saving' | 'saved' | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const campaigns: any[] = Array.isArray(campaignsData) ? campaignsData : (campaignsData as any)?.data ?? [];
  const rewards: any[] = Array.isArray(rewardsData) ? rewardsData : (rewardsData as any)?.data ?? [];

  /* ── Sync state to ref for safe callback access ── */
  const stateRef = useRef({
    isActive: true, boxes: boxes, pegDensity: 'medium', ballSpeed: 'normal', bounceAmount: 0.6,
    shuffleEnabled: true, shuffleSpeed: 'normal', dailyLimit: 5, weeklyLimit: 20, assignedCampaignIds: [] as string[],
  });

  useEffect(() => {
    stateRef.current = {
      isActive, boxes, pegDensity, ballSpeed, bounceAmount,
      shuffleEnabled, shuffleSpeed, dailyLimit, weeklyLimit, assignedCampaignIds,
    };
  }, [isActive, boxes, pegDensity, ballSpeed, bounceAmount, shuffleEnabled, shuffleSpeed, dailyLimit, weeklyLimit, assignedCampaignIds]);

  const save = useCallback(
    (overrides: Record<string, any> = {}) => {
      const s = stateRef.current;
      setSavedMsg('saving');
      if (saveTimer.current) clearTimeout(saveTimer.current);
      updateGame.mutate(
        {
          isActive: s.isActive,
          config: {
            boxes: s.boxes,
            physics: { pegDensity: s.pegDensity, ballSpeed: s.ballSpeed, bounceAmount: s.bounceAmount },
            shuffle: { enabled: s.shuffleEnabled, speed: s.shuffleSpeed },
            limits: { daily: s.dailyLimit, weekly: s.weeklyLimit },
            ...overrides,
          },
          campaignIds: s.assignedCampaignIds,
        },
        {
          onSuccess: () => {
            setSavedMsg('saved');
            saveTimer.current = setTimeout(() => setSavedMsg(null), 2000);
          },
        },
      );
    },
    [updateGame],
  );

  useEffect(() => {
    if (!gameData) return;
    setIsActive(gameData.isActive ?? true);
    const cfg = (gameData.config ?? {}) as Record<string, any>;
    const loadedBoxes = Array.isArray(cfg.boxes) ? cfg.boxes : (Array.isArray(cfg) ? cfg : generateDefaultBoxes(stateRef.current.boxes.length));
    setBoxes(loadedBoxes);
    setBoxCount(loadedBoxes.length);
    if (cfg.physics) {
      setPegDensity(cfg.physics.pegDensity ?? 'medium');
      setBallSpeed(cfg.physics.ballSpeed ?? 'normal');
      setBounceAmount(cfg.physics.bounceAmount ?? 0.6);
    }
    if (cfg.shuffle) {
      setShuffleEnabled(cfg.shuffle.enabled ?? true);
      setShuffleSpeed(cfg.shuffle.speed ?? 'normal');
    }
    if (cfg.limits) {
      setDailyLimit(cfg.limits.daily ?? 5);
      setWeeklyLimit(cfg.limits.weekly ?? 20);
    }
    const gcs = (gameData as any).gameCampaigns;
    if (Array.isArray(gcs)) {
      setAssignedCampaignIds(gcs.map((gc: any) => gc.campaignId));
    }
  }, [gameData]);

  const handleBoxCountChange = (count: number) => {
    let newBoxes: any[];
    setBoxes((prev) => {
      if (count > prev.length) {
        const extra = Array.from({ length: count - prev.length }, (_, i) => ({
          index: prev.length + i,
          hasReward: false,
          label: 'Try Again',
          rewardType: null,
          rewardValue: null,
          rewardId: null,
          rewardName: null,
        }));
        newBoxes = [...prev, ...extra];
      } else {
        newBoxes = prev.slice(0, count);
      }
      return newBoxes;
    });
    setBoxCount(count);
    stateRef.current.boxes = newBoxes!;
  };

  const handleBoxChange = (index: number, field: string, value: any) => {
    setBoxes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (field === 'rewardId' && value) {
        const reward = rewards.find((r: any) => r.id === value);
        if (reward) {
          next[index].rewardName = reward.name;
          next[index].rewardType = reward.type;
          next[index].rewardValue = Number(reward.value);
          next[index].hasReward = true;
          next[index].label = reward.name;
        }
      }
      if (field === 'hasReward' && !value) {
        next[index].rewardId = null;
        next[index].rewardName = null;
        next[index].rewardType = null;
        next[index].rewardValue = null;
        next[index].label = 'No Prize';
      }
      stateRef.current.boxes = next;
      return next;
    });
  };

  const toggleActive = (active: boolean) => {
    setIsActive(active);
    stateRef.current.isActive = active;
  };

  const handlePegDensity = (val: string) => { setPegDensity(val); stateRef.current.pegDensity = val; };
  const handleBallSpeed = (val: string) => { setBallSpeed(val); stateRef.current.ballSpeed = val; };
  const handleBounce = (val: number) => { setBounceAmount(val); stateRef.current.bounceAmount = val; };
  const handleShuffleEnabled = (val: boolean) => { setShuffleEnabled(val); stateRef.current.shuffleEnabled = val; };
  const handleShuffleSpeed = (val: string) => { setShuffleSpeed(val); stateRef.current.shuffleSpeed = val; };
  const handleDailyLimit = (val: number) => { setDailyLimit(val); stateRef.current.dailyLimit = val; };
  const handleWeeklyLimit = (val: number) => { setWeeklyLimit(val); stateRef.current.weeklyLimit = val; };
  const handleCampaignToggle = (id: string) => {
    const next = assignedCampaignIds.includes(id)
      ? assignedCampaignIds.filter((c) => c !== id)
      : [...assignedCampaignIds, id];
    setAssignedCampaignIds(next);
    stateRef.current.assignedCampaignIds = next;
  };

  const pegsPerRow = PEG_DENSITY_OPTIONS.find((p) => p.value === pegDensity)?.pegsPerRow ?? 6;
  const ballMs = BALL_SPEED_OPTIONS.find((p) => p.value === ballSpeed)?.ms ?? 180;
  const pegRows = 8;

  const runDropAnimation = useCallback(() => {
    if (ballAnimating) return;
    setBallAnimating(true);
    setResultBox(null);
    setBallRow(0);
    const startCol = Math.floor(pegsPerRow / 2);
    setBallCol(startCol);

    let row = 0;
    let col = startCol;

    const step = () => {
      if (row >= pegRows) {
        const finalBox = Math.min(Math.max(col - 1, 0), boxCount - 1);
        setResultBox(finalBox);
        setBallAnimating(false);
        return;
      }
      const drift = Math.random() > 0.5 ? 1 : -1;
      col = Math.max(0, Math.min(col + drift, pegsPerRow));
      row++;
      setBallRow(row);
      setBallCol(col);
      animRef.current = setTimeout(step, ballMs);
    };

    animRef.current = setTimeout(step, ballMs);
  }, [ballAnimating, pegsPerRow, pegRows, boxCount, ballMs]);

  useEffect(() => {
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  const maxBallCol = pegRows + 2;
  const ballLeftPercent = boxCount > 0 ? ((ballCol / Math.max(maxBallCol, 1)) * 100) : 50;
  const clampedLeft = Math.max(0, Math.min(100, ballLeftPercent));

  const densityLabel = PEG_DENSITY_OPTIONS.find((p) => p.value === pegDensity)?.label ?? 'Medium';
  const speedLabel = BALL_SPEED_OPTIONS.find((p) => p.value === ballSpeed)?.label ?? 'Normal';

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* ── Header (sticky top) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Ball Drop Game</h2>
          <p className="text-[#888] mt-1">Configure and manage your ball drop game settings.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-[#eee] shadow-sm">
          <button
            onClick={() => toggleActive(true)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              isActive
                ? 'bg-[#f97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.25)]'
                : 'text-[#888] hover:text-[#1a1a1a]'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => toggleActive(false)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              !isActive
                ? 'bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)]'
                : 'text-[#888] hover:text-[#1a1a1a]'
            }`}
          >
            Paused
          </button>
        </div>
        {/* ── Save Button ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => save()}
            disabled={savedMsg === 'saving'}
            className={`px-5 py-2 text-[13px] font-bold rounded-xl transition-all flex items-center gap-2 ${
              savedMsg === 'saving'
                ? 'bg-[#f0f0ee] text-[#aaa] cursor-not-allowed'
                : 'bg-[#f97316] text-white hover:bg-[#e8620c] shadow-[0_4px_12px_rgba(249,115,22,0.25)]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {savedMsg === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
          {savedMsg === 'saved' && (
            <span className="text-green-600 flex items-center gap-1.5 text-[12px] font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* ── Left: Settings (scrollable) ── */}
        <div className="lg:col-span-1 space-y-8 overflow-y-auto pr-2 scrollbar-thin">
          {/* Box Layout */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Box Layout
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Choose how many prize boxes appear at the bottom.</p>
            <div className="grid grid-cols-2 gap-3">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleBoxCountChange(opt)}
                  className={`py-4 px-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    boxCount === opt
                      ? 'border-[#f97316] bg-[#f97316]/5 text-[#f97316]'
                      : 'border-[#f5f5f3] bg-[#fafaf9] text-[#aaa] hover:border-[#eee] hover:bg-white'
                  }`}
                >
                  <span className="text-xl font-bold">{opt}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold">Boxes</span>
                </button>
              ))}
            </div>
          </section>

          {/* Prize Slot Configuration */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Prize Slots
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Assign rewards to each box slot.</p>
            <div className="space-y-4">
              {boxes.map((box: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl border border-[#f0f0ee] bg-[#fafaf9]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-bold text-[#1a1a1a]">Box {i + 1}</span>
                    <label className="flex items-center gap-2 text-[12px] text-[#888] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={box.hasReward}
                        onChange={(e) => handleBoxChange(i, 'hasReward', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#ddd] text-[#f97316] focus:ring-[#f97316]"
                      />
                      Has Prize
                    </label>
                  </div>
                  {box.hasReward && (
                    <div className="space-y-2">
                      <select
                        value={box.rewardId ?? ''}
                        onChange={(e) => handleBoxChange(i, 'rewardId', e.target.value)}
                        className="w-full text-[12px] px-3 py-2 rounded-xl border border-[#eee] bg-white text-[#444] focus:outline-none focus:border-[#f97316]"
                      >
                        <option value="">Select a reward...</option>
                        {rewards.map((r: any) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.type} - £{Number(r.value).toFixed(2)})
                          </option>
                        ))}
                      </select>
                      {rewards.length === 0 && (
                        <p className="text-[11px] text-[#f97316]">No rewards created yet. Create rewards first.</p>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={box.label ?? ''}
                          onChange={(e) => handleBoxChange(i, 'label', e.target.value)}
                          placeholder="Box label"
                          className="flex-1 text-[12px] px-3 py-2 rounded-xl border border-[#eee] bg-white text-[#444] focus:outline-none focus:border-[#f97316]"
                        />
                        <input
                          type="number"
                          value={box.rewardValue ?? ''}
                          onChange={(e) => handleBoxChange(i, 'rewardValue', Number(e.target.value))}
                          placeholder="Value"
                          className="w-20 text-[12px] px-3 py-2 rounded-xl border border-[#eee] bg-white text-[#444] focus:outline-none focus:border-[#f97316]"
                        />
                      </div>
                    </div>
                  )}
                  {!box.hasReward && (
                    <div>
                      <input
                        type="text"
                        value={box.label ?? 'No Prize'}
                        onChange={(e) => handleBoxChange(i, 'label', e.target.value)}
                        placeholder="Label (e.g. Try Again)"
                        className="w-full text-[12px] px-3 py-2 rounded-xl border border-[#eee] bg-white text-[#444] focus:outline-none focus:border-[#f97316]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Physics Settings */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Physics
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Adjust ball drop physics and peg density.</p>
            <div className="space-y-5">
              <div>
                <label className="text-[12px] font-semibold text-[#555] mb-2 block">Peg Density</label>
                <div className="flex gap-2">
                  {PEG_DENSITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handlePegDensity(opt.value)}
                      className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-semibold border-2 transition-all ${
                        pegDensity === opt.value
                          ? 'border-[#f97316] bg-[#f97316]/5 text-[#f97316]'
                          : 'border-[#f5f5f3] bg-[#fafaf9] text-[#888] hover:border-[#eee]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#555] mb-2 block">Ball Speed</label>
                <div className="flex gap-2">
                  {BALL_SPEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleBallSpeed(opt.value)}
                      className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-semibold border-2 transition-all ${
                        ballSpeed === opt.value
                          ? 'border-[#f97316] bg-[#f97316]/5 text-[#f97316]'
                          : 'border-[#f5f5f3] bg-[#fafaf9] text-[#888] hover:border-[#eee]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#555] mb-2 block">
                  Bounce: {Math.round(bounceAmount * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(bounceAmount * 100)}
                  onChange={(e) => handleBounce(Number(e.target.value) / 100)}
                  className="w-full accent-[#f97316]"
                />
              </div>
            </div>
          </section>

          {/* Shuffle Settings */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Box Shuffle
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Control how boxes shuffle before the drop.</p>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleEnabled}
                   onChange={(e) => handleShuffleEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ddd] text-[#f97316] focus:ring-[#f97316]"
                />
                <span className="text-[13px] font-medium text-[#444]">Shuffle boxes before each drop</span>
              </label>
              {shuffleEnabled && (
                <div>
                  <label className="text-[12px] font-semibold text-[#555] mb-2 block">Shuffle Speed</label>
                  <div className="flex gap-2">
                    {SHUFFLE_SPEED_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleShuffleSpeed(opt.value)}
                        className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-semibold border-2 transition-all ${
                          shuffleSpeed === opt.value
                            ? 'border-[#f97316] bg-[#f97316]/5 text-[#f97316]'
                            : 'border-[#f5f5f3] bg-[#fafaf9] text-[#888] hover:border-[#eee]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Play Limits */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Play Limits
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Set how often customers can play.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-[#555] mb-1 block">Daily Plays per Customer</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={dailyLimit}
                  onChange={(e) => handleDailyLimit(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-[#eee] text-[13px] text-[#444] focus:outline-none focus:border-[#f97316]"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#555] mb-1 block">Weekly Plays per Customer</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={weeklyLimit}
                  onChange={(e) => handleWeeklyLimit(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-[#eee] text-[13px] text-[#444] focus:outline-none focus:border-[#f97316]"
                />
              </div>
            </div>
          </section>

          {/* Campaign Assignment */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Campaign Assignment
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Select which campaigns use this game config.</p>
            {campaigns.length === 0 && (
              <p className="text-[12px] text-[#888] italic">No campaigns yet. Create campaigns first.</p>
            )}
            <div className="space-y-3">
              {campaigns.map((campaign: any) => (
                <label
                  key={campaign.id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#fafaf9] cursor-pointer transition-colors border border-transparent hover:border-[#eee]"
                >
                  <input
                    type="checkbox"
                    checked={assignedCampaignIds.includes(campaign.id)}
                    onChange={() => handleCampaignToggle(campaign.id)}
                    className="w-4 h-4 rounded border-[#ddd] text-[#f97316] focus:ring-[#f97316]"
                  />
                  <span className="text-[13px] font-medium text-[#444]">{campaign.name}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right: Demo Preview (sticky) ── */}
        <div className="lg:col-span-2 sticky top-0 self-start">
          <section className="bg-white rounded-3xl border border-[#eee] overflow-hidden shadow-sm flex flex-col h-full min-h-[650px]">
            <div className="p-6 border-b border-[#eee] flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-[#1a1a1a]">Demo Preview</h3>
                <p className="text-[13px] text-[#888]">
                  {boxCount} boxes &middot; {densityLabel} density &middot; {speedLabel} speed
                  {shuffleEnabled ? ' &middot; Shuffle on' : ''}
                </p>
              </div>
              <button
                onClick={runDropAnimation}
                disabled={ballAnimating}
                className={`px-4 py-2 text-[12px] font-bold rounded-xl transition-all flex items-center gap-2 ${
                  ballAnimating
                    ? 'bg-[#f0f0ee] text-[#aaa] cursor-not-allowed'
                    : 'bg-[#f97316] text-white hover:bg-[#e8620c] shadow-[0_4px_12px_rgba(249,115,22,0.25)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {ballAnimating ? 'Dropping...' : 'Test Drop'}
              </button>
            </div>
            <div className="flex-1 bg-[#fafaf9] relative flex items-center justify-center p-8">
              <div className="w-[360px] h-[520px] bg-white rounded-[40px] shadow-2xl border-[8px] border-[#1a1a1a] relative overflow-hidden flex flex-col">
                {/* Top bar */}
                <div className="h-14 bg-[#f97316] flex items-center justify-center text-white font-bold text-sm tracking-tight">
                  MCOM SPIN
                </div>

                {/* Game area */}
                <div className="flex-1 relative overflow-hidden">
                  {/* Drop zone at top */}
                  <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
                    <div className="w-12 h-3 bg-[#f97316]/30 rounded-full" />
                  </div>

                  {/* Pegs */}
                  <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 gap-3">
                    {Array.from({ length: pegRows }).map((_, row) => {
                      const pegsInRow = pegsPerRow - (row % 2 === 0 ? 0 : 1);
                      const offset = row % 2 === 0 ? 0 : 0.5;
                      return (
                        <div key={row} className="flex gap-4 justify-center" style={{ paddingLeft: offset * 24 }}>
                          {Array.from({ length: pegsInRow }).map((_, peg) => (
                            <div
                              key={peg}
                              className={`rounded-full bg-[#ddd] transition-all ${
                                ballAnimating && ballRow === row && ballCol === peg
                                  ? 'bg-[#f97316] scale-125 shadow-[0_0_8px_rgba(249,115,22,0.5)]'
                                  : ''
                              }`}
                              style={{
                                width: row % 2 === 1 ? 10 : 12,
                                height: row % 2 === 1 ? 10 : 12,
                              }}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {/* Ball */}
                  {ballAnimating && (
                    <div
                      className="absolute w-7 h-7 bg-[#f97316] rounded-full shadow-lg border-2 border-white z-20 transition-all duration-200 ease-in-out"
                      style={{
                        left: `${clampedLeft}%`,
                        transform: 'translateX(-50%)',
                        top: `${ballRow >= 0 ? 32 + ballRow * 36 : 0}px`,
                      }}
                    />
                  )}

                  {/* Result overlay */}
                  {resultBox !== null && !ballAnimating && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                      <div className="bg-white rounded-3xl p-6 text-center shadow-2xl mx-6 max-w-[240px]">
                        {boxes[resultBox]?.hasReward ? (
                          <>
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-[15px] font-bold text-[#1a1a1a] mb-1">You Won!</p>
                            <p className="text-[13px] text-[#f97316] font-semibold">
                              {boxes[resultBox]?.label || 'Prize'}
                            </p>
                            {boxes[resultBox]?.rewardValue && (
                              <p className="text-[11px] text-[#888] mt-1">
                                £{Number(boxes[resultBox].rewardValue).toFixed(2)} value
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-14 h-14 rounded-full bg-[#f5f5f3] flex items-center justify-center mx-auto mb-3">
                              <svg className="w-7 h-7 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <p className="text-[15px] font-bold text-[#1a1a1a] mb-1">
                              {boxes[resultBox]?.label || 'Try Again'}
                            </p>
                            <p className="text-[12px] text-[#888]">Better luck next time!</p>
                          </>
                        )}
                        <button
                          onClick={runDropAnimation}
                          className="mt-4 px-5 py-2 bg-[#f97316] text-white text-[12px] font-bold rounded-xl hover:bg-[#e8620c] transition-colors w-full"
                        >
                          Drop Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boxes at bottom */}
                <div className="h-[88px] border-t border-[#eee] flex shrink-0">
                  {boxes.map((box: any, i: number) => (
                    <div
                      key={i}
                      className={`flex-1 border-r border-[#eee] last:border-0 flex flex-col items-center justify-center gap-1 transition-colors ${
                        resultBox === i && !ballAnimating
                          ? box?.hasReward
                            ? 'bg-green-50'
                            : 'bg-red-50'
                          : 'bg-[#fafaf9]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                          resultBox === i && !ballAnimating
                            ? box?.hasReward
                              ? 'border-green-400 bg-green-100 shadow-[0_0_16px_rgba(34,197,94,0.3)]'
                              : 'border-red-300 bg-red-50'
                            : 'border-[#e0e0dd] bg-white'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-[#888]">{i + 1}</span>
                      </div>
                      <span className="text-[9px] text-[#888] truncate max-w-[90%] text-center leading-tight">
                        {box?.label || `Box ${i + 1}`}
                      </span>
                      {box?.hasReward && (
                        <span className="text-[8px] text-[#f97316] font-semibold">PRIZE</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
