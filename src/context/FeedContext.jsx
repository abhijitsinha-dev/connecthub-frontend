import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import postApi from '../services/post.service';
import { sortPostsByCreatedAtDesc } from '../utils/helpers';

const FeedContext = createContext();

export const useFeed = () => useContext(FeedContext);

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [excludedPostIds, setExcludedPostIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isAutoplayPausedByUser, setIsAutoplayPausedByUser] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);

  // Use a ref to track if initial fetch has been done to prevent strict mode double-fetching issues if desired
  const isInitialLoadDone = useRef(false);

  const fetchFeed = useCallback(
    async (isInitial = false) => {
      // If it's not the initial fetch, wait for the previous one to finish.
      if (loading || (!hasMore && !isInitial)) return;

      setLoading(true);
      try {
        const currentExcludedIds = isInitial ? [] : excludedPostIds;
        const response = await postApi.feed({
          excludedPostIds: currentExcludedIds,
        });

        const fetchedPosts = response.data?.posts || [];
        const newPosts = sortPostsByCreatedAtDesc(fetchedPosts);

        if (newPosts.length === 0) {
          setHasMore(false);
          if (isInitial) {
            isInitialLoadDone.current = true;
          }
        } else {
          const newIds = newPosts.map(post => post.id);

          if (isInitial) {
            setPosts(newPosts);
            setExcludedPostIds(newIds);
            isInitialLoadDone.current = true;
          } else {
            setPosts(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const uniqueNewPosts = newPosts.filter(
                p => !existingIds.has(p.id)
              );
              return [...prev, ...uniqueNewPosts];
            });
            setExcludedPostIds(prev => {
              const nextSet = new Set([...prev, ...newIds]);
              return Array.from(nextSet);
            });
          }
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    },
    [excludedPostIds, loading, hasMore]
  );

  return (
    <FeedContext.Provider
      value={{
        posts,
        fetchFeed,
        loading,
        hasMore,
        isInitialLoadDone,
        isAutoplayPausedByUser,
        setIsAutoplayPausedByUser,
        activeVideoId,
        setActiveVideoId,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
