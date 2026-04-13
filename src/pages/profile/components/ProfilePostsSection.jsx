import {
  BiGridAlt,
  BiImage,
  BiVideo,
} from 'react-icons/bi';
import SmallPost from './SmallPost';

const ProfilePostsSection = ({
  posts,
  userData,
  activeTab,
  onTabChange,
  lastPostElementRef,
  isLoadingPosts,
}) => {
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    const type = post.media?.type;
    if (activeTab === 'photos') return type === 'image';
    if (activeTab === 'videos') return type === 'video';
    return true;
  });

  const getTriggerIndex = () => {
    return Math.max(0, filteredPosts.length - 3);
  };

  return (
    <div className="mt-6 animate-fade-in relative z-10 px-0 sm:px-4">
      {/* Tabs */}
      <div className="flex justify-center gap-8 border-b border-border-primary mb-8 px-4">
        <button
          onClick={() => onTabChange('all')}
          className={`pb-4 font-semibold flex items-center gap-2 transition-colors relative ${activeTab === 'all' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <BiGridAlt className="text-xl" />
          All Posts
          {activeTab === 'all' && (
            <div className="absolute -bottom-px left-0 w-full h-1 bg-brand-primary rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => onTabChange('photos')}
          className={`pb-4 font-semibold flex items-center gap-2 transition-colors relative ${activeTab === 'photos' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <BiImage className="text-xl" />
          Photos
          {activeTab === 'photos' && (
            <div className="absolute -bottom-px left-0 w-full h-1 bg-brand-primary rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => onTabChange('videos')}
          className={`pb-4 font-semibold flex items-center gap-2 transition-colors relative ${activeTab === 'videos' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <BiVideo className="text-xl" />
          Videos
          {activeTab === 'videos' && (
            <div className="absolute -bottom-px left-0 w-full h-1 bg-brand-primary rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Posts Grid */}
      <div
        className={`grid gap-6 ${activeTab === 'all' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2'}`}
      >
        {filteredPosts.map((post, index) => {
          const isTrigger = index === getTriggerIndex();
          return (
            <SmallPost
              key={post.id}
              post={post}
              userData={userData}
              innerRef={isTrigger ? lastPostElementRef : null}
            />
          );
        })}

        {filteredPosts.length === 0 && !isLoadingPosts && (
          <div className="col-span-full py-16 text-center">
            <p className="text-text-secondary text-lg">
              No posts found in this tab.
            </p>
          </div>
        )}
      </div>

      {isLoadingPosts && (
        <div className="w-full py-8 text-center flex justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProfilePostsSection;
