import { useState } from 'react';
import { BiHeart, BiMessageRounded, BiUserPlus, BiCheck } from 'react-icons/bi';

const FEED_POSTS = [
  {
    id: 1,
    type: 'text',
    author: {
      name: 'Maya Rivers',
      username: 'maya.codes',
      avatar: 'https://i.pravatar.cc/120?img=47',
    },
    content:
      'Shipping a new feature this evening. Tiny UX details make huge differences when users feel them without noticing. ✨',
    likes: 84,
    comments: 13,
    timestamp: '35 minutes ago',
  },
  {
    id: 2,
    type: 'photo',
    author: {
      name: 'Leo Carter',
      username: 'leo.visuals',
      avatar: 'https://i.pravatar.cc/120?img=12',
    },
    content: 'Morning run before work. The sky looked unreal today.',
    mediaUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1400',
    likes: 231,
    comments: 27,
    timestamp: '2 hours ago',
  },
  {
    id: 3,
    type: 'video',
    author: {
      name: 'Ariana Kim',
      username: 'ariana.learns',
      avatar: 'https://i.pravatar.cc/120?img=32',
    },
    content: 'Quick walkthrough of the onboarding flow I prototyped today.',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 145,
    comments: 19,
    timestamp: 'Yesterday',
  },
];

const RECOMMENDED_USERS = [
  {
    id: 1,
    fullName: 'Noah Bennett',
    username: 'noahwrites',
    bio: 'Product storyteller and community builder.',
    avatar: 'https://i.pravatar.cc/120?img=21',
  },
  {
    id: 2,
    fullName: 'Sara Ahmad',
    username: 'sara.design',
    bio: 'UI designer focused on accessible experiences.',
    avatar: 'https://i.pravatar.cc/120?img=16',
  },
  {
    id: 3,
    fullName: 'Ethan Brooks',
    username: 'ethan.devops',
    bio: 'Cloud engineer sharing backend tips and workflows.',
    avatar: 'https://i.pravatar.cc/120?img=58',
  },
  {
    id: 4,
    fullName: 'Priya Nair',
    username: 'priyanair',
    bio: 'Frontend dev and motion design enthusiast.',
    avatar: 'https://i.pravatar.cc/120?img=41',
  },
];

const Home = () => {
  const [followingIds, setFollowingIds] = useState(new Set([2]));

  const handleFollowToggle = (userId) => {
    setFollowingIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full flex justify-end">
        <div className="w-full max-w-350 flex flex-col lg:flex-row lg:justify-end gap-8">
          <section className="w-full lg:max-w-3xl">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Feed
              </h1>
              <span className="text-sm text-text-secondary">
                Latest updates
              </span>
            </div>

            <div className="space-y-5">
              {FEED_POSTS.map((post) => (
                <article
                  key={post.id}
                  className="bg-bg-primary rounded-2xl shadow-sm border border-border-primary p-5 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.author.avatar}
                      alt={`${post.author.name} avatar`}
                      className="w-11 h-11 rounded-full object-cover border border-border-primary"
                    />
                    <div>
                      <p className="font-semibold text-text-primary text-sm">
                        {post.author.name}
                      </p>
                      <p className="text-text-secondary text-xs">
                        @{post.author.username} • {post.timestamp}
                      </p>
                    </div>
                  </div>

                  {post.content && (
                    <p className="text-text-primary mb-4 text-sm leading-relaxed">
                      {post.content}
                    </p>
                  )}

                  {post.type === 'photo' && (
                    <div className="mb-4 rounded-xl overflow-hidden bg-bg-secondary w-full">
                      <img
                        src={post.mediaUrl}
                        alt="Post media"
                        className="w-full h-full object-cover aspect-video"
                      />
                    </div>
                  )}

                  {post.type === 'video' && (
                    <div className="mb-4 rounded-xl overflow-hidden bg-black w-full">
                      <video
                        controls
                        src={post.mediaUrl}
                        className="w-full h-full object-cover aspect-video"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-6 mt-auto pt-4 border-t border-border-primary">
                    <button className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group">
                      <BiHeart className="text-xl group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group">
                      <BiMessageRounded className="text-xl group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">
                        {post.comments}
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="w-full lg:w-96 lg:shrink-0">
            <div className="bg-bg-primary rounded-2xl shadow-sm border border-border-primary p-5 sticky top-6">
              <h2 className="text-xl font-bold text-text-primary mb-1">
                Follow Recommendations
              </h2>
              <p className="text-sm text-text-secondary mb-5">
                People you may want to connect with
              </p>

              <div className="space-y-4">
                {RECOMMENDED_USERS.map((user) => {
                  const isFollowing = followingIds.has(user.id);
                  return (
                    <div
                      key={user.id}
                      className="flex items-start justify-between gap-3 pb-4 border-b border-border-primary last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={user.avatar}
                          alt={`${user.fullName} avatar`}
                          className="w-11 h-11 rounded-full object-cover border border-border-primary shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            @{user.username}
                          </p>
                          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleFollowToggle(user.id)}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          isFollowing
                            ? 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80'
                            : 'bg-brand-primary text-white hover:opacity-90'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <BiCheck className="text-sm" />
                            Following
                          </>
                        ) : (
                          <>
                            <BiUserPlus className="text-sm" />
                            Follow
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
