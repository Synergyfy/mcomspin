'use client';

import { useState } from 'react';
import { 
  User, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Zap,
  MoreHorizontal,
  ChevronRight,
  Loader2
} from 'lucide-react';

/* ─── Mock Data ─── */
const steps = [
  { id: 1, title: 'Agent Assigned', status: 'completed', time: 'Today, 10:24 AM' },
  { id: 2, title: 'Asset Review', status: 'current', time: 'In Progress' },
  { id: 3, title: 'Gamification Logic', status: 'pending', time: 'Estimated: 2h' },
  { id: 4, title: 'Brand Integration', status: 'pending', time: 'Pending' },
  { id: 5, title: 'Final Deployment', status: 'pending', time: 'Pending' },
];

const messages = [
  { id: 1, sender: 'Agent Sarah', text: "Hi there! I've received your assets. I'm starting the configuration now.", time: '10:30 AM' },
  { id: 2, sender: 'System', text: 'Sarah has started the Asset Review phase.', time: '10:45 AM' },
];

export default function AgentTrackerPage() {
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(true); // Default to true for high-fidelity preview

  return (
    <div className="space-y-10 pb-20">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Service Tracking
          </span>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">
            Agent Tracker
          </h1>
          <p className="text-[#888] text-[14px] mt-1 max-w-xl">
            Monitor the progress of your professional setup. Your assigned agent handles everything from branding to logic.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Left Column: Tracker (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Status Card */}
          <div className="bg-white rounded-[32px] border border-[#eee] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[#f5f5f3] bg-[#fafaf9]/50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-[#f97316]">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-[#1a1a1a]">Sarah Jenkins</h2>
                    <p className="text-[12px] text-[#f97316] font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Senior Platform Agent
                    </p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-[#aaa] uppercase font-bold tracking-widest">Est. Completion</p>
                  <p className="text-[15px] font-display font-bold text-[#1a1a1a]">Today, 4:00 PM</p>
               </div>
            </div>

            <div className="p-8">
              <div className="relative">
                {/* Connector Line */}
                <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-[#f5f5f3] z-0" />
                
                <div className="space-y-8 relative z-10">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-6 group">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500
                        ${step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                          step.status === 'current' ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/30' : 
                          'bg-white border-2 border-[#eee] text-[#ccc]'}
                      `}>
                        {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                         step.status === 'current' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                         <span className="text-[12px] font-bold">{step.id}</span>}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-[15px] font-bold transition-colors ${step.status === 'pending' ? 'text-[#aaa]' : 'text-[#1a1a1a]'}`}>
                            {step.title}
                          </h3>
                          <span className={`text-[11px] font-medium ${step.status === 'current' ? 'text-[#f97316]' : 'text-[#bbb]'}`}>
                            {step.time}
                          </span>
                        </div>
                        {step.status === 'current' && (
                          <p className="text-[12px] text-[#888] mt-1 leading-relaxed">
                            Sarah is currently optimizing your reward distribution logic for maximum customer retention.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-orange-50/50 border-t border-[#f5f5f3] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#f97316]">
                  <Zap className="w-4 h-4 fill-[#f97316]" />
                  <span className="text-[12px] font-bold">Real-time status tracking active</span>
                </div>
                <button className="text-[12px] font-bold text-[#f97316] hover:underline flex items-center gap-1">
                  View Setup Requirements
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
          </div>

        </div>

        {/* ── Right Column: Communication (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Message Feed */}
          <div className="bg-white rounded-[32px] border border-[#eee] flex flex-col h-[500px] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f5f5f3] flex items-center justify-between bg-white sticky top-0 z-10">
               <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#f97316]" />
                  <h3 className="text-[14px] font-bold text-[#1a1a1a]">Agent Messages</h3>
               </div>
               <button className="p-2 text-[#ccc] hover:text-[#1a1a1a] transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafaf9]/30">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex flex-col ${msg.sender === 'System' ? 'items-center' : 'items-start'}`}>
                    {msg.sender === 'System' ? (
                      <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#eee]">
                        {msg.text}
                      </span>
                    ) : (
                      <div className="max-w-[85%]">
                        <div className="bg-white border border-[#eee] rounded-2xl rounded-tl-none p-4 shadow-sm">
                          <p className="text-[13px] text-[#1a1a1a] leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-[#bbb] font-medium mt-1.5 ml-1">{msg.time}</span>
                      </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="p-4 border-t border-[#f5f5f3] bg-white">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Reply to Sarah..."
                  className="w-full bg-[#f5f5f3] border-none rounded-2xl pl-4 pr-12 py-3.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center hover:bg-[#f97316] transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Service Guarantee */}
          <div className="bg-[#1a1a1a] rounded-[32px] p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-20 h-20 rotate-12" />
            </div>
            <h4 className="text-[14px] font-display font-bold">Platform Commitment</h4>
            <p className="text-[12px] text-white/60 mt-2 leading-relaxed">
              Every setup is reviewed by a second agent for quality assurance before deployment.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white/80">100% Satisfaction Guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
