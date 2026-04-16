import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { BiLoaderAlt, BiMessageRounded, BiX, BiSend } from 'react-icons/bi';
import PostAuthorHeader from './PostAuthorHeader';
import PostComments from './PostComments';
import postApi from '../../services/post.service';
import { useAuth } from '../../context/AuthContext';
import useScrollLock from '../../hooks/useScrollLock';

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

const MobileCommentsModal = ({ isOpen, onClose, post }) => {
  useScrollLock(isOpen);
  const commentsScrollRef = useRef(null);
  const commentsObserverRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const openedPath = useRef(location.pathname);
  const onCloseRef = useRef(onClose);

  // Keep the ref updated with the latest onClose callback
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle mobile back button to close modal
  useEffect(() => {
    if (!isOpen) return;

    // Record the current path when modal opens
    openedPath.current = window.location.pathname;

    // Push state when modal opens to intercept back button
    // We use a specific key to track if we added this entry
    if (!window.history.state?.isCommentsModalActive) {
      window.history.pushState({ isCommentsModalActive: true }, '');
    }

    const handlePopState = () => {
      // Close modal when user hits 'back'
      onCloseRef.current?.();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // If closing via UI (not popstate) AND we are still on the same page,
      // we pop the dummy state to keep history clean.
      // If we've navigated away (e.g., clicking a user profile link), 
      // we must NOT call history.back() as it would revert the navigation.
      if (
        window.history.state?.isCommentsModalActive &&
        window.location.pathname === openedPath.current
      ) {
        window.history.back();
      }
    };
  }, [isOpen]);

  // Gesture State
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const isDragging = dragOffset > 0;

  const handleTouchStart = e => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = e => {
    const currentY = e.targetTouches[0].clientY;
    const delta = currentY - touchStartY;
    // Only allow dragging downwards
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const handleTouchEnd = () => {
    // If dragged more than 100px, close the modal
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
  };

  useEffect(() => {
    if (!isOpen || !post?.id) return undefined;

    let isActive = true;

    setComments([]);
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
        setHasMoreComments(fetchedComments.length === COMMENTS_PAGE_SIZE);
      } catch (error) {
        console.error('Failed to fetch mobile post comments', error);
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

        setHasMoreComments(fetchedComments.length === COMMENTS_PAGE_SIZE);
      } catch (error) {
        console.error('Failed to fetch more mobile comments', error);
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

  const handleAddComment = async e => {
    e.preventDefault();
    const trimmedComment = commentText.trim();
    if (!trimmedComment || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await postApi.addComment(post.id, trimmedComment);
      const newCommentData =
        response.data?.comment || response.data?.data?.comment;

      if (newCommentData) {
        const enrichedComment = {
          ...newCommentData,
          user,
          isLikedByCurrentUser: false,
          likesCount: 0,
        };

        setComments(prev => [enrichedComment, ...prev]);
        setCommentText('');

        if (commentsScrollRef.current) {
          commentsScrollRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    } catch (error) {
      console.error('Failed to add mobile comment', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!isOpen || !post) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-60 bg-black/60 flex items-end sm:items-center sm:justify-center transition-opacity duration-300 ${isDragging ? 'opacity-90' : 'opacity-100'}`}
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full h-dvh sm:h-200 sm:max-w-md bg-bg-primary rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${dragOffset}px)`,
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col items-center pt-3 pb-3 border-b border-border-primary shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-text-secondary/40 rounded-full mb-3"></div>

          <div className="w-full px-4 grid grid-cols-3 items-center">
            <div />
            <h1 className="text-sm font-bold text-text-primary tracking-wide text-center">
              Comments
            </h1>
            <div />
          </div>
        </div>

        <div
          ref={commentsScrollRef}
          className={`flex-1 overflow-y-auto p-4 ${comments.length === 0 ? 'flex flex-col items-center justify-center' : 'space-y-4'}`}
        >
          {isLoadingComments && comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-text-secondary">
              <BiLoaderAlt className="text-2xl animate-spin" />
              <p className="text-sm">Fetching comments...</p>
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
                const isTrigger = index === Math.max(0, comments.length - 3);

                return (
                  <PostComments
                    key={comment.id}
                    comment={comment}
                    innerRef={isTrigger ? lastCommentElementRef : null}
                  />
                );
              })}

              {isLoadingComments && (
                <div className="flex justify-center py-4 text-text-secondary">
                  <BiLoaderAlt className="text-xl animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-border-primary p-3 bg-bg-primary shrink-0">
          <form onSubmit={handleAddComment} className="flex items-center gap-3">
            <img
              src={user?.avatar?.url}
              alt="Your avatar"
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-border-primary"
              draggable="false"
            />

            <div className="flex-1 bg-bg-secondary rounded-full flex items-center px-4 py-2.5 border border-border-primary/70">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={'Add a comment'}
                className="bg-transparent text-sm text-text-primary placeholder-text-secondary outline-none w-full"
                disabled={isSubmittingComment}
              />
            </div>

            <button
              type="submit"
              className="p-2 text-brand-primary rounded-full hover:bg-bg-secondary disabled:opacity-50 transition-colors"
              disabled={!commentText.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? (
                <BiLoaderAlt className="text-xl animate-spin" />
              ) : (
                <BiSend className="text-xl" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileCommentsModal;
