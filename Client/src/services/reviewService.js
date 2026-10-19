import api from './api';

export const reviewService = {
  getDestinationReviews: async (destinationId) => {
    return await api.get(`/destinations/${destinationId}/reviews`);
  },

  createReview: async (destinationId, reviewData) => {
    return await api.post(`/destinations/${destinationId}/reviews`, reviewData);
  },

  updateReview: async (reviewId, reviewData) => {
    return await api.put(`/reviews/${reviewId}`, reviewData);
  },

  deleteReview: async (reviewId) => {
    return await api.delete(`/reviews/${reviewId}`);
  },

  getUserReviews: async () => {
    return await api.get('/reviews/user');
  },
};
