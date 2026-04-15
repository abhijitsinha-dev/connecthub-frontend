import { forwardRef, useEffect, useState } from 'react';
import { BiHeart, BiSolidHeart, BiMessageRounded } from 'react-icons/bi';
import { useAuth } from '../../../context/AuthContext';
import postApi from '../../../services/post.service';
import PostModal from '../../../components/post/PostModal';
import MobileCommentsModal from '../../../components/post/MobileCommentsModal';
import PostAuthorHeader from '../../../components/post/PostAuthorHeader';

const Post = forwardRef(({ post }, ref) => {
  const { user } = useAuth();
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [isMobileCommentsModalOpen, setIsMobileCommentsModalOpen] =
    useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(
    () => window.innerWidth < 640
  );

  const [isLiked, setIsLiked] = useState(post?.isLikedByCurrentUser ?? false);
  const [likesCount, setLikesCount] = useState(post?.likesCount ?? 0);

  const commentsCount = post?.commentsCount ?? 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const handleScreenChange = event => {
      setIsMobileScreen(event.matches);
      if (!event.matches) {
        setIsMobileCommentsModalOpen(false);
      }
    };

    setIsMobileScreen(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleScreenChange);
    } else {
      mediaQuery.addListener(handleScreenChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleScreenChange);
      } else {
        mediaQuery.removeListener(handleScreenChange);
      }
    };
  }, []);

  const handleLikeToggle = async e => {
    e.preventDefault();
    if (!user) return;

    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? Math.max(0, prev - 1) : prev + 1));

    try {
      if (isLiked) {
        await postApi.unlikePost(post.id);
      } else {
        await postApi.likePost(post.id);
      }
    } catch (error) {
      console.error('Failed to toggle like on post', error);
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    }
  };

  let mediaType = 'none';
  if (post.media && post.media.url) {
    mediaType = post.media.type || 'image'; // fallback to image if not provided
    if (post.media.url.match(/\.(mp4|webm|ogg)$/i)) {
      mediaType = 'video';
    }
  }

  const handleMediaClick = () => {
    if (isMobileScreen) return;
    setIsDesktopModalOpen(true);
  };

  const handleCommentsClick = () => {
    if (isMobileScreen) {
      setIsMobileCommentsModalOpen(true);
      return;
    }

    setIsDesktopModalOpen(true);
  };

  return (
    <>
      <article
        ref={ref}
        className="bg-bg-primary rounded-xl sm:rounded-2xl shadow-sm border border-border-primary p-4 sm:p-5 flex flex-col w-full sm:w-125 md:w-150 mx-auto max-h-212.5 overflow-hidden"
      >
        <PostAuthorHeader post={post} avatarClassName="w-11 h-11" />

        {mediaType === 'image' && post.media?.url && (
          <button
            type="button"
            onClick={handleMediaClick}
            className="mb-3 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 w-full flex justify-center hover:opacity-90 transition-opacity"
          >
            <img
              src={post.media.url}
              alt="Post media"
              className="w-full h-auto max-h-[60vh] md:max-h-100 object-contain"
            />
          </button>
        )}

        {mediaType === 'video' && post.media?.url && (
          <div className="mb-3 rounded-xl overflow-hidden bg-black w-full flex justify-center">
            <video
              controls
              src={post.media.url}
              className="w-full h-auto max-h-[60vh] md:max-h-100 object-contain"
            />
          </div>
        )}

        <div className="flex items-center gap-6 mt-auto pt-3 border-t border-border-primary">
          <button
            onClick={handleLikeToggle}
            className="flex items-center gap-2 text-text-secondary hover:text-red-500 transition-colors group"
          >
            {isLiked ? (
              <BiSolidHeart className="text-xl text-red-500 group-hover:scale-110 transition-transform" />
            ) : (
              <BiHeart className="text-xl group-hover:scale-110 transition-transform" />
            )}
            <span
              className={`text-sm font-medium ${isLiked ? 'text-red-500' : ''}`}
            >
              {likesCount}
            </span>
          </button>
          <button
            onClick={handleCommentsClick}
            className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group"
          >
            <BiMessageRounded className="text-xl group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </button>
        </div>
      </article>

      <PostModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
        post={post}
        isLiked={isLiked}
        likesCount={likesCount}
        onToggleLike={handleLikeToggle}
      />

      <MobileCommentsModal
        isOpen={isMobileCommentsModalOpen}
        onClose={() => setIsMobileCommentsModalOpen(false)}
        post={post}
      />
    </>
  );
});

Post.displayName = 'Post';

export default Post;
