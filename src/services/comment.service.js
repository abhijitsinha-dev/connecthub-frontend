import axiosClient from '../api/axiosClient';

const commentApi = {
  likeComment: async commentId => {
    return await axiosClient.post(`/interaction/comment/like/${commentId}`);
  },

  unlikeComment: async commentId => {
    return await axiosClient.post(`/interaction/comment/unlike/${commentId}`);
  },
};

export default commentApi;
