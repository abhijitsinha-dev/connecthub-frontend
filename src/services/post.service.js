import axiosClient from '../api/axiosClient';

const postApi = {
  createPost: async postData => {
    return await axiosClient.post('/posts', postData);
  },

  feed: async excludedPostIds => {
    return await axiosClient.post('/posts/feed', excludedPostIds);
  },

  profilePosts: async (username, page = 1, limit = 10) => {
    return await axiosClient.get(
      `/posts/${username}?page=${page}&limit=${limit}`
    );
  },
};

export default postApi;
