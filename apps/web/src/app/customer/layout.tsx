'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Gamepad2, 
  Wallet, 
  Heart, 
  History,
  User,
  LayoutDashboard,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/customer', icon: LayoutDashboard },
  { name: 'My Rewards', href: '/customer/my-rewards', icon: Gift },
  { name: 'Active Games', href: '/customer/active-games', icon: Gamepad2 },
  { name: 'Reward Wallet', href: '/customer/wallet', icon: Wallet },
  { name: 'Favorite Businesses', href: '/customer/favorites', icon: Heart },
  { name: 'Activity History', href: '/customer/history', icon: History },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Auto-collapse sidebar when entering the game screen
  useEffect(() => {
    if (pathname === '/customer/active-games') {
      setIsDesktopCollapsed(true);
    } else {
      setIsDesktopCollapsed(false);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col md:flex-row relative pb-20 md:pb-0">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-[#eee] shadow-sm">
        <Link href="/customer" className="flex items-center gap-2 group">
          <span className="w-3 h-3 bg-[#f97316] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
          <span className="font-display font-bold text-lg tracking-tight text-[#1a1a1a]">MComSpin</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-[#666] hover:text-[#1a1a1a] transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-[#eee] px-6 py-3 safe-area-pb">
        <nav className="flex items-center justify-between max-w-lg mx-auto">
          {[
            { name: 'Home', href: '/customer', icon: LayoutDashboard },
            { name: 'Rewards', href: '/customer/my-rewards', icon: Gift },
            { name: 'Games', href: '/customer/active-games', icon: Gamepad2 },
            { name: 'History', href: '/customer/history', icon: History },
            { name: 'Profile', href: '/customer/profile', icon: User },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 group relative"
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive ? 'bg-[#f97316] text-white shadow-lg -translate-y-1' : 'text-[#888] active:scale-90'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold transition-colors ${
                  isActive ? 'text-[#f97316]' : 'text-[#999]'
                }`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -top-1 w-1 h-1 bg-[#f97316] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-[#eee] flex flex-col transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full w-64'}
          md:relative md:translate-x-0 md:h-screen md:shadow-none md:sticky md:top-0
          ${isDesktopCollapsed ? 'md:w-[72px]' : 'md:w-64'}
        `}
      >
        {/* Desktop Header with Toggle */}
        <div className="p-4 hidden md:flex items-center justify-between">
          <Link href="/customer" className={`flex items-center gap-2 group overflow-hidden ${isDesktopCollapsed ? 'justify-center w-full' : ''}`}>
            <span className="w-3 h-3 bg-[#f97316] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform flex-shrink-0" />
            {!isDesktopCollapsed && (
              <span className="font-display font-bold text-lg tracking-tight text-[#1a1a1a] whitespace-nowrap">MComSpin</span>
            )}
          </Link>
          {!isDesktopCollapsed && (
            <button 
              onClick={() => setIsDesktopCollapsed(true)}
              className="p-1.5 rounded-lg text-[#999] hover:text-[#1a1a1a] hover:bg-stone-100 transition-all flex-shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isDesktopCollapsed && (
          <div className="hidden md:flex justify-center py-2">
            <button 
              onClick={() => setIsDesktopCollapsed(false)}
              className="p-1.5 rounded-lg text-[#999] hover:text-[#1a1a1a] hover:bg-stone-100 transition-all"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={18} />
            </button>
          </div>
        )}

        {/* Mobile Header */}
        <div className="p-6 md:hidden flex justify-between items-center border-b border-[#eee]">
          <span className="font-display font-bold text-lg tracking-tight text-[#1a1a1a]">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#888] hover:text-[#1a1a1a]">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-2 md:px-2 py-4 md:py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                title={isDesktopCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isDesktopCollapsed ? 'md:justify-center md:px-0' : ''
                } ${
                  isActive 
                    ? 'bg-[#f97316] text-white shadow-md' 
                    : 'text-[#666] hover:bg-stone-50 hover:text-[#1a1a1a]'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#888]'}`} />
                {!isDesktopCollapsed && <span className="hidden md:inline">{item.name}</span>}
                <span className="md:hidden">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-[#eee]">
          <Link
            href="/customer/profile"
            title={isDesktopCollapsed ? 'Profile' : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#666] hover:bg-stone-50 hover:text-[#1a1a1a] transition-all ${
              isDesktopCollapsed ? 'md:justify-center md:px-0' : ''
            }`}
          >
            <User className="w-5 h-5 text-[#888] flex-shrink-0" />
            {!isDesktopCollapsed && <span className="hidden md:inline">Profile</span>}
            <span className="md:hidden">Profile</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Glow backgrounds for that "alive" feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#f97316]/[0.02] to-transparent rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 left-[-100px] w-[400px] h-[400px] bg-gradient-to-t from-[#f97316]/[0.02] to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
