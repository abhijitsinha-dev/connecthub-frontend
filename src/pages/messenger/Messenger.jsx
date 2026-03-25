import { useMemo, useState } from 'react';
import {
  BiCheckDouble,
  BiChevronRight,
  BiDotsVerticalRounded,
  BiEditAlt,
  BiImageAdd,
  BiMicrophone,
  BiPaperPlane,
  BiPhone,
  BiSearch,
  BiSmile,
  BiVideo,
  BiX,
} from 'react-icons/bi';

// Left panel conversation list seed data.
const CONVERSATIONS = [
  {
    id: 1,
    name: 'Maya Rivers',
    handle: '@maya.codes',
    avatar: 'https://i.pravatar.cc/120?img=47',
    lastMessage: 'The animation timing is perfect now. Can you review once?',
    timestamp: '2m',
    unreadCount: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Leo Carter',
    handle: '@leo.visuals',
    avatar: 'https://i.pravatar.cc/120?img=12',
    lastMessage: 'Sharing drafts in 15 mins.',
    timestamp: '11m',
    unreadCount: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Ariana Kim',
    handle: '@ariana.learns',
    avatar: 'https://i.pravatar.cc/120?img=32',
    lastMessage: 'Loved the post. That structure was so clear.',
    timestamp: '1h',
    unreadCount: 0,
    online: false,
  },
  {
    id: 4,
    name: 'Noah Bennett',
    handle: '@noahwrites',
    avatar: 'https://i.pravatar.cc/120?img=21',
    lastMessage: 'Can we sync tomorrow morning?',
    timestamp: '3h',
    unreadCount: 1,
    online: false,
  },
  {
    id: 5,
    name: 'Sara Ahmad',
    handle: '@sara.design',
    avatar: 'https://i.pravatar.cc/120?img=16',
    lastMessage: 'I added notes to the figma file.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    online: true,
  },
];

// Mock message threads keyed by conversation id.
const MESSAGES_BY_CONVERSATION = {
  1: [
    {
      id: 1,
      sender: 'them',
      text: 'I pushed the latest version of the motion card.',
      time: '09:14',
    },
    {
      id: 2,
      sender: 'me',
      text: 'Great. I will test it on mobile breakpoints too.',
      time: '09:17',
    },
    {
      id: 3,
      sender: 'them',
      text: 'The animation timing is perfect now. Can you review once?',
      time: '09:19',
    },
    {
      id: 4,
      sender: 'me',
      text: 'Reviewing now. I already like how smooth the entrance feels.',
      time: '09:21',
    },
    {
      id: 5,
      sender: 'them',
      text: 'Awesome. I will ship right after your final thumbs up.',
      time: '09:23',
    },
  ],
  2: [
    {
      id: 1,
      sender: 'them',
      text: 'Morning! Want to pair on the profile page visuals?',
      time: '08:10',
    },
    {
      id: 2,
      sender: 'me',
      text: 'Sure. Send me your latest drafts and we can iterate.',
      time: '08:12',
    },
  ],
  3: [
    {
      id: 1,
      sender: 'them',
      text: 'Thanks for your feedback yesterday. It helped a lot.',
      time: 'Yesterday',
    },
  ],
  4: [
    {
      id: 1,
      sender: 'them',
      text: 'Can we sync tomorrow morning?',
      time: '17:42',
    },
  ],
  5: [
    {
      id: 1,
      sender: 'them',
      text: 'I added notes to the figma file.',
      time: 'Yesterday',
    },
  ],
};

// Media preview tiles shown in the details drawer.
const SHARED_MEDIA = [
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80',
];

