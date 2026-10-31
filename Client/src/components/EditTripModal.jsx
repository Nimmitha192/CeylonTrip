import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { tripService } from '../services/tripService';
import { useToast } from '../context/ToastContext';
import { STARTING_LOCATIONS, BUDGET_TIERS, TRAVEL_GROUPS, TRANSPORT_OPTIONS, INTEREST_OPTIONS } from '../utils/constants';

export default function EditTripModal({ trip, onClose, onSaved }) {
  const dialogRef = useRef(null);
  const savingRef = useRef(false);
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => ({
    title: trip.title || '',
    duration: trip.duration,
    startingLocation: { ...trip.startingLocation },
    budgetTier: trip.budgetTier || 'Moderate',
    customBudget: trip.customBudget ?? '',
    travelType: trip.travelType || 'Solo',
    travelersCount: trip.travelersCount ?? 1,
    transportation: trip.transportation || 'Private Car',
    interests: [...(trip.interests || [])],
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;
    if (!form.title.trim()) {
      setError('Please enter a trip name.');
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setError('');
    try {
      const response = await tripService.updateTrip(trip._id, {
        ...form,
        title: form.title.trim(),
        duration: Number(form.duration),
        travelersCount: Number(form.travelersCount),
        customBudget: form.customBudget === '' ? null : Number(form.customBudget),
      });
      onSaved(response.data);
      addToast('Trip updated successfully', 'success');
      onClose();
    } catch (err) {
      const message = err.message || 'Error updating trip. Please try again.';
      setError(message);
      addToast(message, 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const inputClass = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const selectField = (label, field, options) => (
    <label className="block text-xs font-bold text-slate-700 sm:text-sm">
      {label}
      <select className={inputClass} value={form[field]} onChange={(event) => change(field, event.target.value)}>
        {options.map((option) => <option key={option.id} value={option.id}>{option.label || option.title}</option>)}
      </select>
    </label>
  );

  return (
    <dialog ref={dialogRef} aria-labelledby="edit-trip-title" onCancel={(event) => { if (savingRef.current) event.preventDefault(); else onClose(); }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="edit-trip-title" className="font-display text-2xl font-extrabold text-slate-900">Edit Trip</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close edit trip" className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 disabled:opacity-50"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-slate-500 sm:text-sm">Update your saved trip details. Changing preferences does not regenerate the itinerary, route, or cost estimate.</p>
        {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <fieldset disabled={saving} className="space-y-4 disabled:opacity-60">
          <label className="block text-xs font-bold text-slate-700 sm:text-sm">Trip name
            <input autoFocus required value={form.title} onChange={(event) => change('title', event.target.value)} className={inputClass} />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-xs font-bold text-slate-700 sm:text-sm">Duration (days)
              <input type="number" required min="1" max="30" step="1" value={form.duration} onChange={(event) => change('duration', event.target.value)} className={inputClass} />
            </label>
            <label className="block text-xs font-bold text-slate-700 sm:text-sm">Departure location
              <select value={form.startingLocation.name} className={inputClass} onChange={(event) => {
                const { name, latitude, longitude } = STARTING_LOCATIONS.find((location) => location.name === event.target.value);
                change('startingLocation', { name, latitude, longitude });
              }}>
                {!STARTING_LOCATIONS.some((location) => location.name === form.startingLocation.name) && <option value={form.startingLocation.name}>{form.startingLocation.name}</option>}
                {STARTING_LOCATIONS.map((location) => <option key={location.name} value={location.name}>{location.name}</option>)}
              </select>
            </label>
            {selectField('Budget tier', 'budgetTier', BUDGET_TIERS)}
            <label className="block text-xs font-bold text-slate-700 sm:text-sm">Custom budget (LKR, optional)
              <input type="number" min="0" step="any" value={form.customBudget} onChange={(event) => change('customBudget', event.target.value)} className={inputClass} />
            </label>
            {selectField('Travel group', 'travelType', TRAVEL_GROUPS)}
            <label className="block text-xs font-bold text-slate-700 sm:text-sm">Number of travelers
              <input type="number" required min="1" step="1" value={form.travelersCount} onChange={(event) => change('travelersCount', event.target.value)} className={inputClass} />
            </label>
            {selectField('Transportation', 'transportation', TRANSPORT_OPTIONS)}
          </div>
          <fieldset>
            <legend className="text-xs font-bold text-slate-700 mb-2 sm:text-sm">Interests</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map((option) => <label key={option.id} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="accent-emerald-600" checked={form.interests.includes(option.id)} onChange={(event) => change('interests', event.target.checked ? [...form.interests, option.id] : form.interests.filter((interest) => interest !== option.id))} />
                {option.label}
              </label>)}
            </div>
          </fieldset>
        </fieldset>
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </dialog>
  );
}
