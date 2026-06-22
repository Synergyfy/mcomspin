'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomerDashboard, useUpdateCustomerProfile } from '@/services/customer';
import {
  User,
  Save,
  Camera,
  Mail,
  Phone,
  Heart,
  Zap,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

const INTEREST_OPTIONS = [
  'Fashion', 'Technology', 'Food & Dining', 'Barber & Grooming',
  'Beauty & Spa', 'Events', 'Shopping', 'Fitness',
];

export default function ProfilePage() {
  const { data: dashboard, isLoading } = useCustomerDashboard();
  const updateProfile = useUpdateCustomerProfile();

  const profile = (dashboard as any)?.profile ?? dashboard ?? {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [interests, setInterests] = useState<string[]>(profile.interests || profile.metadata?.interests || []);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSave = () => {
    setFormError('');
    if (phone && !/^[+\d\s()-]{7,20}$/.test(phone)) {
      setFormError('Please enter a valid phone number');
      return;
    }
    updateProfile.mutate(
      { firstName, lastName, phone, interests },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
        onError: (err: any) => {
          setFormError(err?.response?.data?.message ?? 'Failed to save profile');
        },
      }
    );
  };

  const toggleInterest = (opt: string) => {
    setInterests((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="space-y-8 pb-20 text-left bg-stone-50/20 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Account</p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight uppercase">My Profile</h1>
          <p className="text-stone-500 text-sm max-w-md font-medium">
            Manage your personal details and preferences.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm text-center">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1 mx-auto">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-stone-300" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors shadow-md">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-black text-stone-900 mt-4 uppercase tracking-tight">
              {profile.firstName || profile.name || 'Explorer'}
            </h2>
            <p className="text-stone-400 text-xs font-medium mt-0.5">{profile.email || ''}</p>
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-stone-50">
              <div className="text-center">
                <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Points</p>
                <p className="text-xl font-black text-orange-500">{profile.totalPoints || profile.points || 0}</p>
              </div>
              <div className="w-px h-10 bg-stone-100" />
              <div className="text-center">
                <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Rank</p>
                <p className="text-sm font-black text-stone-900 uppercase">Silver</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-stone-100 rounded-[2.5rem] p-6 shadow-sm space-y-2">
            <Link href="/customer/wallet" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-[11px] font-bold text-stone-600">
              <Gift className="w-4 h-4 text-orange-500" /> My Rewards
            </Link>
            <Link href="/customer/history" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-[11px] font-bold text-stone-600">
              <Zap className="w-4 h-4 text-orange-500" /> Activity History
            </Link>
            <Link href="/customer/favorites" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-[11px] font-bold text-stone-600">
              <Heart className="w-4 h-4 text-orange-500" /> Favorites
            </Link>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">Personal Information</h3>
              <p className="text-[11px] text-stone-400 font-medium">Update your name and contact details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all"
                  placeholder="Your first name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all"
                  placeholder="Your last name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Email</label>
                <div className="flex items-center gap-3 px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm text-stone-400">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">{profile.email || 'Not available'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">Interests</h3>
              <p className="text-[11px] text-stone-400 font-medium">Select your preferences to personalize your experience.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleInterest(opt)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    interests.includes(opt)
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-stone-50 text-stone-400 border border-stone-100 hover:border-orange-200 hover:text-orange-500'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            {formError && <p className="text-[13px] text-red-500 font-medium mr-auto">{formError}</p>}
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest"
              >
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </motion.span>
            )}
            <button
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 bg-stone-900 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
            >
              {updateProfile.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
