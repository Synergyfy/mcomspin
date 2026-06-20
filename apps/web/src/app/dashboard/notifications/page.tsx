'use client';

import React, { useState } from 'react';
import { useSendBusinessNotification } from '@/services/business';

export default function NotificationsPage() {
  const sendNotification = useSendBusinessNotification();
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const alerts: any[] = [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Notifications</h2>
        <p className="text-[#888] mt-1">Configure how and when you communicate with your customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Channels */}
        <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#1a1a1a]">Delivery Channels</h3>
          <div className="space-y-4">
            {Object.entries(channels).map(([key, val]: [any, any]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-[#fafaf9] rounded-2xl border border-[#f0f0ee]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#eee]">
                    {key === 'email' && '✉️'}
                    {key === 'sms' && '📱'}
                    {key === 'push' && '🔔'}
                  </div>
                  <span className="text-[14px] font-bold text-[#1a1a1a] capitalize">{key}</span>
                </div>
                <button
                  onClick={() => setChannels(prev => ({ ...prev, [key]: !val }))}
                  className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${val ? 'bg-[#f97316]' : 'bg-[#e2e2e0]'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${val ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Alert Types */}
        <section className="bg-[#1a1a1a] rounded-[40px] p-8 text-white space-y-6">
          <h3 className="text-lg font-bold">Automated Alerts</h3>
          <div className="space-y-6">
            {alerts.map((alert: any, i: any) => (
              <div key={i} className="flex gap-4">
                <div className="pt-1">
                  <input type="checkbox" defaultChecked={alert.enabled} className="w-5 h-5 rounded-lg border-white/20 bg-white/5 text-[#f97316] focus:ring-[#f97316]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold">{alert.type}</p>
                  <p className="text-[12px] text-white/50 mt-1">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Broadcast Mockup */}
      <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#1a1a1a] mb-6">Send Broadcast Message</h3>
        <div className="space-y-4">
          <textarea 
            placeholder="Write a message to all active customers..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#f5f5f3] rounded-3xl p-6 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all resize-none h-32"
          />
          <div className="flex justify-end">
            <button onClick={() => { if (message) sendNotification.mutate({ message, channels } as any); }} className="px-8 py-3 bg-[#f97316] text-white rounded-2xl font-bold text-[13px] hover:bg-[#ea580c] transition-all shadow-lg shadow-[#f97316]/20">
              Send {sendNotification.isPending ? '...' : `to ${Intl.NumberFormat().format(1295)} Customers`}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
