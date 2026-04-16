import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { formatDate } from '../../utils/helpers';
import { DEFAULT_PROFILE_PICTURE } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import commentApi from '../../services/comment.service';

const PostComments = ({ comment, innerRef }) => {
  const [isLiked, setIsLiked] = useState(
    comment?.isLikedByCurrentUser ?? false
  );
  const [likesCount, setLikesCount] = useState(comment?.likesCount ?? 0);
  const { user } = useAuth();

  const avatarUrl = comment.user?.avatar?.url || DEFAULT_PROFILE_PICTURE;
  const username = comment.user?.username || 'unknown';
  const fullName = comment.user?.fullName || username || 'Unknown User';
  const profilePath = `/profile/${username}`;
  const commentText = comment.content || '';

  const handleLikeToggle = async () => {
    if (!user) return;

    const previousLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(prev => (previousLiked ? Math.max(0, prev - 1) : prev + 1));

    try {
      if (previousLiked) {
        await commentApi.unlikeComment(comment.id);
      } else {
        await commentApi.likeComment(comment.id);
      }
    } catch (error) {
      console.error('Failed to toggle like on comment', error);
      setIsLiked(previousLiked);
      setLikesCount(previousLikesCount);
    }
  };

  return (
    <div ref={innerRef} className="flex items-start gap-3">
      <Link to={profilePath} className="shrink-0">
        <img
          src={avatarUrl}
          alt={`${fullName} avatar`}
          className="w-8 h-8 rounded-full object-cover border border-border-primary hover:opacity-80 transition-opacity"
          draggable="false"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-text-primary font-semibold truncate">
              <Link
                to={profilePath}
                className="hover:underline decoration-text-primary/50"
              >
                {fullName}
              </Link>
            </p>
            <p className="text-xs text-text-secondary truncate">
              <Link
                to={profilePath}
                className="hover:underline decoration-text-secondary/50"
              >
                @{username}
              </Link>{' '}
              • {formatDate(comment.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLikeToggle}
            className={`flex flex-col items-center gap-1 shrink-0 transition-colors ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
          >
            {isLiked ? (
              <BiSolidHeart className="text-lg" />
            ) : (
              <BiHeart className="text-lg" />
            )}
            <span className="text-xs font-medium">{likesCount}</span>
          </button>
        </div>

        {commentText && (
          <p className="text-sm text-text-primary wrap-break-word mt-1 whitespace-pre-wrap">
            {commentText}
          </p>
        )}
      </div>
    </div>
  );
};

export default PostComments;
