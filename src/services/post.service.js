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
      `/posts/user/${username}?page=${page}&limit=${limit}`
    );
  },

  likePost: async postId => {
    return await axiosClient.post(`/interaction/post/like/${postId}`);
  },

  unlikePost: async postId => {
    return await axiosClient.post(`/interaction/post/unlike/${postId}`);
  },

  getCommentsByPostId: async (postId, page, limit) => {
    return await axiosClient.get(
      `/comments/post/${postId}?page=${page}&limit=${limit}`
    );
  },

  addComment: async (postId, content) => {
    return await axiosClient.post(`/comments/post/${postId}`, { content });
  },

  getLikesByPostId: async (postId, page, limit) => {
    return await axiosClient.get(
      `/interaction/post/likers/${postId}?page=${page}&limit=${limit}`
    );
  },
};

export default postApi;
