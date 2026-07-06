'use client';

import React, { useState } from 'react';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '@/services/business';

type LocationForm = {
  name: string;
  addressLine1: string;
  city: string;
  postcode: string;
};

const emptyForm: LocationForm = { name: '', addressLine1: '', city: '', postcode: '' };

export default function LocationsPage() {
  const { data: locationsData, isLoading } = useLocations();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();
  const rawLoc = locationsData as any;
  const locations = Array.isArray(rawLoc) ? rawLoc : [];

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<LocationForm>(emptyForm);
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (loc: any) => {
    setEditId(loc.id);
    setForm({
      name: loc.name ?? '',
      addressLine1: loc.addressLine1 ?? loc.address ?? '',
      city: loc.city ?? '',
      postcode: loc.postcode ?? '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.addressLine1.trim()) { setFormError('Address is required'); return; }
    if (!form.city.trim()) { setFormError('City is required'); return; }
    setFormError('');

    if (editId) {
      updateLocation.mutate({ id: editId, ...form } as any, {
        onSuccess: () => setShowModal(false),
        onError: (err: any) => setFormError(err?.response?.data?.message ?? 'Failed to update'),
      });
    } else {
      createLocation.mutate(form as any, {
        onSuccess: () => setShowModal(false),
        onError: (err: any) => setFormError(err?.response?.data?.message ?? 'Failed to create'),
      });
    }
  };

  const toggleActive = (loc: any) => {
    updateLocation.mutate({ id: loc.id, isActive: !loc.isActive } as any);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Locations</h2>
          <p className="text-[#888] mt-1">Manage multiple business outlets and their status.</p>
        </div>
        <button onClick={openCreate} className="px-5 py-2.5 bg-[#1a1a1a] text-white rounded-2xl text-[13px] font-bold hover:bg-[#f97316] transition-all shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Add New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] border border-[#eee] p-6 shadow-sm animate-pulse">
              <div className="w-12 h-12 bg-[#f0f0f0] rounded-2xl mb-4" />
              <div className="h-5 w-32 bg-[#f0f0f0] rounded mb-2" />
              <div className="h-4 w-48 bg-[#f0f0f0] rounded" />
            </div>
          ))
        ) : locations.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-[15px] font-bold text-[#1a1a1a]">No locations yet</p>
            <p className="text-[13px] text-[#888] mt-1">Add your first business outlet to get started.</p>
          </div>
        ) : (
          locations.map((loc: any) => (
            <div key={loc.id} className="bg-white rounded-[32px] border border-[#eee] p-6 shadow-sm group hover:border-[#f97316]/30 transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#f5f5f3] rounded-2xl flex items-center justify-center text-xl">📍</div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  loc.isActive !== false ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {loc.isActive !== false ? 'Active' : 'Disabled'}
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-[#1a1a1a]">{loc.name ?? 'Unnamed'}</h3>
              <p className="text-[13px] text-[#888] mt-1 leading-relaxed">{loc.addressLine1}{loc.city ? `, ${loc.city}` : ''}</p>
              {loc.postcode && <p className="text-[12px] text-[#aaa] mt-0.5">{loc.postcode}</p>}
              
              <div className="mt-8 pt-6 border-t border-[#f5f5f3] flex items-center gap-3">
                <button onClick={() => openEdit(loc)} className="flex-1 py-2.5 bg-[#f5f5f3] hover:bg-[#eee] text-[#1a1a1a] text-[12px] font-bold rounded-xl transition-colors">
                  Edit
                </button>
                <button onClick={() => toggleActive(loc)} className="px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-[12px] font-bold transition-colors">
                  {loc.isActive !== false ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))
        )}

        <button onClick={openCreate} className="border-2 border-dashed border-[#eee] rounded-[32px] p-6 flex flex-col items-center justify-center text-center hover:bg-[#fafaf9] transition-all group min-h-[220px]">
          <div className="w-12 h-12 rounded-2xl bg-[#fafaf9] group-hover:bg-white flex items-center justify-center mb-4 transition-colors">
            <svg className="w-6 h-6 text-[#ccc] group-hover:text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <p className="text-[14px] font-bold text-[#aaa] group-hover:text-[#1a1a1a]">Add Outlet</p>
        </button>
      </div>

      {/* Location Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-[#eee] flex items-center justify-between bg-[#fafaf9]">
              <h3 className="text-xl font-bold text-[#1a1a1a]">{editId ? 'Edit Location' : 'New Location'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#eee] rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium">{formError}</div>
              )}
              <div>
                <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest block mb-1.5">Location Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown Store" className="w-full bg-[#f5f5f3] rounded-2xl px-4 py-3 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest block mb-1.5">Address *</label>
                <input type="text" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} placeholder="123 Main St" className="w-full bg-[#f5f5f3] rounded-2xl px-4 py-3 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest block mb-1.5">City *</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="London" className="w-full bg-[#f5f5f3] rounded-2xl px-4 py-3 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest block mb-1.5">Postcode</label>
                  <input type="text" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} placeholder="E1 6AN" className="w-full bg-[#f5f5f3] rounded-2xl px-4 py-3 text-[14px] outline-none border border-transparent focus:border-[#f97316] transition-all" />
                </div>
              </div>
              <button onClick={handleSave} disabled={createLocation.isPending || updateLocation.isPending} className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[13px] hover:bg-[#f97316] transition-all disabled:opacity-50">
                {createLocation.isPending || updateLocation.isPending ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
