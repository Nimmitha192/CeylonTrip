import api from './api';

export const destinationService = {
  getDestinations: async (params = {}) => {
    return await api.get('/destinations', { params });
  },

  getDestination: async (idOrSlug) => {
    return await api.get(`/destinations/${idOrSlug}`);
  },

  createDestination: async (destData) => {
    return await api.post('/destinations', destData);
  },

  updateDestination: async (id, destData) => {
    return await api.put(`/destinations/${id}`, destData);
  },

  deleteDestination: async (id) => {
    return await api.delete(`/destinations/${id}`);
  },

  getCategories: async () => {
    return await api.get('/categories');
  },
};
