import { useState, useEffect, useRef, useCallback } from 'react';
import { BiUserPlus, BiCheck, BiLoaderAlt } from 'react-icons/bi';
import { useFeed } from '../../context/FeedContext';
import Post from './components/Post';

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
  const { posts, fetchFeed, loading, hasMore, isInitialLoadDone } = useFeed();

  const observer = useRef();

  const triggerElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchFeed(false);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchFeed]
  );

  useEffect(() => {
    if (!isInitialLoadDone.current && posts.length === 0) {
      fetchFeed(true);
    }
  }, [fetchFeed, posts.length, isInitialLoadDone]);

  const handleFollowToggle = userId => {
    setFollowingIds(prev => {
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
        <div className="w-full max-w-7xl flex flex-col lg:flex-row lg:justify-end gap-8">
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
              {posts.map((post, index) => {
                const isTriggerElement =
                  posts.length >= 3
                    ? index === posts.length - 3
                    : index === posts.length - 1;
                return (
                  <Post
                    key={post.id}
                    ref={isTriggerElement ? triggerElementRef : null}
                    post={post}
                  />
                );
              })}

              {loading && (
                <div className="flex justify-center py-6">
                  <BiLoaderAlt className="animate-spin text-3xl text-brand-primary" />
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <div className="text-center py-6 text-text-secondary text-sm">
                  You have caught up with everything!
                </div>
              )}

              {!loading && posts.length === 0 && (
                <div className="text-center py-12 text-text-secondary">
                  No posts to show yet. Follow someone or check back later!
                </div>
              )}
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
                {RECOMMENDED_USERS.map(user => {
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