const Messenger = () => {
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [messageDraft, setMessageDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Keep search filtering cheap and stable across renders.
  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return CONVERSATIONS;
    }

    return CONVERSATIONS.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(normalizedSearch) ||
        conversation.handle.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

  // Resolve active conversation/thread with safe fallback.
  const activeConversation =
    CONVERSATIONS.find(
      (conversation) => conversation.id === activeConversationId,
    ) || CONVERSATIONS[0];

  const activeMessages =
    MESSAGES_BY_CONVERSATION[activeConversation.id] ||
    MESSAGES_BY_CONVERSATION[1];

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    if (!messageDraft.trim()) {
      return;
    }

    setMessageDraft('');
  };

  return (
    <div className="w-full h-dvh lg:pl-64 flex justify-end">
      <section className="w-full max-w-350 h-full rounded-none sm:rounded-3xl overflow-hidden border border-white/30 dark:border-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] bg-linear-to-br from-bg-primary via-bg-primary to-bg-secondary/50">
        <div className="relative grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] h-full min-h-0">
          {/* Conversations column */}
          <aside className="border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/10 backdrop-blur-sm bg-bg-primary/80">
            <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                  Messages
                </h1>
                <button
                  className="w-10 h-10 rounded-xl bg-brand-primary text-white grid place-items-center hover:brightness-110 transition-all"
                  title="New Message"
                >
                  <BiEditAlt className="text-xl" />
                </button>
              </div>

              <div className="relative">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary text-text-primary placeholder:text-text-secondary/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                />
              </div>
            </div>

            <div className="max-h-[34dvh] lg:max-h-[calc(100dvh-12rem)] overflow-y-auto p-2 sm:p-3 space-y-1.5">
              {filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeConversation.id;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setActiveConversationId(conversation.id);
                      setIsDetailsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border ${
                      isActive
                        ? 'bg-brand-primary/10 border-brand-primary/30 shadow-[0_8px_24px_rgba(79,70,229,0.20)]'
                        : 'hover:bg-bg-secondary border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={conversation.avatar}
                          alt={`${conversation.name} avatar`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.online && (
                          <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-bg-primary" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-text-primary truncate">
                            {conversation.name}
                          </p>
                          <span className="text-xs text-text-secondary shrink-0">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="text-sm text-text-secondary truncate min-w-0 flex-1">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="min-w-5 h-5 px-1 rounded-full bg-brand-primary text-white text-[11px] font-semibold grid place-items-center shrink-0">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active chat column */}
          <main className="flex flex-col bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.08),transparent_50%)]">
            <header className="px-4 sm:px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsDetailsOpen((prev) => !prev)}
                className="flex items-center gap-3 min-w-0 rounded-xl pr-2 hover:bg-bg-secondary/70 transition-colors"
                title="Toggle conversation details"
              >
                <img
                  src={activeConversation.avatar}
                  alt={`${activeConversation.name} avatar`}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="min-w-0 text-left">
                  <h2 className="font-semibold text-text-primary truncate">
                    {activeConversation.name}
                  </h2>
                  <p className="text-xs text-emerald-500 font-medium">
                    {activeConversation.online
                      ? 'Online now'
                      : 'Last seen 2h ago'}
                  </p>
                </div>
                <BiChevronRight
                  className={`text-lg text-text-secondary transition-transform ${
                    isDetailsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors">
                  <BiPhone className="text-lg" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors">
                  <BiVideo className="text-lg" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors">
                  <BiDotsVerticalRounded className="text-lg" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-3">
              {activeMessages.map((message) => {
                const isMe = message.sender === 'me';

                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-brand-primary text-white rounded-br-md'
                          : 'bg-bg-primary text-text-primary border border-black/5 dark:border-white/10 rounded-bl-md'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div
                        className={`mt-1.5 text-[11px] flex items-center justify-end gap-1 ${
                          isMe ? 'text-white/80' : 'text-text-secondary'
                        }`}
                      >
                        <span>{message.time}</span>
                        {isMe && <BiCheckDouble className="text-base" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSubmitMessage}
              className="px-4 sm:px-6 py-4 border-t border-black/5 dark:border-white/10"
            >
              <div className="flex items-center gap-2 sm:gap-3 bg-bg-primary border border-black/5 dark:border-white/10 rounded-2xl p-2.5">
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors"
                >
                  <BiSmile className="text-lg" />
                </button>
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors"
                >
                  <BiImageAdd className="text-lg" />
                </button>

                <input
                  type="text"
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  placeholder={`Message ${activeConversation.name}`}
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/80 focus:outline-none"
                />

                <button
                  type="button"
                  className="w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors"
                >
                  <BiMicrophone className="text-lg" />
                </button>

                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-brand-primary text-white grid place-items-center hover:brightness-110 transition-all"
                  title="Send"
                >
                  <BiPaperPlane className="text-lg" />
                </button>
              </div>
            </form>
          </main>

          <button
            type="button"
            onClick={() => setIsDetailsOpen(false)}
            aria-label="Close details panel"
            className={`absolute inset-0 z-20 bg-black/25 transition-opacity ${
              isDetailsOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Slide-over details drawer */}
          <aside
            className={`absolute top-0 right-0 z-30 h-full w-full sm:w-96 lg:w-80 flex flex-col border-l border-black/5 dark:border-white/10 bg-bg-primary/90 backdrop-blur-sm transition-transform duration-300 ease-out ${
              isDetailsOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6 border-b border-black/5 dark:border-white/10 text-center relative">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary grid place-items-center transition-colors"
                title="Close details"
              >
                <BiX className="text-lg" />
              </button>
              <img
                src={activeConversation.avatar}
                alt={`${activeConversation.name} profile`}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
              <h3 className="mt-3 text-lg font-bold text-text-primary">
                {activeConversation.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {activeConversation.handle}
              </p>
              <span className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-600">
                {activeConversation.online ? 'Available' : 'Away'}
              </span>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <section>
                <h4 className="text-sm uppercase tracking-wide font-semibold text-text-secondary mb-3">
                  Shared Media
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {SHARED_MEDIA.map((mediaUrl) => (
                    <img
                      key={mediaUrl}
                      src={mediaUrl}
                      alt="Shared media"
                      className="w-full aspect-square rounded-xl object-cover"
                    />
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-sm uppercase tracking-wide font-semibold text-text-secondary mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 rounded-xl bg-bg-secondary hover:bg-bg-secondary/70 text-text-primary transition-colors">
                    View Profile
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl bg-bg-secondary hover:bg-bg-secondary/70 text-text-primary transition-colors">
                    Mute Notifications
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-500 transition-colors">
                    Block Contact
                  </button>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Messenger;
