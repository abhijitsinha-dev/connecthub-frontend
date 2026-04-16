import { forwardRef, useEffect, useState, useRef } from 'react';
import {
  BiHeart,
  BiSolidHeart,
  BiMessageRounded,
  BiPlayCircle,
  BiPauseCircle,
  BiVolumeMute,
  BiVolumeFull,
} from 'react-icons/bi';
import { useAuth } from '../../../context/AuthContext';
import { useFeed } from '../../../context/FeedContext';
import postApi from '../../../services/post.service';
import PostModal from '../../../components/post/PostModal';
import MobileCommentsModal from '../../../components/post/MobileCommentsModal';
import PostAuthorHeader from '../../../components/post/PostAuthorHeader';
import UserListModal from '../../../components/UserListModal';
import { useNavigate } from 'react-router-dom';

const Post = forwardRef(({ post }, ref) => {
  const { user } = useAuth();
  const {
    isAutoplayPausedByUser,
    setIsAutoplayPausedByUser,
    activeVideoId,
    setActiveVideoId,
  } = useFeed();
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [isMobileCommentsModalOpen, setIsMobileCommentsModalOpen] =
    useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(
    () => window.innerWidth < 640
  );
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post?.isLikedByCurrentUser ?? false);
  const [likesCount, setLikesCount] = useState(post?.likesCount ?? 0);
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [likers, setLikers] = useState([]);
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const wasPlayingRef = useRef(false);
  const containerRef = useRef(null);

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

  useEffect(() => {
    if (isDesktopModalOpen) {
      if (videoRef.current && !videoRef.current.paused) {
        wasPlayingRef.current = true;
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        wasPlayingRef.current = false;
      }
    } else {
      if (wasPlayingRef.current && videoRef.current) {
        videoRef.current.play().catch(err => {
          console.error('Failed to resume video playback:', err);
        });
        setIsPlaying(true);
        wasPlayingRef.current = false;
      }
    }
  }, [isDesktopModalOpen]);

  // Exclusive playback sync: Pause if another video becomes active
  useEffect(() => {
    if (activeVideoId && activeVideoId !== post.id && isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [activeVideoId, post.id, isPlaying]);

  // Handle global autoplay pause intent
  useEffect(() => {
    if (isAutoplayPausedByUser && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isAutoplayPausedByUser]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (
            !isAutoplayPausedByUser &&
            videoRef.current &&
            videoRef.current.paused
          ) {
            videoRef.current.play().catch(err => {
              console.error('Autoplay failed:', err);
            });
            setIsPlaying(true);
            setActiveVideoId(post.id);
          }
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isAutoplayPausedByUser, setActiveVideoId, post.id]);

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

  const handleLikesCountClick = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (likesCount === 0) return;

    setIsLikersModalOpen(true);
    setIsLoadingLikers(true);
    try {
      const response = await postApi.getLikesByPostId(post.id, 1, 100);
      const data = response?.data?.data || response?.data;
      setLikers(data.likers || []);
    } catch (error) {
      console.error('Failed to fetch likers:', error);
    } finally {
      setIsLoadingLikers(false);
    }
  };

  const handleUserClick = targetUser => {
    setIsLikersModalOpen(false);
    navigate(`/profile/${targetUser.username}`);
  };

  const toggleVideoPlay = e => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setIsAutoplayPausedByUser(false);
        setActiveVideoId(post.id);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsAutoplayPausedByUser(true);
      }
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
        ref={node => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
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
              draggable="false"
            />
          </button>
        )}

        {mediaType === 'video' && post.media?.url && (
          <div
            className="mb-3 rounded-xl overflow-hidden bg-black w-full flex justify-center relative group/video cursor-pointer"
            onClick={toggleVideoPlay}
          >
            <video
              ref={videoRef}
              src={post.media.url}
              className="w-full h-auto max-h-[60vh] md:max-h-100 object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              playsInline
              autoPlay
              muted={isMuted}
            />
            {/* Play/Pause Overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${
                isPlaying
                  ? 'opacity-0 group-hover/video:opacity-100'
                  : 'opacity-100'
              }`}
            >
              {isPlaying ? (
                <BiPauseCircle
                  className="text-white drop-shadow-2xl"
                  size={64}
                />
              ) : (
                <BiPlayCircle
                  className="text-white drop-shadow-2xl"
                  size={64}
                />
              )}
            </div>

            {/* Mute/Unmute Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                setIsMuted(prev => !prev);
              }}
              className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all z-20 group/mute"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <BiVolumeMute className="text-xl sm:text-2xl" />
              ) : (
                <BiVolumeFull className="text-xl sm:text-2xl" />
              )}
            </button>
          </div>
        )}

        <div className="flex items-center gap-6 mt-auto pt-3 border-t border-border-primary">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLikeToggle}
              className="flex items-center text-text-secondary hover:text-red-500 transition-colors group"
              title={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? (
                <BiSolidHeart className="text-xl text-red-500 group-hover:scale-110 transition-transform" />
              ) : (
                <BiHeart className="text-xl group-hover:scale-110 transition-transform" />
              )}
            </button>
            <button
              onClick={handleLikesCountClick}
              className={`text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'} ${likesCount === 0 ? 'cursor-default no-underline' : 'cursor-pointer'}`}
              disabled={likesCount === 0}
            >
              {likesCount}
            </button>
          </div>
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
        initialMuted={isMuted}
        onMuteChange={setIsMuted}
      />

      <MobileCommentsModal
        isOpen={isMobileCommentsModalOpen}
        onClose={() => setIsMobileCommentsModalOpen(false)}
        post={post}
      />

      <UserListModal
        isOpen={isLikersModalOpen}
        onClose={() => setIsLikersModalOpen(false)}
        users={likers}
        title="Likes"
        onUserClick={handleUserClick}
        isLoading={isLoadingLikers}
      />
    </>
  );
});

Post.displayName = 'Post';

export default Post;
