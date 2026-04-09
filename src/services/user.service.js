import axiosClient from '../api/axiosClient';

const userApi = {
  updateLoggedInUser: async userData => {
    return await axiosClient.patch('/users/profile', userData);
  },

  getUserByUsername: async username => {
    return await axiosClient.get(`/users/${username}`);
  },
};

export default userApi;
