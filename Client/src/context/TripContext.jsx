import React, { createContext, useContext, useState } from 'react';
import { tripService } from '../services/tripService';
import { useToast } from './ToastContext';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const { addToast } = useToast();

  const [tripInputs, setTripInputs] = useState({
    duration: 3,
    startingLocation: { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
    budgetTier: 'Moderate',
    customBudget: '',
    travelType: 'Solo',
    travelersCount: 1,
    interests: ['Culture', 'Nature'],
    transportation: 'Private Car',
  });

  const [generatedTrip, setGeneratedTrip] = useState(() => {
    const saved = sessionStorage.getItem('lankatrip_draft');
    return saved ? JSON.parse(saved) : null;
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePersonalizedTrip = async (customParams = null) => {
    setIsGenerating(true);
    try {
      const payload = customParams || tripInputs;
      const res = await tripService.generateTrip(payload);
      setGeneratedTrip(res.data);
      sessionStorage.setItem('lankatrip_draft', JSON.stringify(res.data));
      addToast('Your personalized Sri Lankan itinerary is ready!', 'success');
      return res.data;
    } catch (err) {
      addToast(err.message || 'Failed to generate trip itinerary', 'error');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const updateDraftTrip = (updatedTrip) => {
    setGeneratedTrip(updatedTrip);
    sessionStorage.setItem('lankatrip_draft', JSON.stringify(updatedTrip));
  };

  const clearDraft = () => {
    setGeneratedTrip(null);
    sessionStorage.removeItem('lankatrip_draft');
  };

  const value = {
    tripInputs,
    setTripInputs,
    generatedTrip,
    setGeneratedTrip: updateDraftTrip,
    isGenerating,
    generatePersonalizedTrip,
    clearDraft,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
