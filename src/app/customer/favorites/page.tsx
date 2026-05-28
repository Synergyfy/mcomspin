'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerStore } from '@/store/customer-store';
import { 
  Heart, 
  Store, 
  MapPin, 
  Star, 
  Zap, 
  ChevronRight, 
  Search,
  Gift,
  History,
  ExternalLink,
  MoreVertical,
  Bell
} from 'lucide-react';
import Link from 'next/link';

/* ─── MOCK FAVORITE DATA (Reflecting Henry's "Favorite storefront or MCOM business") ─── */
const mockFavorites = [
  {
    id: 'meridian',
    name: 'Meridian Apparel',
    category: 'Luxury Fashion',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
    activeCampaign: 'Summer Lead Blitz',
    rewardsWon: 12,
    lastVisit: '2 days ago',
    isLive: true,
    rating: 4.9,
  },
  {
    id: 'elara',
    name: 'Elara Wellness',
    category: 'Spa Services',
    image: 'https://images.unsplash.com/photo-1544161515-4ae6ce6db874?q=80&w=2070&auto=format&fit=crop',
    activeCampaign: 'Partner Spotlight Q3',
    rewardsWon: 5,
    lastVisit: '1 week ago',
    isLive: true,
    rating: 4.8,
  },
  {
    id: 'soleil',
    name: 'Soleil Dining Group',
    category: 'Hospitality',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    activeCampaign: 'Gourmet Lounge Rotating Spotlight',
    rewardsWon: 8,
    lastVisit: '3 days ago',
    isLive: false,
    rating: 5.0,
  },
];

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(mockFavorites);

  const filteredFavorites = favorites.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 text-left">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#f97316] uppercase">My Curated Street</p>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a]">Favorite Businesses</h1>
          <p className="text-[#888] text-sm max-w-md">
            Follow and revisit your preferred storefronts to track your reward history and new campaigns.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-[#eee] rounded-2xl px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-[12px] font-bold text-[#1a1a1a]">{favorites.length} Followed</span>
          </div>
          <div className="w-px h-6 bg-[#eee]" />
          <button className="text-[10px] font-bold text-[#bbb] hover:text-[#f97316] uppercase tracking-widest transition-colors">
            Manage Notifications
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
        <input 
          type="text" 
          placeholder="Search your favorites..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-4 bg-white border border-[#eee] rounded-2xl text-sm focus:outline-none focus:border-[#f97316] shadow-sm transition-all font-medium"
        />
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((biz) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={biz.id}
                className="group bg-white border border-[#eee] rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all relative flex flex-col"
              >
                {/* Storefront Image Backdrop */}
                <div className="h-40 relative overflow-hidden">
                  <img src={biz.image} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {biz.isLive ? (
                      <span className="flex items-center gap-1.5 bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Live Game
                      </span>
                    ) : (
                      <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Offline
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => removeFavorite(biz.id)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-[#f97316] uppercase tracking-[0.15em]">{biz.category}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-bold text-[#1a1a1a]">{biz.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#1a1a1a]">{biz.name}</h3>
                  </div>

                  {/* Activity Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#f5f5f3]">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest">Rewards Won</p>
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#f97316]" />
                        <span className="text-[13px] font-bold text-[#1a1a1a]">{biz.rewardsWon}</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest">Last Visit</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#bbb]" />
                        <span className="text-[13px] font-bold text-[#1a1a1a]">{biz.lastVisit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Campaign Link */}
                  {biz.isLive ? (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-wider mb-2">Current Campaign</p>
                      <Link 
                        href="/customer/active-games" 
                        className="flex items-center justify-between p-3 bg-orange-50/50 border border-orange-100 rounded-2xl group/link hover:bg-[#f97316] transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#f97316] group-hover/link:text-white" />
                          <span className="text-[11px] font-bold text-[#1a1a1a] group-hover/link:text-white truncate max-w-[120px]">
                            {biz.activeCampaign}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#f97316] group-hover/link:text-white transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-wider mb-2">Next Opening</p>
                      <div className="flex items-center gap-2 text-[#bbb]">
                        <Bell className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold italic">Notify when live</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button className="flex-1 bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all shadow-md active:scale-95">
                      Visit MCOM
                    </button>
                    <button className="px-4 border border-[#eee] hover:border-[#1a1a1a] rounded-2xl text-[#bbb] hover:text-[#1a1a1a] transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 bg-white border border-[#eee] border-dashed rounded-[48px] flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                <Store className="w-10 h-10 text-[#bbb]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-[#1a1a1a]">No followed businesses</h3>
                <p className="text-sm text-[#888] max-w-xs mx-auto">Discover and follow local storefronts to build your personal high street.</p>
              </div>
              <Link 
                href="/customer/active-games"
                className="mt-2 bg-[#1a1a1a] hover:bg-[#f97316] text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Browse Campaigns
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Philosophy Section (Henry: "Follow businesses") */}
      <section className="bg-[#f97316] rounded-[48px] p-10 md:p-16 text-center relative overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center border border-white/20">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-black tracking-tight leading-none uppercase italic">Your High Street. <br /> Connected.</h2>
            <p className="text-white/80 text-sm leading-relaxed font-medium">
              By following businesses, you're not just tracking rewards—you're building a relationship with the heart of your community. Stay informed on new drops, exclusive VIP events, and personalized storefront transformations.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-[#f97316] px-10 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform active:scale-95">
              Discover New
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Missing component from previous imports
function Clock({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
