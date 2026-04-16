import { useState } from 'react';
import {
  BiEdit,
  BiCamera,
  BiInfoCircle,
  BiUserPlus,
  BiCheck,
  BiLoaderAlt,
} from 'react-icons/bi';
import ProfileImageActionModal from './ProfileImageActionModal';
import ProfileImageViewerModal from './ProfileImageViewerModal';
import useImagePicker from '../hooks/useImagePicker';

import {
  DEFAULT_PROFILE_PICTURE,
  DEFAULT_COVER_PHOTO,
} from '../../../utils/constants';

const ProfileTopSection = ({
  userData,
  imageActions,
  onOpenAbout,
  onOpenEdit,
  isOwnProfile,
  onToggleFollow,
  isTogglingFollow,
  onOpenFollowers,
  onOpenFollowing,
}) => {
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    imageUrl: '',
  });

  const handleViewImage = imageUrl => {
    setViewerState({
      isOpen: true,
      imageUrl: imageUrl,
    });
  };

  const closeViewer = () => {
    setViewerState(prev => ({ ...prev, isOpen: false }));
  };

  // Derive boolean props locally to reduce props passed from parent
  const hasCustomProfilePicture =
    Boolean(userData.profilePicture) &&
    userData.profilePicture !== DEFAULT_PROFILE_PICTURE;

  const hasCustomCoverPhoto =
    Boolean(userData.coverPhoto) && userData.coverPhoto !== DEFAULT_COVER_PHOTO;

  // Call the hook for both Avatar and Cover Photo
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
          onClick={
            isOwnProfile
              ? coverPicker.handleClick
              : hasCustomCoverPhoto
                ? () => handleViewImage(userData.coverPhoto)
                : undefined
          }
          className={`block w-full h-full relative ${isOwnProfile || hasCustomCoverPhoto ? 'cursor-pointer' : 'cursor-default'}`}
          aria-label={
            isOwnProfile
              ? 'Update cover picture'
              : hasCustomCoverPhoto
                ? 'View cover picture'
                : 'Cover picture'
          }
        >
          <img
            src={userData.coverPhoto}
            alt="Cover"
            className={`w-full h-full object-cover transition-opacity duration-200 ${isOwnProfile ? 'group-hover:opacity-90' : ''}`}
            draggable="false"
          />
          {isOwnProfile && (
            <>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <BiCamera className="text-white text-4xl sm:text-6xl opacity-40 group-hover:opacity-70 transition-opacity duration-200 drop-shadow-md" />
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20 pointer-events-none"></div>
        </button>
      </div>

      {/* Profile Header (Avatar, Name, Actions) */}
      <div className="px-4 sm:px-12 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-6 min-w-0 text-center sm:text-left w-full sm:w-auto">
            {/* Avatar */}
            <div className="relative group -mt-16 sm:-mt-20 shrink-0">
              <input
                ref={avatarPicker.inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={avatarPicker.handleChange}
              />
              <button
                type="button"
                onClick={
                  isOwnProfile
                    ? avatarPicker.handleClick
                    : hasCustomProfilePicture
                      ? () => handleViewImage(userData.profilePicture)
                      : undefined
                }
                className={`block ${isOwnProfile || hasCustomProfilePicture ? 'cursor-pointer' : 'cursor-default'}`}
                aria-label={
                  isOwnProfile
                    ? 'Update profile picture'
                    : hasCustomProfilePicture
                      ? 'View profile picture'
                      : 'Profile picture'
                }
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-bg-primary overflow-hidden shadow-lg bg-bg-secondary relative">
                  <img
                    src={userData.profilePicture}
                    alt={userData.fullName}
                    className={`w-full h-full object-cover transition-opacity duration-200 ${isOwnProfile ? 'group-hover:opacity-90' : ''}`}
                    draggable="false"
                  />
                  {isOwnProfile && (
                    <>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none"></div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <BiCamera className="text-white text-4xl sm:text-5xl opacity-40 group-hover:opacity-70 transition-opacity duration-200 drop-shadow-md" />
                      </div>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Basic Info */}
            <div className="min-w-0 pt-2 sm:pt-0 sm:pb-3 w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight wrap-break-word">
                {userData.fullName || userData.username}
              </h1>
              <p className="text-brand-primary font-medium text-sm sm:text-base">
                @{userData.username}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 sm:mb-3 gap-3 shrink-0">
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <BiInfoCircle className="text-lg" />
              About
            </button>
            {userData.isFollowedByCurrentUser === null ? (
              <button
                onClick={onOpenEdit}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base bg-bg-secondary text-text-primary font-medium hover:bg-border-primary rounded-full border border-border-primary transition-colors"
              >
                <BiEdit className="text-lg" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onToggleFollow && !isTogglingFollow)
                    onToggleFollow(userData.isFollowedByCurrentUser);
                }}
                disabled={isTogglingFollow}
                className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium rounded-full border transition-all min-w-[110px] sm:min-w-[130px] ${
                  userData.isFollowedByCurrentUser
                    ? 'bg-bg-secondary text-text-primary border-border-primary hover:bg-border-primary'
                    : 'bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary'
                } ${isTogglingFollow ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isTogglingFollow ? (
                  <BiLoaderAlt className="text-lg animate-spin" />
                ) : (
                  <>
                    {userData.isFollowedByCurrentUser ? (
                      <BiCheck className="text-lg" />
                    ) : (
                      <BiUserPlus className="text-lg" />
                    )}
                    <span>
                      {userData.isFollowedByCurrentUser ? 'Following' : 'Follow'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 sm:mt-8 mx-auto px-2 w-full text-center sm:text-left">
          <p className="text-text-primary text-base sm:text-lg leading-relaxed mix-blend-repl">
            {userData.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-8 justify-center mt-6 sm:mt-8 pb-4">
          <div className="text-center px-3 py-2">
            <span className="block text-xl sm:text-2xl font-bold text-text-primary">
              {userData.postsCount.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-text-secondary uppercase tracking-wider font-semibold">
              Posts
            </span>
          </div>

          <div
            className={`text-center px-3 py-2 transition-all duration-200 ${
              userData.followersCount > 0
                ? 'cursor-pointer hover:bg-bg-secondary rounded-xl'
                : ''
            }`}
            onClick={userData.followersCount > 0 ? onOpenFollowers : undefined}
          >
            <span className="block text-xl sm:text-2xl font-bold text-text-primary">
              {userData.followersCount.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-text-secondary uppercase tracking-wider font-semibold">
              Followers
            </span>
          </div>

          <div
            className={`text-center px-3 py-2 transition-all duration-200 ${
              userData.followingCount > 0
                ? 'cursor-pointer hover:bg-bg-secondary rounded-xl'
                : ''
            }`}
            onClick={userData.followingCount > 0 ? onOpenFollowing : undefined}
          >
            <span className="block text-xl sm:text-2xl font-bold text-text-primary">
              {userData.followingCount.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-text-secondary uppercase tracking-wider font-semibold">
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

      <ProfileImageViewerModal
        imageUrl={viewerState.imageUrl}
        isOpen={viewerState.isOpen}
        onClose={closeViewer}
      />
    </div>
  );
};

export default ProfileTopSection;
