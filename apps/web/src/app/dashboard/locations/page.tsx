'use client';

import React from 'react';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '@/services/business';

export default function LocationsPage() {
  const { data: locationsData } = useLocations();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();
  const rawLoc = locationsData as any;
  const locations = Array.isArray(rawLoc) && rawLoc.length > 0 ? rawLoc : [
    { id: 1, name: 'Downtown Store', address: '123 Main St, London', status: 'Active' },
    { id: 2, name: 'Westfield Mall', address: 'Ariel Way, London', status: 'Active' },
    { id: 3, name: 'Hackney Branch', address: '45 Mare St, London', status: 'Disabled' },
  ] as any[];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Locations</h2>
          <p className="text-[#888] mt-1">Manage multiple business outlets and their status.</p>
        </div>
        <button onClick={() => { const name = prompt('Location name:'); if (name) createLocation.mutate({ name, address: prompt('Address:') || '', status: 'Active' } as any); }} className="px-5 py-2.5 bg-[#1a1a1a] text-white rounded-2xl text-[13px] font-bold hover:bg-[#f97316] transition-all shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Add New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc: any) => (
          <div key={loc.id} className="bg-white rounded-[32px] border border-[#eee] p-6 shadow-sm group hover:border-[#f97316]/30 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#f5f5f3] rounded-2xl flex items-center justify-center text-xl">📍</div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                loc.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {loc.status}
              </span>
            </div>
            <h3 className="text-[17px] font-bold text-[#1a1a1a]">{loc.name}</h3>
            <p className="text-[13px] text-[#888] mt-1 leading-relaxed">{loc.address}</p>
            
            <div className="mt-8 pt-6 border-t border-[#f5f5f3] flex items-center gap-3">
              <button onClick={() => { const name = prompt('New name:', loc.name); if (name) updateLocation.mutate({ id: loc.id, name } as any); }} className="flex-1 py-2.5 bg-[#f5f5f3] hover:bg-[#eee] text-[#1a1a1a] text-[12px] font-bold rounded-xl transition-colors">
                Edit
              </button>
              <button onClick={() => { const newStatus = loc.status === 'Active' ? 'Disabled' : 'Active'; updateLocation.mutate({ id: loc.id, status: newStatus } as any); }} className="px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-[12px] font-bold transition-colors">
                {loc.status === 'Active' ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}

        {/* Empty State / Placeholder */}
        <button className="border-2 border-dashed border-[#eee] rounded-[32px] p-6 flex flex-col items-center justify-center text-center hover:bg-[#fafaf9] transition-all group min-h-[220px]">
          <div className="w-12 h-12 rounded-2xl bg-[#fafaf9] group-hover:bg-white flex items-center justify-center mb-4 transition-colors">
            <svg className="w-6 h-6 text-[#ccc] group-hover:text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <p className="text-[14px] font-bold text-[#aaa] group-hover:text-[#1a1a1a]">Add Outlet</p>
        </button>
      </div>
    </div>
  );
}
