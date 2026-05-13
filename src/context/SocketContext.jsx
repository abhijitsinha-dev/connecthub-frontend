import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SocketContext } from './SocketContext';
import messageService from '../services/message.service';

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token && user) {
      const socketInstance = io(
        import.meta.env.VITE_API_BASE_URL.replace('/api/v1', ''),
        {
          auth: {
            token: token,
          },
        }
      );

      setSocket(socketInstance);

      socketInstance.on('online_users', users => {
        setOnlineUsers(users);
      });

      socketInstance.on('user_status', ({ userId, isOnline }) => {
        setOnlineUsers(prev => {
          if (isOnline) {
            return prev.includes(userId) ? prev : [...prev, userId];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      });

      // Fetch initial unread count
      const fetchUnread = async () => {
        try {
          const response = await messageService.getUnreadCount();
          setUnreadCount(response.data.count);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      };
      fetchUnread();

      // Listen for events that change unread count
      socketInstance.on('receive_message', () => {
        fetchUnread();
      });

      socketInstance.on('messages_read', () => {
        fetchUnread();
      });

      socketInstance.on('update_unread_count', () => {
        fetchUnread();
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, user]);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await messageService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to refresh unread count:', error);
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        unreadCount,
        setUnreadCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
