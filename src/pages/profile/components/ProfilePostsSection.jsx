import {
  BiHeart,
  BiMessageRounded,
  BiGridAlt,
  BiImage,
  BiVideo,
} from 'react-icons/bi';

const ProfilePostsSection = ({ posts, userData, activeTab, onTabChange }) => {
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'photos') return post.type === 'photo';
    if (activeTab === 'videos') return post.type === 'video';
    return true;
  });

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
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-bg-primary rounded-2xl shadow-sm border border-border-primary p-5 flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={userData.profilePicture}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-border-primary"
              />
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {userData.fullName}
                </p>
                <p className="text-text-secondary text-xs">{post.timestamp}</p>
              </div>
            </div>
            {post.content && (
              <p className="text-text-primary mb-4 text-sm leading-relaxed">
                {post.content}
              </p>
            )}

            {post.type === 'photo' && (
              <div className="mb-4 rounded-xl overflow-hidden bg-bg-secondary w-full">
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  className="w-full h-full object-cover aspect-video"
                />
              </div>
            )}
            {post.type === 'video' && (
              <div className="mb-4 rounded-xl overflow-hidden bg-black w-full">
                <video
                  controls
                  src={post.mediaUrl}
                  className="w-full h-full object-cover aspect-video"
                />
              </div>
            )}

            <div className="flex items-center gap-6 mt-auto pt-4 border-t border-border-primary">
              <button className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group">
                <BiHeart className="text-xl group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors group">
                <BiMessageRounded className="text-xl group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{post.comments}</span>
              </button>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-text-secondary text-lg">
              No posts found in this tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePostsSection;
