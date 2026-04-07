import { BiEdit, BiCamera, BiInfoCircle } from 'react-icons/bi';
import ProfileImageActionModal from './ProfileImageActionModal';
import useImagePicker from '../hooks/useImagePicker';

// Extracted constants for local state derivation
const DEFAULT_PROFILE_PICTURE =
  'https://res.cloudinary.com/dl8c40ppg/image/upload/v1775503611/zbj6efjrtmly4wfqe0tg.jpg';
const DEFAULT_COVER_PHOTO =
  'https://placehold.co/2000x600/e2e8f0/64748b?text=Cover+Photo';

const ProfileTopSection = ({
  userData,
  imageActions,
  onOpenAbout,
  onOpenEdit,
}) => {
  // 2. Derive boolean props locally to reduce props passed from parent
  const hasCustomProfilePicture =
    Boolean(userData.profilePicture) &&
    userData.profilePicture !== DEFAULT_PROFILE_PICTURE;

  const hasCustomCoverPhoto =
    Boolean(userData.coverPhoto) && userData.coverPhoto !== DEFAULT_COVER_PHOTO;

  // 3. Call the hook for both Avatar and Cover Photo
  const avatarPicker = useImagePicker(
    hasCustomProfilePicture,
    imageActions.onChange,
    imageActions.onRemoveProfilePicture,
    'profilePicture'
  );

  const coverPicker = useImagePicker(
    hasCustomCoverPhoto,
    imageActions.onChange,
    imageActions.onRemoveCoverPhoto,
    'coverPhoto'
  );

  return (
    <div className="flex flex-col">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 w-full rounded-b-3xl overflow-hidden shadow-sm group">
        <input
          ref={coverPicker.inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={coverPicker.handleChange}
        />
        <button
          type="button"
          onClick={coverPicker.handleClick}
          className="cursor-pointer block w-full h-full relative"
          aria-label="Update cover picture"
        >
          <img
            src={userData.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <BiCamera className="text-white text-6xl opacity-40 group-hover:opacity-70 transition-opacity duration-200 drop-shadow-md" />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20 pointer-events-none"></div>
        </button>
      </div>

      {/* Profile Header (Avatar, Name, Actions) */}
      <div className="px-6 sm:px-12 -mt-10 sm:-mt-12 relative z-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className="relative group">
              <input
                ref={avatarPicker.inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={avatarPicker.handleChange}
              />
              <button
                type="button"
                onClick={avatarPicker.handleClick}
                className="cursor-pointer block"
                aria-label="Update profile picture"
              >
                <div className="w-40 h-40 rounded-full border-4 border-bg-primary overflow-hidden shadow-lg bg-bg-secondary relative">
                  <img
                    src={userData.profilePicture}
                    alt={userData.fullName}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <BiCamera className="text-white text-5xl opacity-40 group-hover:opacity-70 transition-opacity duration-200 drop-shadow-md" />
                  </div>
                </div>
              </button>
            </div>

            {/* Basic Info */}
            <div className="min-w-0 pt-5 sm:pt-6">
              <h1 className="text-3xl font-bold text-text-primary">
                {userData.fullName}
              </h1>
              <p className="text-brand-primary font-medium">
                @{userData.username}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center mt-5 sm:mt-6 mb-2 gap-3 shrink-0">
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <BiInfoCircle className="text-lg" />
              About
            </button>
            <button
              onClick={onOpenEdit} // <-- Add onClick handler
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-secondary text-text-primary font-medium hover:bg-border-primary rounded-full border border-border-primary transition-colors" // <-- Update styling to make it look active
            >
              <BiEdit className="text-lg" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 mx-auto px-2 w-full">
          <p className="text-text-primary text-lg leading-relaxed mix-blend-repl">
            {userData.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 justify-center mt-6 pb-2">
          <div className="text-center">
            <span className="block text-2xl font-bold text-text-primary">
              {userData.postsCount.toLocaleString()}
            </span>
            <span className="text-sm text-text-secondary uppercase tracking-wider font-semibold">
              Posts
            </span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-text-primary">
              {userData.followersCount.toLocaleString()}
            </span>
            <span className="text-sm text-text-secondary uppercase tracking-wider font-semibold">
              Followers
            </span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-text-primary">
              {userData.followingCount.toLocaleString()}
            </span>
            <span className="text-sm text-text-secondary uppercase tracking-wider font-semibold">
              Following
            </span>
          </div>
        </div>
      </div>

      {/* Render Modals using Hook state */}
      <ProfileImageActionModal
        isOpen={avatarPicker.isMenuOpen}
        onClose={avatarPicker.closeMenu}
        onChange={avatarPicker.openPicker}
        onRemove={avatarPicker.handleRemove}
        changeLabel="Change Profile Picture"
        removeLabel="Remove Profile Picture"
      />

      <ProfileImageActionModal
        isOpen={coverPicker.isMenuOpen}
        onClose={coverPicker.closeMenu}
        onChange={coverPicker.openPicker}
        onRemove={coverPicker.handleRemove}
        changeLabel="Change Cover Picture"
        removeLabel="Remove Cover Picture"
      />
    </div>
  );
};

export default ProfileTopSection;
