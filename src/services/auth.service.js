import axiosClient from '../api/axiosClient';

export const authApi = {
  signup: async userData => {
    return await axiosClient.post('/auth/signup', userData);
  },

  login: async credentials => {
    return await axiosClient.post('/auth/login', credentials);
  },

  logout: async () => {
    return await axiosClient.post('/auth/logout');
  },

  verifyEmail: async verificationData => {
    return await axiosClient.post('/auth/verify-email', verificationData);
  },

  me: async () => {
    return await axiosClient.get('/auth/me');
  },
};
