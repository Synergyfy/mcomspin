'use client';

import React, { useState } from 'react';
import { useStaff, useInviteStaff, useUpdateStaff, useRemoveStaff } from '@/services/business';

export default function StaffManagementPage() {
  const { data: staffData, isLoading, isError } = useStaff();
  const inviteStaff = useInviteStaff();
  const updateStaff = useUpdateStaff();
  const removeStaff = useRemoveStaff();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Cashier');
  const [inviteError, setInviteError] = useState('');

  const validateInvite = () => {
    if (!inviteName.trim()) { setInviteError('Name is required'); return false; }
    if (!inviteEmail.trim()) { setInviteError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) { setInviteError('Invalid email format'); return false; }
    setInviteError('');
    return true;
  };

  const handleSendInvite = () => {
    if (!validateInvite()) return;
    inviteStaff.mutate(
      { name: inviteName.trim(), email: inviteEmail.trim(), role: inviteRole },
      {
        onSuccess: () => {
          setIsInviteModalOpen(false);
          setInviteName('');
          setInviteEmail('');
          setInviteRole('Cashier');
          setInviteError('');
        },
        onError: (err: any) => {
          setInviteError(err?.response?.data?.message?.[0] ?? err?.response?.data?.message ?? 'Failed to send invite');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-3 w-24 bg-[#f0f0f0] rounded mb-2" />
            <div className="h-7 w-48 bg-[#f0f0f0] rounded mb-1" />
            <div className="h-4 w-64 bg-[#f0f0f0] rounded" />
          </div>
        </div>
        <div className="bg-white rounded-[40px] border border-[#eee] shadow-sm overflow-hidden animate-pulse">
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f0f0f0] rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#f0f0f0] rounded" />
                  <div className="h-3 w-48 bg-[#f0f0f0] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Staff Management</h2>
          <p className="text-[#888] mt-1">Manage your team roles and access permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="px-5 py-2.5 bg-[#f97316] text-white rounded-2xl text-[13px] font-bold hover:bg-[#ea580c] transition-all shadow-lg shadow-[#f97316]/20 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Invite Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-[40px] border border-[#eee] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafaf9] border-b border-[#eee]">
                <th className="px-8 py-5 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Staff Member</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Role</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Permissions</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#aaa] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f3]">
              {((staffData as any[]) ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <p className="text-[15px] font-bold text-[#1a1a1a]">No staff members yet</p>
                    <p className="text-[13px] text-[#888] mt-1">Invite your first team member to get started.</p>
                  </td>
                </tr>
              ) : (
                ((staffData as any[]) ?? []).map((staff: any) => (
                <tr key={staff.id} className="group hover:bg-[#fafaf9] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f5f5f3] flex items-center justify-center text-[13px] font-bold text-[#1a1a1a] group-hover:bg-[#f97316] group-hover:text-white transition-colors shrink-0">
                        {staff.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{staff.name}</p>
                        <p className="text-[12px] text-[#888]">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[13px] font-medium text-[#444] px-3 py-1 bg-[#f5f5f3] rounded-lg">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                      {staff.permissions.map((p: any, i: any) => (
                        <span key={i} className="text-[10px] font-bold text-[#666] uppercase bg-white border border-[#eee] px-2 py-0.5 rounded-md">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      staff.status === 'Active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => { if (confirm('Remove this staff member?')) removeStaff.mutate(staff.id); }}
                      className="p-2 text-[#ccc] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1a1a1a] rounded-[40px] p-8 text-white">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-[#f97316] rounded-full" />
            Roles & Permissions Guide
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-[12px] font-bold text-[#f97316] uppercase tracking-widest mb-2">Owner / Manager</p>
              <p className="text-[13px] text-white/60">Full access to all modules including campaigns, rewards, analytics, and staff management.</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-white uppercase tracking-widest mb-2">Staff</p>
              <p className="text-[13px] text-white/60">Can view campaigns and rewards, but primarily focused on managing redemptions.</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-white uppercase tracking-widest mb-2">Cashier</p>
              <p className="text-[13px] text-white/60">Restricted access—only permitted to use the Redemption Scanner and view pending logs.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-[#f97316]/10 text-[#f97316] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1a1a1a]">Security Tip</h3>
          <p className="text-[13px] text-[#888] mt-2 px-6">
            We recommend using the 2FA setting for all staff members with 'Manager' or 'Owner' roles to ensure your data stays protected.
          </p>
          <button className="mt-6 text-[13px] font-bold text-[#f97316] hover:underline">Configure Security Settings</button>
        </div>
      </div>

      {/* Invite Modal Mockup */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-[#eee] flex items-center justify-between bg-[#fafaf9]">
              <h3 className="text-xl font-bold text-[#1a1a1a]">Invite New Staff</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-[#eee] rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#aaa] uppercase tracking-widest">Full Name</label>
                <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-[#f5f5f3] rounded-2xl px-4 py-3 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#aaa] uppercase tracking-widest">Email Address</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-[#f5f5f3] rounded-2xl px-4 py-3 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#aaa] uppercase tracking-widest">Role</label>
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full bg-[#f5f5f3] rounded-2xl px-4 py-3 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all appearance-none cursor-pointer">
                    <option>Cashier</option>
                    <option>Staff</option>
                    <option>Manager</option>
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  {inviteError && (
                    <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[11px] font-medium">{inviteError}</div>
                  )}
                  <button
                    onClick={handleSendInvite}
                    disabled={inviteStaff.isPending}
                    className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[13px] hover:bg-[#f97316] transition-all disabled:opacity-50"
                  >
                    {inviteStaff.isPending ? 'Sending...' : 'Send Invite'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
