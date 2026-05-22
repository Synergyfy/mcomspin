'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState('mcs_live_7a3d9f2e4b8c1d5e6f8a9b0c2d3e4f5a');
  const [showKey, setShowKey] = useState(false);
  const [notifs, setNotifs] = useState({
    email: true,
    push: false,
    digest: true,
    campaigns: true,
  });

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const regenerateKey = () => {
    const chars = '0123456789abcdef';
    let newKey = 'mcs_live_';
    for (let i = 0; i < 32; i++) {
      newKey += chars[Math.floor(Math.random() * 16)];
    }
    setApiKey(newKey);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Configuration</p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Ecosystem Settings</h1>
        <p className="text-[#888] text-[13px] mt-1">Configure your corporate tenant profile, set automated communications preferences, and retrieve live API integration keys.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: General Profile & Credentials */}
        <div className="lg:col-span-8 space-y-6">
          {/* Business Profile */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-5">
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Corporate Identity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Upload Placeholder */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Brand Logo</label>
                <div className="border border-dashed border-[#eee] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#f97316]/30 bg-[#fafaf9] h-[116px] transition-all">
                  <svg className="w-5 h-5 text-[#bbb] mb-1.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-[11px] font-semibold text-[#1a1a1a]">Upload SVG</span>
                  <span className="text-[9px] text-[#bbb] mt-0.5">Max 500KB</span>
                </div>
              </div>

              {/* Business Name and Category */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Legal Entity Name</label>
                    <input
                      type="text"
                      defaultValue="MComSpin Corp"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Industry Segment</label>
                    <input
                      type="text"
                      defaultValue="Collaborative Commerce"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Ecosystem Description</label>
                  <textarea
                    rows={2}
                    defaultValue="High-end corporate storefront engagement and partner routing engine."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Section */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-5">
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Account Security & Credentials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Login Identity Email</label>
                <input
                  type="email"
                  defaultValue="admin@mcomspin.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Active Authorization Role</label>
                <input
                  type="text"
                  disabled
                  defaultValue="Workspace Administrator"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-stone-50 text-sm text-[#888] cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="border-t border-[#f5f5f3] pt-5 space-y-4">
              <h3 className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-[0.08em]">Change Secure Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm focus:outline-none focus:border-[#f97316]/40"
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm focus:outline-none focus:border-[#f97316]/40"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm focus:outline-none focus:border-[#f97316]/40"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className="bg-[#1a1a1a] hover:bg-[#f97316] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-colors shadow-sm">
                Save Workspace Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Integrations, API & Communication Toggles */}
        <div className="lg:col-span-4 space-y-6">
          {/* API Credentials */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4">
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Developer Access Keys</h2>
            <p className="text-[#888] text-[12px] leading-relaxed">Embed MComSpin directly within server-side applications using secure authorization keys.</p>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  readOnly
                  value={apiKey}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] font-mono text-[12px] text-[#1a1a1a] focus:outline-none"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-3.5 text-[#bbb] hover:text-[#555] transition-colors"
                >
                  {showKey ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyKey}
                  className="flex-1 bg-[#1a1a1a] hover:bg-[#f97316] text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copied ? 'Copied Key!' : 'Copy Key'}
                </button>
                <button
                  onClick={regenerateKey}
                  className="flex-1 border border-[#eee] hover:border-[#1a1a1a] text-[#1a1a1a] py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all bg-white"
                >
                  Rotate Secret Key
                </button>
              </div>
            </div>
          </div>

          {/* Comm Preferences */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4">
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Communications Settings</h2>
            
            <div className="space-y-3.5">
              {[
                { key: 'email' as const, label: 'Email Notifications', desc: 'Alert critical billing and key activities.' },
                { key: 'push' as const, label: 'Real-time Browser Push', desc: 'Direct desktop notifications for leads.' },
                { key: 'digest' as const, label: 'Weekly Summary Digest', desc: 'Rotations performance and revenue logs.' },
                { key: 'campaigns' as const, label: 'Campaign Level Updates', desc: 'Instant status changes on active pools.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-2">
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-bold text-[#1a1a1a]">{item.label}</p>
                    <p className="text-[10px] text-[#888] leading-relaxed">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(item.key)}
                    className={`w-9 h-5.5 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-300 ${
                      notifs[item.key] ? 'bg-[#f97316]' : 'bg-[#e2e2e0]'
                    }`}
                  >
                    <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-300 ${
                      notifs[item.key] ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/20 border border-red-200/60 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-display font-semibold text-red-600">Danger Zone</h2>
              <p className="text-red-500 text-[11px] mt-0.5 leading-relaxed">
                Irreversible account changes. This will sever all storefront integration hooks and terminate active campaigns.
              </p>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-colors shadow-sm shadow-red-200">
              Deactivate Partner Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
