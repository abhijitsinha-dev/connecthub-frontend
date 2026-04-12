import axiosClient from '../api/axiosClient';

const postApi = {
  createPost: async postData => {
    return await axiosClient.post('/posts', postData);
  },

  feed: async excludedPostIds => {
    return await axiosClient.post('/posts/feed', excludedPostIds);
  },
};

export default postApi;
