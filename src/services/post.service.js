import axiosClient from '../api/axiosClient';

const postApi = {
  createPost: async postData => {
    return await axiosClient.post('/posts', postData);
  },
};

export default postApi;
