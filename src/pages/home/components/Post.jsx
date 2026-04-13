import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHeart, BiSolidHeart, BiMessageRounded } from 'react-icons/bi';
import { formatDate } from '../../../utils/helpers';
import { useAuth } from '../../../context/AuthContext';
import postApi from '../../../services/post.service';

const Post = forwardRef(({ post }, ref) => {
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(
    () => post.likedBy?.includes(user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(() => post.likedBy?.length || 0);

  const commentsCount = post.comments?.length || 0;

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

  return (
    <article
      ref={ref}
      className="bg-bg-primary rounded-xl sm:rounded-2xl shadow-sm border border-border-primary p-4 sm:p-5 flex flex-col w-full sm:w-125 md:w-150 mx-auto max-h-212.5 overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-3">
        <Link
          to={`/profile/${post.user?.username || 'unknown'}`}
          className="shrink-0"
        >
          {post.user?.avatar?.url ? (
            <img
              src={post.user.avatar.url}
              alt={`${post.user.fullName} avatar`}
              className="w-11 h-11 rounded-full object-cover border border-border-primary hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-bg-secondary border border-border-primary flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-text-secondary font-semibold">
                {post.user?.fullName?.charAt(0) ||
                  post.user?.username?.charAt(0) ||
                  '?'}
              </span>
            </div>
          )}
        </Link>

        <div>
          <p className="font-semibold text-text-primary text-sm">
            <Link
              to={`/profile/${post.user?.username || 'unknown'}`}
              className="hover:underline decoration-text-primary/50"
            >
              {post.user?.fullName || 'Unknown User'}
            </Link>
          </p>
          <p className="text-text-secondary text-xs">
            <Link
              to={`/profile/${post.user?.username || 'unknown'}`}
              className="hover:underline decoration-text-secondary/50"
            >
              @{post.user?.username || 'unknown'}
            </Link>{' '}
            • {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      {post.caption && (
        <p className="text-text-primary mb-3 text-sm leading-relaxed whitespace-pre-wrap">
          {post.caption}
        </p>
      )}

      {mediaType === 'image' && post.media?.url && (
        <div className="mb-3 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 w-full flex justify-center">
          <img
            src={post.media.url}
            alt="Post media"
            className="w-full h-auto max-h-[60vh] md:max-h-100 object-contain"
          />
        </div>
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
        <button className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group">
          <BiMessageRounded className="text-xl group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{commentsCount}</span>
        </button>
      </div>
    </article>
  );
});

Post.displayName = 'Post';

export default Post;
