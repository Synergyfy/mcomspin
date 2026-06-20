'use client';

import React, { useState, useRef } from 'react';
import { useBusinessProfile, useUpdateBusinessProfile, useUpdateBusinessSettings } from '@/services/business';

type Tab = 'Profile' | 'Branding' | 'Notifications' | 'Security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const { data: profile } = useBusinessProfile();
  const updateProfile = useUpdateBusinessProfile();
  const updateSettings = useUpdateBusinessSettings();

  const nameRef = useRef<HTMLInputElement>(null);
  const industryRef = useRef<HTMLSelectElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Business Settings</h2>
        <p className="text-[#888] mt-1">Manage your business profile, branding, and account security.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#f5f5f3] rounded-2xl w-fit">
        {(['Profile', 'Branding', 'Notifications', 'Security'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${
              activeTab === tab 
                ? 'bg-white text-[#f97316] shadow-sm' 
                : 'text-[#aaa] hover:text-[#666]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Profile Tab */}
          {activeTab === 'Profile' && (
            <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Business Name</label>
                  <input type="text" ref={nameRef} defaultValue={profile?.businessName ?? ""} className="w-full bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-[#f97316] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Industry</label>
                  <select ref={industryRef} defaultValue={profile?.industry ?? ""} className="w-full bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] outline-none appearance-none">
                    <option>Restaurant / Cafe</option>
                    <option>Retail</option>
                    <option>Beauty / Salon</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Description</label>
                  <textarea ref={descRef} defaultValue={profile?.description ?? ""} className="w-full bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-[#f97316] transition-all h-24 resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Phone</label>
                  <input type="text" ref={phoneRef} defaultValue={profile?.phone ?? ""} className="w-full bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-[#f97316] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Email</label>
                  <input type="email" ref={emailRef} defaultValue={profile?.email ?? ""} className="w-full bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] outline-none focus:border-[#f97316] transition-all" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={() => updateProfile.mutate({ businessName: nameRef.current?.value, industry: industryRef.current?.value, description: descRef.current?.value, phone: phoneRef.current?.value, email: emailRef.current?.value })} className="px-8 py-3 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[13px] hover:bg-[#f97316] transition-all shadow-lg">Save Changes</button>
              </div>
            </section>
          )}

          {/* Branding Tab */}
          {activeTab === 'Branding' && (
            <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Visual Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Business Logo</label>
                  <div className="aspect-square w-32 bg-[#fafaf9] border-2 border-dashed border-[#eee] rounded-[32px] flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-[#f97316]/30 transition-all">
                    <svg className="w-6 h-6 text-[#ccc] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <span className="text-[10px] font-bold text-[#aaa]">Upload SVG or PNG</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Primary Brand Colour</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f97316] shadow-lg shadow-[#f97316]/20 border-4 border-white" />
                    <input type="text" ref={colorRef} defaultValue={profile?.primaryColor ?? "#f97316"} className="flex-1 bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] font-mono outline-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Storefront Banner</label>
                <div className="h-40 w-full bg-[#fafaf9] border-2 border-dashed border-[#eee] rounded-[32px] flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-[#f97316]/30 transition-all">
                   <svg className="w-8 h-8 text-[#ccc] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   <span className="text-[11px] font-bold text-[#aaa]">Click to upload wide banner image</span>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={() => updateSettings.mutate({ primaryColor: colorRef.current?.value })} className="px-8 py-3 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[13px] hover:bg-[#f97316] transition-all shadow-lg">Save Branding</button>
              </div>
            </section>
          )}

          {/* Notifications Tab */}
          {activeTab === 'Notifications' && (
             <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-[#1a1a1a]">System Notifications</h3>
              <div className="space-y-6">
                {Object.entries(notifs).map(([key, val]: [any, any]) => (
                  <div key={key} className="flex items-center justify-between py-4 border-b border-[#f5f5f3] last:border-0">
                    <div>
                      <p className="text-[14px] font-bold text-[#1a1a1a] capitalize">{key} Alerts</p>
                      <p className="text-[12px] text-[#888]">Receive critical account and system updates via {key}.</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(key as keyof typeof notifs)}
                      className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${val ? 'bg-[#f97316]' : 'bg-[#e2e2e0]'}`}
                    >
                      <div className={`bg-white w-4. h-4 rounded-full shadow-sm transform transition-transform ${val ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Security Tab */}
          {activeTab === 'Security' && (
            <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Security & Access</h3>
              <div className="space-y-6">
                <div className="p-6 bg-[#fafaf9] rounded-[32px] border border-[#f0f0ee] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#eee] text-xl">🔐</div>
                    <div>
                      <p className="text-[14px] font-bold text-[#1a1a1a]">Two-Factor Authentication</p>
                      <p className="text-[12px] text-[#888]">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-[#f97316] text-white rounded-xl text-[12px] font-bold hover:bg-[#ea580c] transition-all shadow-lg shadow-[#f97316]/20">Enable</button>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#f5f5f3]">
                  <h4 className="text-[12px] font-bold text-[#aaa] uppercase tracking-widest">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="password" placeholder="New Password" className="w-full bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] outline-none" />
                    <input type="password" placeholder="Confirm New Password" className="w-full bg-[#fafaf9] border border-[#f0f0ee] rounded-2xl px-4 py-3 text-[14px] outline-none" />
                  </div>
                  <button className="px-8 py-3 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[13px] hover:bg-[#f97316] transition-all">Update Password</button>
                </div>

                <div className="pt-8 border-t border-[#f5f5f3]">
                  <h4 className="text-[12px] font-bold text-[#aaa] uppercase tracking-widest mb-4">Login History</h4>
                  <div className="space-y-3">
{([] as any[]).map((session: any, i: any) => (
                      <div key={i} className="flex justify-between items-center text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1a1a1a] font-medium">{session.device}</span>
                          {session.active && <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[9px] font-bold rounded-md">ACTIVE</span>}
                        </div>
                        <span className="text-[#aaa]">{session.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Account Summary Sidebar */}
        <div className="space-y-8">
          <section className="bg-[#1a1a1a] rounded-[40px] p-8 text-white">
            <h3 className="text-lg font-bold mb-6">Account Status</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Subscription</p>
                <p className="text-[15px] font-bold mt-1">{profile?.subscription ?? "—"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Member Since</p>
                <p className="text-[15px] font-bold mt-1">{profile?.memberSince ?? "—"}</p>
              </div>
              <div className="pt-6 border-t border-white/10">
                 <button className="text-red-400 hover:text-red-300 text-[13px] font-bold transition-colors uppercase tracking-widest">Delete Business Workspace</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
