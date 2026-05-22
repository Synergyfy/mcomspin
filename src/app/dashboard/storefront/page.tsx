'use client';

import React, { useState } from 'react';

const integrationsList = [
  { domain: 'meridian-apparel.com', status: 'active', widget: 'Checkout Embed', lastActivity: '2 mins ago' },
  { domain: 'elarawellness.co', status: 'active', widget: 'Booking Module', lastActivity: '15 mins ago' },
  { domain: 'vantageshop.com', status: 'pending', widget: 'Product Page', lastActivity: 'Yesterday' },
];

export default function StorefrontPage() {
  const [copied, setCopied] = useState(false);
  const [accentColor, setAccentColor] = useState('#f97316');
  const [widgetPosition, setWidgetPosition] = useState('bottom-right');
  const [widgetSize, setWidgetSize] = useState('standard');

  const embedCode = `<script 
  src="https://cdn.mcomspin.com/widget.js" 
  data-store-id="mcs_live_9a2b8e7c1d" 
  data-theme-color="${accentColor}"
  data-position="${widgetPosition}"
  data-size="${widgetSize}"
  async
></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Integrations</p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Storefront Embeds</h1>
        <p className="text-[#888] text-[13px] mt-1">Integrate gamified engagement engines directly into your e-commerce storefronts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side - Settings and Integration details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Integrations */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4">
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Active Embeds</h2>
            <div className="space-y-3">
              {integrationsList.map((item) => (
                <div key={item.domain} className="flex items-center justify-between p-4 rounded-xl border border-[#eee] bg-[#fafaf9] hover:border-[#f97316]/20 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                      <span className="text-[13px] font-semibold text-[#1a1a1a]">{item.domain}</span>
                    </div>
                    <p className="text-[#888] text-[11px]">{item.widget} • Active {item.lastActivity}</p>
                  </div>
                  <button className="text-[11px] font-bold uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-lg border border-[#eee] bg-white hover:border-[#1a1a1a] hover:bg-[#fafaf9] transition-all text-[#1a1a1a]">
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Embed Code Panel */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Universal Embed Script</h2>
              <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">v1.2.4</span>
            </div>
            <p className="text-[#888] text-[13px]">Paste this snippet into the header of your HTML documents to deploy the gamification engine on your storefront.</p>
            <div className="relative">
              <pre className="text-[12px] font-mono bg-[#1a1a1a] text-[#f5f5f3] p-5 rounded-xl overflow-x-auto leading-relaxed border border-[#2e2e2e]">
                {embedCode}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3.5 py-1.5 text-[11px] font-bold tracking-[0.08em] uppercase transition-all flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v1.25m-12 5.625h12m-12 3h12" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Theme Customization */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-5">
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Widget Appearance Config</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Accent Color</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 border border-[#eee] rounded-xl cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 w-full px-3 py-2 border border-[#eee] rounded-xl text-sm font-semibold uppercase text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Widget Position</label>
                <select
                  value={widgetPosition}
                  onChange={(e) => setWidgetPosition(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#eee] rounded-xl text-sm font-medium text-[#1a1a1a] focus:outline-none focus:border-[#f97316]/40 bg-white"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">Widget Size</label>
                <div className="flex rounded-xl bg-[#f5f5f3] p-1 h-[42px] items-center">
                  {['compact', 'standard', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setWidgetSize(size)}
                      className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] rounded-lg transition-all ${
                        widgetSize === size
                          ? 'bg-white text-[#1a1a1a] shadow-sm'
                          : 'text-[#888] hover:text-[#555]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Live Widget Preview Mockup */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 h-full flex flex-col space-y-4">
            <div>
              <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Ecosystem Preview</h2>
              <p className="text-[#888] text-[12px] mt-0.5">Real-time simulation of the widget embed on a business partner checkout.</p>
            </div>

            {/* Browser Window Mockup */}
            <div className="flex-1 min-h-[350px] border border-[#eee] rounded-xl flex flex-col overflow-hidden bg-[#fafaf9] shadow-inner relative">
              {/* Browser chrome header */}
              <div className="bg-white px-4 py-3 border-b border-[#eee] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex-1 max-w-[280px] mx-auto bg-[#f5f5f3] text-[#888] text-[10px] font-medium py-1 px-3 rounded-lg text-center font-mono truncate">
                  meridian-apparel.com/checkout
                </div>
              </div>

              {/* Browser web page simulator */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                {/* Simulated Checkout Box */}
                <div className="space-y-4 max-w-sm">
                  <div className="flex items-center justify-between border-b border-dashed border-[#eee] pb-3">
                    <span className="text-[13px] font-semibold text-[#1a1a1a]">Order Total</span>
                    <span className="text-base font-display font-bold text-[#1a1a1a]">$189.50</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-2/3 h-3 bg-[#e2e2e0] rounded animate-pulse" />
                    <div className="w-1/2 h-2 bg-[#e2e2e0]/60 rounded" />
                  </div>
                </div>

                {/* Simulated MComSpin Widget Embed */}
                <div className={`absolute ${
                  widgetPosition.includes('left') ? 'left-6' : 'right-6'
                } ${
                  widgetPosition.includes('top') ? 'top-16' : 'bottom-6'
                } transition-all duration-300`}>
                  {/* Premium Spinner/Reward Popup */}
                  <div className="bg-white rounded-2xl border border-[#eee] shadow-xl p-4 w-[240px] border-t-4 transition-all duration-300" style={{ borderTopColor: accentColor }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                      <span className="text-[10px] font-bold tracking-[0.1em] text-[#1a1a1a] uppercase">Unlock Reward Offer</span>
                    </div>
                    <p className="text-[12px] font-semibold text-[#1a1a1a] leading-snug">Spin to unlock partner promotions at checkout!</p>
                    <p className="text-[10px] text-[#888] mt-1">Rotates offers from Vantage Electronics & Elara Wellness.</p>
                    
                    {/* Simulated Spin Button */}
                    <button 
                      className="w-full mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-white py-2 rounded-lg transition-transform duration-200 active:scale-95 shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      Spin Wheel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
