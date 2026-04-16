import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BiHeart,
  BiSolidHeart,
  BiMessageRounded,
  BiX,
  BiPlayCircle,
  BiPauseCircle,
  BiVolumeMute,
  BiVolumeFull,
} from 'react-icons/bi';
import PostAuthorHeader from './PostAuthorHeader';
import PostComments from './PostComments';
import postApi from '../../services/post.service';
import { useAuth } from '../../context/AuthContext';
import useScrollLock from '../../hooks/useScrollLock';
import { useNavigate } from 'react-router-dom';
import UserListModal from '../UserListModal';

const COMMENTS_PAGE_SIZE = 10;

const normalizeCommentsPayload = response => {
  const primary = response?.data;

  if (
    Array.isArray(primary?.comments) ||
    typeof primary?.commentsCount === 'number'
  ) {
    return primary;
  }

  return primary?.data || {};
};

const PostModal = ({
  isOpen,
  onClose,
  post,
  isLiked,
  likesCount,
  onToggleLike,
  initialMuted,
  onMuteChange,
}) => {
  useScrollLock(isOpen);
  const commentsScrollRef = useRef(null);
  const commentsObserverRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { user } = useAuth();
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [likers, setLikers] = useState([]);
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMuted(initialMuted ?? true);
    }
  }, [isOpen, initialMuted]);

  useEffect(() => {
    if (!isOpen || !post?.id) return undefined;

    let isActive = true;

    setComments([]);
    setCommentsCount(post?.commentsCount ?? 0);
    setCommentsPage(1);
    setHasMoreComments(true);

    const fetchInitialComments = async () => {
      setIsLoadingComments(true);
      try {
        const response = await postApi.getCommentsByPostId(
          post.id,
          1,
          COMMENTS_PAGE_SIZE
        );

        if (!isActive) return;

        const payload = normalizeCommentsPayload(response);
        const fetchedComments = payload.comments || [];

        setComments(fetchedComments);
        setCommentsCount(payload.commentsCount ?? fetchedComments.length);
        setHasMoreComments(fetchedComments.length === COMMENTS_PAGE_SIZE);
      } catch (error) {
        console.error('Failed to fetch post comments', error);
      } finally {
        if (isActive) setIsLoadingComments(false);
      }
    };

    fetchInitialComments();

    return () => {
      isActive = false;
    };
  }, [isOpen, post?.id, post?.commentsCount]);

  useEffect(() => {
    if (!isOpen || !post?.id || commentsPage === 1) return undefined;

    let isActive = true;

    const fetchMoreComments = async () => {
      setIsLoadingComments(true);
      try {
        const response = await postApi.getCommentsByPostId(
          post.id,
          commentsPage,
          COMMENTS_PAGE_SIZE
        );

        if (!isActive) return;

        const payload = normalizeCommentsPayload(response);
        const fetchedComments = payload.comments || [];

        setComments(prevComments => {
          const existingIds = new Set(prevComments.map(comment => comment.id));
          const uniqueComments = fetchedComments.filter(
            comment => !existingIds.has(comment.id)
          );

          return [...prevComments, ...uniqueComments];
        });

        setCommentsCount(payload.commentsCount ?? post?.commentsCount ?? 0);
        setHasMoreComments(fetchedComments.length === COMMENTS_PAGE_SIZE);
      } catch (error) {
        console.error('Failed to fetch more post comments', error);
      } finally {
        if (isActive) setIsLoadingComments(false);
      }
    };

    fetchMoreComments();

    return () => {
      isActive = false;
    };
  }, [commentsPage, isOpen, post?.commentsCount, post?.id]);

  const lastCommentElementRef = useCallback(
    node => {
      if (isLoadingComments) return;
      if (commentsObserverRef.current) commentsObserverRef.current.disconnect();

      commentsObserverRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMoreComments) {
            setCommentsPage(prevPage => prevPage + 1);
          }
        },
        {
          root: commentsScrollRef.current,
          threshold: 0.1,
        }
      );

      if (node) commentsObserverRef.current.observe(node);
    },
    [hasMoreComments, isLoadingComments]
  );

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
    onClose();
    navigate(`/profile/${targetUser.username}`);
  };

  const handleAddComment = async e => {
    e.preventDefault();
    const trimmedComment = commentText.trim();
    if (!trimmedComment || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await postApi.addComment(post.id, trimmedComment);

      // Extract comment from response based on the provided schema
      // Response structure: response.data.data.comment or response.data.comment
      const newCommentData =
        response.data?.comment || response.data?.data?.comment;

      if (newCommentData) {
        // Construct the comment object with current user info for immediate display
        const enrichedComment = {
          ...newCommentData,
          user: user,
          isLikedByCurrentUser: false,
          likesCount: 0,
        };

        setComments(prev => [enrichedComment, ...prev]);
        setCommentsCount(prev => prev + 1);
        setCommentText('');

        // Smooth scroll to the top to see the new comment
        setTimeout(() => {
          if (commentsScrollRef.current) {
            commentsScrollRef.current.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const toggleVideoPlay = e => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const hasMedia = Boolean(post.media?.url);
  const modalWidthClass = hasMedia
    ? 'w-[90vw] max-w-7xl'
    : 'w-[45vw] max-w-3xl';

  if (!isOpen || !post) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <div
          className={`bg-bg-primary ${modalWidthClass} h-[90vh] rounded-2xl overflow-hidden border border-border-primary shadow-2xl flex`}
          onClick={e => e.stopPropagation()}
        >
          {hasMedia && (
            <div className="w-1/2 bg-bg-secondary dark:bg-bg-primary flex items-center justify-center relative overflow-hidden group/video">
              {post.media.type === 'video' ||
              post.media.url.match(/\.(mp4|webm|ogg)$/i) ? (
                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={toggleVideoPlay}
                >
                  <video
                    ref={videoRef}
                    src={post.media.url}
                    className="w-full h-full object-contain"
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
                        size={80}
                      />
                    ) : (
                      <BiPlayCircle
                        className="text-white drop-shadow-2xl"
                        size={80}
                      />
                    )}
                  </div>

                  {/* Mute/Unmute Button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const newMuted = !isMuted;
                      setIsMuted(newMuted);
                      onMuteChange?.(newMuted);
                    }}
                    className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all z-20 group/mute shadow-lg"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <BiVolumeMute className="text-2xl" />
                    ) : (
                      <BiVolumeFull className="text-2xl" />
                    )}
                  </button>
                </div>
              ) : (
                <img
                  src={post.media.url}
                  alt="Post media"
                  className="w-full h-full object-contain"
                  draggable="false"
                />
              )}
            </div>
          )}

          <div className={`${hasMedia ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <div className="flex items-start justify-between gap-3 px-4 pt-4 border-b border-border-primary">
              <PostAuthorHeader post={post} avatarClassName="w-10 h-10" />
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-bg-secondary text-text-secondary"
              >
                <BiX className="text-2xl" />
              </button>
            </div>

            <div
              ref={commentsScrollRef}
              className={`flex-1 overflow-y-auto p-4 ${comments.length === 0 ? 'flex flex-col items-center justify-center' : 'space-y-4'}`}
            >
              {isLoadingComments && comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                  <p className="text-text-secondary text-sm font-medium animate-pulse">
                    Fetching comments...
                  </p>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                  <div className="p-4 bg-bg-secondary rounded-full">
                    <BiMessageRounded className="text-4xl text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-text-primary font-bold text-lg">
                      No comments yet
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Be the first one to comment
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {comments.map((comment, index) => {
                    const isTrigger =
                      index === Math.max(0, comments.length - 3);

                    return (
                      <PostComments
                        key={comment.id}
                        comment={comment}
                        innerRef={isTrigger ? lastCommentElementRef : null}
                      />
                    );
                  })}

                  {isLoadingComments && (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-border-primary p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleLike}
                    className="flex items-center text-text-secondary hover:text-red-500 transition-colors"
                  >
                    {isLiked ? (
                      <BiSolidHeart className="text-2xl text-red-500" />
                    ) : (
                      <BiHeart className="text-2xl" />
                    )}
                  </button>
                  <button
                    onClick={handleLikesCountClick}
                    className={`text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'} ${likesCount === 0 ? 'cursor-default' : 'cursor-pointer'}`}
                    disabled={likesCount === 0}
                  >
                    {likesCount}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-text-secondary">
                  <BiMessageRounded className="text-2xl" />
                  <span className="text-sm font-medium">{commentsCount}</span>
                </div>
              </div>

              <form
                onSubmit={handleAddComment}
                className="flex items-center gap-3 mt-3 border-t border-border-primary pt-3"
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none"
                  disabled={isSubmittingComment}
                />
                <button
                  type="submit"
                  className="text-brand-primary font-semibold text-sm disabled:opacity-50 min-w-10"
                  disabled={!commentText.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? '...' : 'Post'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <UserListModal
        isOpen={isLikersModalOpen}
        onClose={() => setIsLikersModalOpen(false)}
        users={likers}
        title="Likes"
        onUserClick={handleUserClick}
        isLoading={isLoadingLikers}
      />
    </>,
    document.body
  );
};

export default PostModal;
