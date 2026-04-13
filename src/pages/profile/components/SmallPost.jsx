import { useState } from 'react';
import { BiHeart, BiSolidHeart, BiMessageRounded } from 'react-icons/bi';
import { formatDate } from '../../../utils/helpers';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import postApi from '../../../services/post.service';

const SmallPost = ({ post, userData, innerRef }) => {
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(
    () => post.likedBy?.includes(user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(() => post.likedBy?.length || 0);

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
  return (
    <div
      ref={innerRef}
      className="bg-bg-primary rounded-2xl shadow-sm border border-border-primary p-5 flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${userData.username}`} className="shrink-0">
          <img
            src={userData.profilePicture}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-border-primary hover:opacity-80 transition-opacity"
          />
        </Link>
        <div>
          <p className="font-semibold text-text-primary text-sm">
            <Link
              to={`/profile/${userData.username}`}
              className="hover:underline decoration-text-primary/50"
            >
              {userData.fullName || userData.username}
            </Link>
          </p>
          <p className="text-text-secondary text-xs">
            <Link
              to={`/profile/${userData.username}`}
              className="hover:underline decoration-text-secondary/50"
            >
              @{userData.username}
            </Link>{' '}
            • {formatDate(post.createdAt)}
          </p>
        </div>
      </div>
      {post.caption && (
        <p className="text-text-primary mb-4 text-sm leading-relaxed">
          {post.caption}
        </p>
      )}

      {post.media?.type === 'image' && (
        <div className="mb-4 rounded-xl overflow-hidden bg-bg-secondary w-full">
          <img
            src={post.media.url}
            alt="Post media"
            className="w-full h-full object-cover aspect-video"
          />
        </div>
      )}
      {post.media?.type === 'video' && (
        <div className="mb-4 rounded-xl overflow-hidden bg-black w-full">
          <video
            controls
            src={post.media.url}
            className="w-full h-full object-cover aspect-video"
          />
        </div>
      )}

      <div className="flex items-center gap-6 mt-auto pt-4 border-t border-border-primary">
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
          <span className="text-sm font-medium">
            {post.comments?.length || 0}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SmallPost;
