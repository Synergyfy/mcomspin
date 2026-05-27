'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ─── GAMIFICATION CONTROL SUB-COMPONENTS ─── */

const TemplateCard = ({ title, desc, onSelect, onEdit }: { title: string, desc: string, onSelect: () => void, onEdit: () => void }) => (
  <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-full h-24 bg-stone-100 rounded-lg mb-3 flex items-center justify-center text-stone-400 font-bold">Preview</div>
    <h4 className="text-xs font-bold text-stone-900 mb-1">{title}</h4>
    <p className="text-[11px] text-stone-500 mb-4">{desc}</p>
    <div className="flex gap-2">
      <button onClick={onSelect} className="flex-1 bg-[#1a1a1a] text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-[#f97316] transition-colors">Select</button>
      <button onClick={onEdit} className="flex-1 bg-stone-100 text-stone-600 text-[10px] font-bold py-1.5 rounded-lg hover:bg-stone-200 transition-colors">Edit</button>
    </div>
  </div>
);

const ThemeSelectionList = ({ selectedTheme, onSelect }: { selectedTheme: string, onSelect: (name: string) => void }) => {
  const themes = [
    { name: 'Barber', color: 'bg-gradient-to-br from-stone-900 to-stone-700' },
    { name: 'Beauty', color: 'bg-gradient-to-br from-pink-300 to-rose-200' },
    { name: 'Retail', color: 'bg-gradient-to-br from-orange-400 to-orange-200' },
    { name: 'Restaurant', color: 'bg-gradient-to-br from-red-600 to-red-400' },
    { name: 'Event', color: 'bg-gradient-to-br from-purple-500 to-purple-300' },
    { name: 'High Street', color: 'bg-gradient-to-br from-blue-500 to-blue-300' },
    { name: 'Youth', color: 'bg-gradient-to-br from-emerald-400 to-emerald-200' },
    { name: 'MCOM', color: 'bg-gradient-to-br from-orange-600 to-orange-500' },
  ];

  return (
    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onSelect(theme.name)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
            selectedTheme === theme.name ? 'border-[#f97316] bg-orange-50' : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg ${theme.color}`} />
          <span className="text-xs font-bold text-stone-900">{theme.name} Theme</span>
        </button>
      ))}
    </div>
  );
};

const ThemeConfigPanel = ({ theme }: { theme: string }) => (
  <ControlSection title={`Configure ${theme} Theme`}>
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-stone-500 uppercase">Background Image/Color</label>
        <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs" placeholder="Paste image URL here..." />
        <input type="color" className="w-full h-8 rounded-lg cursor-pointer mt-2" defaultValue="#ffffff" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-stone-500 uppercase">Typography</label>
        <select className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-700">
          <option>Inter</option>
          <option>Roboto</option>
          <option>Playfair Display</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['Primary', 'Secondary', 'Accent'].map((color) => (
          <div key={color} className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase">{color}</label>
            <input type="color" className="w-full h-8 rounded-lg cursor-pointer" defaultValue="#f97316" />
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-stone-500 uppercase">Animation Style</label>
        <select className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-700">
          <option>Smooth</option>
          <option>Bouncy</option>
          <option>Snap</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-stone-500 uppercase">Audio Theme</label>
        <select className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-700">
          <option>Modern Corporate</option>
          <option>Upbeat Retail</option>
          <option>Relaxing Spa</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4 border-t border-stone-100">
        <button className="flex-1 bg-[#1a1a1a] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#f97316]">Save Configuration</button>
        <button className="flex-1 bg-stone-100 text-stone-600 text-xs font-bold py-2 rounded-lg hover:bg-stone-200">Reset</button>
      </div>
    </div>
  </ControlSection>
);

const ControlSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
    <h3 className="text-xs font-bold mb-6 uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-2">{title}</h3>
    {children}
  </div>
);

/* ─── MAIN GAMIFICATION CONTROL COMPONENT ─── */
const TemplatePreview = ({ boxes }: { boxes: number }) => (
  <div className="grid gap-2 border-2 border-dashed border-stone-200 rounded-2xl p-4 bg-stone-50" 
       style={{ gridTemplateColumns: `repeat(${boxes > 4 ? 4 : 2}, minmax(0, 1fr))` }}>
    {Array.from({ length: boxes }).map((_, i) => (
      <div key={i} className="aspect-square bg-white border-2 border-orange-200 rounded-lg shadow-inner flex items-center justify-center text-[10px] font-bold text-orange-400">Box {i + 1}</div>
    ))}
  </div>
);

export const GamificationControl = () => {
  const [subTab, setSubTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(4); // Default to 4
  const [selectedTheme, setSelectedTheme] = useState('Barber'); // Added state
  const tabs = [
    { id: 'templates', label: 'Game Templates' },
    { id: 'themes', label: 'Theme Templates' },
    { id: 'logic', label: 'Reward Logic' },
    { id: 'rotators', label: 'Rotator System' },
    { id: 'audio', label: 'Audio & Effects' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 bg-white border border-stone-200 p-1 rounded-xl w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${
              subTab === tab.id
                ? 'bg-[#1a1a1a] text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={subTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {subTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 content-start">
              {[2, 4, 6, 8].map((boxes) => (
                <TemplateCard 
                    key={boxes} 
                    title={`${boxes}-Box Layout`} 
                    desc="Classic grid configuration." 
                    onSelect={() => setSelectedTemplate(boxes)} 
                    onEdit={() => console.log('Editing', boxes)} 
                />
              ))}
            </div>
            {selectedTemplate && (
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm sticky top-6">
                <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-stone-500">Live Layout Preview ({selectedTemplate}-Box)</h3>
                <TemplatePreview boxes={selectedTemplate} />
                <button className="w-full mt-4 bg-[#f97316] text-white text-xs font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Deploy {selectedTemplate}-Box Template
                </button>
              </div>
            )}
          </div>
        )}

        {subTab === 'themes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ThemeSelectionList selectedTheme={selectedTheme} onSelect={setSelectedTheme} />
            <div className="lg:col-span-2">
              <ThemeConfigPanel theme={selectedTheme} />
            </div>
          </div>
        )}

        {subTab === 'logic' && (
          <ControlSection title="Logic Parameters">
            <div className="space-y-4">
              {['Random Priority', 'Weighted Distribution', 'Campaign Priority', 'Sponsored'].map((label) => (
                <div key={label} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">{label}</span>
                    <input type="checkbox" className="w-4 h-4 accent-[#f97316]" />
                </div>
              ))}
              <hr className="border-stone-100" />
              {['Visibility', 'Frequency', 'Exposure'].map((label) => (
                <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-500 font-medium">
                        <span>{label}</span>
                        <span>50%</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#f97316]" />
                </div>
              ))}
            </div>
          </ControlSection>
        )}

        {subTab === 'rotators' && (
          <ControlSection title="Rotation Strategy">
            <div className="space-y-4">
              {['Sequential', 'Time-based', 'Campaign', 'Randomized'].map((label) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="rotator" className="w-4 h-4 accent-[#f97316]" />
                  <span className="text-xs font-bold text-stone-700">{label}</span>
                </label>
              ))}
              <select className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs font-bold text-stone-700 outline-none">
                  <option>2-Box Rotation</option>
                  <option>4-Box Rotation</option>
                  <option>6-Box Rotation</option>
                  <option>8-Box Rotation</option>
              </select>
            </div>
          </ControlSection>
        )}

        {subTab === 'audio' && (
          <ControlSection title="Audio & Visual FX">
            <div className="space-y-4">
              {['Win Sound', 'Celebration Sound', 'Fireworks FX', 'Confetti FX'].map((label) => (
                <div key={label} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">{label}</span>
                    <input type="checkbox" className="w-4 h-4 accent-[#f97316]" />
                </div>
              ))}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-stone-500 font-medium">
                    <span>Volume</span>
                    <span>75%</span>
                </div>
                <input type="range" className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#f97316]" />
              </div>
            </div>
          </ControlSection>
        )}
      </motion.div>
    </div>
  );
};
