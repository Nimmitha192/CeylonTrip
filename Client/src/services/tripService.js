import api from './api';

export const tripService = {
  generateTrip: async (tripParams) => {
    return await api.post('/trips/generate', tripParams);
  },

  saveTrip: async (tripData) => {
    return await api.post('/trips', tripData);
  },

  getMyTrips: async () => {
    return await api.get('/trips');
  },

  getTripById: async (id) => {
    return await api.get(`/trips/${id}`);
  },

  updateTrip: async (id, tripData) => {
    return await api.put(`/trips/${id}`, tripData);
  },

  deleteTrip: async (id) => {
    return await api.delete(`/trips/${id}`);
  },
};
