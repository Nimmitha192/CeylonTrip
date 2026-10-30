import api from './api';

export const adminService = {
  getStats: async () => {
    return await api.get('/admin/stats');
  },

  getUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },

  updateUserRole: async (userId, role) => {
    return await api.put(`/admin/users/${userId}/role`, { role });
  },

  deleteUser: async (userId) => {
    return await api.delete(`/admin/users/${userId}`);
  },

  getTrips: async (params = {}) => {
    return await api.get('/admin/trips', { params });
  },

  getReviews: async () => {
    return await api.get('/admin/reviews');
  },

  updateReviewStatus: async (reviewId, status) => {
    return await api.put(`/admin/reviews/${reviewId}/status`, { status });
  },

  getHotels: async () => {
    return await api.get('/admin/hotels');
  },

  createHotel: async (data) => {
    return await api.post('/admin/hotels', data);
  },

  updateHotel: async (id, data) => {
    return await api.put(`/admin/hotels/${id}`, data);
  },

  deleteHotel: async (id) => {
    return await api.delete(`/admin/hotels/${id}`);
  },

  getActivities: async () => {
    return await api.get('/admin/activities');
  },

  createActivity: async (data) => {
    return await api.post('/admin/activities', data);
  },

  updateActivity: async (id, data) => {
    return await api.put(`/admin/activities/${id}`, data);
  },

  deleteActivity: async (id) => {
    return await api.delete(`/admin/activities/${id}`);
  },
};

export const userService = {
  getProfile: async () => {
    return await api.get('/users/profile');
  },

  updateProfile: async (data) => {
    return await api.put('/users/profile', data);
  },

  getFavorites: async () => {
    return await api.get('/users/favorites');
  },

  addFavorite: async (destId) => {
    return await api.post(`/users/favorites/${destId}`);
  },

  removeFavorite: async (destId) => {
    return await api.delete(`/users/favorites/${destId}`);
  },
};
