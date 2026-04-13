import React, { useState, useRef, useCallback } from 'react';
import ProfileTopSection from './components/ProfileTopSection';
import ProfilePostsSection from './components/ProfilePostsSection';
import ProfileAboutModal from './components/ProfileAboutModal';
import ProfileEditModal from './components/ProfileEditModal';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useProfileData from './hooks/useProfileData';
import useProfilePosts from './hooks/useProfilePosts';
import {
  DEFAULT_PROFILE_PICTURE,
  DEFAULT_COVER_PHOTO,
} from '../../utils/constants';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { userData, isFetching, isUploadingImage, actions } = useProfileData();
  const {
    posts,
    setPage,
    hasMore,
    isLoading: isLoadingPosts,
  } = useProfilePosts();

  const isOwnProfile = user?.username === username;

  // UI State
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const observer = useRef();
  const lastPostElementRef = useCallback(
    node => {
      if (isLoadingPosts) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingPosts, hasMore, setPage]
  );

  if (isFetching || !userData) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const resolvedUserData = {
    ...userData,
    profilePicture: userData.profilePicture || DEFAULT_PROFILE_PICTURE,
    coverPhoto: userData.coverPhoto || DEFAULT_COVER_PHOTO,
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 animate-fade-in relative">
      {isUploadingImage && (
        <div className="absolute top-4 right-4 bg-brand-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50 shadow-lg animate-pulse">
          Saving changes...
        </div>
      )}

      <ProfileTopSection
        userData={resolvedUserData}
        isOwnProfile={isOwnProfile}
        loggedInUserId={user?.id}
        onToggleFollow={actions.handleToggleFollow}
        imageActions={{
          onChange: actions.handleImageChange,
          onRemoveProfilePicture: actions.handleRemoveProfilePicture,
          onRemoveCoverPhoto: actions.handleRemoveCoverPhoto,
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEdit={() => setIsEditOpen(true)}
      />

      <ProfilePostsSection
        posts={posts}
        userData={resolvedUserData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lastPostElementRef={lastPostElementRef}
        isLoadingPosts={isLoadingPosts}
      />

      <ProfileAboutModal
        isOpen={isAboutOpen}
        userData={resolvedUserData}
        onClose={() => setIsAboutOpen(false)}
      />

      <ProfileEditModal
        isOpen={isEditOpen}
        userData={resolvedUserData}
        onClose={() => setIsEditOpen(false)}
        onUpdateSuccess={actions.handleProfileUpdateSuccess}
      />
    </div>
  );
};

export default Profile;
