import { useMemo, useState, useEffect, useRef } from 'react';
import {
  BiCheck,
  BiCheckDouble,
  BiDotsVerticalRounded,
  BiEditAlt,
  BiPaperPlane,
  BiSearch,
  BiSmile,
  BiTrash,
} from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import messageService from '../../services/message.service';
import { DEFAULT_PROFILE_PICTURE } from '../../utils/constants';

const Messenger = () => {
  const { user } = useAuth();
  const { socket, onlineUsers, refreshUnreadCount } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageDraft, setMessageDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState({}); // userId -> boolean
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevActiveConvRef = useRef(null);

  // Scroll to bottom logic
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Trigger scroll when messages change or loading finishes
  useEffect(() => {
    if (!isMessagesLoading && messages.length > 0) {
      const isNewConv = prevActiveConvRef.current !== activeConversation?.id;

      // Use 'auto' for initial load of a new chat, 'smooth' for new messages in current chat
      scrollToBottom(isNewConv ? 'auto' : 'smooth');

      // Update the ref for next time
      prevActiveConvRef.current = activeConversation?.id;
    }
  }, [messages, isMessagesLoading, remoteTyping, activeConversation?.id]);

  // Fetch sidebar data (active conversations + contacts)
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        if (!user?.id) return;
        const response = await messageService.getAvailableUsers();

        const processedConversations = response.data.map(c => ({
          ...c,
          name: c.fullName || c.username,
          avatar: c.avatar?.url || DEFAULT_PROFILE_PICTURE,
          timestamp: c.timestamp
            ? new Date(c.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
        }));

        setConversations(processedConversations);

        // Optional: Auto-select the first conversation if none is active
        if (!activeConversation && processedConversations.length > 0) {
          // setActiveConversation(processedConversations[0]);
        }
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error);
      } finally {
        setIsSidebarLoading(false);
      }
    };

    fetchSidebarData();
  }, [activeConversation, user]);

  // Fetch unread count globally
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        await messageService.getUnreadCount();
      } catch (error) {
        console.error('Failed to fetch unread counts:', error);
      }
    };
    fetchUnread();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;

      // If no last message, it's a new chat, no need to fetch
      if (!activeConversation.lastMessage) {
        setMessages([]);
        setIsMessagesLoading(false);
        return;
      }

      setIsMessagesLoading(true);
      try {
        const response = await messageService.getMessages(
          activeConversation.id
        );
        setMessages(response.data);

        // Mark as read in DB via API
        await messageService.markAsRead(activeConversation.id);

        // Notify via socket
        if (socket) {
          socket.emit('mark_as_read', { senderId: activeConversation.id });
        }

        // Update local sidebar unread count
        setConversations(prev =>
          prev.map(c =>
            c.id === activeConversation.id ? { ...c, unreadCount: 0 } : c
          )
        );

        // Refresh global unread count
        refreshUnreadCount();
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]); // Reset if it fails (e.g., no messages yet)
      } finally {
        setIsMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [activeConversation, socket, refreshUnreadCount]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = message => {
      const senderId = message.sender.id || message.sender;

      // If message is from current active conversation
      if (activeConversation && senderId === activeConversation.id) {
        setMessages(prev => [...prev, message]);
        messageService.markAsRead(activeConversation.id);

        // Notify via socket that it was read immediately
        socket.emit('mark_as_read', { senderId: activeConversation.id });
        refreshUnreadCount();
      }

      // Always update sidebar snippet and move to top
      setConversations(prev => {
        const existing = prev.find(c => c.id === senderId);
        const updatedConv = existing
          ? {
              ...existing,
              unreadCount:
                activeConversation?.id === senderId
                  ? 0
                  : (existing.unreadCount || 0) + 1,
              lastMessage: message.content,
              lastMessageSender: senderId,
              isLastMessageRead: activeConversation?.id === senderId,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : {
              id: senderId,
              name: message.sender.fullName || message.sender.username,
              username: message.sender.username,
              avatar: message.sender.avatar?.url || DEFAULT_PROFILE_PICTURE,
              lastMessage: message.content,
              lastMessageSender: senderId,
              isLastMessageRead: activeConversation?.id === senderId,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              unreadCount: 1,
            };

        // Filter out the old version and move the updated one to the top
        const otherConvs = prev.filter(c => c.id !== senderId);
        return [updatedConv, ...otherConvs];
      });
    };

    const handleMessageSent = message => {
      const receiverId = message.receiver.id || message.receiver;
      if (activeConversation && receiverId === activeConversation.id) {
        setMessages(prev => [...prev, message]);

        // Update sidebar last message and move to top
        setConversations(prev => {
          const existing = prev.find(c => c.id === receiverId);
          if (!existing) return prev;

          const updatedConv = {
            ...existing,
            lastMessage: message.content,
            lastMessageSender: user.id,
            isLastMessageRead: false,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          const otherConvs = prev.filter(c => c.id !== receiverId);
          return [updatedConv, ...otherConvs];
        });
      }
    };

    const handleTyping = ({ senderId, isTyping }) => {
      setRemoteTyping(prev => ({ ...prev, [senderId]: isTyping }));
    };

    const handleMessagesRead = ({ readerId }) => {
      // Update messages in active chat
      if (activeConversation && readerId === activeConversation.id) {
        setMessages(prev =>
          prev.map(msg => ({
            ...msg,
            isRead: true,
          }))
        );
      }

      // Update last message status in sidebar
      setConversations(prev =>
        prev.map(c =>
          c.id === readerId && c.lastMessageSender === user.id
            ? { ...c, isLastMessageRead: true }
            : c
        )
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages(prev =>
        prev.filter(msg => (msg._id || msg.id) !== messageId)
      );
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_sent', handleMessageSent);
    socket.on('display_typing', handleTyping);
    socket.on('messages_read', handleMessagesRead);
    socket.on('message_deleted', handleMessageDeleted);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('display_typing', handleTyping);
      socket.off('messages_read', handleMessagesRead);
      socket.off('message_deleted', handleMessageDeleted);
    };
  }, [socket, activeConversation, user.id, refreshUnreadCount]);

  // Message deletion logic
  const handleDeleteMessage = async messageId => {
    try {
      await messageService.deleteMessage(messageId);

      // 1. Remove from local state instantly
      setMessages(prev =>
        prev.filter(msg => (msg._id || msg.id) !== messageId)
      );

      // 2. Notify other user via Socket (Real-time)
      if (socket && activeConversation) {
        socket.emit('delete_message', {
          messageId,
          receiverId: activeConversation.id,
        });
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  // Typing indicator logic
  const handleTypingIndicator = e => {
    setMessageDraft(e.target.value);

    if (!socket || !activeConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        receiverId: activeConversation.id,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', {
        receiverId: activeConversation.id,
        isTyping: false,
      });
    }, 2000);
  };

  const handleSubmitMessage = event => {
    event.preventDefault();
    if (!messageDraft.trim() || !socket || !activeConversation) return;

    socket.emit('send_message', {
      receiverId: activeConversation.id,
      content: messageDraft.trim(),
    });

    setMessageDraft('');
    // Stop typing indicator immediately on send
    setIsTyping(false);
    socket.emit('typing', {
      receiverId: activeConversation.id,
      isTyping: false,
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return conversations;

    return conversations.filter(
      c =>
        c.name.toLowerCase().includes(normalizedSearch) ||
        c.username.toLowerCase().includes(normalizedSearch)
    );
  }, [searchTerm, conversations]);

  return (
    <div className="w-full h-dvh lg:pl-64 flex justify-end">
      <section className="w-full max-w-350 h-full rounded-none sm:rounded-3xl overflow-hidden border border-white/30 dark:border-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] bg-linear-to-br from-bg-primary via-bg-primary to-bg-secondary/50">
        <div className="relative grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] h-full min-h-0">
          {/* Sidebar */}
          <aside className="border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/10 backdrop-blur-sm bg-bg-primary/80">
            <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                  Messages
                </h1>
                <button className="w-10 h-10 rounded-xl bg-brand-primary text-white grid place-items-center hover:brightness-110 transition-all">
                  <BiEditAlt className="text-xl" />
                </button>
              </div>
              <div className="relative">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary text-text-primary placeholder:text-text-secondary/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                />
              </div>
            </div>

            <div
              className={`max-h-[34dvh] lg:max-h-[calc(100dvh-12rem)] p-2 sm:p-3 space-y-1.5 ${isSidebarLoading || filteredConversations.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'}`}
            >
              {isSidebarLoading ? (
                // Sidebar Skeleton
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full p-3 flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-12 h-12 rounded-full bg-bg-secondary shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-bg-secondary rounded" />
                        <div className="h-3 w-10 bg-bg-secondary rounded" />
                      </div>
                      <div className="h-3 w-3/4 bg-bg-secondary rounded" />
                    </div>
                  </div>
                ))
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map(conv => {
                  const isActive = activeConversation?.id === conv.id;
                  const isOnline = onlineUsers.includes(conv.id);

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className={`w-full text-left p-3 rounded-2xl transition-all border ${
                        isActive
                          ? 'bg-brand-primary/10 border-brand-primary/30 shadow-[0_8px_24px_rgba(79,70,229,0.20)]'
                          : 'hover:bg-bg-secondary border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={conv.avatar}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {isOnline && (
                            <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-bg-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-text-primary truncate">
                              {conv.name}
                            </p>
                            <span className="text-xs text-text-secondary shrink-0">
                              {conv.timestamp}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <p className="text-sm text-text-secondary truncate min-w-0 flex-1">
                              {remoteTyping[conv.id] ? (
                                <span className="text-brand-primary animate-pulse italic">
                                  typing...
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 min-w-0">
                                  {conv.lastMessageSender === user?.id &&
                                    conv.lastMessage && (
                                      <span className="shrink-0">
                                        {conv.isLastMessageRead ? (
                                          <BiCheckDouble className="text-blue-400 text-base" />
                                        ) : (
                                          <BiCheck className="text-text-secondary text-base" />
                                        )}
                                      </span>
                                    )}
                                  <span className="truncate flex-1">
                                    {conv.lastMessage || `@${conv.username}`}
                                  </span>
                                </div>
                              )}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="min-w-5 h-5 px-1 rounded-full bg-brand-primary text-white text-[11px] font-semibold grid place-items-center shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10 px-4">
                  <p className="text-text-secondary text-sm">
                    No conversations found.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Chat Window */}
          <main className="flex flex-col h-full min-h-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.08),transparent_50%)]">
            {activeConversation ? (
              <>
                <header className="px-4 sm:px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activeConversation.avatar}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h2 className="font-semibold text-text-primary truncate">
                        {activeConversation.name}
                      </h2>
                      <p
                        className={`text-xs font-medium ${onlineUsers.includes(activeConversation.id) ? 'text-emerald-500' : 'text-text-secondary'}`}
                      >
                        {onlineUsers.includes(activeConversation.id)
                          ? 'Online now'
                          : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors">
                      <BiDotsVerticalRounded className="text-lg" />
                    </button>
                  </div>
                </header>

                <div
                  className={`flex-1 px-4 sm:px-6 py-5 sm:py-6 space-y-4 ${isMessagesLoading || messages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden flex flex-col items-center justify-center'}`}
                >
                  {isMessagesLoading ? (
                    // Messages Skeleton
                    [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} animate-pulse`}
                      >
                        <div
                          className={`h-10 w-[60%] rounded-2xl bg-bg-secondary/50`}
                        />
                      </div>
                    ))
                  ) : messages.length > 0 ? (
                    messages.map((msg, idx) => {
                      const isMe = (msg.sender?.id || msg.sender) === user?.id;

                      return (
                        <div
                          key={msg.id || idx}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] group relative`}
                          >
                            {isMe && (
                              <button
                                onClick={() =>
                                  setDeleteConfirmId(msg._id || msg.id)
                                }
                                className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg-secondary text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10"
                                title="Delete message"
                              >
                                <BiTrash className="text-lg" />
                              </button>
                            )}
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                                isMe
                                  ? 'bg-brand-primary text-white rounded-br-md'
                                  : 'bg-bg-primary text-text-primary border border-black/5 dark:border-white/10 rounded-bl-md'
                              }`}
                            >
                              <p>{msg.content}</p>
                              <div
                                className={`mt-1 text-[10px] flex items-center justify-end gap-1 opacity-70 ${isMe ? 'text-white' : 'text-text-secondary'}`}
                              >
                                <span>
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: '2-digit', minute: '2-digit' }
                                  )}
                                </span>
                                {isMe &&
                                  (msg.isRead ? (
                                    <BiCheckDouble className="text-sm text-blue-300" />
                                  ) : (
                                    <BiCheck className="text-sm" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-10 opacity-60">
                      <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
                        <BiPaperPlane className="text-2xl text-brand-primary" />
                      </div>
                      <p className="text-text-primary font-medium">
                        No messages yet
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Start a conversation with {activeConversation.name}
                      </p>
                    </div>
                  )}
                  {remoteTyping[activeConversation.id] && (
                    <div className="flex justify-start">
                      <div className="bg-bg-secondary/50 px-4 py-2 rounded-2xl flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSubmitMessage}
                  className="px-4 sm:px-6 py-4 border-t border-black/5 dark:border-white/10"
                >
                  <div className="flex items-center gap-2 sm:gap-3 bg-bg-primary border border-black/5 dark:border-white/10 rounded-2xl p-2.5 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center"
                    >
                      <BiSmile className="text-xl" />
                    </button>
                    <input
                      type="text"
                      value={messageDraft}
                      onChange={handleTypingIndicator}
                      placeholder={`Message ${activeConversation.name}...`}
                      className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/60 focus:outline-none text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!messageDraft.trim()}
                      className="w-10 h-10 rounded-xl bg-brand-primary text-white grid place-items-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      <BiPaperPlane className="text-xl" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-linear-to-b from-transparent to-bg-secondary/10">
                <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 text-brand-primary grid place-items-center mb-4">
                  <BiPaperPlane className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  Your Messages
                </h3>
                <p className="text-text-secondary mt-2 max-w-xs">
                  Select a conversation from the list to start chatting or find
                  someone new.
                </p>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          onClick={() => setDeleteConfirmId(null)}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-bg-primary w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-black/5 dark:border-white/10 animate-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 grid place-items-center mb-4 mx-auto">
              <BiTrash className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-text-primary text-center">
              Delete Message?
            </h3>
            <p className="text-text-secondary text-center mt-2 text-sm leading-relaxed">
              Are you sure you want to delete this message? This action cannot
              be undone and it will disappear for everyone.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => {
                  handleDeleteMessage(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="w-full py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Delete for Everyone
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-full py-3 rounded-2xl bg-bg-secondary text-text-primary font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;
