import axiosClient from '../api/axiosClient';

const userApi = {
  updateLoggedInUser: async userData => {
    return await axiosClient.patch('/users/profile', userData);
  },
};

export default userApi;
