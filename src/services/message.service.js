import axiosClient from '../api/axiosClient';

const messageService = {
  /**
   * Get total unread messages count
   */
  getUnreadCount: async () => {
    return axiosClient.get('/messages/unread-count');
  },

  /**
   * Get list of all conversations
   */
  getConversations: async () => {
    return axiosClient.get('/messages/conversations');
  },

  /**
   * Get messages with a specific user
   * @param {string} receiverId 
   * @param {number} limit 
   * @param {number} skip 
   */
  getMessages: async (receiverId, limit = 50, skip = 0) => {
    return axiosClient.get(`/messages/${receiverId}`, {
      params: { limit, skip }
    });
  },

  /**
   * Mark messages from a specific sender as read
   * @param {string} senderId 
   */
  markAsRead: async (senderId) => {
    return axiosClient.patch(`/messages/read/${senderId}`);
  },

  /**
   * Get people you can start a chat with
   */
  getAvailableUsers: async () => {
    return axiosClient.get('/messages/available-users');
  },

  /**
   * Get list of following users (to populate sidebar)
   * This is a fallback since there's no dedicated conversation list endpoint yet.
   */
  getFollowing: async userId => {
    return axiosClient.get(`/follows/${userId}/following`);
  },

  /**
   * Delete a message permanently
   * @param {string} messageId
   */
  deleteMessage: async messageId => {
    return axiosClient.delete(`/messages/${messageId}`);
  },
};

export default messageService;
