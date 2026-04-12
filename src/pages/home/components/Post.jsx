import { forwardRef } from 'react';
import { BiHeart, BiMessageRounded } from 'react-icons/bi';
import { formatDate } from '../../../utils/helpers';

const Post = forwardRef(({ post }, ref) => {
  const likesCount = post.likedBy ? post.likedBy.length : 0;
  const commentsCount = 0; // Currently 0 based on requirement

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
      className="bg-bg-primary rounded-xl sm:rounded-2xl shadow-sm border border-border-primary p-4 sm:p-5 flex flex-col w-full sm:w-[500px] md:w-[600px] mx-auto max-h-[850px] overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-3">
        {post.user?.avatar?.url ? (
          <img
            src={post.user.avatar.url}
            alt={`${post.user.fullName} avatar`}
            className="w-11 h-11 rounded-full object-cover border border-border-primary"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-bg-secondary border border-border-primary flex items-center justify-center">
            <span className="text-text-secondary font-semibold">
              {post.user?.fullName?.charAt(0) ||
                post.user?.username?.charAt(0) ||
                '?'}
            </span>
          </div>
        )}

        <div>
          <p className="font-semibold text-text-primary text-sm">
            {post.user?.fullName || 'Unknown User'}
          </p>
          <p className="text-text-secondary text-xs">
            @{post.user?.username || 'unknown'} • {formatDate(post.createdAt)}
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
            className="w-full h-auto max-h-[60vh] md:max-h-[400px] object-contain"
          />
        </div>
      )}

      {mediaType === 'video' && post.media?.url && (
        <div className="mb-3 rounded-xl overflow-hidden bg-black w-full flex justify-center">
          <video
            controls
            src={post.media.url}
            className="w-full h-auto max-h-[60vh] md:max-h-[400px] object-contain"
          />
        </div>
      )}

      <div className="flex items-center gap-6 mt-auto pt-3 border-t border-border-primary">
        <button className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group">
          <BiHeart className="text-xl group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{likesCount}</span>
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
