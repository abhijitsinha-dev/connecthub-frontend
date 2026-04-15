import { useState, useEffect } from 'react';
import postApi from '../../../services/post.service';
import { useParams } from 'react-router-dom';

const getProfilePostsPayload = response => {
  const primary = response?.data;

  if (
    Array.isArray(primary?.posts) ||
    typeof primary?.totalPosts === 'number'
  ) {
    return primary;
  }

  return primary?.data || {};
};

const useProfilePosts = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  // Initial fetch and state reset when username changes
  useEffect(() => {
    let isMounted = true;

    setPosts([]);
    setPage(1);
    setHasMore(true);

    const fetchInitialPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postApi.profilePosts(username, 1, 10);
        if (!isMounted) return;

        const payload = getProfilePostsPayload(res);
        const newPosts = payload.posts || [];
        setPosts(newPosts);
        setTotalPosts(payload.totalPosts || 0);
        setHasMore(newPosts.length === 10);
      } catch (error) {
        console.error('Error fetching initial profile posts:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialPosts();

    return () => {
      isMounted = false;
    };
  }, [username]);

  // Fetch more posts when page increments
  useEffect(() => {
    if (page === 1 || !hasMore) return;

    let isMounted = true;

    const fetchMorePosts = async () => {
      setIsLoading(true);
      try {
        const res = await postApi.profilePosts(username, page, 10);
        if (!isMounted) return;

        const payload = getProfilePostsPayload(res);
        const newPosts = payload.posts || [];

        if (typeof payload.totalPosts === 'number') {
          setTotalPosts(payload.totalPosts);
        }

        setPosts(prevPosts => {
          const existingIds = new Set(prevPosts.map(p => p.id));
          const filteredNew = newPosts.filter(p => !existingIds.has(p.id));
          return [...prevPosts, ...filteredNew];
        });

        if (newPosts.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching more profile posts:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMorePosts();

    return () => {
      isMounted = false;
    };
  }, [page, username, hasMore]);

  return {
    posts,
    page,
    setPage,
    hasMore,
    isLoading,
    totalPosts,
  };
};

export default useProfilePosts;
