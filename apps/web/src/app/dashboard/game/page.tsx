'use client';

import React, { useState, useEffect } from 'react';
import { useBusinessGame, useUpdateBusinessGame, useBusinessCampaigns } from '@/services/business';

export default function BallDropGamePage() {
  const [gameStatus, setGameStatus] = useState<'Active' | 'Paused'>('Active');
  const [boxLayout, setBoxLayout] = useState<number>(4);
  const [assignedCampaigns, setAssignedCampaigns] = useState<string[]>(['Summer Splash 2024']);

  const { data: gameData } = useBusinessGame();
  const updateGame = useUpdateBusinessGame();
  const { data: campaignsData } = useBusinessCampaigns();
  const campaignNames: string[] = (campaignsData as any[])?.map((c: any) => c.name) ?? [];

  useEffect(() => {
    if (gameData) {
      setGameStatus(gameData.status ?? 'Active');
      setBoxLayout(gameData.boxLayout ?? 4);
      setAssignedCampaigns(gameData.campaigns ?? ['Summer Splash 2024']);
    }
  }, [gameData]);

  const layoutOptions = [2, 4, 6, 8];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Ball Drop Game</h2>
          <p className="text-[#888] mt-1">Configure and manage your ball drop game settings.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-[#eee] shadow-sm">
          <button
            onClick={() => {
              setGameStatus('Active');
              updateGame.mutate({ status: 'Active' });
            }}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              gameStatus === 'Active'
                ? 'bg-[#f97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.25)]'
                : 'text-[#888] hover:text-[#1a1a1a]'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => {
              setGameStatus('Paused');
              updateGame.mutate({ status: 'Paused' });
            }}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              gameStatus === 'Paused'
                ? 'bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)]'
                : 'text-[#888] hover:text-[#1a1a1a]'
            }`}
          >
            Paused
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Box Layout Selection */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Box Layout
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Choose how many prize boxes appear at the bottom of the game.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {layoutOptions.map((opt: any) => (
                <button
                  key={opt}
                  onClick={() => {
                    setBoxLayout(opt);
                    updateGame.mutate({ boxLayout: opt });
                  }}
                  className={`py-4 px-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    boxLayout === opt
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

          {/* Campaign Assignment */}
          <section className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              Campaign Assignment
            </h3>
            <p className="text-[13px] text-[#888] mb-6">Select which campaigns will use this game configuration.</p>
            
            <div className="space-y-3">
              {campaignNames.map((campaign: any) => (
                <label key={campaign} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#fafaf9] cursor-pointer transition-colors border border-transparent hover:border-[#eee]">
                  <input
                    type="checkbox"
                    checked={assignedCampaigns.includes(campaign)}
                    onChange={(e) => {
                      let updated: string[];
                      if (e.target.checked) {
                        updated = [...assignedCampaigns, campaign];
                        setAssignedCampaigns(updated);
                      } else {
                        updated = assignedCampaigns.filter(c => c !== campaign);
                        setAssignedCampaigns(updated);
                      }
                      updateGame.mutate({ campaigns: updated });
                    }}
                    className="w-4 h-4 rounded border-[#ddd] text-[#f97316] focus:ring-[#f97316]"
                  />
                  <span className="text-[13px] font-medium text-[#444]">{campaign}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Demo Preview Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl border border-[#eee] overflow-hidden shadow-sm flex flex-col h-full min-h-[600px]">
            <div className="p-6 border-b border-[#eee] flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-[#1a1a1a]">Demo Preview</h3>
                <p className="text-[13px] text-[#888]">Live preview of the customer experience.</p>
              </div>
              <button className="px-4 py-2 bg-[#f5f5f3] hover:bg-[#eee] text-[#1a1a1a] text-[12px] font-bold rounded-xl transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Drop
              </button>
            </div>
            
            <div className="flex-1 bg-[#fafaf9] relative flex items-center justify-center p-8">
              {/* Mock Game Canvas */}
              <div className="w-[320px] h-[500px] bg-white rounded-[40px] shadow-2xl border-[8px] border-[#1a1a1a] relative overflow-hidden flex flex-col">
                {/* Game Top */}
                <div className="h-16 bg-[#f97316] flex items-center justify-center text-white font-bold text-sm tracking-tight">
                  MCOM SPIN
                </div>
                
                {/* Game Area */}
                <div className="flex-1 bg-gradient-to-b from-[#f97316]/10 to-white relative p-4">
                  {/* Pegs Mockup */}
                  <div className="mt-8 grid grid-cols-5 gap-y-8 justify-items-center">
                    {Array.from({ length: 15 }).map((_: any, i: any) => (
                      <div key={i} className="w-1.5 h-1.5 bg-[#ddd] rounded-full" />
                    ))}
                  </div>

                  {/* Falling Ball Mockup */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#f97316] rounded-full shadow-lg border-2 border-white animate-bounce" />
                </div>

                {/* Boxes Mockup */}
                <div className="h-20 border-t border-[#eee] flex bg-[#fafaf9]">
                  {Array.from({ length: boxLayout }).map((_: any, i: any) => (
                    <div key={i} className="flex-1 border-r border-[#eee] last:border-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#eee] shadow-inner flex items-center justify-center">
                        <span className="text-[10px] font-bold text-[#f97316]">{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-lg text-center">
                <p className="text-[11px] font-medium text-[#666]">
                  This is a representative mockup of the <span className="font-bold text-[#f97316]">{boxLayout} box</span> layout.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
