import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { DEFAULT_PROFILE_PICTURE } from '../../utils/constants';

const PostAuthorHeader = ({ post, avatarClassName = 'w-11 h-11' }) => {
  const avatarUrl = post.user?.avatar?.url || DEFAULT_PROFILE_PICTURE;

  return (
    <div>
      <div className="flex items-center gap-3 min-w-0 mb-3">
        <Link
          to={`/profile/${post.user?.username || 'unknown'}`}
          className="shrink-0"
        >
          <img
            src={avatarUrl}
            alt={`${post.user?.fullName || post.user?.username || 'User'} avatar`}
            className={`${avatarClassName} rounded-full object-cover border border-border-primary hover:opacity-80 transition-opacity`}
            draggable="false"
          />
        </Link>

        <div className="min-w-0">
          <p className="font-semibold text-text-primary text-sm truncate">
            <Link
              to={`/profile/${post.user?.username || 'unknown'}`}
              className="hover:underline decoration-text-primary/50"
            >
              {post.user?.fullName || post.user?.username || 'Unknown User'}
            </Link>
          </p>
          <p className="text-text-secondary text-xs truncate">
            <Link
              to={`/profile/${post.user?.username || 'unknown'}`}
              className="hover:underline decoration-text-secondary/50"
            >
              @{post.user?.username || 'unknown'}
            </Link>
            • {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      {post.caption && (
        <p className="text-text-primary mb-3 text-sm leading-relaxed whitespace-pre-wrap">
          {post.caption}
        </p>
      )}
    </div>
  );
};

export default PostAuthorHeader;
