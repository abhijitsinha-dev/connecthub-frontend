import axiosClient from '../api/axiosClient';

const userApi = {
  updateLoggedInUser: async userData => {
    return await axiosClient.patch('/users/profile', userData);
  },

  getUserByUsername: async username => {
    return await axiosClient.get(`/users/${username}`);
  },

  followUser: async targetUserId => {
    return await axiosClient.post(`/follows/${targetUserId}/follow`);
  },

  unfollowUser: async targetUserId => {
    return await axiosClient.post(`/follows/${targetUserId}/unfollow`);
  },

  getFollowers: async userId => {
    return await axiosClient.get(`/follows/${userId}/followers`);
  },

  getFollowing: async userId => {
    return await axiosClient.get(`/follows/${userId}/following`);
  },

  searchUsers: async query => {
    return await axiosClient.get(`/users/search?q=${query}`);
  },
};

export default userApi;
